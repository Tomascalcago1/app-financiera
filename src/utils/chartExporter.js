/**
 * Utilidad premium para exportar simulaciones financieras a imágenes PNG de alta resolución.
 * Genera una tarjeta de 1200x630 (proporción social OpenGraph) que consolida:
 *  - En la izquierda: El logo de Valia, el título de la herramienta, los parámetros ingresados y el resultado neto destacado.
 *  - En la derecha: El gráfico interactivo renderizado.
 * Funciona de manera 100% cliente, robusta y compatible en navegadores móviles y Safari (iOS).
 */
export const exportChartToPNG = (containerId, filename = 'simulacion_valia.png') => {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Contenedor con ID "${containerId}" no encontrado.`);
    return;
  }

  // Buscamos todos los SVGs en el contenedor
  const svgs = Array.from(container.querySelectorAll('svg'));
  if (svgs.length === 0) {
    console.error('No se encontró ningún elemento SVG dentro del contenedor.');
    alert('No se pudo encontrar el gráfico para la descarga.');
    return;
  }

  // Seleccionamos el SVG con mayor área (el gráfico principal) para evitar descargar pequeños íconos de la leyenda
  let svgElement = svgs[0];
  let maxArea = 0;
  svgs.forEach(svg => {
    const rect = svg.getBoundingClientRect();
    const area = (rect.width || svg.clientWidth || 1) * (rect.height || svg.clientHeight || 1);
    if (area > maxArea) {
      maxArea = area;
      svgElement = svg;
    }
  });

  try {
    // 1. Extraer datos clave del DOM del simulador actual
    const toolHeader = document.querySelector('.calculator-header h1');
    const toolName = toolHeader ? toolHeader.textContent.trim() : 'Simulación Financiera';

    // Buscar parámetros ingresados desde el PrintReportHeader
    const params = [];
    const paramElements = document.querySelectorAll('.print-params-grid > div');
    paramElements.forEach(el => {
      const labelEl = el.querySelector('span');
      const valueEl = el.querySelector('strong');
      if (labelEl && valueEl) {
        params.push({
          label: labelEl.textContent.replace(':', '').trim(),
          value: valueEl.textContent.trim()
        });
      }
    });

    // Buscar el resultado destacado principal (busca la tarjeta que contiene un valor monetario o porcentual grande)
    let mainResultLabel = '';
    let mainResultValue = '';
    const cardElements = document.querySelectorAll('.card');
    for (const card of cardElements) {
      // Ignorar la propia guía SEO o cuadros de texto largos
      if (card.querySelector('h2') || card.querySelector('h3') || card.style.marginTop === '3rem') continue;
      
      const pElements = card.querySelectorAll('p');
      if (pElements.length >= 2) {
        const labelText = pElements[0].textContent.trim();
        const valueText = pElements[1].textContent.trim();
        // Identificar si tiene formato de resultado (moneda, porcentaje o similar)
        if (valueText.includes('$') || valueText.includes('u$s') || valueText.includes('%') || (valueText.length > 0 && !isNaN(valueText.replace(/[^0-9]/g, '')))) {
          mainResultLabel = labelText;
          mainResultValue = valueText;
          break;
        }
      }
    }

    // Fallbacks si no se encontraron parámetros en la sección imprimible
    if (params.length === 0) {
      params.push({ label: 'Estado', value: 'Cálculo Exitoso' });
      params.push({ label: 'Fecha', value: new Date().toLocaleDateString('es-AR') });
    }

    // 2. Procesar el SVG clonado para el Canvas
    const clonedSvg = svgElement.cloneNode(true);
    const width = svgElement.clientWidth || svgElement.getBoundingClientRect().width || 800;
    const height = svgElement.clientHeight || svgElement.getBoundingClientRect().height || 400;
    
    clonedSvg.setAttribute('width', width);
    clonedSvg.setAttribute('height', height);
    clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    // Copiar estilos computados inlining para conservar colores y grosores
    const copyComputedStyles = (src, dest) => {
      const computed = window.getComputedStyle(src);
      const propertiesToCopy = [
        'fill', 'stroke', 'stroke-width', 'stroke-dasharray',
        'font-size', 'font-family', 'font-weight', 'opacity',
        'display', 'visibility', 'text-anchor'
      ];
      
      propertiesToCopy.forEach(prop => {
        let val = computed.getPropertyValue(prop);
        if (prop === 'font-family') {
          // Forzar tipografías locales del sistema sin comillas para evitar errores de CORS en el canvas
          val = 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
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

    copyComputedStyles(svgElement, clonedSvg);

    // Convertir el SVG a String XML
    let svgString = new XMLSerializer().serializeToString(clonedSvg);
    
    // Remplazar variables CSS por colores Hex sólidos corporativos
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

    // Limpiar prefijos de URL absoluta (ej: url(http://...#id) -> url(#id)) que bloquean el sandbox del canvas
    svgString = svgString.replace(/url\([^#)]*#/g, 'url(#');

    // Codificamos en Base64 para máxima compatibilidad móvil/Safari
    const base64Svg = window.btoa(unescape(encodeURIComponent(svgString)));
    const svgUrl = 'data:image/svg+xml;base64,' + base64Svg;

    const img = new Image();
    
    img.onload = () => {
      // Dimensiones de la Ficha Social Premium (OpenGraph standard)
      const canvasWidth = 1200;
      const canvasHeight = 630;
      const leftPanelWidth = 420;

      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext('2d');

      // Habilitar suavizado de imágenes
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // --- DIBUJAR FONDO GENERAL ---
      ctx.fillStyle = '#090D16'; // Deep navy background
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // --- DIBUJAR PANEL IZQUIERDO (Sombreado) ---
      ctx.fillStyle = '#060A13'; // Darker panel background
      ctx.fillRect(0, 0, leftPanelWidth, canvasHeight);

      // Línea divisoria vertical
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(leftPanelWidth, 0);
      ctx.lineTo(leftPanelWidth, canvasHeight);
      ctx.stroke();

      // --- LOGO VALIA ---
      ctx.fillStyle = '#06B6D4'; // Cyan primary
      ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
      ctx.fillText('VALIA', 40, 55);
      
      ctx.fillStyle = '#64748B'; // Slate secondary
      ctx.font = '700 9px system-ui, -apple-system, sans-serif';
      ctx.fillText('PORTAL FINANCIERO EDUCATIVO', 40, 75);

      // --- TITULO DE LA HERRAMIENTA (Con Word Wrap) ---
      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
      
      const drawTextWrapped = (text, x, y, maxWidth, lineHeight) => {
        const words = text.split(' ');
        let line = '';
        let currentY = y;
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          const testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, currentY);
            line = words[n] + ' ';
            currentY += lineHeight;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, x, currentY);
        return currentY;
      };

      const endTitleY = drawTextWrapped(toolName, 40, 125, leftPanelWidth - 80, 26);

      // --- RECUADRO DE RESULTADO NETO DESTACADO ---
      if (mainResultValue) {
        const boxY = endTitleY + 20;
        const boxHeight = 95;
        const boxWidth = leftPanelWidth - 80;

        // Fondo del badge de resultado (gradiente sutil verde)
        ctx.fillStyle = 'rgba(16, 185, 129, 0.06)';
        ctx.fillRect(40, boxY, boxWidth, boxHeight);

        // Borde del badge
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)';
        ctx.lineWidth = 1;
        ctx.strokeRect(40, boxY, boxWidth, boxHeight);

        // Etiqueta
        ctx.fillStyle = '#94A3B8';
        ctx.font = '500 12px system-ui, -apple-system, sans-serif';
        ctx.fillText(mainResultLabel.toUpperCase(), 55, boxY + 28);

        // Valor
        ctx.fillStyle = '#10B981'; // Emerald Green
        ctx.font = 'bold 28px system-ui, -apple-system, sans-serif';
        ctx.fillText(mainResultValue, 55, boxY + 68);
      }

      // --- PARÁMETROS INGRESADOS ---
      const paramStartY = mainResultValue ? endTitleY + 145 : endTitleY + 30;
      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
      ctx.fillText('PARÁMETROS DE LA SIMULACIÓN', 40, paramStartY);

      // Dibujar línea punteada debajo del subtítulo
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.moveTo(40, paramStartY + 8);
      ctx.lineTo(leftPanelWidth - 40, paramStartY + 8);
      ctx.stroke();
      ctx.setLineDash([]); // Reset line dash

      ctx.font = '500 13px system-ui, -apple-system, sans-serif';
      params.slice(0, 7).forEach((p, idx) => {
        const itemY = paramStartY + 28 + (idx * 30);
        
        // Círculo viñeta cyan
        ctx.fillStyle = 'rgba(6, 182, 212, 0.6)';
        ctx.beginPath();
        ctx.arc(45, itemY - 4, 3, 0, 2 * Math.PI);
        ctx.fill();

        // Nombre del parámetro
        ctx.fillStyle = '#94A3B8';
        ctx.fillText(p.label, 58, itemY);

        // Valor del parámetro (Alineado a la derecha en el panel)
        ctx.fillStyle = '#F8FAFC';
        ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
        const valWidth = ctx.measureText(p.value).width;
        ctx.fillText(p.value, leftPanelWidth - 40 - valWidth, itemY);
        ctx.font = '500 13px system-ui, -apple-system, sans-serif'; // Restaurar font weight
      });

      // --- PANEL DERECHO (DIBUJAR EL GRÁFICO RENDERIZADO) ---
      // Calculamos escalas para ajustar el gráfico a la derecha de forma limpia
      const chartWidth = canvasWidth - leftPanelWidth - 80; // 700px
      const chartHeight = canvasHeight - 140; // 490px
      const chartX = leftPanelWidth + 40;
      const chartY = 65;

      // Dibujar fondo contenedor del gráfico (efecto tarjeta flotante)
      ctx.fillStyle = 'rgba(15, 23, 42, 0.35)'; // Slate 900
      ctx.fillRect(chartX - 15, chartY - 15, chartWidth + 30, chartHeight + 30);

      ctx.strokeStyle = 'rgba(51, 65, 85, 0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(chartX - 15, chartY - 15, chartWidth + 30, chartHeight + 30);

      // Dibujar el gráfico SVG sobre el Canvas
      ctx.drawImage(img, chartX, chartY, chartWidth, chartHeight);

      // Marca de agua y disclaimer legal en el pie
      ctx.fillStyle = '#475569';
      ctx.font = '11px system-ui, -apple-system, sans-serif';
      ctx.fillText('valia-finanzas.com  |  Procesamiento local 100% privado y seguro  |  No constituye asesoramiento financiero.', chartX - 10, canvasHeight - 35);

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
      console.error('Error al cargar el SVG como imagen de Canvas:', err);
      alert('Error al procesar el gráfico para la descarga.');
    };

    img.src = svgUrl;
  } catch (err) {
    console.error('Error general al exportar ficha financiera:', err);
    alert('Ocurrió un error al intentar generar la ficha de resultados.');
  }
};
