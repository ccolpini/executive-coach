"use client";

import { motion } from "framer-motion";
import { SCENARIOS } from "@/lib/curriculum";

export default function ScenarioButtons({ onSelect, activeScenario }) {
  return (
    <div
      className="flex items-center gap-2 flex-wrap px-4 sm:px-6 py-3"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <span className="font-mono text-xs font-medium tracking-widest uppercase mr-1" style={{ color: "#5a6578" }}>
        Scenario
      </span>
      {SCENARIOS.map((s) => {
        const isActive = activeScenario === s.id;
        return (
          <motion.button
            key={s.id}
            onClick={() => onSelect(s.id)}
            title={s.description}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-3.5 py-1.5 rounded-full font-sans text-xs font-semibold transition-colors"
            style={{
              background: isActive
                ? "linear-gradient(135deg, #7B2FFF, #00D4FF)"
                : "rgba(255,255,255,0.05)",
              color: isActive ? "#FFFFFF" : "#a0aec0",
              border: isActive
                ? "1px solid rgba(123,47,255,0.4)"
                : "1px solid rgba(255,255,255,0.08)",
              boxShadow: isActive ? "0 4px 20px rgba(123,47,255,0.25)" : "none",
            }}
          >
            {s.label}
          </motion.button>
        );
      })}
    </div>
  );
}
