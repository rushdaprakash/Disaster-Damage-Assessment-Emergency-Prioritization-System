/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        disaster: {
          low: "#10b981",       // emerald-500
          moderate: "#eab308",  // amber-500
          high: "#f97316",      // orange-500
          critical: "#ef4444",  // red-500
        }
      }
    },
  },
  plugins: [],
}
