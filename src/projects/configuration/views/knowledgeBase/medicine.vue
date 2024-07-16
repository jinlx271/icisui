<!-- 基础参数 -->
<template>
  <div class="basicParamConfigPage">
    <el-tabs v-model="activeName" @tab-click="handleClick" :before-leave="tabClickBefore"  >
      <el-tab-pane v-for="item in ICIS_DICT_KNOW_CONTENT_TYPE" :label="item.dictName" :name="item.dictCode" :key="item.dictCode" >
      </el-tab-pane>
    </el-tabs>
    <el-container class="basicParamConfig">
      <!-- 左侧菜单 -->
      <div class="basicParamConfig_left">
        <el-container class="basicParamConfig_left_div">
          <el-header class="basicParamConfig_left_header">
            <el-input
              clearable
              class="elInput m-r10"
              size="small"
              v-model="searchKey"
              placeholder="输入目录编码/名称"
              suffix-icon="el-icon-search"
            ></el-input>
            <el-button size="small" type="primary" @click="addRoot">新增目录</el-button>
          </el-header>
          <el-main>
            <el-tree
              class="filter-tree"
              :data="dataList"
              node-key="nodeCode"
              ref="tree"
              :props="defaultProps"
              highlight-current
              default-expand-all
              :expand-on-click-node="false"
              :filter-node-method="filterNode" @node-click="nodeClick">
              <!--  @click.stop="nodeClick(node,data)"-->
              <div slot-scope="{ node,data }" >
                <span class='custom-tree-node flex flex-between w100  align-items-center ' >
                  <span :title="node.data.nodeName + '(' + node.data.nodeCode + ')'" class='flex1' style='line-height:24px;'>
                    <span style='color:#333; margin-left:5px;'>{{node.data.nodeName}}</span>
                    <span style='color:#999'>{{node.data.nodeCode}}</span>
                  </span>
                  <!-- 'backgroundColor':data.nodeCode==selectedData.nodeCode?'#f0f7ff':'', -->
                  <span class="tree-btn-box">
                    <el-button size='mini' type='text' @click.stop="setStatus(node, data)" style='color:#EC0000' v-if="data.statusDict == '1'">禁用</el-button>
                    <el-button size='mini' type='text' style='color:#00AB44' @click.stop="setStatus(node, data)" v-else>启用</el-button>
                    <el-button size='mini' type='text' @click.stop="modify(data)" >修改</el-button>
                    <el-button size='mini' type='text' @click.stop="append(data)"> 新增</el-button>
                    <el-button size='mini' type='text' @click.stop="remove(node, data)" style='color:red'>删除</el-button>
                  </span>
                </span>
              </div>
            </el-tree>
          </el-main>
        </el-container>
      </div>
      <!-- 右侧内容 -->
      <el-container class="basicParamConfig_right" >
        <el-main class="basicParamConfig_right_body" style="height:100%;">
          <div class="basicParamConfig_left_header w100 m-b10">
            <div class="m-b10">
              <el-upload v-if="activeName=='0002'"  class="upload-demo"
                :headers="importHeaders" :action="uploadApi" :data="{nodeCode:selectedData.nodeCode}"
                :multiple="false" :limit="1" :before-upload="(file)=>{return beforeUpload(file,100,'image/png,image/jpeg,image/bmp,psd,image/gif,image/tiff,tga,eps', '只能上传BMP、JPEG、GIF、PSD、PNG、TIFF、TGA、EPS文件')}" :accept="'.png,.jpg,.bmp,.jpeg,.psd,.gif,.tiff,.tga,.eps'"
                :on-preview="handlePreview" :file-list="appendixList" list-type="picture" :on-exceed="beforeUpload" :on-progress="progress" :on-error="uploadError"
                :on-success="(response, file, fileList) => {
                    return successUpload(response, file, fileList, selectedData);
                  }"
                :before-remove="(file,fileList)=>{
                  return beforeRemove(file,fileList,selectedData.nodeCode)
                }">
                <template v-if="!(selectedData.nodeCode==''||appendixList.length>=1)">
                  <el-button size="small" type="primary" :disabled="selectedData.nodeCode==''||appendixList.length>=1" >上传图片</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传BMP、JPEG、GIF、PSD、PNG、TIFF、TGA、EPS文件，且不超过100M</div>
                </template>
              </el-upload>
              <el-upload v-else-if="activeName=='0003'" class="upload-demo"
                :headers="importHeaders" :action="uploadApi" :data="{nodeCode:selectedData.nodeCode}"
                :multiple="false" :limit="1" :before-upload="(file)=>{return beforeUpload(file,500,'audio/mp4,video/mp4,application/ogg,audio/ogg,webm', '只能上传mp4、ogg、webm文件')}" :accept="'.mp4,.ogg,.webm'"
                :on-preview="handlePreview" :file-list="appendixList" :on-exceed="beforeUpload" :on-progress="progress" :on-error="uploadError"
                :on-success="(response, file, fileList) => {
                    return successUpload(response, file, fileList, selectedData);
                  }"
                :before-remove="(file,fileList)=>{
                  return beforeRemove(file,fileList,selectedData.nodeCode)
                }">
                <template v-if="!(selectedData.nodeCode==''||appendixList.length>=1)">
                  <el-button size="small" type="primary" :disabled="selectedData.nodeCode==''||appendixList.length>=1">上传视频</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传mp4、ogg、webm文件，且不超过500M</div>
                </template>
                <div slot="file"  slot-scope="{file}" v-if="appendixList.length>0" class="flex flex-between">
                  <video :src="file.url"   :width="iframewidth*0.6" :height='iframewidth*0.6*0.6' controls ></video>
                  <span class="el-upload-list__item-actions">
                    <span
                      class="el-upload-list__item"
                      @click="beforeRemove(file,[],selectedData.nodeCode)"
                    >
                      <i class="el-icon-close"></i>
                    </span>
                  </span>
                </div>

              </el-upload>
              <el-upload v-else-if="activeName=='0004'" class="upload-demo"
                :headers="importHeaders" :action="uploadApi" :data="{nodeCode:selectedData.nodeCode}"
                :multiple="false" :limit="1" :before-upload="(file)=>{return beforeUpload(file,500,'audio/mpeg,application/ogg,audio/ogg,wav', '只能上传mp3、ogg、wav文件')}" :accept="'.mp3,.ogg,.wav'"
                :on-preview="handlePreview" :file-list="appendixList" :on-exceed="beforeUpload" :on-progress="progress" :on-error="uploadError"
                :on-success="(response, file, fileList) => {
                    return successUpload(response, file, fileList, selectedData);
                  }"
                :before-remove="(file,fileList)=>{
                  return beforeRemove(file,fileList,selectedData.nodeCode)
                }">
                <template v-if="!(selectedData.nodeCode==''||appendixList.length>=1)">
                  <el-button size="small" type="primary" :disabled="selectedData.nodeCode==''||appendixList.length>=1">上传音频</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传mp3、ogg、wav文件，且不超过500M</div>
                </template>
                <div slot="file"  slot-scope="{file}" v-if="appendixList.length>0" class="flex flex-between">
                  <audio controls :src="file.url"></audio>
                  <span class="el-upload-list__item-actions">
                    <span
                      class="el-upload-list__item"
                      @click="beforeRemove(file,[],selectedData.nodeCode)"
                    >
                      <i class="el-icon-close"></i>
                    </span>
                  </span>
                </div>
              </el-upload>
              <el-upload v-else-if="activeName=='0005'" class="upload-demo"
                :headers="importHeaders" :action="uploadApi" :data="{nodeCode:selectedData.nodeCode}"
                :multiple="false" :limit="1" :before-upload="(file)=>{return beforeUpload(file,500,'application/pdf', '只能上传pdf文件')}" :accept="'.pdf'"
                :on-preview="handlePreview" :file-list="appendixList" :on-exceed="beforeUpload" :on-progress="progress" :on-error="uploadError"
                :on-success="(response, file, fileList) => {
                    return successUpload(response, file, fileList, selectedData);
                  }"
                :before-remove="(file,fileList)=>{
                  return beforeRemove(file,fileList,selectedData.nodeCode)
                }">
                <template v-if="!(selectedData.nodeCode==''||appendixList.length>=1)">
                  <el-button size="small" type="primary" :disabled="selectedData.nodeCode==''||appendixList.length>=1">上传文档</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传pdf文件，且不超过500M</div>
                </template>
              </el-upload>

            </div>
            <div class="padding-content mini-title">{{knowContentTypeDict[activeName]}}</div>
            <Editor id="tinymceLeft" :init="initLeft" :value="contentLeft" ></Editor>
          </div>

          <el-button size="small" type="primary" @click="saveContent" :disabled="selectedData.nodeCode==''||uploading===true">保存</el-button>
        </el-main>
      </el-container>

    </el-container>
    <el-dialog :title="dialogTitle" :visible.sync="dialogShow" :before-close="closeDialog" >
      <el-form ref="form" :model="dialogForm" :rules="rules" label-width="80px">
        <el-form-item label="目录编码" prop="nodeCode">
          <el-input v-model="dialogForm.nodeCode" placeholder="请输入" :disabled="addOrModify == 'modify'"></el-input>
        </el-form-item>
        <el-form-item label="目录名称" prop="nodeName">
          <el-input v-model="dialogForm.nodeName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="上级目录" prop="parentNodeCode" >
          <select-tree v-model="dialogForm.parentNodeCode" :options="dataList" :props="defaultProps" :disabled="addOrModify == 'modify' || addOrModify == 'add' " @selected="changeParanNode" />
        </el-form-item>
        <el-form-item label="排序" prop="sortNo">
          <el-input-number v-model="dialogForm.sortNo" placeholder="请输入"></el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="statusDict">
          <el-switch  v-model="dialogForm.statusDict" active-value="1" inactive-value="0"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="previewDialog" :title="previewTitle" >
      <template v-if="previewDialog">
        <img width="100%" :src="appendixList.length>0?appendixList[0].url:''" alt="" v-if="activeName=='0002'">
        <iframe :src="appendixList.length>0?appendixList[0].url:''"  v-else allow="autoplay" width="680" height="520"></iframe>
      </template>

    </el-dialog>
  </div>
