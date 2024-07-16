<!-- 特护单配置 -->
<template>

  <el-container id="dataSourceList" class="dataSourceList" element-loading-text="加载中" v-loading="loading">
    <!-- 左侧菜单 -->
    <div class="dataSourceList_left">
      <el-container class="dataSourceList_left_div">
          <el-tabs v-model="dataSourceType" @tab-click="changeTab">
            <el-tab-pane label="非标数据源" name="0"></el-tab-pane>
            <el-tab-pane label="标准数据源" name="1"></el-tab-pane>
          </el-tabs>

          <!-- 输入部分 -->
          <div class="dataSourceList_left_header ">
            <div class="flex align-items-center flex-1">
              <el-input @keyup.enter.native="formProSql_getAllFormProList(1)" class="input" v-model="searchForm.searchKey" size="small" clearable placeholder="数据源名称"
                      suffix-icon="el-icon-search" @input="init" style="width:180px;"  ></el-input>
              <span class="m-r10">适用查询模式</span>
              <el-select v-model="searchForm.fitMode" placeholder="请选择" filterable clearable style="width:160px;" class="m-r10" @change="formProSql_getAllFormProList(1)">
                <el-option :label="item.dictName" :value="item.dictCode" v-for="item in fitModeOption" :key="item.dictName"></el-option>
              </el-select>
              <span class="m-r10">适用组件类型</span>
              <el-select v-model="searchForm.fitComponent" placeholder="请选择" filterable clearable  style="width:160px;" class="m-r10"  @change="formProSql_getAllFormProList(1)">
                <el-option :label="item.dictName" :value="item.dictCode" v-for="item in fitComponentOption" :key="item.dictName"></el-option>
              </el-select>
              <el-checkbox v-model="searchForm.statusDict" true-label="" false-label="1"  @change="formProSql_getAllFormProList(1)">
                    显示禁用
              </el-checkbox>
            </div>
            <el-button @click.native.prevent="showSaveDialog()" type="primary" size="small" class="flex-end" v-if="dataSourceType=='0'">新增数据源</el-button>
          </div>

        <!-- 表格 -->
        <el-main class="dataSourceList_left_main">
          <div class="w100" style="height:calc(100% - 60px)">
            <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" ref="table"
              :row-class-name="({row}) => row.statusDict == 0 ? 'disabled' : ''" :data="tableData" height="100%"
              border>
              <v-table-column label="序号" prop="sortNo" width="80px"></v-table-column>
              <v-table-column label="编号" prop="formCode"></v-table-column>
              <v-table-column label="名称" prop="formName"></v-table-column>
              <v-table-column label="业务分类" prop="busiType">
                <template slot-scope="scope">
                  {{filterArrValue(scope.row.busiType,ICIS_DICT_DOC_BUSI_TYPE,'dictCode','dictName','')}}
                </template>
              </v-table-column>
              <v-table-column label="调用类型" prop="apiType">
                <template slot-scope="scope">
                  {{scope.row.apiType|showDictNameFilter(options,'dictCode_to_dictName')}}
                </template>
              </v-table-column>
              <v-table-column label="适用查询模式" prop="fitMode">
                <template slot-scope="scope">
                  {{filterArrValue(scope.row.fitMode,fitModeOption,'dictCode','dictName','')}}
                </template>
              </v-table-column>
              <v-table-column label="适用组件类型" prop="fitComponent">
                <template slot-scope="scope">
                  {{filterArrValue(scope.row.fitComponent,fitComponentOption,'dictCode','dictName','')}}
                </template>
              </v-table-column>
              <v-table-column label="调用API" prop="execSql"></v-table-column>
              <v-table-column label="备注" prop="remark"></v-table-column>
              <v-table-column label="操作" width="160">
                <template slot-scope="scope">
                  <el-button @click.native.prevent="showCopy(scope.row)" type="text" size="small" v-if="dataSourceType=='0'||(dataSourceType=='1'&&scope.row.sysInitFlag=='1')">复制</el-button>
                  <el-button @click.native.prevent="showSaveDialog(scope.row)" type="text" size="small">修改</el-button>
                  <el-button @click.native.prevent="showParamDialog(scope.row)" type="text" size="small">修改参数</el-button>
                  <el-button type="text" size="small" v-if="dataSourceType=='1'">占位符</el-button>
                  <el-button @click.native.prevent="leftEnableOrDisable(scope.row,scope.$index)" :style="{ color: scope.row.statusDict == 1 ? '#EC0000': '#00AB44' }" type="text" size="mini">{{+scope.row.statusDict ? '禁用' : '启用' }}</el-button>
                </template>
              </v-table-column>
            </el-table>
          </div>
          <footer style="position: absolute; bottom: 30px; background:#fff;" class="w100">
            <el-pagination  @current-change="changePage" @prev-click="changePage" @next-click="changePage"
              :current-page.sync ="pageNum" hide-on-single-page :page-size="10" background layout="total, prev, pager, next" :total="totalCount"> </el-pagination>
          </footer>
        </el-main>
      </el-container>
      <el-dialog :close-on-click-modal="false" v-el-drag-dialog title="数据源设置" :visible.sync="dialogShow" :before-close="dialogClose" width="420px">
        <el-form ref="form" :model="form" label-width="80px" :rules="rules">
          <el-form-item label="序号" prop="sortNo">
            <el-input-number v-model="form.sortNo" placeholder="请输入" maxlength="10" :min="1" ></el-input-number>
          </el-form-item>
          <el-form-item label="编码" :rules="[{ required: true, message: '编码不能为空'}]" prop="formCode" v-if="dataSourceType=='1'">
            <el-input v-model="form.formCode" placeholder="请输入" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="名称" :rules="[{ required: true, message: '名称不能为空'}]" prop="formName">
            <el-input v-model="form.formName" placeholder="请输入" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="调用类型" :rules="[{ required: true, message: '调用类型不能为空'}]" prop="apiType">
            <el-select v-model="form.apiType" placeholder="请选择" :disabled="!!form.id">
              <el-option v-for="item in options" :key="item.dictCode" :label="item.dictName" :value="item.dictCode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="调用API" :rules="[{ required: true, message: '调用API不能为空'}]" prop="execSql">
            <el-input v-model="form.execSql" placeholder="请输入" maxlength="30" :disabled="!!form.id"></el-input>
          </el-form-item>
          <el-form-item label="备注"  prop="remark">
            <el-input v-model="form.remark" placeholder="请输入" maxlength="100" :disabled="!!form.id" ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogClose">取消</el-button>
          <el-button type="primary" @click="saveTemp">保存</el-button>
        </span>
      </el-dialog>
      <el-dialog :close-on-click-modal="false" v-el-drag-dialog title="编辑参数" :visible.sync="paramsVisible" :before-close="closeParamsVisible" width="1000px">
        <div class="flex" style="justify-content: end;padding-bottom:10px">
          <el-button @click.native.prevent="addParam()" type="primary" size="small">新增参数</el-button>
        </div>
        <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" ref="table" :row-class-name="({row}) => row.statusDict == 0 ? 'disabled' : ''" :data="paramsTableData" border height="600px">
          <v-table-column label="*序号" prop="apiParamSort">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isCreate||scope.row.isEdit" v-model="scope.row.apiParamSort" placeholder="请输入" maxlength="30" :disabled="!scope.row.isCreate"></el-input>
              <template v-else>{{scope.row.apiParamSort}}</template>
            </template>
          </v-table-column>
          <v-table-column label="*参数名称" prop="apiParamName">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isCreate||scope.row.isEdit" v-model="scope.row.apiParamName" placeholder="请输入" maxlength="100"></el-input>
              <template v-else>{{scope.row.apiParamName}}</template>
            </template>
          </v-table-column>
          <v-table-column label="*参数值" prop="apiParamValue">
            <template slot-scope="scope">
              <el-input type="textarea" v-if="scope.row.isCreate||scope.row.isEdit" v-model="scope.row.apiParamValue" placeholder="请输入" autosize></el-input>
              <template v-else>{{scope.row.apiParamValue}}</template>
            </template>
          </v-table-column>
          <v-table-column label="描述" prop="apiParamDesc">
            <template slot-scope="scope">
              <el-input type="textarea" v-if="scope.row.isCreate||scope.row.isEdit" v-model="scope.row.apiParamDesc" placeholder="请输入" maxlength="500" autosize ></el-input>
              <template v-else>{{scope.row.apiParamDesc}}</template>
            </template>
          </v-table-column>
          <v-table-column label="备注" prop="apiParamNote">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isCreate||scope.row.isEdit" v-model="scope.row.apiParamNote" placeholder="请输入" maxlength="100" autosize type="textarea"></el-input>
              <template v-else>{{scope.row.apiParamNote}}</template>
            </template>
          </v-table-column>
          <v-table-column label="操作" width="130">
            <template slot-scope="scope">
              <el-button @click.native.prevent="editParam(scope.row)" v-if="!scope.row.isEdit&&scope.row.id" type="text" size="small">编辑</el-button>
              <el-button @click.native.prevent="saveParam(scope.row)" type="text" size="small" v-if="scope.row.isEdit">保存</el-button>
              <el-button v-if="scope.row.isEdit" @click.native.prevent="cancelEdit(scope.row,scope.$index)"   type="text" size="small">取消</el-button>
              <el-button v-if="!scope.row.isEdit&&scope.row.id" @click.native.prevent="rightEnableOrDisable(scope.row,scope.$index)" :style="{ color: scope.row.statusDict == 1 ? '#EC0000': '#00AB44' }" type="text" size="mini">{{+scope.row.statusDict ? '禁用' : '启用' }}</el-button>
            </template>
          </v-table-column>
        </el-table>
      </el-dialog>
      <el-dialog :close-on-click-modal="false" v-el-drag-dialog title="标准数据源编辑参数" :visible.sync="standardVisible" :before-close="closeStandardVisible" width="1200px">
        <div style="height:600px;">
          <ParamList :formId.sync="formId" ref="paramList" ></ParamList>
        </div>
      </el-dialog>
      <el-dialog :close-on-click-modal="false" v-el-drag-dialog title="复制数据源" :visible.sync="copyDialog" :before-close="closeCopyDiaglog" width="600px">
        <el-form :model="saveasForm" inline label-width="120px"  ref="copyFrom">
          <el-form-item label="序号" prop="sortNo">
            <el-input-number v-model="saveasForm.sortNo" placeholder="请输入" maxlength="10" :min="1" ></el-input-number>
          </el-form-item>
          <el-form-item label="数据源名称" :rules="[{ required: true, message: '名称不能为空'}]"  label-wdith="120px" prop="formName">
            <el-input v-model="saveasForm.formName" :maxlength="100" style="width:420px;"></el-input>
          </el-form-item>
          <el-form-item label="数据源编号"  :rules="[{ required: true, message: '编码不能为空' }]" label-wdith="120px" prop="formCode" v-if="dataSourceType=='1'">
            <el-input v-model="saveasForm.formCode" :maxlength="100" style="width:420px;"></el-input>
          </el-form-item>
          <el-form-item label="备注" label-wdith="120px" >
            <el-input v-model="saveasForm.remark" :maxlength="100" style="width:420px;"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeCopyDiaglog">取消</el-button>
          <el-button type="primary" @click="saveasTemp">保存</el-button>
        </span>
      </el-dialog>

    </div>
  </el-container>
