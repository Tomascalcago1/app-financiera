import React, { useState } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  ArrowLeft, 
  Search, 
  ChevronRight, 
  Flame, 
  TrendingUp, 
  Home,
  MessageSquare
} from 'lucide-react';

const Blog = () => {
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');

  const articles = [
    {
      id: 'regla-4-por-ciento-fire',
      title: 'La Regla del 4% en Argentina: ¿Cómo calcular tu retiro temprano?',
      summary: 'Descubrí los fundamentos de la simulación FIRE (Financial Independence, Retire Early) y cómo adaptar la regla matemática del retiro seguro al contexto de inflación y devaluación local.',
      date: '07 de Junio, 2026',
      readTime: '6 min de lectura',
      category: 'inversiones',
      icon: <Flame size={20} className="text-accent-warning" />,
      content: (
        <div>
          <p>La **Regla del 4%** es el cimiento matemático del movimiento mundial **FIRE** (Financial Independence, Retire Early). Originada en el famoso <em>Estudio Trinity</em> de 1998 en Estados Unidos, esta regla establece que un inversor puede retirar el 4% de su portafolio acumulado durante el primer año de retiro, ajustar esa cantidad por inflación en los años siguientes, y tener una probabilidad cercana al 95% de que sus fondos duren al menos 30 años sin agotarse.</p>
          
          <h3>¿Cómo se calcula en la práctica?</h3>
          <p>Si tus gastos anuales proyectados para vivir de rentas son de <strong>u$s 12.000</strong> (unos u$s 1.000 por mes), para calcular el tamaño de tu portafolio necesario debés multiplicar tu gasto anual por 25 (el inverso de 4%):</p>
          <blockquote style={{ 
            borderLeft: '4px solid var(--accent-primary)', 
            padding: '0.75rem 1rem', 
            margin: '1.5rem 0',
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: '0 var(--border-radius-sm) var(--border-radius-sm) 0'
          }}>
            <strong>Portafolio Necesario = Gastos Anuales × 25</strong><br />
            u$s 12.000 × 25 = u$s 300.000.
          </blockquote>
          
          <h3>El Desafío de Aplicarla en Argentina</h3>
          <p>Tener un portafolio invertido puramente en pesos argentinos para retirar un 4% anual es extremadamente riesgoso debido a la devaluación sistémica y la volatilidad inflacionaria. Para aplicar esta regla con éxito desde nuestro país, se deben considerar los siguientes factores:</p>
          <ul>
            <li><strong>Portafolio dolarizado:</strong> El capital debe estar invertido en activos globales de renta variable (como ETFs del S&P 500 o Nasdaq a través de CEDEARs) y renta fija de alta calidad (como Obligaciones Negociables de empresas sólidas o bonos del tesoro de EE.UU.).</li>
            <li><strong>Tasa de retiro conservadora:</strong> Dado que el costo de vida en dólares en Argentina fluctúa sustancialmente y que los períodos de retiro temprano duran más de 30 años, muchos analistas sugieren una tasa de retiro más prudente, en torno al <strong>3% o 3,5%</strong>.</li>
            <li><strong>Fondos de Emergencia y Liquidez:</strong> Contar con un colchón de 1 a 2 años de gastos líquidos en cuentas remuneradas o Fondos Comunes de Inversión (FCI) Money Market evita tener que liquidar acciones en momentos de mercado bajista (el llamado "riesgo de secuencia de retornos").</li>
          </ul>

          <p>Hacer un <em>backtesting</em> o simulación histórica (como la que ofrece nuestro <strong>Simulador FIRE</strong> en la pestaña Herramientas) te permite analizar cómo le hubiera ido a tu dinero atravesando crisis reales como la burbuja de las puntocom (2000), la crisis subprime (2008) o la Gran Depresión de 1929, brindándote tranquilidad científica antes de dar el gran paso.</p>
        </div>
      )
    },
    {
      id: 'interes-compuesto-secreto-ahorro',
      title: 'Interés Compuesto: El motor silencioso para multiplicar tu capital',
      summary: 'Albert Einstein lo llamó la octava maravilla del mundo. Te explicamos cómo funciona el interés compuesto, cómo se diferencia del interés simple y cómo empezar a aprovecharlo con herramientas locales.',
      date: '05 de Junio, 2026',
      readTime: '4 min de lectura',
      category: 'ahorro',
      icon: <TrendingUp size={20} className="text-accent-primary" />,
      content: (
        <div>
          <p>El **interés compuesto** es el proceso por el cual los intereses que genera una inversión se reinvierten en el capital inicial, de modo que en el siguiente período esos intereses acumulados vuelven a generar nuevos intereses. Se produce un efecto de "bola de nieve" que crece de forma exponencial a lo largo del tiempo.</p>

          <h3>Diferencia entre Interés Simple e Interés Compuesto</h3>
          <p>Imaginemos que invertís $100.000 a una tasa del 10% anual:</p>
          <ul>
            <li><strong>Con Interés Simple:</strong> Cada año retirás tus ganancias. Por ende, todos los años ganás exactamente $10.000. Al cabo de 10 años, tenés tus $100.000 iniciales más $100.000 de ganancias. Total: $200.000.</li>
            <li><strong>Con Interés Compuesto:</strong> No retirás los intereses, los dejás invertidos. El primer año ganás $10.000 (total $110.000). El segundo año, ganás el 10% de $110.000, es decir $11.000 (total $121.000). El tercer año ganás el 10% de $121.000 ($12.100). Al cabo de 10 años, tu capital inicial se habrá convertido en <strong>$259.374</strong> sin haber agregado un solo peso extra.</li>
          </ul>

          <h3>Los Tres Factores Clave</h3>
          <ol>
            <li><strong>El Tiempo:</strong> El interés compuesto premia a los inversores que empiezan temprano. Cuanto más largo sea el plazo, más empinada se vuelve la curva de crecimiento.</li>
            <li><strong>La Constancia:</strong> Acompañar el capital inicial con pequeños aportes mensuales acelera drásticamente el proceso de acumulación.</li>
            <li><strong>La Tasa de Interés:</strong> Incluso una pequeña variación de 1 o 2 puntos porcentuales en la rentabilidad anual puede significar una diferencia de miles de dólares al cabo de 20 o 30 años.</li>
          </ol>

          <p>En la economía argentina actual, podés empezar a aplicar el interés compuesto utilizando instrumentos sencillos como el Plazo Fijo UVA (reinvirtiendo el capital acumulado al vencimiento), Cauciones bursátiles a 7 días, o Fondos Comunes de Inversión (FCI) con rescate inmediato. Para proyectar tu crecimiento personalizado, te recomendamos utilizar nuestra **Calculadora de Interés Compuesto** en la pestaña de Herramientas.</p>
        </div>
      )
    },
    {
      id: 'credito-uva-vs-tasa-fija',
      title: 'Crédito UVA vs Tasa Fija: ¿Qué conviene para comprar vivienda?',
      summary: 'Analizamos pros y contras de los créditos hipotecarios UVA frente a las alternativas tradicionales en el contexto inflacionario argentino. Claves para evaluar el impacto en tu cuota y salario.',
      date: '02 de Junio, 2026',
      readTime: '5 min de lectura',
      category: 'vivienda',
      icon: <Home size={20} className="text-accent-primary" />,
      content: (
        <div>
          <p>Adquirir una vivienda es la decisión financiera más importante en la vida de una persona. Con el regreso de los créditos hipotecarios en Argentina, la pregunta del millón volvió a surgir: **¿conviene tomar un crédito hipotecario UVA o buscar opciones tradicionales de tasa fija?**</p>

          <h3>¿Qué es el Crédito UVA?</h3>
          <p>El **UVA (Unidad de Valor Adquisitivo)** es una medida indexada diariamente por el Coeficiente de Estabilización de Referencia (CER), el cual sigue de cerca el Índice de Precios al Consumidor (IPC). En un crédito UVA, tu deuda está nominada en UVAs y el banco te cobra un interés fijo por encima de la indexación (por ejemplo, UVA + 5.5%). Esto significa que tu saldo deudor y el monto en pesos de tu cuota subirán exactamente al ritmo de la inflación del país.</p>

          <h3>Comparativa Directa</h3>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '0.5rem' }}>Característica</th>
                <th style={{ padding: '0.5rem' }}>Crédito UVA</th>
                <th style={{ padding: '0.5rem' }}>Tasa Fija Tradicional</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.5rem', fontWeight: 600 }}>Cuota Inicial</td>
                <td style={{ padding: '0.5rem', color: 'var(--accent-success)' }}>Baja (Fácil de calificar)</td>
                <td style={{ padding: '0.5rem', color: 'var(--accent-danger)' }}>Muy alta (Calificación difícil)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.5rem', fontWeight: 600 }}>Riesgo Principal</td>
                <td style={{ padding: '0.5rem' }}>Inflación supera a los salarios</td>
                <td style={{ padding: '0.5rem' }}>Quedar con cuota alta si la inflación baja</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.5rem', fontWeight: 600 }}>Tasa de Interés</td>
                <td style={{ padding: '0.5rem' }}>Baja (ej: 4% a 7% anual)</td>
                <td style={{ padding: '0.5rem' }}>Alta (tasas de doble dígito en pesos)</td>
              </tr>
            </tbody>
          </table>

          <h3>Claves para la Toma de Decisión</h3>
          <ul>
            <li><strong>Relación Cuota-Ingreso:</strong> Por ley, la cuota inicial de un crédito UVA no puede superar el 25% de tus ingresos comprobables. Si los salarios pierden poder adquisitivo contra la inflación durante varios meses seguidos, la cuota representará un porcentaje mayor de tu sueldo.</li>
            <li><strong>Sistema Francés vs Alemán:</strong> El sistema francés mantiene la cuota en UVA constante (ideal para previsibilidad inicial). El sistema alemán amortiza más rápido el capital al principio, lo que hace que la cuota medida en UVA descienda mes a mes (ideal si tenés ahorros extra para las primeras cuotas).</li>
            <li><strong>Estrategia de Mitigación:</strong> Una excelente estrategia para protegerte frente a un crédito UVA es ahorrar un fondo en activos que rindan a la par o por encima de la inflación (como CEDEARs o fondos CER en Balanz) para usar como amortizaciones extraordinarias si la cuota llega a subir de forma incómoda.</li>
          </ul>

          <p>Para proyectar cómo afectaría la inflación real y estimar el valor futuro de las cuotas de tu préstamo según el sistema francés o alemán, podés usar nuestra herramienta **Hipotecario UVA** en la pestaña de Herramientas.</p>
        </div>
      )
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 0', maxWidth: '1000px' }}>
      
      {selectedArticleId ? (
        // Full Article View
        (() => {
          const article = articles.find(a => a.id === selectedArticleId);
          return (
            <article style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <button 
                  onClick={() => setSelectedArticleId(null)} 
                  className="btn btn-outline"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
                >
                  <ArrowLeft size={16} />
                  Volver al Centro de Educación
                </button>
              </div>

              <header>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <span style={{ textTransform: 'uppercase', color: 'var(--accent-primary)', fontWeight: 'bold' }}>{article.category}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={12} />
                    {article.date}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={12} />
                    {article.readTime}
                  </span>
                </div>
                <h1 style={{ fontSize: '2.25rem', lineHeight: '1.2', fontWeight: 700, marginBottom: '1rem' }}>
                  {article.title}
                </h1>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                  {article.summary}
                </p>
              </header>

              <hr style={{ border: '0', borderTop: '1px solid var(--border-color)' }} />

              <div 
                className="blog-content-body"
                style={{ 
                  color: 'var(--text-secondary)', 
                  lineHeight: '1.8', 
                  fontSize: '1.025rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem'
                }}
              >
                {article.content}
              </div>

              {/* Internal CTA card for advisors */}
              <div className="card" style={{ 
                marginTop: '3rem', 
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.06), rgba(6, 182, 212, 0.01))',
                border: '1px solid rgba(6, 182, 212, 0.2)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>¿Buscás llevar esta teoría a la práctica?</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                      Consultá gratis con un asesor idóneo matriculado de Balanz para estructurar tu cartera de inversión o planificar tu crédito.
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      localStorage.setItem('valia_advisor_goal_context', article.category === 'vivienda' ? 'vivienda' : article.category === 'inversiones' ? 'retiro' : 'ahorro');
                      window.dispatchEvent(new CustomEvent('change-tab', { detail: 'asesores' }));
                    }}
                    className="btn btn-primary"
                    style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    Contactar Asesor
                    <MessageSquare size={16} />
                  </button>
                </div>
              </div>

            </article>
          );
        })()
      ) : (
        // Category List View
        <div>
          {/* Header */}
          <header className="calculator-header" style={{ marginBottom: '3rem' }}>
            <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <BookOpen size={32} className="text-accent-primary" />
              Educación Financiera
            </h1>
            <p>Guías prácticas e independientes para entender el mercado, planificar tus inversiones y tomar decisiones inteligentes.</p>
          </header>

          {/* Search and Category Filters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
            
            {/* Search Input */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '500px', margin: '0 auto' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input 
                type="text" 
                className="input-field" 
                placeholder="Buscar artículos (ej: FIRE, Interés compuesto)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.5rem', width: '100%', height: '44px', borderRadius: '50px' }}
              />
            </div>

            {/* Categories */}
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {['todos', 'inversiones', 'ahorro', 'vivienda'].map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-outline'}`}
                  style={{ 
                    padding: '0.35rem 1rem', 
                    fontSize: '0.85rem', 
                    borderRadius: '50px',
                    textTransform: 'capitalize'
                  }}
                >
                  {category}
                </button>
              ))}
            </div>

          </div>

          {/* Articles Grid */}
          {filteredArticles.length === 0 ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No se encontraron artículos que coincidan con tu búsqueda.
            </div>
          ) : (
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {filteredArticles.map(article => (
                <div 
                  key={article.id} 
                  className="card"
                  onClick={() => setSelectedArticleId(article.id)}
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '1rem', 
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'transform var(--transition-fast), border-color var(--transition-fast)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.4)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ 
                        fontSize: '0.65rem', 
                        fontWeight: 'bold', 
                        color: 'var(--accent-primary)', 
                        textTransform: 'uppercase',
                        backgroundColor: 'rgba(6, 182, 212, 0.08)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px'
                      }}>
                        {article.category}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={12} />
                        {article.readTime}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', lineHeight: '1.3', fontWeight: 600 }}>{article.title}</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      {article.summary}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{article.date}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      Leer artículo
                      <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default Blog;
