import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Ragen } from "@webamigos/ragen-sdk-ts";
import { RAGEN_CLIENT } from "./ragen.module";

@Injectable()
export class RagenService {
  constructor(
    @Inject(RAGEN_CLIENT) private readonly ragen: Ragen,
    private readonly config: ConfigService,
  ) {}

  async ask(question: string) {
    const completion = await this.ragen.chat.completions.create({
      assistantId: this.config.getOrThrow<string>("RAGEN_ASSISTANT_ID"),
      messages: [{ role: "user", content: question }],
    });

    return {
      answer: completion.choices?.[0]?.message?.content ?? null,
      raw: completion,
    };
  }
}
