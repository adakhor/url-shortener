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

export async function findUrlByShortCode(shortCode: string) {
  const result = await pool.query(
    `
      SELECT *
      FROM urls
      WHERE short_code = $1
    `,
    [shortCode],
  );

  return result.rows[0];
}

export async function incrementClicks(shortCode: string) {
  await pool.query(
    `
      UPDATE urls
      SET clicks = clicks + 1
      WHERE short_code = $1
    `,
    [shortCode],
  );
}