<template>
  <div class="dataSourceConfig" id="dataSourceConfig" ref="dataSourceConfig">
    <el-container style="height:100%">
      <!-- 头部 -->
      <el-header>
        <div class="flex">
          <el-input @keyup.enter.native="init" @input="debounceFC" v-model="queryData.searchKey" size="small"
            placeholder="编码/名称" clearable suffix-icon="el-icon-search"></el-input>
          <el-checkbox v-model="queryData.statusDict" true-label="" false-label="1" @change="debounceFC">
            显示禁用
          </el-checkbox>
        </div>
        <el-button size="mini" @click="operation('add')" type="primary">新 增</el-button>
      </el-header>
      <!-- 表格 -->
      <el-main style="height:calc(100% - 112px)">
        <el-table
          @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
          element-loading-text="加载中" v-loading="loading" ref="tableData" :data="tableData" highlight-current-row fit
          border height="100%" style="width:100%;overflow: auto;" row-key="id"
          :row-class-name="({ row }) => row.statusDict == 0 ? 'disabled' : ''">
          <v-table-column prop="formCode" label="重症评估表编码" align="left">
            <template slot-scope="scope">
              <span>{{ scope.row.formCode }}</span>
            </template>
          </v-table-column>
          <v-table-column prop="formName" label="重症评估表名称" align="left">
            <template slot-scope="scope">
              <el-select v-if="scope.row.isEdit || scope.row.isAdd" v-model="scope.row.formCode" filterable placeholder="请选择"
                clearable style="width:100%">
                <el-option v-for="item in evaluationFormList" :key="item.formCode" :value="item.formCode"
                  :disabled="item.statusDict == '0'" :label="item.formName"></el-option>
              </el-select>
              <span v-else>{{ scope.row.formName }}</span>
            </template>
          </v-table-column>
          <v-table-column prop="nisFormCode" label="NIS评估表编码" align="left">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isEdit || scope.row.isAdd" type="type" v-model="scope.row.nisFormCode"
                placeholder="请输入"></el-input>
              <span v-else>{{ scope.row.nisFormCode }}</span>
            </template>
          </v-table-column>
          <v-table-column prop="nisFormName" label="NIS评估表名称" align="left">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isEdit || scope.row.isAdd" type="type" v-model="scope.row.nisFormName"
                placeholder="请输入"></el-input>
              <span v-else>{{ scope.row.nisFormName }}</span>
            </template>
          </v-table-column>
          <v-table-column prop="dictLink" label="操作" align="center" width="120px">
            <template slot-scope="scope">
              <el-button v-if="!scope.row.isEdit && !scope.row.isAdd" @click.native.prevent="enableOrDisable(scope.row, scope.$index)"
                :style="{ color: scope.row.statusDict == 1 ? '#EC0000' : '#00AB44' }" type="text"
                size="mini">{{+scope.row.statusDict ? '禁用' : '启用' }}</el-button>
                <el-button v-if="!scope.row.isEdit && !scope.row.isAdd"
                @click.native.prevent="operation('update', scope.row, scope.$index)" type="text"
                size="small">修改</el-button>
              <el-button v-if="scope.row.isEdit || scope.row.isAdd" type="text" style="color:#909399"
                @click="operation('cancel', scope.row, scope.$index)">取消</el-button>
              <el-button v-if="scope.row.isEdit || scope.row.isAdd" type="text"
                @click="operation('save', scope.row, scope.$index)">保存</el-button>
            </template>
          </v-table-column>
        </el-table>
      </el-main>
      <!-- 分页 -->
      <el-footer>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="queryData.pageNum" :total="totolCount" :page-sizes="[10, 15, 20, 25, 30]"
          :page-size="queryData.pageSize" :hide-on-single-page="false" layout="total, sizes, prev, pager, next"
          class="pagination" background></el-pagination>
      </el-footer>
    </el-container>
  </div>
</template>
<script>

