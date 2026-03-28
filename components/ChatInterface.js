"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import VoiceInput from "./VoiceInput";

const RATING_CONFIG = {
  strong: {
    label: "Strong",
    pillBg: "#1A7A4A",
    pillText: "#FFFFFF",
    cardBorder: "#1A7A4A",
    cardBg: "#F2FAF6",
  },
  decent: {
    label: "Decent",
    pillBg: "#D4940A",
    pillText: "#FFFFFF",
    cardBorder: "#D4940A",
    cardBg: "#FDFAF0",
  },
  needs_work: {
    label: "Needs Work",
    pillBg: "#E8603C",
    pillText: "#FFFFFF",
    cardBorder: "#E8603C",
    cardBg: "#FDF4F1",
  },
};

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function parseCoachResponse(text) {
  return escapeHtml(text).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

function Message({ msg, index }) {
  const style = {
    animation: "fade-up 0.25s ease-out forwards",
    animationDelay: `${index * 30}ms`,
    opacity: 0,
  };

  if (msg.role === "scenario") {
    return (
      <div className="mb-7" style={style}>
        <div className="flex items-center gap-3 mb-3">
          <span
            className="font-mono text-xs font-medium tracking-widest uppercase px-2 py-0.5"
            style={{ color: "#2D4CC8", background: "rgba(45,76,200,0.08)", border: "1px solid rgba(45,76,200,0.15)" }}
          >
            Scenario
          </span>
          <div className="flex-1 h-px" style={{ background: "#E8E8F0" }} />
        </div>
        <div
          className="px-5 py-4"
          style={{
            background: "#FFFFFF",
            border: "1.5px solid #E8E8F0",
            boxShadow: "0 1px 4px 0 rgba(26,26,46,0.06), 0 4px 16px 0 rgba(26,26,46,0.04)",
          }}
        >
          <p className="font-sans text-base leading-relaxed" style={{ color: "#1A1A2E" }}>
            {msg.content}
          </p>
        </div>
      </div>
    );
  }

  if (msg.role === "user") {
    return (
      <div className="mb-5 flex justify-end" style={style}>
        <div
          className="max-w-[76%] px-4 py-3"
          style={{ background: "#2D4CC8", boxShadow: "0 4px 14px 0 rgba(45,76,200,0.22)" }}
        >
          <p className="font-sans text-sm leading-relaxed italic" style={{ color: "#FFFFFF" }}>
            {msg.content}
          </p>
        </div>
      </div>
    );
  }

  if (msg.role === "coach") {
    const cfg = RATING_CONFIG[msg.rating] || RATING_CONFIG.decent;
    return (
      <div
        className="mb-7 px-5 py-5"
        style={{
          background: cfg.cardBg,
          border: `1px solid ${cfg.cardBorder}22`,
          borderLeft: `4px solid ${cfg.cardBorder}`,
          boxShadow: "0 2px 8px 0 rgba(26,26,46,0.06)",
          ...style,
        }}
      >
        <div className="mb-3">
          <span
            className="font-mono text-xs font-bold tracking-widest uppercase px-3 py-1"
            style={{ background: cfg.pillBg, color: cfg.pillText }}
          >
            {cfg.label}
          </span>
        </div>
        <div
          className="font-sans text-sm leading-relaxed coach-response"
          style={{ color: "#1A1A2E" }}
          dangerouslySetInnerHTML={{ __html: parseCoachResponse(msg.content) }}
        />
      </div>
    );
  }

  if (msg.role === "loading") {
    return (
      <div className="mb-7 px-5 py-4" style={{ background: "#FFFFFF", border: "1.5px solid #E8E8F0" }}>
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: "#2D4CC8", animationDelay: "0ms" }} />
            <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: "#E8603C", animationDelay: "150ms" }} />
            <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: "#D4940A", animationDelay: "300ms" }} />
          </div>
          <span className="font-sans text-sm" style={{ color: "#6B6B8A" }}>Evaluating your response…</span>
        </div>
      </div>
    );
  }

  return null;
}

