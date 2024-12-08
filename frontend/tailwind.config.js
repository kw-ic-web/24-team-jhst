module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    extend: {
      fontFamily: {
        neodgm: ['neodgm', 'sans-serif'],
      },
      colors: {
        customWhite: '#705C53',  
        main01:'#659287',
        main02:'#608BC1',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
