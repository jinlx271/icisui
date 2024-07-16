<!-- 膳食字典 -->
<template>
  <el-container class="icis-meals-item-container">
    <!-- 头部 -->
    <el-header>
      <div class="headerLeft">
        <el-input size="small" placeholder="膳食名称/编码" clearable suffix-icon="el-icon-search" v-model="queryData.searchKey"
          @input="debounceSearch" @keyup.enter.native="getDrugConvertList(1)"></el-input>
        <el-checkbox v-model="queryData.status" true-label="" false-label="1" @change="debounceSearch">
          显示禁用
        </el-checkbox>
      </div>
      <div class="headerRight">
        <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']" class="queryButton" type="primary"
          @click.native.prevent="addDictItem">新增</el-button>
      </div>
    </el-header>
    <!-- 中间 -->
    <el-main style="height:calc(100% - 102px)">
      <el-table
        @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
        ref="table" height="100%" :row-class-name="({ row }) => row.status == 0 ? 'disabled' : ''" :data="tableData"
        style="width: 100%" highlight-current-row border :key='tableKey'>
        <v-table-column prop="dictCode" label="编码">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isCreate" v-model="scope.row.dictCode" placeholder="请输入" filterable type="text">
            </el-input>
            <span v-else>{{ scope.row.dictCode }}</span>
          </template>
        </v-table-column>
        <v-table-column prop="dictName" label="名称">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit" v-model="scope.row.dictName" placeholder="请输入" filterable type="text">
            </el-input>
            <span v-else>{{ scope.row.dictName }}</span>
          </template>
        </v-table-column>
        <v-table-column prop="simpleName" label="缩写">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit" v-model="scope.row.simpleName" placeholder="请输入" filterable type="text">
            </el-input>
            <span v-else>{{ scope.row.simpleName }}</span>
          </template>
        </v-table-column>
        <v-table-column prop="spec" label="规格" width="160px">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit" v-model="scope.row.spec" placeholder="请输入" clearable filterable>
            </el-input>
            <span v-else>{{ scope.row.spec }}</span>
          </template>
        </v-table-column>
        <v-table-column prop="unit" label="单位">
          <template slot-scope="scope">
            <el-select v-if="scope.row.isEdit" v-model="scope.row.unit" placeholder="请选择">
              <el-option v-for="ii in unitList" :key="ii.dictCode" :label="ii.dictName" :value="ii.dictName">
              </el-option>
            </el-select>
            <span v-else>{{ scope.row.unit }}</span>
          </template>
        </v-table-column>
        <v-table-column prop="status" label="状态" min-width="180px" align="center">
          <template slot-scope="scope">
            <el-switch v-if="scope.row.isEdit" v-model="scope.row.status" active-value="1" inactive-value="0"
              active-text="已启用" inactive-text="已禁用"></el-switch>
            <span v-else>{{+scope.row.status ? '已启用' : '已禁用' }}</span>
          </template>
        </v-table-column>
        <v-table-column label="操作" align="center" width="200px" fixed="right">
          <template slot-scope="scope">
            <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']" type="text"
              @click="handleEdit(scope.row, scope.$index)" v-if="!scope.row.isEdit">修改</el-button>
            <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']" type="text"
              v-if="scope.row.isEdit === true" @click="handleCancel(scope.$index, scope.row)">取消</el-button>
            <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']" type="text"
              v-if="scope.row.isEdit === true" @click="handleSave(scope.row)">保存</el-button>
          </template>
        </v-table-column>
      </el-table>
    </el-main>
    <el-footer v-if="totolCount > 0">
      <el-pagination @size-change="changePagination" @current-change="changePagination" :current-page="queryTable.pageNum"
        :hide-on-single-page="true" :page-size="queryTable.pageSize" background layout="total, prev, pager, next"
        :total="totolCount"></el-pagination>
    </el-footer>
  </el-container>
</template>

