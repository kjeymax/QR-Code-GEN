import React from 'react';
import { motion } from 'framer-motion';
import {
  Shield, Zap, Globe, Users, Heart, Code2,
  Barcode, CheckCircle2
} from 'lucide-react';

const highlights = [
  { icon: Barcode, label: '15+ Formats', desc: 'Full barcode coverage' },
  { icon: Zap, label: 'Instant', desc: 'Real-time generation' },
  { icon: Shield, label: '100% Private', desc: 'Client-side only' },
  { icon: Globe, label: 'Free Forever', desc: 'No sign-up needed' },
];

const supportedFormats = [
  { name: 'Code 128', category: '1D', desc: 'High-density alphanumeric' },
  { name: 'Code 39', category: '1D', desc: 'Alphanumeric industrial' },
  { name: 'EAN-13', category: '1D', desc: 'European product code' },
  { name: 'EAN-8', category: '1D', desc: 'Short product code' },
  { name: 'UPC-A', category: '1D', desc: 'US product code' },
  { name: 'UPC-E', category: '1D', desc: 'Compact US product code' },
  { name: 'ITF-14', category: '1D', desc: 'Shipping containers' },
  { name: 'QR Code', category: '2D', desc: 'Universal 2D code' },
  { name: 'Data Matrix', category: '2D', desc: 'Compact 2D matrix' },
  { name: 'PDF417', category: '2D', desc: 'Stacked linear code' },
  { name: 'GS1-128', category: '1D', desc: 'Supply chain standard' },
  { name: 'Code 93', category: '1D', desc: 'Compact Code 39' },
];

export default function About() {
  return (
    <section id="about" className="max-w-5xl mx-auto px-4 lg:px-6 py-16">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-14"
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mb-4">
          <Heart size={12} /> ABOUT
        </span>
        <h2 className="text-3xl lg:text-4xl font-extrabold text-dark-800 dark:text-white mb-4">
          About <span className="gradient-text">BarcodePro</span>
        </h2>
        <p className="text-dark-400 max-w-2xl mx-auto leading-relaxed">
          A professional-grade barcode and QR code generator built by{' '}
          <a
            href="https://www.edutechminds.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-500 hover:text-primary-600 font-semibold hover:underline"
          >
            EduTechMinds
          </a>
          . Designed for developers, designers, retailers, logistics professionals, and anyone
          who needs scannable codes — completely free, forever.
        </p>
      </motion.div>

      {/* Highlights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14"
      >
        {highlights.map((h, i) => (
          <div
            key={i}
            className="glass-card p-5 text-center group hover:shadow-glow transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
              <h.icon size={22} className="text-primary-500" />
            </div>
            <h4 className="text-sm font-bold text-dark-800 dark:text-white">{h.label}</h4>
            <p className="text-xs text-dark-400 mt-1">{h.desc}</p>
          </div>
        ))}
      </motion.div>

      {/* About Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card p-8"
        >
          <h3 className="text-xl font-bold text-dark-800 dark:text-white mb-4 flex items-center gap-2">
            <Code2 size={20} className="text-primary-500" />
            Why BarcodePro?
          </h3>
          <ul className="space-y-3 text-sm text-dark-400">
            {[
              'No registration, no login, no data collection',
              '100% client-side — your data never leaves your browser',
              'Professional-quality output ready for printing',
              'Batch processing for bulk barcode generation',
              'AI-powered smart format detection',
              'Multiple export formats: PNG, SVG, PDF, JPG',
              'Smart Input for WiFi, vCard, Email, SMS QR codes',
              'Dark and light theme support',
              'Mobile-responsive design',
              'Open-source and actively maintained',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card p-8"
        >
          <h3 className="text-xl font-bold text-dark-800 dark:text-white mb-4 flex items-center gap-2">
            <Barcode size={20} className="text-accent-500" />
            Supported Formats
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {supportedFormats.map((fmt, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 dark:bg-dark-700/30 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors"
              >
                <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${
                  fmt.category === '2D'
                    ? 'bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300'
                    : 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                }`}>
                  {fmt.category}
                </span>
                <span className="text-sm font-medium text-dark-700 dark:text-dark-200">{fmt.name}</span>
                <span className="text-xs text-dark-400 ml-auto hidden sm:block">{fmt.desc}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* EduTechMinds Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="glass-card p-8 text-center bg-gradient-to-br from-primary-50/50 to-accent-50/50 dark:from-primary-900/10 dark:to-accent-900/10 border-primary-200/50 dark:border-primary-800/30"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary-500/25">
          <Users size={28} className="text-white" />
        </div>
        <h3 className="text-2xl font-bold text-dark-800 dark:text-white mb-2">
          Built by <span className="gradient-text">EduTechMinds</span>
        </h3>
        <p className="text-sm text-dark-400 max-w-lg mx-auto mb-5 leading-relaxed">
          EduTechMinds creates free, powerful web tools for developers, students, and professionals. 
          We believe great tools should be accessible to everyone, with no paywalls or limitations.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://www.edutechminds.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-sm px-6"
          >
            <Globe size={16} /> Visit EduTechMinds
          </a>
          <a
            href="mailto:admin@edutechminds.com"
            className="btn-secondary text-sm px-6"
          >
            Contact Us
          </a>
        </div>
      </motion.div>
    </section>
  );
}
