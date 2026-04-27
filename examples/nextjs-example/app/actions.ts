"use server";

import { Ragen } from "@ragenai/sdk";

export async function askRagen(question: string) {
  const ragen = new Ragen({
    apiKey: process.env.RAGEN_API_KEY,
  });

  const completion = await ragen.chat.completions.create({
    assistantId: process.env.RAGEN_ASSISTANT_ID,
    messages: [{ role: "user", content: question }],
  });

  return completion.choices?.[0]?.message?.content ?? JSON.stringify(completion, null, 2);
}
