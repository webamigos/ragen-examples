import Link from "next/link";
import { ChatUI } from "./chat-ui";

export default function ChatPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10 font-sans">
      <p className="mb-4 text-sm">
        <Link href="/" className="text-blue-600 hover:underline dark:text-blue-400">
          ← Back
        </Link>
      </p>
      <h1 className="mb-2 text-2xl font-semibold tracking-tight">
        Chat — Vercel AI SDK + Ragen
      </h1>
      <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-400">
        Streaming chat powered by{" "}
        <a
          href="https://ai-sdk.dev/"
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          Vercel AI SDK
        </a>{" "}
        talking to Ragen via its OpenAI-compatible endpoint.
      </p>
      <ChatUI />
    </main>
  );
}
