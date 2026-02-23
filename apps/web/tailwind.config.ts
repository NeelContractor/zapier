/** @type {import('tailwindcss').Config} */
const config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{ts,tsx}",
        "../../packages/ui/src/**/*.{ts,tsx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };
  
  export default config;