</template>
<script>
import SelectTree from '@/views/configuration/authorityManagement/selectTree.vue'
import {
  medicalKnow_findMedicalKnowTree,
  medicalKnow_insert,
  medicalKnow_edit,
  medicalKnow_deleteById,
  medicalKnow_deleteFile,
  medicalKnow_getMaxSort,
  medicalKnow_getById
} from '@/api/knowledge'
import { getCookie } from '@/utils/cookie' // 存储方式
import tinymce from 'tinymce/tinymce' // tinymce默认hidden，不引入不显示
import Editor from '@tinymce/tinymce-vue' // 编辑器引入
import 'tinymce/plugins/image'
export default {
  components: {
    Editor,
    SelectTree
  },
  data: function() {
    return {
      searchKey: '',
      dataList: [],
      defaultProps: {
        children: 'children',
        label: 'nodeName',
        value: 'nodeCode'
      },
      knowContentTypeDict: {
        // 包括医学主题、图库、视频、音频
        '0001': '',
        '0002': '图片简介:',
        '0003': '视频简介:',
        '0004': '音频简介:',
        '0005': '文档简介:'
      },
      activeName: '',
      ICIS_DICT_KNOW_CONTENT_TYPE: [],
      dialogTitle: '',
      dialogShow: false,
      dialogForm: {
          nodeCode: '',
          nodeName: '',
          knowContentTypeDict: '',
          isLeaf: true,
          parentNodeCode: '',
          sortNo: 1,
          statusDict: '1'
      },
      rules: {
        nodeCode: [
          {
            required: true, message: '请输入目录编码', trigger: 'blur'
          }, {
            message: '', trigger: 'blur',
            validator: (rule, value, callback) => {
                if (value.length > 100) {
                  callback(new Error('目录编码不超过100字符'))
                } else if (!value.startsWith('WN_ICIS_YXZSK_EJML_')) {
                  callback(new Error('目录编码格式为WN_ICIS_YXZSK_EJML_序号'))
                } else {
                  callback()
                }
              }
          }],
        nodeName: [
          {
            required: true, message: '请输入目录名称', trigger: 'blur'
          }, {
            message: '', trigger: 'blur',
            validator: (rule, value, callback) => {
                if (value.length > 100) {
                    callback(new Error('目录名称不超过100字符'))
                } else {
                  callback()
                }
              }
          }]
      },
      selectedData: {
        nodeCode: ''
      },
      addOrModify: '',
      contentLeft: '',
      initLeft: {
        auto_fouse: true,
        selector: '#tinymceLeft',
        resize: false,
        language_url: '../../../static/tinymce/langs/zh_CN.js', // 汉化路径是自定义的，一般放在public或static里面
        language: 'zh_CN',
        skin_url: '../../../static/tinymce/skins/ui/oxide',
        content_css: [
          '../../../static/tinymce/css/common.css',
          '../../../static/tinymce/skins/content/default/content.css'
        ],
        // plugins: this.plugins, // 插件
        // 工具栏
        menubar: false, // 隐藏菜单栏
        plugins: 'charmap lists image',
        // width: 580,
        toolbar:
          'forecolor backcolor bold italic underline strikethrough | fontsizeselect lineheight | alignleft aligncenter alignright alignjustify | numlist bullist | charmap subscript superscript',
        height: 194, // 高度
        placeholder: '在这里输入文字',
        fontsize_formats:
          '12px 14px 16px 18px 20px 22px 24px 26px 28px 30px 32px 34px 36px 38px 40px 42px 44px 46px 48px',
        branding: false, // 隐藏右下角技术支持
        paste_auto_cleanup_on_paste: true,
        paste_remove_styles: true, // 黏贴功能 清除剪贴板样式等
        paste_remove_styles_if_webkit: true,
        paste_strip_class_attributes: true
      },
      appendixList: [], // 附件列表
      importHeaders: { 'X-Token': getCookie('token').tocken },
      uploadApi: (process.env.NODE_ENV === 'production' ? globalConfig.PRO_BASE_API || './' : globalConfig.BASE_API) + '/medicalKnow/uploadFile',
      serverUrl: (process.env.NODE_ENV === 'production' ? globalConfig.PRO_BASE_API || './' : globalConfig.BASE_API),
      previewDialog: false,
      previewTitle: '',
      iframewidth: 100,
      uploading: false,
      selectNode: {}
    }
  },
  created() {
    const width = window.screen.availWidth
    // const height = window.screen.availHeight
    this.iframewidth = (width - 280) * 0.58
    this.initLeft.height = 400
    this.init()
    tinymce.init({})
  },
  watch: {
    'dialogForm.parentNodeCode': async function(value) {
      // this.dialogForm.sortNo = await this.getMaxSort(value)
    },
    searchKey(val) {
      this.$refs.tree.filter(val)
    },
    activeName() {
    }
  },
  methods: {
    async init() {
      this.ICIS_DICT_KNOW_CONTENT_TYPE = await this.$getDictItemList(
        'ICIS_DICT_KNOW_CONTENT_TYPE'
      )
      this.activeName = this.ICIS_DICT_KNOW_CONTENT_TYPE[0].dictCode
      this.getListData()
    },
    /**
     * 获取知识库列表
     */
    getListData() {
      medicalKnow_findMedicalKnowTree({ knowContentTypeDict: this.activeName }).then(res => {
        this.dataList = res.data
        this.$nextTick(async () => {
          if (!this.selectedData.nodeCode && this.dataList.length > 0) { // 没有选中节点
            this.selectedData.nodeCode = this.dataList[0].nodeCode
            this.selectedData = this.dataList[0]
            this.getContent(this.selectedData)
          }
          if (this.selectedData.nodeCode != '') {
            // const node = await this.getContentByNodeCode(this.selectedData.nodeCode)
            // this.selectedData = node
            this.$refs.tree.setCurrentKey(this.selectedData.nodeCode)
            this.$refs.tree.setCurrentNode(this.selectedData)
            this.getContent(this.selectedData)
          }
        })
      })
    },
    getContentByNodeCode(nodeCode) {
      return new Promise((resolve, reject) => {
        medicalKnow_getById(nodeCode).then(res => {
          resolve(res.data)
        })
      })
    },
    /**
     * 修改当前节点信息
     */
    modify(data) {
      this.addOrModify = 'modify'
      this.dialogTitle = '修改目录'
      this.dialogForm = {
          nodeCode: data.nodeCode,
          nodeName: data.nodeName,
          knowContentTypeDict: data.activeName,
          isLeaf: data.isLeaf || true,
          parentNodeCode: data.parentNodeCode,
          sortNo: data.sortNo,
          statusDict: data.statusDict
      }
      this.dialogShow = true
    },
    /**
     * 新增子目录
     */
    async append(data) {
      this.addOrModify = 'add'
      this.dialogTitle = '新增目录'
      const sortNo = await this.getMaxSort(data.nodeCode)
      this.dialogForm = {
          nodeCode: 'WN_ICIS_YXZSK_EJML_',
          nodeName: '',
          knowContentTypeDict: this.activeName,
          isLeaf: true,
          parentNodeCode: data.nodeCode,
          sortNo: sortNo,
          statusDict: '1'
      }
      this.dialogShow = true
    },
    /**
     * 删除当前节点
     */
    remove(node, data) {
      if (data.children && data.children.length > 0) {
        this.$message({
          type: 'warning',
          message: '当前目录有子目录，请先删除子文件'
        })
        return
      }
      this.$confirm('您确定要删除吗？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          medicalKnow_deleteById(data.nodeCode).then(res => {
            this.$message.success('删除成功！')
            if (data.nodeCode == this.selectedData.nodeCode) {
              this.selectedData.nodeCode = ''
              this.appendixList = []
            }
            const parent = node.parent
            const children = parent.data.children || parent.data
            const index = children.findIndex(d => d.nodeCode === data.nodeCode)
            children.splice(index, 1)
          })
      })
    },
    /**
     * 启用 禁用文档
     */
    setStatus(node, data) {
      const param = {
        nodeCode: data.nodeCode,
        statusDict: data.statusDict == '1' ? '0' : '1'
      }
      medicalKnow_edit(param).then(res => {
        this.$message({
          type: 'success',
          message: data.statusDict == '1' ? '禁用成功' : '启用成功'
        })
        this.getListData()
      })
    },
    /**
     * 新增根节点
     */
    async addRoot() {
      this.addOrModify = 'addRoot'
      this.dialogTitle = '新增目录'
      const sortNo = await this.getMaxSort()
      this.dialogForm = {
          nodeCode: 'WN_ICIS_YXZSK_EJML_',
          nodeName: '',
          knowContentTypeDict: this.activeName,
          isLeaf: true,
          parentNodeCode: '',
          sortNo: sortNo,
          statusDict: '1'
      }
      this.dialogShow = true
    },
    /**
     * 切换分类
     */
    handleClick() {
       if (this.uploading) { return }
      this.selectedData = {
        nodeCode: '',
        nodeName: '',
        content: '',
        filePathList: [],
        contentDesc: ''
      }
      this.appendixList = []
      this.contentLeft = ''
      tinymce.editors['tinymceLeft']?.setContent(this.contentLeft)
      this.getListData()
    },
    tabClickBefore() {
      if (this.uploading) {
        this.$message('文件正在上传...')
        return false
      }
    },
    async selectParentNode(v) {
      this.dialogForm.sortNo = await this.getMaxSort(v)
      this.dialogForm.parentNodeCode = v
    },
    /**
     * 关闭弹框
     */
    closeDialog() {
      this.dialogForm = {
        nodeCode: '',
        nodeName: '',
        knowContentTypeDict: this.activeName,
        isLeaf: true,
        parentNodeCode: '',
        sortNo: 1,
        statusDict: '1'
      }
      this.$refs.form.resetFields()
      this.dialogShow = false
    },
    /**
     * 关闭弹框
     */
    submitForm() {
      this.$refs.form.validate(v => {
        if (v) {
          if (this.dialogForm.parentNodeCode == '0') this.dialogForm.parentNodeCode = ''
          if (this.addOrModify.indexOf('add') > -1) {
            medicalKnow_insert(this.dialogForm).then(res => {
              this.$message({
                type: 'success',
                message: '新增成功'
              })
              this.closeDialog()
              this.getListData()
            })
          } else {
            medicalKnow_edit(this.dialogForm).then(res => {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.closeDialog()
              this.getListData()
            })
          }
        }
      })
    },
    /**
     * 树结构过滤
     */
    filterNode(value, data) {
      if (!value) return true
      return data.nodeName.indexOf(value) !== -1 || data.nodeCode.indexOf(value) !== -1
    },
    /**
     * 保存内容
     */
    saveContent() {
      if (!this.selectedData || this.selectedData.nodeCode == '') return
      const content = tinymce.editors['tinymceLeft']?.getContent()
      const text = tinymce.editors['tinymceLeft']?.getContent({ format: 'text' })
      const query = {
         nodeCode: this.selectedData.nodeCode,
         knowContentTypeDict: this.activeName
      }
      if (this.activeName == '0001') {
        if (text.length > 500) {
          this.$message({
            type: 'warning',
            message: '不可超过500字'
          })
          return
        }
        query.content = content
        this.selectedData.content = content
      } else {
        if (text.length > 500) {
          this.$message({
            type: 'warning',
            message: '不可超过500字'
          })
          return
        }
        query.contentDesc = content
        this.selectedData.contentDesc = content
      }
      // this.$refs.upload.submit()
      medicalKnow_edit(query).then(res => {
        this.$message({
          type: 'success',
          message: '修改成功'
        })
        this.getListData()
      })
    },
    /**
     * 点击数的节点
     */
    nodeClick(data, node) {
      if (this.uploading) {
        this.$message('文件正在上传中...')
        this.$refs.tree.setCurrentKey(this.selectNode)
        return
      }
      this.selectNode = node
      this.$refs.tree.setCurrentKey(node)
      this.getContent(data)
    },
    /**
     * 获取文本内容
     */
    getContent(data) {
      this.uploading = false
      this.selectedData = JSON.parse(JSON.stringify(data))
      let content = ''
      if (this.activeName == '0001') content = this.selectedData.content
      else {
         content = this.selectedData.contentDesc || ''
         this.appendixList = []
         if (this.selectedData?.filePathList?.length > 0) {
          this.appendixList = this.selectedData.filePathList?.map(url => {
            return {
              url: this.serverUrl + url.split('static')[1],
              name: url.split('/')[url.split('/').length - 1],
              path: url
            }
          })
         }
      }
      this.contentLeft = content || ''
      tinymce.editors['tinymceLeft']?.setContent(this.contentLeft)
    },
    /**
     * 删除上传文件
     */
    handleRemove(file, list, nodeCode) {
      medicalKnow_deleteFile({
        nodeCode: nodeCode,
        filePath: file.path
      }).then(res => {
        this.appendixList = []
        this.selectedData.filePathList = []
        this.getListData()
      })
    },
    /**
     * 删除前确认操作
     */
    beforeRemove(file, list, nodeCode) {
      if (file.status == 'ready') { return } // 上传校验不通过后 执行的beforeRemove
      // this.uploading = false
      const self = this
      const result = new Promise((resolve, reject) => {
        self.$confirm('您确定要删除吗？', '确认信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
          this.handleRemove(file, list, nodeCode)
          return true
          })
          .catch(() => {
            return false
          })
      })
      return result
    },
    /**
     * 预览文件
     */
    handlePreview(file) {
      this.previewDialog = true
      const title = {
        '0002': '图片预览',
        '0003': '视频预览',
        '0004': '音频',
        '0005': '文档查看'
      }
      this.previewTitle = title[this.activeName]
    },
    /**
     * 文件大小校验
     */
    beforeUpload(file, limt, type, typename) {
      if (this.appendixList.length >= 1) {
        this.$message.error('文件仅限一个')
        return false
      }
      if (this.selectedData.nodeCode == '') {
        this.$message.error('请选择节点')
        return false
      }

      const typeList = type.split(',')
      let isType = ''
      if (file.type) {
        isType = file.type
      } else {
        const filenameArr = file.name.split('.')
        isType = filenameArr[filenameArr.length - 1]
      }
      // const isType = file.type.split('/')[1]
      const isLt5M = file.size / 1024 / 1024 < limt
      if (!typeList.includes(isType)) {
        this.$message.error('支持' + typename + '类型')
        return false
      }
      if (!isLt5M) {
        this.$message.error('文件大小限' + limt + 'M以内!')
        return false
      }
      // this.uploading = true
      // return true
    },
    /**
     * 上传成功
     */
    successUpload(response, file, fileList, data) {
      // this.uploading = false
      if (this.selectedData.nodeCode == '' || this.appendixList.length >= 1) { return }
      if (!response.data) {
        this.appendixList = []
        this.$message(response.msg)
      }
      if (response.data) {
        this.appendixList = response.data?.map(url => {
          return {
            url: this.serverUrl + url.split('static')[1],
            name: url.split('/')[url.split('/').length - 1],
            path: url
          }
        })
        this.selectedData.filePathList = response.data
        this.getListData()
      }
    },
    uploadError() {
      // this.$message()
    },
    /**
     * 上传过程中
     */
    progress(e, file) {
      this.uploading = e.percent != 100
    },
    /**
     * 获取最大排序号
     */
    getMaxSort(parentNodeCode) {
      return new Promise((resolve, reject) => {
        const query = {
          knowContentTypeDict: this.activeName
        }
        if (parentNodeCode) {
          query.parentNodeCode = parentNodeCode
        }
        medicalKnow_getMaxSort(query).then(res => {
          resolve(res.data)
        })
      })
    },
    async changeParanNode(value) {
      this.dialogForm.sortNo = await this.getMaxSort(value)
    }
  },

  beforeRouteLeave(to, from, next) {
    if (!this.uploading) {
      next()
      return
    }
    this.$message('文件正在上传中....')
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法
</style>
<style lang="scss" scoped>
.basicParamConfigPage {
  background: #ffffff;
  height: 100%;
  display: block;
  padding: 1%;
  overflow: hidden;
  .tabs {
    height: 60px;
  }
  ::v-deep .el-tabs__nav-wrap::after {
    display: none;
  }
}
.basicParamConfig {
  font-size: 12px;
  height: calc(100% - 60px);

  // 左侧列表 无边框的 table
  &_left {
    ::v-deep .el-tree{
      font-size: 14px;
      .el-tree-node:focus > .el-tree-node__content .tree-btn-box {
        background-color: #F5F7FA;
      }
      &.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content .tree-btn-box {
          background-color: #f0f7ff;
      }
      .el-tree-node {
        .el-tree-node__content{
          height:40px;
        }
        .el-tree-node__content:hover {
          .tree-btn-box {
            background-color: #F5F7FA;
          }
        }
        .tree-btn-box{
          position: absolute;
          right: 0;
          background-color: #FFFFFF;
          padding: 0 10px;
          &:hover {
            background-color: #F5F7FA;
          }
        }
      }
    }
    width:40%;
    padding-right: 10px;
    .handelBar{
      width:120px;
      position: absolute;
      right:0;
    }
    &_div {
      height: 100%;
      ::v-deep.el-footer {
        padding: 0 20px;
      }
    }
    &_main {
      padding: 0;
      background: #f0f4ff;
      &_table {
        border: none;
        background: none;
        padding-top: 8px;
        &::before {
          background: transparent;
        }
        &::after {
          background: transparent;
        }
        ::v-deep tr {
          background: none;
          &.current-row {
            color: var(--maincolor);
            td {
              font-size: 14px;
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: var(--maincolor);
              background: none;
              .cell {
                background: #d9e3ff;
                border-radius: 3px;
              }
            }
          }
          &:hover {
            color: var(--maincolor);
            td {
              background: none;
            }
          }
        }
        ::v-deep td {
          border: none;
          padding: 0px 8px;
          color: #000622;
          font-size: 13px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          .cell {
            padding: 8px;
          }
        }
      }
    }
  }
  &_right {
    // margin-left: 10px;
    padding-left: 10px;
    overflow-y:auto ;
    border-left: 2px solid rgba(203, 215, 238, 0.3);
    /*去除upload组件过渡效果*/
    ::v-deep .el-upload-list__item { transition: none !important;}
  }
  ::v-deep .el-textarea__inner {
    height: auto !important;
    background: #f3f5f9;
  }
}
.paramValueCss {
  height: 100px;
  overflow-y: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
.elInput {
  width: 100% !important;
  max-width: 200px !important;
}
::v-deep .el-menu {
  border-right: 0;
}
</style>
