import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

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
      <div className="card" style={{ padding: '1rem', border: '1px solid var(--border-color)' }}>
        <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Año {label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color, fontSize: '0.875rem' }}>
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ResultsDashboard = ({ data }) => {
  if (!data || data.length === 0) return null;

  const finalYear = data[data.length - 1];
  const buyWins = finalYear.buyNetWorth > finalYear.rentNetWorth;
  const difference = Math.abs(finalYear.buyNetWorth - finalYear.rentNetWorth);

  return (
    <div className="flex" style={{ flexDirection: 'column', gap: '2rem' }}>
      
      {/* Summary Banner */}
      <div className="card" style={{
        background: buyWins 
          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))'
          : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))',
        borderLeft: `4px solid ${buyWins ? 'var(--accent-success)' : 'var(--accent-primary)'}`
      }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
          Resultado en {finalYear.year} años
        </h2>
        <p style={{ fontSize: '1.125rem' }}>
          <strong style={{ color: buyWins ? 'var(--accent-success)' : 'var(--accent-primary)' }}>
            {buyWins ? 'Comprar' : 'Alquilar e invertir'}
          </strong> te deja con un patrimonio estimado de{' '}
          <strong style={{ color: 'var(--text-primary)' }}>
            {formatCurrency(buyWins ? finalYear.buyNetWorth : finalYear.rentNetWorth)}
          </strong>.
        </p>

        {/* Breakdown */}
        <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-primary)', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)' }}>
          <h4 style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Desglose de tu Riqueza ({buyWins ? 'Comprando' : 'Alquilando'}):</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem' }}>
            {buyWins ? (
              <>
                <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span>Inmueble (Libre de deuda):</span>
                  <strong>{formatCurrency(finalYear.propertyValue - finalYear.remainingDebt)}</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span>Capital Inicial Invertido:</span>
                  <strong>{formatCurrency(finalYear.buyBaseline)}</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--accent-success)' }}>Ahorros Mensuales Extra Invertidos:</span>
                  <strong style={{ color: 'var(--accent-success)' }}>{formatCurrency(finalYear.buySavings)}</strong>
                </li>
              </>
            ) : (
              <>
                <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span>Capital Inicial Invertido:</span>
                  <strong>{formatCurrency(finalYear.rentBaseline)}</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--accent-primary)' }}>Ahorros Mensuales Extra Invertidos:</span>
                  <strong style={{ color: 'var(--accent-primary)' }}>{formatCurrency(finalYear.rentSavings)}</strong>
                </li>
              </>
            )}
          </ul>
        </div>

        <p style={{ fontSize: '0.875rem', marginTop: '1rem', color: 'var(--text-tertiary)' }}>
          Una diferencia de {formatCurrency(difference)} a favor de {buyWins ? 'comprar' : 'alquilar'}.
        </p>
      </div>

      {/* Chart */}
      <div className="card" style={{ height: '400px' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>Evolución del Patrimonio</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
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
              tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px' }} />
            <Line 
              type="monotone" 
              name="Comprando"
              dataKey="buyNetWorth" 
              stroke="var(--accent-success)" 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              name="Alquilando"
              dataKey="rentNetWorth" 
              stroke="var(--accent-primary)" 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default ResultsDashboard;
