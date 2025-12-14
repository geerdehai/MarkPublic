import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load .env files if they exist
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // In Vercel, system variables (process.env) need to be explicitly passed
      // We prioritize the system API_KEY (from Vercel dashboard) over .env file
      'process.env': {
        ...env,
        API_KEY: process.env.API_KEY || env.API_KEY,
        NODE_ENV: mode
      }
    },
    server: {
      port: 3000,
      host: true 
    }
  };
});