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
    clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    // Función recursiva para copiar todos los estilos computados del SVG original al clon.
    // Esto inlinea los estilos (colores de fuente, grosores, opacidad, rellenos) resolviendo
    // variables CSS y clases. Evita usar tags de <style> que Safari bloquea por seguridad en canvas.
    const copyComputedStyles = (src, dest) => {
      const computed = window.getComputedStyle(src);
      const propertiesToCopy = [
        'fill',
        'stroke',
        'stroke-width',
        'stroke-dasharray',
        'font-size',
        'font-family',
        'font-weight',
        'opacity',
        'display',
        'visibility',
        'text-anchor'
      ];
      
      propertiesToCopy.forEach(prop => {
        let val = computed.getPropertyValue(prop);
        if (prop === 'font-family') {
          // Force local system font to avoid cross-origin font fetching errors in canvas (CORS Canvas Tainting)
          val = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
        }
        if (val) {
          dest.style.setProperty(prop, val);
        }
      });

      const srcChildren = src.children;
      const destChildren = dest.children;
      if (srcChildren && destChildren) {
        for (let i = 0; i < srcChildren.length; i++) {
          if (srcChildren[i] && destChildren[i]) {
            copyComputedStyles(srcChildren[i], destChildren[i]);
          }
        }
      }
    };

    // Copiamos los estilos computados en línea
    copyComputedStyles(svgElement, clonedSvg);

    // Convertimos el SVG a string XML
    let svgString = new XMLSerializer().serializeToString(clonedSvg);
    
    // Reemplazos de variables CSS nativas por sus equivalentes de color (como respaldo)
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

    // Limpiar prefijos de URL absoluta en referencias de clip-path o fill (ej. url(http://...#id) -> url(#id))
    // Esto es crítico ya que el navegador bloquea la carga de imágenes con referencias externas en contextos aislados (como img)
    svgString = svgString.replace(/url\([^#)]*#/g, 'url(#');

    // Usamos base64 Data URL para máxima compatibilidad entre navegadores, evitando restricciones de sandboxing de Blob URLs
    const base64Svg = window.btoa(unescape(encodeURIComponent(svgString)));
    const svgUrl = 'data:image/svg+xml;base64,' + base64Svg;

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
    };

    img.onerror = (err) => {
      console.error('Error al cargar el SVG clonado como imagen:', err);
      alert('Error al procesar el gráfico para la descarga.');
    };

    img.src = svgUrl;
  } catch (err) {
    console.error('Error al exportar gráfico a PNG:', err);
    alert('Ocurrió un error al intentar exportar el gráfico a imagen.');
  }
};
