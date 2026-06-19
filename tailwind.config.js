/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#172554',
        },
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
        },
      },
      boxShadow: {
        soft: '0 12px 30px rgba(15, 23, 42, 0.08)',
        panel: '0 6px 20px rgba(15, 23, 42, 0.06)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      fontFamily: {
        sans: ['Segoe UI', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient':
          'radial-gradient(circle at top left, rgba(37, 99, 235, 0.18), transparent 40%), radial-gradient(circle at top right, rgba(56, 189, 248, 0.16), transparent 35%), linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
      },
    },
  },
  plugins: [],
};
