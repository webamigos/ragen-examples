# Contributing

Thanks for your interest in adding to **`ragenai/examples`**! This repo collects small, standalone examples of using [`@ragenai/sdk`](https://www.npmjs.com/package/@ragenai/sdk) and the Ragen API. The goal is for someone to land in any folder and have a working app within a minute.

## Ground rules

Every example must be:

1. **Standalone.** Its own `package.json`, `node_modules`, and lockfile. No workspaces, no shared deps.
2. **Self-explanatory.** Its own `README.md` with prerequisites, setup, run, and a "How it works" section.
3. **Backend-runnable.** All Ragen calls must run on the server (the API token must never be shipped to the browser).
4. **Type-safe.** `npx tsc --noEmit` must pass cleanly. CI enforces this.
5. **Secret-free.** Provide a `.env.example` with empty values. Never commit a real `.env` / `.env.local`.

## Layout

```
examples/<name>/
├── README.md
├── package.json
├── .env.example
├── .gitignore
├── tsconfig.json
└── src/ (or app/, etc.)
```

**Naming:** `<framework>-example` (e.g. `express-example`) for the canonical "hello world" of a framework, and `<framework>-<feature>-example` (e.g. `express-streaming-example`, `hono-streaming-example`) for variants that demonstrate a specific pattern.

## Adding a new example

1. Create a folder under `examples/`.
2. Copy the structure from an existing example that's closest to what you're building.
3. Use environment variables for credentials — at minimum `RAGEN_API_KEY` and `RAGEN_ASSISTANT_ID`. Document them in `.env.example` and the README.
4. In your README, link to <https://docs.ragen.ai/> for credential setup.
5. Verify locally:
   ```bash
   cd examples/<your-example>
   npm install
   cp .env.example .env       # or .env.local for Next.js
   # fill in real values
   npx tsc --noEmit
   npm run dev                # smoke-test the example
   ```
6. Add a row to the table in the root [`README.md`](./README.md).
7. Open a PR.

## Updating an existing example

- Keep changes minimal and focused. If a change is large enough to need its own README section, it probably belongs in a new variant folder (e.g. `nextjs-streaming-example`) rather than in the existing example.
- Bump `@ragenai/sdk` to the latest published version when relevant.
- Re-run `npx tsc --noEmit` after any change.

## CI

A GitHub Actions workflow runs `npm install && npx tsc --noEmit` for every example on every PR. If you add a new example, also add it to the `matrix.example` list in [`.github/workflows/ci.yml`](./.github/workflows/ci.yml).

## Questions

Open a [GitHub issue](https://github.com/ragenai/examples/issues) for bugs, requests for new examples, or anything unclear.

## Security

Never open a public issue for a vulnerability — in an example, in the SDK, or in
the Ragen platform. See [`SECURITY.md`](./SECURITY.md).

The most common security mistake in this repo is a committed credential. Every
example ships a `.env.example` with empty values; a real `.env` or `.env.local`
must never be committed, and an API key must never appear in a README, a code
comment, or a screenshot.

## Licensing

Contributions are accepted under the [Apache License 2.0](./LICENSE), the same
license that covers the project. By opening a pull request you confirm you have
the right to contribute the code and agree to license it under those terms.
