import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Roseburg Tracker brand palette
        rt: {
          amber:   "#b45309", // primary brand amber/brown
          amberDark: "#92400e",
          amberLight: "#d97706",
          amberBg: "#fffbeb",
          bg:      "#ffffff",
          surface: "#f9fafb",
          border:  "#e5e7eb",
          borderDark: "#d1d5db",
          text:    "#111827",
          textMuted: "#6b7280",
          textLight: "#9ca3af",
          // category tag colors
          business: "#b45309",  // amber
          service:  "#0369a1",  // blue
          org:      "#047857",  // green
        },
      },
      fontFamily: {
        serif: ['"DM Serif Display"', '"DM Serif Display Fallback"', 'Georgia', 'serif'],
        sans:  ['"Inter"', '"Inter Fallback"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        accent: ['"Source Serif 4"', '"Source Serif 4 Fallback"', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.05)",
        cardHover: "0 4px 12px 0 rgba(0,0,0,0.10), 0 2px 4px -1px rgba(0,0,0,0.06)",
        nav: "0 1px 0 0 #e5e7eb",
      },
      borderRadius: {
        card: "8px",
      },
    },
  },
  plugins: [],
};
export default config;
