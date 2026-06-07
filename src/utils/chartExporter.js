/**
 * Utilidad para exportar gráficos basados en SVG (Recharts) a imágenes PNG de alta resolución.
 * Funciona de manera 100% cliente y no requiere de librerías externas.
 */
export const exportChartToPNG = (containerId, filename = 'grafico_valia.png') => {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Contenedor con ID "${containerId}" no encontrado.`);
    return;
  }

  // Buscamos primero el SVG principal de Recharts (svg.recharts-surface) para evitar
  // seleccionar pequeños SVGs de leyendas, marcadores o íconos internos.
  const svgElement = container.querySelector('svg.recharts-surface') || container.querySelector('svg');
  if (!svgElement) {
    console.error('No se encontró ningún elemento SVG dentro del contenedor.');
    return;
  }

  try {
    // Clonamos el SVG para no modificar la vista del usuario en pantalla
    const clonedSvg = svgElement.cloneNode(true);
    
    // Obtenemos las dimensiones actuales del gráfico
    const width = svgElement.clientWidth || svgElement.getBoundingClientRect().width || 800;
    const height = svgElement.clientHeight || svgElement.getBoundingClientRect().height || 400;
    
    // Seteamos dimensiones explícitas al SVG clonado
    clonedSvg.setAttribute('width', width);
    clonedSvg.setAttribute('height', height);

    // Creamos e inyectamos un bloque <style> dentro del SVG clonado para que tenga las variables de CSS
    // y los estilos requeridos por Recharts en su contexto de renderizado aislado (Blob/Image).
    const styleElement = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    let cssStyles = `
      :root, svg {
        --bg-primary: #090D16;
        --bg-secondary: #0F172A;
        --bg-tertiary: #1E293B;
        --text-primary: #F8FAFC;
        --text-secondary: #94A3B8;
        --text-tertiary: #64748B;
        --accent-primary: #06B6D4;
        --accent-success: #10B981;
        --accent-warning: #F59E0B;
        --accent-danger: #EF4444;
        --border-color: #334155;
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
      }
      svg {
        background-color: #090D16;
      }
      /* Estilos básicos de Recharts para textos y grillas */
      .recharts-text, .recharts-label {
        fill: #94A3B8 !important;
        font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
      }
      .recharts-cartesian-grid-horizontal line,
      .recharts-cartesian-grid-vertical line {
        stroke: #334155 !important;
        stroke-width: 1px !important;
      }
    `;

    // Intentamos recolectar dinámicamente las reglas de CSS de Recharts inyectadas en la página
    try {
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            if (rule.cssText.includes('recharts') || rule.cssText.includes('recharts-surface')) {
              cssStyles += rule.cssText + '\n';
            }
          }
        } catch (e) {
          // Ignorar hojas de estilo externas por restricciones de CORS
        }
      }
    } catch (sheetErr) {
      console.warn('No se pudieron clonar los estilos dinámicos de Recharts:', sheetErr);
    }

    styleElement.textContent = cssStyles;
    clonedSvg.insertBefore(styleElement, clonedSvg.firstChild);

    // Convertimos el SVG a string XML
    let svgString = new XMLSerializer().serializeToString(clonedSvg);
    
    // Reemplazamos las variables de CSS nativas por sus equivalentes de color en el tema oscuro de Valia
    svgString = svgString.replace(/var\(--text-primary\)/g, '#F8FAFC');
    svgString = svgString.replace(/var\(--text-secondary\)/g, '#94A3B8');
    svgString = svgString.replace(/var\(--text-tertiary\)/g, '#64748B');
    svgString = svgString.replace(/var\(--border-color\)/g, '#334155');
    svgString = svgString.replace(/var\(--accent-primary\)/g, '#06B6D4');
    svgString = svgString.replace(/var\(--accent-success\)/g, '#10B981');
    svgString = svgString.replace(/var\(--accent-warning\)/g, '#F59E0B');
    svgString = svgString.replace(/var\(--accent-danger\)/g, '#EF4444');
    svgString = svgString.replace(/var\(--bg-secondary\)/g, '#0F172A');
    svgString = svgString.replace(/var\(--bg-tertiary\)/g, '#1E293B');

    // Usamos Blob y URL.createObjectURL para mayor compatibilidad y soporte de caracteres unicode
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    const img = new Image();
    
    // Definimos el onload y onerror ANTES de asignar el src
    img.onload = () => {
      // Creamos un canvas con el doble de densidad para que la imagen PNG se vea nítida en pantallas Retina y 4K
      const scale = 2;
      const canvas = document.createElement('canvas');
      canvas.width = width * scale;
      canvas.height = height * scale;
      
      const ctx = canvas.getContext('2d');
      ctx.scale(scale, scale);

      // Rellenamos el fondo con el color principal del tema oscuro (Deep Midnight Navy)
      ctx.fillStyle = '#090D16';
      ctx.fillRect(0, 0, width, height);

      // Dibujamos el SVG cargado sobre el canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Dibujamos un marco de borde elegante y sutil en el borde de la imagen
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)'; // Slate border
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, width, height);

      try {
        // Exportamos a un DataURL de PNG y forzamos la descarga del navegador
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = filename;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      } catch (toDataUrlErr) {
        console.error('Error al generar DataURL desde el canvas:', toDataUrlErr);
        alert('No se pudo exportar la imagen debido a una restricción de seguridad del navegador.');
      }

      // Liberamos el objeto URL para no causar fugas de memoria
      URL.revokeObjectURL(svgUrl);
    };

    img.onerror = (err) => {
      console.error('Error al cargar el SVG clonado como imagen:', err);
      alert('Error al procesar el gráfico para la descarga.');
      URL.revokeObjectURL(svgUrl);
    };

    img.src = svgUrl;
  } catch (err) {
    console.error('Error al exportar gráfico a PNG:', err);
    alert('Ocurrió un error al intentar exportar el gráfico a imagen.');
  }
};

