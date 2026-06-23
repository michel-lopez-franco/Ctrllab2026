/**
 * Frequency-domain analysis utilities.
 * All transfer functions represented as { num: number[], den: number[] }
 * with coefficients ordered highest-to-lowest degree.
 */

/**
 * Evaluate G(jω) at a single frequency ω (rad/s).
 * Returns { re, im, mag, phase } where phase is in degrees.
 */
export function evalFreq(num, den, omega) {
  // Evaluate a polynomial at s = jω using Horner's method
  const evalPoly = (coeffs, re, im) => {
    let rr = 0, ri = 0
    for (const c of coeffs) {
      // (rr + j·ri)·(re + j·im) + c
      const nr = rr * re - ri * im + c
      ri = rr * im + ri * re
      rr = nr
    }
    return { re: rr, im: ri }
  }

  const n = evalPoly(num, 0, omega)   // numerator at jω
  const d = evalPoly(den, 0, omega)   // denominator at jω

  // G(jω) = n / d  (complex division)
  const denom = d.re * d.re + d.im * d.im
  if (denom < 1e-30) return { re: 0, im: 0, mag: 0, phase: 0 }

  const re = (n.re * d.re + n.im * d.im) / denom
  const im = (n.im * d.re - n.re * d.im) / denom
  const mag = Math.sqrt(re * re + im * im)
  const phase = Math.atan2(im, re) * (180 / Math.PI)

  return { re, im, mag, phase }
}

/**
 * Compute Bode plot data over a logarithmic frequency range.
 * @param {number[]} num
 * @param {number[]} den
 * @param {number}   wMin  - start frequency (rad/s)
 * @param {number}   wMax  - end frequency (rad/s)
 * @param {number}   points - number of frequency points
 * @returns {{ w: number[], magDB: number[], phase: number[] }}
 */
export function bodeData(num, den, wMin = 0.01, wMax = 100, points = 200) {
  const w = []
  const magDB = []
  const phase = []

  for (let i = 0; i < points; i++) {
    const omega = wMin * Math.pow(wMax / wMin, i / (points - 1))
    const { mag, phase: ph } = evalFreq(num, den, omega)
    w.push(omega)
    magDB.push(mag > 0 ? 20 * Math.log10(mag) : -120)
    phase.push(ph)
  }

  // Unwrap phase to avoid ±180° jumps
  for (let i = 1; i < phase.length; i++) {
    let diff = phase[i] - phase[i - 1]
    if (diff > 180) phase[i] -= 360
    if (diff < -180) phase[i] += 360
  }

  return { w, magDB, phase }
}

/**
 * Compute Nyquist plot data: G(jω) for ω in [wMin, wMax].
 * Returns { re: number[], im: number[], w: number[] }
 */
export function nyquistData(num, den, wMin = 0.01, wMax = 100, points = 300) {
  const re = [], im = [], w = []
  for (let i = 0; i < points; i++) {
    const omega = wMin * Math.pow(wMax / wMin, i / (points - 1))
    const g = evalFreq(num, den, omega)
    re.push(g.re)
    im.push(g.im)
    w.push(omega)
  }
  return { re, im, w }
}

/**
 * Compute gain margin (GM) and phase margin (PM).
 *
 * GM: gain at phase crossover frequency (where phase = −180°)
 *     GM_dB = −|G(jω_pc)|_dB
 *
 * PM: 180° + phase at gain crossover frequency (where |G| = 1, i.e., 0 dB)
 */
export function stabilityMargins(num, den, wMin = 0.001, wMax = 1000, points = 500) {
  const { w, magDB, phase } = bodeData(num, den, wMin, wMax, points)

  // Gain crossover: where magDB crosses 0 dB
  let wGC = null, pm = null
  for (let i = 1; i < magDB.length; i++) {
    if (magDB[i - 1] > 0 && magDB[i] <= 0) {
      // Linear interpolation
      const t = -magDB[i - 1] / (magDB[i] - magDB[i - 1])
      wGC = w[i - 1] + t * (w[i] - w[i - 1])
      const phGC = phase[i - 1] + t * (phase[i] - phase[i - 1])
      pm = 180 + phGC
      break
    }
  }

  // Phase crossover: where phase crosses −180°
  let wPC = null, gm = null
  for (let i = 1; i < phase.length; i++) {
    if (phase[i - 1] > -180 && phase[i] <= -180) {
      const t = (-180 - phase[i - 1]) / (phase[i] - phase[i - 1])
      wPC = w[i - 1] + t * (w[i] - w[i - 1])
      const magPC = magDB[i - 1] + t * (magDB[i] - magDB[i - 1])
      gm = -magPC
      break
    }
  }

  return { wGC, pm, wPC, gm }
}