export default function ChatInterface({ weekNumber, activeScenario, onRatingUpdate }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasScenario, setHasScenario] = useState(false);
  const [awaitingNext, setAwaitingNext] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const conversationHistoryRef = useRef([]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  }, [input]);

  useEffect(() => {
    if (activeScenario) loadScenario(activeScenario);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- loadScenario is intentionally excluded; weekNumber covers its dependency
  }, [activeScenario, weekNumber]);

  async function loadScenario(scenarioId) {
    setLoading(true);
    setMessages([]);
    conversationHistoryRef.current = [];
    setHasScenario(false);
    setAwaitingNext(false);

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "scenario", weekNumber, scenarioId }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || `HTTP ${res.status}`);
      const scenarioMsg = { role: "scenario", content: data.content };
      setMessages([scenarioMsg]);
      conversationHistoryRef.current = [
        { role: "user", content: `[Scenario]: ${data.content}` },
      ];
      setHasScenario(true);
    } catch (e) {
      setMessages([{ role: "scenario", content: `Error: ${e.message}. Check your API key in .env.local and restart the server.` }]);
    }
    setLoading(false);
  }

  async function handleSubmit(e, directText) {
    e?.preventDefault();
    const text = (directText || input).trim();
    if (!text || loading || !hasScenario) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }, { role: "loading" }]);
    setLoading(true);

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "evaluate",
          weekNumber,
          userMessage: text,
          conversationHistory: conversationHistoryRef.current,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || `HTTP ${res.status}`);

      conversationHistoryRef.current = [
        ...conversationHistoryRef.current,
        { role: "user", content: text },
        { role: "assistant", content: data.content },
      ];

      setMessages((prev) => {
        const without = prev.filter((m) => m.role !== "loading");
        return [...without, { role: "coach", content: data.content, rating: data.rating }];
      });

      onRatingUpdate(data.rating);
      setAwaitingNext(true);
    } catch (e) {
      setMessages((prev) => [
        ...prev.filter((m) => m.role !== "loading"),
        { role: "coach", content: `Error: ${e.message}`, rating: "needs_work" },
      ]);
    }
    setLoading(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="flex flex-col h-full" style={{ background: "#FAFAF7" }}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-7">
        {messages.length === 0 && !loading && (
          <div
            className="flex flex-col items-center justify-center h-full text-center gap-4"
            style={{ animation: "fade-up 0.3s ease-out forwards" }}
          >
            <div
              className="font-display font-bold text-2xl italic"
              style={{ color: "#1A1A2E" }}
            >
              Pick a scenario to begin
            </div>
            <div
              className="font-sans text-sm max-w-xs leading-relaxed"
              style={{ color: "#6B6B8A" }}
            >
              Claude will put you in a real meeting moment. Respond as if you&apos;re actually in the room — no prep, no polish.
            </div>
          </div>
        )}
        {messages.length === 0 && loading && (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="flex gap-2">
              <span className="w-2.5 h-2.5 rounded-full animate-bounce" style={{ background: "#2D4CC8", animationDelay: "0ms" }} />
              <span className="w-2.5 h-2.5 rounded-full animate-bounce" style={{ background: "#E8603C", animationDelay: "150ms" }} />
              <span className="w-2.5 h-2.5 rounded-full animate-bounce" style={{ background: "#D4940A", animationDelay: "300ms" }} />
            </div>
            <div className="font-sans text-sm" style={{ color: "#6B6B8A" }}>Setting up your scenario…</div>
          </div>
        )}
        {messages.map((msg, i) => (
          <Message key={i} msg={msg} index={i} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div
        className="px-4 py-3"
        style={{ background: "#FFFFFF", borderTop: "1.5px solid #E8E8F0" }}
      >
        {awaitingNext ? (
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => loadScenario(activeScenario)}
              className="flex items-center gap-2 px-5 py-2.5 font-sans text-sm font-semibold transition-all"
              style={{
                background: "#2D4CC8",
                color: "#FFFFFF",
                boxShadow: "0 4px 14px 0 rgba(45,76,200,0.25)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#1E3694"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#2D4CC8"; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
              Next Scenario
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex items-end gap-2">
            <VoiceInput
              disabled={loading || !hasScenario}
              onTranscript={(text, isFinal) => {
                setInput(text);
                if (isFinal && text.trim()) handleSubmit(null, text);
              }}
            />
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading || !hasScenario}
              placeholder={
                !hasScenario
                  ? "Select a scenario to start…"
                  : "Type your response… (Enter to submit, Shift+Enter for newline)"
              }
              rows={1}
              className="flex-1 font-sans text-sm resize-none focus:outline-none disabled:opacity-40 min-h-[44px] max-h-[160px] leading-relaxed px-4 py-2.5 transition-all"
              style={{
                background: "#FAFAF7",
                color: "#1A1A2E",
                border: "1.5px solid #E8E8F0",
                outline: "none",
              }}
              onFocus={(e) => { e.target.style.borderColor = "#2D4CC8"; }}
              onBlur={(e) => { e.target.style.borderColor = "#E8E8F0"; }}
            />
            {hasScenario && !loading && (
              <button
                type="button"
                onClick={() => loadScenario(activeScenario)}
                title="Skip this scenario"
                className="flex items-center justify-center w-10 h-10 font-sans text-sm transition-all shrink-0"
                style={{
                  background: "transparent",
                  color: "#6B6B8A",
                  border: "1.5px solid #E8E8F0",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#2D4CC8"; e.currentTarget.style.color = "#2D4CC8"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E8E8F0"; e.currentTarget.style.color = "#6B6B8A"; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 4 15 12 5 20 5 4" />
                  <line x1="19" y1="5" x2="19" y2="19" />
                </svg>
              </button>
            )}
            <button
              type="submit"
              disabled={loading || !input.trim() || !hasScenario}
              className="flex items-center justify-center w-10 h-10 font-sans font-semibold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
              style={{
                background: "#E8603C",
                color: "#FFFFFF",
                boxShadow: "0 4px 14px 0 rgba(232,96,60,0.30)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#D4522F"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#E8603C"; }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
