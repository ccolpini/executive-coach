"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import ChatInterface from "@/components/ChatInterface";
import ScenarioButtons from "@/components/ScenarioButtons";
import SessionStats from "@/components/SessionStats";
import { getWeek } from "@/lib/curriculum";

const STORAGE_KEY = "executive-coach-stats";

function loadAllStats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAllStats(allStats) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allStats));
  } catch {}
}

const emptyStats = { reps: 0, strong: 0, decent: 0, needs_work: 0 };

export default function Home() {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [activeScenario, setActiveScenario] = useState(null);
  const [allStats, setAllStats] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setAllStats(loadAllStats());
    setLoaded(true);
  }, []);

  const stats = allStats[currentWeek] || emptyStats;

  const week = getWeek(currentWeek);

  function handleWeekChange(n) {
    setCurrentWeek(n);
    setActiveScenario(null);
    setSidebarOpen(false);
  }

  function handleRatingUpdate(rating) {
    setAllStats((prev) => {
      const weekStats = prev[currentWeek] || emptyStats;
      const updated = {
        ...prev,
        [currentWeek]: {
          reps: weekStats.reps + 1,
          strong: weekStats.strong + (rating === "strong" ? 1 : 0),
          decent: weekStats.decent + (rating === "decent" ? 1 : 0),
          needs_work: weekStats.needs_work + (rating === "needs_work" ? 1 : 0),
        },
      };
      saveAllStats(updated);
      return updated;
    });
  }

  return (
    <div className="flex h-screen bg-brand-bg overflow-hidden font-sans">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`
        fixed inset-y-0 left-0 z-40 transform transition-transform duration-200 ease-in-out
        lg:relative lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <Sidebar
          currentWeek={currentWeek}
          onWeekChange={handleWeekChange}
          allStats={loaded ? allStats : {}}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Gradient header */}
        <div
          className="px-4 sm:px-6 py-4 flex items-center gap-3"
          style={{ background: "linear-gradient(135deg, #2D4CC8 0%, #0D1B6E 100%)" }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-white/70 hover:text-white transition-colors shrink-0"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span className="text-white/50 text-sm font-mono">Week {week.week}</span>
          <span className="text-white font-display font-bold text-xl tracking-tight truncate">
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
