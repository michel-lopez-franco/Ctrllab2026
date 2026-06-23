/**
 * Evaluates a simulation result against a challenge's specs.
 * Returns a score 0-100 and detailed feedback per criterion.
 */
export function evaluateChallenge(metrics, specs) {
  const results = []
  let totalScore = 0
  let totalWeight = 0

  if (specs.settlingTime?.max !== null && specs.settlingTime?.max !== undefined) {
    const weight = 30
    const pass = metrics.settlingTime <= specs.settlingTime.max
    const score = pass ? weight : Math.max(0, weight * (1 - (metrics.settlingTime - specs.settlingTime.max) / specs.settlingTime.max))
    results.push({
      criterion: 'Tiempo de establecimiento',
      achieved: metrics.settlingTime,
      target: specs.settlingTime.max,
      unit: specs.settlingTime.unit,
      pass,
      score: Math.round(score),
      weight,
      feedback: pass
        ? `Excelente. Tu sistema se establece en ${metrics.settlingTime.toFixed(2)}s (objetivo: ≤${specs.settlingTime.max}s).`
        : `Tu tiempo de establecimiento (${metrics.settlingTime.toFixed(2)}s) supera el objetivo (${specs.settlingTime.max}s). Considera aumentar Kd para reducir oscilaciones o Ki para corregir el error más rápido.`,
    })
    totalScore += score
    totalWeight += weight
  }

  if (specs.overshoot?.max !== null && specs.overshoot?.max !== undefined) {
    const weight = 35
    const pass = metrics.overshoot <= specs.overshoot.max
    const score = pass ? weight : Math.max(0, weight * (1 - (metrics.overshoot - specs.overshoot.max) / (specs.overshoot.max + 1)))
    results.push({
      criterion: 'Sobreimpulso',
      achieved: metrics.overshoot,
      target: specs.overshoot.max,
      unit: specs.overshoot.unit,
      pass,
      score: Math.round(score),
      weight,
      feedback: pass
        ? `Sobreimpulso controlado: ${metrics.overshoot.toFixed(1)}% (objetivo: ≤${specs.overshoot.max}%).`
        : `Tu sobreimpulso (${metrics.overshoot.toFixed(1)}%) excede el límite (${specs.overshoot.max}%). Reduce Kp o aumenta Kd para amortiguar la respuesta.`,
    })
    totalScore += score
    totalWeight += weight
  }

  if (specs.steadyStateError?.max !== null && specs.steadyStateError?.max !== undefined) {
    const weight = 35
    const pass = metrics.steadyStateError <= specs.steadyStateError.max
    const score = pass ? weight : Math.max(0, weight * (1 - (metrics.steadyStateError - specs.steadyStateError.max) / (specs.steadyStateError.max + 1)))
    results.push({
      criterion: 'Error en estado estacionario',
      achieved: metrics.steadyStateError,
      target: specs.steadyStateError.max,
      unit: specs.steadyStateError.unit,
      pass,
      score: Math.round(score),
      weight,
      feedback: pass
        ? `Error residual mínimo: ${metrics.steadyStateError.toFixed(2)}% (objetivo: ≤${specs.steadyStateError.max}%).`
        : `Tu error residual (${metrics.steadyStateError.toFixed(2)}%) supera el objetivo. Agrega o aumenta la acción integral (Ki) para eliminar el error en estado estacionario.`,
    })
    totalScore += score
    totalWeight += weight
  }

  const normalizedScore = totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) : 0
  const passed = results.every((r) => r.pass)

  return { score: normalizedScore, passed, criteria: results }
}
