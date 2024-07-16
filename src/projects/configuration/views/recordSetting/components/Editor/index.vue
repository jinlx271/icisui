<template>
  <!-- @mouseenter="mouseoverFn" @mouseleave="mouseoverFn('blur')"  @mouseover="mouseoverFn" @mouseout="mouseoverFn('blur')" 事件更改为enter leave 解决滚动条闪的问题-->
  <div ref="editor" class="editor" id="editor" tabindex="0" :class="{ edit: isEdit }" @mouseenter="mouseoverFn" @mouseleave="mouseoverFn('blur')"
       :style="{width: canvasStyleData.width + 'px',height: canvasStyleData.height + 'px', color: canvasStyleData.valueColor||'#000000',transform: scaleComputed}"
       @contextmenu="handleContextMenu" >
       <!--页面组件列表展示-->
    <Shape v-for="(item, index) in componentData" :defaultStyle="item.style" :style="getShapeStyle(item.style)" :key="index+''+item.id"
           @pointMouseup="pointMouseup" :active="item === curComponent||curComponentList.indexOf(item)>=0" :element="item" :index="index" >
      <component :ref="item.id" v-if="item.component == 'v-text'" :docType="docType" class="component" :is="item.component"
                 :style="getComponentStyle(item.style)" :propValue="item.propValue" @input="handleInput" :element="item" />
      <!-- jlx 添加tinymce属性 表格需要增加数据源 增加attr -->
      <component :ref="item.id" v-else-if="item.component == 'TinymceEdit'" :docType="docType" :is="item.component"
                 :style="getComponentStyle(item.style)" :propValue="item.propValue" :element.sync="item" :propStyle="getComponentStyle(item.style)" />
      <!-- jlx component 样式文件 fontsize为0 所以这里区分了一下 tinymce类型的组件 -->
      <component :ref="item.id" v-else class="component" :is="item.component" :docType="docType" :style="getComponentStyle(item.style)"
                 :propValue="item.propValue" :element="item" :propStyle="getComponentStyle(item.style)" :attr="item.attr" />
    </Shape>
    <!-- 右击菜单 -->
    <ContextMenu ref="ContextMenu" @editComponent="editComponent" @refreshCurrCom="refresh"/>
    <!-- 标线 -->
    <MarkLine />

  </div>
</template>

