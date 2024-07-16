<template>
  <div class="Wntextarea">
    <div class="el-textarea el-input--small">
      <textarea @change="inputChange" :class="{ redCss: compare }" :disabled="!saveOrUpdate" :rows="rows" :readonly="!isItemKey" v-model="textarea" :placeholder="placeholder" :maxlength="maxlength" class="el-textarea__inner" :style="textareaCss"></textarea>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Wntextarea',
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
      textarea: this.obj.textarea, // 输入内容
      placeholder: this.obj.placeholder, // 控件备注
      maxlength: this.obj.maxlength, // 最大输入长度
      fontSize: this.obj.fontSize, // 组件字体大小
      color: this.obj.color, // 组件字体颜色
      rows: this.obj.rows, // 组件可见行数
      showBorder: this.obj.showBorder, // 组件边框显示隐藏
      textalign: this.obj.textalign, // 对齐方式
      isItemKey: this.obj.isItemKey, // 是否能修改
      compare: this.obj.compare // 差异化
    }
  },
  watch: {
    obj: {
      deep: true,
      immediate: true,
      handler: function(obj) {
        this.textarea = obj.textarea
        this.placeholder = obj.placeholder
        this.maxlength = obj.maxlength
        this.fontSize = obj.fontSize
        this.color = obj.color
        this.rows = obj.rows
        this.showBorder = obj.showBorder
        this.textalign = obj.textalign
        this.isItemKey = obj.isItemKey
        this.compare = obj.compare
      }
    }
  },
  created() {},
  computed: {
    /**
     * 标题样式
     */
    textareaCss() {
      return {
        fontSize: this.fontSize + 'px',
        color: this.color,
        resize: 'none',
        border: this.showBorder ? '' : 'none',
        textAlign: this.textalign
      }
    }
  },
  mounted() {},
  methods: {
    /**
     * 修改值不保存,需要弄一个修改方法
     */
    inputChange() {
      this.obj.textarea = this.textarea // 值
    }
  }
}
</script>
<style lang="scss" scoped>
.Wntextarea {
  display: flex;
  align-items: center;
  .redCss {
    color: red !important;
  }
}
</style>
