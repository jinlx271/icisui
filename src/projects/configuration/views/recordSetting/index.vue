<template>
  <div class="form-creator">
    <main>
      <!-- 左侧组件列表 -->
      <leftVisible :cssLeft="'228'" :leftVisible="leftDivHideShow" @leftVisibleFc="leftVisibleFc">
        <section class="left">
          <el-scrollbar class="left-top">
            <ComponentList v-if="componentListLoaded" :ICIS_DICT_MONI_SVG="ICIS_DICT_MONI_SVG" :fieldsList="fieldsList"
              :extendList="extendList" :key="componentListKey" ref="componentList" />
          </el-scrollbar>
        </section>
      </leftVisible>
      <!-- 中间画布 -->
      <section class="center" id="canvas">
        <Toolbar :title="title" :tempId="tempId" :tempPageNum="tempPageNum" :extendList="extendList"
          :curTemp.sync="curTemp" :tempList.sync="tempList" @updateTempList="getTmpDocConfigList" ref="toolbar" />
        <div ref="content" class="content" @drop="handleDrop" @dragover="handleDragOver"
          @updateTempList="getTmpDocConfigList" id="content" @scroll="canvasScroll" @mousedown="handlerMouseDown">
          <div :style="{
            width: canvasStyleData.width * scale + 'px',
            height: canvasStyleData.height * scale + 'px',
            margin: '0 auto'
          }">
            <!-- 模板编辑区域 -->
            <Editor :docType="docType" ref="editor" @saveTemp="saveTemp" @editComponent="showEditDialog"
              @refresComponent="refreshCurrCom" />
        </div>
        <!-- 框选区域 -->
      </div>
        <div
          :style="{ 'left': selectAreaLeft, 'top': selectAreaTop, 'width': selectAreaWidth, 'height': selectAreaHeight, 'opacity': selectAreaOpacity }"
          class="selectArea" id="selectArea"></div>
      </section>
      <el-dialog title="编辑" :before-close="handleClose" :visible.sync="editIframeFlag" direction="rtl" ref="drawer"
        width="90%">
        <div style="overflow:hidden; height:480px; overflow-x: auto;">
          <TinymceEditor v-if="editIframeFlag" :criticlalRecordIdProp="curComponent.criticlalRecordId"
            :canvasPagesize="canvasPagesize" :height="480" ref="tinymceEditor" @saveRecord="saveRecordSuc"
            @saveRecordError="loading = false"></TinymceEditor>
        </div>
        <div class="el-dialog__footer">
          <el-button @click="cancelForm">取 消</el-button>
          <el-button type="primary" @click="submitTinymceContent" :loading="loading">{{ loading ? '提交中 ...' : '确 定'
          }}</el-button>
        </div>

      </el-dialog>
      <!-- 右侧属性列表 -->
      <el-drawer :visible.sync="isShowAttrDrawer" :withHeader="false" size="500px">
        <AttrList v-if="isShowAttrDrawer" :fieldsList="fieldsList" :multiPageMode="multiPageMode+''" />
      </el-drawer>
    </main>
  </div>
</template>

