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

  const svgElement = container.querySelector('svg');
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

    // Codificamos a base64 (soportando caracteres especiales/Unicode de etiquetas)
    const encodedSvg = window.btoa(unescape(encodeURIComponent(svgString)));
    const svgUrl = `data:image/svg+xml;base64,${encodedSvg}`;

    const img = new Image();
    img.src = svgUrl;

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

      // Exportamos a un DataURL de PNG y forzamos la descarga del navegador
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = filename;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };
  } catch (err) {
    console.error('Error al exportar gráfico a PNG:', err);
    alert('Ocurrió un error al intentar exportar el gráfico a imagen.');
  }
};
