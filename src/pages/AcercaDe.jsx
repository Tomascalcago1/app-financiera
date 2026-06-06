import React from 'react';
import { Wallet, Target, Shield, Heart, ExternalLink } from 'lucide-react';

const AcercaDe = () => {
  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 0', maxWidth: '800px' }}>
      
      {/* Hero */}
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          width: '64px', 
          height: '64px', 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-primary-hover))',
          marginBottom: '1.5rem'
        }}>
          <Wallet size={32} style={{ color: '#090D16' }} />
        </div>
        <h1 style={{ marginBottom: '0.75rem' }}>Acerca de Valia</h1>
        <p style={{ fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>
          Herramientas financieras gratuitas para tomar mejores decisiones con tu dinero.
        </p>
      </header>

      {/* Qué es Valia */}
      <section className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Target size={20} className="text-accent-primary" />
          ¿Qué es Valia?
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          <strong>Valia</strong> es una plataforma web de herramientas financieras diseñada para ayudar a personas 
          en Argentina y toda Latinoamérica a planificar su futuro económico. Nuestras calculadoras interactivas 
          te permiten simular escenarios complejos de manera visual y sencilla.
        </p>
        <p>
          Desde comparar si conviene alquilar o comprar una propiedad, hasta simular planes de retiro con 
          datos históricos reales del mercado, Valia pone a tu alcance las mismas herramientas que usan 
          los profesionales de las finanzas.
        </p>
      </section>

      {/* Herramientas */}
      <section className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Nuestras Herramientas</h2>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { name: '¿Comprar o Alquilar?', desc: 'Compara financieramente ambos escenarios considerando hipoteca, inversiones, inflación y apreciación inmobiliaria.' },
            { name: 'Interés Compuesto', desc: 'Proyecta el crecimiento de tu capital a lo largo del tiempo con escenarios optimista y conservador.' },
            { name: 'Objetivo de Ahorro', desc: 'Calcula exactamente cuánto debés aportar por mes para alcanzar una meta financiera.' },
            { name: 'Simulador FIRE', desc: 'Backtesting de retiro con 99 años de datos históricos reales del mercado estadounidense (desde 1926).' },
            { name: 'Inflación Histórica', desc: 'Comprende cómo cambia el poder adquisitivo del dinero con datos desde 1635 hasta hoy.' },
          ].map((tool, i) => (
            <li key={i} style={{ 
              padding: '0.75rem 1rem', 
              background: 'var(--bg-tertiary)', 
              borderRadius: 'var(--border-radius-sm)',
              borderLeft: '3px solid var(--accent-primary)'
            }}>
              <strong style={{ color: 'var(--text-primary)' }}>{tool.name}</strong>
              <p style={{ fontSize: '0.875rem', marginTop: '0.25rem', marginBottom: 0 }}>{tool.desc}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Disclaimer */}
      <section className="card" style={{ 
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(245, 158, 11, 0.03))',
        borderLeft: '4px solid var(--accent-warning)'
      }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={20} style={{ color: 'var(--accent-warning)' }} />
          Aviso Legal Importante
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          Valia es una herramienta <strong>educativa e informativa</strong>. Los resultados proporcionados por 
          nuestras calculadoras son estimaciones basadas en los datos y supuestos ingresados por el usuario, 
          y <strong>no constituyen asesoramiento financiero, fiscal ni legal</strong>.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          El rendimiento pasado no garantiza resultados futuros. Las simulaciones con datos históricos 
          (como el Simulador FIRE) muestran lo que <em>habría ocurrido</em> en períodos pasados, pero no 
          predicen el comportamiento futuro del mercado.
        </p>
        <p>
          Antes de tomar cualquier decisión financiera importante, te recomendamos consultar con un 
          asesor financiero profesional que pueda evaluar tu situación particular.
        </p>
      </section>

      {/* Fuentes */}
      <section className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Fuentes de Datos</h2>
        <p style={{ marginBottom: '1rem' }}>
          Los datos históricos utilizados en nuestras herramientas provienen de fuentes públicas y reconocidas:
        </p>
        <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)' }}>
          <li><strong>S&P 500, Bonos del Tesoro y T-Bills:</strong> Datos anuales desde 1926 (fuente: Robert Shiller, Yale University).</li>
          <li><strong>Índice de Precios al Consumidor (CPI):</strong> Bureau of Labor Statistics de EE.UU., con datos interpolados desde 1635.</li>
          <li><strong>Metodología FIRE:</strong> Basada en el estudio Trinity y la herramienta <a href="https://ficalc.app" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)' }}>ficalc.app</a>.</li>
          <li><strong>Fórmulas de Interés Compuesto:</strong> Validadas contra <a href="https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)' }}>Investor.gov</a>.</li>
        </ul>
      </section>

      {/* Contacto */}
      <section className="card" style={{ 
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08), rgba(6, 182, 212, 0.03))',
        borderLeft: '4px solid var(--accent-primary)'
      }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Heart size={20} className="text-accent-primary" />
          Contacto
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          Valia es un proyecto desarrollado en Argentina 🇦🇷 con el objetivo de democratizar el acceso a 
          herramientas de planificación financiera de calidad en toda Latinoamérica.
        </p>
        <p>
          ¿Tenés sugerencias, encontraste un error, o querés colaborar? Escribinos a{' '}
          <a href="mailto:contacto@valia.app" style={{ color: 'var(--accent-primary)' }}>contacto@valia.app</a>.
        </p>
      </section>

    </div>
  );
};

export default AcercaDe;
