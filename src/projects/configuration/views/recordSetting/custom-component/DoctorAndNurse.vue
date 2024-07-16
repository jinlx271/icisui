<template>
<div class="flex" >
  <span class="my-label" v-if="attr.label">{{attr.label}}</span>
  <template v-if="!attr.isSplit">
    <el-select
      v-model="value"
      class="my-select flex-1 border-bottom"
      placeholder="请选择"
      :popper-append-to-body="false"
      :filterable="true"
      :allow-create="attr.allowCreate"
      :style="{ lineHeight: propStyle.height }"
      style="height:100%"
      clearable
    >
        <el-option :label="'测试选项'" :value="1"> </el-option>
    </el-select>
  </template>
  <template v-else>
    <el-select
      v-for="item in attr.limit"
      v-model="values[item-1]"
      :key="item"
      clearable
      class="my-select flex-1 border-bottom"
      placeholder="请选择"
      :popper-append-to-body="false"
      :filterable="true"
      :allow-create="attr.allowCreate"
    >
        <el-option :label="'测试选项'" :value="1"> </el-option>
    </el-select>
  </template>
  </div>
</template>

<script>

export default {
  data() {
    return {
      value: '',
      values: []
    }
  },
  props: {
    attr: {
      type: Object,
      default: () => ({})
    },
    propStyle: {}
  },
  components: {

  },
  watch: {
    'attr.limit': {
      handler() {
        if (this.values.length < this.attr.limit) {
          this.values.push(...new Array(this.attr.limit - this.values.length).fill(''))
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.flex{
  flex-wrap: wrap;
  height:100%;
}
.my-label{
  min-width: 40px;
}
.my-select {
  min-width: 60px;
  margin-right:10px;
  ::v-deep .el-input {
    height: 100%;
    line-height: inherit;
    .el-input__inner {
      border: none;
      font-size: 12px;
      height: 100%;
      line-height: inherit;
      padding: 0 2px;
      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
      }
      &:focus {
        border: none;
      }
    }
  }

  ::v-deep .el-input__suffix .el-icon-arrow-up {
    //因为不能清除数据 所以只隐藏三角  不隐藏叉叉
    display: none;
  }

}

.slot-content,
.slot-trigger {
  font-size: 12px;
}
</style>
