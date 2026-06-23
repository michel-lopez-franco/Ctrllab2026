/**
 * Runge-Kutta 4 solver for ODEs of the form dx/dt = f(t, x, u)
 * where x is the state vector and u is the scalar input.
 */

/**
 * Single RK4 step.
 * @param {Function} f  - (t, x, u) => dx/dt as Float64Array
 * @param {number}   t  - current time
 * @param {Float64Array} x - current state
 * @param {number}   u  - current input
 * @param {number}   h  - step size
 */
function rk4Step(f, t, x, u, h) {
  const n = x.length
  const k1 = f(t, x, u)
  const x2 = new Float64Array(n).map((_, i) => x[i] + (h / 2) * k1[i])
  const k2 = f(t + h / 2, x2, u)
  const x3 = new Float64Array(n).map((_, i) => x[i] + (h / 2) * k2[i])
  const k3 = f(t + h / 2, x3, u)
  const x4 = new Float64Array(n).map((_, i) => x[i] + h * k3[i])
  const k4 = f(t + h, x4, u)
  return new Float64Array(n).map((_, i) => x[i] + (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]))
}

/**
 * Solve an ODE system over a time span.
 * @param {Function} f         - (t, x, u) => Float64Array of derivatives
 * @param {Float64Array} x0    - initial state
 * @param {Function} inputFn   - t => scalar input signal
 * @param {number} tEnd        - end time
 * @param {number} dt          - step size (default 0.01)
 * @returns {{ time, states }} - arrays of time and state vectors
 */
export function solveODE(f, x0, inputFn, tEnd, dt = 0.01) {
  const steps = Math.ceil(tEnd / dt)
  const time = new Float64Array(steps + 1)
  const states = []

  let x = new Float64Array(x0)
  time[0] = 0
  states.push(new Float64Array(x))

  for (let i = 0; i < steps; i++) {
    const t = i * dt
    const u = inputFn(t)
    x = rk4Step(f, t, x, u, dt)
    time[i + 1] = (i + 1) * dt
    states.push(new Float64Array(x))
  }

  return { time, states }
}

/** Unit step input function. */
export const stepInput = () => 1

/** Ramp input function. */
export const rampInput = (t) => t
