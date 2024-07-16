<!-- 病种设置 -->
<template>
  <div class="dose-config-container">
    <!-- 右侧内容 -->
    <el-container class="dose-config-right">
      <el-header class="dose-config-right-head">
        <div>
          <el-input class="elInput" clearable size="small" placeholder="单位名称" suffix-icon="el-icon-search"
            v-model="qeuryTableData.searchKey" @keyup.enter.native="debounceSearch" @input="debounceSearch"></el-input>
        </div>
        <el-button v-hasPermi="['configuration:basicSettings:flowRateCalcConfig']" size="small" type="primary"
          @click="handleAdd">新增</el-button>
      </el-header>
      <el-main class="dose-config-right-body">
        <el-table
          @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
          ref="table" height="100%" :row-class-name="({ row }) => row.statusDict == 0 ? 'disabled' : ''" :data="tableData"
          fit border highlight-current-row style="width: 100%;overflow: auto;">
          <v-table-column label="药品名称" align="center">
            <template slot-scope="scope">
              <el-select clearable filterable remote v-model="scope.row.drugCode" popper-class="fixed-width"
                :remote-method="remoteMethod" placeholder="请选择" @change="changeDrug($event, 'drugCode', scope.row)"
                @visible-change="clearDrugSearchKey" @clear="remoteMethod()"
                v-if="scope.row.isEdit && scope.row.isCreate">
                <el-option v-for="option in drugBasicData" :key="option.drugCode"
                  :label="`${option.drugName} ${option.drugSpec || ''} ${option.factoryName || ''}`"
                  :title="`${option.drugName} ${option.drugSpec || ''} ${option.factoryName || ''}`"
                  :value="option.drugCode" :disabled="option.statusDict == 0"></el-option>
              </el-select>
              <span v-else>{{ scope.row.drugName }}</span>
            </template>
          </v-table-column>
          <v-table-column label="默认流速单位" align="center">
            <template slot-scope="scope">
              <el-select v-if="scope.row.isEdit" v-model="scope.row.flowrateUnit" default-first-option filterable
                placeholder="请选择" style="width:100%">
                <el-option v-for="item in unitList" :key="item.doseRateUnit" :label="item.doseRateUnit"
                  :value="item.doseRateUnit">
                </el-option>
              </el-select>
              <span v-else>{{ scope.row.flowrateUnit }}</span>
            </template>
          </v-table-column>
          <v-table-column label="限制更改" align="center">
            <template slot-scope="scope">
              <el-switch v-if="scope.row.isEdit" v-model="scope.row.editFlag" active-value="1" inactive-value="0"
                active-text="是" inactive-text="否"></el-switch>
              <span v-else>{{+scope.row.editFlag ? '是' : '否' }}</span>
            </template>
          </v-table-column>
          <v-table-column label="操作" width="220px" align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.isCreate" v-hasPermi="['configuration:basicSettings:flowRateCalcConfig']"
                type="text" @click="cancelItemRow(scope.$index, scope.row)">取消</el-button>
              <el-button v-if="scope.row.isCreate" v-hasPermi="['configuration:basicSettings:flowRateCalcConfig']"
                type="text" @click="saveItemRow(scope.$index, scope.row)">保存</el-button>
              <el-button v-if="!scope.row.isCreate" type="text" size="small"
                v-hasPermi="['configuration:basicSettings:flowRateCalcConfig']" class="redCss"
                @click="handleDelete(scope.row.id)">删除</el-button>
            </template>
          </v-table-column>
        </el-table>
      </el-main>
      <el-footer class="diseaseConfig_right_footer">
        <el-pagination @size-change="changePagination" @current-change="changePagination"
          :current-page="qeuryTableData.pageNum" :hide-on-single-page="false" :page-size="qeuryTableData.pageSize"
          background layout="total, prev, pager, next" style="float:right;margin-top:15px;margin-right:-10px"
          :total="dictItemTotolCount"></el-pagination>
      </el-footer>
    </el-container>

  </div>
</template>

