/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#101B30",
          800: "#152444",
          700: "#1C2F58",
          600: "#28406F",
        },
        parchment: {
          DEFAULT: "#F1E7CF",
          dark: "#E4D4AC",
          text: "#3B2F1E",
        },
        paper: "#FBF7EE",
        brass: {
          DEFAULT: "#BD8A43",
          light: "#D9B074",
        },
        moss: {
          DEFAULT: "#54744F",
          light: "#7C9A70",
          bg: "#E4EADF",
        },
        clay: {
          DEFAULT: "#A8482F",
          light: "#C77456",
          bg: "#EFDFD6",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      backgroundImage: {
        grain: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        card: "0 1px 0 rgba(255,255,255,0.06) inset, 0 20px 40px -20px rgba(0,0,0,0.6)",
        stamp: "0 2px 0 rgba(0,0,0,0.08)",
      },
      keyframes: {
        // Bright dash travels down the flow line (see FlowLine.jsx).
        flowdash: {
          to: { "stroke-dashoffset": "-100" },
        },
      },
      animation: {
        flowdash: "flowdash 3.2s linear infinite",
      },
    },
  },
  plugins: [],
};
