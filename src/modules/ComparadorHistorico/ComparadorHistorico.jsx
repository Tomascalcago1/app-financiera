import React, { useState, useMemo } from 'react';
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
import { 
  LineChart as ChartIcon, 
  HelpCircle, 
  Download, 
  Printer, 
  TrendingUp, 
  TrendingDown, 
  TableProperties,
  Image,
  Share2 
} from 'lucide-react';
import { exportChartToPNG } from '../../utils/chartExporter';
import FinancialInput from '../../components/FinancialInput';
import AdvisorCTA from '../../components/AdvisorCTA';
import HelpModal from '../../components/HelpModal';
import PrintReportHeader from '../../components/PrintReportHeader';
import PrintAdvisorCTA from '../../components/PrintAdvisorCTA';

const formatCurrency = (val) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(val);
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="taste-card" style={{ padding: '0.85rem 1.1rem', border: '1px solid var(--border-color)', minWidth: '220px' }}>
        <p style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{label}</p>
        {payload.map((entry, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', gap: '0.5rem' }}>
            <span style={{ color: entry.color, fontSize: '0.825rem' }}>{entry.name}:</span>
            <strong className="tabular-nums" style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>{formatCurrency(entry.value)}</strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const historicalReturns = [
  { year: 2015, dolarBlue: 5.0, plazoFijo: 22.5, merval: 37.3, inflacion: 26.9 },
  { year: 2016, dolarBlue: 16.2, plazoFijo: 28.0, merval: 44.9, inflacion: 40.3 },
  { year: 2017, dolarBlue: 14.6, plazoFijo: 20.0, merval: 77.7, inflacion: 24.8 },
  { year: 2018, dolarBlue: 103.9, plazoFijo: 34.0, merval: 0.75, inflacion: 47.6 },
  { year: 2019, dolarBlue: 90.9, plazoFijo: 49.0, merval: 37.6, inflacion: 53.8 },
  { year: 2020, dolarBlue: 117.7, plazoFijo: 31.0, merval: 22.9, inflacion: 36.1 },
  { year: 2021, dolarBlue: 27.5, plazoFijo: 37.0, merval: 63.0, inflacion: 50.9 },
  { year: 2022, dolarBlue: 67.6, plazoFijo: 65.0, merval: 142.0, inflacion: 94.8 },
  { year: 2023, dolarBlue: 185.1, plazoFijo: 125.0, merval: 360.0, inflacion: 211.4 },
  { year: 2024, dolarBlue: 22.6, plazoFijo: 80.0, merval: 129.0, inflacion: 117.8 },
  { year: 2025, dolarBlue: 26.4, plazoFijo: 35.0, merval: 62.0, inflacion: 31.5 }
];

const ComparadorHistorico = () => {
  const [initialCapital, setInitialCapital] = useState(1000000); // 1 millón de pesos por defecto
  const [monthlyContribution, setMonthlyContribution] = useState(50000); // 50 mil pesos por mes
  const [period, setPeriod] = useState('full'); // '3yr' | '5yr' | 'full'
  const [showTable, setShowTable] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleShare = () => {
    const params = new URLSearchParams();
    params.set('tool', 'comparador-historico');
    if (initialCapital) params.set('initial', initialCapital);
    if (monthlyContribution) params.set('monthly', monthlyContribution);
    if (period) params.set('period', period);

    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    return navigator.clipboard.writeText(shareUrl);
  };

  const simulation = useMemo(() => {
    let startYear = 2015;
    if (period === '3yr') startYear = 2023;
    else if (period === '5yr') startYear = 2021;

    const activeYears = historicalReturns.filter(h => h.year >= startYear);

    // Initial state for each asset
    let capDolar = initialCapital;
    let capPlazoFijo = initialCapital;
    let capMerval = initialCapital;
    let capInflation = initialCapital;

    let totalInvested = initialCapital;
    const chartData = [];
    const yearlySummaries = [];

    // Push initial year 0 state
    chartData.push({
      yearLabel: `${startYear} (Inicio)`,
      dolar: Math.round(capDolar),
      plazoFijo: Math.round(capPlazoFijo),
      merval: Math.round(capMerval),
      baseInflacion: Math.round(capInflation),
      totalInvested
    });

    for (const yrData of activeYears) {
      // Get monthly rates
      const rDolar = Math.pow(1 + (yrData.dolarBlue / 100), 1 / 12) - 1;
      const rPF = Math.pow(1 + (yrData.plazoFijo / 100), 1 / 12) - 1;
      const rMerval = Math.pow(1 + (yrData.merval / 100), 1 / 12) - 1;
      const rInf = Math.pow(1 + (yrData.inflacion / 100), 1 / 12) - 1;

      // Simulate 12 months
      for (let m = 1; m <= 12; m++) {
        // Add monthly contribution at the start of the month
        capDolar += monthlyContribution;
        capPlazoFijo += monthlyContribution;
        capMerval += monthlyContribution;
        capInflation += monthlyContribution;

        totalInvested += monthlyContribution;

        // Apply monthly return
        capDolar *= (1 + rDolar);
        capPlazoFijo *= (1 + rPF);
        capMerval *= (1 + rMerval);
        capInflation *= (1 + rInf);
      }

      chartData.push({
        yearLabel: yrData.year.toString(),
        dolar: Math.round(capDolar),
        plazoFijo: Math.round(capPlazoFijo),
        merval: Math.round(capMerval),
        baseInflacion: Math.round(capInflation),
        totalInvested
      });

      yearlySummaries.push({
        year: yrData.year,
        dolar: Math.round(capDolar),
        plazoFijo: Math.round(capPlazoFijo),
        merval: Math.round(capMerval),
        baseInflacion: Math.round(capInflation),
        totalInvested
      });
    }

    const finalValues = [
      { name: 'Merval (Acciones)', val: Math.round(capMerval), color: 'var(--accent-primary)' },
      { name: 'Dólar Blue', val: Math.round(capDolar), color: '#38bdf8' },
      { name: 'Plazo Fijo', val: Math.round(capPlazoFijo), color: '#e11d48' },
      { name: 'Ajuste Inflación (IPC)', val: Math.round(capInflation), color: '#10b981' }
    ];

    finalValues.sort((a, b) => b.val - a.val);

    return {
      chartData,
      yearlySummaries,
      totalInvested,
      finalDolar: Math.round(capDolar),
      finalPlazoFijo: Math.round(capPlazoFijo),
      finalMerval: Math.round(capMerval),
      finalInflation: Math.round(capInflation),
      finalValues
    };
  }, [initialCapital, monthlyContribution, period]);

  const exportToCSV = () => {
    if (!simulation) return;
    const headers = ['Año', 'Dólar Blue ($)', 'Plazo Fijo ($)', 'Merval ($)', 'Línea de Inflación ($)', 'Total Invertido ($)'];
    const rows = simulation.chartData.map(row => [
      row.yearLabel,
      row.dolar,
      row.plazoFijo,
      row.merval,
      row.baseInflacion,
      row.totalInvested
    ]);
    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `valia_comparativa_historica_${period}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <header className="calculator-header">
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <ChartIcon size={32} className="text-accent-primary" />
          Dólar vs Plazo Fijo vs Merval
        </h1>
        <p>Compará el rendimiento histórico real de tu dinero en Argentina frente a la inflación (2015-2025).</p>
        <button onClick={() => setIsHelpOpen(true)} className="help-btn">
          <HelpCircle size={18} className="text-accent-primary" />
          ¿Por qué comparar con la inflación?
        </button>
      </header>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '2rem', alignItems: 'start' }}>
        {/* Inputs Panel */}
        <div className="taste-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '0.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Tu Simulación Histórica
          </h2>

          <FinancialInput 
            label="Inversión Inicial" 
            value={initialCapital} 
            onChange={setInitialCapital} 
            prefix="$" 
            step={100000} 
          />

          <FinancialInput 
            label="Aporte Mensual" 
            value={monthlyContribution} 
            onChange={setMonthlyContribution} 
            prefix="$" 
            step={10000} 
          />

          <div className="input-group">
            <label className="input-label">Período de Comparación</label>
            <select 
              className="input-field" 
              value={period} 
              onChange={e => setPeriod(e.target.value)}
              style={{ appearance: 'auto' }}
            >
              <option value="3yr">Últimos 3 años (2023 - 2025)</option>
              <option value="5yr">Últimos 5 años (2021 - 2025)</option>
              <option value="full">Período Completo (2015 - 2025)</option>
            </select>
          </div>
        </div>

        {/* Results Panel */}
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', animationDelay: '100ms' }}>
          <PrintReportHeader 
            title="Reporte de Simulación: Dólar vs Plazo Fijo vs Merval"
            subtitle="Comparador Histórico de Activos Financieros (Argentina)"
            params={[
              { label: 'Capital Inicial', value: formatCurrency(initialCapital) },
              { label: 'Aporte Mensual', value: formatCurrency(monthlyContribution) },
              { label: 'Período de Comparación', value: period === '3yr' ? 'Últimos 3 años (2023 - 2025)' : period === '5yr' ? 'Últimos 5 años (2021 - 2025)' : 'Período Completo (2015 - 2025)' },
              { label: 'Nota de Datos', value: 'Simulación con retornos reales históricos mensuales.' }
            ]}
          />
          {/* Winner banner */}
          <div className="taste-card" style={{
            textAlign: 'center',
            borderTop: `4px solid ${simulation.finalValues[0].color}`,
            background: `linear-gradient(180deg, ${simulation.finalValues[0].color}15, var(--bg-secondary))`,
            padding: '2rem 1.5rem',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
          }}>
            <p style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>Mayor Retorno Histórico</p>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
              {simulation.finalValues[0].name}
            </p>
            <p className="tabular-nums" style={{ fontSize: '2rem', fontWeight: 800, color: simulation.finalValues[0].color, margin: '0.25rem 0 0 0' }}>
              {formatCurrency(simulation.finalValues[0].val)}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.65rem', marginBottom: 0 }}>
              Aportado Neto: <strong className="tabular-nums">{formatCurrency(simulation.totalInvested)}</strong>
            </p>
          </div>

          {/* Ranking Stats */}
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.25rem' }}>
            {simulation.finalValues.map((asset, index) => {
              const beatsInflation = asset.val >= simulation.finalInflation;
              const returnColor = asset.name === 'Ajuste Inflación (IPC)' 
                ? 'var(--text-primary)' 
                : beatsInflation ? 'var(--accent-success)' : 'var(--accent-danger)';

              return (
                <div key={asset.name} className="taste-card" style={{ textAlign: 'center', padding: '1.25rem 0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.25rem' }}>
                    #{index + 1} {asset.name}
                  </span>
                  <p className="tabular-nums" style={{ fontSize: '1.25rem', fontWeight: 800, color: returnColor, margin: '0.25rem 0' }}>
                    {formatCurrency(asset.val)}
                  </p>
                  {asset.name !== 'Ajuste Inflación (IPC)' && (
                    <span style={{ fontSize: '0.7rem', color: returnColor, fontWeight: 600 }}>
                      {beatsInflation ? '✓ Superó inflación' : '✗ Perdió vs inflación'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Toolbar: Views Switch and Export Actions */}
          <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            {/* Tab Switcher */}
            <div style={{ display: 'inline-flex', background: 'var(--bg-tertiary)', padding: '0.25rem', borderRadius: '999px', border: '1px solid var(--border-color)' }}>
              <button
                type="button"
                className={`btn transition-spring ${!showTable ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '0.35rem 1rem', fontSize: '0.8rem', borderRadius: '999px', border: 'none' }}
                onClick={() => setShowTable(false)}
              >
                <TrendingUp size={14} />
                Gráfico
              </button>
              <button
                type="button"
                className={`btn transition-spring ${showTable ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '0.35rem 1rem', fontSize: '0.8rem', borderRadius: '999px', border: 'none' }}
                onClick={() => setShowTable(true)}
              >
                <TableProperties size={14} />
                Tabla Detallada
              </button>
            </div>

            {/* Export Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button 
                onClick={handleShare}
                className="btn btn-outline transition-spring" 
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', borderColor: shareCopied ? 'var(--accent-success)' : 'var(--border-color)' }}
              >
                <Share2 size={14} className={shareCopied ? "text-accent-success" : ""} />
                {shareCopied ? '¡Copiado!' : 'Compartir'}
              </button>
              
              <button 
                onClick={exportToCSV}
                className="btn btn-outline transition-spring" 
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
              >
                <Download size={14} />
                CSV
              </button>

              <button 
                onClick={() => window.print()}
                className="btn btn-outline transition-spring" 
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
              >
                <Printer size={14} />
                PDF
              </button>

              <button 
                onClick={() => exportChartToPNG('history-chart-container', 'valia_comparacion_historica.png')}
                className="btn btn-outline transition-spring" 
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
              >
                <Image size={14} />
                PNG
              </button>
            </div>
          </div>

          {/* Chart or Table View */}
          {!showTable ? (
            <div className="taste-card chart-container" id="history-chart-container" style={{ padding: '1.5rem', height: '380px' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: 700 }}>Progresión Histórica del Capital</h3>
              <ResponsiveContainer width="100%" height="80%">
                <LineChart data={simulation.chartData} margin={{ top: 15, right: 20, left: 10, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="yearLabel" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
                  <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} tickFormatter={(v) => `$${(v / 1e6).toFixed(1)}M`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px' }} />
                  <Line type="monotone" dataKey="merval" name="Merval (Acciones)" stroke="var(--accent-primary)" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="dolar" name="Dólar Blue" stroke="#38bdf8" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="plazoFijo" name="Plazo Fijo" stroke="#e11d48" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="baseInflacion" name="Línea de Inflación (IPC)" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="taste-card animate-fade-in" style={{ overflowX: 'auto', padding: 0 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Año</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Merval</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Dólar Blue</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Plazo Fijo</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Inflación (IPC)</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Invertido Neto</th>
                  </tr>
                </thead>
                <tbody>
                  {simulation.yearlySummaries.map((row) => (
                    <tr key={row.year} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.6rem 1rem', textAlign: 'center', fontWeight: '500' }}>{row.year}</td>
                      <td className="tabular-nums" style={{ padding: '0.6rem 1rem', color: 'var(--accent-primary)', fontWeight: 600 }}>{formatCurrency(row.merval)}</td>
                      <td className="tabular-nums" style={{ padding: '0.6rem 1rem', color: '#38bdf8' }}>{formatCurrency(row.dolar)}</td>
                      <td className="tabular-nums" style={{ padding: '0.6rem 1rem', color: '#e11d48' }}>{formatCurrency(row.plazoFijo)}</td>
                      <td className="tabular-nums" style={{ padding: '0.6rem 1rem', color: '#10b981' }}>{formatCurrency(row.baseInflacion)}</td>
                      <td className="tabular-nums" style={{ padding: '0.6rem 1rem', fontWeight: 'bold' }}>{formatCurrency(row.totalInvested)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Advisor CTA */}
          <AdvisorCTA 
            title="¿Querés ganarle a la inflación?"
            description="Contactá a nuestro asesor en Balanz para diseñar una estrategia de inversión diversificada en FCI, CEDEARs y Obligaciones Negociables."
            whatsappText="Hola! Estuve usando el Comparador Histórico en Valia y quiero asesoramiento para diversificar mis ahorros en fondos comunes de inversión, acciones y CEDEARs con Balanz."
          />
          <PrintAdvisorCTA />
        </div>
      </div>

      {/* Guía SEO y Contexto Financiero */}
      <section className="taste-card faq-section no-print animate-fade-in" style={{ marginTop: '3rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', animationDelay: '200ms' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          Guía de Rendimientos: ¿Dólar, Plazo Fijo o Merval para ganarle a la inflación?
        </h2>
        <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          En mercados altamente volátiles e inflacionarios como el de Argentina, la preservación del valor patrimonial es un desafío constante. Para tomar decisiones financieras acertadas, nuestra herramienta compara la evolución histórica real de tres alternativas populares frente al Índice de Precios al Consumidor (IPC).
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Dólar Blue: Cobertura Cambiaria vs. Inflación</h3>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0, color: 'var(--text-secondary)' }}>
              El dólar es el activo de resguardo por excelencia en Argentina ante la devaluación del peso. Sin embargo, no está exento de pérdidas: el dólar sufre inflación propia (pérdida de valor del USD) y atraviesa ciclos de retraso cambiario local donde los precios en pesos suben a mayor velocidad que el tipo de cambio, encareciendo el costo de vida medido en moneda extranjera.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Plazo Fijo: La Trampa de la Tasa Nominal</h3>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0, color: 'var(--text-secondary)' }}>
              El plazo fijo tradicional ofrece previsibilidad y renta mensual fija. No obstante, en la gran mayoría de los años analizados, las tasas nominales del banco corren por detrás de la inflación real. Esto genera una licuación sistemática de los depósitos, lo que reduce el poder de compra real del capital inicial a mediano plazo.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Índice Merval: Activos Reales y Crecimiento</h3>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0, color: 'var(--text-secondary)' }}>
              El Merval representa el rendimiento de las principales empresas cotizantes de Argentina. Al tratarse de activos reales (empresas que venden productos, exportan y ajustan sus precios por inflación), la renta variable tiende a superar ampliamente a la devaluación y la inflación a largo plazo, asumiendo una mayor volatilidad y riesgo diario.
            </p>
          </div>
        </div>
      </section>

      <HelpModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)}
        title="¿Por qué es clave comparar las inversiones contra la inflación?"
      >
        <p>
          En economías con alta inflación como la de Argentina, el rendimiento **nominal** (los pesos extras que ganás) no refleja la realidad. Lo que importa es el rendimiento **real** (tu ganancia de poder adquisitivo).
        </p>

        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>1. La Línea de Inflación (IPC)</h3>
        <p>
          Esta línea representa el "empate". Muestra cuántos pesos nominales necesitás tener acumulados hoy para poder comprar exactamente lo mismo que comprabas con tu inversión inicial y aportes en su momento. 
          Cualquier activo que termine **debajo** de esta línea te hizo perder poder de compra, aunque nominalmente veas "más pesos".
        </p>

        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>2. Dólar vs Plazo Fijo vs Acciones (Merval)</h3>
        <p>
          - **Merval (Acciones):** Históricamente, en el largo plazo, las empresas cotizadas en bolsa son las que mejor capturan las subas de precios y devaluaciones, actuando como una excelente cobertura real, aunque con alta volatilidad en el corto plazo.
          - **Dólar Blue:** Si bien protege contra el colapso del peso, el dólar también sufre inflación (en USD) y su cotización en pesos atraviesa períodos de "atraso cambiario" donde pierde poder adquisitivo local temporalmente.
          - **Plazo Fijo:** Al pagar una tasa fija preestablecida, suele correr por detrás de los picos inflacionarios sorpresivos, licuando el valor real de los depósitos en la mayoría de los años analizados.
        </p>
      </HelpModal>
    </div>
  );
};

// HelpModal component is now imported from ../../components/HelpModal

export default ComparadorHistorico;
