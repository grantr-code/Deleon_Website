/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  // Enable Tailwind's built-in dark mode with class strategy
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Semantic color tokens using CSS variables
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        border: {
          DEFAULT: 'hsl(var(--border))',
          subtle: 'hsl(var(--border-subtle))',
        },
      },
      fontFamily: {
        // Site-wide brand font follows the global CSS variable
        brand: ['var(--font-site)', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial'],
        // Use Eurostile only for the wordmark text
        logo: ['"Eurostile Round Extended"', '"Eurostile Round"', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial'],
      },
      // Named opacity levels for consistent theming
      opacity: {
        'subtle': 'var(--opacity-subtle)',
        'soft': 'var(--opacity-soft)',
        'medium': 'var(--opacity-medium)',
        'strong': 'var(--opacity-strong)',
        'emphasis': 'var(--opacity-emphasis)',
      },
    },
  },
  plugins: [],
};
