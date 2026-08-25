import { Request, Response } from "express";
import { shortenUrl } from "../services/url.service.js";
import { shortenUrlSchema } from "../validators/url.validator.js";

export async function shortenUrlController(
  req: Request,
  res: Response,
) {
  const result = shortenUrlSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      error: "Invalid URL",
      details: result.error.issues,
    });

    return;
  }

  const { originalUrl } = result.data;

  const url = await shortenUrl(originalUrl);

  res.status(201).json({
    shortCode: url.short_code,
    shortUrl: `http://localhost:3000/${url.short_code}`,
  });
}