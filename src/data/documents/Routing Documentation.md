# Knowledge Base Routing Logic

## Files Overview

| File | Tokens (approx) | Inject When |
|------|----------------|-------------|
| identity.md | ~250 | ALWAYS |
| conversation.md | ~400 | ALWAYS |
| faqs.md | ~700 | ALWAYS |
| projects.md | ~900 | CONDITIONAL |
| merkri_media.md | ~300 | CONDITIONAL |

Baseline per request: ~1350 tokens
Maximum per request: ~2550 tokens
Previous setup: ~4000+ tokens
Reduction: ~40-60%

---

## Always Inject
- identity.md
- conversation.md
- faqs.md

---

## Inject projects.md when message contains any of:
project, built, build, travel, ease, researcher,
research, agent, sales, tracker, carpenter, rewards,
tomorrows, team, app, product, hackathon, won, win,
demo, live, streamlit, lovable, antigravity, vapi,
voice, n8n, automation, langchain, langgraph,
show me, what did you, portfolio, shipped,
production, work, built what, how many

---

## Inject merkri_media.md when message contains any of:
agency, merkri, media, client, brand, branding,
marketing, business, company, service, founder,
b2b, what do you do, your work, your company,
digital, social, instagram, linkedin, logo,
interior, studio, saraswati, nyra

---

## Implementation
Simple case-insensitive keyword matching on
the user message before each API call.
No embeddings. No vector search. No chunking.
Check keywords → inject relevant files → call API.
