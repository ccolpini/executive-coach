"use client";

import { CURRICULUM } from "@/lib/curriculum";

const frameworks = [
  { name: "Minto Pyramid Principle", label: "Minto Pyramid", weeks: [1, 2, 3, 4] },
  { name: "Decker: Communicate to Influence", label: "Decker · Influence", weeks: [5, 6, 7, 8] },
  { name: "Gallo: Talk Like TED", label: "Gallo · Talk Like TED", weeks: [9, 10, 11, 12] },
];

export default function Sidebar({ currentWeek, onWeekChange }) {
  const week = CURRICULUM.find((w) => w.week === currentWeek);

  return (
    <div className="w-72 min-h-screen bg-brand-surface border-r border-brand-border flex flex-col" style={{ boxShadow: "1px 0 0 #E8E8F0" }}>
      {/* Logo / title */}
      <div className="px-6 pt-6 pb-5 border-b border-brand-border">
        <div className="font-mono text-xs font-medium tracking-widest uppercase mb-1" style={{ color: "#6B6B8A" }}>
          Executive Coach
        </div>
        <div className="font-display font-bold text-xl italic leading-tight" style={{ color: "#1A1A2E" }}>
          Speaking Under Pressure
        </div>
        <div className="font-mono text-xs mt-1" style={{ color: "#6B6B8A" }}>
          12-Week Curriculum
        </div>
      </div>

      {/* Active week card */}
      {week && (
        <div
          className="mx-4 mt-5 rounded-none border-l-4 pl-4 pr-4 pt-4 pb-4 bg-white"
          style={{ borderLeftColor: "#2D4CC8", boxShadow: "0 2px 8px 0 rgba(45,76,200,0.10), 0 1px 3px rgba(26,26,46,0.06)" }}
        >
          <div className="font-mono text-xs font-medium tracking-widest uppercase mb-1" style={{ color: "#2D4CC8" }}>
            Week {week.week} · Active
          </div>
          <div className="font-display font-bold text-base leading-snug mb-2" style={{ color: "#1A1A2E" }}>
            {week.title}
          </div>
          <div className="font-sans text-sm leading-relaxed mb-3" style={{ color: "#6B6B8A" }}>
            {week.focus}
          </div>
          <div className="pt-3" style={{ borderTop: "1px solid #E8E8F0" }}>
            <div className="font-mono text-xs font-medium tracking-widest uppercase mb-1.5" style={{ color: "#D4940A" }}>
              Daily Drill
            </div>
            <div className="font-sans text-xs leading-relaxed" style={{ color: "#6B6B8A" }}>
              {week.dailyDrill}
            </div>
          </div>
        </div>
      )}

      {/* Week navigation */}
      <div className="flex-1 overflow-y-auto py-5 px-3">
        {frameworks.map((fw) => {
          const weekObjs = CURRICULUM.filter((w) => fw.weeks.includes(w.week));
          return (
            <div key={fw.name} className="mb-5">
              <div className="px-3 mb-2">
                <span className="font-mono text-xs font-medium tracking-widest uppercase" style={{ color: "#6B6B8A" }}>
                  {fw.label}
                </span>
              </div>
              {weekObjs.map((w) => {
                const isActive = w.week === currentWeek;
                return (
                  <button
                    key={w.week}
                    onClick={() => onWeekChange(w.week)}
                    className="w-full text-left px-3 py-2.5 flex items-center gap-3 transition-all"
                    style={{
                      background: isActive ? "rgba(45,76,200,0.07)" : "transparent",
                      borderLeft: isActive ? "3px solid #2D4CC8" : "3px solid transparent",
                      color: isActive ? "#2D4CC8" : "#6B6B8A",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = "#F5F5FA";
                        e.currentTarget.style.color = "#1A1A2E";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "#6B6B8A";
                      }
                    }}
                  >
                    <span className="font-mono text-xs font-medium w-6 shrink-0" style={{ color: isActive ? "#2D4CC8" : "#C8C8D8" }}>
                      W{w.week}
                    </span>
                    <span className={`font-sans text-sm leading-tight ${isActive ? "font-semibold" : "font-normal"}`}>
                      {w.title}
                    </span>
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
