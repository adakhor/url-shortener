import {
  createUrl,
  findUrlByShortCode,
  incrementClicks,
} from "../repositories/url.repository.js";
import { generateShortCode } from "../utils/short-code.js";
import {
  getCachedUrl,
  cacheUrl,
} from "./cache.service.js";

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
  const cachedUrl = await getCachedUrl(shortCode);

  if (cachedUrl) {
    // URL уже есть в Redis, поэтому PostgreSQL не нужен
    // для поиска originalUrl. Но clicks всё равно храним
    // в PostgreSQL, чтобы статистика оставалась постоянной.
    await incrementClicks(shortCode);

    return {
      original_url: cachedUrl,
    };
  }

  const url = await findUrlByShortCode(shortCode);

  if (!url) {
    return null;
  }

  // Первый запрос: получили URL из PostgreSQL и положили
  // его в Redis на один час для последующих запросов.
  await cacheUrl(shortCode, url.original_url);

  await incrementClicks(shortCode);

  return url;
}

export async function getUrlStats(shortCode: string) {
  return findUrlByShortCode(shortCode);
}