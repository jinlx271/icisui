<!-- 药品剂量管理 -->
<template>
  <div class="flowRateCalcConfig">
    <el-tabs v-model="activeName" class="tabs">
      <el-tab-pane label="流速单位" name="flowRateUnit">
        <FlowRateUnit v-if="activeName == 'flowRateUnit'"></FlowRateUnit>
      </el-tab-pane>
      <el-tab-pane label="剂量单位" name="doseUnit">
        <DoseUnit v-if="activeName == 'doseUnit'"></DoseUnit>
      </el-tab-pane>
      <el-tab-pane label="药品默认流速单位" name="doseDefaultUnit">
        <DoseDefaultUnit v-if="activeName == 'doseDefaultUnit'"></DoseDefaultUnit>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import FlowRateUnit from './components/flowRateUnit'
import DoseUnit from './components/doseUnit'
import DoseDefaultUnit from './components/doseDefaultUnit'
export default {
  name: 'FlowRateCalcConfig',
  components: { FlowRateUnit, DoseUnit, DoseDefaultUnit },
  data: () => {
    return {
      activeName: 'flowRateUnit'
    }
  },
  props: {},
  watch: {},
  computed: {},
  created() { },
  mounted() {},
  methods: {}
}
</script>
<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法

.flowRateCalcConfig {
  background: #fff;
  height: 100%;
  padding: 15px;
  ::v-deep.el-tabs {
    height: 100%;
    .el-tabs__content {
      height: calc(100% - 40px);
      .el-tab-pane {
        height: 100%;
      }
    }
  }
}
</style>
