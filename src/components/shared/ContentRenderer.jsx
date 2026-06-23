// Minimal markdown renderer: **bold**, `code`, tables, > blockquotes, ``` code blocks

function inlineFormat(text) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>
    if (part.startsWith('`') && part.endsWith('`'))
      return <code key={i} className="bg-slate-800 text-cyan-300 px-1.5 py-0.5 rounded text-xs font-mono">{part.slice(1, -1)}</code>
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
        <pre key={`code-${i}`} className="bg-slate-900 border border-slate-700 rounded-lg p-4 text-xs font-mono text-cyan-300 overflow-x-auto my-4 leading-relaxed">
          {codeLines.join('\n')}
        </pre>
      )
      continue
    }

    if (line.startsWith('> ')) {
      elements.push(
        <div key={`bq-${i}`} className="my-3 pl-4 border-l-2 border-primary-500 bg-primary-900/10 rounded-r-lg py-2 pr-3">
          <code className="text-primary-300 text-sm font-mono">{line.slice(2)}</code>
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
