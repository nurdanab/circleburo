// vite.config.js
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
// import viteImagemin from 'vite-plugin-imagemin' // Removed due to security vulnerabilities
import compression from 'vite-plugin-compression'

export default defineConfig({
  publicDir: 'public',
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
        // Safe vendor split: bundle core libs into a single vendor chunk to
        // keep main entry smaller without creating circular vendor splits.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Core React libraries
            if (
              id.includes('react/') ||
              id.includes('react-dom/') ||
              id.includes('react-router-dom/') ||
              id.includes('react-helmet-async/') ||
              id.includes('scheduler/')
            ) {
              return 'vendor-react';
            }

            // Animation libraries - keep framer-motion with React
            if (
              id.includes('framer-motion/') ||
              id.includes('@motionone/')
            ) {
              return 'vendor-react';
            }

            // GSAP can be separate as it doesn't need React context
            if (id.includes('gsap/')) {
              return 'vendor-animations';
            }

            // UI and utility libraries
            if (
              id.includes('lucide-react/') ||
              id.includes('react-icons/') ||
              id.includes('cleave.js/')
            ) {
              return 'vendor-ui';
            }

            // Analytics and monitoring
            if (
              id.includes('web-vitals/') ||
              id.includes('react-ga4/') ||
              id.includes('newrelic/')
            ) {
              return 'vendor-analytics';
            }

            // Internationalization - keep with React to avoid context issues
            if (
              id.includes('i18next/') ||
              id.includes('react-i18next/')
            ) {
              return 'vendor-react';
            }

            // Database and API
            if (
              id.includes('@supabase/') ||
              id.includes('googleapis/')
            ) {
              return 'vendor-api';
            }

            // Other vendor dependencies
            return 'vendor-misc';
          }

          // App-level chunking by route/feature
          if (id.includes('src/pages/')) {
            if (id.includes('HomePage')) return 'page-home';
            if (id.includes('AboutPage')) return 'page-about';
            if (id.includes('CasePage')) return 'page-case';
            if (id.includes('Circle') || id.includes('Cycle') || id.includes('Semicircle')) {
              return 'page-services';
            }
            if (id.includes('AdminPage') || id.includes('LoginPage')) {
              return 'page-admin';
            }
          }

          // Component-level chunking for heavy sections
          if (id.includes('src/components/sections/')) {
            return 'sections-shared';
          }

          if (id.includes('src/components/sectionsAboutPage/')) {
            return 'sections-about';
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
    chunkSizeWarningLimit: 100, // Strict limit for better performance
    minify: 'terser',
    target: 'es2020', // Modern target for better optimization
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn', 'console.error'],
        passes: 3,
        unsafe: false,
        unsafe_comps: false,
        unsafe_Function: false,
        unsafe_math: false,
        unsafe_symbols: false,
        unsafe_methods: false,
        unsafe_proto: false,
        unsafe_regexp: false,
        unsafe_undefined: false,
        sequences: true,
        dead_code: true,
        conditionals: true,
        evaluate: true,
        booleans: true,
        loops: true,
        unused: true,
        hoist_funs: false,
        keep_fargs: true,
        hoist_vars: false,
        if_return: true,
        join_vars: true,
        reduce_vars: true,
        side_effects: true
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
      'react-helmet-async',
      'react-i18next',
      'i18next',
      'framer-motion'
    ],
    exclude: [
      'gsap', // Heavy animation library - load on demand
      'web-vitals',
      'react-ga4',
      'newrelic',
      '@supabase/supabase-js', // API calls - load on demand
      'googleapis' // API calls - load on demand
    ]
  },
  define: {
    global: 'globalThis'
  },
});