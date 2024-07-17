<template>
<div>
  <el-main class="container flex">
    <div class="left" v-loading="loading">
      <el-header class="flex">
        <el-checkbox v-model="statusDict" true-label="" false-label="1"  @change="getTemplate(1)">
              显示禁用
        </el-checkbox>
        <el-button type="primary" v-hasPermi="['configuration:basicSettings:rescueRecordConfig']"  class="flex1 pl-5" @click="addTemplate">新增模板</el-button>
      </el-header>

          <!-- 模板列表 -->

      <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" :row-class-name="({row}) => row.statusDict == 0 ? 'disabled' : ''" :data="list"  :show-header="false"  @row-click="changeTemp" highlight-current-row mini ref="templateTable">
        <v-table-column prop="templateName">
          <template  slot-scope="scope">
            <el-input v-if="scope.row.isEdit" v-model="scope.row.templateName" placeholder="请输入" maxlength="30"></el-input>
            <span v-else >{{scope.row.templateName}}</span>
          </template>
        </v-table-column>
        <v-table-column prop="templateName" align="right">
          <template  slot-scope="scope">
            <el-button v-hasPermi="['configuration:basicSettings:rescueRecordConfig']" v-if="scope.row.isEdit" type="text" @click="doSaveTemplate(scope.$index,scope.row)">保存</el-button>
            <el-button v-hasPermi="['configuration:basicSettings:rescueRecordConfig']" v-if="scope.row.isEdit" type="text" @click="doCancelTemplate(scope.$index,scope.row)">取消</el-button>
            <el-button v-if="!scope.row.isCreate" v-hasPermi="['configuration:basicSettings:rescueRecordConfig']" type="text" @click="enableOrDisable(scope.$index,scope.row)" :style="{ color: scope.row.statusDict == 1 ? '#EC0000': '#00AB44' }">{{+scope.row.statusDict ? '禁用' : '启用' }}</el-button>
          </template>
        </v-table-column>
      </el-table>

      <el-footer>
        <el-pagination background :current-page="templatePageNum" :page-size="templatePageSize" layout="total , prev, pager, next"
            style="margin-left:-10px;float:right" :total="templateTotal" @current-change="getTemplate">
        </el-pagination>
      </el-footer>
      </div>

    <div class='right' >
      <el-button v-hasPermi="['configuration:basicSettings:rescueRecordConfig']" type="primary" @click="saveTemplateContent">保存</el-button>
      <div id="editor">
        <Editor :id="tinymceId" :init="init"  ref="tinymceEdit" :value ="content" ></Editor>
      </div>
    </div>
  </el-main>

</div>
</template>
<script>
import { debounce } from 'lodash'
import {
  rescure_rescureEventTemplate_findAllWithPage,
  rescure_rescureEventTemplate_getById,
  rescure_rescureEventTemplate_insert,
  rescure_rescureEventTemplate_deleteById,
  rescure_rescureEventTemplate_edit
} from '@/api/rescure'

import tinymce from 'tinymce/tinymce' // tinymce默认hidden，不引入不显示
import Editor from '@tinymce/tinymce-vue'// 编辑器引入
import '../../recordSetting/tinymacEditor/tinymce/icons/default/icons.js' // 图标文件
import 'tinymce/themes/silver/theme'// 编辑器主题

