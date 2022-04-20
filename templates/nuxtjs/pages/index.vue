<template>
  <main>
    <h1>create-liff-app</h1>
    <p v-if="message">
      {{ message }}
    </p>
    <p v-if="error">
      <code>{{ error }}</code>
    </p>
    <a href="https://developers.line.biz/ja/docs/liff/" target="_blank" rel="noreferrer">
      LIFF Documentation
    </a>
  </main>
</template>

<script>
export default {
  data () {
    return {
      message: '',
      error: ''
    }
  },
  mounted () {
    // mounted() is rendered when DOM is rendered
    // wait liff.init()
    this.$liffInit
      .then(() => {
        this.message = 'LIFF init succeeded.'
      })
      .catch((e) => {
        this.message = 'LIFF init failed.'
        this.error = e.toString()
      })
  }
}
</script>

<style>
main {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
