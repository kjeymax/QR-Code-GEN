import JsBarcode from 'jsbarcode';

// We'll lazy-load bwip-js only when needed for 2D barcodes
let bwipjs = null;
let bwipjsLoading = null;

async function loadBwipJs() {
  if (bwipjs) return bwipjs;
  if (bwipjsLoading) return bwipjsLoading;
  bwipjsLoading = import('bwip-js').then(mod => {
    bwipjs = mod.default || mod;
    return bwipjs;
  });
  return bwipjsLoading;
}

// Format definitions with metadata
export const BARCODE_FORMATS = {
  // 1D Barcodes (JsBarcode)
  CODE128: {
    id: 'CODE128', name: 'Code 128', engine: 'jsbarcode', category: '1D',
    description: 'High-density alphanumeric', icon: '|||',
    validate: (v) => v.length > 0,
    placeholder: 'Enter any text...',
  },
  CODE39: {
    id: 'CODE39', name: 'Code 39', engine: 'jsbarcode', category: '1D',
    description: 'Alphanumeric industrial', icon: '|||',
    validate: (v) => /^[A-Z0-9\-\.\ \$\/\+\%]*$/i.test(v) && v.length > 0,
    placeholder: 'A-Z, 0-9, -, ., $, /, +, %',
  },
  EAN13: {
    id: 'EAN13', name: 'EAN-13', engine: 'jsbarcode', category: '1D',
    description: 'European product code', icon: '|||',
    validate: (v) => /^\d{12,13}$/.test(v),
    placeholder: '590123412345',
  },
  EAN8: {
    id: 'EAN8', name: 'EAN-8', engine: 'jsbarcode', category: '1D',
    description: 'Short product code', icon: '|||',
    validate: (v) => /^\d{7,8}$/.test(v),
    placeholder: '9638507',
  },
  UPC: {
    id: 'UPC', name: 'UPC-A', engine: 'jsbarcode', category: '1D',
    description: 'US product code', icon: '|||',
    validate: (v) => /^\d{11,12}$/.test(v),
    placeholder: '01234567890',
  },
  UPCE: {
    id: 'UPCE', name: 'UPC-E', engine: 'jsbarcode', category: '1D',
    description: 'Compact US product code', icon: '|||',
    validate: (v) => /^\d{6,8}$/.test(v),
    placeholder: '0123456',
  },
  ITF14: {
    id: 'ITF14', name: 'ITF-14', engine: 'jsbarcode', category: '1D',
    description: 'Shipping containers', icon: '|||',
    validate: (v) => /^\d{13,14}$/.test(v),
    placeholder: '0614141999996',
  },
  CODE93: {
    id: 'CODE93', name: 'Code 93', engine: 'jsbarcode', category: '1D',
    description: 'Compact Code 39', icon: '|||',
    validate: (v) => v.length > 0,
    placeholder: 'Enter any text...',
  },
  codabar: {
    id: 'codabar', name: 'Codabar', engine: 'jsbarcode', category: '1D',
    description: 'Libraries & blood banks', icon: '|||',
    validate: (v) => /^[A-Da-d][0-9\-\$\:\/\.\+]+[A-Da-d]$/.test(v),
    placeholder: 'A12345B',
  },
  MSI: {
    id: 'MSI', name: 'MSI Plessey', engine: 'jsbarcode', category: '1D',
    description: 'Retail shelves', icon: '|||',
    validate: (v) => /^\d+$/.test(v) && v.length > 0,
    placeholder: '1234567',
  },
  pharmacode: {
    id: 'pharmacode', name: 'Pharmacode', engine: 'jsbarcode', category: '1D',
    description: 'Pharmaceutical packaging', icon: '|||',
    validate: (v) => /^\d+$/.test(v) && parseInt(v) >= 3 && parseInt(v) <= 131070,
    placeholder: '1234',
  },

  // 2D Barcodes (bwip-js)
  qrcode: {
    id: 'qrcode', name: 'QR Code', engine: 'bwipjs', bcid: 'qrcode', category: '2D',
    description: 'Universal 2D code', icon: '⊞',
    validate: (v) => v.length > 0,
    placeholder: 'https://example.com',
  },
  datamatrix: {
    id: 'datamatrix', name: 'Data Matrix', engine: 'bwipjs', bcid: 'datamatrix', category: '2D',
    description: 'Compact 2D matrix', icon: '⊞',
    validate: (v) => v.length > 0,
    placeholder: 'Enter data...',
  },
  pdf417: {
    id: 'pdf417', name: 'PDF417', engine: 'bwipjs', bcid: 'pdf417', category: '2D',
    description: 'Stacked linear code', icon: '⊞',
    validate: (v) => v.length > 0,
    placeholder: 'Enter data...',
  },
  gs1_128: {
    id: 'gs1_128', name: 'GS1-128', engine: 'bwipjs', bcid: 'gs1-128', category: '1D',
    description: 'Supply chain standard', icon: '|||',
    validate: (v) => v.length > 0,
    placeholder: '(01)09501101530003',
  },
};

