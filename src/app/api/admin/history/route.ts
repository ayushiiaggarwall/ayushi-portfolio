import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const passcode = searchParams.get('key');

  if (!passcode || passcode !== process.env.ADMIN_PASSCODE) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return NextResponse.json({ error: 'Storage not configured' }, { status: 500 });
  }

  try {
    // Fetch last 100 logs from Vercel KV
    const response = await fetch(`${process.env.KV_REST_API_URL}/lrange/chat_history/0/99`, {
      headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` }
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
