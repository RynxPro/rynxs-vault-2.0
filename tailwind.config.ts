module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Adjust paths based on your project structure
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"), // Add the typography plugin here
  ],
};
