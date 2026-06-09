import React, { useState, useMemo } from 'react';
import { 
  Percent, 
  HelpCircle, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle,
  Printer,
  Plus,
  Minus,
  Share2,
  Image
} from 'lucide-react';
import { exportChartToPNG } from '../../utils/chartExporter';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import FinancialInput from '../../components/FinancialInput';
import AdvisorCTA from '../../components/AdvisorCTA';
import HelpModal from '../../components/HelpModal';
import PrintReportHeader from '../../components/PrintReportHeader';
import PrintAdvisorCTA from '../../components/PrintAdvisorCTA';

const formatCurrency = (val) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(val);
};

const GananciasCalculator = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const getNumericParam = (key, fallback) => {
    const val = queryParams.get(key);
    return val !== null && !isNaN(val) ? Number(val) : fallback;
  };
  const getStringParam = (key, fallback) => {
    const val = queryParams.get(key);
    return val !== null ? val : fallback;
  };
  const getBoolParam = (key, fallback) => {
    const val = queryParams.get(key);
    if (val === 'true') return true;
    if (val === 'false') return false;
    return fallback;
  };

  // Inputs
  const [grossIncome, setGrossIncome] = useState(() => getNumericParam('gross', 3500000)); // 3.5 millones por defecto
  const [currency, setCurrency] = useState(() => getStringParam('currency', 'ARS')); // 'ARS' | 'USD'
  const [exchangeRate, setExchangeRate] = useState(() => getNumericParam('exRate', 1200)); // MEP
  const [hasSpouse, setHasSpouse] = useState(() => getBoolParam('spouse', false));
  const [childrenCount, setChildrenCount] = useState(() => getNumericParam('children', 0));
  const [disabledChildrenCount, setDisabledChildrenCount] = useState(() => getNumericParam('disabledChildren', 0));
  const [isPatagonico, setIsPatagonico] = useState(() => getBoolParam('patagonico', false));
  const [monthlyPrepaga, setMonthlyPrepaga] = useState(() => getStringParam('prepaga', ''));
  const [monthlyRent, setMonthlyRent] = useState(() => getStringParam('rent', ''));
  const [monthlyDomesticService, setMonthlyDomesticService] = useState(() => getStringParam('domestic', ''));
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const handleShare = () => {
    const params = new URLSearchParams();
    params.set('tool', 'ganancias');
    params.set('gross', grossIncome);
    params.set('currency', currency);
    if (currency === 'USD') params.set('exRate', exchangeRate);
    if (hasSpouse) params.set('spouse', 'true');
    if (childrenCount > 0) params.set('children', childrenCount);
    if (disabledChildrenCount > 0) params.set('disabledChildren', disabledChildrenCount);
    if (isPatagonico) params.set('patagonico', 'true');
    if (monthlyPrepaga) params.set('prepaga', monthlyPrepaga);
    if (monthlyRent) params.set('rent', monthlyRent);
    if (monthlyDomesticService) params.set('domestic', monthlyDomesticService);

    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      })
      .catch(err => console.error('Error al copiar el enlace: ', err));
  };

  // 2026 Tax Deductions Values (Semestre 1)
  const DEDUCTIONS_2026 = {
    GNI: 5151802.50,
    SPECIAL: 24728652.02,
    SPOUSE: 4851964.66,
    CHILD: 2446863.48,
    DISABLED_CHILD: 4893726.96,
  };

  // Article 94 progressive scale brackets for 2026 (Semestre 1)
  const SCALE_BRACKETS_2026 = [
    { limit: 2000030.09, fixed: 0, rate: 0.05, excess: 0 },
    { limit: 4000060.17, fixed: 100001.50, rate: 0.09, excess: 2000030.09 },
    { limit: 6000090.26, fixed: 280004.21, rate: 0.12, excess: 4000060.17 },
    { limit: 9000135.40, fixed: 520007.82, rate: 0.15, excess: 6000090.26 },
    { limit: 18000270.80, fixed: 970014.59, rate: 0.19, excess: 9000135.40 },
    { limit: 27000406.20, fixed: 2680040.32, rate: 0.23, excess: 18000270.80 },
    { limit: 40500609.30, fixed: 4750071.46, rate: 0.27, excess: 27000406.20 },
    { limit: 60750913.96, fixed: 8395126.30, rate: 0.31, excess: 40500609.30 },
    { limit: Infinity, fixed: 14672720.74, rate: 0.35, excess: 60750913.96 }
  ];

  const calculations = useMemo(() => {
    // Convert USD to ARS if needed
    const grossMonthlyArs = currency === 'USD' ? grossIncome * exchangeRate : grossIncome;
    
    // Retirement and healthcare contributions (17% capped)
    // Capped at maximum taxable base (approx $2.4M in early 2026)
    const MAX_PREVISIONAL_BASE = 2400000;
    const monthlyPrevisional = Math.min(grossMonthlyArs, MAX_PREVISIONAL_BASE) * 0.17;
    
    // Proportional SAC (AFIP adds 8.33% to monthly gross and contributions for proration)
    const sacFactor = 1.083333;
    const monthlyGrossWithSac = grossMonthlyArs * sacFactor;
    const monthlyPrevisionalWithSac = monthlyPrevisional * sacFactor;
    
    // Net monthly base for tax calculation
    const monthlyNetBase = monthlyGrossWithSac - monthlyPrevisionalWithSac;
    const annualNetBase = monthlyNetBase * 12;

    // Apply Patagonico multiplier if applicable
    const zoneMultiplier = isPatagonico ? 1.2 : 1.0;

    // Calculate personal deductions
    const gniDeduction = DEDUCTIONS_2026.GNI * zoneMultiplier;
    const specialDeduction = DEDUCTIONS_2026.SPECIAL * zoneMultiplier;
    
    let spouseDeduction = 0;
    if (hasSpouse) {
      spouseDeduction = DEDUCTIONS_2026.SPOUSE * zoneMultiplier;
    }

    const childrenDeduction = (Number(childrenCount) || 0) * DEDUCTIONS_2026.CHILD * zoneMultiplier;
    const disabledChildrenDeduction = (Number(disabledChildrenCount) || 0) * DEDUCTIONS_2026.DISABLED_CHILD * zoneMultiplier;

    // Other deductions (annualized and capped)
    const annualPrepaga = (Number(monthlyPrepaga) || 0) * 12;
    
    // Rent and Domestic service are capped at GNI limit
    const rentRaw = (Number(monthlyRent) || 0) * 12;
    const rentCapped = Math.min(rentRaw, gniDeduction);

    const domesticRaw = (Number(monthlyDomesticService) || 0) * 12;
    const domesticCapped = Math.min(domesticRaw, gniDeduction);

    // Sum total annual deductions
    const totalAnnualDeductions = gniDeduction + specialDeduction + spouseDeduction + childrenDeduction + disabledChildrenDeduction + annualPrepaga + rentCapped + domesticCapped;

    // Net taxable income (base imponible)
    const netTaxableIncome = Math.max(0, annualNetBase - totalAnnualDeductions);

    // Apply Art 94 progressive scale
    let annualTax = 0;
    let applicableBracket = SCALE_BRACKETS_2026[0];

    for (const bracket of SCALE_BRACKETS_2026) {
      if (netTaxableIncome <= bracket.limit) {
        applicableBracket = bracket;
        annualTax = bracket.fixed + (netTaxableIncome - bracket.excess) * bracket.rate;
        break;
      }
    }

    const monthlyTax = annualTax / 12;

    // Net pocket income (per month, excluding SAC proration since SAC is collected in June/Dec)
    const netPocketMonthly = grossMonthlyArs - monthlyPrevisional - monthlyTax - (Number(monthlyPrepaga) || 0) - (Number(monthlyRent) || 0) - (Number(monthlyDomesticService) || 0);
    const netPocketMonthlyClamped = Math.max(0, netPocketMonthly);

    const taxPercentage = ((monthlyTax / grossMonthlyArs) * 100) || 0;
    const previsionalPercentage = ((monthlyPrevisional / grossMonthlyArs) * 100) || 0;
    const expensesPercentage = (((Number(monthlyPrepaga) + Number(monthlyRent) + Number(monthlyDomesticService)) / grossMonthlyArs) * 100) || 0;
    const pocketPercentage = 100 - taxPercentage - previsionalPercentage - expensesPercentage;

    const pieData = [
      { name: 'Sueldo Neto de Bolsillo', value: netPocketMonthlyClamped, color: '#10b981' },
      { name: 'Impuesto Ganancias', value: monthlyTax, color: 'var(--accent-danger)' },
      { name: 'Jubilación y Obra Social', value: monthlyPrevisional, color: 'var(--accent-primary)' },
      { name: 'Gastos deducibles', value: (Number(monthlyPrepaga) || 0) + (Number(monthlyRent) || 0) + (Number(monthlyDomesticService) || 0), color: '#64748b' }
    ].filter(d => d.value > 0);

    return {
      grossMonthlyArs,
      monthlyPrevisional,
      monthlyGrossWithSac,
      monthlyNetBase,
      annualNetBase,
      gniDeduction,
      specialDeduction,
      spouseDeduction,
      childrenDeduction,
      disabledChildrenDeduction,
      rentCapped,
      domesticCapped,
      totalAnnualDeductions,
      netTaxableIncome,
      annualTax,
      monthlyTax,
      netPocketMonthly: netPocketMonthlyClamped,
      applicableBracket,
      pieData,
      percentages: {
        tax: taxPercentage.toFixed(1),
        previsional: previsionalPercentage.toFixed(1),
        expenses: expensesPercentage.toFixed(1),
        pocket: pocketPercentage.toFixed(1)
      }
    };
  }, [grossIncome, currency, exchangeRate, hasSpouse, childrenCount, disabledChildrenCount, isPatagonico, monthlyPrepaga, monthlyRent, monthlyDomesticService]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value, payload: data } = payload[0];
      const percentage = ((value / calculations.grossMonthlyArs) * 100).toFixed(1);
      return (
        <div className="card" style={{ padding: '0.75rem 1rem', border: '1px solid var(--border-color)' }}>
          <p style={{ fontWeight: 600, marginBottom: '0.25rem', fontSize: '0.85rem' }}>{name}</p>
          <strong style={{ fontSize: '0.85rem', color: data.color }}>
            {formatCurrency(value)} ({percentage}%)
          </strong>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 0' }}>
      
      {/* Header */}
      <header className="calculator-header">
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Percent size={32} className="text-accent-primary" />
          Simulador de Ganancias (4° Categoría)
        </h1>
        <p>Calculá la retención del Impuesto a las Ganancias sobre tu salario en relación de dependencia con las escalas oficiales de 2026.</p>
        <button onClick={() => setIsHelpOpen(true)} className="help-btn">
          <HelpCircle size={18} className="text-accent-primary" />
          ¿Cómo se calcula el impuesto a las Ganancias?
        </button>
      </header>

      {/* Grid */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        
        {/* Input Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Card: Salario */}
          <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '0.5rem' }}>
              Tus Ingresos
            </h2>
            <div className="input-group">
              <label className="input-label">Moneda de Salario</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  className={`btn ${currency === 'ARS' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ flex: 1, padding: '0.5rem', justifyContent: 'center' }}
                  onClick={() => setCurrency('ARS')}
                >
                  Pesos ($)
                </button>
                <button 
                  className={`btn ${currency === 'USD' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ flex: 1, padding: '0.5rem', justifyContent: 'center' }}
                  onClick={() => setCurrency('USD')}
                >
                  Dólares (US$)
                </button>
              </div>
            </div>

            <FinancialInput 
              label={currency === 'USD' ? 'Salario Bruto Mensual (USD)' : 'Salario Bruto Mensual (ARS)'}
              value={grossIncome} 
              onChange={setGrossIncome} 
              prefix={currency === 'USD' ? 'u$s' : '$'} 
              step={currency === 'USD' ? 500 : 100000} 
            />

            {currency === 'USD' && (
              <FinancialInput 
                label="Tipo de Cambio MEP/Financiero" 
                value={exchangeRate} 
                onChange={setExchangeRate} 
                prefix="$" 
                step={10} 
              />
            )}
          </div>

          {/* Card: Deducciones Familiares */}
          <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '0.25rem' }}>
              Deducciones Personales (Cargas de Familia)
            </h2>
            
            {/* Cónyuge Checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>¿Tenés cónyuge o conviviente a cargo?</span>
              <input 
                type="checkbox"
                checked={hasSpouse}
                onChange={e => setHasSpouse(e.target.checked)}
                style={{ 
                  width: '18px', 
                  height: '18px', 
                  accentColor: 'var(--accent-primary)',
                  cursor: 'pointer'
                }}
              />
            </div>

            {/* Hijos Counter */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Hijos menores de 18 años:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button 
                  type="button"
                  className="btn btn-outline" 
                  style={{ padding: '0.25rem', borderRadius: '50%', minWidth: '32px', height: '32px', justifyContent: 'center' }}
                  onClick={() => setChildrenCount(c => Math.max(0, c - 1))}
                >
                  <Minus size={14} />
                </button>
                <span style={{ fontSize: '1rem', fontWeight: 'bold', width: '16px', textAlign: 'center' }}>{childrenCount}</span>
                <button 
                  type="button"
                  className="btn btn-outline" 
                  style={{ padding: '0.25rem', borderRadius: '50%', minWidth: '32px', height: '32px', justifyContent: 'center' }}
                  onClick={() => setChildrenCount(c => c + 1)}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Hijos Incapacitados Counter */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Hijos incapacitados para el trabajo:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button 
                  type="button"
                  className="btn btn-outline" 
                  style={{ padding: '0.25rem', borderRadius: '50%', minWidth: '32px', height: '32px', justifyContent: 'center' }}
                  onClick={() => setDisabledChildrenCount(c => Math.max(0, c - 1))}
                >
                  <Minus size={14} />
                </button>
                <span style={{ fontSize: '1rem', fontWeight: 'bold', width: '16px', textAlign: 'center' }}>{disabledChildrenCount}</span>
                <button 
                  type="button"
                  className="btn btn-outline" 
                  style={{ padding: '0.25rem', borderRadius: '50%', minWidth: '32px', height: '32px', justifyContent: 'center' }}
                  onClick={() => setDisabledChildrenCount(c => c + 1)}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Patagonico Zone */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', display: 'block' }}>¿Vivís en zona patagónica?</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Aplica 20% de incremento en deducciones personales</span>
              </div>
              <input 
                type="checkbox"
                checked={isPatagonico}
                onChange={e => setIsPatagonico(e.target.checked)}
                style={{ 
                  width: '18px', 
                  height: '18px', 
                  accentColor: 'var(--accent-primary)',
                  cursor: 'pointer'
                }}
              />
            </div>
          </div>

          {/* Card: Otras Deducciones */}
          <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '0.5rem' }}>
              Otras Deducciones Mensuales
            </h2>
            <FinancialInput 
              label="Cuota de Medicina Prepaga"
              value={monthlyPrepaga}
              onChange={setMonthlyPrepaga}
              prefix="$"
              step={20000}
            />
            <FinancialInput 
              label="Alquiler de Casa-Habitación"
              value={monthlyRent}
              onChange={setMonthlyRent}
              prefix="$"
              step={50000}
            />
            <FinancialInput 
              label="Personal de Casas Particulares (Serv. Doméstico)"
              value={monthlyDomesticService}
              onChange={setMonthlyDomesticService}
              prefix="$"
              step={20000}
            />
          </div>

        </div>

        {/* Results Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <PrintReportHeader 
            title="Reporte de Impuesto a las Ganancias (4° Categoría 2026)"
            subtitle="Ficha de Planificación Impositiva en Relación de Dependencia"
            params={[
              { label: 'Sueldo Bruto Mensual', value: formatCurrency(grossIncome) },
              { label: 'Moneda / Tipo de Cambio', value: currency === 'USD' ? `Dólares (MEP: $${exchangeRate})` : 'Pesos (ARS)' },
              { label: 'Cónyuge a Cargo', value: hasSpouse ? 'Sí' : 'No' },
              { label: 'Hijos a Cargo', value: String(childrenCount) },
              { label: 'Hijos con Discapacidad', value: String(disabledChildrenCount) },
              { label: 'Zona Patagónica', value: isPatagonico ? 'Sí' : 'No' },
              { label: 'Deducción Prepaga', value: formatCurrency(monthlyPrepaga) },
              { label: 'Deducción Alquiler', value: formatCurrency(monthlyRent) },
              { label: 'Deducción Personal Doméstico', value: formatCurrency(monthlyDomesticService) }
            ]}
          />
          
          {/* Sueldo Neto de Bolsillo Card */}
          <div className="card animate-fade-in" style={{
            textAlign: 'center',
            borderTop: '4px solid #10b981',
            background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.05), transparent)'
          }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Sueldo Neto de Bolsillo Mensual</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
              {formatCurrency(calculations.netPocketMonthly)}
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>
              Recibís en mano el {calculations.percentages.pocket}% de tu salario bruto.
            </p>
          </div>

          {/* Tax alert card if paying ganancias */}
          {calculations.monthlyTax > 0 ? (
            <div className="card animate-fade-in" style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'start',
              border: '1px solid var(--accent-danger)',
              backgroundColor: 'rgba(239, 68, 68, 0.03)'
            }}>
              <AlertTriangle className="text-accent-danger" size={24} style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  Retención de Ganancias Aplicable
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  Tributás ganancias bajo la **Alícuota Marginal del {(calculations.applicableBracket.rate * 100).toFixed(0)}%**. 
                  El impuesto mensual estimado retenido de tu sueldo es de **{formatCurrency(calculations.monthlyTax)}**.
                </p>
              </div>
            </div>
          ) : (
            <div className="card animate-fade-in" style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'start',
              border: '1px solid var(--accent-success)',
              backgroundColor: 'rgba(16, 185, 129, 0.03)'
            }}>
              <AlertTriangle className="text-accent-success" size={24} style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  Exento de Impuesto a las Ganancias
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  Tu sueldo neto imponible anual no supera las deducciones totales de **{formatCurrency(calculations.totalAnnualDeductions)}**. 
                  No tenés retenciones de Ganancias sobre tus recibos de sueldo.
                </p>
              </div>
            </div>
          )}

          {/* Detailed breakdown card */}
          <div className="card animate-fade-in" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Desglose de Haberes Mensuales
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Sueldo Bruto (Pesos):</span>
                <strong>{formatCurrency(calculations.grossMonthlyArs)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Descuentos Jubilación y OS (17%):</span>
                <span style={{ color: 'var(--text-tertiary)' }}>-{formatCurrency(calculations.monthlyPrevisional)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Impuesto a las Ganancias (Est.):</span>
                <strong className={calculations.monthlyTax > 0 ? 'text-accent-danger' : 'text-text-secondary'}>
                  {calculations.monthlyTax > 0 ? `-${formatCurrency(calculations.monthlyTax)}` : '$0'}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Gastos Directos (Prepaga/Alquiler):</span>
                <span style={{ color: 'var(--text-tertiary)' }}>
                  -{formatCurrency((Number(monthlyPrepaga) || 0) + (Number(monthlyRent) || 0) + (Number(monthlyDomesticService) || 0))}
                </span>
              </div>

              <div style={{ borderTop: '1px dashed var(--border-color)', margin: '0.5rem 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Deducciones Anuales Aplicadas:</span>
                <span style={{ color: 'var(--accent-primary)' }}>{formatCurrency(calculations.totalAnnualDeductions)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Ganancia Neta Imponible Anual:</span>
                <span>{formatCurrency(calculations.netTaxableIncome)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', fontSize: '1rem', marginTop: '0.25rem' }}>
                <strong>Sueldo Neto de Bolsillo:</strong>
                <strong style={{ color: '#10b981' }}>{formatCurrency(calculations.netPocketMonthly)}</strong>
              </div>
            </div>
          </div>

          {/* Action buttons */}
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
              onClick={() => window.print()}
              className="btn btn-outline" 
              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            >
              <Printer size={16} />
              Imprimir Reporte
            </button>
            <button 
              onClick={() => exportChartToPNG('ganancias-chart-container', 'valia_impuesto_a_las_ganancias.png')}
              className="btn btn-outline" 
              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            >
              <Image size={16} />
              Descargar Gráfico
            </button>
          </div>

          {/* Recharts PieChart */}
          <div className="card chart-container animate-fade-in" id="ganancias-chart-container" style={{ height: '320px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.05rem', alignSelf: 'flex-start' }}>Distribución de tu Salario Bruto</h3>
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={calculations.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {calculations.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" align="center" formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <AdvisorCTA 
            title="¿Querés optimizar tu retención de Ganancias?"
            description="Contactá a nuestro asesor en Balanz para evaluar cómo canalizar tus deducciones e invertir eficientemente tus ingresos de bolsillo."
            goalContext="ahorro"
          />
          <PrintAdvisorCTA />

        </div>

      </div>

      {/* Guía SEO y Contexto Financiero */}
      <section className="card animate-fade-in" style={{ marginTop: '3rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', animationDelay: '200ms' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          Guía de Impuesto a las Ganancias: Claves para entender la Retención de 4° Categoría
        </h2>
        <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          El Impuesto a las Ganancias sobre salarios es un tributo progresivo que grava los ingresos netos de los trabajadores bajo relación de dependencia y jubilados. Comprender cómo se determinan las deducciones y cómo funciona la escala impositiva de la AFIP/ARCA te permite optimizar tus ingresos reales.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Deducciones Personales y Cargas de Familia</h3>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0, color: 'var(--text-secondary)' }}>
              El mínimo no imponible es el umbral por debajo del cual no se tributa el impuesto. Para reducir la base imponible anual, podés deducir cargas de familia como cónyuge o conviviente y tus hijos menores de 18 años, siempre que no tengan ingresos propios superiores a los topes legales. Quienes habitan en zona patagónica acceden a deducciones incrementadas en un 20%.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>La Escala del Artículo 94 y la Alícuota Marginal</h3>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0, color: 'var(--text-secondary)' }}>
              El impuesto no se cobra de forma uniforme. Se aplica una escala progresiva con alícuotas del 5% al 35% en función del ingreso imponible excedente. La alícuota marginal indica el porcentaje de impuesto que pagarías por cada peso adicional de aumento salarial, lo cual es clave para negociar remuneraciones brutas.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Deducciones Admisibles (Siradig)</h3>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0, color: 'var(--text-secondary)' }}>
              Es factible deducir ciertos gastos personales declarándolos en el formulario SIRADIG de la AFIP/ARCA: cuotas de medicina prepaga, alquiler de casa-habitación (vivienda única) y aportes por servicio doméstico a cargo. Aprovechar estos ítems al máximo reduce de forma legal el impuesto final retenido de tu sueldo por tu empleador.
            </p>
          </div>
        </div>
      </section>

      <HelpModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)}
        title="¿Cómo funciona el Impuesto a las Ganancias en Argentina?"
      >
        <p>
          El **Impuesto a las Ganancias sobre salarios (Cuarta Categoría)** es un tributo nacional directo que grava las ganancias netas de los empleados en relación de dependencia y jubilados.
        </p>

        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>1. Deducciones del Artículo 30</h3>
        <p>
          Antes de calcular el impuesto, el Estado permite restar ciertos conceptos (deducciones) de tus ingresos brutos para determinar tu ganancia imponible. Estos incluyen la **Ganancia No Imponible (GNI)**, la **Deducción Especial** (adicional para empleados) y las cargas de familia (**cónyuge e hijos** menores de 18 años a cargo).
        </p>

        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>2. Escala Progresiva (Artículo 94)</h3>
        <p>
          Una vez restadas las deducciones, si queda una ganancia neta imponible, se le aplica una escala de alícuotas crecientes que arranca en el **5%** y llega hasta el **35%**. A mayor ingreso, mayor es la alícuota marginal aplicada sobre el excedente del tramo anterior.
        </p>

        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>3. Otras Deducciones Admisibles</h3>
        <p>
          Podés ingresar en el sistema SIRADIG de ARCA ciertos gastos personales deducibles para achicar el impuesto anual, tales como cuotas de medicina prepaga, alquileres de vivienda única (casa-habitación) y cargas salariales de servicio doméstico. Muchos de estos gastos tienen topes anuales equivalentes a la GNI.
        </p>
      </HelpModal>

    </div>
  );
};

export default GananciasCalculator;
