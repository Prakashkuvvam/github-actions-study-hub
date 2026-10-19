/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        github: {
          dark: '#0d1117',
          light: '#f6f8fa',
          border: '#30363d',
        },
      },
    },
  },
  plugins: [],
};
