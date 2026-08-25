import { createUrl } from "../repositories/url.repository.js";

export async function shortenUrl(originalUrl: string) {
  const shortCode = Math.random()
    .toString(36)
    .slice(2, 8);

  const url = await createUrl(shortCode, originalUrl);

  return url;
}