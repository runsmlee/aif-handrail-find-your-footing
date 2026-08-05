/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ command }) => ({
  plugins: [
    // In build mode, the react plugin automatically skips Fast Refresh
    // (apply: "serve" on refresh wrapper + skipFastRefresh guard).
    // We pass no options — defaults are correct for production.
    react(),
    tailwindcss(),
  ],
  // Explicitly define process.env.NODE_ENV to prevent any development-mode
  // code paths from activating in production builds. This addresses the
  // root cause of the $RefreshSig$ production error: if NODE_ENV isn't
  // "production" at build time, React's development runtime can leak in.
  define: command === 'build'
    ? { 'process.env.NODE_ENV': JSON.stringify('production') }
    : {},
  build: {
    // Ensure production mode is never ambiguous
    mode: 'production',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/__tests__/setup.ts',
    css: false,
  },
}));
