<!-- 基础参数 -->
<template>
  <div v-if="paramValueCopy" class="paramConfig169">
    <el-checkbox v-model="paramValueCopy.isShowSecond">是否展示秒数</el-checkbox>
    <el-checkbox v-model="paramValueCopy.isShowPopoverDatePicker">是否弹出快捷时间点面板</el-checkbox>
    <el-checkbox v-model="paramValueCopy.isShowPickerPanel">是否弹出日期面板</el-checkbox>
  </div>
</template>
<script>
export default {
  name: 'ParamConfig169',
  components: {},
  data: function () {
    return {
      paramValueCopy: {
        isShowSecond: true,
        isShowPopoverDatePicker: true,
        isShowPickerPanel: true
      }
    }
  },
  props: {
    paramValue: {}
  },
  watch: {
    stringAddList: {
      handler: function (n) {
        try {
          const { string } = n
          if (string) {
            this.paramValueCopy = JSON.parse(JSON.parse(string))
          }
        } catch (error) {
          //
        }
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    string() {
      return JSON.stringify(this.paramValue)
    },
    stringAddList() {
      const { string } = this
      return { string }
    }
  },
  created: async function () {
    if (!this.paramValueCopy) {
      this.paramValueCopy = {
        isShowSecond: true,
        isShowPopoverDatePicker: true,
        isShowPickerPanel: true
      }
    }
    console.log('this.paramValueCopy', this.paramValueCopy)
  },
  mounted() { },
  methods: {
    change() {
      return new Promise((resolve, reject) => {
        this.$store.commit('set_XTCS0169', this.paramValueCopy)
        this.$emit('update:paramValue', JSON.stringify(this.paramValueCopy))
        resolve()
      })
    }
  }
}
</script>
<style lang="scss">
.el-dialog.param-config-dialog {
  .el-dialog__body .el-date-editor .el-input__inner {
    padding-left: 20px;
  }

  .el-input__prefix {
    left: 0;
    right: inherit;
  }
}
</style>
<style lang="scss" scoped>
.paramConfig169 {
  height: 300px;
  display: flex;
  gap: 10px;
  flex-direction: column;
  margin-left: 130px;
}

::v-deep .el-form-item__label {
  padding: 0;
  width: 118px !important;
  margin-right: 12px;
}
</style>
