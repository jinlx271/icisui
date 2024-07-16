<!-- 生命体征记录设置 -->
<template>
  <div id="vitalSignsItemConfig">
    <div class="left">
      <el-container style="height:100%">
        <el-header class="elHeader1">
          <div>
            <i class="iconBlue"></i>
            <span>ICU病区</span>
          </div>
        </el-header>
        <el-container style="height:calc(100% - 132px)">
          <icu-region :defaultPermi="['configuration:basicSettings:vitlSignConfig']" :defaultRegion="defaultRegion" :module="'vitalSigns'"
                      @defaultRegionChange="defaultRegionChange"></icu-region>
        </el-container>
      </el-container>
    </div>
    <div class="rightTop">
      <vitalSignsItemConfigBody :defaultRegion="defaultRegion" ref="vitalSignsItemConfigBody"></vitalSignsItemConfigBody>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex' // 存储方式
import icuRegion from '@/views/configuration/basicSettings/components/icuRegion.vue'
export default {
  name: 'VitalSignsItemConfig',
  components: {
    icuRegion,
    vitalSignsItemConfigBody: () => import('@/views/configuration/basicSettings/vitalSignsItemConfigBody.vue')
  },
  data: function () {
    return {
      defaultRegion: ''
    }
  },
  props: {},
  watch: {},
  computed: {
    ...mapGetters(['currentUserWard'])
  },
  async created() {
    this.defaultRegion = this.currentUserWard.wardCode
  },
  methods: {
    defaultRegionChange(defaultRegion) {
      this.defaultRegion = defaultRegion
      this.$refs.vitalSignsItemConfigBody?.selectRegion(this.defaultRegion)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法

#vitalSignsItemConfig {
  background: #fff;
  padding-bottom: 15px;
  display: flex;
  height: 100%;
  width: 100%;
  // 宽度为70的div 用于页面分
  .left {
    height: 100%;
    width: 25%;
    position: relative;
    margin-right: 10px;
    padding: 12px;
    border-right: 2px solid rgba(203, 215, 238, 0.3);
  }
  .rightTop {
    padding: 12px;
    height: 100%;
    width: calc(100% - 25% - 15px);
  }
}
</style>
