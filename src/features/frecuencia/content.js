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

**Principio fundamental:** Para un sistema LTI estable, si la entrada es $u(t) = A \sin(\omega t)$, la salida en estado estacionario es:

> $$ y(t) = A |G(j\omega)| \sin(\omega t + \angle G(j\omega)) $$

El sistema no cambia la frecuencia: solo modifica la **amplitud** (por el factor $|G(j\omega)|$) y el **desfase** (por el ángulo $\angle G(j\omega)$).

Evaluar $G(j\omega)$ para distintos valores de $\omega$ traza la **respuesta en frecuencia** del sistema. Esta caracterización tiene ventajas prácticas enormes:
- Permite identificar sistemas experimentalmente (barrido sinusoidal)
- Revela directamente el ancho de banda del sistema
- Los criterios de estabilidad son gráficos e intuitivos
- El ruido, casi siempre de alta frecuencia, es directamente visible`,
    },
    {
      id: 'bode',
      title: 'Diagrama de Bode',
      content: `El diagrama de Bode representa la respuesta en frecuencia en dos gráficas separadas, usando **escala logarítmica en frecuencia**:

**Magnitud:** $|G(j\omega)|_{\text{dB}} = 20 \log_{10} |G(j\omega)|$ vs. $\log_{10}(\omega)$
**Fase:** $\angle G(j\omega)$ [grados] vs. $\log_{10}(\omega)$

La escala logarítmica convierte productos en sumas: si $G(s) = G_1(s) \cdot G_2(s)$, entonces:

> $$ |G|_{\text{dB}} = |G_1|_{\text{dB}} + |G_2|_{\text{dB}} $$
> $$ \angle G = \angle G_1 + \angle G_2 $$

Esto permite construir el Bode de $G$ sumando los diagramas de sus factores individuales.

**Factores elementales y sus efectos:**

| Factor | Magnitud | Fase |
|--------|---------|------|
| Ganancia $K$ | $20 \log_{10} K\text{ dB}$ (línea horizontal) | $0^\circ$ (ó $\pm 180^\circ$ si $K<0$) |
| Integrador $1/s$ | $-20\text{ dB/dec}$, pasa por $0\text{ dB}$ en $\omega=1$ | $-90^\circ$ constante |
| Polo real $1/(\tau s+1)$ | $0\text{ dB}$ para $\omega \ll 1/\tau$, $-20\text{ dB/dec}$ para $\omega \gg 1/\tau$ | $0^\circ$ a $-90^\circ$ centrado en $1/\tau$ |
| Cero real $(\tau s+1)$ | $+20\text{ dB/dec}$ para $\omega \gg 1/\tau$ | $0^\circ$ a $+90^\circ$ |
| Par complejo | $-40\text{ dB/dec}$, pico de resonancia en $\omega_n$ | $0^\circ$ a $-180^\circ$ |

**Frecuencia de quiebre** (corner frequency): $\omega_c = 1/\tau$ para un polo/cero de primer orden. Ahí la aproximación asintótica comete un error de exactamente $-3\text{ dB}$ (para un polo).`,
    },
    {
      id: 'margenes',
      title: 'Márgenes de estabilidad',
      content: `Los márgenes de estabilidad miden cuánto puede degradarse el sistema en lazo abierto antes de volverse inestable en lazo cerrado.

**Margen de fase ($\text{PM}$ — Phase Margin):**

> $$ \text{PM} = 180^\circ + \angle G(j\omega_{gc}) $$

Donde $\omega_{gc}$ es la **frecuencia de cruce de ganancia** (donde $|G(j\omega)| = 1$, es decir $0\text{ dB}$).

El $\text{PM}$ indica cuántos grados adicionales de desfase toleraría el sistema antes de llegar a $-180^\circ$ (inestabilidad). Un sistema con $\text{PM} = 45^\circ$ puede absorber $45^\circ$ más de retardo de fase.

**Margen de ganancia ($\text{GM}$ — Gain Margin):**

> $$ \text{GM}_{\text{dB}} = -|G(j\omega_{pc})|_{\text{dB}} $$

Donde $\omega_{pc}$ es la **frecuencia de cruce de fase** (donde $\angle G = -180^\circ$).

