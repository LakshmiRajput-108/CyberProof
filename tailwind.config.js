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
        cyber: {
          bg: {
            dark: '#0B1220',
            darkCard: '#111C2E',
            darkElevated: '#152236',
            light: '#F8FAFC',
            lightCard: '#FFFFFF',
            lightElevated: '#F1F5F9',
          },
          border: {
            dark: 'rgba(159, 176, 195, 0.20)',
            darkHover: 'rgba(32, 199, 190, 0.35)',
            light: 'rgba(0, 0, 0, 0.08)',
            lightHover: 'rgba(13, 148, 136, 0.3)',
          },
          teal: {
            DEFAULT: '#20C7BE',
            light: '#39D8D0',
            dark: '#16AFA8',
            deep: '#0F7773',
          },
          emerald: {
            DEFAULT: '#10B981',
            dark: '#059669',
            light: '#34D399',
          },
          navy: {
            950: '#0B1220',
            900: '#111C2E',
            850: '#152236',
            800: '#1A2940',
            700: '#243A58',
            600: '#355277',
          }
        },
        risk: {
          low: {
            text: '#10B981',
            bg: 'rgba(16, 185, 129, 0.12)',
            border: 'rgba(16, 185, 129, 0.28)',
          },
          medium: {
            text: '#F59E0B',
            bg: 'rgba(245, 158, 11, 0.12)',
            border: 'rgba(245, 158, 11, 0.28)',
          },
          high: {
            text: '#EF4444',
            bg: 'rgba(239, 68, 68, 0.12)',
            border: 'rgba(239, 68, 68, 0.28)',
          },
          unknown: {
            text: '#94A3B8',
            bg: 'rgba(148, 163, 184, 0.12)',
            border: 'rgba(148, 163, 184, 0.28)',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'glow-teal': '0 0 25px -5px rgba(20, 184, 166, 0.25)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.25)',
        'glow-subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
      },
      keyframes: {
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
