export const BADGES = [
  {
    id: 'first-simulation',
    name: 'Primer Paso',
    description: 'Ejecuta tu primera simulación',
    icon: '🎮',
    color: 'text-green-400',
    rarity: 'common',
    xpBonus: 25,
    condition: (stats) => stats.simulationsRun >= 1,
  },
  {
    id: 'simulation-enthusiast',
    name: 'Entusiasta',
    description: 'Ejecuta 50 simulaciones',
    icon: '🔬',
    color: 'text-blue-400',
    rarity: 'rare',
    xpBonus: 100,
    condition: (stats) => stats.simulationsRun >= 50,
  },
  {
    id: 'simulation-master',
    name: 'Maestro Simulador',
    description: 'Ejecuta 200 simulaciones',
    icon: '🧪',
    color: 'text-violet-400',
    rarity: 'epic',
    xpBonus: 250,
    condition: (stats) => stats.simulationsRun >= 200,
  },
  {
    id: 'no-overshoot',
    name: 'Sin Sobreimpulso',
    description: 'Diseña un sistema con sobreimpulso menor al 2%',
    icon: '📉',
    color: 'text-blue-400',
    rarity: 'rare',
    xpBonus: 75,
    condition: (stats) => stats.bestOvershoot !== null && stats.bestOvershoot < 2,
  },
  {
    id: 'perfect-response',
    name: 'Respuesta Perfecta',
    description: 'Logra sobreimpulso < 1% y error < 0.1%',
    icon: '💎',
    color: 'text-cyan-400',
    rarity: 'legendary',
    xpBonus: 300,
    condition: (stats) => 
      stats.bestOvershoot !== null && stats.bestOvershoot < 1 &&
      stats.bestSteadyStateError !== null && stats.bestSteadyStateError < 0.1,
  },
  {
    id: 'five-challenges',
    name: 'Desafiante',
    description: 'Completa 5 retos',
    icon: '🎯',
    color: 'text-amber-400',
    rarity: 'rare',
    xpBonus: 100,
    condition: (stats) => stats.challengesCompleted >= 5,
  },
  {
    id: 'challenge-champion',
    name: 'Campeón de Retos',
    description: 'Completa 20 retos',
    icon: '🏆',
    color: 'text-amber-400',
    rarity: 'epic',
    xpBonus: 200,
    condition: (stats) => stats.challengesCompleted >= 20,
  },
  {
    id: 'precise-control',
    name: 'Sintonizador Fino',
    description: 'Logra error en estado estacionario menor al 0.5%',
    icon: '🎛️',
    color: 'text-cyan-400',
    rarity: 'epic',
    xpBonus: 150,
    condition: (stats) => stats.bestSteadyStateError !== null && stats.bestSteadyStateError < 0.5,
  },
  {
    id: 'all-modules',
    name: 'Explorador Completo',
    description: 'Completa todos los módulos teóricos',
    icon: '📚',
    color: 'text-violet-400',
    rarity: 'epic',
    xpBonus: 200,
    condition: (stats) => stats.modulesCompleted >= 6,
  },
  {
    id: 'theory-master',
    name: 'Maestro Teórico',
    description: 'Obtén 100% en todos los quizzes',
    icon: '🎓',
    color: 'text-indigo-400',
    rarity: 'legendary',
    xpBonus: 350,
    condition: (stats) => stats.perfectScores >= 6,
  },
  {
    id: 'speed-runner',
    name: 'Tiempo Récord',
    description: 'Resuelve un reto en menos de 60 segundos',
    icon: '⚡',
    color: 'text-yellow-400',
    rarity: 'rare',
    xpBonus: 100,
    condition: (stats) => stats.fastestChallenge !== null && stats.fastestChallenge < 60,
  },
  {
    id: 'lightning-fast',
    name: 'Relámpago',
    description: 'Resuelve un reto en menos de 30 segundos',
    icon: '⚡',
    color: 'text-yellow-400',
    rarity: 'epic',
    xpBonus: 200,
    condition: (stats) => stats.fastestChallenge !== null && stats.fastestChallenge < 30,
  },
  {
    id: 'master-pid',
    name: 'Maestro PID',
    description: 'Completa todos los retos de sintonización PID',
    icon: '🎖️',
    color: 'text-red-400',
    rarity: 'legendary',
    xpBonus: 300,
    condition: (stats) => stats.pidChallengesCompleted >= 6,
  },
  {
    id: 'week-streak',
    name: 'Constancia',
    description: 'Usa la plataforma 7 días seguidos',
    icon: '🔥',
    color: 'text-orange-400',
    rarity: 'rare',
    xpBonus: 100,
    condition: (stats) => stats.streakDays >= 7,
  },
  {
    id: 'month-streak',
    name: 'Dedicación Total',
    description: 'Usa la plataforma 30 días seguidos',
    icon: '🔥',
    color: 'text-orange-400',
    rarity: 'legendary',
    xpBonus: 500,
    condition: (stats) => stats.streakDays >= 30,
  },
  {
    id: 'helpful-student',
    name: 'Estudiante Colaborativo',
    description: 'Completa 5 retos colaborativos',
    icon: '🤝',
    color: 'text-green-400',
    rarity: 'rare',
    xpBonus: 150,
    condition: (stats) => stats.collaborativeChallenges >= 5,
  },
  {
    id: 'independent-learner',
    name: 'Aprendiz Independiente',
    description: 'Completa 10 retos sin usar pistas',
    icon: '🧠',
    color: 'text-purple-400',
    rarity: 'epic',
    xpBonus: 200,
    condition: (stats) => stats.challengesCompleted >= 10 && stats.hintsUsed === 0,
  },
  {
    id: 'early-bird',
    name: 'Madrugador',
    description: 'Completa una sesión antes de las 8 AM',
    icon: '🌅',
    color: 'text-pink-400',
    rarity: 'rare',
    xpBonus: 75,
    condition: (stats) => stats.earlyBirdSessions >= 1,
  },
  {
    id: 'night-owl',
    name: 'Búho Nocturno',
    description: 'Completa una sesión después de las 10 PM',
    icon: '🦉',
    color: 'text-indigo-400',
    rarity: 'rare',
    xpBonus: 75,
    condition: (stats) => stats.nightOwlSessions >= 1,
  },
  {
    id: 'perfectionist',
    name: 'Perfeccionista',
    description: 'Obtén 10 puntuaciones perfectas',
    icon: '💯',
    color: 'text-amber-400',
    rarity: 'epic',
    xpBonus: 250,
    condition: (stats) => stats.perfectScores >= 10,
  },
]

