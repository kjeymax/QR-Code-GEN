import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub repository name
const repoName = 'QR-Code-generator-2';

export default defineConfig({
  plugins: [react()],
  base: `/${repoName}/`,
});
