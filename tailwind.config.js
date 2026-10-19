/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        arcade: {
          bg: '#0c0f17',
          dark: '#141926',
          panel: '#1b2337',
          border: '#324263',
          yellow: '#ffe600',
          orange: '#ff8400',
          red: '#ff2d55',
          green: '#00ff88',
          cyan: '#00f0ff',
          blue: '#2c75ff',
          purple: '#af52de',
        }
      },
      fontFamily: {
        retro: ['"Press Start 2P"', '"Courier New"', 'monospace', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'arcade-glow': '0 0 15px rgba(0, 240, 255, 0.4)',
        'arcade-yellow': '0 0 15px rgba(255, 230, 0, 0.4)',
        'arcade-red': '0 0 15px rgba(255, 45, 85, 0.5)',
        'arcade-green': '0 0 15px rgba(0, 255, 136, 0.4)',
        'pixel': '4px 4px 0px 0px rgba(0,0,0,0.8)',
        'pixel-sm': '2px 2px 0px 0px rgba(0,0,0,0.8)',
        'pixel-lg': '6px 6px 0px 0px rgba(0,0,0,0.9)',
      },
      animation: {
        'pulse-fast': 'pulse 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-short': 'bounceShort 0.5s ease-in-out infinite alternate',
      },
      keyframes: {
        bounceShort: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
