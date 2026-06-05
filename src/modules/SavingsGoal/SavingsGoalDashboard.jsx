import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  Line,
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
    return (
      <div className="card" style={{ padding: '1rem', border: '1px solid var(--border-color)', minWidth: '200px' }}>
        <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Año {label}</p>
        {payload.map((entry, index) => (
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

const SavingsGoalDashboard = ({ data, requiredContribution, goalAmount }) => {
  const [showTable, setShowTable] = useState(false);

  if (!data || data.length === 0) {
    return (
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '300px', color: 'var(--text-secondary)' }}>
        Ingresa tu objetivo y plazo para ver el resultado.
      </div>
    );
  }

  const isAchievable = requiredContribution > 0 || data[0].expected >= goalAmount;

  return (
    <div className="flex" style={{ flexDirection: 'column', gap: '2rem' }}>
      
      {/* Summary Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))',
        borderLeft: '4px solid var(--accent-success)'
      }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
          Tu Plan de Ahorro
        </h2>
        
        {data[0].expected >= goalAmount ? (
          <p style={{ fontSize: '1.125rem' }}>
            ¡Tu capital inicial ya alcanzó la meta de <strong style={{ color: 'var(--accent-success)' }}>{formatCurrency(goalAmount)}</strong>! No necesitas realizar aportes mensuales.
          </p>
        ) : (
          <p style={{ fontSize: '1.125rem' }}>
            Para llegar a {formatCurrency(goalAmount)}, necesitas aportar{' '}
            <strong style={{ color: 'var(--accent-success)', fontSize: '1.5rem' }}>
              {formatCurrency(requiredContribution)}
            </strong> por mes.
          </p>
        )}
      </div>

      {/* Chart */}
      <div className="card chart-container">
        <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>El camino hacia tu objetivo</h3>
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

            <Area 
              type="monotone" 
              dataKey="expected" 
              name="Patrimonio Proyectado" 
              stroke="var(--accent-success)" 
              fill="url(#colorExpectedSavings)" 
              strokeWidth={3}
            />

            {/* Goal Line (Dotted) */}
            <Line 
              type="monotone" 
              dataKey="goal" 
              name="Tu Meta" 
              stroke="var(--accent-warning)" 
              strokeWidth={2} 
              strokeDasharray="5 5" 
              dot={false}
              activeDot={false}
            />

            <defs>
              <linearGradient id="colorExpectedSavings" x1="0" y1="0" x2="0" y2="1">
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
        {showTable ? 'Ocultar Tabla' : 'Mostrar Tabla Año por Año'}
      </button>

      {showTable && (
        <div className="card animate-fade-in" style={{ overflowX: 'auto', padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem', textAlign: 'center' }}>Año</th>
                <th style={{ padding: '1rem' }}>Total Aportado</th>
                <th style={{ padding: '1rem', color: 'var(--accent-success)' }}>Balance Acumulado</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.year} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: 500 }}>{row.year}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{formatCurrency(row.totalContributions)}</td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 'bold' }}>{formatCurrency(row.expected)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default SavingsGoalDashboard;
