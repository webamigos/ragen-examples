"use client";

import { useState, useTransition } from "react";
import { askRagen } from "./actions";

const QUESTION = "What is our refund policy?";

export function AskButton() {
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    setError(null);
    startTransition(async () => {
      try {
        setAnswer(await askRagen(QUESTION));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      }
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm">
        <strong>Question:</strong> {QUESTION}
      </p>
      <button
        onClick={onClick}
        disabled={isPending}
        className="w-fit rounded-md border border-black/20 bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
      >
        {isPending ? "Asking…" : "Ask Ragen"}
      </button>
      {error && (
        <pre className="m-0 whitespace-pre-wrap text-sm text-red-600 dark:text-red-400">
          {error}
        </pre>
      )}
      {answer && (
        <pre className="m-0 whitespace-pre-wrap rounded-md border border-black/10 bg-black/[0.02] p-3 text-sm dark:border-white/10 dark:bg-white/[0.04]">
          {answer}
        </pre>
      )}
    </div>
  );
}