<script>
import {
  nutrition_edit,
  nutrition_insert,
  nutrition_findWithPage
} from '@/api/configuration'
import { debounce } from 'lodash'
export default {
  name: 'IcisMealsItem',
  components: {},
  data: () => {
    return {
      unitList: [],
      tableKey: '',
      loading: false,
      queryTable: {
        pageNum: 1,
        pageSize: 10
      },
      queryData: {
        status: '',
        searchKey: '' // input输入
      }, // 请求入参
      totolCount: 0,
      tableData: [

      ], // 数据
      addOrModify: '',
      currItem: []
    }
  },
  props: {},
  watch: {},
  computed: {},
  async created() {
    // 字典一起请求
    const { ICIS_DICT_UNIT } = await this.$batchGetDictItemList(['ICIS_DICT_UNIT'])
    this.unitList = ICIS_DICT_UNIT // 单位
  },
  mounted() {
    this.init()
  },
  methods: {
    // 药品初始化数据
    init() {
      this.getDrugConvertList(1)
    },
    debounceSearch() {
      this.debounceSearchSymbol = this.debounceSearchSymbol ? this.debounceSearchSymbol : debounce(function () {
        this.getDrugConvertList(1)
      }, 200)
      this.debounceSearchSymbol()
    },
    // 获取换算列表
    getDrugConvertList(pageNum) {
      this.queryTable.pageNum = pageNum || this.queryTable.pageNum
      const query = {
        pageNum: this.queryTable.pageNum,
        pageSize: this.queryTable.pageSize,
        searchKey: this.queryData.searchKey,
        status: this.queryData.status
      }
      nutrition_findWithPage(query).then(res => {
        this.loading = false
        if (res.code == 0) {
          this.tableData = res.data.result
          this.totolCount = res.data.totolCount
        }
      })
    },
    // 修改当前药品信息
    handleEdit(row, index) {
      this.currItem[index] = { ...row }
      row.isEdit = true
      this.addOrModify = 'modify'
      this.tableData = JSON.parse(JSON.stringify(this.tableData))
    },
    // 数据翻页
    changePagination(pageNum) {
      this.getDrugConvertList(pageNum)
    },
    // 保存编辑行数据
    handleSave(ro) {
      const row = JSON.parse(JSON.stringify(ro))
      if (!row.dictCode) {
        this.$message({
          type: 'error',
          message: '请输入膳食编码'
        })
        return
      }
      if (!row.dictName) {
        this.$message({
          type: 'error',
          message: '请输入膳食名称'
        })
        return
      }
      if (!row.spec) {
        this.$message({
          type: 'error',
          message: '请输入规格'
        })
        return
      }
      if (!row.unit) {
        this.$message({
          type: 'error',
          message: '请输入单位'
        })
        return
      }
      if (this.addOrModify == 'modify') { // 修改
        nutrition_edit(row).then(res => {
          if (res.code == 0) {
            this.getDrugConvertList()
            this.$message({
              type: 'success',
              message: '修改成功'
            })
          }
        })
      } else {
        nutrition_insert(row).then(res => {
          if (res.code == 0) {
            this.getDrugConvertList()
          }
        })
      }
    },
    // 新增监护字典
    addDictItem() {
      if (this.tableData.length > 0) {
        const first = this.tableData[0]
        if (first.isCreate) {
          return
        }
      }
      const row = {
        isCreate: true,
        isEdit: true,
        status: '1'
      }
      this.addOrModify = 'add'
      this.tableData.unshift(row)
    },
    handleCancel(index, row) {
      row.isEdit = false
      if (this.addOrModify == 'add') {
        this.tableData.splice(index, 1)
      } else {
        this.tableData = JSON.parse(JSON.stringify(this.tableData))
        this.tableData[index] = this.currItem[index]
      }
    }
  }
  // 获取表格集合
}
</script>
<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法

.icis-meals-item-container {
  background: #fff;
  height: 100%;

  ::v-deep th.el-table__cell {
    .cell {
      white-space: pre-line;
    }
  }
}

::v-deep .el-table thead>tr>th>.cell {
  padding-left: 6px;
  padding-right: 6px;
}

::v-deep .el-table tbody>tr>td>.cell {
  padding-left: 6px;
  padding-right: 6px;
}

::v-deep .el-table {
  height: 100%;
}
</style>
