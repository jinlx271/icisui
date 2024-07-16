<!-- 基础参数 -->
<template>
  <div class="paramConfigCaAutograph">
    <el-form-item label="监护数据" prop="monitor">
      <el-switch v-model="paramValueCopy.monitor" :active-value="'1'" :inactive-value="'0'" active-text="已启用" inactive-text="已禁用"></el-switch>
    </el-form-item>
    <el-form-item label="医嘱执行" prop="orderExecute">
      <el-switch v-model="paramValueCopy.orderExecute" :active-value="'1'" :inactive-value="'0'" active-text="已启用" inactive-text="已禁用"></el-switch>
    </el-form-item>
    <el-form-item label="液体平衡" prop="fluidBalance">
      <el-switch v-model="paramValueCopy.fluidBalance" :active-value="'1'" :inactive-value="'0'" active-text="已启用" inactive-text="已禁用"></el-switch>
    </el-form-item>
    <el-form-item label="管路护理" prop="pipelineCare">
      <el-switch v-model="paramValueCopy.pipelineCare" :active-value="'1'" :inactive-value="'0'" active-text="已启用" inactive-text="已禁用"></el-switch>
    </el-form-item>
    <el-form-item label="皮肤管理" prop="dermaplus">
      <el-switch v-model="paramValueCopy.dermaplus" :active-value="'1'" :inactive-value="'0'" active-text="已启用" inactive-text="已禁用"></el-switch>
    </el-form-item>
    <el-form-item label="患者评估" prop="assess">
      <el-switch v-model="paramValueCopy.assess" :active-value="'1'" :inactive-value="'0'" active-text="已启用" inactive-text="已禁用"></el-switch>
    </el-form-item>
    <el-form-item label="床旁交班" prop="shiftExchange">
      <el-switch v-model="paramValueCopy.shiftExchange" :active-value="'1'" :inactive-value="'0'" active-text="已启用" inactive-text="已禁用"></el-switch>
    </el-form-item>
    <el-form-item label="医嘱管理" prop="docOrder">
      <el-switch v-model="paramValueCopy.docOrder" :active-value="'1'" :inactive-value="'0'" active-text="已启用" inactive-text="已禁用"></el-switch>
    </el-form-item>
    <el-form-item label="护嘱管理" prop="nurseOrder">
      <el-switch v-model="paramValueCopy.nurseOrder" :active-value="'1'" :inactive-value="'0'" active-text="已启用" inactive-text="已禁用"></el-switch>
    </el-form-item>
    <el-form-item label="护理记录" prop="nursingRecord">
      <el-switch v-model="paramValueCopy.nursingRecord" :active-value="'1'" :inactive-value="'0'" active-text="已启用" inactive-text="已禁用"></el-switch>
    </el-form-item>
    <el-form-item label="护理文书签名" prop="nursingRecordSign">
      <el-switch v-model="paramValueCopy.nursingRecordSign" :active-value="'1'" :inactive-value="'0'" active-text="已启用" inactive-text="已禁用"></el-switch>
    </el-form-item>
  </div>
</template>
<script>
export default {
  name: 'ParamConfigCaAutograph',
  components: {},
  data: function() {
    return {
      paramValueCopy: []
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
  created() {},
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
.paramConfigCaAutograph {
  height: 550px;
}
::v-deep .el-form-item__label {
  padding: 0;
  width: 118px !important;
  margin-right: 12px;
}
</style>
