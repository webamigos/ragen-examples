import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { RagenModule } from "./ragen/ragen.module";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), RagenModule],
})
export class AppModule {}
