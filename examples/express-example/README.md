# Ragen — Express example

Minimal [Express](https://expressjs.com/) server exposing a `POST /ask` endpoint that calls [`@webamigos/ragen-sdk-ts`](https://www.npmjs.com/package/@webamigos/ragen-sdk-ts) and returns the assistant's reply.

## Prerequisites

A Ragen API token and an Assistant ID. Create them in the Ragen dashboard — see the [Ragen docs](https://docs.ragen.ai/) for setup.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your credentials:

   ```bash
   cp .env.example .env
   ```

   ```dotenv
   RAGEN_API_KEY="sk-..."           # your Ragen API token
   RAGEN_ASSISTANT_ID="..."         # the assistant you want to query
   PORT="3000"                       # optional, defaults to 3000
   ```

   Without valid values the `/ask` endpoint will return an error from the SDK. Keep `.env` out of version control.

3. Start the server:

   ```bash
   npm run dev
   ```

4. Ask a question:

   ```bash
   curl -X POST http://localhost:3000/ask \
     -H 'content-type: application/json' \
     -d '{"question":"What is our refund policy?"}'
   ```

## How it works

- `src/server.ts` — Express app. Loads env vars via `dotenv`, instantiates the Ragen client once, and forwards `POST /ask` payloads to `ragen.chat.completions.create`.

## Learn more

- [Ragen documentation](https://docs.ragen.ai/)
- [`@webamigos/ragen-sdk-ts` on npm](https://www.npmjs.com/package/@webamigos/ragen-sdk-ts)
