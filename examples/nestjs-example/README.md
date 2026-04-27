# Ragen — NestJS example

[NestJS](https://nestjs.com) app with a `RagenModule` that provides an injectable `RagenService` wrapping [`@ragenai/sdk`](https://www.npmjs.com/package/@ragenai/sdk), and a controller exposing `POST /ask`.

The Ragen client is created once per app via a Nest factory provider and configured from environment variables through `@nestjs/config`.

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

Ask a question:

```bash
curl -X POST http://localhost:3000/ask \
  -H 'content-type: application/json' \
  -d '{"question":"What is our refund policy?"}'
```

## How it works

- `src/main.ts` — bootstraps the Nest app and enables `ValidationPipe` for DTO-based body validation.
- `src/app.module.ts` — root module, imports `ConfigModule` (global) and `RagenModule`.
- `src/ragen/ragen.module.ts` — registers a `RAGEN_CLIENT` factory provider that constructs `new Ragen({ apiKey })` from `ConfigService`, plus the `RagenService`.
- `src/ragen/ragen.service.ts` — injectable wrapper around the Ragen SDK.
- `src/ragen/ragen.controller.ts` — `GET /` help page and `POST /ask` endpoint.
- `src/ragen/ask.dto.ts` — request DTO with `class-validator` rules; the global `ValidationPipe` rejects malformed payloads with a 400.

The same `RagenService` can be injected anywhere else in the app (other controllers, queue processors, scheduled tasks, etc.), so this layout scales beyond the one endpoint.

## Learn more

- [Ragen documentation](https://docs.ragen.ai/)
- [`@ragenai/sdk` on npm](https://www.npmjs.com/package/@ragenai/sdk)
- [NestJS documentation](https://docs.nestjs.com/)
