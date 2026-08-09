"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/resume";

type Message = {
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
};

const STARTERS = [
  "What's your biggest career win?",
  "What does a Technical Product Owner actually do?",
  "How are you using AI in your day-to-day work?",
];

export default function DigitalTwinChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;

    const nextHistory: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages([...nextHistory, { role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextHistory.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = {
            role: "assistant",
            content: data?.error ?? "Something went wrong reaching my Digital Twin. Try again in a moment.",
            isError: true,
          };
          return copy;
        });
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        const snapshot = acc;
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: snapshot };
          return copy;
        });
      }
    } catch {
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          content: "Connection dropped before I could finish. Mind trying that again?",
          isError: true,
        };
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close Digital Twin chat" : "Chat with Digital Twin"}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-coral-solid px-6 py-4 text-sm font-bold text-white shadow-clay-lg transition-[transform,box-shadow] duration-300 ease-bounce hover:-translate-y-1 active:translate-y-0 active:shadow-clay-pressed"
      >
        {!open && (
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
          </span>
        )}
        {open ? "Close" : "Chat with my Digital Twin"}
      </button>

      {open && (
        <div className="reveal fixed inset-x-4 bottom-24 top-auto z-50 flex h-[70vh] max-h-[560px] flex-col overflow-hidden rounded-3xl bg-surface shadow-clay-lg sm:inset-x-auto sm:right-6 sm:w-[400px]">
          <div className="flex items-center justify-between rounded-t-3xl bg-surface-dim px-5 py-4">
            <div>
              <p className="font-display text-sm font-bold text-ink">
                {profile.name}&apos;s Digital Twin
              </p>
              <p className="text-[11px] font-semibold text-muted">
                AI · grounded in her real resume
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="rounded-full bg-surface p-2 text-ink shadow-clay-sm transition-colors hover:text-coral-text"
            >
              ✕
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            {messages.length === 0 && (
              <div className="space-y-4">
                <p className="text-sm leading-relaxed text-muted">
                  Ask me anything about my roadmaps, my delivery track record, or how I work with
                  AI day to day — I&apos;ll answer as if I were {profile.name}.
                </p>
                <div className="flex flex-col gap-2">
                  {STARTERS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => sendMessage(s)}
                      className="rounded-2xl bg-surface-dim px-3 py-2.5 text-left text-xs font-semibold text-ink shadow-clay-sm transition-colors duration-300 hover:bg-periwinkle/15 hover:text-periwinkle-text"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap px-4 py-3 text-sm leading-relaxed shadow-clay-sm ${
                    m.role === "user"
                      ? "rounded-3xl rounded-br-md bg-coral-solid text-white"
                      : m.isError
                        ? "rounded-3xl rounded-bl-md bg-surface-dim text-muted"
                        : "rounded-3xl rounded-bl-md bg-surface-dim text-ink"
                  }`}
                >
                  {m.content || (
                    <span className="inline-flex gap-1">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current [animation-delay:150ms]" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current [animation-delay:300ms]" />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex items-center gap-2 rounded-b-3xl bg-surface-dim p-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about her career..."
              disabled={streaming}
              maxLength={2000}
              className="flex-1 rounded-full bg-surface px-4 py-2.5 text-sm text-ink shadow-clay-sm placeholder:text-muted focus:shadow-clay focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={streaming || !input.trim()}
              aria-label="Send"
              className="rounded-full bg-coral-solid p-3 text-white shadow-clay-sm transition-[transform,box-shadow] duration-300 ease-bounce hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-40 disabled:shadow-none disabled:hover:translate-y-0"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
