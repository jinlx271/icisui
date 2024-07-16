<!-- 特护单配置 -->
<template>

  <el-container id="recordList" class="recordList" element-loading-text="加载中" v-loading="loading">
    <!-- 左侧菜单 -->
    <div class="recordList_left">
      <el-container class="recordList_left_div">
        <el-header class="elHeader1">
          <div>
            <i class="iconBlue"></i>
            <span>表格组件列表</span>
          </div>
        </el-header>
        <!-- 输入部分 -->
        <div class="recordList_left_header  flex-between">
          <div class="flex align-items-center">
            <el-input @keyup.enter.native="init" class="input" v-model="searchForm.searchKey" size="small" clearable placeholder="组件名称"
                      suffix-icon="el-icon-search" @input="init"></el-input>
            <el-checkbox v-model="searchForm.statusDict" true-label="" false-label="1"  >
                  显示禁用
            </el-checkbox>
          </div>
          <el-button @click.native.prevent="showSaveDialog()" type="primary" size="small">新增组件</el-button>
        </div>
        <!-- 表格 -->
        <el-main class="recordList_left_main">
          <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" ref="table" :row-class-name="({row}) => row.statusDict == 0 ? 'disabled' : ''" :data="filterDatas" border>
            <v-table-column label="序号" prop="sortNo" width="80px"></v-table-column>
            <v-table-column label="组件名称" prop="criticlalRecordName"></v-table-column>
            <v-table-column label="组件类型" prop="criticlalRecordTypeDict" width="120px">
              <template slot-scope="scope">
                {{typeList.filter(item=>item.dictCode==scope.row.criticlalRecordTypeDict)[0].dictName}}
              </template>
            </v-table-column>
            <v-table-column label="折行合并单元格" prop="mergeCell" align="center" width="120px">
              <template slot-scope="scope">
                <span>{{scope.row.mergeCell=='1'?'是':'否'}}</span>
              </template>
            </v-table-column>
            <v-table-column label="操作" width="180px">
              <template slot-scope="scope">
                <el-button @click.native.prevent="operation(scope.row)" :disabled="!hasRoute" type="text" size="small">设计</el-button>
                <el-button @click.native.prevent="showSaveDialog(scope.row)" type="text" size="small">修改</el-button>
				<el-button @click.native.prevent="copyRow(scope.row)" type="text" size="small">复制</el-button>
                <el-button @click.native.prevent="enableOrDisable(scope.row)" :style="{ color: scope.row.statusDict == 1 ? '#EC0000': '#00AB44' }"
                           type="text" size="small">{{+scope.row.statusDict ? '禁用' : '启用' }}</el-button>
              </template>
            </v-table-column>
          </el-table>
        </el-main>
        <!-- 翻页 -->
        <!-- <el-footer class="recordList_left_footer">
          <el-pagination @current-change="findPage" :total="totalCount" :page-size="pageSize" :hide-on-single-page="true"
                         layout="total, prev, pager, next" class="pagination" background></el-pagination>
        </el-footer> -->
      </el-container>
    </div>
    <el-dialog :title="diaglogTitle" :visible.sync="dialogShow" :before-close="dialogClose" width="420px">
      <el-form ref="form" :model="form" label-width="120px" :rules=" rules">
        <el-form-item label="名称" prop="criticlalRecordName">
          <el-input v-model="form.criticlalRecordName" placeholder="请输入" :maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="criticlalRecordTypeDict">
          <!-- <el-input v-model="form.name" placeholder="请选择"></el-input> -->
          <el-select v-model="form.criticlalRecordTypeDict" placeholder="请选择" :disabled="diaglogTitle=='另存为组件'">
            <el-option v-for="item in typeList" :key="item.dictCode" :label="item.dictName" :value="item.dictCode" :disabled="item.statusDict == '0'">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="序号" prop="sortNo">
          <el-input-number v-model="form.sortNo" :min="1" placeholder="请输入"></el-input-number>
        </el-form-item>
        <el-form-item label="折行合并单元格" prop="mergeCell">
          <el-switch v-model="form.mergeCell" :active-value="1" :inactive-value="0" :disabled="form.criticlalRecordTypeDict!=2" active-text="是"
                           inactive-text="否"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取消</el-button>
        <el-button type="primary" @click="saveRecord">保存</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="sheetFlag" :before-close="closeSheet" width="95%">
      <!-- <XSpreadsheet :recordId='recordId'></XSpreadsheet> -->
    </el-dialog>
  </el-container>

</template>

