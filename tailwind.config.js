/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        qa: {
          void: '#070b13',
          charcoal: '#0f172a',
          card: '#131e33',
          cardHover: '#182642',
          border: '#1e293b',
          borderBright: '#334155',
          emerald: '#10b981',
          cyan: '#06b6d4',
          crimson: '#ef4444',
          amber: '#f59e0b',
          purple: '#8b5cf6',
        }
      },
      boxShadow: {
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.3)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.3)',
        'glow-crimson': '0 0 25px -5px rgba(239, 68, 68, 0.35)',
        'terminal': '0 20px 50px -10px rgba(0, 0, 0, 0.7), 0 0 30px -5px rgba(6, 182, 212, 0.15)',
      }
    },
  },
  plugins: [],
}

