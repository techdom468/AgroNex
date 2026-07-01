/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode manually via class
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981', // Main Green
          600: '#059669',
          700: '#047857',
        },
        secondary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6', // Main Blue
          600: '#2563eb',
          700: '#1d4ed8',
        },
        background: {
          light: '#f3f4f6', // Light Gray
          dark: '#111827',  // Dark Mode BG
          cardDark: '#1f2937' // Dark Mode Card BG
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Body font
        heading: ['Poppins', 'sans-serif'], // Heading font
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 15px rgba(16, 185, 129, 0.5)', // Primary glow
      }
    },
  },
  plugins: [],
}
