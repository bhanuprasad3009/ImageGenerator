/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkBg: '#080512',
        darkCard: '#0f0b22',
        neonPurple: '#8b5cf6',
        neonCyan: '#06b6d4',
        neonPink: '#f43f5e',
      },
      fontFamily: {
        sans: ['Outfit', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'neon-purple': '0 0 15px rgba(139, 92, 246, 0.35)',
        'neon-cyan': '0 0 15px rgba(6, 182, 212, 0.35)',
        'neon-pink': '0 0 15px rgba(244, 63, 94, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        'neon-gradient': 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 50%, #f43f5e 100%)',
        'dark-radial': 'radial-gradient(circle at top, #140d32 0%, #080512 80%)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
