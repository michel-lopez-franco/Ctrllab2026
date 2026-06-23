export const LEVELS = [
  { level: 1, name: 'Aprendiz',    xpRequired: 0,    color: 'text-slate-400' },
  { level: 2, name: 'Estudiante',  xpRequired: 200,  color: 'text-green-400' },
  { level: 3, name: 'Técnico',     xpRequired: 500,  color: 'text-blue-400' },
  { level: 4, name: 'Ingeniero',   xpRequired: 1000, color: 'text-violet-400' },
  { level: 5, name: 'Especialista',xpRequired: 2000, color: 'text-amber-400' },
  { level: 6, name: 'Maestro',     xpRequired: 4000, color: 'text-red-400' },
]

export function getLevelForXP(xp) {
  let level = 1
  for (const l of LEVELS) {
    if (xp >= l.xpRequired) level = l.level
  }
  return level
}

export function getLevelInfo(level) {
  return LEVELS.find((l) => l.level === level) ?? LEVELS[0]
}

export function getXPForNextLevel(currentLevel) {
  const next = LEVELS.find((l) => l.level === currentLevel + 1)
  return next?.xpRequired ?? null
}
