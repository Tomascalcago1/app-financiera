import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { TableProperties } from 'lucide-react';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(value);
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // Sort payload by value descending to show Optimistic first, then Expected, then Pessimistic
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

const CompoundResultsDashboard = ({ data, varianceEnabled }) => {
  const [showTable, setShowTable] = useState(false);

  if (!data || data.length === 0) {
    return (
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '300px', color: 'var(--text-secondary)' }}>
        Ingresa los datos para ver la proyección.
      </div>
    );
  }

  const finalYear = data[data.length - 1];

  return (
    <div className="flex" style={{ flexDirection: 'column', gap: '2rem' }}>
      
      {/* Summary Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))',
        borderLeft: '4px solid var(--accent-primary)'
      }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
          Resultado en {finalYear.year} años
        </h2>
        <p style={{ fontSize: '1.125rem' }}>
          Tu inversión podría crecer hasta{' '}
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

      {/* Chart */}
      <div className="card" style={{ height: '400px' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>Proyección del Crecimiento</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 20, left: 20, bottom: 25 }}
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

    </div>
  );
};

export default CompoundResultsDashboard;
