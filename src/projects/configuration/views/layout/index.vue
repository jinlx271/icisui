<template>
  <div class="HCContiner">
    <div class="LMContiner" :key="timestamp">
      <div class="Left LeftCss" >
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
import Sidebar from '@/components/Sidebar'
import AppMain from '@/components/AppMain'
import limitFeatMixin from '@/mixins/limitFeatMixin'
export default {
  name: 'Layout',
  mixins: [limitFeatMixin],
  components: {
    Sidebar, AppMain
  },
  data() {
    return {
      timestamp: 0,
      parentWidth: 1366,
      parentHeight: 886
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
    this.refreshBodySize()
  },
  created() { },
  watch: {
    '$route.path': {
      handler: function (val) {
        this.refreshBodySize()
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
    },
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
