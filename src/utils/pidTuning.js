/**
 * PID tuning methods.
 * All return { kp, ki, kd } ready to pass to simulatePID().
 */

/**
 * Ziegler-Nichols closed-loop method (ultimate gain).
 * Requires: Ku (ultimate gain) and Tu (ultimate period in seconds).
 */
export function zieglerNicholsCL(Ku, Tu) {
  return {
    P:  { kp: 0.5  * Ku, ki: 0,              kd: 0 },
    PI: { kp: 0.45 * Ku, ki: 0.45 * Ku / (Tu / 1.2), kd: 0 },
    PID:{ kp: 0.6  * Ku, ki: 0.6  * Ku / (Tu / 2),   kd: 0.6 * Ku * Tu / 8 },
  }
}

/**
 * Ziegler-Nichols open-loop method (reaction curve).
 * Requires: K (process gain), L (dead time), T (time constant).
 * Approximates plant as K·e^(−Ls)/(Ts+1).
 */
export function zieglerNicholsOL(K, L, T) {
  const R = L / T  // ratio — method degrades for R > 0.3
  return {
    P:  { kp: T / (K * L),             ki: 0,                          kd: 0 },
    PI: { kp: 0.9 * T / (K * L),       ki: 0.9 * T / (K * L * 3.3 * L), kd: 0 },
    PID:{ kp: 1.2 * T / (K * L),       ki: 1.2 * T / (K * L * 2 * L),   kd: 0.6 * T / K },
  }
}

/**
 * Cohen-Coon method (open-loop, better for large dead time).
 * Requires: K, L, T (same as ZN open-loop).
 */
export function cohenCoon(K, L, T) {
  const r = L / T
  return {
    P: {
      kp: (1 / (K * r)) * (1 + r / 3),
      ki: 0, kd: 0,
    },
    PI: {
      kp: (1 / (K * r)) * (0.9 + r / 12),
      ki: (1 / (K * r)) * (0.9 + r / 12) / (L * (30 + 3 * r) / (9 + 20 * r)),
      kd: 0,
    },
    PID: {
      kp: (1 / (K * r)) * (4 / 3 + r / 4),
      ki: (1 / (K * r)) * (4 / 3 + r / 4) / (L * (32 + 6 * r) / (13 + 8 * r)),
      kd: (1 / (K * r)) * (4 / 3 + r / 4) * L * 4 / (11 + 2 * r),
    },
  }
}

/**
 * IMC-based PID tuning (Internal Model Control).
 * Requires: K, T, L (plant params) and λ (closed-loop time constant, tuning param).
 * Rule of thumb: λ ≥ max(0.1T, 0.8L).
 */
export function imcPID(K, T, L, lambda) {
  const lam = lambda ?? Math.max(0.1 * T, 0.8 * L)
  const kp = (2 * T + L) / (2 * K * (lam + L / 2))
  const ti = T + L / 2
  const td = T * L / (2 * T + L)
  return {
    kp,
    ki: kp / ti,
    kd: kp * td,
  }
}

/**
 * Compute ITAE (Integral of Time-weighted Absolute Error) from simulation data.
 * Lower is better.
 */
export function computeITAE(time, output, reference = 1) {
  let itae = 0
  for (let i = 1; i < time.length; i++) {
    const dt = time[i] - time[i - 1]
    const e = Math.abs(reference - output[i])
    itae += time[i] * e * dt
  }
  return itae
}
