<!-- 护理记录模板 -->
<template>
  <div class="NursingRecordTemplate" id="NursingRecordTemplate">
    <el-tabs class="tabPart" v-model="activeName" @tab-click="handleClick" :before-leave="tabClickBefore">
        <el-tab-pane v-for="item in typeInfo.list" :label="item.dictName" :name="item.dictCode" :key="item.dictCode" >
        </el-tab-pane>
    </el-tabs>
    <el-container v-if="typeInfo.list.length>0">
      <el-main class="container">
        <div class="left" v-loading="loading">
          <el-select clearable filterable @change='filterWard' v-if="tabName.indexOf('病区')>-1" v-model="currWard" placeholder="请选择">
            <el-option v-for="(option) in wardList" :key="option.wardCode" :label="option.wardName" :value="option.wardCode"></el-option>
          </el-select>
          <el-header>
            <el-button  class="flex1 pl-5"  type="primary" @click="showDialog"><i style="color:#FFF" class="el-icon-plus"></i> 新增模板</el-button>
          </el-header>
          <ul class="header list">
            <li>
              <div class="sortNo">
                序号
              </div>
              <div class="title">
                <span>模板</span>
              </div>
              <span>
                操作
              </span>
            </li>
          </ul>
          <!-- 模板列表 -->
          <ul class="list">
            <li v-for="(item, index) in list" :class="index==leftIndex?'active':''" :key="item.templateId" @click="changeTemp(index)">
              <div class="sortNo">
                  {{item.sortNo}}
                </div>
              <div class="title">
                <span :title="item.templateName">{{item.templateName}}</span>
                <span v-if="tabName.indexOf('个人')>-1" :title="item.templateTypeValue" class="author">{{item.templateTypeValue}} </span>
              </div>
              <span class="flex">
                <el-button @click.stop="modifyRow(item)" type="text" size="small">修改</el-button>
                <el-button class="redCss" @click.stop='deleteRow(item,index)' type="text" size="small">删除</el-button>
              </span>
            </li>
          </ul>
        </div>
        <div class='center'>
          <div class="flex flex-between">
            <el-button type="primary" @click="saveTemplateContent" >保存</el-button>
          </div>
            <Editor :id="tinymceId" :init="init" ref="tinymceEdit" :value="content"   class="editor"></Editor>
        </div>
        <!-- <div class="right flex" :style="{width:tabContentFlag==1?'234px':'54px'}">
          <el-aside width="54px" style="overflow:hidden;" v-if=" fields.length>0">
            <el-button :icon="tabContentFlag == 1?'el-icon-d-arrow-right':'el-icon-d-arrow-left'" style="width:100%;" plain @click="switchTabContent"></el-button>
            <el-tabs tab-position="left" style="height: 100%;" v-model="dataSourceName" @tab-click="tabContentFlag = 1">
              <el-tab-pane v-for="(item,index) in  fields" :key="index" :name="index+''">
                <span slot="label"><i :class="item.icon"></i> </span>
              </el-tab-pane>
            </el-tabs>
          </el-aside>
          <div v-show="tabContentFlag==1" class="tabContent">
            <el-input
              placeholder="输入关键字进行过滤"
              v-model="filterText">
            </el-input>
            <div class="dataSource">
              <el-tree
                :data="fields[dataSourceName].children"
                :props="defaultProps"
                default-expand-all
                :filter-node-method="filterNode"
                node-key="value"
                ref="tree">
                <div slot-scope="{ node,data }"  class="dataItem" >
                  <div @dblclick="insertInfo(data,node)" :data-value="data.value" draggable @dragstart="dragStart">{{ data.label}}</div>
                </div>
              </el-tree>
            </div>

          </div>

        </div> -->
      </el-main>
    </el-container>

    <el-empty description="暂无对应权限，请联系管理员！" style="height:90%;" v-else></el-empty>

    <el-dialog :title="diaglogTitle" :visible.sync="dialogVisible" :before-close="handleClose" width="480px" :close-on-click-modal="false"
               :close-on-press-escape="false">
      <el-form ref="form" :model="formInfo" :rules="formInfoRules" label-width="80px" v-if="dialogVisible">
        <el-form-item label="序号" prop="sortNo">
          <el-input-number v-model="formInfo.sortNo" placeholder="请输入" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="模板名称" prop="templateName">
          <el-input v-model="formInfo.templateName" placeholder="请输入"  maxlength="120"></el-input>
        </el-form-item>
        <el-form-item label="所属病区" v-if="tabName.indexOf('病区')>-1" prop="templateTypeValue">
          <el-select v-model="formInfo.templateTypeValue" clearable filterable placeholder="请选择" @change='selectWard'>
            <el-option v-for="(option) in wardListTemp" :key="option.wardCode" :label="option.wardName" :value="option.wardCode"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="submitData">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { debounce } from 'lodash'
