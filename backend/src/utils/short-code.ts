const CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const SHORT_CODE_LENGTH = 6;

export function generateShortCode(): string {
  let result = "";

  for (let i = 0; i < SHORT_CODE_LENGTH; i++) {
    const randomIndex = Math.floor(
      Math.random() * CHARACTERS.length,
    );

    result += CHARACTERS[randomIndex];
  }

  return result;
}