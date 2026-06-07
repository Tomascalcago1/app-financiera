import React, { useState } from 'react';
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
import { TableProperties, Download, Printer } from 'lucide-react';
import AdvisorCTA from '../../components/AdvisorCTA';
import PrintReportHeader from '../../components/PrintReportHeader';
import PrintAdvisorCTA from '../../components/PrintAdvisorCTA';

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

const SavingsGoalDashboard = ({ data, requiredContribution, goalAmount, inputs = {} }) => {
  const [showTable, setShowTable] = useState(false);

  if (!data || data.length === 0) {
    return (
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '300px', color: 'var(--text-secondary)' }}>
        Ingresa los datos para ver la proyección.
      </div>
    );
  }

  const finalYear = data[data.length - 1];

  const exportToCSV = () => {
    const headers = ['Año', 'Total Aportado', 'Balance Acumulado'];
    const rows = data.map(row => [
      row.year,
      row.totalContributions,
      row.expected
    ]);
    
    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `valia_objetivo_ahorro_${finalYear.year}_anos.csv`);
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
        title="Reporte de Simulación: Objetivo de Ahorro"
        subtitle="Ficha de Planificación de Metas de Ahorro"
        params={[
          { label: 'Monto de la Meta', value: formatCurrency(inputs.goalAmount) },
          { label: 'Ahorros Iniciales', value: formatCurrency(inputs.initialInvestment) },
          { label: 'Plazo Deseado', value: `${inputs.years} años` },
          { label: 'Tasa de Interés Estimada (TNA)', value: `${inputs.interestRate}%` },
          { label: 'Aporte Mensual Requerido', value: requiredContribution > 0 ? formatCurrency(requiredContribution) : 'No requiere aportes adicionales' }
        ]}
      />
      
      {/* Summary Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))',
        borderLeft: '4px solid var(--accent-success)'
      }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
          Resultado de tu Meta
        </h2>
        {requiredContribution > 0 ? (
          <p style={{ fontSize: '1.125rem' }}>
            Para alcanzar tu meta de <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(goalAmount)}</strong> en {finalYear.year} años, 
            necesitás aportar <strong style={{ color: 'var(--accent-success)' }}>{formatCurrency(requiredContribution)}</strong> por mes.
          </p>
        ) : (
          <p style={{ fontSize: '1.125rem', color: 'var(--accent-success)' }}>
            ¡Tu inversión inicial ya supera tu objetivo de ahorro! No necesitás realizar aportes mensuales adicionales.
          </p>
        )}

        <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-primary)', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)' }}>
          <h4 style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Desglose de la Meta:</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem' }}>
            <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span>Total que pondrás de tu bolsillo:</span>
              <strong>{formatCurrency(finalYear.totalContributions)}</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--accent-success)' }}>Dinero generado por intereses:</span>
              <strong style={{ color: 'var(--accent-success)' }}>{formatCurrency(finalYear.expected - finalYear.totalContributions)}</strong>
            </li>
          </ul>
        </div>
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

      {/* Chart */}
      <div className="card chart-container">
        <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>Evolución del Plan de Ahorro</h3>
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
            
            <ReferenceLine 
              y={goalAmount} 
              stroke="var(--accent-success)" 
              strokeDasharray="4 4" 
              label={{ 
                value: `Meta: ${formatCurrency(goalAmount)}`, 
                fill: 'var(--accent-success)', 
                position: 'top',
                fontSize: 11,
                fontWeight: 500
              }} 
            />

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
              name="Balance Acumulado" 
              stroke="var(--accent-success)" 
              fill="url(#colorExpectedGoal)" 
              strokeWidth={3}
            />
            <defs>
              <linearGradient id="colorExpectedGoal" x1="0" y1="0" x2="0" y2="1">
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

      <AdvisorCTA 
        whatsappText="Hola! Calculé mi meta de ahorro en Valia y me gustaría contactar a un asesor de Balanz para elegir los mejores fondos comunes de inversión." 
      />
      <PrintAdvisorCTA />
    </div>
  );
};

export default SavingsGoalDashboard;
