import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  AlertTriangle, 
  TrendingUp, 
  Shield, 
  Calculator, 
  Percent, 
  Scale, 
  Landmark, 
  Users,
  Flame,
  ChevronRight
} from 'lucide-react';
import { trackEvent } from '../utils/analytics';

const questions = [
  {
    id: 1,
    title: '¿Qué porcentaje de tus ingresos lográs ahorrar mensualmente?',
    desc: 'El ahorro recurrente es el cimiento de la salud financiera. Pensá en el promedio de tus últimos meses.',
    options: [
      { text: 'No logro ahorrar nada o llego con lo justo a fin de mes', score: 1 },
      { text: 'Ahorro de forma ajustada (hasta un 10%)', score: 2 },
      { text: 'Ahorro de manera constante (entre 10% y 30%)', score: 3 },
      { text: 'Tengo un fuerte hábito de ahorro (más del 30%)', score: 4 }
    ]
  },
  {
    id: 2,
    title: '¿Dónde o cómo guardás tus ahorros actualmente?',
    desc: 'Mantener capital sin invertir o sin protección contra la inflación afecta su poder adquisitivo real.',
    options: [
      { text: 'En pesos en la cuenta del banco (caja de ahorro) o efectivo', score: 1 },
      { text: 'En billeteras virtuales (remuneradas) o plazos fijos clásicos', score: 2 },
      { text: 'En dólares físicos "bajo el colchón" o caja de seguridad', score: 3 },
      { text: 'Invertidos en Bolsa (CEDEARs, Fondos de Inversión, MEP, Bonos)', score: 4 }
    ]
  },
  {
    id: 3,
    title: '¿Cómo te manejás con las deudas (tarjetas de crédito, préstamos)?',
    desc: 'El costo financiero total de financiar saldos en Argentina es sumamente alto.',
    options: [
      { text: 'Tengo deudas pendientes y a veces pago el mínimo de la tarjeta', score: 1 },
      { text: 'Uso financiación en cuotas pero pago el total todos los meses', score: 2 },
      { text: 'No tengo deudas ni uso saldos de financiación', score: 4 }
    ]
  },
  {
    id: 4,
    title: '¿Cuál es tu principal meta financiera a mediano/largo plazo?',
    desc: 'Definir el propósito de tu dinero ayuda a seleccionar las herramientas y el horizonte de inversión.',
    options: [
      { text: 'Salir de deudas o lograr armar un fondo de reserva inicial', score: 1 },
      { text: 'Adquirir un bien (auto, viaje) o capitalizarme para una vivienda', score: 3 },
      { text: 'Multiplicar mi patrimonio para lograr independencia / retiro anticipado', score: 4 }
    ]
  },
  {
    id: 5,
    title: '¿Tenés un fondo de reserva constituido (3 a 6 meses de tus gastos)?',
    desc: 'Un colchón de liquidez previene tener que liquidar inversiones a pérdida ante emergencias.',
    options: [
      { text: 'No tengo fondo constituido (o es inferior a un mes de gastos)', score: 1 },
      { text: 'Sí, tengo ahorros líquidos para cubrir 3 meses o más de gastos', score: 4 }
    ]
  }
];

