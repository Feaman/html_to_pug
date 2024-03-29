
export default {
  /*
  ** Nuxt rendering mode
  ** See https://nuxtjs.org/api/configuration-mode
  */
  mode: 'spa',
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'static',
  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    title: 'Html to pug converter',
    meta: [
      { charset: 'utf-8' },
      // { name: 'viewport', content: 'width=device-width, initial-scale=0' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto&display=swap' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Fira+Code&display=swap' }
    ]
  },
  /*
  ** Global CSS
  */
  css: [
    '~/assets/css/common.styl'
  ],
  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
    '~/plugins/init',
    '~/plugins/svg'
  ],
  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: true,
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxt/typescript-build'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/yandex-metrika'
  ],
  yandexMetrika: {
    id: '90732521'
  },
  axios: {
    // proxyHeaders: false
  },
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
  }
}
