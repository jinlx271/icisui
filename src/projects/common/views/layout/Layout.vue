<template>
  <div class="HCContiner">
    <div class="Header" v-if="limitFeat!=1" >
      <menuHead @refresh="refresh"></menuHead>
    </div>
    <div class="LMContiner" :key="timestamp">
      <div class="Left"  :class="{'LeftCss' : $route.path.indexOf('/configuration')!= -1}" v-if="limitFeat!=1&&$route.path!='/configuration/recordSetting'&&$route.path!='/configuration/recordSettingS'">

        <sidebar></sidebar>
      </div>
      <div class="Main">
        <app-main></app-main>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import menuHead from './menuHead/index' // 公共头部
import { Sidebar, AppMain } from './components'
import limitFeatMixin from '@/views/layout/mixin/limitFeatMixin'
export default {
  name: 'Layout',
  mixins: [limitFeatMixin],
  components: {
    menuHead,
    Sidebar,
    AppMain
  },
  data() {
    return {
      timestamp: 0
    }
  },
  computed: {
    ...mapGetters([])
  },
  mounted() {

  },
  created() { },
  watch: {
    '$route.path': {
      handler: function (val) {
        if (val.indexOf('patient/') == -1) {
          // this.$store.commit('set_patientInfo', {})
        }
      },
      immediate: true
    }
  },
  methods: {
    refresh() {
      this.timestamp = new Date().getTime()
    }
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
    background: #ebeff7;
    .Left {
      width: 120px;
      background: #fff;
      margin: 12px 0px 12px 0px;
      flex-shrink: 0;
    }
    .LeftCss{
      width: 210px !important;
    }
    .Main {
      flex: 1;
      overflow: hidden;
      margin: 12px 12px 12px;
    }
  }
}
</style>
