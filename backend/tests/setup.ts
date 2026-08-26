// tests/setup.ts

import { redisClient } from "../src/database/redis.js";
import { pool } from "../src/database/pool.js";

beforeAll(async () => {
  // Все тесты используют общие подключения к PostgreSQL и Redis.
  // Подключаем их перед выполнением test suite.
  await pool.query("SELECT 1");

  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
});