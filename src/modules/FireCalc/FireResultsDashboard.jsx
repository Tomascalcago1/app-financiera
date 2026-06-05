import React, { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import { TableProperties, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

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
            <span style={{ color: entry.color, fontSize: '0.8rem' }}>{entry.name}:</span>
            <strong style={{ fontSize: '0.8rem' }}>{formatCurrencyFull(entry.value)}</strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const FireResultsDashboard = ({ results }) => {
  const [showTable, setShowTable] = useState(false);

  if (!results) {
    return (
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: 'var(--text-secondary)' }}>
        Ingresa los datos para ejecutar la simulación.
      </div>
    );
  }

  const { successRate, totalSimulations, survivedCount, statistics, chartData, simulations } = results;
  const rateColor = successRate >= 90 ? 'var(--accent-success)' : successRate >= 75 ? 'var(--accent-warning)' : 'var(--accent-danger)';

  return (
    <div className="flex" style={{ flexDirection: 'column', gap: '2rem' }}>

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
      <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
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

      {/* Chart */}
      <div className="card" style={{ height: '420px' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>Rango de Resultados del Portafolio</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis dataKey="yearIndex" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
            <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} tickFormatter={formatCurrency} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px' }} />
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
      <div className="card" style={{ marginTop: '1rem', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))', border: '1px solid var(--accent-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>¿Listo para empezar a invertir?</h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Contactá a nuestro asesor asociado en <strong>Balanz</strong> para armar tu portafolio ideal y alcanzar tus metas financieras.</p>
        </div>
        <button className="btn btn-primary" onClick={() => alert("Acá iría el link de referido a Balanz o al WhatsApp de tu amigo")} style={{ whiteSpace: 'nowrap' }}>
          Contactar Asesor
        </button>
      </div>
    </div>
  );
};

export default FireResultsDashboard;
