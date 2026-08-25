import { z } from "zod";

export const shortenUrlSchema = z.object({
  originalUrl: z
    .string()
    // Сначала проверяем, что строка вообще является URL,
    // затем разрешаем только HTTP и HTTPS.
    .refine(
      (value) => {
        try {
          const url = new URL(value);

          return url.protocol === "http:" || url.protocol === "https:";
        } catch {
          return false;
        }
      },
      {
        message: "URL must be a valid HTTP or HTTPS URL",
      },
    ),
});