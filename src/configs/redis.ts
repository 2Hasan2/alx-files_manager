import { createClient } from "redis";

const password = process.env.REDIS_PASSWORD!;
const host = process.env.REDIS_HOST!;
const port = +process.env.REDIS_PORT!;

const redisClient = createClient({
  password,
  socket: {
    host,
    port,
  },
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

redisClient
  .connect()
  .then(() => {
    return redisClient.ping();
  })
  .catch((err) => {
    console.error("Failed to connect to Redis:", err);
  });

export default redisClient;
