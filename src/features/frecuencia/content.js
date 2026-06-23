export const moduleContent = {
  id: 'frecuencia',
  title: 'Análisis en Frecuencia',
  estimatedTime: 60,
  xpReward: 150,
  objectives: [
    'Construir e interpretar el diagrama de Bode de magnitud y fase a partir de la función de transferencia.',
    'Identificar las pendientes características de polos y ceros en el diagrama de Bode asintótico.',
    'Leer los márgenes de ganancia y fase en el diagrama de Bode y relacionarlos con la estabilidad del lazo cerrado.',
    'Interpretar el diagrama de Nyquist y aplicar el criterio de Nyquist simplificado.',
  ],
  sections: [
    {
      id: 'intro',
      title: 'Respuesta en frecuencia',
      content: `Hasta ahora analizamos sistemas observando cómo responden al tiempo (escalón, rampa). El **análisis en frecuencia** nos da una perspectiva complementaria: ¿cómo responde el sistema ante señales sinusoidales de distinta frecuencia?

**Principio fundamental:** Para un sistema LTI estable, si la entrada es u(t) = A·sin(ωt), la salida en estado estacionario es:

> y(t) = A·|G(jω)|·sin(ωt + ∠G(jω))

El sistema no cambia la frecuencia: solo modifica la **amplitud** (por el factor |G(jω)|) y el **desfase** (por el ángulo ∠G(jω)).

Evaluar G(jω) para distintos valores de ω traza la **respuesta en frecuencia** del sistema. Esta caracterización tiene ventajas prácticas enormes:
- Permite identificar sistemas experimentalmente (barrido sinusoidal)
- Revela directamente el ancho de banda del sistema
- Los criterios de estabilidad son gráficos e intuitivos
- El ruido, casi siempre de alta frecuencia, es directamente visible`,
    },
    {
      id: 'bode',
      title: 'Diagrama de Bode',
      content: `El diagrama de Bode representa la respuesta en frecuencia en dos gráficas separadas, usando **escala logarítmica en frecuencia**:

**Magnitud:** |G(jω)|_dB = 20·log₁₀|G(jω)|  vs.  log₁₀(ω)
**Fase:**     ∠G(jω) [grados]               vs.  log₁₀(ω)

La escala logarítmica convierte productos en sumas: si G(s) = G₁(s)·G₂(s), entonces:

> |G|_dB = |G₁|_dB + |G₂|_dB
> ∠G = ∠G₁ + ∠G₂

Esto permite construir el Bode de G sumando los diagramas de sus factores individuales.

**Factores elementales y sus efectos:**

| Factor | Magnitud | Fase |
|--------|---------|------|
| Ganancia K | 20·log₁₀K dB (línea horizontal) | 0° (ó ±180° si K<0) |
| Integrador 1/s | −20 dB/dec, pasa por 0 dB en ω=1 | −90° constante |
| Polo real 1/(τs+1) | 0 dB para ω≪1/τ, −20 dB/dec para ω≫1/τ | 0° a −90° centrado en 1/τ |
| Cero real (τs+1) | +20 dB/dec para ω≫1/τ | 0° a +90° |
| Par complejo | −40 dB/dec, pico de resonancia en ωₙ | 0° a −180° |

**Frecuencia de quiebre** (corner frequency): ω_c = 1/τ para un polo/cero de primer orden. Ahí la aproximación asintótica comete un error de exactamente −3 dB (para un polo).`,
    },
    {
      id: 'margenes',
      title: 'Márgenes de estabilidad',
      content: `Los márgenes de estabilidad miden cuánto puede degradarse el sistema en lazo abierto antes de volverse inestable en lazo cerrado.

**Margen de fase (PM — Phase Margin):**

> PM = 180° + ∠G(jω_gc)

Donde ω_gc es la **frecuencia de cruce de ganancia** (donde |G(jω)| = 1, es decir 0 dB).

El PM indica cuántos grados adicionales de desfase toleraría el sistema antes de llegar a −180° (inestabilidad). Un sistema con PM = 45° puede absorber 45° más de retardo de fase.

**Margen de ganancia (GM — Gain Margin):**

> GM [dB] = −|G(jω_pc)|_dB

Donde ω_pc es la **frecuencia de cruce de fase** (donde ∠G = −180°).

El GM indica cuántos dB de ganancia adicional toleraría el sistema antes de inestabilizarse.

**Reglas prácticas de diseño:**

| Especificación | Valor típico |
|---|---|
| Margen de fase mínimo | 30° – 45° |
| Margen de ganancia mínimo | 6 – 12 dB |
| Relación PM ↔ sobreimpulso | PM ≈ 100·ζ (°) para ζ < 0.7 |

Un sistema con PM = 60° y GM = 12 dB se considera **robusto**. Con PM < 30° el sistema puede volverse inestable ante pequeñas perturbaciones o variaciones del modelo.`,
    },
    {
      id: 'nyquist',
      title: 'Diagrama de Nyquist',
      content: `El diagrama de Nyquist traza la curva G(jω) en el **plano complejo** para ω de −∞ a +∞. Es la representación polar de la respuesta en frecuencia.

Puntos clave del diagrama:
- El punto (−1, 0j) es la **frontera crítica de estabilidad**
- La distancia del diagrama al punto −1 determina los márgenes
- Para ω → 0⁺: el punto de partida es G(0) = ganancia estática
- Para ω → ∞: G(jω) → 0 (para sistemas propios)

**Criterio de Nyquist simplificado** (para sistemas de lazo abierto estables):

> El sistema en lazo cerrado es estable si y solo si el diagrama de Nyquist de G(jω)·H(jω) **no encierra** el punto (−1, 0).

Si la curva pasa por la derecha del punto −1, el sistema lazo cerrado es estable.

**Margen de fase en Nyquist:**
Es el ángulo entre el eje real negativo y el vector desde el origen al punto donde el diagrama cruza el círculo unitario.

**Margen de ganancia en Nyquist:**
Es 1/|G(jω_pc)|, la distancia recíproca desde el origen al punto donde el diagrama cruza el eje real negativo.`,
    },
    {
      id: 'ancho-banda',
      title: 'Ancho de banda y velocidad de respuesta',
      content: `El **ancho de banda** (BW) de un sistema es la frecuencia ω_BW donde la magnitud cae 3 dB por debajo de su valor en DC (baja frecuencia).

> |G(jω_BW)| = |G(0)| / √2  →  magnitud −3 dB respecto al DC

**Relación con la respuesta temporal:**
- BW alto → sistema rápido (tiempo de subida pequeño): BW ≈ 1.8/tᵣ
- BW bajo → sistema lento pero que filtra bien el ruido

Para un sistema de segundo orden estándar G(s) = ωₙ²/(s² + 2ζωₙs + ωₙ²):

> BW = ωₙ · √(1 − 2ζ² + √(4ζ⁴ − 4ζ² + 2))

Para ζ = 0.7: BW ≈ 1.27·ωₙ (muy próximo a ωₙ).

**Tradeoff fundamental:**
- Mayor BW → mayor velocidad de respuesta, pero más susceptibilidad al ruido de alta frecuencia
- Menor BW → mayor filtrado de ruido, pero respuesta más lenta
- El diseño de controladores siempre balancea estos dos objetivos

**Sensibilidad a la frecuencia:**
La función de sensibilidad S(s) = 1/(1+G(s)) determina qué tan bien el sistema rechaza perturbaciones en cada frecuencia. El pico de |S(jω)| está directamente relacionado con el margen de fase.`,
    },
  ],

  quiz: [
    {
      id: 'q1',
      question: 'Un sistema G(s) = 10/(s+2) recibe u(t) = 3·sin(2t). En estado estacionario, ¿cuál es la amplitud de la salida?',
      options: [
        '15 (amplitud de entrada × ganancia DC)',
        '3·|G(2j)| = 3·(10/√8) ≈ 10.6',
        '3·|G(2j)| = 3·(10/(2√2+2)) ≈ 3·|G(2j)|',
        '3·10/√(4+4) = 3·10/(2√2) ≈ 10.6',
      ],
      correctIndex: 3,
      explanation:
        'La amplitud de salida es A_in · |G(jω)| evaluado en ω=2. G(2j) = 10/(2j+2) = 10/(2+2j). |G(2j)| = 10/√(4+4) = 10/(2√2) ≈ 3.536. Amplitud de salida = 3 × 3.536 ≈ 10.6. La ganancia DC (G(0) = 5) solo aplica para señales de frecuencia cero (escalón), no para sinusoides.',
    },
    {
      id: 'q2',
      question: '¿A qué frecuencia ocurre la "frecuencia de quiebre" del sistema G(s) = 5/(0.2s+1)?',
      options: [
        'ω_c = 0.2 rad/s',
        'ω_c = 5 rad/s',
        'ω_c = 1/0.2 = 5 rad/s',
        'ω_c = 1 rad/s',
      ],
      correctIndex: 2,
      explanation:
        'Para un polo de primer orden G(s) = K/(τs+1), la frecuencia de quiebre es ω_c = 1/τ. Con τ = 0.2s, ω_c = 1/0.2 = 5 rad/s. A esa frecuencia la magnitud real vale |G(5j)| = 5/√2 ≈ 3.54 (−3 dB respecto al valor DC de 5). Para ω≫5 la magnitud cae a razón de −20 dB/década.',
    },
    {
      id: 'q3',
      question: 'El diagrama de Bode de un sistema muestra que en ω = 10 rad/s el módulo es −6 dB y la fase es −210°. ¿Cuáles son los márgenes de estabilidad aproximados?',
      options: [
        'GM = 6 dB, PM = −30° — sistema inestable.',
        'GM = −6 dB, PM = 30° — sistema estable.',
        'GM = 6 dB, PM = 30° — sistema estable.',
        'No se pueden determinar sin más puntos de la curva.',
      ],
      correctIndex: 0,
      explanation:
        'En ω = 10 rad/s la fase es −210°, que es la frecuencia de cruce de fase (−180°+−30° de exceso). Pero la fase −210° < −180° indica que ω_pc ya fue superada. En ω_pc (donde fase = −180°), si la magnitud está −6 dB, entonces GM = +6 dB. Sin embargo, PM = 180° + (−210°) = −30°. PM negativo → sistema en lazo cerrado INESTABLE. Esta pregunta ilustra que GM positivo no garantiza estabilidad si PM es negativo.',
    },
    {
      id: 'q4',
      question: 'Un ingeniero aumenta la ganancia K de un controlador proporcional. ¿Qué ocurre con el margen de fase?',
      options: [
        'El margen de fase aumenta, ya que más ganancia acelera la respuesta.',
        'El margen de fase no cambia, solo cambia el margen de ganancia.',
        'El margen de fase disminuye: ω_gc aumenta hacia frecuencias con más desfase.',
        'El margen de fase aumenta solo si el sistema es de fase mínima.',
      ],
      correctIndex: 2,
      explanation:
        'Aumentar K desplaza hacia arriba la curva de magnitud del Bode. La frecuencia de cruce de ganancia ω_gc (donde |KG| = 1) se mueve hacia frecuencias mayores. En sistemas típicos (con mayor desfase a mayor frecuencia), esto significa que en la nueva ω_gc la fase es más negativa, reduciendo el margen de fase. Por eso aumentar excesivamente la ganancia proporcional puede desestabilizar el sistema.',
    },
    {
      id: 'q5',
      question: '¿Qué indica que el diagrama de Nyquist de G(jω) encierra el punto (−1, 0)?',
      options: [
        'Que el sistema en lazo abierto es inestable.',
        'Que el sistema en lazo cerrado es inestable (para planta estable en lazo abierto).',
        'Que el margen de ganancia es negativo, pero el sistema aún puede ser estable.',
        'Que la ganancia del sistema en DC es mayor que 1.',
      ],
      correctIndex: 1,
      explanation:
        'Según el criterio de Nyquist simplificado (para planta estable en lazo abierto): el sistema en lazo cerrado es estable si y solo si el diagrama de Nyquist NO encierra el punto (−1, 0). Si lo encierra, la cantidad de encerramientos (en sentido antihorario) indica cuántos polos tiene el lazo cerrado en el semiplano derecho. Esto no dice nada sobre la estabilidad del lazo abierto, solo del lazo cerrado.',
    },
    {
      id: 'q6',
      question: 'Un sistema de segundo orden con ζ = 0.5 y ωₙ = 10 rad/s tiene un ancho de banda aproximado de:',
      options: [
        'BW ≈ 5 rad/s (menor que ωₙ para sistemas subamortiguados)',
        'BW ≈ 10 rad/s (exactamente igual a ωₙ)',
        'BW ≈ 12.7 rad/s (mayor que ωₙ)',
        'BW ≈ 20 rad/s (doble de ωₙ)',
      ],
      correctIndex: 2,
      explanation:
        'Para un sistema de segundo orden: BW = ωₙ·√(1−2ζ²+√(4ζ⁴−4ζ²+2)). Con ζ=0.5: 1−2(0.25)=0.5; 4(0.0625)−4(0.25)+2=0.25−1+2=1.25; √1.25≈1.118; 0.5+1.118=1.618; √1.618≈1.27. BW ≈ 10×1.27 = 12.7 rad/s. Para sistemas subamortiguados (ζ<0.7) el BW es mayor que ωₙ debido al pico de resonancia que amplifica frecuencias cercanas a ωₙ.',
    },
    {
      id: 'q7',
      question: 'En el diagrama de Bode de G(s) = 1/(s²(s+1)), ¿cuál es la pendiente de la curva de magnitud para frecuencias muy bajas (ω → 0)?',
      options: [
        '−20 dB/décade (por el polo en s+1)',
        '−40 dB/décade (por el doble integrador s²)',
        '0 dB/décade (la ganancia es constante en baja frecuencia)',
        '−60 dB/décade (tres polos en total)',
      ],
      correctIndex: 1,
      explanation:
        'El doble integrador 1/s² domina el comportamiento a baja frecuencia. Cada integrador (1/s) contribuye −20 dB/décade a la pendiente, por lo que 1/s² da −40 dB/décade para ω→0. El polo (s+1) tiene frecuencia de quiebre en ω=1 y solo añade −20 dB/décade adicionales para ω>1. La fase para ω→0 es −180° (dos integradores × −90° cada uno).',
    },
  ],
}
