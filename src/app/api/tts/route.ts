import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API Key is missing' }, { status: 500 });
    }

    // Clean up text: remove markdown symbols like * # ` _ to make speech cleaner
    const cleanText = text.replace(/[*#`_]/g, '').trim();

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: cleanText,
        voice: 'shimmer', // Highly natural and balanced feminine voice
        speed: 1.1,       // Keeping it slightly fast-paced as requested before
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI TTS Error:", errorData);
      return NextResponse.json(errorData, { status: response.status });
    }

    const audioBuffer = await response.arrayBuffer();
    
    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error: any) {
    console.error("TTS Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
