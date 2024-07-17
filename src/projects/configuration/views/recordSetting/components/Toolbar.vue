<template>
  <div>
    <div class="toolbar flex">
      <el-button @click="back" size="mini">返回</el-button>
      <span style="margin-right:auto">{{ tempName }}</span>

      <span class="iconBtn" @click="undo" :class="snapshotIndex <= 0 ? 'disabled' : ''" size="mini" title="撤销"><svg-icon
          icon-class="cancel" style="color:#666"></svg-icon></span>
      <span class="iconBtn" @click="redo" size="mini" title="恢复"><svg-icon icon-class="redo"
          style="color:#666"></svg-icon></span>
      <span class="iconBtn" v-if="docType != 2" @click="() => { saveTemp('add') }" size="mini" title="另存为新模板"><svg-icon
          icon-class="saveas" style="color:#666"></svg-icon></span>
      <span class="iconBtn" @click="() => { saveTemp('update') }" size="mini" title="保存模板"><svg-icon icon-class="save"
          style="color:#666"></svg-icon></span>
      <span class="iconBtn" @click="clearCanvas" size="mini" title="清空"><svg-icon icon-class="clear"
          style="color:#666"></svg-icon></span>
      <span class="iconBtn" @click="print('editor')" size="mini" title="打印"> <svg-icon icon-class="print"
          style="color:#666"></svg-icon></span>
      <span class="iconBtn" size="mini" title="设置" @click="showTempAttr"> <i class="el-icon-setting"
          style="color:#9c9b9b;font-size:20px"></i></span>
      <span class="separator">|</span>
      <el-select style="width:70px;" v-model="alignment" placeholder="对齐" @change='changeAlignment' size="mini">
        <el-option v-for="item in alignmentList" :key="'alignment' + item.value" :label="item.label"
          :value="item.value"></el-option>
      </el-select>
      <span class="separator">|</span>
      <template>
        <span class="min-span">页码</span>
        <el-select style="width:60px;" v-model="currPageNum" placeholder="请选择" @visible-change="visiblechange"
          @change='changeTempPageNum' size="mini">
          <el-option v-for="(item, index) in pageList" :key="index + 'pageList'" :label="index + 1"
            :value="index + 1"></el-option>
        </el-select>
      </template>
      <span class="separator">|</span>

      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link min-span">
          {{ canvasRangeName }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :command="item" v-for="item in canvasRange" :key="item.name">{{ item.name
          }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <span class="separator">|</span>
      <span class="min-span">画布</span>
      <el-input v-model="canvasStyleData.width" placeholder="请输入" style="width:50px" size="mini"></el-input>
      <span> * </span>
      <el-input v-model="canvasStyleData.height" placeholder="请输入" style="width:50px" size="mini"></el-input>

      <span class="min-span">缩放比例</span>

      <el-select v-model="scale" placeholder="请选择" style="width:60px" size="mini">
        <el-option v-for="item in scales" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>

    </div>
    <!-- 预览 -->
    <Preview v-model="isShowPreview" @change="handlePreviewChange" />
    <el-dialog v-el-drag-dialog title="另保存模板" :visible.sync="showDialog" :close-on-click-modal="false" width="520px"
      append-to-body>
      <SaveasTemp :tempData="curTemp" v-if="showDialog" @dialogClose="showDialog = false" :tempList="tempList"
        ref="saveasTemp" @saveasTemp="updateTempList"></SaveasTemp>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="default" @click="showDialog = false">取消</el-button>
        <el-button size="small" type="primary" @click="validate">保存</el-button>
      </span>
    </el-dialog>
    <el-dialog v-el-drag-dialog title="模板属性" :visible.sync="tempAttrDialog" :before-close="hideTempAttr" width="460px"
      append-to-body>
      <el-form ref="attrForm" :model="attrForm" label-width="13em" label-position="left" style="padding: 0 20px;">
        <el-form-item label="显示空页标签" prop="noDataTag" class="flex">
          <el-switch active-value="1" inactive-value="0" v-model="attrForm.noDataTag"></el-switch>
        </el-form-item>
        <el-form-item label="打印时修改页码" prop="printModifyPage" class="flex">
          <el-switch active-value="1" inactive-value="0" v-model="attrForm.printModifyPage"></el-switch>
        </el-form-item>
        <el-form-item label="指定页打印" prop="customPrint" class="flex" label-width="9em">
          <el-select v-model="attrForm.customPrint" placeholder="请选择" size="mini" style="width:160px">
            <el-option v-for="item in customPrintList" :key="'checkboxBoldStyle' + item.value" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="空白页数据不展示组件" prop="noComponent" class="flex">
          <el-switch active-value="1" inactive-value="0" v-model="attrForm.noComponent"></el-switch>
        </el-form-item>
        <el-form-item label="勾选标识样式" label-width="9em" prop="checkboxBoldStyle" class="flex">
          <el-select v-model="attrForm.checkboxBoldStyle" placeholder="请选择" size="mini">
            <el-option v-for="item in checkboxBoldStyleList" :key="'checkboxBoldStyle' + item.value" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="default" @click="hideTempAttr">取消</el-button>
        <el-button size="small" type="primary" @click="saveTempAttr">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SaveasTemp from './savasaTemp.vue'
import generateID from '../utils/generateID'
import toast from '../utils/toast'
import Preview from './Editor/Preview'
import {
  saveTmpDocConfig,
  getTmpDocConfigByTempType
} from '@/api/anas'
import {
  commonList
} from '../custom-component/component-list' // 左侧列表数据
import mixinRecordSetting from '../mixinRecordSetting'
export default {
  mixins: [mixinRecordSetting],
  components: { Preview, SaveasTemp },
  data() {
    return {
      scales: [0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5],
      globalConfig: globalConfig,
      isShowPreview: false,
      scale: 1,
      rpList: [
        { docType: 3, name: '麻、精一' },
        { docType: 6, name: '麻' },
        { docType: 7, name: '精一' },
        { docType: 4, name: '精二' },
        { docType: 5, name: '毒' },
        { docType: 8, name: '普通' }
      ],
      tempTypeTo: null,
      subTitle: '',
      showDialog: false,
      formData: {
        tempName: ''
      },
      action: '',
      curTempId: '',
      currPageNum: 1, // 当前设置的页码
      pageList: [],
      tempAttrDialog: false, // 文书模板属性
      attrForm: { // 模板属性
        noDataTag: '0', // 显示空页标签
        printModifyPage: '0', // 打印时修改页码
        customPrint: '0',
        noComponent: '0', // 空白页不显示组件
        checkboxBoldStyle: '1' // 默认选中加粗加大勾选样式
      },
      alignment: '', // 对齐
      alignmentList: [
        {
          label: '顶端对齐',
          value: '1'
        },
        {
          label: '右对齐',
          value: '2'
        },
        {
          label: '底端对齐',
          value: '3'
        },
        {
          label: '左对齐',
          value: '4'
        },
        {
          label: '水平居中',
          value: '5'
        },
        {
          label: '垂直居中',
          value: '6'
        }
      ],
      checkboxBoldStyleList: [
        {
          label: '默认勾选样式',
          value: '0'
        },
        {
          label: '加粗加大勾选样式',
          value: '1'
        }
      ],
      customPrintList: [
        {
          label: '无',
          value: '0'
        },
        {
          label: '按页码组件+模板页码',
          value: '1'
        }
      ]

    }
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    extendList: {
      type: Array

    },
    tempId: {},
    tempPageNum: {
      type: Number,
      default: 1
    },
    curTemp: {
      type: Object,
      default: () => { }
    },
    tempList: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    tempId: {
      handler() {
        this.curTempId = this.tempId
      },
      immediate: true
    },
    tempPageNum() {
      this.pageList = new Array(this.tempPageNum)
      this.currPageNum = 1
    },
    docType() {
      this.getSubTitle()
      this.tempTypeTo = null
    },
    defaultScale: {
      handler() {
        this.scale = this.defaultScale
      },
      immediate: true
    },
    scale() {
      this.canvasStyleData.scale = this.scale
    },
    '$route': {
      handler() {
        this.$emit('updateTempList')
      },
      immediate: true
    },
    curTemp(newVal) {
      this.changeTemp()
    }
  },
  computed: {
    canvasRangeName() {
      const { width, height } = this.canvasStyleData
      const filterOne = this.canvasRange.filter(v => v.width == width && v.height == height)
      return filterOne.length === 1 ? filterOne[0].name : '非预设尺寸'
    },
    componentData() {
      return this.$store.state.formCreator.componentData
    },
    canvasStyleData() {
      return this.$store.state.formCreator.canvasStyleData
    },
    docType() {
      return this.$store.state.formCreator.tempType
    },
    tempName() {
      return this.$store.state.formCreator.tempName
    },
    snapshotIndex() {
      return this.$store.state.formCreator.snapshotIndex
    },
    defaultScale() {
      return this.canvasStyleData.scale
    }
  },
  created() {
    this.pageList = new Array(this.tempPageNum)
    this.getSubTitle()
  },
  methods: {
    /**
     * 返回上一个页面
     */
    back() {
      this.$router.push({ path: '/configuration/recordSetting/recordTempList', query: this.$route.query })
    },
    handleCommand(item) {
      this.canvasStyleData.width = item.width
      this.canvasStyleData.height = item.height
    },
    addAttr(components) {
      const componentList = [...commonList, ...this.extendList]
      return components?.map(item => {
        const component = componentList.find(ite => item.component != 'TinymceEdit' ? (ite.component === item.component) : (ite.component === item.component && ite.attr.recordTypeDict == item.attr.recordTypeDict))
        // 这里需要区分tinymce类型 不同的类型 attr不相同  交叉表不需要maxCols maxRows   流式表需要该属性
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
          // 删除不需要的属性和样式 配置项 返回的数值有的 需要显示
          if (item.attr) {
            for (const key in item.attr) {
              if (Object.hasOwnProperty.call(item.attr, key)) {
                if (typeof component.attr?.[key] === 'undefined' && !item.attr[key]) { // 判断组件是否有对应的属性且模板返回的组件是否有值 例如评估单有根据数据源动态显示的评估单id要显示，在原生的组件中并没有定于formid属性。但是设置模板内容的时候可能添加了该属性
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
    changeTemp() {
      let tempContent
      try {
        if (!this.curTemp) return
        tempContent = JSON.parse(this.curTemp.tempContent || '{}')[this.currPageNum]

        if (tempContent != null && tempContent != undefined) {
          const componentData = tempContent.components
          const canvasStyle = JSON.parse(this.curTemp.canvasStyle || '{}')
          this.attrForm = Object.assign({ noDataTag: '0', printModifyPage: '0', noComponent: '0', checkboxBoldStyle: '1', customPrint: '0' }, canvasStyle?.attrForm)
          this.$store.commit('setComponentData', this.addAttr(componentData))
          this.$store.commit('setCanvasStyle', canvasStyle)
          this.$store.commit('setCurComponent', {
            curComponent: null,
            index: -1
          })
        }
      } catch (error) {
        this.$message.error('解析模板失败')
      }
    },
    visiblechange(flag) {
      if (flag) {
        this.oldpage = this.currPageNum
      }
    },
    // 切换当前模板的页码
    changeTempPageNum(n, o) {
      const pro = this.$confirm('确认是否保存修改内容', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      pro.then(() => {
        let tempContent
        try {
          // 获取当前模板的对应页码的内容

          tempContent = JSON.parse(this.curTemp.tempContent || '{}')[this.currPageNum]

          if (tempContent != null && tempContent != undefined) {
            const componentData = tempContent.components
            this.$store.commit('setComponentData', this.addAttr(componentData))
            this.$store.commit('setCurComponent', {
              curComponent: null,
              index: -1
            })
          } else {
            this.$store.commit('setComponentData', [])
            if (!this.canvasStyleData) {
              this.$store.commit('setCanvasStyle', {
                width: 932,
                height: 1363,
                labelColor: '#ff0000',
                valueColor: '#000000',
                scale: 1
              })
            }
          }
        } catch (error) {
          this.$message.error('解析模板失败')
        }
      })
      pro.catch(() => {
        this.currPageNum = this.oldpage
      })
    },
    validate() {
      const tempContent = JSON.parse(this.curTemp.tempContent || '{}')
      const sysCode = new Set()
      tempContent[this.currPageNum + ''] = {
        components: this.componentData,
        sysCode: [...sysCode],
        pageNum: this.currPageNum
      }

      this.$refs.saveasTemp.form.canvasStyle = JSON.stringify(this.canvasStyleData)
      this.$refs.saveasTemp.form.tempContent = JSON.stringify(tempContent)
      this.$refs.saveasTemp.saveRecord()
    },
    getSubTitle() {
      this.rpList.forEach(item => {
        if (item.docType == this.docType) {
          this.subTitle = ' —— ' + item.name
        }
      })
    },
    undo() {
      this.$store.commit('undo')
    },
    changeModel() {
      this.$store.commit('changeModel', this.canvasStyleData.model)
    },
    redo() {
      this.$store.commit('redo')
    },

    handleFileChange(e) {
      const file = e.target.files[0]
      if (!file.type.includes('image')) {
        toast('只能插入图片')
        return
      }

      const reader = new FileReader()
      reader.onload = (res) => {
        const fileResult = res.target.result
        const img = new Image()
        img.setAttribute('crossOrigin', 'anonymous')
        img.onload = () => {
          this.$store.commit('addComponent', {
            component: {
              id: generateID() + '_' + this.$dayjs().valueOf(),
              component: 'Picture',
              label: '图片',
              icon: '',
              propValue: fileResult,
              animations: [],
              events: [],
              style: {
                top: 0,
                left: 0,
                width: img.width,
                height: img.height,
                rotate: ''
              }
            }
          })

          this.$store.commit('recordSnapshot')
        }

        img.src = fileResult
      }

      reader.readAsDataURL(file)
    },

    preview() {
      this.isShowPreview = true
      this.$store.commit('setEditMode', 'read')
    },
    saveTemp(action) {
      this.action = action

      if (this.action === 'update') {
        this.formData.tempName = this.curTemp.tempName

        if (!this.curTemp?.id) {
          this.$message.error({ message: '请先选择需要修改的模板', duration: 2500, showClose: true })
          return
        }
        if (this.curTemp.inTemp == 1) {
          this.$message.error({ message: '系统内置模板不允许修改', duration: 2500, showClose: true })
          return
        }
        this.save(false, true)
      } else {
        this.formData.tempName = this.curTemp.tempName + '_复制'
        this.showDialog = true
      }
      // 调用保存接口
    },
    saveTmpDocConfig(params) {
      const componentList = JSON.parse(params.tempContent || '{}')
      const formProSqlIdList = []
      for (var pageNum in componentList) {
        if (componentList[pageNum].components) {
          componentList[pageNum].components.forEach(item => {
            formProSqlIdList.push(item.attr.formProSqlId)
          })
        }
      }
      if (formProSqlIdList.length > 0) {
        params.formProSqlIds = [... new Set(formProSqlIdList)]
      }
      saveTmpDocConfig(params).then((res) => {
        this.$message({
          type: res.msg == '操作成功' ? 'success' : 'warning',
          message: res.msg == '操作成功' ? '保存成功' : res.msg
        })
        this.showDialog = false
        if (params.inTemp != 1) {
          this.curTempId = res.id
        }
        this.$emit('updateTempList')
      })
    },
    save(isCopy, isTemp) {
      // sessionStorage.setItem('canvasData', JSON.stringify(this.componentData))
      // sessionStorage.setItem('canvasStyle', JSON.stringify(this.canvasStyleData))
      // 使用set 防止重复
      const sysCode = new Set()
      if (!this.componentData.length) {
        this.$message.error('请先添加组件')
        return
      }
      this.componentData.forEach(item => {
        switch (item.component) {
          case 'MySelect':
          case 'MyCheckbox':
          case 'MyRadio':
            // 当下拉选择的选项来自字典值并填写了字典值时
            if (item.attr.option?.from === 'sysCode' && item.attr.option.code) {
              sysCode.add(item.attr.option.code)
            }
            break
          // 术前特殊情况
          case 'front-oper-specical-case':
            sysCode.add('front_oper_special_case')
            break
          // 麻醉平面
          case 'AnaesPlane':
            sysCode.add('anaesplaneup_model')
            sysCode.add('anaesplanedown_model')
            break
          // 出室去向
          case 'change-leave-to':
            if (this.docType == 1) {
              sysCode.add('leave_to')
            } else {
              sysCode.add('pacu_leave_to')
            }
            break
          case 'v-text':
            if (item.attr.sysCode) {
              sysCode.add(item.attr.sysCode)
            }
            break
        }
      })
      try {
        const tempContent = JSON.parse(this.curTemp.tempContent || '{}')

        tempContent[this.currPageNum + ''] = {
          components: this.componentData,
          sysCode: [...sysCode],
          pageNum: this.currPageNum
        }
        const params = { ...this.curTemp }

        params.scaling = 1
        params.tempContent = JSON.stringify(tempContent)
        params.canvasStyle = JSON.stringify(this.canvasStyleData)

        params.id = this.curTempId

        if (isCopy) {
          if (!this.tempTypeTo) {
            this.$message.error('请先选择需要复制内容的模板')
            return
          }
          params.tempType = this.tempTypeTo
          getTmpDocConfigByTempType({
            tempType: this.tempTypeTo
          }).then(res => {
            params.id = res.data.id
            this.saveTmpDocConfig(params)
          })

          // return
        } else if (isTemp) {
          // params.inTemp = 1
          params.tempName = this.formData.tempName
          if (this.action === 'update') {
            if (!this.curTemp?.id) {
              this.$message.error('请先选择需要修改的模板')
              return
            }
            params.id = this.curTemp.id
          } else {
            delete params.id
            params.tempPageNum = this.curTemp.tempPageNum
          }
          this.saveTmpDocConfig(params)
        } else {
          this.saveTmpDocConfig(params)
        }
      } catch (error) {
        console.error(error)
      }
    },
    clearCanvas() {
      this.$confirm('是否清空当前内容？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('setComponentData', [])
      })
    },

    handlePreviewChange() {
      this.$store.commit('setEditMode', 'edit')
    },
    /**
     * 设置模板属性
     */
    showTempAttr() {
      this.tempAttrDialog = true
      // if (this.canvasStyleData.attrForm) {
      //   this.attrForm = _.cloneDeep(this.canvasStyleData.attrForm)
      // } else {
      //   this.attrForm = {
      //     noDataTag: '0'
      //   }
      // }
    },
    /**
     * 隐藏模板属性
     */
    hideTempAttr() {
      this.tempAttrDialog = false
    },
    /**
     * 保存模板属性
     */
    saveTempAttr() {
      this.canvasStyleData.attrForm = Object.assign({}, this.attrForm)
      this.saveTemp('update')
      this.hideTempAttr()
    },
    updateTempList() {
      this.$emit('updateTempList')
    },
    /**
     * 对齐
     * val
     * 上对齐 1
     * 右对齐 2
     * 下对齐 3
     * 左对齐 4
     * 水平 5
     * 垂直 6
     */
    changeAlignment(val) {
      console.log(val)
      // 所有选择的元素
      const compomentList = document.querySelectorAll('.active')
      let left = 0
      let top = 0
      let width = 0
      let height = 0
      let id = ''
      if (compomentList.length < 2) {
        this.$nextTick(() => {
          this.alignment = ''
        })
        return
      }
      compomentList.forEach((item, index) => {
        const data = {
          top: item.style.top.split('px')[0] * 1,
          left: item.style.left.split('px')[0] * 1,
          width: item.style.width.split('px')[0] * 1,
          height: item.style.height.split('px')[0] * 1,
          id: item.getAttribute('wn-date-componet')
        }
        switch (val) {
          case '1':
            // 找出最小的上边距离
            top = index == 0 ? data.top : top > data.top ? data.top : top
            break
          case '2':
            // 找出最小的右边距离
            if (index == 0) {
              left = data.left + data.width
            } else if (left < (data.left + data.width)) {
              left = data.left + data.width
              id = data.id
            }
            break
          case '3':
            // 找出最小的下边距离
            if (index == 0) {
              top = data.top + data.height
            } else if (top < (data.top + data.height)) {
              top = data.top + data.height
              id = data.id
            }
            break
          case '4':
            // 找出最小的左边距离
            left = index == 0 ? data.left : left > data.left ? data.left : left
            break
          case '5':
            // 找出最大宽度
            if (index == 0) {
              width = data.width
              left = data.left
            } else if (width < data.width) {
              width = data.width
              left = data.left
            }
            break
          case '6':
            // 找出最大高度
            if (index == 0) {
              height = data.height
              top = data.top
            } else if (height < data.height) {
              height = data.height
              top = data.top
            }
            break
        }
      })
      compomentList.forEach(item => {
        const data = {
          top: item.style.top.split('px')[0] * 1,
          left: item.style.left.split('px')[0] * 1,
          width: item.style.width.split('px')[0] * 1,
          height: item.style.height.split('px')[0] * 1,
          id: item.getAttribute('wn-date-componet')
        }
        switch (val) {
          case '1':
            item.style.top = top + 'px'
            break
          case '2':
            if (id != data.id) {
              item.style.left = left - data.width + 'px'
            }
            break
          case '3':
            if (id != data.id) {
              item.style.top = top - data.height + 'px'
            }
            break
          case '4':
            item.style.left = left + 'px'
            break
          case '5':
            if (id != data.id) {
              item.style.left = (width - data.width) / 2 + left + 'px'
            }
            break
          case '6':
            if (id != data.id) {
              item.style.top = (height - data.height) / 2 + top + 'px'
            }
            break
        }
        // 添加快照
        this.componentData.forEach(res => {
          if (res.id == data.id) {
            res.style.left = item.style.left.split('px')[0]
            res.style.top = item.style.top.split('px')[0]
          }
        })
      })
      this.$store.commit('recordSnapshot')// 初始化添加快照
      // 把之前的对齐选择清空
      this.$nextTick(() => {
        this.alignment = ''
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.min-span {
  min-width: 25px;
  margin: 0 5px;

}

.toolbar {
  height: 64px;

  background: #fff;
  border-bottom: 1px solid #ddd;
  padding: 0 10px;
  display: flex;
  align-items: center;

  ::v-deep.el-button {
    margin-right: 4px;
  }

  ::v-deep.el-input--small {
    margin: 0 4px;
  }

  .insert {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    transition: 0.1s;
    font-weight: 500;
    padding: 9px 15px;
    font-size: 12px;
    border-radius: 3px;
    margin-left: 10px;

    &:active {
      color: #3a8ee6;
      border-color: #3a8ee6;
      outline: 0;
    }

    &:hover {
      background-color: #ecf5ff;
      color: #3a8ee6;
    }
  }

  .iconBtn {
    width: 36px;
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px;
    margin-right: 5px;

    &:hover {
      background: #eee;
      border-radius: 4px;
    }
  }

  .disabled {
    cursor: not-allowed;
  }

  .separator {
    width: 2px;
    margin: 0 5px;
    color: #ddd;
    font-size: 20px;
  }

}
</style>
