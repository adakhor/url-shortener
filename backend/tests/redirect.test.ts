import request from "supertest";
import { app } from "../src/app.js";
import { pool } from "../src/database/pool.js";

let shortCode: string | undefined;

afterAll(async () => {
  if (shortCode) {
    await pool.query(
      "DELETE FROM urls WHERE short_code = $1",
      [shortCode],
    );
  }
});

describe("GET /:shortCode", () => {
  it("redirects to the original URL", async () => {
    const createResponse = await request(app)
      .post("/api/shorten")
      .send({
        originalUrl: "https://example.com",
      });

    expect(createResponse.status).toBe(201);

    shortCode = createResponse.body.shortCode;

    const redirectResponse = await request(app)
      .get(`/${shortCode}`)
      .redirects(0);

    expect(redirectResponse.status).toBe(302);
    expect(redirectResponse.headers.location).toBe(
      "https://example.com",
    );
  });
});