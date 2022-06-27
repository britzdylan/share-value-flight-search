
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    styled: true,
    themes: [{
      mytheme: {

        "primary": "#374151",

        "secondary": "#6b7280",

        "accent": "#0c4a6e",

        "neutral": "#d1d5db",

        "base-100": "#f3f4f6",

        "info": "#3b82f6",

        "success": "#4ade80",

        "warning": "#facc15",

        "error": "#ef4444",
      },
    },],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "mytheme",
  },
}
