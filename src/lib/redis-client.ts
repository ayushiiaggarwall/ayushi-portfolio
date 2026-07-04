import Redis from 'ioredis';

let redis: Redis | null = null;

export function getRedisClient() {
  // Prioritize prefixed REDIS_URL (which is the new working one) over standard REDIS_URL
  const prefixedKey = Object.keys(process.env).find(k => k.endsWith('REDIS_URL') && k !== 'REDIS_URL');
  const redisUrl = prefixedKey ? process.env[prefixedKey] : process.env.REDIS_URL;
  if (!redisUrl) return null;
  
  if (!redis) {
    // Only use ioredis for actual redis:// or rediss:// URLs
    if (redisUrl.startsWith('redis://') || redisUrl.startsWith('rediss://')) {
      redis = new Redis(redisUrl, {
        connectTimeout: 2000,
        maxRetriesPerRequest: 1,
        retryStrategy(times) {
          if (times > 2) return null; // stop retrying after 2 attempts
          return Math.min(times * 100, 1000);
        }
      });
    }
  }
  return redis;
}

export async function getHistoryFromRedis(start = 0, end = 99) {
  const client = getRedisClient();
  if (!client) return null;
  
  try {
    return await client.lrange('chat_history', start, end);
  } catch (err) {
    console.error("Redis LRange Error:", err);
    return null;
  }
}

export async function pushToHistory(data: any) {
  const client = getRedisClient();
  if (!client) return null;
  
  try {
    const entry = typeof data === 'string' ? data : JSON.stringify(data);
    await client.lpush('chat_history', encodeURIComponent(entry));
    await client.ltrim('chat_history', 0, 999);
    return true;
  } catch (err) {
    console.error("Redis Push Error:", err);
    return false;
  }
}
