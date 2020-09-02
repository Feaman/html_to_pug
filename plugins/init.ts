import Vue from 'vue'
import { Context } from '@nuxt/types'
import simplebar from 'simplebar-vue'
import ElvenHeaderComponent from '~/components/header.vue'
import ElvenContainerComponent from '~/components/container.vue'
import ElvenFooterComponent from '~/components/footer.vue'
import BaseService from '~/services/base'
import 'simplebar/dist/simplebar.min.css'

export default (context: Context) => {
  const events = new Vue()
  BaseService.nuxtError = context.error
  BaseService.vuex = context.store
  BaseService.events = events

  Vue.prototype.$events = events

  // Fix 100vh for mobile
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)

  Vue.component('elven-header', ElvenHeaderComponent)
  Vue.component('elven-container', ElvenContainerComponent)
  Vue.component('elven-footer', ElvenFooterComponent)
  Vue.component('simplebar', simplebar)
}
