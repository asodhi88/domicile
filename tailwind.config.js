/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Page-shell tokens are theme-aware: their channel values come from
        // CSS variables in index.css that flip between dark (default) and
        // light via the data-theme attribute. Written as rgb(var / <alpha>)
        // so Tailwind opacity modifiers (e.g. text-paper/70) still work.
        ink: {
          900: "rgb(var(--color-ink-900) / <alpha-value>)",
          800: "rgb(var(--color-ink-800) / <alpha-value>)",
          700: "rgb(var(--color-ink-700) / <alpha-value>)",
          600: "rgb(var(--color-ink-600) / <alpha-value>)",
        },
        paper: "rgb(var(--color-paper) / <alpha-value>)",
        brass: {
          DEFAULT: "#BD8A43",
          light: "rgb(var(--color-brass-light) / <alpha-value>)",
          // High-contrast brass for section kickers. Kept separate from
          // `light` because that one also backs button hover states.
          deep: "rgb(var(--color-brass-deep) / <alpha-value>)",
        },
        moss: {
          DEFAULT: "#54744F",
          light: "rgb(var(--color-moss-light) / <alpha-value>)",
          bg: "#E4EADF",
        },
        // Parchment cards read as light surfaces in both themes — fixed.
        parchment: {
          DEFAULT: "#F1E7CF",
          light: "#FAF4E4",
          dark: "#E4D4AC",
          text: "#3B2F1E",
        },
        clay: {
          DEFAULT: "#A8482F",
          light: "#C77456",
          bg: "#EFDFD6",
        },
        // Fixed helpers for overloaded uses: `field` = light input surface
        // inside parchment cards; `night` = dark text on brass buttons.
        field: "#FDFBF5",
        night: "#101B30",
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
    },
  },
  plugins: [],
};
