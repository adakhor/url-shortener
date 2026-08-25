import { Request, Response } from "express";
import { resolveShortUrl } from "../services/url.service.js";

export async function redirectController(
  req: Request,
  res: Response,
) {
  const { shortCode } = req.params;

  // Express допускает несколько вариантов типа параметра,
  // поэтому передаём его в service только после проверки,
  // что это действительно одна строка.
  if (typeof shortCode !== "string") {
    res.status(400).json({
      error: "Invalid short code",
    });

    return;
  }

  const url = await resolveShortUrl(shortCode);

  if (!url) {
    // Короткого кода нет в базе — возвращаем требуемый HTTP 404.
    res.status(404).json({
      error: "Short URL not found",
    });

    return;
  }

  // Отправляем браузеру HTTP redirect на исходный адрес.
  res.redirect(url.original_url);
}