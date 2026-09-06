import "dotenv/config";
import express from "express";
import { Ragen } from "@webamigos/ragen-sdk-ts";

const app = express();
app.use(express.json());

const ragen = new Ragen({ apiKey: process.env.RAGEN_API_KEY });

app.get("/", (_req, res) => {
  res.type("html").send(`
    <h1>Ragen Express example</h1>
    <p>POST <code>/ask</code> with JSON <code>{"question": "..."}</code>, or try:</p>
    <pre>curl -X POST http://localhost:3000/ask \\
  -H 'content-type: application/json' \\
  -d '{"question":"What is our refund policy?"}'</pre>
  `);
});

app.post("/ask", async (req, res) => {
  const question = req.body?.question;
  if (typeof question !== "string" || !question.trim()) {
    return res.status(400).json({ error: "Body must include a non-empty 'question' string." });
  }

  try {
    const completion = await ragen.chat.completions.create({
      assistantId: process.env.RAGEN_ASSISTANT_ID,
      messages: [{ role: "user", content: question }],
    });
    res.json({
      answer: completion.choices?.[0]?.message?.content ?? null,
      raw: completion,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Ragen example listening on http://localhost:${port}`);
});
