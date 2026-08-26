import { app } from "./app.js";
import { pool } from "./database/pool.js";
import { redisClient } from "./database/redis.js";

const PORT = 3000;

async function startServer() {
  try {
    await pool.query("SELECT 1");
    console.log("PostgreSQL connection successful");

    await redisClient.connect();
    console.log("Redis connection successful");

    app.listen(PORT, () => {
      console.log(
        `Server started on http://localhost:${PORT}`,
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();