import React from 'react';
import { Zap, Globe, Mail, Heart } from 'lucide-react';
import { useBarcodeStore } from '../../stores/barcodeStore';

export default function Footer() {
  const { setActiveTab } = useBarcodeStore();

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative mt-8 border-t border-gray-200/50 dark:border-dark-700/50 bg-white/50 dark:bg-dark-800/30 backdrop-blur-lg">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-md shadow-primary-500/20">
                <Zap size={18} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold leading-tight">
                  <span className="gradient-text">Barcode</span>
                  <span className="text-dark-800 dark:text-white">Pro</span>
                </h3>
              </div>
            </div>
            <p className="text-xs text-dark-400 leading-relaxed mb-4">
              Free professional barcode &amp; QR code generator. No sign-up, no limits. Supports 15+ formats with batch export.
            </p>
            <a
              href="https://www.edutechminds.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-500 hover:text-primary-600 transition-colors"
            >
              <Globe size={12} />
              A product by EduTechMinds
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-dark-500 dark:text-dark-400 mb-4">
              Tools
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Barcode Generator', action: () => { setActiveTab('generator'); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
                { label: 'Batch Generator', action: () => { setActiveTab('batch'); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
                { label: 'History', action: () => { setActiveTab('history'); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
              ].map((link, i) => (
                <li key={i}>
                  <button
                    onClick={link.action}
                    className="text-sm text-dark-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-dark-500 dark:text-dark-400 mb-4">
              Info
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'How to Use', action: () => scrollTo('how-to-use') },
                { label: 'About', action: () => scrollTo('about') },
                { label: 'FAQ', action: () => scrollTo('faq') },
              ].map((link, i) => (
                <li key={i}>
                  <button
                    onClick={link.action}
                    className="text-sm text-dark-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-dark-500 dark:text-dark-400 mb-4">
              Contact
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="mailto:admin@edutechminds.com"
                  className="inline-flex items-center gap-2 text-sm text-dark-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                >
                  <Mail size={14} />
                  admin@edutechminds.com
                </a>
              </li>
              <li>
                <a
                  href="https://www.edutechminds.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-dark-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                >
                  <Globe size={14} />
                  www.edutechminds.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Supported Formats Bar */}
        <div className="py-4 border-t border-gray-100 dark:border-dark-700/50 mb-6">
          <p className="text-[10px] uppercase tracking-widest text-dark-300 dark:text-dark-600 text-center mb-3">
            Supported Formats
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Code 128', 'Code 39', 'EAN-13', 'EAN-8', 'UPC-A', 'UPC-E', 'ITF-14', 'QR Code', 'Data Matrix', 'PDF417', 'GS1-128'].map((fmt) => (
              <span
                key={fmt}
                className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-gray-100 dark:bg-dark-700 text-dark-400 dark:text-dark-400"
              >
                {fmt}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gray-100 dark:border-dark-700/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-dark-400">
            © {new Date().getFullYear()}{' '}
            <span className="gradient-text font-semibold">BarcodePro</span> by{' '}
            <a
              href="https://www.edutechminds.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary-500 hover:text-primary-600 hover:underline transition-colors"
            >
              EduTechMinds
            </a>
            . All rights reserved.
          </p>
          <p className="text-xs text-dark-300 dark:text-dark-600 flex items-center gap-1">
            Made with <Heart size={12} className="text-red-500 fill-red-500" /> for the community
          </p>
        </div>
      </div>
    </footer>
  );
}
