"use client";

export default function SessionStats({ stats }) {
  const total = stats.strong + stats.decent + stats.needs_work;
  const strongPct = total > 0 ? Math.round((stats.strong / total) * 100) : 0;

  return (
    <div className="flex items-center gap-5 px-6 py-3 bg-brand-surface border-b border-brand-border">
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs font-medium tracking-widest uppercase" style={{ color: "#6B6B8A" }}>
          Reps
        </span>
        <span className="font-display font-bold text-xl" style={{ color: "#1A1A2E" }}>
          {stats.reps}
        </span>
      </div>

      <div className="w-px h-5" style={{ background: "#E8E8F0" }} />

      <div className="flex items-center gap-2">
        <Pill label="Strong" value={stats.strong} bg="#E8F5EE" color="#1A7A4A" />
        <Pill label="Decent" value={stats.decent} bg="#FDF3DC" color="#D4940A" />
        <Pill label="Needs Work" value={stats.needs_work} bg="#FDF0EC" color="#E8603C" />
      </div>

      {total > 0 && (
        <>
          <div className="w-px h-5" style={{ background: "#E8E8F0" }} />
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 rounded-none overflow-hidden" style={{ background: "#E8E8F0" }}>
              <div
                className="h-full transition-all duration-700"
                style={{ width: `${strongPct}%`, background: "#1A7A4A" }}
              />
            </div>
            <span className="font-mono text-xs" style={{ color: "#6B6B8A" }}>{strongPct}% strong</span>
          </div>
        </>
      )}
    </div>
  );
}

function Pill({ label, value, bg, color }) {
  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1 font-mono text-xs font-medium"
      style={{ background: bg, color }}
    >
      <span className="font-bold">{value}</span>
      <span className="opacity-80">{label}</span>
    </div>
  );
}
