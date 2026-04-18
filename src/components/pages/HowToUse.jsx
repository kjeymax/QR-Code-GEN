import React from 'react';
import { motion } from 'framer-motion';
import { useBarcodeStore } from '../../stores/barcodeStore';
import {
  MousePointer, Type, Barcode, Download, Layers, Wand2,
  ArrowRight, Zap, Settings2, Palette
} from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Barcode,
    title: 'Select Barcode Format',
    description: 'Choose from 15+ barcode formats including Code 128, EAN-13, UPC-A, QR Code, Data Matrix, PDF417, and more. Use the sidebar to browse 1D and 2D categories.',
    color: 'from-primary-500 to-primary-600',
    shadowColor: 'shadow-primary-500/20',
  },
  {
    number: '02',
    icon: Type,
    title: 'Enter Your Data',
    description: 'Type or paste your data in the input panel. Use Smart Input modes to easily create WiFi QR codes, vCards, email links, SMS, phone numbers, and URLs.',
    color: 'from-accent-500 to-accent-600',
    shadowColor: 'shadow-accent-500/20',
  },
  {
    number: '03',
    icon: Settings2,
    title: 'Customize Appearance',
    description: 'Fine-tune bar width, height, margin, scale, and rotation. Customize colors for bars and background. Toggle text visibility and change fonts.',
    color: 'from-purple-500 to-purple-600',
    shadowColor: 'shadow-purple-500/20',
  },
  {
    number: '04',
    icon: Download,
    title: 'Export & Download',
    description: 'Download your barcode in PNG, SVG, PDF, or JPG format. Choose DPI quality (72, 150, 300). Copy to clipboard, get embed code, or generate a share link.',
    color: 'from-emerald-500 to-emerald-600',
    shadowColor: 'shadow-emerald-500/20',
  },
];

const features = [
  {
    icon: Wand2,
    title: 'AI Smart Generator',
    description: 'Describe what you need in plain English and let our AI suggest the best format and data.',
  },
  {
    icon: Layers,
    title: 'Batch Processing',
    description: 'Upload a CSV file or paste multiple lines to generate hundreds of barcodes at once, exported as a ZIP.',
  },
  {
    icon: Palette,
    title: 'Full Customization',
    description: 'Edit colors, dimensions, fonts, rotation, and DPI. Every barcode is tailored to your exact needs.',
  },
  {
    icon: Zap,
    title: 'Instant Preview',
    description: 'See your barcode update in real-time as you type. No waiting, no page reloads required.',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function HowToUse() {
  const { setActiveTab } = useBarcodeStore();

  return (
    <section id="how-to-use" className="max-w-5xl mx-auto px-4 lg:px-6 py-16">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-14"
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-4">
          <MousePointer size={12} /> HOW IT WORKS
        </span>
        <h2 className="text-3xl lg:text-4xl font-extrabold text-dark-800 dark:text-white mb-4">
          Generate Barcodes in{' '}
          <span className="gradient-text">4 Simple Steps</span>
        </h2>
        <p className="text-dark-400 max-w-2xl mx-auto">
          Create professional barcodes and QR codes in seconds. No sign-up required, completely free, and works right in your browser.
        </p>
      </motion.div>

      {/* Steps */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16"
      >
        {steps.map((step) => (
          <motion.div
            key={step.number}
            variants={item}
            className="glass-card p-6 group hover:shadow-glow transition-all duration-300 relative overflow-hidden"
          >
            {/* Step Number Watermark */}
            <span className="absolute top-3 right-4 text-6xl font-black text-gray-100 dark:text-dark-700/50 select-none pointer-events-none">
              {step.number}
            </span>

            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 shadow-lg ${step.shadowColor} group-hover:scale-110 transition-transform duration-300`}>
              <step.icon size={22} className="text-white" />
            </div>
            <h3 className="text-lg font-bold text-dark-800 dark:text-white mb-2 relative">
              {step.title}
            </h3>
            <p className="text-sm text-dark-400 leading-relaxed relative">
              {step.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Features Highlight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h3 className="text-2xl font-bold text-dark-800 dark:text-white mb-3">
          Powerful <span className="gradient-text">Features</span>
        </h3>
        <p className="text-dark-400 text-sm max-w-lg mx-auto">
          Everything you need for professional barcode generation, all in one tool.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
      >
        {features.map((feat, idx) => (
          <motion.div
            key={idx}
            variants={item}
            className="glass-card p-5 text-center group hover:shadow-glow transition-all duration-300"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
              <feat.icon size={20} className="text-primary-500" />
            </div>
            <h4 className="text-sm font-bold text-dark-800 dark:text-white mb-1.5">{feat.title}</h4>
            <p className="text-xs text-dark-400 leading-relaxed">{feat.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <button
          onClick={() => { setActiveTab('generator'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="btn-primary text-sm px-8"
        >
          Start Generating <ArrowRight size={16} />
        </button>
      </motion.div>
    </section>
  );
}
