import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const passcode = searchParams.get('key');

  if (!passcode || passcode !== process.env.ADMIN_PASSCODE) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const kvUrl = process.env.KV_REST_API_URL || process.env.REDIS_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.REDIS_REST_API_TOKEN;

  if (!kvUrl || !kvToken) {
    return NextResponse.json({ 
      error: 'Storage not configured',
      hint: 'Ensure you have Connected your KV storage in the Vercel Storage tab.',
      debug: {
        has_KV_URL: !!process.env.KV_REST_API_URL,
        has_KV_TOKEN: !!process.env.KV_REST_API_TOKEN,
        has_REDIS_URL: !!process.env.REDIS_URL
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