export const RARITY_COLORS = {
  common: 'border-slate-500',
  rare: 'border-blue-500',
  epic: 'border-violet-500',
  legendary: 'border-amber-400',
}

export const RARITY_LABELS = {
  common: 'Común',
  rare: 'Raro',
  epic: 'Épico',
  legendary: 'Legendario',
}

export function getBadgesByRarity(rarity) {
  return BADGES.filter(b => b.rarity === rarity)
}

export function getEarnedBadges(earnedBadgeIds) {
  return BADGES.filter(b => earnedBadgeIds.includes(b.id))
}

export function getUnearnedBadges(earnedBadgeIds) {
  return BADGES.filter(b => !earnedBadgeIds.includes(b.id))
}

export function getBadgeProgress(stats) {
  return BADGES.map(badge => ({
    ...badge,
    earned: badge.condition(stats),
    progress: calculateBadgeProgress(badge, stats),
  }))
}

function calculateBadgeProgress(badge, stats) {
  // Simple heuristic to show progress towards badge
  if (badge.id === 'first-simulation') return Math.min(100, (stats.simulationsRun / 1) * 100)
  if (badge.id === 'simulation-enthusiast') return Math.min(100, (stats.simulationsRun / 50) * 100)
  if (badge.id === 'simulation-master') return Math.min(100, (stats.simulationsRun / 200) * 100)
  if (badge.id === 'five-challenges') return Math.min(100, (stats.challengesCompleted / 5) * 100)
  if (badge.id === 'challenge-champion') return Math.min(100, (stats.challengesCompleted / 20) * 100)
  if (badge.id === 'all-modules') return Math.min(100, (stats.modulesCompleted / 6) * 100)
  if (badge.id === 'week-streak') return Math.min(100, (stats.streakDays / 7) * 100)
  if (badge.id === 'month-streak') return Math.min(100, (stats.streakDays / 30) * 100)
  if (badge.id === 'perfectionist') return Math.min(100, (stats.perfectScores / 10) * 100)
  
  return badge.condition(stats) ? 100 : 0
}