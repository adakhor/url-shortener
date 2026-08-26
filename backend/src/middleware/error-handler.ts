import { NextFunction, Request, Response } from "express";

// Централизованный обработчик ошибок API.
// Контроллеры не должны самостоятельно формировать ответ
// для каждой непредвиденной ошибки — Express передаёт её сюда.
export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(error);

  if (res.headersSent) {
    next(error);
    return;
  }

  res.status(500).json({
    error: "Internal server error",
  });
}