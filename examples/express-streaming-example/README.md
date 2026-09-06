# Ragen — Express streaming example

[Express](https://expressjs.com/) server that streams Ragen completions to the client. Two transports:

- **`GET /ask?question=...`** — [Server-Sent Events](https://developer.mozilla.org/docs/Web/API/Server-sent_events) (`text/event-stream`). Each token is sent as a `delta` event; a final `done` event signals completion.
- **`POST /ask`** — chunked plain text. Each token is appended to the response body as it arrives.

Both consume [`ragen.chat.completions.stream(...)`](https://www.npmjs.com/package/@webamigos/ragen-sdk-ts) and forward `choices[0].delta.content`. Client disconnects abort the upstream request via `AbortController`.

A small browser demo at [http://localhost:3000](http://localhost:3000) consumes the SSE stream with `EventSource`.

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

Open [http://localhost:3000](http://localhost:3000) and click **Ask**.

## Try it from the command line

SSE (use `curl -N` to disable buffering):

```bash
curl -N 'http://localhost:3000/ask?question=What%20is%20our%20refund%20policy%3F'
```

Plain chunked text:

```bash
curl -N -X POST http://localhost:3000/ask \
  -H 'content-type: application/json' \
  -d '{"question":"What is our refund policy?"}'
```

## How it works

- `src/server.ts` — Express app. Sets streaming headers (`text/event-stream` or chunked `text/plain`), iterates the SDK's `AsyncIterable<ChatCompletionChunk>`, and writes each delta to the response. Uses `AbortController` so a client disconnect cancels the SDK request.
- `public/index.html` — minimal browser UI using `EventSource`.

> **Note on proxies:** Set `X-Accel-Buffering: no` (sent by this server) and disable response buffering in any reverse proxy (nginx `proxy_buffering off;`) so tokens reach the client immediately.

## Learn more

- [Ragen documentation](https://docs.ragen.ai/)
- [`@webamigos/ragen-sdk-ts` on npm](https://www.npmjs.com/package/@webamigos/ragen-sdk-ts)
- [MDN — Server-Sent Events](https://developer.mozilla.org/docs/Web/API/Server-sent_events)
