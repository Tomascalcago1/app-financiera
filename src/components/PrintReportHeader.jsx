import React from 'react';

const PrintReportHeader = ({ title, subtitle = 'Ficha de Planificación Financiera', params = [] }) => {
  const currentDate = new Date().toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="print-only-section" style={{ width: '100%' }}>
      {/* Brand Header */}
      <div className="print-header">
        <div className="print-header-left">
          <h1>VALIA</h1>
          <p>{subtitle}</p>
        </div>
        <div className="print-header-right">
          <div>Emisión: {currentDate}</div>
          <div><a href="https://valia-finanzas.vercel.app" target="_blank" rel="noopener noreferrer">valia-finanzas.vercel.app</a></div>
        </div>
      </div>

      {/* Title of the Report */}
      <h2 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '1rem', fontWeight: 700 }}>
        {title}
      </h2>

      {/* Parameter Cards Grid */}
      {params && params.length > 0 && (
        <div className="print-params-card">
          <h3 className="print-params-title">Parámetros de Simulación</h3>
          <div className="print-params-grid">
            {params.map((param, index) => (
              <div key={index}>
                <span>{param.label}:</span>
                <strong>{param.value}</strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PrintReportHeader;
