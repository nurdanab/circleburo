// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css}",
  ],
  
  theme: {
    extend: {
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
      },
      screens: {
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
      
    },
    
  },
  plugins: [],
  
}
