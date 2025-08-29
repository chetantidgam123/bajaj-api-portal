import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import eslint from 'vite-plugin-eslint'
export default defineConfig({
  base: '/',
  build: {
    outDir: 'build'
  },
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-macros'],
      },
    }),
    // eslint({
    //   include: ['src/**/*.js', 'src/**/*.jsx', 'src/**/*.ts', 'src/**/*.tsx'], // adjust if needed
    //   emitWarning: true,
    //   emitError: true,
    // }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 4000, // Set the development server to run on port 3000
  },
  json: {
    namedExports: true
  },
});