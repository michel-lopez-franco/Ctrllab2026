/**
 * Industrial challenge scenarios for Module 6.
 * Each challenge defines a physical scenario, the plant transfer function,
 * performance specs, hints, and pedagogical context.
 */

export const CHALLENGES = [
  {
    id: 'temperatura',
    title: 'Control de Temperatura',
    subtitle: 'Horno industrial',
    icon: '🌡️',
    difficulty: 'Básico',
    difficultyColor: 'text-green-400 border-green-500/30 bg-green-500/10',
    xpReward: 80,
    context: `Un horno industrial debe mantener 200°C para un proceso de fundición.
La planta está modelada como un sistema de primer orden con retardo equivalente.
La señal de control representa la potencia de los resistores (0–100%).`,
    equation: '$$G(s) = \\frac{1}{2s+1}$$',
    description: 'Sistema de primer orden con constante de tiempo τ = 2s',
    plant: { num: [1], den: [2, 1], label: 'G(s) = 1/(2s+1) — 1er orden, τ=2s' },
    reference: 1,
    tEnd: 30,
    dt: 0.05,
    specs: {
      settlingTime: { max: 12, unit: 's' },
      overshoot:    { max: 10, unit: '%' },
      steadyStateError: { max: 2, unit: '%' },
    },
    theory: `**Función de Transferencia:**

$$G(s) = \\frac{K}{\\tau s + 1} = \\frac{1}{2s+1}$$

**Controlador PID:**

$$C(s) = K_p + \\frac{K_i}{s} + K_d s$$

**Sistema en Lazo Cerrado:**

$$T(s) = \\frac{C(s)G(s)}{1 + C(s)G(s)}$$`,
    hints: [
      'Empieza con Kp ≈ 2 y observa la respuesta de primer orden.',
      'Agrega Ki pequeño (0.5–1) para eliminar el error residual.',
      'El sistema de primer orden no oscila mucho — Kd no es crítico aquí.',
    ],
    suggestedStart: { kp: 2, ki: 0.8, kd: 0 },
  },
  {
    id: 'motor-dc',
    title: 'Control de Velocidad',
    subtitle: 'Motor DC de precisión',
    icon: '⚙️',
    difficulty: 'Intermedio',
    difficultyColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    xpReward: 120,
    context: `Un motor DC controla la velocidad de una banda transportadora.
El modelo incluye la dinámica eléctrica (inductor) y mecánica (inercia + fricción).
La referencia es la velocidad normalizada (0–1). Cumple las especificaciones para evitar desgaste mecánico.`,
    equation: '$$G(s) = \\frac{1}{s^2+3s+2}$$',
    description: 'Sistema de segundo orden con polos en s = -1 y s = -2',
    plant: { num: [1], den: [1, 3, 2], label: 'G(s) = 1/(s²+3s+2) — 2do orden' },
    reference: 1,
    tEnd: 20,
    dt: 0.04,
    specs: {
      settlingTime: { max: 8, unit: 's' },
      overshoot:    { max: 15, unit: '%' },
      steadyStateError: { max: 1, unit: '%' },
    },
    theory: `**Función de Transferencia:**

$$G(s) = \\frac{1}{s^2+3s+2} = \\frac{1}{(s+1)(s+2)}$$

**Forma Estándar de 2do Orden:**

$$G(s) = \\frac{\\omega_n^2}{s^2 + 2\\zeta\\omega_n s + \\omega_n^2}$$

**Sobreimpulso:**

$$M_p = e^{-\\frac{\\pi\\zeta}{\\sqrt{1-\\zeta^2}}} \\times 100\\%$$`,
    hints: [
      'El sistema de 2do orden puede oscilar — introduce Kd para amortiguar.',
      'Kp ≈ 3, Ki ≈ 1, Kd ≈ 0.5 es un buen punto de partida.',
      'Si el sobreimpulso es alto, aumenta Kd. Si es lento, sube Kp.',
    ],
    suggestedStart: { kp: 3, ki: 0, kd: 0 },
  },
  {
    id: 'nivel-tanque',
    title: 'Control de Nivel',
    subtitle: 'Tanque de proceso químico',
    icon: '🪣',
    difficulty: 'Intermedio',
    difficultyColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    xpReward: 120,
    context: `Un tanque de proceso debe mantener un nivel constante de líquido.
La entrada es la apertura de la válvula de entrada (0–100%).
El nivel debe estabilizarse en la referencia con mínimo error para evitar derrames o vaciado.`,
    equation: '$$G(s) = \\frac{2}{s^2+s} = \\frac{2}{s(s+1)}$$',
    description: 'Sistema con integrador puro y polo en s = -1',
    plant: { num: [2], den: [1, 1, 0], label: 'G(s) = 2/(s²+s) — integrador + 1er orden' },
    reference: 1,
    tEnd: 25,
    dt: 0.04,
    specs: {
      settlingTime: { max: 10, unit: 's' },
      overshoot:    { max: 20, unit: '%' },
      steadyStateError: { max: 1, unit: '%' },
    },
    theory: `**Función de Transferencia:**

$$G(s) = \\frac{2}{s(s+1)}$$

**Error en Estado Estacionario (Tipo 1):**

$$e_{ss} = \\lim_{s \\to 0} \\frac{sR(s)}{1 + G(s)C(s)} = 0$$

**Nota:** El integrador en la planta elimina el error de estado estacionario para entrada escalón.`,
    hints: [
      'La planta ya tiene un integrador — ten cuidado con agregar Ki (puede causar wind-up).',
      'Prueba solo control P (Kp ≈ 1) antes de agregar derivativo.',
      'Kd ayuda mucho aquí para contrarrestar el integrador de la planta.',
    ],
    suggestedStart: { kp: 1, ki: 0, kd: 0.5 },
  },
  {
    id: 'pendulo',
    title: 'Estabilización de Péndulo',
    subtitle: 'Péndulo invertido — balance de precisión',
    icon: '🎯',
    difficulty: 'Avanzado',
    difficultyColor: 'text-red-400 border-red-500/30 bg-red-500/10',
    xpReward: 180,
    context: `Un sistema de péndulo invertido linearizado representa el desafío clásico de control.
La planta es intrínsecamente inestable. Tu controlador debe estabilizarlo y seguir la referencia.
Representa sistemas como balance de robots, cohetes, y plataformas de estabilización.`,
    equation: '$$G(s) = \\frac{1}{s^2-1}$$',
    description: 'Sistema inestable con polos en s = ±1',
    plant: { num: [1], den: [1, 0, -1], label: 'G(s) = 1/(s²−1) — planta inestable' },
    reference: 1,
    tEnd: 15,
    dt: 0.02,
    specs: {
      settlingTime: { max: 6, unit: 's' },
      overshoot:    { max: 25, unit: '%' },
      steadyStateError: { max: 3, unit: '%' },
    },
    theory: `**Función de Transferencia:**

$$G(s) = \\frac{1}{s^2-1} = \\frac{1}{(s-1)(s+1)}$$

**Polos:** 

$s_1 = +1$ (inestable), $s_2 = -1$ (estable)

**Criterio de Estabilidad:**

Para estabilizar, el controlador debe mover el polo inestable al semiplano izquierdo:

$$\\text{Re}(s_i) < 0 \\quad \\forall i$$`,
    hints: [
      'La planta es inestable — necesitas Kp alto (≥ 5) para estabilizarla primero.',
      'Kd es esencial para contra-actuar el polo inestable en s=+1.',
      'Una vez estable con P+D, agrega Ki pequeño (≤ 1) con cuidado.',
    ],
    suggestedStart: { kp: 5, ki: 0, kd: 2 },
  },
  {
    id: 'presion',
    title: 'Control de Presión',
    subtitle: 'Compresor industrial',
    icon: '💨',
    difficulty: 'Avanzado',
    difficultyColor: 'text-red-400 border-red-500/30 bg-red-500/10',
    xpReward: 180,
    context: `Un compresor industrial regula la presión en una tubería de distribución.
La dinámica de 3er orden modela el compresor, la tubería y el sensor de presión en cascada.
Las oscilaciones de presión causan fatiga en tuberías — el sobreimpulso debe ser mínimo.`,
    equation: '$$G(s) = \\frac{1}{s^3+6s^2+11s+6}$$',
    description: 'Sistema de tercer orden con polos en s = -1, -2, -3',
    plant: { num: [1], den: [1, 6, 11, 6], label: 'G(s) = 1/(s³+6s²+11s+6) — 3er orden' },
    reference: 1,
    tEnd: 20,
    dt: 0.04,
    specs: {
      settlingTime: { max: 8, unit: 's' },
      overshoot:    { max: 5, unit: '%' },
      steadyStateError: { max: 1, unit: '%' },
    },
    theory: `**Función de Transferencia:**

$$G(s) = \\frac{1}{(s+1)(s+2)(s+3)}$$

**Margen de Fase:**

$$\\phi_m = \\angle G(j\\omega_{gc})C(j\\omega_{gc}) + 180^\\circ$$

**Relación con Sobreimpulso:**

$$M_p \\approx e^{-\\frac{\\pi\\phi_m}{180^\\circ-\\phi_m}}$$`,
    hints: [
      'El 3er orden tiene más desfase — sube Kp con cuidado para no desestabilizar.',
      'La restricción de sobreimpulso ≤5% es exigente: prioriza Kd sobre Kp.',
      'Prueba Kp=8, Ki=2, Kd=5 y ajusta.',
    ],
    suggestedStart: { kp: 6, ki: 0, kd: 3 },
  },
  {
    id: 'servo',
    title: 'Control de Posición',
    subtitle: 'Servomotor de precisión CNC',
    icon: '🤖',
    difficulty: 'Experto',
    difficultyColor: 'text-violet-400 border-violet-500/30 bg-violet-500/10',
    xpReward: 250,
    context: `Un servomotor de una fresadora CNC debe posicionar la herramienta con precisión submilimétrica.
El sistema requiere error estacionario prácticamente nulo y mínimo sobreimpulso para no dañar la pieza.
Este es el escenario más exigente — aplica todo lo aprendido.`,
    equation: '$$G(s) = \\frac{4}{s^3+5s^2+4s} = \\frac{4}{s(s+1)(s+4)}$$',
    description: 'Sistema tipo 1 con integrador y dos polos reales',
    plant: { num: [4], den: [1, 5, 4, 0], label: 'G(s) = 4/(s³+5s²+4s) — integrador + 2 polos' },
    reference: 1,
    tEnd: 20,
    dt: 0.03,
    specs: {
      settlingTime: { max: 7, unit: 's' },
      overshoot:    { max: 5, unit: '%' },
      steadyStateError: { max: 0.5, unit: '%' },
    },
    theory: `**Función de Transferencia:**

$$G(s) = \\frac{4}{s(s+1)(s+4)}$$

**Sistema Tipo 1:** 

Error nulo para entrada escalón

**Tiempo de Establecimiento (2%):**

$$t_s \\approx \\frac{4}{\\zeta\\omega_n}$$

**Controlador PID Ideal:**

$$C(s) = K_p\\left(1 + \\frac{1}{T_i s} + T_d s\\right)$$`,
    hints: [
      'La planta tiene un integrador — no necesitas Ki para eliminar error SS.',
      'Con P solo (Kp ≈ 1) ya no habrá error, pero habrá oscilaciones.',
      'Kd es clave para cumplir el sobreimpulso ≤5%. Prueba Kp=1.5, Ki=0, Kd=1.',
    ],
    suggestedStart: { kp: 1.5, ki: 0, kd: 1 },
  },
]