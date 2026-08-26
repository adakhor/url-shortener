import express from "express";
import morgan from "morgan";

import { shortenUrlController } from "./controllers/url.controller.js";
import { redirectController } from "./controllers/redirect.controller.js";
import { statsController } from "./controllers/stats.controller.js";
import { errorHandler } from "./middleware/error-handler.js";

export const app = express();

app.use(express.json());

// Логируем каждый HTTP-запрос для удобной диагностики API.
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("URL Shortener API");
});

app.post("/api/shorten", shortenUrlController);

app.get("/api/stats/:shortCode", statsController);

app.get("/:shortCode", redirectController);

// Error handler должен находиться после всех routes,
// чтобы получать ошибки, возникшие внутри них.
app.use(errorHandler);