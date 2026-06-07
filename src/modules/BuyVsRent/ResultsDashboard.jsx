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
import { Download, Printer } from 'lucide-react';
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

const ResultsDashboard = ({ data, inputs = {} }) => {
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
    const headers = ['Año', 'Patrimonio Comprando (Net Worth)', 'Patrimonio Alquilando (Net Worth)', 'Valor Propiedad', 'Deuda Hipoteca'];
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
    link.setAttribute("download", `valia_comprar_vs_alquilar_${finalYear.year}_anos.csv`);
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
        title="Reporte de Simulación: ¿Comprar o Alquilar?"
        subtitle="Ficha de Planificación Inmobiliaria"
        params={[
          { label: 'Precio de la Propiedad', value: formatCurrency(inputs.propertyPrice) },
          { label: 'Capital Inicial (Ahorros)', value: formatCurrency(inputs.initialCapital) },
          { label: 'Alquiler Mensual Inicial', value: formatCurrency(inputs.monthlyRent) },
          { label: 'Horizonte Temporal', value: `${inputs.years} años` },
          { label: 'Inflación Anual Estimada', value: `${inputs.inflationRate}%` },
          { label: 'Rendimiento Inversión (TNA)', value: `${inputs.investmentReturn}%` },
          { label: 'Apreciación Anual Propiedad', value: `${inputs.propertyAppreciation}%` },
          { label: 'Mantenimiento Anual Propiedad', value: `${inputs.maintenanceRate}%` },
          ...(inputs.propertyPrice > inputs.initialCapital ? [
            { label: 'Tasa Hipotecaria (Anual)', value: `${inputs.mortgageRate}%` },
            { label: 'Plazo de Hipoteca', value: `${inputs.mortgageYears} años` }
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
        <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>Evolución del Patrimonio</h3>
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
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px' }} />
            
            {crossoverYear && (
              <ReferenceLine 
                x={crossoverYear} 
                stroke="var(--accent-warning)" 
                strokeDasharray="3 3" 
                label={{ 
                  value: `Cruce: Año ${crossoverYear}`, 
                  fill: 'var(--accent-warning)', 
                  position: 'top', 
                  fontSize: 11,
                  fontWeight: 500
                }} 
              />
            )}

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

      <PrintAdvisorCTA />
    </div>
  );
};

export default ResultsDashboard;
