<template>
  <div>
    <Editor v-if="flag" :id="tinymceId" :disabled="disabled" :init.sync="init" :value='myValue' ref="tinymceEdit"
      class="tinymceEdit"></Editor>
    <el-dialog v-el-drag-dialog :custom-class="insertData" :close-on-click-modal="false" :visible.sync="dialogShow" width="680px"
      append-to-body>
      <meta-data-dialog v-if="dialogShow" @close="dialogShow = false" @confirm="insertMetaData"
        :currCell="selectTdDom"></meta-data-dialog>
    </el-dialog>
    <el-dialog v-el-drag-dialog title="占位符设置" top="10vh" :visible.sync="placehodlerDialogFlag" width="1080px" append-to-body>
      <meta-data-dialog v-if="placehodlerDialogFlag" tabNames="placeHolder"  @close="placehodlerDialogFlag=false"
                        @confirm="insertMetaData" :currCell="selectTdDom"  :docId.sync="dataSourceId"></meta-data-dialog>
    </el-dialog>
    <!-- 另存为表格组件 -->
    <el-dialog v-el-drag-dialog title="另存为组件" :visible.sync="saveAsDialogShow" :before-close="dialogClose" width="420px"
      append-to-body>
      <el-form ref="form" :model="form" label-width="120px" :rules="rules">
        <el-form-item label="名称" prop="criticlalRecordName">
          <el-input v-model="form.criticlalRecordName" placeholder="请选择" :maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="criticlalRecordTypeDict">
          <!-- <el-input v-model="form.name" placeholder="请选择"></el-input> -->
          <el-select v-model="form.criticlalRecordTypeDict" placeholder="请选择" disabled>
            <el-option v-for="item in typeList" :key="item.dictCode" :label="item.dictName" :value="item.dictCode"
              :disabled="item.statusDict == '0'">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="序号" prop="sortNo">
          <el-input-number v-model="form.sortNo" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="折行合并单元格" prop="mergeCell">
          <el-switch v-model="form.mergeCell" :active-value="1" :inactive-value="0"
            :disabled="form.criticlalRecordTypeDict != 2" active-text="是" inactive-text="否"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取消</el-button>
        <el-button type="primary" @click="saveAsRecord">保存</el-button>
      </span>
    </el-dialog>
    <el-dialog v-el-drag-dialog title="设置纵向合并规则" :visible.sync="rowspanFlag" :before-close="closeRowspan" width="820px"
      append-to-body>
      <div class="m-b10">
        <div class="m-b10">数据条件</div>
        <div class="flex">
          <div style="width:90px; margin-left:43px;" class="m-r10">(</div>
          <div style="width:440px;" class="m-r10">占位符</div>
          <div style="width:90px;" class="m-r10">运算符</div>
          <div class="m-r10" style="width:60px;" >值</div>
          <div style="width:90px;" class="m-r10">)</div>
          <div style="width:90px;" class="m-r10">与/或</div>
        </div>
        <div class="flex spanCondition m-b10" v-for="(item,index) in rowspanCondition" :key="index">
          <!-- 操作 -->
          <div class="flex m-r10">
            <el-button type="text" @click="addRowSpanCondition(index)" class="el-icon-plus"></el-button>
            <el-button type="text"  @click="deleteRowSpanCondition(index)" class="el-icon-close"> </el-button>
          </div>
          <!-- 前括号 -->
          <el-select v-model="item.preChar" style="width:90px;" class="m-r10" clearable>
            <el-option value="(" label="("></el-option>
          </el-select>
          <!-- 占位符 -->
          <el-select v-model="item.paramName" filterable allow-create  class="m-r10" style="width:440px;">
            <el-option v-for="(item, index) in rowSpanRuleData" :key="index" :label="item.label" :value="item.label" style="height:60px;">
              <div>
                <p style="line-height:1; padding:0 ">{{item.label}} </p>
                <p style="font-size:12px; color:#999; line-height:1; padding:0 ">{{item.dataSource}}</p>
              </div>
            </el-option>
          </el-select>
          <!-- 运算符 -->
          <el-select v-model="item.operator" style="width: 90px;" class="m-r10" clearable>
            <el-option value="<=" label="<="></el-option>
            <el-option value="<" label="<"></el-option>
            <el-option value="==" label="=="></el-option>
            <el-option value=">" label=">"></el-option>
            <el-option value=">=" label=">="></el-option>
          </el-select>
          <!-- 值 -->
          <el-input v-model="item.paramValue" style="width:60px;" class="m-r10"></el-input>
          <el-select v-model="item.afterChar" style="width:90px;" class="m-r10" clearable>
            <el-option value=")" label=")"></el-option>
          </el-select>
          <!-- 与/或 -->
          <div style="width:90px;" class="m-r10">
            <el-select v-model="item.concatChar" v-if="index!=rowspanCondition.length-1" clearable>
              <el-option value="&&" label="与"></el-option>
              <el-option value="||" label="或"></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div  class="m-b10" style="color:#999;font-size:12px;" >条件表达式：{{rowspanExpression}} </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeRowspan">取消</el-button>
        <el-button type="primary" @click="saveRowspan">保存</el-button>
      </span>
    </el-dialog>
    <el-dialog v-el-drag-dialog :visible.sync="dataSourceDialog" title="绑定数据源" width="1120px" :before-close="closeDataSourceDialog" append-to-body top="5vh">
      <div style="padding:10px 0;">
        <span>选择数据源</span>
        <el-select v-model="dataSourceId" filterable clearable :filter-method="getProSqlList" >
          <el-option v-for="item in dataSourceList" :key="item.id" :value="item.id" :label="item.formName"></el-option>
        </el-select>
        <el-divider content-position="left">设置数据源参数</el-divider>
        <div style="height:600px">
           <ParamList :formId.sync="dataSourceId" ref="paramList" ></ParamList>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDataSourceDialog">取消</el-button>
        <el-button type="primary" @click="saveDataSourceId">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getKey } from '@/utils/utils'
