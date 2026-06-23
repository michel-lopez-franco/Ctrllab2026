import { useMemo, useState } from 'react'
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { Slider, Card } from '@/components/ui/index.js'
import { polyRoots, classifyStability } from '@/utils/stability.js'

// Shows poles as scatter points in the complex plane.
// Also lets the user drag ζ and ωₙ to see poles move in real time.

const CUSTOM_DOT = (props) => {
  const { cx, cy, payload } = props
  const inRHP = payload.re > 1e-6
  const onAxis = Math.abs(payload.re) <= 1e-6
  const color = inRHP ? '#ef4444' : onAxis ? '#f59e0b' : '#3b82f6'
  return (
    <g>
      <circle cx={cx} cy={cy} r={7} fill={color} fillOpacity={0.3} stroke={color} strokeWidth={2} />
      <text x={cx + 10} y={cy + 4} fontSize={9} fill={color}>
        ×
      </text>
    </g>
  )
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-slate-800 border border-slate-600 rounded px-3 py-2 text-xs font-mono">
      <p className="text-white">s = {d.re.toFixed(3)} {d.im >= 0 ? '+' : '−'} {Math.abs(d.im).toFixed(3)}j</p>
      <p className={d.re < 0 ? 'text-green-400' : d.re > 0 ? 'text-red-400' : 'text-amber-400'}>
        {d.re < 0 ? 'Estable' : d.re > 0 ? 'Inestable' : 'Marginal'}
      </p>
    </div>
  )
}

export function PoleZeroPlot() {
  const [zeta, setZeta] = useState(0.5)
  const [wn, setWn] = useState(3)

  // Second order system poles: s = -ζωₙ ± ωₙ√(ζ²-1)
  const poles2nd = useMemo(() => {
    const sigma = zeta * wn
    const disc = zeta * zeta - 1
    if (disc < 0) {
      const wd = wn * Math.sqrt(-disc)
      return [{ re: -sigma, im: wd }, { re: -sigma, im: -wd }]
    }
    const sq = wn * Math.sqrt(disc)
    return [{ re: -sigma + sq, im: 0 }, { re: -sigma - sq, im: 0 }]
  }, [zeta, wn])

  // Range for axes
  const maxAbs = Math.max(3, wn * 1.5)
  const stability = classifyStability(poles2nd)
  const statusColor = stability === 'stable' ? 'text-green-400' : stability === 'unstable' ? 'text-red-400' : 'text-amber-400'
  const statusLabel = stability === 'stable' ? 'Estable' : stability === 'unstable' ? 'Inestable' : 'Marginalmente estable'

  // Scatter data: re → x, im → y
  const scatterData = poles2nd.map((p) => ({ x: p.re, y: p.im, re: p.re, im: p.im }))

  // Line from origin to first pole (show ωₙ radius)
  const p = poles2nd[0]
  const wnRadius = Math.sqrt(p.re ** 2 + p.im ** 2)

  return (
    <div className="space-y-5">
      <div className="grid lg:grid-cols-[260px_1fr] gap-5">
        {/* Controls */}
        <Card className="p-4 space-y-5">
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Sistema de 2do orden</h4>
          <div className="p-3 bg-slate-900 rounded-lg text-xs font-mono text-cyan-300">
            G(s) = {(wn * wn).toFixed(1)} / (s² + {(2 * zeta * wn).toFixed(2)}s + {(wn * wn).toFixed(1)})
          </div>

          <Slider label="ζ (amortiguamiento)" value={zeta} min={0} max={2} step={0.05} onChange={setZeta} />
          <Slider label="ωₙ (frec. natural)" value={wn} min={0.5} max={8} step={0.1} unit=" rad/s" onChange={setWn} />

          <div className="space-y-2 text-xs text-slate-400 p-3 bg-slate-900 rounded-lg">
            {poles2nd.map((p, i) => (
              <div key={i}>
                s{i + 1} = <span className="text-white font-mono">
                  {p.re.toFixed(3)}{Math.abs(p.im) > 0.001 ? ` ${p.im >= 0 ? '+' : '−'} ${Math.abs(p.im).toFixed(3)}j` : ''}
                </span>
              </div>
            ))}
            <div className="pt-2 border-t border-slate-700">
              <div>ωₙ = <span className="text-white font-mono">{wnRadius.toFixed(3)} rad/s</span></div>
              <div>ζ = <span className="text-white font-mono">{zeta.toFixed(2)}</span>
                {zeta > 0 && <span className="ml-1">→ θ = {(Math.acos(Math.min(1, zeta)) * 180 / Math.PI).toFixed(1)}°</span>}
              </div>
            </div>
          </div>

          <div className={`text-sm font-semibold px-3 py-2 rounded-lg ${
            stability === 'stable' ? 'bg-green-900/20 text-green-400'
            : stability === 'unstable' ? 'bg-red-900/20 text-red-400'
            : 'bg-amber-900/20 text-amber-400'
          }`}>
            {statusLabel}
          </div>
        </Card>

        {/* Plano complejo */}
        <Card className="p-4">
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Plano complejo — posición de los polos
          </h4>
          <p className="text-xs text-slate-500 mb-4">
            Izquierda del eje imaginario = estable · Derecha = inestable
          </p>
          <div className="h-72" role="img" aria-label="Diagrama de polos en el plano complejo">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  type="number" dataKey="x"
                  domain={[-maxAbs, maxAbs]}
                  stroke="#64748b" tick={{ fontSize: 10 }}
                  label={{ value: 'Re(s) — σ', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 10 }}
                />
                <YAxis
                  type="number" dataKey="y"
                  domain={[-maxAbs, maxAbs]}
                  stroke="#64748b" tick={{ fontSize: 10 }}
                  label={{ value: 'Im(s) — jω', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }}
                />
                {/* Eje imaginario = frontera de estabilidad */}
                <ReferenceLine x={0} stroke="#334155" strokeWidth={2} strokeDasharray="4 2"
                  label={{ value: 'Frontera', position: 'top', fill: '#475569', fontSize: 9 }} />
                <ReferenceLine y={0} stroke="#334155" strokeWidth={1} />
                <Tooltip content={<CustomTooltip />} />
                <Scatter data={scatterData} shape={<CUSTOM_DOT />} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Leyenda pedagógica */}
          <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> Estable (σ &lt; 0)</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500 inline-block" /> Marginal (σ = 0)</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500 inline-block" /> Inestable (σ &gt; 0)</span>
          </div>
        </Card>
      </div>

      <div className="p-3 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-400 space-y-1">
        <p><span className="text-white font-medium">Experimenta:</span> Mueve ζ de 0 a 2 y observa cómo los polos se mueven de un par complejo conjugado a dos polos reales.</p>
        <p>Con ζ = 0 los polos están sobre el eje imaginario (marginal). ¿Qué pasa con ζ = 1 exactamente?</p>
      </div>
    </div>
  )
}
