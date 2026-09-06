import "dotenv/config";
import Fastify from "fastify";
import { Ragen } from "@webamigos/ragen-sdk-ts";

const app = Fastify({ logger: true });
const ragen = new Ragen({ apiKey: process.env.RAGEN_API_KEY });

app.get("/", async (_req, reply) => {
  reply.type("text/html").send(`
    <h1>Ragen Fastify example</h1>
    <p>POST <code>/ask</code> with JSON <code>{"question": "..."}</code>, or try:</p>
    <pre>curl -X POST http://localhost:3000/ask \\
  -H 'content-type: application/json' \\
  -d '{"question":"What is our refund policy?"}'</pre>
  `);
});

app.post<{ Body: { question: string } }>(
  "/ask",
  {
    schema: {
      body: {
        type: "object",
        required: ["question"],
        properties: { question: { type: "string", minLength: 1 } },
      },
    },
  },
  async (req, reply) => {
    const { question } = req.body;

    try {
      const completion = await ragen.chat.completions.create({
        assistantId: process.env.RAGEN_ASSISTANT_ID,
        messages: [{ role: "user", content: question }],
      });
      return {
        answer: completion.choices?.[0]?.message?.content ?? null,
        raw: completion,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      reply.code(500);
      return { error: message };
    }
  },
);

const port = Number(process.env.PORT) || 3000;
app.listen({ port, host: "0.0.0.0" }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
