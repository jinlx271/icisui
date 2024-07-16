<!-- 药品剂量管理 -->
<template>
  <el-container class="flowRateUnitConfig">
    <!-- 头部 -->
    <el-header>
      <div class="headerLeft">
            <!-- input输入 -->
        <el-input size="small" placeholder="单位名称" clearable suffix-icon="el-icon-search" v-model="queryData.searchKey" @input="debounceSearch" @keyup.enter.native="getDrugConvertList(1)"></el-input>
      </div>
      <div class="headerRight">
        <el-button class="queryButton" type="primary" @click.native.prevent="addDictItem" :disabled="tableDataItem.length>0&&tableDataItem[0].isCreate">新增</el-button>
      </div>
    </el-header>
    <!-- 中间 -->
    <el-main style="height:calc(100% - 42px)">
      <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" ref="table" height="100%" :row-class-name="({row}) => row.statusDict == 0 ? 'disabled' : ''" :data="tableDataItem" style="width: 100%"  highlight-current-row border :key='tableKey'>
        <v-table-column prop="flowrateUnit" label="医嘱流速单位">
          <template slot-scope="scope">
              <el-select v-if="scope.row.isEdit"  v-model="scope.row.flowrateUnit"  clearable filterable   placeholder="请选择">
                <el-option v-for="option in ICIS_DICT_ORDER_FLOWRATE_UNIT" :key="option.dictCode" :label="option.dictName" :value="option.dictName" :disabled="option.statusDict==0"></el-option>
              </el-select>
              <span v-else>{{scope.row.flowrateUnit}}</span>
          </template>
        </v-table-column>
        <v-table-column prop="flowrateValue" label="换算比例（N）">
          <template slot-scope="scope">
              <el-input v-model="scope.row.flowrateValue" v-only-num v-if="scope.row.isEdit" :maxlength="10"></el-input>
              <span v-else>{{scope.row.flowrateValue}}</span>
          </template>
        </v-table-column>
        <v-table-column prop="standardFlowrateValue" label="换算比例（M）">
          <template slot-scope="scope">
              <el-input v-model="scope.row.standardFlowrateValue" v-only-num v-if="scope.row.isEdit" :maxlength="10"></el-input>
              <span v-else>{{scope.row.standardFlowrateValue}}</span>
          </template>
        </v-table-column>
        <v-table-column prop="standardFlowrateUnit" label="标准流速单位">
          <template slot-scope="scope">
            <el-select v-if="scope.row.isEdit"  v-model="scope.row.standardFlowrateUnit"  clearable filterable   placeholder="请选择">
                <el-option v-for="option in ICIS_DICT_STANDARD_FLOWRATE_UNIT" :key="option.dictCode" :label="option.dictName" :value="option.dictName" :disabled="option.statusDict==0"></el-option>
              </el-select>
              <span v-else>{{scope.row.standardFlowrateUnit}}</span>
          </template>
        </v-table-column>
        <v-table-column label="操作" align="center" width="200px">
        <template slot-scope="scope">
            <el-button type="text" @click="modifyInfo(scope.row, scope.$index)" v-if="!scope.row.isEdit" >修改</el-button>
            <el-button type="text" v-if="scope.row.isEdit===true" @click="cancelItemRow(scope.$index,scope.row)">取消</el-button>
            <el-button type="text" v-if="scope.row.isEdit===true" @click="saveItemRow(scope.$index,scope.row)">保存</el-button>
            <el-button type="text" style="color:#ec0000" @click="deleteItemRow(scope.$index,scope.row)">删除</el-button>
        </template>
      </v-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
import {
  flowrateConvert_findWithPage,
  flowrateConvert_insert,
  flowrateConvert_edit,
  flowrateConvert_deleteById
} from '@/api/configuration'
import { debounce } from 'lodash'
import { filterArrValue } from '@/utils/utils'

