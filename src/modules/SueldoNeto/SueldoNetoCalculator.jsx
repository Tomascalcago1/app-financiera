import React, { useState, useEffect, useMemo } from 'react';
import { 
  Percent, 
  HelpCircle, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle,
  Download,
  Printer,
  Share2,
  Image
} from 'lucide-react';
import { exportChartToPNG } from '../../utils/chartExporter';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import FinancialInput from '../../components/FinancialInput';
import AdvisorCTA from '../../components/AdvisorCTA';
import HelpModal from '../../components/HelpModal';
import PrintReportHeader from '../../components/PrintReportHeader';
import PrintAdvisorCTA from '../../components/PrintAdvisorCTA';
import FAQSection from '../../components/FAQSection';

const formatCurrency = (val) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(val);
};

const SueldoNetoCalculator = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const getNumericParam = (key, fallback) => {
    const val = queryParams.get(key);
    return val !== null && !isNaN(val) ? Number(val) : fallback;
  };
  const getStringParam = (key, fallback) => {
    const val = queryParams.get(key);
    return val !== null ? val : fallback;
  };

  const [grossIncome, setGrossIncome] = useState(() => getNumericParam('gross', 1500000)); // 1.5 millones por defecto
  const [currency, setCurrency] = useState(() => getStringParam('currency', 'ARS')); // 'ARS' | 'USD'
  const [exchangeRate, setExchangeRate] = useState(() => getNumericParam('exRate', 1200)); // Cotización MEP por defecto
  const [activity, setActivity] = useState(() => getStringParam('activity', 'services')); // 'services' | 'goods'
  const [iibbPercent, setIibbPercent] = useState(() => getNumericParam('iibb', 3.0)); // 3% Ingresos Brutos
  const [platformFee, setPlatformFee] = useState(() => getNumericParam('fee', 2.5)); // 2.5% comisiones de cobro
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.get('exRate')) {
      fetch('https://dolarapi.com/v1/dolares/mep')
        .then(res => res.json())
        .then(data => {
          if (data && data.venta) {
            setExchangeRate(Math.round(data.venta));
          }
        })
        .catch(err => console.error('Error fetching exchange rate:', err));
    }
  }, []);

  const handleShare = () => {
    const params = new URLSearchParams();
    params.set('tool', 'sueldo-neto');
    params.set('gross', grossIncome);
    params.set('currency', currency);
    if (currency === 'USD') params.set('exRate', exchangeRate);
    params.set('activity', activity);
    params.set('iibb', iibbPercent);
    params.set('fee', platformFee);

    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      })
      .catch(err => console.error('Error al copiar el enlace: ', err));
  };

  const getMonotributoScale = (annualBilling, act) => {
    if (annualBilling > 108357084.05) {
      return { cat: 'Responsable Inscripto', limit: 108357084.05, fee: 0, isExceeded: true };
    }

    const scales = [
      { cat: 'A', limit: 10277988.13, feeServices: 42386.74, feeGoods: 42386.74 },
      { cat: 'B', limit: 15058447.71, feeServices: 48250.78, feeGoods: 48250.78 },
      { cat: 'C', limit: 21113696.52, feeServices: 56501.85, feeGoods: 55227.06 },
      { cat: 'D', limit: 26212853.42, feeServices: 72414.10, feeGoods: 70661.26 },
      { cat: 'E', limit: 30833964.37, feeServices: 102537.97, feeGoods: 92658.35 },
      { cat: 'F', limit: 38642048.36, feeServices: 129045.32, feeGoods: 111198.27 },
      { cat: 'G', limit: 46211109.37, feeServices: 197108.23, feeGoods: 135918.34 },
      { cat: 'H', limit: 70113407.33, feeServices: 447346.93, feeGoods: 272063.40 },
      { cat: 'I', limit: 78479211.62, feeServices: 824802.26, feeGoods: 406512.05 },
      { cat: 'J', limit: 89872640.30, feeServices: 999007.65, feeGoods: 497059.41 },
      { cat: 'K', limit: 108357084.05, feeServices: 1381687.90, feeGoods: 600879.51 }
    ];

    for (const scale of scales) {
      if (annualBilling <= scale.limit) {
        return {
          cat: scale.cat,
          limit: scale.limit,
          fee: act === 'services' ? scale.feeServices : scale.feeGoods,
          isExceeded: false
        };
      }
    }
    return { cat: 'Responsable Inscripto', limit: 108357084.05, fee: 0, isExceeded: true };
  };

  const calculations = useMemo(() => {
    // Convert USD to ARS if needed
    const grossIncomeArs = currency === 'USD' ? grossIncome * exchangeRate : grossIncome;
    const annualBillingArs = grossIncomeArs * 12;

    const scale = getMonotributoScale(annualBillingArs, activity);

    // Platform commissions
    const platformFeeAmount = grossIncomeArs * (platformFee / 100);

    // Ingresos Brutos
    const iibbAmount = grossIncomeArs * (iibbPercent / 100);

    let nationalTaxAmount = 0;
    let netIncome = 0;
    let autonomosAmount = 0;
    let gananciasAmount = 0;

    if (!scale.isExceeded) {
      // Monotributo
      nationalTaxAmount = scale.fee;
      netIncome = grossIncomeArs - nationalTaxAmount - iibbAmount - platformFeeAmount;
    } else {
      // Responsable Inscripto
      autonomosAmount = 52000; // Estimación Autónoma mensual 2026
      // Ganancias efectiva simplificada (25% sobre facturación neta de comisiones)
      gananciasAmount = Math.max(0, (grossIncomeArs - platformFeeAmount) * 0.25);
      nationalTaxAmount = autonomosAmount + gananciasAmount;
      netIncome = grossIncomeArs - nationalTaxAmount - iibbAmount - platformFeeAmount;
    }

    netIncome = Math.max(0, netIncome);

    // Chart Pie Data
    const pieData = [
      { name: 'Sueldo Neto', value: netIncome, color: '#10b981' },
      { name: 'Impuestos Nacionales', value: nationalTaxAmount, color: 'var(--accent-primary)' },
      { name: 'Ingresos Brutos', value: iibbAmount, color: 'var(--accent-warning)' },
      { name: 'Comisiones Cobro', value: platformFeeAmount, color: '#64748b' }
    ].filter(d => d.value > 0);

    return {
      grossIncomeArs,
      annualBillingArs,
      scale,
      platformFeeAmount,
      iibbAmount,
      nationalTaxAmount,
      autonomosAmount,
      gananciasAmount,
      netIncome,
      pieData
    };
  }, [grossIncome, currency, exchangeRate, activity, iibbPercent, platformFee]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value, payload: data } = payload[0];
      const percentage = ((value / calculations.grossIncomeArs) * 100).toFixed(1);
      return (
        <div className="card" style={{ padding: '0.75rem 1rem', border: '1px solid var(--border-color)' }}>
          <p style={{ fontWeight: 600, marginBottom: '0.25rem', fontSize: '0.85rem' }}>{name}</p>
          <strong style={{ fontSize: '0.85rem', color: data.color }}>
            {formatCurrency(value)} ({percentage}%)
          </strong>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <header className="calculator-header">
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Percent size={32} className="text-accent-primary" />
          Sueldo Neto Freelancer
        </h1>
        <p>Calculá tus ingresos netos reales en mano bajo las escalas vigentes de Monotributo de Argentina.</p>
        <button onClick={() => setIsHelpOpen(true)} className="help-btn">
          <HelpCircle size={18} className="text-accent-primary" />
          ¿Cómo se calculan las categorías del Monotributo?
        </button>
      </header>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '2rem', alignItems: 'start' }}>
        {/* Input panel */}
        <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '0.5rem' }}>
            Tus Ingresos Brutos
          </h2>

          <div className="input-group">
            <label className="input-label">Moneda de Facturación</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className={`btn ${currency === 'ARS' ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1, padding: '0.5rem', justifyContent: 'center' }}
                onClick={() => setCurrency('ARS')}
              >
                Pesos ($)
              </button>
              <button 
                className={`btn ${currency === 'USD' ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1, padding: '0.5rem', justifyContent: 'center' }}
                onClick={() => setCurrency('USD')}
              >
                Dólares (US$)
              </button>
            </div>
          </div>

          <FinancialInput 
            label={currency === 'USD' ? 'Facturación Mensual (USD)' : 'Facturación Mensual (ARS)'}
            value={grossIncome} 
            onChange={setGrossIncome} 
            prefix={currency === 'USD' ? 'u$s' : '$'} 
            step={currency === 'USD' ? 500 : 100000} 
          />

          {currency === 'USD' && (
            <FinancialInput 
              label="Tipo de Cambio MEP/Financiero" 
              value={exchangeRate} 
              onChange={setExchangeRate} 
              prefix="$" 
              step={10} 
            />
          )}

          <div className="input-group">
            <label className="input-label">Tipo de Actividad</label>
            <select 
              className="input-field" 
              value={activity} 
              onChange={e => setActivity(e.target.value)}
              style={{ appearance: 'auto' }}
            >
              <option value="services">Prestación de Servicios</option>
              <option value="goods">Venta de Cosas Muebles (Bienes)</option>
            </select>
          </div>

          <FinancialInput 
            label="Alícuota Ingresos Brutos (IIBB)" 
            value={iibbPercent} 
            onChange={setIibbPercent} 
            suffix="%" 
            step={0.1} 
          />

          <FinancialInput 
            label="Comisiones de Cobro / Plataforma" 
            value={platformFee} 
            onChange={setPlatformFee} 
            suffix="%" 
            step={0.5} 
          />
        </div>

        {/* Results Panel */}
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', animationDelay: '100ms' }}>
          <PrintReportHeader 
            title="Reporte de Sueldo Neto Freelancer y Monotributo"
            subtitle="Ficha de Planificación Impositiva para Freelancers"
            params={[
              { label: 'Facturación Mensual', value: currency === 'USD' ? `u$s ${grossIncome}` : formatCurrency(grossIncome) },
              { label: 'Moneda', value: currency === 'USD' ? 'Dólares (USD)' : 'Pesos (ARS)' },
              ...(currency === 'USD' ? [{ label: 'Tipo de Cambio MEP', value: formatCurrency(exchangeRate) }] : []),
              { label: 'Tipo de Actividad', value: activity === 'services' ? 'Prestación de Servicios' : 'Venta de Bienes Muebles' },
              { label: 'Alícuota Ingresos Brutos (IIBB)', value: `${iibbPercent}%` },
              { label: 'Comisión de Plataforma / Cobro', value: `${platformFee}%` }
            ]}
          />
          {/* Main Net Income Card */}
          <div className="card" style={{
            textAlign: 'center',
            borderTop: '4px solid #10b981',
            background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.05), transparent)'
          }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Ingreso Neto Mensual Estimado</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
              {formatCurrency(calculations.netIncome)}
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>
              Queda en mano el {((calculations.netIncome / calculations.grossIncomeArs) * 100 || 0).toFixed(1)}% de tu facturación.
            </p>
          </div>

          {/* Alert if exceeded Monotributo */}
          {calculations.scale.isExceeded && (
            <div className="card" style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'start',
              border: '1px solid var(--accent-warning)',
              backgroundColor: 'rgba(245, 158, 11, 0.05)'
            }}>
              <AlertTriangle className="text-accent-warning" size={24} style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  Superaste el límite del Monotributo
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  Tu facturación anual de **{formatCurrency(calculations.annualBillingArs)}** supera el tope de la Categoría K ($108.357.084,05). 
                  Se aplica la estimación impositiva correspondiente al **Régimen General (Responsable Inscripto)**.
                </p>
              </div>
            </div>
          )}

          {/* Tax breakdown details */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Desglose Mensual
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Ingreso Bruto (Pesos):</span>
                <strong>{formatCurrency(calculations.grossIncomeArs)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Categoría Impositiva:</span>
                <strong className={calculations.scale.isExceeded ? 'text-accent-warning' : 'text-accent-primary'}>
                  {calculations.scale.isExceeded ? 'Responsable Inscripto' : `Monotributo - Cat. ${calculations.scale.cat}`}
                </strong>
              </div>
              
              {!calculations.scale.isExceeded ? (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Cuota Unificada Monotributo:</span>
                  <strong className="text-accent-danger">{formatCurrency(calculations.nationalTaxAmount)}</strong>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '1rem' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>• Autónomos (Previsional):</span>
                    <strong className="text-accent-danger" style={{ fontSize: '0.85rem' }}>{formatCurrency(calculations.autonomosAmount)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '1rem' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>• Impuesto Ganancias (Est.):</span>
                    <strong className="text-accent-danger" style={{ fontSize: '0.85rem' }}>{formatCurrency(calculations.gananciasAmount)}</strong>
                  </div>
                </>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Ingresos Brutos (Provincial):</span>
                <strong className="text-accent-warning">{formatCurrency(calculations.iibbAmount)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Comisiones Plataforma:</span>
                <strong style={{ color: '#64748b' }}>{formatCurrency(calculations.platformFeeAmount)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', fontSize: '1rem' }}>
                <strong>Sueldo Neto:</strong>
                <strong style={{ color: '#10b981' }}>{formatCurrency(calculations.netIncome)}</strong>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap', marginTop: '-1rem' }}>
            <button 
              onClick={handleShare}
              className="btn btn-outline" 
              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            >
              <Share2 size={16} />
              {shareCopied ? '¡Copiado!' : 'Compartir Simulación'}
            </button>
            <button 
              onClick={() => window.print()}
              className="btn btn-outline" 
              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            >
              <Printer size={16} />
              Imprimir Reporte
            </button>
            <button 
              onClick={() => exportChartToPNG('net-income-chart-container', 'valia_sueldo_neto_monotributo.png')}
              className="btn btn-outline" 
              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            >
              <Image size={16} />
              Descargar Gráfico
            </button>
          </div>

          {/* Recharts PieChart */}
          <div className="card chart-container" id="net-income-chart-container" style={{ height: '320px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.05rem', alignSelf: 'flex-start' }}>Distribución de tu Facturación</h3>
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={calculations.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {calculations.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" align="center" formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Advisor CTA */}
          <AdvisorCTA 
            title="¿Querés optimizar tus impuestos?"
            description="Contactá a nuestro asesor en Balanz para evaluar cómo canalizar tus excedentes de facturación de manera fiscalmente eficiente y armar tu portafolio."
            whatsappText={`Hola! Estuve calculando mis ingresos netos en Valia y quiero asesoramiento financiero sobre cómo invertir mi facturación mensual de ${formatCurrency(calculations.netIncome)}.`}
          />
          <PrintAdvisorCTA />
        </div>
      </div>

      {/* Guía SEO y Contexto Financiero */}
      <section className="card animate-fade-in" style={{ marginTop: '3rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', animationDelay: '200ms' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          Guía Impositiva: Monotributo vs. Responsable Inscripto en Argentina
        </h2>
        <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          Para profesionales independientes, freelancers y prestadores de servicios, estructurar la carga impositiva en Argentina de manera eficiente es vital para cuidar los ingresos netos de bolsillo. Analizamos las diferencias críticas entre los dos regímenes principales y el impacto de los impuestos locales.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>El Régimen Simplificado (Monotributo)</h3>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0, color: 'var(--text-secondary)' }}>
              El Monotributo permite abonar una cuota fija mensual que unifica el IVA, Ganancias, jubilación y obra social. Las categorías se determinan por la facturación bruta de los últimos 12 meses. Es el régimen más eficiente y económico, pero tiene un límite máximo de facturación anual regulado por la AFIP/ARCA, por encima del cual quedás excluido automáticamente.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Régimen General (Responsable Inscripto)</h3>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0, color: 'var(--text-secondary)' }}>
              Al superar el tope de la categoría K, debés inscribirte en el Régimen General. Esto implica liquidar IVA (21%) sobre tus facturas, pagar Autónomos mensualmente y tributar el Impuesto a las Ganancias en base a escalas que llegan al 35% de tus ganancias netas. La carga impositiva y la necesidad de asesoramiento contable profesional aumentan exponencialmente.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Ingresos Brutos e Impuestos Provinciales</h3>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0, color: 'var(--text-secondary)' }}>
              Además de los impuestos nacionales controlados por ARCA, las provincias cobran Ingresos Brutos (IIBB) aplicando alícuotas que oscilan entre el 1% y el 5% sobre tu facturación bruta. Algunas provincias cuentan con el Monotributo Unificado (que integra IIBB en la misma cuota), mientras que en otras requiere declaraciones mensuales independientes.
            </p>
          </div>
        </div>
      </section>

      <FAQSection 
        faqs={[
          {
            question: "¿Cómo se calculan las categorías y topes de facturación del Monotributo en 2026?",
            answer: "Las escalas de facturación máxima anual y las cuotas mensuales del Monotributo se actualizan semestralmente según el IPC. El cálculo de tu categoría debe basarse en la facturación bruta devengada (emitida) de los últimos 12 meses, independientemente de cuándo se haya cobrado efectivamente."
          },
          {
            question: "¿Qué deducciones y gastos debo considerar para saber mi sueldo neto real?",
            answer: "Para conocer tus ingresos limpios en mano debes restar de tu facturación bruta: (1) la cuota mensual unificada del Monotributo, (2) la alícuota de Ingresos Brutos (que suele rondar entre el 1.5% y 4% según la jurisdicción, salvo que apliques al Monotributo Unificado exento), y (3) los costos de las plataformas de cobro internacionales o locales."
          },
          {
            question: "¿Qué es la exportación de servicios y el cupo de USD 24.000 anuales?",
            answer: "Los freelancers argentinos que exporten servicios pueden ingresar hasta USD 24.000 anuales a su cuenta bancaria local en dólares sin la obligación de pesificarlos al tipo de cambio oficial del BCRA, siempre que emitan factura 'E' y liquiden la orden dentro de los 5 días hábiles del cobro."
          },
          {
            question: "¿Cómo impactan las comisiones de retiro en el sueldo neto?",
            answer: "Si cobras a través de plataformas del exterior (como Wise, Payoneer o Deel), cada paso de intermediación de fondos suele cobrar comisiones de retiro (entre el 1% y 3%) o costos fijos de transferencia ACH/Wire. Modelar correctamente estas pérdidas es vital antes de calcular tus honorarios por hora."
          }
        ]}
      />

      <HelpModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)}
        title="¿Cómo funciona el Monotributo y Régimen General en Argentina?"
      >
        <p>
          El **Monotributo** es un régimen simplificado para pequeños contribuyentes de Argentina que unifica el componente impositivo, previsional (jubilación) y obra social en una sola cuota fija mensual.
        </p>

        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>1. Parámetros de Categorías</h3>
        <p>
          Las categorías (de la A a la K) se determinan principalmente por tus ingresos brutos acumulados en los últimos 12 meses. La categoría determina el importe fijo de tu cuota mensual. Si prestás servicios, tu tope máximo es la categoría K.
        </p>

        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>2. Exceder el Monotributo: Responsable Inscripto</h3>
        <p>
          Si tu facturación anual en pesos supera el límite máximo de la Categoría K ($108.357.084,05), quedás excluido del Monotributo y debés inscribirte en el **Régimen General (Responsable Inscripto)**. 
          Bajo este régimen, debés pagar Autónomos de forma mensual y liquidar periódicamente el Impuesto a las Ganancias y el IVA, incrementando significativamente la carga impositiva y la complejidad contable.
        </p>

        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>3. Ingresos Brutos (IIBB)</h3>
        <p>
          Es un impuesto de carácter provincial que grava los ingresos brutos de la actividad. En algunas jurisdicciones está unificado dentro de la cuota del Monotributo nacional (Monotributo Unificado), mientras que en otras se paga de forma separada aplicando una alícuota porcentual directa sobre lo facturado.
        </p>
      </HelpModal>
    </div>
  );
};

// HelpModal component is now imported from ../../components/HelpModal

export default SueldoNetoCalculator;
