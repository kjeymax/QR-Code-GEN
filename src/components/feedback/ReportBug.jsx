import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bug, X, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { sendBugReport } from '../../utils/telegram';

export default function ReportBug() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState('idle');
  const [form, setForm] = useState({
    name: '',
    email: '',
    type: 'bug',
    description: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.description.trim()) return;

    setStatus('sending');
    const result = await sendBugReport({
      ...form,
      url: window.location.href,
      userAgent: navigator.userAgent,
    });

    if (result.success) {
      setStatus('success');
      setForm({ name: '', email: '', type: 'bug', description: '' });
      setTimeout(() => {
        setStatus('idle');
        setIsOpen(false);
      }, 2500);
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const updateField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 group"
        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.5 }}
        aria-label="Report a bug"
        title="Report Bug / Feedback"
      >
        <Bug size={22} />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[60]">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => status === 'idle' && setIsOpen(false)}
            />

            {/* Centered Modal */}
            <div className="relative z-10 flex items-center justify-center min-h-full p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="w-full max-w-lg"
              >
                <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-dark-700 overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 p-5 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                          <Bug size={20} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">Report Bug / Feedback</h3>
                          <p className="text-white/80 text-xs">Help us improve BarcodePro</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-dark-600 dark:text-dark-300 mb-1 block">Name</label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => updateField('name', e.target.value)}
                          placeholder="Your name"
                          className="input-field text-sm !py-2.5"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-dark-600 dark:text-dark-300 mb-1 block">Email</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => updateField('email', e.target.value)}
                          placeholder="your@email.com"
                          className="input-field text-sm !py-2.5"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-dark-600 dark:text-dark-300 mb-1.5 block">Type</label>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { id: 'bug', label: '🐛 Bug' },
                          { id: 'feature', label: '💡 Feature' },
                          { id: 'feedback', label: '💬 Feedback' },
                          { id: 'other', label: '📝 Other' },
                        ].map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => updateField('type', t.id)}
                            className={`py-2 text-xs font-medium rounded-lg transition-all duration-200 border ${
                              form.type === t.id
                                ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400'
                                : 'bg-gray-50 dark:bg-dark-700 border-gray-200 dark:border-dark-600 text-dark-500 dark:text-dark-400 hover:border-red-300'
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-dark-600 dark:text-dark-300 mb-1 block">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={form.description}
                        onChange={(e) => updateField('description', e.target.value)}
                        placeholder="Describe the bug or your suggestion in detail..."
                        rows={4}
                        required
                        className="input-field text-sm resize-none"
                      />
                    </div>

                    {/* Status Messages */}
                    <AnimatePresence mode="wait">
                      {status === 'success' && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400 text-sm"
                        >
                          <CheckCircle2 size={16} />
                          <span>Report sent successfully! Thank you for your feedback.</span>
                        </motion.div>
                      )}
                      {status === 'error' && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 text-sm"
                        >
                          <AlertCircle size={16} />
                          <span>Failed to send. Try emailing admin@edutechminds.com</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={!form.description.trim() || status === 'sending' || status === 'success'}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-medium rounded-xl shadow-md shadow-red-500/25 hover:shadow-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                      {status === 'sending' ? (
                        <><Loader2 size={16} className="animate-spin" /> Sending...</>
                      ) : status === 'success' ? (
                        <><CheckCircle2 size={16} /> Sent!</>
                      ) : (
                        <><Send size={16} /> Send Report</>
                      )}
                    </button>

                    <p className="text-[10px] text-center text-dark-400">
                      Or email us directly at{' '}
                      <a href="mailto:admin@edutechminds.com" className="text-primary-500 hover:underline">
                        admin@edutechminds.com
                      </a>
                    </p>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
