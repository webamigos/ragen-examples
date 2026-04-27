import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { ragenModel } from "@/lib/ragen-provider";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: ragenModel,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
