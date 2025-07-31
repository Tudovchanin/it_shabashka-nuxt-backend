// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // ssr: false, 
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  css: ['~/assets/scss/main.scss'],
  modules: ['@pinia/nuxt', '@prisma/nuxt'],
  runtimeConfig: {
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    public: {
      APPWRITE_STORAGE_ID: process.env.APPWRITE_STORAGE_ID,
      APPWRITE_APP_ID: process.env.APPWRITE_APP_ID

    }
  }
})