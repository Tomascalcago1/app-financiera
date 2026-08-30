import React, { useState } from 'react';
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
import { TableProperties, Download, Printer, Share2, Image, TrendingUp } from 'lucide-react';
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
    const yearLabel = lang === 'en' ? `Year ${label}` : `Año ${label}`;
    return (
      <div className="taste-card" style={{ padding: '0.85rem 1.1rem', border: '1px solid var(--border-color)', minWidth: '200px' }}>
        <p style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem' }}>{yearLabel}</p>
        {payload.map((entry, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', gap: '0.5rem' }}>
            <span style={{ color: entry.color, fontSize: '0.825rem' }}>{entry.name}:</span>
            <strong className="tabular-nums" style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>{formatCurrency(entry.value, lang)}</strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const SavingsGoalDashboard = ({ data, requiredContribution, goalAmount, inputs = {} }) => {
  const [activeTab, setActiveTab] = useState('chart'); // 'chart' | 'table'
  const [shareCopied, setShareCopied] = useState(false);
  const { language } = useLanguage();
  const tLocal = (key) => {
    return translations[language][key] || translations['es'][key] || key;
  };

  if (!data || data.length === 0) {
    return (
      <div className="taste-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '300px', color: 'var(--text-secondary)' }}>
        {tLocal('dash.placeholder')}
      </div>
    );
  }

  const finalYear = data[data.length - 1];

  const handleShare = () => {
    const params = new URLSearchParams();
    params.set('tool', 'savings-goal');
    if (inputs.goalAmount) params.set('goal', inputs.goalAmount);
    if (inputs.initialInvestment) params.set('initial', inputs.initialInvestment);
    if (inputs.years) params.set('years', inputs.years);
    if (inputs.interestRate) params.set('rate', inputs.interestRate);

    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    return navigator.clipboard.writeText(shareUrl);
  };

  const exportToCSV = () => {
    const headers = language === 'en' 
      ? ['Year', 'Total Contributed', 'Accumulated Balance']
      : ['Año', 'Total Aportado', 'Balance Acumulado'];
      
    const rows = data.map(row => [
      row.year,
      row.totalContributions,
      row.expected
    ]);
    
    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    
    const fileName = language === 'en'
      ? `valia_savings_goal_${finalYear.year}_years.csv`
      : `valia_objetivo_ahorro_${finalYear.year}_anos.csv`;
      
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    window.print();
  };

  return (
    <div className="flex" style={{ flexDirection: 'column', gap: '2rem' }}>
      
      {/* Print-only Report Header & Parameters */}
      <PrintReportHeader 
        title={tLocal('dash.print.title')}
        subtitle={tLocal('dash.print.subtitle')}
        params={[
          { label: tLocal('dash.param.goal'), value: formatCurrency(inputs.goalAmount, language) },
          { label: tLocal('dash.param.initial'), value: formatCurrency(inputs.initialInvestment, language) },
          { label: tLocal('dash.param.term'), value: language === 'en' ? `${inputs.years} years` : `${inputs.years} años` },
          { label: tLocal('dash.param.rate'), value: `${inputs.interestRate}%` },
          { label: tLocal('dash.param.required'), value: requiredContribution > 0 ? formatCurrency(requiredContribution, language) : tLocal('dash.param.no_contrib') }
        ]}
      />
      
      {/* Summary Banner */}
      <div className="taste-card" style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), var(--bg-secondary))',
        borderLeft: '4px solid var(--accent-success)',
        padding: '1.75rem',
        boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
      }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
          {tLocal('dash.result.title')}
        </h2>
        {requiredContribution > 0 ? (
          <p className="tabular-nums" style={{ fontSize: '1.125rem', color: 'var(--text-primary)' }}>
            {tLocal('dash.result.msg')
              .replace('{goal}', formatCurrency(goalAmount, language))
              .replace('{years}', finalYear.year)
              .replace('{contribution}', formatCurrency(requiredContribution, language))}
          </p>
        ) : (
          <p className="tabular-nums" style={{ fontSize: '1.125rem', color: 'var(--accent-success)', fontWeight: 600 }}>
            {tLocal('dash.result.msg.zero')}
          </p>
        )}

        <div className="taste-card" style={{ marginTop: '1rem', padding: '1rem 1.25rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
          <h4 style={{ fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{tLocal('dash.breakdown.title')}</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem' }}>
            <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span>{tLocal('dash.breakdown.pocket')}</span>
              <strong className="tabular-nums">{formatCurrency(finalYear.totalContributions, language)}</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--accent-success)' }}>{tLocal('dash.breakdown.interest')}</span>
              <strong className="tabular-nums" style={{ color: 'var(--accent-success)' }}>{formatCurrency(finalYear.expected - finalYear.totalContributions, language)}</strong>
            </li>
          </ul>
        </div>
      </div>

      {/* Toolbar: Views Switch and Export Actions */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        {/* Tab Switcher */}
        <div style={{ display: 'inline-flex', background: 'var(--bg-tertiary)', padding: '0.25rem', borderRadius: '999px', border: '1px solid var(--border-color)' }}>
          <button
            type="button"
            className={`btn transition-spring ${activeTab === 'chart' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.35rem 1rem', fontSize: '0.8rem', borderRadius: '999px', border: 'none' }}
            onClick={() => setActiveTab('chart')}
          >
            <TrendingUp size={14} />
            {language === 'en' ? 'Growth Chart' : 'Gráfico'}
          </button>
          <button
            type="button"
            className={`btn transition-spring ${activeTab === 'table' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.35rem 1rem', fontSize: '0.8rem', borderRadius: '999px', border: 'none' }}
            onClick={() => setActiveTab('table')}
          >
            <TableProperties size={14} />
            {language === 'en' ? 'Detailed Table' : 'Tabla Detallada'}
          </button>
        </div>

        {/* Export Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => {
              handleShare()
                .then(() => {
                  setShareCopied(true);
                  setTimeout(() => setShareCopied(false), 2000);
                })
                .catch(err => console.error(err));
            }}
            className="btn btn-outline transition-spring" 
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', borderColor: shareCopied ? 'var(--accent-success)' : 'var(--border-color)' }}
          >
            <Share2 size={14} className={shareCopied ? "text-accent-success" : ""} />
            {shareCopied ? (language === 'en' ? 'Copied!' : '¡Copiado!') : (language === 'en' ? 'Share' : 'Compartir')}
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
            onClick={exportToPDF}
            className="btn btn-outline transition-spring" 
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
          >
            <Printer size={14} />
            PDF
          </button>

          <button 
            onClick={() => exportChartToPNG('savings-goal-chart-container', language === 'en' ? 'valia_savings_goal.png' : 'valia_objetivo_ahorro.png')}
            className="btn btn-outline transition-spring" 
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
          >
            <Image size={14} />
            PNG
          </button>
        </div>
      </div>

      {/* Chart or Table View */}
      {activeTab === 'chart' ? (
        <div className="taste-card chart-container" id="savings-goal-chart-container" style={{ padding: '1.5rem', height: '380px' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: 700 }}>{tLocal('dash.chart.title')}</h3>
          <ResponsiveContainer width="100%" height="80%">
            <AreaChart
              data={data}
              margin={{ top: 15, right: 20, left: 20, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis 
                dataKey="year" 
                stroke="var(--text-secondary)"
                tick={{ fill: 'var(--text-secondary)' }}
              />
              <YAxis 
                stroke="var(--text-secondary)"
                tick={{ fill: 'var(--text-secondary)' }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip lang={language} />} />
              <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px' }} />
              
              <ReferenceLine 
                y={goalAmount} 
                stroke="var(--accent-success)" 
                strokeDasharray="4 4" 
                label={{ 
                  value: tLocal('dash.chart.ref_line').replace('{amount}', formatCurrency(goalAmount, language)), 
                  fill: 'var(--accent-success)', 
                  position: 'top',
                  fontSize: 11,
                  fontWeight: 500
                }} 
              />

              <Area 
                type="monotone" 
                dataKey="totalContributions" 
                name={tLocal('dash.chart.contributions')} 
                stroke="var(--text-secondary)" 
                fill="var(--bg-tertiary)" 
                strokeWidth={2}
                stackId="0"
              />
              <Area 
                type="monotone" 
                dataKey="expected" 
                name={tLocal('dash.chart.expected')} 
                stroke="var(--accent-success)" 
                fill="url(#colorExpectedGoal)" 
                strokeWidth={3}
              />
              <defs>
                <linearGradient id="colorExpectedGoal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-success)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--accent-success)" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="taste-card animate-fade-in" style={{ overflowX: 'auto', padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem', textAlign: 'center' }}>{language === 'en' ? 'Year' : 'Año'}</th>
                <th style={{ padding: '1rem' }}>{language === 'en' ? 'Total Contributed' : 'Total Aportado'}</th>
                <th style={{ padding: '1rem' }}>{language === 'en' ? 'Accumulated Balance' : 'Balance Acumulado'}</th>
                <th style={{ padding: '1rem' }}>{language === 'en' ? 'Interest Earned' : 'Interés Generado'}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.year} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    {language === 'en' ? `Year ${row.year}` : `Año ${row.year}`}
                  </td>
                  <td className="tabular-nums" style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>{formatCurrency(row.totalContributions, language)}</td>
                  <td className="tabular-nums" style={{ padding: '0.75rem 1rem', color: 'var(--accent-success)', fontWeight: 600 }}>{formatCurrency(row.expected, language)}</td>
                  <td className="tabular-nums" style={{ padding: '0.75rem 1rem', color: 'var(--accent-primary)', fontWeight: 600 }}>{formatCurrency(row.expected - row.totalContributions, language)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdvisorCTA 
        whatsappText={tLocal('dash.whatsapp.text')} 
      />
      <PrintAdvisorCTA />
    </div>
  );
};

export default SavingsGoalDashboard;