import {
  nursingTemplate_deleteById,
  nursingTemplate_edit,
  nursingTemplate_findAllWithPage,
  nursingTemplate_insert,
  dictItem_findWithPage,
  icuWard_findWithPage,
  nursingTemplate_getMaxSortNo
} from '@/api/configuration'

import tinymce from 'tinymce/tinymce' // tinymce默认hidden，不引入不显示
import Editor from '@tinymce/tinymce-vue'// 编辑器引入
import '../recordSetting/tinymacEditor/tinymce/icons/default/icons.js' // 图标文件
import 'tinymce/themes/silver/theme'// 编辑器主题

import 'tinymce/plugins/link' // 超链接
import 'tinymce/plugins/paste' // 粘贴过滤
import 'tinymce/plugins/lists'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/save'
import 'tinymce/plugins/autoresize'
import { mapGetters } from 'vuex'
// import {
//   patientRecord_getPatientPropertyList
// } from '@/api/patient'
export default {
  name: 'NursingRecordTemplate',
  components: {
    Editor
  },
  data: function () {
    return {
      loading: false,
      // 模板分类信息
      typeInfo: {
        code: 'ICIS_DICT_TEMP_TYPE',
        list: []
      },
      addOrModify: '',
      activeName: '',
      tabName: '',
      // 页面布局
      pagePartsList: [
        {
          width: 4,
          name: 'name1'
        },
        {
          width: 20,
          name: 'name2'
        }
      ],
      // 模板列表
      list: [
      ],
      wardList: [], // 获取分区项目
      wardListTemp: [], // 不包含全部的病区列表
      currWard: '', // 当前病区
      leftIndex: 0, // 左侧模板列表下标
      dialogVisible: false,
      // 弹框显示信息对象
      formInfo: {
        sortNo: 1,
        templateName: '',
        templateTypeValue: ''
      },
      // 当前模板数据
      currentObj: {},
      content: '',
      tinymceId: 'tinymce',
      editorHeight: 230,
      init: {
        auto_fouse: true,
        selector: '#tinymce',
        language_url: '../../../static/tinymce/langs/zh_CN.js', // 汉化路径是自定义的，一般放在public或static里面
        language: 'zh_CN',
        skin_url: '../../../static/tinymce/skins/ui/oxide',
        content_css: ['../../../static/tinymce/css/common.css', '../../../static/tinymce/skins/content/default/content.css'],
        // plugins: this.plugins, // 插件
        // 工具栏
        menubar: false, // 隐藏菜单栏
        plugins: 'charmap lists save ',
        toolbar: 'forecolor backcolor bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | numlist bullist | charmap subscript superscript ',
        placeholder: '在这里输入文字',
        fontsize_formats: '12px 14px 16px 18px 20px 22px 24px 26px 28px 30px 32px 34px 36px 38px 40px 42px 44px 46px 48px',
        branding: false, // 隐藏右下角技术支持
        save_enablewhendirty: false,
        height: 650,
        autoresize_max_height: 650, // 编辑区域的最大高
        autoresize_min_height: 350, // 编辑区域的最小高度
        forced_root_block: '',
        draggable_modal: true,
        // mode: 'textareas',
        force_p_newlines: false,
        resize: false,
        save_onsavecallback: this.saveTemplateContent,
        // init_instance_callback: this.setupFun
        setup: this.setupFun
      },
      diaglogTitle: '',
      formInfoRules: {
        templateName: [
          { required: true, message: '模板名称不能为空', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value.length > 30) {
                callback(new Error('请输入30字以内的模板名称'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        templateTypeValue: [
          { required: true, message: '请选择所属病区', trigger: 'blur' }
        ]
      },
      drawerVisible: false,
      fields: [],
      filterText: '', // 搜索词
      tabContentFlag: 0, // 侧边栏状态
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      dataSourceName: '0'
    }
  },
  props: {},
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  computed: {
    ...mapGetters(['userWardList', 'currentUserWard', 'userInfo'])
  },
  async created() {
    this.getWardData()
    this.getTypeList()
    // const result = await patientRecord_getPatientPropertyList()
    // this.fields.push({
    //   label: '患者基本信息',
    //   children: result.data,
    //   icon: 'el-icon-user-solid'
    // })
    // this.fields.push({
    //   label: '导管信息',
    //   children: [
    //     {
    //       label: '导管记录',
    //       type: 'list',
    //       value: 'catheterList'
    //     }, {
    //       label: '导管名字',
    //       value: 'catheterName'
    //     }, {
    //       label: '导管深度',
    //       value: 'catheterDepth'
    //     }
    //   ],
    //   icon: 'el-icon-user-solid'
    // })
  },
  mounted() {
  },
  methods: {
    // 设置组件的高度
    resetEditorHight() {
      this.editorHeight = document.querySelector('#editor').offsetHeight + 'px'
      if (tinymce.editors['tinymce']) {
        const ele = tinymce.editors['tinymce'].getContainer()
        if (ele != null) {
          const self = this
          setTimeout(function () {
            ele.style.height = self.editorHeight
            tinymce.editors['tinymce'].dom.setStyle(ele, 'height', self.editorHeight) // 设置编辑框的大小
          }, 50)
        }
      }
    },
    // 验证tab是否需要切换
    tabClickBefore(activeName, oldActiveName) {
      if (oldActiveName == activeName) {
        return false
      }
    },
    // 获取模板分类
    getTypeList() {
      const query = {
        pageSize: 100,
        pageNum: 1,
        dictGroupCode: this.typeInfo.code
      }
      dictItem_findWithPage(query).then(res => {
        if (res.code == 0) {
          this.typeInfo.list = []
          res.data.result.forEach(item => {
            item.showFlag = this.$btnHasPerm(['basicSettings:nursingRecordTemplates:' + item.dictAbbr])
            if (item.showFlag === true) {
              this.typeInfo.list.push(item)
            }
          })

          this.activeName = this.typeInfo.list[0].dictCode
          this.tabName = this.dictFormat(this.activeName, this.typeInfo.list)
          this.getTempList(1)
        }
      })
    },
    // 获取病区数据
    getWardData() {
      const query = {
        pageSize: 1000,
        pageNum: 1,
        userName: this.userInfo.userName == 'admin' ? '' : this.userInfo.userName
      }
      icuWard_findWithPage(query).then(res => {
        if (res.code == 0) {
          this.wardListTemp = [...res.data.result]
          this.wardList = res.data.result
          this.wardList.splice(0, 0, { wardCode: '', wardName: '全部' })
        }
      })
    },
    // 获取模板列表
    getTempList(pageNum) {
      if (tinymce?.editors['tinymce'] && tinymce?.undoManager) { // 判断所需对象是否已经创建成功
        tinymce?.editors['tinymce']?.resetContent()
        console.log('getTempList========')
      }
      this.loading = true
      const query = {
        pageSize: 1000,
        pageNum: 1,
        templateTypeDict: this.activeName,
        statusDict: '1' // 去掉启用禁用功能后 将禁用的数据过滤掉
        // templateTypeValue: this.currWard
      }

      if (this.tabName.indexOf('个人') > -1) { // 个人模板需要按照当前用户进行过滤
        query.templateTypeValue = this.userInfo.userName
      } else {
        query.templateTypeValue = '' // this.currWard
      }
      nursingTemplate_findAllWithPage(query).then(res => {
        this.loading = false
        if (res.code == 0) {
          if (this.tabName.indexOf('个人') > -1) { // 个人模板需要按照当前用户进行过滤
            this.list = res.data.result
          } else {
            if (this.currWard == '') {
              this.list = res.data.result
            } else {
              this.list = res.data.result.filter(item => item.templateTypeValue == this.currWard || item.templateTypeValue == '')
            }
          }
          if (this.list.length > 0) {
            this.currentObj = this.list[this.leftIndex]
            this.content = this.list[this.leftIndex].templateContent || ''
            tinymce.editors['tinymce'].setContent(this.content)
          } else {
            tinymce.editors['tinymce'].resetContent()
          }
        }
      })
    },
    filterWard() {
      this.getTempList(1)
    },
    // 切换左侧下标
    changeTemp(index) {
      tinymce.editors['tinymce'].resetContent()
      this.leftIndex = index
      this.content = this.list[this.leftIndex].templateContent || ''
      tinymce.editors['tinymce'].setContent(this.content)
      this.currentObj = this.list[this.leftIndex]
    },
    // 切换tab标签
    handleClick(e) {
        this.list = []
        this.currWard = ''
        this.leftIndex = 0
        this.tabName = this.dictFormat(this.activeName, this.typeInfo.list)
        this.content = ''
        if (this.tabName.indexOf('病区') > -1) {
          this.formInfoRules = {
            templateName: [
                { required: true, message: '模板名称不能为空', trigger: 'blur' },
                {
                  validator: (rule, value, callback) => {
                    if (value.length > 30) {
                      callback(new Error('请输入30字以内的模板名称'))
                    } else {
                      callback()
                    }
                  },
                  trigger: 'blur'
                }
              ],
              templateTypeValue: [
                { required: true, message: '请选择所属病区', trigger: 'blur' }
              ]
            }
        } else {
          this.formInfoRules = {
            templateName: [
                { required: true, message: '模板名称不能为空', trigger: 'blur' },
                {
                  validator: (rule, value, callback) => {
                    if (value.length > 30) {
                      callback(new Error('请输入30字以内的模板名称'))
                    } else {
                      callback()
                    }
                  },
                  trigger: 'blur'
                }
              ]

            }
        }

        this.getTempList(1)
    },
    selectWard(e) {
      // templateTypeValue  只有病区模板才显示这个属性、
    },
    /**
     * 获取最大排序号
     */
    getMaxSortNo() {
      return new Promise((resolve, reject) => {
        nursingTemplate_getMaxSortNo(this.activeName).then(res => {
          resolve(res.data)
        })
      })
    },
    // 新增模板
    async showDialog() {
      this.addOrModify = 'add'
      this.diaglogTitle = '新增模板'
      // const list = [...new Set(this.list.filter(item => item.sortNo).map(item => item.sortNo))]
      // var maxSortNo = Math.max(...list)
      const maxSortNo = await this.getMaxSortNo()
      if (this.tabName.indexOf('病区') > -1) {
        this.formInfo = {
          sortNo: maxSortNo ? maxSortNo + 1 : 1,
          templateName: '',
          templateTypeValue: this.currentUserWard.wardCode
        }
      } else {
        this.formInfo = {
          sortNo: maxSortNo ? maxSortNo + 1 : 1,
          templateName: '',
          templateTypeValue: ''
        }
      }

      this.dialogVisible = true
    },
    // 修改摸板信息
    async modifyRow(obj) {
      this.addOrModify = 'modify'
      this.diaglogTitle = '修改模板'
      this.dialogVisible = true

      this.formInfo = { ...obj }
      if (!this.formInfo.sortNo) {
        const maxSortNo = await this.getMaxSortNo()
        this.formInfo.sortNo = maxSortNo + 1 || 1
      }
    },
    // 删除模板数据
    deleteRow(obj, index) {
      this.$confirm('您确定要删除吗？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        nursingTemplate_deleteById({
          templateId: obj.templateId
        }).then(res => {
          if (this.leftIndex == index) this.leftIndex = index == 0 ? 0 : index - 1
          this.getTempList(1)
          this.$message.success('删除成功！')
        })
      })
    },
    saveTemplateContent() {
      this.addOrModify = 'modify'
      const query = { ... this.currentObj }
      query.templateContent = tinymce.editors['tinymce'].getContent()
      nursingTemplate_edit(query).then(res => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.getTempList(1)
        }
        this.handleClose()
      })
    },
    // 隐藏弹框
    handleClose() {
      this.dialogVisible = false
      this.formInfo = {
        sortNo: 1,
        templateName: '',
        templateTypeValue: ''
      }
    },
    // 保存当前模板信息
    submitData() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return
        }
        const query = this.formInfo
        query.templateTypeDict = this.activeName
        if (this.tabName.indexOf('公用') > -1) {
          query.templateTypeValue = -1
        } else if (this.tabName.indexOf('个人') > -1) {
          query.templateTypeValue = this.userInfo.userName
        }
        if (this.addOrModify == 'add') {
          nursingTemplate_insert(query).then(res => {
            if (res.code == 0) {
              this.getTempList(1)
            }
            this.handleClose()
          })
        } else {
          nursingTemplate_edit(query).then(res => {
            if (res.code == 0) {
              this.getTempList(1)
            }
            this.handleClose()
          })
        }
      })
    },
    // 字段数据格式化
    dictFormat(code, arr) {
      const result = arr.filter(item => item.dictCode == code)
      if (result.length > 0) {
        return result[0].dictName
      } else return ''
    },
    /**
     * 显示抽屉
     */
    showDrawer() {
      this.drawerVisible = true
    },
    /**
     * 过滤
     */
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
        /**
     * 编辑器初始化成功
     * @param {*} editor
     */
     setupFun(editor) {
      editor.on('keydown', function(event) {
        if (event.code == 'Backspace') { // 回退键
          // const target = tinymce.editors['tinymce'].selection.getNode()
          // const rng = tinymce.editors['tinymce'].selection.getRng()
          // const sel = tinymce.editors['tinymce'].selection.getSel()
          // const start = tinymce.editors['tinymce'].selection.getStart()
          // const end = tinymce.editors['tinymce'].selection.getEnd()
          // const isCollapsed = tinymce.editors['tinymce'].selection.isCollapsed()
          // console.log('rng', rng)
          // const dataType = target.getAttribute('data-wn-type')
          // console.log('target', target)
          // debugger
          // if (dataType == 'list') {
            // tinymce.editors['tinymce'].dom.remove(target)
            // event.preventDefault(0)
            // event.stopPropagation()
            // return
          // }
        }
      })
      editor.on('drop', this.drop)
      editor.on('dragover', this.dragOver)
    },
    /**
     * 插入数据源
     */
     insertInfo(data, node) {
      if (!data.children) {
        let placeholderHtml = ''
        if (data.type == 'list') {
          placeholderHtml = '<span  data-wn-type="start" contenteditable=false >【</span>' +
            '<span contenteditable=false data-wn-type="label">' + data.label + '</span>' +
            '<span  data-wn-type="end" contenteditable=false >】</span>'
          placeholderHtml = '<span data-winning  contenteditable=true data-wn-source="' + data.value + '" data-wn-type="list">' + placeholderHtml + '</span>'
        } else {
          placeholderHtml = '<span contenteditable=false data-wn-type="label">【' + data.label + '】</span>'
        }
        tinymce.editors['tinymce'].insertContent(placeholderHtml)
      }
    },
    /**
     * 切换状态
     */
    switchTabContent() {
      this.tabContentFlag = this.tabContentFlag ^ 1
    },
    /**
     * 抓取信息
     * @param {*} event
     */
    dragStart(event) {
      event.dataTransfer.setData('value', event.target.dataset.value)
    },
    /**
     * 拖拽
     * @param {*} event
     */
    dragOver(event) {
      // 需要出发记录tinymce 的光标位置
      const dom = tinymce.editors['tinymce'].dom
      const editor = tinymce.editors['tinymce']
      event.preventDefault()
      if (dom.getContentEditableParent(event.target) == 'false') { // 不可编辑的
        editor.selection.select(event.target)
      } else { // 可编辑
        tinymce.editors['tinymce'].selection.setCursorLocation(event.target, 3)
      }
    },
    /**
     * 拖拽结束
     */
    drop(event) {
      var value = event.dataTransfer.getData('value')
      const data = this.$refs.tree.getNode(value)
      this.insertInfo(data.data)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/config-common.scss';
#NursingRecordTemplate {
  display: block;
  flex: 0%;
  background: #fff;
  height: 100%;
  padding: 0 20px;
  overflow: hidden;
  ::v-deep .el-row {
    display: flex;
    flex-wrap: wrap;
  }
  ::v-deep .el-main {
    padding: 0px;
    height: 100%;
  }
  .el-container {
    height: calc(100% - 50px);
  }
  .container {
    display: flex;
    height: 100%;
  }
  .left {
    width: 240px;
    height: 100%;
    margin-right: 10px;
    ::v-deep .el-input > .el-input__inner {
      width: 240px;
    }
    ::v-deep .el-select {
      margin-bottom: 5px;
    }
    ::v-deep .el-select > .el-input > .el-input__inner {
      width: 238px;
      min-width: 140px;
    }
  }
  .center {
    flex:1;
    height: 100%;
    overflow: hidden;
    .queryButton {
      float: right;
    }
    .editor {
      width:100%;
      height: calc(100% - 20px);
      overflow-y: auto;
    }
    ::v-deep .el-button {
      margin-bottom: 5px;
    }
  }
  .right{
    width:54px;
    height: 100%;
    overflow: hidden;
    .tabContent{
      width:180px;
      height: 100%;
      overflow: hidden;
    }
  }
  .list {
    list-style: none;
    height: calc(100% - 120px);
    overflow-y: auto;
    li {
      font-size: 14px;
      line-height: 30px;
      background: rgb(243, 245, 249);
      padding: 5px 10px;
      margin-top: 5px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .title, span {
        z-index: 1;
      }
      .sortNo{
        width: 40px;
      }
      .title {
        display: flex;
        flex-direction: column;
        span {
          width: 115px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          &:nth-of-type(2) {
            color: #999;
            line-height: 20px;
            font-size: 12px;
          }
        }
      }
      .text {
        width: 100px;
        color: var(--maincolor);
        font-size: 12px;
        text-align: right;
      }
      .redCss {
        color: #f52c2c;
      }
    }
    .active {
      position: relative;
      &::before {
        content: '';
        display: block;
        width: 100%;
        height: 100%;
        background: var(--maincolor);
        opacity: 0.1;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 0;
      }
    }
  }
  .header{
    height: 40px;
    overflow: hidden;
    li{
      color:#999;
    }
  }
  ::v-deep .el-drawer__body{
    overflow-y: hidden;
  }
  ::v-deep .el-dialog__body{
    overflow: hidden;
    height:calc(100% - 40px);
  }
  .dataSource{
    height:calc(100% - 40px);
    overflow-y: auto;
    ::v-deep .el-tree-node__content{
      cursor: auto;
    }
    .dataItem{
      cursor: grab;
      width:100%;
    }
  }
}
</style>
