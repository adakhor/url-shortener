import { useState } from "react";
import "./App.css";

interface ShortenResponse {
  shortCode: string;
  shortUrl: string;
}

interface StatsResponse {
  originalUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: string;
}

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const [shortCode, setShortCode] = useState("");
  const [stats, setStats] = useState<StatsResponse | null>(null);

  const [shortenLoading, setShortenLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);

  const [shortenError, setShortenError] = useState("");
  const [statsError, setStatsError] = useState("");

  async function handleShorten() {
    setShortenLoading(true);
    setShortenError("");
    setShortUrl("");

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalUrl: url,
        }),
      });

      const data: ShortenResponse | { error: string } =
        await response.json();

      if (!response.ok) {
        if ("error" in data) {
          throw new Error(data.error);
        }

        throw new Error("Не удалось сократить ссылку");
      }

      if (!("shortUrl" in data)) {
        throw new Error("Сервер вернул некорректный ответ");
      }

      setShortUrl(data.shortUrl);
    } catch (error: unknown) {
      setShortenError(
        error instanceof Error
          ? error.message
          : "Неизвестная ошибка",
      );
    } finally {
      setShortenLoading(false);
    }
  }

  async function handleStats() {
    setStatsLoading(true);
    setStatsError("");
    setStats(null);

    try {
      const response = await fetch(`/api/stats/${shortCode}`);

      const data: StatsResponse | { error: string } =
        await response.json();

      if (!response.ok) {
        if ("error" in data) {
          throw new Error(data.error);
        }

        throw new Error("Не удалось получить статистику");
      }

      if (!("clicks" in data)) {
        throw new Error("Сервер вернул некорректный ответ");
      }

      setStats(data);
    } catch (error: unknown) {
      setStatsError(
        error instanceof Error
          ? error.message
          : "Неизвестная ошибка",
      );
    } finally {
      setStatsLoading(false);
    }
  }

  async function handleCopy() {
    if (!shortUrl) {
      return;
    }

    await navigator.clipboard.writeText(shortUrl);
  }

  return (
    <main className="app">
      <header className="header">
        <h1>URL Shortener</h1>
        <p>Сокращение ссылок с базовой аналитикой</p>
      </header>

      <section className="card">
        <h2>Сократить ссылку</h2>

        <div className="form">
          <input
            className="input"
            type="text"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://example.com"
          />

          <button
            className="button"
            onClick={handleShorten}
            disabled={shortenLoading}
          >
            {shortenLoading ? "Сокращаем..." : "Сократить"}
          </button>
        </div>

        {shortenError && (
          <p className="error">{shortenError}</p>
        )}

        {shortUrl && (
          <div className="result">
            <p>
              Короткая ссылка:{" "}
              <a
                href={shortUrl}
                target="_blank"
                rel="noreferrer"
              >
                {shortUrl}
              </a>
            </p>

            <button
              className="button copy-button"
              onClick={handleCopy}
            >
              Копировать в буфер обмена
            </button>
          </div>
        )}
      </section>

      <section className="card">
        <h2>Статистика</h2>

        <div className="form">
          <input
            className="input"
            type="text"
            value={shortCode}
            onChange={(event) => setShortCode(event.target.value)}
            placeholder="Например: hriMip"
          />

          <button
            className="button"
            onClick={handleStats}
            disabled={statsLoading}
          >
            {statsLoading
              ? "Загружаем..."
              : "Получить статистику"}
          </button>
        </div>

        {statsError && (
          <p className="error">{statsError}</p>
        )}

        {stats && (
          <div className="result stats">
            <div className="stats-row">
              <span>Оригинальный URL</span>
              <span>{stats.originalUrl}</span>
            </div>

            <div className="stats-row">
              <span>Короткий код</span>
              <span>{stats.shortCode}</span>
            </div>

            <div className="stats-row">
              <span>Переходов</span>
              <span>{stats.clicks}</span>
            </div>

            <div className="stats-row">
              <span>Создана</span>
              <span>
                {new Date(stats.createdAt).toLocaleString("ru-RU")}
              </span>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;