<!-- 基础参数 -->
<template>
  <div class="HDWTime">
    <el-form-item label="参数值" prop="paramValueCopy"></el-form-item>
    <div class="HDWTime__body">
      <el-form-item label="HDW是否启用" prop="enable">
        <el-switch v-model="paramValueCopy.enable" :active-value="'1'" :inactive-value="'0'" active-text="已启用" inactive-text="已禁用"></el-switch>
      </el-form-item>
      <el-form-item label="执行时间" prop="corn">
        <Crontab ref="crontab" @fill="(v)=>{paramValueCopy.corn=v}" :expression="paramValueCopy.corn" hideComponent="result"></Crontab>
      </el-form-item>
    </div>
  </div>
</template>
<script>
import Crontab from '@/components/Crontab'
export default {
  name: 'HDWTime',
  components: { Crontab },
  data: function() {
    return {
      paramValueCopy: {}
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
  created: function() {},
  destroyed() {},
  mounted() {},
  methods: {
    change() {
      return new Promise((resolve, reject) => {
        this.$refs?.crontab?.submitFill()
        this.$emit('update:paramValue', JSON.stringify(this.paramValueCopy))
        resolve()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.HDWTime {
  height: 350px;
  &__body {
    height: 280px;
    overflow: auto;
    background: #f3f5f9;
  }
}
::v-deep .el-form-item__label {
  padding: 0;
  width: 118px !important;
  margin-right: 12px;
}
</style>
