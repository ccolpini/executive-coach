"use client";

import { useState, useRef, useEffect } from "react";

export default function VoiceInput({ onTranscript, disabled }) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      let finalTranscript = "";

      recognition.onresult = (e) => {
        let interim = "";
        finalTranscript = "";
        for (let i = 0; i < e.results.length; i++) {
          if (e.results[i].isFinal) {
            finalTranscript += e.results[i][0].transcript;
          } else {
            interim += e.results[i][0].transcript;
          }
        }
        onTranscript(finalTranscript + interim, false);
      };

      recognition.onend = () => {
        setListening(false);
        if (finalTranscript) onTranscript(finalTranscript, true);
      };

      recognition.onerror = () => setListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const toggle = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  if (!supported) return null;

  return (
    <button
      onClick={toggle}
      disabled={disabled}
      title={listening ? "Stop recording" : "Voice input"}
      className="flex items-center justify-center w-10 h-10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      style={{
        background: listening ? "#E8603C" : "transparent",
        border: `1.5px solid ${listening ? "#E8603C" : "#E8E8F0"}`,
        color: listening ? "#FFFFFF" : "#6B6B8A",
        animation: listening ? "coral-pulse 1.4s ease-in-out infinite" : "none",
        boxShadow: listening ? "0 4px 14px 0 rgba(232,96,60,0.35)" : "none",
      }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
      <style>{`
        @keyframes coral-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(232,96,60,0.4); }
          50% { box-shadow: 0 0 0 8px rgba(232,96,60,0); }
        }
      `}</style>
    </button>
  );
}
