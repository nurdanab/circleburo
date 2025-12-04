// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css}",
  ],
  
  theme: {
    extend: {
      borderWidth: {
        '3': '3px',
      },
      colors: {
        'dark': {
          '900': '#000000',
          '800': '#0C0C0C',
          '700': '#121112',
          '600': '#282729',
          '500': '#504F50',
          '400': '#676667',
        },
        'light': {
          '200': '#C6C4C6',
          '100': '#FFFFFF',
        },
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      },
      fontSize: {
        '7xl': '70px',
        'responsive-xs': 'clamp(0.875rem, 2.5vw, 1rem)',
        'responsive-sm': 'clamp(1rem, 3vw, 1.25rem)',
        'responsive-base': 'clamp(1rem, 4vw, 1.5rem)',
        'responsive-lg': 'clamp(1.125rem, 4.5vw, 1.75rem)',
        'responsive-xl': 'clamp(1.25rem, 5vw, 2rem)',
        'responsive-2xl': 'clamp(1.5rem, 6vw, 2.5rem)',
        'responsive-3xl': 'clamp(1.875rem, 7vw, 3rem)',
        'responsive-4xl': 'clamp(2.25rem, 8vw, 4rem)',
        'responsive-5xl': 'clamp(3rem, 10vw, 5rem)',
        'responsive-6xl': 'clamp(3.75rem, 12vw, 6rem)',
        'responsive-7xl': 'clamp(4.5rem, 14vw, 7rem)',
      },
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px', // Full HD
        '4xl': '2560px', // 2K
        '5xl': '3840px', // 4K
      },
      animation: {
        'spin-slow': 'spin-slow 25s linear infinite',
        'bounce': 'bounce 3s infinite',
        'pulse-slow': 'pulse-slow 20s ease-in-out infinite',
      },
      keyframes: {
        'spin-slow': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(360deg)' },
        },
        'bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(8px)' },
        },
        'pulse-slow': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        }
      },
      mixBlendMode: ['normal', 'difference'],
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      
    },
    
  },
  plugins: [],
  
}
