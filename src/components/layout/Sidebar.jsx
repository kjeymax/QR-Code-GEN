import React, { useState } from 'react';
import { useBarcodeStore } from '../../stores/barcodeStore';
import { BARCODE_FORMATS, FORMAT_LIST, FORMAT_CATEGORIES } from '../../utils/barcodeEngine';
import { INPUT_MODES } from '../../utils/smartInput';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, ChevronRight, Search, SlidersHorizontal,
  Palette, Type, RotateCw, Maximize2, Settings2
} from 'lucide-react';

function CollapsibleSection({ title, icon: Icon, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 dark:border-dark-700/50 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-700/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon size={14} className="text-primary-500" />}
          <span className="text-xs font-semibold uppercase tracking-wider text-dark-500 dark:text-dark-400">
            {title}
          </span>
        </div>
        <motion.div animate={{ rotate: open ? 0 : -90 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} className="text-dark-400" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Sidebar() {
  const {
    barcodeFormat, setBarcodeFormat,
    inputMode, setInputMode,
    options, setOption, resetOptions,
    sidebarOpen,
  } = useBarcodeStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredFormats = FORMAT_LIST.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || f.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <aside
      className={`
        fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)]
        w-80 lg:w-[320px] overflow-y-auto
        glass-panel border-r border-gray-200/50 dark:border-dark-700/50
        transition-transform duration-300 ease-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      {/* Format Selector */}
      <CollapsibleSection title="Barcode Format" icon={Settings2} defaultOpen={true}>
        {/* Search */}
        <div className="relative mb-3">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
          <input
            type="text"
            placeholder="Search formats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-9 py-2 text-sm"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-1.5 mb-3">
          {FORMAT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all duration-200 ${
                categoryFilter === cat
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-dark-700 text-dark-500 dark:text-dark-400 hover:bg-gray-200 dark:hover:bg-dark-600'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>

        {/* Format Grid */}
        <div className="grid grid-cols-2 gap-1.5 max-h-[400px] overflow-y-auto pr-1">
          {filteredFormats.map((fmt) => (
            <button
              key={fmt.id}
              onClick={() => setBarcodeFormat(fmt.id)}
              className={`text-left p-2.5 rounded-xl transition-all duration-200 border ${
                barcodeFormat === fmt.id
                  ? 'format-chip-active bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-600 ring-1 ring-primary-500/20'
                  : 'bg-gray-50 dark:bg-dark-700/50 border-gray-200 dark:border-dark-600 hover:border-primary-300 dark:hover:border-primary-600'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-xs opacity-60">{fmt.icon}</span>
                <span className="text-xs font-semibold text-dark-700 dark:text-dark-200 truncate">
                  {fmt.name}
                </span>
              </div>
              <p className="text-[10px] text-dark-400 truncate">{fmt.description}</p>
            </button>
          ))}
        </div>
      </CollapsibleSection>

      {/* Size Controls */}
      <CollapsibleSection title="Dimensions" icon={Maximize2}>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-dark-600 dark:text-dark-300">
                Bar Width
              </label>
              <span className="text-xs font-mono text-primary-500">{options.width}px</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              step={0.5}
              value={options.width}
              onChange={(e) => setOption('width', parseFloat(e.target.value))}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-dark-600 dark:text-dark-300">
                Height
              </label>
              <span className="text-xs font-mono text-primary-500">{options.height}px</span>
            </div>
            <input
              type="range"
              min={30}
              max={300}
              step={5}
              value={options.height}
              onChange={(e) => setOption('height', parseInt(e.target.value))}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-dark-600 dark:text-dark-300">
                Margin
              </label>
              <span className="text-xs font-mono text-primary-500">{options.margin}px</span>
            </div>
            <input
              type="range"
              min={0}
              max={50}
              step={2}
              value={options.margin}
              onChange={(e) => setOption('margin', parseInt(e.target.value))}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-dark-600 dark:text-dark-300">
                Scale (2D)
              </label>
              <span className="text-xs font-mono text-primary-500">{options.scale}x</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={options.scale}
              onChange={(e) => setOption('scale', parseInt(e.target.value))}
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Color Controls */}
      <CollapsibleSection title="Colors" icon={Palette} defaultOpen={true}>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={options.foreground}
              onChange={(e) => setOption('foreground', e.target.value)}
              className="flex-shrink-0"
            />
            <div className="flex-1">
              <label className="text-xs font-medium text-dark-600 dark:text-dark-300">
                Bar Color
              </label>
              <p className="text-[10px] font-mono text-dark-400">{options.foreground}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="color"
              value={options.background}
              onChange={(e) => setOption('background', e.target.value)}
              className="flex-shrink-0"
            />
            <div className="flex-1">
              <label className="text-xs font-medium text-dark-600 dark:text-dark-300">
                Background
              </label>
              <p className="text-[10px] font-mono text-dark-400">{options.background}</p>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Text Controls */}
      <CollapsibleSection title="Text" icon={Type} defaultOpen={false}>
        <div className="space-y-3">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={options.showText}
                onChange={(e) => setOption('showText', e.target.checked)}
                className="sr-only"
              />
              <div className={`w-9 h-5 rounded-full transition-colors duration-200 ${
                options.showText ? 'bg-primary-500' : 'bg-gray-300 dark:bg-dark-600'
              }`}>
                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 mt-0.5 ${
                  options.showText ? 'translate-x-4.5 ml-[18px]' : 'translate-x-0.5 ml-[2px]'
                }`} />
              </div>
            </div>
            <span className="text-xs font-medium text-dark-600 dark:text-dark-300">
              Show human-readable text
            </span>
          </label>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-dark-600 dark:text-dark-300">
                Font Size
              </label>
              <span className="text-xs font-mono text-primary-500">{options.fontSize}px</span>
            </div>
            <input
              type="range"
              min={8}
              max={24}
              step={1}
              value={options.fontSize}
              onChange={(e) => setOption('fontSize', parseInt(e.target.value))}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-dark-600 dark:text-dark-300 mb-1.5 block">
              Font Family
            </label>
            <select
              value={options.fontFamily}
              onChange={(e) => setOption('fontFamily', e.target.value)}
              className="input-field py-2 text-sm"
            >
              <option value="Inter">Inter</option>
              <option value="monospace">Monospace</option>
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Courier">Courier</option>
            </select>
          </div>
        </div>
      </CollapsibleSection>

      {/* Rotation */}
      <CollapsibleSection title="Rotation" icon={RotateCw} defaultOpen={false}>
        <div className="grid grid-cols-4 gap-2">
          {[0, 90, 180, 270].map((deg) => (
            <button
              key={deg}
              onClick={() => setOption('rotation', deg)}
              className={`py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
                options.rotation === deg
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-dark-700 text-dark-500 dark:text-dark-400 hover:bg-gray-200 dark:hover:bg-dark-600'
              }`}
            >
              {deg}°
            </button>
          ))}
        </div>
      </CollapsibleSection>

      {/* Reset */}
      <div className="p-4">
        <button
          onClick={resetOptions}
          className="w-full btn-ghost text-xs text-dark-400 hover:text-red-500 dark:hover:text-red-400"
        >
          Reset to Defaults
        </button>
      </div>
    </aside>
  );
}
