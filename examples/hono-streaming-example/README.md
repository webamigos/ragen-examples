# Ragen — Hono streaming example

[Hono](https://hono.dev/) server that streams Ragen completions back to the client. Demonstrates two transports:

- **`GET /ask?question=...`** — [Server-Sent Events](https://developer.mozilla.org/docs/Web/API/Server-sent_events) (`text/event-stream`). Each token is emitted as a `delta` event; a final `done` event signals completion.
- **`POST /ask`** — chunked plain text (`text/plain`). Each token is appended to the response body as it arrives.

Both use [`ragen.chat.completions.stream(...)`](https://www.npmjs.com/package/@ragenai/sdk) under the hood.

## Prerequisites

A Ragen API token and an Assistant ID. See the [Ragen docs](https://docs.ragen.ai/) for setup.

## Setup

1. Install:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your credentials:

   ```bash
   cp .env.example .env
   ```

   ```dotenv
   RAGEN_API_KEY="sk-..."
   RAGEN_ASSISTANT_ID="..."
   PORT="3000"
   ```

3. Run:

   ```bash
   npm run dev
   ```

## Try it

SSE (browser-friendly, use `curl -N` to disable buffering):

```bash
curl -N 'http://localhost:3000/ask?question=What%20is%20our%20refund%20policy%3F'
```

Plain chunked text:

```bash
curl -N -X POST http://localhost:3000/ask \
  -H 'content-type: application/json' \
  -d '{"question":"What is our refund policy?"}'
```

From the browser, the SSE endpoint can be consumed with `EventSource`:

```js
const es = new EventSource("/ask?question=" + encodeURIComponent(q));
es.addEventListener("delta", (e) => console.log(e.data));
es.addEventListener("done", () => es.close());
es.addEventListener("error", (e) => { console.error(e); es.close(); });
```

## How it works

- `src/server.ts` — Hono app served via `@hono/node-server`. The SDK's `chat.completions.stream(...)` returns an `AsyncIterable<ChatCompletionChunk>`; the server iterates and forwards `choices[0].delta.content` to the client using Hono's `streamSSE` / `streamText` helpers.

## Learn more

- [Ragen documentation](https://docs.ragen.ai/)
- [`@ragenai/sdk` on npm](https://www.npmjs.com/package/@ragenai/sdk)
- [Hono streaming helpers](https://hono.dev/docs/helpers/streaming)
