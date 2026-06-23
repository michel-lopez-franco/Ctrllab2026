import { useState } from 'react'
import { BodePlot } from './BodePlot.jsx'
import { NyquistPlot } from './NyquistPlot.jsx'

const VIEWS = ['Diagrama de Bode', 'Diagrama de Nyquist']

export function FrecuenciaSimulator({ onSimulate }) {
  const [view, setView] = useState(VIEWS[0])
  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        {VIEWS.map((v) => (
          <button key={v} onClick={() => setView(v)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === v ? 'bg-primary-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}>
            {v}
          </button>
        ))}
      </div>
      {view === VIEWS[0]
        ? <BodePlot onSimulate={onSimulate} />
        : <NyquistPlot onSimulate={onSimulate} />}
    </div>
  )
}