import 'tinymce/plugins/link' // 超链接
import 'tinymce/plugins/paste' // 粘贴过滤
import 'tinymce/plugins/lists'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/save'
import 'tinymce/plugins/autoresize'
export default {
  name: 'NursingRecordTemplate',
  components: {
    Editor
  },
  data: function() {
    return {
      loading: false,
      dialogVisible: false,
      tinymceId: 'tinymce',
      editorHeight: 230,
      statusDict: '',
      list: [], // 模板列表
      leftIndex: 0,
      currTemplate: {}, // 当前模板
      templateTotal: 0, // 模板总数
      templatePageNum: 1,
      templatePageSize: 15,
      content: '',
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
        resize: true,
        save_onsavecallback: this.saveTemplateContent
      }
    }
  },
  props: {
    wardCode: {
      wardCode: {
        type: String,
        default: ''
      }
    }
  },
  watch: {
    wardCode: function() {
      this.getTemplate()
    }
  },
  computed: {
  },
  created() {
    this.getTemplate()
  },
  mounted() {
    this.resetEditorHight()
    window.onresize = debounce(() => {
      this.resetEditorHight()
    }, 100)
  },
  methods: {
    // 设置组件的高度
    resetEditorHight() {
      let height = document.querySelector('#editor')?.offsetHeight
      height = height == 0 ? 650 : height
      this.editorHeight = height + 'px'

      if (tinymce.editors['tinymce']) {
        const ele = tinymce.editors['tinymce'].getContainer()
        const hasPermi = this.$btnHasPerm(['configuration:basicSettings:rescueRecordConfig'])
        if (ele != null) {
          const self = this
          setTimeout(function() {
            ele.style.height = self.editorHeight
            tinymce.editors['tinymce'].dom.setStyle(ele, 'height', self.editorHeight) // 设置编辑框的大小
            // 根据权限设置是否可编辑
            tinymce.editors['tinymce'].iframeElement.contentDocument.body.contentEditable = hasPermi
          }, 50)
        }
      }
    },
    getTemplate(pageNum) {
      this.templatePageNum = pageNum || 1
      const query = {
        wardCode: this.wardCode,
        pageSize: this.templatePageSize,
        pageNum: this.templatePageNum,
        statusDict: this.statusDict
      }
      rescure_rescureEventTemplate_findAllWithPage(query).then(res => {
        if (res.code == 0) {
          this.templateTotal = res.data.totolCount
          this.list = res.data.result
          if (this.list.length > 0) {
            this.currTemplate = this.list[0]
            this.$refs.templateTable?.setCurrentRow(this.list[0], true)
            this.getTemplateContent()
          } else {
            this.currTemplate = null
            this.content = ''
          }
        }
      })
    },
    changeTemp(e) {
      this.currTemplate = e
      e.id && this.getTemplateContent()
    },
    // 添加模板
    addTemplate() {
      if (this.list.length > 0 && this.list[0].isCreate) return
      const item = {
        isEdit: true,
        isCreate: true,
        templateContent: ''
      }
      this.content = ''
      this.list.unshift(item)
      this.list = [...this.list]
    },
     // 保存用药模板
    doSaveTemplate(index, row) {
      if (row.isCreate) { // 保存模板
        if (row.templateName == undefined || row.templateName.trim() == '') {
          this.$message({
            type: 'error',
            message: '请输入模板名称'
          })
          return
        }
        const query = {
          wardCode: this.wardCode,
          templateName: row.templateName,
          templateContent: ''
        }
        rescure_rescureEventTemplate_insert(query).then(res => {
          if (res.code == 0) {
            row.isEdit = false
            this.list = [...this.list]
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.getTemplate()
          }
        })
      }
    },
    // 保存用药模板
    doCancelTemplate(index, row) {
      if (row.isCreate) {
        row.isEdit = false
        this.list.splice(index, 1)
      }
    },
    // 启用禁用-用药模板
    enableOrDisable(index, row) {
      rescure_rescureEventTemplate_deleteById({
        id: row.id,
        statusDict: row.statusDict == '1' ? '0' : '1'
      }).then(res => {
        if (res.code == 0) {
          // this.list.splice(index, 1)
          this.getTemplate()
          this.$message({
            type: 'success',
            message: +row.statusDict ? '已禁用' : '已启用'
          })
        }
      })
    },
    getTemplateContent() {
      const id = this.currTemplate.id
      rescure_rescureEventTemplate_getById(id).then(res => {
        this.content = res.data.templateContent
      })
    },
    // 保存模板内容
    saveTemplateContent() {
      const query = this.currTemplate
      query.templateContent = tinymce.editors['tinymce'].getContent()
      rescure_rescureEventTemplate_edit(query).then(res => {
        if (res.code == 0) {
          this.$message({
              type: 'success',
              message: '保存成功'
            })
        }
      })
    }

  }
}
</script>

<style lang="scss" scoped>
@import '~styles/config-common.scss';

.container{
  width:100%;
  .left{
    width:320px;
    height:100%;
    margin-right:10px;

    ::v-deep .el-select > .el-input > .el-input__inner {

      min-width: 140px;
    }
  }
  .right{
    width:calc(100% - 130px);

    height:100%;
    overflow: hidden;
    .queryButton {
      float: right;
    }
  }
  .content {
    ::v-deep .el-textarea__inner{
      background: transparent;
      border: none;
      height: calc(100vh - 270px);
    }
  }
  .list {
    list-style: none;
    li{
      font-size:14px;
      line-height: 30px;
      background: rgb(243,245,249);
      padding: 5px 10px;
      margin-top: 5px;
      display: flex;
      justify-content: space-between;
      .text {
        width: 100px;
        color:var(--maincolor);
        font-size: 12px;
        text-align: right;
      }
      .redCss {
        color: #f52c2c;
      }
    }
    .active {
      background: rgb(207,225,255);
    }
  }
}
</style>
