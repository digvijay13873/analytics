const redis = require("redis");

// Create Redis client with the connection URL from the environment variable
const redisClient = redis.createClient({
  url: process.env.REDIS_URL, // This loads the Redis URL from your .env file
});

redisClient.connect().catch(console.error);
