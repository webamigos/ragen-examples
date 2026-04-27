import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Ragen } from "@ragenai/sdk";
import { RagenController } from "./ragen.controller";
import { RagenService } from "./ragen.service";

export const RAGEN_CLIENT = "RAGEN_CLIENT";

@Module({
  controllers: [RagenController],
  providers: [
    {
      provide: RAGEN_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        new Ragen({ apiKey: config.getOrThrow<string>("RAGEN_API_KEY") }),
    },
    RagenService,
  ],
  exports: [RagenService],
})
export class RagenModule {}
