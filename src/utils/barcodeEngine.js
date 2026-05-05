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
  isbn: {
    id: 'isbn', name: 'ISBN', engine: 'bwipjs', bcid: 'isbn', category: '1D',
    description: 'Book identification', icon: '|||',
    validate: (v) => {
      const digits = v.replace(/[-\s]/g, '');
      // ISBN-13: 13 digits starting with 978 or 979
      // Also allow optional supplement (space + 2 or 5 digits)
      return /^(978|979)\d{10}$/.test(digits) || /^(978|979)[-\d]{10,17}(\s\d{2,5})?$/.test(v.replace(/^ISBN[:\s]*/i, ''));
    },
    placeholder: '978-3-16-148410-0',
  },
  issn: {
    id: 'issn', name: 'ISSN', engine: 'bwipjs', bcid: 'issn', category: '1D',
    description: 'Serial publication code', icon: '|||',
    validate: (v) => {
      const cleaned = v.replace(/[-\s]/g, '');
      return /^\d{7}[\dXx]$/.test(cleaned);
    },
    placeholder: '0317-8471',
  },
  ismn: {
    id: 'ismn', name: 'ISMN', engine: 'bwipjs', bcid: 'ismn', category: '1D',
    description: 'Music publication code', icon: '|||',
    validate: (v) => {
      const cleaned = v.replace(/[-\s]/g, '');
      return /^979\d{10}$/.test(cleaned) || /^M\d{9}$/i.test(cleaned);
    },
    placeholder: '979-0-2600-0043-8',
  },

  // ── Additional 2D Codes ──
  azteccode: {
    id: 'azteccode', name: 'Aztec Code', engine: 'bwipjs', bcid: 'azteccode', category: '2D',
    description: 'High-density 2D matrix', icon: '⊞',
    validate: (v) => v.length > 0, placeholder: 'Enter data...',
  },
  azteccodecompact: {
    id: 'azteccodecompact', name: 'Aztec Compact', engine: 'bwipjs', bcid: 'azteccodecompact', category: '2D',
    description: 'Compact Aztec code', icon: '⊞',
    validate: (v) => v.length > 0, placeholder: 'Enter data...',
  },
  aztecrune: {
    id: 'aztecrune', name: 'Aztec Rune', engine: 'bwipjs', bcid: 'aztecrune', category: '2D',
    description: 'Aztec rune mark', icon: '⊞',
    validate: (v) => /^\d{1,3}$/.test(v) && parseInt(v) <= 255, placeholder: '0-255',
  },
  maxicode: {
    id: 'maxicode', name: 'MaxiCode', engine: 'bwipjs', bcid: 'maxicode', category: '2D',
    description: 'UPS shipping code', icon: '⊞',
    validate: (v) => v.length > 0, placeholder: 'Enter data...',
  },
  microqrcode: {
    id: 'microqrcode', name: 'Micro QR', engine: 'bwipjs', bcid: 'microqrcode', category: '2D',
    description: 'Compact QR code', icon: '⊞',
    validate: (v) => v.length > 0 && v.length <= 35, placeholder: 'Short text...',
  },
  micropdf417: {
    id: 'micropdf417', name: 'Micro PDF417', engine: 'bwipjs', bcid: 'micropdf417', category: '2D',
    description: 'Compact PDF417', icon: '⊞',
    validate: (v) => v.length > 0, placeholder: 'Enter data...',
  },
  hanxin: {
    id: 'hanxin', name: 'Han Xin', engine: 'bwipjs', bcid: 'hanxin', category: '2D',
    description: 'Chinese 2D code', icon: '⊞',
    validate: (v) => v.length > 0, placeholder: 'Enter data...',
  },
  dotcode: {
    id: 'dotcode', name: 'DotCode', engine: 'bwipjs', bcid: 'dotcode', category: '2D',
    description: 'High-speed printing', icon: '⊞',
    validate: (v) => v.length > 0, placeholder: 'Enter data...',
  },
  ultracode: {
    id: 'ultracode', name: 'Ultracode', engine: 'bwipjs', bcid: 'ultracode', category: '2D',
    description: 'Color 2D barcode', icon: '⊞',
    validate: (v) => v.length > 0, placeholder: 'Enter data...',
  },
  rectangularmicroqrcode: {
    id: 'rectangularmicroqrcode', name: 'rMQR', engine: 'bwipjs', bcid: 'rectangularmicroqrcode', category: '2D',
    description: 'Rectangular Micro QR', icon: '⊞',
    validate: (v) => v.length > 0, placeholder: 'Enter data...',
  },
  datamatrixrectangular: {
    id: 'datamatrixrectangular', name: 'Data Matrix Rect', engine: 'bwipjs', bcid: 'datamatrixrectangular', category: '2D',
    description: 'Rectangular Data Matrix', icon: '⊞',
    validate: (v) => v.length > 0, placeholder: 'Enter data...',
  },
  datamatrixrectangularextension: {
    id: 'datamatrixrectangularextension', name: 'DMRE', engine: 'bwipjs', bcid: 'datamatrixrectangularextension', category: '2D',
    description: 'Data Matrix Rect Extended', icon: '⊞',
    validate: (v) => v.length > 0, placeholder: 'Enter data...',
  },
  codeone: {
    id: 'codeone', name: 'Code One', engine: 'bwipjs', bcid: 'codeone', category: '2D',
    description: 'High-density 2D code', icon: '⊞',
    validate: (v) => v.length > 0, placeholder: 'Enter data...',
  },
  gridmatrix: {
    id: 'gridmatrix', name: 'Grid Matrix', engine: 'bwipjs', bcid: 'gridmatrix', category: '2D',
    description: 'Chinese grid code', icon: '⊞',
    validate: (v) => v.length > 0, placeholder: 'Enter data...',
  },
  jabcode: {
    id: 'jabcode', name: 'JAB Code', engine: 'bwipjs', bcid: 'jabcode', category: '2D',
    description: 'Color 2D matrix', icon: '⊞',
    validate: (v) => v.length > 0, placeholder: 'Enter data...',
  },

  // ── Additional 1D Codes ──
  code11: {
    id: 'code11', name: 'Code 11', engine: 'bwipjs', bcid: 'code11', category: '1D',
    description: 'Telecom labeling', icon: '|||',
    validate: (v) => /^[\d\-]+$/.test(v) && v.length > 0, placeholder: '0123456789',
  },
  interleaved2of5: {
    id: 'interleaved2of5', name: 'Interleaved 2/5', engine: 'bwipjs', bcid: 'interleaved2of5', category: '1D',
    description: 'Numeric pairs code', icon: '|||',
    validate: (v) => /^\d+$/.test(v) && v.length >= 2, placeholder: '1234567890',
  },
  industrial2of5: {
    id: 'industrial2of5', name: 'Industrial 2/5', engine: 'bwipjs', bcid: 'industrial2of5', category: '1D',
    description: 'Industrial numeric', icon: '|||',
    validate: (v) => /^\d+$/.test(v) && v.length > 0, placeholder: '12345',
  },
  matrix2of5: {
    id: 'matrix2of5', name: 'Matrix 2/5', engine: 'bwipjs', bcid: 'matrix2of5', category: '1D',
    description: 'Matrix numeric code', icon: '|||',
    validate: (v) => /^\d+$/.test(v) && v.length > 0, placeholder: '12345',
  },
  plessey: {
    id: 'plessey', name: 'Plessey UK', engine: 'bwipjs', bcid: 'plessey', category: '1D',
    description: 'UK retail code', icon: '|||',
    validate: (v) => /^[\dA-Fa-f]+$/.test(v) && v.length > 0, placeholder: '01234ABCD',
  },
  telepen: {
    id: 'telepen', name: 'Telepen', engine: 'bwipjs', bcid: 'telepen', category: '1D',
    description: 'Full ASCII barcode', icon: '|||',
    validate: (v) => v.length > 0, placeholder: 'Enter text...',
  },
  telepennumeric: {
    id: 'telepennumeric', name: 'Telepen Numeric', engine: 'bwipjs', bcid: 'telepennumeric', category: '1D',
    description: 'Numeric Telepen', icon: '|||',
    validate: (v) => /^\d+$/.test(v) && v.length > 0, placeholder: '1234567890',
  },
  channelcode: {
    id: 'channelcode', name: 'Channel Code', engine: 'bwipjs', bcid: 'channelcode', category: '1D',
    description: 'Compact numeric', icon: '|||',
    validate: (v) => /^\d+$/.test(v) && v.length > 0, placeholder: '1234',
  },
  bc412: {
    id: 'bc412', name: 'BC412', engine: 'bwipjs', bcid: 'bc412', category: '1D',
    description: 'IBM semi-conductor', icon: '|||',
    validate: (v) => /^[0-9A-Z\-. $/+%]+$/.test(v) && v.length > 0, placeholder: 'BC412',
  },
  rationalizedCodabar: {
    id: 'rationalizedCodabar', name: 'Rationalized Codabar', engine: 'bwipjs', bcid: 'rationalizedCodabar', category: '1D',
    description: 'Extended Codabar', icon: '|||',
    validate: (v) => v.length > 0, placeholder: 'A12345B',
  },
  code2of5: {
    id: 'code2of5', name: 'Code 2 of 5', engine: 'bwipjs', bcid: 'code2of5', category: '1D',
    description: 'Standard 2 of 5', icon: '|||',
    validate: (v) => /^\d+$/.test(v) && v.length > 0, placeholder: '12345',
  },
  code32: {
    id: 'code32', name: 'Code 32', engine: 'bwipjs', bcid: 'code32', category: '1D',
    description: 'Italian pharma code', icon: '|||',
    validate: (v) => /^\d{8,9}$/.test(v), placeholder: '01234567',
  },

  // ── Stacked / Composite ──
  code16k: {
    id: 'code16k', name: 'Code 16K', engine: 'bwipjs', bcid: 'code16k', category: '2D',
    description: 'Stacked Code 128', icon: '⊞',
    validate: (v) => v.length > 0, placeholder: 'Enter data...',
  },
  code49: {
    id: 'code49', name: 'Code 49', engine: 'bwipjs', bcid: 'code49', category: '2D',
    description: 'Stacked alphanumeric', icon: '⊞',
    validate: (v) => v.length > 0, placeholder: 'Enter data...',
  },
  codablockf: {
    id: 'codablockf', name: 'Codablock-F', engine: 'bwipjs', bcid: 'codablockf', category: '2D',
    description: 'Stacked Code 128', icon: '⊞',
    validate: (v) => v.length > 0, placeholder: 'Enter data...',
  },

  // ── Postal Codes ──
  postnet: {
    id: 'postnet', name: 'POSTNET', engine: 'bwipjs', bcid: 'postnet', category: 'Postal',
    description: 'US postal code', icon: '✉',
    validate: (v) => /^\d{5,11}$/.test(v), placeholder: '12345',
  },
  planet: {
    id: 'planet', name: 'PLANET', engine: 'bwipjs', bcid: 'planet', category: 'Postal',
    description: 'US postal tracking', icon: '✉',
    validate: (v) => /^\d{11,13}$/.test(v), placeholder: '12345678901',
  },
  onecode: {
    id: 'onecode', name: 'USPS IMb', engine: 'bwipjs', bcid: 'onecode', category: 'Postal',
    description: 'USPS Intelligent Mail', icon: '✉',
    validate: (v) => /^\d{20,31}$/.test(v), placeholder: '01234567890123456789',
  },
  royalmail: {
    id: 'royalmail', name: 'Royal Mail 4-State', engine: 'bwipjs', bcid: 'royalmail', category: 'Postal',
    description: 'UK postal code', icon: '✉',
    validate: (v) => /^[A-Z\d]+$/i.test(v) && v.length > 0, placeholder: 'LE28HS9Z',
  },
  kix: {
    id: 'kix', name: 'KIX', engine: 'bwipjs', bcid: 'kix', category: 'Postal',
    description: 'Netherlands postal', icon: '✉',
    validate: (v) => /^[A-Z\d]+$/i.test(v) && v.length > 0, placeholder: '1231FZ13XHS',
  },
  japanpost: {
    id: 'japanpost', name: 'Japan Post', engine: 'bwipjs', bcid: 'japanpost', category: 'Postal',
    description: 'Japan postal code', icon: '✉',
    validate: (v) => /^[\d\-A-Z]+$/i.test(v) && v.length > 0, placeholder: '6540123789-A-K-Z',
  },
  auspost: {
    id: 'auspost', name: 'Australia Post', engine: 'bwipjs', bcid: 'auspost', category: 'Postal',
    description: 'Australia postal code', icon: '✉',
    validate: (v) => /^\d{8,23}$/.test(v), placeholder: '5956439111ABA9',
  },
  daft: {
    id: 'daft', name: 'DAFT Code', engine: 'bwipjs', bcid: 'daft', category: 'Postal',
    description: 'Generic 4-state', icon: '✉',
    validate: (v) => /^[DAFT]+$/i.test(v) && v.length > 0, placeholder: 'FFDFTDTAFDTDT',
  },
  swissqrcode: {
    id: 'swissqrcode', name: 'Swiss QR', engine: 'bwipjs', bcid: 'swissqrcode', category: 'Postal',
    description: 'Swiss payment code', icon: '✉',
    validate: (v) => v.length > 0, placeholder: 'Swiss payment data...',
  },

  // ── GS1 Variants ──
  gs1_datamatrix: {
    id: 'gs1_datamatrix', name: 'GS1 Data Matrix', engine: 'bwipjs', bcid: 'gs1datamatrix', category: '2D',
    description: 'GS1 Data Matrix', icon: '⊞',
    validate: (v) => v.length > 0, placeholder: '(01)09501101530003',
  },
  gs1_qrcode: {
    id: 'gs1_qrcode', name: 'GS1 QR Code', engine: 'bwipjs', bcid: 'gs1qrcode', category: '2D',
    description: 'GS1 QR Code', icon: '⊞',
    validate: (v) => v.length > 0, placeholder: '(01)09501101530003',
  },
  gs1_dotcode: {
    id: 'gs1_dotcode', name: 'GS1 DotCode', engine: 'bwipjs', bcid: 'gs1dotcode', category: '2D',
    description: 'GS1 DotCode', icon: '⊞',
    validate: (v) => v.length > 0, placeholder: '(01)09501101530003',
  },
  gs1northamericancoupon: {
    id: 'gs1northamericancoupon', name: 'GS1 NA Coupon', engine: 'bwipjs', bcid: 'gs1northamericancoupon', category: '1D',
    description: 'North American coupon', icon: '|||',
    validate: (v) => v.length > 0, placeholder: '(8110)0012345...',
  },
  ean13composite: {
    id: 'ean13composite', name: 'EAN-13 Composite', engine: 'bwipjs', bcid: 'ean13composite', category: '1D',
    description: 'EAN-13 with 2D', icon: '|||',
    validate: (v) => v.length > 0, placeholder: '2112345678392|(99)1234-abcd',
  },

  // ── EAN/UPC Variants ──
  ean2: {
    id: 'ean2', name: 'EAN-2', engine: 'bwipjs', bcid: 'ean2', category: '1D',
    description: '2-digit supplement', icon: '|||',
    validate: (v) => /^\d{2}$/.test(v), placeholder: '05',
  },
  ean5: {
    id: 'ean5', name: 'EAN-5', engine: 'bwipjs', bcid: 'ean5', category: '1D',
    description: '5-digit supplement', icon: '|||',
    validate: (v) => /^\d{5}$/.test(v), placeholder: '52495',
  },

  // ── HIBC (Healthcare) ──
  hibccode128: {
    id: 'hibccode128', name: 'HIBC Code 128', engine: 'bwipjs', bcid: 'hibccode128', category: '1D',
    description: 'Healthcare Code 128', icon: '|||',
    validate: (v) => v.length > 0, placeholder: 'A123BJC5D6E71',
  },
  hibccode39: {
    id: 'hibccode39', name: 'HIBC Code 39', engine: 'bwipjs', bcid: 'hibccode39', category: '1D',
    description: 'Healthcare Code 39', icon: '|||',
    validate: (v) => v.length > 0, placeholder: 'A123BJC5D6E71',
  },
  hibcdatamatrix: {
    id: 'hibcdatamatrix', name: 'HIBC Data Matrix', engine: 'bwipjs', bcid: 'hibcdatamatrix', category: '2D',
    description: 'Healthcare Data Matrix', icon: '⊞',
    validate: (v) => v.length > 0, placeholder: 'A123BJC5D6E71',
  },
  hibcqrcode: {
    id: 'hibcqrcode', name: 'HIBC QR Code', engine: 'bwipjs', bcid: 'hibcqrcode', category: '2D',
    description: 'Healthcare QR Code', icon: '⊞',
    validate: (v) => v.length > 0, placeholder: 'A123BJC5D6E71',
  },
  hibcpdf417: {
    id: 'hibcpdf417', name: 'HIBC PDF417', engine: 'bwipjs', bcid: 'hibcpdf417', category: '2D',
    description: 'Healthcare PDF417', icon: '⊞',
    validate: (v) => v.length > 0, placeholder: 'A123BJC5D6E71',
  },
  hibcmicropdf417: {
    id: 'hibcmicropdf417', name: 'HIBC MicroPDF417', engine: 'bwipjs', bcid: 'hibcmicropdf417', category: '2D',
    description: 'Healthcare MicroPDF417', icon: '⊞',
    validate: (v) => v.length > 0, placeholder: 'A123BJC5D6E71',
  },
  hibcazteccode: {
    id: 'hibcazteccode', name: 'HIBC Aztec', engine: 'bwipjs', bcid: 'hibcazteccode', category: '2D',
    description: 'Healthcare Aztec Code', icon: '⊞',
    validate: (v) => v.length > 0, placeholder: 'A123BJC5D6E71',
  },
  hibccodablockf: {
    id: 'hibccodablockf', name: 'HIBC Codablock-F', engine: 'bwipjs', bcid: 'hibccodablockf', category: '2D',
    description: 'Healthcare Codablock-F', icon: '⊞',
    validate: (v) => v.length > 0, placeholder: 'A123BJC5D6E71',
  },

  // ── Miscellaneous 1D ──
  msi_plessey: {
    id: 'msi_plessey', name: 'MSI (bwip)', engine: 'bwipjs', bcid: 'msi', category: '1D',
    description: 'MSI Modified Plessey', icon: '|||',
    validate: (v) => /^\d+$/.test(v) && v.length > 0, placeholder: '1234567',
  },
  code128auto: {
    id: 'code128auto', name: 'Code 128 Auto', engine: 'bwipjs', bcid: 'code128', category: '1D',
    description: 'Auto Code 128', icon: '|||',
    validate: (v) => v.length > 0, placeholder: 'Enter any text...',
  },
  coop2of5: {
    id: 'coop2of5', name: 'COOP 2/5', engine: 'bwipjs', bcid: 'coop2of5', category: '1D',
    description: 'COOP 2 of 5', icon: '|||',
    validate: (v) => /^\d+$/.test(v) && v.length > 0, placeholder: '12345',
  },
  iata2of5: {
    id: 'iata2of5', name: 'IATA 2/5', engine: 'bwipjs', bcid: 'iata2of5', category: '1D',
    description: 'Airline ticket code', icon: '|||',
    validate: (v) => /^\d+$/.test(v) && v.length > 0, placeholder: '12345',
  },
  datalogic2of5: {
    id: 'datalogic2of5', name: 'Datalogic 2/5', engine: 'bwipjs', bcid: 'datalogic2of5', category: '1D',
    description: 'Datalogic numeric', icon: '|||',
    validate: (v) => /^\d+$/.test(v) && v.length > 0, placeholder: '12345',
  },
  leitcode: {
    id: 'leitcode', name: 'Leitcode', engine: 'bwipjs', bcid: 'leitcode', category: '1D',
    description: 'German postal routing', icon: '|||',
    validate: (v) => /^\d{14}$/.test(v), placeholder: '21348075016401',
  },
  identcode: {
    id: 'identcode', name: 'Identcode', engine: 'bwipjs', bcid: 'identcode', category: '1D',
    description: 'German postal ID', icon: '|||',
    validate: (v) => /^\d{11,12}$/.test(v), placeholder: '563102430313',
  },
  raw: {
    id: 'raw', name: 'Raw Bars', engine: 'bwipjs', bcid: 'raw', category: '1D',
    description: 'Custom raw bars', icon: '|||',
    validate: (v) => v.length > 0, placeholder: '1 2 3 1 1 2',
  },
  symbol: {
    id: 'symbol', name: 'Miscellaneous', engine: 'bwipjs', bcid: 'symbol', category: '2D',
    description: 'Miscellaneous symbols', icon: '⊞',
    validate: (v) => v.length > 0, placeholder: 'fima',
  },
};

