import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from 'recharts';
import { TableProperties, Download, Printer, Share2, Image, Sparkles, TrendingUp, DollarSign, Award, Layers } from 'lucide-react';
import AdvisorCTA from '../../components/AdvisorCTA';
import PrintReportHeader from '../../components/PrintReportHeader';
import PrintAdvisorCTA from '../../components/PrintAdvisorCTA';
import { exportChartToPNG } from '../../utils/chartExporter';
import { useLanguage } from '../../utils/LanguageContext';
import { translations } from './translations';

const formatCurrency = (value, lang) => {
  const locale = lang === 'en' ? 'en-US' : 'es-AR';
  const currency = lang === 'en' ? 'USD' : 'ARS';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0
  }).format(value);
};

const CustomTooltip = ({ active, payload, label, lang }) => {
  if (active && payload && payload.length) {
    const sortedPayload = [...payload].sort((a, b) => b.value - a.value);

    return (
      <div className="taste-card" style={{ padding: '0.85rem 1.1rem', border: '1px solid rgba(6, 182, 212, 0.3)', minWidth: '220px', background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(12px)', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
        <p style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '0.9rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.35rem' }}>
          {lang === 'en' ? `Year ${label}` : `Año ${label}`}
        </p>
        {sortedPayload.map((entry, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', gap: '0.75rem' }}>
            <span style={{ color: entry.color, fontSize: '0.825rem' }}>{entry.name}:</span>
            <strong className="tabular-nums" style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>{formatCurrency(entry.value, lang)}</strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const CompoundResultsDashboard = ({ data, varianceEnabled, onShare, inputs = {} }) => {
  const { language } = useLanguage();
  const tLocal = (key) => {
    return translations[language][key] || translations['es'][key] || key;
  };

  const [activeTab, setActiveTab] = useState('chart'); // 'chart' | 'table'
  const [shareCopied, setShareCopied] = useState(false);

  const profitCrossoverYear = useMemo(() => {
    if (!data) return null;
    for (let i = 0; i < data.length; i++) {
      const profit = data[i].expected - data[i].totalContributions;
      if (profit > data[i].totalContributions) {
        return data[i].year;
      }
    }
    return null;
  }, [data]);

  if (!data || data.length === 0) return null;

  const finalYear = data[data.length - 1];
  const pureInterest = Math.max(0, finalYear.expected - finalYear.totalContributions);
  const multiplier = finalYear.totalContributions > 0 
    ? (finalYear.expected / finalYear.totalContributions).toFixed(1) 
    : '1.0';

  const exportToCSV = () => {
    const headers = ['Año', 'Aportes Acumulados', 'Saldo Estimado (Medio)'];
    if (varianceEnabled) {
      headers.push('Saldo Pesimista', 'Saldo Optimista');
    }
    
    const rows = data.map(row => {
      const baseRow = [row.year, row.totalContributions, row.expected];
      if (varianceEnabled) {
        baseRow.push(row.pessimistic, row.optimistic);
      }
      return baseRow;
    });
    
    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `valia_interes_compuesto_${finalYear.year}_anos.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    window.print();
  };

  const compoundFrequencyLabel = inputs.compoundFrequency === 1 
    ? tLocal('dash.freq.1') 
    : inputs.compoundFrequency === 12 
      ? tLocal('dash.freq.12') 
      : inputs.compoundFrequency === 365 
        ? tLocal('dash.freq.365') 
        : tLocal('dash.freq.2');

  return (
    <div className="flex" style={{ flexDirection: 'column', gap: '2rem' }}>
      
      {/* Print-only Report Header & Parameters */}
      <PrintReportHeader 
        title={language === 'en' ? "Simulation Report: Compound Interest" : "Reporte de Simulación: Interés Compuesto"}
        subtitle={language === 'en' ? "Savings & Investment Planning Sheet" : "Ficha de Planificación de Ahorros e Inversión"}
        params={[
          { label: language === 'en' ? 'Initial Investment' : 'Inversión Inicial', value: formatCurrency(inputs.initialInvestment, language) },
          { label: language === 'en' ? 'Monthly Contribution' : 'Aporte Mensual', value: formatCurrency(inputs.monthlyContribution, language) },
          { label: language === 'en' ? 'Time Horizon' : 'Horizonte Temporal', value: language === 'en' ? `${inputs.years} years` : `${inputs.years} años` },
          { label: language === 'en' ? 'Interest Rate (APR)' : 'Tasa de Interés (TNA)', value: `${inputs.interestRate}%` },
          { label: language === 'en' ? 'Compounding Frequency' : 'Frecuencia de Capitalización', value: compoundFrequencyLabel },
          ...(varianceEnabled ? [
            { label: language === 'en' ? 'Variance Range' : 'Rango de Variación', value: `±${inputs.varianceRange}%` }
          ] : [])
        ]}
      />
      
      {/* High-Impact 3-Card KPI Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem'
      }}>
        {/* Saldo Final Estimado */}
        <div className="taste-card" style={{
          padding: '1.5rem',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, var(--bg-secondary) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem',
          boxShadow: '0 8px 24px rgba(6, 182, 212, 0.1)'
        }}>
          <span style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {tLocal('dash.kpi.total')}
          </span>
          <strong className="tabular-nums" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            {formatCurrency(finalYear.expected, language)}
          </strong>
          <span style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
            {language === 'en' ? `In ${finalYear.year} years horizon` : `En un horizonte de ${finalYear.year} años`}
          </span>
        </div>

        {/* Total Aportado */}
        <div className="taste-card" style={{
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem'
        }}>
          <span style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {tLocal('dash.kpi.contributions')}
          </span>
          <strong className="tabular-nums" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            {formatCurrency(finalYear.totalContributions, language)}
          </strong>
          <span style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
            {language === 'en' ? 'Total principal saved' : 'Ahorro neto aportado'}
          </span>
        </div>

        {/* Interés Puro Ganado */}
        <div className="taste-card" style={{
          padding: '1.5rem',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, var(--bg-secondary) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--accent-success)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {tLocal('dash.kpi.interest')}
            </span>
            <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: '999px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-success)', fontWeight: 700 }}>
              {multiplier}x
            </span>
          </div>
          <strong className="tabular-nums" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-success)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            {formatCurrency(pureInterest, language)}
          </strong>
          <span style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
            {language === 'en' ? 'Generated by compound growth' : 'Generado por interés compuesto'}
          </span>
        </div>
      </div>

      {/* Crossover Milestone Notification */}
      {profitCrossoverYear && (
        <div className="taste-card" style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            color: 'var(--accent-success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Award size={22} />
          </div>
          <div>
            <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)', display: 'block', marginBottom: '0.2rem' }}>
              {tLocal('dash.crossover.title')} (Año {profitCrossoverYear})
            </strong>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              {language === 'en'
                ? `In year ${profitCrossoverYear}, pure interest earnings overtake your total pocket contributions. The exponential curve takes over.`
                : `En el año ${profitCrossoverYear}, las ganancias por interés superan a la suma de todos tus aportes. A partir de aquí, el dinero trabaja por vos.`}
            </span>
          </div>
        </div>
      )}

      {/* Toolbar: Views and Export Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        {/* Tab Toggle: Chart vs Table */}
        <div style={{ display: 'inline-flex', background: 'var(--bg-tertiary)', padding: '0.25rem', borderRadius: '999px', border: '1px solid var(--border-color)' }}>
          <button
            type="button"
            className={`btn transition-spring ${activeTab === 'chart' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.35rem 1rem', fontSize: '0.8rem', borderRadius: '999px', border: 'none' }}
            onClick={() => setActiveTab('chart')}
          >
            <TrendingUp size={14} />
            {tLocal('dash.tab.chart')}
          </button>
          <button
            type="button"
            className={`btn transition-spring ${activeTab === 'table' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.35rem 1rem', fontSize: '0.8rem', borderRadius: '999px', border: 'none' }}
            onClick={() => setActiveTab('table')}
          >
            <TableProperties size={14} />
            {tLocal('dash.tab.table')}
          </button>
        </div>

        {/* Export Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {onShare && (
            <button 
              onClick={() => {
                onShare()
                  .then(() => {
                    setShareCopied(true);
                    setTimeout(() => setShareCopied(false), 2000);
                  })
                  .catch(err => console.error('Error al compartir: ', err));
              }}
              className="btn btn-outline transition-spring" 
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
            >
              <Share2 size={15} />
              {shareCopied ? tLocal('dash.btn.copied') : tLocal('dash.btn.share')}
            </button>
          )}
          <button 
            onClick={exportToCSV}
            className="btn btn-outline transition-spring" 
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
          >
            <Download size={15} />
            CSV
          </button>
          <button 
            onClick={exportToPDF}
            className="btn btn-outline transition-spring" 
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
          >
            <Printer size={15} />
            PDF
          </button>
          <button 
            onClick={() => exportChartToPNG('compound-chart-container', 'valia_interes_compuesto.png')}
            className="btn btn-outline transition-spring" 
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
          >
            <Image size={15} />
            PNG
          </button>
        </div>
      </div>

      {/* Main Visual: Chart View */}
      {activeTab === 'chart' && (
        <div className="taste-card chart-container" id="compound-chart-container" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.25rem', fontSize: '1.15rem', fontWeight: 600, letterSpacing: '-0.02em' }}>
            {language === 'en' ? 'Growth Trajectory Over Time' : 'Trayectoria de Crecimiento en el Tiempo'}
          </h3>
          <ResponsiveContainer width="100%" height={380}>
            <AreaChart
              data={data}
              margin={{ top: 15, right: 20, left: 10, bottom: 25 }}
            >
              <defs>
                <linearGradient id="colorExpected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorContrib" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#64748B" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#64748B" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorOptimistic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis 
                dataKey="year" 
                stroke="var(--text-secondary)"
                tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
              />
              <YAxis 
                stroke="var(--text-secondary)"
                tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip lang={language} />} />
              <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px' }} />
              
              {profitCrossoverYear && (
                <ReferenceLine 
                  x={profitCrossoverYear} 
                  stroke="var(--accent-success)" 
                  strokeDasharray="4 4" 
                  label={{ 
                    value: language === 'en' ? 'Interest > Contributions' : 'Interés > Aportes', 
                    fill: 'var(--accent-success)',
                    fontSize: 11,
                    position: 'top'
                  }} 
                />
              )}

              <Area 
                type="monotone" 
                dataKey="totalContributions" 
                name={tLocal('dash.chart.contributions')} 
                stroke="#94A3B8" 
                fillOpacity={1} 
                fill="url(#colorContrib)" 
                strokeWidth={2}
              />

              <Area 
                type="monotone" 
                dataKey="expected" 
                name={tLocal('dash.chart.expected')} 
                stroke="var(--accent-primary)" 
                fillOpacity={1} 
                fill="url(#colorExpected)" 
                strokeWidth={2.5}
              />

              {varianceEnabled && (
                <>
                  <Area 
                    type="monotone" 
                    dataKey="optimistic" 
                    name={tLocal('dash.chart.optimistic')} 
                    stroke="#10B981" 
                    fillOpacity={1} 
                    fill="url(#colorOptimistic)" 
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="pessimistic" 
                    name={tLocal('dash.chart.pessimistic')} 
                    stroke="#F59E0B" 
                    fill="none" 
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                  />
                </>
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Main Visual: Table View */}
      {activeTab === 'table' && (
        <div className="taste-card" style={{ padding: 0, overflowX: 'auto', border: '1px solid var(--border-color)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '0.9rem 1.25rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{tLocal('dash.table.year')}</th>
                <th style={{ padding: '0.9rem 1.25rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{tLocal('dash.table.contributions')}</th>
                <th style={{ padding: '0.9rem 1.25rem', color: 'var(--accent-primary)', fontWeight: 700, background: 'rgba(6, 182, 212, 0.05)' }}>{tLocal('dash.table.expected')}</th>
                {varianceEnabled && (
                  <>
                    <th style={{ padding: '0.9rem 1.25rem', color: 'var(--accent-warning)', fontWeight: 600 }}>{tLocal('dash.table.pessimistic')}</th>
                    <th style={{ padding: '0.9rem 1.25rem', color: 'var(--accent-success)', fontWeight: 600 }}>{tLocal('dash.table.optimistic')}</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.year} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.15s ease' }}>
                  <td style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {language === 'en' ? `Year ${row.year}` : `Año ${row.year}`}
                  </td>
                  <td className="tabular-nums" style={{ padding: '0.85rem 1.25rem', color: 'var(--text-secondary)' }}>
                    {formatCurrency(row.totalContributions, language)}
                  </td>
                  <td className="tabular-nums" style={{ padding: '0.85rem 1.25rem', color: 'var(--accent-primary)', fontWeight: 700, background: 'rgba(6, 182, 212, 0.02)' }}>
                    {formatCurrency(row.expected, language)}
                  </td>
                  {varianceEnabled && (
                    <>
                      <td className="tabular-nums" style={{ padding: '0.85rem 1.25rem', color: 'var(--accent-warning)' }}>
                        {formatCurrency(row.pessimistic, language)}
                      </td>
                      <td className="tabular-nums" style={{ padding: '0.85rem 1.25rem', color: 'var(--accent-success)' }}>
                        {formatCurrency(row.optimistic, language)}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Lead Gen Advisor CTA banner */}
      <div style={{ marginTop: '1rem' }}>
        <AdvisorCTA 
          title={language === 'en' ? "Want to automate your investments with a professional advisor?" : "¿Querés automatizar tus inversiones con un asesor profesional?"}
          description={language === 'en' ? "Connect with our accredited financial advisor to build an optimal compound portfolio." : "Contactá a nuestro asesor matriculado en Balanz para estructurar tu cartera de interés compuesto sin comisiones ocultas."}
        />
      </div>

    </div>
  );
};

export default CompoundResultsDashboard;
