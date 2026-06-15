import jsPDF from 'jspdf';
import { generateBarcodeSVG } from './barcodeEngine';

/**
 * BULLETPROOF download that works even with aggressive ad-blockers.
 * 
 * Uses 3 strategies in sequence:
 *   1. data: URL + <a download> click  (cannot be blocked by extensions)
 *   2. blob: URL + <a download> click  (standard approach)
 *   3. window.open() fallback          (user can right-click → Save As)
 */
function downloadBlob(blob, filename) {
  // Strategy 1: Use canvas.toDataURL directly via data: URL
  // This is the most reliable method because data: URLs are inline
  // and cannot be intercepted by network-level ad blockers.
  const reader = new FileReader();
  reader.onloadend = function () {
    const dataUrl = reader.result;
    if (!dataUrl) {
      fallbackBlobDownload(blob, filename);
      return;
    }
    
    try {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = filename;
      // Setting these attributes helps bypass extension interception
      a.rel = 'noopener';
      a.target = '_self';
      a.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0;pointer-events:none;';
      document.body.appendChild(a);
      
      // Use dispatchEvent instead of a.click() — some extensions hook .click()
      const evt = new MouseEvent('click', {
        bubbles: false,
        cancelable: false,
        view: window
      });
      a.dispatchEvent(evt);
      
      // Cleanup
      requestAnimationFrame(() => {
        if (a.parentNode) document.body.removeChild(a);
      });
    } catch (e) {
      console.warn('[Export] Data URL download failed:', e);
      fallbackBlobDownload(blob, filename);
    }
  };
  reader.onerror = function () {
    fallbackBlobDownload(blob, filename);
  };
  reader.readAsDataURL(blob);
}

/**
 * Fallback 1: blob URL download
 */
function fallbackBlobDownload(blob, filename) {
  try {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.cssText = 'position:fixed;left:-9999px;top:-9999px;';
    document.body.appendChild(a);
    
    const evt = new MouseEvent('click', {
      bubbles: false,
      cancelable: false,
      view: window
    });
    a.dispatchEvent(evt);
    
    setTimeout(() => {
      if (a.parentNode) document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 300);
  } catch (e) {
    console.warn('[Export] Blob URL download failed:', e);
    fallbackWindowOpen(blob);
  }
}

/**
 * Fallback 2: Open in new tab (user can right-click → Save As)
 */
function fallbackWindowOpen(blob) {
  try {
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    // Don't revoke immediately — new tab needs to load it
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  } catch (e) {
    console.error('[Export] All download methods failed:', e);
    alert('Download was blocked by your browser. Please disable your ad-blocker and try again.');
  }
}

/**
 * Export barcode canvas as PNG
 */
export function exportAsPNG(canvas, filename = 'barcode', dpi = 300) {
  if (!canvas) {
    console.error('[Export] exportAsPNG: canvas is null');
    return;
  }

  const scaleFactor = dpi / 96;

  if (scaleFactor > 1) {
    const highResCanvas = document.createElement('canvas');
    highResCanvas.width = canvas.width * scaleFactor;
    highResCanvas.height = canvas.height * scaleFactor;
    const ctx = highResCanvas.getContext('2d');
    ctx.scale(scaleFactor, scaleFactor);
    ctx.drawImage(canvas, 0, 0);

    highResCanvas.toBlob((blob) => {
      if (blob) downloadBlob(blob, `${filename}.png`);
    }, 'image/png');
  } else {
    canvas.toBlob((blob) => {
      if (blob) downloadBlob(blob, `${filename}.png`);
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
    if (blob) downloadBlob(blob, `${filename}.jpg`);
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
      downloadBlob(blob, `${filename}.svg`);
    }
  } catch (err) {
    console.error('[Export] SVG export error:', err);
  }
}

/**
 * Export barcode canvas as PDF — uses downloadBlob for ad-blocker resilience
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

  // Use downloadBlob instead of pdf.save() to bypass ad-blockers
  const blob = pdf.output('blob');
  downloadBlob(blob, `${filename}.pdf`);
}

/**
 * Copy barcode image to clipboard with multiple fallbacks.
 * Returns: 'image' if copied as image, 'text' if copied as data URL text, false if failed.
 */
export async function copyToClipboard(canvas) {
  if (!canvas) return false;

  // Strategy 1: Modern Clipboard API with ClipboardItem (image copy)
  if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
    try {
      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, 'image/png')
      );
      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        return 'image';
      }
    } catch (err) {
      console.warn('[Export] Clipboard image copy failed, trying text fallback:', err.message);
    }
  }

  // Strategy 2: Copy the data URL as text (works more broadly)
  try {
    const dataUrl = canvas.toDataURL('image/png');
    const copied = await copyTextFallback(dataUrl);
    if (copied) return 'text';
  } catch (err) {
    console.error('[Export] All clipboard copy methods failed:', err);
  }

  return false;
}

/**
 * Copy text to clipboard with fallback to execCommand.
 * Returns true on success, false on failure.
 */
export async function copyTextToClipboard(text) {
  if (!text) return false;
  
  // Strategy 1: Modern Clipboard API
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('[Export] clipboard.writeText failed, trying fallback:', err.message);
    }
  }

  // Strategy 2: execCommand fallback
  return copyTextFallback(text);
}

/**
 * Legacy text copy using a hidden textarea + execCommand('copy').
 * Works in all browsers, doesn't require Clipboard API permissions.
 */
function copyTextFallback(text) {
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0;';
    textarea.setAttribute('readonly', '');
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  } catch (err) {
    console.error('[Export] execCommand copy failed:', err);
    return false;
  }
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