<script>
import {
  getNextSortNo
} from '@/api/anas'
import {
  findAllWithPage_criticalRecord,
  insert_criticalRecord,
  deleteById_criticalRecord,
  edit_criticalRecord
} from '@/api/criticalRecord'
import {
  dictItem_findAllWithPage
} from '@/api/configuration'
export default {
  name: 'RecordList',
  components: {
    // XSpreadsheet
  },
  data: function () {
    return {
      hasRoute: false,
      pageSize: 10,
      totalCount: 0,
      // 列表数据
      listData: [],
      // 搜索栏
      searchForm: {
        statusDict: '',
        searchKey: ''
      },
      // 重症记录单保存数据 名称 类型
      form: {
        sortNo: 1,
        criticlalRecordName: '',
        criticlalRecordId: '',
        criticlalRecordTypeDict: '',
        criticlalRecordConfig: JSON.stringify({}),
        mergeCell: '0'
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
      typeList: [
      ],
      // 保存弹框
      dialogShow: false,
      diaglogTitle: '组件配置',
      // 表格配置弹框
      sheetFlag: false,
      recordId: '',
      // 加载中
      loading: false
    }
  },
  props: {},
  watch: {},
  computed: {
    filterDatas: function() {
      return this.searchForm.statusDict != '' ? this.listData.filter(item => item.statusDict == this.searchForm.statusDict) : this.listData
      }

  },
  created() {
    const menuPathList = JSON.parse(sessionStorage.getItem('menuPathList'))
    this.hasRoute = menuPathList.filter(v => v == '/configuration/recordSetting/tinymacEditor').length > 0
    this.init()
  },
  mounted() { },
  methods: {
    // 初始化数据
    init() {
      this.getTableTypeList()
    },
    getTableTypeList() {
      const query = {
        pageNum: 1,
        pageSize: 1000,
        dictGroupCode: 'ICIS_DICT_FORM_TYPE'
      }
      dictItem_findAllWithPage(query).then(res => {
        if (res.code == 0) {
          this.typeList = res.data.result
          this.findPage(1)
        }
      })
    },

    // 查询数据列表
    findPage(page) {
      this.loading = true
      const query = {
        // pageSize: this.pageSize,
        pageNum: page || 1,
        statusDict: this.searchForm.statusDict
      }
      if (this.searchForm.searchKey != '') {
        query.criticlalRecordName = this.searchForm.searchKey
      }
      findAllWithPage_criticalRecord(query).then(res => {
        this.loading = false
        if (res.code == 0) {
          this.listData = res.data.filter(item => item.criticlalRecordTypeDict != '')
          // const result = res.data.result
          // this.totalCount = res.data.totolCount
          // this.listData = result
        }
      })
    },
    async copyRow(row) {
      const newObj = JSON.parse(JSON.stringify(row))
      newObj.criticlalRecordName += '_复制'
      delete newObj.criticlalRecordId
      newObj.sortNo = await this.getMaxSortNo()
      newObj.statusDict = 1
      this.showSaveDialog(newObj)
    },
    // 显示保存弹框
    async showSaveDialog(obj) {
      this.dialogShow = true
      this.diaglogTitle = '组件配置'
      if (obj) {
        this.form.criticlalRecordName = obj.criticlalRecordName
        this.form.criticlalRecordTypeDict = obj.criticlalRecordTypeDict
        this.form.mergeCell = obj.mergeCell || '0'
        this.form.criticlalRecordConfig = obj.criticlalRecordConfig
        this.form.sortNo = obj.sortNo
        if (obj.criticlalRecordId) {
          this.form.criticlalRecordId = obj.criticlalRecordId
        } else {
          this.diaglogTitle = '另存为组件'
          this.form = JSON.parse(JSON.stringify(obj))
          this.form.criticlalRecordId = ''
        }
      } else {
        this.form.criticlalRecordName = ''
        this.form.criticlalRecordTypeDict = ''
        this.form.criticlalRecordId = ''
        this.form.criticlalRecordConfig = JSON.stringify({})
        this.form.mergeCell = '0'
        this.form.sortNo = await this.getMaxSortNo()
        this.$refs.form.clearValidate()
      }
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
    // 保存数据
    saveRecord() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const query = this.form
          if (query.criticlalRecordId != '') {
            edit_criticalRecord(query).then(res => {
              this.dialogShow = false
              this.$message.success('保存成功')
              this.init()
            })
          } else {
            insert_criticalRecord(query).then(res => {
              this.dialogShow = false
              if (this.diaglogTitle == '另存为组件') this.$message.success('保存成功')
              else this.$message.success('新增成功')
              this.init()
            })
          }
        }
      })
    },
    // 隐藏新增弹框
    dialogClose() {
      this.dialogShow = false
      this.form.criticlalRecordName = ''
      this.form.criticlalRecordTypeDict = ''
      this.form.criticlalRecordId = ''
      this.form.sortNo = 1
      this.$refs.form.resetFields()
    },
    // 启用禁用-record
    enableOrDisable(obj) {
      deleteById_criticalRecord({
        criticlalRecordId: obj.criticlalRecordId,
        statusDict: obj.statusDict == '1' ? '0' : '1'
      }).then(res => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: +obj.statusDict ? '已禁用' : '已启用'
          })
          this.init()
        }
      })
    },
    operation(row) {
      this.recordId = row.criticlalRecordId
      this.$router.push({
        path: '/configuration/recordSetting/tinymacEditor',
        query: {
          recordId: this.recordId
        }
      })
    },
    // 关闭sheet
    closeSheet() {
      this.sheetFlag = false
    },
    /**
     * 校验名称是否有重复
     */
    validatorName(name, callback) {
      const filterRe = this.listData.filter(item => item.criticlalRecordId != this.form.criticlalRecordId && item.criticlalRecordName == name)
      if (filterRe.length > 0) {
          callback(new Error())
      }
      callback()
    },
    changeRecordType(e) {
      if (e != '2') {
        this.form.mergeCell = '0'
      }
    }
  }
}
</script>

