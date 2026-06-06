import React from 'react';
import { FileText, ShieldAlert, Scale, RefreshCw, Mail, HelpCircle } from 'lucide-react';

const Terminos = () => {
  const lastUpdated = '6 de junio de 2026';

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 0', maxWidth: '800px' }}>
      
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
          <FileText size={32} style={{ color: '#090D16' }} />
        </div>
        <h1 style={{ marginBottom: '0.75rem' }}>Términos de Uso</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
          Última actualización: {lastUpdated}
        </p>
      </header>

      {/* Introducción */}
      <section className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.125rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HelpCircle size={18} className="text-accent-primary" />
          Aceptación de los Términos
        </h2>
        <p>
          Bienvenido a <strong>Valia</strong>. Al acceder o utilizar nuestro sitio web, aceptas cumplir y estar sujeto a 
          estos Términos de Uso. Si no estás de acuerdo con alguno de estos términos, te pedimos que no utilices 
          nuestras herramientas.
        </p>
      </section>

      {/* Exclusión de Responsabilidad Financiera */}
      <section className="card" style={{ 
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(245, 158, 11, 0.03))',
        borderLeft: '4px solid var(--accent-warning)'
      }}>
        <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={20} style={{ color: 'var(--accent-warning)' }} />
          1. Exclusión de Asesoramiento Financiero
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          Toda la información y los resultados generados por las calculadoras y simuladores de Valia se proporcionan 
          con fines <strong>estrictamente educativos e informativos</strong>.
        </p>
        <p style={{ marginBottom: '1rem', fontWeight: 500 }}>
          Valia no proporciona asesoramiento financiero, de inversión, legal, contable ni fiscal.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          Los cálculos realizados son simulaciones basadas en supuestos y datos históricos. El rendimiento pasado de 
          los mercados financieros (acciones, bonos, inflación) no garantiza ni predice rendimientos futuros.
        </p>
        <p>
          Recomendamos encarecidamente consultar con un asesor financiero certificado u otros profesionales calificados 
          antes de tomar decisiones de inversión o realizar transacciones financieras basadas en la información provista 
          por esta herramienta.
        </p>
      </section>

      {/* Uso de la Plataforma */}
      <section className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>2. Licencia y Uso Permitido</h2>
        <p style={{ marginBottom: '1rem' }}>
          Te otorgamos una licencia limitada, no exclusiva, no transferible y revocable para acceder y utilizar las 
          herramientas de Valia para tu uso personal y no comercial.
        </p>
        <p style={{ marginBottom: '0.5rem' }}>Aceptas no utilizar el sitio para:</p>
        <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)' }}>
          <li>Extraer información o datos del sitio web mediante técnicas de scraping, bots u otros mecanismos automatizados.</li>
          <li>Intentar dañar, deshabilitar o sobrecargar los servidores o la infraestructura de la red.</li>
          <li>Utilizar las calculadoras con fines comerciales sin el consentimiento previo por escrito de Valia.</li>
          <li>Realizar actividades ilícitas que violen la legislación de tu jurisdicción.</li>
        </ul>
      </section>

      {/* Propiedad Intelectual */}
      <section className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>3. Propiedad Intelectual</h2>
        <p style={{ marginBottom: '1rem' }}>
          El código fuente, diseño, estructura, logotipos, textos y gráficos del sitio web son propiedad exclusiva de 
          Valia o de sus respectivos creadores y están protegidos por las leyes de propiedad intelectual y derechos de autor.
        </p>
        <p>
          Las referencias a metodologías externas (como el Estudio Trinity o ficalc.app) se realizan bajo el principio de 
          reconocimiento del autor original y uso legítimo.
        </p>
      </section>

      {/* Limitación de Responsabilidad */}
      <section className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Scale size={18} className="text-accent-primary" />
          4. Limitación de Responsabilidad
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          El servicio se proporciona <strong>"tal cual" (as is) y "según disponibilidad" (as available)</strong>, 
          sin garantías de ningún tipo, ya sean expresas o implícitas.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          No garantizamos que las calculadoras estén libres de errores, que la información histórica sea 100% precisa en 
          todo momento, o que el servicio sea ininterrumpido.
        </p>
        <p>
          En la medida máxima permitida por la ley aplicable, Valia no será responsable de ningún daño directo, indirecto, 
          incidental o consecuente (incluyendo, sin limitación, pérdida de dinero, pérdida de ganancias, o malas inversiones) 
          que surja del uso o de la imposibilidad de usar el sitio o sus contenidos.
        </p>
      </section>

      {/* Modificación de Términos */}
      <section className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <RefreshCw size={18} className="text-accent-primary" />
          5. Modificación de los Términos
        </h2>
        <p>
          Nos reservamos el derecho de modificar estos Términos de Uso en cualquier momento. Cualquier cambio entrará en 
          vigor inmediatamente después de su publicación en el sitio web. El uso continuo del sitio después de dichos 
          cambios constituirá tu aceptación de los nuevos términos.
        </p>
      </section>

      {/* Ley Aplicable */}
      <section className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>6. Ley Aplicable y Jurisdicción</h2>
        <p>
          Estos términos se regirán e interpretarán de acuerdo con las leyes de la República Argentina. Cualquier disputa 
          que surja en relación con el uso de este sitio web será sometida a la jurisdicción exclusiva de los tribunales 
          ordinarios competentes de la Ciudad Autónoma de Buenos Aires, Argentina.
        </p>
      </section>

      {/* Contacto */}
      <section className="card" style={{ 
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08), rgba(6, 182, 212, 0.03))',
        borderLeft: '4px solid var(--accent-primary)'
      }}>
        <h2 style={{ fontSize: '1.125rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Mail size={18} className="text-accent-primary" />
          7. Contacto
        </h2>
        <p>
          Si tenés alguna pregunta, reclamo o duda con respecto a estos Términos de Uso, por favor escribinos a{' '}
          <a href="mailto:contacto@valia.app" style={{ color: 'var(--accent-primary)' }}>contacto@valia.app</a>.
        </p>
      </section>

    </div>
  );
};

export default Terminos;