import MetaDataDialog from './components/metaDataDialog.vue'
import {
  rowSpanRuleBasicData
} from './rowSpanRuleData.js'
import {
  edit_criticalRecord,
  getById_criticalRecord,
  insert_criticalRecord,
  findAllWithPage_criticalRecord,
  criticalRecord_updateDocId,
  fixedPlaceHolder_freshConfig
} from '@/api/criticalRecord'
import {
  formProSql_listPage,
  dictItem_findAllWithPage
} from '@/api/configuration'
import tinymce from 'tinymce/tinymce' // tinymce默认hidden，不引入不显示
import Editor from '@tinymce/tinymce-vue'// 编辑器引入
import './tinymce/icons/default/icons.js' // 图标文件
import 'tinymce/themes/silver/theme'// 编辑器主题
import './tinymce/plugins/link' // 超链接
import 'tinymce/plugins/paste' // 粘贴过滤
import 'tinymce/plugins/preview' // 预览
import './tinymce/plugins/table' // 表格
import './tinymce/plugins/back' // 返回、
import 'tinymce/plugins/charmap'
import './tinymce/plugins/conversion' // 动态生成交叉表格数据
import './tinymce/plugins/saveas' // 另存为
import 'tinymce/plugins/save' // 保存
import 'tinymce/plugins/print' // 打印
import 'tinymce/plugins/code' // 代码
import './tinymce/plugins/image' // 图片
import './tinymce/plugins/sup'
import './tinymce/plugins/trademark'
import './tinymce/plugins/sub'
import mixinRecordSetting from '@/views/configuration/recordSetting/mixinRecordSetting'
import leaveConfirm from '@/mixins/leaveConfirm'
import ParamList from '../paramConfigCom/paramList.vue'
import {
  getNextSortNo
} from '@/api/anas'
export default {
  mixins: [leaveConfirm, mixinRecordSetting],
  components: {
    Editor, MetaDataDialog, ParamList
  },
  props: {
    criticlalRecordIdProp: { // 组件id
      type: String,
      default: ''
    },
    canvasPagesize: {
      type: String,
      default: ''
    },
    // 内容
    value: {
      type: String,
      default: ''
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    triggerChange: {
      type: Boolean,
      default: false,
      required: false
    },
    // 插件
    plugins: {
      type: [String, Array],
      default: () => ['link', 'preview', 'paste', 'table']
    },
    height: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      placehodlerDialogFlag: false,
      rowSpanRuleData: rowSpanRuleBasicData,
      // 初始化配置
      tinymceId: 'tinymce',
      myValue: this.value,
      // mytinymce: tinymce,
      flag: true,
      selectTdDom: null,
      dialogShow: false,
      rowspanFlag: false,
      init: {
        fixed_toolbar_container: '.app-main',
        selector: '#tinymce',
        resize: false,
        // inline: true,
        language_url: '../../../static/tinymce/langs/zh_CN.js', // 汉化路径是自定义的，一般放在public或static里面
        language: 'zh_CN',
        skin_url: '../../../static/tinymce/skins/ui/oxide',
        content_css: ['../../../static/tinymce/css/common.css', '../../../static/tinymce/skins/content/default/content.css'],
        plugins: 'back conversion save saveas print code preview  table image paste charmap link sup trademark sub',
        // plugins: this.plugins, // 插件
        // 工具栏
        menubar: false, // 隐藏菜单栏
        toolbar: this.criticlalRecordIdProp != ''
        ? 'title | conversion  | pagesize |  table border image | undo redo| bold italic|  forecolor backcolor underline strikethrough charmap sup trademark sub link anchor | alignleft aligncenter alignright alignjustify outdent indent | preview  | formatselect fontselect fontsizeselect '
        : 'title back conversion  | save saveas print pagesize |  table border image | undo redo| bold italic|  forecolor backcolor underline strikethrough charmap sup trademark sub link anchor | alignleft aligncenter alignright alignjustify outdent indent | preview  | formatselect fontselect fontsizeselect ', // 字体大小
        width: 500,
        height: this.height || 500, // 高度
        placeholder: '在这里输入文字',
        fontsize_formats: '3px 4px 5px 6px 7px 8px 9px 10px 11px 12px 14px 16px 18px 20px 22px 24px 26px 28px 30px 32px 34px 36px 38px 40px 42px 44px 46px 48px',
        branding: false, // 隐藏右下角技术支持
        save_enablewhendirty: false,
        save_onsavecallback: this.saveRecord,
        saveas_callback: this.showSaveAs,
        back_callback: this.back,
        conversion_callback: this.createModeData,
        insertMetaData_callback: this.showInsertMetaDialog,
        insertPlacehoder_callback: this.showPlacehoderDialog,
        setRowSpan_callback: this.showRowspanDialog,
        dayjs: this.$dayjs,
        images_upload_url: '',
        images_upload_base_path: '',
        sup_callback: this.insertSup,
        sub_callback: this.insertSub,
        trademark_callback: this.insertTrademark,
        // table_default_attributes: { border: '0' }, // 设置表格默认样式属性
        table_use_colgroups: true, // 应用table_use_colgroups 解决 fixed 合并列表均分问题
        table_sizing_mode: 'fixed', // 设置表格模式  fixed为像素 固定样式  默认为auto %单位
        table_clone_elements: [],
        // 以下黏贴配置 解决 从txt复制内容到表格内部，内容被拆分为多个td的问题
        paste_auto_cleanup_on_paste: true,
        paste_remove_styles: true, // 黏贴功能 清除剪贴板样式等
        paste_remove_styles_if_webkit: true,
        paste_strip_class_attributes: true,
        criticlalRecordTypeDict: this.criticlalRecordTypeDict, // 表格类型
        /*
        去掉强制换行
        forced_root_block: '',
        mode: 'textareas',
        force_p_newlines: false, */
        setup: function (editor) {
          editor.ui.registry.addButton('title', {
            text: '标题',
            onAction: function () {
            }
          })
        },
        extended_valid_elements: 'svg[*],line[*],img[class|src|border=0|alt|title|hspace|vspace|width|height|align|onmouseover|onmouseout|name|onerror|data-mce-onerror]'
      },

      criticlalRecordId: '',
      criticlalRecordTypeDict: '', // 组件类型
      canvasRangeName: this.canvasPagesize || 'A4-横向',
      criticlalRecordName: '',
      // 重症记录单保存数据 名称 类型
      typeList: [
      ],
      form: {
        sortNo: 1,
        criticlalRecordName: '',
        criticlalRecordId: '',
        criticlalRecordTypeDict: '',
        criticlalRecordConfig: JSON.stringify({})
      },
      rules: {
        criticlalRecordName: [
          {
            required: true, message: '请输入组件名称', trigger: 'blur'
          }, {
            message: '名称已存在', trigger: 'blur',
            validator: (rule, value, callback) => {
              this.validatorName(value, callback)
            }
          }
        ],
        criticlalRecordTypeDict: [
          {
            required: true, message: '请选择组件类型', trigger: 'change'
          }
        ]
      },
      // 保存弹框
      saveAsDialogShow: false,
      criticlalRecord: null,
      rowspanDom: [],
      rowspanCondition: [
        { preChar: '', paramName: '', operator: '', paramValue: '', afterChar: '', concatChar: '' }
      ],
      rowspanExpression: '',
      expressionFn: '',
      errorFlag: false,
      dataSourceDialog: false,
      dataSourceId: '',
      dataSourceIdOri: '',

      execSql: '',
      dataSourceList: []
    }
  },
  mounted() {
    this.initData()
    this.getTableTypeList()
  },
  methods: {
    getKey,
    back: async function () {
      this.$router.push({
        path: '/configuration/recordSetting/recordList'
      })
    },
    // 获取数据
    initData() {
      this.criticlalRecordId = this.$route.query.recordId || this.criticlalRecordIdProp
      this.getRecordInfo()
      this.findPage()
    },
    // 获取 数据
    getRecordInfo() {
      const query = this.criticlalRecordId
      this.flag = false
      const _this = this
      getById_criticalRecord(query).then(res => {
        if (res.code == 0) {
          this.criticlalRecord = res.data
          this.myValue = JSON.parse(res.data.criticlalRecordConfig).data
          this.criticlalRecordName = res.data.criticlalRecordName
          this.criticlalRecordTypeDict = res.data.criticlalRecordTypeDict
          this.dataSourceId = this.dataSourceIdOri = res.data.docId || ''
          const self = this
          this.init.setup = function (editor) {
            // 自定义按钮 返回 生成数据  标题
            editor.ui.registry.addButton('title', {
              text: res.data.criticlalRecordName.length > 8 ? res.data.criticlalRecordName.substring(0, 8) + '...' : res.data.criticlalRecordName,
              tooltip: res.data.criticlalRecordName,
              onAction: function () {
              }
            })
            editor.ui.registry.addButton('bindDataSource', {
              text: '绑定数据源',
              onAction: function () {
                self.showDatasourceDialog()
              }
            })
            editor.ui.registry.addButton('addcellbordertop', {
              type: 'menuitem',
              icon: 'cell-border-top',
              tooltip: '顶边框',
              onAction: function() {
                editor.execCommand('addcellbordertop')
              }
            })
            editor.ui.registry.addButton('addcellborderright', {
              type: 'menuitem',
              icon: 'cell-border-right',
              tooltip: '右边框',
              onAction: function() {
                editor.execCommand('addcellborderright')
              }
            })
            editor.ui.registry.addButton('addcellborderbottom', {
              type: 'menuitem',
              icon: 'cell-border-bottom',
              tooltip: '底边框',
              onAction: function() {
                editor.execCommand('addcellborderbottom')
              }
            })
            editor.ui.registry.addButton('addcellborderleft', {
              type: 'menuitem',
              icon: 'cell-border-left',
              tooltip: '左边框',
              onAction: function() {
                editor.execCommand('addcellborderleft')
              }
            })

            editor.ui.registry.addButton('deletecellborder', {
              type: 'menuitem',
              icon: 'cell-border-clear',
              tooltip: '无边框',
              onAction: function() {
                editor.execCommand('deletecellborder')
              }
            })
            editor.ui.registry.addButton('addcellborderaround', {
              type: 'menuitem',
              icon: 'cell-border-around',
              tooltip: '外边框',
              onAction: function() {
                editor.execCommand('addcellborderaround')
              }
            })
            editor.ui.registry.addButton('addcellborder', {
              type: 'menuitem',
              icon: 'cell-border-all',
              tooltip: '所有边框',
              onAction: function() {
                editor.execCommand('addcellborder')
              }
            })
            editor.ui.registry.addButton('deletecellslash', {
              type: 'menuitem',
              icon: 'delete-cell-slash',
              tooltip: '无斜线',
              onAction: function() {
                editor.execCommand('deletecellslash')
              }
            })
            editor.ui.registry.addButton('diagonalslash', {
              type: 'menuitem',
              icon: 'cell-diagonal',
              tooltip: '对角线',
              onAction: function() {
                editor.execCommand('diagonalslash')
              }
            })
            editor.ui.registry.addGroupToolbarButton('border', {
              icon: 'cell-border-all',
              tooltip: '边框',
              items: 'diagonalslash deletecellslash | deletecellborder addcellborder addcellborderaround addcellbordertop addcellborderright addcellborderbottom addcellborderleft'
            })
            const pageList = _this.canvasRange.map((v) => {
              return {
                type: 'menuitem',
                text: v.name,
                onAction: function () {
                  _this.$confirm('确认是否保存修改内容', '确认信息', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    _this.canvasRangeName = v.name
                    _this.flag = false
                    _this.$nextTick(() => {
                      _this.flag = true
                    })
                  })
                }
              }
            }, '')
            editor.ui.registry.addMenuButton('pagesize', {
              text: _this.canvasRangeName,
              tooltip: '页面尺寸',
              fetch: function (callback) {
                callback(pageList)
              }
            })
          }

          this.flag = true
          //   tinymce.editors['tinymce'].setContent(this.myValue)
          if (this.criticlalRecordTypeDict != '1') { // 交叉表
            this.init.toolbar = this.criticlalRecordIdProp != ''
            ? 'title | insertMetaData| pagesize| table border image linlk |  undo redo| bold italic|  forecolor backcolor underline strikethrough charmap sup trademark sub link anchor | alignleft aligncenter alignright alignjustify outdent indent | preview | bindDataSource | formatselect fontselect fontsizeselect '
            : 'title back insertMetaData| save  saveas print  pagesize| table border image linlk |  undo redo| bold italic|  forecolor backcolor underline strikethrough charmap sup trademark sub link anchor | alignleft aligncenter alignright alignjustify outdent indent | preview | bindDataSource | formatselect fontselect fontsizeselect '
          }
          this.init.criticlalRecordTypeDict = this.criticlalRecordTypeDict // 表格类型
          tinymce.init({

          })
          this.$nextTick(() => {
            // 重构tinymce 设置字体大小的方法
            tinymce.editors['tinymce'].editorCommands.commands.exec.fontsize = function (command, ui, value) {
              const num = Number(value.split('px')[0])
              if (num < 12) {
                const zoom = num / 12 + ''
                value = 12
                tinymce.editors['tinymce'].formatter.get().fontsize[0].styles = { fontSize: '%value', zoom: zoom }
              } else {
                tinymce.editors['tinymce'].formatter.get().fontsize[0].styles = { fontSize: '%value', zoom: '1' }
              }
              tinymce.editors['tinymce'].formatter.toggle('fontsize', { value: value })
              tinymce.editors['tinymce'].nodeChanged()
            }
          })
        }
      })
    },
    // 保存数据
    saveRecord() {
      // 需要获取元素的宽高
      // const tempDom = tinymce.editors['tinymce'].getContentAreaContainer()
      const tempDom = tinymce.editors['tinymce'].getDoc()
      const body = tempDom.getElementsByTagName('table')[0]
      // 把table中tr 的保存
      if (!body) {
        this.$message({
          type: 'info',
          message: '请设置表格内容'
        })
        return
      }
      const width = body.clientWidth
      const height = body.clientHeight
      let outHTML = body.outerHTML

      outHTML = outHTML.replaceAll('²', '&sup2;')
      outHTML = outHTML.replaceAll('®', '&reg;')
      outHTML = outHTML.replaceAll('₂', '&#8322;')
      const configObj = {
        data: outHTML,
        w: width,
        h: height
      }
      const query = {
        criticlalRecordConfig: JSON.stringify(configObj),
        criticlalRecordId: this.criticlalRecordId,
        criticlalRecordName: this.criticlalRecordName,
        criticlalRecordTypeDict: this.criticlalRecordTypeDict
      }
      edit_criticalRecord(query).then(res => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.$emit('saveRecord', query)
      }).catch(e => {
        this.$emit('saveRecordError')
      })
    },
    /**
    * 交叉表关键字段生成数据
     */
    createModeData() {
      const tempDom = tinymce.editors['tinymce'].getDoc()
      const tableDom = tempDom.getElementsByTagName('table')[0]

      const trList = tableDom.getElementsByTagName('tr')
      const rowKey = []
      let colKey = []

      let minRowIndex = 0 // 记录最小的行index
      let minColIndex = 0 // 记录最小的列index
      let isFirstFlag = false
      for (let rowIndex = 0; rowIndex < trList.length; rowIndex++) { // 行
        const row = trList[rowIndex]
        let tdList = []
        tdList = row.querySelectorAll('[data-col-type=colContent]') // 设置内容
        if (tdList.length == 0) {
          tdList = Array.from(row.getElementsByTagName('td')) // 设置内容
        }
        for (let colIndex = 0; colIndex < tdList.length; colIndex++) { // 列
          if (colIndex == 0) {
            colKey = []
          }
          const col = tdList[colIndex]
          const textValue = col.textContent

          if (textValue.indexOf('${') > -1) {
            if (!isFirstFlag) {
              minRowIndex = rowIndex
              minColIndex = colIndex
              isFirstFlag = true
            }
            const keyList = this.getKey(textValue)
            // 这里需要考虑一个td 有多个值得情况
            if (keyList.length > 0) {
              // const arrList =  key.split('.')  //td中设置的关键字  多种可能 WN_ICIS_MONI_10510101.08:00:00.moniitemValue_L WN_ICIS_MONI_10510101.08:00:00
              const keyX = keyList.map(key => { return key.split('.')[1] || '' }) // x轴的坐标
              const keyY = keyList.map(key => { return key.split('.')[0] || '' }) // y轴的坐标
              if (rowIndex == minRowIndex) {
                rowKey.push(keyX[0])
              }
              if (colIndex == minColIndex) {
                colKey.push(keyY)
              }
            }
          } else if (textValue == '') { // 等于空的时候 赋值
            if (colIndex > minColIndex && rowIndex > minRowIndex) {
              if (colKey.length > 0) {
                let tdText = ''
                let htmlContent = tdList[0].innerHTML

                colKey[colKey.length - 1].forEach(key => { // 考虑一个单元格 有多个关键字
                  htmlContent = htmlContent.replace('${' + key + '.' + rowKey[minColIndex], '${' + key + '.' + rowKey[colIndex - minColIndex]) // 只对横纵坐标进行替换
                  htmlContent = htmlContent.replace(key + '.' + rowKey[minColIndex], key + '.' + rowKey[colIndex - minColIndex]) // 只对横纵坐标进行替换
                })
                tdText = htmlContent
                col.innerHTML = tdText
              }
            }
          }
        }
      }
    },
    /**
     * 显示弹框
     */
    showInsertMetaDialog(e) {
      this.selectTdDom = e[0]
      this.dialogShow = true
      document.querySelector('.tox-tinymce-aux').innerHTML = ''
    },
    /**
     * 关闭弹框
     */
    closeInsertMetaDialog() {
      this.dialogShow = false
    },
    /**
     * 插入数据
     */
    insertMetaData(data) {
      // 这里如果获取到对应的单元格最好
      // tinymce.editors['tinymce'].insertContent(data.tdContent) 用insert 如果先添加斜线  会出现文字包含在斜线内部的情况   所有采用追加的方式
      // 判断是否自动加了 br标签  在末尾
      // 去掉原来的数据

      Array.from(this.selectTdDom.dom.childNodes).forEach(dom => { // 按照插入监护项时 将手动插入的纯文本 删除掉
        const parantNode = dom.parentNode
        if (parantNode && dom.nodeName == '#text') {
          parantNode.removeChild(dom)
        }
      })

      // this.selectTdDom.dom.innerText = '' // 清除文本信息
      const wnDataList = Array.from(this.selectTdDom.dom.querySelectorAll('[data-winning]'))
      wnDataList.forEach(dom => {
        const parantNode = dom.parentNode
        if (parantNode) {
          parantNode.removeChild(dom)
        }
      })
      // data-mce-cellslash-parent 保留斜线

      let innerHTML = this.selectTdDom.dom.innerHTML
      if (innerHTML.endsWith('<br>') || innerHTML.endsWith('<br data-mce-bogus="1">')) {
        innerHTML = innerHTML.replace(/(<br>)/g, '')
        innerHTML = innerHTML.replace(/(<br data-mce-bogus="1">)/g, '')
        this.selectTdDom.dom.innerHTML = innerHTML + data.tdContent
      } else {
        this.selectTdDom.dom.innerHTML += data.tdContent
      }
      if (this.criticlalRecordTypeDict == '2' && data.quickEditFlag) { // 通用流式表的编辑功能 且勾选快捷功能
        var keyList = this.getKey(this.selectTdDom.dom.innerText)
        const recordIDs = keyList.map(item => {
          return '${' + item + '_ID}'
        })
        this.selectTdDom.dom.setAttribute('data-moniitemCodes', keyList.join('|'))
        this.selectTdDom.dom.setAttribute('data-moniitemRecordIDs', recordIDs.join('|'))
        this.selectTdDom.dom.setAttribute('data-moniitemNames', data.metaName)
        if (keyList.includes('NURSERECORD')) {
          this.selectTdDom.dom.setAttribute('data-nurseRecordId', '${NURSERECORDID}')
        }
        if (keyList.includes('INCONTENT') || keyList.includes('INMEASURE')) { // 入量
          // [INMEASURE_SUPPLEMENT_CODE],[INMEASURE_LIQUID_CODE],[OUTMEASURE_LIQUID_CODE]' inmeasure
          this.selectTdDom.dom.setAttribute('data-inmeasureCode', '${INMEASURE_SUPPLEMENT_ID}')
          this.selectTdDom.dom.setAttribute('data-inmeasureLiquidCode', '${INMEASURE_LIQUID_ID}')
        }
        if (keyList.includes('OUTCHARACTER') > -1) { // 性状
          this.selectTdDom.dom.setAttribute('data-outCharacterLiquidCode', '${OUTMEASURE_LIQUID_OUTCHARACTER_ID}')
        }
        if (keyList.includes('OUTCONTENT') || keyList.includes('OUTMEASURE')) { // 出量
          this.selectTdDom.dom.setAttribute('data-outmeasureLiquidCode', '${OUTMEASURE_LIQUID_ID}')
        }
        this.selectTdDom.dom.setAttribute('data-recordTime', '${ROWRECORDTIME}')
      } else {
        this.selectTdDom.dom.removeAttribute('data-outCharacterLiquidCode')
        this.selectTdDom.dom.removeAttribute('data-moniitemCodes')
        this.selectTdDom.dom.removeAttribute('data-moniitemRecordIDs')
        this.selectTdDom.dom.removeAttribute('data-moniitemNames')
        this.selectTdDom.dom.removeAttribute('data-outmeasureLiquidCode')
        this.selectTdDom.dom.removeAttribute('data-inmeasureCode')
        this.selectTdDom.dom.removeAttribute('data-inmeasureLiquidCode')
        this.selectTdDom.dom.removeAttribute('data-recordTime')
      }

      this.closeInsertMetaDialog()
    },
    /**
     * 显示另存为弹框
     */
    async showSaveAs() {
      const newObj = JSON.parse(JSON.stringify(this.criticlalRecord))
      newObj.criticlalRecordName += '_复制'
      delete newObj.criticlalRecordId
      newObj.sortNo = await this.getMaxSortNo()
      newObj.statusDict = 1
      this.form = Object.assign({}, newObj)
      this.saveAsDialogShow = true
    },
    // 隐藏新增弹框
    dialogClose() {
      this.saveAsDialogShow = false

      this.$refs.form.resetFields()
      this.$refs.form.clearValidate()
    },
    /**
     * 获取模板排序号
     */
    getMaxSortNo() {
      return new Promise((resolve, reject) => {
        getNextSortNo({
          'type': 'form'
        }).then(res => {
          resolve(res.data)
        })
      })
    },
    // 另保存数据
    saveAsRecord() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const query = this.form
          const tempDom = tinymce.editors['tinymce'].getDoc()
          const body = tempDom.getElementsByTagName('table')[0]
          // 把table中tr 的保存
          if (!body) {
            this.$message({
              type: 'info',
              message: '请设置表格内容'
            })
            return
          }
          const width = body.clientWidth
          const height = body.clientHeight
          let outHTML = body.outerHTML

          outHTML = outHTML.replaceAll('²', '&sup2;')
          outHTML = outHTML.replaceAll('®', '&reg;')
          outHTML = outHTML.replaceAll('₂', '&#8322;')
          const configObj = {
            data: outHTML,
            w: width,
            h: height
          }
          query.criticlalRecordConfig = JSON.stringify(configObj)
          insert_criticalRecord(query).then(res => {
            this.saveAsDialogShow = false
            this.$message.success('另存为成功')
            this.findPage()
          })
        }
      })
    },
    /**
     * 获取组件类型
     */
    getTableTypeList() {
      const query = {
        pageNum: 1,
        pageSize: 1000,
        dictGroupCode: 'ICIS_DICT_FORM_TYPE'
      }
      dictItem_findAllWithPage(query).then(res => {
        if (res.code == 0) {
          this.typeList = res.data.result
        }
      })
    },
    // 查询数据列表
    findPage(page) {
      this.loading = true
      const query = {
        // pageSize: 1000,
        pageNum: page || 1
      }
      findAllWithPage_criticalRecord(query).then(res => {
        this.loading = false
        if (res.code == 0) {
          this.listData = res.data.filter(item => item.criticlalRecordTypeDict != '')
        }
      })
    },
    /**
     * 校验名称是否有重复
     */
    validatorName(name, callback) {
      const filterRe = this.listData.filter(item => item.criticlalRecordName == name)
      if (filterRe.length > 0) {
        callback(new Error())
      }
      callback()
    },
    /**
     * 插入平方
     */
    insertSup() {
      tinymce.editors['tinymce'].insertContent('²')
    },
    /**
     * 插入平方
     */
    insertSub() {
      tinymce.editors['tinymce'].insertContent('₂')
    },
    /**
     * 插入
     */
    insertTrademark() {
      tinymce.editors['tinymce'].insertContent('®')
    },
    /**
     * 显示合并行的
     */
    showRowspanDialog({ dom, rule, list }) {
      document.querySelector('.tox-tinymce-aux').innerHTML = ''
      this.rowspanFlag = true
      this.rowspanDom = dom
      if (list) {
        this.rowspanCondition = JSON.parse(list)
      } else {
        this.rowspanCondition = [
          { preChar: '', paramName: '', operator: '', paramValue: '', afterChar: '', concatChar: '' }
        ]
      }
    },
    closeRowspan() {
      this.rowspanFlag = false
    },
    /**
     * 保存数据条件
     */
    saveRowspan() {
      // 校验条件表达式 是否正确
      if (!this.errorFlag) {
        try {
          const expression = new Function(`return ${this.expressionFn}`)
          if (!expression()) {
            this.$message({
              message: '数据条件不成立! 表达式配置错误',
              type: 'error'
            })
          } else {
            this.rowspanDom.forEach(dom => {
              dom.setAttribute('data-row-span', this.rowspanCondition.map(item => item.paramName).toString())
              dom.setAttribute('data-rowspan-expression', this.rowspanExpression)
              dom.setAttribute('data-rowspan-list', JSON.stringify(this.rowspanCondition))
            })
            this.closeRowspan()
          }
        } catch {
          this.$message({
            message: '数据条件不成立! 表达式配置错误',
            type: 'error'
          })
        }
      } else {
        this.$message({
          message: this.errorMsg,
          type: 'error'
        })
      }
    },
    addRowSpanCondition(index) {
      this.rowspanCondition.splice(index + 1, 0, {
         preChar: '', paramName: '', operator: '', paramValue: '', afterChar: '', concatChar: ''
      })
    },
    /**
     * 删除合并单元格规则
     */
    deleteRowSpanCondition(index) {
      if (this.rowspanCondition.length > 1) {
        this.rowspanCondition.splice(index, 1)
      }
    },
    /**
     * 显示绑定数据源弹框
     */
    showDatasourceDialog() {
      document.querySelector('.tox-tinymce-aux').innerHTML = ''
      this.getProSqlList('', () => {
        this.dataSourceDialog = true
        this.$refs.paramList.editStandardRow = null
        this.dataSourceIdOri = this.dataSourceId // 保存下弹框前的数据
      })
    },
    /**
     * 获取数据源列表
     */
    getProSqlList(key, callback) {
      formProSql_listPage({
        'pageSize': 20,
        'pageNum': 1,
        'searchKey': key,
        'statusDict': '',
        'standardFlag': true
      }).then(res => {
        if (res.code == 0) {
          this.dataSourceList = res.data.result
          callback && callback()
        }
      })
    },
    /**
     * 关闭数据源弹框
     */
    closeDataSourceDialog() {
      this.dataSourceDialog = false
      this.$refs.paramList.moduleCode = ''
      this.$refs.paramList.paramSearchKey = ''
      this.dataSourceId = this.dataSourceIdOri
    },
    /**
     * 绑定数据源
     */
    async saveDataSourceId() {
      this.dataSourceIdOri = this.dataSourceId
      if (this.$refs.paramList.editStandardRow) {
        this.$message.error('请完成编辑保存')
        return
      }
      // if (this.dataSourceList.find(item => item.id == this.dataSourceId).sysInitFlag == '0') {
        await this.refreshDataSource(this.dataSourceId)
      // }
      criticalRecord_updateDocId({
        'criticlalRecordId': this.criticlalRecordId,
        'docId': this.dataSourceId
      }).then(res => {
        this.dataSourceDialog = false
        this.$refs.paramList.moduleCode = ''
        this.$refs.paramList.paramSearchKey = ''
      })
    },
    /**
     * 刷新非系统初始化数据的数据源
     */
    refreshDataSource(id) {
      return new Promise((resolve, reject) => {
        fixedPlaceHolder_freshConfig(id).then(res => {
          if (res.code == 0) resolve()
        })
      })
    },
    /**
     * 占位符弹框
     */
    showPlacehoderDialog(data) {
      if (this.dataSourceId == '') {
        this.$message('请先绑定数据源！！')
        return
      }

      this.selectTdDom = data[0]
      this.placehodlerDialogFlag = true
      document.querySelector('.tox-tinymce-aux').innerHTML = ''
    }

  },
  watch: {
    flag() {
      const { width, height } = this.canvasRange.filter(v => v.name == this.canvasRangeName).length == 1 ? this.canvasRange.filter(v => v.name == this.canvasRangeName)[0] : { width: 1000, height: 500 }
      this.init.width = width
      this.init.height = this.height || (height + 58)
      // this.init.max_height = 100
      // this.init.max_width = 100
      // this.init.min_height = 100
      // this.init.min_width = 100
    },
    rowspanCondition: {
      handler() {
        this.rowspanExpression = ''
        this.expressionFn = ''
        this.errorFlag = false
        this.errorMsg = ''
        this.rowspanCondition.forEach((item, index) => {
           if (!item.operator) {
             this.errorFlag = true
             this.errorMsg = '请选择运算符'
          }
          if (item.paramName && item.paramValue) {
            if (index != this.rowspanCondition.length - 1) {
              if (item.concatChar) {
                this.rowspanExpression += (item.preChar || '') + item.paramName + item.operator + item.paramValue + (item.afterChar || '') + item.concatChar
                this.expressionFn += (item.preChar || '') + '1==1' + (item.afterChar || '') + item.concatChar
              } else {
                this.errorFlag = true
                this.errorMsg = '多种数据条件请选择“与/或”关系'
              }
            } else {
              this.rowspanExpression += (item.preChar || '') + item.paramName + item.operator + item.paramValue + (item.afterChar || '')
              this.expressionFn += (item.preChar || '') + '1==1' + (item.afterChar || '')
           }
          } else {
            this.rowspanExpression += ''
            // this.errorMsg = '数据条件不成立! 表达式配置错误'
            // this.$message.warning('数据条件不成立! 表达式配置错误')
          }
        })
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .insertData .el-dialog {
  &__header {
    padding: 0px 0px 0px 20px;
    border-bottom: none;
    margin-bottom: 0px;
  }
}
.spanCondition{
  --el-form-item-width: 60px;
}
</style>
