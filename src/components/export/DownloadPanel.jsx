import React, { useState, useCallback } from 'react';
import { useBarcodeStore } from '../../stores/barcodeStore';
import {
  exportAsPNG, exportAsJPG, exportAsSVG, exportAsPDF,
  copyToClipboard, generateEmbedCode, generateShareLink
} from '../../utils/exportEngine';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download, Image, FileText, Code2, Copy, Link2, Check,
  FileImage, FileCode, Share2, ChevronDown
} from 'lucide-react';

export default function DownloadPanel() {
  const { inputData, barcodeFormat, options, addToHistory } = useBarcodeStore();
  const [copiedState, setCopiedState] = useState(null); // 'image' | 'embed' | 'link' | null
  const [embedCode, setEmbedCode] = useState('');
  const [showEmbed, setShowEmbed] = useState(false);
  const [dpi, setDpi] = useState(150);

  const getCanvas = () => window.__barcodeCanvas;

  const handleExport = useCallback((format) => {
    const canvas = getCanvas();
    if (!canvas || !inputData) return;

    const filename = `barcode_${barcodeFormat}_${Date.now()}`;

    switch (format) {
      case 'png':
        exportAsPNG(canvas, filename, dpi);
        break;
      case 'jpg':
        exportAsJPG(canvas, filename, 0.95);
        break;
      case 'svg':
        exportAsSVG(inputData, barcodeFormat, options, filename);
        break;
      case 'pdf':
        exportAsPDF(canvas, filename);
        break;
    }

    // Save to history
    addToHistory({
      data: inputData,
      format: barcodeFormat,
      options: { ...options },
      exportFormat: format,
      thumbnail: canvas.toDataURL('image/png', 0.3),
    });
  }, [inputData, barcodeFormat, options, dpi, addToHistory]);

  const handleCopyImage = async () => {
    const canvas = getCanvas();
    if (!canvas) return;
    const success = await copyToClipboard(canvas);
    if (success) {
      setCopiedState('image');
      setTimeout(() => setCopiedState(null), 2000);
    }
  };

  const handleCopyEmbed = () => {
    const canvas = getCanvas();
    if (!canvas) return;
    const code = generateEmbedCode(canvas);
    navigator.clipboard.writeText(code);
    setEmbedCode(code);
    setCopiedState('embed');
    setTimeout(() => setCopiedState(null), 2000);
  };

  const handleCopyLink = () => {
    const link = generateShareLink(inputData, barcodeFormat, options);
    navigator.clipboard.writeText(link);
    setCopiedState('link');
    setTimeout(() => setCopiedState(null), 2000);
  };

  const isDisabled = !inputData;

  return (
    <div className="glass-card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="section-title mb-0">Export & Download</h3>
        <div className="flex items-center gap-2">
          <label className="text-xs text-dark-400">DPI:</label>
          <select
            value={dpi}
            onChange={(e) => setDpi(parseInt(e.target.value))}
            className="text-xs bg-gray-100 dark:bg-dark-700 rounded-lg px-2 py-1 border-none outline-none text-dark-600 dark:text-dark-300"
          >
            <option value={72}>72 (Screen)</option>
            <option value={150}>150 (Standard)</option>
            <option value={300}>300 (Print)</option>
          </select>
        </div>
      </div>

      {/* Download Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => handleExport('png')}
          disabled={isDisabled}
          className="btn-primary text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
        >
          <Image size={15} /> PNG
        </button>
        <button
          onClick={() => handleExport('svg')}
          disabled={isDisabled}
          className="btn-accent text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
        >
          <FileCode size={15} /> SVG
        </button>
        <button
          onClick={() => handleExport('pdf')}
          disabled={isDisabled}
          className="btn-secondary text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <FileText size={15} /> PDF
        </button>
        <button
          onClick={() => handleExport('jpg')}
          disabled={isDisabled}
          className="btn-secondary text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <FileImage size={15} /> JPG
        </button>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleCopyImage}
          disabled={isDisabled}
          className="flex-1 btn-ghost text-xs border border-gray-200 dark:border-dark-600 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {copiedState === 'image' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          {copiedState === 'image' ? 'Copied!' : 'Copy Image'}
        </button>
        <button
          onClick={handleCopyLink}
          disabled={isDisabled}
          className="flex-1 btn-ghost text-xs border border-gray-200 dark:border-dark-600 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {copiedState === 'link' ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
          {copiedState === 'link' ? 'Copied!' : 'Share Link'}
        </button>
      </div>

      {/* Embed Code */}
      <button
        onClick={() => setShowEmbed(!showEmbed)}
        disabled={isDisabled}
        className="w-full btn-ghost text-xs border border-gray-200 dark:border-dark-600 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Code2 size={14} />
        Embed Code
        <ChevronDown size={12} className={`ml-auto transition-transform ${showEmbed ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {showEmbed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-dark-700/50 border border-gray-200 dark:border-dark-600">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-dark-500 dark:text-dark-400">HTML Embed</span>
                <button
                  onClick={handleCopyEmbed}
                  className="text-xs text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1"
                >
                  {copiedState === 'embed' ? <Check size={12} /> : <Copy size={12} />}
                  {copiedState === 'embed' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="text-[10px] font-mono text-dark-500 dark:text-dark-400 overflow-x-auto whitespace-pre-wrap break-all">
                {embedCode || generateEmbedCode(getCanvas())}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
