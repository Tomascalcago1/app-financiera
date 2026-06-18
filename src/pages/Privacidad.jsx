import React from 'react';
import { Shield, Eye, BarChart3, Cookie, Mail } from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';

const Privacidad = () => {
  const { language } = useLanguage();
  const lastUpdated = language === 'en' ? 'June 6, 2026' : '6 de junio de 2026';

  if (language === 'en') {
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
            background: 'linear-gradient(135deg, var(--accent-success), #059669)',
            marginBottom: '1.5rem'
          }}>
            <Shield size={32} style={{ color: '#090D16' }} />
          </div>
          <h1 style={{ marginBottom: '0.75rem' }}>Privacy Policy</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
            Last updated: {lastUpdated}
          </p>
        </header>

        {/* Summary */}
        <section className="card" style={{ 
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(16, 185, 129, 0.03))',
          borderLeft: '4px solid var(--accent-success)'
        }}>
          <h2 style={{ fontSize: '1.125rem', marginBottom: '0.75rem' }}>Summary</h2>
          <p style={{ fontWeight: 500 }}>
            Valia respects your privacy. <strong>We do not collect personal data, we do not use tracking cookies, 
            and we do not sell information to third parties.</strong> All calculations are performed 
            locally in your browser.
          </p>
        </section>

        {/* Sections */}
        <section className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Eye size={18} className="text-accent-primary" />
            1. Information We Collect
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            <strong>Valia does not collect personally identifiable information.</strong> We do not ask for your name, 
            email, address, or any other personal data to use our tools.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            The financial details you input into the calculators (amounts, horizons, rates) are processed 
            <strong> exclusively in your browser</strong> and are never sent to our servers or 
            stored in any database.
          </p>
          <p>
            When you close the browser tab, all entered data is lost. We do not keep calculation 
            history or user sessions.
          </p>
        </section>

        <section className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={18} className="text-accent-primary" />
            2. Analytics & Performance Metrics
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            We use <strong>Vercel Analytics</strong> and <strong>Vercel Speed Insights</strong> to 
            understand the general performance of our website. These services collect aggregated and anonymous 
            data, such as:
          </p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            <li>Number of page visits (without identifying individual visitors).</li>
            <li>General country or region of the visitor (no precise location).</li>
            <li>Device type and browser (generic data, no digital fingerprinting).</li>
            <li>Load times and web performance metrics (Core Web Vitals).</li>
          </ul>
          <p>
            Vercel Analytics <strong>does not use cookies</strong> and complies with international privacy 
            regulations (GDPR, CCPA). For more information, consult the{' '}
            <a href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)' }}>
              Vercel Analytics privacy policy
            </a>.
          </p>
        </section>

        <section className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cookie size={18} className="text-accent-primary" />
            3. Cookies
          </h2>
          <p>
            <strong>Valia does not use cookies.</strong> We do not store tracking cookies, session cookies, 
            or third-party cookies in your browser. You do not need to accept or reject cookies to use our site.
          </p>
        </section>

        <section className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>4. Advertising and Affiliate Links</h2>
          <p style={{ marginBottom: '1rem' }}>
            Our site may display advertising spaces and links to third-party financial services (such as investment platforms). 
            These links may be affiliate links, which means Valia could receive a commission if you decide to register 
            or purchase services through them.
          </p>
          <p>
            <strong>This has no additional cost to you</strong> and does not affect the results of our calculators, 
            which are always objective and independent.
          </p>
        </section>

        <section className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>5. Links to External Sites</h2>
          <p>
            Valia may contain links to third-party websites (data sources, financial services, etc.). 
            We are not responsible for the privacy practices of those sites. We recommend reviewing the 
            privacy policy of each site you visit.
          </p>
        </section>

        <section className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>6. Security</h2>
          <p>
            Our site is served via HTTPS (SSL/TLS encryption) provided by Vercel. Since we do not store 
            personal data, the risk of personal data leaks is non-existent. Your connection to Valia 
            is encrypted end-to-end.
          </p>
        </section>

        <section className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>7. Minors</h2>
          <p>
            Valia is not directed to individuals under 18 years of age. We do not intentionally collect 
            information from minors. The use of the platform by minors must be supervised by a responsible adult.
          </p>
        </section>

        <section className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>8. Changes to this Policy</h2>
          <p>
            We reserve the right to update this privacy policy at any time. The date of the last update is indicated 
            at the beginning of this document. We recommend reviewing it periodically.
          </p>
        </section>

        <section className="card" style={{ 
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08), rgba(6, 182, 212, 0.03))',
          borderLeft: '4px solid var(--accent-primary)'
        }}>
          <h2 style={{ fontSize: '1.125rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Mail size={18} className="text-accent-primary" />
            9. Contact
          </h2>
          <p>
            If you have questions about this privacy policy, you can contact us at{' '}
            <a href="mailto:contacto@valiafinanzas.com" style={{ color: 'var(--accent-primary)' }}>contacto@valiafinanzas.com</a>.
          </p>
        </section>

      </div>
    );
  }

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
          background: 'linear-gradient(135deg, var(--accent-success), #059669)',
          marginBottom: '1.5rem'
        }}>
          <Shield size={32} style={{ color: '#090D16' }} />
        </div>
        <h1 style={{ marginBottom: '0.75rem' }}>Política de Privacidad</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
          Última actualización: {lastUpdated}
        </p>
      </header>

      {/* Resumen */}
      <section className="card" style={{ 
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(16, 185, 129, 0.03))',
        borderLeft: '4px solid var(--accent-success)'
      }}>
        <h2 style={{ fontSize: '1.125rem', marginBottom: '0.75rem' }}>Resumen</h2>
        <p style={{ fontWeight: 500 }}>
          Valia respeta tu privacidad. <strong>No recopilamos datos personales, no usamos cookies 
          de rastreo y no vendemos información a terceros.</strong> Todos los cálculos se realizan 
          localmente en tu navegador.
        </p>
      </section>

      {/* Secciones */}
      <section className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Eye size={18} className="text-accent-primary" />
          1. Información que Recopilamos
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          <strong>Valia no recopila información personal identificable.</strong> No te pedimos nombre, 
          email, dirección, ni ningún otro dato personal para usar nuestras herramientas.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          Los datos financieros que ingresás en las calculadoras (montos, plazos, tasas) se procesan 
          <strong> exclusivamente en tu navegador</strong> y nunca se envían a nuestros servidores ni 
          se almacenan en ninguna base de datos.
        </p>
        <p>
          Al cerrar la pestaña del navegador, todos los datos ingresados se pierden. No guardamos 
          historial de cálculos ni sesiones de usuario.
        </p>
      </section>

      <section className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart3 size={18} className="text-accent-primary" />
          2. Analíticas y Métricas de Rendimiento
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          Utilizamos <strong>Vercel Analytics</strong> y <strong>Vercel Speed Insights</strong> para 
          comprender el rendimiento general de nuestro sitio web. Estos servicios recopilan datos 
          agregados y anónimos, tales como:
        </p>
        <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          <li>Número de visitas a la página (sin identificar visitantes individuales).</li>
          <li>País o región general del visitante (sin localización precisa).</li>
          <li>Tipo de dispositivo y navegador (datos genéricos, no huellas digitales).</li>
          <li>Tiempos de carga y métricas de rendimiento web (Core Web Vitals).</li>
        </ul>
        <p>
          Vercel Analytics <strong>no utiliza cookies</strong> y cumple con las normativas de privacidad 
          internacionales (GDPR, CCPA). Para más información, consultá la{' '}
          <a href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)' }}>
            política de privacidad de Vercel Analytics
          </a>.
        </p>
      </section>

      <section className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Cookie size={18} className="text-accent-primary" />
          3. Cookies
        </h2>
        <p>
          <strong>Valia no utiliza cookies.</strong> No almacenamos cookies de seguimiento, cookies de 
          sesión ni cookies de terceros en tu navegador. No es necesario aceptar ni rechazar cookies 
          para utilizar nuestro sitio.
        </p>
      </section>

      <section className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>4. Publicidad y Enlaces de Afiliados</h2>
        <p style={{ marginBottom: '1rem' }}>
          Nuestro sitio puede mostrar espacios publicitarios y enlaces a servicios financieros de 
          terceros (como plataformas de inversión). Estos enlaces pueden ser de carácter afiliado, 
          lo que significa que Valia podría recibir una comisión si decidís registrarte o contratar 
          servicios a través de ellos.
        </p>
        <p>
          <strong>Esto no tiene ningún costo adicional para vos</strong> y no afecta los resultados 
          de nuestras calculadoras, que siempre son objetivos e independientes.
        </p>
      </section>

      <section className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>5. Enlaces a Sitios Externos</h2>
        <p>
          Valia puede contener enlaces a sitios web de terceros (fuentes de datos, servicios financieros, etc.). 
          No somos responsables de las prácticas de privacidad de esos sitios. Te recomendamos revisar 
          las políticas de privacidad de cada sitio que visites.
        </p>
      </section>

      <section className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>6. Seguridad</h2>
        <p>
          Nuestro sitio se sirve mediante HTTPS (cifrado SSL/TLS) proporcionado por Vercel. 
          Dado que no almacenamos datos personales, el riesgo de filtración de información personal 
          es inexistente. Tu conexión con Valia está cifrada de extremo a extremo.
        </p>
      </section>

      <section className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>7. Menores de Edad</h2>
        <p>
          Valia no está dirigida a menores de 18 años. No recopilamos intencionalmente información 
          de menores. El uso de la plataforma por parte de menores debe estar supervisado por un 
          adulto responsable.
        </p>
      </section>

      <section className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>8. Cambios a esta Política</h2>
        <p>
          Nos reservamos el derecho de actualizar esta política de privacidad en cualquier momento. 
          La fecha de última actualización se indica al inicio de este documento. Te recomendamos 
          revisarla periódicamente.
        </p>
      </section>

      <section className="card" style={{ 
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08), rgba(6, 182, 212, 0.03))',
        borderLeft: '4px solid var(--accent-primary)'
      }}>
        <h2 style={{ fontSize: '1.125rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Mail size={18} className="text-accent-primary" />
          9. Contacto
        </h2>
        <p>
          Si tenés preguntas sobre esta política de privacidad, podés contactarnos en{' '}
          <a href="mailto:contacto@valiafinanzas.com" style={{ color: 'var(--accent-primary)' }}>contacto@valiafinanzas.com</a>.
        </p>
      </section>

    </div>
  );
};

export default Privacidad;
