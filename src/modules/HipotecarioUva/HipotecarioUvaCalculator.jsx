import React, { useState, useMemo } from 'react';
import { 
  Home, 
  Settings2, 
  HelpCircle, 
  TrendingUp, 
  TrendingDown, 
  Info,
  Download,
  Printer,
  TableProperties
} from 'lucide-react';
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
import FinancialInput from '../../components/FinancialInput';
import AdvisorCTA from '../../components/AdvisorCTA';

const formatCurrency = (val) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(val);
};

const formatUva = (val) => {
  return new Intl.NumberFormat('es-AR', {
    maximumFractionDigits: 0
  }).format(val);
};

const HipotecarioUvaCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(40000000); // 40 millones de pesos por defecto
  const [years, setYears] = useState(20);
  const [interestRate, setInterestRate] = useState(5.5); // UVA + 5.5%
  const [inflationRate, setInflationRate] = useState(40); // 40% inflación anual
  const [amortizationSystem, setAmortizationSystem] = useState('french'); // 'french' | 'german'
  const [showTable, setShowTable] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const UVA_INITIAL_VALUE = 1350; // Valor del UVA al inicio de la simulación

  const simulation = useMemo(() => {
    if (!loanAmount || !years || !interestRate || years <= 0) return null;

    const principalUva = loanAmount / UVA_INITIAL_VALUE;
    const months = years * 12;
    const monthlyInterest = (interestRate / 100) / 12;
    const monthlyInflation = Math.pow(1 + (inflationRate / 100), 1 / 12) - 1;

    let balanceUva = principalUva;
    const schedule = [];
    let totalPaidPesosNominal = 0;
    let totalPaidUva = 0;

    // French System Monthly Payment Formula (Constant UVA Payment)
    const constantPaymentUva = monthlyInterest > 0 
      ? (principalUva * monthlyInterest * Math.pow(1 + monthlyInterest, months)) / (Math.pow(1 + monthlyInterest, months) - 1)
      : principalUva / months;

    for (let m = 1; m <= months; m++) {
      let interestUva = balanceUva * monthlyInterest;
      let principalAmortizedUva = 0;
      let paymentUva = 0;

      if (amortizationSystem === 'french') {
        paymentUva = constantPaymentUva;
        principalAmortizedUva = paymentUva - interestUva;
      } else {
        // German System (Constant Capital Amortization)
        principalAmortizedUva = principalUva / months;
        paymentUva = principalAmortizedUva + interestUva;
      }

      // Safeguard against last month rounding
      if (m === months) {
        principalAmortizedUva = balanceUva;
        paymentUva = principalAmortizedUva + interestUva;
      }

      balanceUva = Math.max(0, balanceUva - principalAmortizedUva);

      // Project UVA value inflation
      const uvaValue = UVA_INITIAL_VALUE * Math.pow(1 + monthlyInflation, m);
      const paymentPesosNominal = paymentUva * uvaValue;
      const paymentPesosReal = paymentUva * UVA_INITIAL_VALUE; // Adjusted back to initial purchasing power

      totalPaidPesosNominal += paymentPesosNominal;
      totalPaidUva += paymentUva;

      schedule.push({
        month: m,
        year: Math.ceil(m / 12),
        paymentUva,
        interestUva,
        principalAmortizedUva,
        balanceUva,
        uvaValue,
        paymentPesosNominal,
        paymentPesosReal
      });
    }

    // Aggregate yearly data for chart & summary table to avoid cluttering Recharts with 360 points
    const yearlyData = [];
    for (let y = 1; y <= years; y++) {
      const yearSchedule = schedule.filter(s => s.year === y);
      const endOfYear = yearSchedule[yearSchedule.length - 1];
      const sumPaymentNominal = yearSchedule.reduce((sum, s) => sum + s.paymentPesosNominal, 0);
      const avgPaymentNominal = sumPaymentNominal / yearSchedule.length;
      const sumPaymentReal = yearSchedule.reduce((sum, s) => sum + s.paymentPesosReal, 0);
      const avgPaymentReal = sumPaymentReal / yearSchedule.length;

      yearlyData.push({
        year: y,
        cuotaPromedioPesosNominal: Math.round(avgPaymentNominal),
        cuotaPromedioPesosReal: Math.round(avgPaymentReal),
        saldoUva: endOfYear.balanceUva,
        saldoPesosNominal: endOfYear.balanceUva * endOfYear.uvaValue
      });
    }

    return {
      principalUva,
      schedule,
      yearlyData,
      totalPaidPesosNominal: Math.round(totalPaidPesosNominal),
      totalPaidPesosReal: Math.round(totalPaidUva * UVA_INITIAL_VALUE),
      totalInterestUva: totalPaidUva - principalUva,
      initialMonthlyPayment: schedule[0].paymentPesosNominal
    };
  }, [loanAmount, years, interestRate, inflationRate, amortizationSystem]);

  const exportToCSV = () => {
    if (!simulation) return;
    const headers = ['Año', 'Cuota Promedio Pesos Nominal', 'Cuota Promedio Pesos Real (Poder de Compra Inicial)', 'Saldo Restante UVA', 'Saldo Restante Pesos Nominal'];
    const rows = simulation.yearlyData.map(row => [
      row.year,
      row.cuotaPromedioPesosNominal,
      row.cuotaPromedioPesosReal,
      Math.round(row.saldoUva),
      Math.round(row.saldoPesosNominal)
    ]);
    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `valia_hipotecario_uva_${years}_anos.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="card" style={{ padding: '1rem', border: '1px solid var(--border-color)', minWidth: '220px' }}>
          <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Año {label}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#38bdf8' }}>Cuota Nominal (Con Inflación):</span>
            <strong style={{ fontSize: '0.85rem' }}>{formatCurrency(payload[0].value)}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#10b981' }}>Cuota Real (En Pesos de Hoy):</span>
            <strong style={{ fontSize: '0.85rem' }}>{formatCurrency(payload[1].value)}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginTop: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.25rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Saldo Restante:</span>
            <strong style={{ fontSize: '0.8rem' }}>{formatCurrency(payload[0].payload.saldoPesosNominal)}</strong>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <header className="calculator-header">
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Home size={32} className="text-accent-primary" />
          Créditos Hipotecarios UVA
        </h1>
        <p>Simulá cuotas y amortización en Pesos e indexación UVA (Unidad de Valor Adquisitivo).</p>
        <button onClick={() => setIsHelpOpen(true)} className="help-btn">
          <HelpCircle size={18} className="text-accent-primary" />
          ¿Cómo funcionan los créditos UVA?
        </button>
      </header>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        {/* Input panel */}
        <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '0.5rem' }}>
            Datos del Préstamo
          </h2>
          
          <FinancialInput 
            label="Monto Solicitado" 
            value={loanAmount} 
            onChange={setLoanAmount} 
            prefix="$" 
            step={1000000} 
          />
          
          <FinancialInput 
            label="Plazo de Pago" 
            value={years} 
            onChange={setYears} 
            suffix="años" 
            min={5} 
            max={30} 
          />

          <FinancialInput 
            label="Tasa Nominal Anual Fija (UVA + %)" 
            value={interestRate} 
            onChange={setInterestRate} 
            suffix="%" 
            step={0.1} 
          />

          <FinancialInput 
            label="Inflación Anual Estimada" 
            value={inflationRate} 
            onChange={setInflationRate} 
            suffix="%" 
            step={1} 
          />

          <div className="input-group">
            <label className="input-label">Sistema de Amortización</label>
            <select 
              className="input-field" 
              value={amortizationSystem} 
              onChange={e => setAmortizationSystem(e.target.value)}
              style={{ appearance: 'auto' }}
            >
              <option value="french">Sistema Francés (Cuota UVA Constante)</option>
              <option value="german">Sistema Alemán (Amortización UVA Constante)</option>
            </select>
          </div>
        </div>

        {/* Results Panel */}
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', animationDelay: '100ms' }}>
          {!simulation ? (
            <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: 'var(--text-secondary)' }}>
              Completá los campos del simulador para calcular el préstamo.
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="card" style={{
                textAlign: 'center',
                borderTop: '4px solid var(--accent-primary)',
                background: 'linear-gradient(180deg, rgba(6, 182, 212, 0.05), transparent)'
              }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Primera Cuota Proyectada</p>
                <p style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
                  {formatCurrency(simulation.initialMonthlyPayment)}
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>
                  Equivalente a {formatUva(simulation.principalUva / (years * 12))} UVAs iniciales.
                </p>
              </div>

              <div className="stats-grid">
                <div className="card" style={{ textAlign: 'center' }}>
                  <TrendingDown size={20} className="text-accent-primary" style={{ marginBottom: '0.5rem' }} />
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Monto Solicitado</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>{formatCurrency(loanAmount)}</p>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                  <TrendingUp size={20} style={{ color: 'var(--accent-success)', marginBottom: '0.5rem' }} />
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total Pagado en UVA (Val. Hoy)</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-success)' }}>
                    {formatCurrency(simulation.totalPaidPesosReal)}
                  </p>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                  <TrendingUp size={20} style={{ color: 'var(--accent-warning)', marginBottom: '0.5rem' }} />
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total Nominal (Con Inflación)</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-warning)' }}>
                    {formatCurrency(simulation.totalPaidPesosNominal)}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
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
                  onClick={() => window.print()}
                  className="btn btn-outline" 
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                  <Printer size={16} />
                  Imprimir Reporte
                </button>
              </div>

              {/* Chart */}
              <div className="card chart-container">
                <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>Evolución de la Cuota Mensual Proyectada</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={simulation.yearlyData} margin={{ top: 15, right: 20, left: 10, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                    <XAxis dataKey="year" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} label={{ value: 'Año', position: 'bottom', fill: 'var(--text-secondary)', offset: 10 }} />
                    <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} tickFormatter={(v) => `$${(v / 1e3).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px' }} />
                    <Line type="monotone" dataKey="cuotaPromedioPesosNominal" name="Cuota Proyectada (Pesos Nominales)" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="cuotaPromedioPesosReal" name="Cuota Ajustada (Poder Compra Constante)" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Table toggle */}
              <button className="btn btn-outline" onClick={() => setShowTable(!showTable)} style={{ alignSelf: 'flex-start' }}>
                <TableProperties size={18} />
                {showTable ? 'Ocultar Tabla' : 'Ver Tabla de Amortización Anual'}
              </button>

              {showTable && (
                <div className="card animate-fade-in" style={{ overflowX: 'auto', padding: 0 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                        <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Año</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Cuota Nominal (Prom.)</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Cuota Real (Prom.)</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Saldo Restante (UVA)</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Saldo Restante (Pesos)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {simulation.yearlyData.map((row) => (
                        <tr key={row.year} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '0.6rem 1rem', textAlign: 'center', fontWeight: '500' }}>{row.year}</td>
                          <td style={{ padding: '0.6rem 1rem', color: '#38bdf8' }}>{formatCurrency(row.cuotaPromedioPesosNominal)}</td>
                          <td style={{ padding: '0.6rem 1rem', color: '#10b981' }}>{formatCurrency(row.cuotaPromedioPesosReal)}</td>
                          <td style={{ padding: '0.6rem 1rem' }}>{formatUva(row.saldoUva)}</td>
                          <td style={{ padding: '0.6rem 1rem', fontWeight: 'bold' }}>{formatCurrency(row.saldoPesosNominal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Advisor CTA */}
              <AdvisorCTA 
                title="¿Querés asesoramiento para calificar a un crédito UVA?"
                description="Hablá con nuestro asesor en Balanz para evaluar cómo armar tu portafolio de inversión y generar los avales necesarios para adquirir tu vivienda."
                whatsappText={`Hola! Estuve simulando un crédito hipotecario UVA en Valia por un monto de ${formatCurrency(loanAmount)} a ${years} años y me gustaría recibir asesoramiento financiero.`}
              />
            </>
          )}
        </div>
      </div>

      <HelpModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)}
        title="¿Cómo funcionan los créditos UVA en Argentina?"
      >
        <p>
          Los créditos **UVA (Unidad de Valor Adquisitivo)** son préstamos hipotecarios donde el capital se convierte a unidades de compra indexadas por el **coeficiente CER** (basado en la inflación oficial del INDEC).
        </p>

        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>1. La Indexación del UVA</h3>
        <p>
          Cuando tomás un crédito UVA, tu deuda no está expresada en pesos, sino en cantidad de UVAs. Cada mes debés pagar una cantidad determinada de UVAs. 
          Como el valor de la UVA se ajusta diariamente según la inflación, **el monto en pesos de la cuota sube de la mano del costo de vida**.
        </p>

        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>2. Sistema Francés vs Sistema Alemán</h3>
        <p>
          - **Sistema Francés (Amortización Variable):** Es el más común. La cuota mensual medida en UVAs es siempre la misma. En pesos, la cuota sube exactamente igual que la inflación. El interés decrece a lo largo de los años y el capital se amortiza más rápido al final.
          - **Sistema Alemán (Amortización Constante):** La porción de capital que pagás en UVA es igual todos los meses. Los intereses en UVA van bajando. Por lo tanto, la cuota en UVA va bajando mes a mes. En pesos, la cuota subirá por la inflación, pero a un ritmo menor que en el sistema Francés debido a que debés menos capital real cada mes.
        </p>

        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>3. Riesgos y Tasa de Interés</h3>
        <p>
          La tasa de interés del crédito se compone de **UVA + un porcentaje fijo** (ej: 5.5%). El mayor riesgo del crédito UVA es que las cuotas y el capital en pesos suben con la inflación. Si los salarios no acompañan la inflación en determinados años, el pago mensual puede demandar un porcentaje mayor de tus ingresos mensuales.
        </p>
      </HelpModal>
    </div>
  );
};

// Simple HelpModal inline definition or fallback (to keep file self-contained in imports)
const HelpModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }} onClick={onClose}>
      <div className="card" style={{
        maxWidth: '550px',
        width: '100%',
        maxHeight: '85vh',
        overflowY: 'auto',
        backgroundColor: '#0f172a',
        border: '1px solid var(--border-color)',
        padding: '2rem',
        position: 'relative'
      }} onClick={e => e.stopPropagation()}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>{title}</h2>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {children}
        </div>
        <button 
          onClick={onClose} 
          className="btn btn-primary" 
          style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center' }}
        >
          Entendido
        </button>
      </div>
    </div>
  );
};

export default HipotecarioUvaCalculator;
