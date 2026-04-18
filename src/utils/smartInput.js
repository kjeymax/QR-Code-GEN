/**
 * Smart input modes for generating specialized QR codes
 */

export const INPUT_MODES = {
  text: { id: 'text', name: 'Plain Text', icon: 'Type' },
  url: { id: 'url', name: 'URL / Website', icon: 'Globe' },
  vcard: { id: 'vcard', name: 'Contact (vCard)', icon: 'User' },
  wifi: { id: 'wifi', name: 'WiFi Network', icon: 'Wifi' },
  email: { id: 'email', name: 'Email', icon: 'Mail' },
  sms: { id: 'sms', name: 'SMS Message', icon: 'MessageSquare' },
  phone: { id: 'phone', name: 'Phone Number', icon: 'Phone' },
};

/**
 * Build vCard string
 */
export function buildVCard({ firstName, lastName, phone, email, org, title, url, address }) {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
  ];

  if (firstName || lastName) {
    lines.push(`N:${lastName || ''};${firstName || ''};`);
    lines.push(`FN:${firstName || ''} ${lastName || ''}`.trim());
  }
  if (org) lines.push(`ORG:${org}`);
  if (title) lines.push(`TITLE:${title}`);
  if (phone) lines.push(`TEL:${phone}`);
  if (email) lines.push(`EMAIL:${email}`);
  if (url) lines.push(`URL:${url}`);
  if (address) lines.push(`ADR:;;${address}`);

  lines.push('END:VCARD');
  return lines.join('\n');
}

/**
 * Build WiFi QR string
 */
export function buildWiFi({ ssid, password, encryption = 'WPA', hidden = false }) {
  return `WIFI:T:${encryption};S:${ssid};P:${password};H:${hidden ? 'true' : 'false'};;`;
}

/**
 * Build Email string
 */
export function buildEmail({ to, subject, body }) {
  let str = `mailto:${to}`;
  const params = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  if (params.length) str += `?${params.join('&')}`;
  return str;
}

/**
 * Build SMS string
 */
export function buildSMS({ phone, message }) {
  let str = `smsto:${phone}`;
  if (message) str += `:${message}`;
  return str;
}

/**
 * Build Phone string
 */
export function buildPhone({ phone }) {
  return `tel:${phone}`;
}

/**
 * Detect input mode from data
 */
export function detectInputMode(data) {
  if (!data) return 'text';
  const trimmed = data.trim();

  if (/^https?:\/\//i.test(trimmed) || /^www\./i.test(trimmed)) return 'url';
  if (/^BEGIN:VCARD/i.test(trimmed)) return 'vcard';
  if (/^WIFI:/i.test(trimmed)) return 'wifi';
  if (/^mailto:/i.test(trimmed)) return 'email';
  if (/^smsto:/i.test(trimmed)) return 'sms';
  if (/^tel:/i.test(trimmed)) return 'phone';

  return 'text';
}
