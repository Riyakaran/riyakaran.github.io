"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
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
        className="fixed bottom-6 right-6 z-50 flex h-14 items-center gap-2 rounded-full bg-accent px-6 text-sm font-bold text-white shadow-lift transition-transform duration-200 ease-standard hover:-translate-y-0.5 active:translate-y-0"
      >
        {open ? (
          <X className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
        ) : (
          <MessageCircle className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
        )}
        {open ? "Close" : "Chat with my Digital Twin"}
      </button>

      {open && (
        <div className="reveal fixed inset-x-4 bottom-24 top-auto z-50 flex h-[70vh] max-h-[560px] flex-col overflow-hidden rounded-2xl bg-surface shadow-lift sm:inset-x-auto sm:right-6 sm:w-96">
          <div className="flex items-center justify-between bg-neutral-100 px-5 py-4">
            <div>
              <p className="font-display text-sm font-bold text-neutral-900">
                {profile.name}&apos;s Digital Twin
              </p>
              <p className="text-xs font-semibold text-neutral-600">AI · grounded in her real resume</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-neutral-900 shadow-rest transition-colors duration-150 hover:text-accent"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            {messages.length === 0 && (
              <div className="space-y-4">
                <p className="text-sm text-neutral-600">
                  Ask me anything about my roadmaps, my delivery track record, or how I work with
                  AI day to day — I&apos;ll answer as if I were {profile.name}.
                </p>
                <div className="flex flex-col gap-2">
                  {STARTERS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => sendMessage(s)}
                      className="rounded-2xl bg-neutral-100 px-3 py-3.5 text-left text-xs font-semibold text-neutral-900 transition-colors duration-150 hover:bg-neutral-200"
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
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm ${
                    m.role === "user"
                      ? "bg-accent text-white"
                      : m.isError
                        ? "bg-neutral-100 text-neutral-600"
                        : "bg-neutral-100 text-neutral-900"
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
            className="flex items-center gap-2 bg-neutral-100 p-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about her career..."
              disabled={streaming}
              maxLength={2000}
              aria-label="Ask about Riya's career"
              className="flex-1 rounded-full bg-surface px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
            <button
              type="submit"
              disabled={streaming || !input.trim()}
              aria-label="Send message"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-white shadow-rest transition-transform duration-200 ease-standard hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-40 disabled:hover:translate-y-0"
            >
              <Send className="h-4 w-4" strokeWidth={2} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
