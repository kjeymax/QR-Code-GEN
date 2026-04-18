import React from 'react';
import { useBarcodeStore } from '../../stores/barcodeStore';
import { Sun, Moon, Menu, Zap, Globe, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header() {
  const { theme, toggleTheme, toggleSidebar, activeTab, setActiveTab } = useBarcodeStore();

  const tabs = [
    { id: 'generator', label: 'Generator', icon: '⚡' },
    { id: 'batch', label: 'Batch', icon: '📦' },
    { id: 'history', label: 'History', icon: '🕐' },
  ];

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-gray-200/50 dark:border-dark-700/50">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        {/* Left: Logo + Menu */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="btn-ghost p-2 lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>

          <a href="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-md shadow-primary-500/20">
              <Zap size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">
                <span className="gradient-text">Barcode</span>
                <span className="text-dark-800 dark:text-white">Pro</span>
              </h1>
              <p className="text-[10px] text-dark-400 font-medium leading-none hidden sm:block">
                by{' '}
                <span className="text-primary-500 font-semibold">EduTechMinds</span>
              </p>
            </div>
          </a>
        </div>

        {/* Center: Tabs */}
        <nav className="hidden md:flex items-center bg-gray-100 dark:bg-dark-800 rounded-xl p-1 gap-0.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`tab-btn relative ${activeTab === tab.id ? 'tab-btn-active' : ''}`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white dark:bg-dark-700 rounded-lg shadow-sm"
                  transition={{ type: 'spring', duration: 0.4 }}
                />
              )}
              <span className="relative flex items-center gap-1.5">
                <span className="text-sm">{tab.icon}</span>
                {tab.label}
              </span>
            </button>
          ))}

          {/* Info Dropdown Links */}
          <div className="relative ml-1 group">
            <button className="tab-btn flex items-center gap-1">
              <span className="text-sm">ℹ️</span> Info
              <ChevronDown size={12} className="opacity-50" />
            </button>
            <div className="absolute top-full right-0 mt-1 w-44 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="bg-white dark:bg-dark-800 rounded-xl shadow-soft-lg border border-gray-200 dark:border-dark-700 p-1.5 mt-1">
                {[
                  { label: 'How to Use', id: 'how-to-use' },
                  { label: 'FAQ', id: 'faq' },
                  { label: 'About', id: 'about' },
                ].map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollTo(link.id)}
                    className="w-full text-left px-3 py-2 text-sm text-dark-500 dark:text-dark-400 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
                <hr className="my-1 border-gray-100 dark:border-dark-700" />
                <a
                  href="https://www.edutechminds.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-dark-500 dark:text-dark-400 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors no-underline"
                >
                  <Globe size={14} />
                  EduTechMinds
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="btn-ghost p-2.5 rounded-xl"
            aria-label="Toggle theme"
          >
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {theme === 'dark' ? (
                <Sun size={18} className="text-amber-400" />
              ) : (
                <Moon size={18} className="text-dark-500" />
              )}
            </motion.div>
          </button>

          <a
            href="https://www.edutechminds.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost p-2.5 rounded-xl hidden sm:flex"
            aria-label="EduTechMinds"
            title="Visit EduTechMinds"
          >
            <Globe size={18} />
          </a>
        </div>
      </div>

      {/* Mobile Tabs */}
      <nav className="md:hidden flex items-center px-4 pb-2 gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`flex-1 tab-btn text-center text-xs whitespace-nowrap ${activeTab === tab.id ? 'tab-btn-active bg-white dark:bg-dark-700 shadow-sm' : ''}`}
          >
            <span className="text-sm mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
        <button
          onClick={() => {
            const el = document.getElementById('how-to-use');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex-shrink-0 tab-btn text-center text-xs whitespace-nowrap"
        >
          <span className="text-sm mr-1">ℹ️</span>
          Info
        </button>
      </nav>
    </header>
  );
}
