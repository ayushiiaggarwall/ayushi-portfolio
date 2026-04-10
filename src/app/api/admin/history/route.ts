import { NextResponse } from 'next/server';
import { getHistoryFromRedis } from '@/lib/redis-client';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const passcode = searchParams.get('key');

  if (!passcode || passcode !== process.env.ADMIN_PASSCODE) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || process.env.REDIS_REST_API_URL;
  let kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || process.env.REDIS_REST_API_TOKEN;

  // Fallback for common misconfigurations or missing REST variables
  if (!kvUrl && process.env.REDIS_URL) {
    if (process.env.REDIS_URL.startsWith('https://')) {
      kvUrl = process.env.REDIS_URL;
    } else if (process.env.REDIS_URL.startsWith('redis://') || process.env.REDIS_URL.startsWith('rediss://')) {
      // Try to parse REST credentials from redis URL if possible (for Upstash)
      try {
        const urlMatch = process.env.REDIS_URL.match(/redis[s]?:\/\/(?:([^:]*):)?([^@]+)@([^:/]+)(?::(\d+))?/);
        if (urlMatch) {
          const [_, user, pass, host, port] = urlMatch;
          kvUrl = `https://${host}`;
          if (!kvToken) kvToken = pass;
        }
      } catch (e) {}
    }
  }
  
  if (!kvToken && process.env.REDIS_TOKEN) kvToken = process.env.REDIS_TOKEN;

  let redisResult: any[] | null = null;
  let errorSource = "";

  // Strategy 1: Attempt REST Fetch (preferred for Vercel/Upstash)
  if (kvUrl && kvToken) {
    try {
      const response = await fetch(`${kvUrl}/lrange/chat_history/0/99`, {
        headers: { Authorization: `Bearer ${kvToken}` }
      });

      if (response.ok) {
        const { result } = await response.json();
        redisResult = result;
      } else {
        errorSource = `REST Fetch failed with ${response.status}`;
      }
    } catch (err) {
      errorSource = `REST Fetch error: ${err}`;
    }
  }

  // Strategy 2: Attempt direct ioredis connection (Fallback for RedisLabs/Local)
  if (!redisResult && process.env.REDIS_URL?.includes('redis')) {
    try {
      redisResult = await getHistoryFromRedis(0, 99);
      if (!redisResult) errorSource = "ioredis returned null";
    } catch (err: any) {
      errorSource = `ioredis Error: ${err.message}`;
    }
  }

  if (!redisResult) {
    return NextResponse.json({ 
      error: 'Storage not configured or unreachable',
      hint: 'Ensure your REDIS_URL or KV variables are valid. Check Vercel logs for connection errors.',
      debug: {
        has_REST_CONFIG: !!(kvUrl && kvToken),
        has_REDIS_URL: !!process.env.REDIS_URL,
        error_source: errorSource || "No data found",
      }
    }, { status: 500 });
  }

  try {
    // Parse the JSON strings stored in the list
    const logs = (redisResult || []).map((item: string) => {
      try {
        return JSON.parse(decodeURIComponent(item));
      } catch (e) {
        return { u: "ERROR", a: "Failed to parse log", t: new Date().toISOString() };
      }
    });

    return NextResponse.json({ logs });
  } catch (error: any) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
