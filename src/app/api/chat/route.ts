import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import fs from 'fs';
import path from 'path';
import knowledge from "@/data/knowledge.json";
import { pushToHistory } from '@/lib/redis-client';
import { checkRateLimit } from '@/lib/rate-limit';

// Trigger comment for Vercel redeploy to pick up new env variables
export const runtime = 'nodejs';
export const maxDuration = 30;

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

// Cache the context in memory to avoid redundant FS reads on every request
let cachedContext: string | null = null;
let lastCacheTime = 0;
const CACHE_TTL = 1000 * 60 * 10; // 10 minutes

function readKnowledgeFile(filename: string) {
  try {
    const filePath = path.join(process.cwd(), 'knowledge', filename);
    return fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    console.error(`Error reading ${filename}:`, e);
    return "";
  }
}

async function getContext() {
  const now = Date.now();
  if (cachedContext && (now - lastCacheTime < CACHE_TTL)) {
    return cachedContext;
  }

  try {
    // Read the main structure from the import instead of fs to guarantee bundling on Vercel
    let content = 'BASE KNOWLEDGE:\n' + JSON.stringify(knowledge, null, 2);

    // RAG System: Read custom injected documents
    let extraDocuments = "\n\nSUPPLEMENTARY DOCUMENTS DIRECTORY:\n";
    const docsDir = path.join(process.cwd(), 'src/data/documents');

    if (fs.existsSync(docsDir)) {
      const files = fs.readdirSync(docsDir);
      for (const file of files) {
        if (file.endsWith('.md') || file.endsWith('.txt')) {
          try {
            const filePath = path.join(docsDir, file);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            extraDocuments += `\n--- Document Start: ${file} ---\n`;
            extraDocuments += fileContent;
            extraDocuments += `\n--- Document End ---\n`;
          } catch (e) {
            console.error(`Error reading ${file}:`, e);
          }
        }
      }
    }

    cachedContext = content + extraDocuments;
    lastCacheTime = now;
    return cachedContext;
  } catch (error) {
    console.error("Context gather error:", error);
    return 'Knowledge Base Unavailable.';
  }
}

export async function POST(req: Request) {
  console.log("POST /api/chat invocation");

  // Get IP for rate limiting
  const ip = req.headers.get('x-forwarded-for') || 'anonymous';

  try {
    const { messages } = await req.json();
    const latestMessage = messages[messages.length - 1]?.content || "";

    // Immediate length check (before anything else)
    if (latestMessage.length > 500) {
      return new Response("Keep it brief. What did you want to know?", { status: 200 });
    }

    // Check rate limit and security probes
    const rateLimit = await checkRateLimit(ip, latestMessage);
    if (!rateLimit.allowed) {
      return new Response("Access temporarily restricted.", { status: 403 });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      console.error("OPENROUTER_API_KEY is missing from environment variables.");
      return new Response(JSON.stringify({
        error: "Configuration Error",
        message: "API Key is missing on Vercel."
      }), { status: 500 });
    }

    const context = await getContext();
    const SYSTEM_PROMPT = readKnowledgeFile('SYSTEM_PROMPT.md');

    // Reverted to your original model string which worked locally
    const result = await streamText({
      model: openrouter('anthropic/claude-sonnet-4-5'),
      system: `${SYSTEM_PROMPT}\n\n--- KNOWLEDGE CONTEXT ---\n${context}`,
      messages,
      onFinish: async ({ text }) => {
        // Asynchronously log the conversation
        let kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || process.env.REDIS_REST_API_URL;
        let kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || process.env.REDIS_REST_API_TOKEN;

        // Fallback for common misconfigurations or missing REST variables
        if (!kvUrl && process.env.REDIS_URL) {
          if (process.env.REDIS_URL.startsWith('https://')) {
            kvUrl = process.env.REDIS_URL;
          } else if (process.env.REDIS_URL.startsWith('redis://') || process.env.REDIS_URL.startsWith('rediss://')) {
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

        const userMsg = messages[messages.length - 1]?.content || "N/A";
        const logEntry = {
          u: userMsg,
          a: text,
          t: new Date().toISOString(),
        };

        let logged = false;

        // Strategy 1: REST Push (preferred for Vercel/Upstash)
        if (kvUrl && kvToken) {
          try {
            const resp = await fetch(`${kvUrl}/lpush/chat_history/${encodeURIComponent(JSON.stringify(logEntry))}`, {
              method: 'POST',
              headers: { Authorization: `Bearer ${kvToken}` }
            });
            if (resp.ok) {
              await fetch(`${kvUrl}/ltrim/chat_history/0/999`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${kvToken}` }
              });
              logged = true;
            }
          } catch (e) {
            console.error("KV REST Log Error:", e);
          }
        }

        // Strategy 2: Direct ioredis Push (Fallback for RedisLabs/Local)
        if (!logged && process.env.REDIS_URL?.includes('redis')) {
          try {
            await pushToHistory(logEntry);
          } catch (e) {
            console.error("ioredis Log Error:", e);
          }
        }
      }
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error("Chat Error:", error);
    return new Response(JSON.stringify({
      name: error.name,
      message: error.message,
      diagnostic: "Ensure OPENROUTER_API_KEY is active and model string is correct."
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
