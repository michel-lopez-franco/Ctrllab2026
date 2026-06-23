import { useState, useCallback } from 'react'
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Line, LineChart,
} from 'recharts'
import { Play, RotateCcw } from 'lucide-react'
import { Button, Card, Slider } from '@/components/ui/index.js'
import { nyquistData, stabilityMargins } from '@/utils/frequency.js'

const PRESETS = [
  { label: '1/(s+1)', num: [1], den: [1, 1] },
  { label: '1/(s²+s+1)', num: [1], den: [1, 1, 1] },
  { label: '1/(s(s+1)(s+2))', num: [1], den: [1, 3, 2, 0] },
  { label: '(s+2)/(s+1)²', num: [1, 2], den: [1, 2, 1] },
]

const NyquistTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null
  return (
    <div className="bg-slate-800 border border-slate-600 rounded px-3 py-2 text-xs font-mono space-y-1">
      <p className="text-slate-300">ω = {d.w?.toFixed(3)} rad/s</p>
      <p className="text-blue-300">Re = {d.x?.toFixed(3)}</p>
      <p className="text-violet-300">Im = {d.y?.toFixed(3)}</p>
    </div>
  )
}

export function NyquistPlot({ onSimulate }) {
  const [presetIdx, setPresetIdx] = useState(0)
  const [K, setK] = useState(1)
  const [data, setData] = useState(null)
  const [margins, setMargins] = useState(null)
  const [running, setRunning] = useState(false)

  const preset = PRESETS[presetIdx]

  const run = useCallback(() => {
    setRunning(true)
    setTimeout(() => {
      const scaledNum = preset.num.map((c) => c * K)
      const { re, im, w } = nyquistData(scaledNum, preset.den, 0.01, 100, 400)
      // Cap extreme values for display
      const CAP = 5
      const pts = re.map((r, i) => ({
        x: Math.max(-CAP, Math.min(CAP, r)),
        y: Math.max(-CAP, Math.min(CAP, im[i])),
        w: w[i],
      }))
      setData(pts)
      const m = stabilityMargins(scaledNum, preset.den, 0.001, 500, 500)
      setMargins(m)
      onSimulate?.()
      setRunning(false)
    }, 10)
  }, [preset, K, onSimulate])

  const reset = () => { setData(null); setMargins(null); setK(1) }

  const encircles = margins?.pm != null && margins.pm < 0

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p, i) => (
          <button key={i} onClick={() => { setPresetIdx(i); setData(null); setMargins(null) }}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              presetIdx === i
                ? 'bg-secondary-600/20 border-secondary-500/50 text-secondary-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
            }`}>
            G(s) = {p.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-4">
        <Card className="p-4 space-y-4">
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Ganancia K</h4>
          <Slider label="K" value={K} min={0.1} max={15} step={0.1} onChange={setK} />
          <div className="flex gap-2">
            <Button onClick={run} disabled={running} className="flex-1">
              <Play size={14} /> {running ? 'Calculando…' : 'Graficar'}
            </Button>
            <Button variant="secondary" onClick={reset} aria-label="Reiniciar"><RotateCcw size={14} /></Button>
          </div>

          {margins && (
            <div className="space-y-2 pt-2 border-t border-slate-700 text-xs">
              <p className="text-slate-500 uppercase tracking-wider">Análisis</p>
              <div className="flex justify-between">
                <span className="text-slate-400">Margen de fase</span>
                <span className={`font-mono font-semibold ${(margins.pm ?? 999) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {margins.pm != null ? `${margins.pm.toFixed(1)}°` : '∞'}
                </span>
              </div>
              <div className={`px-2 py-1.5 rounded text-xs font-medium ${
                encircles ? 'bg-red-900/20 text-red-400' : 'bg-green-900/20 text-green-400'
              }`}>
                {encircles ? '⚠ Encierra (−1, 0) → LC inestable' : '✓ No encierra (−1, 0) → LC estable'}
              </div>
            </div>
          )}
        </Card>

        <Card className="p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Diagrama de Nyquist — G(jω), ω: 0.01 → 100</p>
          <p className="text-xs text-slate-600 mb-3">El punto crítico (−1, 0) se muestra en rojo</p>
          <div className="h-72" role="img" aria-label="Diagrama de Nyquist">
            {data ? (
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis type="number" dataKey="x" domain={[-3, 2]} stroke="#64748b" tick={{ fontSize: 9 }}
                    label={{ value: 'Re G(jω)', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 9 }} />
                  <YAxis type="number" dataKey="y" domain={[-2.5, 2.5]} stroke="#64748b" tick={{ fontSize: 9 }}
                    label={{ value: 'Im G(jω)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 9 }} />
                  <ReferenceLine x={0} stroke="#334155" strokeWidth={1} />
                  <ReferenceLine y={0} stroke="#334155" strokeWidth={1} />
                  {/* Punto crítico */}
                  <ReferenceLine x={-1} stroke="#ef4444" strokeWidth={1} strokeDasharray="3 2"
                    label={{ value: '−1', fill: '#ef4444', fontSize: 9, position: 'top' }} />
                  <Tooltip content={<NyquistTooltip />} />
                  <Scatter data={data} fill="#8b5cf6" opacity={0.7} r={1.5} />
                </ScatterChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-600 text-sm">
                Presiona Graficar para ver el diagrama de Nyquist
              </div>
            )}
          </div>
          <p className="text-xs text-slate-600 mt-2">
            Cada punto representa G(jω) para un valor de ω. La curva va de ω≈0 (derecha) hacia ω→∞ (origen).
          </p>
        </Card>
      </div>
    </div>
  )
}
