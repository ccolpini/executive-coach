"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    <div className="flex h-screen overflow-hidden font-sans" style={{ background: "#0a0d1a" }}>
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 lg:hidden"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

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
        {/* Top bar */}
        <div
          className="px-4 sm:px-6 py-3 flex items-center gap-3 glass"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden shrink-0 p-1.5 rounded-lg transition-colors"
            style={{ color: "#a0aec0" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#FFFFFF"; e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#a0aec0"; e.currentTarget.style.background = "transparent"; }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span className="font-mono text-xs font-medium tracking-widest uppercase" style={{ color: "#7B2FFF" }}>
            Week {week.week}
          </span>
          <span className="font-display font-bold text-lg tracking-tight truncate text-white">
            {week.title}
          </span>
          <span className="hidden sm:block text-sm" style={{ color: "#5a6578" }}>·</span>
          <span className="hidden sm:block text-sm font-sans" style={{ color: "#a0aec0" }}>{week.framework}</span>
          <div className="flex-1" />
          {/* User avatar */}
          <div
            className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-display font-bold text-xs"
            style={{ background: "linear-gradient(135deg, #7B2FFF, #FF4D8D)", color: "#FFFFFF" }}
          >
            EC
          </div>
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
