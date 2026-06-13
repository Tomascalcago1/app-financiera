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
  Percent,
  Scale,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Landmark
} from 'lucide-react';
import AdvisorCTA from '../components/AdvisorCTA';
import FinancialTest from '../components/FinancialTest';

const Inicio = ({ onSelectTool, preloadTool }) => {
  const [openFaq, setOpenFaq] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('todas');

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const tools = [
    {
      id: 'sueldo-neto',
      name: 'Sueldo Neto Freelancer',
      icon: <Percent size={24} className="text-accent-primary" />,
      desc: 'Calculá tus ingresos netos en mano estimando la cuota del Monotributo 2026, comisiones de cobro e Ingresos Brutos.',
      color: 'var(--accent-primary)',
      category: 'impuestos'
    },
    {
      id: 'ganancias',
      name: 'Simulador de Ganancias',
      icon: <Percent size={24} className="text-accent-primary" />,
      desc: 'Calculá la retención del Impuesto a las Ganancias sobre tu sueldo (4° categoría) con las deducciones y escalas oficiales de 2026.',
      color: 'var(--accent-primary)',
      category: 'impuestos'
    },
    {
      id: 'installments-vs-cash',
      name: '¿Cuotas o Efectivo?',
      icon: <Scale size={24} className="text-accent-primary" />,
      desc: 'Simulá si te conviene pagar en cuotas fijas o al contado con descuento evaluando inflación e inversiones.',
      color: 'var(--accent-primary)',
      category: 'ahorro-credito'
    },
    {
      id: 'compound-interest',
      name: 'Interés Compuesto',
      icon: <TrendingUp size={24} className="text-accent-primary" />,
      desc: 'Simula el crecimiento a largo plazo de tus inversiones mensuales con escenarios optimistas, realistas y conservadores.',
      color: 'var(--accent-primary)',
      category: 'inversiones'
    },
    {
      id: 'savings-comparison',
      name: '¿UVA, Plazo Fijo o Caución?',
      icon: <Landmark size={24} className="text-accent-primary" />,
      desc: 'Compará la rentabilidad y ganancia real de tus pesos entre Plazo Fijo UVA, Plazo Fijo Tradicional y Cauciones bursátiles.',
      color: 'var(--accent-primary)',
      category: 'ahorro-credito'
    },
    {
      id: 'hipotecario-uva',
      name: 'Crédito Hipotecario UVA',
      icon: <Home size={24} className="text-accent-primary" />,
      desc: 'Simulá créditos hipotecarios UVA vs tasa fija, comparando el sistema Francés y Alemán con la inflación de Argentina.',
      color: 'var(--accent-primary)',
      category: 'ahorro-credito'
    },
    {
      id: 'tna-to-tea',
      name: 'Conversor TNA a TEA',
      icon: <Percent size={24} className="text-accent-primary" />,
      desc: 'Calculá la tasa de interés efectiva anual (TEA) y mensual (TEM) a partir de una TNA según la capitalización de intereses.',
      color: 'var(--accent-primary)',
      category: 'inversiones'
    },
    {
      id: 'ipc-actualizer',
      name: 'Actualizador IPC (INDEC)',
      icon: <Calculator size={24} className="text-accent-primary" />,
      desc: 'Ajustá montos de dinero del pasado según la inflación oficial del INDEC (IPC) en Argentina para calcular la pérdida de poder de compra.',
      color: 'var(--accent-primary)',
      category: 'ahorro-credito'
    },
    {
      id: 'buy-vs-rent',
      name: '¿Alquilar o Comprar?',
      icon: <Calculator size={24} className="text-accent-primary" />,
      desc: 'Compara financieramente si te conviene alquilar una propiedad e invertir la diferencia, o comprarla con un crédito hipotecario.',
      color: 'var(--accent-primary)',
      category: 'ahorro-credito'
    },
    {
      id: 'comparador-historico',
      name: 'Dólar vs Plazo Fijo vs Merval',
      icon: <TrendingUp size={24} style={{ color: 'var(--accent-success)' }} />,
      desc: 'Compará el rendimiento histórico real en pesos de ahorrar en dólares blue, plazo fijo tradicional, plazo fijo UVA y el Merval desde 2015.',
      color: 'var(--accent-success)',
      category: 'inversiones'
    },
    {
      id: 'savings-goal',
      name: 'Objetivo de Ahorro',
      icon: <Target size={24} className="text-accent-primary" />,
      desc: 'Calcula exactamente cuánto debés ahorrar e invertir por mes para alcanzar una meta financiera (comprar un auto, viajar, etc.) en un plazo determinado.',
      color: 'var(--accent-primary)',
      category: 'ahorro-credito'
    },
    {
      id: 'inflation',
      name: 'Inflación Histórica',
      icon: <DollarSign size={24} style={{ color: 'var(--accent-success)' }} />,
      desc: 'Visualiza la pérdida de poder adquisitivo del dinero a lo largo del tiempo con registros oficiales e históricos desde 1635.',
      color: 'var(--accent-success)',
      category: 'ahorro-credito'
    },
    {
      id: 'fire',
      name: 'Simulador de Retiro Temprano',
      icon: <Flame size={24} style={{ color: 'var(--accent-warning)' }} />,
      desc: 'Poné a prueba tu estrategia de retiro haciendo un "backtesting" contra 99 años de datos históricos reales del mercado financiero.',
      color: 'var(--accent-warning)',
      category: 'inversiones'
    },
    {
      id: 'broker-comparator',
      name: 'Comparador de Brokers',
      icon: <TrendingUp size={24} className="text-accent-primary" />,
      desc: 'Compara comisiones, cuenta remunerada (TNA) y beneficios exclusivos de Balanz y otras plataformas en tiempo real.',
      color: 'var(--accent-primary)',
      category: 'inversiones'
    }
  ];

  const filteredTools = selectedCategory === 'todas' 
    ? tools 
    : tools.filter(t => t.category === selectedCategory);

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
          Simuladores financieros interactivos y 100% privados. Sin registrarse, sin anuncios y procesados de manera local en tu navegador.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1rem' }}>
          <button 
            className="btn btn-primary"
            onClick={() => onSelectTool('buy-vs-rent')}
            style={{ padding: '0.875rem 2rem' }}
            onMouseEnter={() => preloadTool && preloadTool('buy-vs-rent')}
            onFocus={() => preloadTool && preloadTool('buy-vs-rent')}
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

      {/* Brand Trust Bar / Data Sources */}
      <section style={{ 
        textAlign: 'center', 
        padding: '0 1.5rem',
        marginTop: '-1rem',
        marginBottom: '1rem'
      }}>
        <p style={{ 
          fontSize: '0.75rem', 
          textTransform: 'uppercase', 
          letterSpacing: '0.1em', 
          color: 'var(--text-tertiary)', 
          fontWeight: 600,
          marginBottom: '1rem'
        }}>
          Modelos e Índices de Referencia Validados con Datos de
        </p>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '1.25rem', 
          flexWrap: 'wrap',
          opacity: 0.85
        }}>
          {[
            { name: 'Universidad de Yale', sub: 'Robert Shiller Data' },
            { name: 'BCRA', sub: 'CER e Índices UVA' },
            { name: 'AFIP / ARCA', sub: 'Escalas Ganancias/Monotributo' },
            { name: 'INDEC', sub: 'IPC Argentina' },
            { name: 'BLS (EE.UU.)', sub: 'CPI Histórico' }
          ].map((source, i) => (
            <div key={i} style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              padding: '0.4rem 0.8rem',
              border: '1px solid rgba(51, 65, 85, 0.3)',
              borderRadius: 'var(--border-radius-sm)',
              background: 'rgba(30, 41, 59, 0.4)'
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-primary)' }}>{source.name}</span>
              <span style={{ fontSize: '0.55rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>{source.sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Financial Health Test Widget */}
      <section className="container" style={{ maxWidth: '850px' }}>
        <FinancialTest onSelectTool={onSelectTool} preloadTool={preloadTool} />
      </section>

      {/* 3. Grid of Tools */}
      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Nuestras Calculadoras</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
            Explorá herramientas específicas para simular tus finanzas con precisión científica.
          </p>
        </div>

        {/* Category Filters */}
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          justifyContent: 'center', 
          flexWrap: 'wrap', 
          marginBottom: '3rem',
          maxWidth: '800px',
          margin: '0 auto 3rem auto'
        }}>
          {[
            { id: 'todas', label: 'Todas' },
            { id: 'inversiones', label: 'Inversión y Retiro' },
            { id: 'ahorro-credito', label: 'Ahorro y Créditos' },
            { id: 'impuestos', label: 'Impuestos y Salarios' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`btn ${selectedCategory === cat.id ? 'btn-primary' : 'btn-outline'}`}
              style={{ 
                padding: '0.4rem 1.25rem', 
                fontSize: '0.85rem', 
                borderRadius: '50px',
                fontWeight: selectedCategory === cat.id ? '600' : '400',
                transition: 'all var(--transition-fast)'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '1.5rem',
          minHeight: filteredTools.length > 0 ? 'auto' : '200px'
        }}>
          {filteredTools.map((tool) => (
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
                if (preloadTool) preloadTool(tool.id);
              }}
              onFocus={() => {
                if (preloadTool) preloadTool(tool.id);
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

      {/* 3.5 Integrity Stats & Local Processing Banner */}
      <section className="container" style={{ 
        paddingTop: '3rem',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '2.5rem'
      }}>
        {/* Valia en Números Stats */}
        <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Valia en Números</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Métricas clave que avalan nuestra integridad y transparencia operativa.</p>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          textAlign: 'center'
        }}>
          {[
            { val: '11', label: 'Simuladores Financieros', desc: 'Sin sesgos ni comisiones comerciales ocultas' },
            { val: '0%', label: 'Custodia de Datos', desc: 'No requerimos registros, correos ni datos personales' },
            { val: '100%', label: 'Procesamiento Local', desc: 'Tus simulaciones se calculan 100% en tu navegador' },
            { val: '2026', label: 'Actualización Fiscal', desc: 'Tablas tributarias vigentes (Monotributo y Ganancias)' }
          ].map((stat, i) => (
            <div key={i} className="card" style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '0.35rem',
              padding: '1.5rem 1rem',
              background: 'linear-gradient(180deg, var(--bg-secondary) 0%, rgba(15, 23, 42, 0.4) 100%)',
              transition: 'none'
            }}>
              <span style={{ 
                fontSize: '2.25rem', 
                fontWeight: '800', 
                color: 'var(--accent-primary)',
                background: 'linear-gradient(to right, var(--accent-primary), #38bdf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1
              }}>{stat.val}</span>
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>{stat.label}</strong>
              <span style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>{stat.desc}</span>
            </div>
          ))}
        </div>

        {/* Local Processing Banner */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(15, 23, 42, 0.6) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.2)',
          borderRadius: 'var(--border-radius-md)',
          padding: '1.5rem 2rem',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: 'var(--accent-primary)',
            fontWeight: '600',
            fontSize: '1.1rem'
          }}>
            <Shield size={22} />
            Privacidad por Diseño Garantizada
          </div>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: 0, lineHeight: 1.6 }}>
            En cumplimiento estricto con los más altos estándares de protección de datos, <strong>Valia no recopila, transmite ni almacena</strong> ninguna información personal o financiera que ingreses. Todos los cálculos matemáticos y lógicas de simulación se ejecutan de manera aislada en el hilo del cliente (tu navegador), garantizando confidencialidad patrimonial absoluta.
          </p>
        </div>
      </section>

      {/* 4. Why Valia (Pilares) */}
      <section id="porque-valia" className="container" style={{ 
        paddingTop: '3rem', 
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

      {/* 5. FAQs Section */}
      <section className="container" style={{ 
        marginTop: '2rem', 
        paddingTop: '3rem', 
        borderTop: '1px solid var(--border-color)',
        maxWidth: '800px',
        margin: '0 auto 2rem auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <HelpCircle size={24} className="text-accent-primary" />
            Preguntas Frecuentes
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>Respuestas transparentes sobre la seguridad, metodología e independencia de Valia.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            {
              q: '¿Cómo se financia Valia si la plataforma es gratuita?',
              a: 'Valia es un portal educativo 100% independiente. Para sostener el proyecto a largo plazo y ofrecerte herramientas avanzadas gratuitas sin anuncios invasivos, establecemos alianzas transparentes con asesores financieros regulados (matriculados CNV) para derivar consultas. Sin embargo, no hay comisiones ocultas y el uso de las calculadoras es y seguirá siendo libre para todos.'
            },
            {
              q: '¿Dónde se guardan mis datos financieros?',
              a: 'En ningún lado. Valia está diseñada bajo el principio de "Privacidad por Diseño". No tenemos servidores de base de datos ni registramos tu información personal. Todo el procesamiento y las simulaciones se ejecutan localmente en la memoria de tu navegador y se pierden al cerrar la pestaña, a menos que decidas copiar el enlace de tu simulación para compartirlo.'
            },
            {
              q: '¿De dónde provienen los datos históricos y las fórmulas utilizadas?',
              a: 'Las fórmulas matemáticas empleadas en las simulaciones son estándares de mercado validados contra plataformas internacionales como Investor.gov. Las escalas del Monotributo y Ganancias siguen estrictamente las tablas oficiales provistas por la AFIP/ARCA para el período fiscal 2026. Los rendimientos de mercado del S&P 500 y bonos del tesoro provienen de bases de datos académicas abiertas del Prof. Robert Shiller de la Universidad de Yale.'
            }
          ].map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index} 
                className="card"
                style={{ 
                  padding: '1.25rem 1.5rem',
                  cursor: 'pointer',
                  borderColor: isOpen ? 'rgba(6, 182, 212, 0.4)' : 'var(--border-color)',
                  background: isOpen 
                    ? 'linear-gradient(to bottom, var(--bg-secondary) 0%, rgba(15, 23, 42, 0.3) 100%)' 
                    : 'var(--bg-secondary)',
                  transition: 'all var(--transition-fast)'
                }}
                onClick={() => setOpenFaq(isOpen ? null : index)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                  <h3 style={{ 
                    fontSize: '1rem', 
                    margin: 0, 
                    fontWeight: 600,
                    color: isOpen ? 'var(--accent-primary)' : 'var(--text-primary)'
                  }}>
                    {faq.q}
                  </h3>
                  <div style={{ color: 'var(--text-secondary)', flexShrink: 0 }}>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>
                {isOpen && (
                  <p className="animate-fade-in" style={{ 
                    marginTop: '1rem', 
                    borderTop: '1px solid var(--border-color)', 
                    paddingTop: '1rem',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.6',
                    fontSize: '0.9rem',
                    marginBottom: 0
                  }}>
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};

export default Inicio;
