<template>
  <div class="flex">
    <span class="my-label">{{ attr.label}}</span>
    <el-radio-group class="flex-1" v-model="value" >
      <template v-if="attr.option.from === 'local'">
        <el-radio v-for="item in attr.option.list" :key="item.value" :label="item.value" disable>
          {{item.label}}
        </el-radio>
      </template>
      <template v-else>
        <el-radio label="测试选项" :value="1"></el-radio>
      </template>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: ''
    }
  },
  props: {
    bindValue: {},
    attr: {
      type: Object,
      default: () => ({})
    }
  },
  watch: {
    bindValue: {
      handler() {
        this.value = this.bindValue
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.my-label{
  font-size:14px;
  padding-right:10px;
}
::v-deep .el-radio {
  margin-right: 10px;
  .el-radio__label {
    padding-left: 2px;
  }
}
</style>
