import Redis from 'ioredis';

let redis: Redis | null = null;

export function getRedisClient() {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) return null;
  
  if (!redis) {
    // Only use ioredis for actual redis:// or rediss:// URLs
    if (redisUrl.startsWith('redis://') || redisUrl.startsWith('rediss://')) {
      redis = new Redis(redisUrl, {
        maxRetriesPerRequest: null,
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
