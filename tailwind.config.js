/** @type {import('tailwindcss').Config} */
export default {
    content: [
      './components/**/*.{js,vue,ts}',
      './layouts/**/*.vue',
      './pages/**/*.vue',
      './plugins/**/*.{js,ts}',
      './app.vue',
      './error.vue'
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            50: '#f0f6fd',
            100: '#dbe8f9',
            200: '#bcd4f5',
            300: '#8eb8ee',
            400: '#5693e5',
            500: '#3975db', // Main brand blue
            600: '#2b5ec8',
            700: '#264ea6',
            800: '#244287',
            900: '#223a6d'
          },
          secondary: {
            50: '#f5f7fa',
            100: '#ebeef4',
            200: '#dde2ec',
            300: '#cbd2e2',
            400: '#94a3c8',
            500: '#6b82b5',
            600: '#4a639e',
            700: '#3d5182',
            800: '#344169',
            900: '#2d3757'
          },
          accent: {
            DEFAULT: '#e86c4c',
            hover: '#d65b3c'
          }
        }
      }
    },
    plugins: [
      require('@tailwindcss/forms'),
      require('@tailwindcss/typography')
    ]
  }