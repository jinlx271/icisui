<template>
  <div class="HCContiner">
    <div class="Header" v-if="limitFeat!=1" >
      <menuHead @refresh="refresh"></menuHead>
    </div>
    <div class="LMContiner" :key="timestamp" id="commonLayout">
      <iframe id="commonIframe" v-if="$route.query.currentModel.indexOf('/configuration')!= -1 " :src="'http://172.23.15.127:8081/#/configuration?wardCode='+currentUserWard.wardCode+'&token=tempToken&height='+this.height+'&width='+this.width+'&limitFeat=1&userID='+userInfo.userName" class="w100" style=" border:none;overflow:hidden" ></iframe>
      <iframe id="commonIframe" v-if="$route.query.currentModel.indexOf('/wardOverview')!= -1 " :src="'http://172.23.15.127:8082/#/wardOverview?wardCode='+currentUserWard.wardCode+'&token=tempToken&height='+this.height+'&width='+this.width+'&limitFeat=1&userID='+userInfo.userName" class="w100" style=" border:none;overflow:hidden" ></iframe>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import menuHead from './menuHead/index' // 公共头部
import limitFeatMixin from '@/mixins/limitFeatMixin'
export default {
  name: 'Layout',
  mixins: [limitFeatMixin],
  components: {
    menuHead
  },
  data() {
    return {
      timestamp: 0,
      width: 0,
      height: 0
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'currentUserWard'])
  },
  mounted() {
    this.refreshBodySize()
    window.addEventListener('resize', this.refreshBodySize)
  },
   beforeDestroy() {
    window.removeEventListener('resize', this.refreshBodySize)
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
    },
    '$route.query': {
      handler: function (val) {
        // console.log('val', val)
        this.timestamp = new Date().getTime()
      },
      immediate: true
    }
  },
  methods: {
    refreshBodySize() {
      console.log('refreshBodySize')
      this.width = document.querySelector('#commonLayout').offsetWidth
      this.height = document.querySelector('#commonLayout').offsetHeight
      // this.$bus.emit('iframeResize')
    },
    refresh() {
      this.timestamp = new Date().getTime()
    }

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
