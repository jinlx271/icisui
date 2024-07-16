<template>
  <div class="WndatePicker" ref="WndatePicker" :style="styleCss">
    <!-- 标题 -->
    <span class="head" :style="labelCss">{{title}}</span>
    <!-- 主体 -->
    <wn-date-picker value-format="yyyy-MM-dd HH:mm:ss" @blur="dateChange" :ref="id" :class="{'redCss':compare}" class="datePickerCss" v-model="value" type="datetime" placeholder="请选择日期时间" :disabled="!saveOrUpdate"></wn-date-picker>
  </div>
</template>

<script>
export default {
  name: 'WndatePicker',
  props: {
    obj: {
      type: Object,
      default: () => {}
    },
    id: {
      type: String,
      default: ''
    },
    saveOrUpdate: {
      type: Boolean,
      default: true
    } // 新增/修改
  },
  data() {
    return {
      title: this.obj.title, // 输入名称
      value: this.obj.val, // 重新定义不然会报错
      fontSize: this.obj.fontSize, // 组件字体大小
      color: this.obj.color, // 组件字体颜色
      labelBr: this.obj.labelBr, // 标题是否换行
      labelBottom: this.obj.labelBottom, // 标题下边高度
      labelWidth: this.obj.labelWidth, // 组件标题宽度
      labelColor: this.obj.labelColor, // 标题字体颜色
      labelFontSize: this.obj.labelFontSize, // 标题字体大小
      compare: this.obj.compare // 差异化
    }
  },
  watch: {
    obj: {
      deep: true,
      immediate: true,
      handler: function(obj) {
        this.title = obj.title
        this.value = obj.val
        this.fontSize = obj.fontSize
        this.color = obj.color
        this.labelBr = obj.labelBr
        this.labelBottom = obj.labelBottom
        this.labelWidth = obj.labelWidth
        this.labelColor = obj.labelColor
        this.labelFontSize = obj.labelFontSize
        this.compare = obj.compare

        this.$nextTick(() => {
          // input 元素
          const inputEle = this.$refs[this.id].$el.getElementsByClassName(
            'el-input__inner'
          )[0].style
          inputEle.fontSize = this.fontSize + 'px' // 字体大小
          inputEle.color = this.color // 颜色

          // placeholder 颜色修改
          this.loadStyleString(
            `.${this.id} .el-input__inner{height:${this.fontSize *
              (32 / 13)}px !important;}
          .${this.id} .el-input__inner::-webkit-input-placeholder{color:${
              this.color
            };}
          .${this.id} .el-input__inner::-moz-input-placeholder{color:${
              this.color
            };}
          .${this.id} .el-input__inner::-ms-input-placeholder{color:${
              this.color
            };}`
          )
        })
      }
    }
  },
  computed: {
    /**
     * 标题样式
     */
    labelCss() {
      return {
        width: this.labelWidth + 'px',
        fontSize: this.labelFontSize + 'px',
        color: this.labelColor,
        marginBottom: this.labelBottom + 'px'
      }
    },
    /**
     * 总样式
     */
    styleCss() {
      if (this.labelBr) {
        return {
          flexDirection: 'column'
        }
      }
      return {}
    }
  },
  created() {},
  mounted() {},
  methods: {
    /**
     * 动态添加css 改变组件样式
     * 字体大小 颜色
     */
    loadStyleString(css) {
      const style = document.createElement('style')
      style.type = 'text/css'
      try {
        style.appendChild(document.createTextNode(css))
      } catch (ex) {
        style.styleSheet.cssText = css
      }
      const head = document.getElementsByTagName('head')[0]
      head.appendChild(style)
    },
    /**
     *
     */
    dateChange(item) {
      this.obj.val = this.value // 值
    }
  }
}
</script>
<style lang="scss" scoped>
.WndatePicker {
  display: flex;
  .head {
    display: flex;
    align-items: center;
    margin-right: 10px;
  }
  .datePickerCss {
    flex: 1;
    ::v-deep.el-input__prefix {
      top: 2px !important;
    }
    ::v-deep.el-input__suffix {
      top: 2px !important;
    }
    ::v-deep.el-input__inner{
      padding: 0 30px;
    }
  }
  .redCss{
    color: red;
    ::v-deep.el-input__inner{
      color: red !important;
    }
  }
}
</style>
