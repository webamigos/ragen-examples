import Link from "next/link";
import { AskButton } from "./ask-button";

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10 font-sans">
      <h1 className="mb-2 text-2xl font-semibold tracking-tight">
        @ragenai/sdk — Next.js example
      </h1>
      <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
        Two ways to call Ragen from a Next.js app:
      </p>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-sm">
        <li>
          <strong>Below</strong> — single-shot question via a React server action that calls the Ragen SDK directly.
        </li>
        <li>
          <Link href="/chat" className="text-blue-600 hover:underline dark:text-blue-400">
            /chat
          </Link>{" "}
          — streaming chat UI built with the{" "}
          <a
            href="https://ai-sdk.dev/"
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Vercel AI SDK
          </a>{" "}
          via Ragen&apos;s OpenAI-compatible endpoint.
        </li>
      </ul>
      <AskButton />
    </main>
  );
}
