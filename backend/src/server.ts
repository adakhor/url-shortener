import "dotenv/config";
import express from "express";
import { pool } from "./database/pool.js";
import { shortenUrlController } from "./controllers/url.controller.js";
import { redirectController } from "./controllers/redirect.controller.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("URL Shortener API");
});

app.post("/api/shorten", shortenUrlController);

app.get("/:shortCode", redirectController);

app.listen(3000, async () => {
  console.log("Server started on http://localhost:3000");

  try {
    await pool.query("SELECT 1");
    console.log("PostgreSQL connection successful");
  } catch (error) {
    console.error("PostgreSQL connection failed:", error);
  }
});