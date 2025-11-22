import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Polyfill process.env.API_KEY for the Google GenAI SDK
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || process.env.VITE_API_KEY),
      // Polyfill generic process.env to avoid crashes if libraries access it
      'process.env': {}
    },
    build: {
      target: 'esnext', // Needed for Top-level await in DuckDB/Wasm
    },
    optimizeDeps: {
      exclude: ['@duckdb/duckdb-wasm']
    }
  };
});