<template>
  <div  :id='divId' :class="element.attr.tdBreakLine==1?'breakLine':'tinymceEdit'" v-html="htmlStr"></div>
</template>
<script>
import { debounce } from 'lodash'
import { getKey, getStyle } from '@/utils/utils'
import { renderData, adjustTableWidth, adjustTableHeight } from '../tinymacEditor/tableRender'
export default {
  name: 'TinmceEdit',
  data() {
    return {
      data: {},
      currProStyle: null,
      htmlStr: ''
    }
  },
  props: {
    origData: {
      type: Object,
      default: () => ({})
    },
    propStyle: {
      type: Object,
      default: () => ({})
    },
    element: {
      type: Object,
      require: true
    }
  },
  watch: {
    'propStyle': {
      handler: function (newValue, oldValue) {
        // this.currProStyle = newValue
      }
    },
    'element': function (newValue, oldValue) {
      this.data = this.element.data
      this.currProStyle = this.element.style
    },
    curComponent: function (newValue, oldValue) {
      if (newValue == null && oldValue) {
        this.htmlStr = renderData(false, this.element, getStyle(this.propStyle))
        this.$nextTick(() => {
          this.resize()
        })
      }
    }
  },
  created() {
    this.htmlStr = this.element.htmlStr
    // this.divId = 'TinymceEdit' + this.element?.id + 'dataStr_' + (this.element.attr.dateStr ?? 'yy') + 'curPageNum_' + (this.element.attr.curPageNum ?? '') + '_pageNum_' + (this.element.attr.pageNum ?? '')
  },
  computed: {
    curComponent() {
      return this.$store.state.formCreator.curComponent
    },
    curTempType() {
      return this.$store.state.tempType
    },
    divId() {
      // 由于按照日期创建组件 需要增加以日期来区分的id  以及 页码
      return 'TinymceEdit_' + this.element?.id + '_dataStr_' + (this.element.attr.dateStr ?? 'yy') + 'curPageNum_' + (this.element.attr.curPageNum ?? '') + '_pageNum_' + (this.element.attr.pageNum ?? '')
    }
  },
  mounted() {
    // 通过element Data传数据过来
    this.data = this.element.data
    this.currProStyle = this.element.style
    this.htmlStr = renderData(false, this.element, getStyle(this.propStyle))
  },
  methods: {
    getKey,
    debounceResize() {
      this.debounceResizeSymbol = this.debounceResizeSymbol ? this.debounceResizeSymbol : debounce(function () {
        this.htmlStr = renderData(false, this.element, getStyle(this.propStyle))
      }, 200)
      this.debounceResizeSymbol()
    },

    // shap组件进行调整大小时 调整大小
    resize() {
      const dom = document.getElementById(this.divId)
      if (!dom) return
      let tableDom = dom.getElementsByTagName('table')[0]
      let isHaveTable = true // 判断是否已经创建过table
      if (!tableDom) {
        if (this.data) {
          isHaveTable = false
          tableDom = this.createDocumentFragment(this.data).children[0]
        } else {
          return false
        }
      }
      const newWidth = Number(this.propStyle.width?.split('px')[0]) || tableDom.offsetWidth || tableDom.style.width.split('px')[0]
      const newHeight = Number(this.propStyle.height?.split('px')[0]) || tableDom.offsetHeight || tableDom.style.height.split('px')[0]

      adjustTableWidth(tableDom, newWidth, 'template')
      adjustTableHeight(tableDom, newHeight, 'template')
      if (!isHaveTable) {
        dom.appendChild(tableDom)
      }

      // 这段代码 为了使外部的框架大小 同步表格的大小   否则行数 列数改变后 外部框架不同步  蓝色调整框架
      const componentData_origin = JSON.parse(JSON.stringify(this.$store.state.formCreator.componentData))
      const componentData = componentData_origin.map(v => {
        if (v.id == this.element.id && JSON.stringify(v.attr) == JSON.stringify(this.element.attr)) {
          v.style.width = tableDom.offsetWidth // 用临时变量存放表格的实际大小 避免死循环
          v.style.height = tableDom.offsetHeight
        }
        return v
      })
      this.$store.commit('setComponentData', componentData)
    }
  }

}
</script>
<style lang="scss" scoped>
// @import '/static/tinymce/css/common.css';
.tinymceEdit {
  display: flex;
  flex-direction: column;
  //background: #fff;
  position: absolute;
}
.breakLine{
  table th,  table td, .mce-content-body table th, .mce-content-body table th{
    overflow: hidden !important;
    white-space:none !important;
  }
}
</style>
