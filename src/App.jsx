import React, { useEffect, lazy, Suspense } from 'react';
import { useBarcodeStore } from './stores/barcodeStore';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import BarcodePreview from './components/generator/BarcodePreview';
import InputPanel from './components/generator/InputPanel';
import DownloadPanel from './components/export/DownloadPanel';
import ReportBug from './components/feedback/ReportBug';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// Lazy load non-critical pages
const BatchGenerator = lazy(() => import('./components/batch/BatchGenerator'));
const HistoryPanel = lazy(() => import('./components/history/HistoryPanel'));
const HowToUse = lazy(() => import('./components/pages/HowToUse'));
const FAQ = lazy(() => import('./components/pages/FAQ'));
const About = lazy(() => import('./components/pages/About'));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={24} className="animate-spin text-primary-500" />
    </div>
  );
}

function GeneratorPage() {
  return (
    <div className="flex-1 p-4 lg:p-6 space-y-6 overflow-y-auto">
      {/* Preview Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card p-6"
      >
        <BarcodePreview />
      </motion.div>

      {/* Input Panel */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="glass-card p-5"
      >
        <InputPanel />
      </motion.div>

      {/* Download Panel */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <DownloadPanel />
      </motion.div>
    </div>
  );
}

export default function App() {
  const { theme, activeTab, sidebarOpen, toggleSidebar } = useBarcodeStore();

  // Initialize theme on mount
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Header />

      <div className="flex-1 flex relative">
        {/* Sidebar - only show on generator tab */}
        {activeTab === 'generator' && (
          <>
            <Sidebar />
            {/* Mobile backdrop */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black/30 z-30 lg:hidden"
                onClick={toggleSidebar}
              />
            )}
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)] overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === 'generator' && (
              <motion.div
                key="generator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <GeneratorPage />
              </motion.div>
            )}
            {activeTab === 'batch' && (
              <motion.div
                key="batch"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="p-4 lg:p-6"
              >
                <Suspense fallback={<LoadingFallback />}>
                  <BatchGenerator />
                </Suspense>
              </motion.div>
            )}
            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="p-4 lg:p-6"
              >
                <Suspense fallback={<LoadingFallback />}>
                  <HistoryPanel />
                </Suspense>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Content Sections — below the tool area */}
      <div className="w-full">
        {/* Divider with gradient */}
        <div className="relative h-px">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />
        </div>

        <Suspense fallback={<LoadingFallback />}>
          <HowToUse />
        </Suspense>

        <div className="relative h-px mx-auto max-w-4xl">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-dark-300/20 dark:via-dark-600/30 to-transparent" />
        </div>

        <Suspense fallback={<LoadingFallback />}>
          <FAQ />
        </Suspense>

        <div className="relative h-px mx-auto max-w-4xl">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-dark-300/20 dark:via-dark-600/30 to-transparent" />
        </div>

        <Suspense fallback={<LoadingFallback />}>
          <About />
        </Suspense>
      </div>

      {/* Footer */}
      <Footer />

      {/* Floating Report Bug Button */}
      <ReportBug />
    </div>
  );
}