<script>
import {
  rateUnitConverter_findWithPage,
  drugFlowrate_findWithPage,
  drugFlowrate_insert,
  drugFlowrate_deleteById
} from '@/api/configuration'
import { debounce } from 'lodash'
import {
  dialysisDispensing_getDialysisDispensingDrugList // 获取可选择药品列表
} from '@/api/configuration'
import { getDrugBasicData } from '@/utils/utils'
export default {
  name: 'DoseDefaultUnit',
  components: {},
  data: function () {
    return {
      unitList: [],
      loading: false, // 表格的loding
      oneRow: {}, // 左边点击的数据
      tableData: [], // 右边表格数据
      totolCount: 0, // 分页总量
      qeuryTableData: {
        statusDict: '',
        pageNum: 1,
        pageSize: 10,
        searchKey: '' // 编码或名称
      },
      // 病种总数
      dictItemTotolCount: 0,
      addOrModifyDrugUsageItem: 'add',
      // 当前行
      curRow: [],
      // 医嘱分类列表
      orderUsageTypeList: [],
      drugBasicData: []
    }
  },
  props: {},
  watch: {},
  computed: {},
  created() {
    this.init()
  },
  mounted() {

  },
  methods: {
    /**
     * 初始化
     */
    async init() {
      // 获取医嘱分类
      this.drugBasicData = await getDrugBasicData()
      this.orderUsageTypeList = await this.$getDictItemList('ICIS_DICT_ORDER_USAGE_TYPE')
      const unitRes = await rateUnitConverter_findWithPage({
        pageNum: 1,
        pageSize: 10000
      })
      this.unitList = unitRes.data?.result || []
      // 左边字典查询
      this.getDataList(1)
    },
    // 获取病种目
    getDataList(page) {
      if (page) {
        this.qeuryTableData.pageNum = page
      }
      this.loading = true
      drugFlowrate_findWithPage(this.qeuryTableData).then(req => {
        this.loading = false
        if (!(req.data && req.data.result)) {
          return
        }
        this.tableData = req.data.result.map(v => {
          v.belongClassify = v.belongClassify ? v.belongClassify.split(',') : []
          v.classfyDictCode = v.classfyDictCode ? v.classfyDictCode.split(',') : []
          return v
        }) // 列表数据
        this.dictItemTotolCount = req.data.totolCount // 总条数
      })
    },
    /**
     * 分页数据请求
     */
    changePagination(val) {
      this.getDataList(val)
    },
    /**
     * 查询事件
     */
    debounceSearch() {
      this.debounceSearchSymbol = this.debounceSearchSymbol ? this.debounceSearchSymbol : debounce(function () {
        this.getDataList(1)
      }, 200)
      this.debounceSearchSymbol()
    },
    // 显示新增病种
    handleAdd() {
      if (this.tableData.length > 0 && this.tableData[0].isCreate == true) return
      this.tableData.map(item => { item.isEdit = false })
      const itemInfo = {
        'isCreate': true,
        'isEdit': true,
        'doseUnit': '',
        'doseUnitCoefficient': '',
        'configType': '',
        'statusDict': '1'
      }
      this.addOrModifyDrugUsageItem = 'add'
      this.tableData.unshift(itemInfo)
    },
    // 保存病种目
    saveItemRow(index, row, callback) {
      if (!row.drugCode) {
        this.$message.error('请选择药品')
        return
      } else if (!row.flowrateUnit) {
        this.$message.error('请选择流速单位')
        return
      }
      callback && callback()
      drugFlowrate_insert(row).then(res => {
        row.isEdit = false
        delete row.isCreate
        this.$message({
          type: 'success',
          message: '新增成功'
        })
        this.getDataList()
      }).catch(
        this.getDataList()
      )
    },
    // 修改病种目
    modifyRow(index, row) {
      this.curRow[index] = { ...row }
      row.isEdit = true
      this.tableData = JSON.parse(JSON.stringify(this.tableData))
      this.addOrModifyDrugUsageItem = 'modify'
    },
    // 取消当前行编辑
    cancelItemRow(index, row) {
      row.isEdit = false
      if (row.isCreate) {
        this.tableData.splice(index, 1)
      } else {
        this.tableData[index] = this.curRow[index]
        this.tableData = JSON.parse(JSON.stringify(this.tableData))
      }
    },
    handleDelete(id) {
      this.$confirm('您确定要删除吗？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        drugFlowrate_deleteById(id).then((res) => {
          if (res.code == 0) {
            this.$message.success('删除成功！')
            this.getDataList()
          }
        })
      })
    },
    /**
     * 清除数据
     */
    async clearDrugSearchKey() {
      this.drugBasicData = await getDrugBasicData('')
    },
    async remoteMethod(e) {
      this.drugBasicData = await getDrugBasicData(e)
    },
    /**
     * 搜索药品名称
     */
    searchDrug(e) {
      this.loading = true
      const query = {
        pageNum: 1,
        pageSize: 50,
        drugName: e,
        wardCode: this.defaultRegion,
        dialysisDispensingClassDict: this.curRow.dictCode
      }
      dialysisDispensing_getDialysisDispensingDrugList(query).then(res => {
        this.loading = false
        if (res.code == 0) {
          this.drugList = res.data
        }
      })
    },
    // selection 切换数据
    changeDrug(e, key, row) {
      if (e != '') {
        if (key == 'drugCode') {
          const selectDrug = this.drugBasicData.filter(drug => drug.drugCode == e)[0]
          row.drugCode = selectDrug.drugCode
          row.drugName = selectDrug.drugName
          // row.dosage = selectDrug.dosage
          row.drugUnit = selectDrug.dosageUnit
          row.drugSpec = selectDrug.drugSpec
        } else {
          row[key] = e
        }
        this.tableData = [...this.tableData]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/config-common.scss';

.dose-config-container {
  background: #ffffff;
  height: 100%;
  display: block;
  padding: 1%;

  .tabs {
    height: 60px;
  }

  ::v-deep .el-tabs__nav-wrap::after {
    display: none;
  }
}

.dose-config-container {
  height: 100%;

  .dose-config-right {
    height: 100%;

    .dose-config-right-body {
      height: calc(100% - 42px);
    }
  }
}
</style>
