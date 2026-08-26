import request from "supertest";
import { app } from "../src/app.js";
import { pool } from "../src/database/pool.js";

let createdShortCode: string | undefined;

afterAll(async () => {
  // Удаляем созданную тестом ссылку, чтобы тестовая запись
  // не оставалась в нашей локальной базе после завершения тестов.
  if (createdShortCode) {
    await pool.query(
      "DELETE FROM urls WHERE short_code = $1",
      [createdShortCode],
    );
  }
});

describe("POST /api/shorten", () => {
  it("creates a short URL for a valid HTTP URL", async () => {
    const response = await request(app)
      .post("/api/shorten")
      .send({
        originalUrl: "https://example.com",
      });

    expect(response.status).toBe(201);

    expect(response.body.shortCode).toMatch(/^[A-Za-z0-9]{6}$/);

    expect(response.body.shortUrl).toBe(
      `http://localhost:3000/${response.body.shortCode}`,
    );

    createdShortCode = response.body.shortCode;
  });

  it("returns 400 for an invalid URL", async () => {
    const response = await request(app)
      .post("/api/shorten")
      .send({
        originalUrl: "hello",
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid URL");
  });
});