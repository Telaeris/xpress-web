import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  vite: {
      plugins: [
          tailwindcss(),
          require('@headlessui/tailwindcss'),
      ]
  },
  srcDir: 'app/',
  imports: {
    dirs: [
      // Add your forms directory to auto-import scanning
      'forms',
      'forms/**'
    ]
  },
  i18n: {
    defaultLocale: 'en',
    strategy: 'no_prefix',
    locales: [
        { code: 'en', file: 'en.json', name: 'English' },
        { code: 'es', file: 'es.json', name: 'Español' },
    ],
    detectBrowserLanguage: {
        useCookie: true,
        cookieKey: 'i18n_redirected',
        alwaysRedirect: true,
        fallbackLocale: 'en'
    }
  },
  components: true,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  devServer: {
      host: '0.0.0.0',
      port: 3001,
  },

  pages: true,

  runtimeConfig: {
    public: {
      theme: 'xpe',
    }
  },

  css: [
      '~/assets/css/main.css',
      `~/assets/css/xpt.css`,
      '@fortawesome/fontawesome-svg-core/styles.css'
  ],

  plugins: [
      '~/plugins/fontawesome.js',
      '~/plugins/click-outside.ts',
  ],

  ssr: false,
  modules: ['@nuxtjs/i18n', '@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt'],
})