export default {
  name: 'FlowRateUnitConfig',
  components: {},
  data: () => {
    return {
      tableKey: '',
      loading: false,
      statusDict: '',
      queryData: {
        searchKey: '', // input输入
        value1: '', // 监护数据显示分组
        value2: '' // 功能模块
      }, // 请求入参
      tableDataItem: [

      ], // 数据
      // 药品列表
      drugList: [

      ],
      drugCodeList: [],
      drugNameList: [],
      addOrModify: '',
      currItem: [],
      ICIS_DICT_STANDARD_FLOWRATE_UNIT: [],
      ICIS_DICT_ORDER_FLOWRATE_UNIT: [],
      contentEditFlag: false
    }
  },
  props: {},
  watch: {},
  computed: {},
  created() {},
  async mounted() {
    this.ICIS_DICT_STANDARD_FLOWRATE_UNIT = await this.$getDictItemList('ICIS_DICT_STANDARD_FLOWRATE_UNIT')
    this.ICIS_DICT_ORDER_FLOWRATE_UNIT = await this.$getDictItemList('ICIS_DICT_ORDER_FLOWRATE_UNIT')
    this.init()
  },
  methods: {
    filterArrValue,
    // 药品初始化数据
    async init() {
      await this.getFlowRateConvertInfo()
    },
    getFlowRateConvertInfo() {
      flowrateConvert_findWithPage({
        pageSize: 50,
        pageNum: 1,
        searchKey: this.queryData.searchKey
      }).then(res => {
        if (res.code == 0) {
          this.tableDataItem = res.data.result
        }
      })
    },
    debounceSearch() {
      this.debounceSearchSymbol = this.debounceSearchSymbol ? this.debounceSearchSymbol : debounce(function () {
        this.getFlowRateConvertInfo()
      }, 200)
      this.debounceSearchSymbol()
    },
    // 修改当前药品信息
    modifyInfo(row, index) {
      if (this.contentEditFlag) {
        this.$message.warning('请完成当前编辑')
        return
      }
      this.contentEditFlag = true
      this.currItem[index] = { ...row }
      row.isEdit = true
      this.addOrModify = 'modify'
      this.tableDataItem = JSON.parse(JSON.stringify(this.tableDataItem))
    },

    // 保存编辑行数据
    saveItemRow(index, row) {
      if (!row.flowrateUnit || !row.flowrateValue || !row.standardFlowrateUnit || !row.standardFlowrateValue) {
        this.$message.error('医嘱流速单位，换算比例（N），换算比例（M），标准流速单位为必填项！')
        return
      }
      const query = { ...row }
      delete query.isCreate
      delete query.isEdit
      if (row.isCreate) {
        query.createTime = this.$dayjs().format('YYYY-MM-DD HH:mm:ss')
        flowrateConvert_insert(query).then(res => {
          if (res.code == 0) {
            this.$message.success('新增成功')
            this.contentEditFlag = false
            row.isEdit = false
            this.getFlowRateConvertInfo()
          }
        })
      } else if (row.isEdit) {
        flowrateConvert_edit(query).then(res => {
          if (res.code == 0) {
            this.$message.success('保存成功')
            row.isEdit = false
            this.contentEditFlag = false
            this.getFlowRateConvertInfo()
          }
        })
      }
    },
    // 新增监护字典
    addDictItem() {
      if (this.contentEditFlag) {
        this.$message.warning('请完成当前编辑')
        return
      }
      const newItem = {
        isCreate: true,
        isEdit: true,
        flowrateValue: 1,
        standardFlowrateValue: 1,
        flowrateUnit: '',
        standardFlowrateUnit: ''
      }
      this.contentEditFlag = true
      this.addOrModify = 'add'
      this.tableDataItem.unshift(newItem)
      this.tableDataItem = [...this.tableDataItem]
    },
    /**
     * 取消当前行的编辑
     * @param {*} index
     * @param {*} row
     */
    cancelItemRow(index, row) {
      if (row.isCreate) {
        this.tableDataItem.splice(index, 1)
      } else {
        this.tableDataItem[index] = this.currItem[index]
      }
      row.isEdit = false
      this.contentEditFlag = false
      this.tableDataItem = [...this.tableDataItem]
    },
    /**
     * 删除当前编辑
     * @param {*} index
     * @param {*} row
     */
    deleteItemRow(index, row) {
      this.$confirm('您确定要删除吗？', '确认信息', {
        confirmButtonText: '确定',
        distinguishCancelAndClose: true,
        customClass: 'width434',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (row.isCreate) {
          this.cancelItemRow(index, row)
        } else {
          flowrateConvert_deleteById(row.id).then(res => {
            if (res.code == 0) {
              this.$message.success('删除成功')
              this.getFlowRateConvertInfo()
            }
          })
        }
      })
    }

  }
  // 获取表格集合
}
</script>
<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法

.flowRateUnitConfig {
  background: #fff;
  height: 100%;
  padding: 15px;
}
::v-deep .el-table thead > tr > th > .cell {
  padding-left: 6px;
  padding-right: 6px;
}
::v-deep .el-table tbody > tr > td > .cell {
  padding-left: 6px;
  padding-right: 6px;
}
::v-deep .el-table {
  height: 100%;
}
</style>
