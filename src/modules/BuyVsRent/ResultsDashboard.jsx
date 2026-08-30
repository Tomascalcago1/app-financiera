import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from 'recharts';
import { Download, Printer, Image, TrendingUp, TableProperties, Share2 } from 'lucide-react';
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
      <div className="taste-card" style={{ padding: '0.85rem 1.1rem', border: '1px solid var(--border-color)', minWidth: '220px' }}>
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

const ResultsDashboard = ({ data, inputs = {} }) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('chart'); // 'chart' | 'table'
  const [shareCopied, setShareCopied] = useState(false);

  const tLocal = (key) => {
    return translations[language][key] || translations['es'][key] || key;
  };

  // Calcular el año de cruce (equilibrio)
  const crossoverYear = useMemo(() => {
    if (!data || data.length < 2) return null;
    const initialBuyHigher = data[0].buyNetWorth > data[0].rentNetWorth;
    for (let i = 1; i < data.length; i++) {
      const buyHigher = data[i].buyNetWorth > data[i].rentNetWorth;
      if (buyHigher !== initialBuyHigher) {
        return data[i].year;
      }
    }
    return null;
  }, [data]);

  if (!data || data.length === 0) return null;

  const finalYear = data[data.length - 1];
  const buyWins = finalYear.buyNetWorth > finalYear.rentNetWorth;
  const difference = Math.abs(finalYear.buyNetWorth - finalYear.rentNetWorth);

  const exportToCSV = () => {
    const headers = language === 'en'
      ? ['Year', 'Net Worth Buying', 'Net Worth Renting', 'Property Value', 'Remaining Debt']
      : ['Año', 'Patrimonio Comprando (Net Worth)', 'Patrimonio Alquilando (Net Worth)', 'Valor Propiedad', 'Deuda Hipoteca'];
      
    const rows = data.map(row => [
      row.year,
      row.buyNetWorth,
      row.rentNetWorth,
      row.propertyValue,
      row.remainingDebt
    ]);
    
    // Configurar el BOM de UTF-8 para soporte de caracteres especiales en Excel
    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    
    const fileName = language === 'en'
      ? `valia_buy_vs_rent_${finalYear.year}_years.csv`
      : `valia_comprar_vs_alquilar_${finalYear.year}_anos.csv`;
      
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    window.print();
  };

  const handleShare = () => {
    const params = new URLSearchParams();
    params.set('tool', 'buy-vs-rent');
    if (inputs.propertyPrice) params.set('price', inputs.propertyPrice);
    if (inputs.monthlyRent) params.set('rent', inputs.monthlyRent);
    if (inputs.initialCapital) params.set('capital', inputs.initialCapital);
    if (inputs.years) params.set('years', inputs.years);

    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    return navigator.clipboard.writeText(shareUrl);
  };

  return (
    <div className="flex" style={{ flexDirection: 'column', gap: '2rem' }}>
      
      {/* Print-only Report Header & Parameters */}
      <PrintReportHeader 
        title={tLocal('dash.print.title')}
        subtitle={tLocal('dash.print.subtitle')}
        params={[
          { label: tLocal('dash.param.price'), value: formatCurrency(inputs.propertyPrice, language) },
          { label: tLocal('dash.param.initial'), value: formatCurrency(inputs.initialCapital, language) },
          { label: tLocal('dash.param.rent'), value: formatCurrency(inputs.monthlyRent, language) },
          { label: tLocal('dash.param.term'), value: tLocal('dash.param.term.val').replace('{years}', inputs.years) },
          { label: language === 'en' ? 'Estimated Annual Inflation' : 'Inflación Anual Estimada', value: `${inputs.inflationRate}%` },
          { label: language === 'en' ? 'Expected Investment Return (APR)' : 'Rendimiento Inversión (TNA)', value: `${inputs.investmentReturn}%` },
          { label: language === 'en' ? 'Annual Property Appreciation' : 'Apreciación Anual Propiedad', value: `${inputs.propertyAppreciation}%` },
          { label: language === 'en' ? 'Annual Property Maintenance' : 'Mantenimiento Anual Propiedad', value: `${inputs.maintenanceRate}%` },
          ...(inputs.propertyPrice > inputs.initialCapital ? [
            { label: language === 'en' ? 'Mortgage Rate (Annual)' : 'Tasa Hipotecaria (Anual)', value: `${inputs.mortgageRate}%` },
            { label: language === 'en' ? 'Mortgage Term' : 'Plazo de Hipoteca', value: language === 'en' ? `${inputs.mortgageYears} years` : `${inputs.mortgageYears} años` }
          ] : [])
        ]}
      />
      
      {/* Summary Banner */}
      <div className="taste-card" style={{
        background: buyWins 
          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), var(--bg-secondary))'
          : 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), var(--bg-secondary))',
        borderLeft: `4px solid ${buyWins ? 'var(--accent-success)' : 'var(--accent-primary)'}`,
        padding: '1.75rem',
        boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
      }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
          {language === 'en' ? `Result in ${finalYear.year} years` : `Resultado en {years} años`.replace('{years}', finalYear.year)}
        </h2>
        <p className="tabular-nums" style={{ fontSize: '1.125rem', color: 'var(--text-primary)' }}>
          {buyWins ? (
            tLocal('dash.result.buy')
              .replace('{years}', finalYear.year)
              .replace('{worth}', formatCurrency(finalYear.buyNetWorth, language))
          ) : (
            tLocal('dash.result.rent')
              .replace('{years}', finalYear.year)
              .replace('{worth}', formatCurrency(finalYear.rentNetWorth, language))
          )}
        </p>

        {/* Breakdown */}
        <div className="taste-card" style={{ marginTop: '1rem', padding: '1rem 1.25rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
          <h4 style={{ fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            {language === 'en' 
              ? `Your Net Worth Breakdown (${buyWins ? 'Buying' : 'Renting'}):` 
              : `Desglose de tu Riqueza (${buyWins ? 'Comprando' : 'Alquilando'}):`}
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem' }}>
            {buyWins ? (
              <>
                <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span>{tLocal('dash.breakdown.buy.net')}</span>
                  <strong className="tabular-nums">{formatCurrency(finalYear.propertyValue - finalYear.remainingDebt, language)}</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span>{language === 'en' ? 'Invested Initial Capital:' : 'Capital Inicial Invertido:'}</span>
                  <strong className="tabular-nums">{formatCurrency(finalYear.buyBaseline, language)}</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--accent-success)' }}>{tLocal('dash.breakdown.buy.savings')}</span>
                  <strong className="tabular-nums" style={{ color: 'var(--accent-success)' }}>{formatCurrency(finalYear.buySavings, language)}</strong>
                </li>
              </>
            ) : (
              <>
                <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span>{language === 'en' ? 'Invested Initial Capital:' : 'Capital Inicial Invertido:'}</span>
                  <strong className="tabular-nums">{formatCurrency(finalYear.rentBaseline, language)}</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--accent-primary)' }}>{tLocal('dash.breakdown.rent.savings')}</span>
                  <strong className="tabular-nums" style={{ color: 'var(--accent-primary)' }}>{formatCurrency(finalYear.rentSavings, language)}</strong>
                </li>
              </>
            )}
          </ul>
        </div>

        <p style={{ fontSize: '0.875rem', marginTop: '1rem', color: 'var(--text-tertiary)' }}>
          {tLocal('dash.result.comparison')
            .replace('{diff}', formatCurrency(difference, language))
            .replace('{winner}', buyWins ? tLocal('dash.winner.buy') : tLocal('dash.winner.rent'))}
        </p>
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
            onClick={() => exportChartToPNG('buy-rent-chart-container', language === 'en' ? 'valia_buy_vs_rent.png' : 'valia_comprar_vs_alquilar.png')}
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
        <div className="taste-card chart-container" id="buy-rent-chart-container" style={{ padding: '1.5rem', height: '380px' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: 700 }}>{tLocal('dash.chart.title')}</h3>
          <ResponsiveContainer width="100%" height="80%">
            <LineChart
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
                tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip content={<CustomTooltip lang={language} />} />
              <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px' }} />
              
              {crossoverYear && (
                <ReferenceLine 
                  x={crossoverYear} 
                  stroke="var(--accent-warning)" 
                  strokeDasharray="3 3" 
                  label={{ 
                    value: language === 'en' ? `Cross: Year ${crossoverYear}` : `Cruce: Año ${crossoverYear}`, 
                    fill: 'var(--accent-warning)', 
                    position: 'top', 
                    fontSize: 11,
                    fontWeight: 500
                  }} 
                />
              )}

              <Line 
                type="monotone" 
                name={tLocal('dash.chart.buy')}
                dataKey="buyNetWorth" 
                stroke="var(--accent-success)" 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                name={tLocal('dash.chart.rent')}
                dataKey="rentNetWorth" 
                stroke="var(--accent-primary)" 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="taste-card animate-fade-in" style={{ overflowX: 'auto', padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem', textAlign: 'center' }}>{language === 'en' ? 'Year' : 'Año'}</th>
                <th style={{ padding: '1rem' }}>{language === 'en' ? 'Net Worth (Buying)' : 'Patrimonio Comprando'}</th>
                <th style={{ padding: '1rem' }}>{language === 'en' ? 'Net Worth (Renting)' : 'Patrimonio Alquilando'}</th>
                <th style={{ padding: '1rem' }}>{language === 'en' ? 'Property Value' : 'Valor Propiedad'}</th>
                <th style={{ padding: '1rem' }}>{language === 'en' ? 'Mortgage Debt' : 'Deuda Hipoteca'}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.year} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    {language === 'en' ? `Year ${row.year}` : `Año ${row.year}`}
                  </td>
                  <td className="tabular-nums" style={{ padding: '0.75rem 1rem', color: 'var(--accent-success)', fontWeight: 600 }}>{formatCurrency(row.buyNetWorth, language)}</td>
                  <td className="tabular-nums" style={{ padding: '0.75rem 1rem', color: 'var(--accent-primary)', fontWeight: 600 }}>{formatCurrency(row.rentNetWorth, language)}</td>
                  <td className="tabular-nums" style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>{formatCurrency(row.propertyValue, language)}</td>
                  <td className="tabular-nums" style={{ padding: '0.75rem 1rem', color: '#EF4444' }}>{formatCurrency(row.remainingDebt, language)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <PrintAdvisorCTA />
    </div>
  );
};

export default ResultsDashboard;
