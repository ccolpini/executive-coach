"use client";

import { useState, useRef, useEffect, memo, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VoiceInput from "./VoiceInput";

const API_ENDPOINT = "/api/coach";
const MAX_INPUT_LENGTH = 2000;

const RATING_CONFIG = {
  strong: {
    label: "Strong",
    gradient: "linear-gradient(135deg, #7B2FFF, #00D4FF)",
    borderColor: "#7B2FFF",
    glowColor: "rgba(123,47,255,0.15)",
    shadow: "0 4px 20px rgba(123,47,255,0.2)",
  },
  decent: {
    label: "Decent",
    gradient: "linear-gradient(135deg, #00D4FF, #00D4FF)",
    borderColor: "#00D4FF",
    glowColor: "rgba(0,212,255,0.1)",
    shadow: "0 4px 20px rgba(0,212,255,0.15)",
  },
  needs_work: {
    label: "Needs Work",
    gradient: "linear-gradient(135deg, #FF4D8D, #FF4D8D)",
    borderColor: "#FF4D8D",
    glowColor: "rgba(255,77,141,0.1)",
    shadow: "0 4px 20px rgba(255,77,141,0.15)",
  },
};

function SafeMarkdown({ text }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
      )}
    </>
  );
}

const messageVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.35, ease: "easeOut" },
  }),
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const coachCardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

let nextMsgId = 0;
function msgId() { return ++nextMsgId; }

const Message = memo(function Message({ msg, index }) {
  if (msg.role === "scenario") {
    return (
      <motion.div
        className="mb-7"
        custom={index}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={messageVariants}
      >
        <div className="flex items-center gap-3 mb-3">
          <span
            className="font-mono text-xs font-medium tracking-widest uppercase px-2.5 py-1 rounded-full"
            style={{ color: "#00D4FF", background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)" }}
          >
            Scenario
          </span>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
        </div>
        <div
          className="px-5 py-4 rounded-xl gradient-mesh"
          style={{
            border: "1px solid rgba(255,255,255,0.1)",
            borderTop: "2px solid #00D4FF",
          }}
        >
          <p className="font-sans text-base leading-relaxed text-white">
            {msg.content}
          </p>
        </div>
      </motion.div>
    );
  }

  if (msg.role === "user") {
    return (
      <motion.div
        className="mb-5 flex justify-end"
        custom={index}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={messageVariants}
      >
        <div
          className="max-w-[76%] px-4 py-3 rounded-xl"
          style={{
            background: "linear-gradient(135deg, #7B2FFF, #5a1fd6)",
            boxShadow: "0 4px 20px rgba(123,47,255,0.25)",
          }}
        >
          <p className="font-sans text-sm leading-relaxed text-white">
            {msg.content}
          </p>
        </div>
      </motion.div>
    );
  }

  if (msg.role === "coach") {
    const cfg = RATING_CONFIG[msg.rating] || RATING_CONFIG.decent;
    return (
      <motion.div
        className="mb-7 px-5 py-5 rounded-xl"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={coachCardVariants}
        style={{
          background: cfg.glowColor,
          border: `1px solid rgba(255,255,255,0.08)`,
          borderTop: `2px solid ${cfg.borderColor}`,
          boxShadow: cfg.shadow,
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="mb-3">
          <span
            className="font-mono text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full inline-block"
            style={{ background: cfg.gradient, color: "#FFFFFF" }}
          >
            {cfg.label}
          </span>
        </div>
        <div
          className="font-sans text-sm leading-relaxed coach-response"
          style={{ color: "#a0aec0" }}
        >
          <SafeMarkdown text={msg.content} />
        </div>
      </motion.div>
    );
  }

  if (msg.role === "loading") {
    return (
      <motion.div
        className="mb-7 px-5 py-4 rounded-xl glass"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
      >
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: "#7B2FFF", animationDelay: "0ms" }} />
            <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: "#00D4FF", animationDelay: "150ms" }} />
            <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: "#FF4D8D", animationDelay: "300ms" }} />
          </div>
          <span className="font-sans text-sm" style={{ color: "#5a6578" }}>Evaluating your response…</span>
        </div>
      </motion.div>
    );
  }

  return null;
});

