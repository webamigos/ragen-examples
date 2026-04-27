import { Body, Controller, Get, Header, HttpCode, Post } from "@nestjs/common";
import { AskDto } from "./ask.dto";
import { RagenService } from "./ragen.service";

@Controller()
export class RagenController {
  constructor(private readonly ragen: RagenService) {}

  @Get("/")
  @Header("content-type", "text/html")
  index() {
    return `
      <h1>Ragen NestJS example</h1>
      <p>POST <code>/ask</code> with JSON <code>{"question": "..."}</code>, or try:</p>
      <pre>curl -X POST http://localhost:3000/ask \\
  -H 'content-type: application/json' \\
  -d '{"question":"What is our refund policy?"}'</pre>
    `;
  }

  @Post("/ask")
  @HttpCode(200)
  ask(@Body() body: AskDto) {
    return this.ragen.ask(body.question);
  }
}
