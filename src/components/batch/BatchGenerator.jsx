import React, { useRef, useState, useCallback } from 'react';
import { useBarcodeStore } from '../../stores/barcodeStore';
import { generateBarcode, BARCODE_FORMATS, FORMAT_LIST } from '../../utils/barcodeEngine';
import { motion, AnimatePresence } from 'framer-motion';
import Papa from 'papaparse';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import {
  Upload, FileSpreadsheet, Download, Trash2, Play, Loader2,
  CheckCircle2, AlertCircle, X, Package
} from 'lucide-react';

export default function BatchGenerator() {
  const { batchItems, setBatchItems, batchFormat, setBatchFormat, clearBatch } = useBarcodeStore();
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [manualInput, setManualInput] = useState('');

  const handleFileUpload = (file) => {
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Try to find a 'data' or first column
        const headers = results.meta.fields || [];
        const dataKey = headers.find(h =>
          ['data', 'barcode', 'code', 'value', 'text', 'id', 'sku', 'product'].includes(h.toLowerCase())
        ) || headers[0];

        if (!dataKey) return;

        const items = results.data
          .map((row, idx) => ({
            id: idx,
            data: row[dataKey]?.toString().trim(),
            status: 'pending', // pending | success | error
            label: row['label'] || row['name'] || row['description'] || '',
          }))
          .filter(item => item.data);

        setBatchItems(items);
      },
      error: (err) => {
        console.error('CSV parse error:', err);
      }
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      handleFileUpload(file);
    }
  };

  const handleManualAdd = () => {
    if (!manualInput.trim()) return;
    const lines = manualInput.split('\n').filter(l => l.trim());
    const newItems = lines.map((line, idx) => ({
      id: Date.now() + idx,
      data: line.trim(),
      status: 'pending',
      label: '',
    }));
    setBatchItems([...batchItems, ...newItems]);
    setManualInput('');
  };

  const removeItem = (id) => {
    setBatchItems(batchItems.filter(item => item.id !== id));
  };

  const generateAll = async () => {
    if (batchItems.length === 0) return;

    setIsProcessing(true);
    setProgress(0);

    const zip = new JSZip();
    const updatedItems = [...batchItems];

    for (let i = 0; i < updatedItems.length; i++) {
      const item = updatedItems[i];
      try {
        const canvas = document.createElement('canvas');
        await generateBarcode(canvas, item.data, batchFormat, {
          width: 2, height: 100, margin: 10,
          background: '#FFFFFF', foreground: '#000000',
          fontSize: 14, showText: true, scale: 3,
        });

        const blob = await new Promise((resolve) =>
          canvas.toBlob(resolve, 'image/png')
        );

        if (blob) {
          const filename = item.label
            ? `${item.label.replace(/[^a-z0-9]/gi, '_')}_${i + 1}.png`
            : `barcode_${i + 1}.png`;
          zip.file(filename, blob);
          updatedItems[i] = { ...item, status: 'success' };
        }
      } catch (err) {
        updatedItems[i] = { ...item, status: 'error', error: err.message };
      }

      setProgress(Math.round(((i + 1) / updatedItems.length) * 100));
      setBatchItems([...updatedItems]);

      // Small delay to allow UI updates
      await new Promise((r) => setTimeout(r, 20));
    }

    // Generate ZIP
    try {
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `barcodes_batch_${Date.now()}.zip`);
    } catch (err) {
      console.error('ZIP generation error:', err);
    }

    setIsProcessing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-dark-800 dark:text-white mb-2">
          Batch <span className="gradient-text">Generator</span>
        </h2>
        <p className="text-sm text-dark-400">
          Upload CSV or paste data to generate hundreds of barcodes at once
        </p>
      </div>

      {/* Format Selector */}
      <div className="glass-card p-4">
        <label className="label-text">Batch Format</label>
        <select
          value={batchFormat}
          onChange={(e) => setBatchFormat(e.target.value)}
          className="input-field text-sm"
        >
          {FORMAT_LIST.map(fmt => (
            <option key={fmt.id} value={fmt.id}>
              {fmt.name} — {fmt.description}
            </option>
          ))}
        </select>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`glass-card p-8 text-center cursor-pointer transition-all duration-300 border-2 border-dashed ${
          dragOver
            ? 'border-primary-400 bg-primary-50/50 dark:bg-primary-900/10'
            : 'border-gray-200 dark:border-dark-600 hover:border-primary-300 dark:hover:border-primary-600'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={(e) => handleFileUpload(e.target.files[0])}
          className="hidden"
        />
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 flex items-center justify-center">
          <Upload size={24} className="text-primary-500" />
        </div>
        <p className="text-sm font-medium text-dark-600 dark:text-dark-300 mb-1">
          Drop CSV file here or click to browse
        </p>
        <p className="text-xs text-dark-400">
          First column should contain barcode data
        </p>
      </div>

      {/* Manual Input */}
      <div className="glass-card p-4">
        <label className="label-text">Or paste data (one per line)</label>
        <textarea
          value={manualInput}
          onChange={(e) => setManualInput(e.target.value)}
          placeholder={"12345\n67890\nABC-001\nXYZ-002"}
          rows={4}
          className="input-field text-sm resize-none font-mono"
        />
        <button
          onClick={handleManualAdd}
          disabled={!manualInput.trim()}
          className="btn-secondary text-sm mt-3 disabled:opacity-40"
        >
          <FileSpreadsheet size={14} /> Add to Batch
        </button>
      </div>

      {/* Items List */}
      {batchItems.length > 0 && (
        <div className="glass-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-dark-700">
            <div className="flex items-center gap-2">
              <Package size={16} className="text-primary-500" />
              <span className="text-sm font-semibold text-dark-700 dark:text-dark-200">
                {batchItems.length} items
              </span>
              <span className="text-xs text-dark-400">
                ({batchItems.filter(i => i.status === 'success').length} done)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={clearBatch} className="btn-ghost text-xs text-red-500 hover:text-red-600">
                <Trash2 size={14} /> Clear
              </button>
            </div>
          </div>

          <div className="max-h-[300px] overflow-y-auto">
            {batchItems.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center gap-3 px-4 py-2 border-b border-gray-50 dark:border-dark-700/50 last:border-0"
              >
                <span className="text-xs text-dark-400 w-8 text-right">{idx + 1}</span>
                <span className="flex-1 text-sm font-mono text-dark-600 dark:text-dark-300 truncate">
                  {item.data}
                </span>
                {item.label && (
                  <span className="text-xs text-dark-400 truncate max-w-[120px]">{item.label}</span>
                )}
                <div className="flex items-center gap-1">
                  {item.status === 'success' && <CheckCircle2 size={14} className="text-emerald-500" />}
                  {item.status === 'error' && <AlertCircle size={14} className="text-red-500" />}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-dark-700 rounded"
                  >
                    <X size={12} className="text-dark-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          {isProcessing && (
            <div className="px-4 py-3 border-t border-gray-100 dark:border-dark-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-dark-500">Processing...</span>
                <span className="text-xs font-mono text-primary-500">{progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 dark:bg-dark-600 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          {/* Generate Button */}
          <div className="px-4 py-3 border-t border-gray-100 dark:border-dark-700">
            <button
              onClick={generateAll}
              disabled={isProcessing || batchItems.length === 0}
              className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Processing {progress}%...
                </>
              ) : (
                <>
                  <Play size={16} />
                  Generate All & Download ZIP
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
