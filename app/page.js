"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChatInterface from "@/components/ChatInterface";
import ScenarioButtons from "@/components/ScenarioButtons";
import SessionStats from "@/components/SessionStats";
import { getWeek } from "@/lib/curriculum";

export default function Home() {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [activeScenario, setActiveScenario] = useState(null);
  const [stats, setStats] = useState({ reps: 0, strong: 0, decent: 0, needs_work: 0 });

  const week = getWeek(currentWeek);

  function handleWeekChange(n) {
    setCurrentWeek(n);
    setActiveScenario(null);
  }

  function handleRatingUpdate(rating) {
    setStats((prev) => ({
      reps: prev.reps + 1,
      strong: prev.strong + (rating === "strong" ? 1 : 0),
      decent: prev.decent + (rating === "decent" ? 1 : 0),
      needs_work: prev.needs_work + (rating === "needs_work" ? 1 : 0),
    }));
  }

  return (
    <div className="flex h-screen bg-brand-bg overflow-hidden font-sans">
      <Sidebar currentWeek={currentWeek} onWeekChange={handleWeekChange} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Gradient header */}
        <div
          className="px-6 py-4 flex items-baseline gap-3"
          style={{ background: "linear-gradient(135deg, #2D4CC8 0%, #0D1B6E 100%)" }}
        >
          <span className="text-white/50 text-sm font-mono">Week {week.week}</span>
          <span className="text-white font-display font-bold text-xl tracking-tight">
            {week.title}
          </span>
          <span className="text-white/30 text-sm hidden sm:block">·</span>
          <span className="text-white/60 text-sm hidden sm:block font-sans">{week.framework}</span>
        </div>

        <SessionStats stats={stats} />
        <ScenarioButtons
          onSelect={setActiveScenario}
          activeScenario={activeScenario}
        />

        <div className="flex-1 min-h-0">
          <ChatInterface
            key={`${currentWeek}-${activeScenario}`}
            weekNumber={currentWeek}
            activeScenario={activeScenario}
            onRatingUpdate={handleRatingUpdate}
          />
        </div>
      </div>
    </div>
  );
}
