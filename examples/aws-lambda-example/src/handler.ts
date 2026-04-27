import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { Ragen } from "@ragenai/sdk";

// Instantiate the client outside the handler so it is reused across warm
// invocations of the same Lambda container.
const ragen = new Ragen({ apiKey: process.env.RAGEN_API_KEY });

const json = (statusCode: number, body: unknown): APIGatewayProxyResultV2 => ({
  statusCode,
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
});

export const handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
  let payload: { question?: unknown };
  try {
    payload = event.body ? JSON.parse(event.body) : {};
  } catch {
    return json(400, { error: "Request body must be valid JSON." });
  }

  const question = payload.question;
  if (typeof question !== "string" || !question.trim()) {
    return json(400, { error: "Body must include a non-empty 'question' string." });
  }

  try {
    const completion = await ragen.chat.completions.create({
      assistantId: process.env.RAGEN_ASSISTANT_ID,
      messages: [{ role: "user", content: question }],
    });
    return json(200, {
      answer: completion.choices?.[0]?.message?.content ?? null,
      raw: completion,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return json(500, { error: message });
  }
};
