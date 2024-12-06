module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    extend: {
      fontFamily: {
        neodgm: ['neodgm', 'sans-serif'],
      },
      colors: {
        customWhite: '#FCF6F5',  
        customBlue:'#333D79',
        customGreen:'#2BAE66',
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
