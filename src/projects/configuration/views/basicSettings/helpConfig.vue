<template>
  <div class="helpConfig" id="helpConfig" ref="helpConfig" :element-loading-text="uploadingText" v-loading="uploading">
    <el-container style="height:100%">
      <!-- 头部 -->
      <el-header class="headDiv">
        <div>
          <i class="iconBlue"></i>
          <span>操作手册配置</span>
        </div>
        <el-upload ref="upload" accept="application/pdf" :headers="importHeaders" :action="uploadApi" :limit="1"
          :auto-upload="true" :show-file-list="false" :file-list="fileList" :before-upload="handleBeforeUpload"
          :on-progress="handleUploadProgress" :on-success="handleUploadSuccess" :on-error="handleUploadError"
          @submit="submitUpload">
          <el-button class="queryButton" size="small" type="primary">上传文档</el-button>
        </el-upload>
      </el-header>
      <el-main style="height:calc(100% - 46px)">
        <!-- 表格 -->
        <el-table
          @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
          element-loading-text="加载中" v-loading="loading" ref="tableData" :data="tableData" highlight-current-row fit
          border height="100%" style="width:100%;overflow: auto;" row-key="id">
          <v-table-column prop="moniitemCode" label="文档名称" align="left">
            <template slot-scope="scope">
              <span>{{ scope.row.manualName }}</span>
            </template>
          </v-table-column>
          <v-table-column prop="lisItemCode" label="上传人" align="left">
            <template slot-scope="scope">
              <span>{{ scope.row.creatorName }}</span>
            </template>
          </v-table-column>
          <v-table-column prop="lisItemCode" label="上传时间" align="left">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime }}</span>
            </template>
          </v-table-column>
          <v-table-column prop="dictLink" label="操作" align="center" width="80px">
            <template slot-scope="scope">
              <el-button @click.native.prevent="handleDeleteData" type="text" size="mini">删除</el-button>
              <el-button @click.native.prevent="handleDownload(scope.row.manualName)" style="color:#E6A23C" type="text"
                size="mini">导出</el-button>
              <!-- <a :href="docHref" download="重症系统操作手册标准版.pdf" style="color:#E6A23C">导出</a> -->
              <!-- <el-button @click.native.prevent="editTable(scope.row,scope.$index)" style="color:#E6A23C" type="text" size="mini">导出</el-button> -->
            </template>
          </v-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import { operationManual_list, operationManual_delete } from '@/api/configuration'
import { getCookie } from '@/utils/cookie' // 存储方式
export default {
  name: 'HelpConfig',
  components: {},
  props: {},
  data() {
    return {
      loading: false, // 表格的loding
      tableData: [], // 表格数据
      fileList: [], // 文件列表
      importHeaders: { 'X-Token': getCookie('token').tocken },
      uploadApi: (process.env.NODE_ENV === 'production' ? globalConfig.PRO_BASE_API || './' : globalConfig.BASE_API) + 'operationManual/uploadPdfFile',
      uploading: false,
      uploadingText: '您的文档正在上传，完成之前请勿关闭页面！！！',
      docHref: `${(process.env.NODE_ENV === 'production' ? globalConfig.PRO_BASE_API || './' : globalConfig.BASE_API)}`
    }
  },
  watch: {},
  computed: {},
  beforeCreated() { },
  async created() {
    this.getData()
  },
  beforeMount() { },
  mounted() { },
  beforeUpdate() { },
  update() { },
  beforeDestroy() { },
  destroyed() { },
  methods: {
    // 获取文件列表
    getData() {
      operationManual_list().then(res => {
        this.tableData = []
        if (res.data) {
          this.tableData.push(res.data)
        }
      })
    },
    // 删除文件
    handleDeleteData() {
      const _this = this
      this.$confirm('您确定要删除吗？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        operationManual_delete().then(res => {
          _this.getData()
        })
      })
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleBeforeUpload(file) {
      this.uploading = true
      const isPdf = file.type === 'application/pdf'
      const isLt20M = file.size / 1024 / 1024 > 20
      if (!isPdf) {
        this.uploading = false
        this.$message.error('文件格式只能是pdf格式')
        return false
      }
      if (isLt20M) {
        this.uploading = false
        this.$message.error('文件大小不能超过20M')
        return false
      }
    },
    handleUploadProgress(event, file, fileList) {
      this.uploadingText = `您的文档正在上传，完成之前请勿关闭页面！！！(${event.percent.toFixed(2)}%)`
    },
    handleUploadSuccess() {
      this.uploading = false
      this.fileList = []
      this.getData()
      this.$message.success('上传成功')
    },
    handleUploadError() {
      this.uploading = false
      this.fileList = []
      this.$message.error('上传失败')
    },
    handleDownload(manualName) {
      fetch(`${this.docHref}${manualName}`).then((res) => {
        res.blob().then((blob) => {
          const blobUrl = window.URL.createObjectURL(blob)
          const filename = `${manualName}`
          const a = document.createElement('a')
          a.href = blobUrl
          a.download = filename
          a.click()
          window.URL.revokeObjectURL(blobUrl)
        })
      })
    }
  }
}
</script>
<style lang='scss' scoped>
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
    margin-top: 10px;
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

  ::v-deep .el-main{
    padding-top: 0;
  }

  .inputclass {
    ::v-deep .el-input>.el-input__inner {
      border: none;
      background: #f3f5f9;
      border-radius: 2px;
    }

    ::v-deep .el-button {
      margin-left: 10px;
    }
  }

  ::v-deep.el-switch {
    .el-switch__core {
      width: 45px !important;
    }

    .el-switch__label {
      position: absolute;

      span {
        font-size: 13px !important;
      }
    }

    .el-switch__label.is-active {
      z-index: 2;
    }

    .el-switch__label--left {
      margin-right: 0;
      left: 27px;
      color: #303133 !important;
    }

    .el-switch__label--right {
      margin-left: 0;
      left: 5px;
      color: #fff !important;
    }
  }

  .redCss {
    color: #f52c2c;
  }

  .pagination {
    float: right;
    margin-top: 15px;
    margin-right: -15px;
  }

  .elDialogCss {
    .lineP {
      display: flex;
      align-items: center;

      .name {
        flex: 3;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .value {
        flex: 6.5;
      }
    }
  }
}
</style>
