import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { streamSSE, streamText } from "hono/streaming";
import { Ragen } from "@webamigos/ragen-sdk-ts";

const app = new Hono();
const ragen = new Ragen({ apiKey: process.env.RAGEN_API_KEY });

app.get("/", (c) =>
  c.html(`
    <h1>Ragen Hono streaming example</h1>
    <p>Two streaming endpoints:</p>
    <ul>
      <li><code>GET /ask?question=...</code> — Server-Sent Events</li>
      <li><code>POST /ask</code> with <code>{"question":"..."}</code> — chunked plain text</li>
    </ul>
    <pre>curl -N 'http://localhost:3000/ask?question=What%20is%20our%20refund%20policy%3F'</pre>
    <pre>curl -N -X POST http://localhost:3000/ask \\
  -H 'content-type: application/json' \\
  -d '{"question":"What is our refund policy?"}'</pre>
  `),
);

app.get("/ask", (c) => {
  const question = c.req.query("question");
  if (!question) {
    return c.json({ error: "Missing 'question' query parameter." }, 400);
  }

  return streamSSE(c, async (stream) => {
    const chunks = ragen.chat.completions.stream({
      assistantId: process.env.RAGEN_ASSISTANT_ID,
      messages: [{ role: "user", content: question }],
    });

    stream.onAbort(() => {
      // Client disconnected; the SDK iterator will be cleaned up by GC.
    });

    try {
      for await (const chunk of chunks) {
        const delta = chunk.choices?.[0]?.delta?.content;
        if (delta) {
          await stream.writeSSE({ event: "delta", data: delta });
        }
      }
      await stream.writeSSE({ event: "done", data: "" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      await stream.writeSSE({ event: "error", data: message });
    }
  });
});

app.post("/ask", async (c) => {
  const body = await c.req.json().catch(() => null);
  const question = body?.question;
  if (typeof question !== "string" || !question.trim()) {
    return c.json({ error: "Body must include a non-empty 'question' string." }, 400);
  }

  return streamText(c, async (stream) => {
    const chunks = ragen.chat.completions.stream({
      assistantId: process.env.RAGEN_ASSISTANT_ID,
      messages: [{ role: "user", content: question }],
    });

    try {
      for await (const chunk of chunks) {
        const delta = chunk.choices?.[0]?.delta?.content;
        if (delta) await stream.write(delta);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      await stream.write(`\n[error] ${message}`);
    }
  });
});

const port = Number(process.env.PORT) || 3000;
serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Ragen example listening on http://localhost:${info.port}`);
});
