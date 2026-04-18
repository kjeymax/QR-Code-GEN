import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DEFAULT_OPTIONS = {
  width: 2,
  height: 100,
  margin: 10,
  background: '#FFFFFF',
  foreground: '#000000',
  fontSize: 14,
  fontFamily: 'Inter',
  showText: true,
  rotation: 0,
  scale: 3,
  dpi: 150,
};

export const useBarcodeStore = create(
  persist(
    (set, get) => ({
      // Core state
      inputData: '',
      barcodeFormat: 'CODE128',
      inputMode: 'text',
      options: { ...DEFAULT_OPTIONS },

      // Smart input fields
      smartFields: {
        // vCard
        firstName: '', lastName: '', phone: '', email: '', org: '', title: '', url: '', address: '',
        // WiFi
        ssid: '', password: '', encryption: 'WPA', hidden: false,
        // Email
        emailTo: '', emailSubject: '', emailBody: '',
        // SMS
        smsPhone: '', smsMessage: '',
        // Phone
        phoneNumber: '',
      },

      // UI state
      activeTab: 'generator', // generator | batch | history
      sidebarOpen: true,
      theme: 'dark',

      // History
      history: [],

      // Batch
      batchItems: [],
      batchFormat: 'CODE128',

      // Error
      error: null,

      // Actions
      setInputData: (data) => set({ inputData: data, error: null }),
      setBarcodeFormat: (format) => set({ barcodeFormat: format, error: null }),
      setInputMode: (mode) => set({ inputMode: mode }),
      setOption: (key, value) => set((state) => ({
        options: { ...state.options, [key]: value }
      })),
      setOptions: (opts) => set((state) => ({
        options: { ...state.options, ...opts }
      })),
      setSmartField: (key, value) => set((state) => ({
        smartFields: { ...state.smartFields, [key]: value }
      })),
      resetOptions: () => set({ options: { ...DEFAULT_OPTIONS } }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setTheme: (theme) => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        set({ theme });
      },
      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark';
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
        set({ theme: newTheme });
      },
      setError: (error) => set({ error }),

      // History
      addToHistory: (item) => set((state) => ({
        history: [
          {
            ...item,
            id: Date.now(),
            timestamp: new Date().toISOString(),
          },
          ...state.history,
        ].slice(0, 100), // Keep last 100
      })),
      removeFromHistory: (id) => set((state) => ({
        history: state.history.filter(h => h.id !== id),
      })),
      clearHistory: () => set({ history: [] }),

      // Batch
      setBatchItems: (items) => set({ batchItems: items }),
      setBatchFormat: (format) => set({ batchFormat: format }),
      clearBatch: () => set({ batchItems: [] }),
    }),
    {
      name: 'barcodepro-storage',
      partialize: (state) => ({
        history: state.history,
        theme: state.theme,
        options: state.options,
      }),
    }
  )
);
