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
import { TableProperties, Download, Printer, Image } from 'lucide-react';
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
      <div className="card" style={{ padding: '1rem', border: '1px solid var(--border-color)', minWidth: '200px' }}>
        <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{yearLabel}</p>
        {payload.map((entry, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span style={{ color: entry.color, fontSize: '0.875rem' }}>{entry.name}:</span>
            <strong style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}>{formatCurrency(entry.value, lang)}</strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const SavingsGoalDashboard = ({ data, requiredContribution, goalAmount, inputs = {} }) => {
  const [showTable, setShowTable] = useState(false);
  const { language } = useLanguage();
  const tLocal = (key) => {
    return translations[language][key] || translations['es'][key] || key;
  };

  if (!data || data.length === 0) {
    return (
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '300px', color: 'var(--text-secondary)' }}>
        {tLocal('dash.placeholder')}
      </div>
    );
  }

  const finalYear = data[data.length - 1];

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

      {/* Export Actions */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap', marginTop: '-1rem' }}>
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
          onClick={() => exportChartToPNG('savings-goal-chart-container', language === 'en' ? 'valia_savings_goal.png' : 'valia_objetivo_ahorro.png')}
          className="btn btn-outline" 
          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
        >
          <Image size={16} />
          {tLocal('dash.btn.image')}
        </button>
      </div>

      {/* Chart */}
      <div className="card chart-container" id="savings-goal-chart-container">
        <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>{tLocal('dash.chart.title')}</h3>
        <ResponsiveContainer width="100%" height="100%">
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

      <button 
        className="btn btn-outline" 
        onClick={() => setShowTable(!showTable)}
        style={{ alignSelf: 'flex-start' }}
      >
        <TableProperties size={18} />
        {showTable ? tLocal('dash.btn.table.hide') : tLocal('dash.btn.table.show')}
      </button>

      {showTable && (
        <div className="card animate-fade-in" style={{ overflowX: 'auto', padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem', textAlign: 'center' }}>{tLocal('dash.table.year')}</th>
                <th style={{ padding: '1rem' }}>{tLocal('dash.table.contributions')}</th>
                <th style={{ padding: '1rem', color: 'var(--accent-success)' }}>{tLocal('dash.table.expected')}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.year} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: 500 }}>{row.year}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{formatCurrency(row.totalContributions, language)}</td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 'bold' }}>{formatCurrency(row.expected, language)}</td>
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
