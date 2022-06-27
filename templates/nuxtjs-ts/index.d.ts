import 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $liffInit: Promise<void>
  }
}

declare module '@nuxt/types' {
  interface Context {
    $liffInit: Promise<void>
  }
}
