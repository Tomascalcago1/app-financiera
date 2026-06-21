export const translations = {
  es: {
    // Header
    'header.title': 'Conversor TNA a TEA',
    'header.subtitle': 'Calculadora de equivalencia de tasas e interés compuesto frente a la inflación.',
    'header.understand_rates': '¿Cómo entender las tasas y la capitalización?',
    
    // Inputs Panel
    'card.params': 'Parámetros de Tasa',
    'input.tna': 'Tasa Nominal Anual (TNA %)',
    'input.freq': 'Frecuencia de Capitalización',
    'input.inflation': 'Inflación Anual Estimada (%)',
    
    // Freq options
    'freq.daily': 'Diaria (365 días)',
    'freq.weekly': 'Semanal (52 semanas)',
    'freq.biweekly': 'Quincenal (24 quincenas)',
    'freq.monthly': 'Mensual (12 meses)',
    'freq.bimonthly': 'Bimestral (6 bimestres)',
    'freq.quarterly': 'Trimestral (4 trimestres)',
    'freq.semiannually': 'Semestral (2 semestres)',
    'freq.annually': 'Anual (1 vez al año)',
    
    // Guide
    'guide.tag': 'Guía Recomendada',
    'guide.title': 'TNA vs TEA: Capitalización de intereses explicada',
    
    // Results
    'report.title': 'Reporte de Equivalencia de Tasas',
    'report.subtitle': 'Ficha de Evaluación de Rendimiento y Capitalización Compuesta',
    'report.param.tna': 'TNA Declarada',
    'report.param.freq': 'Capitalización',
    'report.param.inflation': 'Inflación Estimada Anual',
    
    'dash.tea_title': 'Tasa Efectiva Anual (TEA) Resultante',
    'dash.tea_desc': 'La tasa capitalizada rinde un <strong>{diff}% más</strong> de forma anual comparado con la TNA base.',
    'dash.tem_title': 'Tasa Efectiva Mensual (TEM)',
    'dash.tem_desc': 'Rendimiento cada 30 días',
    'dash.real_return_title': 'Rendimiento Real Anual',
    'dash.real_return_success': '✓ Le gana a la inflación',
    'dash.real_return_loss': '✗ Pérdida adquisitiva',
    
    // Actions
    'btn.share': 'Compartir Simulación',
    'btn.copied': '¡Copiado!',
    'btn.csv': 'Exportar CSV (Excel)',
    'btn.pdf': 'Imprimir Reporte PDF',
    
    // Chart
    'chart.title': 'Efecto de Capitalización Compuesta',
    'chart.subtitle': 'Simulación de crecimiento de un capital inicial de $100.000 a lo largo de 12 meses',
    'chart.month': 'Mes',
    'chart.legend.compound': 'Interés Compuesto (TEA)',
    'chart.legend.simple': 'Interés Simple (TNA)',
    
    // Table
    'btn.table.show': 'Mostrar Desglose Mensual',
    'btn.table.hide': 'Ocultar Tabla',
    'table.period': 'Periodo',
    'table.simple_balance': 'Saldo Simple (TNA)',
    'table.simple_interest': 'Interés Simple Acum.',
    'table.compound_balance': 'Saldo Compuesto (TEA)',
    'table.compound_interest': 'Interés Comp. Acum.',
    'table.month': 'Mes',
    
    // Help Modal
    'help.title': '¿Cómo se calcula el Interés Compuesto?',
    'help.h1': '1. Tasa Nominal Anual (TNA)',
    'help.p1': 'Es un porcentaje anual que se calcula de forma lineal sobre el capital original. Si prestás $10.000 al 40% TNA sin capitalización, al finalizar el año cobrarás exactamente $4.000 de interés simple.',
    'help.h2': '2. Capitalización (El Factor de Frecuencia)',
    'help.p2': 'Si en lugar de retirar los intereses al final del año, cobrás intereses mensuales e inmediatamente los reinvertís, cada mes generarás intereses sobre los intereses acumulados previamente. A esto se le conoce como capitalización.',
    'help.h3': '3. Tasa Efectiva Anual (TEA)',
    'help.p3': 'Es la tasa que efectivamente cobrás o pagás al cabo de un año sumando el efecto compuesto de la reinversion. Es el verdadero indicador del rendimiento financiero y el número clave para comparar cualquier plazo fijo, fondo común de inversión o tarjeta de crédito.',

    // FAQs
    'faqs.title': 'Preguntas Frecuentes sobre Tasas de Interés',
    'faq.q1': '¿Cuál es la diferencia entre TNA y TEA?',
    'faq.a1': 'La Tasa Nominal Anual (TNA) es la tasa de referencia que no tiene en cuenta la capitalización o reinversión del interés. La Tasa Efectiva Anual (TEA), en cambio, refleja el rendimiento neto real al cabo de un año asumiendo que los intereses cobrados se vuelven a reinvertir bajo las mismas condiciones (interés compuesto).',
    'faq.q2': '¿Qué es la TEM y para qué se usa?',
    'faq.a2': 'La Tasa Efectiva Mensual (TEM) representa la tasa real a la que rinde o se financia tu dinero cada 30 días. Es fundamental para comparar el rendimiento de billeteras virtuales (cuentas remuneradas) o para conocer el interés real de las cuotas de tus tarjetas.',
    'faq.q3': '¿Cómo influye la frecuencia de capitalización?',
    'faq.a3': 'A mayor frecuencia de capitalización (ej. diaria en lugar de mensual), los intereses se liquidan y reinvierten más rápido. Esto incrementa exponencialmente la TEA resultante, incluso si la TNA base es la misma. Por ejemplo, una TNA de 40% capitalizando diariamente rinde más que capitalizando mensualmente.',
    'faq.q4': '¿Qué es la tasa real (Rendimiento Real)?',
    'faq.a4': 'Es el rendimiento neto de la inversión una vez descontado el efecto erosivo de la inflación del período (Efecto Fisher). Si tu TEA es del 45% y la inflación anual es del 40%, tu rendimiento real es positivo (+3.57%). Si la inflación supera a la TEA, tu rendimiento real es negativo (pérdida de poder de compra).'
  },
  en: {
    // Header
    'header.title': 'APR to APY Converter',
    'header.subtitle': 'Interest rate compounding equivalence and inflation-adjusted return calculator.',
    'header.understand_rates': 'How to understand interest rates and compounding?',
    
    // Inputs Panel
    'card.params': 'Interest Rate Parameters',
    'input.tna': 'Nominal Annual Rate (APR %)',
    'input.freq': 'Compounding Frequency',
    'input.inflation': 'Estimated Annual Inflation (%)',
    
    // Freq options
    'freq.daily': 'Daily (365 days)',
    'freq.weekly': 'Weekly (52 weeks)',
    'freq.biweekly': 'Biweekly (24 periods)',
    'freq.monthly': 'Monthly (12 months)',
    'freq.bimonthly': 'Bimonthly (6 periods)',
    'freq.quarterly': 'Quarterly (4 quarters)',
    'freq.semiannually': 'Semi-annually (2 periods)',
    'freq.annually': 'Annually (once a year)',
    
    // Guide
    'guide.tag': 'Recommended Guide',
    'guide.title': 'APR vs APY: Rate compounding explained',
    
    // Results
    'report.title': 'Rate Compounding Report',
    'report.subtitle': 'Yield Evaluation and Compounding Planning Sheet',
    'report.param.tna': 'Declared APR',
    'report.param.freq': 'Compounding',
    'report.param.inflation': 'Estimated Annual Inflation',
    
    'dash.tea_title': 'Resulting Annual Percentage Yield (APY)',
    'dash.tea_desc': 'The compounded rate yields <strong>{diff}% more</strong> annually compared to the base APR.',
    'dash.tem_title': 'Effective Monthly Rate (EMR)',
    'dash.tem_desc': 'Yield every 30 days',
    'dash.real_return_title': 'Annual Real Return',
    'dash.real_return_success': '✓ Beats inflation',
    'dash.real_return_loss': '✗ Adquisitive power loss',
    
    // Actions
    'btn.share': 'Share Simulation',
    'btn.copied': 'Copied!',
    'btn.csv': 'Export CSV (Excel)',
    'btn.pdf': 'Print PDF Report',
    
    // Chart
    'chart.title': 'Compounding Interest Effect',
    'chart.subtitle': 'Simulation of a $100,000 initial balance growth over 12 months',
    'chart.month': 'Month',
    'chart.legend.compound': 'Compound Interest (APY)',
    'chart.legend.simple': 'Simple Interest (APR)',
    
    // Table
    'btn.table.show': 'Show Monthly Breakdown',
    'btn.table.hide': 'Hide Table',
    'table.period': 'Period',
    'table.simple_balance': 'Simple Balance (APR)',
    'table.simple_interest': 'Accum. Simple Interest',
    'table.compound_balance': 'Compound Balance (APY)',
    'table.compound_interest': 'Accum. Compound Interest',
    'table.month': 'Month',
    
    // Help Modal
    'help.title': 'How is Compound Interest Calculated?',
    'help.h1': '1. Annual Percentage Rate (APR)',
    'help.p1': 'It is an annual percentage calculated linearly on the original principal. If you lend $10,000 at 40% APR without compounding, at the end of the year you will earn exactly $4,000 in simple interest.',
    'help.h2': '2. Compounding (The Frequency Factor)',
    'help.p2': 'If instead of withdrawing interest at the end of the year you collect interest monthly and immediately reinvest it, every month you will generate interest on previously accumulated interest. This is known as compounding.',
    'help.h3': '3. Annual Percentage Yield (APY)',
    'help.p3': 'It is the rate you actually earn or pay after one year, accounting for the compounding effect of reinvestment. It is the real indicator of financial yield and the key figure to compare any fixed deposit, mutual fund, or credit card.',

    // FAQs
    'faqs.title': 'Frequently Asked Questions about Interest Rates',
    'faq.q1': 'What is the difference between APR and APY?',
    'faq.a1': 'The Annual Percentage Rate (APR) is the simple annual rate that does not account for the compounding or reinvestment of interest. The Annual Percentage Yield (APY), on the other hand, reflects the actual net yield after one year assuming that the interest earned is reinvested under the same conditions (compound interest).',
    'faq.q2': 'What is EMR and what is it used for?',
    'faq.a2': 'The Effective Monthly Rate (EMR) represents the real rate at which your money grows or is financed every 30 days. It is essential for comparing digital wallets yields or finding the real interest rate on credit card installments.',
    'faq.q3': 'How does compounding frequency affect the yield?',
    'faq.a3': 'A higher compounding frequency (e.g., daily instead of monthly) means interest is settled and reinvested faster. This exponentially increases the resulting APY, even if the base APR remains the same. For example, a 40% APR compounded daily yields more than the same APR compounded monthly.',
    'faq.q4': 'What is the real rate (Real Return)?',
    'faq.a4': 'It is the net return on the investment after subtracting the eroding effect of inflation (Fisher equation). If your APY is 45% and annual inflation is 40%, your real return is positive (+3.57%). If inflation exceeds the APY, your real return is negative (loss of purchasing power).'
  }
};
