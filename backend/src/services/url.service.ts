import {
  createUrl,
  findUrlByShortCode,
  incrementClicks,
} from "../repositories/url.repository.js";
import { generateShortCode } from "../utils/short-code.js";

const MAX_ATTEMPTS = 5;

export async function shortenUrl(originalUrl: string) {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const shortCode = generateShortCode();

    try {
      return await createUrl(shortCode, originalUrl);
    } catch (error: unknown) {
      // PostgreSQL error code 23505 означает нарушение UNIQUE constraint.
      // В нашем случае это может быть занятый shortCode, поэтому
      // генерируем новый код и повторяем INSERT.
      if (isUniqueViolation(error)) {
        continue;
      }

      // Любая другая ошибка БД не связана с коллизией —
      // её нельзя молча игнорировать.
      throw error;
    }
  }

  throw new Error("Failed to generate a unique short code");
}

function isUniqueViolation(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  return "code" in error && error.code === "23505";
}

export async function resolveShortUrl(shortCode: string) {
  const url = await findUrlByShortCode(shortCode);

  if (!url) {
    return null;
  }

  await incrementClicks(shortCode);

  return url;
}