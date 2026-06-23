import { useState, useCallback } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { Play, RotateCcw } from 'lucide-react'
import { Slider, Button, Card } from '@/components/ui/index.js'
import { simulatePID, computeMetrics } from '@/utils/transferFunction.js'

const PRESETS = {
  'Motor DC': { num: [1], den: [1, 3, 2] },
  'Temperatura': { num: [1], den: [1, 1.5, 0.5] },
  'Nivel de tanque': { num: [2], den: [1, 4, 4] },
  'Sistema inestable': { num: [1], den: [1, -1, -6] },
}

const DEFAULT_PID = { kp: 1, ki: 0, kd: 0 }

export function PIDSimulator({ onResult }) {
  const [pid, setPid] = useState(DEFAULT_PID)
  const [preset, setPreset] = useState('Motor DC')
  const [result, setResult] = useState(null)
  const [metrics, setMetrics] = useState(null)
  const [running, setRunning] = useState(false)

  const plant = PRESETS[preset]

  const run = useCallback(() => {
    setRunning(true)
    // Defer to avoid blocking the render
    setTimeout(() => {
      try {
        const { time, output } = simulatePID(plant.num, plant.den, pid, 20, 0.05)
        const m = computeMetrics(time, output)
        const chartData = time.map((t, i) => ({ t: parseFloat(t.toFixed(2)), y: parseFloat(output[i].toFixed(4)) }))
        setResult(chartData)
        setMetrics(m)
        onResult?.(m)
      } catch {
        // Plant may be unstable with these gains
        setResult([])
        setMetrics(null)
      } finally {
        setRunning(false)
      }
    }, 10)
  }, [pid, plant, onResult])

  const reset = () => {
    setPid(DEFAULT_PID)
    setResult(null)
    setMetrics(null)
  }

  return (
    <div className="grid lg:grid-cols-[320px_1fr] gap-6">
      {/* Panel de control */}
      <Card className="p-5 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Planta</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(PRESETS).map((name) => (
              <button
                key={name}
                onClick={() => setPreset(name)}
                className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                  preset === name
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
          <div className="mt-3 p-3 bg-slate-900 rounded-lg font-mono text-xs text-cyan-400">
            G(s) = {plant.num.join('s + ')} / ({plant.den.map((c, i) => {
              const power = plant.den.length - 1 - i
              if (power === 0) return c
              if (power === 1) return `${c}s`
              return `${c}s²`
            }).join(' + ')})
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Controlador PID</h3>
          <Slider label="Kp" value={pid.kp} min={0} max={20} step={0.1} onChange={(v) => setPid((p) => ({ ...p, kp: v }))} />
          <Slider label="Ki" value={pid.ki} min={0} max={10} step={0.05} onChange={(v) => setPid((p) => ({ ...p, ki: v }))} />
          <Slider label="Kd" value={pid.kd} min={0} max={5}  step={0.05} onChange={(v) => setPid((p) => ({ ...p, kd: v }))} />
        </div>

        <div className="flex gap-2">
          <Button onClick={run} disabled={running} className="flex-1">
            <Play size={16} />
            {running ? 'Simulando…' : 'Simular'}
          </Button>
          <Button variant="secondary" onClick={reset} aria-label="Reiniciar">
            <RotateCcw size={16} />
          </Button>
        </div>
      </Card>

      {/* Gráfica */}
      <div className="space-y-4">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Respuesta al escalón unitario
          </h3>
          <div
            role="img"
            aria-label={`Gráfica de respuesta temporal del sistema ${preset} con Kp=${pid.kp} Ki=${pid.ki} Kd=${pid.kd}`}
            className="h-64"
          >
            {result ? (
              result.length === 0 ? (
                <div className="h-full flex items-center justify-center text-red-400 text-sm">
                  Sistema inestable con estas ganancias. Reduce Kp o ajusta los parámetros.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={result}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="t" stroke="#64748b" tick={{ fontSize: 11 }} label={{ value: 'Tiempo (s)', position: 'insideBottom', offset: -2, fill: '#64748b', fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                      formatter={(v) => [v.toFixed(4), 'Salida']}
                      labelFormatter={(l) => `t = ${l}s`}
                    />
                    <ReferenceLine y={1} stroke="#10b981" strokeDasharray="4 4" label={{ value: 'Referencia', fill: '#10b981', fontSize: 10 }} />
                    <Line type="monotone" dataKey="y" stroke="#3b82f6" dot={false} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              )
            ) : (
              <div className="h-full flex items-center justify-center text-slate-600 text-sm">
                Presiona Simular para ver la respuesta
              </div>
            )}
          </div>
        </Card>

        {metrics && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricCard label="Sobreimpulso" value={`${metrics.overshoot.toFixed(1)}%`} ok={metrics.overshoot < 15} />
            <MetricCard label="T. establecimiento" value={`${metrics.settlingTime.toFixed(2)}s`} ok={metrics.settlingTime < 10} />
            <MetricCard label="T. subida" value={metrics.riseTime ? `${metrics.riseTime.toFixed(2)}s` : 'N/A'} ok />
            <MetricCard label="Error SS" value={`${metrics.steadyStateError.toFixed(2)}%`} ok={metrics.steadyStateError < 5} />
          </div>
        )}
      </div>
    </div>
  )
}

function MetricCard({ label, value, ok }) {
  return (
    <Card className={`p-3 text-center border ${ok ? 'border-green-500/30' : 'border-red-500/40'}`}>
      <div className={`text-lg font-mono font-bold ${ok ? 'text-green-400' : 'text-red-400'}`}>{value}</div>
      <div className="text-xs text-slate-500 mt-1">{label}</div>
    </Card>
  )
}
