export const moduleContent = {
  id: 'temporal',
  title: 'Respuesta Temporal',
  estimatedTime: 50,
  xpReward: 120,
  objectives: [
    'Calcular e interpretar las métricas de desempeño: sobreimpulso, tiempo de subida, tiempo de establecimiento y error en estado estacionario.',
    'Predecir cualitativamente la respuesta al escalón de un sistema de primer orden a partir de τ y K.',
    'Relacionar ζ y ωₙ con las características de la respuesta transitoria de un sistema de segundo orden.',
    'Identificar los regímenes de amortiguamiento (sub, crítico, sobre) y su impacto en la respuesta.',
  ],
  sections: [
    {
      id: 'metricas',
      title: 'Métricas de desempeño',
      content: `Cuando aplicamos un escalón unitario a un sistema de control, evaluamos su calidad mediante cuatro métricas estándar.

**Tiempo de subida (tᵣ)** — tiempo en que la salida pasa del 10% al 90% de su valor final. Indica qué tan rápido responde el sistema.

**Tiempo de establecimiento (tₛ)** — último instante en que la salida sale de la banda del ±2% alrededor del valor final. Indica cuándo el transitorio ha "terminado".

**Sobreimpulso (Mp)** — pico máximo por encima del valor final, expresado en porcentaje:

> Mp = (y_max − y_∞) / y_∞ × 100 %

**Error en estado estacionario (ess)** — diferencia entre la referencia y la salida una vez que el transitorio desaparece:

> ess = |1 − y_∞| × 100 %

Estas cuatro métricas a menudo están en conflicto: reducir el tiempo de subida suele aumentar el sobreimpulso. El reto del diseñador de control es encontrar el balance adecuado para la aplicación.`,
    },
    {
      id: 'primer-orden',
      title: 'Sistemas de primer orden',
      content: `Un sistema de primer orden tiene la función de transferencia:

> G(s) = K / (τs + 1)

Donde **K** es la ganancia estática y **τ** es la constante de tiempo.

**Respuesta al escalón:** y(t) = K · (1 − e^(−t/τ))

Propiedades importantes:
- En t = τ, la salida alcanza el **63.2%** del valor final (K)
- En t = 2τ → 86.5%; en t = 3τ → 95%; en t = 4τ → 98.2%
- Se considera establecido en t ≈ 4τ (criterio del 2%)
- **No hay sobreimpulso** en sistemas de primer orden puros
- La pendiente inicial de la respuesta es K/τ

**Efecto de los parámetros:**
- Aumentar **τ** hace la respuesta más lenta (mayor tₛ)
- Aumentar **K** sube el valor final pero no cambia la velocidad relativa
- El tiempo de subida aproximado es tᵣ ≈ 2.2τ

**Ejemplo:** Un termómetro con τ = 5s tardará ≈ 20s en estabilizarse ante un cambio brusco de temperatura.`,
    },
    {
      id: 'segundo-orden',
      title: 'Sistemas de segundo orden',
      content: `La forma estándar de un sistema de segundo orden es:

> G(s) = ωₙ² / (s² + 2ζωₙs + ωₙ²)

Con dos parámetros fundamentales:
- **ωₙ** (rad/s) — frecuencia natural: qué tan rápido oscilaría el sistema sin amortiguamiento
- **ζ** (adimensional) — coeficiente de amortiguamiento: cuánta energía disipa el sistema

**Los polos** del sistema son: s₁,₂ = −ζωₙ ± ωₙ√(ζ²−1)

**Regímenes de amortiguamiento:**

| Condición | Régimen | Respuesta |
|-----------|---------|-----------|
| 0 < ζ < 1 | Subamortiguado | Oscilatoria con decaimiento exponencial |
| ζ = 1 | Críticamente amortiguado | Más rápida sin oscilar |
| ζ > 1 | Sobreamortiguado | Exponencial lenta, sin oscilación |
| ζ = 0 | Sin amortiguamiento | Oscilación sostenida (inestable en lazo abierto) |

**Fórmulas para el caso subamortiguado (0 < ζ < 1):**

> Mp = e^(−πζ/√(1−ζ²)) × 100 %
> tᵣ ≈ (1.8) / ωₙ
> tₛ ≈ 4 / (ζωₙ)   (criterio 2%)

Nota: tₛ depende principalmente de **ζωₙ** (parte real del polo). Para establecimiento rápido, necesitamos ζωₙ grande.`,
    },
    {
      id: 'polos-zeros',
      title: 'Efecto de polos y ceros',
      content: `La ubicación de los polos en el plano complejo determina completamente el carácter de la respuesta temporal.

**Polos reales negativos** (−a) → término exponencial e^(−at): decae más rápido cuanto más alejado del origen.

**Polos complejos conjugados** (−σ ± jω_d):
- σ = ζωₙ controla la velocidad de decaimiento del envolvente
- ω_d = ωₙ√(1−ζ²) es la **frecuencia amortiguada** (frecuencia real de oscilación)

**Polo dominante:** Si hay varios polos, el de menor parte real en valor absoluto domina la respuesta (los demás decaen mucho más rápido).

**Efecto de un cero:** Un cero en s = −z agrega un término derivativo que:
- Aumenta el sobreimpulso si el cero está en el semiplano izquierdo (cero de fase mínima)
- Puede hacer que la respuesta vaya inicialmente "hacia atrás" si el cero es positivo (cero de no-mínima fase)

**Regla práctica:** Para que la aproximación de segundo orden sea válida, los polos más rápidos deben estar al menos 5 veces más lejos del origen que los polos dominantes.`,
    },
    {
      id: 'error-ss',
      title: 'Error en estado estacionario',
      content: `El error en estado estacionario depende del **tipo de sistema** (número de integradores en lazo abierto) y del tipo de entrada.

**Teorema del valor final:** Si el sistema es estable, el valor final de y(t) es:

> y_∞ = lim_(s→0) s·Y(s) = lim_(s→0) s · G(s)/(1+G(s)) · R(s)

Para un sistema en lazo abierto G(s) con realimentación unitaria:

| Tipo | Escalón | Rampa | Parábola |
|------|---------|-------|----------|
| Tipo 0 | ess = 1/(1+Kp) | ∞ | ∞ |
| Tipo 1 | ess = 0 | 1/Kv | ∞ |
| Tipo 2 | ess = 0 | ess = 0 | 1/Ka |

Donde Kp = G(0), Kv = lim_(s→0) s·G(s), Ka = lim_(s→0) s²·G(s).

**Conclusión práctica:** Para eliminar el error ante una referencia escalón, necesitamos al menos un integrador en el controlador (acción integral — la "I" del PID).`,
    },
  ],

  quiz: [
    {
      id: 'q1',
      question: 'Un sistema de primer orden tiene τ = 2s y K = 3. Ante un escalón unitario, ¿cuál es el valor de la salida en t = 2s?',
      options: [
        'y(2) ≈ 1.90  (63.2% de K)',
        'y(2) ≈ 2.59  (86.5% de K)',
        'y(2) ≈ 1.26  (63.2% de K × 1 — error de escala)',
        'y(2) = 3.00  (valor final)',
      ],
      correctIndex: 0,
      explanation:
        'En t = τ = 2s, la respuesta alcanza el 63.2% del valor final. El valor final es K = 3, entonces y(2) = 0.632 × 3 ≈ 1.90. La fórmula es y(t) = K(1 − e^(−t/τ)), con t = τ: y(τ) = K(1 − e⁻¹) = 3 × 0.632 ≈ 1.90.',
    },
    {
      id: 'q2',
      question: 'Para un sistema de segundo orden con ζ = 0.5 y ωₙ = 4 rad/s, ¿cuál es el sobreimpulso porcentual aproximado?',
      options: [
        'Mp ≈ 4.6%',
        'Mp ≈ 16.3%',
        'Mp ≈ 0% (sistema sobreamortiguado)',
        'Mp ≈ 50%',
      ],
      correctIndex: 1,
      explanation:
        'Usando la fórmula Mp = e^(−πζ/√(1−ζ²)) × 100: con ζ = 0.5, √(1−0.25) = √0.75 ≈ 0.866, entonces Mp = e^(−π×0.5/0.866) × 100 = e^(−1.814) × 100 ≈ 16.3%. ζ = 0.5 es subamortiguado, por lo que sí hay sobreimpulso.',
    },
    {
      id: 'q3',
      question: 'Un ingeniero quiere reducir el tiempo de establecimiento de un sistema de segundo orden sin cambiar el sobreimpulso. ¿Qué debe hacer?',
      options: [
        'Aumentar ζ manteniendo ωₙ constante.',
        'Disminuir ζ manteniendo ωₙ constante.',
        'Aumentar ωₙ manteniendo ζ constante.',
        'Disminuir ωₙ manteniendo ζ constante.',
      ],
      correctIndex: 2,
      explanation:
        'tₛ ≈ 4/(ζωₙ). Si el sobreimpulso depende solo de ζ, para no cambiar Mp debemos mantener ζ fijo. Para reducir tₛ necesitamos aumentar ζωₙ, lo que se logra aumentando ωₙ con ζ constante. Esto aleja los polos del origen, haciendo el sistema más rápido.',
    },
    {
      id: 'q4',
      question: '¿Cuál de los siguientes sistemas tiene la respuesta al escalón más lenta partiendo del mismo ωₙ = 2 rad/s?',
      options: [
        'ζ = 0.3 (subamortiguado)',
        'ζ = 0.7 (subamortiguado)',
        'ζ = 1.0 (críticamente amortiguado)',
        'ζ = 2.0 (sobreamortiguado)',
      ],
      correctIndex: 3,
      explanation:
        'Con ζ > 1 el sistema es sobreamortiguado: los dos polos reales son negativos pero cercanos al origen cuando ζ es grande. tₛ ≈ 4/(ζωₙ) aplica estrictamente solo al subamortiguado, pero para ζ = 2, el polo más lento está en s = −ωₙ(ζ − √(ζ²−1)) ≈ −0.27, lo que da un establecimiento muy lento. El críticamente amortiguado (ζ = 1) es el más rápido sin oscilar.',
    },
    {
      id: 'q5',
      question: 'Un sistema de tipo 0 con G(s) = 5/(s+5) en lazo cerrado con realimentación unitaria recibe una entrada escalón unitario. ¿Cuál es el error en estado estacionario?',
      options: [
        'ess = 0% (el lazo cerrado elimina el error)',
        'ess = 50%',
        'ess ≈ 16.7%',
        'ess = 100% (el sistema no sigue la referencia)',
      ],
      correctIndex: 1,
      explanation:
        'Para un sistema tipo 0, ess = 1/(1+Kp) donde Kp = G(0) = 5/5 = 1. Entonces ess = 1/(1+1) = 0.5, es decir 50%. Verificación: la FT en lazo cerrado es G/(1+G) = 5/(s+10), con ganancia DC = 5/10 = 0.5. La salida final es 0.5 ante escalón unitario, por lo que ess = 1 − 0.5 = 0.5 = 50%. Esto ilustra por qué se necesita acción integral (Ki > 0) para eliminar completamente el error en estado estacionario.',
    },
    {
      id: 'q6',
      question: 'Los polos de un sistema de segundo orden son s₁,₂ = −2 ± 3j. ¿Cuál es la frecuencia amortiguada ωd y el coeficiente de amortiguamiento ζ?',
      options: [
        'ωd = 3 rad/s, ζ = 2/√13 ≈ 0.55',
        'ωd = 2 rad/s, ζ = 3/√13 ≈ 0.83',
        'ωd = √13 rad/s, ζ = 0.5',
        'ωd = 3 rad/s, ζ = 1 (críticamente amortiguado)',
      ],
      correctIndex: 0,
      explanation:
        'De s = −σ ± jωd leemos directamente: σ = 2, ωd = 3. La frecuencia natural es ωₙ = √(σ² + ωd²) = √(4+9) = √13 ≈ 3.61 rad/s. El amortiguamiento es ζ = σ/ωₙ = 2/√13 ≈ 0.55. Recordar: la parte imaginaria es ωd (frecuencia de oscilación), no ωₙ.',
    },
    {
      id: 'q7',
      question: '¿Por qué un sistema de tipo 1 (con un integrador) elimina el error en estado estacionario ante una entrada escalón?',
      options: [
        'Porque el integrador aumenta la ganancia del sistema a alta frecuencia.',
        'Porque en DC (s→0) el integrador tiene ganancia infinita, forzando al error a ser cero.',
        'Porque el integrador hace que los polos del sistema se muevan al semiplano derecho.',
        'Porque el integrador convierte la entrada escalón en una entrada rampa.',
      ],
      correctIndex: 1,
      explanation:
        'Un integrador 1/s tiene ganancia → ∞ cuando s → 0 (frecuencia cero). En el lazo de control, esto significa que cualquier error constante distinto de cero produciría una señal de control que crece indefinidamente hasta que el error se anule. El sistema "no puede descansar" con error, por lo que lo fuerza a cero. Esta es la esencia del teorema del valor final para sistemas tipo 1.',
    },
  ],
}