export const FORMAT_LIST = Object.values(BARCODE_FORMATS);
export const FORMATS_1D = FORMAT_LIST.filter(f => f.category === '1D');
export const FORMATS_2D = FORMAT_LIST.filter(f => f.category === '2D');

/**
 * Generate a barcode onto a canvas element
 */
export async function generateBarcode(canvas, data, format, options = {}) {
  if (!canvas || !data || !format) return false;

  const formatDef = BARCODE_FORMATS[format];
  if (!formatDef) throw new Error(`Unknown format: ${format}`);

  const {
    width = 2,
    height = 100,
    margin = 10,
    background = '#FFFFFF',
    foreground = '#000000',
    fontSize = 14,
    showText = true,
    fontFamily = 'Inter',
    scale = 3,
  } = options;

  try {
    if (formatDef.engine === 'jsbarcode') {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      JsBarcode(canvas, data, {
        format: formatDef.id,
        width: width,
        height: height,
        margin: margin,
        background: background,
        lineColor: foreground,
        fontSize: fontSize,
        font: fontFamily,
        displayValue: showText,
        textMargin: 4,
      });
      return true;
    } else if (formatDef.engine === 'bwipjs') {
      const bwip = await loadBwipJs();

      const bwipOptions = {
        bcid: formatDef.bcid,
        text: data,
        scale: scale,
        height: Math.max(10, height / 10),
        includetext: showText,
        textsize: fontSize,
        textfont: fontFamily,
        padding: margin,
      };

      // Add colors (bwip-js wants hex without #)
      if (background && background !== '#FFFFFF') {
        bwipOptions.backgroundcolor = background.replace('#', '');
      }
      if (foreground && foreground !== '#000000') {
        bwipOptions.barcolor = foreground.replace('#', '');
      }

      // 2D specific
      if (formatDef.category === '2D') {
        bwipOptions.width = Math.max(10, height / 10);
      }

      bwip.toCanvas(canvas, bwipOptions);
      return true;
    }
  } catch (err) {
    console.error('Barcode generation error:', err);
    throw err;
  }
  return false;
}

/**
 * Generate barcode as SVG string
 */
export async function generateBarcodeSVG(data, format, options = {}) {
  const formatDef = BARCODE_FORMATS[format];
  if (!formatDef) throw new Error(`Unknown format: ${format}`);

  const {
    width = 2,
    height = 100,
    margin = 10,
    background = '#FFFFFF',
    foreground = '#000000',
    fontSize = 14,
    showText = true,
    fontFamily = 'Inter',
    scale = 3,
  } = options;

  if (formatDef.engine === 'jsbarcode') {
    const svgNs = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNs, 'svg');
    document.body.appendChild(svg);

    try {
      JsBarcode(svg, data, {
        format: formatDef.id,
        width,
        height,
        margin,
        background,
        lineColor: foreground,
        fontSize,
        font: fontFamily,
        displayValue: showText,
        xmlDocument: document,
      });

      const serializer = new XMLSerializer();
      return serializer.serializeToString(svg);
    } finally {
      document.body.removeChild(svg);
    }
  } else if (formatDef.engine === 'bwipjs') {
    const bwip = await loadBwipJs();

    const bwipOptions = {
      bcid: formatDef.bcid,
      text: data,
      scale,
      height: Math.max(10, height / 10),
      includetext: showText,
      textsize: fontSize,
      textfont: fontFamily,
      padding: margin,
    };

    if (background && background !== '#FFFFFF') {
      bwipOptions.backgroundcolor = background.replace('#', '');
    }
    if (foreground && foreground !== '#000000') {
      bwipOptions.barcolor = foreground.replace('#', '');
    }
    if (formatDef.category === '2D') {
      bwipOptions.width = Math.max(10, height / 10);
    }

    return bwip.toSVG(bwipOptions);
  }

  return null;
}

