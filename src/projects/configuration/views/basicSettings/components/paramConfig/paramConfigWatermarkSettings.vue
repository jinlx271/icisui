<!-- 基础参数 -->
<template>
  <div class="paramConfigWatermarkSettings">
    <el-form-item label="是否开启水印" prop="enableFlag">
      <el-switch v-model="paramValueCopy.enableFlag" :active-value="'1'" :inactive-value="'0'" active-text="是" inactive-text="否"></el-switch>
    </el-form-item>
    <el-form-item label="水印样式内容" prop="showSet">
      <el-select clearable multiple v-model="paramValueCopy.showSet" placeholder="请选择" style="width:100%">
        <el-option v-for="item in waterMarkList" :key="item.dictCode" :label="item.dictName" :value="item.dictCode"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="水印不透明度" prop="transparency">
      <el-input-number v-model="paramValueCopy.transparency" :min="0" :max="100" label="水印不透明度"></el-input-number>
    </el-form-item>
    <el-form-item label="水印文字紧密程度" prop="showLocation">
      <el-select clearable v-model="paramValueCopy.showLocation" placeholder="请选择" style="width:100%">
        <el-option v-for="item in showLocationList" :key="item.label+item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
  </div>
</template>
<script>
export default {
  name: 'ParamConfigWatermarkSettings',
  components: {},
  data: function() {
    return {
      paramValueCopy: [],
      waterMarkList: [],
      showLocationList: [
        {
          label: '紧密',
          value: '0'
        },
        {
          label: '适中',
          value: '1'
        },
        {
          label: '宽松',
          value: '2'
        }
      ] // 水印文字紧密程度
    }
  },
  props: {
    paramValue: {}
  },
  watch: {
    paramValue: {
      handler: function(val) {
        this.paramValueCopy = JSON.parse(val)
      },
      immediate: true,
      deep: true
    }
  },
  computed: {},
  created: async function() {
    this.waterMarkList = await this.$getDictItemList('ICIS_DICT_WATERMARK')
  },
  mounted() {},
  methods: {
    change() {
      return new Promise((resolve, reject) => {
        this.$emit('update:paramValue', JSON.stringify(this.paramValueCopy))
        resolve()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.ParamConfigWatermarkSettings {
  height: 500px;
}
::v-deep .el-form-item__label {
  padding: 0;
  width: 118px !important;
  margin-right: 12px;
}
</style>
