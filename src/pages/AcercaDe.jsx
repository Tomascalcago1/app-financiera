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
            { name: 'Simulador de Retiro', desc: 'Backtesting de retiro con 99 años de datos históricos reales del mercado estadounidense (desde 1926).' },
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

      {/* Compromisos de Confianza */}
      <section className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
          Nuestros Compromisos de Confianza
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          <div style={{ padding: '1.25rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={16} />
              Privacidad Absoluta
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4', margin: 0 }}>
              No requerimos registro de usuarios, correos electrónicos ni tarjetas de crédito. Tus datos financieros nunca se envían ni guardan en un servidor externo.
            </p>
          </div>
          <div style={{ padding: '1.25rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={16} />
              Rigor y Transparencia
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4', margin: 0 }}>
              Utilizamos fórmulas estándares del mercado, datos históricos oficiales e índices provistos por entidades reguladas o académicas de renombre.
            </p>
          </div>
          <div style={{ padding: '1.25rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Heart size={16} />
              Independencia Editorial
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4', margin: 0 }}>
              Valia es un portal de acceso libre y gratuito. No recibimos comisiones ocultas por recomendar productos ni colocamos anuncios invasivos.
            </p>
          </div>
        </div>
      </section>

      {/* Metodología Matemática */}
      <section className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
          Metodología Matemática de Cálculo
        </h2>
        <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
          En Valia creemos en la transparencia absoluta. A continuación, detallamos los modelos matemáticos y algoritmos lógicos empleados por nuestros simuladores:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Interés Compuesto */}
          <div style={{ padding: '1.25rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--border-radius-sm)', borderLeft: '3px solid var(--accent-primary)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              1. Interés Compuesto con Aportes
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Calcula el crecimiento del capital con capitalización periódica (mensual) combinando el interés compuesto clásico y la anualidad ordinaria (aportes):
            </p>
            <div style={{ 
              fontFamily: 'monospace', 
              background: 'rgba(0,0,0,0.25)', 
              padding: '0.75rem', 
              borderRadius: '4px', 
              fontSize: '0.85rem', 
              color: 'var(--accent-primary)',
              textAlign: 'center',
              margin: '0.5rem 0'
            }}>
              VF = CI * (1 + r/n)^(n*t) + PMT * [((1 + r/n)^(n*t) - 1) / (r/n)]
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>
              Donde: <strong>VF</strong> = Valor Futuro • <strong>CI</strong> = Capital Inicial • <strong>PMT</strong> = Aporte Mensual • <strong>r</strong> = Tasa de Interés Anual Nominal • <strong>n</strong> = Frecuencia de Capitalización (12) • <strong>t</strong> = Tiempo en Años.
            </div>
          </div>

          {/* Créditos UVA */}
          <div style={{ padding: '1.25rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--border-radius-sm)', borderLeft: '3px solid var(--accent-primary)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              2. Amortización de Créditos UVA
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              El capital prestado se convierte a Unidades de Valor Adquisitivo (UVA) al valor de cotización del día de firma del crédito. El saldo de la deuda se amortiza en UVAs bajo el sistema Francés o Alemán, indexándose las cuotas resultantes según la inflación del IPC:
            </p>
            <div style={{ 
              fontFamily: 'monospace', 
              background: 'rgba(0,0,0,0.25)', 
              padding: '0.75rem', 
              borderRadius: '4px', 
              fontSize: '0.85rem', 
              color: 'var(--accent-primary)',
              textAlign: 'center',
              margin: '0.5rem 0'
            }}>
              Cuota UVA (Francés) = Deuda UVA * [i_u * (1 + i_u)^k] / [((1 + i_u)^k) - 1]
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>
              Donde: <strong>i_u</strong> = Tasa de interés mensual real pactada • <strong>k</strong> = Cuotas restantes. La cuota en pesos es: <strong>Cuota ($) = Cuota UVA * Valor UVA de Facturación (ajustado por CER)</strong>.
            </div>
          </div>

          {/* FIRE */}
          <div style={{ padding: '1.25rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--border-radius-sm)', borderLeft: '3px solid var(--accent-primary)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              3. Simulación de Retiro Temprano (Regla del 4%)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Basada en el estudio de asignación de activos de la Universidad de Trinity. El simulador evalúa la probabilidad de supervivencia patrimonial mediante "backtesting" continuo, corriendo la cartera contra series reales mensuales del S&P 500 y Bonos del Tesoro de EE.UU. desde 1926:
            </p>
            <div style={{ 
              fontFamily: 'monospace', 
              background: 'rgba(0,0,0,0.25)', 
              padding: '0.75rem', 
              borderRadius: '4px', 
              fontSize: '0.85rem', 
              color: 'var(--accent-primary)',
              textAlign: 'center',
              margin: '0.5rem 0'
            }}>
              Retiro_t = Gasto_Inicial * (1 + Inflación_Acumulada_t)
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>
              El saldo de la cartera se actualiza mes a mes: <strong>Saldo_t = (Saldo_t-1 - Retiro_t/12) * (1 + Retorno_Mercado_t)</strong>. Si el saldo cae a cero antes del plazo objetivo, la simulación se considera fallida.
            </div>
          </div>

          {/* Impuesto a las Ganancias */}
          <div style={{ padding: '1.25rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--border-radius-sm)', borderLeft: '3px solid var(--accent-primary)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              4. Impuestos y Escalas Progresivas
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Para estimar el Impuesto a las Ganancias (4° categoría) y las cuotas de Monotributo vigentes para el período fiscal 2026, aplicamos las escalas progresivas provistas por los marcos regulatorios de la AFIP/ARCA:
            </p>
            <div style={{ 
              fontFamily: 'monospace', 
              background: 'rgba(0,0,0,0.25)', 
              padding: '0.75rem', 
              borderRadius: '4px', 
              fontSize: '0.85rem', 
              color: 'var(--accent-primary)',
              textAlign: 'center',
              margin: '0.5rem 0'
            }}>
              Impuesto Neto = Cargo_Fijo + (Ganancia_Neta_Imponible - Piso_Escala) * Alícuota_Marginal
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>
              Donde: <strong>Ganancia Neta Imponible</strong> = Ingreso Bruto - Deducciones Generales (mínimo no imponible, cargas de familia, prepagas, alquileres) - Aportes de ley.
            </div>
          </div>
        </div>
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
          (como el Simulador de Retiro) muestran lo que <em>habría ocurrido</em> en períodos pasados, pero no 
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
          <li><strong>Metodología de Retiro Temprano:</strong> Basada en el estudio Trinity y la herramienta <a href="https://ficalc.app" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)' }}>ficalc.app</a>.</li>
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
