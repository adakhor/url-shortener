import { redisClient } from "../database/redis.js";

const URL_CACHE_TTL = 60 * 60;

function getCacheKey(shortCode: string): string {
  return `url:${shortCode}`;
}

export async function getCachedUrl(
  shortCode: string,
): Promise<string | null> {
  const cachedUrl = await redisClient.get(getCacheKey(shortCode));

  console.log(
    cachedUrl
      ? `[cache] HIT ${shortCode}`
      : `[cache] MISS ${shortCode}`,
  );

  return cachedUrl;
}

export async function cacheUrl(
  shortCode: string,
  originalUrl: string,
): Promise<void> {
  // Сохраняем URL только на 1 час: PostgreSQL остаётся постоянным
  // хранилищем, а Redis используется только как временный кэш.
  await redisClient.set(getCacheKey(shortCode), originalUrl, {
    EX: URL_CACHE_TTL,
  });
}