import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'Is BarcodePro completely free to use?',
    answer: 'Yes, BarcodePro is 100% free with no hidden charges or subscriptions. You can generate unlimited barcodes and QR codes, download them in multiple formats (PNG, SVG, PDF, JPG), and use batch processing — all without creating an account.',
  },
  {
    question: 'What barcode formats are supported?',
    answer: 'We support 15+ barcode formats including: Code 128, Code 39, EAN-13, EAN-8, UPC-A, UPC-E, ITF-14, Code 93, Codabar, MSI Plessey, Pharmacode (1D barcodes), and QR Code, Data Matrix, PDF417, GS1-128 (2D barcodes). Each format has built-in validation to ensure your barcodes are scannable.',
  },
  {
    question: 'Can I generate QR codes for WiFi, vCard contacts, and emails?',
    answer: 'Absolutely! Use our Smart Input modes to easily create specialized QR codes. Simply switch to the WiFi, vCard, Email, SMS, or Phone tab in the input panel, fill in the fields, and generate. The tool automatically encodes the data in the correct format.',
  },
  {
    question: 'How does batch barcode generation work?',
    answer: 'Switch to the "Batch" tab in the header. You can either upload a CSV file with your data or paste multiple values (one per line). Select your desired barcode format and click "Generate All & Download ZIP". All barcodes will be generated instantly and packed into a downloadable ZIP file.',
  },
  {
    question: 'What image formats can I export barcodes in?',
    answer: 'BarcodePro supports four export formats: PNG (raster, best for web), SVG (vector, infinitely scalable), PDF (for print documents), and JPG (compressed raster). You can also choose DPI settings (72 for screen, 150 for standard, 300 for high-quality print).',
  },
  {
    question: 'What is the AI Smart Generator?',
    answer: 'The AI Smart Generator lets you describe what you need in plain English. For example, type "Create a QR code for my website https://example.com" and the AI will automatically detect the best format (QR Code) and extract the URL. It shows a confidence score and lets you apply the suggestion with one click.',
  },
  {
    question: 'Are my barcodes stored anywhere?',
    answer: 'Your barcode history is stored locally in your browser\'s storage only. We do not upload, store, or process your data on any server. Everything runs 100% client-side in your browser for maximum privacy and speed.',
  },
  {
    question: 'Can I customize the barcode appearance?',
    answer: 'Yes! You can customize bar width, height, margin, scale (for 2D codes), bar color, background color, font size, font family, text visibility, and rotation (0°, 90°, 180°, 270°). All changes are reflected in real-time in the preview.',
  },
  {
    question: 'Is there a limit to batch processing?',
    answer: 'There is no hard limit — you can process hundreds of barcodes in a single batch. However, browser performance may vary with very large batches (1000+). For best results, we recommend batches of 500 or fewer items.',
  },
  {
    question: 'How do I report a bug or suggest a feature?',
    answer: 'Click the orange bug icon (🐛) at the bottom-right corner of the page. You can submit bug reports, feature requests, and general feedback. Reports are sent directly to our development team. You can also email us at admin@edutechminds.com.',
  },
];

function FAQItem({ faq, index }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="border-b border-gray-100 dark:border-dark-700/50 last:border-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-start gap-4 py-5 text-left group"
        aria-expanded={isOpen}
      >
        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 flex items-center justify-center text-primary-500 text-xs font-bold mt-0.5 group-hover:scale-110 transition-transform">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="flex-1 text-sm font-semibold text-dark-700 dark:text-dark-200 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 mt-1"
        >
          <ChevronDown size={16} className="text-dark-400" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="pl-12 pb-5 text-sm text-dark-400 leading-relaxed">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="max-w-3xl mx-auto px-4 lg:px-6 py-16">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 mb-4">
          <HelpCircle size={12} /> FAQ
        </span>
        <h2 className="text-3xl lg:text-4xl font-extrabold text-dark-800 dark:text-white mb-4">
          Frequently Asked{' '}
          <span className="gradient-text">Questions</span>
        </h2>
        <p className="text-dark-400 max-w-lg mx-auto">
          Everything you need to know about BarcodePro. Can't find your answer? Contact us!
        </p>
      </motion.div>

      {/* FAQ List */}
      <div className="glass-card divide-y-0 overflow-hidden">
        <div className="px-6">
          {faqs.map((faq, i) => (
            <FAQItem key={i} faq={faq} index={i} />
          ))}
        </div>
      </div>

      {/* Contact CTA */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="text-center mt-8"
      >
        <p className="text-sm text-dark-400 mb-3">Still have questions?</p>
        <a
          href="mailto:admin@edutechminds.com"
          className="btn-secondary text-sm px-6 inline-flex"
        >
          Contact Us — admin@edutechminds.com
        </a>
      </motion.div>
    </section>
  );
}
