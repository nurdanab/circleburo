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
        // Ultra-optimized chunking strategy
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Critical React core - keep minimal
            if (id.includes('react/jsx-runtime') || id.includes('react/')) {
              return 'react-runtime';
            }

            if (id.includes('react-dom/')) {
              return 'react-dom';
            }

            if (id.includes('scheduler/')) {
              return 'react-scheduler';
            }

            // Router - separate from other app logic
            if (id.includes('react-router-dom/')) {
              return 'router';
            }

            // I18n - load after main app
            if (
              id.includes('@dr.pogodin/react-helmet/') ||
              id.includes('react-i18next/') ||
              id.includes('i18next/')
            ) {
              return 'i18n-core';
            }

            // Animation libraries - keep with vendor to avoid circular imports
            if (id.includes('framer-motion/')) {
              return 'vendor';
            }

            if (id.includes('gsap/')) {
              return 'gsap';
            }

            // UI libraries - separate for better caching
            if (id.includes('lucide-react/')) {
              return 'icons-lucide';
            }

            if (id.includes('react-icons/')) {
              return 'icons-react';
            }

            // Heavy API libraries - separate chunk
            if (id.includes('@supabase/supabase-js')) {
              return 'supabase';
            }

            if (id.includes('googleapis/')) {
              return 'google-apis';
            }

            // Analytics and monitoring
            if (
              id.includes('web-vitals/') ||
              id.includes('react-ga4/') ||
              id.includes('newrelic/')
            ) {
              return 'analytics';
            }

            // Form utilities
            if (id.includes('cleave.js/')) {
              return 'form-utils';
            }

            // Everything else goes to vendor
            return 'vendor';
          }

          // App-specific chunks - more granular
          if (id.includes('src/pages/HomePage') || id.includes('src/pages/NotFoundPage')) {
            return 'pages-core';
          }

          if (id.includes('src/pages/')) {
            return 'pages-secondary';
          }

          if (id.includes('src/components/sections/')) {
            return 'sections';
          }

          if (id.includes('src/components/')) {
            return 'components';
          }
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash:8][extname]`;
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `assets/fonts/[name]-[hash:8][extname]`;
          }
          return `assets/[name]-[hash:8][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash:8].js',
        entryFileNames: 'assets/js/[name]-[hash:8].js'
      }
    },
    chunkSizeWarningLimit: 40, // Stricter limit for better performance
    minify: 'terser',
    target: 'es2020', // More compatible target
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2, // Reduce optimization passes
        unsafe: false,
        toplevel: false, // Less aggressive optimization
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
        side_effects: false // More conservative
      },
      mangle: {
        safari10: true,
        toplevel: false // Less aggressive mangling
      },
      format: {
        comments: false
      }
    },
    cssMinify: 'lightningcss',
    reportCompressedSize: false,
    sourcemap: false,
    assetsInlineLimit: 2048, // Inline smaller assets
    emptyOutDir: true
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'scheduler',
      'react-router-dom',
      '@dr.pogodin/react-helmet',
      'lucide-react' // Most used icon library
    ],
    exclude: [
      'gsap', // Load on demand
      'framer-motion', // Load on demand
      '@supabase/supabase-js', // Load on demand
      'googleapis', // Load on demand
      'web-vitals',
      'react-ga4',
      'newrelic',
      'cleave.js',
      'sass',
      'terser',
      'i18next', // Let it be in separate chunk
      'react-i18next',
      'i18next-browser-languagedetector',
      'i18next-http-backend'
    ],
    force: true, // Force re-optimization
    esbuildOptions: {
      target: 'es2020'
    }
  },
  define: {
    global: 'globalThis'
  },
});