import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Safely inject env vars. We manually include NODE_ENV to prevent React crashes.
      'process.env': {
        ...env,
        NODE_ENV: mode
      }
    },
    server: {
      port: 3000,
      host: true 
    }
  };
});