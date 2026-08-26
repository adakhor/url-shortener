import request from "supertest";
import { app } from "../src/app.js";
import { pool } from "../src/database/pool.js";

afterAll(async () => {
  // Закрываем PostgreSQL connections после тестов,
  // чтобы Jest мог корректно завершить процесс.
  await pool.end();
});

describe("GET /api/stats/:shortCode", () => {
  it("returns 404 for an unknown short code", async () => {
    const response = await request(app)
      .get("/api/stats/does-not-exist");

    expect(response.status).toBe(404);

    expect(response.body).toEqual({
      error: "Short URL not found",
    });
  });
});