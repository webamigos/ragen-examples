# Ragen — AWS Lambda example

AWS Lambda handler that calls [`@ragenai/sdk`](https://www.npmjs.com/package/@ragenai/sdk) and returns the assistant's reply. Bundled with `esbuild` and deployable via [AWS SAM](https://docs.aws.amazon.com/serverless-application-model/) behind an HTTP API.

The Ragen client is instantiated at module scope so it is reused across warm invocations.

## Prerequisites

- A Ragen API token and an Assistant ID — see the [Ragen docs](https://docs.ragen.ai/).
- Node 20.
- For deployment: the [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html) and AWS credentials with permission to create Lambda + API Gateway resources.

## Setup

```bash
npm install
cp .env.example .env       # used by the local invoker only
```

Fill in `.env`:

```dotenv
RAGEN_API_KEY="sk-..."
RAGEN_ASSISTANT_ID="..."
```

## Run locally (no AWS required)

Invokes the handler in-process with a synthetic API Gateway v2 event:

```bash
npm run invoke:local -- "What is our refund policy?"
```

## Build

Bundles `src/handler.ts` into `dist/handler.js` (CommonJS, single file):

```bash
npm run build
```

Or build + zip in one step:

```bash
npm run package   # produces dist/function.zip
```

## Deploy with AWS SAM

`template.yaml` defines an HTTP API that proxies `POST /ask` to the function and injects your Ragen credentials as environment variables.

```bash
npm run build
sam deploy --guided \
  --parameter-overrides \
    RagenApiKey="sk-..." \
    RagenAssistantId="..."
```

After deploy, SAM prints the `ApiEndpoint` output. Test it:

```bash
curl -X POST "$ApiEndpoint" \
  -H 'content-type: application/json' \
  -d '{"question":"What is our refund policy?"}'
```

> ⚠️ Storing secrets as plain Lambda env vars is fine for demos; for production prefer [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/) or [SSM Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html) and load them at cold-start.

## How it works

- `src/handler.ts` — Lambda handler. Validates the JSON body, calls `ragen.chat.completions.create`, and returns an HTTP API Gateway v2 response.
- `src/local.ts` — invokes the handler with a synthetic event for local development.
- `template.yaml` — SAM template: HTTP API + Lambda function with env vars.

## Learn more

- [Ragen documentation](https://docs.ragen.ai/)
- [`@ragenai/sdk` on npm](https://www.npmjs.com/package/@ragenai/sdk)
- [AWS SAM developer guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/)
