"use client";

import { motion } from "framer-motion";

export default function SessionStats({ stats }) {
  const total = stats.strong + stats.decent + stats.needs_work;
  const strongPct = total > 0 ? Math.round((stats.strong / total) * 100) : 0;

  return (
    <div
      className="flex items-center gap-4 px-4 sm:px-6 py-2.5 overflow-x-auto"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="flex items-center gap-2 shrink-0">
        <span className="font-mono text-xs font-medium tracking-widest uppercase" style={{ color: "#5a6578" }}>
          Reps
        </span>
        <span className="font-display font-bold text-xl text-white">
          {stats.reps}
        </span>
      </div>

      <div className="w-px h-5 shrink-0" style={{ background: "rgba(255,255,255,0.08)" }} />

      <div className="flex items-center gap-2 shrink-0">
        <Pill label="Strong" value={stats.strong} gradient="linear-gradient(135deg, #7B2FFF, #00D4FF)" />
        <Pill label="Decent" value={stats.decent} gradient="linear-gradient(135deg, #00D4FF, #00D4FF)" />
        <Pill label="Needs Work" value={stats.needs_work} gradient="linear-gradient(135deg, #FF4D8D, #FF4D8D)" />
      </div>

      {total > 0 && (
        <>
          <div className="w-px h-5 shrink-0" style={{ background: "rgba(255,255,255,0.08)" }} />
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #7B2FFF, #00D4FF)" }}
                initial={{ width: 0 }}
                animate={{ width: `${strongPct}%` }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
            </div>
            <span className="font-mono text-xs" style={{ color: "#5a6578" }}>{strongPct}%</span>
          </div>
        </>
      )}
    </div>
  );
}

function Pill({ label, value, gradient }) {
  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-xs font-medium"
      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ background: gradient }}
      />
      <span className="font-bold text-white">{value}</span>
      <span style={{ color: "#5a6578" }}>{label}</span>
    </div>
  );
}
