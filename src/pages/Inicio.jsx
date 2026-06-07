import React, { useState } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  Target, 
  Flame, 
  DollarSign, 
  Shield, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Database,
  EyeOff,
  Home,
  Percent
} from 'lucide-react';
import AdvisorCTA from '../components/AdvisorCTA';

const Inicio = ({ onSelectTool }) => {
  const [monthlySavings, setMonthlySavings] = useState(200);

  // Calcular interés compuesto rápido (8% anual, capitalización mensual)
  const calculateQuickCompound = (monthly, years) => {
    const r = 0.08;
    const n = 12;
    const rate = r / n;
    const months = years * n;
    const fv = monthly * (Math.pow(1 + rate, months) - 1) / rate;
    return Math.round(fv);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const tools = [
    {
      id: 'buy-vs-rent',
      name: '¿Alquilar o Comprar?',
      icon: <Calculator size={24} className="text-accent-primary" />,
      desc: 'Compara financieramente si te conviene alquilar una propiedad e invertir la diferencia, o comprarla con un crédito hipotecario.',
      color: 'var(--accent-primary)'
    },
    {
      id: 'compound-interest',
      name: 'Interés Compuesto',
      icon: <TrendingUp size={24} className="text-accent-primary" />,
      desc: 'Simula el crecimiento a largo plazo de tus inversiones mensuales con escenarios optimistas, realistas y conservadores.',
      color: 'var(--accent-primary)'
    },
    {
      id: 'savings-goal',
      name: 'Objetivo de Ahorro',
      icon: <Target size={24} className="text-accent-primary" />,
      desc: 'Calcula exactamente cuánto debés ahorrar e invertir por mes para alcanzar una meta financiera (comprar un auto, viajar, etc.) en un plazo determinado.',
      color: 'var(--accent-primary)'
    },
    {
      id: 'fire',
      name: 'Simulador FIRE (Retiro Temprano)',
      icon: <Flame size={24} style={{ color: 'var(--accent-warning)' }} />,
      desc: 'Poné a prueba tu estrategia de retiro haciendo un "backtesting" contra 99 años de datos históricos reales del mercado financiero.',
      color: 'var(--accent-warning)'
    },
    {
      id: 'inflation',
      name: 'Inflación Histórica',
      icon: <DollarSign size={24} style={{ color: 'var(--accent-success)' }} />,
      desc: 'Visualiza la pérdida de poder adquisitivo del dinero a lo largo del tiempo con registros oficiales e históricos desde 1635.',
      color: 'var(--accent-success)'
    },
    {
      id: 'hipotecario-uva',
      name: 'Crédito Hipotecario UVA',
      icon: <Home size={24} className="text-accent-primary" />,
      desc: 'Simulá créditos hipotecarios UVA vs tasa fija, comparando el sistema Francés y Alemán con la inflación de Argentina.',
      color: 'var(--accent-primary)'
    },
    {
      id: 'comparador-historico',
      name: 'Dólar vs Plazo Fijo vs Merval',
      icon: <TrendingUp size={24} style={{ color: 'var(--accent-success)' }} />,
      desc: 'Compará el rendimiento histórico real en pesos de ahorrar en dólares blue, plazo fijo tradicional, plazo fijo UVA y el Merval desde 2015.',
      color: 'var(--accent-success)'
    },
    {
      id: 'sueldo-neto',
      name: 'Sueldo Neto Freelancer',
      icon: <Percent size={24} className="text-accent-primary" />,
      desc: 'Calculá tus ingresos netos en mano estimando la cuota del Monotributo 2026, comisiones de cobro e Ingresos Brutos.',
      color: 'var(--accent-primary)'
    },
    {
      id: 'ganancias',
      name: 'Simulador de Ganancias',
      icon: <Percent size={24} className="text-accent-primary" />,
      desc: 'Calculá la retención del Impuesto a las Ganancias sobre tu sueldo (4° categoría) con las deducciones y escalas oficiales de 2026.',
      color: 'var(--accent-primary)'
    },
    {
      id: 'broker-comparator',
      name: 'Comparador de Brokers',
      icon: <TrendingUp size={24} className="text-accent-primary" />,
      desc: 'Compara comisiones, cuenta remunerada (TNA) y beneficios exclusivos de Balanz y otras plataformas en tiempo real.',
      color: 'var(--accent-primary)'
    }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      
      {/* 1. Hero Section */}
      <section style={{ 
        textAlign: 'center', 
        padding: '3rem 1.5rem 1rem 1.5rem',
        maxWidth: '900px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          padding: '0.35rem 1rem',
          borderRadius: '50px',
          backgroundColor: 'rgba(6, 182, 212, 0.08)',
          border: '1px solid rgba(6, 182, 212, 0.2)',
          color: 'var(--accent-primary)',
          fontSize: '0.875rem',
          fontWeight: 500
        }}>
          <Sparkles size={14} />
          Herramientas Financieras Gratuitas
        </div>
        <h1 style={{ 
          fontSize: '3rem', 
          lineHeight: '1.15', 
          fontWeight: '700',
          background: 'linear-gradient(to right, #ffffff, #94a3b8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.03em'
        }}>
          Tomá decisiones financieras inteligentes
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          color: 'var(--text-secondary)', 
          maxWidth: '650px', 
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Simuladores interactivos diseñados para proyectar tu ahorro, inversión, retiro y vivienda con datos históricos reales.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1rem' }}>
          <button 
            className="btn btn-primary"
            onClick={() => onSelectTool('buy-vs-rent')}
            style={{ padding: '0.875rem 2rem' }}
          >
            Comenzar a Simular
            <ArrowRight size={18} />
          </button>
          <a 
            href="#porque-valia"
            className="btn btn-outline"
            style={{ padding: '0.875rem 2rem', textDecoration: 'none' }}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('porque-valia')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            ¿Por qué Valia?
          </a>
        </div>
      </section>

      {/* 2. Interactive Quick Simulator Widget */}
      <section className="container" style={{ maxWidth: '850px' }}>
        <div className="card" style={{ 
          background: 'linear-gradient(135deg, var(--bg-secondary) 0%, rgba(15, 23, 42, 0.6) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.15)',
          boxShadow: 'var(--shadow-glow), var(--shadow-md)',
          padding: '2rem'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={20} className="text-accent-primary" />
              Simulador de Crecimiento Rápido
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Ajustá el ahorro mensual para proyectar el poder del interés compuesto (tasa anual estimada: 8% en USD)
            </p>
          </div>

          {/* Slider Control */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Ahorro Mensual Estimado:</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
                {formatCurrency(monthlySavings)}
              </span>
            </div>
            <input 
              type="range" 
              min="20" 
              max="2000" 
              step="20"
              value={monthlySavings}
              onChange={(e) => setMonthlySavings(Number(e.target.value))}
              style={{
                width: '100%',
                height: '6px',
                borderRadius: '5px',
                background: 'var(--bg-tertiary)',
                outline: 'none',
                accentColor: 'var(--accent-primary)',
                cursor: 'pointer'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
              <span>$20</span>
              <span>$500</span>
              <span>$1.000</span>
              <span>$1.500</span>
              <span>$2.000</span>
            </div>
          </div>

          {/* Projection Results */}
          <div className="stats-grid" style={{ gap: '1.25rem' }}>
            {[
              { yrs: 10, label: 'En 10 Años' },
              { yrs: 20, label: 'En 20 Años' },
              { yrs: 30, label: 'En 30 Años' }
            ].map((proj) => {
              const accumulated = calculateQuickCompound(monthlySavings, proj.yrs);
              const totalInvested = monthlySavings * 12 * proj.yrs;
              const interestEarned = accumulated - totalInvested;

              return (
                <div key={proj.yrs} style={{ 
                  backgroundColor: 'var(--bg-tertiary)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: 'var(--border-radius-md)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {proj.yrs === 30 && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: 'linear-gradient(to right, var(--accent-primary), var(--accent-success))'
                    }} />
                  )}
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>
                    {proj.label}
                  </span>
                  <span style={{ fontSize: '1.35rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                    {formatCurrency(accumulated)}
                  </span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    <div>Invertido: <span style={{ color: 'var(--text-primary)' }}>{formatCurrency(totalInvested)}</span></div>
                    <div style={{ color: 'var(--accent-success)', fontWeight: 500 }}>
                      Intereses: +{formatCurrency(interestEarned)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Grid of Tools */}
      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Nuestras Calculadoras</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
            Explorá herramientas específicas para simular tus finanzas con precisión científica.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {tools.map((tool) => (
            <div 
              key={tool.id} 
              className="card" 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1rem',
                justifyContent: 'space-between',
                transition: 'transform 0.2s, border-color 0.2s',
                cursor: 'pointer'
              }}
              onClick={() => onSelectTool(tool.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: '44px', 
                  height: '44px', 
                  borderRadius: '10px', 
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)'
                }}>
                  {tool.icon}
                </div>
                <h3 style={{ fontSize: '1.125rem' }}>{tool.name}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {tool.desc}
                </p>
              </div>
              <button 
                className="btn btn-outline" 
                style={{ 
                  padding: '0.5rem 1rem', 
                  fontSize: '0.875rem', 
                  marginTop: '0.5rem',
                  width: '100%',
                  justifyContent: 'center',
                  pointerEvents: 'none', // prevent button click from duplicating card click
                  borderColor: 'rgba(6, 182, 212, 0.1)',
                  color: 'var(--accent-primary)',
                  fontWeight: 500
                }}
              >
                Abrir Calculadora
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Lead Gen Advisor CTA banner */}
        <div style={{ marginTop: '3rem' }}>
          <AdvisorCTA 
            title="¿Querés delegar tus inversiones en un profesional?"
            description="Contactá a nuestro asesor asociado en Balanz para estructurar tu cartera de inversión, abrir tu cuenta sin costo y operar los mejores FCI del mercado."
          />
        </div>
      </section>

      {/* 4. Why Valia (Pilares) */}
      <section id="porque-valia" className="container" style={{ 
        paddingTop: '2rem', 
        borderTop: '1px solid var(--border-color)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Diseñado para protegerte y educarte</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Por qué Valia es una forma diferente de pensar en tu patrimonio.</p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '2rem' 
        }}>
          <div style={{ textAlign: 'center', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '48px', 
              height: '48px', 
              borderRadius: '50%', 
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              color: 'var(--accent-success)',
              marginBottom: '0.5rem'
            }}>
              <Lock size={22} />
            </div>
            <h3 style={{ fontSize: '1.125rem' }}>100% Privado</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Ningún dato financiero que ingreses sale de tu navegador. No guardamos registros en servidores ni bases de datos.
            </p>
          </div>

          <div style={{ textAlign: 'center', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '48px', 
              height: '48px', 
              borderRadius: '50%', 
              backgroundColor: 'rgba(6, 182, 212, 0.08)',
              color: 'var(--accent-primary)',
              marginBottom: '0.5rem'
            }}>
              <Database size={22} />
            </div>
            <h3 style={{ fontSize: '1.125rem' }}>Datos Científicos</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Nuestras simulaciones utilizan datos históricos reales desde 1926 e índices de precios históricos de fuentes oficiales.
            </p>
          </div>

          <div style={{ textAlign: 'center', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '48px', 
              height: '48px', 
              borderRadius: '50%', 
              backgroundColor: 'rgba(245, 158, 11, 0.08)',
              color: 'var(--accent-warning)',
              marginBottom: '0.5rem'
            }}>
              <EyeOff size={22} />
            </div>
            <h3 style={{ fontSize: '1.125rem' }}>Sin Fricciones</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Sin cuentas obligatorias, sin registro de correo y sin anuncios invasivos que arruinen tu experiencia visual.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Inicio;