</template>

<script>

import {
  formProSql_addFormProSql,
  apiParam_addApiParam,
  formProSql_listPage, // 主界面list
  apiParam_getAllApiParamList,
  formProSql_updateFormProSql,
  apiParam_updateApiParam,
  apiParam_enable,
  formProSql_deleteFormProSqlById,
  formProSql_copyFormProSql
} from '@/api/configuration'
import { filterArrValue } from '@/utils/utils'
export default {
  name: 'DataSourceList',
  components: {
    ParamList: () => import('./paramConfigCom/paramList.vue')
  },
  data: function () {
    return {
      pageSize: 10,
      totalCount: 0,
      // 列表数据
      listData: [],
      // 搜索栏
      searchForm: {
        searchKey: '',
        statusDict: ''
      },
      // 重症记录单保存数据 名称 类型
      form: {
        sortNo: 1,
        beid: 209,
        tempType: 1,
        formName: '',
        formCode: '',
        remark: '',
        apiType: '',
        excelSql: ''
      },
      options: [
        { dictName: '基础方法', dictCode: 1 },
        { dictName: '内置方法', dictCode: 2 },
        { dictName: '扩展方法(评估单)', dictCode: 3 },
        { dictName: '基础方法(新)', dictCode: 4 }
      ],
      // 保存弹框
      dialogShow: false,
      // 表格配置弹框
      paramsVisible: false,
      recordId: '',
      // 加载中
      loading: false,
      // 模板列表
      tableData: [],
      paramsTableData: [],
      apiParamId: '',
      docType: 1,
      editRow: {},
      rules: {
        tempName: [
          { required: true, message: '模板名称', trigger: 'blur' }
        ],
        tempPageNum: [
          { required: true, message: '模板页数', trigger: 'blur' }
        ]
      },
      copeRules: {
        formName: [
          { required: true, message: '数据源名称', trigger: 'blur' }
        ],
        formCode: [
          { required: true, message: '数据源编码', trigger: 'blur' }
        ]
      },
      fitModeOption: [
        { dictCode: '1', dictName: '不分组' },
        { dictCode: '2', dictName: '按自然日分组' },
        { dictCode: '3', dictName: '按全班次分组' },
        { dictCode: '4', dictName: '按各班次分组' }

      ],
      fitComponentOption: [
        { dictCode: '1', dictName: '交叉表' },
        { dictCode: '2', dictName: '流式表' },
        { dictCode: '3', dictName: '公用组件' }
      ],
      copyDialog: false,
      saveasForm: {
        id: '',
        formName: ''
      },
      dataSourceType: '0',
      ICIS_DICT_DOC_BUSI_TYPE: '',
      pageNum: 1,
      standardVisible: false,
      formId: ''

    }
  },
  props: {},
  watch: {
    pageNum: function(newValue) {
      console.log('pageNum===========', newValue)
    }
  },
  computed: {

  },
  async created() {
    this.ICIS_DICT_DOC_BUSI_TYPE = await this.$getDictItemList('ICIS_DICT_DOC_BUSI_TYPE')
    this.init()
  },
  mounted() { },
  methods: {

    filterArrValue,
    // 初始化数据
    init() {
      this.formProSql_getAllFormProList(1)
    },
    changeTab() {
      this.formProSql_getAllFormProList(1)
    },
    /**
     * 启用禁用
     */
    async rightEnableOrDisable(row) {
      await apiParam_enable({ id: row.id, statusDict: row.statusDict == '1' ? '0' : '1' })
      this.$message({
        type: 'success',
        message: +row.statusDict ? '已禁用' : '已启用'
      })
      const res = await apiParam_getAllApiParamList({
        'apiParamId': row.apiParamId
      })
      this.paramsTableData = res.data
    },
    editParam(row) {
      this.editRow = JSON.parse(JSON.stringify(row))
      for (let index = 0; index < this.paramsTableData.length; index++) {
        const element = this.paramsTableData[index]
        if (element.id == row.id) {
          element.isEdit = !element.isEdit
          break
        }
      }
      this.paramsTableData = JSON.parse(JSON.stringify(this.paramsTableData))
    },
    saveParam: async function (row) {
      const pro = row.id ? apiParam_updateApiParam(row) : apiParam_addApiParam(row)
      await pro
      const res = await apiParam_getAllApiParamList({
        'apiParamId': row.apiParamId
      })
      this.paramsTableData = res.data.map(v => {
        v.isCreate = false
        v.isEdit = false
        return v
      })
    },
    /**
     * 取消编辑参数
     */
    cancelEdit(row, index) {
      if (row.isCreate) {
        row.isCreate = false
        row.isEdit = false
        this.paramsTableData.splice(index, 1)
      } else {
        row.isEdit = false
        this.paramsTableData[index] = this.editRow
      }
    },
    addParam() {
      this.paramsTableData.unshift({
        isCreate: true,
        isEdit: true,
        apiParamDesc: '',
        apiParamId: this.apiParamId, // 必填
        apiParamName: '', // 必填
        apiParamNote: '',
        apiParamValue: '',
        apiParamSort: 1 // 必填
      })
    },
    showParamDialog: async function (row) {
      if (this.dataSourceType == '0') { // 非标数据源
        this.apiParamId = row.apiParamId
        const res = await apiParam_getAllApiParamList({
          'apiParamId': row.apiParamId
        })
        this.paramsTableData = res.data
        this.paramsVisible = true
      } else {
        this.formId = row.id
        // 标准数据源参数显示
        this.standardVisible = true
      }
    },
    /**
     * 关闭标准数据源
     */
    closeStandardVisible() {
      this.standardVisible = false
      this.$refs.paramList.moduleCode = ''
      this.$refs.paramList.paramSearchKey = ''
    },
    // 显示保存弹框
    showSaveDialog(obj) {
      this.dialogShow = true
      if (obj) { // 修改
        this.form = { ...obj }
      } else {
        this.form.sortNo = Math.max(... this.tableData.filter(item => item.sortNo).map(item => item.sortNo)) + 1
      }
    },
    // 保存数据
    saveTemp() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const query = { ...this.form }
          let pro
          if (query.id) {
            pro = formProSql_updateFormProSql(query)
          } else {
            pro = formProSql_addFormProSql(query)
          }
          pro.then((res) => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: query.id ? '修改成功' : '新增成功'
              })
              this.dialogClose()
              this.formProSql_getAllFormProList(this.pageNum)
            }
          })
        }
      })
    },
    // 隐藏新增弹框
    dialogClose() {
      this.dialogShow = false

      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      const form = {
        beid: 209,
        tempType: 1,
        tempName: '',
        tempPageNum: 1,
        sortNo: ''

      }
      this.form = { ...form }
    },
    // 启用禁用-record
    leftEnableOrDisable(obj) {
      formProSql_deleteFormProSqlById({
        id: obj.id,
        statusDict: obj.statusDict == '1' ? '0' : '1'
      }).then(res => {
        this.$message({
          type: 'success',
          message: +obj.statusDict ? '已禁用' : '已启用'
        })
        this.formProSql_getAllFormProList(this.pageNum)
      })
    },
    // 关闭sheet
    closeParamsVisible() {
      this.paramsVisible = false
    },
    changePage(pageNum) {
      this.pageNum = pageNum
      this.formProSql_getAllFormProList(pageNum)
    },
    // 获取模板列表
    formProSql_getAllFormProList(pageNum) {
      this.tableData = []
      // this.totalCount = 0
      formProSql_listPage({
        pageSize: 10,
        pageNum: pageNum,
        fitMode: this.searchForm.fitMode,
        searchKey: this.searchForm.searchKey,
        statusDict: this.searchForm.statusDict,
        fitComponent: this.searchForm.fitComponent,
        standardFlag: this.dataSourceType == '1'
      }).then(res => {
        this.tableData = res.data.result
        if (pageNum == 1) { this.totalCount = res.data.totolCount }
      })
    },
    /**
     * 显示复制窗口
     */
    showCopy(row) {
      this.saveasForm = { ...row }
      this.saveasForm.formName = this.saveasForm.formName + '_复制'
      this.saveasForm.formCode = ''
      this.copyDialog = true
    },
    closeCopyDiaglog() {
      this.copyDialog = false
      this.saveasForm = {
        id: '',
        formName: ''
      }
    },
    /**
     * 另存为数据源
     */
    saveasTemp() {
      this.$refs.copyFrom.validate((validate) => {
        if (validate) {
          const query = { ...this.saveasForm }
          if (this.dataSourceType == '1') { // 标准不需要apiid
            delete query.apiParamId
          }
          formProSql_copyFormProSql(query).then(res => {
            if (res.code == 0) {
              this.$message.success('复制成功')
              this.formProSql_getAllFormProList(this.pageNum)
              this.closeCopyDiaglog()
            }
          })
        }
      })
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
  }
  &__footer {
    border-top: 1px solid #dfe7f5;
    text-align: right;

    .el-button {
      width: 90px;
    }
  }
}
.dataSourceList {
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
      display: block;
    }
    &_header {
      display: flex;
      align-items: center;
      padding: 0;
      height: 31px !important;
      background: #ffffff;
      font-size:14px;
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
      height: calc(100% - 92px);
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
      .pagination {
        float: left;
        margin-top: 15px;
        margin-right: -30px;
      }
    }
    ::v-deep .el-dialog__body {
      padding: 10px 20px;
    }
  }
}
</style>
