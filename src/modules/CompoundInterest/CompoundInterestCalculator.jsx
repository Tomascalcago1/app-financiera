import React, { useState, useEffect, useMemo } from 'react';
import FinancialInput from '../../components/FinancialInput';
import CompoundResultsDashboard from './CompoundResultsDashboard';
import { simulateCompoundInterest } from './CompoundSimulationEngine';
import HelpModal from '../../components/HelpModal';
import { TrendingUp, Settings2, HelpCircle } from 'lucide-react';
import FAQSection from '../../components/FAQSection';

const CompoundInterestCalculator = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const getNumericParam = (key, fallback) => {
    const val = queryParams.get(key);
    return val !== null && !isNaN(val) ? Number(val) : fallback;
  };
  const getBoolParam = (key, fallback) => {
    const val = queryParams.get(key);
    if (val === 'true') return true;
    if (val === 'false') return false;
    return fallback;
  };

  // Main Variables
  const [initialInvestment, setInitialInvestment] = useState(() => {
    const q = queryParams.get('init');
    if (q !== null && !isNaN(q)) return q;
    const saved = localStorage.getItem('valia_compound_initialInvestment');
    return saved !== null ? saved : '';
  });
  const [monthlyContribution, setMonthlyContribution] = useState(() => {
    const q = queryParams.get('contrib');
    if (q !== null && !isNaN(q)) return q;
    const saved = localStorage.getItem('valia_compound_monthlyContribution');
    return saved !== null ? saved : '';
  });
  const [years, setYears] = useState(() => {
    const q = queryParams.get('yrs');
    if (q !== null && !isNaN(q)) return q;
    const saved = localStorage.getItem('valia_compound_years');
    return saved !== null ? saved : '';
  });
  const [interestRate, setInterestRate] = useState(() => {
    const q = queryParams.get('rate');
    if (q !== null && !isNaN(q)) return q;
    const saved = localStorage.getItem('valia_compound_interestRate');
    return saved !== null ? saved : '';
  });
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  
  // Advanced Variables
  const [showAdvanced, setShowAdvanced] = useState(() => getBoolParam('showAdv', false));
  const [varianceRange, setVarianceRange] = useState(() => {
    const q = queryParams.get('varRange');
    if (q !== null && !isNaN(q)) return Number(q);
    const saved = localStorage.getItem('valia_compound_varianceRange');
    return saved !== null ? (saved === '' ? '' : Number(saved)) : 2;
  });
  const [compoundFrequency, setCompoundFrequency] = useState(() => {
    const q = queryParams.get('freq');
    if (q !== null && !isNaN(q)) return Number(q);
    const saved = localStorage.getItem('valia_compound_compoundFrequency');
    return saved !== null ? Number(saved) : 1;
  });
  const [enableVariance, setEnableVariance] = useState(() => {
    const q = queryParams.get('var');
    if (q === 'true') return true;
    if (q === 'false') return false;
    const saved = localStorage.getItem('valia_compound_enableVariance');
    return saved !== null ? saved === 'true' : false;
  });

  const handleShare = () => {
    const params = new URLSearchParams();
    params.set('tool', 'compound-interest');
    if (initialInvestment) params.set('init', initialInvestment);
    if (monthlyContribution) params.set('contrib', monthlyContribution);
    if (years) params.set('yrs', years);
    if (interestRate) params.set('rate', interestRate);
    if (enableVariance) {
      params.set('var', 'true');
      params.set('varRange', varianceRange);
    }
    if (compoundFrequency !== 1) params.set('freq', compoundFrequency);
    if (showAdvanced) params.set('showAdv', 'true');

    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    return navigator.clipboard.writeText(shareUrl);
  };

  // Save states to localStorage
  useEffect(() => {
    localStorage.setItem('valia_compound_initialInvestment', initialInvestment);
    localStorage.setItem('valia_compound_monthlyContribution', monthlyContribution);
    localStorage.setItem('valia_compound_years', years);
    localStorage.setItem('valia_compound_interestRate', interestRate);
    localStorage.setItem('valia_compound_varianceRange', varianceRange);
    localStorage.setItem('valia_compound_compoundFrequency', compoundFrequency);
    localStorage.setItem('valia_compound_enableVariance', enableVariance);
  }, [
    initialInvestment,
    monthlyContribution,
    years,
    interestRate,
    varianceRange,
    compoundFrequency,
    enableVariance
  ]);

  // Generate simulation data when inputs change
  const simulationData = useMemo(() => {
    // Solo simulamos si los datos obligatorios no están vacíos
    if (initialInvestment === '' || years === '' || interestRate === '') return [];

    return simulateCompoundInterest({
      initialInvestment: Number(initialInvestment) || 0,
      monthlyContribution: Number(monthlyContribution) || 0,
      years: Number(years) || 0,
      interestRate: (Number(interestRate) || 0) / 100,
      varianceRange: enableVariance ? (Number(varianceRange) || 0) / 100 : 0,
      compoundFrequency: compoundFrequency
    });
  }, [
    initialInvestment,
    monthlyContribution,
    years,
    interestRate,
    varianceRange,
    compoundFrequency,
    enableVariance
  ]);

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      
      <header className="calculator-header">
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <TrendingUp className="text-accent-primary" size={32} />
          Calculadora de Interés Compuesto
        </h1>
        <p>Descubre cuánto puede crecer tu dinero a lo largo del tiempo.</p>
        
        <button 
          onClick={() => setIsHelpOpen(true)}
          className="help-btn"
        >
          <HelpCircle size={18} className="text-accent-primary" />
          ¿Cómo funciona?
        </button>
      </header>

      <div className="grid" style={{ 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '2rem',
        alignItems: 'start'
      }}>
        
        {/* Input Panel */}
        <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '0.5rem' }}>
            Tu Inversión
          </h2>
          
          <FinancialInput 
            label="Capital Inicial" 
            value={initialInvestment} 
            onChange={setInitialInvestment}
            prefix="$"
            step={1000}
          />
          
          <FinancialInput 
            label="Aporte Mensual" 
            value={monthlyContribution} 
            onChange={setMonthlyContribution}
            prefix="$"
            step={100}
          />
          
          <FinancialInput 
            label="Plazo de Inversión (Años)" 
            value={years} 
            onChange={setYears}
            suffix="años"
            min={1}
            max={50}
          />

          <FinancialInput 
            label="Tasa de Interés Estimada" 
            value={interestRate} 
            onChange={setInterestRate}
            suffix="%"
            step={0.1}
          />

          <button 
            className="btn btn-outline" 
            style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Settings2 size={18} />
            {showAdvanced ? 'Ocultar Opciones Avanzadas' : 'Mostrar Opciones Avanzadas'}
          </button>

          {showAdvanced && (
            <div className="animate-fade-in" style={{ 
              marginTop: '1rem', 
              paddingTop: '1rem', 
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                  Calcular Escenarios de Varianza
                </label>
                <input 
                  type="checkbox" 
                  checked={enableVariance}
                  onChange={(e) => setEnableVariance(e.target.checked)}
                  style={{ cursor: 'pointer' }}
                />
              </div>

              {enableVariance && (
                <FinancialInput 
                  label="Rango de Varianza de la Tasa (+/-)" 
                  value={varianceRange} 
                  onChange={setVarianceRange}
                  suffix="%"
                  step={0.1}
                />
              )}

              <div className="input-group">
                <label className="input-label">Frecuencia de Capitalización</label>
                <select 
                  className="input-field" 
                  value={compoundFrequency}
                  onChange={(e) => setCompoundFrequency(Number(e.target.value))}
                  style={{ appearance: 'auto' }}
                >
                  <option value={1}>Anualmente</option>
                  <option value={2}>Semestralmente</option>
                  <option value={12}>Mensualmente</option>
                  <option value={365}>Diariamente</option>
                </select>
              </div>

            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
          <CompoundResultsDashboard 
            data={simulationData} 
            varianceEnabled={enableVariance} 
            onShare={handleShare}
            inputs={{
              initialInvestment,
              monthlyContribution,
              years,
              interestRate,
              varianceRange: enableVariance ? varianceRange : 0,
              compoundFrequency
            }}
          />
        </div>

      </div>

      {/* Guía SEO y Contexto Financiero */}
      <section className="card animate-fade-in" style={{ marginTop: '3rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', animationDelay: '200ms' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          Entendiendo la Fórmula: ¿Qué es el Interés Compuesto y cómo calcularlo?
        </h2>
        <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          El interés compuesto representa la reinversión sistemática de los rendimientos generados por una inversión en el capital inicial. Esto produce un efecto de crecimiento exponencial o "bola de nieve", donde los intereses acumulados devengan nuevos intereses en los períodos sucesivos, multiplicando el patrimonio de forma acelerada con el transcurso de los años.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Frecuencia de Capitalización</h3>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0, color: 'var(--text-secondary)' }}>
              Cuanto más frecuente sea la capitalización (diaria o mensual en lugar de anual), más rápido crecerá tu dinero. Esto se debe a que los intereses se suman al capital inicial con mayor asiduidad, comenzando a generar nuevos rendimientos de forma inmediata.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>El Factor del Tiempo</h3>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0, color: 'var(--text-secondary)' }}>
              El interés compuesto premia la paciencia y el inicio temprano. En horizontes temporales largos (15, 20 o 30 años), la curva de crecimiento se vuelve sumamente empinada. Empezar a ahorrar e invertir cinco años antes puede llegar a duplicar el saldo final acumulado al momento del retiro.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Aportes Periódicos</h3>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0, color: 'var(--text-secondary)' }}>
              Combinar un capital inicial con aportaciones constantes mensuales (anualidad ordinaria) acelera la acumulación de capital drásticamente, amortiguando además las fluctuaciones de precios en el mercado de valores a través del promedio de costos.
            </p>
          </div>
        </div>
      </section>

      <FAQSection 
        faqs={[
          {
            question: "¿Qué es el interés compuesto y cómo funciona?",
            answer: "El interés compuesto es la acumulación de intereses sobre el capital inicial y sobre los intereses previamente generados período a período. De esta forma, el dinero crece de manera exponencial a lo largo del tiempo, ya que los rendimientos se reinvierten continuamente para generar nuevos rendimientos."
          },
          {
            question: "¿Cómo influye la frecuencia de capitalización en el saldo final?",
            answer: "La frecuencia de capitalización es la cantidad de veces que se liquidan y reinvierten los intereses en un año (ej. mensual, trimestral, anual). A mayor frecuencia de capitalización, mayor es el crecimiento del saldo final, ya que los intereses acumulados comienzan a generar rendimientos mucho antes."
          },
          {
            question: "¿Qué diferencia hay entre la Tasa Nominal Anual (TNA) y la Tasa Efectiva Anual (TEA)?",
            answer: "La TNA es la tasa de referencia anual que no contempla la reinversión de los intereses dentro del año. La TEA es la tasa de rendimiento real obtenida al final del año si se reinvierten todos los intereses con la frecuencia de capitalización correspondiente (la TEA siempre es mayor que la TNA si la capitalización es sub-anual)."
          },
          {
            question: "¿Por qué es fundamental la constancia y el factor tiempo en la inversión?",
            answer: "Debido a la naturaleza exponencial del interés compuesto, la variable más poderosa es el tiempo. Empezar a ahorrar e invertir unos años antes o mantener aportes constantes (por pequeños que sean) genera un saldo final acumulado drásticamente mayor en el largo plazo que intentar ingresar una suma grande de dinero de golpe al final."
          }
        ]}
      />

      <HelpModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)}
        title="¿Cómo funciona el Interés Compuesto?"
      >
        <p>
          El interés compuesto es la fuerza más poderosa de las finanzas personales. A diferencia del interés simple, 
          aquí los intereses que ganás se suman a tu capital y **generan nuevos intereses el mes siguiente**.
        </p>

        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>1. El Efecto Bola de Nieve</h3>
        <p>
          Si invertís $100 y ganás 10% el primer año, al final tenés $110. El segundo año, tu 10% se calcula sobre 
          $110 (no sobre los $100 iniciales), obteniendo $121. Con el tiempo, este crecimiento se acelera de forma exponencial.
        </p>

        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>2. Aportes Mensuales</h3>
        <p>
          Al sumar una contribución fija cada mes, no solo crece tu capital principal, sino que cada aporte empieza a generar 
          su propia "bola de nieve" de intereses inmediatamente, multiplicando la velocidad de crecimiento.
        </p>

        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>3. Frecuencia de Capitalización</h3>
        <p>
          Es la frecuencia con la que los intereses ganados se suman al capital (ej: mensual o anualmente). Cuanto más 
          frecuente sea (por ejemplo, mensual en vez de anual), más rápido crece tu dinero porque los intereses generan 
          ganancias más seguido.
        </p>
      </HelpModal>
    </div>
  );
};

export default CompoundInterestCalculator;
