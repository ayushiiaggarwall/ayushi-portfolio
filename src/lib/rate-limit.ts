type RateLimitData = {
  requests: number;
  messages: number;
  probes: number;
  blockedUntil: number;
};

const rateLimitMap = new Map<string, RateLimitData>();

const SECURITY_PROBES = [
  "api_key", "api key", "system prompt", ".env", "backend", 
  "ignore previous instructions", "debug mode", "jailbreak", "export", 
  "database tool", "token cost", "how many tokens", "what model", 
  "vercel sdk", "openai", "gpt", "claude", "what are you built on", 
  "source code", "architecture", "rate limit", "how do you work technically",
  "implementation guide", "knowledge-router", "route.ts", "rate-limiter",
  "KNOWLEDGE_DIR", "streamText", "getRelevantKnowledge", "checkRateLimit",
  "PROJECT_KEYWORDS", "MERKRI_KEYWORDS", "readKnowledgeFile", "next.js api route",
  "file structure", "backend implementation", "knowledge base", "system_prompt",
  "const SYSTEM", "openai("
];

export async function checkRateLimit(ip: string, message: string) {
  const now = Date.now();
  let data = rateLimitMap.get(ip) || { requests: 0, messages: 0, probes: 0, blockedUntil: 0 };

  // Check if currently blocked by security probes
  if (data.blockedUntil > now) {
    return { allowed: false, response: "Access temporarily restricted.", status: 403 };
  }

  // Check general message limit (15 per session)
  if (data.messages >= 15) {
    return { 
      allowed: false, 
      response: "That's enough for one session. If you want to keep talking, reach out directly — ayushi@merkri.media", 
      status: 200 
    };
  }

  // Increment counters
  data.requests++;
  data.messages++;

  // Check for probes
  const containsProbe = SECURITY_PROBES.some(probe => 
    message.toLowerCase().includes(probe.toLowerCase())
  );

  if (containsProbe) {
    data.probes++;

    // Progressive blocking levels
    if (data.probes >= 10) {
      data.blockedUntil = now + (24 * 60 * 60 * 1000); // Level 3: 24h
    } else if (data.probes >= 5) {
      data.blockedUntil = now + (60 * 60 * 1000); // Level 2: 1h
    } else if (data.probes >= 3) {
      data.blockedUntil = now + (5 * 60 * 1000); // Level 1: 5m
    }
  }

  rateLimitMap.set(ip, data);
  return { allowed: true };
}
