<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'App',
  data() {
    return {}
  },
  computed: {},
  beforeRouteLeave() {},
  beforeDestroy() {
    this.$bus.off('iframeResize', this.refreshBodySize)
  },
  mounted() {
    this.refreshBodySize()
    this.$bus.on('iframeResize', this.refreshBodySize)
  },
  methods: {
    refreshBodySize() {
      this.parentWidth = this.$route.query.width
      this.parentHeight = this.$route.query.height
      if (this.parentWidth) {
        document.body.style.setProperty('--bodyWidth', Number(this.parentWidth) < 1366 ? '1366px' : (this.parentWidth + 'px'))
        document.body.style.setProperty('--bodyWidthValue', Number(this.parentWidth) < 1366 ? 1366 : Number(this.parentWidth))
        document.body.style.setProperty('--bodyOverflowX', Number(this.parentWidth) < 1366 ? 'auto' : 'hidden')
      } else {
        document.body.style.setProperty('--bodyWidth', window.innerWidth + 'px')
        document.body.style.setProperty('--bodyWidthValue', window.innerWidth)
        document.body.style.setProperty('--bodyOverflowX', 'hidden')
      }
      if (this.parentHeight) {
        document.body.style.setProperty('--bodyHeight', Number(this.parentHeight) < 768 ? '768px' : (this.parentHeight + 'px'))
        document.body.style.setProperty('--bodyHeightValue', Number(this.parentHeight) < 768 ? 768 : Number(this.parentHeight))
        document.body.style.setProperty('--bodyOverflowY', Number(this.parentHeight) < 768 ? 'auto' : 'hidden')
      } else {
        document.body.style.setProperty('--bodyHeight', '100%')
        document.body.style.removeProperty('--bodyHeightValue', '100%')
        document.body.style.setProperty('--bodyOverflowY', 'hidden')
      }
    }
  }
}
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  overflow: hidden;
  padding: 0;
  margin: 0;
  background-color: #f5f5f5;
}
</style>
