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

const formatCurrency = (value) => {
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}k`;
  return `$${value}`;
};

const formatCurrencyFull = (value) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="card" style={{ padding: '1rem', border: '1px solid var(--border-color)', minWidth: '180px' }}>
        <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Año {label} de retiro</p>
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

const FireResultsDashboard = ({ results, onShare, inputs = {} }) => {
  const [showTable, setShowTable] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const chartData = results?.chartData;

  // Extraer el capital inicial del portafolio desde el primer punto de la mediana
  const initialPortfolio = useMemo(() => {
    return chartData && chartData.length > 0 ? chartData[0].median : null;
  }, [chartData]);

  if (!results) {
    return (
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: 'var(--text-secondary)' }}>
        Ingresa los datos para ejecutar la simulación.
      </div>
    );
  }

  const { successRate, totalSimulations, survivedCount, statistics, simulations } = results;
  const rateColor = successRate >= 90 ? 'var(--accent-success)' : successRate >= 75 ? 'var(--accent-warning)' : 'var(--accent-danger)';

  const retirementLength = chartData ? chartData.length - 1 : 30;

  const exportToCSV = () => {
    const headers = ['Año de Retiro', 'Mínimo', 'Percentil 10', 'Mediana', 'Percentil 90', 'Máximo'];
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
    link.setAttribute("download", `valia_fire_progression_${retirementLength}_anos.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    window.print();
  };

  const strategyLabel = inputs.withdrawalStrategy === 'constant-dollar' 
    ? 'Dólar Constante (Ajustado por Inflación)' 
    : 'Porcentaje Variable del Portafolio';

  const withdrawalVal = inputs.withdrawalStrategy === 'constant-dollar'
    ? `${formatCurrencyFull(inputs.withdrawalAmount)} anual`
    : `${inputs.withdrawalPercent}% anual`;

  return (
    <div className="flex" style={{ flexDirection: 'column', gap: '2rem' }}>
      
      {/* Print-only Report Header & Parameters */}
      <PrintReportHeader 
        title="Reporte de Simulación: Retiro y Jubilación"
        subtitle="Ficha de Planificación de Retiro y Sustentabilidad Financiera"
        params={[
          { label: 'Valor del Portafolio', value: formatCurrencyFull(inputs.portfolioValue) },
          { label: 'Duración del Retiro', value: `${inputs.retirementLength} años` },
          { label: 'Estrategia de Retiro', value: strategyLabel },
          { label: 'Retiro Inicial', value: withdrawalVal },
          { label: 'Distribución Portafolio', value: `Acciones ${inputs.stockAlloc}% / Bonos ${inputs.bondAlloc}% / Efectivo ${inputs.cashAlloc}%` }
        ]}
      />

      {/* Success Rate */}
      <div className="card" style={{
        textAlign: 'center',
        borderTop: `4px solid ${rateColor}`,
        background: `linear-gradient(180deg, ${rateColor}11, transparent)`
      }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Tasa de Éxito Histórica</p>
        <p style={{ fontSize: '4rem', fontWeight: 700, color: rateColor, lineHeight: 1 }}>{successRate}%</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>
          {survivedCount} de {totalSimulations} simulaciones históricas sobrevivieron
        </p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="card" style={{ textAlign: 'center' }}>
          <TrendingDown size={20} style={{ color: 'var(--accent-danger)', marginBottom: '0.5rem' }} />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Peor Caso</p>
          <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>{formatCurrencyFull(statistics.worst)}</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <BarChart3 size={20} style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }} />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Mediana</p>
          <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>{formatCurrencyFull(statistics.median)}</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <TrendingUp size={20} style={{ color: 'var(--accent-success)', marginBottom: '0.5rem' }} />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Mejor Caso</p>
          <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>{formatCurrencyFull(statistics.best)}</p>
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
            {shareCopied ? '¡Copiado!' : 'Compartir Simulación'}
          </button>
        )}
        <button 
          onClick={exportToCSV}
          className="btn btn-outline" 
          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
        >
          <Download size={16} />
          Exportar CSV (Excel)
        </button>
        <button 
          onClick={exportToPDF}
          className="btn btn-outline" 
          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
        >
          <Printer size={16} />
          Imprimir / Guardar PDF
        </button>
        <button 
          onClick={() => exportChartToPNG('fire-chart-container', 'valia_simulador_fire.png')}
          className="btn btn-outline" 
          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
        >
          <Image size={16} />
          Descargar Gráfico
        </button>
      </div>

      {/* Chart */}
      <div className="card chart-container" id="fire-chart-container">
        <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>Rango de Resultados del Portafolio</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 15, right: 20, left: 20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis dataKey="yearIndex" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
            <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} tickFormatter={formatCurrency} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px' }} />
            
            {initialPortfolio && (
              <ReferenceLine 
                y={initialPortfolio} 
                stroke="var(--text-secondary)" 
                strokeDasharray="3 3" 
                label={{ 
                  value: `Inicial: ${formatCurrency(initialPortfolio)}`, 
                  fill: 'var(--text-secondary)', 
                  position: 'right',
                  fontSize: 10
                }} 
              />
            )}

            <Area type="monotone" dataKey="max" name="Máximo (P90)" stroke="none" fill="var(--accent-success)" fillOpacity={0.08} />
            <Area type="monotone" dataKey="p90" name="Percentil 90" stroke="var(--accent-success)" fill="var(--accent-success)" fillOpacity={0.12} strokeWidth={1} strokeDasharray="4 4" />
            <Area type="monotone" dataKey="median" name="Mediana" stroke="var(--accent-primary)" fill="url(#fireGrad)" strokeWidth={3} />
            <Area type="monotone" dataKey="p10" name="Percentil 10" stroke="var(--accent-warning)" fill="none" strokeWidth={1} strokeDasharray="4 4" />
            <Area type="monotone" dataKey="min" name="Mínimo" stroke="var(--accent-danger)" fill="none" strokeWidth={1} strokeDasharray="4 4" />
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
        {showTable ? 'Ocultar Tabla' : 'Mostrar Tabla por Año de Inicio'}
      </button>

      {showTable && (
        <div className="card animate-fade-in" style={{ overflowX: 'auto', padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem', textAlign: 'center' }}>Inicio</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>Fin</th>
                <th style={{ padding: '1rem' }}>Valor Final</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>Resultado</th>
              </tr>
            </thead>
            <tbody>
              {simulations.map((sim) => (
                <tr key={sim.startYear} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>{sim.startYear}</td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>{sim.endYear}</td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 'bold' }}>{formatCurrencyFull(sim.endingValue)}</td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: sim.survived ? 'var(--accent-success)' : 'var(--accent-danger)', fontWeight: 600 }}>
                    {sim.survived ? '✓ Sobrevivió' : '✗ Falló'}
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
