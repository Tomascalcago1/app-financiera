import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  ArrowLeft, 
  Search, 
  ChevronRight, 
  Flame, 
  TrendingUp, 
  Home,
  MessageSquare,
  Scale,
  Percent,
  Share2
} from 'lucide-react';

const Blog = () => {
  const [selectedArticleId, setSelectedArticleId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('articulo') || null;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [copiedArticle, setCopiedArticle] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    const currentArt = url.searchParams.get('articulo');
    if (selectedArticleId !== currentArt) {
      if (selectedArticleId) {
        url.searchParams.set('articulo', selectedArticleId);
      } else {
        url.searchParams.delete('articulo');
      }
      window.history.pushState({}, '', url.toString());
    }
  }, [selectedArticleId]);

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setSelectedArticleId(params.get('articulo') || null);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const articles = [
    {
      id: 'regla-4-por-ciento-retiro',
      title: 'La Regla del 4% en Argentina: ¿Cómo calcular tu retiro temprano?',
      summary: 'Descubrí los fundamentos de la simulación de retiro temprano (independencia financiera) y cómo adaptar la regla matemática del retiro seguro al contexto de inflación y devaluación local.',
      date: '07 de Junio, 2026',
      readTime: '6 min de lectura',
      category: 'inversiones',
      icon: <Flame size={20} className="text-accent-warning" />,
      content: (
        <div>
          <p>La **Regla del 4%** es el cimiento matemático de la planificación del **Retiro Temprano** (Independencia Financiera). Originada en el famoso <em>Estudio Trinity</em> de 1998 en Estados Unidos, esta regla establece que un inversor puede retirar el 4% de su portafolio acumulado durante el primer año de retiro, ajustar esa cantidad por inflación en los años siguientes, y tener una probabilidad cercana al 95% de que sus fondos duren al menos 30 años sin agotarse.</p>
          
          <h3>¿Cómo se calcula en la práctica?</h3>
          <p>Si tus gastos anuales proyectados para vivir de rentas son de <strong>u$s 12.000</strong> (unos u$s 1.000 por mes), para calcular el tamaño de tu portafolio necesario debés multiplicar tu gasto anual por 25 (el inverso de 4%):</p>
          <blockquote style={{ 
            borderLeft: '4px solid var(--accent-primary)', 
            padding: '0.75rem 1rem', 
            margin: '1.5rem 0',
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: '0 var(--border-radius-sm) var(--border-radius-sm) 0'
          }}>
            <strong>Portafolio Necesario = Gastos Anuales × 25</strong><br />
            u$s 12.000 × 25 = u$s 300.000.
          </blockquote>
          
          <h3>El Desafío de Aplicarla en Argentina</h3>
          <p>Tener un portafolio invertido puramente en pesos argentinos para retirar un 4% anual es extremadamente riesgoso debido a la devaluación sistémica y la volatilidad inflacionaria. Para aplicar esta regla con éxito desde nuestro país, se deben considerar los siguientes factores:</p>
          <ul>
            <li><strong>Portafolio dolarizado:</strong> El capital debe estar invertido en activos globales de renta variable (como ETFs del S&P 500 o Nasdaq a través de CEDEARs) y renta fija de alta calidad (como Obligaciones Negociables de empresas sólidas o bonos del tesoro de EE.UU.).</li>
            <li><strong>Tasa de retiro conservadora:</strong> Dado que el costo de vida en dólares en Argentina fluctúa sustancialmente y que los períodos de retiro temprano duran más de 30 años, muchos analistas sugieren una tasa de retiro más prudente, en torno al <strong>3% o 3,5%</strong>.</li>
            <li><strong>Fondos de Emergencia y Liquidez:</strong> Contar con un colchón de 1 a 2 años de gastos líquidos en cuentas remuneradas o Fondos Comunes de Inversión (FCI) Money Market evita tener que liquidar acciones en momentos de mercado bajista (el llamado "riesgo de secuencia de retornos").</li>
          </ul>

          <p>Hacer un <em>backtesting</em> o simulación histórica (como la que ofrece nuestro <strong>Simulador de Retiro</strong> en la pestaña Herramientas) te permite analizar cómo le hubiera ido a tu dinero atravesando crisis reales como la burbuja de las puntocom (2000), la crisis subprime (2008) o la Gran Depresión de 1929, brindándote tranquilidad científica antes de dar el gran paso.</p>
        </div>
      )
    },
    {
      id: 'interes-compuesto-secreto-ahorro',
      title: 'Interés Compuesto: El motor silencioso para multiplicar tu capital',
      summary: 'Albert Einstein lo llamó la octava maravilla del mundo. Te explicamos cómo funciona el interés compuesto, cómo se diferencia del interés simple y cómo empezar a aprovecharlo con herramientas locales.',
      date: '05 de Junio, 2026',
      readTime: '4 min de lectura',
      category: 'ahorro',
      icon: <TrendingUp size={20} className="text-accent-primary" />,
      content: (
        <div>
          <p>El **interés compuesto** es el proceso por el cual los intereses que genera una inversión se reinvierten en el capital inicial, de modo que en el siguiente período esos intereses acumulados vuelven a generar nuevos intereses. Se produce un efecto de "bola de nieve" que crece de forma exponencial a lo largo del tiempo.</p>

          <h3>Diferencia entre Interés Simple e Interés Compuesto</h3>
          <p>Imaginemos que invertís $100.000 a una tasa del 10% anual:</p>
          <ul>
            <li><strong>Con Interés Simple:</strong> Cada año retirás tus ganancias. Por ende, todos los años ganás exactamente $10.000. Al cabo de 10 años, tenés tus $100.000 iniciales más $100.000 de ganancias. Total: $200.000.</li>
            <li><strong>Con Interés Compuesto:</strong> No retirás los intereses, los dejás invertidos. El primer año ganás $10.000 (total $110.000). El segundo año, ganás el 10% de $110.000, es decir $11.000 (total $121.000). El tercer año ganás el 10% de $121.000 ($12.100). Al cabo de 10 años, tu capital inicial se habrá convertido en <strong>$259.374</strong> sin haber agregado un solo peso extra.</li>
          </ul>

          <h3>Los Tres Factores Clave</h3>
          <ol>
            <li><strong>El Tiempo:</strong> El interés compuesto premia a los inversores que empiezan temprano. Cuanto más largo sea el plazo, más empinada se vuelve la curva de crecimiento.</li>
            <li><strong>La Constancia:</strong> Acompañar el capital inicial con pequeños aportes mensuales acelera drásticamente el proceso de acumulación.</li>
            <li><strong>La Tasa de Interés:</strong> Incluso una pequeña variación de 1 o 2 puntos porcentuales en la rentabilidad anual puede significar una diferencia de miles de dólares al cabo de 20 o 30 años.</li>
          </ol>

          <p>En la economía argentina actual, podés empezar a aplicar el interés compuesto utilizando instrumentos sencillos como el Plazo Fijo UVA (reinvirtiendo el capital acumulado al vencimiento), Cauciones bursátiles a 7 días, o Fondos Comunes de Inversión (FCI) con rescate inmediato. Para proyectar tu crecimiento personalizado, te recomendamos utilizar nuestra **Calculadora de Interés Compuesto** en la pestaña de Herramientas.</p>
        </div>
      )
    },
    {
      id: 'credito-uva-vs-tasa-fija',
      title: 'Crédito UVA vs Tasa Fija: ¿Qué conviene para comprar vivienda?',
      summary: 'Analizamos pros y contras de los créditos hipotecarios UVA frente a las alternativas tradicionales en el contexto inflacionario argentino. Claves para evaluar el impacto en tu cuota y salario.',
      date: '02 de Junio, 2026',
      readTime: '5 min de lectura',
      category: 'vivienda',
      icon: <Home size={20} className="text-accent-primary" />,
      content: (
        <div>
          <p>Adquirir una vivienda es la decisión financiera más importante en la vida de una persona. Con el regreso de los créditos hipotecarios en Argentina, la pregunta del millón volvió a surgir: **¿conviene tomar un crédito hipotecario UVA o buscar opciones tradicionales de tasa fija?**</p>

          <h3>¿Qué es el Crédito UVA?</h3>
          <p>El **UVA (Unidad de Valor Adquisitivo)** es una medida indexada diariamente por el Coeficiente de Estabilización de Referencia (CER), el cual sigue de cerca el Índice de Precios al Consumidor (IPC). En un crédito UVA, tu deuda está nominada en UVAs y el banco te cobra un interés fijo por encima de la indexación (por ejemplo, UVA + 5.5%). Esto significa que tu saldo deudor y el monto en pesos de tu cuota subirán exactamente al ritmo de la inflación del país.</p>

          <h3>Comparativa Directa</h3>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '0.5rem' }}>Característica</th>
                <th style={{ padding: '0.5rem' }}>Crédito UVA</th>
                <th style={{ padding: '0.5rem' }}>Tasa Fija Tradicional</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.5rem', fontWeight: 600 }}>Cuota Inicial</td>
                <td style={{ padding: '0.5rem', color: 'var(--accent-success)' }}>Baja (Fácil de calificar)</td>
                <td style={{ padding: '0.5rem', color: 'var(--accent-danger)' }}>Muy alta (Calificación difícil)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.5rem', fontWeight: 600 }}>Riesgo Principal</td>
                <td style={{ padding: '0.5rem' }}>Inflación supera a los salarios</td>
                <td style={{ padding: '0.5rem' }}>Quedar con cuota alta si la inflación baja</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.5rem', fontWeight: 600 }}>Tasa de Interés</td>
                <td style={{ padding: '0.5rem' }}>Baja (ej: 4% a 7% anual)</td>
                <td style={{ padding: '0.5rem' }}>Alta (tasas de doble dígito en pesos)</td>
              </tr>
            </tbody>
          </table>

          <h3>Claves para la Toma de Decisión</h3>
          <ul>
            <li><strong>Relación Cuota-Ingreso:</strong> Por ley, la cuota inicial de un crédito UVA no puede superar el 25% de tus ingresos comprobables. Si los salarios pierden poder adquisitivo contra la inflación durante varios meses seguidos, la cuota representará un porcentaje mayor de tu sueldo.</li>
            <li><strong>Sistema Francés vs Alemán:</strong> El sistema francés mantiene la cuota en UVA constante (ideal para previsibilidad inicial). El sistema alemán amortiza más rápido el capital al principio, lo que hace que la cuota medida en UVA descienda mes a mes (ideal si tenés ahorros extra para las primeras cuotas).</li>
            <li><strong>Estrategia de Mitigación:</strong> Una excelente estrategia para protegerte frente a un crédito UVA es ahorrar un fondo en activos que rindan a la par o por encima de la inflación (como CEDEARs o fondos CER en Balanz) para usar como amortizaciones extraordinarias si la cuota llega a subir de forma incómoda.</li>
          </ul>

          <p>Para proyectar cómo afectaría la inflación real y estimar el valor futuro de las cuotas de tu préstamo según el sistema francés o alemán, podés usar nuestra herramienta **Hipotecario UVA** en la pestaña de Herramientas.</p>
        </div>
      )
    },
    {
      id: 'cuotas-vs-efectivo-inflacion',
      title: '¿Cuotas o Efectivo?: La estrategia para ganarle a la inflación en tus compras',
      summary: 'Analizamos cómo evaluar el Costo Financiero Total (CFT), la inflación y el rendimiento de tus inversiones para decidir racionalmente entre pagar al contado con descuento o financiar en cuotas.',
      date: '08 de Junio, 2026',
      readTime: '5 min de lectura',
      category: 'ahorro',
      icon: <Scale size={20} className="text-accent-primary" />,
      content: (
        <div>
          <p>En contextos inflacionarios como el de Argentina, tomar decisiones de consumo cotidiano o compras importantes de bienes durables (electrodomésticos, tecnología, viajes) puede volverse complejo. La eterna pregunta surge en cada caja: <strong>¿conviene pagar de contado con descuento, o en cuotas fijas?</strong></p>
          
          <h3>La Clave Científica: El Costo Financiero Total (CFT)</h3>
          <p>Mucha gente comete el error de evaluar únicamente la Tasa Nominal Anual (TNA) de interés de las cuotas. Sin embargo, el indicador financiero definitivo que regula el costo de cualquier financiación es el <strong>Costo Financiero Total (CFT)</strong>, el cual incluye no solo los intereses, sino los cargos de seguro de vida, comisiones administrativas, IVA e impuestos bancarios. Si el CFT es inferior a la inflación esperada, financiarse en cuotas representa una ganancia neta.</p>
          
          <h3>El Enfoque del Valor Presente (VP)</h3>
          <p>Para comparar racionalmente las dos opciones, debemos traer el costo futuro de todas las cuotas al valor del dinero de hoy (descontando la inflación mensual estimada):</p>
          <p style={{ fontFamily: 'monospace', background: 'rgba(0,0,0,0.25)', padding: '0.5rem 1rem', borderRadius: '4px', textAlign: 'center' }}>
            Valor Presente total = Suma de [ Cuota_t / (1 + i)^t ]
          </p>
          <p>Si el Valor Presente total de las cuotas es menor que el precio de contado con descuento, la financiación es conveniente. Esto ocurre porque estás pagando deuda devaluada con ingresos futuros nominalmente mayores.</p>

          <h3>El Costo de Oportunidad (Inversión del Dinero)</h3>
          <p>Existe otro factor fundamental: <strong>¿qué hacés con el dinero que no gastás hoy?</strong> Si decidís comprar en cuotas, conservás el efectivo en tu poder. Ese efectivo podés colocarlo en una cuenta de inversión remunerada (como un plazo fijo, billetera digital con TNA activa, o cauciones bursátiles) que devenga rendimientos mes a mes. Al pagar la cuota con los intereses generados, al finalizar la financiación habrás retenido un capital excedente.</p>
          
          <p>Para modelar estos escenarios con precisión matemática y evaluar si te conviene pagar de contado o financiar según la tasa de tu billetera y la inflación estimada, podés usar nuestro simulador <strong>¿Cuotas o Efectivo?</strong> en la pestaña de Herramientas.</p>
        </div>
      )
    },
    {
      id: 'cedears-fci-primeros-pasos',
      title: 'CEDEARs y Fondos Comunes (FCI): Cómo proteger tus ahorros de la devaluación',
      summary: 'Si el plazo fijo tradicional ya no rinde lo suficiente, te explicamos cómo funcionan los CEDEARs para dolarizarte y cómo usar los Fondos Comunes de Inversión para mantener tu liquidez activa.',
      date: '08 de Junio, 2026',
      readTime: '6 min de lectura',
      category: 'inversiones',
      icon: <TrendingUp size={20} className="text-accent-primary" />,
      content: (
        <div>
          <p>Durante años, el Plazo Fijo ha sido el instrumento preferido de los ahorristas en pesos. Sin embargo, en un entorno de tasas de interés reales negativas (cuando la tasa del plazo fijo rinde por debajo de la inflación), el dinero guardado en el banco pierde poder de compra todos los meses. Para salir de este ciclo, existen dos herramientas bursátiles sencillas y accesibles: los <strong>Fondos Comunes de Inversión (FCI)</strong> y los <strong>CEDEARs</strong>.</p>
          
          <h3>1. Fondos Comunes de Inversión (FCI): Liquidez Inmediata</h3>
          <p>Un FCI es una cartera colectiva administrada por profesionales financieros donde aportás pesos junto a otros miles de ahorristas. Las principales ventajas son:</p>
          <ul>
            <li><strong>Fácil de operar:</strong> Se suscriben y rescatan desde el home banking o cuentas de inversión en segundos.</li>
            <li><strong>Liquidez a medida:</strong> Existen fondos <em>Money Market</em> de rescate inmediato (ideal para el dinero del mes) y fondos de renta fija de rescate en 24hs (T+1) o fondos atados a inflación (CER) de rescate en 48hs.</li>
            <li><strong>Diversificación instantánea:</strong> El fondo distribuye el capital en múltiples bonos, cauciones o letras de tesorería, minimizando el riesgo de un solo emisor.</li>
          </ul>

          <h3>2. CEDEARs: Dolarización sin Límites</h3>
          <p>Los <strong>CEDEARs (Certificados de Depósito Argentinos)</strong> representan acciones de empresas globales que cotizan en bolsas internacionales (como Apple, Microsoft, Coca-Cola o Google) y se pueden comprar en pesos en el mercado local.</p>
          <ul>
            <li><strong>Protección Cambiaria:</strong> El precio del CEDEAR se mueve en base al valor de la acción en el exterior y a la cotización del dólar libre (contado con liquidación o CCL). Si el dólar sube en Argentina, el valor de tus CEDEARs en pesos sube proporcionalmente, protegiéndote contra la devaluación.</li>
            <li><strong>Fraccionamiento:</strong> Podés comprar fracciones de acciones desde montos muy bajos, permitiendo acceder al mercado estadounidense sin necesidad de girar fondos al exterior.</li>
          </ul>

          <p>Para comparar las comisiones de compra/venta de CEDEARs, las TNAs de cuenta remunerada y los beneficios de los distintos operadores de bolsa habilitados ante la CNV, te invitamos a explorar nuestra herramienta de <strong>Comparador de Brokers</strong> en la pestaña de Herramientas.</p>
        </div>
      )
    },
    {
      id: 'freelancers-monotributo-exterior',
      title: 'Freelancers y Trabajo para el Exterior: Impuestos, Monotributo y Liquidación',
      summary: 'Una guía clara sobre cómo facturar legalmente tus servicios al extranjero en Argentina, las categorías del Monotributo 2026, el impuesto a las Ganancias y los límites para ingresar divisas.',
      date: '08 de Junio, 2026',
      readTime: '7 min de lectura',
      category: 'impuestos',
      icon: <Percent size={20} className="text-accent-primary" />,
      content: (
        <div>
          <p>El mercado de servicios profesionales hacia el exterior (programación, diseño, redacción, marketing) ha crecido de forma exponencial en Argentina. Sin embargo, para los profesionales autónomos, navegar los requerimientos de facturación, impuestos de la AFIP/ARCA y liquidación de cobros puede ser un dolor de cabeza.</p>
          
          <h3>El Régimen Simplificado (Monotributo)</h3>
          <p>El <strong>Monotributo</strong> es el punto de partida legal para cualquier freelancer. Consiste en una cuota unificada mensual que cubre el impuesto a las ganancias, el IVA, la jubilación y la obra social. Las categorías (desde la A hasta la K) se definen según los ingresos brutos facturados de forma anualizada.</p>
          <p>Para la exportación de servicios, emitís facturas del tipo <strong>Factura E (Exportación)</strong> en dólares o pesos. La exportación de servicios está exenta de IVA, pero sí compute para los topes máximos de facturación anual del régimen simplificado.</p>

          <h3>Ingreso de Divisas (Límite de u$s 12.000)</h3>
          <p>Según las reglamentaciones del Banco Central de la República Argentina (BCRA), los exportadores de servicios profesionales pueden ingresar hasta <strong>u$s 12.000 anuales de forma directa a sus cuentas bancarias locales en dólares</strong> sin necesidad de pesificarlos obligatoriamente al tipo de cambio oficial del MULC. Toda facturación excedente a ese monto anual debe ser liquidada en pesos en el mercado de cambios en un plazo no mayor a 5 días hábiles desde el cobro.</p>

          <h3>¿Cuándo entra en juego Ganancias?</h3>
          <p>Si excedés los límites máximos del Monotributo, pasás automáticamente al régimen de Responsable Inscripto. En este régimen, debés liquidar el Impuesto a las Ganancias de 4° categoría sobre tu renta neta imponible aplicando las escalas oficiales y deducciones personales vigentes.</p>
          
          <p>Para calcular tu sueldo neto real en pesos estimando comisiones de plataformas (Deel, Wise, Payoneer), retención impositiva de Ingresos Brutos y cuota mensual de monotributo, consultá nuestro simulador de <strong>Sueldo Neto Freelancer</strong> o el <strong>Simulador de Ganancias</strong> en la pestaña de Herramientas.</p>
        </div>
      )
    },
    {
      id: 'monotributo-escalas-2026-neto',
      title: 'Escalas Monotributo 2026: Cuotas, topes y cómo calcular tu neto en mano',
      summary: 'Detallamos las escalas impositivas vigentes de la AFIP/ARCA para Monotributo en 2026. Te explicamos los topes de facturación, el componente unificado y cómo proyectar tu ingreso real.',
      date: '09 de Junio, 2026',
      readTime: '5 min de lectura',
      category: 'impuestos',
      icon: <Percent size={20} className="text-accent-primary" />,
      content: (
        <div>
          <p>El **Monotributo** en Argentina es el sistema simplificado para pequeños contribuyentes. Con las actualizaciones de la AFIP/ARCA para el período fiscal 2026, los topes de facturación anual y las cuotas mensuales se ajustaron para reflejar la dinámica inflacionaria. Comprender en qué categoría ubicarte y cuánto pagarás es fundamental para planificar tu economía.</p>
          
          <h3>Topes de Facturación Anual 2026</h3>
          <p>Los límites máximos de facturación bruta anual determinan tu categoría. Si prestás servicios (Categorías A a H) o vendés cosas muebles (Categorías A a K), debés vigilar no pasarte de los límites para evitar la exclusión de oficio al régimen general (Responsable Inscripto):</p>
          <ul>
            <li><strong>Categorías Iniciales (A a C):</strong> Diseñadas para emprendimientos y profesionales independientes en sus primeros pasos, con cuotas mensuales accesibles.</li>
            <li><strong>Categoría H:</strong> El límite máximo de facturación anual para prestadores de servicios. Exceder este tope implica pasar automáticamente al régimen general.</li>
            <li><strong>Categoría K:</strong> El límite máximo absoluto de facturación anual exclusivo para venta de cosas muebles (comercio de bienes).</li>
          </ul>

          <h3>¿Qué compone la cuota del Monotributo?</h3>
          <p>La cuota mensual unificada que abonás al fisco se compone de tres partes:</p>
          <ol>
            <li><strong>Impuesto Integrado:</strong> Reemplaza al IVA y al Impuesto a las Ganancias.</li>
            <li><strong>Aporte Previsional (SIPA):</strong> Tu contribución mensual al sistema jubilatorio nacional.</li>
            <li><strong>Aporte de Obra Social:</strong> Destinado a tu cobertura de salud (si no la derivás a una prepaga corporativa).</li>
          </ol>

          <h3>Cómo estimar tu Ingreso Neto Real</h3>
          <p>Tu sueldo neto real no es simplemente lo que facturás. Para calcular tus ingresos netos en mano exactos, debés restar del total facturado:</p>
          <ul>
            <li>La cuota mensual fija de tu categoría de Monotributo.</li>
            <li>La alícuota de **Ingresos Brutos** (que varía entre 1.5% y 4% según tu provincia, o exento si aplicás al Monotributo Unificado).</li>
            <li>Las comisiones de la plataforma de cobro (si facturás para afuera) o comisiones de facturación locales.</li>
          </ul>
          <p>Para proyectar de forma exacta tu categoría impositiva óptima y calcular tu sueldo líquido estimado en pesos o dólares, te sugerimos utilizar nuestro simulador **Sueldo Neto Freelancer** en la pestaña de Herramientas.</p>
        </div>
      )
    },
    {
      id: 'como-comprar-dolar-mep-balanz',
      title: 'Cómo comprar Dólar MEP en Argentina: Guía paso a paso sin parking',
      summary: 'Te explicamos detalladamente qué es el dólar Bolsa o MEP, los requisitos para operar a través de un broker como Balanz y la mecánica para resguardar tus ahorros de forma legal.',
      date: '09 de Junio, 2026',
      readTime: '4 min de lectura',
      category: 'inversiones',
      icon: <TrendingUp size={20} className="text-accent-success" />,
      content: (
        <div>
          <p>El **Dólar MEP (Mercado Electrónico de Pagos)**, también conocido como dólar bolsa, es una forma 100% legal, segura y sin cupo mensual de adquirir dólares en Argentina utilizando títulos públicos que cotizan tanto en pesos como en dólares.</p>
          
          <h3>Mecánica de Compra (Paso a Paso)</h3>
          <ol>
            <li><strong>Abrir Cuenta de Inversión:</strong> Necesitás una cuenta comitente en una ALyC (Broker de Bolsa) regulada por la CNV, como **Balanz**.</li>
            <li><strong>Transferir Pesos:</strong> Transferís los pesos desde tu cuenta bancaria personal (del mismo titular) a tu cuenta del broker.</li>
            <li><strong>Comprar Bono en Pesos (Plazo Inmediato o 48hs):</strong> Comprás un bono soberano líquido (como el AL30 o GD30) utilizando tus pesos.</li>
            <li><strong>Cumplir el "Parking" Obligatorio:</strong> Por normativa del Banco Central y la CNV, debés mantener el bono comprado en tu cartera durante un plazo mínimo establecido (denominado "parking"), que suele ser de 1 día hábil, antes de poder venderlo. Durante este día no podés disponer del dinero.</li>
            <li><strong>Vender Bono en Dólares (AL30D / GD30D):</strong> Una vez cumplido el parking, vendés el mismo bono pero en su versión en dólares (identificada con la letra 'D' al final). Los dólares resultantes se acreditan en tu cuenta comitente.</li>
            <li><strong>Transferir a tu Banco:</strong> Transferís los dólares a tu caja de ahorro bancaria en dólares de forma directa.</li>
          </ol>

          <h3>¿Qué es el parking y cómo te afecta?</h3>
          <p>El "parking" introduce un riesgo de fluctuación de precios: durante el día que debés retener el bono, el precio del bono en dólares puede variar, modificando levemente tu tipo de cambio implícito final. Para mitigar esto, muchos brokers ofrecen funciones de **"Comprar MEP Simple"** o en un solo clic, automatizando la orden de venta al cumplirse el parking.</p>
          <p>Para analizar y comparar las comisiones operativas de Balanz frente a otros intermediarios financieros, consultá nuestro **Comparador de Brokers** en la sección de Herramientas. Si necesitás asistencia personalizada para abrir tu cuenta bonificada, podés contactar a nuestro asesor asociado en la sección de **Asesores**.</p>
        </div>
      )
    },
    {
      id: 'credito-uva-frances-vs-aleman',
      title: 'Simulador UVA: Diferencias entre el sistema Francés y Alemán de amortización',
      summary: 'Explicamos detalladamente cómo impacta la inflación en las cuotas de tu crédito hipotecario UVA según elijas amortizar bajo sistema Francés o Alemán. Claves para proteger tu presupuesto familiar.',
      date: '09 de Junio, 2026',
      readTime: '6 min de lectura',
      category: 'vivienda',
      icon: <Home size={20} className="text-accent-primary" />,
      content: (
        <div>
          <p>A la hora de solicitar un crédito hipotecario UVA en Argentina, los bancos ofrecen dos alternativas de amortización de deuda: el **Sistema Francés** y el **Sistema Alemán**. Aunque ambos se ajustan diariamente por la inflación (mediante el Coeficiente de Estabilización de Referencia - CER), la forma en que se estructuran las cuotas a lo largo del tiempo es radicalmente distinta.</p>
          
          <h3>1. Sistema Francés: Cuotas en UVA Constantes</h3>
          <p>En el sistema francés, la cuota medida en UVAs (capital + interés) se mantiene constante a lo largo de toda la vida del préstamo. Sin embargo, su composición cambia:</p>
          <ul>
            <li>Al principio del crédito, la mayor parte de la cuota se destina a pagar **intereses**, y se amortiza muy poco capital.</li>
            <li>Conforme pasan los años, la proporción de interés disminuye y aumenta la amortización de capital.</li>
            <li><strong>Ventaja:</strong> La cuota inicial en pesos suele ser más baja y accesible para calificar.</li>
            <li><strong>Desventaja:</strong> La deuda se reduce muy lentamente al principio, lo que incrementa el riesgo si la inflación se dispara en los primeros años.</li>
          </ul>

          <h3>2. Sistema Alemán: Amortización de Capital Constante</h3>
          <p>En el sistema alemán, lo que se mantiene constante a lo largo de todo el crédito es la porción de **amortización de capital** mensual. Los intereses se calculan siempre sobre el saldo deudor restante:</p>
          <ul>
            <li>Dado que el saldo deudor se reduce de forma constante y lineal, el interés a pagar disminuye mes a mes.</li>
            <li>Esto hace que la cuota total medida en UVAs sea **decreciente**: las primeras cuotas son las más caras, y las últimas son las más baratas.</li>
            <li><strong>Ventaja:</strong> Pagás menos intereses totales a lo largo del préstamo y tu deuda real se reduce más rápido.</li>
            <li><strong>Desventaja:</strong> Requiere ingresos mínimos demostrables sustancialmente mayores para calificar debido a que las cuotas iniciales son más elevadas.</li>
          </ul>

          <h3>¿Cuál te conviene elegir?</h3>
          <p>Si contás con holgura financiera en tus ingresos mensuales y podés afrontar las primeras cuotas, el **sistema Alemán** es financieramente más eficiente. Si tu presupuesto inicial es ajustado y necesitás maximizar el monto del préstamo para comprar la propiedad, el **sistema Francés** suele ser la única opción viable.</p>
          <p>Para modelar ambos escenarios de amortización aplicando tasas de inflación proyectadas y visualizar la progresión de tus cuotas, te sugerimos utilizar nuestro simulador interactivo de **Crédito Hipotecario UVA** en la pestaña de Herramientas.</p>
        </div>
      )
    },
    {
      id: 'tna-vs-tea-capitalizacion',
      title: 'TNA vs TEA: La guía definitiva de capitalización de tasas en Argentina',
      summary: 'Descubrí qué es la capitalización de tasas de interés, por qué la TNA es un valor engañoso y cómo calcular la Tasa Efectiva Anual (TEA) para cauciones, plazos fijos y deudas.',
      date: '11 de Junio, 2026',
      readTime: '5 min de lectura',
      category: 'inversiones',
      icon: <Percent size={20} className="text-accent-primary" />,
      content: (
        <div>
          <p>Cuando analizás colocar tus ahorros en un plazo fijo, una billetera digital remunerada o una caución bursátil en Argentina, te encontrás siempre con dos siglas fundamentales: <strong>TNA (Tasa Nominal Anual)</strong> y <strong>TEA (Tasa Efectiva Anual)</strong>. Confundirlas es uno de los errores más comunes de las finanzas personales.</p>
          
          <h3>¿Qué es la TNA y por qué es engañosa?</h3>
          <p>La Tasa Nominal Anual es una tasa puramente de referencia teórica que no tiene en cuenta la reinversión periódica de los intereses. Si un banco te ofrece una TNA del 60% con capitalización mensual, no significa que ganarás un 60% al año si mantenés tu depósito acumulado. La TNA solo sirve para calcular los intereses de un único período.</p>
          
          <h3>El Poder de la TEA (Capitalización Compuesta)</h3>
          <p>La Tasa Efectiva Anual mide el rendimiento real neto de tu inversión a lo largo de un año, asumiendo que al final de cada mes retirás los intereses generados y los volvés a invertir junto con tu capital original (es decir, los capitalizás).</p>
          <p>La fórmula matemática para obtener la TEA a partir de la TNA y la frecuencia de capitalización es:</p>
          <blockquote style={{ 
            borderLeft: '4px solid var(--accent-primary)', 
            padding: '0.75rem 1rem', 
            margin: '1.5rem 0',
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: '0 var(--border-radius-sm) var(--border-radius-sm) 0'
          }}>
            <strong>TEA = [ 1 + (TNA / n) ]^n - 1</strong><br />
            Donde <em>n</em> es la cantidad de capitalizaciones al año (por ejemplo, para capitalización mensual <em>n = 12</em>, diaria <em>n = 365</em>).
          </blockquote>
          <p>Si la TNA es de 60% con capitalización mensual:</p>
          <ul>
            <li>Tasa mensual (TEM) = 60% / 12 = 5%.</li>
            <li>TEA = (1 + 0.05)^12 - 1 = 1.05^12 - 1 ≈ <strong>79.58%</strong>.</li>
          </ul>
          <p>¡La diferencia es de casi 20 puntos porcentuales debido a la capitalización de intereses!</p>
          
          <h3>Cauciones vs. Plazo Fijo: ¿Qué frecuencia conviene?</h3>
          <p>Las cauciones bursátiles se colocan habitualmente a 7 días. Esto significa que capitalizás intereses 52 veces al año. Aunque la TNA de una caución sea ligeramente menor que la de un Plazo Fijo tradicional (que inmoviliza el dinero por un mínimo de 30 días), la frecuencia de reinversión más corta puede elevar la TEA final y brindarte liquidez para aprovechar oportunidades de mercado.</p>
          <p>Para convertir cualquier TNA en TEA según la frecuencia de capitalización y estimar tu rendimiento real neto descontando la inflación esperada, utilizá nuestra herramienta <strong>Conversor TNA a TEA</strong> en la sección Herramientas.</p>
        </div>
      )
    },
    {
      id: 'interes-compuesto-retiro-temprano',
      title: 'Interés Compuesto y Retiro Temprano: Cómo planificar tu libertad financiera',
      summary: 'Te enseñamos cómo combinar el ahorro recurrente, la tasa de rentabilidad y el factor tiempo para construir un portafolio de retiro auto-sustentable usando interés compuesto.',
      date: '11 de Junio, 2026',
      readTime: '6 min de lectura',
      category: 'inversiones',
      icon: <TrendingUp size={20} className="text-accent-primary" />,
      content: (
        <div>
          <p>La jubilación tradicional nos propone trabajar durante 30 o 40 años para luego vivir de una pensión estatal. El **Retiro Temprano** o Movimiento de Independencia Financiera propone un camino alternativo: acumular un capital propio que genere rendimientos suficientes para cubrir nuestros gastos de por vida. El secreto que hace esto posible no es un salario millonario, sino el **interés compuesto**.</p>
          
          <h3>El Factor Tiempo y la Curva Exponencial</h3>
          <p>El interés compuesto tiene un comportamiento no lineal: crece muy despacio durante los primeros años y se dispara de forma vertical en las décadas siguientes. Si invertís $500 mensuales a una tasa de rendimiento del 8% anual (rendimiento promedio histórico ajustado por inflación del S&P 500):</p>
          <ul>
            <li><strong>En 10 años:</strong> Habrás aportado $60.000 y acumulado un total de <strong>$92.000</strong> (intereses ganados: $32.000).</li>
            <li><strong>En 20 años:</strong> Habrás aportado $120.000 y acumulado <strong>$294.000</strong> (intereses ganados: $174.000).</li>
            <li><strong>En 30 años:</strong> Habrás aportado $180.000 y acumulado <strong>$750.000</strong> (intereses ganados: $570.000).</li>
          </ul>
          <p>¡El 76% de tu fortuna final a los 30 años provendrá enteramente del interés compuesto y no de tus bolsillos! Por eso comenzar lo antes posible es la regla de oro.</p>
          
          <h3>El Portafolio de Retiro Auto-sustentable</h3>
          <p>Una vez que tu portafolio alcanza el tamaño necesario (siguiendo la regla del 4%, por ejemplo), podés dejar de hacer aportes mensuales y pasar a la fase de retiro. Tus inversiones seguirán creciendo a la par de la inflación mientras extraés una porción controlada para vivir, manteniendo el saldo principal intacto indefinidamente.</p>
          <p>Para que la estrategia funcione:</p>
          <ol>
            <li><strong>Minimizá los costos:</strong> Evitá comisiones excesivas que erosionen tu interés compuesto acumulado. Podés comparar brokers de bolsa locales utilizando nuestro <strong>Comparador de Brokers</strong>.</li>
            <li><strong>Diversificá de forma global:</strong> No dependas del riesgo país de una sola jurisdicción. Invertí en ETFs indexados globales a través de CEDEARs o cuentas en el exterior.</li>
          </ol>
          <p>Si querés proyectar el impacto del interés compuesto con tus ahorros mensuales actuales o poner a prueba tu plan de retiro haciendo backtesting contra crisis reales de mercado, utilizá nuestro <strong>Simulador de Retiro</strong> y la <strong>Calculadora de Interés Compuesto</strong>.</p>
        </div>
      )
    },
    {
      id: 'actualizacion-ipc-contratos-deudas',
      title: 'Actualización por IPC: Guía para indexar deudas, alquileres y contratos por inflación',
      summary: 'Explicamos cómo funciona la indexación monetaria en Argentina utilizando el IPC oficial del INDEC y cómo aplicar el actualizador para evitar la licuación de tus contratos.',
      date: '11 de Junio, 2026',
      readTime: '5 min de lectura',
      category: 'ahorro',
      icon: <Scale size={20} className="text-accent-primary" />,
      content: (
        <div>
          <p>En Argentina, la inflación acumulada a lo largo de los años hace inviable fijar montos estáticos en pesos para obligaciones de mediano y largo plazo. Firmar un contrato de servicios, convenir una cuota alimentaria o establecer un plan de pagos sin una cláusula de ajuste adecuada destruye el poder de compra del acreedor. La métrica por excelencia para contrarrestar esto es la **indexación por IPC (Índice de Precios al Consumidor)**.</p>
          
          <h3>¿Qué es el IPC y cómo mide la inflación?</h3>
          <p>El IPC es un indicador calculado mensualmente por el INDEC que mide la variación de los precios de una canasta de consumo representativa de los hogares. Cuando se publica el dato mensual (habitualmente a mediados del mes siguiente), se establece el porcentaje oficial de inflación del período anterior.</p>
          
          <h3>La Matemática de la Actualización Impositiva y Comercial</h3>
          <p>Para actualizar un valor monetario del pasado según la inflación minorista acumulada se utiliza el método de cociente de índices de precios. La fórmula es:</p>
          <blockquote style={{ 
            borderLeft: '4px solid var(--accent-primary)', 
            padding: '0.75rem 1rem', 
            margin: '1.5rem 0',
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: '0 var(--border-radius-sm) var(--border-radius-sm) 0'
          }}>
            <strong>Monto Actualizado = Monto Original × ( ÍNDEC Fin / ÍNDEC Inicio )</strong>
          </blockquote>
          <p>Por ejemplo, si querés ajustar un contrato que vencía en Enero 2024 a valores de Diciembre 2024:</p>
          <ol>
            <li>Buscás el índice acumulado de IPC para Enero 2024 y para Diciembre 2024.</li>
            <li>Dividís el índice de Diciembre por el de Enero para obtener el factor de inflación acumulada (supongamos que da 3.11).</li>
            <li>Multiplicás tu monto original por 3.11 para obtener el monto nominal actualizado a pesos de fin de año.</li>
          </ol>
          
          <h3>¿Cuándo aplicar el IPC en lugar de otras tasas?</h3>
          <ul>
            <li><strong>Contratos de Servicios y Alquileres Comerciales:</strong> El ajuste directo por IPC es la cláusula estándar preferida por su transparencia y facilidad de consulta pública.</li>
            <li><strong>Deudas Judiciales y Retroactivos:</strong> Los juzgados suelen aplicar tasas del Banco Nación o tasas específicas activas/pasivas, pero el ajuste por IPC es la métrica preferida por peritos contables para demostrar la pérdida real de valor patrimonial frente al fisco.</li>
          </ul>
          <p>Para realizar cálculos instantáneos de actualización de montos en pesos desde Enero de 2003 hasta la actualidad utilizando el set de datos del INDEC oficial consolidado, te invitamos a usar nuestra herramienta **Actualizador IPC (INDEC)** en la pestaña Herramientas.</p>
        </div>
      )
    }
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedArticleId]);

  useEffect(() => {
    const updateMeta = (title, desc) => {
      document.title = title;
      const selectors = {
        'meta[name="description"]': desc,
        'meta[property="og:title"]': title,
        'meta[property="og:description"]': desc,
        'meta[property="twitter:title"]': title,
        'meta[property="twitter:description"]': desc
      };
      Object.entries(selectors).forEach(([selector, val]) => {
        const el = document.querySelector(selector);
        if (el) el.setAttribute('content', val);
      });
    };

    if (selectedArticleId) {
      const article = articles.find(a => a.id === selectedArticleId);
      if (article) {
        updateMeta(`${article.title} | Valia`, article.summary);
      }
    } else {
      updateMeta(
        "Educación Financiera y Guías de Inversión | Valia",
        "Artículos prácticos sobre inversiones, interés compuesto, la regla del 4%, créditos UVA y optimización fiscal en Argentina."
      );
    }
  }, [selectedArticleId]);

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 0', maxWidth: '1000px' }}>
      
      {selectedArticleId ? (
        // Full Article View
        (() => {
          const article = articles.find(a => a.id === selectedArticleId);
          return (
            <article style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => setSelectedArticleId(null)} 
                  className="btn btn-outline"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
                >
                  <ArrowLeft size={16} />
                  Volver al Centro de Educación
                </button>

                <button 
                  onClick={() => {
                    const shareUrl = `${window.location.origin}/?seccion=educacion&articulo=${article.id}`;
                    navigator.clipboard.writeText(shareUrl);
                    setCopiedArticle(true);
                    setTimeout(() => setCopiedArticle(false), 2000);
                  }} 
                  className="btn btn-outline"
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    padding: '0.5rem 1rem', 
                    borderColor: copiedArticle ? 'var(--accent-success, #10b981)' : 'var(--border-color)',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <Share2 size={16} className={copiedArticle ? "text-accent-success" : "text-accent-primary"} />
                  {copiedArticle ? '¡Enlace copiado!' : 'Compartir artículo'}
                </button>
              </div>

              <header>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <span style={{ textTransform: 'uppercase', color: 'var(--accent-primary)', fontWeight: 'bold' }}>{article.category}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={12} />
                    {article.date}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={12} />
                    {article.readTime}
                  </span>
                </div>
                <h1 style={{ fontSize: '2.25rem', lineHeight: '1.2', fontWeight: 700, marginBottom: '1rem' }}>
                  {article.title}
                </h1>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                  {article.summary}
                </p>
              </header>

              <hr style={{ border: '0', borderTop: '1px solid var(--border-color)' }} />

              <div 
                className="blog-content-body"
                style={{ 
                  color: 'var(--text-secondary)', 
                  lineHeight: '1.8', 
                  fontSize: '1.025rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem'
                }}
              >
                {article.content}
              </div>

              {/* Internal CTA card for advisors */}
              <div className="card" style={{ 
                marginTop: '3rem', 
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.06), rgba(6, 182, 212, 0.01))',
                border: '1px solid rgba(6, 182, 212, 0.2)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>¿Buscás llevar esta teoría a la práctica?</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                      Consultá gratis con un asesor idóneo matriculado de Balanz para estructurar tu cartera de inversión o planificar tu crédito.
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      localStorage.setItem('valia_advisor_goal_context', article.category === 'vivienda' ? 'vivienda' : article.category === 'inversiones' ? 'retiro' : 'ahorro');
                      window.dispatchEvent(new CustomEvent('change-tab', { detail: 'asesores' }));
                    }}
                    className="btn btn-primary"
                    style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    Contactar Asesor
                    <MessageSquare size={16} />
                  </button>
                </div>
              </div>

            </article>
          );
        })()
      ) : (
        // Category List View
        <div>
          {/* Header */}
          <header className="calculator-header" style={{ marginBottom: '3rem' }}>
            <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <BookOpen size={32} className="text-accent-primary" />
              Educación Financiera
            </h1>
            <p>Guías prácticas e independientes para entender el mercado, planificar tus inversiones y tomar decisiones inteligentes.</p>
          </header>

          {/* Search and Category Filters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
            
            {/* Search Input */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '500px', margin: '0 auto' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input 
                type="text" 
                className="input-field" 
                placeholder="Buscar artículos (ej: Retiro, Interés compuesto)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.5rem', width: '100%', height: '44px', borderRadius: '50px' }}
              />
            </div>

            {/* Categories */}
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {['todos', 'inversiones', 'ahorro', 'vivienda', 'impuestos'].map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-outline'}`}
                  style={{ 
                    padding: '0.35rem 1rem', 
                    fontSize: '0.85rem', 
                    borderRadius: '50px',
                    textTransform: 'capitalize'
                  }}
                >
                  {category}
                </button>
              ))}
            </div>

          </div>

          {/* Articles Grid */}
          {filteredArticles.length === 0 ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No se encontraron artículos que coincidan con tu búsqueda.
            </div>
          ) : (
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {filteredArticles.map(article => (
                <div 
                  key={article.id} 
                  className="card"
                  onClick={() => setSelectedArticleId(article.id)}
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '1rem', 
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'transform var(--transition-fast), border-color var(--transition-fast)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.4)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ 
                        fontSize: '0.65rem', 
                        fontWeight: 'bold', 
                        color: 'var(--accent-primary)', 
                        textTransform: 'uppercase',
                        backgroundColor: 'rgba(6, 182, 212, 0.08)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px'
                      }}>
                        {article.category}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={12} />
                        {article.readTime}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', lineHeight: '1.3', fontWeight: 600 }}>{article.title}</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      {article.summary}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{article.date}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      Leer artículo
                      <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default Blog;
