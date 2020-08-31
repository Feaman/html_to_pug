import Vue from 'vue'
import { Store } from 'vuex'
import { Context, NuxtError } from '@nuxt/types'

export default class Base {
  static nuxtError: Context['error']
  static vuex: Store<any>
  static events: Vue

  static error (message: string) {
    const error: NuxtError = { message }
    this.nuxtError(error)
    throw new Error(message)
  }
}
