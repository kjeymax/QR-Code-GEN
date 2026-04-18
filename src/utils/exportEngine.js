import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import { generateBarcodeSVG } from './barcodeEngine';

/**
 * Export barcode canvas as PNG
 */
export function exportAsPNG(canvas, filename = 'barcode', dpi = 300) {
  if (!canvas) return;

  const scaleFactor = dpi / 96;

  if (scaleFactor > 1) {
    const highResCanvas = document.createElement('canvas');
    highResCanvas.width = canvas.width * scaleFactor;
    highResCanvas.height = canvas.height * scaleFactor;
    const ctx = highResCanvas.getContext('2d');
    ctx.scale(scaleFactor, scaleFactor);
    ctx.drawImage(canvas, 0, 0);

    highResCanvas.toBlob((blob) => {
      if (blob) saveAs(blob, `${filename}.png`);
    }, 'image/png');
  } else {
    canvas.toBlob((blob) => {
      if (blob) saveAs(blob, `${filename}.png`);
    }, 'image/png');
  }
}

/**
 * Export barcode canvas as JPG
 */
export function exportAsJPG(canvas, filename = 'barcode', quality = 0.95) {
  if (!canvas) return;

  const jpgCanvas = document.createElement('canvas');
  jpgCanvas.width = canvas.width;
  jpgCanvas.height = canvas.height;
  const ctx = jpgCanvas.getContext('2d');
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, jpgCanvas.width, jpgCanvas.height);
  ctx.drawImage(canvas, 0, 0);

  jpgCanvas.toBlob((blob) => {
    if (blob) saveAs(blob, `${filename}.jpg`);
  }, 'image/jpeg', quality);
}

/**
 * Export barcode as SVG
 */
export async function exportAsSVG(data, format, options = {}, filename = 'barcode') {
  try {
    const svgString = await generateBarcodeSVG(data, format, options);
    if (svgString) {
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      saveAs(blob, `${filename}.svg`);
    }
  } catch (err) {
    console.error('SVG export error:', err);
  }
}

/**
 * Export barcode canvas as PDF
 */
export function exportAsPDF(canvas, filename = 'barcode') {
  if (!canvas) return;

  const imgData = canvas.toDataURL('image/png', 1.0);
  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
    unit: 'px',
    format: [canvas.width + 40, canvas.height + 40],
  });

  pdf.addImage(imgData, 'PNG', 20, 20, canvas.width, canvas.height);
  pdf.save(`${filename}.pdf`);
}

/**
 * Copy barcode to clipboard
 */
export async function copyToClipboard(canvas) {
  if (!canvas) return false;
  try {
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/png')
    );
    if (blob) {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      return true;
    }
  } catch (err) {
    console.error('Clipboard copy failed:', err);
  }
  return false;
}

/**
 * Generate embed code
 */
export function generateEmbedCode(canvas, width = 300) {
  if (!canvas) return '';
  const dataUrl = canvas.toDataURL('image/png');
  const aspectRatio = canvas.height / canvas.width;
  const height = Math.round(width * aspectRatio);
  return `<img src="${dataUrl}" width="${width}" height="${height}" alt="Barcode" style="image-rendering: pixelated;" />`;
}

/**
 * Generate share link
 */
export function generateShareLink(data, format, options) {
  const params = new URLSearchParams({
    d: data,
    f: format,
  });
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
}