<script>
import Shape from './Shape'
import { getStyle } from '@/utils/utils'
import ContextMenu from './ContextMenu'
import MarkLine from './MarkLine'
import { components } from '@/views/configuration/recordSetting/components/Editor/component-static'
const obj = {}
components.forEach(key => {
  obj[key] = require(`@/views/configuration/recordSetting/custom-component/${key}.vue`).default
})
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: true
    },
    docType: {
      default: 1
    }
  },
  data: function() {
    return {
      selectComponetFlag: false,
      selectArea: {
        startLeft: 0,
        starttop: 0,
        endLeft: 0,
        endTop: 0,
        width: 0,
        height: 0,
        left: 0,
        top: 0
      },
      editorX: 0,
      editorY: 0
    }
  },
  components: { Shape, ContextMenu, MarkLine, ...obj },
  mounted() {
    document.querySelector('#editor').addEventListener('keydown', this.keydownFn)
    document.querySelector('#editor').addEventListener('keyup', this.keyupFn)
    // document.addEventListener('mouseup', this.handlerMouseUp) // 全局响应 弹起
  },
  beforeDestroy() {
    document.querySelector('#editor')?.removeEventListener('keydown', this.keydownFn)
    document.querySelector('#editor')?.removeEventListener('keyup', this.keyupFn)
    // document.removeEventListener('mouseup', this.handlerMouseUp) // 全局响应 弹起
  },
  computed: {
    scaleComputed() {
      return `scale(${this.$store.state.formCreator.canvasStyleData.scale})`
    },
    componentData() {
      // console.log('componentData',)
      return this.$store.state.formCreator.componentData
    },
    curComponent() {
      return this.$store.state.formCreator.curComponent
    },
    multiple() { // 是否多选
      return this.$store.state.formCreator.multiple
    },
    curComponentList() {
      return this.$store.state.formCreator.curComponentList
    },
    canvasStyleData() {
      return this.$store.state.formCreator.canvasStyleData
    },
    selectAreaWidth() {
      return Math.abs(this.selectArea.endLeft - this.selectArea.startLeft) + 'px'
    },
    selectAreaHeight() {
      return Math.abs(this.selectArea.endTop - this.selectArea.startTop) + 'px'
    },
    selectAreaTop() {
        return (Math.min(this.selectArea.endTop, this.selectArea.startTop) - this.editorY) + 'px'
    },
    selectAreaLeft() {
        return (Math.min(this.selectArea.endLeft, this.selectArea.startLeft) - this.editorX) + 'px'
    }
  },
  methods: {

    pointMouseup(e) {
      if (e.pointModify) {
        this.componentData.forEach(item => {
          this.$refs[item.id][0]?.resize?.()
        })
      }
    },
    mouseoverFn(flag) {
      if (flag == 'blur') {
        document.querySelector('#editor').blur()
      } else {
        document.querySelector('#editor').focus()
      }
    },
    keydownFn(e) {
      console.log('e.keyCode' + e.keyCode)
      if (e.keyCode == '37' || e.keyCode == '38' || e.keyCode == '39' || e.keyCode == '40') { // 上下键
        if (e.preventDefault) {
          e.preventDefault()
        } else {
          e.returnValue = false
        }
      }
      if (e.keyCode == '65' && e.ctrlKey) { // 上下键
        if (e.preventDefault) {
          e.preventDefault()
        } else {
          e.returnValue = false
        }
      }
      if (e.keyCode == '83' && e.ctrlKey) { // 上下键
        if (e.preventDefault) {
          e.preventDefault()
        } else {
          e.returnValue = false
        }
      }
      this.$store.commit('setMultiple', +e.keyCode === 16)
      switch (e.keyCode) {
        case '37':
        case 37:
          if (this.curComponentList.length > 0) {
            this.curComponentList.forEach(el => {
              el && el.style ? el.style.left -= 1 : ''
            })
          } else {
            this.curComponent && this.curComponent.style ? this.curComponent.style.left -= 1 : ''
          }
          break
        case '38':
        case 38:
          if (this.curComponentList.length > 0) {
            this.curComponentList.forEach(el => {
              el && el.style ? el.style.top -= 1 : ''
            })
          } else {
            this.curComponent && this.curComponent.style ? this.curComponent.style.top -= 1 : ''
          }
          break
        case '39':
        case 39:
          if (this.curComponentList.length > 0) {
            this.curComponentList.forEach(el => {
              el && el.style ? el.style.left += 1 : ''
            })
          } else {
            this.curComponent && this.curComponent.style ? this.curComponent.style.left += 1 : ''
          }
          break
        case '40':
        case 40:
          if (this.curComponentList.length > 0) {
            this.curComponentList.forEach(el => {
              el && el.style ? el.style.top += 1 : ''
            })
          } else {
            this.curComponent && this.curComponent.style ? this.curComponent.style.top += 1 : ''
          }
          break
        case 46:
          this.deleteCompoment()
          break
        case 65:
          if (e.ctrlKey) { // 全选
            this.$store.commit('setAllComponet')
            e.stopPropagation()
          }
          break
        case 83:
          if (e.ctrlKey) { // 全选
            this.$emit('saveTemp')
            e.stopPropagation()
          }
          break
        default:
          break
      }
    },
    keyupFn(e) {
      if (e.keyCode == '37' || e.keyCode == '38' || e.keyCode == '39' || e.keyCode == '40') { // 上下键
        if (e.preventDefault) {
          e.preventDefault()
        } else {
          e.returnValue = false
        }
      }
      this.$store.commit('setMultiple', false)
    },
    handleContextMenu(e) {
      e.stopPropagation()
      e.preventDefault()
      // 计算菜单相对于编辑器的位移
      // const target = e.target
      const top = e.clientY - e.currentTarget.getBoundingClientRect().top
      const left = e.clientX - e.currentTarget.getBoundingClientRect().left
      // 优化右键菜单的位置
      this.beginFindEditor = false
      this.$store.commit('showContexeMenu', { top: 0, left: 0 })
      this.$nextTick(() => {
        const { clientWidth, clientHeight } = this.$refs.ContextMenu.$refs.ContextMenu
        const { clientWidth: ClientWidth, clientHeight: ClientHeight } = this.$refs.editor
        this.$store.commit('hideContexeMenu')
        this.$store.commit('showContexeMenu', { top: top + clientHeight > ClientHeight ? ClientHeight - clientHeight : top, left: left + clientWidth > ClientWidth ? ClientWidth - clientWidth : left })
      })
    },
    getShapeStyle(style) {
      const result = { ...style }
      if (result.width) {
        result.width += 'px'
      }

      if (result.height) {
       result.height += 'px'
      }

      if (result.top) {
        result.top += 'px'
      }

      if (result.left) {
        result.left += 'px'
      }

      if (result.rotate) {
        result.transform = 'rotate(' + result.rotate + 'deg)'
      }
      return result
    },

    getComponentStyle(style) {
      // jlx 不知道为什么不把width返回
      return getStyle(style, ['top', 'left', 'rotate'])
    },

    handleInput(element, value) {
      element.propValue = value
      // 根据文本组件高度调整 shape 高度
      this.$store.commit('setShapeStyle', {
        height: this.getTextareaHeight(element, value)
      })
    },

    getTextareaHeight(element, text = '') {
      var { lineHeight, fontSize, height } = element.style
      if (lineHeight === '') {
        lineHeight = 1.5
      }
      const newHeight = text.split('\n').length * lineHeight * fontSize
      return height > newHeight ? height : newHeight
    },
    /**
     * 删除组件
     */
    deleteCompoment() {
      if (this.curComponent || this.curComponentList.length > 0) {
        this.$store.commit('deleteComponent')
        this.$store.commit('recordSnapshot')
      }
    },
    editComponent() {
      this.$emit('editComponent')
    },
    refresh() {
      this.$emit('refresComponent')
    }
  }
}
</script>

<style lang="scss" scoped>

.editor {
  position: relative;
  //   margin: 0 auto;
  background: #fff;
  flex-shrink: 0;
  transform-origin: top center;
  user-select: none;
  transform-origin: left top;
  box-shadow: 0px 0px 10px #888888;
}
.edit {
  .selectArea{
    position:absolute;
    // transition-duration: 200ms;
    background:var(--maincolor4);
    border:1px solid var(--maincolor);
    opacity: 0.7;
  }
  .component {
    outline: none;
    width: 100%;
    height: 100%;
    // font-size: 0;
  }
  ::v-deep .el-input {
    font-size: 0;
    height: 100%;
  }
  ::v-deep .el-input__inner {
    font-size: 12px;
  }
}
</style>