async function fetchWithRetry(url, options, { retries = 2, baseDelay = 1000 } = {}) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(url, options);
    if (res.ok || res.status < 500 || attempt === retries) return res;
    await new Promise((r) => setTimeout(r, baseDelay * 2 ** attempt));
  }
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
  const abortControllerRef = useRef(null);

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

  useEffect(() => {
    return () => abortControllerRef.current?.abort();
  }, []);

  async function loadScenario(scenarioId) {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setMessages([]);
    conversationHistoryRef.current = [];
    setHasScenario(false);
    setAwaitingNext(false);

    try {
      const res = await fetchWithRetry(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "scenario", weekNumber, scenarioId }),
        signal: controller.signal,
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || `HTTP ${res.status}`);
      if (controller.signal.aborted) return;
      const scenarioMsg = { id: msgId(), role: "scenario", content: data.content };
      setMessages([scenarioMsg]);
      conversationHistoryRef.current = [
        { role: "user", content: `[Scenario]: ${data.content}` },
      ];
      setHasScenario(true);
    } catch (e) {
      if (e.name === "AbortError") return;
      setMessages([{ id: msgId(), role: "scenario", content: `Error: ${e.message}. Check your API key in .env.local and restart the server.` }]);
    }
    setLoading(false);
  }

  async function handleSubmit(e, directText) {
    e?.preventDefault();
    const text = (directText || input).trim();
    if (!text || loading || !hasScenario) return;

    setInput("");
    const userMsgId = msgId();
    const loadingMsgId = msgId();
    setMessages((prev) => [...prev, { id: userMsgId, role: "user", content: text }, { id: loadingMsgId, role: "loading" }]);
    setLoading(true);

    try {
      const res = await fetchWithRetry(API_ENDPOINT, {
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
        return [...without, { id: msgId(), role: "coach", content: data.content, rating: data.rating }];
      });

      onRatingUpdate(data.rating);
      setAwaitingNext(true);
    } catch (e) {
      setMessages((prev) => [
        ...prev.filter((m) => m.role !== "loading"),
        { id: msgId(), role: "coach", content: `Error: ${e.message}`, rating: "needs_work" },
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
    <div className="flex flex-col h-full" style={{ background: "#0a0d1a" }}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-7">
        {messages.length === 0 && !loading && (
          <motion.div
            className="flex flex-col items-center justify-center h-full text-center gap-5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, rgba(123,47,255,0.2), rgba(0,212,255,0.2))", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7B2FFF" />
                    <stop offset="100%" stopColor="#00D4FF" />
                  </linearGradient>
                </defs>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div className="font-display font-bold text-2xl gradient-text-purple">
              Pick a scenario to begin
            </div>
            <div
              className="font-sans text-sm max-w-sm leading-relaxed"
              style={{ color: "#5a6578" }}
            >
              Claude will put you in a real meeting moment. Respond as if you&apos;re actually in the room — no prep, no polish.
            </div>
          </motion.div>
        )}
        {messages.length === 0 && loading && (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="flex gap-2">
              <span className="w-2.5 h-2.5 rounded-full animate-bounce" style={{ background: "#7B2FFF", animationDelay: "0ms" }} />
              <span className="w-2.5 h-2.5 rounded-full animate-bounce" style={{ background: "#00D4FF", animationDelay: "150ms" }} />
              <span className="w-2.5 h-2.5 rounded-full animate-bounce" style={{ background: "#FF4D8D", animationDelay: "300ms" }} />
            </div>
            <div className="font-sans text-sm" style={{ color: "#5a6578" }}>Setting up your scenario…</div>
          </div>
        )}
        <AnimatePresence mode="popLayout">
          {messages.map((msg, i) => (
            <Message key={msg.id} msg={msg} index={i} />
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div
        className="px-4 py-3 glass"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        {awaitingNext ? (
          <div className="flex items-center justify-center gap-3">
            <motion.button
              onClick={() => loadScenario(activeScenario)}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full font-sans text-sm font-semibold"
              style={{
                background: "linear-gradient(135deg, #7B2FFF, #00D4FF)",
                color: "#FFFFFF",
                boxShadow: "0 4px 20px rgba(123,47,255,0.3)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
              Next Scenario
            </motion.button>
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
              maxLength={MAX_INPUT_LENGTH}
              aria-label="Your response to the scenario"
              placeholder={
                !hasScenario
                  ? "Select a scenario to start…"
                  : "Type your response… (Enter to submit, Shift+Enter for newline)"
              }
              rows={1}
              className="flex-1 font-sans text-sm resize-none focus:outline-none disabled:opacity-30 min-h-[44px] max-h-[160px] leading-relaxed px-4 py-2.5 rounded-xl transition-all"
              style={{
                background: "rgba(255,255,255,0.05)",
                color: "#FFFFFF",
                border: "1px solid rgba(255,255,255,0.08)",
                outline: "none",
              }}
              onFocus={(e) => { e.target.style.borderColor = "rgba(123,47,255,0.5)"; e.target.style.boxShadow = "0 0 0 2px rgba(123,47,255,0.1)"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
            />
            {hasScenario && !loading && (
              <motion.button
                type="button"
                onClick={() => loadScenario(activeScenario)}
                aria-label="Skip this scenario"
                title="Skip this scenario"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center w-10 h-10 rounded-xl font-sans text-sm transition-all shrink-0"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  color: "#5a6578",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 4 15 12 5 20 5 4" />
                  <line x1="19" y1="5" x2="19" y2="19" />
                </svg>
              </motion.button>
            )}
            <motion.button
              type="submit"
              disabled={loading || !input.trim() || !hasScenario}
              aria-label="Submit response"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center w-10 h-10 rounded-xl font-sans font-semibold text-sm transition-all disabled:opacity-20 disabled:cursor-not-allowed shrink-0"
              style={{
                background: "linear-gradient(135deg, #FF4D8D, #7B2FFF)",
                color: "#FFFFFF",
                boxShadow: "0 4px 20px rgba(255,77,141,0.3)",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </motion.button>
          </form>
        )}
      </div>
    </div>
  );
}
