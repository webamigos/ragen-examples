# Ragen examples

A collection of standalone example projects showing how to use [`@ragenai/sdk`](https://www.npmjs.com/package/@ragenai/sdk) and the Ragen API.

Each example lives in its own folder under `examples/` and is fully independent — install and run it directly, no workspace setup required.

## Examples

| Example | Description |
| --- | --- |
| [`nextjs-example`](./examples/nextjs-example) | Next.js (App Router) app that calls the Ragen SDK from a server action triggered by a button click. |
| [`express-example`](./examples/express-example) | Express server exposing a `POST /ask` endpoint that proxies questions to the Ragen SDK. |
| [`express-streaming-example`](./examples/express-streaming-example) | Express server that streams Ragen completions over SSE and chunked plain text, with a browser demo page. |
| [`fastify-example`](./examples/fastify-example) | Fastify server with schema-validated `POST /ask` endpoint that calls the Ragen SDK. |
| [`hono-streaming-example`](./examples/hono-streaming-example) | Hono server that streams Ragen completions back to the client over SSE and chunked plain text. |
| [`aws-lambda-example`](./examples/aws-lambda-example) | AWS Lambda handler bundled with esbuild and deployable via AWS SAM behind an HTTP API. |
| [`nestjs-example`](./examples/nestjs-example) | NestJS app with an injectable `RagenService` wired through a Nest module and exposed via a `POST /ask` controller. |

## Getting started

Pick an example, then follow its README:

```bash
cd examples/nextjs-example
cp .env.example .env.local   # fill in RAGEN_API_KEY and RAGEN_ASSISTANT_ID
npm install
npm run dev
```

You will need a Ragen API token and an Assistant ID — see the [Ragen docs](https://docs.ragen.ai/) for setup.

## Contributing

Pull requests with new examples or improvements to existing ones are very welcome. See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the layout, naming conventions, and PR checklist. CI runs `tsc --noEmit` against every example on every PR.

## License

MIT — see [`LICENSE`](./LICENSE).
