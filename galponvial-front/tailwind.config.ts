import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        /* Brand Colors */
        navbar: {
          bg: '#242424',
          nav: '#0062e3',
          text: '#ffffff',
          hover: '#001b42',
        },
        /* Semantic Colors */
        text: {
          primary: '#1f2937',
        },
        bg: {
          light: '#f3f4f6',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
