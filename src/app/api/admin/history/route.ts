import { NextResponse } from 'next/server';

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
    } else if (process.env.REDIS_URL.startsWith('redis://')) {
      // Try to parse redis://[user]:PASSWORD@HOST:PORT
      try {
        const urlMatch = process.env.REDIS_URL.match(/redis:\/\/(?:([^:]*):)?([^@]+)@([^:]+)/);
        if (urlMatch) {
          const [_, user, pass, host] = urlMatch;
          kvUrl = `https://${host}`;
          if (!kvToken) kvToken = pass;
        }
      } catch (e) {
        console.error("Failed to parse REDIS_URL fallback");
      }
    }
  }
  
  if (!kvToken && process.env.REDIS_TOKEN) kvToken = process.env.REDIS_TOKEN;

  if (!kvUrl || !kvToken) {
    return NextResponse.json({ 
      error: 'Storage not configured',
      hint: 'Ensure you have connected your KV/Redis storage and set the required environment variables (KV_REST_API_URL/TOKEN or UPSTASH_REDIS_REST_URL/TOKEN).',
      debug: {
        has_KV_REST_API_URL: !!process.env.KV_REST_API_URL,
        has_KV_REST_API_TOKEN: !!process.env.KV_REST_API_TOKEN,
        has_UPSTASH_REDIS_REST_URL: !!process.env.UPSTASH_REDIS_REST_URL,
        has_UPSTASH_REDIS_REST_TOKEN: !!process.env.UPSTASH_REDIS_REST_TOKEN,
        has_REDIS_URL: !!process.env.REDIS_URL,
        redis_url_prefix: process.env.REDIS_URL ? (process.env.REDIS_URL.split(':')[0] + '://' + (process.env.REDIS_URL.includes('@') ? '***@' : '')) : 'none',
        derived_url: kvUrl ? 'HIDDEN' : 'null',
        derived_token: kvToken ? 'HIDDEN' : 'null'
      }
    }, { status: 500 });
  }

  try {
    // Fetch last 100 logs from Vercel KV
    const response = await fetch(`${kvUrl}/lrange/chat_history/0/99`, {
      headers: { Authorization: `Bearer ${kvToken}` }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from KV');
    }

    const { result } = await response.json();
    
    // Parse the JSON strings stored in the list
    const logs = (result || []).map((item: string) => {
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
