import { Request, Response } from "express";
import { shortenUrl } from "../services/url.service.js";

export async function shortenUrlController(
  req: Request,
  res: Response,
) {
  const { originalUrl } = req.body;

  const url = await shortenUrl(originalUrl);

  res.status(201).json({
    shortCode: url.short_code,
    shortUrl: `http://localhost:3000/${url.short_code}`,
  });
}