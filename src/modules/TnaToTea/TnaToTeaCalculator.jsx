import React, { useState, useEffect, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend 
} from 'recharts';
import { 
  Percent, HelpCircle, Download, Printer, Share2, 
  TrendingUp, TableProperties, Coins, Scale, BookOpen
} from 'lucide-react';
import FinancialInput from '../../components/FinancialInput';
import HelpModal from '../../components/HelpModal';
import AdvisorCTA from '../../components/AdvisorCTA';
import PrintReportHeader from '../../components/PrintReportHeader';
import PrintAdvisorCTA from '../../components/PrintAdvisorCTA';

const formatCurrency = (value) => {
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}k`;
  return `$${value}`;
};

const formatPercent = (val) => `${val.toFixed(2)}%`;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="card" style={{ padding: '1rem', border: '1px solid var(--border-color)', minWidth: '180px' }}>
        <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Mes {label}</p>
        {payload.map((entry, i) => (
          <div key={i} style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.15rem' }}>
            <span style={{ color: entry.color, fontSize: '0.85rem' }}>{entry.name}:</span>
            <strong style={{ fontSize: '0.85rem' }}>
              {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(entry.value)}
            </strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const TnaToTeaCalculator = () => {
  const navigateToArticle = (articleId) => {
    const url = new URL(window.location.href);
    url.searchParams.set('seccion', 'educacion');
    url.searchParams.set('articulo', articleId);
    window.history.pushState({}, '', url.toString());
    window.dispatchEvent(new CustomEvent('change-tab', { detail: 'educacion' }));
  };

  const queryParams = new URLSearchParams(window.location.search);

  // States
  const [tna, setTna] = useState(() => {
    const q = queryParams.get('tna');
    if (q !== null && !isNaN(q)) return q;
    const saved = localStorage.getItem('valia_tt_tna');
    return saved !== null && saved !== 'undefined' ? saved : '40';
  });

  const [frequency, setFrequency] = useState(() => {
    const q = queryParams.get('freq');
    const validFreqs = ['daily', 'weekly', 'biweekly', 'monthly', 'bimonthly', 'quarterly', 'semiannually', 'annually'];
    if (q !== null && validFreqs.includes(q)) return q;
    const saved = localStorage.getItem('valia_tt_frequency');
    return saved !== null && saved !== 'undefined' && validFreqs.includes(saved) ? saved : 'monthly';
  });

  const [inflation, setInflation] = useState(() => {
    const q = queryParams.get('inf');
    if (q !== null && !isNaN(q)) return q;
    const saved = localStorage.getItem('valia_tt_inflation');
    return saved !== null && saved !== 'undefined' ? saved : '30';
  });

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('valia_tt_tna', tna);
    localStorage.setItem('valia_tt_frequency', frequency);
    localStorage.setItem('valia_tt_inflation', inflation);
  }, [tna, frequency, inflation]);

  // Frequency Mapping
  const compoundingMap = useMemo(() => ({
    daily: { label: 'Diaria (365 días)', periods: 365, labelEs: 'Diaria' },
    weekly: { label: 'Semanal (52 semanas)', periods: 52, labelEs: 'Semanal' },
    biweekly: { label: 'Quincenal (24 quincenas)', periods: 24, labelEs: 'Quincenal' },
    monthly: { label: 'Mensual (12 meses)', periods: 12, labelEs: 'Mensual' },
    bimonthly: { label: 'Bimestral (6 bimestres)', periods: 6, labelEs: 'Bimestral' },
    quarterly: { label: 'Trimestral (4 trimestres)', periods: 4, labelEs: 'Trimestral' },
    semiannually: { label: 'Semestral (2 semestres)', periods: 2, labelEs: 'Semestral' },
    annually: { label: 'Anual (1 vez al año)', periods: 1, labelEs: 'Anual' }
  }), []);

  // Calculations
  const results = useMemo(() => {
    const rTna = (Number(tna) || 0) / 100;
    const rInf = (Number(inflation) || 0) / 100;
    const n = compoundingMap[frequency].periods;

    // TEA = (1 + TNA/n)^n - 1
    const tea = Math.pow(1 + rTna / n, n) - 1;

    // TEM = (1 + TEA)^(1/12) - 1
    const tem = Math.pow(1 + tea, 1 / 12) - 1;

    // Real Return = (TEA - Inflation) / (1 + Inflation)
    const realReturn = (tea - rInf) / (1 + rInf);

    // Simulate growth of $100.000 to illustrate difference
    const principal = 100000;
    const chartData = [];
    const monthlyBreakdown = [];

    // Monthly rates for simulation
    const monthlyRateSimple = rTna / 12;
    const monthlyRateCompound = tem;

    let balanceSimple = principal;
    let balanceCompound = principal;

    chartData.push({
      monthIndex: 0,
      simple: Math.round(balanceSimple),
      compound: Math.round(balanceCompound)
    });

    for (let m = 1; m <= 12; m++) {
      // Simple Interest (TNA basis - no reinvestment)
      balanceSimple = principal * (1 + monthlyRateSimple * m);
      
      // Compound Interest (TEA basis - reinvesting)
      balanceCompound = balanceCompound * (1 + monthlyRateCompound);

      chartData.push({
        monthIndex: m,
        simple: Math.round(balanceSimple),
        compound: Math.round(balanceCompound)
      });

      monthlyBreakdown.push({
        monthIndex: m,
        monthName: `Mes ${m}`,
        simpleBalance: Math.round(balanceSimple),
        simpleInterestAcc: Math.round(balanceSimple - principal),
        compoundBalance: Math.round(balanceCompound),
        compoundInterestAcc: Math.round(balanceCompound - principal)
      });
    }

    return {
      tea: tea * 100,
      tem: tem * 100,
      realReturn: realReturn * 100,
      chartData,
      monthlyBreakdown,
      gainDiff: Math.round(balanceCompound - balanceSimple)
    };
  }, [tna, frequency, inflation, compoundingMap]);

  const handleShare = () => {
    const params = new URLSearchParams();
    params.set('seccion', 'herramientas');
    params.set('herramienta', 'conversor-tasa');
    if (tna) params.set('tna', tna);
    if (frequency) params.set('freq', frequency);
    if (inflation) params.set('inf', inflation);

    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    return navigator.clipboard.writeText(shareUrl);
  };

  const exportToCSV = () => {
    if (!results) return;
    const headers = ['Mes', 'Interes Simple (Capital + Tasa Lineal)', 'Interes Compuesto (Capital + Tasa Capitalizada)'];
    const rows = results.chartData.map(row => [
      row.monthIndex,
      row.simple,
      row.compound
    ]);
    
    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `valia_conversor_tasas_${tna}_tna.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "¿Cuál es la diferencia entre TNA y TEA?",
      a: "La Tasa Nominal Anual (TNA) es la tasa de referencia que no tiene en cuenta la capitalización o reinversión del interés. La Tasa Efectiva Anual (TEA), en cambio, refleja el rendimiento neto real al cabo de un año asumiendo que los intereses cobrados se vuelven a reinvertir bajo las mismas condiciones (interés compuesto)."
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
  ];

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <header className="calculator-header">
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Percent size={32} style={{ color: '#06B6D4' }} />
          Conversor TNA a TEA
        </h1>
        <p>Calculadora de equivalencia de tasas e interés compuesto frente a la inflación.</p>
        
        <button 
          onClick={() => setIsHelpOpen(true)}
          className="help-btn"
        >
          <HelpCircle size={18} className="text-accent-primary" />
          ¿Cómo entender las tasas y la capitalización?
        </button>
      </header>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '2rem', alignItems: 'start' }}>
        {/* Inputs Panel */}
        <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '0.25rem' }}>
            Parámetros de Tasa
          </h2>

          <FinancialInput label="Tasa Nominal Anual (TNA %)" value={tna} onChange={setTna} suffix="%" step={0.5} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Frecuencia de Capitalización
            </label>
            <select 
              value={frequency} 
              onChange={e => setFrequency(e.target.value)}
              className="input-field"
              style={{ width: '100%', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: 'none' }}
            >
              {Object.entries(compoundingMap).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>

          <FinancialInput label="Inflación Anual Estimada (%)" value={inflation} onChange={setInflation} suffix="%" step={1} />

          <div 
            onClick={() => navigateToArticle('tna-vs-tea-capitalizacion')}
            className="card no-print"
            style={{ 
              marginTop: '1.5rem', 
              cursor: 'pointer',
              background: 'var(--bg-tertiary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem',
              borderRadius: 'var(--border-radius-md)',
              border: 'none',
              boxShadow: 'none'
            }}
          >
            <BookOpen size={18} className="text-accent-primary" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.85rem', textAlign: 'left' }}>
              <span style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '0.15rem', fontSize: '0.725rem', fontWeight: 600, textTransform: 'uppercase' }}>Guía Recomendada</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>TNA vs TEA: Capitalización de intereses explicada</span>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {results && (
            <>
              {/* Print-only Header */}
              <PrintReportHeader 
                title="Reporte de Equivalencia de Tasas"
                subtitle="Ficha de Evaluación de Rendimiento y Capitalización Compuesta"
                params={[
                  { label: 'TNA Declarada', value: `${tna}%` },
                  { label: 'Capitalización', value: compoundingMap[frequency].label },
                  { label: 'Inflación Estimada Anual', value: `${inflation}%` }
                ]}
              />

              {/* TEA Highlight Card */}
              <div className="card" style={{
                textAlign: 'center',
                borderTop: '4px solid var(--accent-primary)',
                background: 'linear-gradient(180deg, rgba(6, 182, 212, 0.08), transparent)'
              }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  Tasa Efectiva Anual (TEA) Resultante
                </p>
                <h3 style={{ fontSize: '2.75rem', fontWeight: 800, color: 'var(--accent-primary)', lineHeight: 1, margin: '0.25rem 0' }}>
                  {formatPercent(results.tea)}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>
                  La tasa capitalizada rinde un <strong>{formatPercent(results.tea - Number(tna))} más</strong> de forma anual comparado con la TNA base.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="stats-grid">
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', borderTop: '2px solid #06B6D4' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Tasa Efectiva Mensual (TEM)</span>
                  <strong style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>{formatPercent(results.tem)}</strong>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Rendimiento cada 30 días</span>
                </div>

                <div className="card" style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '0.25rem', 
                  borderTop: results.realReturn >= 0 ? '2px solid #10B981' : '2px solid #EF4444' 
                }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Rendimiento Real Anual</span>
                  <strong style={{ fontSize: '1.25rem', color: results.realReturn >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
                    {results.realReturn >= 0 ? '+' : ''}{formatPercent(results.realReturn)}
                  </strong>
                  <span style={{ fontSize: '0.7rem', color: results.realReturn >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
                    {results.realReturn >= 0 ? '✓ Le gana a la inflación' : '✗ Pérdida adquisitiva'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap', marginTop: '-0.5rem' }}>
                <button 
                  onClick={() => {
                    handleShare()
                      .then(() => {
                        setShareCopied(true);
                        setTimeout(() => setShareCopied(false), 2000);
                      })
                      .catch(err => console.error(err));
                  }}
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
                  Imprimir Reporte PDF
                </button>
              </div>

              {/* Chart */}
              <div className="card chart-container" id="tna-tea-chart" style={{ height: '360px' }}>
                <h3 style={{ marginBottom: '0.25rem', fontSize: '1rem', fontWeight: 600 }}>
                  Efecto de Capitalización Compuesta
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                  Simulación de crecimiento de un capital inicial de $100.000 a lo largo de 12 meses
                </p>
                <ResponsiveContainer width="100%" height="75%">
                  <LineChart data={results.chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                    <XAxis dataKey="monthIndex" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                    <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} tickFormatter={formatCurrency} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '15px', fontSize: 12 }} />
                    
                    <Line type="monotone" dataKey="compound" name="Interés Compuesto (TEA)" stroke="#06B6D4" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="simple" name="Interés Simple (TNA)" stroke="#EF4444" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Table Toggle */}
              <button className="btn btn-outline" onClick={() => setShowTable(!showTable)} style={{ alignSelf: 'flex-start' }}>
                <TableProperties size={18} />
                {showTable ? 'Ocultar Tabla' : 'Mostrar Desglose Mensual'}
              </button>

              {showTable && (
                <div className="card animate-fade-in" style={{ overflowX: 'auto', padding: 0 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '0.875rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                        <th style={{ padding: '1rem', textAlign: 'center' }}>Periodo</th>
                        <th style={{ padding: '1rem' }}>Saldo Simple (TNA)</th>
                        <th style={{ padding: '1rem' }}>Interés Simple Acum.</th>
                        <th style={{ padding: '1rem' }}>Saldo Compuesto (TEA)</th>
                        <th style={{ padding: '1rem' }}>Interés Comp. Acum.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.monthlyBreakdown.map((row) => (
                        <tr key={row.monthIndex} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>{row.monthName}</td>
                          <td style={{ padding: '0.75rem 1rem', color: '#EF4444' }}>${row.simpleBalance.toLocaleString('es-AR')}</td>
                          <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>${row.simpleInterestAcc.toLocaleString('es-AR')}</td>
                          <td style={{ padding: '0.75rem 1rem', color: '#06B6D4', fontWeight: 600 }}>${row.compoundBalance.toLocaleString('es-AR')}</td>
                          <td style={{ padding: '0.75rem 1rem', color: '#06B6D4' }}>${row.compoundInterestAcc.toLocaleString('es-AR')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <AdvisorCTA goalContext="tasas" />
              <PrintAdvisorCTA />
            </>
          )}
        </div>
      </div>

      {/* FAQs Section */}
      <section className="card animate-fade-in" style={{ marginTop: '3rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
          Preguntas Frecuentes sobre Tasas de Interés
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              style={{ 
                borderBottom: '1px solid var(--border-color)', 
                paddingBottom: '0.75rem' 
              }}
            >
              <button
                onClick={() => toggleFaq(index)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  padding: '0.5rem 0',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.95rem'
                }}
              >
                <span>{faq.q}</span>
                <span style={{ color: 'var(--accent-primary)', fontSize: '1.1rem' }}>
                  {activeFaq === index ? '−' : '+'}
                </span>
              </button>
              {activeFaq === index && (
                <p 
                  className="animate-fade-in"
                  style={{ 
                    fontSize: '0.875rem', 
                    lineHeight: '1.6', 
                    color: 'var(--text-secondary)',
                    margin: '0.5rem 0 0 0',
                    paddingLeft: '0.25rem'
                  }}
                >
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Help Modal */}
      <HelpModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)}
        title="¿Cómo se calcula el Interés Compuesto?"
      >
        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>1. Tasa Nominal Anual (TNA)</h3>
        <p>
          Es un porcentaje anual que se calcula de forma lineal sobre el capital original. Si prestás $10.000 al 40% TNA sin capitalización, al finalizar el año cobrarás exactamente $4.000 de interés simple.
        </p>
        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>2. Capitalización (El Factor de Frecuencia)</h3>
        <p>
          Si en lugar de retirar los intereses al final del año, cobrás intereses mensuales e inmediatamente los reinvertís, cada mes generarás intereses sobre los intereses acumulados previamente. A esto se le conoce como **capitalización**.
        </p>
        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>3. Tasa Efectiva Anual (TEA)</h3>
        <p>
          Es la tasa que efectivamente cobrás o pagás al cabo de un año sumando el efecto compuesto de la reinversion. Es el verdadero indicador del rendimiento financiero y el número clave para comparar cualquier plazo fijo, fondo común de inversión o tarjeta de crédito.
        </p>
      </HelpModal>
    </div>
  );
};

export default TnaToTeaCalculator;
