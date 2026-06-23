import { useState, useMemo, useCallback } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, Legend, ResponsiveContainer,
} from 'recharts'
import { Card, Button, Slider } from '@/components/ui/index.js'
import { simulatePID, computeMetrics } from '@/utils/transferFunction.js'
import { zieglerNicholsCL, computeITAE } from '@/utils/pidTuning.js'
import { Play, RotateCcw, Zap } from 'lucide-react'

const PLANTS = [
  { label: '1er orden: 1/(s+1)',       num: [1], den: [1, 1] },
  { label: '2do orden: 1/(s²+2s+1)',   num: [1], den: [1, 2, 1] },
  { label: '3er orden: 1/(s³+6s²+11s+6)', num: [1], den: [1, 6, 11, 6] },
  { label: 'Integrador: 1/(s(s+1))',   num: [1], den: [1, 1, 0] },
  { label: 'Inestable: 1/(s²-1)',       num: [1], den: [1, 0, -1] },
]

const VIEWS = ['Explorador P/I/D', 'Ziegler-Nichols', 'Comparador avanzado']

const T_END = 20
const DT = 0.05

function MetricChip({ label, value, unit, good }) {
  const color = good === true
    ? 'text-green-400 border-green-500/40 bg-green-500/10'
    : good === false
    ? 'text-red-400 border-red-500/40 bg-red-500/10'
    : 'text-slate-300 border-slate-600 bg-slate-800'
  return (
    <div className={`rounded px-3 py-1.5 border text-xs font-mono ${color}`}>
      <span className="text-slate-400 block text-[10px] uppercase tracking-wide">{label}</span>
      <span className="text-sm font-semibold">
        {typeof value === 'number' ? value.toFixed(3) : value}
        {unit && <span className="text-xs font-normal ml-0.5">{unit}</span>}
      </span>
    </div>
  )
}

function runSim(num, den, kp, ki, kd) {
  try {
    const { time, output } = simulatePID(num, den, { kp, ki, kd }, T_END, DT)
    const metrics = computeMetrics(time, output)
    const itae = computeITAE(time, output)
    return { time, output, metrics, itae, error: null }
  } catch (e) {
    return { time: [], output: [], metrics: null, itae: null, error: e.message }
  }
}

// ─── View 1: P/I/D explorer ──────────────────────────────────────────────────

function ExplorerView({ plantIdx }) {
  const plant = PLANTS[plantIdx]
  const [kp, setKp] = useState(1)
  const [ki, setKi] = useState(0)
  const [kd, setKd] = useState(0)

  const sim = useMemo(() => runSim(plant.num, plant.den, kp, ki, kd), [plant, kp, ki, kd])

  const chartData = useMemo(() => {
    if (!sim.time.length) return []
    return sim.time.map((t, i) => ({ t: +t.toFixed(2), y: +sim.output[i].toFixed(4), r: 1 }))
  }, [sim])

  const m = sim.metrics

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-3 lg:col-span-1">
          <Slider label="Kp (Proporcional)" value={kp} onChange={setKp} min={0} max={10} step={0.1} unit="" />
          <Slider label="Ki (Integral)" value={ki} onChange={setKi} min={0} max={10} step={0.1} unit="" />
          <Slider label="Kd (Derivativo)" value={kd} onChange={setKd} min={0} max={5}  step={0.05} unit="" />

          {m && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              <MetricChip label="Sobreimpulso" value={m.overshoot} unit="%" good={m.overshoot < 20} />
              <MetricChip label="t asentamiento" value={m.settlingTime} unit="s" good={m.settlingTime < 8} />
              <MetricChip label="t subida" value={m.riseTime} unit="s" good={m.riseTime < 4} />
              <MetricChip label="Error SS" value={Math.abs(1 - m.finalValue)} unit="" good={Math.abs(1 - m.finalValue) < 0.02} />
            </div>
          )}

          {sim.error && (
            <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/30 rounded p-2">{sim.error}</p>
          )}
        </div>

        <div className="lg:col-span-2">
          {sim.error ? (
            <div className="h-56 flex items-center justify-center text-slate-500 text-sm">
              Sistema inestable — reduce las ganancias
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="t" tick={{ fill: '#94a3b8', fontSize: 11 }} label={{ value: 'Tiempo (s)', position: 'insideBottomRight', offset: -4, fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 6 }} labelStyle={{ color: '#94a3b8' }} formatter={(v) => v.toFixed(4)} />
                <ReferenceLine y={1} stroke="#64748b" strokeDasharray="4 4" />
                <Line dataKey="r" name="Referencia" stroke="#475569" strokeDasharray="5 5" dot={false} strokeWidth={1} />
                <Line dataKey="y" name="Salida" stroke="#6366f1" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <Card className="p-3 bg-slate-800/50 border-slate-700">
        <p className="text-xs text-slate-400">
          <strong className="text-slate-200">Experimento guiado:</strong>{' '}
          Comienza con Ki=0, Kd=0 y aumenta Kp gradualmente. Observa que el error disminuye pero nunca llega a 0.
          Agrega Ki pequeño (≈0.5) y nota que el error SS desaparece pero aparece sobreimpulso.
          Ajusta Kd para amortiguar las oscilaciones.
        </p>
      </Card>
    </div>
  )
}

