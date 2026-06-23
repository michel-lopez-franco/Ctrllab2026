export const moduleContent = {
  id: 'estabilidad',
  title: 'Estabilidad de Sistemas',
  estimatedTime: 60,
  xpReward: 150,
  objectives: [
    'Definir estabilidad BIBO y estabilidad asintótica en términos de la ubicación de los polos.',
    'Construir la tabla de Routh-Hurwitz y determinar la estabilidad de un sistema sin calcular raíces.',
    'Identificar cuántas raíces tiene un polinomio en el semiplano derecho a partir de los cambios de signo en la primera columna.',
    'Relacionar la posición de los polos en el plano complejo con el comportamiento transitorio del sistema.',
  ],
  sections: [
    {
      id: 'concepto',
      title: '¿Qué significa que un sistema sea estable?',
      content: `Un sistema de control solo es útil si es **estable**: una perturbación acotada no debe causar una respuesta que crezca sin límite.

**Estabilidad BIBO** (Bounded-Input Bounded-Output): un sistema es BIBO estable si ante cualquier entrada acotada, la salida también es acotada.

**Estabilidad asintótica**: el sistema retorna al equilibrio por sí solo cuando se elimina la perturbación. Es una condición más fuerte que BIBO.

Para sistemas LTI (lineales e invariantes en el tiempo), ambas definiciones coinciden y tienen una respuesta sencilla:

> Un sistema LTI es estable si y solo si **todos sus polos tienen parte real negativa** (semiplano izquierdo del plano complejo).

**¿Por qué?** Cada polo $s = \sigma \pm j\omega_d$ contribuye al transitorio con un término $e^{\sigma t} \cos(\omega_d t)$. Si $\sigma < 0$, ese término decae a cero. Si $\sigma > 0$, crece exponencialmente.

**Casos de estabilidad:**

| Posición de los polos | Comportamiento | Clasificación |
|---|---|---|
| Todos con $\text{Re}(s) < 0$ | Transitorio decae $\to 0$ | Estable |
| Al menos uno con $\text{Re}(s) > 0$ | Respuesta crece $\to \infty$ | Inestable |
| Polos simples en $\text{Re}(s) = 0$ | Oscilación sostenida | Marginalmente estable |
| Polos repetidos en $\text{Re}(s) = 0$ | Crece como $t \cdot e^0 = t$ | Inestable |`,
    },
    {
      id: 'routh',
      title: 'Criterio de Routh-Hurwitz',
      content: `Calcular los polos exactos de un polinomio de grado alto es difícil. El criterio de **Routh-Hurwitz** permite determinar la estabilidad sin calcular raíces.

**Procedimiento:**

Dado el polinomio característico: $$ a_n s^n + a_{n-1} s^{n-1} + \dots + a_1 s + a_0 = 0 $$

**1. Condición necesaria:** Si algún coeficiente es negativo o cero (y el grado es $\ge 2$), el sistema es inestable. ¡Para ahí!

**2. Construir la tabla de Routh:**

Fila 1: $a_n, \quad a_{n-2}, \quad a_{n-4}, \quad \dots$
Fila 2: $a_{n-1}, \quad a_{n-3}, \quad a_{n-5}, \quad \dots$
Fila 3: $b_1 = \frac{a_{n-1} a_{n-2} - a_n a_{n-3}}{a_{n-1}}, \quad b_2 = \frac{a_{n-1} a_{n-4} - a_n a_{n-5}}{a_{n-1}}, \quad \dots$
Fila 4: $c_1 = \frac{b_1 a_{n-3} - a_{n-1} b_2}{b_1}, \quad \dots$
…y así hasta completar $n+1$ filas.

**3. Contar cambios de signo** en la primera columna.

> Número de raíces en el semiplano derecho = número de cambios de signo en la $1^{\text{a}}$ columna

**Ejemplo:** $$ s^3 + 2s^2 + 3s + 4 = 0 $$

Tabla:
\`\`\`
s³ │  1    3
s² │  2    4
s¹ │ (2·3 − 1·4)/2 = 1    0
s⁰ │  4
\`\`\`
Primera columna: $[1, 2, 1, 4]$ — sin cambios de signo $\to$ sistema **estable**.`,
    },
    {
      id: 'casos-especiales',
      title: 'Casos especiales en la tabla',
      content: `Durante la construcción de la tabla pueden aparecer dos situaciones especiales.

**Caso 1: Primer elemento de una fila es cero (fila no nula)**

Reemplazar el cero por $\epsilon \to 0^+$ y continuar. El número de cambios de signo en la primera columna al evaluar $\epsilon \to 0$ indica el número de raíces en el semiplano derecho.

Ejemplo: $$ s^3 + s + 2 = 0 $$
\`\`\`
s³ │  1    1
s² │  0→ε  2
s¹ │ (ε − 2)/ε → −2/ε < 0    0
s⁰ │  2
\`\`\`
Columna: $[1, \epsilon > 0, -2/\epsilon < 0, 2]$ $\to$ 2 cambios de signo $\to$ 2 raíces en RHP $\to$ **inestable**.

**Caso 2: Fila de ceros**

Ocurre cuando el polinomio tiene raíces simétricas respecto al origen (polos en el eje $j\omega$ o pares reales $\pm\sigma$). Se usa el **polinomio auxiliar** formado con la fila anterior.

1. Derivar el polinomio auxiliar respecto a $s$
2. Usar los coeficientes de esa derivada como la fila de ceros
3. Continuar la tabla normalmente

Las raíces del polinomio auxiliar son siempre raíces del sistema original (polos en el eje imaginario o pares simétricos).`,
    },
    {
      id: 'plano-complejo',
      title: 'El plano complejo y los polos',
      content: `La ubicación de los polos en el plano $s = \sigma + j\omega$ determina todo el comportamiento transitorio.

**Interpretación geométrica:**

- **Eje $\sigma$ (real):** determina la velocidad de decaimiento. Más negativo $\to$ decae más rápido.
- **Eje $j\omega$ (imaginario):** determina la frecuencia de oscilación. $|\omega|$ más grande $\to$ oscila más rápido.
- **Distancia al origen ($|s|$):** relacionada con $\omega_n = \sqrt{\sigma^2 + \omega^2}$
- **Ángulo con el eje negativo real:** $\theta = \arccos(\zeta)$, donde $\zeta = \sigma/\omega_n$

**Regiones del plano complejo:**

| Región | Tipo de polo | Comportamiento |
|---|---|---|
| Semiplano izquierdo ($\sigma < 0$) | Estable | Transitorio decae |
| Eje imaginario ($\sigma = 0$) | Marginal | Oscilación sostenida |
| Semiplano derecho ($\sigma > 0$) | Inestable | Crecimiento exponencial |
| Eje real negativo | Real negativo | Exponencial pura, sin oscilación |
| Cuadrantes II y III | Complejo conjugado | Oscilación amortiguada |

**Líneas de especificación:**

En diseño de control, se definen regiones en el plano complejo donde deben estar los polos de lazo cerrado:
- $\sigma < -\alpha$: $t_s < 4/\alpha$ (establecimiento rápido)
- Ángulo $> \arccos(\zeta_{min})$: sobreimpulso máximo permitido
- $|s| > \omega_{n,min}$: velocidad de respuesta mínima`,
    },
    {
      id: 'margen-ganancia',
      title: 'Estabilidad condicional y margen de ganancia',
      content: `En lazo cerrado, la estabilidad puede depender del valor de la ganancia $K$. El criterio de Routh permite encontrar el **valor crítico de $K$** que lleva el sistema al límite de la estabilidad.

**Procedimiento:**

1. Escribir el polinomio característico en lazo cerrado en función de $K$
2. Construir la tabla de Routh con $K$ como parámetro
3. Imponer que el primer elemento de alguna fila sea cero
4. Despejar $K_{crítico}$

**Ejemplo:** $$ G(s) = \frac{K}{s(s+2)(s+4)} $$

Polinomio característico (lazo cerrado): $$ s^3 + 6s^2 + 8s + K = 0 $$

Tabla de Routh:
\`\`\`
s³ │  1      8
s² │  6      K
s¹ │ (48−K)/6    0
s⁰ │  K
\`\`\`
Condiciones para estabilidad:
- $(48 - K)/6 > 0 \to K < 48$
- $K > 0$

**Rango de estabilidad: $0 < K < 48$**

Con $K = 48$ el sistema es marginalmente estable (oscilación sostenida). Con $K > 48$, inestable. Esto es el **margen de ganancia** en el dominio temporal.`,
    },
  ],

  quiz: [
    {
      id: 'q1',
      question: 'Un sistema LTI tiene polos en s = −1, s = −2 + 3j, s = −2 − 3j. ¿Es el sistema estable?',
      options: [
        'No, porque tiene polos complejos (con parte imaginaria).',
        'Sí, porque todos los polos tienen parte real negativa.',
        'Solo marginalmente estable, porque los polos complejos están en el eje imaginario.',
        'No se puede determinar sin conocer los ceros del sistema.',
      ],
      correctIndex: 1,
      explanation:
        'La estabilidad de un sistema LTI depende exclusivamente de la parte real de los polos. Los polos s = −2 ± 3j tienen parte real −2 < 0, y s = −1 también tiene parte real negativa. Por lo tanto el sistema es estable. Los polos complejos solo añaden oscilación amortiguada a la respuesta transitoria, no inestabilidad.',
    },
    {
      id: 'q2',
      question: 'Para el polinomio s⁴ + 2s³ + 3s² + 4s + 5 = 0, la condición necesaria de Routh-Hurwitz (todos los coeficientes positivos):',
      options: [
        'Se cumple: todos los coeficientes son positivos. El sistema podría ser estable.',
        'No se cumple: hay un coeficiente negativo. El sistema es inestable.',
        'Se cumple, y es suficiente para garantizar la estabilidad.',
        'No aplica para polinomios de grado mayor a 3.',
      ],
      correctIndex: 0,
      explanation:
        'Todos los coeficientes [1, 2, 3, 4, 5] son positivos, así que la condición necesaria se cumple. Sin embargo, esto NO garantiza estabilidad — es solo una condición necesaria. Para un polinomio de grado ≥ 3, hay que completar la tabla de Routh completa. De hecho, este polinomio es inestable a pesar de tener todos los coeficientes positivos.',
    },
    {
      id: 'q3',
      question: 'La primera columna de la tabla de Routh de un polinomio de grado 4 es: [2, 3, −1, 4, 5]. ¿Cuántas raíces tiene el polinomio en el semiplano derecho?',
      options: [
        '0 raíces — el sistema es estable.',
        '1 raíz en el semiplano derecho.',
        '2 raíces en el semiplano derecho.',
        '4 raíces — todas están en el semiplano derecho.',
      ],
      correctIndex: 2,
      explanation:
        'El número de raíces en el semiplano derecho (RHP) es igual al número de cambios de signo en la primera columna. Secuencia: [2(+), 3(+), −1(−), 4(+), 5(+)]. Cambios: 3→−1 (positivo a negativo) y −1→4 (negativo a positivo). Total: 2 cambios de signo → 2 raíces en el RHP → sistema inestable.',
    },
    {
      id: 'q4',
      question: 'Al construir la tabla de Routh del polinomio s³ + 2s² + s + 2, el primer elemento de la fila s¹ resulta ser cero. ¿Qué indica esto?',
      options: [
        'Que el polinomio tiene raíces exactamente en el eje imaginario (marginalmente estable).',
        'Que se cometió un error de cálculo y hay que rehacer la tabla.',
        'Que el sistema es definitivamente inestable con raíces en el RHP.',
        'Que el sistema es estable, ya que el cero indica cancelación de modos.',
      ],
      correctIndex: 0,
      explanation:
        'Una fila de ceros (o primer elemento cero con fila no nula) en la tabla de Routh indica que el polinomio tiene raíces simétricas respecto al origen. En este caso, s³ + 2s² + s + 2 = (s²+1)(s+2), con raíces s = ±j y s = −2. Los polos ±j están sobre el eje imaginario: el sistema es marginalmente estable (oscilación sostenida, no amortiguada).',
    },
    {
      id: 'q5',
      question: 'Para el sistema en lazo cerrado con G(s) = K/(s(s+1)(s+3)), el polinomio característico es s³ + 4s² + 3s + K. ¿Para qué rango de K el sistema es estable?',
      options: [
        '0 < K < 12',
        'K > 0 (cualquier ganancia positiva estabiliza el sistema)',
        '0 < K < 4',
        'K < 12 (sin límite inferior)',
      ],
      correctIndex: 0,
      explanation:
        'Tabla de Routh: fila s³: [1, 3]; fila s²: [4, K]; fila s¹: [(4·3 − 1·K)/4 = (12−K)/4, 0]; fila s⁰: [K]. Para estabilidad: K > 0 y (12−K)/4 > 0 → K < 12. El rango de estabilidad es 0 < K < 12. Con K = 12 el sistema es marginalmente estable (oscilación sostenida en ω = √3 rad/s).',
    },
    {
      id: 'q6',
      question: 'Un polo en s = −0.01 + 5j indica que el sistema:',
      options: [
        'Es inestable, porque tiene parte imaginaria grande.',
        'Es estable pero con una oscilación de alta frecuencia que decae muy lentamente.',
        'Es marginalmente estable, porque la parte real es casi cero.',
        'Tiene un tiempo de establecimiento de aproximadamente 0.8 s.',
      ],
      correctIndex: 1,
      explanation:
        'El polo s = −0.01 + 5j tiene parte real negativa (−0.01), así que el sistema es estable. La parte imaginaria 5 rad/s indica oscilación a esa frecuencia. El tiempo de establecimiento es tₛ ≈ 4/|σ| = 4/0.01 = 400 s — la oscilación decae muy lentamente. En la práctica, este polo "casi marginal" puede ser problemático para control. La parte imaginaria grande solo indica oscilación rápida, no inestabilidad.',
    },
    {
      id: 'q7',
      question: '¿Cuál es la diferencia entre un sistema marginalmente estable y uno asintóticamente estable?',
      options: [
        'En un sistema marginalmente estable la salida oscila sin crecer ni decaer; en uno asintóticamente estable el transitorio decae a cero.',
        'El sistema marginalmente estable es más rápido que el asintóticamente estable.',
        'La diferencia es solo en el sobreimpulso: el marginalmente estable tiene Mp = 0%.',
        'No hay diferencia práctica: ambos son utilizables en aplicaciones de control.',
      ],
      correctIndex: 0,
      explanation:
        'Un sistema asintóticamente estable tiene todos los polos en el semiplano izquierdo estricto (σ < 0): ante cualquier perturbación, la respuesta decae exponencialmente a cero. Un sistema marginalmente estable tiene polos sobre el eje imaginario (σ = 0): la respuesta ante una perturbación no crece, pero tampoco decae — oscila indefinidamente. En control realimentado, la estabilidad marginal es inaceptable en la mayoría de aplicaciones.',
    },
  ],
}
