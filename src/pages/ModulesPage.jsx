import { NavLink } from 'react-router-dom'
import { Card, Button } from '@/components/ui/index.js'
import { BookOpen, Clock, Star } from 'lucide-react'

const MODULES = [
  {
    id: 'dinamica',
    title: 'Sistemas Dinámicos',
    description: 'Aprende a modelar sistemas físicos mediante ecuaciones diferenciales y variables de estado.',
    duration: '45 min',
    xp: 100,
    locked: false,
    topics: ['Modelos matemáticos', 'Variables de estado', 'Linealización'],
  },
  {
    id: 'temporal',
    title: 'Respuesta Temporal',
    description: 'Analiza la respuesta transitoria y el estado estacionario de sistemas de primer y segundo orden.',
    duration: '50 min',
    xp: 120,
    locked: false,
    topics: ['Sistemas de 1er orden', 'Sistemas de 2do orden', 'Métricas de desempeño'],
  },

  {
    id: 'estabilidad',
    title: 'Estabilidad',
    description: 'Determina la estabilidad de sistemas mediante criterios algebraicos y gráficos.',
    duration: '60 min',
    xp: 150,
    locked: false,
    topics: ['Criterio de Routh-Hurwitz', 'Plano de polos', 'Estabilidad BIBO'],
  },
  {
    id: 'frecuencia',
    title: 'Análisis en Frecuencia',
    description: 'Estudia la respuesta frecuencial mediante diagramas de Bode y Nyquist.',
    duration: '60 min',
    xp: 150,
    locked: false,
    topics: ['Diagrama de Bode', 'Diagrama de Nyquist', 'Márgenes de estabilidad'],
  },
  {
    id: 'pid',
    title: 'Control PID',
    description: 'Diseña y sintoniza controladores PID para cumplir especificaciones de desempeño.',
    duration: '70 min',
    xp: 200,
    locked: false,
    topics: ['Acción P, I, D', 'Métodos de sintonización', 'Limitaciones prácticas'],
  },
  {
    id: 'retos',
    title: 'Retos Integrados',
    description: 'Aplica todos los conceptos en escenarios reales de ingeniería industrial.',
    duration: '90 min',
    xp: 300,
    locked: false,
    topics: ['Control de temperatura', 'Motor DC', 'Control de nivel'],
  },
]

export function ModulesPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Módulos de aprendizaje</h2>
        <p className="text-slate-400 mt-1">Completa cada módulo en orden para desbloquear el siguiente.</p>
      </div>

      <div className="space-y-4">
        {MODULES.map((mod, i) => (
          <Card key={mod.id} className={`p-6 ${mod.locked ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${mod.locked ? 'bg-slate-700 text-slate-500' : 'bg-primary-600/30 text-primary-400'}`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-white">{mod.title}</h3>
                    {mod.locked && <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded">Bloqueado</span>}
                  </div>
                  <p className="text-sm text-slate-400 mt-1">{mod.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {mod.topics.map((t) => (
                      <span key={t} className="text-xs px-2 py-1 bg-slate-800 text-slate-400 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3 shrink-0">
                <div className="flex items-center gap-3 text-sm text-slate-400 font-semibold">
                  <span className="flex items-center gap-1"><Clock size={14} /> {mod.duration}</span>
                  <span className="flex items-center gap-1 xp-badge-prize text-sm"><Star size={14} className="fill-accent-400" /> +{mod.xp} XP</span>
                </div>
                {mod.locked ? (
                  <Button variant="secondary" size="sm" disabled>
                    <BookOpen size={14} />
                    Bloqueado
                  </Button>
                ) : (
                  <NavLink to={`/modules/${mod.id}`}>
                    <Button size="sm">
                      <BookOpen size={14} />
                      Comenzar
                    </Button>
                  </NavLink>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
