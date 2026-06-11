import React, { useState, useEffect } from 'react';
import { Book, Search, ChevronDown, ChevronUp, Star, Share2 } from 'lucide-react';



const Glosario = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('todos');
  const [copiedTermId, setCopiedTermId] = useState(null);
  const [openTermId, setOpenTermId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('termino') || null;
  });

  useEffect(() => {
    const url = new URL(window.location.href);
    const currentTerm = url.searchParams.get('termino');
    if (openTermId !== currentTerm) {
      if (openTermId) {
        url.searchParams.set('termino', openTermId);
      } else {
        url.searchParams.delete('termino');
      }
      window.history.pushState({}, '', url.toString());
    }
  }, [openTermId]);

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setOpenTermId(params.get('termino') || null);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);


  const terms = [
    {
      id: 'cedear',
      term: 'CEDEAR (Certificado de Depósito Argentino)',
      definition: 'Es un certificado representativo de acciones de empresas extranjeras (como Apple, Google o Coca-Cola) que cotizan en bolsas internacionales pero se pueden comprar y vender en pesos o dólares desde una cuenta de inversión local en Argentina. Permite dolarizar ahorros y evitar el riesgo local.',
      category: 'inversiones',
      highlight: true
    },
    {
      id: 'on',
      term: 'Obligación Negociable (ON)',
      definition: 'Es un instrumento de deuda emitido por empresas privadas (como YPF, Pampa Energía o Telecom) para financiarse. Al comprar una ON, le prestás dinero a la empresa a cambio de una tasa de interés preestablecida (cupón) y la devolución del capital original. Suelen pagar intereses en dólares semestralmente y son ideales para generar ingresos pasivos en moneda dura.',
      category: 'inversiones',
      highlight: true
    },
    {
      id: 'caucion',
      term: 'Caución Bursátil',
      definition: 'Es un préstamo a muy corto plazo (usualmente entre 1 y 7 días) realizado a través de la bolsa de comercio. Está garantizado por títulos (bonos o acciones) que el tomador del préstamo deja en garantía. Para el colocador del dinero, funciona como un "plazo fijo de corto plazo" extremadamente seguro y líquido, útil para hacer rendir dinero de fin de semana o pocos días.',
      category: 'inversiones'
    },
    {
      id: 'fci',
      term: 'FCI (Fondo Común de Inversión)',
      definition: 'Es un patrimonio formado por los aportes de múltiples ahorristas que tienen un objetivo de inversión común. Este dinero es administrado por profesionales que compran una cartera diversificada de activos (como plazos fijos, bonos o acciones). Permite diversificar desde montos muy bajos y acceder a distintos mercados sin necesidad de ser un experto.',
      category: 'inversiones'
    },
    {
      id: 'tna',
      term: 'TNA (Tasa Nominal Anual)',
      definition: 'Es el porcentaje de interés que se pacta para una operación financiera por el plazo de un año, pero que no tiene en cuenta la capitalización de los intereses. Es un valor de referencia impreciso si se decide reinvertir los intereses periódicamente.',
      category: 'conceptos'
    },
    {
      id: 'tea',
      term: 'TEA (Tasa Efectiva Anual)',
      definition: 'Es la tasa de interés real que se percibe en un año cuando los intereses generados se reinvierten (se capitalizan) de forma periódica en el capital principal. En Argentina, la diferencia entre la TNA y la TEA es crucial al analizar cauciones, cuentas remuneradas o plazos fijos, ya que la TEA representa el interés real compuesto acumulado.',
      category: 'conceptos',
      highlight: true
    },
    {
      id: 'cft',
      term: 'CFT (Costo Financiero Total)',
      definition: 'Es la tasa real que describe el costo total de solicitar un préstamo o financiar consumos con tarjeta de crédito. El CFT incluye no solo la tasa de interés nominal (TNA), sino también todos los cargos asociados como comisiones administrativas, seguros (de vida, de saldo), impuestos de sellos e IVA. Es el número clave para comparar qué crédito o financiación es la más barata.',
      category: 'conceptos',
      highlight: true
    },
    {
      id: 'uva',
      term: 'UVA (Unidad de Valor Adquisitivo)',
      definition: 'Es una unidad de medida creada por el Banco Central que se actualiza diariamente según el coeficiente CER (índice inflacionario). Se utiliza para indexar créditos hipotecarios, prendarios e inversiones (Plazo Fijo UVA). Su objetivo es mantener el poder adquisitivo constante a lo largo del tiempo, haciendo que las deudas o ahorros acompañen los precios del consumidor.',
      category: 'creditos'
    },
    {
      id: 'cer',
      term: 'Coeficiente CER (Estabilización de Referencia)',
      definition: 'Es un índice diario calculado por el Banco Central de la República Argentina que refleja la evolución de la inflación minorista (IPC). Se utiliza para indexar diversos instrumentos financieros, como bonos del tesoro ajustados por CER y depósitos o préstamos denominados en UVAs.',
      category: 'creditos'
    },
    {
      id: 'monotributo',
      term: 'Monotributo',
      definition: 'Es un régimen simplificado para pequeños contribuyentes en Argentina. Unifica el pago de impuestos nacionales (IVA y Ganancias), el aporte jubilatorio y la obra social en una única cuota fija mensual que varía según la categoría del contribuyente (determinada principalmente por su facturación anual y parámetros de consumo).',
      category: 'impuestos'
    },
    {
      id: 'responsable-inscripto',
      term: 'Responsable Inscripto (Régimen General)',
      definition: 'Es la persona física o jurídica incorporada al Régimen General de impuestos. A diferencia de un monotributista, un Responsable Inscripto debe facturar con IVA discriminado, liquidar y pagar mensualmente el Impuesto al Valor Agregado, pagar anualmente Impuesto a las Ganancias y abonar la cuota mensual de Autónomos de manera obligatoria.',
      category: 'impuestos'
    },
    {
      id: 'ganancias',
      term: 'Impuesto a las Ganancias (4° Categoría)',
      definition: 'Es un tributo nacional que grava los ingresos personales de los trabajadores en relación de dependencia y jubilados. Se calcula de forma mensual y progresiva con alícuotas del 5% al 35% aplicadas sobre los salarios que superen los mínimos y deducciones personales vigentes en cada período impositivo.',
      category: 'impuestos'
    },
    {
      id: 'siradig',
      term: 'SIRADIG (Formulario 572)',
      definition: 'Es el sistema web de la AFIP/ARCA que permite a los empleados en relación de dependencia registrar mensualmente sus cargas de familia (cónyuge, hijos) y deducciones generales (seguro de vida, prepaga, alquileres, servicio doméstico, percepciones del dólar tarjeta) para que el empleador las compute y reduzca el importe retenido por el Impuesto a las Ganancias.',
      category: 'impuestos'
    },
    {
      id: 'dolar-mep',
      term: 'Dólar MEP (Mercado Electrónico de Pagos)',
      definition: 'Es un tipo de cambio financiero implícito que surge de realizar una operación bursátil legal en la bolsa local. Consiste en comprar un bono soberano (generalmente el AL30 o GD30) con pesos y, luego de cumplir un plazo mínimo de tenencia obligatorio establecido por la CNV ("parking"), vender el mismo título en su variante en dólares (AL30D o GD30D) para recibir dólares billete en la cuenta bancaria.',
      category: 'inversiones',
      highlight: true
    },
    {
      id: 'dolar-ccl',
      term: 'Dólar CCL (Contado con Liquidación)',
      definition: 'Es un tipo de cambio bursátil similar al Dólar MEP, con la diferencia de que se utiliza para transferir y liquidar los dólares fuera de Argentina (en una cuenta bancaria del exterior). Se realiza comprando bonos o acciones locales en pesos y vendiéndolos en el mercado internacional (ej. Nueva York) a cambio de dólares extranjeros.',
      category: 'inversiones'
    },
    {
      id: 'tem',
      term: 'TEM (Tasa Efectiva Mensual)',
      definition: 'Es la tasa de interés real que se aplica por el período de un mes sobre un capital determinado, teniendo en cuenta la reinversión de intereses. Se deduce a partir de la TEA mediante la fórmula de equivalencia de tasas y es el valor clave para calcular el rendimiento mensual de colocaciones de liquidez.',
      category: 'conceptos'
    },
    {
      id: 'icl',
      term: 'ICL (Índice de Contratos de Locación)',
      definition: 'Es un indicador oficial elaborado diariamente por el Banco Central de la República Argentina (BCRA) que se utiliza para indexar y actualizar el precio de los contratos de alquiler de vivienda. Se calcula promediando en partes iguales la evolución de la inflación mensual (IPC) y la variación de los salarios promedio de los trabajadores estables (RIPTE).',
      category: 'creditos'
    },
    {
      id: 'interes-compuesto',
      term: 'Interés Compuesto',
      definition: 'Es el proceso financiero en el cual los rendimientos o intereses que genera una inversión se suman periódicamente al capital original, de modo que en el siguiente ciclo los nuevos intereses se calculan sobre esa cifra incrementada. Produce un efecto acumulativo y exponencial, a menudo denominado "efecto bola de nieve", crucial para la planificación a largo plazo y el retiro.',
      category: 'conceptos',
      highlight: true
    },
    {
      id: 'capitalizacion',
      term: 'Capitalización de Intereses',
      definition: 'Es la frecuencia o el proceso en el cual los intereses acumulados se liquidan y se suman formalmente al capital inicial (diario, semanal, mensual, trimestral, anual, etc.). Cuanto más frecuente sea la capitalización (por ejemplo, mensual frente a anual), mayor será la Tasa Efectiva Anual (TEA) obtenida a partir de una misma TNA.',
      category: 'conceptos'
    },
    {
      id: 'valor-presente',
      term: 'Valor Presente (VP)',
      definition: 'Es el valor actual que tiene un flujo de dinero que se recibirá o pagará en el futuro, descontando el efecto de una tasa de interés, inflación o costo de oportunidad. Permite evaluar si conviene pagar una compra de contado hoy con descuento o en cuotas fijas a lo largo de varios meses, trayendo los desembolsos futuros a valor de hoy.',
      category: 'conceptos'
    }
  ];

  useEffect(() => {
    if (openTermId) {
      const el = document.getElementById(`term-card-${openTermId}`);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
      }
    }
  }, [openTermId]);

  useEffect(() => {
    const updateMeta = (title, desc) => {
      document.title = title;
      const selectors = {
        'meta[name="description"]': desc,
        'meta[property="og:title"]': title,
        'meta[property="og:description"]': desc,
        'meta[property="twitter:title"]': title,
        'meta[property="twitter:description"]': desc
      };
      Object.entries(selectors).forEach(([selector, val]) => {
        const el = document.querySelector(selector);
        if (el) el.setAttribute('content', val);
      });
    };

    if (openTermId) {
      const term = terms.find(t => t.id === openTermId);
      if (term) {
        updateMeta(`${term.term} - Glosario | Valia`, term.definition);
      }
    } else {
      updateMeta(
        "Glosario de Términos Financieros | Valia",
        "Diccionario financiero: CEDEAR, Obligaciones Negociables, Cauciones, TNA, TEA, UVA, CER y otros conceptos clave explicados de forma sencilla."
      );
    }
  }, [openTermId]);

  const categories = [
    { id: 'todos', label: 'Todos los Términos' },
    { id: 'inversiones', label: 'Inversiones y Bolsa' },
    { id: 'impuestos', label: 'Impuestos y AFIP/ARCA' },
    { id: 'creditos', label: 'Créditos e Inflación' },
    { id: 'conceptos', label: 'Conceptos Generales' }
  ];

  const toggleTerm = (id) => {
    setOpenTermId(openTermId === id ? null : id);
  };

  const filteredTerms = terms.filter(item => {
    const matchesSearch = item.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'todos' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 0', maxWidth: '850px' }}>
      
      {/* Header */}
      <header className="calculator-header" style={{ marginBottom: '3rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Book size={32} className="text-accent-primary" />
          Glosario Financiero
        </h1>
        <p>Tu diccionario práctico e independiente para entender el mercado, los impuestos y los créditos en Argentina.</p>
      </header>

      {/* Search and Category Filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
        
        {/* Search Input */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '500px', margin: '0 auto' }}>
          <Search size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input 
            type="text" 
            className="input-field" 
            placeholder="Buscar término (ej. CEDEAR, MEP, UVA)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.75rem', width: '100%', height: '46px', borderRadius: '50px' }}
          />
        </div>

        {/* Categories Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setOpenTermId(null); // cierra acordeón al cambiar pestaña
              }}
              className={`btn ${activeCategory === cat.id ? 'btn-primary' : 'btn-outline'}`}
              style={{ 
                padding: '0.35rem 1rem', 
                fontSize: '0.825rem', 
                borderRadius: '50px'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

      </div>

      {/* Terms Accordion List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredTerms.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No se encontraron términos que coincidan con tu búsqueda.
          </div>
        ) : (
          filteredTerms.map(item => {
            const isOpen = openTermId === item.id;
            return (
              <div 
                key={item.id} 
                id={`term-card-${item.id}`}
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
                onClick={() => toggleTerm(item.id)}
              >
                {/* Term Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {item.highlight && <Star size={16} className="text-accent-primary" fill="var(--accent-primary)" style={{ flexShrink: 0 }} />}
                    <h3 style={{ 
                      fontSize: '1.05rem', 
                      margin: 0, 
                      fontWeight: 600,
                      color: isOpen ? 'var(--accent-primary)' : 'var(--text-primary)'
                    }}>
                      {item.term}
                    </h3>
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {/* Term Definition Body */}
                {isOpen && (
                  <div 
                    className="animate-fade-in"
                    style={{ 
                      marginTop: '1rem', 
                      borderTop: '1px solid var(--border-color)', 
                      paddingTop: '1rem',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.6',
                      fontSize: '0.925rem'
                    }}
                  >
                    <p style={{ margin: 0 }}>{item.definition}</p>
                    
                    {/* Share button and Category tag */}
                    <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // prevent collapsing the accordion
                          const shareUrl = `${window.location.origin}/?seccion=glosario&termino=${item.id}`;
                          navigator.clipboard.writeText(shareUrl);
                          setCopiedTermId(item.id);
                          setTimeout(() => setCopiedTermId(null), 2000);
                        }}
                        className="btn btn-outline"
                        style={{ 
                          padding: '0.25rem 0.75rem', 
                          fontSize: '0.75rem', 
                          height: 'auto',
                          borderRadius: '4px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          borderColor: copiedTermId === item.id ? 'var(--accent-success, #10b981)' : 'var(--border-color)',
                          transition: 'all var(--transition-fast)'
                        }}
                      >
                        <Share2 size={12} className={copiedTermId === item.id ? "text-accent-success" : "text-accent-primary"} />
                        {copiedTermId === item.id ? '¡Copiado!' : 'Compartir'}
                      </button>

                      <span style={{ 
                        fontSize: '0.65rem', 
                        fontWeight: 600, 
                        color: 'var(--text-tertiary)',
                        textTransform: 'uppercase',
                        border: '1px solid var(--border-color)',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px'
                      }}>
                        {categories.find(c => c.id === item.category)?.label || item.category}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

export default Glosario;
