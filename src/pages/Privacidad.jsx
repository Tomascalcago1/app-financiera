import React from 'react';
import { Shield, Eye, BarChart3, Cookie, Mail } from 'lucide-react';

const Privacidad = () => {
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
          <a href="mailto:contacto@valia.app" style={{ color: 'var(--accent-primary)' }}>contacto@valia.app</a>.
        </p>
      </section>

    </div>
  );
};

export default Privacidad;
