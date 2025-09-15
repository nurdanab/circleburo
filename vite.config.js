// vite.config.js
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
// import viteImagemin from 'vite-plugin-imagemin' // Removed due to security vulnerabilities
import compression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    // Image optimization removed due to security vulnerabilities in vite-plugin-imagemin
    // Consider using @squoosh/lib or sharp for image optimization in build process
    // Включаем сжатие для улучшения производительности
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024,
      deleteOriginalAssets: false
    }),
    compression({
      algorithm: 'brotliCompress',
      ext: '.br', 
      threshold: 1024,
      deleteOriginalAssets: false
    })
  ],
  server: {
    headers: {
      'Cache-Control': 'public, max-age=0'
    },
    hmr: {
      clientPort: 5176, // Use same port as dev server
    }
  },
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks - stable dependencies that rarely change
          if (id.includes('node_modules/react/') && !id.includes('react-dom')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/react-dom/')) {
            return 'vendor-react-dom';
          }
          
          // Framer Motion - держим все вместе для избежания проблем инициализации
          if (id.includes('node_modules/framer-motion/')) {
            return 'framer-motion';
          }
          
          // GSAP отдельно
          if (id.includes('node_modules/gsap/')) {
            return 'gsap';
          }
          
          // Routing and i18n
          if (id.includes('node_modules/react-router-dom/')) {
            return 'react-router';
          }
          if (id.includes('node_modules/react-i18next/') || id.includes('node_modules/i18next/')) {
            return 'i18n';
          }
          
          // Supabase
          if (id.includes('node_modules/@supabase/')) {
            return 'supabase';
          }
          
          // Analytics (should be async)
          if (id.includes('node_modules/react-ga4/') || id.includes('node_modules/newrelic/')) {
            return 'analytics';
          }
          
          // Icons and utils
          if (id.includes('node_modules/lucide-react/')) {
            return 'lucide-icons';
          }
          if (id.includes('node_modules/react-icons/')) {
            return 'react-icons';
          }
          if (id.includes('node_modules/cleave.js/')) {
            return 'cleave';
          }
          
          // React Helmet
          if (id.includes('node_modules/react-helmet-async/')) {
            return 'react-helmet';
          }
          
          // Web Vitals
          if (id.includes('node_modules/web-vitals/')) {
            return 'web-vitals';
          }
          
          // Other vendor libs
          if (id.includes('node_modules/')) {
            return 'vendor';
          }
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js'
      }
    },
    chunkSizeWarningLimit: 500, // Stricter limit for better performance
    minify: 'terser',
    target: 'es2020', // Modern target for better optimization
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        passes: 2,
        unsafe: false,
        unsafe_comps: false,
        unsafe_Function: false,
        unsafe_math: false,
        unsafe_symbols: false,
        unsafe_methods: false,
        unsafe_proto: false,
        unsafe_regexp: false,
        unsafe_undefined: false,
        sequences: false,
        dead_code: true,
        conditionals: true,
        evaluate: false,
        booleans: true,
        loops: true,
        unused: true,
        hoist_funs: false,
        keep_fargs: true,
        hoist_vars: false,
        if_return: true,
        join_vars: false,
        reduce_vars: false,
        side_effects: false
      },
      mangle: {
        safari10: true,
        toplevel: false
      },
      format: {
        comments: false
      }
    },
    cssMinify: 'lightningcss',
    reportCompressedSize: false,
    sourcemap: false
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'gsap',
      '@supabase/supabase-js'
    ],
    exclude: [
      'web-vitals'
    ]
  },
});