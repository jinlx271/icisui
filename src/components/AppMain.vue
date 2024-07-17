<template>
  <section class="app-main">
    <transition name="fade" mode="out-in">
      <!-- <router-view :key="key"></router-view> -->
      <!-- <keep-alive> -->
      <router-view :key="timestamp"></router-view>
      <!-- </keep-alive> -->
    </transition>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'AppMain',
  data() {
    return {
      isRouterAlive: true
    }
  },
  props: {
    readonly: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['timestamp'])
  },
  beforeRouteLeave() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  watch: {
    timestamp() {
      // 详情页面组件更新 页面重新渲染
      this.isRouterAlive = false
      this.$nextTick(function() {
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<style scoped>
.app-main {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  /* background-color: white; */
}
</style>
