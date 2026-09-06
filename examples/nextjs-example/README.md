# @webamigos/ragen-sdk-ts — Next.js example

Two ways to call Ragen from a [Next.js](https://nextjs.org) (App Router) app:

1. **`/`** — single-shot question via a React **[server action](https://nextjs.org/docs/app/getting-started/mutating-data)** that uses [`@webamigos/ragen-sdk-ts`](https://www.npmjs.com/package/@webamigos/ragen-sdk-ts) directly.
2. **`/chat`** — streaming chat UI built with the **[Vercel AI SDK](https://ai-sdk.dev/)** (`useChat` + `streamText`) talking to Ragen via its OpenAI-compatible endpoint.

## Prerequisites

A Ragen account, an API key, and an Assistant ID. Create them in the Ragen dashboard — see the [Ragen docs](https://docs.ragen.ai/) for details on issuing tokens and setting up assistants.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and fill in your credentials:

   ```bash
   cp .env.example .env.local
   ```

   ```dotenv
   RAGEN_API_KEY="sk-..."           # your Ragen API token
   RAGEN_ASSISTANT_ID="..."         # the assistant you want to query
   ```

   Without valid values both pages will fail at runtime. Keep `.env.local` out of version control (it is already in `.gitignore`).

3. Start the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000):
   - Click **Ask Ragen** on the home page for the server-action example.
   - Visit [/chat](http://localhost:3000/chat) for the Vercel AI SDK streaming chat.

## How it works

### Server action (`/`)

- `app/actions.ts` — server function marked with `"use server"`. Instantiates the Ragen client using env vars and returns the assistant's reply.
- `app/ask-button.tsx` — client component with a button that calls the action via `useTransition` and shows the result.
- `app/page.tsx` — server component that renders the button.

### Vercel AI SDK chat (`/chat`)

- `lib/ragen-provider.ts` — wraps `@ai-sdk/openai-compatible` pointed at `https://api.ragen.ai/v1`. A custom `fetch` injects `assistantId` (Ragen's required field) into the JSON body.
- `app/api/chat/route.ts` — POST handler that calls `streamText({ model: ragenModel, messages })` and returns a UI message stream response (`result.toUIMessageStreamResponse()`).
- `app/chat/chat-ui.tsx` — client component using `useChat` (from `@ai-sdk/react`) with `DefaultChatTransport` to stream tokens into the chat transcript.

> Why two approaches?
> - The **server action** path keeps you on the Ragen SDK end-to-end — best when you want full control over request shape, file uploads, or non-chat APIs.
> - The **Vercel AI SDK** path gives you `useChat`, message-state management, and ecosystem tooling for free, by leveraging Ragen's OpenAI-compatible wire format.

## Learn more

- [Ragen documentation](https://docs.ragen.ai/)
- [`@webamigos/ragen-sdk-ts` on npm](https://www.npmjs.com/package/@webamigos/ragen-sdk-ts)
- [Vercel AI SDK](https://ai-sdk.dev/)
- [Next.js Server Functions](https://nextjs.org/docs/app/getting-started/mutating-data)
