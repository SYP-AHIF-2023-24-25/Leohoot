/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        "hooti-orange": "#f88d30",
        "hooti-blue": "#5ea9ea",
        "hooti-yellow": "#fccb0a",
        "hooti-yellow-disabled": "#FDDF6C",
        "hooti-green": "#ccc24b",
        "hooti-beige": "#ffecca",
        "hooti-grey": "#9b9c9f",
        "button-purple": "#c084fc",
        "button-orange": "#f59e0b",
        "button-yellow": "#fcd34d",
        "button-blue": "#38bdf8",
        "user-orange": "#fcb30a",
        "background-blue": "#0788b0",
      },
      spacing: {
        '128': '32rem',
      }
    },
  },
  plugins: [],
};
