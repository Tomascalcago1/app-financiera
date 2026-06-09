import React, { useState, useRef, useEffect, Suspense, lazy } from 'react';
import { Home, Wrench, Wallet, Info, ChevronLeft, ChevronRight, Users, BookOpen, Book } from 'lucide-react';

const BuyVsRentCalculator = lazy(() => import('./modules/BuyVsRent/BuyVsRentCalculator'));
const CompoundInterestCalculator = lazy(() => import('./modules/CompoundInterest/CompoundInterestCalculator'));
const SavingsGoalCalculator = lazy(() => import('./modules/SavingsGoal/SavingsGoalCalculator'));
const FireCalculator = lazy(() => import('./modules/FireCalc/FireCalculator'));
const InflationCalculator = lazy(() => import('./modules/Inflation/InflationCalculator'));
const HipotecarioUvaCalculator = lazy(() => import('./modules/HipotecarioUva/HipotecarioUvaCalculator'));
const ComparadorHistorico = lazy(() => import('./modules/ComparadorHistorico/ComparadorHistorico'));
const SueldoNetoCalculator = lazy(() => import('./modules/SueldoNeto/SueldoNetoCalculator'));
const BrokerComparator = lazy(() => import('./modules/BrokerComparator/BrokerComparator'));
const GananciasCalculator = lazy(() => import('./modules/Ganancias/GananciasCalculator'));
const InstallmentsVsCashCalculator = lazy(() => import('./modules/InstallmentsVsCash/InstallmentsVsCashCalculator'));

const AcercaDe = lazy(() => import('./pages/AcercaDe'));
const Privacidad = lazy(() => import('./pages/Privacidad'));
const Terminos = lazy(() => import('./pages/Terminos'));
const Inicio = lazy(() => import('./pages/Inicio'));
const Asesores = lazy(() => import('./pages/Asesores'));
const Blog = lazy(() => import('./pages/Blog'));
const Glosario = lazy(() => import('./pages/Glosario'));

const LoadingState = () => (
  <div className="container" style={{ 
    display: 'flex', 
    flexDirection: 'column',
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '50vh', 
    gap: '1.25rem'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      border: '3px solid rgba(6, 182, 212, 0.15)',
      borderTopColor: 'var(--accent-primary)',
      animation: 'spin 1s linear infinite'
    }} />
    <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
    <div style={{ 
      fontSize: '0.9rem', 
      color: 'var(--text-secondary)', 
      fontWeight: 500,
      letterSpacing: '0.05em' 
    }}>
      Cargando simulador...
    </div>
  </div>
);

