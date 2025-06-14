/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
theme: {
    extend: {
      colors: {
        // Dynamic theme colors using CSS custom properties
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        background: 'rgb(var(--color-background) / <alpha-value>)',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6'
      },
      fontFamily: {
        display: ['Fredoka One', 'cursive'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      animation: {
        'bounce-in': 'bounceIn 0.4s ease-out',
        'pulse-success': 'pulseSuccess 0.6s ease-out',
        'confetti-fall': 'confettiFall 3s ease-out forwards'
      },
      keyframes: {
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        pulseSuccess: {
          '0%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.7)' },
          '70%': { transform: 'scale(1.05)', boxShadow: '0 0 0 10px rgba(16, 185, 129, 0)' },
          '100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(16, 185, 129, 0)' }
        },
        confettiFall: {
          '0%': { transform: 'translateY(-100vh) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' }
        }
      },
      perspective: {
        '1000': '1000px'
      }
    }
  },
  plugins: []
}