<!-- 药品剂量管理 -->
<template>
  <el-container class="iCUQualitySign" v-loading="loading">
    <!-- 头部 -->
    <el-header>
      <div class="headerLeft">
        <el-input size="small" placeholder="请输入文字" clearable suffix-icon="el-icon-search" v-model="queryData.searchKey"
          @input="debounceSearch" @keyup.enter.native="getData(1)"></el-input>
        <el-checkbox v-model="queryData.statusDict" true-label="" false-label="1" @change="debounceSearch">
          显示禁用
        </el-checkbox>
      </div>
    </el-header>
    <!-- 中间 -->
    <el-main style="height:calc(100% - 102px)">
      <el-table
        @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
        ref="table" height="100%" :row-class-name="({ row }) => row.statusDict == 0 ? 'disabled' : ''"
        :data="tableDataItem" style="width: 100%" highlight-current-row border :key='tableKey'>
        <v-table-column prop="qcCode" label="质控标识编码"></v-table-column>
        <v-table-column prop="qcName" label="质控标识名称"></v-table-column>
        <v-table-column label="展示名称">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit" v-model="scope.row.qcAbbr" placeholder="请输入" filterable type="text">
            </el-input>
            <span v-else>{{ scope.row.qcAbbr }}</span>
          </template>
        </v-table-column>
        <v-table-column prop="qcType" label="分类" width="160px"></v-table-column>
        <v-table-column label="排序号">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit" v-only-num :digit="0" v-model="scope.row.sortNo" placeholder="请输入"
              type="text">
            </el-input>
            <span v-else>{{ scope.row.sortNo }}</span>
          </template>
        </v-table-column>
        <v-table-column prop="remark" label="取值说明"></v-table-column>
        <v-table-column label="操作" align="center" width="200px" fixed="right">
          <template slot-scope="scope">
            <el-button v-hasPermi="['configuration:basicSettings:iCUQualitySign']" type="text"
              @click="modifyInfo(scope.row, scope.$index)" v-if="!scope.row.isEdit">修改</el-button>
            <el-button v-hasPermi="['configuration:basicSettings:iCUQualitySign']" type="text"
              v-if="scope.row.isEdit === true" @click="cancelItemRow(scope.$index, scope.row)">取消</el-button>
            <el-button v-hasPermi="['configuration:basicSettings:iCUQualitySign']" type="text"
              v-if="scope.row.isEdit === true" @click="saveItemRow(scope.row)">保存</el-button>
            <el-button v-hasPermi="['configuration:basicSettings:iCUQualitySign']" type="text"
              @click="enableOrDisableItemRow(scope.row)"
              :style="+scope.row.statusDict ? 'color:#EC0000' : 'color:#00AB44'">{{+scope.row.statusDict ? '禁用' : '启用'
              }}</el-button>
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
  qcConfig_findWithPage,
  qcConfig_edit
} from '@/api/configuration'
import { debounce } from 'lodash'
export default {
  name: 'ICUQualitySign',
  components: {},
  data: () => {
    return {
      frontList: [{
        dictCode: -1,
        dictName: '不规则周期'
      }, {
        dictCode: 0,
        dictName: '天'
      }, {
        dictCode: 1,
        dictName: '小时'
      }, {
        dictCode: 2,
        dictName: '分钟'
      }],
      tableKey: '',
      loading: false,
      queryTable: {
        pageNum: 1,
        pageSize: 10
      },
      queryData: {
        statusDict: '',
        searchKey: '' // input输入
      }, // 请求入参
      totolCount: 0,
      tableDataItem: [

      ], // 数据
      addOrModify: '',
      currItem: []
    }
  },
  props: {},
  watch: {},
  computed: {},
  created() { },
  mounted() {
    this.init()
  },
  methods: {
    // 药品初始化数据
    init() {
      this.getData(1)
    },
    debounceSearch() {
      this.debounceSearchSymbol = this.debounceSearchSymbol ? this.debounceSearchSymbol : debounce(function () {
        this.getData(1)
      }, 200)
      this.debounceSearchSymbol()
    },
    // 获取换算列表
    getData(pageNum) {
      this.queryTable.pageNum = pageNum || this.queryTable.pageNum
      const query = {
        pageNum: this.queryTable.pageNum,
        pageSize: this.queryTable.pageSize,
        searchKey: this.queryData.searchKey,
        statusDict: this.queryData.statusDict
      }
      this.loading = true
      qcConfig_findWithPage(query).then(res => {
        this.loading = false
        if (res.code == 0) {
          this.tableDataItem = res.data.result
          this.totolCount = res.data.totolCount
        }
      })
    },
    // 修改当前药品信息
    modifyInfo(row, index) {
      const isEdit = this.tableDataItem.find(item => item.isEdit)
      if (isEdit) {
        this.$message.warning('请先保存或取消当前编辑内容')
        return
      }
      this.currItem[index] = { ...row }
      row.isEdit = true
      this.addOrModify = 'modify'
      this.tableDataItem = JSON.parse(JSON.stringify(this.tableDataItem))
    },
    // 数据翻页
    changePagination(pageNum) {
      this.getData(pageNum)
    },
    // 保存编辑行数据
    saveItemRow(ro) {
      const row = JSON.parse(JSON.stringify(ro))
      if (!row.qcCode || !row.qcName) {
        this.$message({
          type: 'info',
          message: `请输入${!row.qcCode ? '质控标识编码' : ''}${!row.qcName ? '质控标识名称' : ''}`
        })
        return
      }
      qcConfig_edit(row).then(res => {
        if (res.code == 0) {
          this.getData()
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        }
      })
    },
    // 启用禁用
    enableOrDisableItemRow(row) {
      const query = { ...row }
      query.statusDict = row.statusDict == 1 ? '0' : '1'
      this.saveItemRow(query)
    },
    // 新增监护字典
    addDictItem() {
      if (this.tableDataItem.length > 0) {
        const first = this.tableDataItem[0]
        if (first.isCreate) {
          return
        }
      }
      const row = {
        isCreate: true,
        isEdit: true,
        statusDict: '1'
      }
      this.addOrModify = 'add'
      this.tableDataItem.unshift(row)
    },
    cancelItemRow(index, row) {
      row.isEdit = false
      if (this.addOrModify == 'add') {
        this.tableDataItem.splice(index, 1)
      } else {
        this.tableDataItem = JSON.parse(JSON.stringify(this.tableDataItem))
        this.tableDataItem[index] = this.currItem[index]
      }
    }
  }
  // 获取表格集合
}
</script>
<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法

.iCUQualitySign {
  background: #fff;
  height: 100%;
  padding: 15px;

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
