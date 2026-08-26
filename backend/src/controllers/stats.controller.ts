import { Request, Response } from "express";
import { getUrlStats } from "../services/url.service.js";

export async function statsController(
  req: Request,
  res: Response,
) {
  const { shortCode } = req.params;

  if (typeof shortCode !== "string") {
    res.status(400).json({
      error: "Invalid short code",
    });

    return;
  }

  const url = await getUrlStats(shortCode);

  if (!url) {
    // Если shortCode отсутствует в PostgreSQL,
    // статистику для него получить невозможно.
    res.status(404).json({
      error: "Short URL not found",
    });

    return;
  }

  res.json({
    originalUrl: url.original_url,
    shortCode: url.short_code,
    clicks: url.clicks,
    createdAt: url.created_at,
  });
}