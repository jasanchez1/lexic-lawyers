// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    css: ['~/assets/css/tailwind.css'],
    modules: ['@nuxtjs/tailwindcss'],
    app: {
      head: {
        title: 'Lexic - Portal de Abogados',
        meta: [
          { charset: 'utf-8' },
          { name: 'viewport', content: 'width=device-width, initial-scale=1' },
          { name: 'description', content: 'Portal para abogados de Lexic' }
        ],
        link: [
          { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ]
      }
    },
    runtimeConfig: {
      public: {
        apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:8000'
      }
    }
  })