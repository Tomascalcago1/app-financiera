import React, { useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine
} from 'recharts';
import { TableProperties, TrendingUp, TrendingDown, BarChart3, Download, Printer, Share2, Image } from 'lucide-react';
import AdvisorCTA from '../../components/AdvisorCTA';
import PrintReportHeader from '../../components/PrintReportHeader';
import PrintAdvisorCTA from '../../components/PrintAdvisorCTA';
import { exportChartToPNG } from '../../utils/chartExporter';
import { useLanguage } from '../../utils/LanguageContext';
import { translations } from './translations';

const formatCurrency = (value) => {
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}k`;
  return `$${value}`;
};

const formatCurrencyFull = (value, lang) => {
  const locale = lang === 'en' ? 'en-US' : 'es-AR';
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
};

const CustomTooltip = ({ active, payload, label, lang }) => {
  if (active && payload && payload.length) {
    const yearLabel = lang === 'en' ? `Retirement year ${label}` : `Año ${label} de retiro`;
    return (
      <div className="card" style={{ padding: '1rem', border: '1px solid var(--border-color)', minWidth: '180px' }}>
        <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{yearLabel}</p>
        {payload.map((entry, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.15rem' }}>
            <span style={{ color: entry.color, fontSize: '0.85rem' }}>{entry.name}:</span>
            <strong style={{ fontSize: '0.85rem' }}>{formatCurrencyFull(entry.value, lang)}</strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const FireResultsDashboard = ({ results, onShare, inputs = {} }) => {
  const [showTable, setShowTable] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const { language } = useLanguage();
  const tLocal = (key) => {
    return translations[language][key] || translations['es'][key] || key;
  };

  const chartData = results?.chartData;

  // Extraer el capital inicial del portafolio desde el primer punto de la mediana
  const initialPortfolio = useMemo(() => {
    return chartData && chartData.length > 0 ? chartData[0].median : null;
  }, [chartData]);

  if (!results) {
    return (
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: 'var(--text-secondary)' }}>
        {tLocal('dash.placeholder')}
      </div>
    );
  }

  const { successRate, totalSimulations, survivedCount, statistics, simulations } = results;
  const rateColor = successRate >= 90 ? 'var(--accent-success)' : successRate >= 75 ? 'var(--accent-warning)' : 'var(--accent-danger)';

  const retirementLength = chartData ? chartData.length - 1 : 30;

  const exportToCSV = () => {
    const headers = language === 'en'
      ? ['Retirement Year', 'Minimum', '10th Percentile', 'Median', '90th Percentile', 'Maximum']
      : ['Año de Retiro', 'Mínimo', 'Percentil 10', 'Mediana', 'Percentil 90', 'Máximo'];
      
    const rows = chartData.map(row => [
      row.yearIndex,
      row.min,
      row.p10,
      row.median,
      row.p90,
      row.max
    ]);
    
    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    
    const fileName = language === 'en'
      ? `valia_retirement_progress_${retirementLength}_years.csv`
      : `valia_retiro_progreso_${retirementLength}_anos.csv`;
      
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    window.print();
  };

  const strategyLabel = inputs.withdrawalStrategy === 'constant-dollar' 
    ? tLocal('input.strategy.constant')
    : tLocal('input.strategy.percent');

  let minMaxSuffix = '';
  if (inputs.withdrawalStrategy === 'percent-of-portfolio') {
    const minW = Number(inputs.minWithdrawal) || 0;
    const maxW = Number(inputs.maxWithdrawal) || 0;
    if (minW > 0 || maxW > 0) {
      const parts = [];
      if (minW > 0) parts.push(`${language === 'en' ? 'Min' : 'Mín'}: ${formatCurrencyFull(minW, language)}`);
      if (maxW > 0) parts.push(`${language === 'en' ? 'Max' : 'Máx'}: ${formatCurrencyFull(maxW, language)}`);
      minMaxSuffix = ` (${parts.join(' / ')})`;
    }
  }

  const withdrawalVal = inputs.withdrawalStrategy === 'constant-dollar'
    ? (language === 'en' ? `${formatCurrencyFull(inputs.withdrawalAmount, language)} annually` : `${formatCurrencyFull(inputs.withdrawalAmount, language)} anual`)
    : (language === 'en' ? `${inputs.withdrawalPercent}% annually${minMaxSuffix}` : `${inputs.withdrawalPercent}% anual${minMaxSuffix}`);

  return (
    <div className="flex" style={{ flexDirection: 'column', gap: '2rem' }}>
      
      {/* Print-only Report Header & Parameters */}
      <PrintReportHeader 
        title={tLocal('dash.print.title')}
        subtitle={tLocal('dash.print.subtitle')}
        params={[
          { label: tLocal('dash.param.portfolio'), value: formatCurrencyFull(inputs.portfolioValue, language) },
          { label: tLocal('dash.param.length'), value: language === 'en' ? `${inputs.retirementLength} years` : `${inputs.retirementLength} años` },
          { label: tLocal('dash.param.strategy'), value: strategyLabel },
          { label: tLocal('dash.param.withdrawal'), value: withdrawalVal },
          { label: tLocal('dash.param.allocation'), value: tLocal('dash.param.allocation.val')
              .replace('{stock}', inputs.stockAlloc)
              .replace('{bond}', inputs.bondAlloc)
              .replace('{cash}', inputs.cashAlloc) },
          { label: tLocal('dash.param.flows'), value: inputs.extraFlows && inputs.extraFlows.length > 0
            ? tLocal('dash.param.flows.val')
                .replace('{incomes}', inputs.extraFlows.filter(f => f.type === 'income').length)
                .replace('{expenses}', inputs.extraFlows.filter(f => f.type === 'expense').length)
            : tLocal('dash.param.none')
          }
        ]}
      />

      {/* Success Rate */}
      <div className="card" style={{
        textAlign: 'center',
        borderTop: `4px solid ${rateColor}`,
        background: `linear-gradient(180deg, ${rateColor}11, transparent)`
      }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{tLocal('dash.success.title')}</p>
        <p style={{ fontSize: '4rem', fontWeight: 700, color: rateColor, lineHeight: 1 }}>{successRate}%</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>
          {tLocal('dash.success.desc').replace('{survived}', survivedCount).replace('{total}', totalSimulations)}
        </p>
      </div>

      {/* Resumen de Flujos Extraordinarios */}
      {inputs.extraFlows && inputs.extraFlows.length > 0 && (
        <div className="card animate-fade-in" style={{ padding: '1rem', borderLeft: '4px solid var(--accent-primary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>
            {tLocal('dash.flows.configured')}
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {inputs.extraFlows.map((flow, idx) => {
              const typeColor = flow.type === 'income' ? 'var(--accent-success)' : 'var(--accent-danger)';
              const timingLabel = flow.recurring 
                ? tLocal('dash.flows.timing.recurring').replace('{start}', flow.startYear).replace('{end}', flow.endYear)
                : tLocal('dash.flows.timing.single').replace('{year}', flow.startYear);
              const inflationLabel = flow.adjustForInflation ? tLocal('dash.flows.inflation.adjusted') : '';
              return (
                <div key={flow.id || idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <span>
                    • <strong style={{ color: 'var(--text-primary)' }}>{flow.name || 'Sin nombre'}</strong> ({timingLabel}):
                  </span>
                  <span>
                    <strong style={{ color: typeColor }}>{flow.type === 'income' ? '+' : '-'}{formatCurrencyFull(Number(flow.amount) || 0, language)}</strong>{inflationLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="card" style={{ textAlign: 'center' }}>
          <TrendingDown size={20} style={{ color: 'var(--accent-danger)', marginBottom: '0.5rem' }} />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{tLocal('dash.stats.worst')}</p>
          <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>{formatCurrencyFull(statistics.worst, language)}</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <BarChart3 size={20} style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }} />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{tLocal('dash.stats.median')}</p>
          <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>{formatCurrencyFull(statistics.median, language)}</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <TrendingUp size={20} style={{ color: 'var(--accent-success)', marginBottom: '0.5rem' }} />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{tLocal('dash.stats.best')}</p>
          <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>{formatCurrencyFull(statistics.best, language)}</p>
        </div>
      </div>

      {/* Export Actions */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap', marginTop: '-1rem' }}>
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
            className="btn btn-outline" 
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
          >
            <Share2 size={16} />
            {shareCopied ? tLocal('dash.btn.copied') : tLocal('dash.btn.share')}
          </button>
        )}
        <button 
          onClick={exportToCSV}
          className="btn btn-outline" 
          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
        >
          <Download size={16} />
          {tLocal('dash.btn.csv')}
        </button>
        <button 
          onClick={exportToPDF}
          className="btn btn-outline" 
          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
        >
          <Printer size={16} />
          {tLocal('dash.btn.pdf')}
        </button>
        <button 
          onClick={() => exportChartToPNG('fire-chart-container', language === 'en' ? 'valia_retirement_simulator.png' : 'valia_simulador_retiro.png')}
          className="btn btn-outline" 
          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
        >
          <Image size={16} />
          {tLocal('dash.btn.image')}
        </button>
      </div>

      {/* Chart */}
      <div className="card chart-container" id="fire-chart-container">
        <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>{tLocal('dash.chart.title')}</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 15, right: 20, left: 20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis dataKey="yearIndex" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
            <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} tickFormatter={formatCurrency} />
            <Tooltip content={<CustomTooltip lang={language} />} />
            <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px' }} />
            
            {initialPortfolio && (
              <ReferenceLine 
                y={initialPortfolio} 
                stroke="var(--text-secondary)" 
                strokeDasharray="3 3" 
                label={{ 
                  value: tLocal('dash.chart.ref.initial').replace('{amount}', formatCurrency(initialPortfolio)), 
                  fill: 'var(--text-secondary)', 
                  position: 'right',
                  fontSize: 10
                }} 
              />
            )}

            <Area type="monotone" dataKey="max" name={tLocal('dash.chart.max')} stroke="none" fill="var(--accent-success)" fillOpacity={0.08} />
            <Area type="monotone" dataKey="p90" name={tLocal('dash.chart.p90')} stroke="var(--accent-success)" fill="var(--accent-success)" fillOpacity={0.12} strokeWidth={1} strokeDasharray="4 4" />
            <Area type="monotone" dataKey="median" name={tLocal('dash.chart.median')} stroke="var(--accent-primary)" fill="url(#fireGrad)" strokeWidth={3} />
            <Area type="monotone" dataKey="p10" name={tLocal('dash.chart.p10')} stroke="var(--accent-warning)" fill="none" strokeWidth={1} strokeDasharray="4 4" />
            <Area type="monotone" dataKey="min" name={tLocal('dash.chart.min')} stroke="var(--accent-danger)" fill="none" strokeWidth={1} strokeDasharray="4 4" />
            <defs>
              <linearGradient id="fireGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Table Toggle */}
      <button className="btn btn-outline" onClick={() => setShowTable(!showTable)} style={{ alignSelf: 'flex-start' }}>
        <TableProperties size={18} />
        {showTable ? tLocal('dash.btn.table.hide') : tLocal('dash.btn.table.show')}
      </button>

      {showTable && (
        <div className="card animate-fade-in" style={{ overflowX: 'auto', padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem', textAlign: 'center' }}>{tLocal('dash.table.start')}</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>{tLocal('dash.table.end')}</th>
                <th style={{ padding: '1rem' }}>{tLocal('dash.table.final')}</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>{tLocal('dash.table.result')}</th>
              </tr>
            </thead>
            <tbody>
              {simulations.map((sim) => (
                <tr key={sim.startYear} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>{sim.startYear}</td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>{sim.endYear}</td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 'bold' }}>{formatCurrencyFull(sim.endingValue, language)}</td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: sim.survived ? 'var(--accent-success)' : 'var(--accent-danger)', fontWeight: 600 }}>
                    {sim.survived ? tLocal('dash.table.survived') : tLocal('dash.table.failed')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Affiliate CTA */}
      <AdvisorCTA 
        goalContext="retiro"
      />
      <PrintAdvisorCTA />
    </div>
  );
};

export default FireResultsDashboard;
