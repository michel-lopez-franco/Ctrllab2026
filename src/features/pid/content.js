export const moduleContent = {
  id: 'pid',
  title: 'Control PID',
  description: 'Diseña y sintoniza controladores PID para cumplir especificaciones de desempeño.',
  duration: '70 min',
  xpReward: 200,
  objectives: [
    'Comprender las acciones proporcional, integral y derivativa',
    'Analizar el efecto de cada ganancia sobre la respuesta',
    'Aplicar Ziegler-Nichols y otros métodos de sintonización',
    'Reconocer limitaciones prácticas: wind-up, ruido derivativo y saturación',
  ],
  sections: [
    {
      id: 'intro-pid',
      title: 'Estructura del Controlador PID',
      content: `
## ¿Qué es un controlador PID?

El controlador PID (Proporcional-Integral-Derivativo) es el algoritmo de control más utilizado en la industria. Se estima que más del **95%** de los lazos de control industriales usan alguna variante de este esquema.

Su ley de control en el dominio del tiempo es:

$$ u(t) = K_p e(t) + K_i \\int_{0}^{t} e(\\tau)d\\tau + K_d \\frac{de(t)}{dt} $$

donde $e(t) = r(t) - y(t)$ es el error entre la referencia $r$ y la salida medida $y$.

En el dominio de Laplace, la función de transferencia del controlador es:

$$ C(s) = K_p + \\frac{K_i}{s} + K_d s $$

o equivalentemente en forma paralela estándar:

$$ C(s) = K_p \\left(1 + \\frac{1}{T_i s} + T_d s\\right) $$

### Diagrama de lazo cerrado

> $r(t)$ $\\to$ [+] $\\to$ $C(s)$ $\\to$ $u(t)$ $\\to$ $P(s)$ $\\to$ $y(t)$
>              [−]  ↑________________________|

El error $e(t)$ entra al controlador. La salida $u(t)$ (señal de control) actúa sobre la planta $P(s)$, y la salida $y(t)$ regresa al punto de suma.

### Tres acciones en resumen

| Acción | Término | Efecto principal |
|--------|---------|-----------------|
| Proporcional | $K_p e$ | Respuesta inmediata al error |
| Integral | $K_i \\int e(t) dt$ | Elimina error en estado estacionario |
| Derivativa | $K_d \\dot{e}$ | Amortigua oscilaciones, predice error |
`,
    },
    {
      id: 'accion-p',
      title: 'Acción Proporcional',
      content: `
## Acción Proporcional (P)

La acción proporcional genera una señal de control **proporcional al error actual**:

$$ u_P(t) = K_p e(t) $$

### Efecto al variar $K_p$

| $K_p$ | Efecto |
|------|--------|
| Velocidad de respuesta | Aumenta |
| Sobreimpulso | Aumenta |
| Error de estado estacionario | Disminuye (pero no desaparece) |
| Estabilidad | Puede deteriorarse para $K_p$ muy alto |

### Error de estado estacionario con solo P

Para una planta de primer orden $G(s) = \\frac{K}{\\tau s + 1}$ con controlador proporcional puro:

$$ e_{ss} = \\frac{1}{1 + K_p K} $$

Nunca llega a cero con control P puro en una planta tipo 0.

### Ganancia última ($K_u$)

Existe un valor crítico de $K_p$ para el que el sistema oscila de manera sostenida (margen de estabilidad = 0). Este valor se llama **ganancia última $K_u$** y es la base del método de Ziegler-Nichols de lazo cerrado.

> **Consejo práctico**: $K_p$ debe ser lo suficientemente grande para reducir el error, pero no tan grande que cause oscilaciones persistentes. Un buen punto de partida es $K_p \\approx K_u/3$.
`,
    },
    {
      id: 'accion-id',
      title: 'Acciones Integral y Derivativa',
      content: `
## Acción Integral (I)

La acción integral **acumula** el error en el tiempo:

$$ u_I(t) = K_i \\int_{0}^{t} e(\\tau) d\\tau $$

**Beneficio**: elimina el error de estado estacionario en plantas tipo 0 (el integrador fuerza el error a cero en régimen permanente).

**Riesgo — Integral Wind-up**: Si la señal de control satura (la válvula está totalmente abierta), el integrador sigue acumulando aunque no pueda hacer nada. Cuando la condición de saturación termina, la acción integral acumulada causa un sobreimpulso excesivo.

**Soluciones**:
- Saturar internamente el integrador (anti-windup por saturación)
- Back-calculation: usar la diferencia entre la señal real y la saturada para "descargar" el integrador

---

## Acción Derivativa (D)

La acción derivativa reacciona a la **velocidad de cambio** del error:

$$ u_D(t) = K_d \\frac{de(t)}{dt} $$

**Beneficio**: efecto amortiguante, similar a añadir un "cojín" al sistema. Reduce el sobreimpulso y acorta el tiempo de asentamiento.

**Riesgos prácticos**:
- **Amplifica el ruido**: el ruido de alta frecuencia, derivado, genera señales de control muy grandes. Por eso en la práctica se aplica un filtro: $C_D(s) = \\frac{K_d s}{\\tau_f s + 1}$
- **Kick derivativo**: si la referencia cambia como un escalón, el término derivativo ve una derivada infinita y genera un impulso en la señal de control. Solución: derivar solo la salida, no el error.

### Resumen de acciones

\`\`\`
            Sobreimpulso   Velocidad   Error SS   Estabilidad
$K_p \\uparrow$           ↑            ↑          ↓           ↓
$K_i \\uparrow$           ↑↑           ↑         → 0          ↓↓
$K_d \\uparrow$           ↓            ↑ (leve)   —            ↑
\`\`\`
`,
    },
    {
      id: 'sintonia',
      title: 'Métodos de Sintonización',
      content: `
## ¿Qué es sintonizar un PID?

Sintonizar es encontrar los valores de $K_p$, $K_i$, $K_d$ que hacen que el sistema en lazo cerrado cumpla especificaciones: tiempo de asentamiento, sobreimpulso máximo, error estacionario.

---

## 1. Ziegler-Nichols — Método de lazo cerrado

**Procedimiento**:
1. Usar solo control proporcional ($K_i = K_d = 0$).
2. Aumentar $K_p$ lentamente hasta que el sistema oscile sostenidamente.
3. Registrar la **ganancia última $K_u$** y el **período de oscilación $T_u$**.
4. Aplicar las fórmulas:

| Tipo | $K_p$ | $T_i$ | $T_d$ |
|------|----|----|-----|
| P | $0.5 K_u$ | — | — |
| PI | $0.45 K_u$ | $T_u/1.2$ | — |
| PID | $0.6 K_u$ | $T_u/2$ | $T_u/8$ |

**Resultado típico**: sobreimpulso $\\approx 25\\%$, respuesta rápida pero oscilante. Requiere ajuste fino posterior.

---

## 2. Ziegler-Nichols — Método de la curva de reacción

Para plantas que se pueden modelar como $G(s) = \\frac{K e^{-Ls}}{T s + 1}$:
1. Aplicar un escalón en lazo abierto y registrar la respuesta.
2. Trazar la tangente en el punto de inflexión: determinar $L$ (tiempo muerto) y $T$ (constante de tiempo).
3. $K = \\frac{\\Delta Y}{\\Delta U}$ (ganancia de la planta).

**Fórmulas**:

| Tipo | $K_p$ | $T_i$ | $T_d$ |
|------|----|----|-----|
| P | $\\frac{T}{K L}$ | — | — |
| PI | $\\frac{0.9 T}{K L}$ | $3.3 L$ | — |
| PID | $\\frac{1.2 T}{K L}$ | $2 L$ | $0.5 L$ |

---

## 3. IMC (Internal Model Control)

Basado en el modelo inverso de la planta. El parámetro de sintonía es $\\lambda$ (tiempo de respuesta deseado):

$$ K_p = \\frac{2T + L}{2K(\\lambda + L/2)} $$
$$ T_i = T + \\frac{L}{2} $$
$$ T_d = \\frac{T L}{2T + L} $$

**Regla de oro**: $\\lambda \\ge \\max(0.1T, 0.8L)$. Un $\\lambda$ más grande = respuesta más lenta y robusta.

---

## 4. Criterio ITAE (Integral del Error Absoluto Ponderado por el Tiempo)

Minimiza $\\text{ITAE} = \\int_{0}^{\\infty} t |e(t)| dt$. Penaliza más el error tardío, produciendo respuestas con bajo sobreimpulso.

Los coeficientes óptimos ITAE están tabulados en función del orden de la planta.
`,
    },
    {
      id: 'limitaciones',
      title: 'Limitaciones y Mejoras Prácticas',
      content: `
## Limitaciones del PID en la práctica

### 1. Integral Wind-up

Ya descrito en la sección de acción integral. La solución estándar es **anti-windup por saturación**: se congela la integración cuando la salida alcanza sus límites.

\`\`\`
if (u_sat != u_pid):
    no integrar   // back-calculation o clamping
\`\`\`

### 2. Ruido en la derivada

El término derivativo amplifica el ruido de alta frecuencia. Siempre se filtra:

$$ C_D(s) = \\frac{K_d s}{\\tau_f s + 1} $$

donde $\\tau_f \\approx T_d/10$ es un filtro de primer orden. Equivale a una frecuencia de corte $\\omega_c = 10/T_d$.

### 3. Kick derivativo

Cuando la referencia cambia bruscamente, el derivativo de $e(t)$ produce un impulso. Solución: calcular la derivada de la salida $y(t)$ en lugar del error:

$$ u_D(t) = -K_d \\frac{dy(t)}{dt} $$

Esto se llama **"D en la medición"**.

### 4. Discrepancia de escala (MIMO)

En sistemas multivariable, un solo PID no es suficiente. Se necesitan técnicas de desacoplamiento o control multivariable.

### 5. Cuándo el PID no es suficiente

- Plantas con tiempo muerto grande ($L/T > 0.5$): usar Smith Predictor.
- Plantas no lineales severas: linealizar o usar control adaptivo.
- Requisitos muy estrictos de robustez: control $H_\\infty$ o $\\mu$-síntesis.

---

## Forma de velocidad vs. posición

La **forma de posición** calcula $u$ directamente. La **forma de velocidad** (incremental) calcula $\\Delta u$:

$$ \\Delta u(k) = K_p [e(k) - e(k-1)] + K_i T_s e(k) + \\frac{K_d}{T_s} [e(k) - 2e(k-1) + e(k-2)] $$

La forma de velocidad **previene automáticamente el wind-up** porque integra incrementalmente y naturalmente queda limitada por los actuadores.
`,
    },
  ],
  quiz: [
    {
      id: 'q1',
      question: '¿Cuál es el efecto principal de aumentar la ganancia proporcional Kp en un controlador PID?',
      options: [
        'Elimina el error de estado estacionario',
        'Aumenta la velocidad de respuesta pero puede incrementar el sobreimpulso',
        'Reduce el sobreimpulso y mejora la estabilidad',
        'No tiene efecto en la velocidad de respuesta',
      ],
      correct: 1,
      explanation: 'Aumentar Kp hace que el sistema responda más rápido a los errores, pero también puede causar mayor sobreimpulso e incluso inestabilidad si se exagera. Por sí solo no elimina el error estacionario en plantas tipo 0.',
    },
    {
      id: 'q2',
      question: '¿Qué fenómeno ocurre cuando el integrador de un PID sigue acumulando mientras el actuador está saturado?',
      options: [
        'Kick derivativo',
        'Ruido de derivada',
        'Integral wind-up',
        'Efecto de phaseo',
      ],
      correct: 2,
      explanation: 'El integral wind-up ocurre cuando el actuador satura (ej. válvula 100% abierta) pero el integrador sigue acumulando error. Al salir de saturación, la acción integral acumulada causa sobreimpulsos excesivos.',
    },
    {
      id: 'q3',
      question: 'En el método de Ziegler-Nichols de lazo cerrado, ¿qué se necesita medir?',
      options: [
        'La constante de tiempo T y el tiempo muerto L de la planta',
        'La ganancia última Ku y el período de oscilación Tu',
        'La ganancia de la planta K y el amortiguamiento ζ',
        'El margen de fase y el margen de ganancia',
      ],
      correct: 1,
      explanation: 'El método Z-N de lazo cerrado requiere llevar el sistema a oscilación sostenida con solo control proporcional para medir Ku (ganancia que provoca la oscilación) y Tu (período de esa oscilación). Con estos valores se calculan Kp, Ti, Td.',
    },
    {
      id: 'q4',
      question: '¿Por qué en muchos controladores industriales se deriva la salida y(t) en lugar del error e(t)?',
      options: [
        'Para calcular más rápido la derivada',
        'Para evitar el impulso en la señal de control cuando la referencia cambia bruscamente (kick derivativo)',
        'Porque la salida tiene menor ruido que el error',
        'Para mejorar el rechazo de perturbaciones',
      ],
      correct: 1,
      explanation: 'Cuando la referencia cambia como un escalón, derivar el error produce un impulso ("kick") en la señal de control. Derivar solo la salida elimina ese efecto: si r cambia de golpe, dy/dt no presenta discontinuidad.',
    },
    {
      id: 'q5',
      question: '¿Cuál de las siguientes afirmaciones sobre la acción integral (Ki) es CORRECTA?',
      options: [
        'Aumenta el orden del sistema en lazo abierto, garantizando error nulo en régimen estacionario',
        'Solo es útil para plantas de 2do orden o superior',
        'No afecta la velocidad de la respuesta transitoria',
        'Siempre mejora la estabilidad del sistema',
      ],
      correct: 0,
      explanation: 'La acción integral agrega un polo en el origen (integrador) al lazo abierto, elevando el tipo del sistema de 0 a 1. Un sistema tipo 1 tiene error nulo ante entrada escalón. Sin embargo, esto reduce el margen de estabilidad.',
    },
    {
      id: 'q6',
      question: 'En el método IMC (Internal Model Control), ¿cuál es el efecto de aumentar el parámetro λ?',
      options: [
        'Respuesta más rápida y mayor robustez frente a incertidumbre',
        'Respuesta más lenta pero mayor robustez frente a incertidumbre en el modelo',
        'Mayor sobreimpulso y menor tiempo de asentamiento',
        'Elimina la necesidad de la acción derivativa',
      ],
      correct: 1,
      explanation: 'λ en IMC es el tiempo de respuesta deseado. Un λ mayor produce ganancias PID más pequeñas → respuesta más lenta pero más robusta ante errores en el modelo de la planta. Un λ menor → respuesta rápida pero más sensible al modelo.',
    },
    {
      id: 'q7',
      question: '¿Cuál es la principal limitación del PID en plantas con tiempo muerto grande (L/T > 0.5)?',
      options: [
        'No puede eliminar el error estacionario',
        'El término derivativo no puede calcularse',
        'El tiempo muerto degrada el margen de fase y dificulta la sintonización estable',
        'La acción proporcional pierde efectividad',
      ],
      correct: 2,
      explanation: 'El tiempo muerto introduce un retraso de fase puro φ = −ωL que reduce el margen de fase en función de la frecuencia. Para L/T > 0.5 el PID estándar tiene poco margen para operar establemente; se recomienda el Smith Predictor u otras técnicas.',
    },
  ],
}
