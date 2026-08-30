import React, { useState, useMemo } from 'react';
import { 
  Home, 
  Settings2, 
  HelpCircle, 
  TrendingUp, 
  TrendingDown, 
  Info,
  Download,
  Printer,
  TableProperties,
  Share2,
  Image
} from 'lucide-react';
import { exportChartToPNG } from '../../utils/chartExporter';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
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

const formatUva = (val) => {
  return new Intl.NumberFormat('es-AR', {
    maximumFractionDigits: 0
  }).format(val);
};

const HipotecarioUvaCalculator = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const getNumericParam = (key, fallback) => {
    const val = queryParams.get(key);
    return val !== null && !isNaN(val) ? Number(val) : fallback;
  };
  const getStringParam = (key, fallback) => {
    const val = queryParams.get(key);
    return val !== null ? val : fallback;
  };

  const [loanAmount, setLoanAmount] = useState(() => getNumericParam('loan', 40000000)); // 40 millones de pesos por defecto
  const [years, setYears] = useState(() => getNumericParam('yrs', 20));
  const [interestRate, setInterestRate] = useState(() => getNumericParam('rate', 5.5)); // UVA + 5.5%
  const [inflationRate, setInflationRate] = useState(() => getNumericParam('infl', 40)); // 40% inflación anual
  const [amortizationSystem, setAmortizationSystem] = useState(() => getStringParam('sys', 'french')); // 'french' | 'german'
  const [showTable, setShowTable] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const handleShare = () => {
    const params = new URLSearchParams();
    params.set('tool', 'hipotecario-uva');
    params.set('loan', loanAmount);
    params.set('yrs', years);
    params.set('rate', interestRate);
    params.set('infl', inflationRate);
    params.set('sys', amortizationSystem);

    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      })
      .catch(err => console.error('Error al copiar el enlace: ', err));
  };

  const UVA_INITIAL_VALUE = 1350; // Valor del UVA al inicio de la simulación

  const simulation = useMemo(() => {
    if (!loanAmount || !years || !interestRate || years <= 0) return null;

    const principalUva = loanAmount / UVA_INITIAL_VALUE;
    const months = years * 12;
    const monthlyInterest = (interestRate / 100) / 12;
    const monthlyInflation = Math.pow(1 + (inflationRate / 100), 1 / 12) - 1;

    let balanceUva = principalUva;
    const schedule = [];
    let totalPaidPesosNominal = 0;
    let totalPaidUva = 0;

    // French System Monthly Payment Formula (Constant UVA Payment)
    const constantPaymentUva = monthlyInterest > 0 
      ? (principalUva * monthlyInterest * Math.pow(1 + monthlyInterest, months)) / (Math.pow(1 + monthlyInterest, months) - 1)
      : principalUva / months;

    for (let m = 1; m <= months; m++) {
      let interestUva = balanceUva * monthlyInterest;
      let principalAmortizedUva = 0;
      let paymentUva = 0;

      if (amortizationSystem === 'french') {
        paymentUva = constantPaymentUva;
        principalAmortizedUva = paymentUva - interestUva;
      } else {
        // German System (Constant Capital Amortization)
        principalAmortizedUva = principalUva / months;
        paymentUva = principalAmortizedUva + interestUva;
      }

      // Safeguard against last month rounding
      if (m === months) {
        principalAmortizedUva = balanceUva;
        paymentUva = principalAmortizedUva + interestUva;
      }

      balanceUva = Math.max(0, balanceUva - principalAmortizedUva);

      // Project UVA value inflation
      const uvaValue = UVA_INITIAL_VALUE * Math.pow(1 + monthlyInflation, m);
      const paymentPesosNominal = paymentUva * uvaValue;
      const paymentPesosReal = paymentUva * UVA_INITIAL_VALUE; // Adjusted back to initial purchasing power

      totalPaidPesosNominal += paymentPesosNominal;
      totalPaidUva += paymentUva;

      schedule.push({
        month: m,
        year: Math.ceil(m / 12),
        paymentUva,
        interestUva,
        principalAmortizedUva,
        balanceUva,
        uvaValue,
        paymentPesosNominal,
        paymentPesosReal
      });
    }

    // Aggregate yearly data for chart & summary table to avoid cluttering Recharts with 360 points
    const yearlyData = [];
    for (let y = 1; y <= years; y++) {
      const yearSchedule = schedule.filter(s => s.year === y);
      const endOfYear = yearSchedule[yearSchedule.length - 1];
      const sumPaymentNominal = yearSchedule.reduce((sum, s) => sum + s.paymentPesosNominal, 0);
      const avgPaymentNominal = sumPaymentNominal / yearSchedule.length;
      const sumPaymentReal = yearSchedule.reduce((sum, s) => sum + s.paymentPesosReal, 0);
      const avgPaymentReal = sumPaymentReal / yearSchedule.length;

      yearlyData.push({
        year: y,
        cuotaPromedioPesosNominal: Math.round(avgPaymentNominal),
        cuotaPromedioPesosReal: Math.round(avgPaymentReal),
        saldoUva: endOfYear.balanceUva,
        saldoPesosNominal: endOfYear.balanceUva * endOfYear.uvaValue
      });
    }

    return {
      principalUva,
      schedule,
      yearlyData,
      totalPaidPesosNominal: Math.round(totalPaidPesosNominal),
      totalPaidPesosReal: Math.round(totalPaidUva * UVA_INITIAL_VALUE),
      totalInterestUva: totalPaidUva - principalUva,
      initialMonthlyPayment: schedule[0].paymentPesosNominal
    };
  }, [loanAmount, years, interestRate, inflationRate, amortizationSystem]);

  const exportToCSV = () => {
    if (!simulation) return;
    const headers = ['Año', 'Cuota Promedio Pesos Nominal', 'Cuota Promedio Pesos Real (Poder de Compra Inicial)', 'Saldo Restante UVA', 'Saldo Restante Pesos Nominal'];
    const rows = simulation.yearlyData.map(row => [
      row.year,
      row.cuotaPromedioPesosNominal,
      row.cuotaPromedioPesosReal,
      Math.round(row.saldoUva),
      Math.round(row.saldoPesosNominal)
    ]);
    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `valia_hipotecario_uva_${years}_anos.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="card" style={{ padding: '1rem', border: '1px solid var(--border-color)', minWidth: '220px' }}>
          <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Año {label}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#38bdf8' }}>Cuota Nominal (Con Inflación):</span>
            <strong style={{ fontSize: '0.85rem' }}>{formatCurrency(payload[0].value)}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#10b981' }}>Cuota Real (En Pesos de Hoy):</span>
            <strong style={{ fontSize: '0.85rem' }}>{formatCurrency(payload[1].value)}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginTop: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.25rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Saldo Restante:</span>
            <strong style={{ fontSize: '0.8rem' }}>{formatCurrency(payload[0].payload.saldoPesosNominal)}</strong>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <header className="calculator-header">
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Home size={32} className="text-accent-primary" />
          Créditos Hipotecarios UVA
        </h1>
        <p>Simulá cuotas y amortización en Pesos e indexación UVA (Unidad de Valor Adquisitivo).</p>
        <button onClick={() => setIsHelpOpen(true)} className="help-btn">
          <HelpCircle size={18} className="text-accent-primary" />
          ¿Cómo funcionan los créditos UVA?
        </button>
      </header>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '2rem', alignItems: 'start' }}>
        {/* Input panel */}
        <div className="taste-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '0.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Datos del Préstamo
          </h2>

          {/* Quick Presets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Montos y Plazos Típicos:
            </span>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                className="btn btn-outline transition-spring"
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', borderRadius: '999px' }}
                onClick={() => {
                  setLoanAmount(30000000);
                  setYears(20);
                  setInterestRate(5.5);
                  setInflationRate(35);
                  setAmortizationSystem('french');
                }}
              >
                🏠 $30M a 20a
              </button>
              <button 
                type="button" 
                className="btn btn-outline transition-spring"
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', borderRadius: '999px' }}
                onClick={() => {
                  setLoanAmount(60000000);
                  setYears(20);
                  setInterestRate(6.0);
                  setInflationRate(35);
                  setAmortizationSystem('french');
                }}
              >
                🏙️ $60M a 20a
              </button>
              <button 
                type="button" 
                className="btn btn-outline transition-spring"
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', borderRadius: '999px' }}
                onClick={() => {
                  setLoanAmount(100000000);
                  setYears(30);
                  setInterestRate(5.0);
                  setInflationRate(30);
                  setAmortizationSystem('french');
                }}
              >
                🏡 $100M a 30a
              </button>
            </div>
          </div>
          
          <FinancialInput 
            label="Monto Solicitado" 
            value={loanAmount} 
            onChange={setLoanAmount} 
            prefix="$" 
            step={1000000} 
          />
          
          <FinancialInput 
            label="Plazo de Pago" 
            value={years} 
            onChange={setYears} 
            suffix="años" 
            min={5} 
            max={30} 
          />

          <FinancialInput 
            label="Tasa Nominal Anual Fija (UVA + %)" 
            value={interestRate} 
            onChange={setInterestRate} 
            suffix="%" 
            step={0.1} 
          />

          <FinancialInput 
            label="Inflación Anual Estimada" 
            value={inflationRate} 
            onChange={setInflationRate} 
            suffix="%" 
            step={1} 
          />

          <div className="input-group">
            <label className="input-label">Sistema de Amortización</label>
            <select 
              className="input-field" 
              value={amortizationSystem} 
              onChange={e => setAmortizationSystem(e.target.value)}
              style={{ appearance: 'auto' }}
            >
              <option value="french">Sistema Francés (Cuota UVA Constante)</option>
              <option value="german">Sistema Alemán (Amortización UVA Constante)</option>
            </select>
          </div>
        </div>

        {/* Results Panel */}
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', animationDelay: '100ms' }}>
          {!simulation ? (
            <div className="taste-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: 'var(--text-secondary)' }}>
              Completá los campos del simulador para calcular el préstamo.
            </div>
          ) : (
            <>
              <PrintReportHeader 
                title="Reporte de Simulación: Crédito Hipotecario UVA vs Tasa Fija"
                subtitle="Ficha de Planificación de Crédito Hipotecario"
                params={[
                  { label: 'Valor del Préstamo', value: formatCurrency(loanAmount) },
                  { label: 'Plazo del Crédito', value: `${years} años` },
                  { label: 'Tasa de Interés del Banco (TNA)', value: `${interestRate}%` },
                  { label: 'Inflación Anual Proyectada', value: `${inflationRate}%` },
                  { label: 'Sistema de Amortización', value: amortizationSystem === 'french' ? 'Francés (Cuota UVA constante)' : 'Alemán (Amortización UVA constante)' }
                ]}
              />
              {/* Summary Cards */}
              <div className="taste-card" style={{
                textAlign: 'center',
                borderTop: '4px solid var(--accent-primary)',
                background: 'linear-gradient(180deg, rgba(6, 182, 212, 0.08), var(--bg-secondary))',
                padding: '2rem 1.5rem',
                boxShadow: '0 8px 24px rgba(6, 182, 212, 0.08)'
              }}>
                <p style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>Primera Cuota Proyectada</p>
                <p className="tabular-nums" style={{ fontSize: '2.75rem', fontWeight: 800, color: 'var(--accent-primary)', lineHeight: 1.1, letterSpacing: '-0.03em', margin: '0.25rem 0' }}>
                  {formatCurrency(simulation.initialMonthlyPayment)}
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.65rem', marginBottom: 0 }}>
                  Equivalente a <strong className="tabular-nums">{formatUva(simulation.principalUva / (years * 12))}</strong> UVAs iniciales.
                </p>
              </div>

              <div className="stats-grid">
                <div className="card" style={{ textAlign: 'center' }}>
                  <TrendingDown size={20} className="text-accent-primary" style={{ marginBottom: '0.5rem' }} />
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Monto Solicitado</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>{formatCurrency(loanAmount)}</p>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                  <TrendingUp size={20} style={{ color: 'var(--accent-success)', marginBottom: '0.5rem' }} />
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total Pagado en UVA (Val. Hoy)</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-success)' }}>
                    {formatCurrency(simulation.totalPaidPesosReal)}
                  </p>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                  <TrendingUp size={20} style={{ color: 'var(--accent-warning)', marginBottom: '0.5rem' }} />
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total Nominal (Con Inflación)</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-warning)' }}>
                    {formatCurrency(simulation.totalPaidPesosNominal)}
                  </p>
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
                  onClick={exportToCSV}
                  className="btn btn-outline" 
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                  <Download size={16} />
                  Exportar CSV (Excel)
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
                  onClick={() => exportChartToPNG('uva-chart-container', 'valia_credito_hipotecario_uva.png')}
                  className="btn btn-outline" 
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                  <Image size={16} />
                  Descargar Gráfico
                </button>
              </div>

              {/* Chart */}
              <div className="card chart-container" id="uva-chart-container">
                <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>Evolución de la Cuota Mensual Proyectada</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={simulation.yearlyData} margin={{ top: 15, right: 20, left: 10, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                    <XAxis dataKey="year" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} label={{ value: 'Año', position: 'bottom', fill: 'var(--text-secondary)', offset: 10 }} />
                    <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} tickFormatter={(v) => `$${(v / 1e3).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px' }} />
                    <Line type="monotone" dataKey="cuotaPromedioPesosNominal" name="Cuota Proyectada (Pesos Nominales)" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="cuotaPromedioPesosReal" name="Cuota Ajustada (Poder Compra Constante)" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Table toggle */}
              <button className="btn btn-outline" onClick={() => setShowTable(!showTable)} style={{ alignSelf: 'flex-start' }}>
                <TableProperties size={18} />
                {showTable ? 'Ocultar Tabla' : 'Ver Tabla de Amortización Anual'}
              </button>

              {showTable && (
                <div className="card animate-fade-in" style={{ overflowX: 'auto', padding: 0 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                        <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Año</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Cuota Nominal (Prom.)</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Cuota Real (Prom.)</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Saldo Restante (UVA)</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Saldo Restante (Pesos)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {simulation.yearlyData.map((row) => (
                        <tr key={row.year} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '0.6rem 1rem', textAlign: 'center', fontWeight: '500' }}>{row.year}</td>
                          <td style={{ padding: '0.6rem 1rem', color: '#38bdf8' }}>{formatCurrency(row.cuotaPromedioPesosNominal)}</td>
                          <td style={{ padding: '0.6rem 1rem', color: '#10b981' }}>{formatCurrency(row.cuotaPromedioPesosReal)}</td>
                          <td style={{ padding: '0.6rem 1rem' }}>{formatUva(row.saldoUva)}</td>
                          <td style={{ padding: '0.6rem 1rem', fontWeight: 'bold' }}>{formatCurrency(row.saldoPesosNominal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Advisor CTA */}
              <AdvisorCTA 
                title="¿Querés asesoramiento para calificar a un crédito UVA?"
                description="Hablá con nuestro asesor en Balanz para evaluar cómo armar tu portafolio de inversión y generar los avales necesarios para adquirir tu vivienda."
                goalContext="vivienda"
              />
              <PrintAdvisorCTA />
            </>
          )}
        </div>
      </div>

      {/* Guía SEO y Contexto Financiero */}
      <section className="card animate-fade-in" style={{ marginTop: '3rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', animationDelay: '200ms' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          Guía de Créditos Hipotecarios UVA: ¿Cómo funcionan y qué riesgos considerar en Argentina?
        </h2>
        <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          El crédito hipotecario UVA es un instrumento financiero diseñado para facilitar el acceso a la vivienda, indexando el capital prestado al costo de vida a través de la Unidad de Valor Adquisitivo (UVA), la cual se actualiza diariamente mediante el coeficiente CER (Coeficiente de Estabilización de Referencia). A continuación, analizamos los factores clave para planificar tu hipoteca de forma segura.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Efecto de la Inflación en el Saldo</h3>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0, color: 'var(--text-secondary)' }}>
              El principal factor de riesgo en los créditos UVA es que no solo aumenta la cuota mensual en pesos, sino también el saldo total de la deuda nominal. Si la inflación es elevada, tu deuda en pesos crecerá exponencialmente, por lo que es fundamental evaluar la relación cuota-ingreso a largo plazo y la velocidad de actualización de tu salario.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Francés vs Alemán: ¿Cuál Elegir?</h3>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0, color: 'var(--text-secondary)' }}>
              El sistema Francés inicia con cuotas más bajas en UVA, ideales para maximizar la capacidad de compra inicial. Sin embargo, el sistema Alemán ofrece una amortización del capital constante, reduciendo los intereses de forma más acelerada y generando una cuota en pesos que crece a menor ritmo que la inflación a medida que pasan los años.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>La Regla de la Relación Cuota-Ingreso</h3>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0, color: 'var(--text-secondary)' }}>
              Los bancos exigen que la cuota inicial no supere el 25% o 30% de tus ingresos familiares netos probados. Mantener esta relación te protege ante desfasajes temporales entre la inflación y los incrementos salariales sectoriales, evitando el sobreendeudamiento en contextos inflacionarios.
            </p>
          </div>
        </div>
      </section>

      <FAQSection 
        faqs={[
          {
            question: "¿Qué es el coeficiente UVA y cómo se ajusta?",
            answer: "La Unidad de Valor Adquisitivo (UVA) es una unidad de medida que se ajusta diariamente mediante el Coeficiente de Estabilización de Referencia (CER), el cual sigue directamente la variación mensual del Índice de Precios al Consumidor (IPC) del INDEC. Esto significa que la deuda de capital y el valor de la cuota aumentan al mismo ritmo que la inflación."
          },
          {
            question: "¿Qué diferencias hay entre el sistema de amortización Francés y el Alemán?",
            answer: "En el Sistema Francés, la cuota mensual en UVAs es constante (al principio pagás más intereses y amortizás menos capital). En el Sistema Alemán, la amortización de capital en UVAs es constante en cada mes (hace que las primeras cuotas en UVAs sean las más caras pero decrezcan con el tiempo, pagando menos intereses totales al final del crédito)."
          },
          {
            question: "¿Qué es la cláusula de tope de cuota por CVS (Coeficiente de Variación Salarial)?",
            answer: "Algunos bancos ofrecen una opción de tope en la cuota mediante el pago de una prima de seguro. Si la cuota mensual calculada en base a la inflación supera la cuota ajustada por el Coeficiente de Variación Salarial por más de un 10%, el usuario puede pedir la extensión del plazo de pago para mantener la cuota dentro del límite del presupuesto de ingresos familiar."
          },
          {
            question: "¿Cuando conviene optar por un crédito UVA frente a uno de tasa fija?",
            answer: "El crédito UVA suele tener tasas de interés iniciales muy bajas (típicamente entre 3.5% y 6.5% + UVA), lo que permite calificar con ingresos menores y acceder a montos más altos de préstamo. Sin embargo, traslada todo el riesgo inflacionario al deudor. Un crédito de tasa fija ofrece certeza absoluta de cuota en pesos, pero sus tasas iniciales son altísimas y los montos otorgados suelen ser muy bajos."
          }
        ]}
      />

      <HelpModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)}
        title="¿Cómo funcionan los créditos UVA en Argentina?"
      >
        <p>
          Los créditos **UVA (Unidad de Valor Adquisitivo)** son préstamos hipotecarios donde el capital se convierte a unidades de compra indexadas por el **coeficiente CER** (basado en la inflación oficial del INDEC).
        </p>

        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>1. La Indexación del UVA</h3>
        <p>
          Cuando tomás un crédito UVA, tu deuda no está expresada en pesos, sino en cantidad de UVAs. Cada mes debés pagar una cantidad determinada de UVAs. 
          Como el valor de la UVA se ajusta diariamente según la inflación, **el monto en pesos de la cuota sube de la mano del costo de vida**.
        </p>

        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>2. Sistema Francés vs Sistema Alemán</h3>
        <p>
          - **Sistema Francés (Amortización Variable):** Es el más común. La cuota mensual medida en UVAs es siempre la misma. En pesos, la cuota sube exactamente igual que la inflación. El interés decrece a lo largo de los años y el capital se amortiza más rápido al final.
          - **Sistema Alemán (Amortización Constante):** La porción de capital que pagás en UVA es igual todos los meses. Los intereses en UVA van bajando. Por lo tanto, la cuota en UVA va bajando mes a mes. En pesos, la cuota subirá por la inflación, pero a un ritmo menor que en el sistema Francés debido a que debés menos capital real cada mes.
        </p>

        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>3. Riesgos y Tasa de Interés</h3>
        <p>
          La tasa de interés del crédito se compone de **UVA + un porcentaje fijo** (ej: 5.5%). El mayor riesgo del crédito UVA es que las cuotas y el capital en pesos suben con la inflación. Si los salarios no acompañan la inflación en determinados años, el pago mensual puede demandar un porcentaje mayor de tus ingresos mensuales.
        </p>
      </HelpModal>
    </div>
  );
};

// HelpModal component is now imported from ../../components/HelpModal

export default HipotecarioUvaCalculator;
