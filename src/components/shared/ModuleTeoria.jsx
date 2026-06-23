import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/index.js'
import { ContentRenderer } from './ContentRenderer.jsx'

// Generic theory viewer. Receives sections array from moduleContent.
// Each section: { id, title, content: string (markdown) }

export function ModuleTeoria({ sections, onSectionRead }) {
  const [activeId, setActiveId] = useState(sections[0].id)
  const [read, setRead] = useState(new Set())

  const section = sections.find((s) => s.id === activeId)
  const currentIdx = sections.findIndex((s) => s.id === activeId)

  const markRead = (id) => {
    if (read.has(id)) return
    const next = new Set(read).add(id)
    setRead(next)
    onSectionRead?.(next.size)
  }

  const goTo = (id) => { setActiveId(id); markRead(id) }

  return (
    <div className="grid lg:grid-cols-[220px_1fr] gap-6">
      {/* TOC */}
      <nav className="space-y-1">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Secciones</p>
        {sections.map((s, i) => (
          <button key={s.id} onClick={() => goTo(s.id)}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2 ${
              activeId === s.id
                ? 'bg-primary-600/20 text-primary-300 border border-primary-500/30'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}>
            <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center shrink-0 font-mono ${
              read.has(s.id) ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-500'
            }`}>
              {read.has(s.id) ? '✓' : i + 1}
            </span>
            <span className="leading-tight">{s.title}</span>
          </button>
        ))}
        <p className="pt-3 text-xs text-slate-500">{read.size}/{sections.length} secciones leídas</p>
      </nav>

      {/* Content */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-white mb-5">{section.title}</h3>
        <ContentRenderer text={section.content} />

        <div className="flex justify-between mt-8 pt-5 border-t border-slate-700">
          <button onClick={() => currentIdx > 0 && goTo(sections[currentIdx - 1].id)}
            disabled={currentIdx === 0}
            className="text-sm text-slate-400 hover:text-slate-200 disabled:opacity-30 transition-colors">
            ← Anterior
          </button>
          <button onClick={() => {
            markRead(activeId)
            if (currentIdx < sections.length - 1) goTo(sections[currentIdx + 1].id)
          }}
            className="flex items-center gap-1 text-sm text-primary-400 hover:text-primary-300 transition-colors">
            {currentIdx < sections.length - 1 ? 'Siguiente sección' : '¡Listo! Ve al simulador'}
            <ChevronRight size={14} />
          </button>
        </div>
      </Card>
    </div>
  )
}
