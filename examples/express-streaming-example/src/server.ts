import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { Ragen } from "@webamigos/ragen-sdk-ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

const ragen = new Ragen({ apiKey: process.env.RAGEN_API_KEY });

// Server-Sent Events stream: GET /ask?question=...
// Browser can consume this with `new EventSource('/ask?question=...')`.
app.get("/ask", async (req, res) => {
  const question = typeof req.query.question === "string" ? req.query.question : "";
  if (!question.trim()) {
    return res.status(400).json({ error: "Missing 'question' query parameter." });
  }

  res.status(200);
  res.setHeader("content-type", "text/event-stream");
  res.setHeader("cache-control", "no-cache, no-transform");
  res.setHeader("connection", "keep-alive");
  // Disable proxy buffering (e.g. nginx) so chunks arrive immediately.
  res.setHeader("x-accel-buffering", "no");
  res.flushHeaders();

  const controller = new AbortController();
  req.on("close", () => controller.abort());

  const writeEvent = (event: string, data: string) => {
    // SSE: each `data:` line is one chunk; multi-line payloads must be split.
    const payload = data.split("\n").map((line) => `data: ${line}`).join("\n");
    res.write(`event: ${event}\n${payload}\n\n`);
  };

  try {
    const chunks = ragen.chat.completions.stream(
      {
        assistantId: process.env.RAGEN_ASSISTANT_ID,
        messages: [{ role: "user", content: question }],
      },
      { signal: controller.signal },
    );

    for await (const chunk of chunks) {
      const delta = chunk.choices?.[0]?.delta?.content;
      if (delta) writeEvent("delta", delta);
    }
    writeEvent("done", "");
  } catch (err) {
    if (!controller.signal.aborted) {
      const message = err instanceof Error ? err.message : "Unknown error";
      writeEvent("error", message);
    }
  } finally {
    res.end();
  }
});

// Plain chunked text: POST /ask with {"question":"..."}.
app.post("/ask", async (req, res) => {
  const question = req.body?.question;
  if (typeof question !== "string" || !question.trim()) {
    return res.status(400).json({ error: "Body must include a non-empty 'question' string." });
  }

  res.status(200);
  res.setHeader("content-type", "text/plain; charset=utf-8");
  res.setHeader("transfer-encoding", "chunked");
  res.setHeader("x-accel-buffering", "no");

  const controller = new AbortController();
  req.on("close", () => controller.abort());

  try {
    const chunks = ragen.chat.completions.stream(
      {
        assistantId: process.env.RAGEN_ASSISTANT_ID,
        messages: [{ role: "user", content: question }],
      },
      { signal: controller.signal },
    );

    for await (const chunk of chunks) {
      const delta = chunk.choices?.[0]?.delta?.content;
      if (delta) res.write(delta);
    }
  } catch (err) {
    if (!controller.signal.aborted) {
      const message = err instanceof Error ? err.message : "Unknown error";
      res.write(`\n[error] ${message}`);
    }
  } finally {
    res.end();
  }
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Ragen example listening on http://localhost:${port}`);
});
