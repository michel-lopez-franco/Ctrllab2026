import { InlineMath, BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'

// Minimal markdown renderer: **bold**, `code`, tables, > blockquotes, ``` code blocks, and $math$ formulas
function inlineFormat(text) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\$[^\$]+\$)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>
    if (part.startsWith('`') && part.endsWith('`'))
      return <code key={i} className="bg-surface-elevated text-primary-300 px-1.5 py-0.5 rounded text-xs font-mono">{part.slice(1, -1)}</code>
    if (part.startsWith('$') && part.endsWith('$'))
      return <InlineMath key={i} math={part.slice(1, -1)} />
    return part
  })
}

export function ContentRenderer({ text }) {
  const lines = text.split('\n')
  const elements = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('|')) {
      const tableLines = []
      while (i < lines.length && lines[i].startsWith('|')) { tableLines.push(lines[i]); i++ }
      elements.push(
        <div key={`tbl-${i}`} className="overflow-x-auto my-4">
          <table className="w-full text-sm border-collapse">
            <tbody>
              {tableLines.map((row, ri) => {
                if (/^\|[-| ]+\|$/.test(row)) return null
                const cells = row.split('|').slice(1, -1)
                const isHeader = ri === 0
                return (
                  <tr key={ri} className={isHeader ? 'border-b border-slate-600' : 'border-b border-slate-800'}>
                    {cells.map((cell, ci) =>
                      isHeader
                        ? <th key={ci} className="px-3 py-2 text-left text-slate-300 font-semibold">{cell.trim()}</th>
                        : <td key={ci} className="px-3 py-2 text-slate-400">{cell.trim()}</td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )
      continue
    }

    if (line.startsWith('```')) {
      const codeLines = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) { codeLines.push(lines[i]); i++ }
      i++
      elements.push(
        <pre key={`code-${i}`} className="bg-slate-900 border border-surface-border rounded-lg p-4 text-xs font-mono text-primary-300 overflow-x-auto my-4 leading-relaxed">
          {codeLines.join('\n')}
        </pre>
      )
      continue
    }

    // Support block math block: $$ ... $$
    if (line.trim() === '$$') {
      const mathLines = []
      i++
      while (i < lines.length && lines[i].trim() !== '$$') {
        mathLines.push(lines[i])
        i++
      }
      i++
      elements.push(
        <div key={`math-${i}`} className="my-4 overflow-x-auto text-center py-2">
          <BlockMath math={mathLines.join('\n')} />
        </div>
      )
      continue
    }

    // Support single-line block math: $$math$$
    if (line.trim().startsWith('$$') && line.trim().endsWith('$$') && line.trim().length > 4) {
      const math = line.trim().slice(2, -2).trim()
      elements.push(
        <div key={`math-sl-${i}`} className="my-4 overflow-x-auto text-center py-2">
          <BlockMath math={math} />
        </div>
      )
      i++
      continue
    }

    // Support block math inside blockquote: > $$math$$
    if (line.startsWith('> $$') && line.endsWith('$$')) {
      const math = line.slice(4, -2).trim()
      elements.push(
        <div key={`bq-math-${i}`} className="my-4 pl-4 border-l-2 border-primary-500 bg-primary-500/5 rounded-r-lg py-3 pr-3 text-center overflow-x-auto">
          <BlockMath math={math} />
        </div>
      )
      i++
      continue
    }

    if (line.startsWith('> ')) {
      elements.push(
        <div key={`bq-${i}`} className="my-3 pl-4 border-l-2 border-primary-500 bg-primary-500/5 rounded-r-lg py-2 pr-3">
          <span className="text-slate-300 text-sm leading-relaxed">{inlineFormat(line.slice(2))}</span>
        </div>
      )
      i++; continue
    }

    if (line.trim() === '') { i++; continue }

    elements.push(
      <p key={`p-${i}`} className="text-slate-300 leading-7 text-sm mb-3">{inlineFormat(line)}</p>
    )
    i++
  }

  return <>{elements}</>
}
