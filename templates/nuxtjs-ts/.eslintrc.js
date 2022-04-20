module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:nuxt/recommended'
  ],
  plugins: [
  ],
  rules: {
    'vue/multi-word-component-names': [
      'error',
      {
        'ignores': ['index']
      }
    ]
  }
}