const FinancialTest = ({ onSelectTool, preloadTool }) => {
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);

  const handleStart = () => {
    setStarted(true);
    setCurrentStep(0);
    setAnswers({});
    setFinished(false);
    trackEvent('financial_test_started');
  };

  const handleAnswer = (score) => {
    const nextAnswers = { ...answers, [currentStep]: score };
    setAnswers(nextAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setFinished(true);
      const finalScore = Object.values(nextAnswers).reduce((acc, curr) => acc + curr, 0);
      const diagnosis = getDiagnosis(finalScore);
      trackEvent('financial_test_completed', { score: finalScore, profile: diagnosis.title });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRestart = () => {
    setStarted(false);
    setFinished(false);
    setCurrentStep(0);
    setAnswers({});
  };

  // Calcular puntaje total
  const totalScore = Object.values(answers).reduce((acc, curr) => acc + curr, 0);

  // Obtener diagnóstico según el puntaje
  const getDiagnosis = (score) => {
    if (score <= 9) {
      return {
        title: 'Alerta Financiera',
        badgeColor: 'rgba(239, 68, 68, 0.12)',
        textColor: 'var(--accent-danger)',
        icon: <AlertTriangle size={24} style={{ color: 'var(--accent-danger)' }} />,
        desc: 'Es urgente estabilizar tus finanzas personales, consolidar o reducir deudas de alto costo y constituir un fondo de emergencia inicial antes de asumir riesgos en inversiones.',
        recommendations: [
          {
            id: 'sueldo-neto',
            name: 'Sueldo Neto Freelancer',
            desc: 'Analizá tus retenciones, comisiones y optimizá tus ingresos netos.',
            icon: <Percent size={18} className="text-accent-primary" />
          },
          {
            id: 'savings-goal',
            name: 'Objetivo de Ahorro',
            desc: 'Planificá una reserva fija mensual para armar tu fondo de emergencia.',
            icon: <Calculator size={18} className="text-accent-primary" />
          }
        ],
        ctaText: 'Ver cómo ahorrar mi primer fondo',
        ctaAction: () => onSelectTool('savings-goal')
      };
    } else if (score <= 13) {
      return {
        title: 'Ahorro Conservador (Pérdida por Inflación)',
        badgeColor: 'rgba(245, 158, 11, 0.12)',
        textColor: 'var(--accent-warning)',
        icon: <Scale size={24} style={{ color: 'var(--accent-warning)' }} />,
        desc: 'Tenés capacidad de ahorro, pero mantener el capital parado en pesos líquidos o plazos fijos tradicionales está depreciando tu poder de compra real frente a la inflación de Argentina.',
        recommendations: [
          {
            id: 'savings-comparison',
            name: '¿UVA, Plazo Fijo o Caución?',
            desc: 'Compará dónde rinden más tus pesos y qué opción le gana a la inflación.',
            icon: <Landmark size={18} className="text-accent-primary" />
          },
          {
            id: 'installments-vs-cash',
            name: '¿Cuotas o Efectivo?',
            desc: 'Calculá el impacto de la inflación al financiar tus compras grandes.',
            icon: <Scale size={18} className="text-accent-primary" />
          }
        ],
        ctaText: 'Comparar rendimientos en Pesos',
        ctaAction: () => onSelectTool('savings-comparison')
      };
    } else if (score <= 17) {
      return {
        title: 'Ahorro Activo (Paso al Mercado)',
        badgeColor: 'rgba(16, 185, 129, 0.12)',
        textColor: 'var(--accent-success)',
        icon: <TrendingUp size={24} style={{ color: 'var(--accent-success)' }} />,
        desc: 'Tus finanzas son estables y contás con resguardo de emergencia. Sin embargo, para capitalizarte y batir la inflación a largo plazo, te falta dar el salto a invertir de forma profesional en la Bolsa.',
        recommendations: [
          {
            id: 'compound-interest',
            name: 'Interés Compuesto',
            desc: 'Simulá la capitalización de tus ahorros mensuales a largo plazo.',
            icon: <TrendingUp size={18} className="text-accent-primary" />
          },
          {
            id: 'broker-comparator',
            name: 'Comparador de Brokers',
            desc: 'Evaluá comisiones y cuentas remuneradas antes de abrir tu cuenta.',
            icon: <Landmark size={18} className="text-accent-primary" />
          }
        ],
        ctaText: 'Hablar con Asesor Matriculado',
        ctaAction: () => {
          window.dispatchEvent(new CustomEvent('change-tab', { detail: 'asesores' }));
        }
      };
    } else {
      return {
        title: 'Patrimonio en Expansión',
        badgeColor: 'rgba(6, 182, 212, 0.12)',
        textColor: 'var(--accent-primary)',
        icon: <Award size={24} style={{ color: 'var(--accent-primary)' }} />,
        desc: '¡Excelente gestión! Mantenés hábitos sólidos de inversión en el mercado y planificás a largo plazo. Tus prioridades actuales son optimizar tasas y modelar estrategias de retiro.',
        recommendations: [
          {
            id: 'fire',
            name: 'Simulador de Retiro',
            desc: 'Hacé backtesting de tu capital contra 99 años de datos históricos.',
            icon: <Flame size={18} className="text-accent-primary" />
          },
          {
            id: 'tna-to-tea',
            name: 'Conversor TNA a TEA',
            desc: 'Afiná las tasas efectivas anuales según capitalizaciones compuestas.',
            icon: <Percent size={18} className="text-accent-primary" />
          }
        ],
        ctaText: 'Probar Simulador de Retiro',
        ctaAction: () => onSelectTool('fire')
      };
    }
  };

  const diagnosis = finished ? getDiagnosis(totalScore) : null;
  const progressPercent = started && !finished ? Math.round(((currentStep) / questions.length) * 100) : 0;

  return (
    <div className="card" style={{
      background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)',
      border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-glow), var(--shadow-md)',
      padding: '2rem',
      borderRadius: 'var(--border-radius-lg)',
      transition: 'all 0.3s ease-in-out',
      maxWidth: '850px',
      margin: '0 auto',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative top border glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(to right, var(--accent-primary), var(--accent-success), var(--accent-warning))'
      }} />

      {/* 1. Welcome Screen */}
      {!started && (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', padding: '1rem 0' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 1rem',
            borderRadius: '50px',
            backgroundColor: 'rgba(6, 182, 212, 0.08)',
            border: '1px solid rgba(6, 182, 212, 0.2)',
            color: 'var(--accent-primary)',
            fontSize: '0.85rem',
            fontWeight: 500
          }}>
            <Sparkles size={14} />
            Diagnóstico Financiero Rápido
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
            ¿Qué tan sanas están tus Finanzas Personales?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px', lineHeight: 1.6, margin: 0 }}>
            Hacé este test anónimo de 5 preguntas adaptado a la realidad impositiva e inflacionaria de Argentina. Recibí al instante tu diagnóstico y descubrí las herramientas de optimización ideales para tu perfil.
          </p>
          <button 
            className="btn btn-primary"
            onClick={handleStart}
            style={{ 
              padding: '0.75rem 2rem', 
              fontSize: '0.95rem', 
              marginTop: '1rem',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            Comenzar Test Gratuito
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* 2. Questions Quiz Step */}
      {started && !finished && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Top Progress bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
              <span>Pregunta {currentStep + 1} de {questions.length}</span>
              <span>{progressPercent}% completado</span>
            </div>
            <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ 
                width: `${progressPercent}%`, 
                height: '100%', 
                backgroundColor: 'var(--accent-primary)', 
                transition: 'width 0.3s ease-in-out',
                borderRadius: '2px'
              }} />
            </div>
          </div>

          {/* Question Text */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0, lineHeight: 1.4 }}>
              {questions[currentStep].title}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              {questions[currentStep].desc}
            </p>
          </div>

          {/* Options List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            {questions[currentStep].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(option.score)}
                className="btn btn-outline"
                style={{
                  justifyContent: 'space-between',
                  padding: '1rem 1.25rem',
                  fontSize: '0.9rem',
                  textAlign: 'left',
                  borderRadius: 'var(--border-radius-md)',
                  border: '1px solid var(--border-color)',
                  background: 'rgba(30, 41, 59, 0.2)',
                  transition: 'all 0.15s ease-in-out',
                  width: '100%'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.4)';
                  e.currentTarget.style.backgroundColor = 'rgba(6, 182, 212, 0.04)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.2)';
                }}
              >
                <span style={{ color: 'var(--text-primary)', paddingRight: '1rem' }}>{option.text}</span>
                <ChevronRight size={16} className="text-accent-primary" />
              </button>
            ))}
          </div>

          {/* Back button */}
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              className="btn btn-outline"
              style={{
                alignSelf: 'flex-start',
                padding: '0.4rem 1rem',
                fontSize: '0.8rem',
                gap: '0.4rem',
                marginTop: '0.5rem',
                borderColor: 'transparent',
                color: 'var(--text-secondary)'
              }}
            >
              Atrás
            </button>
          )}
        </div>
      )}

      {/* 3. Results Screen */}
      {finished && diagnosis && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Result Header */}
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: diagnosis.badgeColor,
              border: `1px solid ${diagnosis.textColor}33`,
              marginBottom: '0.5rem'
            }}>
              {diagnosis.icon}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600, letterSpacing: '0.1em' }}>
                Tu Diagnóstico Financiero
              </span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                {diagnosis.title}
              </h2>
              <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent-primary)', marginTop: '0.25rem' }}>
                Puntaje: {totalScore} / 20 puntos
              </span>
            </div>

            <p style={{
              fontSize: '0.95rem',
              color: 'var(--text-secondary)',
              maxWidth: '650px',
              lineHeight: 1.6,
              margin: '0.5rem 0 0 0',
              padding: '1.25rem',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius-md)',
              borderLeft: `3px solid ${diagnosis.textColor}`
            }}>
              {diagnosis.desc}
            </p>
          </div>

          {/* Recommended tools */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, margin: 0, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Herramientas de Optimización Recomendadas:
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {diagnosis.recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="card"
                  onClick={() => onSelectTool(rec.id)}
                  onMouseEnter={() => preloadTool && preloadTool(rec.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    borderColor: 'var(--border-color)',
                    background: 'rgba(30, 41, 59, 0.4)',
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)'
                    }}>
                      {rec.icon}
                    </div>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{rec.name}</strong>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                    {rec.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom actions */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: '1.5rem',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1.5rem',
            marginTop: '0.5rem'
          }}>
            <button
              onClick={handleRestart}
              className="btn btn-outline"
              style={{
                padding: '0.6rem 1.25rem',
                fontSize: '0.85rem',
                gap: '0.5rem'
              }}
            >
              <RotateCcw size={14} />
              Volver a empezar
            </button>

            <button
              onClick={diagnosis.ctaAction}
              className="btn btn-primary"
              style={{
                padding: '0.65rem 1.75rem',
                fontSize: '0.875rem',
                gap: '0.5rem',
                boxShadow: 'var(--shadow-glow)'
              }}
            >
              {diagnosis.ctaText}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialTest;
