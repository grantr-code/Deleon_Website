/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#4CC95B',
          dark: '#0b0b0b',
          card: '#141414',
          text: '#e8e8e8',
          muted: '#b8b8b8',
        },
      },
      fontFamily: {
        // Site-wide brand font follows the global CSS variable
        brand: ['var(--font-site)', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial'],
        // Use Eurostile only for the wordmark text
        logo: ['"Eurostile Round Extended"', '"Eurostile Round"', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial'],
      },
    },
  },
  plugins: [],
};
