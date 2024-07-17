<template>
  <div class="HCContiner">
    <div class="Header" v-if="limitFeat!=1">
      <menuHead></menuHead>
    </div>
    <div class="LMContiner">
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import menuHead from './menuHead/index' // 公共头部
import { AppMain } from '@/components'
import limitFeatMixin from '@/mixins/limitFeatMixin'
export default {
  name: 'HeadLayout',
  mixins: [limitFeatMixin],
  components: {
    menuHead,
    // Navbar,
    // Sidebar,
    AppMain
  },
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters([])
  },
  mounted() {
  },
  created() {},
  methods: {
  },
  beforeDestroy() {

  }
}
</script>

<style lang="scss" scoped>
.HCContiner {
  padding: 0px;
  margin: 0px;
  height: 100%;
  display: flex;
  flex-direction: column;
  .Header {
    height: 50px;
    flex-shrink: 0;
  }
  .LMContiner {
    flex: 1;
    display: flex;
    overflow: hidden;
    .Left {
      width: 200px;
      background: #fff;
      margin: 12px 0px 12px 0px;
      flex-shrink: 0;
    }
    .Main {
      flex: 1;
      overflow: hidden;
      margin: 12px 12px 12px;
      background: #fff;
    }
  }
}
</style>
