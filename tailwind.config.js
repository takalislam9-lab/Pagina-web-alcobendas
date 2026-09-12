/** @type {import('tailwindcss').Config} */
// Configuración para compilar Tailwind a un CSS estático (producción).
// Uso:  npm install  &&  npm run build   -> genera assets/css/tailwind.css
// Después, en index.html sustituye el <script src="cdn.tailwindcss.com">
// por:  <link rel="stylesheet" href="/assets/css/tailwind.css" />
module.exports = {
  content: ['./*.html', './admin/*.html', './assets/js/**/*.js'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd',
          400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8',
          800: '#1e40af', 900: '#1e3a8a', 950: '#172554'
        },
        ink: { 900: '#0f172a', 800: '#1e293b', 700: '#334155' },
        accent: '#22c55e'
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: { soft: '0 10px 40px -12px rgba(15,23,42,.18)' }
    }
  },
  plugins: []
};
