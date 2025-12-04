// vite.config.js
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
// import viteImagemin from 'vite-plugin-imagemin' // Removed due to security vulnerabilities
import compression from 'vite-plugin-compression'
import asyncCSSPlugin from './vite-plugin-async-css.js'

export default defineConfig({
  publicDir: 'public',
  plugins: [
    tailwindcss(),
    react(),
    asyncCSSPlugin(),
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
        // Mobile-optimized chunking strategy - smaller chunks for better caching
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Critical React core - must be checked FIRST before vendor-core
            if (id.includes('/react/') || id.includes('/react/index')) {
              return 'react-core';
            }

            if (id.includes('react/jsx-runtime')) {
              return 'react-core';
            }

            if (id.includes('scheduler')) {
              return 'react-core';
            }

            if (id.includes('react-dom/client')) {
              return 'react-dom';
            }

            if (id.includes('react-dom')) {
              return 'react-dom';
            }

            // Router - critical for navigation
            if (id.includes('react-router-dom')) {
              return 'router';
            }

            if (id.includes('react-router')) {
              return 'router';
            }

            // I18n - split into smaller chunks for mobile
            if (id.includes('@dr.pogodin/react-helmet/')) {
              return 'helmet';
            }

            if (id.includes('react-i18next/')) {
              return 'i18n-react';
            }

            if (id.includes('i18next-browser-languagedetector')) {
              return 'i18n-detector';
            }

            if (id.includes('i18next-http-backend')) {
              return 'i18n-backend';
            }

            if (id.includes('i18next/')) {
              return 'i18n-core';
            }

            // Animation libraries - lazy load (low priority for mobile)
            if (id.includes('gsap/')) {
              return 'gsap';
            }

            // UI libraries - split icons for better caching
            if (id.includes('lucide-react/')) {
              return 'icons-lucide';
            }

            if (id.includes('react-icons/fa6')) {
              return 'icons-fa6';
            }

            if (id.includes('react-icons/fa')) {
              return 'icons-fa';
            }

            if (id.includes('react-icons/')) {
              return 'icons-react';
            }

            // Heavy API libraries - separate for lazy loading
            if (id.includes('@supabase/supabase-js')) {
              return 'supabase';
            }

            if (id.includes('googleapis/')) {
              return 'google-apis';
            }

            // Analytics - low priority for mobile
            if (id.includes('web-vitals/')) {
              return 'web-vitals';
            }

            if (id.includes('react-ga4/')) {
              return 'ga4';
            }

            if (id.includes('newrelic/')) {
              return 'newrelic';
            }


            // Utilities - rarely change, good for long-term caching
            if (
              id.includes('lodash') ||
              id.includes('date-fns') ||
              id.includes('axios') ||
              id.includes('crypto')
            ) {
              return 'vendor-utils';
            }

            // Split large vendor packages separately
            if (id.includes('object-assign') || id.includes('prop-types')) {
              return 'react-helpers';
            }

            // Everything else - vendor core (keep small)
            return 'vendor-core';
          }

          // App-specific chunks - granular splitting for mobile caching
          if (id.includes('src/pages/HomePage')) {
            return 'page-home';
          }

          if (id.includes('src/pages/NotFoundPage')) {
            return 'page-404';
          }

          if (id.includes('src/pages/')) {
            return 'pages-other';
          }

          // New sections from src/sections/ - split for better caching
          if (id.includes('src/sections/')) {
            return 'sections';
          }

          // Layout components - loaded on every page
          if (id.includes('src/components/Header')) {
            return 'layout-header';
          }

          if (id.includes('src/components/Footer')) {
            return 'layout-footer';
          }

          // ОПТИМИЗАЦИЯ: Разделяем компоненты по типам
          if (id.includes('src/components/StaticHero')) {
            return 'components-heavy';
          }

          if (id.includes('src/components/SEOHead') ||
              id.includes('src/components/PerformanceMeta') ||
              id.includes('src/components/AccessibilityHelper')) {
            return 'components-meta';
          }

          // Остальные компоненты
          if (id.includes('src/components/')) {
            return 'components';
          }
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp|avif/i.test(ext)) {
            return `assets/images/[name]-[hash:8][extname]`;
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `assets/fonts/[name]-[hash:8][extname]`;
          }
          return `assets/[name]-[hash:8][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash:8].js',
        entryFileNames: 'assets/js/[name]-[hash:8].js',
        // Inline small modules for mobile performance
        inlineDynamicImports: false,
        // Reduce chunk size for mobile
        experimentalMinChunkSize: 10000 // 10KB minimum
      }
    },
    chunkSizeWarningLimit: 500, // Увеличено для vendor chunks
    minify: 'terser',
    target: 'es2020', // Modern browsers support
    // Агрессивное удаление неиспользуемого кода
    treeshake: {
      moduleSideEffects: false,
      preset: 'smallest'
    },
    cssCodeSplit: true, // Critical for per-route CSS
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        passes: 2,
        ecma: 2020,
        module: true
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false,
        ecma: 2020
      }
    },
    cssMinify: 'lightningcss',
    reportCompressedSize: false,
    sourcemap: false,
    assetsInlineLimit: 4096, // Увеличено для мобильных - меньше HTTP запросов
    emptyOutDir: true,
    // Оптимизация для продакшена
    modulePreload: {
      polyfill: false // Отключаем polyfill для современных браузеров
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'scheduler',
      'react-router-dom',
      '@dr.pogodin/react-helmet'
    ],
    exclude: [
      'gsap', // Load on demand
      'googleapis', // Load on demand
      'newrelic',
      'terser'
    ],
    esbuildOptions: {
      target: 'es2020',
      treeShaking: true,
      // Агрессивная минификация
      minify: true,
      legalComments: 'none'
    }
  },
  // Tree-shaking оптимизация
  resolve: {
    dedupe: ['react', 'react-dom', 'react-router-dom']
  },
  define: {
    global: 'globalThis'
  },
});