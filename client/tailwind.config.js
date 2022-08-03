module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        color: {
          from: {'background-color': 'darkgray'},
          to: {'background-color': 'black'}
        },
        rotate: {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '50%': {
            transform: 'rotate(90deg)'
          }
        }
      },
      animation: {
        color: 'color ease-in .5s',
        rotate: 'rotate'
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/forms'),
  ],
}