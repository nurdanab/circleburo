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
          // Критические зависимости React - остаются в основном чанке
          if (id.includes('node_modules/react/') && !id.includes('react-dom')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/react-dom/')) {
            return 'vendor-react-dom';
          }

          // Framer Motion - выносим в отдельный лази чанк для SI
          if (id.includes('node_modules/framer-motion/')) {
            return 'animations';
          }

          // GSAP - тоже в лази чанк
          if (id.includes('node_modules/gsap/')) {
            return 'animations';
          }

          // Критическая маршрутизация - остается в основном чанке
          if (id.includes('node_modules/react-router-dom/')) {
            return 'vendor-react';
          }

          // i18n - асинхронно
          if (id.includes('node_modules/react-i18next/') || id.includes('node_modules/i18next/')) {
            return 'features';
          }

          // Supabase - асинхронно
          if (id.includes('node_modules/@supabase/')) {
            return 'features';
          }

          // Analytics - асинхронно (не блокирует основной рендер)
          if (id.includes('node_modules/react-ga4/') || id.includes('node_modules/newrelic/') || id.includes('node_modules/web-vitals/')) {
            return 'analytics';
          }

          // Иконки - лази лоадинг
          if (id.includes('node_modules/lucide-react/') || id.includes('node_modules/react-icons/')) {
            return 'icons';
          }

          // Утилиты - лази
          if (id.includes('node_modules/cleave.js/') || id.includes('node_modules/react-helmet-async/')) {
            return 'utils';
          }

          // Остальные vendor библиотеки
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
    chunkSizeWarningLimit: 300, // Еще более строгий лимит для LCP/SI
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
      'react-router-dom'
    ],
    exclude: [
      'framer-motion', // Лази лоадинг для анимаций
      'gsap',
      'web-vitals',
      'react-ga4',
      'newrelic',
      '@supabase/supabase-js' // Лази лоадинг базы данных
    ]
  },
});