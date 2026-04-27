# Ragen — Fastify example

Minimal [Fastify](https://fastify.dev/) server exposing a `POST /ask` endpoint that calls [`@ragenai/sdk`](https://www.npmjs.com/package/@ragenai/sdk) and returns the assistant's reply. Uses Fastify's built-in JSON-schema validation for the request body.

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

- `src/server.ts` — Fastify app. Loads env vars via `dotenv`, instantiates the Ragen client once, validates the request body via JSON schema, and forwards `POST /ask` payloads to `ragen.chat.completions.create`.

## Learn more

- [Ragen documentation](https://docs.ragen.ai/)
- [`@ragenai/sdk` on npm](https://www.npmjs.com/package/@ragenai/sdk)
- [Fastify documentation](https://fastify.dev/docs/latest/)