import {
  // assessNisMapper_list, // 列表 不分页
  assessNisMapper_listPage, // 列表 分页
  assessNisMapper_add, // 新增
  assessNisMapper_update, // 修改
  assessNisMapper_enable, // 启用
  assessNisMapper_disable, // 禁用
  formconfig_list // 评估表列表
} from '@/api/configuration'
import _ from 'lodash'
export default {
  name: 'DataSourceConfig',
  components: {},
  props: {},
  data() {
    return {
      loading: false, // 表格的loding
      queryData: {
        pageNum: 1, // 页码必传
        pageSize: 15, // 一页数量，必传
        searchKey: '', // 搜索关键字，非必传
        statusDict: '1'
      },
      totolCount: 0, // 分页总量
      tableData: [], // 表格数据
      oneTableData: {}, // 取消用来还原
      oldTableData: [], // 存储数据表格数据
      evaluationFormList: [], // 评估表查询
      lisItemList: [] // LIS检验名称
    }
  },
  watch: {},
  computed: {},
  beforeCreated() { },
  created() {
    // 截流
    this.debounceFC = _.debounce(() => {
      this.queryData.pageNum = 1 // 输入的时候需要改为第一页
      this.init() // 输入框截流
    }, 800)

    this.formconfigListFc() // 评估单列表
    this.init() // 初始化
  },
  beforeMount() { },
  mounted() { },
  beforeUpdate() { },
  update() { },
  beforeDestroy() { },
  destroyed() { },
  methods: {
    /**
     * 初始化
     */
    init() {
      this.queryData.pageNum = 1
      this.queryTableFc()
    },
    /**
     * 评估单选择列表
     */
    formconfigListFc(codes, searchKey) {
      formconfig_list({
        codes: codes || '', // 非必传，优先查询数据返回最上面
        limit: 50, // 非必传,限制查询条数，不传的话-默认200
        searchKey: searchKey || '' // 非必传，模糊查询
      }).then(res => {
        this.evaluationFormList = res.data
      })
    },
    /**
     * 列表请求
     */
    queryTableFc() {
      this.tableData = []
      assessNisMapper_listPage(this.queryData).then(res => {
        this.totolCount = res.data.totolCount
        res.data.result.map(item => {
          item.isEdit = false
        })
        this.tableData = res.data.result
        this.oldTableData = JSON.parse(JSON.stringify(res.data.result))
      })
    },
    /**
     * 翻页 一页总条数
     */
    handleSizeChange(num) {
      this.queryData.pageNum = 1
      this.queryData.pageSize = num
      this.queryTableFc()
    },
    /**
     * 翻页
     */
    handleCurrentChange(num) {
      this.queryData.pageNum = num
      this.queryTableFc()
    },
    /**
     * 表格增删改查
     */
    operation(type, item, index) {
      let query = '' // 保存请求的变量
      let successName = '' // 保存请求的名称
      const data = {
        isAdd: true, // 代表是新增
        isEdit: false, // 保存|修改
        formCode: '', // 监护项编码
        formName: '', // 监护项名称
        nisFormCode: '', // LIS检验编码
        nisFormName: '', // LIS检验名称
        statusDict: '1'
      }
      switch (type) {
        case 'add':
          // 校验有没有其他修改情况
          if (this.testing(this.tableData)) {
            break
          }
          this.tableData.unshift(data)
          return
        case 'update':
          // 校验有没有其他修改情况
          if (this.testing(this.tableData)) {
            break
          }
          this.formconfigListFc(item.formCode)
          this.oneTableData = JSON.parse(JSON.stringify(item))
          item.isEdit = true
          return
        case 'cancel':
          if (item.isEdit) {
            this.$set(this.tableData, index, {
              ...JSON.parse(JSON.stringify(this.oneTableData)),
              isEdit: false
            })
          } else {
            this.tableData.shift()
          }
          return
        case 'save':
          if (!item.formCode) {
            this.$message.error('请选择重症评估表!')
            break
          }
          if (!item.nisFormCode) {
            this.$message.error('请填写NIS评估单编码!')
            break
          }
          if (!item.nisFormName) {
            this.$message.error('请填写NIS评估单名称!')
            break
          }
          if (item.isEdit) {
            query = assessNisMapper_update
            successName = '修改成功'
          } else if (item.isAdd) {
            query = assessNisMapper_add
            successName = '保存成功'
          }
          this.loading = true
          query(item).then(res => {
            this.$message.success(successName)
            // 列表查询
            this.init()
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
          return
      }
    },
    /**
     * 启用禁用
     */
    enableOrDisable(row) {
      const queryUrl =
        row.statusDict == '1'
          ? assessNisMapper_disable
          : assessNisMapper_enable // 启用禁用的请求切换
      queryUrl({
        id: row.id
      }).then(res => {
        this.$message({
          type: 'success',
          message: +row.statusDict ? '已禁用' : '已启用'
        })
        this.init()
      })
    },
    /**
     * 检测
     */
    testing(data) {
      if (
        data.filter(res => {
          return res.isAdd
        })[0]
      ) {
        this.$message({
          type: 'warning',
          message: '已有新增数据没有保存,请先保存!'
        })
        return true
      }
      if (
        data.filter(res => {
          return res.isEdit
        })[0]
      ) {
        this.$message({
          type: 'warning',
          message: '已有修改数据没有保存,请先保存!'
        })
        return true
      }
      return false
    }
  }
}
</script>
<style lang='scss' scoped>
@import '@/styles/config-common.scss'; // 公共css方法

.dataSourceConfig {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px;
  background: #fff;

  ::v-deep.el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