<script>
import Editor from './components/Editor/index'
import ComponentList from './components/ComponentList' // 左侧列表组件
import AttrList from './components/AttrList' // 右侧属性列表
import TinymceEditor from './tinymacEditor'
import {
  commonList
} from './custom-component/component-list' // 左侧列表数据
import Toolbar from './components/Toolbar'
import { deepCopy } from './utils/utils'
import { getDomPositionByClass } from '@/utils/utils'
import generateID from './utils/generateID'
import {
  findWithPage_criticalRecord,
  getById_criticalRecord
} from '@/api/criticalRecord'
import {
  getTmpAllDocConfigList,
  getTmpDocConfigById // 获取文书模板内容
} from '@/api/anas'
import {
  formProSql_getFormProList // 主界面list
} from '@/api/configuration'
import leaveConfirm from '@/mixins/leaveConfirm'
export default {
  mixins: [leaveConfirm],
  components: { Editor, ComponentList, AttrList, Toolbar, TinymceEditor },
  data() {
    return {
      ICIS_DICT_MONI_SVG: [],
      componentListLoaded: false,
      title: '',
      tempType: '',
      docType: 1,
      activeName: 'attr',
      reSelectAnimateIndex: undefined,
      fieldsList: 'recipel',
      tempId: '',
      tempPageNum: 1,
      // 特护单列表
      extendList: [],
      // 组件列表key值
      componentListKey: '',
      // 数据表格类型 交叉类型还是流式类型
      formList: [],
      isShowAttrDrawer: false,
      curTemp: {},
      curTempIndex: 0,
      tempList: [],
      multiPageMode: '',
      leftDivHideShow: false, // 左边隐藏 显示  左侧隐藏
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
      editorY: 0,
      scrollTop: 0,
      scrollLeft: 0,
      editIframeFlag: false,
      loading: false,
      mouseDownTimeout: -1,
      selectAreaOpacity: 0
    }
  },
  computed: {
    componentData() {
      return this.$store.state?.formCreator?.componentData || {}
    },
    curComponent() {
      return this.$store.state?.formCreator?.curComponent || {}
    },
    scale() {
      return this.$store.state?.formCreator?.canvasStyleData.scale || 1
    },
    canvasStyleData() {
      return this.$store.state?.formCreator?.canvasStyleData || {}
    },
    selectShape() {
      return this.$store.state?.formCreator?.selectShape || false
    },
    selectAreaWidth() {
      return Math.abs(this.selectArea.endLeft - this.selectArea.startLeft) + 'px'
    },
    selectAreaHeight() {
      return Math.abs(this.selectArea.endTop - this.selectArea.startTop) + 'px'
    },
    selectAreaTop() {
      return Math.max(this.editorY, Math.min(this.selectArea.endTop, this.selectArea.startTop)) + 'px'
    },
    selectAreaLeft() {
      return Math.max(this.editorX, Math.min(this.selectArea.endLeft, this.selectArea.startLeft)) + 'px'
    }
  },
  created() {
    const query = this.$route.query
    this.tempId = query.tempId
    this.tempType = query.tempType
    this.tempName = query.tempName
    this.$store.commit('setComponentData', [])
    this.listenCopyAndPaste()
  },
  mounted: async function () {
    const ICIS_DICT_MONI_SVG = await this.$getDictItemList('ICIS_DICT_MONI_SVG')
    this.ICIS_DICT_MONI_SVG = ICIS_DICT_MONI_SVG.map(v => {
      v.dictAbbr = decodeURI(v.dictAbbr)
      v.component = 'VSvg'
      v.name = '图标'
      v.animations = []
      v.events = {}
      v.attr = {
        svgSize: 20,
        svgColor: '#070707'
      }
      v.style = {
        rotate: 0
      }
      return v
    }).filter(v => v.statusDict == 1)
    this.$store.commit('setComponentData', [])
    this.findFormDataList()
    this.init()
    document.addEventListener('mousemove', this.handlerMouseMove)
    document.addEventListener('mouseup', this.handlerMouseUp) // 全局响应 弹起
  },
  beforeDestroy() {
    this.$store.commit('setComponentData', [])// 清空组件数据  避免模板切换时 数据延迟
    this.$store.commit('clearSnapshot')
    document.removeEventListener('mousemove', this.handlerMouseMove)
    document.removeEventListener('mouseup', this.handlerMouseUp) // 全局响应 弹起
  },
  methods: {
    /**
     * 左边隐藏显示
     */
    leftVisibleFc(val) {
      this.leftDivHideShow = val
    },
    init: async function () {
      if (this.$route.path === '/configuration/recordSetting') {
        this.docType = 100
        this.title = '文书模板配置'
        this.fieldsList = 'anesRecord'
      }
      this.$store.commit('setTempType', this.tempType)
      this.$store.commit('setTempName', this.tempName)
      const result = await getTmpDocConfigById({
        id: this.tempId
      })
      this.curTemp = result.data

      try {
        this.tempPageNum = parseInt(result.data.tempPageNum)
        this.multiPageMode = result.data?.multiPageMode || ''
        if (result && result.data.tempContent == null) {
          this.$message.warning('当前没有保存模板，请先保存模板！')
          this.$store.commit('setComponentData', [])
          this.$store.commit('setCanvasStyle', {
            width: 932,
            height: 1363,
            labelColor: '#ff0000',
            valueColor: '#000000',
            scale: 1
          })
          this.componentListLoaded = true
          return
        }
        const componnetsData = JSON.parse(result.data.tempContent || '{}')['1']
        // 默认获取第一个页码的组件数据
        if (componnetsData != null && componnetsData != undefined) {
          // 将新添加的属性添加到模板中
          componnetsData.components = this.addAttr(componnetsData.components)
          this.$store.commit(
            'setComponentData',
            this.resetID(componnetsData.components)
          )
          this.$store.commit('setCanvasStyle', JSON.parse(result.data.canvasStyle || '{}'))
          this.tempId = result.data.id
          this.$store.commit('recordSnapshot')// 初始化添加快照
          this.componentListLoaded = true
        } else {
          this.$message.warning('当前没有保存模板，请先保存模板！')
          this.$store.commit('setComponentData', [])
          this.$store.commit('setCanvasStyle', {
            width: 932,
            height: 1363,
            labelColor: '#ff0000',
            valueColor: '#000000'
          })
          this.componentListLoaded = true
        }
      } catch (error) {
        console.error(error)
        this.$message.warning('模板解析错误，请联系管理员修改')
        this.$store.commit('setComponentData', [])
        this.$store.commit('setCanvasStyle', {
          width: 932,
          height: 1363,
          labelColor: '#ff0000',
          valueColor: '#000000'
        })
        this.componentListLoaded = true
      }
    },
    addAttr(components) {
      const _componentList = [...commonList, ...this.extendList]
      return components?.map(item => {
        const component = _componentList.find(ite => ite.component === item.component)
        if (component) {
          if (component.attr) {
            for (const key in component.attr) {
              if (Object.hasOwnProperty.call(component.attr, key)) {
                const element = component.attr[key]
                if (typeof item.attr?.[key] === 'undefined') {
                  if (item.attr) {
                    item.attr[key] = element
                  } else {
                    item.attr = {
                      [key]: element
                    }
                  }
                }
              }
            }
          }
          if (component.style) {
            for (const key in component.style) {
              if (Object.hasOwnProperty.call(component.style, key)) {
                const element = component.style[key]
                if (typeof item.style?.[key] === 'undefined') {
                  if (item.style) {
                    item.style[key] = element
                  } else {
                    item.attr = {
                      [key]: element
                    }
                  }
                }
              }
            }
          }
          // 删除不需要的属性和样式 配置项
          if (item.attr) {
            for (const key in item.attr) {
              if (Object.hasOwnProperty.call(item.attr, key)) {
                if (typeof component.attr?.[key] === 'undefined') {
                  delete item.attr[key]
                }
              }
            }
          }
          if (item.style) {
            for (const key in item.style) {
              if (Object.hasOwnProperty.call(item.style, key)) {
                if (typeof component.style?.[key] === 'undefined' && key !== 'left' && key !== 'top') {
                  delete item.style[key]
                }
              }
            }
          }
        }
        return item
      })
    },
    listenCopyAndPaste() {
      const ctrlKey = 17
      const vKey = 86
      const cKey = 67
      const xKey = 88
      const zKey = 90
      const yKey = 89
      let isCtrlDown = false

      window.onkeydown = (e) => {
        if (e.target.id !== 'editor') {
          return
        }
        if (e.keyCode == ctrlKey) {
          isCtrlDown = true
          this.$store.commit('setMultiple', e.keyCode == ctrlKey)
        } else if (isCtrlDown && e.keyCode == cKey) {
          this.$store.commit('copy')
        } else if (isCtrlDown && e.keyCode == vKey) {
          this.$store.commit('paste')
        } else if (isCtrlDown && e.keyCode == xKey) {
          this.$store.commit('cut')
        } else if (isCtrlDown && e.keyCode == zKey) {
          this.$store.commit('undo')
        } else if (isCtrlDown && e.keyCode == yKey) {
          this.$store.commit('redo')
        }
      }

      window.onkeyup = (e) => {
        if (e.keyCode == ctrlKey) {
          isCtrlDown = false
        }
      }
    },
    resetID(data) {
      data.forEach((item) => {
        item.id = generateID() + '_' + this.$dayjs().valueOf()
      })

      return data
    },
    // 拖拽组件 松开 编辑器中显示组件
    handleDrop(e) {
      e.preventDefault()
      e.stopPropagation()
      const type = e.dataTransfer.getData('type')
      const componentList = this.$refs.componentList[type]
      let component
      console.log('componentList', componentList)
      if (type == 'componentList') {
        component = deepCopy(componentList.filter(item => item.criticlalRecordId == e.dataTransfer.getData('index'))[0])
      } else {
        component = deepCopy(componentList[e?.dataTransfer?.getData('index')])
      }
      const postion = getDomPositionByClass(this.$refs.editor.$el)
      const scrollTop = this.$refs.content.scrollTop
      const offsetX = (e.pageX - postion.offsetLeft) / this.scale
      const offsetY = (e.pageY - postion.offsetTop + scrollTop) / this.scale
      // const startX = e.dataTransfer.getData('startX')
      // const startY = e.dataTransfer.getData('startY')
      component.style.top = offsetY
      component.style.left = offsetX
      component.id = generateID() + '_' + this.$dayjs().valueOf()
      const tempType = this.$store.state.formCreator.tempType
      // 判断一下默认最大行数值  根据当前摸板  以及组件类型 start
      if (tempType == 3) { // 评估单类型
        if (component.attr.maxRows) {
          component.attr.maxRows = 1
        }
      }
      this.$store.commit('addComponent', { component })
      this.$store.commit('recordSnapshot')
    },

    handleDragOver(e) {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },

    deselectCurComponent() {
      this.$store.commit('setCurComponent', { component: null, index: null })
      this.$store.commit('hideContexeMenu')
      this.$store.commit('setSelectShape', false)
    },
    // 请求报个数据类型
    findFormDataList() {
      formProSql_getFormProList({}).then(res => {
        this.formList = res.data
        this.findRecordPage()
      })
    },

    /** *
     * 获取组件列表
     */
    findRecordPage() {
      const query = {
        pageSize: 1000,
        pageNum: 1
      }
      this.$refs.componentList?.toggleLoading(true)
      findWithPage_criticalRecord(query).then(res => {
        if (res.code == 0) {
          const result = res.data
          this.extendList = []
          result.forEach(item => {
            const criticlalRecordObj = JSON.parse(item.criticlalRecordConfig).data
            const tempObj = this.initComponentData(item.criticlalRecordName, item.criticlalRecordId, item.criticlalRecordTypeDict, item)
            const width = JSON.parse(item.criticlalRecordConfig).w
            const height = JSON.parse(item.criticlalRecordConfig).h
            tempObj.component = 'TinymceEdit'
            tempObj.style.width = width
            tempObj.style.height = height
            tempObj.data = criticlalRecordObj
            this.extendList.push(tempObj)
          })
          this.componentListKey = new Date().getTime()
          console.log('this.extendList', this.extendList)
          // 渲染左侧列表
          this.$refs.componentList?.toggleLoading(false)
        }
      })
    },
    // 获取模板列表
    getTmpDocConfigList() {
      getTmpAllDocConfigList({
        tempType: this.tempType
      }).then(res => {
        this.tempList = res.data
        const result = res.data.filter(item => item.id == this.tempId)
        if (result.length > 0) {
          const result = res.data.filter(item => item.id == this.tempId)
          this.curTemp = Object.assign({}, result[0])
        }
      })
    },
    /**
     * 编辑页面增加保存逻辑
     */
    saveTemp() {
      this.$refs.toolbar.saveTemp('update')
    },
    /**
     * 获取画布的坐标
     */
    getEditorInfo() {
      this.editorY = document.querySelector('#content')?.getBoundingClientRect().top
      this.editorX = document.querySelector('#content')?.getBoundingClientRect().left
    },
    /**
     * 鼠标按下事件 用于获取鼠标起始点坐标
     * @param {*} e
     */
    handlerMouseDown(e) {
      console.log(' handlerMouseDown')
      this.getEditorInfo()
      if (!e.ctrlKey) { //
        this.deselectCurComponent()
      }
      this.$store.commit('setMultiple', e.ctrlKey)
      this.selectArea.startTop = e.clientY
      this.selectArea.startLeft = e.clientX
      this.selectArea.endTop = e.clientY
      this.selectArea.endLeft = e.clientX
      this.selectComponetFlag = true
      // e.returnValue = false
    },
    /**
     * 鼠标移动
     */
    handlerMouseMove(e) {
      if (this.selectComponetFlag) {
        this.selectAreaOpacity = '0.7'
        this.selectArea.endTop = e.clientY
        this.selectArea.endLeft = e.clientX
      }
    },
    /**
     * 鼠标弹起事件 用于计算框选面价的大小
     */
    handlerMouseUp(e) {
      if (this.selectComponetFlag) { //
        const selectDom = document.querySelector('#selectArea')
        const rectRng = selectDom.getBoundingClientRect()
        const compomentList = document.querySelectorAll('.shape')
        if (compomentList.length > 1) this.$store.commit('setMultiple', true)
        compomentList.forEach((node, index) => {
          const rectTemp = node.getBoundingClientRect()
          if (rectTemp && rectRng) {
            if (
              !(rectTemp.y > (rectRng.y + rectRng.height) || rectTemp.y + rectTemp.height < rectRng.y ||
                rectTemp.x + rectTemp.width < rectRng.x || rectTemp.x > rectRng.x + rectRng.width)
            ) {
              const id = node.getAttribute('wn-date-componet')
              const comIndex = node.getAttribute('wn-date-componet-index')
              if (id) {
                const fitlerRe = this.componentData.find(item => item.id == id)
                if (fitlerRe) {
                  this.$store.commit('setCurComponent', {
                    component: fitlerRe,
                    index: comIndex
                  })
                }
              }
            }
          }
        })
        // 框选后 设置left top值为0
        this.selectArea.startTop = 0
        this.selectArea.startLeft = 0
        this.selectArea.endTop = 0
        this.selectArea.endLeft = 0
        this.selectAreaOpacity = '0'
        this.$store.commit('setMultiple', false)
      }
      this.selectComponetFlag = false
    },
    /**
     * 画布的滚动事件
     */
    canvasScroll(e) {
      this.scrollTop = document.querySelector('#content').scrollTop
      this.scrollLeft = document.querySelector('#content').scrollLeft
    },
    /**
     * 现实化组件编辑功能
     */
    showEditDialog() {
      let pagesize = ''
      if (this.$refs.toolbar.canvasStyleData.width > this.$refs.toolbar.canvasStyleData.height) { // 横向
        if (this.$refs.toolbar.canvasStyleData.width == 1510) {
          pagesize = 'A3-横向'
        } else {
          pagesize = 'A4-横向'
        }
      } else {
        if (this.$refs.toolbar.canvasStyleData.width == 1041) {
          pagesize = 'A4-纵向'
        } else {
          pagesize = 'A3-纵向'
        }
      }
      this.canvasPagesize = pagesize
      this.editIframeFlag = true
    },
    /**
     * 关闭编辑弹框
     */
    handleClose() {
      this.editIframeFlag = false
      this.loading = false
    },
    /**
     * 取消内容编辑窗框
     */
    cancelForm() {
      this.editIframeFlag = false
    },
    /**
     * 提交组件内容
     */
    submitTinymceContent() {
      this.loading = true
      this.$refs.tinymceEditor.saveRecord()
    },
    /**
     * 成功保存数据
     */
    saveRecordSuc(data) {
      this.loading = false
      this.editIframeFlag = false
      this.curComponent.data = JSON.parse(data.criticlalRecordConfig).data
      const oldComList = this.componentData
      oldComList.forEach(item => {
        if (item.id == this.curComponent.id) {
          item.data = JSON.parse(data.criticlalRecordConfig).data
        }
        return item
      })
      this.$store.commit('setComponentData', this.resetID(oldComList)) // 这里不进行resetID 页面组件不刷新
    },
    deepMergeObjects (...objects) {
      const deepCopyObjects = objects.map(object => JSON.parse(JSON.stringify(object)))
      return deepCopyObjects.reduce((merged, current) => ({ ...merged, ...current }), {})
    },
    /**
     * 刷新当前组件
     */
    refreshCurrCom() {
      getById_criticalRecord(this.curComponent.criticlalRecordId).then(res => {
        if (res.code == 0) {
          const tempObj = this.initComponentData(res.data.criticlalRecordName, res.data.criticlalRecordId, res.data.criticlalRecordTypeDict, res.data)
          this.curComponent.attr = { ...tempObj.attr, ...this.curComponent.attr }
          // console.log(this.curComponent.attr)
          this.curComponent.attr.mergeCell = tempObj.attr.mergeCell || '0'
          this.curComponent.data = JSON.parse(res.data.criticlalRecordConfig).data
          this.componentData.forEach(item => {
            if (item.id == this.curComponent.id) {
              item.data = JSON.parse(res.data.criticlalRecordConfig).data
            }
            return item
          })
          // 刷新设计界面组件内容。
          // 其次刷新下左侧列表对应组件的内容
          this.extendList.forEach(item => {
            if (item.criticlalRecordId == this.curComponent.criticlalRecordId) {
              item.data = JSON.parse(res.data.criticlalRecordConfig).data
            }
          })
          this.componentListKey = new Date().getTime()
          this.$store.commit('setComponentData', this.resetID(this.componentData)) // 这里不进行resetID 页面组件不刷新
        }
      })
    },
    /**
     * 初始化组件属性
     */
    initComponentData(criticlalRecordName, criticlalRecordId, criticlalRecordTypeDict, obj) {
      const tempObj = {
          component: 'TinymceEdit',
          name: criticlalRecordName,
          data: {},
          criticlalRecordId: criticlalRecordId,
          animations: [],
          events: {},
          style: {
            width: '',
            height: '',
            rotate: '',
            opacity: 1,
            borderColor: '#000',
            color: '#000'

          },
          attr: {
            formProSqlId: '',
            tdBreakLine: 0,
            // proApi: '',
            dataType: '', // 由于业务需要增加dataType字段  用去区分返回数据 区分pagaData pageDataList
            recordTypeDict: criticlalRecordTypeDict,
            mergeCell: obj.mergeCell || '0',
            formId: '' // 护理文书中评估单数据id
          }
        }
      console.log('tempObj', tempObj, tempObj.attr)
      if (criticlalRecordTypeDict != '1') { // 非交叉表 默认一个最大行数
        tempObj.attr.maxRows = 1
        tempObj.attr.limitPageNum = '' //
        tempObj.attr.displayRules = '' // 数据展示规则
        if (criticlalRecordTypeDict == '2') { // 纵向流式表
          tempObj.attr.isShowMaxCols = 0
          tempObj.attr.maxCols = 1
          tempObj.attr.priority = 'row' // 显示优先级 优先显示行  优先显示列
          tempObj.attr.clospanFlag = '0' // 自定义合并单元格
          tempObj.attr.clospanCondition = [
            { preChar: '', paramName: '', operator: '', paramValue: '', afterChar: '', concatChar: '' }
          ] // 自定义合并单元格的 数据格式  预留表达式
          tempObj.attr.clospanExpression = ''
          tempObj.attr.colspanStyle = {
            align: 'center',
            fontSize: '12px',
            strong: 0, //
            em: 0
          }
          // tempObj.attr.rowspanFlag = '0' // 自定义合并单元格
          // tempObj.attr.rowspanCondition = [
          //   { preChar: '', paramName: '', operator: '', paramValue: '', afterChar: '', concatChar: '' }
          // ] // 自定义合并单元格的 数据格式  预留表达式
          // tempObj.attr.rowspanExpression = ''
          tempObj.attr.wordBreak = '0'
        }
      } else {
        tempObj.attr.displayRules = ''
      }
      return tempObj
    }

  },
  watch: {
    $route() {
      this.init()
    },
    isShowAttrDrawer(newVal) {
      if (!newVal) {
        this.deselectCurComponent()
      }
    },
    selectShape(newVal) {
      if (newVal) {
        this.isShowAttrDrawer = true
      } else {
        this.isShowAttrDrawer = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.form-creator {
  height: 100%;
  // background: #fff;
  font-size: 14px;

  main {
    height: 100%;
    position: relative;
    display: flex;

    .left {
      position: absolute;
      height: 100%;
      width: 227px;
      left: 0;

      &-top {
        height: 100%;
        background: #fff;
      }
    }

    .right {
      position: absolute;
      height: 100%;
      width: 262px;
      right: 0;
      top: 0;
    }

    .center {
      height: 100%;
      overflow: auto;

      flex: 1;

      .content {
        height: calc(100% - 64px);
        overflow: auto;
        background: #eee;
        position: relative;

      }

      .selectArea {
        position: fixed;
        // transition-duration: 200ms;
        background: var(--maincolor4);
        border: 1px solid var(--maincolor);

      }
    }
  }

  .placeholder {
    text-align: center;
    color: #333;
  }

  .flex {
    display: flex;
  }

  .flex-ver {
    flex-direction: column;
  }

  .flex-1 {
    flex: 1;
  }

  .my-label {
    color: var(--label-color);
    flex-shrink: 0;
    font-size: 12px;
    line-height: 14px;
  }

  .left-area {
    width: 130px;
    flex-shrink: 0;
  }

  .border-bottom {
    border-bottom: 1px solid var(--label-color);
  }

  .border-left {
    border-left: 1px solid var(--label-color);
  }

  .text-center {
    text-align: center;
  }

  .left-area {
    width: 130px;
    font-size: 12px;
    // border-bottom: 1px solid var(--label-color);
    border-right: 1px solid var(--label-color);

    ul {
      margin: 0;
      padding: 0;
    }

    ul li {
      height: 14px;
      list-style: none;
    }

    .med-name {
      width: 100%;
      border-bottom: 1px solid var(--label-color);
      position: relative;
      cursor: pointer;
      font-size: 12px;

      span {
        display: inline-block;
        min-width: 300px;
        word-break: break-all;
        transform-origin: left;
      }
    }
  }

  .left-area-title {
    display: flex;
    width: 14px;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    border-right: 1px solid var(--label-color);
    text-align: center;
    line-height: 1;
    font-size: 12px;
  }

  .right-area {
    width: 80px;
    border-left: 1px solid var(--label-color);
  }

  .chart-input {
    width: 100%;
    border: none;
    height: 100%;
    outline: none;
    appearance: textfield;
    font-size: 0;

    &.el-select {
      font-size: 12px;

      .el-input__suffix {
        display: none;
      }

      .el-input__inner {
        padding-right: 0;
      }
    }

    .el-input__inner {
      font-size: 12px;
      width: 100%;
      border: none;
      height: 100%;
      outline: none;
      padding: 0 4px;
      appearance: textfield;

      &:focus {
        border: none;
      }
    }
  }
}</style>