export const FORMAT_LIST = Object.values(BARCODE_FORMATS);
export const FORMATS_1D = FORMAT_LIST.filter(f => f.category === '1D');
export const FORMATS_2D = FORMAT_LIST.filter(f => f.category === '2D');
export const FORMATS_POSTAL = FORMAT_LIST.filter(f => f.category === 'Postal');
export const FORMAT_CATEGORIES = ['all', '1D', '2D', 'Postal'];

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

      // ISBN/ISSN/ISMN specific - add guard whitespace for proper rendering
      if (['isbn', 'issn', 'ismn'].includes(format)) {
        bwipOptions.guardwhitespace = true;
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

    // ISBN/ISSN/ISMN specific - add guard whitespace for proper rendering
    if (['isbn', 'issn', 'ismn'].includes(format)) {
      bwipOptions.guardwhitespace = true;
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
  if (/^ISBN[:\s]*/i.test(trimmed)) return 'isbn';
  if (/^(978|979)[-\d]{10,17}$/.test(trimmed)) return 'isbn';
  if (/^ISSN[:\s]*/i.test(trimmed)) return 'issn';
  if (/^\d{4}-\d{3}[\dXx]$/.test(trimmed)) return 'issn';
  if (/^\(\d{2}\)/.test(trimmed)) return 'gs1_128';

  if (/^\d+$/.test(trimmed)) {
    if ((trimmed.length === 13) && /^(978|979)/.test(trimmed)) return 'isbn';
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
  else if (lower.includes('isbn') || lower.includes('book')) { result.format = 'isbn'; result.confidence = Math.max(result.confidence, 85); }
  else if (lower.includes('issn') || lower.includes('journal') || lower.includes('magazine')) { result.format = 'issn'; result.confidence = Math.max(result.confidence, 85); }
  else if (lower.includes('ismn') || lower.includes('music score') || lower.includes('sheet music')) { result.format = 'ismn'; result.confidence = Math.max(result.confidence, 85); }
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
