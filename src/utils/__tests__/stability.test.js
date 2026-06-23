import { describe, it, expect } from 'vitest'
import { routhTable, polyRoots, classifyStability } from '../stability.js'

describe('routhTable', () => {
  it('s³+6s²+11s+6 — estable (raíces −1,−2,−3)', () => {
    const { stable, signChanges } = routhTable([1, 6, 11, 6])
    expect(stable).toBe(true)
    expect(signChanges).toBe(0)
  })

  it('s³+4s²+3s+12 — K=12, marginalmente estable → primera columna tiene cero', () => {
    const { firstCol } = routhTable([1, 4, 3, 12])
    // fila s¹: (4*3 − 1*12)/4 = 0
    expect(Math.abs(firstCol[2])).toBeLessThan(1e-6)
  })

  it('s³+s²−s+1 — inestable, 2 cambios de signo', () => {
    const { stable, signChanges } = routhTable([1, 1, -1, 1])
    expect(stable).toBe(false)
    expect(signChanges).toBeGreaterThanOrEqual(1)
  })

  it('coeficiente negativo → inestable directamente', () => {
    const { stable } = routhTable([1, -2, 3, 4])
    expect(stable).toBe(false)
  })
})

describe('polyRoots', () => {
  it('s²+1 → raíces ±j', () => {
    const roots = polyRoots([1, 0, 1])
    expect(roots).toHaveLength(2)
    expect(roots.some((r) => Math.abs(r.re) < 0.01 && Math.abs(Math.abs(r.im) - 1) < 0.01)).toBe(true)
  })

  it('s²+3s+2 → raíces −1 y −2', () => {
    const roots = polyRoots([1, 3, 2])
    const res = roots.map((r) => r.re).sort((a, b) => b - a)
    expect(res[0]).toBeCloseTo(-1, 2)
    expect(res[1]).toBeCloseTo(-2, 2)
  })

  it('s³+6s²+11s+6 → tres raíces reales negativas', () => {
    const roots = polyRoots([1, 6, 11, 6])
    expect(roots.every((r) => r.re < 0)).toBe(true)
  })
})

describe('classifyStability', () => {
  it('todos los polos en LHP → stable', () => {
    expect(classifyStability([{ re: -1, im: 0 }, { re: -2, im: 3 }])).toBe('stable')
  })
  it('polo en RHP → unstable', () => {
    expect(classifyStability([{ re: 0.1, im: 0 }, { re: -1, im: 0 }])).toBe('unstable')
  })
  it('polo en eje imaginario → marginally-stable', () => {
    expect(classifyStability([{ re: 0, im: 2 }, { re: -1, im: 0 }])).toBe('marginally-stable')
  })
})