<style lang="scss" scoped>

::v-deep .el-footer {
  padding-left: 0px;
}
::v-deep .el-dialog {
  &__header {
    border-bottom: 1px solid #dfe7f5;
  }
  &__body {
    padding: 18px 20px 0 0;
    margin: 0 auto;

    .el-date-editor {
      width: 100%;
    }
    .el-input > .el-input__inner {
      border: none;
      background: #f3f5f9;
      border-radius: 2px;
    }
    .el-input__prefix {
      right: 0;
      left: inherit;
    }
    .el-input__inner {
      padding-left: 10px;
    }
  }
  &__footer {
    border-top: 1px solid #dfe7f5;
    text-align: right;

    .el-button {
      width: 90px;
    }
  }
}
.recordList {
  background: #ffffff;
  height: 100%;
  display: flex;
  padding: 1%;
  .redCss {
    color: #f52c2c;
  }
  .mainColor {
    color: $light-blue;
  }
  .elHeader1 {
    height: 34px !important;
    margin-top: 18px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    padding-left: 0px;
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
      height: 100%;
    }
    span {
      flex: 1;
      margin-left: 8px;
      height: 22px;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #000000;
      line-height: 22px;
    }
    .el-button {
      width: 90px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      span {
        margin: 0;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
      }
    }
  }
  &_left {
    width: 100%;
    &_div {
      height: 100%;
    }
    &_header {
      display: flex;
      align-items: center;
      padding: 0;
      height: 31px !important;
      background: #ffffff;
      border-radius: 2px;
      margin-bottom: 10px;
      .input {
        margin-right: 10px;
      }
      ::v-deep input {
        background: #f3f5f9;
        border: none;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #000622;
      }
    }
    &_main {
      height: calc(100% - 42px);
      padding: 0;
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
          padding: 0 8px;
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
    &_footer {
      text-align: right;
      .pagination {
        margin-top: 15px;
      }
    }
    ::v-deep .el-dialog__body {
      padding: 20px 20px 0 20px;
    }
  }
  &_right {
    margin-left: 1.9%;
    padding-left: 1.7%;
    border-left: 2px solid rgba(203, 215, 238, 0.3);
    // box-shadow: 0px 2px 4px 0px rgba(203, 215, 238, 0.5);
    .el-header {
      height: 32px !important;
      padding: 0;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      // recordList_right_head 右侧搜索栏的input
      .el-input {
        width: 300px;
        .el-input__inner {
          border: none;
          background: #f3f5f9;
          border-radius: 2px;
        }
      }
    }
    .el-main {
      padding: 0;
    }
    &_body {
      .config {
        border: 1px solid #d9e3ff;
        .title {
          height: 38px;
          line-height: 38px;
          padding: 0px 10px;
          font-size: 14px;
          background: #d9e3ff;
          color: #333;
          font-weight: 600;
          display: flex;
          label {
            flex: 1;
          }
          div {
            width: 100px;
            span {
              width: 50px;
              padding: 0px 8px;
            }
          }
        }
        .content {
          height: auto;
          padding: 10px;
          .header {
            width: 100%;
            display: flex;
            height: 38px;
            align-items: center;
            font-size: 14px;
          }
          .label {
            color: #333;
            font-weight: 600;
            display: flex;
            align-items: center;
            flex: 1;
          }
          .list {
            display: block;
            .item {
              display: flex;
              align-items: center;
              padding: 5px 0px;
              height: 32px;
              margin-bottom: 5px;
              .data {
                padding-right: 10px;
                display: flex;
                flex: 1;
                align-items: center;
                ::v-deep .el-select {
                  width: 100%;
                }
                ::v-deep .el-input > .el-input__inner {
                  border: none;
                  background: #f3f5f9;
                  border-radius: 2px;
                }
              }
            }
          }
          .addNotice {
            line-height: 32px;
            padding: 5px;
            font-size: 14px;
            height: 32px;
            color: #666;
            .plusClass {
              font-size: 12px;
              margin-right: 10px;
            }
          }
        }
        .right {
          width: 98px;
          display: flex;
        }
      }
      .newConfig {
        height: 38px;
        line-height: 38px;
        margin-top: 10px;
        border: 1px solid #d9e3ff;
        color: var(--maincolor);
        text-align: center;
        font-size: 14px;
        .plusClass {
          font-size: 12px;
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
