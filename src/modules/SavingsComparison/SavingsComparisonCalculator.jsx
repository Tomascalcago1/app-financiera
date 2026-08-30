import React, { useState, useEffect, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, ReferenceLine 
} from 'recharts';
import { 
  TrendingUp, Award, TableProperties, Download, 
  Printer, Share2, Calendar, Percent, Landmark, HelpCircle 
} from 'lucide-react';
import FinancialInput from '../../components/FinancialInput';
import HelpModal from '../../components/HelpModal';
import AdvisorCTA from '../../components/AdvisorCTA';
import PrintReportHeader from '../../components/PrintReportHeader';
import PrintAdvisorCTA from '../../components/PrintAdvisorCTA';
import { runSavingsComparison } from './SavingsComparisonEngine';

const formatCurrency = (value) => {
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}k`;
  return `$${value}`;
};

const formatCurrencyFull = (value) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="card" style={{ padding: '1rem', border: '1px solid var(--border-color)', minWidth: '180px' }}>
        <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Mes {label}</p>
        {payload.map((entry, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.15rem' }}>
            <span style={{ color: entry.color, fontSize: '0.85rem' }}>{entry.name}:</span>
            <strong style={{ fontSize: '0.85rem' }}>{formatCurrencyFull(entry.value)}</strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const SavingsComparisonCalculator = () => {
  const queryParams = new URLSearchParams(window.location.search);

  // States
  const [initialCapital, setInitialCapital] = useState(() => {
    const q = queryParams.get('cap');
    if (q !== null && !isNaN(q)) return q;
    const saved = localStorage.getItem('valia_sc_initialCapital');
    return saved !== null && saved !== 'undefined' ? saved : '1000000';
  });

  const [termDays, setTermDays] = useState(() => {
    const q = queryParams.get('term');
    if (q !== null && !isNaN(q)) return Number(q) < 180 ? '180' : q;
    const saved = localStorage.getItem('valia_sc_termDays');
    return saved !== null && saved !== 'undefined' && saved !== '' ? saved : '180';
  });

  const [tnaTraditional, setTnaTraditional] = useState(() => {
    const q = queryParams.get('trad');
    if (q !== null && !isNaN(q)) return q;
    const saved = localStorage.getItem('valia_sc_tnaTraditional');
    return saved !== null && saved !== 'undefined' && saved !== '' ? saved : '35';
  });

  const [tnaCauciones, setTnaCauciones] = useState(() => {
    const q = queryParams.get('cauc');
    if (q !== null && !isNaN(q)) return q;
    const saved = localStorage.getItem('valia_sc_tnaCauciones');
    return saved !== null && saved !== 'undefined' && saved !== '' ? saved : '30';
  });

  const [tnaUva, setTnaUva] = useState(() => {
    const q = queryParams.get('uva');
    if (q !== null && !isNaN(q)) return q;
    const saved = localStorage.getItem('valia_sc_tnaUva');
    return saved !== null && saved !== 'undefined' && saved !== '' ? saved : '1';
  });

  const [averageInflation, setAverageInflation] = useState(() => {
    const q = queryParams.get('inf');
    if (q !== null && !isNaN(q)) return q;
    const saved = localStorage.getItem('valia_sc_averageInflation');
    return saved !== null && saved !== 'undefined' && saved !== '' ? saved : '2.5';
  });

  const [customInflationMode, setCustomInflationMode] = useState(() => {
    const q = queryParams.get('custom');
    if (q !== null) return q === '1';
    const saved = localStorage.getItem('valia_sc_customInflationMode');
    return saved === 'true';
  });

  // Default REM inflation projections (~3% decrescendo)
  const defaultREM = ['3.0', '2.8', '2.6', '2.5', '2.4', '2.3', '2.2', '2.2', '2.2', '2.2', '2.2', '2.2', '2.2', '2.2', '2.2', '2.2', '2.2', '2.2', '2.2', '2.2', '2.2', '2.2', '2.2', '2.2'];

  const [inflationRates, setInflationRates] = useState(() => {
    const q = queryParams.get('rates');
    if (q) {
      try {
        const parsed = JSON.parse(q);
        if (Array.isArray(parsed)) return parsed.map(String);
      } catch (e) {
        console.error('Error parsing rates from query params', e);
      }
    }
    const saved = localStorage.getItem('valia_sc_inflationRates');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.map(String);
      } catch (e) {}
    }
    return defaultREM;
  });

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const numMonths = Math.ceil((Number(termDays) || 180) / 30);

  // Sync custom inflation rates array length with term months
  useEffect(() => {
    setInflationRates(prev => {
      const next = [...prev];
      if (next.length < numMonths) {
        for (let i = next.length; i < numMonths; i++) {
          next.push(averageInflation);
        }
      } else if (next.length > numMonths) {
        next.splice(numMonths);
      }
      return next;
    });
  }, [numMonths, averageInflation]);

  // Persistence in localStorage
  useEffect(() => {
    localStorage.setItem('valia_sc_initialCapital', initialCapital);
    localStorage.setItem('valia_sc_termDays', termDays);
    localStorage.setItem('valia_sc_tnaTraditional', tnaTraditional);
    localStorage.setItem('valia_sc_tnaCauciones', tnaCauciones);
    localStorage.setItem('valia_sc_tnaUva', tnaUva);
    localStorage.setItem('valia_sc_averageInflation', averageInflation);
    localStorage.setItem('valia_sc_customInflationMode', customInflationMode ? 'true' : 'false');
    localStorage.setItem('valia_sc_inflationRates', JSON.stringify(inflationRates));
  }, [initialCapital, termDays, tnaTraditional, tnaCauciones, tnaUva, averageInflation, customInflationMode, inflationRates]);

  const handleShare = () => {
    const params = new URLSearchParams();
    params.set('seccion', 'herramientas');
    params.set('herramienta', 'comparador-de-ahorro');
    if (initialCapital) params.set('cap', initialCapital);
    if (termDays) params.set('term', termDays);
    if (tnaTraditional) params.set('trad', tnaTraditional);
    if (tnaCauciones) params.set('cauc', tnaCauciones);
    if (tnaUva) params.set('uva', tnaUva);
    if (averageInflation) params.set('inf', averageInflation);
    params.set('custom', customInflationMode ? '1' : '0');
    if (customInflationMode && inflationRates.length > 0) {
      params.set('rates', JSON.stringify(inflationRates));
    }

    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    return navigator.clipboard.writeText(shareUrl);
  };

  const results = useMemo(() => {
    if (initialCapital === '' || termDays === '') return null;
    let daysVal = Number(termDays);
    if (daysVal < 180) daysVal = 180; // Clamped by regulations

    const parsedRates = inflationRates.map(r => (Number(r) || 0) / 100);

    return runSavingsComparison({
      initialCapital: Number(initialCapital) || 0,
      termDays: daysVal,
      tnaTraditional: (Number(tnaTraditional) || 0) / 100,
      tnaCauciones: (Number(tnaCauciones) || 0) / 100,
      tnaUva: (Number(tnaUva) || 0) / 100,
      inflationRates: parsedRates,
      customInflationMode,
      averageInflation: (Number(averageInflation) || 0) / 100,
    });
  }, [initialCapital, termDays, tnaTraditional, tnaCauciones, tnaUva, inflationRates, customInflationMode, averageInflation]);

  const handleCustomRateChange = (index, value) => {
    setInflationRates(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleBlurTerm = () => {
    const val = Number(termDays);
    if (isNaN(val) || val < 180) {
      setTermDays('180');
    }
  };

  const exportToCSV = () => {
    if (!results) return;
    const headers = ['Mes', 'Plazo Fijo Tradicional', 'Cauciones Financieras', 'Plazo Fijo UVA', 'Inflacion Acumulada (%)'];
    const rows = results.chartData.map(row => [
      row.monthIndex,
      row.traditional,
      row.cauciones,
      row.uva,
      row.inflationAcumulada
    ]);
    
    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `valia_comparador_tasas_${termDays}_dias.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
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
  ];

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <header className="calculator-header">
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Landmark size={32} style={{ color: '#06B6D4' }} />
          ¿UVA, Plazo Fijo o Caución?
        </h1>
        <p>Comparador interactivo de tasas y rendimiento real frente a la inflación en pesos.</p>
        
        <button 
          onClick={() => setIsHelpOpen(true)}
          className="help-btn"
        >
          <HelpCircle size={18} className="text-accent-primary" />
          ¿Cómo funcionan estos instrumentos?
        </button>
      </header>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '2rem', alignItems: 'start' }}>
        {/* Input Panel */}
        <div className="taste-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '0.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Parámetros de Ahorro
          </h2>

          {/* Quick Presets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Plazos y Montos Típicos:
            </span>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                className="btn btn-outline transition-spring"
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', borderRadius: '999px' }}
                onClick={() => {
                  setInitialCapital('500000');
                  setTermDays('180');
                  setTnaTraditional('35');
                  setTnaCauciones('30');
                  setAverageInflation('2.5');
                }}
              >
                💰 $500k a 180d
              </button>
              <button 
                type="button" 
                className="btn btn-outline transition-spring"
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', borderRadius: '999px' }}
                onClick={() => {
                  setInitialCapital('1500000');
                  setTermDays('360');
                  setTnaTraditional('35');
                  setTnaCauciones('30');
                  setAverageInflation('2.2');
                }}
              >
                💼 $1.5M a 360d
              </button>
              <button 
                type="button" 
                className="btn btn-outline transition-spring"
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', borderRadius: '999px' }}
                onClick={() => {
                  setInitialCapital('3000000');
                  setTermDays('180');
                  setTnaTraditional('38');
                  setTnaCauciones('32');
                  setAverageInflation('2.5');
                }}
              >
                📈 $3M a 180d
              </button>
            </div>
          </div>

          <FinancialInput label="Capital Inicial ($)" value={initialCapital} onChange={setInitialCapital} prefix="$" step={50000} />
          
          <FinancialInput 
            label="Plazo de Inversión (Mínimo 180 días)" 
            value={termDays} 
            onChange={setTermDays} 
            onBlur={handleBlurTerm}
            suffix="días" 
            min={180} 
            max={730} 
          />

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <FinancialInput label="TNA Plazo Fijo (%)" value={tnaTraditional} onChange={setTnaTraditional} suffix="%" step={0.5} />
            </div>
            <div style={{ flex: 1 }}>
              <FinancialInput label="TNA Cauciones (%)" value={tnaCauciones} onChange={setTnaCauciones} suffix="%" step={0.5} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <FinancialInput label="Tasa Fija UVA (Spread %)" value={tnaUva} onChange={setTnaUva} suffix="%" step={0.1} />
            </div>
            <div style={{ flex: 1 }}>
              <FinancialInput label="Inflación Promedio Mensual (%)" value={averageInflation} onChange={setAverageInflation} suffix="%" step={0.1} />
            </div>
          </div>

          {/* Toggle Custom Inflation Month by Month */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              <input 
                type="checkbox" 
                checked={customInflationMode} 
                onChange={e => setCustomInflationMode(e.target.checked)} 
              />
              Personalizar inflación mes a mes
            </label>
            
            {customInflationMode && (
              <div className="taste-card animate-fade-in" style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--bg-tertiary)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '0.75rem', maxHeight: '180px', overflowY: 'auto' }}>
                {Array.from({ length: numMonths }).map((_, index) => (
                  <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Mes {index + 1}</span>
                    <input 
                      type="number" 
                      step="0.1"
                      className="input-field" 
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', textAlign: 'center' }}
                      value={inflationRates[index] !== undefined ? inflationRates[index] : '2.0'} 
                      onChange={e => handleCustomRateChange(index, e.target.value)} 
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Results Panel */}
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', animationDelay: '100ms' }}>
          {results && (
            <>
              {/* Print-only Header */}
              <PrintReportHeader 
                title="Reporte de Comparación de Ahorro e Inversión"
                subtitle="Ficha Técnica de Rendimiento Real (UVA vs PF vs Cauciones)"
                params={[
                  { label: 'Capital Inicial', value: formatCurrencyFull(Number(initialCapital) || 0) },
                  { label: 'Plazo Total', value: `${termDays} días (${numMonths} meses)` },
                  { label: 'TNA Plazo Fijo Tradicional', value: `${tnaTraditional}%` },
                  { label: 'TNA Cauciones 7d', value: `${tnaCauciones}%` },
                  { label: 'Tasa Adicional UVA', value: `UVA + ${tnaUva}%` },
                  { label: 'Modo Inflación', value: customInflationMode ? 'Personalizada mes a mes' : `Fija promedio (${averageInflation}% mens.)` }
                ]}
              />

              {/* Winner Highlight Card */}
              <div className="taste-card" style={{
                textAlign: 'center',
                borderTop: '4px solid var(--accent-primary)',
                background: 'linear-gradient(180deg, rgba(6, 182, 212, 0.08), var(--bg-secondary))',
                padding: '2rem 1.5rem',
                boxShadow: '0 8px 24px rgba(6, 182, 212, 0.08)'
              }}>
                <p style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  <Award size={18} className="text-accent-primary" />
                  Estrategia Ganadora Proyectada
                </p>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  {results.winnerLabel}
                </h3>
                <p className="tabular-nums" style={{ fontSize: '2.75rem', fontWeight: 800, color: 'var(--accent-primary)', lineHeight: 1.1, margin: '0.25rem 0', letterSpacing: '-0.03em' }}>
                  {formatCurrencyFull(results.winnerValue)}
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.65rem', marginBottom: 0 }}>
                  Inflación acumulada proyectada del periodo: <strong className="tabular-nums">{results.inflationAcumulada}%</strong>
                </p>
              </div>

              {/* Stats Breakdown */}
              <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
                <div className="taste-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', padding: '1.25rem', borderTop: '2px solid #10B981' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Plazo Fijo UVA</span>
                  <strong className="tabular-nums" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>{formatCurrencyFull(results.uvaFinal)}</strong>
                  <span className="tabular-nums" style={{ fontSize: '0.75rem', fontWeight: 600, color: results.uvaRealReturn >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
                    {results.uvaRealReturn >= 0 ? '✓ Ganancia real: ' : '✗ Pérdida real: '} {results.uvaRealReturn}%
                  </span>
                </div>

                <div className="taste-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', padding: '1.25rem', borderTop: '2px solid #F59E0B' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PF Tradicional</span>
                  <strong className="tabular-nums" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>{formatCurrencyFull(results.traditionalFinal)}</strong>
                  <span className="tabular-nums" style={{ fontSize: '0.75rem', fontWeight: 600, color: results.traditionalRealReturn >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
                    {results.traditionalRealReturn >= 0 ? '✓ Ganancia real: ' : '✗ Pérdida real: '} {results.traditionalRealReturn}%
                  </span>
                </div>

                <div className="taste-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', padding: '1.25rem', borderTop: '2px solid #EF4444' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cauciones 7d</span>
                  <strong className="tabular-nums" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>{formatCurrencyFull(results.caucionesFinal)}</strong>
                  <span className="tabular-nums" style={{ fontSize: '0.75rem', fontWeight: 600, color: results.caucionesRealReturn >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
                    {results.caucionesRealReturn >= 0 ? '✓ Ganancia real: ' : '✗ Pérdida real: '} {results.caucionesRealReturn}%
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
              <div className="card chart-container" id="savings-comparison-chart" style={{ height: '360px' }}>
                <h3 style={{ marginBottom: '1.25rem', fontSize: '1rem', fontWeight: 600 }}>Crecimiento Proyectado del Capital</h3>
                <ResponsiveContainer width="100%" height="90%">
                  <LineChart data={results.chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                    <XAxis dataKey="monthIndex" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                    <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} tickFormatter={formatCurrency} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '15px', fontSize: 12 }} />
                    
                    <Line type="monotone" dataKey="uva" name="PF UVA" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="traditional" name="PF Tradicional" stroke="#F59E0B" strokeWidth={2} strokeDasharray="3 3" dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="cauciones" name="Cauciones 7d" stroke="#EF4444" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
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
                        <th style={{ padding: '1rem', textAlign: 'center' }}>Inflación Mes</th>
                        <th style={{ padding: '1rem' }}>PF UVA</th>
                        <th style={{ padding: '1rem' }}>PF Tradicional</th>
                        <th style={{ padding: '1rem' }}>Cauciones 7d</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.monthlyBreakdown.map((row) => (
                        <tr key={row.monthIndex} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>{row.monthName}</td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: 'bold' }}>{row.inflationValue}%</td>
                          <td style={{ padding: '0.75rem 1rem', color: '#10B981', fontWeight: 600 }}>{formatCurrencyFull(row.uvaBalance)}</td>
                          <td style={{ padding: '0.75rem 1rem', color: '#F59E0B' }}>{formatCurrencyFull(row.traditionalBalance)}</td>
                          <td style={{ padding: '0.75rem 1rem', color: '#EF4444' }}>{formatCurrencyFull(row.caucionesBalance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <AdvisorCTA goalContext="pesos" />
              <PrintAdvisorCTA />
            </>
          )}
        </div>
      </div>

      {/* FAQs Section */}
      <section className="card animate-fade-in" style={{ marginTop: '3rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
          Preguntas Frecuentes sobre Instrumentos en Pesos
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

      {/* Guía Metodológica */}
      <section className="card animate-fade-in" style={{ marginTop: '2rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
        <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Metodología de Proyección</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
          Este simulador calcula los rendimientos aplicando las tasas provistas de forma compuesta en cada periodo de renovación. El Plazo Fijo Tradicional capitaliza intereses de forma mensual (cada 30 días) bajo la tasa TNA declarada. Las Cauciones se proyectan en rollover continuo cada 7 días para representar la capitalización compuesta real del mercado bursátil. El Plazo Fijo UVA indexa su capital mensualmente por la tasa de inflación ingresada en el simulador y adiciona el spread anual correspondiente distribuido linealmente por los días del período.
        </p>
      </section>

      <HelpModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)}
        title="¿Cómo elegir dónde guardar tus pesos?"
      >
        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>1. Plazo Fijo Tradicional</h3>
        <p>
          Es el certificado bancario más conocido. Te compromete a dejar el dinero a un plazo fijo (mínimo 30 días) a cambio de una tasa preestablecida. Es ideal cuando creés que la inflación va a bajar rápidamente y va a quedar por debajo de la tasa del plazo fijo.
        </p>
        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>2. Plazo Fijo UVA</h3>
        <p>
          Indexa tu capital según la inflación de Argentina más un pequeño plus de interés. Su desventaja principal es que tiene un encaje mínimo de **180 días** (no podés tocar la plata durante 6 meses). Es un gran resguardo cuando la inflación sube o se mantiene alta.
        </p>
        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>3. Cauciones Financieras</h3>
        <p>
          Son el equivalente bursátil del plazo fijo, se operan en el mercado a través de una cuenta comitente (broker). Las garantías del préstamo son títulos o acciones, lo que las hace seguras. Permiten colocar dinero a plazos muy cortos (ej: 1, 7 o 15 días), brindando liquidez y flexibilidad extrema para reinversión continua.
        </p>
      </HelpModal>
    </div>
  );
};

export default SavingsComparisonCalculator;
