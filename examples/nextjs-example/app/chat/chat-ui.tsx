"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export function ChatUI() {
  const { messages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  const [input, setInput] = useState("");
  const isStreaming = status === "submitted" || status === "streaming";

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isStreaming) return;
    sendMessage({ text });
    setInput("");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex min-h-[200px] flex-col gap-3 rounded-lg border border-black/10 bg-black/[0.02] p-3 dark:border-white/10 dark:bg-white/[0.04]">
        {messages.length === 0 && (
          <p className="m-0 text-sm text-neutral-500">
            Ask anything about your assistant&apos;s knowledge.
          </p>
        )}
        {messages.map((m) => (
          <div key={m.id} className="text-sm leading-relaxed">
            <strong className={m.role === "user" ? "text-blue-600 dark:text-blue-400" : "text-emerald-600 dark:text-emerald-400"}>
              {m.role === "user" ? "You" : "Ragen"}:
            </strong>{" "}
            {m.parts.map((part, i) =>
              part.type === "text" ? <span key={i}>{part.text}</span> : null,
            )}
          </div>
        ))}
        {error && (
          <pre className="m-0 whitespace-pre-wrap text-sm text-red-600 dark:text-red-400">
            {error.message}
          </pre>
        )}
      </div>

      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message…"
          disabled={isStreaming}
          className="flex-1 rounded-md border border-black/20 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 disabled:opacity-50 dark:border-white/20 dark:bg-neutral-900"
        />
        <button
          type="submit"
          disabled={isStreaming || !input.trim()}
          className="rounded-md border border-black/20 bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
        >
          {isStreaming ? "…" : "Send"}
        </button>
        {isStreaming && (
          <button
            type="button"
            onClick={() => stop()}
            className="rounded-md border border-black/20 px-4 py-2 text-sm font-medium transition hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
          >
            Stop
          </button>
        )}
      </form>
    </div>
  );
}
