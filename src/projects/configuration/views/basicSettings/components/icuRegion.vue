<!-- 导管字典 -->
<template>
  <el-container style="height:100%">
    <el-header>
      <el-input size="small" placeholder="病区名称/病区编码" @input="debounceInit" v-model="searchKey" clearable
        suffix-icon="el-icon-search"></el-input>
    </el-header>
    <el-main style="height: calc(100% - 42px)">
      <el-table
        @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
        ref="tableDataRegion" height="100%" :data="tableDataRegion" highlight-current-row @row-click="selectRow" fit
        border row-key="id">
        <v-table-column width="40">
          <template slot-scope="scope">
            <el-radio :label=scope.row.wardCode v-model="defaultRegionCopy">
              &nbsp;</el-radio>
          </template>
        </v-table-column>
        <v-table-column prop="wardCode" mini-width="100" label="病区编码" width="60"></v-table-column>
        <v-table-column prop="wardName" label="病区名称" width="60"></v-table-column>
        <v-table-column label="操作" mini-width="100">
          <template slot-scope="scope">
            <!-- <el-button v-hasPermi="defaultPermi" @click.native.prevent="clearRow(scope.row)" type="text" size="small" class="redCss">清除</el-button> -->
            <el-button v-hasPermi="defaultPermi" slot="reference" @click.native.prevent="defaultRegionShortCode = '',
              defaultRegionShortCode = scope.row.wardCode, toWardCode = '', dialogVisible = true" type="text"
              size="small" v-if="defaultPermi.length > 0">复制配置</el-button>
            <el-button slot="reference" @click.native.prevent="defaultRegionShortCode = '',
              defaultRegionShortCode = scope.row.wardCode, toWardCode = '', dialogVisible = true" type="text"
              size="small" v-if="defaultPermi.length == 0">复制配置</el-button>
          </template>
        </v-table-column>
      </el-table>
      <el-dialog title="请选择目标病区" :visible.sync="dialogVisible" width="30%" :before-close="copyClose">
        <el-select class="elSelectCss" value-key="wardCode" v-model="toWardCode" placeholder="请选择" remote
          @focus="() => remoteMethod()" @clear="remoteMethod" :remote-method="remoteMethod" clearable filterable>
          <el-option v-for="(option) in tableDataRegionPlus" :key="option.wardCode" :label="option.wardName"
            :value="option.wardCode" :disabled="option.wardCode == defaultRegionShortCode">
          </el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
          <el-button @click="copyClose">取消</el-button>
          <el-button type="primary" @click="copyRow" :disabled="!toWardCode">保存</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  verificationOperation_copy, // 规则校验
  moniitemWarning_copyWardMonWarningConfig, // 预警拷贝
  moniitemWarning_deleteByWardCode, // 预警清除
  shift_deleteByWardCode, // 班次清除
  shift_copy, // 班次拷贝
  catheterMoniitem_deleteByWardCode, // 清除
  catheterRule_deleteByWardCode, // 清除
  catheterMoniitem_copy, // 拷贝 导管监护项设置
  catheterRule_copy, // 拷贝 置管规则风险配置
  icuWard_findWithPage,
  vitalSigns_cleanVitalSigns, // 清除
  vitalSigns_copyVitalSigns, // 拷贝
  skinPosi_copy, // 皮肤部位拷贝
  skinPosi_deleteByWardCode, // 皮肤部位清除
  cathPosi_deleteByWardCode, // 导管部位匹配 复制
  cathPosi_copy, // 导管部位匹配数据清除
  wardModule_copyWardMonitorConfig, // 复制病区监护配置到另一病区
  wardModule_deleteByWardCode, // 清除病区下的所有监护配置
  template_copyTemplateListConfig,
  pain_painDrug_copy, // 镇痛镇静药品
  focalPatient_copyWardConfig, // 复制病区重点患者情况设置到另一病区
  qcReportConfig_copyWardConfig, // ICU质控报表配置 - 复制
  patientIcon_copyData, // 患者标识复制功能
  dialysisDispensing_copyDialysisDispensing,
  medFormulaGroup_copyOutwardRuleWard, // 医学计算器
  outwardRuleWard_copyOutwardRuleWard, // 复制出区标准数据 //复制病情分析
  jzlrModule_copy,
  qcReportQuery_copyWardConfig,
  aidConfig_copyWardConfig,
  drugUsage_copyTo,
  patientMonitoring_copyWardConfig,
  stress_copy,
  nutritionConvert_copy,
  performanceConfig_copy,
  nurseDiag_copyTo
} from '@/api/configuration'
import {
  consuitType_copyWardConfig
} from '@/api/consuit.js'
import { debounce } from 'lodash'
import {
  rescure_rescureBaseMoniitem_clear,
  rescure_rescureBaseMoniitem_copy
} from '@/api/rescure'
export default {
  name: 'IcuRegion',
  components: {},
  data: function () {
    return {
      searchKey: '',
      toWardCode: '',
      defaultRegionShortCode: '',
      defaultRegionCopy: '',
      tableDataRegion: [],
      tableDataRegionPlus: [],
      isSearch: false,
      dialogVisible: false
    }
  },
  props: {
    module: {
      type: String
    },
    defaultRegion: {
      type: String
    },
    defaultPermi: {
      type: Array,
      default: () => {
        return ['']
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    this.defaultRegionCopy = this.defaultRegion
    this.init()
    this.debounceInit = debounce(() => {
      this.isSearch = true
      this.init()
    }, 800)
    this.debounceEmit = debounce((row) => {
      this.isSearch = false
      if (row) {
        this.defaultRegionCopy = row.wardCode
      }
      this.$emit('regionChange', row)
      this.$emit('defaultRegionChange', this.defaultRegionCopy)
    }, 800)
  },
  mounted() {
  },
  methods: {
    selectRow(row) {
      if (row) {
        this.$emit('regionChange', row)
        this.defaultRegionCopy = row.wardCode
      }
      this.debounceEmit(row)
    },
    defaultRegionChange() {
      this.debounceEmit()
    },
    copyClose() {
      this.dialogVisible = false
    },
    copyRow(r) {
      this.copyClose()
      const query = {
        'fromWardCode': this.defaultRegionShortCode,
        'toWardCode': this.toWardCode
      }
      let promise
      switch (this.module) {
        case 'shift':// 班次管理
          promise = shift_copy(query)
          break
        case 'moniitemWarning':// 预警管理
          promise = moniitemWarning_copyWardMonWarningConfig(query)
          break
        case 'verificationOperation':// 数据校验规则配置
          promise = verificationOperation_copy(query)
          break
        case 'vitalSigns':// 体征曲线
          promise = vitalSigns_copyVitalSigns(query)
          break
        case 'skinPosi':// 皮肤部位
          promise = skinPosi_copy(query)
          break
        case 'catheterMoniitem':// 导管监护项
          promise = catheterMoniitem_copy(query)
          break
        case 'catheterRule':// 导管感染风险
          promise = catheterRule_copy(query)
          break
        case 'cathPosi':// 导管部位
          promise = cathPosi_copy(query)
          break
        case 'patientIcon':
          promise = patientIcon_copyData(query)
          break
        case 'rescureBaseMoniitem':// 抢救记录项-->监护项配置
        case 'rescureDrug':// 抢救记录项-->输液/用药
        case 'other':// 抢救记录项-->其他事件
          promise = rescure_rescureBaseMoniitem_copy(query)
          break
        case 'tempSetting':
          promise = template_copyTemplateListConfig(query)
          break
        case 'anasDrugSetting':
          promise = pain_painDrug_copy(query)
          break
        case 'wardModule': // 监护配置
          promise = wardModule_copyWardMonitorConfig(query)
          break
        case 'focalPatient': // 重点患者情况设置
          promise = focalPatient_copyWardConfig(query)
          break
        case 'qcReportConfig': // ICU质控报表配置 - 复制
          promise = qcReportConfig_copyWardConfig(query)
          break
        case 'dialysisDrugConfig':
          promise = dialysisDispensing_copyDialysisDispensing(query)
          break
        case 'medicalCalc':
          promise = medFormulaGroup_copyOutwardRuleWard(query)
          break
        case 'outzoneRuleConfig':
          promise = outwardRuleWard_copyOutwardRuleWard(query)
          break
        case 'consuit':
          promise = consuitType_copyWardConfig(query)
          break
        case 'concentrateEntry':
          promise = jzlrModule_copy(query)
          break
        case 'qcReport':
          promise = qcReportQuery_copyWardConfig(query)
          break
        case 'drugUsage':
          promise = drugUsage_copyTo(query)
          break
        case 'aid':
          promise = aidConfig_copyWardConfig(query)
          break
        case 'patientMonitorConfig':
          promise = patientMonitoring_copyWardConfig(query)
          break
        case 'stressConfig':
          promise = stress_copy(query)
          break
        case 'nutritionConversionConfig':
          promise = nutritionConvert_copy(query)
          break
        case 'performanceConfig':
          promise = performanceConfig_copy(query)
          break
        case 'nursePlanConfig':
          promise = nurseDiag_copyTo(query)
          break
        default:
          break
      }
      promise.then(res => {
        this.$message({
          type: 'success',
          message: '复制成功'
        })
        this.$emit('defaultRegionChange', this.defaultRegionCopy)
      })
    },
    clearRow(r) {
      this.$confirm('您确定要删除吗？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
      )
        .then(async () => {
          const query = r.wardCode
          let promise
          switch (this.module) {
            case 'shift':// 预警管理
              promise = shift_deleteByWardCode(query)
              break
            case 'moniitemWarning':// 预警管理
              promise = moniitemWarning_deleteByWardCode(query)
              break
            case 'verificationOperation':// 规则校验
              promise = moniitemWarning_deleteByWardCode(query)
              break
            case 'vitalSigns':// 体征曲线
              promise = vitalSigns_cleanVitalSigns(query)
              break
            case 'skinPosi':// 皮肤部位
              promise = skinPosi_deleteByWardCode(query)
              break
            case 'catheterMoniitem':// 导管监护项
              promise = catheterMoniitem_deleteByWardCode(query)
              break
            case 'catheterRule':// 导管感染风险
              promise = catheterRule_deleteByWardCode(query)
              break
            case 'cathPosi':// 导管部位
              promise = cathPosi_deleteByWardCode(query)
              break
            case 'rescureBaseMoniitem':// 导管部位
              promise = rescure_rescureBaseMoniitem_clear(query)
              break

            case 'wardModule': { // 监护配置
              const wardModuleQuery = {
                'wardCode': r.wardCode
              }
              promise = wardModule_deleteByWardCode(wardModuleQuery)
              break
            }
            default:
              this.$message('没有清除的分类')
              break
          }
          promise.then(res => {
            this.$message.success('删除成功！')
            this.$emit('defaultRegionChange', this.defaultRegionCopy)
          })
        })
        .catch((err) => {
          console.error(err)
        })
    },
    remoteMethod: async function (searchKey = '') {
      const res = await icuWard_findWithPage({
        'pageNum': 1,
        'pageSize': 100,
        'userName': this.userInfo.userName,
        'searchKey': searchKey
      })
      this.tableDataRegionPlus = res.data.result
    },
    init: function () {
      icuWard_findWithPage({
        'pageNum': 1,
        'pageSize': 1000,
        'userName': this.userInfo.userName,
        'searchKey': this.searchKey
      }).then(res => {
        this.$emit('icuWardFindWithPage', res.data.result)
        this.tableDataRegion = res.data.result
        const defaultRegionData = this.tableDataRegion.find(item => item.wardCode === this.defaultRegion)
        if (defaultRegionData) {
          this.$emit('regionChange', defaultRegionData)
          this.defaultRegionCopy = this.defaultRegion
          this.$emit('defaultRegionChange', this.defaultRegionCopy, this.tableDataRegion)
        } else {
          if (this.tableDataRegion.length) {
            this.defaultRegionCopy = this.tableDataRegion[0].wardCode
            this.$emit('defaultRegionChange', this.defaultRegionCopy, this.tableDataRegion)
          } else {
            this.defaultRegionCopy = ''
            this.$emit('defaultRegionChange', '', this.tableDataRegion)
          }
        }
      })
    }
  },
  watch: {
    defaultRegion: {
      handler() {
        // this.init()
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法

.elSelectCss {
  width: 100%;
}
</style>
