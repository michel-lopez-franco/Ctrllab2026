import { useState, useCallback } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { Play, RotateCcw, Info } from 'lucide-react'
import { Slider, Button, Card } from '@/components/ui/index.js'
import { simulateStepResponse } from '@/utils/transferFunction.js'

// Los tres sistemas de la sección de analogías
const SYSTEMS = {
  'Tanque (1er orden)': {
    description: 'A·dh/dt + h/R = q_in  →  G(s) = K/(τs+1)',
    num: [1],
    den: [1, 1],   // τ=1, K=1 por defecto; τ y K se controlan con sliders
    params: ['tau', 'K'],
    buildTF: ({ tau, K }) => ({ num: [K], den: [tau, 1] }),
    defaults: { tau: 1, K: 1 },
    sliders: [
      { key: 'tau', label: 'τ (constante de tiempo)', min: 0.1, max: 5, step: 0.1, unit: 's' },
      { key: 'K',   label: 'K (ganancia estática)',   min: 0.1, max: 3,  step: 0.1, unit: '' },
    ],
  },
  'Masa-Resorte (2do orden)': {
    description: 'mÿ + bẏ + ky = F  →  G(s) = ωₙ²/(s²+2ζωₙs+ωₙ²)',
    num: [1],
    den: [1, 2 * 0.5 * 2, 4],
    params: ['zeta', 'wn'],
    buildTF: ({ zeta, wn }) => ({ num: [wn * wn], den: [1, 2 * zeta * wn, wn * wn] }),
    defaults: { zeta: 0.5, wn: 2 },
    sliders: [
      { key: 'zeta', label: 'ζ (amortiguamiento)', min: 0.05, max: 2,   step: 0.05, unit: '' },
      { key: 'wn',   label: 'ωₙ (frec. natural)',  min: 0.5,  max: 5,   step: 0.1,  unit: ' rad/s' },
    ],
  },
  'Circuito RC (1er orden)': {
    description: 'RC·dVc/dt + Vc = Vs  →  G(s) = 1/(RCs+1)',
    num: [1],
    den: [1, 1],
    params: ['R', 'C'],
    buildTF: ({ R, C }) => ({ num: [1], den: [R * C, 1] }),
    defaults: { R: 1, C: 1 },
    sliders: [
      { key: 'R', label: 'R (resistencia)', min: 0.1, max: 5, step: 0.1, unit: ' kΩ' },
      { key: 'C', label: 'C (capacitancia)', min: 0.1, max: 5, step: 0.1, unit: ' mF' },
    ],
  },
}

const SYSTEM_KEYS = Object.keys(SYSTEMS)

function getInitialParams(sysKey) {
  return { ...SYSTEMS[sysKey].defaults }
}

export function DinamicaSimulator({ onSimulate }) {
  const [sysKey, setSysKey] = useState(SYSTEM_KEYS[0])
  const sys = SYSTEMS[sysKey]

  const [params, setParams] = useState(() => getInitialParams(sysKey))
  const [chartData, setChartData] = useState(null)
  const [running, setRunning] = useState(false)

  const handleSysChange = (key) => {
    setSysKey(key)
    setParams(getInitialParams(key))
    setChartData(null)
  }

  const setParam = (key, val) => setParams((p) => ({ ...p, [key]: val }))

  const run = useCallback(() => {
    setRunning(true)
    setTimeout(() => {
      const { num, den } = sys.buildTF(params)
      const { time, output } = simulateStepResponse(num, den, 15, 0.05)
      setChartData(
        time.map((t, i) => ({ t: parseFloat(t.toFixed(2)), y: parseFloat(output[i].toFixed(4)) }))
      )
      setRunning(false)
      onSimulate?.()
    }, 10)
  }, [sys, params, onSimulate])

  const reset = () => {
    setParams(getInitialParams(sysKey))
    setChartData(null)
  }

  // Highlight region labels for 2nd order
  const is2nd = sysKey === 'Masa-Resorte (2do orden)'
  const zeta = params.zeta ?? 0.5
  const dampingLabel =
    !is2nd ? null
    : zeta < 1 ? `ζ = ${zeta.toFixed(2)} → subamortiguado (oscilatorio)`
    : zeta === 1 ? 'ζ = 1 → críticamente amortiguado'
    : `ζ = ${zeta.toFixed(2)} → sobreamortiguado`

  return (
    <div className="space-y-5">
      {/* Selector de sistema */}
      <div className="grid grid-cols-3 gap-2">
        {SYSTEM_KEYS.map((k) => (
          <button
            key={k}
            onClick={() => handleSysChange(k)}
            className={`p-3 rounded-lg text-xs font-medium text-left transition-colors ${
              sysKey === k
                ? 'bg-primary-600/20 border border-primary-500/50 text-primary-300'
                : 'bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      {/* Descripción del sistema */}
      <div className="flex items-start gap-2 p-3 bg-slate-900 rounded-lg">
        <Info size={14} className="text-cyan-400 mt-0.5 shrink-0" />
        <span className="text-xs font-mono text-cyan-300">{sys.description}</span>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-5">
        {/* Parámetros */}
        <Card className="p-4 space-y-5">
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Parámetros</h4>
          {sys.sliders.map((sl) => (
            <Slider
              key={sl.key}
              label={sl.label}
              value={params[sl.key] ?? sl.min}
              min={sl.min}
              max={sl.max}
              step={sl.step}
              unit={sl.unit}
              onChange={(v) => setParam(sl.key, v)}
            />
          ))}

          {dampingLabel && (
            <div className={`text-xs px-3 py-2 rounded-lg ${
              zeta < 1 ? 'bg-amber-900/30 text-amber-300' : 'bg-green-900/30 text-green-300'
            }`}>
              {dampingLabel}
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <Button onClick={run} disabled={running} className="flex-1">
              <Play size={14} />
              {running ? 'Calculando…' : 'Simular'}
            </Button>
            <Button variant="secondary" onClick={reset} aria-label="Reiniciar">
              <RotateCcw size={14} />
            </Button>
          </div>
        </Card>

        {/* Gráfica */}
        <Card className="p-4">
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Respuesta al escalón unitario
          </h4>
          <div
            className="h-56"
            role="img"
            aria-label={`Respuesta temporal de ${sysKey}`}
          >
            {chartData ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    dataKey="t"
                    stroke="#64748b"
                    tick={{ fontSize: 10 }}
                    label={{ value: 'Tiempo (s)', position: 'insideBottom', offset: -2, fill: '#64748b', fontSize: 10 }}
                  />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 6, fontSize: 12 }}
                    formatter={(v) => [v.toFixed(4), 'y(t)']}
                    labelFormatter={(l) => `t = ${l}s`}
                  />
                  <Line type="monotone" dataKey="y" stroke="#06b6d4" dot={false} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-2 text-slate-600">
                <Play size={28} className="text-slate-700" />
                <span className="text-sm">Ajusta los parámetros y presiona Simular</span>
              </div>
            )}
          </div>

          {/* Hint pedagógico */}
          {chartData && is2nd && (
            <div className="mt-3 p-3 bg-slate-900 rounded-lg text-xs text-slate-400 space-y-1">
              <p><span className="text-white font-medium">Experimenta:</span> ¿Qué pasa cuando ζ &gt; 1? ¿Y cuando ζ = 0?</p>
              <p>Observa cómo la frecuencia de oscilación cambia con ωₙ.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
