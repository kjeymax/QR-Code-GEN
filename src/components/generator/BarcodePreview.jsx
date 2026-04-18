import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useBarcodeStore } from '../../stores/barcodeStore';
import { generateBarcode, BARCODE_FORMATS, validateInput } from '../../utils/barcodeEngine';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function BarcodePreview() {
  const canvasRef = useRef(null);
  const { inputData, barcodeFormat, options, setError, error } = useBarcodeStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const debounceTimer = useRef(null);

  // Store canvas ref globally for export
  useEffect(() => {
    window.__barcodeCanvas = canvasRef.current;
    return () => { window.__barcodeCanvas = null; };
  }, []);

  const renderBarcode = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !inputData) {
      if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = 400;
        canvas.height = 200;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      setIsValid(false);
      return;
    }

    const validation = validateInput(inputData, barcodeFormat);
    if (!validation.valid) {
      setError(validation.error);
      setIsValid(false);
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      await generateBarcode(canvas, inputData, barcodeFormat, options);
      setIsValid(true);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to generate barcode');
      setIsValid(false);
    } finally {
      setIsGenerating(false);
    }
  }, [inputData, barcodeFormat, options, setError]);

  // Debounced rendering
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(renderBarcode, 150);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [renderBarcode]);

  const formatDef = BARCODE_FORMATS[barcodeFormat];

  return (
    <div className="flex flex-col items-center w-full">
      {/* Status Badge */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 px-4 py-2 mb-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 text-sm"
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </motion.div>
        )}
        {isValid && !error && inputData && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 px-4 py-2 mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400 text-sm"
          >
            <CheckCircle2 size={16} />
            <span>
              {formatDef?.name} generated successfully
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Area */}
      <div className="preview-area w-full p-8 relative overflow-hidden">
        {/* Grid pattern background */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        {isGenerating && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-dark-800/50 z-10 backdrop-blur-[1px]">
            <Loader2 size={24} className="animate-spin text-primary-500" />
          </div>
        )}

        {!inputData && !isGenerating && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-dark-400 dark:text-dark-400 text-sm font-medium">
              Enter data below to preview your barcode
            </p>
            <p className="text-dark-300 dark:text-dark-500 text-xs mt-1">
              Supports 15+ barcode formats
            </p>
          </div>
        )}

        <motion.div
          key={barcodeFormat}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center"
          style={{
            transform: `rotate(${options.rotation}deg)`,
            transition: 'transform 0.3s ease',
          }}
        >
          <canvas
            ref={canvasRef}
            className={`max-w-full h-auto ${!inputData ? 'hidden' : ''}`}
            style={{ imageRendering: 'pixelated' }}
          />
        </motion.div>
      </div>

      {/* Format Info */}
      {formatDef && (
        <div className="mt-3 flex items-center gap-2">
          <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-md ${
            formatDef.category === '2D'
              ? 'bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300'
              : 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
          }`}>
            {formatDef.category}
          </span>
          <span className="text-xs text-dark-400">{formatDef.name}</span>
          <span className="text-xs text-dark-300 dark:text-dark-500">•</span>
          <span className="text-xs text-dark-300 dark:text-dark-500">{formatDef.description}</span>
        </div>
      )}
    </div>
  );
}
