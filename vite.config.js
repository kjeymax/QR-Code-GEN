import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Use /QR-Code-generator-2/ for GitHub Pages, / for Vercel or other hosts
const base = process.env.GITHUB_PAGES === 'true' ? '/QR-Code-generator-2/' : '/';

export default defineConfig({
  plugins: [react()],
  base,
});
