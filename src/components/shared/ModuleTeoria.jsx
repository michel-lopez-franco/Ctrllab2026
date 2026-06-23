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
        {sections.map((s, i) => {
          const isActive = activeId === s.id
          const isRead = read.has(s.id)
          return (
            <button key={s.id} onClick={() => goTo(s.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer border ${
                isActive
                  ? 'bg-primary-500/10 text-primary-300 border-primary-400/40 shadow-[0_0_10px_rgba(0,240,255,0.15)]'
                  : 'text-slate-400 hover:bg-surface-hover hover:text-slate-200 border-transparent'
              }`}>
              <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center shrink-0 font-mono transition-all duration-200 ${
                isActive
                  ? 'bg-primary-400 text-slate-950 font-bold shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                  : isRead
                  ? 'bg-secondary-500/20 text-secondary-400 border border-secondary-500/30'
                  : 'bg-surface-elevated text-slate-500 border border-surface-border'
              }`}>
                {isRead ? '✓' : i + 1}
              </span>
              <span className="leading-tight">{s.title}</span>
            </button>
          )
        })}
        <p className="pt-3 text-xs text-slate-500 font-mono">{read.size}/{sections.length} secciones leídas</p>
      </nav>

      {/* Content */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-white mb-5">{section.title}</h3>
        <ContentRenderer text={section.content} />

        <div className="flex justify-between mt-8 pt-5 border-t border-surface-border">
          <button onClick={() => currentIdx > 0 && goTo(sections[currentIdx - 1].id)}
            disabled={currentIdx === 0}
            className="text-sm font-semibold text-slate-400 hover:text-slate-200 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors">
            ← Anterior
          </button>
          <button onClick={() => {
            markRead(activeId)
            if (currentIdx < sections.length - 1) goTo(sections[currentIdx + 1].id)
          }}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer border ${
              currentIdx < sections.length - 1
                ? 'bg-primary-500/10 text-primary-300 border-primary-400/30 hover:bg-primary-500/20 hover:shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                : 'bg-gradient-to-r from-primary-500 to-primary-400 text-slate-950 shadow-[0_0_18px_rgba(0,240,255,0.45)] border-primary-300/40 hover:from-primary-400 hover:to-primary-300 hover:shadow-[0_0_25px_rgba(0,240,255,0.7)] hover:-translate-y-0.5'
            }`}
          >
            {currentIdx < sections.length - 1 ? 'Siguiente sección' : '¡Listo! Ve al simulador'}
            <ChevronRight size={14} />
          </button>
        </div>
      </Card>
    </div>
  )
}
