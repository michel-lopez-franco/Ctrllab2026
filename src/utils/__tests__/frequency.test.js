import { describe, it, expect } from 'vitest'
import { evalFreq, bodeData, stabilityMargins } from '../frequency.js'

describe('evalFreq', () => {
  it('G(s) = 1/(s+1) at ω=0 → mag=1, phase=0', () => {
    const { mag, phase } = evalFreq([1], [1, 1], 0)
    expect(mag).toBeCloseTo(1, 4)
    expect(phase).toBeCloseTo(0, 2)
  })

  it('G(s) = 1/(s+1) at ω=1 → mag=1/√2, phase=−45°', () => {
    const { mag, phase } = evalFreq([1], [1, 1], 1)
    expect(mag).toBeCloseTo(1 / Math.SQRT2, 3)
    expect(phase).toBeCloseTo(-45, 1)
  })

  it('G(s) = 1/(s²+2s+1) at ω=1 → mag=0.5', () => {
    // G(j1) = 1/((j1)²+2(j1)+1) = 1/(−1+2j+1) = 1/(2j) → mag=0.5
    const { mag } = evalFreq([1], [1, 2, 1], 1)
    expect(mag).toBeCloseTo(0.5, 3)
  })
})

describe('bodeData', () => {
  it('returns arrays of same length', () => {
    const { w, magDB, phase } = bodeData([1], [1, 1], 0.1, 100, 50)
    expect(w.length).toBe(50)
    expect(magDB.length).toBe(50)
    expect(phase.length).toBe(50)
  })

  it('G(s)=1/(s+1): magnitude at ω=0.01 ≈ 0 dB', () => {
    // At very low frequency the gain is ≈ K = 1, i.e. 0 dB
    const { mag } = evalFreq([1], [1, 1], 0.01)
    expect(20 * Math.log10(mag)).toBeCloseTo(0, 0)
  })

  it('integrator G(s)=1/s: −20 dB/decade slope', () => {
    const { w, magDB } = bodeData([1], [1, 0], 1, 10, 2)
    // At ω=1: 0 dB; at ω=10: −20 dB
    expect(magDB[0]).toBeCloseTo(0, 0)
    expect(magDB[1]).toBeCloseTo(-20, 0)
  })
})

describe('stabilityMargins', () => {
  it('G(s) = 1/(s(s+1)(s+2)) — stable open loop with finite GM and PM', () => {
    // Classic 3-pole system: stable for K < 6
    const { gm, pm } = stabilityMargins([1], [1, 3, 2, 0])
    expect(gm).toBeGreaterThan(0)
    expect(pm).toBeGreaterThan(0)
    expect(gm).toBeCloseTo(15.56, 0) // 20*log10(6) ≈ 15.56 dB
  })
})
