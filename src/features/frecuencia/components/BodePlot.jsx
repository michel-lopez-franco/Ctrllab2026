import { useState, useMemo, useCallback } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { Play, RotateCcw, Info } from 'lucide-react'
import { Button, Card, Slider } from '@/components/ui/index.js'
import { bodeData, stabilityMargins } from '@/utils/frequency.js'

const PRESETS = [
  { label: '1er orden K/(τs+1)', num: [2], den: [0.5, 1], name: '2/(0.5s+1)' },
  { label: 'Integrador K/s', num: [5], den: [1, 0], name: '5/s' },
  { label: '2do orden', num: [25], den: [1, 3, 25], name: '25/(s²+3s+25)' },
  { label: '3 polos (clásico)', num: [1], den: [1, 3, 2, 0], name: '1/(s(s+1)(s+2))' },
  { label: 'Cero + polo', num: [1, 3], den: [1, 1], name: '(s+3)/(s+1)' },
]

// Recharts tick formatter for log-scale display
const logTickFormatter = (v) => {
  const pow = Math.round(Math.log10(v))
  return `10^${pow}`
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-slate-600 rounded px-3 py-2 text-xs font-mono space-y-1">
      <p className="text-slate-300">ω = {Number(label).toFixed(3)} rad/s</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {Number(p.value).toFixed(2)}{p.dataKey === 'mag' ? ' dB' : '°'}
        </p>
      ))}
    </div>
  )
}

export function BodePlot({ onSimulate }) {
  const [presetIdx, setPresetIdx] = useState(0)
  const [K, setK] = useState(1)
  const [data, setData] = useState(null)
  const [margins, setMargins] = useState(null)
  const [running, setRunning] = useState(false)

  const preset = PRESETS[presetIdx]

  const scaledNum = useMemo(() => preset.num.map((c) => c * K), [preset, K])

  const run = useCallback(() => {
    setRunning(true)
    setTimeout(() => {
      const { w, magDB, phase } = bodeData(scaledNum, preset.den, 0.01, 100, 250)
      const m = stabilityMargins(scaledNum, preset.den, 0.001, 1000, 500)
      setData(w.map((wi, i) => ({
        w: parseFloat(wi.toFixed(4)),
        mag: parseFloat(magDB[i].toFixed(2)),
        ph: parseFloat(phase[i].toFixed(2)),
      })))
      setMargins(m)
      onSimulate?.()
      setRunning(false)
    }, 10)
  }, [scaledNum, preset.den, onSimulate])

  const reset = () => { setData(null); setMargins(null); setK(1) }

  return (
    <div className="space-y-4">
      {/* Selector de preset */}
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p, i) => (
          <button key={i} onClick={() => { setPresetIdx(i); setData(null); setMargins(null) }}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              presetIdx === i
                ? 'bg-primary-600/20 border-primary-500/50 text-primary-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
            }`}>
            {p.label}
          </button>
        ))}
      </div>

      <div className="p-3 bg-slate-900 rounded-lg flex items-center gap-2">
        <Info size={13} className="text-cyan-400 shrink-0" />
        <code className="text-xs font-mono text-cyan-300">G(s) = K·{preset.name}  con K = {K.toFixed(2)}</code>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-4">
        {/* Panel */}
        <Card className="p-4 space-y-4">
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Ganancia K</h4>
          <Slider label="K" value={K} min={0.1} max={20} step={0.1} onChange={setK} />

          <div className="flex gap-2">
            <Button onClick={run} disabled={running} className="flex-1">
              <Play size={14} /> {running ? 'Calculando…' : 'Graficar'}
            </Button>
            <Button variant="secondary" onClick={reset} aria-label="Reiniciar"><RotateCcw size={14} /></Button>
          </div>

          {/* Márgenes */}
          {margins && (
            <div className="space-y-2 pt-2 border-t border-slate-700">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Márgenes</p>
              <MarginRow label="Margen de fase" value={margins.pm != null ? `${margins.pm.toFixed(1)}°` : '∞'} good={margins.pm == null || margins.pm > 30} />
              <MarginRow label="Margen de ganancia" value={margins.gm != null ? `${margins.gm.toFixed(1)} dB` : '∞'} good={margins.gm == null || margins.gm > 6} />
              <MarginRow label="ω cruce ganancia" value={margins.wGC != null ? `${margins.wGC.toFixed(2)} rad/s` : '—'} good />
              <MarginRow label="ω cruce fase" value={margins.wPC != null ? `${margins.wPC.toFixed(2)} rad/s` : '—'} good />
              <div className={`text-xs px-2 py-1.5 rounded font-medium mt-1 ${
                (margins.pm ?? 999) > 30 && (margins.gm ?? 999) > 6
                  ? 'bg-green-900/20 text-green-400'
                  : (margins.pm ?? 999) > 0
                    ? 'bg-amber-900/20 text-amber-400'
                    : 'bg-red-900/20 text-red-400'
              }`}>
                {(margins.pm ?? 999) > 30 && (margins.gm ?? 999) > 6 ? 'Sistema robusto'
                  : (margins.pm ?? 999) > 0 ? 'Estable, margen bajo'
                  : 'Sistema inestable (LC)'}
              </div>
            </div>
          )}
        </Card>

        {/* Gráficas */}
        {data ? (
          <div className="space-y-3">
            {/* Magnitud */}
            <Card className="p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Magnitud (dB)</p>
              <div className="h-44" role="img" aria-label="Diagrama de Bode magnitud">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="w" scale="log" type="number" domain={['auto', 'auto']}
                      tickFormatter={logTickFormatter} stroke="#64748b" tick={{ fontSize: 9 }}
                      label={{ value: 'ω (rad/s)', position: 'insideBottom', offset: -2, fill: '#64748b', fontSize: 9 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 9 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={0} stroke="#475569" strokeDasharray="3 3" label={{ value: '0 dB', fill: '#475569', fontSize: 9 }} />
                    {margins?.wGC && <ReferenceLine x={margins.wGC} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'ωgc', fill: '#f59e0b', fontSize: 9 }} />}
                    <Line type="monotone" dataKey="mag" stroke="#3b82f6" dot={false} strokeWidth={2} name="Magnitud" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Fase */}
            <Card className="p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Fase (°)</p>
              <div className="h-44" role="img" aria-label="Diagrama de Bode fase">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="w" scale="log" type="number" domain={['auto', 'auto']}
                      tickFormatter={logTickFormatter} stroke="#64748b" tick={{ fontSize: 9 }}
                      label={{ value: 'ω (rad/s)', position: 'insideBottom', offset: -2, fill: '#64748b', fontSize: 9 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 9 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={-180} stroke="#ef4444" strokeDasharray="3 3" label={{ value: '−180°', fill: '#ef4444', fontSize: 9 }} />
                    {margins?.wPC && <ReferenceLine x={margins.wPC} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'ωpc', fill: '#10b981', fontSize: 9 }} />}
                    <Line type="monotone" dataKey="ph" stroke="#8b5cf6" dot={false} strokeWidth={2} name="Fase" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        ) : (
          <Card className="flex items-center justify-center h-64 text-slate-600">
            <div className="text-center space-y-2">
              <Play size={32} className="text-slate-700 mx-auto" />
              <p className="text-sm">Selecciona un sistema y presiona Graficar</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

function MarginRow({ label, value, good }) {
  return (
    <div className="flex justify-between items-center text-xs">
      <span className="text-slate-400">{label}</span>
      <span className={`font-mono font-semibold ${good ? 'text-green-400' : 'text-red-400'}`}>{value}</span>
    </div>
  )
}
