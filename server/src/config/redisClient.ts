// import { createClient } from "redis";

// export const redisClient = createClient({
//   url: process.env.REDIS_URL || "redis://localhost:6379",
// });

// redisClient.on("error", (err) => {
//   console.error("Redis Client Error", err);
// });

// redisClient.on("connect", () => {
//   console.log("Connecting to Redis...");
// });


// export const connectRedis = async () => {
  
//   if (redisClient.isOpen) {
//     return; // Already connected
//   }

//   try {
//     // Only connect if not already in the process of connecting
//     await redisClient.connect();
//     console.log("Connected to Redis successfully");
//   } catch (err) {
//     console.error("Failed to connect to Redis", err);
//   }
// };
// ;


import { createClient } from "redis";

export const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  socket: {
    // Crucial for production build stability
    reconnectStrategy: (retries) => {
      const delay = Math.min(retries * 100, 3000);
      return delay;
    },
    connectTimeout: 10000,
  },
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err.message);
});

redisClient.on("reconnecting", () => {
  console.log("Redis reconnecting...");
});

redisClient.on("ready", () => {
  console.log("Redis Client Ready");
});

export const connectRedis = async () => {
  if (redisClient.isOpen) return;
  
  try {
    await redisClient.connect();
    console.log("Connected to Redis successfully");
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
    // Don't exit process here; allow reconnectStrategy to work
  }
};