/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "ss-bg": "#161616",
        "ss-fg": "#1c1c1c",
        "ss-sidebar": "#0f0f0f",
        "ss-green": "#359749",
        "ss-dark-green": "#267036",
        "ss-gray": "#888888",
        "memory-red": "#FF0000",
        "memory-green": "#00FF00",
        "memory-blue": "#0000FF",
        "memory-yellow": "#FFFF00",
        "memory-magenta": "#FF00FF",
        "memory-cyan": "#00FFFF",
        "memory-orange": "#FFA500",
        "memory-purple": "#800080",
        "memory-dark-green": "#008000",
        "memory-gray": "#808080",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
