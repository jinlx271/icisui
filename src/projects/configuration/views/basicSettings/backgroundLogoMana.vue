<template>
  <div class="helpConfig" id="helpConfig" ref="helpConfig" :element-loading-text="uploadingText" v-loading="uploading">
    <el-container style="height: 100%;">
      <el-main style="height: 100%;">
        <!-- 头部 -->
        <el-header class="headDiv">
          <div>
            <i class="iconBlue"></i>
            <span>背景LOGO管理</span>
          </div>
          <el-button class="queryButton" @click="tableData.unshift({ isAdd: true, addressIden: '', bgImage: '', logoIamge: '',logo1Iamge: '', bgImageFile: '', logoIamgeFile: '' })" size="small" type="primary">新增</el-button>
        </el-header>
        <!-- 表格 -->
        <el-main style="height: calc(100% - 46px);padding:0">
          <el-container style="height:100%">
            <!-- 表格 -->
            <el-main style="height:100%;padding:0">
              <el-table @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)" element-loading-text="加载中" v-loading="loading" ref="tableData" :data="tableData" highlight-current-row height="100%" border  style="width: 100%;height: 200px; overflow: auto;">
                <v-table-column prop="moniitemCode" label="登录地址标识" align="left">
                  <template slot-scope="scope">
                    <el-input v-if="scope.row.isAdd"   @input="(v)=>accountInput(v,scope)" type="type" maxlength="20" v-model="scope.row.addressIden" placeholder="请输入" border clearable></el-input>
                    <span v-else>{{ scope.row.addressIden }}</span>
                  </template>
                </v-table-column>
                <v-table-column prop="bgImage" label="背景图" align="left">
                  <template slot-scope="scope">
                    <template>
                      <el-upload v-if="(scope.row.isEdit||scope.row.isAdd)&&!scope.row.bgImage" class="upload-demo" ref="upload" :show-file-list="false" action :http-request="(option) => httpRequest(option, scope, 'bgImageFile')"
                         :on-change="(file, fileList) => onChange(file, fileList, scope, 'bgImage')" :before-upload="(file) => beforeUpload(file, scope, 'png', 'bgImage')" :on-exceed="handleExceed" :limit="1">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传PNG文件</div>
                      </el-upload>
                      <div v-else-if="scope.row.bgImage" class="el-upload-list__item is-ready">
                        <img class="el-upload-list__item-thumbnail" :src="scope.row.bgImage" alt="" width="100px" />
                        <div class="deletePic" v-if="scope.row.isEdit||scope.row.isAdd" @click="scope.row.bgImage = '',scope.row.bgImageFile=''">
                          <i class="el-icon-close"></i>
                        </div>
                      </div>
                    </template>
                  </template>
                </v-table-column>
                <v-table-column prop="logoIamge" label="浏览器LOGO" align="left">
                  <template slot-scope="scope">
                    <template>
                      <el-upload v-if="(scope.row.isEdit||scope.row.isAdd)&&!scope.row.logoIamge" class="upload-demo" ref="upload" :show-file-list="false" action :http-request="(option) => httpRequest(option, scope, 'logoIamgeFile')"
                         :on-change="(file, fileList) => onChange(file, fileList, scope, 'logoIamge')" :before-upload="(file) => beforeUpload(file, scope, 'ico', 'logoIamge')" :on-exceed="handleExceed" :limit="1">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传ICO文件</div>
                      </el-upload>
                      <div v-else-if="scope.row.logoIamge" class="el-upload-list__item is-ready">
                        <img class="el-upload-list__item-thumbnail" :src="scope.row.logoIamge" alt="" width="100px" />
                        <div class="deletePic" v-if="scope.row.isEdit||scope.row.isAdd" @click="scope.row.logoIamge = '',scope.row.logoIamgeFile=''">
                          <i class="el-icon-close"></i>
                        </div>
                      </div>
                    </template>
                  </template>
                </v-table-column>
                <v-table-column prop="logo1Image" label="系统LOGO" align="left">
                  <template slot-scope="scope">
                    <template>
                      <el-upload v-if="(scope.row.isEdit||scope.row.isAdd)&&!scope.row.logo1Image" class="upload-demo" ref="upload" :show-file-list="false" action :http-request="(option) => httpRequest(option, scope, 'logo1File')"
                         :on-change="(file, fileList) => onChange(file, fileList, scope, 'logo1Image')" :before-upload="(file) => beforeUpload(file, scope, 'png', 'logo1Image')" :on-exceed="handleExceed" :limit="1">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传PNG文件</div>
                      </el-upload>
                      <div v-else-if="scope.row.logo1Image" class="el-upload-list__item is-ready">
                        <img class="el-upload-list__item-thumbnail" :src="scope.row.logo1Image" alt="" width="100px" />
                        <div class="deletePic" v-if="scope.row.isEdit||scope.row.isAdd" @click="scope.row.logo1Image = '',scope.row.logo1File=''">
                          <i class="el-icon-close"></i>
                        </div>
                      </div>
                    </template>
                  </template>
                </v-table-column>
                <v-table-column prop="dictLink" label="操作" align="center" width="180px">
                  <template slot-scope="scope">
                    <el-button @click.native.prevent="handleDeleteData(scope,scope.$index)" style="color: red;" type="text" size="mini">删除</el-button>
                    <el-button v-if="!scope.row.isEdit&&!scope.row.isAdd" @click.native.prevent="handleEdit(scope.$index, scope)" type="text" size="small">修改</el-button>
                    <span v-else>
                      <el-button @click.native.prevent="getData" type="text" size="small">取消</el-button>
                      <el-button @click.native.prevent="submitImportForm(scope)" type="text" size="small">保存</el-button>
                    </span>
                  </template>
                </v-table-column>
              </el-table>
            </el-main>
          </el-container>
        </el-main>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import { base_image_backGroundLogos, base_image_updateImage, base_image_deleteImage, base_image_addImage } from '@/api/configuration'