/**
 * Auto-detect best barcode format based on input data
 */
export function autoDetectFormat(data) {
  if (!data) return 'CODE128';
  const trimmed = data.trim();

  if (/^https?:\/\//i.test(trimmed) || /^www\./i.test(trimmed)) return 'qrcode';
  if (/^WIFI:/i.test(trimmed)) return 'qrcode';
  if (/^BEGIN:VCARD/i.test(trimmed)) return 'qrcode';
  if (/^mailto:/i.test(trimmed)) return 'qrcode';
  if (/^\(\d{2}\)/.test(trimmed)) return 'gs1_128';

  if (/^\d+$/.test(trimmed)) {
    if (trimmed.length === 13 || trimmed.length === 12) return 'EAN13';
    if (trimmed.length === 8 || trimmed.length === 7) return 'EAN8';
    if (trimmed.length === 11) return 'UPC';
    if (trimmed.length === 14) return 'ITF14';
    return 'CODE128';
  }

  if (trimmed.length > 80) return 'qrcode';
  return 'CODE128';
}

/**
 * AI Smart Generator
 */
export function aiSmartParse(input) {
  const lower = input.toLowerCase();
  const result = { data: '', format: 'CODE128', confidence: 0 };

  const urlMatch = input.match(/(https?:\/\/[^\s]+)/);
  const quotedMatch = input.match(/"([^"]+)"|'([^']+)'/);
  const numberMatch = input.match(/\b(\d{3,})\b/);

  if (urlMatch) {
    result.data = urlMatch[1];
    result.format = 'qrcode';
    result.confidence = 95;
  } else if (quotedMatch) {
    result.data = quotedMatch[1] || quotedMatch[2];
    result.format = autoDetectFormat(result.data);
    result.confidence = 90;
  } else if (numberMatch) {
    result.data = numberMatch[1];
  }

  if (lower.includes('qr')) { result.format = 'qrcode'; result.confidence = Math.max(result.confidence, 85); }
  else if (lower.includes('ean-13') || lower.includes('ean13')) { result.format = 'EAN13'; result.confidence = Math.max(result.confidence, 85); }
  else if (lower.includes('ean-8') || lower.includes('ean8')) { result.format = 'EAN8'; result.confidence = Math.max(result.confidence, 85); }
  else if (lower.includes('upc')) { result.format = 'UPC'; result.confidence = Math.max(result.confidence, 85); }
  else if (lower.includes('code 39') || lower.includes('code39')) { result.format = 'CODE39'; result.confidence = Math.max(result.confidence, 85); }
  else if (lower.includes('data matrix') || lower.includes('datamatrix')) { result.format = 'datamatrix'; result.confidence = Math.max(result.confidence, 85); }
  else if (lower.includes('pdf417')) { result.format = 'pdf417'; result.confidence = Math.max(result.confidence, 85); }
  else if (lower.includes('product') || lower.includes('barcode') || lower.includes('item')) {
    if (result.data && /^\d{12,13}$/.test(result.data)) result.format = 'EAN13';
    else result.format = 'CODE128';
    result.confidence = Math.max(result.confidence, 70);
  } else if (lower.includes('website') || lower.includes('link') || lower.includes('url')) {
    result.format = 'qrcode';
    result.confidence = Math.max(result.confidence, 75);
  }

  if (!result.data) {
    const words = input.replace(/[^a-zA-Z0-9\s\-\.]/g, '').trim();
    result.data = words || input;
    result.confidence = Math.max(result.confidence, 50);
  }

  return result;
}

/**
 * Validate data for a specific format
 */
export function validateInput(data, format) {
  if (!data) return { valid: false, error: 'Please enter data to encode' };
  const formatDef = BARCODE_FORMATS[format];
  if (!formatDef) return { valid: false, error: 'Unknown format selected' };
  if (!formatDef.validate(data)) {
    return { valid: false, error: `Invalid input for ${formatDef.name}. Expected: ${formatDef.placeholder}` };
  }
  return { valid: true, error: null };
}
