"use client";

/* Lightweight dependency-free SVG charts matching the StackX dark theme. */

const PALETTE = ["#8B5CF6", "#06B6D4", "#10B981", "#F59E0B", "#EF4444", "#A78BFA"];

/* ─── Vertical Bar Chart ─── */
export function BarChart({
  data,
  height = 180,
}: {
  data: { label: string; value: number; color?: string }[];
  height?: number;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-2" style={{ height }}>
        {data.map((d, i) => (
          <div key={d.label} className="flex-1 flex flex-col items-center justify-end gap-2 h-full">
            <span className="text-xs text-white font-medium">{d.value}</span>
            <div
              className="w-full rounded-t-md transition-all"
              style={{
                height: `${(d.value / max) * 100}%`,
                minHeight: d.value > 0 ? 4 : 0,
                background: d.color || PALETTE[i % PALETTE.length],
              }}
              title={`${d.label}: ${d.value}`}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between gap-2 mt-2">
        {data.map((d) => (
          <span key={d.label} className="flex-1 text-center text-[10px] text-muted truncate">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Line / Area Chart ─── */
export function LineChart({
  data,
  height = 180,
}: {
  data: { label: string; count: number }[];
  height?: number;
}) {
  const W = 100;
  const H = 100;
  if (data.length === 0) {
    return <div className="text-center text-sm text-muted py-12">No data yet.</div>;
  }
  const max = Math.max(1, ...data.map((d) => d.count));
  const step = data.length > 1 ? W / (data.length - 1) : 0;
  const pts = data.map((d, i) => [i * step, H - (d.count / max) * (H - 10) - 5]);
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0]},${H} L0,${H} Z`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: "100%", height }}>
        <defs>
          <linearGradient id="lc-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#lc-fill)" />
        <path d={line} fill="none" stroke="#A78BFA" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        {pts.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r="1.6" fill="#A78BFA" vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      <div className="flex items-center justify-between gap-1 mt-2">
        {data.map((d) => (
          <span key={d.label} className="flex-1 text-center text-[10px] text-muted truncate">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Donut Chart ─── */
export function DonutChart({
  data,
  size = 160,
}: {
  data: { label: string; value: number; color?: string }[];
  size?: number;
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const radius = 40;
  const circ = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex items-center gap-5">
      <svg viewBox="0 0 100 100" style={{ width: size, height: size }} className="shrink-0">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
        {total > 0 &&
          data.map((d, i) => {
            const frac = d.value / total;
            const dash = frac * circ;
            const seg = (
              <circle
                key={d.label}
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={d.color || PALETTE[i % PALETTE.length]}
                strokeWidth="12"
                strokeDasharray={`${dash} ${circ - dash}`}
                strokeDashoffset={-offset}
                transform="rotate(-90 50 50)"
              />
            );
            offset += dash;
            return seg;
          })}
        <text x="50" y="48" textAnchor="middle" className="fill-white" style={{ fontSize: 14, fontWeight: 700 }}>
          {total}
        </text>
        <text x="50" y="60" textAnchor="middle" className="fill-current text-muted" style={{ fontSize: 7 }}>
          total
        </text>
      </svg>
      <div className="space-y-1.5">
        {data.map((d, i) => (
          <div key={d.label} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: d.color || PALETTE[i % PALETTE.length] }} />
            <span className="text-muted capitalize">{d.label.replace(/_/g, " ")}</span>
            <span className="text-white font-medium ml-auto">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
