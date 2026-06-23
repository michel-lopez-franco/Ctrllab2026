import { describe, it, expect } from 'vitest'
import { simulateStepResponse, computeMetrics, simulatePID } from '../transferFunction.js'

describe('simulateStepResponse', () => {
  it('2nd order system ζ=0.7 ωn=1 — overshoot ~4.6%', () => {
    // G(s) = 1 / (s^2 + 1.4s + 1)  (ζ=0.7, ωn=1)
    const { time, output } = simulateStepResponse([1], [1, 1.4, 1], 30, 0.01)
    const m = computeMetrics(time, output)
    expect(m.overshoot).toBeCloseTo(4.6, 0)
    expect(m.steadyStateError).toBeLessThan(1)
  })

  it('1st order system — no overshoot, correct settling', () => {
    // G(s) = 1 / (s + 1)  → DC gain = 1, τ = 1s
    const { time, output } = simulateStepResponse([1], [1, 1], 20, 0.01)
    const m = computeMetrics(time, output)
    expect(m.overshoot).toBeCloseTo(0, 0)
    expect(m.settlingTime).toBeLessThan(5)
  })

  it('returns correct array lengths', () => {
    const { time, output } = simulateStepResponse([1], [1, 2, 1], 10, 0.1)
    expect(time.length).toBe(output.length)
  })
})

describe('simulatePID', () => {
  it('adding Ki eliminates steady-state error', () => {
    // With only Kp, there is steady-state error due to finite gain
    const plant = { num: [1], den: [1, 2, 1] }
    const { time: tP, output: oP } = simulatePID(plant.num, plant.den, { kp: 2, ki: 0, kd: 0 }, 30, 0.02)
    const mP = computeMetrics(tP, oP)

    // Adding Ki should drive steady-state error toward zero
    const { time: tPI, output: oPI } = simulatePID(plant.num, plant.den, { kp: 2, ki: 1, kd: 0 }, 30, 0.02)
    const mPI = computeMetrics(tPI, oPI)

    expect(mPI.steadyStateError).toBeLessThan(mP.steadyStateError)
  })
})
