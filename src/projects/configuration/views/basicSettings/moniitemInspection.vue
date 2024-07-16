<template>
  <div class="dataSourceConfig" id="dataSourceConfig" ref="dataSourceConfig">
    <el-container style="height:100%">
      <!-- 头部 -->
      <el-header >
        <div class="flex">
          <el-input @keyup.enter.native="init" @input="debounceFC" v-model="queryData.searchKey" size="small" placeholder="编码/名称" clearable suffix-icon="el-icon-search"></el-input>
          <el-checkbox v-model="queryData.statusDict" true-label="" false-label="1"  @change="debounceFC">
                显示禁用
          </el-checkbox>
        </div>
        <el-button size="mini" @click.native.prevent="addTableRow" type="primary">新 增</el-button>
      </el-header>
      <!-- 表格 -->
      <el-main style="height:calc(100% - 112px)">
        <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)"
          element-loading-text="加载中"
          v-loading="loading"
          ref="tableData"
          :data="tableData"
          highlight-current-row
          fit
          border
          height="100%"
          style="width:100%;overflow: auto;"
          row-key="id"
          :row-class-name="({row}) => row.statusDict == 0 ? 'disabled' : ''"
        >
          <v-table-column prop="moniitemCode" label="监护项编码" align="left">
            <template slot-scope="scope">
              <span>{{scope.row.moniitemCode}}</span>
            </template>
          </v-table-column>
          <v-table-column prop="moniitemName" label="监护项名称" align="left">
            <template slot-scope="scope">
              <!-- <el-select
                style="width:100%"
                v-if="scope.row.editOrSave"
                v-model="scope.row.moniitemName"
                clearable
                placeholder="请输入关键词"
                @change="selectMoniitemFc(scope.row.moniitemName,scope.$index)"
              >
                <el-option v-for="item in moniitemList" :key="item.moniitemCode" :label="item.moniitemName" :value="item.moniitemName" :disabled="item.statusDict==0"></el-option>
              </el-select> -->
              <v-select-mon filterable v-if="scope.row.editOrSave" clearable :settingOption="{optionDisabled:1}"
                            v-model="scope.row.moniitemCode" :options="moniitemList">
              </v-select-mon>
              <span v-else>{{scope.row.moniitemName}}</span>
            </template>
          </v-table-column>
          <v-table-column prop="lisItemCode" label="LIS检验编码" align="left">
            <template slot-scope="scope">
              <span>{{scope.row.lisItemCode}}</span>
            </template>
          </v-table-column>
          <v-table-column prop="lisItemName" label="LIS检验名称" align="left">
            <template slot-scope="scope">
              <el-select
                v-if="scope.row.editOrSave"
                filterable
                clearable
                v-model="scope.row.lisItemName"
                placeholder="请选择"
                :filter-method="selectLisFilterMethodFc"
                @change="selectLisItemFc(scope.row.lisItemName,scope.$index)"
              >
                <el-option v-for="item in lisItemList" :key="item.itemCode" :label="item.itemName" :value="item.itemName" :disabled="item.statusDict == '0'"></el-option>
              </el-select>

              <span v-else>{{scope.row.lisItemName}}</span>
            </template>
          </v-table-column>
          <v-table-column prop="dictLink" label="操作" align="center" width="80px">
            <template slot-scope="scope">
              <el-button
                v-if="!scope.row.editOrSave"
                @click.native.prevent="enableOrDisable(scope.row,scope.$index)"
                :style="{ color: scope.row.statusDict == 1 ? '#EC0000': '#00AB44' }"
                type="text"
                size="mini"
              >{{+scope.row.statusDict ? '禁用' : '启用' }}</el-button>
              <el-button v-if="scope.row.editOrSave" @click.native.prevent="cancelTable(scope.row,scope.$index)" style="color:#909399" type="text" size="mini">取消</el-button>
              <el-button v-if="scope.row.editOrSave" @click.native.prevent="saveTable(scope.row,scope.$index)" type="text" size="mini">保存</el-button>
              <el-button v-if="!scope.row.editOrSave" @click.native.prevent="editTable(scope.row,scope.$index)" style="color:#E6A23C" type="text" size="mini">修改</el-button>
            </template>
          </v-table-column>
        </el-table>
      </el-main>
      <!-- 分页 -->
      <el-footer>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryData.pageNum"
          :total="totolCount"
          :page-sizes="[10, 15, 20, 25, 30]"
          :page-size="queryData.pageSize"
          :hide-on-single-page="false"
          layout="total, sizes, prev, pager, next"
          class="pagination"
          background
        ></el-pagination>
      </el-footer>
    </el-container>
  </div>
</template>
<script>

