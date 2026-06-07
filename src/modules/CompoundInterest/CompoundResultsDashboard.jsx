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
import { TableProperties, Download, Printer, Share2, Image } from 'lucide-react';
import AdvisorCTA from '../../components/AdvisorCTA';
import PrintReportHeader from '../../components/PrintReportHeader';
import PrintAdvisorCTA from '../../components/PrintAdvisorCTA';
import { exportChartToPNG } from '../../utils/chartExporter';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(value);
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // Ordenar de mayor a menor para mejor legibilidad en tooltip
    const sortedPayload = [...payload].sort((a, b) => b.value - a.value);

    return (
      <div className="card" style={{ padding: '1rem', border: '1px solid var(--border-color)', minWidth: '200px' }}>
        <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Año {label}</p>
        {sortedPayload.map((entry, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span style={{ color: entry.color, fontSize: '0.875rem' }}>{entry.name}:</span>
            <strong style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}>{formatCurrency(entry.value)}</strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const CompoundResultsDashboard = ({ data, varianceEnabled, onShare, inputs = {} }) => {
  const [showTable, setShowTable] = useState(false);
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
    ? 'Anual' 
    : inputs.compoundFrequency === 12 
      ? 'Mensual' 
      : inputs.compoundFrequency === 365 
        ? 'Diaria' 
        : 'Mensual';

  return (
    <div className="flex" style={{ flexDirection: 'column', gap: '2rem' }}>
      
      {/* Print-only Report Header & Parameters */}
      <PrintReportHeader 
        title="Reporte de Simulación: Interés Compuesto"
        subtitle="Ficha de Planificación de Ahorros e Inversión"
        params={[
          { label: 'Inversión Inicial', value: formatCurrency(inputs.initialInvestment) },
          { label: 'Aporte Mensual', value: formatCurrency(inputs.monthlyContribution) },
          { label: 'Horizonte Temporal', value: `${inputs.years} años` },
          { label: 'Tasa de Interés (TNA)', value: `${inputs.interestRate}%` },
          { label: 'Frecuencia de Capitalización', value: compoundFrequencyLabel },
          ...(varianceEnabled ? [
            { label: 'Rango de Variación', value: `±${inputs.varianceRange}%` }
          ] : [])
        ]}
      />
      
      {/* Summary Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(6, 182, 212, 0.05))',
        borderLeft: '4px solid var(--accent-primary)'
      }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
          Proyección final en {finalYear.year} años
        </h2>
        <p style={{ fontSize: '1.125rem' }}>
          Tendrás un balance estimado de{' '}
          <strong style={{ color: 'var(--accent-primary)' }}>
            {formatCurrency(finalYear.expected)}
          </strong>.
        </p>
        
        {varianceEnabled && (
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
            Dependiendo de la volatilidad, el resultado podría variar entre 
            <strong style={{ color: 'var(--accent-warning)', marginLeft: '0.25rem' }}>{formatCurrency(finalYear.pessimistic)}</strong> y 
            <strong style={{ color: 'var(--accent-success)', marginLeft: '0.25rem' }}>{formatCurrency(finalYear.optimistic)}</strong>.
          </p>
        )}

        <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-primary)', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)' }}>
          <h4 style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Desglose de la Inversión:</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem' }}>
            <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span>Total de Aportes de tu bolsillo:</span>
              <strong>{formatCurrency(finalYear.totalContributions)}</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--accent-primary)' }}>Interés Ganado (Estimado):</span>
              <strong style={{ color: 'var(--accent-primary)' }}>{formatCurrency(finalYear.expected - finalYear.totalContributions)}</strong>
            </li>
          </ul>
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
          onClick={() => exportChartToPNG('compound-chart-container', 'valia_interes_compuesto.png')}
          className="btn btn-outline" 
          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
        >
          <Image size={16} />
          Descargar Gráfico
        </button>
      </div>

      {/* Chart */}
      <div className="card chart-container" id="compound-chart-container">
        <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>Proyección del Crecimiento</h3>
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
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px' }} />
            
            {profitCrossoverYear && (
              <ReferenceLine 
                x={profitCrossoverYear} 
                stroke="var(--accent-success)" 
                strokeDasharray="3 3" 
                label={{ 
                  value: 'Interés > Aportes', 
                  fill: 'var(--accent-success)', 
                  position: 'top', 
                  fontSize: 11,
                  fontWeight: 500
                }} 
              />
            )}

            <Area 
              type="monotone" 
              dataKey="totalContributions" 
              name="Tus Aportes" 
              stroke="var(--text-secondary)" 
              fill="var(--bg-tertiary)" 
              strokeWidth={2}
              stackId="0"
            />

            {varianceEnabled && (
              <>
                <Area 
                  type="monotone" 
                  dataKey="optimistic" 
                  name="Escenario Optimista" 
                  stroke="var(--accent-success)" 
                  fill="none" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                <Area 
                  type="monotone" 
                  dataKey="pessimistic" 
                  name="Escenario Conservador" 
                  stroke="var(--accent-warning)" 
                  fill="none" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </>
            )}

            <Area 
              type="monotone" 
              dataKey="expected" 
              name="Rendimiento Esperado" 
              stroke="var(--accent-primary)" 
              fill="url(#colorExpected)" 
              strokeWidth={3}
            />
            <defs>
              <linearGradient id="colorExpected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
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
        {showTable ? 'Ocultar Tabla' : 'Mostrar Tabla Año por Año'}
      </button>

      {showTable && (
        <div className="card animate-fade-in" style={{ overflowX: 'auto', padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem', textAlign: 'center' }}>Año</th>
                <th style={{ padding: '1rem' }}>Total Aportado</th>
                <th style={{ padding: '1rem', color: 'var(--accent-primary)' }}>Balance Esperado</th>
                {varianceEnabled && (
                  <>
                    <th style={{ padding: '1rem', color: 'var(--accent-success)' }}>Optimista (+Var)</th>
                    <th style={{ padding: '1rem', color: 'var(--accent-warning)' }}>Conservador (-Var)</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.year} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: 500 }}>{row.year}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{formatCurrency(row.totalContributions)}</td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 'bold' }}>{formatCurrency(row.expected)}</td>
                  {varianceEnabled && (
                    <>
                      <td style={{ padding: '0.75rem 1rem' }}>{formatCurrency(row.optimistic)}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>{formatCurrency(row.pessimistic)}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdvisorCTA 
        whatsappText="Hola! Estuve proyectando mis ahorros con la calculadora de Interés Compuesto en Valia y quiero asesoramiento para poner en práctica este plan con Balanz." 
      />
      <PrintAdvisorCTA />
    </div>
  );
};

export default CompoundResultsDashboard;
