/*
 * Lightweight dependency-free SVG charts for the dashboards.
 * Exports: LineChart, BarChart, DonutChart.
 */

const PALETTE = ['#f97316', '#3b82f6', '#10b981', '#a855f7', '#ef4444', '#eab308']

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      {title && (
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  )
}

/** data: [{ month, value }]  — smooth-ish line + filled area */
export function LineChart({ title, subtitle, data = [], color = '#f97316', formatY = (v) => v }) {
  const w = 560, h = 220, pad = { t: 16, r: 16, b: 28, l: 44 }
  const iw = w - pad.l - pad.r, ih = h - pad.t - pad.b
  const max = Math.max(1, ...data.map((d) => d.value))
  const stepX = data.length > 1 ? iw / (data.length - 1) : iw
  const x = (i) => pad.l + i * stepX
  const y = (v) => pad.t + ih - (v / max) * ih

  const points = data.map((d, i) => `${x(i)},${y(d.value)}`).join(' ')
  const area = data.length
    ? `M${pad.l},${pad.t + ih} L${points.split(' ').join(' L')} L${x(data.length - 1)},${pad.t + ih} Z`
    : ''
  const ticks = [0, 0.5, 1].map((f) => Math.round(max * f))

  return (
    <ChartCard title={title} subtitle={subtitle}>
      {data.length === 0 ? (
        <EmptyChart />
      ) : (
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
          {ticks.map((t, i) => (
            <g key={i}>
              <line x1={pad.l} x2={w - pad.r} y1={y(t)} y2={y(t)} stroke="#f1f5f9" />
              <text x={pad.l - 8} y={y(t) + 4} textAnchor="end" fontSize="10" fill="#94a3b8">{formatY(t)}</text>
            </g>
          ))}
          <path d={area} fill={color} opacity="0.12" />
          <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          {data.map((d, i) => (
            <g key={i}>
              <circle cx={x(i)} cy={y(d.value)} r="3.5" fill="#fff" stroke={color} strokeWidth="2" />
              <text x={x(i)} y={h - 8} textAnchor="middle" fontSize="10" fill="#94a3b8">{d.month}</text>
            </g>
          ))}
        </svg>
      )}
    </ChartCard>
  )
}

/** data: [{ label, value }] — vertical bars */
export function BarChart({ title, subtitle, data = [], color = '#3b82f6' }) {
  const w = 560, h = 220, pad = { t: 16, r: 16, b: 32, l: 44 }
  const iw = w - pad.l - pad.r, ih = h - pad.t - pad.b
  const max = Math.max(1, ...data.map((d) => d.value))
  const band = iw / Math.max(1, data.length)
  const bw = Math.min(46, band * 0.6)
  const ticks = [0, 0.5, 1].map((f) => Math.round(max * f))

  return (
    <ChartCard title={title} subtitle={subtitle}>
      {data.length === 0 ? (
        <EmptyChart />
      ) : (
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
          {ticks.map((t, i) => (
            <g key={i}>
              <line x1={pad.l} x2={w - pad.r} y1={pad.t + ih - (t / max) * ih} y2={pad.t + ih - (t / max) * ih} stroke="#f1f5f9" />
              <text x={pad.l - 8} y={pad.t + ih - (t / max) * ih + 4} textAnchor="end" fontSize="10" fill="#94a3b8">{t}</text>
            </g>
          ))}
          {data.map((d, i) => {
            const bh = (d.value / max) * ih
            const cx = pad.l + i * band + band / 2
            return (
              <g key={i}>
                <rect x={cx - bw / 2} y={pad.t + ih - bh} width={bw} height={bh} rx="4" fill={PALETTE[i % PALETTE.length] || color} />
                <text x={cx} y={pad.t + ih - bh - 6} textAnchor="middle" fontSize="10" fill="#475569" fontWeight="600">{d.value}</text>
                <text x={cx} y={h - 10} textAnchor="middle" fontSize="10" fill="#94a3b8">{d.label}</text>
              </g>
            )
          })}
        </svg>
      )}
    </ChartCard>
  )
}

/** data: [{ label, value }] — donut with legend */
export function DonutChart({ title, subtitle, data = [] }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  const size = 180, r = 70, cx = size / 2, cy = size / 2, stroke = 26
  const circ = 2 * Math.PI * r
  let offset = 0

  return (
    <ChartCard title={title} subtitle={subtitle}>
      {total === 0 ? (
        <EmptyChart />
      ) : (
        <div className="flex items-center gap-6 flex-wrap">
          <svg viewBox={`0 0 ${size} ${size}`} width="180" height="180" className="-rotate-90">
            {data.map((d, i) => {
              const frac = d.value / total
              const dash = frac * circ
              const seg = (
                <circle
                  key={i}
                  cx={cx} cy={cy} r={r} fill="none"
                  stroke={PALETTE[i % PALETTE.length]} strokeWidth={stroke}
                  strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={-offset}
                />
              )
              offset += dash
              return seg
            })}
          </svg>
          <div className="space-y-2">
            {data.map((d, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="w-3 h-3 rounded-full inline-block" style={{ background: PALETTE[i % PALETTE.length] }} />
                <span className="text-gray-700 capitalize">{d.label}</span>
                <span className="text-gray-400">— {d.value} ({total ? Math.round((d.value / total) * 100) : 0}%)</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </ChartCard>
  )
}

function EmptyChart() {
  return <div className="h-40 flex items-center justify-center text-sm text-gray-400">No data yet</div>
}