export default {
  name: 'BackgroundLogoMana',
  components: {},
  props: {},
  data() {
    return {
      // 对话框控制权
      dialogVisible1: false,
      // 导入表单数据
      importForm: {
        kgCode: '',
        targetUrl: '',
        targetUsername: '',
        targetPassword: ''
      },
      // 存放上传文件
      loading: false, // 表格的loding
      tableData: [], // 表格数据
      uploading: false,
      uploadingText: '您的文档正在上传，完成之前请勿关闭页面！！！',
      docHref: `${process.env.NODE_ENV === 'production' ? globalConfig.PRO_BASE_API || './' : globalConfig.BASE_API}`
    }
  },
  watch: {},
  computed: {},
  beforeCreated() {},
  async created() {
    this.getData()
  },
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  update() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    accountInput(val, scope) { // 账号的实时输入
      const codeReg = new RegExp('[A-Za-z0-9]+') // 正则 英文+数字
       const len = val.length
      let str = ''
      for (var i = 0; i < len; i++) {
        if (codeReg.test(val[i])) {
          str += val[i]
        }
      }
      scope.row.addressIden = str
    },
    // 覆盖默认的上传行为，可以自定义上传的实现，将上传的文件依次添加到fileList数组中,支持多个文件
    httpRequest(option, scope, key) {
      scope.row[key] = option.file
    },
    // 上传前处理
    beforeUpload(file, scope, format, key) {
      const fileSize = file.size
      const FIVE_M = 5 * 1024 * 1024
      // 大于5M，不允许上传
      if (fileSize > FIVE_M) {
        this.$message.error('最大上传5M')
        return false
      }
      // 判断文件类型，必须是png格式
      const fileName = file.name
      const reg = format == 'ico' ? /^.+(\.ico)$/ : /^.+(\.png)$/
      if (!reg.test(fileName)) {
        this.$message.error(`只能上传${format}!`)
        scope.row[key] = ''
        this.handleEdit(scope.$index, scope)
        return false
      }
      return true
    },
    // 文件数量过多时提醒
    handleExceed() {
      this.$message({ type: 'error', message: '最多支持1个附件上传' })
    },
    // 导入Excel病种信息数据
    submitImportForm(scope) {
      // 使用form表单的数据格式
      // 将上传文件数组依次添加到参数paramsData中
      if (!scope.row.addressIden) {
        this.$message.error('登录地址标识为必填项！')
        return
      }
      delete scope.row.isEdit
      const params = new FormData()
      if (scope.row.bgImageFile) {
         params.append('bgImageFile', scope.row.bgImageFile)
         delete scope.row.bgImageFile
         delete scope.row.bgImage
      }
      if (scope.row.logoIamgeFile) {
        params.append('logoIamgeFile', scope.row.logoIamgeFile)
        delete scope.row.logoIamgeFile
        delete scope.row.logoIamge
      }
      if (scope.row.logo1File) {
        params.append('logo1File', scope.row.logo1File)
        delete scope.row.logo1File
        delete scope.row.logo1Image
      }
      const arr = []
      for (const k in scope.row) {
        switch (k) {
          case 'bgImage':
          case 'logoIamge':
          case 'logo1Image':
            arr.push(`${k}=${scope.row[k] ? 1 : ''}`)
            break
          default:
            arr.push(`${k}=${scope.row[k]}`)
            break
        }
      }
      const pro = scope.row.id ? base_image_updateImage(`base/image/updateImage?${arr.join('&')}`, params) : base_image_addImage(`base/image/addImage?${arr.join('&')}`, params)
      pro.then(() => {
        this.getData()
      })
    },
    handleEdit(index, scope) {
      this.$set(
        this.tableData,
        index,
        Object.assign({}, scope.row, {
          isEdit: true
        })
      )
      this.$refs.tableData && this.$refs.tableData.doLayout()
    },
    onChange(file1, fileList, scope, bgImage) {
      var event = event || window.event
      var file = event.target.files[0]
      var reader = new FileReader()
      // 转base64
      reader.onload = function (e) {
        scope.row[bgImage] = e.target.result // 将图片路径赋值给src
      }
      reader.readAsDataURL(file)
    },
    // 获取列表
    getData() {
      base_image_backGroundLogos({}).then((res) => {
        this.tableData = []
        if (res.data) {
          this.tableData = res.data
        }
        this.$nextTick(() => {
          this.$refs.tableData && this.$refs.tableData.doLayout()
        })
      })
    },
    // 删除文件
    handleDeleteData(scope, index) {
      const _this = this
      if (!scope.row.id) {
        this.tableData.splice(index, 1)
        return
      }
      this.$confirm('您确定要删除吗？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        base_image_deleteImage(scope.row).then((res) => {
          _this.getData()
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.helpConfig {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  ::v-deep.el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .headDiv {
    height: 46px !important;
    padding: 0;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .iconBlue {
      display: inline-block;
      width: 3px;
      height: 16px;
      background: var(--maincolor);
    }
    div {
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
    }
    span {
      flex: 1;
      margin-left: 8px;
      height: 22px;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: bold;
      color: #000622;
      line-height: 22px;
    }
  }
}
</style>
