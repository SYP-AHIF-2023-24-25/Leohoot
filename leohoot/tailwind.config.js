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
        "background-blue-dark": "#067a9e",
        "pastel-lila": "#D4B0F9",
        "background-blue-light": "#cde7ef",
        "ranking-blue": "#9CCFDF",
        "design-quiz-blue": "#39A0C0",
        "design-quiz-hover": "#62C6E4",
        "tags": "#83a9b5"
      },
      spacing: {
        '128': '32rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
};
