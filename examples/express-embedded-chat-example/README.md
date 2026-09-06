# Ragen — Express embedded chat example

[Express](https://expressjs.com/) server behind an embedded chat widget, built on Ragen's native `POST /v1/chat` endpoint via [`ragen.chat.sendStream(...)`](https://www.npmjs.com/package/@webamigos/ragen-sdk-ts).

This is the example for the two things `/v1/chat` does that the OpenAI-compatible `chat.completions.*` cannot:

- **`context`** — up to 20,000 characters of page text, sent with the question and appended to it server-side. The visitor can ask about the page they are reading without any of it being in the knowledge base.
- **separated reasoning** — the stream yields tagged `{ type: "text" }` and `{ type: "reasoning" }` events, so the model's thinking renders in its own panel instead of landing in the middle of the answer.

If you don't need either, use [`express-streaming-example`](../express-streaming-example) instead — `chat.completions.*` is the OpenAI-compatible path and the right default.

## Prerequisites

A Ragen API token and an Assistant ID. See the [Ragen docs](https://docs.ragen.ai/).

## Setup

```bash
npm install
cp .env.example .env
```

Fill in `.env`:

```dotenv
RAGEN_API_KEY="sk-..."
RAGEN_ASSISTANT_ID="..."
PORT="3000"
```

Run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The page is a stand-in billing-policy document with a chat widget in the corner; the widget sends the article's text as `context`. Ask *"If I downgrade today, when does it take effect?"* — the answer comes from the page, not from the assistant's knowledge base.

Set **Reasoning** to `high` to see the reasoning panel fill up while the answer streams separately.

## Try it from the command line

```bash
curl -N -X POST http://localhost:3000/chat \
  -H 'content-type: application/json' \
  -d '{
    "content": "When does a downgrade take effect?",
    "context": "Upgrades take effect immediately and are prorated. Downgrades take effect at the start of the next cycle.",
    "reasoning_effort": "low"
  }'
```

You get an SSE stream with `text`, `reasoning`, `done` and `error` events, each carrying a JSON payload.

## How it works

- `src/server.ts` — one `POST /chat` endpoint. Iterates the SDK's `AsyncIterable<ChatStreamEvent>` and forwards each event under its own SSE event name, so the two streams stay apart end to end. A client disconnect aborts the upstream request via `AbortController`.
- `public/index.html` — the host page plus the widget. Reads `#doc`'s `innerText` as context and parses the SSE frames by hand.

### Why POST, and why not `EventSource`

`EventSource` only speaks GET, which would put the entire page into the query string — and `context` alone can be 20,000 characters. So the endpoint is a POST that returns `text/event-stream`, and the browser reads it with `fetch` + a `ReadableStream` reader. That is ~20 lines of frame parsing, and it is the reason this example does not reuse the `EventSource` setup from `express-streaming-example`.

### Limits

The API caps `content` at 10,000 characters and `context` at 20,000. The server checks both: an over-long question is a 400, an over-long context is truncated. Truncating is deliberate — the visitor still gets an answer grounded in the top of the page, instead of an error they cannot act on. The widget trims to the same cap before sending, so a long page doesn't go over the wire just to be discarded.

Express's default JSON body limit is 100kb, which 20,000 characters of non-Latin text can exceed, so `express.json()` is raised to 1mb here.

> **Note on proxies:** Set `X-Accel-Buffering: no` (sent by this server) and disable response buffering in any reverse proxy (nginx `proxy_buffering off;`) so events reach the client immediately.

## Learn more

- [Ragen documentation](https://docs.ragen.ai/)
- [`@webamigos/ragen-sdk-ts` on npm](https://www.npmjs.com/package/@webamigos/ragen-sdk-ts)
- [MDN — Server-Sent Events](https://developer.mozilla.org/docs/Web/API/Server-sent_events)
