/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        mobile: { max: '639px' },
      },
    },
    fontFamily: {
      body: ['Inter'],
      sans: ['Inter'],
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light'],
    darkMode: false,
  },
};
