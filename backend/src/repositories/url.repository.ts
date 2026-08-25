import { pool } from "../database/pool.js";

export async function createUrl(
  shortCode: string,
  originalUrl: string,
) {
  const result = await pool.query(
    `
      INSERT INTO urls (short_code, original_url)
      VALUES ($1, $2)
      RETURNING *
    `,
    [shortCode, originalUrl],
  );

  return result.rows[0];
}