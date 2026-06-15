import React, { useState, useCallback } from 'react';
import { useBarcodeStore } from '../../stores/barcodeStore';
import {
  exportAsPNG, exportAsJPG, exportAsSVG, exportAsPDF,
  copyToClipboard, copyTextToClipboard, generateEmbedCode, generateShareLink
} from '../../utils/exportEngine';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download, Image, FileText, Code2, Copy, Check,
  FileImage, FileCode, Share2, ChevronDown, AlertTriangle
} from 'lucide-react';

export default function DownloadPanel() {
  const { inputData, barcodeFormat, options, addToHistory, barcodeReady } = useBarcodeStore();
  const [copiedState, setCopiedState] = useState(null); // 'image' | 'embed' | 'link' | null
  const [embedCode, setEmbedCode] = useState('');
  const [showEmbed, setShowEmbed] = useState(false);
  const [dpi, setDpi] = useState(150);
  const [downloadStatus, setDownloadStatus] = useState(null); // 'success' | 'error' | null

  const getCanvas = () => window.__barcodeCanvas;

  /**
   * Manual save fallback — right-click "Save image as..." alternative.
   * Opens the barcode in a new tab where the user can save it manually.
   */
  const handleManualSave = useCallback(() => {
    const canvas = getCanvas();
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const w = window.open('');
    if (w) {
      w.document.write(`
        <html><head><title>Barcode - Right-click to Save</title></head>
        <body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f3f4f6;">
          <div style="text-align:center;">
            <p style="font-family:system-ui;color:#666;margin-bottom:16px;">Right-click the image → <b>Save image as...</b></p>
            <img src="${dataUrl}" style="max-width:90vw;image-rendering:pixelated;border:1px solid #ddd;border-radius:8px;padding:16px;background:white;" />
          </div>
        </body></html>
      `);
      w.document.close();
    }
  }, []);

  const handleExport = useCallback(async (format) => {
    const canvas = getCanvas();
    if (!canvas || !inputData || !barcodeReady) return;

    const filename = `barcode_${barcodeFormat}_${Date.now()}`;

    try {
      switch (format) {
        case 'png':
          exportAsPNG(canvas, filename, dpi);
          break;
        case 'jpg':
          exportAsJPG(canvas, filename, 0.95);
          break;
        case 'svg':
          await exportAsSVG(inputData, barcodeFormat, options, filename);
          break;
        case 'pdf':
          exportAsPDF(canvas, filename);
          break;
      }

      // Show success status briefly
      setDownloadStatus('success');
      setTimeout(() => setDownloadStatus(null), 3000);
    } catch (e) {
      console.error('[DownloadPanel] Export error:', e);
      setDownloadStatus('error');
      setTimeout(() => setDownloadStatus(null), 5000);
    }

    // Save to history
    try {
      addToHistory({
        data: inputData,
        format: barcodeFormat,
        options: { ...options },
        exportFormat: format,
        thumbnail: canvas.toDataURL('image/png', 0.3),
      });
    } catch (e) {
      console.error('[DownloadPanel] addToHistory error:', e);
    }
  }, [inputData, barcodeFormat, options, dpi, addToHistory, barcodeReady]);

  const handleCopyImage = async () => {
    const canvas = getCanvas();
    if (!canvas || !barcodeReady) return;
    const result = await copyToClipboard(canvas);
    if (result) {
      setCopiedState('image');
      setTimeout(() => setCopiedState(null), 2000);
    } else {
      // Show error feedback
      setDownloadStatus('error');
      setTimeout(() => setDownloadStatus(null), 3000);
    }
  };

  const handleCopyEmbed = async () => {
    const canvas = getCanvas();
    if (!canvas) return;
    const code = generateEmbedCode(canvas);
    const success = await copyTextToClipboard(code);
    if (success) {
      setEmbedCode(code);
      setCopiedState('embed');
      setTimeout(() => setCopiedState(null), 2000);
    }
  };

  const handleCopyLink = async () => {
    const link = generateShareLink(inputData, barcodeFormat, options);
    const success = await copyTextToClipboard(link);
    if (success) {
      setCopiedState('link');
      setTimeout(() => setCopiedState(null), 2000);
    }
  };

  const isDisabled = !inputData || !barcodeReady;

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

      {/* Download Status Toast */}
      <AnimatePresence>
        {downloadStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400 text-xs"
          >
            <Check size={14} />
            <span>Download started! Check your downloads folder.</span>
          </motion.div>
        )}
        {downloadStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 text-amber-600 dark:text-amber-400 text-xs"
          >
            <AlertTriangle size={14} />
            <span>Download may be blocked by an ad-blocker.</span>
            <button
              onClick={handleManualSave}
              className="ml-auto underline font-medium hover:text-amber-700 dark:hover:text-amber-300"
            >
              Save manually
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Manual save fallback link */}
      {!isDisabled && (
        <button
          onClick={handleManualSave}
          className="w-full text-[11px] text-dark-400 hover:text-primary-500 transition-colors py-1"
        >
          Download blocked? Click here to save manually →
        </button>
      )}

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
                {embedCode || (() => {
                  try {
                    const c = getCanvas();
                    return c ? generateEmbedCode(c) : '';
                  } catch { return ''; }
                })()}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