El $\text{GM}$ indica cuántos $\text{dB}$ de ganancia adicional toleraría el sistema antes de inestabilizarse.

**Reglas prácticas de diseño:**

| Especificación | Valor típico |
|---|---|
| Margen de fase mínimo | $30^\circ$ – $45^\circ$ |
| Margen de ganancia mínimo | $6$ – $12\text{ dB}$ |
| Relación $\text{PM} \leftrightarrow$ sobreimpulso | $\text{PM} \approx 100\zeta\ (^\circ)$ para $\zeta < 0.7$ |

Un sistema con $\text{PM} = 60^\circ$ y $\text{GM} = 12\text{ dB}$ se considera **robusto**. Con $\text{PM} < 30^\circ$ el sistema puede volverse inestable ante pequeñas perturbaciones o variaciones del modelo.`,
    },
    {
      id: 'nyquist',
      title: 'Diagrama de Nyquist',
      content: `El diagrama de Nyquist traza la curva $G(j\omega)$ en el **plano complejo** para $\omega$ de $-\infty$ a $+\infty$. Es la representación polar de la respuesta en frecuencia.

Puntos clave del diagrama:
- El punto $(-1, 0j)$ es la **frontera crítica de estabilidad**
- La distancia del diagrama al punto $-1$ determina los márgenes
- Para $\omega \to 0^+$: el punto de partida es $G(0) = \text{ganancia estática}$
- Para $\omega \to \infty$: $G(j\omega) \to 0$ (para sistemas propios)

**Criterio de Nyquist simplificado** (para sistemas de lazo abierto estables):

> El sistema en lazo cerrado es estable si y solo si el diagrama de Nyquist de $G(j\omega)H(j\omega)$ **no encierra** el punto $(-1, 0)$.

Si la curva pasa por la derecha del punto $-1$, el sistema lazo cerrado es estable.

**Margen de fase en Nyquist:**
Es el ángulo entre el eje real negativo y el vector desde el origen al punto donde el diagrama cruza el círculo unitario.

**Margen de ganancia en Nyquist:**
Es $1/|G(j\omega_{pc})|$, la distancia recíproca desde el origen al punto donde el diagrama cruza el eje real negativo.`,
    },
    {
      id: 'ancho-banda',
      title: 'Ancho de banda y velocidad de respuesta',
      content: `El **ancho de banda** ($\text{BW}$) de un sistema es la frecuencia $\omega_{\text{BW}}$ donde la magnitud cae $3\text{ dB}$ por debajo de su valor en DC (baja frecuencia).

> $$ |G(j\omega_{\text{BW}})| = \frac{|G(0)|}{\sqrt{2}} \quad (\text{magnitud } -3\text{ dB respecto al DC}) $$

**Relación con la respuesta temporal:**
- $\text{BW}$ alto $\to$ sistema rápido (tiempo de subida pequeño): $\text{BW} \approx 1.8/t_r$
- $\text{BW}$ bajo $\to$ sistema lento pero que filtra bien el ruido

Para un sistema de segundo orden estándar $G(s) = \frac{\omega_n^2}{s^2 + 2\zeta\omega_n s + \omega_n^2}$:

> $$ \text{BW} = \omega_n \sqrt{(1 - 2\zeta^2) + \sqrt{4\zeta^4 - 4\zeta^2 + 2}} $$

Para $\zeta = 0.7$: $\text{BW} \approx 1.27\omega_n$ (muy próximo a $\omega_n$).

**Tradeoff fundamental:**
- Mayor $\text{BW}$ $\to$ mayor velocidad de respuesta, pero más susceptibilidad al ruido de alta frecuencia
- Menor $\text{BW}$ $\to$ mayor filtrado de ruido, pero respuesta más lenta
- El diseño de controladores siempre balancea estos dos objetivos

**Sensibilidad a la frecuencia:**
La función de sensibilidad $S(s) = \frac{1}{1+G(s)}$ determina qué tan bien el sistema rechaza perturbaciones en cada frecuencia. El pico de $|S(j\omega)|$ está directamente relacionado con el margen de fase.`,
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