// ─── View 2: Ziegler-Nichols calculator ──────────────────────────────────────

function ZNView({ plantIdx }) {
  const plant = PLANTS[plantIdx]
  const [ku, setKu] = useState(6)
  const [tu, setTu] = useState(2)
  const [selected, setSelected] = useState('PID')

  const params = useMemo(() => zieglerNicholsCL(ku, tu), [ku, tu])
  const p = params[selected]

  const sim = useMemo(() => runSim(plant.num, plant.den, p.kp, p.ki, p.kd), [plant, p])

  const chartData = useMemo(() => {
    if (!sim.time.length) return []
    return sim.time.map((t, i) => ({ t: +t.toFixed(2), y: +sim.output[i].toFixed(4), r: 1 }))
  }, [sim])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-3">
          <p className="text-xs text-slate-400 leading-relaxed">
            Ingresa la <strong className="text-slate-200">ganancia última Ku</strong> y el{' '}
            <strong className="text-slate-200">período Tu</strong> obtenidos al llevar el sistema a oscilación sostenida.
          </p>
          <Slider label="Ku (Ganancia última)" value={ku} onChange={setKu} min={0.1} max={20} step={0.1} unit="" />
          <Slider label="Tu (Período último, s)" value={tu} onChange={setTu} min={0.1} max={10} step={0.1} unit="s" />

          <div className="flex gap-2">
            {['P', 'PI', 'PID'].map((t) => (
              <button
                key={t}
                onClick={() => setSelected(t)}
                className={`flex-1 text-xs py-1.5 rounded font-medium border transition-colors ${
                  selected === t
                    ? 'bg-primary-600 border-primary-500 text-white'
                    : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-slate-500'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="bg-slate-800 rounded-lg p-3 space-y-2 font-mono text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Kp</span>
              <span className="text-indigo-400 font-semibold">{p.kp.toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Ki</span>
              <span className="text-indigo-400 font-semibold">{p.ki.toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Kd</span>
              <span className="text-indigo-400 font-semibold">{p.kd.toFixed(4)}</span>
            </div>
          </div>

          {sim.metrics && (
            <div className="grid grid-cols-2 gap-2">
              <MetricChip label="Sobreimpulso" value={sim.metrics.overshoot} unit="%" good={sim.metrics.overshoot < 30} />
              <MetricChip label="t asentamiento" value={sim.metrics.settlingTime} unit="s" />
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="t" tick={{ fill: '#94a3b8', fontSize: 11 }} label={{ value: 'Tiempo (s)', position: 'insideBottomRight', offset: -4, fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} domain={['auto', 'auto']} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 6 }} labelStyle={{ color: '#94a3b8' }} formatter={(v) => v.toFixed(4)} />
              <ReferenceLine y={1} stroke="#64748b" strokeDasharray="4 4" />
              <Line dataKey="r" name="Referencia" stroke="#475569" strokeDasharray="5 5" dot={false} strokeWidth={1} />
              <Line dataKey="y" name={`Salida (Z-N ${selected})`} stroke="#f59e0b" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <Card className="p-3 bg-amber-500/5 border-amber-500/20">
        <p className="text-xs text-amber-300/80">
          <strong>Nota Z-N:</strong> Los parámetros de Ziegler-Nichols son un punto de partida. El sobreimpulso típico es ≈25%.
          Se recomienda dividir Kp entre 1.5–2 y ajustar iterativamente según los requisitos del proceso.
        </p>
      </Card>
    </div>
  )
}

// ─── View 3: Advanced comparator ─────────────────────────────────────────────

const SERIES_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ec4899']

function AdvancedView({ plantIdx }) {
  const plant = PLANTS[plantIdx]

  const [configs, setConfigs] = useState([
    { label: 'Solo P', kp: 2, ki: 0, kd: 0 },
    { label: 'PI',     kp: 2, ki: 1, kd: 0 },
    { label: 'PID',    kp: 2, ki: 1, kd: 0.5 },
  ])

  const sims = useMemo(
    () => configs.map((c) => runSim(plant.num, plant.den, c.kp, c.ki, c.kd)),
    [plant, configs],
  )

  const chartData = useMemo(() => {
    const base = sims[0]
    if (!base.time.length) return []
    return base.time.map((t, i) => {
      const pt = { t: +t.toFixed(2), r: 1 }
      sims.forEach((s, j) => {
        if (s.output[i] !== undefined) pt[`y${j}`] = +s.output[i].toFixed(4)
      })
      return pt
    })
  }, [sims])

  function updateConfig(idx, field, val) {
    setConfigs((prev) => prev.map((c, i) => (i === idx ? { ...c, [field]: val } : c)))
  }

  function addConfig() {
    if (configs.length < 4) {
      setConfigs((prev) => [...prev, { label: `Config ${prev.length + 1}`, kp: 1, ki: 0, kd: 0 }])
    }
  }

  function removeConfig(idx) {
    if (configs.length > 1) setConfigs((prev) => prev.filter((_, i) => i !== idx))
  }

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="t" tick={{ fill: '#94a3b8', fontSize: 11 }} label={{ value: 'Tiempo (s)', position: 'insideBottomRight', offset: -4, fill: '#94a3b8', fontSize: 11 }} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} domain={['auto', 'auto']} />
          <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 6 }} labelStyle={{ color: '#94a3b8' }} formatter={(v) => v.toFixed(4)} />
          <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
          <ReferenceLine y={1} stroke="#64748b" strokeDasharray="4 4" />
          <Line dataKey="r" name="Referencia" stroke="#475569" strokeDasharray="5 5" dot={false} strokeWidth={1} />
          {configs.map((c, j) => (
            <Line key={j} dataKey={`y${j}`} name={c.label} stroke={SERIES_COLORS[j]} dot={false} strokeWidth={2} />
          ))}
        </LineChart>
      </ResponsiveContainer>

      <div className="space-y-2">
        {configs.map((c, idx) => (
          <Card key={idx} className="p-3 border-l-4" style={{ borderLeftColor: SERIES_COLORS[idx] }}>
            <div className="flex items-center gap-3 flex-wrap">
              <input
                value={c.label}
                onChange={(e) => updateConfig(idx, 'label', e.target.value)}
                className="bg-slate-700 text-white text-xs rounded px-2 py-1 w-28 border border-slate-600"
              />
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <label>Kp</label>
                <input type="number" value={c.kp} step="0.1" min="0" max="20"
                  onChange={(e) => updateConfig(idx, 'kp', parseFloat(e.target.value) || 0)}
                  className="w-16 bg-slate-700 text-white rounded px-2 py-1 border border-slate-600" />
                <label>Ki</label>
                <input type="number" value={c.ki} step="0.1" min="0" max="20"
                  onChange={(e) => updateConfig(idx, 'ki', parseFloat(e.target.value) || 0)}
                  className="w-16 bg-slate-700 text-white rounded px-2 py-1 border border-slate-600" />
                <label>Kd</label>
                <input type="number" value={c.kd} step="0.05" min="0" max="10"
                  onChange={(e) => updateConfig(idx, 'kd', parseFloat(e.target.value) || 0)}
                  className="w-16 bg-slate-700 text-white rounded px-2 py-1 border border-slate-600" />
              </div>
              {sims[idx].itae != null && (
                <span className="text-xs font-mono text-slate-400">
                  ITAE: <span className="text-purple-400">{sims[idx].itae.toFixed(2)}</span>
                </span>
              )}
              {configs.length > 1 && (
                <button onClick={() => removeConfig(idx)} className="text-slate-600 hover:text-red-400 text-xs ml-auto">✕</button>
              )}
            </div>
          </Card>
        ))}

        {configs.length < 4 && (
          <Button variant="ghost" size="sm" onClick={addConfig}>+ Agregar configuración</Button>
        )}
      </div>

      <Card className="p-3 bg-slate-800/50 border-slate-700">
        <p className="text-xs text-slate-400">
          <strong className="text-slate-200">ITAE</strong> (Integral del Error Absoluto Ponderado por el Tiempo):
          Un valor más bajo indica mejor desempeño global. Compara las configuraciones para encontrar la que minimiza este índice.
        </p>
      </Card>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function PIDTunerSimulator() {
  const [plantIdx, setPlantIdx] = useState(1)
  const [view, setView] = useState(0)

  return (
    <div className="space-y-5">
      {/* Plant selector */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm text-slate-400 shrink-0">Planta:</span>
        <div className="flex flex-wrap gap-2">
          {PLANTS.map((p, i) => (
            <button
              key={i}
              onClick={() => setPlantIdx(i)}
              className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                plantIdx === i
                  ? 'bg-primary-600/30 border-primary-500 text-primary-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* View tabs */}
      <div className="flex gap-1 bg-slate-800/60 rounded-lg p-1">
        {VIEWS.map((v, i) => (
          <button
            key={i}
            onClick={() => setView(i)}
            className={`flex-1 text-xs py-2 rounded-md font-medium transition-colors ${
              view === i
                ? 'bg-slate-700 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {/* View content */}
      {view === 0 && <ExplorerView plantIdx={plantIdx} />}
      {view === 1 && <ZNView plantIdx={plantIdx} />}
      {view === 2 && <AdvancedView plantIdx={plantIdx} />}
    </div>
  )
}
