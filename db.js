const redis = require("redis");
const geoip = require("geoip-lite");
const useragent = require("useragent");

// Create a Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

redisClient.connect();

// Function to save URL to Redis
const saveUrl = async (shortUrl, originalUrl) => {
  // Save the original URL with the short URL as the key
  await redisClient.set(`url:${shortUrl}`, originalUrl);
};

// Function to get the original URL from Redis
const getUrl = async (shortUrl) => {
  const url = await redisClient.get(`url:${shortUrl}`);
  return url;
};

// Function to track clicks for a URL in Redis
const trackClick = async (alias, userAgent, ip) => {
  const geo = geoip.lookup(ip);  // Geolocation data
  const agent = useragent.parse(userAgent);  // User-agent data
  
  // Increment the click count for the alias
  await redisClient.incr(`clicks:${alias}`);

  // Optionally, you can store additional tracking data (like device or location)
  await redisClient.hSet(`analytics:${alias}`, {
    device: agent.device.toString(),
    os: agent.os.toString(),
    location: geo ? geo.country : 'unknown',
  });
};

// Function to get analytics for a URL
const getAnalytics = async (alias) => {
  // Get the total clicks for the alias
  const clicks = await redisClient.get(`clicks:${alias}`);

  // Get additional analytics (device, OS, location) from Redis hash
  const analytics = await redisClient.hGetAll(`analytics:${alias}`);

  return { clicks, ...analytics };
};

module.exports = { saveUrl, getUrl, trackClick, getAnalytics };
