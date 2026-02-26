

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          page: '#0e1116',
          card: '#161b22',
          border: '#30363d',
          text: '#e6edf3',
          muted: '#8b949e',
          terminal: '#010409',
        },
        brand: {
          primary: '#238636',
          primaryHover: '#2ea043',
          danger: '#da3633',
          dangerHover: '#f85149',
        },
      },
    },
  },
  plugins: [],
}