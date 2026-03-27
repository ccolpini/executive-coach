"use client";

import { SCENARIOS } from "@/lib/curriculum";

export default function ScenarioButtons({ onSelect, activeScenario }) {
  return (
    <div className="flex items-center gap-2 flex-wrap px-6 py-3 bg-brand-surface border-b border-brand-border">
      <span className="font-mono text-xs font-medium tracking-widest uppercase mr-1" style={{ color: "#6B6B8A" }}>
        Scenario
      </span>
      {SCENARIOS.map((s) => {
        const isActive = activeScenario === s.id;
        return (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            title={s.description}
            className="px-3.5 py-1.5 font-sans text-xs font-semibold transition-all"
            style={{
              background: isActive ? "#2D4CC8" : "transparent",
              color: isActive ? "#FFFFFF" : "#2D4CC8",
              border: "1.5px solid #2D4CC8",
              boxShadow: isActive ? "0 4px 14px 0 rgba(45,76,200,0.25)" : "none",
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = "rgba(45,76,200,0.06)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = "transparent";
              }
            }}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}
