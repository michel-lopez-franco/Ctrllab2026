import { solveODE, stepInput } from './solver.js'

/**
 * Convert a transfer function G(s) = num(s)/den(s) to controllable canonical
 * state-space form. Coefficients are ordered highest-to-lowest degree.
 *
 * For G(s) = b0 / (s^n + a1*s^(n-1) + ... + an)
 * returns matrices A (nxn), B (nx1), C (1xn), D (scalar)
 */
export function tfToStateSpace(num, den) {
  const n = den.length - 1 // system order
  // Normalize by leading coefficient of denominator
  const a0 = den[0]
  const a = den.slice(1).map((c) => c / a0)
  const b = num.map((c) => c / a0)

  // Pad numerator to length n+1
  const bPadded = new Array(n + 1).fill(0)
  const offset = n + 1 - b.length
  b.forEach((v, i) => (bPadded[offset + i] = v))

  const d = bPadded[0]
  const bNum = bPadded.slice(1).map((v, i) => v - d * a[i])

  // Companion (controllable canonical) form
  const A = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => {
      if (i < n - 1) return j === i + 1 ? 1 : 0
      return -a[n - 1 - j]
    })
  )

  const B = Array.from({ length: n }, (_, i) => (i === n - 1 ? 1 : 0))
  const C = bNum.slice().reverse()

  return { A, B, C, D: d, order: n }
}

/**
 * Build the ODE function for a state-space system.
 * Returns f(t, x, u) = A*x + B*u
 */
function makeSSDerivative(A, B) {
  const n = A.length
  return (t, x, u) => {
    const dx = new Float64Array(n)
    for (let i = 0; i < n; i++) {
      let sum = 0
      for (let j = 0; j < n; j++) sum += A[i][j] * x[j]
      dx[i] = sum + B[i] * u
    }
    return dx
  }
}

/**
 * Simulate a transfer function's step response.
 * @param {number[]} num  - numerator coefficients (highest first)
 * @param {number[]} den  - denominator coefficients (highest first)
 * @param {number}   tEnd - simulation end time
 * @param {number}   dt   - step size
 * @returns {{ time: number[], output: number[] }}
 */
export function simulateStepResponse(num, den, tEnd = 20, dt = 0.02) {
  const { A, B, C, D, order } = tfToStateSpace(num, den)
  const f = makeSSDerivative(A, B)
  const x0 = new Float64Array(order)

  const { time, states } = solveODE(f, x0, stepInput, tEnd, dt)

  const output = states.map((x) => {
    let y = D
    for (let i = 0; i < C.length; i++) y += C[i] * x[i]
    return y
  })

  return {
    time: Array.from(time),
    output,
  }
}

/**
 * Simulate a closed-loop PID-controlled system.
 * Plant: G(s) = num/den
 * Controller: C(s) = Kp + Ki/s + Kd*s (implemented in state space)
 *
 * Uses an augmented state: [plant states..., integral of error]
 */
export function simulatePID(num, den, pid, tEnd = 20, dt = 0.02) {
  const { kp, ki, kd } = pid
  const { A: Ap, B: Bp, C: Cp, D: Dp, order } = tfToStateSpace(num, den)

  // Augmented state: [x_plant (order), e_integral (1)]
  const n = order + 1

  const f = (t, x, _u) => {
    const xp = x.slice(0, order)
    const xi = x[order] // integral of error
    const ref = 1       // unit step reference

    // Plant output
    let yp = Dp
    for (let i = 0; i < Cp.length; i++) yp += Cp[i] * xp[i]

    const e = ref - yp

    // Derivative of error: approximate as -dy/dt using plant dynamics
    let dydt = 0
    for (let j = 0; j < Cp.length; j++) {
      let dxj = 0
      for (let k = 0; k < order; k++) dxj += Ap[j][k] * xp[k]
      dxj += Bp[j] * (kp * e + ki * xi)
      dydt += Cp[j] * dxj
    }

    const u = kp * e + ki * xi - kd * dydt

    const dx = new Float64Array(n)
    for (let i = 0; i < order; i++) {
      let sum = 0
      for (let j = 0; j < order; j++) sum += Ap[i][j] * xp[j]
      dx[i] = sum + Bp[i] * u
    }
    dx[order] = e // d(xi)/dt = error

    return dx
  }

  const x0 = new Float64Array(n)
  const { time, states } = solveODE(f, x0, stepInput, tEnd, dt)

  const output = states.map((x) => {
    let y = Dp
    for (let i = 0; i < Cp.length; i++) y += Cp[i] * x[i]
    return y
  })

  return { time: Array.from(time), output }
}

/**
 * Compute step response metrics from time/output arrays.
 * Assumes unit step reference (final value = 1 if no SS error).
 */
export function computeMetrics(time, output) {
  const n = output.length
  const finalValue = output[n - 1]
  const peak = Math.max(...output)
  const overshoot = finalValue > 0 ? ((peak - finalValue) / finalValue) * 100 : 0

  // Rise time: 10% to 90% of final value
  const t10 = finalValue * 0.1
  const t90 = finalValue * 0.9
  let riseStart = -1,
    riseEnd = -1
  for (let i = 0; i < n; i++) {
    if (riseStart < 0 && output[i] >= t10) riseStart = time[i]
    if (riseEnd < 0 && output[i] >= t90) riseEnd = time[i]
  }
  const riseTime = riseStart >= 0 && riseEnd >= 0 ? riseEnd - riseStart : null

  // Settling time: last time output leaves ±2% band of final value
  const band = Math.abs(finalValue) * 0.02
  let settlingTime = null
  for (let i = n - 1; i >= 0; i--) {
    if (Math.abs(output[i] - finalValue) > band) {
      settlingTime = time[i + 1] ?? time[n - 1]
      break
    }
  }
  if (settlingTime === null) settlingTime = 0

  const steadyStateError = Math.abs(1 - finalValue) * 100

  return {
    overshoot: Math.max(0, overshoot),
    riseTime,
    settlingTime,
    steadyStateError,
    finalValue,
    peakValue: peak,
  }
}
