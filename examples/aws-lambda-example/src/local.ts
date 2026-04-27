import "dotenv/config";
import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { handler } from "./handler.js";

const question = process.argv.slice(2).join(" ") || "What is our refund policy?";

const event = {
  version: "2.0",
  routeKey: "POST /ask",
  rawPath: "/ask",
  rawQueryString: "",
  headers: { "content-type": "application/json" },
  requestContext: {} as APIGatewayProxyEventV2["requestContext"],
  body: JSON.stringify({ question }),
  isBase64Encoded: false,
} as unknown as APIGatewayProxyEventV2;

handler(event).then((result) => {
  console.log(JSON.stringify(result, null, 2));
});
