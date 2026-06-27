import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { TEAMS, DAY_LABELS, WEEK_NUMBER, WEEK_DATES, TOTAL_ADVISORS, type Advisor } from "@/data/weekData";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `SKY Roster · WOW · Wk ${WEEK_NUMBER}` },
      { name: "description", content: `Animated SKY Roster dashboard for Week ${WEEK_NUMBER} (${WEEK_DATES}). Live shifts, off-days and team breakdown.` },
      { property: "og:title", content: `SKY Roster · WOW · Wk ${WEEK_NUMBER}` },
      { property: "og:description", content: `Premium WOW-themed roster dashboard for Week ${WEEK_NUMBER}.` },
    ],
  }),
  component: Dashboard,
});

/* ---------------- Aurora Canvas Background ---------------- */
function AuroraBackground() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let w = 0, h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0006,
      vy: (Math.random() - 0.5) * 0.0006,
      r: Math.random() * 2.4 + 0.6,
      a: Math.random() * 0.6 + 0.2,
    }));

    const resize = () => {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let t = 0;
    const draw = () => {
      t += 0.004;
      ctx.clearRect(0, 0, w, h);

      // Aurora waves
      for (let i = 0; i < 3; i++) {
        const g = ctx.createLinearGradient(0, 0, w, h);
        const hueShift = i * 0.15;
        g.addColorStop(0, `rgba(13, 61, 61, 0)`);
        g.addColorStop(0.5, `rgba(${30 + i * 10}, ${160 + i * 20}, ${170 + i * 10}, ${0.10 + hueShift * 0.05})`);
        g.addColorStop(1, `rgba(13, 61, 61, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        const amp = 60 + i * 25;
        const yBase = h * (0.35 + i * 0.18);
        ctx.moveTo(0, yBase);
        for (let x = 0; x <= w; x += 14) {
          const y = yBase + Math.sin(x * 0.006 + t * (1 + i * 0.5)) * amp +
                    Math.cos(x * 0.012 + t * (0.7 + i * 0.3)) * (amp * 0.4);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
        ctx.fill();
      }

      // Particles
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;
        const px = p.x * w, py = p.y * h;
        const glow = ctx.createRadialGradient(px, py, 0, px, py, p.r * 8);
        glow.addColorStop(0, `rgba(160, 240, 230, ${p.a})`);
        glow.addColorStop(1, `rgba(160, 240, 230, 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath(); ctx.arc(px, py, p.r * 8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(220, 255, 250, ${Math.min(1, p.a + 0.2)})`;
        ctx.beginPath(); ctx.arc(px, py, p.r, 0, Math.PI * 2); ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 bg-teal-radial no-print" aria-hidden="true">
      <canvas ref={ref} className="h-full w-full" />
    </div>
  );
}

/* ---------------- Animated Counter ---------------- */
function Counter({ value, duration = 1100 }: { value: number; duration?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0; const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <>{n}</>;
}

/* ---------------- WOW Logo ---------------- */
import wowLogo from "@/assets/wow-logo.png";
function WowLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const h = size === "lg" ? "h-20 md:h-24" : size === "sm" ? "h-10" : "h-14 md:h-16";
  return (
    <div className="inline-flex items-center justify-center animate-wow">
     <img
  src={wowLogo}
  alt="WOW"
/>
    </div>
  );
}

/* ---------------- Status pill ---------------- */
function StatusCell({ v }: { v: string }) {
  const isWork = /^\d/.test(v);
  let cls = "badge-work";
  let label = v;
  if (v === "WO") cls = "badge-wo";
  else if (v === "RO") cls = "badge-ro";
  else if (v === "AL") cls = "badge-al";
  return (
    <span className={`inline-flex min-w-[58px] justify-center rounded-md px-2 py-1 text-xs font-semibold ${cls}`}>
      {isWork ? label : label}
    </span>
  );
}

/* ---------------- Live clock ---------------- */
function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);
  return now;
}

/* ---------------- Request type ---------------- */
interface RequestEntry {
  id: string; name: string; empId: string; type: string; date: string; details: string; createdAt: string;
}

/* ---------------- Main Dashboard ---------------- */
function Dashboard() {
  const now = useClock();
  const [selectedDay, setSelectedDay] = useState(0);
  const [leaderFilter, setLeaderFilter] = useState<string>("all");
  const [queueFilter, setQueueFilter] = useState<string>("all");
  const [shiftFilter, setShiftFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [weekSel, setWeekSel] = useState(String(WEEK_NUMBER));
  const [showModal, setShowModal] = useState(false);
  const [requests, setRequests] = useState<RequestEntry[]>([]);
  const [showRequests, setShowRequests] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("sky-roster-requests");
      if (raw) setRequests(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem("sky-roster-requests", JSON.stringify(requests));
  }, [requests]);

  const allShifts = useMemo(() => {
    const s = new Set<string>();
    TEAMS.forEach(t => t.advisors.forEach(a => s.add(a.shift)));
    return Array.from(s).sort();
  }, []);

  const filtered = useMemo(() => {
    return TEAMS.map(team => ({
      ...team,
      advisors: team.advisors.filter(a => {
        if (leaderFilter !== "all" && team.leader !== leaderFilter) return false;
        if (queueFilter !== "all" && a.queue !== queueFilter) return false;
        if (shiftFilter !== "all" && a.shift !== shiftFilter) return false;
        if (search && !`${a.name} ${a.empId}`.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      }),
    })).filter(t => t.advisors.length > 0);
  }, [leaderFilter, queueFilter, shiftFilter, search]);

  const kpi = useMemo(() => {
    let working = 0, wo = 0, ro = 0, al = 0;
    TEAMS.forEach(t => t.advisors.forEach(a => {
      const v = a.days[selectedDay];
      if (v === "WO") wo++;
      else if (v === "RO") ro++;
      else if (v === "AL") al++;
      else working++;
    }));
    return { working, wo, ro, al };
  }, [selectedDay]);

  const toggleCollapse = (leader: string) =>
    setCollapsed(c => ({ ...c, [leader]: !c[leader] }));

  return (
    <main className="relative min-h-screen px-4 py-6 md:px-8">
      <AuroraBackground />

      {/* HEADER */}
      <header className="mx-auto max-w-7xl">
        <div className="glass-strong relative overflow-hidden rounded-3xl p-6 md:p-10 animate-fade-up">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-teal-gradient opacity-30 blur-3xl no-print" />
          <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-teal-gradient opacity-20 blur-3xl no-print" />

          <div className="relative flex flex-col items-center gap-6 text-center md:flex-row md:items-center md:justify-between md:text-left">
            <div className="flex flex-col items-center gap-4 md:flex-row md:items-center md:gap-6">
              <WowLogo size="lg" />
              <div>
                <h1 className="text-2xl font-bold tracking-tight md:text-4xl">
                  SKY ROSTER <span className="text-teal-bright text-glow">· WK {WEEK_NUMBER}</span>
                </h1>
                <p className="mt-1 text-sm md:text-base text-muted-foreground">{WEEK_DATES}</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-1 md:items-end">
              <div suppressHydrationWarning className="font-mono text-3xl font-bold text-teal-glow text-glow md:text-4xl">
                {now ? now.toLocaleTimeString() : "--:--:--"}
              </div>
              <div suppressHydrationWarning className="text-xs md:text-sm text-muted-foreground">
                {now ? now.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : ""}
              </div>
              <div className="mt-2 flex items-center gap-2 no-print">
                <label className="text-xs text-muted-foreground">Week</label>
                <select value={weekSel} onChange={e => setWeekSel(e.target.value)}
                        className="glass rounded-md px-2 py-1 text-xs">
                  {Array.from({ length: 6 }, (_, i) => WEEK_NUMBER - 2 + i).map(w => (
                    <option key={w} value={w} className="bg-popover">Wk {w}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* DAY SELECTOR */}
      <section className="mx-auto mt-6 max-w-7xl no-print">
        <div className="glass flex flex-wrap gap-2 rounded-2xl p-3 animate-fade-up" style={{ animationDelay: "60ms" }}>
          {DAY_LABELS.map((d, i) => (
            <button key={i} onClick={() => setSelectedDay(i)}
                    className={`flex-1 min-w-[90px] rounded-xl px-3 py-2 text-xs font-semibold transition-all md:text-sm
                      ${selectedDay === i
                        ? "bg-teal-gradient text-white neon-glow scale-[1.02]"
                        : "bg-white/5 text-muted-foreground hover:bg-white/10"}`}>
              <div>{d.short}</div>
              <div className="text-[10px] opacity-80 md:text-xs">{d.date}</div>
            </button>
          ))}
        </div>
      </section>

      {/* KPI CARDS */}
      <section className="mx-auto mt-6 grid max-w-7xl grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {[
          { label: "Total Advisors", value: TOTAL_ADVISORS, color: "from-teal-mid to-teal-bright", accent: "text-teal-glow" },
          { label: "Working", value: kpi.working, color: "from-emerald-700 to-emerald-400", accent: "text-emerald-300" },
          { label: "Week Off", value: kpi.wo, color: "from-amber-700 to-amber-400", accent: "text-amber-300" },
          { label: "Roster Off", value: kpi.ro, color: "from-rose-700 to-rose-400", accent: "text-rose-300" },
          { label: "Annual Leave", value: kpi.al, color: "from-fuchsia-700 to-fuchsia-400", accent: "text-fuchsia-300" },
          { label: "Teams", value: TEAMS.length, color: "from-cyan-700 to-cyan-400", accent: "text-cyan-300" },
        ].map((k, i) => (
          <div key={k.label}
               className="glass group relative overflow-hidden rounded-2xl p-4 animate-fade-up hover:scale-[1.03] transition-transform"
               style={{ animationDelay: `${120 + i * 60}ms` }}>
            <div className={`absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${k.color} opacity-30 blur-2xl`} />
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{k.label}</div>
            <div className={`mt-2 text-4xl font-extrabold ${k.accent}`}>
              <Counter value={k.value} />
            </div>
          </div>
        ))}
      </section>

      {/* FILTERS */}
      <section className="mx-auto mt-6 max-w-7xl no-print">
        <div className="glass flex flex-wrap items-center gap-3 rounded-2xl p-4 animate-fade-up" style={{ animationDelay: "500ms" }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
                 placeholder="Search advisor / emp ID…"
                 className="flex-1 min-w-[180px] rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-teal-bright focus:outline-none" />
          <select value={leaderFilter} onChange={e => setLeaderFilter(e.target.value)}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm">
            <option value="all" className="bg-popover">All Team Leaders</option>
            {TEAMS.map(t => <option key={t.leader} value={t.leader} className="bg-popover">{t.leader}</option>)}
          </select>
          <select value={queueFilter} onChange={e => setQueueFilter(e.target.value)}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm">
            <option value="all" className="bg-popover">All Queues</option>
            <option value="DOC" className="bg-popover">DOC</option>
            <option value="Care" className="bg-popover">Care</option>
          </select>
          <select value={shiftFilter} onChange={e => setShiftFilter(e.target.value)}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm">
            <option value="all" className="bg-popover">All Shifts</option>
            {allShifts.map(s => <option key={s} value={s} className="bg-popover">{s}</option>)}
          </select>
          <button onClick={() => window.print()}
                  className="rounded-lg bg-teal-gradient px-4 py-2 text-sm font-semibold text-white neon-glow transition-transform hover:scale-105">
            ⬇ Export
          </button>
          <button onClick={() => setShowRequests(true)}
                  className="rounded-lg border border-teal-bright/40 bg-white/5 px-4 py-2 text-sm font-semibold text-teal-glow hover:bg-white/10">
            📥 Requests ({requests.length})
          </button>
        </div>
      </section>

      {/* TEAM TABLES */}
      <section className="mx-auto mt-6 max-w-7xl space-y-6">
        {filtered.length === 0 && (
          <div className="glass rounded-2xl p-8 text-center text-muted-foreground">No advisors match the filters.</div>
        )}
        {filtered.map((team, ti) => {
          const isCollapsed = collapsed[team.leader];
          return (
            <div key={team.leader}
                 className="glass overflow-hidden rounded-2xl animate-fade-up"
                 style={{ animationDelay: `${600 + ti * 100}ms` }}>
              <button onClick={() => toggleCollapse(team.leader)}
                      className="flex w-full items-center justify-between gap-4 p-4 text-left transition-colors hover:bg-white/5 md:p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-gradient font-bold text-white neon-glow">
                    {team.leader.split(" ").map(p => p[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <div className="text-lg font-bold">{team.leader}</div>
                    <div className="text-xs text-muted-foreground">{team.advisors.length} advisors</div>
                  </div>
                </div>
                <span className={`text-teal-glow transition-transform ${isCollapsed ? "" : "rotate-180"}`}>▾</span>
              </button>

              {!isCollapsed && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-y border-white/10 bg-white/5 text-xs uppercase tracking-wider text-muted-foreground">
                        <th className="px-3 py-2 text-left">Emp ID</th>
                        <th className="px-3 py-2 text-left">Advisor</th>
                        <th className="px-3 py-2 text-left">Queue</th>
                        <th className="px-3 py-2 text-left">Shift</th>
                        {DAY_LABELS.map((d, i) => (
                          <th key={i}
                              className={`px-2 py-2 text-center ${selectedDay === i ? "text-teal-glow" : ""}`}>
                            <div>{d.short}</div>
                            <div className="text-[10px] opacity-70">{d.date}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {team.advisors.map((a: Advisor, ai) => (
                        <tr key={a.empId}
                            className="border-b border-white/5 transition-colors hover:bg-white/5"
                            style={{ animation: `fade-up 0.4s ease-out both`, animationDelay: `${ai * 30}ms` }}>
                          <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{a.empId}</td>
                          <td className="px-3 py-2 font-medium">{a.name}</td>
                          <td className="px-3 py-2">
                            <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${a.queue === "DOC"
                              ? "bg-cyan-500/20 text-cyan-200 border border-cyan-400/30"
                              : "bg-teal-500/20 text-teal-200 border border-teal-400/30"}`}>{a.queue}</span>
                          </td>
                          <td className="px-3 py-2 font-mono text-xs">{a.shift}</td>
                          {a.days.map((v, di) => (
                            <td key={di}
                                className={`px-2 py-2 text-center ${selectedDay === di ? "bg-teal-bright/5" : ""}`}>
                              <StatusCell v={v} />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* LEGEND */}
      <section className="mx-auto mt-6 max-w-7xl">
        <div className="glass flex flex-wrap items-center justify-center gap-3 rounded-2xl p-4 text-xs">
          <span className="font-semibold text-muted-foreground">Legend:</span>
          <StatusCell v="11:30" /><span className="text-muted-foreground">Working (Shift)</span>
          <StatusCell v="WO" /><span className="text-muted-foreground">Week Off</span>
          <StatusCell v="RO" /><span className="text-muted-foreground">Roster Off</span>
          <StatusCell v="AL" /><span className="text-muted-foreground">Annual Leave</span>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          SKY Roster · Powered by <span className="font-bold text-teal-glow">WOW</span> · Offline ready
        </p>
      </section>

      {/* FLOATING REQUEST BUTTON */}
      <button onClick={() => setShowModal(true)}
              className="no-print fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-teal-gradient px-5 py-3 font-semibold text-white neon-glow animate-float hover:scale-110 transition-transform">
        <span className="text-xl leading-none">＋</span> Request
      </button>

      {/* REQUEST MODAL */}
      {showModal && (
        <RequestModal
          onClose={() => setShowModal(false)}
          onSubmit={(r) => { setRequests(rs => [r, ...rs]); setShowModal(false); }}
        />
      )}

      {/* REQUESTS DRAWER */}
      {showRequests && (
        <div className="no-print fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 md:items-center md:p-6"
             onClick={() => setShowRequests(false)}>
          <div onClick={e => e.stopPropagation()}
               className="glass-strong max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl md:rounded-2xl p-6 animate-fade-up">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">Submitted Requests</h3>
              <button onClick={() => setShowRequests(false)} className="text-2xl text-muted-foreground hover:text-white">×</button>
            </div>
            {requests.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">No requests yet. Submit one with the “+ Request” button.</p>
            ) : (
              <ul className="space-y-3">
                {requests.map(r => (
                  <li key={r.id} className="glass rounded-xl p-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div className="font-semibold">{r.name} <span className="font-mono text-xs text-muted-foreground">#{r.empId}</span></div>
                      <span className="rounded-md bg-teal-gradient px-2 py-0.5 text-xs font-semibold text-white">{r.type}</span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">For {r.date} · submitted {new Date(r.createdAt).toLocaleString()}</div>
                    {r.details && <p className="mt-2 text-sm">{r.details}</p>}
                    <button onClick={() => setRequests(rs => rs.filter(x => x.id !== r.id))}
                            className="mt-2 text-xs text-rose-300 hover:text-rose-200">Delete</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

/* ---------------- Request Modal ---------------- */
function RequestModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (r: RequestEntry) => void }) {
  const [name, setName] = useState("");
  const [empId, setEmpId] = useState("");
  const [type, setType] = useState("Shift Change");
  const [date, setDate] = useState("");
  const [details, setDetails] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !empId || !date) return;
    onSubmit({
      id: crypto.randomUUID(), name, empId, type, date, details,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="no-print fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 md:items-center md:p-6"
         onClick={onClose}>
      <form onClick={e => e.stopPropagation()} onSubmit={submit}
            className="glass-strong w-full max-w-md rounded-t-2xl md:rounded-2xl p-6 animate-fade-up">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold">New Roster Request</h3>
          <button type="button" onClick={onClose} className="text-2xl text-muted-foreground hover:text-white">×</button>
        </div>
        <div className="space-y-3">
          <Field label="Name">
            <input required value={name} onChange={e => setName(e.target.value)}
                   className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-teal-bright focus:outline-none" />
          </Field>
          <Field label="Employee ID">
            <input required value={empId} onChange={e => setEmpId(e.target.value)}
                   className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-mono focus:border-teal-bright focus:outline-none" />
          </Field>
          <Field label="Request Type">
            <select value={type} onChange={e => setType(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm">
              <option className="bg-popover">Shift Change</option>
              <option className="bg-popover">Day Off</option>
              <option className="bg-popover">Swap</option>
            </select>
          </Field>
          <Field label="Date">
            <input required type="date" value={date} onChange={e => setDate(e.target.value)}
                   className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm" />
          </Field>
          <Field label="Details">
            <textarea rows={3} value={details} onChange={e => setDetails(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-teal-bright focus:outline-none" />
          </Field>
        </div>
        <button type="submit"
                className="mt-5 w-full rounded-lg bg-teal-gradient py-2.5 font-semibold text-white neon-glow transition-transform hover:scale-[1.02]">
          Submit Request
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
