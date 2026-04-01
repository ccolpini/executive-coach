"use client";

import { motion } from "framer-motion";
import { CURRICULUM } from "@/lib/curriculum";

const frameworks = [
  { name: "Minto Pyramid Principle", label: "Minto Pyramid", icon: "pyramid", color: "#7B2FFF", weeks: [1, 2, 3, 4] },
  { name: "Decker: Communicate to Influence", label: "Decker", icon: "influence", color: "#00D4FF", weeks: [5, 6, 7, 8] },
  { name: "Gallo: Talk Like TED", label: "Gallo", icon: "ted", color: "#FF4D8D", weeks: [9, 10, 11, 12] },
];

const frameworkIcons = {
  pyramid: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 22 22 22" />
    </svg>
  ),
  influence: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  ),
  ted: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  ),
};

export default function Sidebar({ currentWeek, onWeekChange, allStats = {} }) {
  const week = CURRICULUM.find((w) => w.week === currentWeek);

  return (
    <div
      className="w-60 lg:w-60 min-h-screen flex flex-col"
      style={{ background: "#0d1025", borderRight: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-4">
        <div className="font-display font-bold text-lg tracking-tight text-white">
          Executive Coach
        </div>
        <div className="font-mono text-xs mt-0.5" style={{ color: "#5a6578" }}>
          12-Week Curriculum
        </div>
      </div>

      {/* New Session button */}
      <div className="px-4 mb-4">
        <button
          className="w-full py-2 px-4 rounded-full font-sans text-sm font-semibold transition-all flex items-center justify-center gap-2"
          style={{
            background: "linear-gradient(135deg, #FF4D8D, #7B2FFF)",
            color: "#FFFFFF",
            boxShadow: "0 4px 20px rgba(255,77,141,0.3)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 28px rgba(255,77,141,0.45)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(255,77,141,0.3)"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Session
        </button>
      </div>

      {/* Active week card */}
      {week && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          key={week.week}
          className="mx-3 mb-4 rounded-xl overflow-hidden gradient-mesh"
          style={{ border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <div className="px-4 pt-4 pb-3">
            <div className="font-mono text-xs font-medium tracking-widest uppercase mb-1" style={{ color: "#7B2FFF" }}>
              Week {week.week} · Active
            </div>
            <div className="font-display font-bold text-sm leading-snug mb-2 text-white">
              {week.title}
            </div>
            <div className="font-sans text-xs leading-relaxed" style={{ color: "#a0aec0" }}>
              {week.focus}
            </div>
          </div>
          <div className="px-4 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="font-mono text-xs font-medium tracking-widest uppercase mb-1" style={{ color: "#00D4FF" }}>
              Daily Drill
            </div>
            <div className="font-sans text-xs leading-relaxed" style={{ color: "#5a6578" }}>
              {week.dailyDrill}
            </div>
          </div>
        </motion.div>
      )}

      {/* Week navigation */}
      <div className="flex-1 overflow-y-auto py-2 px-2">
        {frameworks.map((fw) => {
          const weekObjs = CURRICULUM.filter((w) => fw.weeks.includes(w.week));
          return (
            <div key={fw.name} className="mb-4">
              <div className="px-3 mb-2 flex items-center gap-2">
                <span style={{ color: fw.color }}>{frameworkIcons[fw.icon]}</span>
                <span className="font-mono text-xs font-medium tracking-widest uppercase" style={{ color: "#5a6578" }}>
                  {fw.label}
                </span>
              </div>
              {weekObjs.map((w) => {
                const isActive = w.week === currentWeek;
                const weekStats = allStats[w.week];
                return (
                  <button
                    key={w.week}
                    onClick={() => onWeekChange(w.week)}
                    className="w-full text-left px-3 py-2 flex items-center gap-2.5 rounded-lg transition-all mb-0.5"
                    style={{
                      background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
                      borderLeft: isActive ? "3px solid #FF4D8D" : "3px solid transparent",
                      color: isActive ? "#FFFFFF" : "#5a6578",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                        e.currentTarget.style.color = "#a0aec0";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "#5a6578";
                      }
                    }}
                  >
                    <span className="font-mono text-xs font-medium w-5 shrink-0" style={{ color: isActive ? "#FF4D8D" : "#3a4050" }}>
                      {w.week}
                    </span>
                    <span className={`font-sans text-sm leading-tight flex-1 truncate ${isActive ? "font-semibold" : "font-normal"}`}>
                      {w.title}
                    </span>
                    {weekStats && weekStats.reps > 0 && (
                      <span
                        className="font-mono text-xs shrink-0 px-1.5 py-0.5 rounded-full"
                        style={{
                          background: weekStats.strong > weekStats.needs_work
                            ? "rgba(123,47,255,0.2)"
                            : "rgba(255,255,255,0.06)",
                          color: weekStats.strong > weekStats.needs_work ? "#7B2FFF" : "#5a6578",
                        }}
                      >
                        {weekStats.reps}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