function App() {
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    const validTabs = ['inicio', 'herramientas', 'educacion', 'glosario', 'asesores', 'acerca', 'privacidad', 'terminos'];
    if (tab && validTabs.includes(tab)) return tab;
    if (params.get('tool')) return 'herramientas';
    return 'herramientas';
  });
  const [activeTool, setActiveTool] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const tool = params.get('tool');
    const validTools = [
      'buy-vs-rent', 
      'compound-interest', 
      'savings-goal', 
      'fire', 
      'inflation', 
      'hipotecario-uva', 
      'comparador-historico', 
      'sueldo-neto', 
      'ganancias', 
      'broker-comparator',
      'installments-vs-cash'
    ];
    if (tool && validTools.includes(tool)) return tool;
    return 'buy-vs-rent';
  });
  const scrollRef = useRef(null);

  useEffect(() => {
    const handleChangeTab = (e) => {
      if (e.detail === 'asesores') {
        setActiveTab('asesores');
      } else if (e.detail === 'herramientas') {
        setActiveTab('herramientas');
      } else if (e.detail === 'inicio') {
        setActiveTab('inicio');
      } else if (e.detail === 'educacion') {
        setActiveTab('educacion');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('change-tab', handleChangeTab);
    return () => window.removeEventListener('change-tab', handleChangeTab);
  }, []);

  // MutationObserver temporal para ocultar todos los botones de "Descargar Gráfico"
  useEffect(() => {
    const hideDownloadButtons = () => {
      document.querySelectorAll('button').forEach(btn => {
        if (btn.textContent.includes('Descargar Gráfico')) {
          btn.style.setProperty('display', 'none', 'important');
        }
      });
    };

    hideDownloadButtons();

    const observer = new MutationObserver(hideDownloadButtons);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 250;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const getTabStyle = (tabName) => {
    const isActive = activeTab === tabName;
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '0.4rem',
      padding: '0.45rem 0.85rem',
      backgroundColor: isActive ? 'var(--bg-tertiary)' : 'transparent',
      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
      border: '1px solid',
      borderColor: isActive ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
      borderRadius: 'var(--border-radius-sm)',
      cursor: 'pointer',
      fontWeight: 500,
      fontSize: '0.875rem',
      transition: 'all 0.15s ease-in-out'
    };
  };

  return (
    <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation Bar */}
      <header style={{ 
        backgroundColor: 'rgba(15, 23, 42, 0.85)', 
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(51, 65, 85, 0.4)',
        padding: '0.75rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
      }}>
        <div className="container header-content">
          {/* Logo/Brand */}
          <div 
            onClick={() => setActiveTab('inicio')}
            style={{ 
              display: 'flex', 
              flexDirection: 'column',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Wallet className="text-accent-primary" size={20} />
              <span style={{ fontWeight: '700', fontSize: '1.25rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Valia</span>
            </div>
            <span style={{ fontSize: '0.625rem', color: 'var(--text-secondary)', fontWeight: '600', marginTop: '0.15rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Portal Financiero Educativo
            </span>
          </div>

          {/* Navigation Tabs */}
          <nav className="nav-tabs">
            <button onClick={() => setActiveTab('inicio')} style={getTabStyle('inicio')}>
              <Home size={16} />
              Inicio
            </button>
            <button onClick={() => setActiveTab('herramientas')} style={getTabStyle('herramientas')}>
              <Wrench size={16} />
              Herramientas
            </button>
            <button onClick={() => setActiveTab('educacion')} style={getTabStyle('educacion')}>
              <BookOpen size={16} />
              Educación
            </button>
            <button onClick={() => setActiveTab('glosario')} style={getTabStyle('glosario')}>
              <Book size={16} />
              Glosario
            </button>
            <button onClick={() => setActiveTab('asesores')} style={getTabStyle('asesores')}>
              <Users size={16} />
              Asesores
            </button>
            <button onClick={() => setActiveTab('acerca')} style={getTabStyle('acerca')}>
              <Info size={16} />
              Acerca de
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '2rem 0' }}>
        <Suspense fallback={<LoadingState />}>
          <div key={activeTab} className="animate-fade-in">
          {activeTab === 'inicio' && (
            <Inicio 
              onSelectTool={(toolId) => {
                setActiveTab('herramientas');
                setActiveTool(toolId);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {activeTab === 'herramientas' && (
            <div>
              {/* Tool Selector Carousel Wrapper */}
              <div className="tool-selector-container container" style={{ position: 'relative', paddingLeft: '2.5rem', paddingRight: '2.5rem', display: 'flex', alignItems: 'center' }}>
                
                {/* Left Fade Edge */}
                <div style={{
                  position: 'absolute',
                  left: '2.5rem',
                  top: '6px',
                  bottom: '6px',
                  width: '40px',
                  background: 'linear-gradient(to right, var(--bg-primary) 0%, transparent 100%)',
                  pointerEvents: 'none',
                  zIndex: 5,
                  borderRadius: 'var(--border-radius-lg) 0 0 var(--border-radius-lg)'
                }} />

                {/* Right Fade Edge */}
                <div style={{
                  position: 'absolute',
                  right: '2.5rem',
                  top: '6px',
                  bottom: '6px',
                  width: '40px',
                  background: 'linear-gradient(to left, var(--bg-primary) 0%, transparent 100%)',
                  pointerEvents: 'none',
                  zIndex: 5,
                  borderRadius: '0 var(--border-radius-lg) var(--border-radius-lg) 0'
                }} />

                {/* Left Slide Button */}
                <button 
                  onClick={() => scroll('left')}
                  className="scroll-btn scroll-btn-left"
                  style={{
                    position: 'absolute',
                    left: '0.5rem',
                    zIndex: 10,
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.2s',
                  }}
                >
                  <ChevronLeft size={20} />
                </button>

                <div 
                  ref={scrollRef}
                  className="tool-selector-scroll"
                  style={{
                    scrollBehavior: 'smooth',
                    width: '100%'
                  }}
                >
                  <button
                    className="btn"
                    onClick={() => setActiveTool('buy-vs-rent')}
                    style={{
                      backgroundColor: activeTool === 'buy-vs-rent' ? 'var(--accent-primary)' : 'transparent',
                      color: activeTool === 'buy-vs-rent' ? '#090D16' : 'var(--text-secondary)',
                      fontWeight: activeTool === 'buy-vs-rent' ? '600' : '500',
                      boxShadow: activeTool === 'buy-vs-rent' ? 'var(--shadow-glow), var(--shadow-sm)' : 'none',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    ¿Alquilar o Comprar?
                  </button>
                  <button
                    className="btn"
                    onClick={() => setActiveTool('compound-interest')}
                    style={{
                      backgroundColor: activeTool === 'compound-interest' ? 'var(--accent-primary)' : 'transparent',
                      color: activeTool === 'compound-interest' ? '#090D16' : 'var(--text-secondary)',
                      fontWeight: activeTool === 'compound-interest' ? '600' : '500',
                      boxShadow: activeTool === 'compound-interest' ? 'var(--shadow-glow), var(--shadow-sm)' : 'none',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    Interés Compuesto
                  </button>
                  <button
                    className="btn"
                    onClick={() => setActiveTool('savings-goal')}
                    style={{
                      backgroundColor: activeTool === 'savings-goal' ? 'var(--accent-primary)' : 'transparent',
                      color: activeTool === 'savings-goal' ? '#090D16' : 'var(--text-secondary)',
                      fontWeight: activeTool === 'savings-goal' ? '600' : '500',
                      boxShadow: activeTool === 'savings-goal' ? 'var(--shadow-glow), var(--shadow-sm)' : 'none',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    Objetivo de Ahorro
                  </button>
                  <button
                    className="btn"
                    onClick={() => setActiveTool('fire')}
                    style={{
                      backgroundColor: activeTool === 'fire' ? 'var(--accent-primary)' : 'transparent',
                      color: activeTool === 'fire' ? '#090D16' : 'var(--text-secondary)',
                      fontWeight: activeTool === 'fire' ? '600' : '500',
                      boxShadow: activeTool === 'fire' ? 'var(--shadow-glow), var(--shadow-sm)' : 'none',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    Simulador FIRE
                  </button>
                  <button
                    className="btn"
                    onClick={() => setActiveTool('inflation')}
                    style={{
                      backgroundColor: activeTool === 'inflation' ? 'var(--accent-primary)' : 'transparent',
                      color: activeTool === 'inflation' ? '#090D16' : 'var(--text-secondary)',
                      fontWeight: activeTool === 'inflation' ? '600' : '500',
                      boxShadow: activeTool === 'inflation' ? 'var(--shadow-glow), var(--shadow-sm)' : 'none',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    Inflación Histórica
                  </button>
                  <button
                    className="btn"
                    onClick={() => setActiveTool('hipotecario-uva')}
                    style={{
                      backgroundColor: activeTool === 'hipotecario-uva' ? 'var(--accent-primary)' : 'transparent',
                      color: activeTool === 'hipotecario-uva' ? '#090D16' : 'var(--text-secondary)',
                      fontWeight: activeTool === 'hipotecario-uva' ? '600' : '500',
                      boxShadow: activeTool === 'hipotecario-uva' ? 'var(--shadow-glow), var(--shadow-sm)' : 'none',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    Crédito UVA
                  </button>
                  <button
                    className="btn"
                    onClick={() => setActiveTool('comparador-historico')}
                    style={{
                      backgroundColor: activeTool === 'comparador-historico' ? 'var(--accent-primary)' : 'transparent',
                      color: activeTool === 'comparador-historico' ? '#090D16' : 'var(--text-secondary)',
                      fontWeight: activeTool === 'comparador-historico' ? '600' : '500',
                      boxShadow: activeTool === 'comparador-historico' ? 'var(--shadow-glow), var(--shadow-sm)' : 'none',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    Dólar vs PF vs Merval
                  </button>
                  <button
                    className="btn"
                    onClick={() => setActiveTool('sueldo-neto')}
                    style={{
                      backgroundColor: activeTool === 'sueldo-neto' ? 'var(--accent-primary)' : 'transparent',
                      color: activeTool === 'sueldo-neto' ? '#090D16' : 'var(--text-secondary)',
                      fontWeight: activeTool === 'sueldo-neto' ? '600' : '500',
                      boxShadow: activeTool === 'sueldo-neto' ? 'var(--shadow-glow), var(--shadow-sm)' : 'none',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    Sueldo Neto Freelancer
                  </button>
                  <button
                    className="btn"
                    onClick={() => setActiveTool('ganancias')}
                    style={{
                      backgroundColor: activeTool === 'ganancias' ? 'var(--accent-primary)' : 'transparent',
                      color: activeTool === 'ganancias' ? '#090D16' : 'var(--text-secondary)',
                      fontWeight: activeTool === 'ganancias' ? '600' : '500',
                      boxShadow: activeTool === 'ganancias' ? 'var(--shadow-glow), var(--shadow-sm)' : 'none',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    Simulador Ganancias
                  </button>
                  <button
                    className="btn"
                    onClick={() => setActiveTool('broker-comparator')}
                    style={{
                      backgroundColor: activeTool === 'broker-comparator' ? 'var(--accent-primary)' : 'transparent',
                      color: activeTool === 'broker-comparator' ? '#090D16' : 'var(--text-secondary)',
                      fontWeight: activeTool === 'broker-comparator' ? '600' : '500',
                      boxShadow: activeTool === 'broker-comparator' ? 'var(--shadow-glow), var(--shadow-sm)' : 'none',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    Comparador de Brokers
                  </button>
                  <button
                    className="btn"
                    onClick={() => setActiveTool('installments-vs-cash')}
                    style={{
                      backgroundColor: activeTool === 'installments-vs-cash' ? 'var(--accent-primary)' : 'transparent',
                      color: activeTool === 'installments-vs-cash' ? '#090D16' : 'var(--text-secondary)',
                      fontWeight: activeTool === 'installments-vs-cash' ? '600' : '500',
                      boxShadow: activeTool === 'installments-vs-cash' ? 'var(--shadow-glow), var(--shadow-sm)' : 'none',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    ¿Cuotas o Efectivo?
                  </button>
                </div>

                {/* Right Slide Button */}
                <button 
                  onClick={() => scroll('right')}
                  className="scroll-btn scroll-btn-right"
                  style={{
                    position: 'absolute',
                    right: '0.5rem',
                    zIndex: 10,
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.2s',
                  }}
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              <div key={activeTool} className="animate-fade-in">
                {activeTool === 'buy-vs-rent' && <BuyVsRentCalculator />}
                {activeTool === 'compound-interest' && <CompoundInterestCalculator />}
                {activeTool === 'savings-goal' && <SavingsGoalCalculator />}
                {activeTool === 'fire' && <FireCalculator />}
                {activeTool === 'inflation' && <InflationCalculator />}
                {activeTool === 'hipotecario-uva' && <HipotecarioUvaCalculator />}
                {activeTool === 'comparador-historico' && <ComparadorHistorico />}
                {activeTool === 'sueldo-neto' && <SueldoNetoCalculator />}
                {activeTool === 'ganancias' && <GananciasCalculator />}
                {activeTool === 'broker-comparator' && <BrokerComparator onNavigateToAsesores={() => setActiveTab('asesores')} />}
                {activeTool === 'installments-vs-cash' && <InstallmentsVsCashCalculator />}
              </div>
            </div>
          )}

          {activeTab === 'asesores' && <Asesores />}
          {activeTab === 'educacion' && <Blog />}
          {activeTab === 'glosario' && <Glosario />}
          {activeTab === 'acerca' && <AcercaDe />}
          {activeTab === 'privacidad' && <Privacidad />}
          {activeTab === 'terminos' && <Terminos />}
        </div>
        </Suspense>
      </main>



      {/* Footer */}
      <footer style={{ 
        backgroundColor: 'var(--bg-secondary)', 
        borderTop: '1px solid var(--border-color)', 
        padding: '3.5rem 0 2rem 0',
        marginTop: 'auto'
      }}>
        <div className="container" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '2.5rem'
        }}>
          {/* 4-Column Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem'
          }}>
            {/* Col 1: Brand Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div 
                onClick={() => {
                  setActiveTab('inicio');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  fontWeight: '700',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  color: 'var(--text-primary)'
                }}
              >
                <Wallet size={20} className="text-accent-primary" />
                <span>Valia</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                Herramientas educativas gratuitas para simulación y planificación patrimonial autónoma. Privacidad garantizada por diseño local.
              </p>
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.4rem', 
                fontSize: '0.75rem', 
                color: 'var(--accent-success)',
                fontWeight: 600,
                marginTop: '0.25rem'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-success)' }} />
                Seguridad Local Auditada
              </div>
            </div>

            {/* Col 2: Simuladores */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <strong style={{ fontSize: '0.875rem', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Simuladores
              </strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
                {[
                  { label: '¿Comprar o Alquilar?', tool: 'buy-vs-rent' },
                  { label: 'Interés Compuesto', tool: 'compound-interest' },
                  { label: 'Crédito Hipotecario UVA', tool: 'hipotecario-uva' },
                  { label: 'Simulador FIRE', tool: 'fire' },
                  { label: '¿Cuotas o Efectivo?', tool: 'installments-vs-cash' }
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveTab('herramientas');
                      setActiveTool(item.tool);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: activeTool === item.tool && activeTab === 'herramientas' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'color var(--transition-fast)'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Col 3: Recursos */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <strong style={{ fontSize: '0.875rem', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Recursos
              </strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
                {[
                  { label: 'Educación Financiera', tab: 'educacion' },
                  { label: 'Glosario de Términos', tab: 'glosario' },
                  { label: 'Acerca de Valia', tab: 'acerca' },
                  { label: 'Contacto de Soporte', tab: 'acerca' }
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveTab(item.tab);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: activeTab === item.tab ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'color var(--transition-fast)'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Col 4: Seguridad & Legal */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <strong style={{ fontSize: '0.875rem', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Transparencia & Legal
              </strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
                {[
                  { label: 'Términos de Uso', tab: 'terminos' },
                  { label: 'Política de Privacidad', tab: 'privacidad' },
                  { label: 'Fórmulas y Metodologías', tab: 'acerca' }
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveTab(item.tab);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: activeTab === item.tab ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'color var(--transition-fast)'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Lower Legal Disclaimer & Copyright */}
          <div style={{ 
            borderTop: '1px solid var(--border-color)', 
            paddingTop: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', maxWidth: '100%', margin: 0, lineHeight: '1.5', textAlign: 'justify' }}>
              <strong>Aviso Legal y Advertencia de Riesgo:</strong> Valia es una plataforma de contenido puramente educativo e ilustrativo. 
              Los cálculos, proyecciones, datos históricos y resultados simulados no constituyen asesoramiento financiero, recomendación de inversión, 
              oferta de adquisición o venta de valores, ni consultoría fiscal o legal. El rendimiento pasado de los activos financieros 
              no garantiza ni predice retornos futuros. Cada usuario es plenamente responsable de evaluar los riesgos y beneficios de sus decisiones 
              patrimoniales. Se recomienda la consulta con asesores financieros idóneos matriculados ante la Comisión Nacional de Valores (CNV) antes de operar.
            </p>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              flexWrap: 'wrap', 
              gap: '0.5rem',
              fontSize: '0.75rem', 
              color: 'var(--text-tertiary)',
              marginTop: '0.25rem'
            }}>
              <div>
                &copy; {new Date().getFullYear()} Valia. Todos los derechos reservados.
              </div>
              <div style={{ color: 'var(--text-tertiary)' }}>
                Desarrollado con fines educativos 🇦🇷
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
