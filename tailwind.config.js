/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        phudu: ["Phudu", "sans-serif"],
        kanit: ["Kanit", "sans-serif"],
      },
      colors: {
        figma: {
          dark: "#0A0A0A",
          heading: "#1B202C",
          body: "#6A7282",
          muted: "#4A5565",
          accent: "#4F80FF",
          "accent-dark": "#4E80EE",
          "section-alt": "#F5F6FA",
          border: "#BBBCC0",
          "border-light": "rgba(187, 188, 192, 0.5)",
          "icon-bg": "#EFF6FF",
          "card-bg": "#F5F6F7",
        },
        jack: {
          black: "#0C0C0C",
          mist: "#D7E2EA",
          steel: "#646973",
          ice: "#BBCCD7",
        },
      },
      maxWidth: {
        container: "1152px",
      },
    },
  },
  plugins: [],
};
