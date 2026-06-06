import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from 'recharts';
import { Download, Printer } from 'lucide-react';

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(value);

const ChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="card" style={{ padding: '0.75rem 1rem', border: '1px solid var(--border-color)' }}>
        <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Año {label}</p>
        <p style={{ fontSize: '0.875rem', color: 'var(--accent-success)' }}>
          Equivalente: {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const InflationDashboard = ({ result, chartData, amount, fromYear, toYear, annualRate }) => {
  if (!result) {
    return (
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px', color: 'var(--text-secondary)' }}>
        Selecciona los años para ver el resultado.
      </div>
    );
  }

  const futureYears = 10;
  const purchasingPowerIn10 = amount * Math.pow(1 / (1 + (annualRate / 100)), futureYears);

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
      <div className="print-only-section">
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem', color: '#0f172a' }}>Reporte Financiero: Inflación Histórica</h2>
        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Generado por Valia (valia-finanzas.vercel.app) el {new Date().toLocaleDateString('es-AR')}</p>
        
        <div className="print-params-grid">
          <div><strong>Monto Inicial:</strong> {formatCurrency(amount)}</div>
          <div><strong>Desde el Año:</strong> {fromYear}</div>
          <div><strong>Hasta el Año:</strong> {toYear}</div>
          <div><strong>Tasa de Inflación Utilizada:</strong> {annualRate.toFixed(2)}%</div>
        </div>
      </div>

      {/* Main Result */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))',
        borderLeft: '4px solid var(--accent-success)'
      }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Resultado</h2>
        <p style={{ fontSize: '1.25rem' }}>
          <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(amount)}</strong> en{' '}
          <strong>{fromYear}</strong> equivale a{' '}
          <strong style={{ color: 'var(--accent-success)', fontSize: '1.5rem' }}>{formatCurrency(result.equivalentValue)}</strong> en{' '}
          <strong>{toYear}</strong>.
        </p>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Inflación Total</p>
            <p style={{ fontSize: '1.125rem', fontWeight: 600 }}>{result.totalInflationPercent.toFixed(2)}%</p>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Tasa Promedio Anual</p>
            <p style={{ fontSize: '1.125rem', fontWeight: 600 }}>{result.averageAnnualRate.toFixed(2)}%</p>
          </div>
        </div>
      </div>

      {/* Future Projection */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05))',
        borderLeft: '4px solid var(--accent-warning)'
      }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Proyección Futura</h3>
        <p style={{ fontSize: '0.95rem' }}>
          Si la inflación continúa al <strong>{annualRate.toFixed(2)}%</strong> anual,{' '}
          <strong>{formatCurrency(amount)}</strong> de hoy solo comprará el equivalente a{' '}
          <strong style={{ color: 'var(--accent-warning)' }}>{formatCurrency(purchasingPowerIn10)}</strong> en bienes dentro de {futureYears} años.
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
      </div>

      {/* Large Historical Chart */}
      {chartData && chartData.length > 0 && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
            Valor de $100 de 1635 ajustado por inflación
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '1rem' }}>
            Muestra cómo $100 de 1635 habrían crecido en términos nominales hasta hoy.
          </p>
          <div className="chart-container-large">
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
      )}
    </div>
  );
};

export default InflationDashboard;
