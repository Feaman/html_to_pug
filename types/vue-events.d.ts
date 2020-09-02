import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $events: Vue
  }
}
