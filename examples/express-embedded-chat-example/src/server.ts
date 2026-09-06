import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { Ragen, type ReasoningEffort } from "@webamigos/ragen-sdk-ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
// The page context rides along in the request body, so the 100kb default is
// too tight: 20,000 characters of non-Latin text can exceed it on their own.
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "..", "public")));

const ragen = new Ragen({ apiKey: process.env.RAGEN_API_KEY });

// Limits the API enforces. Checking them here turns a 400 the visitor can do
// nothing about into either a clear message or a silently shorter context.
const MAX_CONTENT = 10_000;
const MAX_CONTEXT = 20_000;

const REASONING_EFFORTS = ["low", "medium", "high"] as const;

function asReasoningEffort(value: unknown): ReasoningEffort | undefined {
  return REASONING_EFFORTS.includes(value as ReasoningEffort)
    ? (value as ReasoningEffort)
    : undefined;
}

// Server-Sent Events over POST: GET would put the whole page into the query
// string, and `context` alone can be 20,000 characters. That rules out
// `EventSource` (GET-only), so the browser reads the stream via `fetch`.
app.post("/chat", async (req, res) => {
  const content = typeof req.body?.content === "string" ? req.body.content.trim() : "";
  if (!content) {
    return res.status(400).json({ error: "Body must include a non-empty 'content' string." });
  }
  if (content.length > MAX_CONTENT) {
    return res
      .status(400)
      .json({ error: `'content' must be at most ${MAX_CONTENT} characters.` });
  }

  const rawContext = typeof req.body?.context === "string" ? req.body.context : "";
  // Truncating beats rejecting: the visitor still gets an answer, grounded in
  // the first 20,000 characters of the page they are reading.
  const context = rawContext.slice(0, MAX_CONTEXT) || undefined;

  res.status(200);
  res.setHeader("content-type", "text/event-stream");
  res.setHeader("cache-control", "no-cache, no-transform");
  res.setHeader("connection", "keep-alive");
  // Disable proxy buffering (e.g. nginx) so events arrive immediately.
  res.setHeader("x-accel-buffering", "no");
  res.flushHeaders();

  const controller = new AbortController();
  // Listen on the *response*, not the request. `express.json()` consumes the
  // body, which completes the request stream and fires `req`'s "close" straight
  // away — aborting the Ragen call before it has streamed a single event.
  res.on("close", () => {
    if (!res.writableEnded) controller.abort();
  });

  const writeEvent = (event: string, data: unknown) => {
    // JSON keeps every payload on a single `data:` line, so newlines inside an
    // answer survive without the multi-line SSE framing dance.
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const events = ragen.chat.sendStream(
      {
        assistantId: process.env.RAGEN_ASSISTANT_ID,
        content,
        context,
        reasoning_effort: asReasoningEffort(req.body?.reasoning_effort),
      },
      { signal: controller.signal },
    );

    for await (const event of events) {
      // Keeping these apart is the whole point of `sendStream()`. Concatenating
      // both would drop the model's thinking straight into the answer.
      if (event.type === "text") {
        writeEvent("text", { text: event.text });
      } else {
        writeEvent("reasoning", { reasoning: event.reasoning });
      }
    }
    writeEvent("done", {});
  } catch (err) {
    if (!controller.signal.aborted) {
      const message = err instanceof Error ? err.message : "Unknown error";
      writeEvent("error", { message });
    }
  } finally {
    res.end();
  }
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Ragen example listening on http://localhost:${port}`);
});
