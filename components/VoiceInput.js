"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function VoiceInput({ onTranscript, disabled }) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef(null);
  const onTranscriptRef = useRef(onTranscript);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

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
        onTranscriptRef.current(finalTranscript + interim, false);
      };

      recognition.onend = () => {
        setListening(false);
        if (finalTranscript) onTranscriptRef.current(finalTranscript, true);
      };

      recognition.onerror = () => setListening(false);
      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        try { recognitionRef.current.stop(); } catch {}
      }
    };
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
    <motion.button
      onClick={toggle}
      disabled={disabled}
      title={listening ? "Stop recording" : "Voice input"}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center justify-center w-10 h-10 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      style={{
        background: listening
          ? "linear-gradient(135deg, #FF4D8D, #7B2FFF)"
          : "rgba(255,255,255,0.05)",
        border: `1px solid ${listening ? "rgba(255,77,141,0.4)" : "rgba(255,255,255,0.08)"}`,
        color: listening ? "#FFFFFF" : "#5a6578",
        animation: listening ? "pulse-glow 1.4s ease-in-out infinite" : "none",
        boxShadow: listening ? "0 4px 20px rgba(255,77,141,0.3)" : "none",
      }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    </motion.button>
  );
}