import {
  moniitemInspection_listPage, // 列表
  moniitemInspection_add, // 新增
  moniitemInspection_update, // 修改
  moniitemInspection_enable, // 启用
  moniitemInspection_disable, // 禁用
  lisItem_findWithPage, // LIS检查检验配置
  moniitem_multipleListPage // 监护数据
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
        statusDict: '',
        pageNum: 1, // 页码必传
        pageSize: 15, // 一页数量，必传
        searchKey: '' // 搜索关键字，非必传
      },
      totolCount: 0, // 分页总量
      tableData: [], // 表格数据
      oldTableData: [], // 存储数据表格数据
      moniitemList: [], // 监护 检验指标
      lisItemList: [] // LIS检验名称
    }
  },
  watch: {},
  computed: {},
  beforeCreated() {},
  async created() {
    // 截流
    this.debounceFC = _.debounce(() => {
      this.queryData.pageNum = 1 // 输入的时候需要改为第一页
      this.init() // 输入框截流
    }, 800)
    this.lisItem_findWithPageFc()
    const res = await moniitem_multipleListPage({ })
    this.moniitemList = res.data.result
    this.init() // 初始化
  },
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  update() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    /**
     * 初始化
     */
    init() {
      this.queryData.pageNum = 1
      this.queryTableFc()
    },
    /**
     * 列表请求
     */
    queryTableFc() {
      this.tableData = []
      moniitemInspection_listPage(this.queryData).then(res => {
        this.totolCount = res.data.totolCount
        res.data.result.map(item => {
          item.editOrSave = false
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
     * 新增
     */
    addTableRow() {
      if (!this.testing()) {
        // 检测是否可以修改
        return
      }
      if (
        this.tableData[0] &&
        this.tableData[0].sourceCode == '' &&
        this.tableData[0].sourceName == '' &&
        this.tableData[0].execSql == ''
      ) {
        this.$message.warning('请先保存！')
        return
      }
      this.tableData.unshift({
        addFlag: true, // 代表是新增
        moniitemCode: '', // 监护项编码
        moniitemName: '', // 监护项名称
        lisItemCode: '', // LIS检验编码
        lisItemName: '', // LIS检验名称
        editOrSave: true, // 保存|修改
        statusDict: '1'
      })
    },
    /**
     * 取消
     */
    cancelTable(row, rowIndex) {
      if (row.addFlag) {
        // 新增
        this.tableData.splice(0, 1)
        this.$message.success('已删除！')
        return
      } else {
        // 修改
        row.editOrSave = false
        this.$set(
          this.tableData,
          rowIndex,
          JSON.parse(JSON.stringify(this.oldTableData[rowIndex]))
        )
        this.$message.success('已取消！')
      }
    },
    /**
     * 修改
     */
    editTable(row, rowIndex) {
      if (!this.testing()) {
        // 检测是否可以修改
        return
      }
      row.editOrSave = true
    },
    /**
     * 保存
     */
    saveTable(row, rowIndex) {
      if (row.moniitemCode == '') {
        this.$message.error('请选择＂监护项编码＂！')
        return
      }
      if (row.lisItemCode == '') {
        this.$message.error('请选择＂LIS检验编码＂！')
        return
      }
      delete row.moniitemName // 后台不需要moniitemName ，这里不传给后台
      const query = row.addFlag
        ? moniitemInspection_add
        : moniitemInspection_update
      query(row).then(res => {
        this.$message.success(row.addFlag ? '保存成功！' : '修改成功！')
        row.editOrSave = false
        this.init()
      })
    },

    /**
     * 启用禁用
     */
    enableOrDisable(row) {
      const queryUrl =
        row.statusDict == '1'
          ? moniitemInspection_disable
          : moniitemInspection_enable // 启用禁用的请求切换
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
    testing() {
      for (let i = 0; this.tableData.length > i; i++) {
        if (this.tableData[i].editOrSave) {
          if (this.tableData[i].sourceName == '') {
            this.$message.error(`请先保存第一条！`)
            return false
          }
          this.$message.error(
            `请先保存＂${this.tableData[i].sourceName}＂这条数据！`
          )
          return false
        }
      }
      return true
    },
    /**
     * 监护字典方法
     */
    selectMoniitemFc(name, index) {
      this.tableData[index].moniitemCode = this.moniitemList.filter(res => {
        return name == res.moniitemName
      })[0].moniitemCode
    },
    /**
     * LIS方法
     */
    selectLisItemFc(name, index) {
      this.tableData[index].lisItemCode = this.lisItemList.filter(res => {
        return name == res.itemName
      })[0].itemCode
    },
    /**
     * LIS过滤
     */
    selectLisFilterMethodFc(key) {
      this.lisItem_findWithPageFc(key)
    },
    /**
     * lts输入
     */
    lisItem_findWithPageFc(searchKey) {
      lisItem_findWithPage({
        pageNum: 1,
        pageSize: 100,
        searchKey: searchKey || ''
      }).then(res => {
        this.lisItemList = res.data.result
      })
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
    ::v-deep .el-input > .el-input__inner {
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
