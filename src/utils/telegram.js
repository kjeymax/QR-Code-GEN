/**
 * Telegram Bot API integration for bug reports and feedback
 */

const BOT_TOKEN = '8514501470:AAFjyi0qlm4PqBDB5Cm6YceRfjd0VQAtzuw';
const CHAT_ID = '-1001735852859';
const API_BASE = `https://api.telegram.org/bot${BOT_TOKEN}`;

/**
 * Send a bug report or feedback message via Telegram Bot
 */
export async function sendBugReport({ name, email, type, description, url, userAgent }) {
  const timestamp = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const typeEmoji = {
    bug: '🐛',
    feature: '💡',
    feedback: '💬',
    other: '📝',
  };

  const message = [
    `${typeEmoji[type] || '📝'} *New ${type.charAt(0).toUpperCase() + type.slice(1)} Report*`,
    ``,
    `👤 *From:* ${escapeMarkdown(name || 'Anonymous')}`,
    `📧 *Email:* ${escapeMarkdown(email || 'Not provided')}`,
    `📋 *Type:* ${type.toUpperCase()}`,
    `🕐 *Time:* ${timestamp}`,
    ``,
    `📝 *Description:*`,
    escapeMarkdown(description),
    ``,
    `🌐 *URL:* ${escapeMarkdown(url || window.location.href)}`,
    `💻 *Browser:* ${escapeMarkdown(userAgent || navigator.userAgent).substring(0, 100)}`,
    ``,
    `— _Sent from BarcodePro by EduTechMinds_`,
  ].join('\n');

  try {
    const response = await fetch(`${API_BASE}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      }),
    });

    const data = await response.json();
    return { success: data.ok, data };
  } catch (error) {
    console.error('Telegram send error:', error);
    return { success: false, error: error.message };
  }
}

function escapeMarkdown(text) {
  if (!text) return '';
  return text.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1');
}
