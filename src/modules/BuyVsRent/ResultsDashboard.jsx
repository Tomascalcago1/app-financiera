import React, { useMemo } from 'react';
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
import { Download, Printer, Image } from 'lucide-react';
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
      <div className="card" style={{ padding: '1rem', border: '1px solid var(--border-color)' }}>
        <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{yearLabel}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color, fontSize: '0.875rem' }}>
            {entry.name}: {formatCurrency(entry.value, lang)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ResultsDashboard = ({ data, inputs = {} }) => {
  const { language } = useLanguage();
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
      <div className="card" style={{
        background: buyWins 
          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))'
          : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))',
        borderLeft: `4px solid ${buyWins ? 'var(--accent-success)' : 'var(--accent-primary)'}`
      }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
          {language === 'en' ? `Result in ${finalYear.year} years` : `Resultado en {years} años`.replace('{years}', finalYear.year)}
        </h2>
        <p style={{ fontSize: '1.125rem' }}>
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
        <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-primary)', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)' }}>
          <h4 style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
            {language === 'en' 
              ? `Your Net Worth Breakdown (${buyWins ? 'Buying' : 'Renting'}):` 
              : `Desglose de tu Riqueza (${buyWins ? 'Comprando' : 'Alquilando'}):`}
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem' }}>
            {buyWins ? (
              <>
                <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span>{tLocal('dash.breakdown.buy.net')}</span>
                  <strong>{formatCurrency(finalYear.propertyValue - finalYear.remainingDebt, language)}</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span>{language === 'en' ? 'Invested Initial Capital:' : 'Capital Inicial Invertido:'}</span>
                  <strong>{formatCurrency(finalYear.buyBaseline, language)}</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--accent-success)' }}>{tLocal('dash.breakdown.buy.savings')}</span>
                  <strong style={{ color: 'var(--accent-success)' }}>{formatCurrency(finalYear.buySavings, language)}</strong>
                </li>
              </>
            ) : (
              <>
                <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span>{language === 'en' ? 'Invested Initial Capital:' : 'Capital Inicial Invertido:'}</span>
                  <strong>{formatCurrency(finalYear.rentBaseline, language)}</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--accent-primary)' }}>{tLocal('dash.breakdown.rent.savings')}</span>
                  <strong style={{ color: 'var(--accent-primary)' }}>{formatCurrency(finalYear.rentSavings, language)}</strong>
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
          onClick={() => exportChartToPNG('buy-rent-chart-container', language === 'en' ? 'valia_buy_vs_rent.png' : 'valia_comprar_vs_alquilar.png')}
          className="btn btn-outline" 
          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
        >
          <Image size={16} />
          {tLocal('dash.btn.image')}
        </button>
      </div>

      {/* Chart */}
      <div className="card chart-container" id="buy-rent-chart-container">
        <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>{tLocal('dash.chart.title')}</h3>
        <ResponsiveContainer width="100%" height="100%">
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

      <PrintAdvisorCTA />
    </div>
  );
};

export default ResultsDashboard;
