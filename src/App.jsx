import React, { useState, useRef, useEffect } from 'react';
import BuyVsRentCalculator from './modules/BuyVsRent/BuyVsRentCalculator';
import CompoundInterestCalculator from './modules/CompoundInterest/CompoundInterestCalculator';
import SavingsGoalCalculator from './modules/SavingsGoal/SavingsGoalCalculator';
import FireCalculator from './modules/FireCalc/FireCalculator';
import InflationCalculator from './modules/Inflation/InflationCalculator';
import HipotecarioUvaCalculator from './modules/HipotecarioUva/HipotecarioUvaCalculator';
import ComparadorHistorico from './modules/ComparadorHistorico/ComparadorHistorico';
import SueldoNetoCalculator from './modules/SueldoNeto/SueldoNetoCalculator';
import BrokerComparator from './modules/BrokerComparator/BrokerComparator';
import GananciasCalculator from './modules/Ganancias/GananciasCalculator';
import InstallmentsVsCashCalculator from './modules/InstallmentsVsCash/InstallmentsVsCashCalculator';

import AcercaDe from './pages/AcercaDe';
import Privacidad from './pages/Privacidad';
import Terminos from './pages/Terminos';
import Inicio from './pages/Inicio';
import Asesores from './pages/Asesores';
import Blog from './pages/Blog';
import Glosario from './pages/Glosario';
import { Home, Wrench, Wallet, Info, ChevronLeft, ChevronRight, Users, BookOpen, Book } from 'lucide-react';

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

  return (
    <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation Bar */}
      <header style={{ 
        backgroundColor: 'var(--bg-secondary)', 
        borderBottom: '1px solid var(--border-color)',
        padding: '1rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div className="container header-content">
          {/* Logo/Brand */}
          <div 
            onClick={() => setActiveTab('inicio')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              fontWeight: 'bold', 
              fontSize: '1.25rem',
              cursor: 'pointer'
            }}
          >
            <Wallet className="text-accent-primary" />
            <span>Valia</span>
          </div>

          {/* Navigation Tabs */}
          <nav className="nav-tabs">
            <button
              onClick={() => setActiveTab('inicio')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: activeTab === 'inicio' ? 'var(--bg-tertiary)' : 'transparent',
                color: activeTab === 'inicio' ? 'var(--text-primary)' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: 'var(--border-radius-sm)',
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'all 0.2s'
              }}
            >
              <Home size={18} />
              Inicio
            </button>
            <button
              onClick={() => setActiveTab('herramientas')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: activeTab === 'herramientas' ? 'var(--bg-tertiary)' : 'transparent',
                color: activeTab === 'herramientas' ? 'var(--text-primary)' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: 'var(--border-radius-sm)',
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'all 0.2s'
              }}
            >
              <Wrench size={18} />
              Herramientas
            </button>
            <button
              onClick={() => setActiveTab('educacion')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: activeTab === 'educacion' ? 'var(--bg-tertiary)' : 'transparent',
                color: activeTab === 'educacion' ? 'var(--text-primary)' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: 'var(--border-radius-sm)',
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'all 0.2s'
              }}
            >
              <BookOpen size={18} />
              Educación
            </button>
            <button
              onClick={() => setActiveTab('glosario')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: activeTab === 'glosario' ? 'var(--bg-tertiary)' : 'transparent',
                color: activeTab === 'glosario' ? 'var(--text-primary)' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: 'var(--border-radius-sm)',
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'all 0.2s'
              }}
            >
              <Book size={18} />
              Glosario
            </button>
            <button
              onClick={() => setActiveTab('asesores')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: activeTab === 'asesores' ? 'var(--bg-tertiary)' : 'transparent',
                color: activeTab === 'asesores' ? 'var(--text-primary)' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: 'var(--border-radius-sm)',
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'all 0.2s'
              }}
            >
              <Users size={18} />
              Asesores
            </button>
            <button
              onClick={() => setActiveTab('acerca')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: activeTab === 'acerca' ? 'var(--bg-tertiary)' : 'transparent',
                color: activeTab === 'acerca' ? 'var(--text-primary)' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: 'var(--border-radius-sm)',
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'all 0.2s'
              }}
            >
              <Info size={18} />
              Acerca de
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '2rem 0' }}>
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
      </main>



      {/* Footer */}
      <footer style={{ 
        backgroundColor: 'var(--bg-secondary)', 
        borderTop: '1px solid var(--border-color)', 
        padding: '2.5rem 0 2rem 0',
        marginTop: 'auto'
      }}>
        <div className="container" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '1.25rem',
          justifyContent: 'center',
          textAlign: 'center'
        }}>
          <div 
            onClick={() => setActiveTab('inicio')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            <Wallet size={20} className="text-accent-primary" />
            <span>Valia</span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            Herramientas educativas gratuitas para ayudarte a tomar decisiones financieras informadas. 
            Todos los cálculos se realizan localmente en tu navegador.
          </p>
          <nav style={{ 
            display: 'flex', 
            gap: '1.5rem', 
            flexWrap: 'wrap', 
            justifyContent: 'center',
            margin: '0.5rem 0'
          }}>
            <button 
              onClick={() => {
                setActiveTab('educacion');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: activeTab === 'educacion' ? 'var(--accent-primary)' : 'var(--text-secondary)', 
                cursor: 'pointer', 
                fontSize: '0.875rem', 
                fontWeight: 500,
                transition: 'color var(--transition-fast)' 
              }}
            >
              Educación
            </button>
            <button 
              onClick={() => {
                setActiveTab('glosario');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: activeTab === 'glosario' ? 'var(--accent-primary)' : 'var(--text-secondary)', 
                cursor: 'pointer', 
                fontSize: '0.875rem', 
                fontWeight: 500,
                transition: 'color var(--transition-fast)' 
              }}
            >
              Glosario
            </button>
            <button 
              onClick={() => {
                setActiveTab('acerca');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: activeTab === 'acerca' ? 'var(--accent-primary)' : 'var(--text-secondary)', 
                cursor: 'pointer', 
                fontSize: '0.875rem', 
                fontWeight: 500,
                transition: 'color var(--transition-fast)' 
              }}
            >
              Acerca de
            </button>
            <button 
              onClick={() => {
                setActiveTab('privacidad');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: activeTab === 'privacidad' ? 'var(--accent-primary)' : 'var(--text-secondary)', 
                cursor: 'pointer', 
                fontSize: '0.875rem', 
                fontWeight: 500,
                transition: 'color var(--transition-fast)' 
              }}
            >
              Política de Privacidad
            </button>
            <button 
              onClick={() => {
                setActiveTab('terminos');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: activeTab === 'terminos' ? 'var(--accent-primary)' : 'var(--text-secondary)', 
                cursor: 'pointer', 
                fontSize: '0.875rem', 
                fontWeight: 500,
                transition: 'color var(--transition-fast)' 
              }}
            >
              Términos de Uso
            </button>
          </nav>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
            &copy; {new Date().getFullYear()} Valia. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
