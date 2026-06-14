import React, { useState, useMemo, useEffect } from 'react';
import { 
  Percent, 
  HelpCircle, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Printer, 
  Share2, 
  Image,
  AlertTriangle,
  Scale
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import FinancialInput from '../../components/FinancialInput';
import AdvisorCTA from '../../components/AdvisorCTA';
import HelpModal from '../../components/HelpModal';
import PrintReportHeader from '../../components/PrintReportHeader';
import PrintAdvisorCTA from '../../components/PrintAdvisorCTA';
import { exportChartToPNG } from '../../utils/chartExporter';

const formatCurrency = (val) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(val);
};

const InstallmentsVsCashCalculator = () => {
  const queryParams = new URLSearchParams(window.location.search);
  
  // Parámetros iniciales desde la URL o valores por defecto
  const [cashPrice, setCashPrice] = useState(() => {
    const val = queryParams.get('cash');
    return val ? Number(val) : 100000;
  });
  const [cashDiscount, setCashDiscount] = useState(() => {
    const val = queryParams.get('disc');
    return val ? Number(val) : 10; // 10% de descuento por defecto
  });
  const [listPrice, setListPrice] = useState(() => {
    const val = queryParams.get('list');
    return val ? Number(val) : 100000;
  });
  const [installmentsCount, setInstallmentsCount] = useState(() => {
    const val = queryParams.get('installments');
    return val ? Number(val) : 6;
  });
  const [monthlyInflation, setMonthlyInflation] = useState(() => {
    const val = queryParams.get('infl');
    return val ? Number(val) : 4.0; // 4% mensual estimado
  });
  const [investmentTna, setInvestmentTna] = useState(() => {
    const val = queryParams.get('tna');
    return val ? Number(val) : 35; // 35% TNA de plazo fijo o billetera digital
  });

  const [shareCopied, setShareCopied] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Lógica de simulación y cálculos
  const simulation = useMemo(() => {
    const actualCashPrice = cashPrice * (1 - cashDiscount / 100);
    const installmentValue = listPrice / installmentsCount;
    
    // Tasas mensuales
    const inflationRateMonthly = monthlyInflation / 100;
    const investmentRateMonthly = (investmentTna / 100) / 12;

    let totalVp = 0;
    let investmentBalance = actualCashPrice;
    const monthlyData = [];

    // Mes 0 (Situación Inicial)
    monthlyData.push({
      month: 'Inicio',
      installmentNominal: 0,
      installmentReal: 0,
      investmentBalance: Math.round(actualCashPrice),
      totalPaidNominal: 0
    });

    let totalPaidNominal = 0;

    for (let m = 1; m <= installmentsCount; m++) {
      // 1. Cálculo del valor presente (descontado por inflación)
      const vpCuota = installmentValue / Math.pow(1 + inflationRateMonthly, m);
      totalVp += vpCuota;

      // 2. Simulación de la cuenta de inversión
      // El saldo rinde intereses durante el mes y al final se paga la cuota
      const interestEarned = investmentBalance * investmentRateMonthly;
      investmentBalance = investmentBalance + interestEarned - installmentValue;
      totalPaidNominal += installmentValue;

      monthlyData.push({
        month: `Mes ${m}`,
        installmentNominal: Math.round(installmentValue),
        installmentReal: Math.round(vpCuota),
        investmentBalance: Math.round(investmentBalance),
        totalPaidNominal: Math.round(totalPaidNominal)
      });
    }

    const differenceVp = actualCashPrice - totalVp;
    // Si el valor presente de las cuotas es menor que el precio de contado, conviene cuotas
    const installmentsWinByVp = totalVp < actualCashPrice;
    
    // Si el saldo de inversión final es positivo, significa que ganamos dinero invirtiendo y pagando en cuotas
    const installmentsWinByInvestment = investmentBalance > 0;
    
    // Criterio de recomendación unificado (si conviene Financiar o Efectivo)
    // Usamos el enfoque de valor presente por inflación que es el más puro conceptualmente
    const recommendInstallments = installmentsWinByVp;
    const finalSavings = Math.abs(differenceVp);

    // Calcular tasa de recargo nominal si hay recargo
    const surchargePercent = ((listPrice - actualCashPrice) / actualCashPrice) * 100;

    return {
      actualCashPrice,
      installmentValue,
      totalVp,
      differenceVp,
      finalInvestmentBalance: Math.round(investmentBalance),
      recommendInstallments,
      finalSavings,
      monthlyData,
      surchargePercent,
      installmentsWinByInvestment
    };
  }, [cashPrice, cashDiscount, listPrice, installmentsCount, monthlyInflation, investmentTna]);

  // Serialización URL
  const handleShare = () => {
    const params = new URLSearchParams();
    params.set('tab', 'herramientas');
    params.set('tool', 'installments-vs-cash');
    params.set('cash', cashPrice.toString());
    params.set('disc', cashDiscount.toString());
    params.set('list', listPrice.toString());
    params.set('installments', installmentsCount.toString());
    params.set('infl', monthlyInflation.toString());
    params.set('tna', investmentTna.toString());

    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(url).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    });
  };

  // Exportar a CSV
  const exportToCSV = () => {
    const headers = ['Mes', 'Cuota Nominal (ARS)', 'Cuota Real (Ajustada ARS)', 'Saldo de Inversion (ARS)', 'Total Pagado Acumulado (ARS)'];
    const rows = simulation.monthlyData.map(row => [
      row.month,
      row.installmentNominal,
      row.installmentReal,
      row.investmentBalance,
      row.totalPaidNominal
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `valia_cuotas_vs_efectivo_${installmentsCount}_cuotas.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 0' }}>
      
      {/* Header */}
      <header className="calculator-header">
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Scale size={32} className="text-accent-primary" />
          ¿Cuotas o Efectivo?
        </h1>
        <p>Compará financieramente si te conviene pagar al contado con descuento o financiar en cuotas fijas en pesos.</p>
        <button onClick={() => setIsHelpOpen(true)} className="help-btn">
          <HelpCircle size={18} className="text-accent-primary" />
          ¿Cómo evaluar si conviene pagar en cuotas?
        </button>
      </header>

      {/* Grid Layout */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '2rem', alignItems: 'start' }}>
        
        {/* Input Panel */}
        <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '0.25rem' }}>
            Datos del Producto
          </h2>

          <FinancialInput 
            label="Precio de Lista (Pesos)"
            value={cashPrice}
            onChange={setCashPrice}
            prefix="$"
            step={10000}
          />

          <FinancialInput 
            label="Descuento por Pago Contado (%)"
            value={cashDiscount}
            onChange={setCashDiscount}
            suffix="%"
            step={5}
            min={0}
            max={100}
          />

          <div className="card" style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Precio Contado Real a Pagar:</span>
            <strong style={{ display: 'block', fontSize: '1.2rem', color: 'var(--accent-success)' }}>
              {formatCurrency(simulation.actualCashPrice)}
            </strong>
          </div>

          <FinancialInput 
            label="Precio Total Financiado en Cuotas (Pesos)"
            value={listPrice}
            onChange={setListPrice}
            prefix="$"
            step={10000}
          />

          <div className="input-group">
            <label className="input-label">Cantidad de Cuotas Fijas</label>
            <select 
              className="input-field" 
              value={installmentsCount} 
              onChange={e => setInstallmentsCount(Number(e.target.value))}
              style={{ appearance: 'auto' }}
            >
              {[3, 6, 9, 12, 18, 24].map(num => (
                <option key={num} value={num}>{num} Cuotas Fijas</option>
              ))}
            </select>
          </div>

          <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginTop: '1rem', marginBottom: '0.25rem' }}>
            Contexto Económico
          </h2>

          <FinancialInput 
            label="Inflación Mensual Estimada (%)"
            value={monthlyInflation}
            onChange={setMonthlyInflation}
            suffix="%"
            step={0.5}
            min={0}
          />

          <FinancialInput 
            label="Tasa de Inversión Alternativa (TNA %)"
            value={investmentTna}
            onChange={setInvestmentTna}
            suffix="%"
            step={1}
            min={0}
          />
        </div>

        {/* Results Panel */}
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', animationDelay: '100ms' }}>
          
          {/* Print Headers & Parameter Table (Print Only) */}
          <PrintReportHeader 
            title="Reporte de Simulación: ¿Cuotas o Contado?"
            subtitle="Ficha de Planificación de Consumo y Financiación"
            params={[
              { label: 'Precio Contado (Lista)', value: formatCurrency(cashPrice) },
              { label: 'Descuento por Contado', value: `${cashDiscount}%` },
              { label: 'Precio Contado Real', value: formatCurrency(simulation.actualCashPrice) },
              { label: 'Total Financiado', value: formatCurrency(listPrice) },
              { label: 'Cantidad de Cuotas', value: `${installmentsCount} cuotas` },
              { label: 'Valor de cada Cuota', value: formatCurrency(simulation.installmentValue) },
              { label: 'Inflación Mensual Estimada', value: `${monthlyInflation}%` },
              { label: 'Tasa Remunerada de Inversión (TNA)', value: `${investmentTna}%` }
            ]}
          />

          {/* 1. Winner Banner Card */}
          <div className="card" style={{
            textAlign: 'center',
            borderTop: `4px solid ${simulation.recommendInstallments ? 'var(--accent-success)' : 'var(--accent-primary)'}`,
            background: `linear-gradient(180deg, ${simulation.recommendInstallments ? 'rgba(16, 185, 129, 0.05)' : 'rgba(6, 182, 212, 0.05)'}, transparent)`
          }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Opción Financieramente Recomendada</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
              {simulation.recommendInstallments ? '¡Conviene Cuotas!' : 'Conviene Efectivo / Contado'}
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              {simulation.recommendInstallments 
                ? 'Pagar en cuotas te genera un ahorro real estimado de ' 
                : 'Pagar de contado te genera un ahorro real estimado de '}
              <strong style={{ color: simulation.recommendInstallments ? 'var(--accent-success)' : 'var(--accent-primary)' }}>
                {formatCurrency(simulation.finalSavings)}
              </strong> en términos de valor presente.
            </p>
          </div>

          {/* 2. Surcharge alert if listing price is higher than cash */}
          {simulation.surchargePercent > 0 && (
            <div className="card" style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'start',
              border: '1px solid var(--border-color)',
              backgroundColor: 'rgba(30, 41, 59, 0.4)'
            }}>
              <AlertTriangle className="text-accent-warning" size={24} style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  Recargo por Financiación: {simulation.surchargePercent.toFixed(1)}%
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  El comercio aplica un recargo del **{simulation.surchargePercent.toFixed(1)}%** al pagar en cuotas respecto al precio de contado. 
                  Aun así, {simulation.recommendInstallments ? 'la inflación licúa este costo haciendo que convengan las cuotas.' : 'el recargo supera el efecto de la inflación y por eso te conviene pagar al contado.'}
                </p>
              </div>
            </div>
          )}

          {/* 3. Detailed stats cards */}
          <div className="stats-grid">
            <div className="card" style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Valor Nominal de la Cuota</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>{formatCurrency(simulation.installmentValue)}</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Saldo Final Inversión Proyectado</p>
              <p style={{ 
                fontSize: '1.25rem', 
                fontWeight: 700, 
                color: simulation.finalInvestmentBalance >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)' 
              }}>
                {formatCurrency(simulation.finalInvestmentBalance)}
              </p>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>
                {simulation.finalInvestmentBalance >= 0 ? 'Excedente a favor' : 'Agotado en el mes ' + simulation.monthlyData.findIndex(m => m.investmentBalance < 0)}
              </span>
            </div>
          </div>

          {/* 4. Action buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap', marginTop: '-1rem' }}>
            <button 
              onClick={handleShare}
              className="btn btn-outline" 
              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            >
              <Share2 size={16} />
              {shareCopied ? '¡Copiado!' : 'Compartir Simulación'}
            </button>
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
              Imprimir Ficha
            </button>
            <button 
              onClick={() => exportChartToPNG('installments-chart-container', 'valia_cuotas_vs_efectivo.png')}
              className="btn btn-outline" 
              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            >
              <Image size={16} />
              Descargar Gráfico
            </button>
          </div>

          {/* 5. Chart */}
          <div className="card chart-container" id="installments-chart-container">
            <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>Evolución Proyectada de la Inversión</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={simulation.monthlyData}
                margin={{ top: 15, right: 20, left: 10, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
                <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={value => [formatCurrency(value), 'Saldo Cuenta']} />
                <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar name="Saldo Remanente de Inversión (ARS)" dataKey="investmentBalance" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 6. Detailed Table */}
          <div className="card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
            <h3 style={{ fontSize: '1.05rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Flujo Mensual Detallado
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'right' }}>
              <thead>
                <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'center' }}>Período</th>
                  <th style={{ padding: '0.75rem' }}>Cuota Nominal</th>
                  <th style={{ padding: '0.75rem' }}>Cuota Valor Real</th>
                  <th style={{ padding: '0.75rem' }}>Saldo Inversión</th>
                  <th style={{ padding: '0.75rem' }}>Pago Acumulado</th>
                </tr>
              </thead>
              <tbody>
                {simulation.monthlyData.map((row, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.6rem 0.75rem', textAlign: 'center', fontWeight: 500 }}>{row.month}</td>
                    <td style={{ padding: '0.6rem 0.75rem', color: 'var(--text-primary)' }}>
                      {index === 0 ? '-' : formatCurrency(row.installmentNominal)}
                    </td>
                    <td style={{ padding: '0.6rem 0.75rem', color: 'var(--accent-warning)' }}>
                      {index === 0 ? '-' : formatCurrency(row.installmentReal)}
                    </td>
                    <td style={{ 
                      padding: '0.6rem 0.75rem', 
                      fontWeight: 600,
                      color: row.investmentBalance >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)' 
                    }}>
                      {formatCurrency(row.investmentBalance)}
                    </td>
                    <td style={{ padding: '0.6rem 0.75rem', color: 'var(--text-tertiary)' }}>
                      {index === 0 ? '-' : formatCurrency(row.totalPaidNominal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Advisory print CTA */}
          <PrintAdvisorCTA />
        </div>
      </div>

      {/* Guía SEO y Contexto Financiero */}
      <section className="card animate-fade-in" style={{ marginTop: '3rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', animationDelay: '200ms' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          Guía de Compra: ¿Cómo elegir entre Cuotas Fijas o Pago Contado en Argentina?
        </h2>
        <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          En contextos económicos inflacionarios, la decisión de realizar compras en cuotas fijas o pagar al contado con un descuento requiere una evaluación matemática rigurosa del valor del dinero en el tiempo. Para tomar la mejor decisión, analizamos tres variables financieras clave.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>El Efecto Licuación de la Inflación</h3>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0, color: 'var(--text-secondary)' }}>
              Una cuota fija de valor nominal idéntico representa un costo real decreciente mes a mes debido a la inflación. Al descontar la inflación mensual proyectada a cada período, calculamos el Costo Financiero Total real del plan y lo comparamos de forma transparente con el desembolso único en efectivo.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Tasa Nominal Anual (TNA) de Oportunidad</h3>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0, color: 'var(--text-secondary)' }}>
              Al elegir las cuotas, retenés el capital y podés colocarlo en instrumentos financieros líquidos (plazo fijo, fondos comunes de inversión, cauciones o cuentas remuneradas). Ese dinero genera intereses mensuales que ayudan a pagar las cuotas futuras, disminuyendo el costo neto final de la compra.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>¿Cuándo Conviene Pagar al Contado?</h3>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0, color: 'var(--text-secondary)' }}>
              El pago al contado es financieramente óptimo si el comerciante ofrece un descuento directo sobre el precio de lista que resulte superior a la inflación acumulada del período de financiación o superior a los rendimientos netos de impuestos que podrías obtener invirtiendo el capital libremente.
            </p>
          </div>
        </div>
      </section>

      <HelpModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)}
        title="¿Cómo evaluar si conviene pagar en cuotas fijas o al contado?"
      >
        <p>
          En economías con alta inflación, el dinero pierde valor rápidamente. Esto genera que el costo real de una cuota fija en el futuro sea mucho menor al valor nominal de hoy.
        </p>

        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>1. El Concepto de Valor Presente (VP)</h3>
        <p>
          Para saber el costo real de un plan de financiación, debemos descontarle el efecto de la inflación proyectada a cada cuota futura. 
          Por ejemplo, una cuota de $10.000 a pagar en 6 meses equivale a pagar solo $7.900 hoy si estimamos una inflación del 4% mensual. 
          Al sumar el Valor Presente de todas las cuotas, obtenemos el **costo financiado real**. Si este costo es menor que el precio que pagarías al contado con descuento, las cuotas son la mejor opción.
        </p>

        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>2. Costo de Oportunidad de la Inversión</h3>
        <p>
          Al elegir pagar en cuotas, conservás tu capital inicial. Podés colocar el dinero equivalente al pago contado en un fondo remunerado o plazo fijo para devengar intereses. 
          Mes a mes, pagás la cuota correspondiente retirando saldo del fondo, dejando que el resto siga rindiendo. Si la tasa de interés obtenida (TNA) supera el recargo financiero neto de la inflación, tu capital crecerá y terminarás con un excedente positivo al finalizar la simulación.
        </p>

        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>3. ¿Cuándo conviene Efectivo?</h3>
        <p>
          Conviene pagar en efectivo/contado únicamente cuando el descuento ofrecido en un solo pago es tan grande (ej. 20% o 30%) que supera el rendimiento de la inversión alternativa o supera la licuación que la inflación produciría sobre las cuotas de lista.
        </p>
      </HelpModal>

    </div>
  );
};

export default InstallmentsVsCashCalculator;
