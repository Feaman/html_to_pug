import Vue from 'vue'
import { Context } from '@nuxt/types'
import simplebar from 'simplebar-vue'
import BaseService from '~/services/base'
import 'simplebar/dist/simplebar.min.css'

export default (context: Context) => {
  BaseService.nuxtError = context.error
  BaseService.vuex = context.store
  BaseService.events = new Vue()

  Vue.component('simplebar', simplebar)
}
