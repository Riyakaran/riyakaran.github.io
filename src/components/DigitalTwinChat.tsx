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
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 border border-accent/60 bg-ink px-5 py-3 font-mono text-xs uppercase tracking-[0.15em] text-accent shadow-[0_0_30px_rgba(214,255,63,0.25)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(214,255,63,0.4)]"
      >
        {!open && (
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
        )}
        {open ? "Close" : "Chat with my Digital Twin"}
      </button>

      {open && (
        <div className="fixed inset-x-4 bottom-24 top-auto z-50 flex h-[70vh] max-h-[560px] flex-col border border-line bg-ink-card shadow-2xl sm:inset-x-auto sm:right-6 sm:w-[400px]">
          <div className="flex items-center justify-between border-b border-line bg-ink-raised px-5 py-4">
            <div>
              <p className="font-display text-sm font-bold text-paper">
                {profile.name}&apos;s Digital Twin
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
                AI · grounded in her real resume
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="text-paper-dim transition-colors hover:text-accent"
            >
              ✕
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            {messages.length === 0 && (
              <div className="space-y-4">
                <p className="text-sm leading-relaxed text-paper-dim">
                  Ask me anything about my roadmaps, my delivery track record, or how I work with
                  AI day to day — I&apos;ll answer as if I were {profile.name}.
                </p>
                <div className="flex flex-col gap-2">
                  {STARTERS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => sendMessage(s)}
                      className="border border-line-strong px-3 py-2 text-left text-xs text-paper-dim transition-colors hover:border-accent hover:text-paper"
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
                  className={`max-w-[85%] whitespace-pre-wrap px-4 py-3 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-accent text-ink"
                      : m.isError
                        ? "border border-line-strong text-muted"
                        : "border border-line bg-ink-raised text-paper"
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
            className="flex items-center gap-2 border-t border-line p-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about her career..."
              disabled={streaming}
              maxLength={2000}
              className="flex-1 border border-line-strong bg-ink px-3 py-2 text-sm text-paper placeholder:text-muted focus:border-accent focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={streaming || !input.trim()}
              className="border border-line-strong px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] text-paper transition-colors hover:border-accent hover:text-accent disabled:opacity-30 disabled:hover:border-line-strong disabled:hover:text-paper"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
