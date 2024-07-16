<!-- 病种设置 -->
<template>
  <div class="flowrate-config-container">
    <!-- 右侧内容 -->
    <el-container class="flowrate-config-right">
      <el-header class="flowrate-config-right-head">
        <div>
          <el-input class="elInput" clearable size="small" placeholder="单位名称" suffix-icon="el-icon-search"
            v-model="qeuryTableData.searchKey" @keyup.enter.native="debounceSearch" @input="debounceSearch"></el-input>
        </div>
        <el-button v-hasPermi="['configuration:basicSettings:flowRateCalcConfig']" size="small" type="primary"
          @click="handleAdd">新增</el-button>
      </el-header>
      <el-main class="flowrate-config-right-body">
        <el-table
          @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
          ref="table" height="100%" :row-class-name="({ row }) => row.statusDict == 0 ? 'disabled' : ''" :data="tableData"
          fit border highlight-current-row style="width: 100%;overflow: auto;">
          <v-table-column label="剂量流速单位" align="center">
            <template slot-scope="scope">
              <el-select v-if="scope.row.isEdit" v-model="scope.row.doseRateUnit" default-first-option filterable
                placeholder="请选择" style="width:100%">
                <el-option v-for="item in ICIS_DICT_ORDER_FLOWRATE_UNIT" :key="item.dictCode" :label="item.dictName"
                  :value="item.dictName">
                </el-option>
              </el-select>
              <span v-else>{{ scope.row.doseRateUnit }}</span>
            </template>
          </v-table-column>
          <v-table-column label="单位系数" align="center">
            <template slot-scope="scope">
              <el-input v-only-num :min="0" :max="999999999" v-if="scope.row.isEdit" v-model="scope.row.unitCoefficient"
                placeholder="请输入" clearable :disabled="!scope.row.isEdit"> </el-input>
              <span v-else>{{ scope.row.unitCoefficient }}</span>
            </template>
          </v-table-column>
          <v-table-column label="时间系数" align="center">
            <template slot-scope="scope">
              <el-input v-only-num :min="0" :max="999999999" v-if="scope.row.isEdit" v-model="scope.row.timeCoefficient"
                placeholder="请输入" clearable :disabled="!scope.row.isEdit"> </el-input>
              <span v-else>{{ scope.row.timeCoefficient }}</span>
            </template>
          </v-table-column>
          <v-table-column label="是否含体重" align="center">
            <template slot-scope="scope">
              <el-switch v-if="scope.row.isEdit" v-model="scope.row.hasWeight" active-value="1" inactive-value="0"
                active-text="是" inactive-text="否"></el-switch>
              <span v-else>{{ scope.row.hasWeight == 1 ? '是' : '否' }}</span>
            </template>
          </v-table-column>
          <v-table-column label="类别" align="center">
            <template slot-scope="scope">
              <el-select v-if="scope.row.isEdit" v-model="scope.row.configType" filterable placeholder="请选择"
                style="width:100%">
                <el-option v-for="item in option" :key="item.dictCode" :label="item.dictName"
                  :value="item.dictCode"></el-option>
              </el-select>
              <span v-else>{{ scope.row.configType | dictCodeToName(option) }}</span>
            </template>
          </v-table-column>
          <v-table-column label="操作" width="220px" align="center">
            <template slot-scope="scope">
              <el-button v-if="!scope.row.isEdit" v-hasPermi="['configuration:basicSettings:flowRateCalcConfig']"
                @click.native.prevent="modifyRow(scope.$index, scope.row)" type="text" size="small">修改</el-button>
              <el-button v-if="scope.row.isEdit" v-hasPermi="['configuration:basicSettings:flowRateCalcConfig']"
                type="text" @click="cancelItemRow(scope.$index, scope.row)">取消</el-button>
              <el-button v-if="scope.row.isEdit" v-hasPermi="['configuration:basicSettings:flowRateCalcConfig']"
                type="text" @click="saveItemRow(scope.$index, scope.row)">保存</el-button>
              <el-button v-if="!scope.row.isCreate && !scope.row.isEdit" v-hasPermi="['configuration:basicSettings:flowRateCalcConfig']"
                type="text" @click="enableOrDisable(scope.$index, scope.row)"
                :style="{ color: scope.row.statusDict == 1 ? '#EC0000' : '#00AB44' }">
                {{+scope.row.statusDict ? '禁用' : '启用' }}</el-button>
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
  rateUnitConverter_insert,
  rateUnitConverter_edit
} from '@/api/configuration'
import { debounce } from 'lodash'
export default {
  name: 'FlowRateUnit',
  components: {},
  filters: {
    dictCodeToName(list, dictList, item = 'dictName') {
      const result = dictList.filter(v => list.indexOf(v.dictCode) >= 0)
      return result.map(v => v.dictName).join(',')
    }
  },
  data: function () {
    return {
      option: [{
        dictName: '容积',
        dictCode: '1'
      }, {
        dictName: '重量',
        dictCode: '2'
      }, {
        dictName: '效价单位',
        dictCode: '3'
      }],
      ICIS_DICT_ORDER_FLOWRATE_UNIT: [],
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
      orderUsageTypeList: []
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
      this.orderUsageTypeList = await this.$getDictItemList('ICIS_DICT_ORDER_USAGE_TYPE')
      const { ICIS_DICT_ORDER_FLOWRATE_UNIT } = await this.$batchGetDictItemList(['ICIS_DICT_ORDER_FLOWRATE_UNIT'])
      this.ICIS_DICT_ORDER_FLOWRATE_UNIT = ICIS_DICT_ORDER_FLOWRATE_UNIT
      // 左边字典查询
      this.initData(1)
    },
    // 获取病种目
    initData(page) {
      if (page) {
        this.qeuryTableData.pageNum = page
      }
      this.loading = true
      rateUnitConverter_findWithPage(this.qeuryTableData).then(req => {
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
      this.initData(val)
    },
    /**
     * 查询事件
     */
    debounceSearch() {
      this.debounceSearchSymbol = this.debounceSearchSymbol ? this.debounceSearchSymbol : debounce(function () {
        this.initData(1)
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
        'doseRateUnit': '',
        'unitCoefficient': '',
        'timeCoefficient': '',
        'hasWeight': '0',
        'configType': '',
        'statusDict': '1'
      }
      this.addOrModifyDrugUsageItem = 'add'
      this.tableData.unshift(itemInfo)
    },
    // 保存病种目
    saveItemRow(index, row, callback) {
      if (!row.doseRateUnit) {
        this.$message.error('请选择剂量流速')
        return
      } else if (!row.unitCoefficient) {
        this.$message.error('请输入单位系数')
        return
      } else if (!row.timeCoefficient) {
        this.$message.error('请输入时间系数')
        return
      } else if (!row.configType) {
        this.$message.error('请选择类别')
        return
      }
      callback && callback()
      if (row.isCreate) {
        rateUnitConverter_insert(row).then(res => {
          row.isEdit = false
          delete row.isCreate
          this.$message({
            type: 'success',
            message: '新增成功'
          })
          this.initData()
        }).catch(
          this.initData()
        )
      } else {
        rateUnitConverter_edit(row).then(res => {
          row.isEdit = false
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          row.isEdit = false
          this.initData()
        })
      }
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
    enableOrDisable(index, row) {
      this.saveItemRow(index, row, () => {
        row.statusDict = row.statusDict == 1 ? '0' : '1'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/config-common.scss';

.flowrate-config-container {
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

.flowrate-config-container {
  height: 100%;

  .flowrate-config-right {
    height: 100%;

    .flowrate-config-right-body {
      height: calc(100% - 42px);
    }
  }
}
</style>
