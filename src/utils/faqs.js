/**
 * Central dictionary of Frequently Asked Questions (FAQs) for calculators.
 * Used for dynamic structured SEO metadata (FAQPage JSON-LD).
 */
export const calculatorFaqs = {
  es: {
    'tna-to-tea': [
      {
        q: "¿Cuál es la diferencia entre TNA y TEA?",
        a: "La Tasa Nominal Anual (TNA) es la tasa de referencia que no tiene en cuenta la capitalización o reinversión del interés. La Tasa Efectiva Anual (TEA), en cambio, refleja el rendimiento neto real al cabo de un año asumiendo que los intereses cobrados se vuelven a reinventir bajo las mismas condiciones (interés compuesto)."
      },
      {
        q: "¿Qué es la TEM y para qué se usa?",
        a: "La Tasa Efectiva Mensual (TEM) representa la tasa real a la que rinde o se financia tu dinero cada 30 días. Es fundamental para comparar el rendimiento de billeteras virtuales (cuentas remuneradas) o para conocer el interés real de las cuotas de tus tarjetas."
      },
      {
        q: "¿Cómo influye la frecuencia de capitalización?",
        a: "A mayor frecuencia de capitalización (ej. diaria en lugar de mensual), los intereses se liquidan y reinvierten más rápido. Esto incrementa exponencialmente la TEA resultante, incluso si la TNA base es la misma. Por ejemplo, una TNA de 40% capitalizando diariamente rinde más que capitalizando mensualmente."
      },
      {
        q: "¿Qué es la tasa real (Rendimiento Real)?",
        a: "Es el rendimiento neto de la inversión una vez descontado el efecto erosivo de la inflación del período (Efecto Fisher). Si tu TEA es del 45% y la inflación anual es del 40%, tu rendimiento real es positivo (+3.57%). Si la inflación supera a la TEA, tu rendimiento real es negativo (pérdida de poder de compra)."
      }
    ],
    'savings-comparison': [
      {
        q: "¿Qué es el Plazo Fijo UVA y cuál es su encaje mínimo?",
        a: "El Plazo Fijo UVA (Unidad de Valor Adquisitivo) es un instrumento de ahorro que ajusta el capital por inflación (índice CER del Banco Central) más una tasa de interés nominal anual mínima (generalmente 1.0%). Por normativa del BCRA, el plazo mínimo de colocación de este instrumento es de 180 días (6 meses) obligatorios."
      },
      {
        q: "¿Cómo funciona una Caución Financiera?",
        a: "Las cauciones bursátiles son préstamos garantizados por el Mercado de Valores. Son un instrumento de renta fija extremadamente líquido e ideal para plazos muy cortos (desde 1 día a 30 días). En esta calculadora simulamos una reinversión semanal compuesta continua a 7 días, lo que optimiza el rendimiento efectivo del dinero."
      },
      {
        q: "¿Cuándo conviene hacer un Plazo Fijo UVA en lugar de uno Tradicional?",
        a: "El Plazo Fijo UVA conviene en escenarios de inflación mensual alta o acelerada que superen la tasa de interés mensual de las opciones nominales. En cambio, si la inflación del período desciende velozmente por debajo de la tasa efectiva del Plazo Fijo Tradicional, este último resulta ganador."
      },
      {
        q: "¿Qué es el Relevamiento de Expectativas de Mercado (REM)?",
        a: "Es una encuesta mensual elaborada por el Banco Central de la República Argentina (BCRA) a las principales consultoras y analistas locales para proyectar variables macroeconómicas clave, como la inflación. Inicializamos nuestros valores sugeridos basados en esta expectativa oficial."
      }
    ],
    'hipotecario-uva': [
      {
        q: "¿Qué es el coeficiente UVA y cómo se ajusta?",
        a: "La Unidad de Valor Adquisitivo (UVA) es una unidad de medida que se ajusta diariamente mediante el Coeficiente de Estabilización de Referencia (CER), el cual sigue directamente la variación mensual del Índice de Precios al Consumidor (IPC) del INDEC. Esto significa que la deuda de capital y el valor de la cuota aumentan al mismo ritmo que la inflación."
      },
      {
        q: "¿Qué diferencias hay entre el sistema de amortización Francés y el Alemán?",
        a: "En el Sistema Francés, la cuota mensual en UVAs es constante (al principio pagás más intereses y amortizás menos capital). En el Sistema Alemán, la amortización de capital en UVAs es constante en cada mes (hace que las primeras cuotas en UVAs sean las más caras pero decrezcan con el tiempo, pagando menos intereses totales al final del crédito)."
      },
      {
        q: "¿Qué es la cláusula de tope de cuota por CVS (Coeficiente de Variación Salarial)?",
        a: "Algunos bancos ofrecen una opción de tope en la cuota mediante el pago de una prima de seguro. Si la cuota mensual calculada en base a la inflación supera la cuota ajustada por el Coeficiente de Variación Salarial por más de un 10%, el usuario puede pedir la extensión del plazo de pago para mantener la cuota dentro del límite del presupuesto de ingresos familiar."
      },
      {
        q: "¿Cuando conviene optar por un crédito UVA frente a uno de tasa fija?",
        a: "El crédito UVA suele tener tasas de interés iniciales muy bajas (típicamente entre 3.5% y 6.5% + UVA), lo que permite calificar con ingresos menores y acceder a montos más altos de préstamo. Sin embargo, traslada todo el riesgo inflacionario al deudor. Un crédito de tasa fija ofrece certeza absoluta de cuota en pesos, pero sus tasas iniciales son altísimas y los montos otorgados suelen ser muy bajos."
      }
    ],
    'ipc-actualizer': [
      {
        q: "¿De dónde provienen las tasas de inflación?",
        a: "Toda la serie mensual histórica de inflación proviene de las publicaciones oficiales del Índice de Precios al Consumidor (IPC) nacional de cobertura nacional elaborado por el INDEC de la República Argentina."
      },
      {
        q: "¿Cómo se calcula el ajuste monetario por IPC?",
        a: "Para actualizar un monto de un mes 'A' a un mes 'B', se divide el valor del índice de precios del mes 'B' por el valor del índice del mes 'A'. Luego, se multiplica el monto original por ese factor resultante."
      },
      {
        q: "¿Cómo se calcula la pérdida del poder adquisitivo?",
        a: "La pérdida de poder adquisitivo refleja cuánto menos compra el mismo billete nominal al cabo de un período. Se calcula como `1 - (1 / Factor de Inflación)`. Por ejemplo, si hay una inflación acumulada del 100% (factor = 2.0), el poder adquisitivo se reduce un 50%: ahora podés comprar exactamente la mitad de los bienes que antes."
      },
      {
        q: "¿Sirve este índice para contratos de alquiler (ICL / Casa Propia)?",
        a: "Esta calculadora utiliza la variación directa del IPC del INDEC, que es el índice de inflación general. Para contratos comerciales o de servicios profesionales, es la métrica de actualización estándar. Para contratos residenciales que requieran índices regulados como el ICL (Índice de Contratos de Locación), el cálculo combina inflación y salarios promedio (RIPTE)."
      }
    ],
    'compound-interest': [
      {
        q: "¿Qué es el interés compuesto y cómo funciona?",
        a: "El interés compuesto es la acumulación de intereses sobre el capital inicial y sobre los intereses previamente generados período a período. De esta forma, el dinero crece de manera exponencial a lo largo del tiempo, ya que los rendimientos se reinvierten continuamente para generar nuevos rendimientos."
      },
      {
        q: "¿Cómo influye la frecuencia de capitalización en el saldo final?",
        a: "La frecuencia de capitalización es la cantidad de veces que se liquidan y reinvierten los intereses en un año (ej. mensual, trimestral, anual). A mayor frecuencia de capitalización, mayor es el crecimiento del saldo final, ya que los intereses acumulados comienzan a generar rendimientos mucho antes."
      },
      {
        q: "¿Qué diferencia hay entre la Tasa Nominal Anual (TNA) y la Tasa Efectiva Anual (TEA)?",
        a: "La TNA es la tasa de referencia anual que no contempla la reinversión de los intereses dentro del año. La TEA es la tasa de rendimiento real obtenida al final del año si se reinvierten todos los intereses con la frecuencia de capitalización correspondiente (la TEA siempre es mayor que la TNA si la capitalización es sub-anual)."
      },
      {
        q: "¿Por qué es fundamental la constancia y el factor tiempo en la inversión?",
        a: "Debido a la naturaleza exponencial del interés compuesto, la variable más poderosa es el tiempo. Empezar a ahorrar e invertir unos años antes o mantener aportes constantes (por pequeños que sean) genera un saldo final acumulado drásticamente mayor en el largo plazo que intentar ingresar una suma grande de dinero de golpe al final."
      }
    ],
    'ganancias': [
      {
        q: "¿Qué ingresos están alcanzados por el Impuesto a las Ganancias en 2026?",
        a: "Están alcanzados los ingresos del trabajo personal en relación de dependencia (4° categoría), jubilaciones, pensiones y cargos públicos. El cálculo se realiza sobre la ganancia neta imponible acumulada mes a mes, restando los aportes de jubilación y obra social, y las deducciones permitidas."
      },
      {
        q: "¿Cuáles son las deducciones personales y permitidas para el período 2026?",
        a: "Se pueden deducir cargas de familia (cónyuge, hijos menores de 18 años o con discapacidad), el alquiler de vivienda permanente, medicina prepaga, personal de casas particulares (empleadas domésticas), gastos de educación en colegios privados, e intereses de créditos hipotecarios, entre otros, respetando los topes oficiales anuales."
      },
      {
        q: "¿Cómo se realiza el ajuste por inflación de los mínimos y escalas de Ganancias?",
        a: "Por ley, el Mínimo No Imponible (MNI), la Deducción Especial y los tramos de la escala progresiva se actualizan semestralmente (en enero y julio) en base a la variación acumulada del Índice de Precios al Consumidor (IPC) informado por el INDEC."
      },
      {
        q: "¿Cuál es la fecha límite para cargar las deducciones en el SIRADIG?",
        a: "El formulario 572 (SIRADIG) para el período fiscal del año anterior puede presentarse y modificarse hasta el 31 de marzo de cada año. Se aconseja realizar la carga de forma mensual o durante febrero para dar tiempo al empleador a procesar los ajustes correspondientes en la liquidación anual."
      }
    ],
    'sueldo-neto': [
      {
        q: "¿Cómo se calculan las categorías y topes de facturación del Monotributo en 2026?",
        a: "Las escalas de facturación máxima anual y las cuotas mensuales del Monotributo se actualizan semestralmente según el IPC. El cálculo de tu categoría debe basarse en la facturación bruta devengada (emitida) de los últimos 12 meses, independientemente de cuándo se haya cobrado efectivamente."
      },
      {
        q: "¿Qué deducciones y gastos debo considerar para saber mi sueldo neto real?",
        a: "Para conocer tus ingresos limpios en mano debes restar de tu facturación bruta: (1) la cuota mensual unificada del Monotributo, (2) la alícuota de Ingresos Brutos (que suele rondar entre el 1.5% y 4% según la jurisdicción, salvo que apliques al Monotributo Unificado exento), y (3) los costos de las plataformas de cobro internacionales o locales."
      },
      {
        q: "¿Qué es la exportación de servicios y el cupo de USD 24.000 anuales?",
        a: "Los freelancers argentinos que exporten servicios pueden ingresar hasta USD 24.000 anuales a su cuenta bancaria local en dólares sin la obligación de pesificarlos al tipo de cambio oficial del BCRA, siempre que emitan factura 'E' y liquiden la orden dentro de los 5 días hábiles del cobro."
      },
      {
        q: "¿Cómo impactan las comisiones de retiro en el sueldo neto?",
        a: "Si cobras a través de plataformas del exterior (como Wise, Payoneer o Deel), cada paso de intermediación de fondos suele cobrar comisiones de retiro (entre el 1% y 3%) o costos fijos de transferencia ACH/Wire. Modelar correctamente estas pérdidas es vital antes de calcular tus honorarios por hora."
      }
    ],
    'broker-comparator': [
      {
        q: "¿Por qué las comisiones de Balanz a través de Valia son preferenciales?",
        a: "Al registrarte a través de nuestro canal de recomendación directa de Valia, accedés a la estructura de comisiones preferenciales y la bonificación absoluta en la asignación de un asesor idóneo matriculado en CNV, sin costo fijo ni comisiones adicionales."
      },
      {
        q: "¿Qué es la cuenta remunerada o FCI Money Market?",
        a: "Es la tasa anual (TNA) que rinde el saldo líquido que tenés en cuenta sin invertir. En las billeteras virtuales ocurre de forma automática, mientras que en brokers tradicionales como Balanz, PPI o IOL se realiza suscribiendo al Fondo Común de Inversión (FCI) de liquidez inmediata (Money Market) con rescate en el acto de 9:00 a 16:00 hs."
      },
      {
        q: "¿Qué son los derechos de mercado y el IVA?",
        a: "Algunos brokers anuncian comisiones nominales bajas pero no incluyen los derechos cobrados por Bolsas y Mercados Argentinos (BYMA) ni el 21% de IVA sobre la comisión. En Balanz, la tasa del 0.5% ya es preferencial e incluye la gestión personalizada de tu cartera de inversiones."
      },
      {
        q: "¿Es seguro operar mis ahorros en un broker en lugar de un banco?",
        a: "Sí. Todos los brokers (ALyCs) incluidos en esta tabla están regulados y supervisados por la Comisión Nacional de Valores (CNV). Los fondos y títulos (Acciones, CEDEARs, Bonos) están registrados a tu nombre en Caja de Valores, por lo que el patrimonio está resguardado independientemente del broker."
      }
    ]
  },
  en: {
    'tna-to-tea': [
      {
        q: "What is the difference between APR and APY?",
        a: "The Annual Percentage Rate (APR) is the simple annual rate that does not account for the compounding or reinvestment of interest. The Annual Percentage Yield (APY), on the other hand, reflects the actual net yield after one year assuming that the interest earned is reinvested under the same conditions (compound interest)."
      },
      {
        q: "What is EMR and what is it used for?",
        a: "The Effective Monthly Rate (EMR) represents the real rate at which your money grows or is financed every 30 days. It is essential for comparing digital wallets yields or finding the real interest rate on credit card installments."
      },
      {
        q: "How does compounding frequency affect the yield?",
        a: "A higher compounding frequency (e.g., daily instead of monthly) means interest is settled and reinvested faster. This exponentially increases the resulting APY, even if the base APR remains the same. For example, a 40% APR compounded daily yields more than the same APR compounded monthly."
      },
      {
        q: "What is the real rate (Real Return)?",
        a: "It is the net return on the investment after subtracting the eroding effect of inflation (Fisher equation). If your APY is 45% and annual inflation is 40%, your real return is positive (+3.57%). If inflation exceeds the APY, your real return is negative (loss of purchasing power)."
      }
    ]
  }
};
