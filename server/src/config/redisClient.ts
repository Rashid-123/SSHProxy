import { createClient, REDISEARCH_LANGUAGE } from "redis";

export const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

redisClient.on("connect", () => {
  console.log("Connecting to Redis...");
});

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis successfully");
  } catch (err) {
    console.error("Failed to connect to Redis", err);
    throw err;
  }
}
;