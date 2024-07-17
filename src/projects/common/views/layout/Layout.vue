<template>
  <div class="HCContiner">
    <div class="Header" v-if="limitFeat!=1" >
      <menuHead @refresh="refresh"></menuHead>
    </div>
    <div class="LMContiner" :key="timestamp" id="commonLayout">
      <iframe id="commonIframe" v-if="$route.query.currentModel.indexOf('/configuration')!= -1 " :src="'http://172.23.15.127:8081/#/configuration?token=tempToken&height='+this.height+'&width='+this.width+'&limitFeat=1&userID='+userInfo.userName" class="w100" style=" border:none;overflow:hidden" @load="setWindowSize"></iframe>
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
    ...mapGetters(['userInfo'])
  },
  mounted() {
    this.width = document.querySelector('#commonLayout').offsetWidth
    this.height = document.querySelector('#commonLayout').offsetHeight
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
         this.timestamp = new Date().getTime()
      },
      immediate: true
    }
  },
  methods: {
    refresh() {
      this.timestamp = new Date().getTime()
    },
    setWindowSize() {
      // var iframe = document.getElementById('commonIframe')
      // var body = iframe.contentDocument || iframe.contentWindow.document
      // body.body.style.width = '100%'
      // console.log('this.height', this.height)
      // body.body.style.height = this.height + 'px'
      // body.body.style.overFlow = 'hidden'
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
