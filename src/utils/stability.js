/**
 * Builds the Routh-Hurwitz table for a polynomial with coefficients
 * ordered highest-to-lowest: [a_n, a_{n-1}, ..., a_1, a_0].
 *
 * Returns:
 *   table   – 2D array of rows (each row has Math.ceil((n+1)/2) entries)
 *   stable  – boolean (all first-column elements positive)
 *   signChanges – number of sign changes in the first column
 *   firstCol – array of first-column values
 */
export function routhTable(coeffs) {
  const n = coeffs.length - 1 // polynomial degree
  if (n < 1) return { table: [], stable: false, signChanges: 0, firstCol: [] }

  const cols = Math.ceil((n + 1) / 2)
  // Initialize table with two first rows from alternating coefficients
  const table = Array.from({ length: n + 1 }, () => new Array(cols).fill(0))

  // Row 0: even-indexed coefficients (a_n, a_{n-2}, ...)
  for (let j = 0; j < cols; j++) table[0][j] = coeffs[2 * j] ?? 0
  // Row 1: odd-indexed coefficients (a_{n-1}, a_{n-3}, ...)
  for (let j = 0; j < cols; j++) table[1][j] = coeffs[2 * j + 1] ?? 0

  // Fill remaining rows
  for (let i = 2; i <= n; i++) {
    const prev = table[i - 1]
    const pprev = table[i - 2]
    // Pivot: first element of previous row; use epsilon replacement if zero
    const pivot = prev[0] !== 0 ? prev[0] : 1e-10

    for (let j = 0; j < cols - 1; j++) {
      table[i][j] = (prev[0] * pprev[j + 1] - pprev[0] * prev[j + 1]) / pivot
    }
  }

  const firstCol = table.map((row) => row[0])
  let signChanges = 0
  for (let i = 1; i < firstCol.length; i++) {
    if (firstCol[i] * firstCol[i - 1] < 0) signChanges++
  }

  const stable = firstCol.every((v) => v > 0)
  return { table, stable, signChanges, firstCol }
}

/**
 * Finds roots of a polynomial using the companion matrix eigenvalue method
 * (power iteration / Durand-Kerner for up to degree 6).
 * Returns array of { re, im } complex numbers.
 *
 * Uses Durand-Kerner (Weierstrass) iteration — robust for low-degree polynomials.
 */
export function polyRoots(coeffs) {
  const n = coeffs.length - 1
  if (n === 0) return []
  if (n === 1) return [{ re: -coeffs[1] / coeffs[0], im: 0 }]

  // Normalize
  const a = coeffs.map((c) => c / coeffs[0])

  if (n === 2) {
    const disc = a[1] * a[1] - 4 * a[2]
    if (disc >= 0) {
      return [
        { re: (-a[1] + Math.sqrt(disc)) / 2, im: 0 },
        { re: (-a[1] - Math.sqrt(disc)) / 2, im: 0 },
      ]
    }
    return [
      { re: -a[1] / 2, im: Math.sqrt(-disc) / 2 },
      { re: -a[1] / 2, im: -Math.sqrt(-disc) / 2 },
    ]
  }

  // Durand-Kerner initial approximations on a circle
  const roots = Array.from({ length: n }, (_, k) => {
    const angle = (2 * Math.PI * k) / n + 0.1
    return { re: 0.4 * Math.cos(angle), im: 0.4 * Math.sin(angle) }
  })

  // Evaluate polynomial at complex point
  const polyEval = (re, im) => {
    let rr = 1, ri = 0
    for (let i = 1; i <= n; i++) {
      const nr = rr * re - ri * im + (i < n ? 0 : 0)
      const ni = rr * im + ri * re
      rr = nr + (i <= n ? a[i] * (i === n ? 1 : 0) : 0)
      ri = ni
    }
    // Full Horner
    let vr = a[0], vi = 0
    for (let i = 1; i <= n; i++) {
      const nr = vr * re - vi * im + a[i]
      vi = vr * im + vi * re
      vr = nr
    }
    return { re: vr, im: vi }
  }

  // Complex division
  const cdiv = (ar, ai, br, bi) => {
    const d = br * br + bi * bi
    return { re: (ar * br + ai * bi) / d, im: (ai * br - ar * bi) / d }
  }

  for (let iter = 0; iter < 200; iter++) {
    let maxMove = 0
    for (let k = 0; k < n; k++) {
      const { re: pr, im: pi } = polyEval(roots[k].re, roots[k].im)
      let dr = 1, di = 0
      for (let j = 0; j < n; j++) {
        if (j === k) continue
        const diffR = roots[k].re - roots[j].re
        const diffI = roots[k].im - roots[j].im
        const nr = dr * diffR - di * diffI
        di = dr * diffI + di * diffR
        dr = nr
      }
      const w = cdiv(pr, pi, dr, di)
      roots[k].re -= w.re
      roots[k].im -= w.im
      maxMove = Math.max(maxMove, Math.abs(w.re) + Math.abs(w.im))
    }
    if (maxMove < 1e-10) break
  }

  // Round near-zero imaginary parts
  return roots.map((r) => ({
    re: Math.abs(r.re) < 1e-8 ? 0 : r.re,
    im: Math.abs(r.im) < 1e-8 ? 0 : r.im,
  }))
}

/**
 * Classifies system stability from its poles.
 */
export function classifyStability(roots) {
  const hasRHP = roots.some((r) => r.re > 1e-6)
  const hasImagAxis = !hasRHP && roots.some((r) => Math.abs(r.re) < 1e-6)
  if (hasRHP) return 'unstable'
  if (hasImagAxis) return 'marginally-stable'
  return 'stable'
}
