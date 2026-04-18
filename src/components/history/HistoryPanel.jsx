import React, { useState } from 'react';
import { useBarcodeStore } from '../../stores/barcodeStore';
import { BARCODE_FORMATS } from '../../utils/barcodeEngine';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, Download, Trash2, RotateCcw, Search, X, Image
} from 'lucide-react';

export default function HistoryPanel() {
  const {
    history, removeFromHistory, clearHistory,
    setInputData, setBarcodeFormat, setOptions
  } = useBarcodeStore();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = history.filter(item =>
    item.data?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    BARCODE_FORMATS[item.format]?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const restoreItem = (item) => {
    setInputData(item.data);
    setBarcodeFormat(item.format);
    if (item.options) setOptions(item.options);
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-dark-800 dark:text-white mb-2">
          Barcode <span className="gradient-text">History</span>
        </h2>
        <p className="text-sm text-dark-400">
          Your recently generated barcodes, saved locally
        </p>
      </div>

      {/* Search & Actions */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
          <input
            type="text"
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-9 text-sm"
          />
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="btn-ghost text-xs text-red-500 hover:text-red-600 border border-red-200 dark:border-red-800/30 rounded-xl px-4 py-2.5"
          >
            <Trash2 size={14} /> Clear All
          </button>
        )}
      </div>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 flex items-center justify-center">
            <Clock size={24} className="text-primary-500" />
          </div>
          <p className="text-dark-400 text-sm font-medium">
            {history.length === 0 ? 'No barcodes generated yet' : 'No results found'}
          </p>
          <p className="text-dark-300 dark:text-dark-500 text-xs mt-1">
            Generated barcodes will appear here
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredHistory.map((item, idx) => {
              const formatDef = BARCODE_FORMATS[item.format];
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className="glass-card p-4 group hover:shadow-glow transition-all duration-300"
                >
                  {/* Thumbnail */}
                  {item.thumbnail && (
                    <div className="w-full h-24 rounded-xl bg-white dark:bg-dark-700 mb-3 flex items-center justify-center overflow-hidden border border-gray-100 dark:border-dark-600">
                      <img
                        src={item.thumbnail}
                        alt="Barcode"
                        className="max-w-full max-h-full object-contain"
                        style={{ imageRendering: 'pixelated' }}
                      />
                    </div>
                  )}

                  {/* Info */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${
                        formatDef?.category === '2D'
                          ? 'bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300'
                          : 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      }`}>
                        {formatDef?.name || item.format}
                      </span>
                      <span className="text-[10px] text-dark-400">
                        {formatDate(item.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm font-mono text-dark-600 dark:text-dark-300 truncate">
                      {item.data}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => restoreItem(item)}
                      className="flex-1 btn-ghost text-xs border border-gray-200 dark:border-dark-600 rounded-lg py-1.5"
                    >
                      <RotateCcw size={12} /> Restore
                    </button>
                    <button
                      onClick={() => removeFromHistory(item.id)}
                      className="btn-ghost text-xs text-red-500 border border-red-200 dark:border-red-800/30 rounded-lg py-1.5 px-3"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
