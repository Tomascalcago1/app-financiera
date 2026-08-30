import React, { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from 'recharts';
import { Download, Printer, Image, Share2, TrendingUp, TableProperties } from 'lucide-react';
import PrintReportHeader from '../../components/PrintReportHeader';
import PrintAdvisorCTA from '../../components/PrintAdvisorCTA';
import { exportChartToPNG } from '../../utils/chartExporter';

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(value);

const ChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="taste-card" style={{ padding: '0.75rem 1rem', border: '1px solid var(--border-color)' }}>
        <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Año {label}</p>
        <p className="tabular-nums" style={{ fontSize: '0.875rem', color: 'var(--accent-success)' }}>
          Equivalente: {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const InflationDashboard = ({ result, chartData, amount, fromYear, toYear, annualRate }) => {
  const [activeTab, setActiveTab] = useState('chart'); // 'chart' | 'table'
  const [shareCopied, setShareCopied] = useState(false);

  if (!result) {
    return (
      <div className="taste-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px', color: 'var(--text-secondary)' }}>
        Selecciona los años para ver el resultado.
      </div>
    );
  }

  const futureYears = 10;
  const purchasingPowerIn10 = amount * Math.pow(1 / (1 + (annualRate / 100)), futureYears);

  const handleShare = () => {
    const params = new URLSearchParams();
    params.set('tool', 'inflation');
    if (amount) params.set('amount', amount);
    if (fromYear) params.set('from', fromYear);
    if (toYear) params.set('to', toYear);

    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    return navigator.clipboard.writeText(shareUrl);
  };

  const exportToCSV = () => {
    const headers = ['Año', 'Valor Ajustado de $100 de 1635'];
    const rows = chartData.map(row => [row.year, row.value]);
    
    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `valia_inflacion_historica_1635_2025.csv`);
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
        title="Reporte de Simulación: Inflación Histórica"
        subtitle="Ficha de Planificación del Poder Adquisitivo"
        params={[
          { label: 'Monto Inicial', value: formatCurrency(amount) },
          { label: 'Desde el Año', value: String(fromYear) },
          { label: 'Hasta el Año', value: String(toYear) },
          { label: 'Tasa de Inflación Utilizada', value: `${annualRate.toFixed(2)}%` }
        ]}
      />

      {/* Main Result */}
      <div className="taste-card" style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), var(--bg-secondary))',
        borderLeft: '4px solid var(--accent-success)',
        padding: '1.75rem',
        boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
      }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Resultado</h2>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>
          <strong className="tabular-nums" style={{ color: 'var(--text-primary)' }}>{formatCurrency(amount)}</strong> en{' '}
          <strong className="tabular-nums">{fromYear}</strong> equivale a{' '}
          <strong className="tabular-nums" style={{ color: 'var(--accent-success)', fontSize: '1.65rem' }}>{formatCurrency(result.equivalentValue)}</strong> en{' '}
          <strong className="tabular-nums">{toYear}</strong>.
        </p>
        <div style={{ marginTop: '1.25rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Inflación Total</p>
            <p className="tabular-nums" style={{ fontSize: '1.25rem', fontWeight: 800 }}>{result.totalInflationPercent.toFixed(2)}%</p>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Tasa Promedio Anual</p>
            <p className="tabular-nums" style={{ fontSize: '1.25rem', fontWeight: 800 }}>{result.averageAnnualRate.toFixed(2)}%</p>
          </div>
        </div>
      </div>

      {/* Future Projection */}
      <div className="taste-card" style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05))',
        borderLeft: '4px solid var(--accent-warning)',
        padding: '1.25rem'
      }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', fontWeight: 700 }}>Proyección Futura</h3>
        <p style={{ fontSize: '0.95rem' }}>
          Si la inflación continúa al <strong>{annualRate.toFixed(2)}%</strong> anual,{' '}
          <strong className="tabular-nums">{formatCurrency(amount)}</strong> de hoy solo comprará el equivalente a{' '}
          <strong className="tabular-nums" style={{ color: 'var(--accent-warning)' }}>{formatCurrency(purchasingPowerIn10)}</strong> en bienes dentro de {futureYears} años.
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
            Gráfico
          </button>
          <button
            type="button"
            className={`btn transition-spring ${activeTab === 'table' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.35rem 1rem', fontSize: '0.8rem', borderRadius: '999px', border: 'none' }}
            onClick={() => setActiveTab('table')}
          >
            <TableProperties size={14} />
            Tabla Histórica
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
            onClick={exportToPDF}
            className="btn btn-outline transition-spring" 
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
          >
            <Printer size={14} />
            PDF
          </button>

          <button 
            onClick={() => exportChartToPNG('inflation-chart-container', 'valia_inflacion_historica.png')}
            className="btn btn-outline transition-spring" 
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
          >
            <Image size={14} />
            PNG
          </button>
        </div>
      </div>

      {/* Large Historical Chart or Table */}
      {chartData && chartData.length > 0 && (
        activeTab === 'chart' ? (
          <div className="taste-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', fontWeight: 700 }}>
              Valor de $100 de 1635 ajustado por inflación
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '1rem' }}>
              Muestra cómo $100 de 1635 habrían crecido en términos nominales hasta hoy.
            </p>
            <div className="chart-container-large" id="inflation-chart-container" style={{ height: '380px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 15, right: 20, left: 20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis
                    dataKey="year"
                    stroke="var(--text-secondary)"
                    tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                    tickCount={10}
                  />
                  <YAxis
                    stroke="var(--text-secondary)"
                    tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                    tickFormatter={v => `$${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v.toFixed(0)}`}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  
                  {fromYear && (
                    <ReferenceLine 
                      x={Number(fromYear)} 
                      stroke="var(--accent-warning)" 
                      strokeDasharray="3 3" 
                      label={{ 
                        value: `Desde: ${fromYear}`, 
                        fill: 'var(--accent-warning)', 
                        fontSize: 10, 
                        position: 'top',
                        fontWeight: 500
                      }} 
                    />
                  )}

                  {toYear && (
                    <ReferenceLine 
                      x={Number(toYear)} 
                      stroke="var(--accent-primary)" 
                      strokeDasharray="3 3" 
                      label={{ 
                        value: `Hasta: ${toYear}`, 
                        fill: 'var(--accent-primary)', 
                        fontSize: 10, 
                        position: 'top',
                        fontWeight: 500
                      }} 
                    />
                  )}

                  <Area
                    type="monotone"
                    dataKey="value"
                    name="Valor Equivalente"
                    stroke="var(--accent-success)"
                    fill="url(#inflationGrad)"
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="inflationGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-success)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--accent-success)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="taste-card animate-fade-in" style={{ overflowX: 'auto', padding: 0, maxHeight: '420px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '0.875rem' }}>
              <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>Año</th>
                  <th style={{ padding: '1rem' }}>Valor Equivalente de $100</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((row) => (
                  <tr key={row.year} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.6rem 1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>{row.year}</td>
                    <td className="tabular-nums" style={{ padding: '0.6rem 1rem', color: 'var(--accent-success)', fontWeight: 600 }}>{formatCurrency(row.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
      <PrintAdvisorCTA />
    </div>
  );
};

export default InflationDashboard;
