/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        groen: {
          DEFAULT: '#1a472a',
          light: '#2d6a4f',
          lighter: '#40916c',
        },
        oranje: {
          DEFAULT: '#e76f51',
          light: '#f4a261',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
