import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

// Ragen exposes an OpenAI-compatible chat completions endpoint, so the
// Vercel AI SDK can talk to it through `@ai-sdk/openai-compatible`.
//
// Ragen requires an `assistantId` field in the request body that the
// OpenAI-compatible provider does not know about, so we inject it via a
// custom `fetch` wrapper.
export const ragenProvider = createOpenAICompatible({
  name: "ragen",
  baseURL: "https://api.ragen.ai/v1",
  apiKey: process.env.RAGEN_API_KEY,
  fetch: async (url, init) => {
    const assistantId = process.env.RAGEN_ASSISTANT_ID;
    if (assistantId && init?.body && typeof init.body === "string") {
      try {
        const parsed = JSON.parse(init.body);
        parsed.assistantId = assistantId;
        init = { ...init, body: JSON.stringify(parsed) };
      } catch {
        // body wasn't JSON — leave it alone
      }
    }
    return fetch(url, init);
  },
});

// Ragen ignores the `model` field; we pass a placeholder so the provider has
// something to send on the wire.
export const ragenModel = ragenProvider("ragen");
