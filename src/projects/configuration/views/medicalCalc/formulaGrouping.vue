<!-- 监护配置 -->
<template>
  <div id="formulaGrouping" class="formulaGrouping">
    <!-- ICU病区 -->
    <div class="ICUWard">
      <el-container style="height:100%">
        <el-header class="elHeader1">
          <div>
            <i class="iconBlue"></i>
            <span>病区列表</span>
          </div>
        </el-header>
        <el-container style="height:calc(100% - 42px)">
          <icu-region
            :defaultPermi="['configuration:basicSettings:medicalCalc']"
            :defaultRegion="selectWardCode"
            :module="'medicalCalc'"
            @defaultRegionChange="defaultRegionChange"
            @icuWardFindWithPage="icuWardFindWithPage"
          ></icu-region>
        </el-container>
      </el-container>
    </div>
    <!-- 公式分组 -->
    <div class="monitoringClassification">
      <el-container class="itemsContainer">
        <el-header class="elHeader1">
          <div>
            <i class="iconBlue"></i>
            <span>公式分组</span>
          </div>
        </el-header>
        <el-header>
          <div>
            <el-input size="small" placeholder="分组名称编码" @input="debounceSearch" v-model="searchKey" clearable suffix-icon="el-icon-search" class="pr-5"></el-input>
            <el-checkbox v-model="statusDict" true-label false-label="1" @change="() =>getMonitypeList()" class="pl-5">显示禁用</el-checkbox>
          </div>
          <el-button
            v-hasPermi="['configuration:basicSettings:medicalCalc']"
            class="queryButton"
            type="primary"
            size="small"
            :disabled="newTypeDisabled"
            @click.native.prevent="addMonitypeRow"
          >新增</el-button>
        </el-header>
        <el-main class="itemsTable">
          <el-table
            @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)"
            height="100%"
            ref="tableDataMonitype"
            :data="tableDataMonitype"
            :row-key="'monitypeCode'"
            :row-class-name="({row}) => row.statusDict == 0 ? 'disabled' : ''"
            @row-click="getMoniitemListByMonitypeId"
            highlight-current-row
            fit
            border
          >
            <v-table-column label="排序" key="sortNo" align="center">
              <template slot-scope="scope">
                <el-input-number type="number" v-if="scope.row.isEdit||scope.row.isCreate" :min="1" v-model="scope.row.sortNo" placeholder="请输入"></el-input-number>
                <span v-else>{{scope.row.sortNo}}</span>
              </template>
            </v-table-column>
            <v-table-column label="分组名称" key="dictName" align="center">
              <template slot-scope="scope">
                <el-select
                  v-if="scope.row.isEdit||scope.row.isCreate"
                  @focus="()=>filterMethod()"
                  :filter-method="filterMethod"
                  filterable
                  clearable
                  v-model="scope.row.formulaGroupDictCode"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in ICIS_DICT_FORMULA_GROUP"
                    :key="item.dictCode"
                    :label="item.dictName"
                    :value="item.dictCode"
                    :disabled="item.statusDict == '0'||tableDataMonitypeFilter(item)"
                  ></el-option>
                </el-select>
                <span v-else>{{scope.row.formulaGroupDictCode|showDictNameFilter(ICIS_DICT_FORMULA_GROUP,'dictCode_to_dictName')}}</span>
              </template>
            </v-table-column>
            <v-table-column prop="statusDict" label="状态" min-width="120px" align="center">
              <template slot-scope="scope">
                <el-switch v-if="scope.row.isEdit" v-model="scope.row.statusDict" active-value="1" inactive-value="0" active-text="已启用" inactive-text="已禁用"></el-switch>
                <span v-else>{{+scope.row.statusDict ? '已启用' : '已禁用' }}</span>
              </template>
            </v-table-column>
            <v-table-column label="操作" align="center" style="width:200px" fixed="right">
              <template slot-scope="scope">
                <el-button v-hasPermi="['configuration:basicSettings:medicalCalc']" v-if="!scope.row.isEdit" type="text" @click.stop="updateMonitypeRow(scope.row, scope.$index)">修改</el-button>
                <el-button v-hasPermi="['configuration:basicSettings:medicalCalc']" type="text" v-if="scope.row.isEdit" @click.stop="cancelMonitypeRow(scope.row, scope.$index)">取消</el-button>
                <el-button v-hasPermi="['configuration:basicSettings:medicalCalc']" type="text" v-if="scope.row.isEdit" @click.stop="saveMonitypeRow(scope.row, scope.$index)">保存</el-button>
              </template>
            </v-table-column>
          </el-table>
        </el-main>
      </el-container>
    </div>
    <!-- 公式 -->
    <div class="guardianshipItems">
      <el-container class="itemsContainer">
        <el-header class="elHeader1">
          <div>
            <i class="iconBlue"></i>
            <span>公式</span>
          </div>
        </el-header>
        <el-header>
          <el-input size="small" placeholder="公式名称/简称" @input="debounceSearchPlus" v-model="searchKeyPlus" clearable suffix-icon="el-icon-search"></el-input>
          <el-button
            v-hasPermi="['configuration:basicSettings:medicalCalc']"
            class="queryButton"
            type="primary"
            size="small"
            :disabled="itemAddDisabled"
            @click.native.prevent="addMoniitemRow"
          >新增</el-button>
        </el-header>
        <el-main class="itemsTable">
          <el-table
            @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)"
            ref="tableDataItem"
            :data="tableDataItem"
            highlight-current-row
            fit
            border
            height="100%"
          >
            <v-table-column label="排序" key="sortNo" align="center" width="150">
              <template slot-scope="scope">
                <el-input-number :min="1" :max="100" type="number" v-if="scope.row.isEdit||scope.row.isCreate" v-model="scope.row.sortNo" placeholder="请输入"></el-input-number>
                <span v-else>{{scope.row.sortNo}}</span>
              </template>
            </v-table-column>
            <v-table-column label="公式名称" key="medicalCalcDictCode" align="center">
              <template slot-scope="scope">
                <el-select
                  v-if="scope.row.isEdit||scope.row.isCreate"
                  @change="visibleChange(scope.row)"
                  @focus="()=>filterMethodPlus()"
                  :filter-method="filterMethodPlus"
                  filterable
                  clearable
                  v-model="scope.row.medicalCalcDictCode"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in ICIS_DICT_MEDICAL_CALC"
                    :key="item.dictCode"
                    :label="item.dictName"
                    :value="item.dictCode"
                    :disabled="item.statusDict == '0'||tableDataMoniItemFilter(item)"
                  >
                    <span style="float: left">{{ item.dictName }}</span>
                    <svg-icon v-if="item.flag" icon-class="edit2" style="width:34px;height:34px;scale: 0.5;" />
                  </el-option>
                </el-select>
                <span v-else>{{scope.row.medicalCalcDictName}}</span>
              </template>
            </v-table-column>
            <v-table-column label="公式简称" prop="medicalCalcAbbr" align="center">
              <template slot-scope="scope">
                <el-input
                  :maxlength="20"
                  v-if="scope.row.isEdit||scope.row.isCreate"
                  v-model="scope.row.medicalCalcAbbr"
                  clearable
                  filterable
                  :disabled="!(scope.row.isEdit||scope.row.isCreate)"
                  type="text"
                  placeholder="请输入"
                ></el-input>
                <span v-else>{{scope.row.medicalCalcAbbr}}</span>
              </template>
            </v-table-column>
            <v-table-column label="备注" prop="medicalCalcNote" align="center">
              <template slot-scope="scope">
                <el-input
                  :maxlength="500"
                  v-if="scope.row.isEdit||scope.row.isCreate"
                  v-model="scope.row.medicalCalcNote"
                  placeholder="请输入"
                  clearable
                  filterable
                  :disabled="!(scope.row.isEdit||scope.row.isCreate)"
                  type="text"
                ></el-input>
                <span v-else>{{scope.row.medicalCalcNote}}</span>
              </template>
            </v-table-column>
            <v-table-column label="操作" align="center" style="width:200px" fixed="right">
              <template slot-scope="scope">
                <el-button v-hasPermi="['configuration:basicSettings:medicalCalc']" v-if="!scope.row.isEdit" type="text" @click="updateMoniitemRow(scope.row, scope.$index)">修改</el-button>
                <el-button v-hasPermi="['configuration:basicSettings:medicalCalc']" type="text" v-if="scope.row.isEdit" @click="cancelMoniitemRow(scope.row, scope.$index)">取消</el-button>
                <el-button v-hasPermi="['configuration:basicSettings:medicalCalc']" type="text" v-if="scope.row.isEdit" @click="saveMoniitemRow(scope.row, scope.$index)">保存</el-button>
                <el-button v-if="!scope.row.isCreate" v-hasPermi="['configuration:basicSettings:medicalCalc']" type="text" @click.stop="leftEnableOrDisable(scope.row)">删除</el-button>
              </template>
            </v-table-column>
          </el-table>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import { debounce, cloneDeep } from 'lodash'
import { mapGetters } from 'vuex' // 存储方式
import { frontFilter } from '@/utils/index' // 模糊查询方法
import { showDictNameFilter } from '@/filters'
import {
  medCalc_findWithPage, // 查询公式详细配置
  medFormulaGroup_edit, // 修改公式分组详细配置
  medFormulaGroup_insert, // 添加公式详细配置
  //   wardModule_insert, // 添加病区关联功能模块
  //   wardModule_deleteById, // 删除病区关联功能模块
  medFormulaGroup_findWithPage, // 查询病区功能模块管理公式分组
  medCalc_insert, // 添加公式
  medCalc_edit, // 修改公式
  medCalc_deleteById, // 删除病区功能模块管理公式分组
  medicalDefine_findList // 医学计算器配置 - 自定义公式配置 - 公式 查询
} from '@/api/configuration'
import icuRegion from '@/views/configuration/basicSettings/components/icuRegion.vue'
export default {
  name: 'FormulaGrouping',
  components: { icuRegion },
  data: function() {
    return {
      statusDict: '',
      curType: {},
      queryData: {},
      ICIS_DICT_FORMULA_GROUP: [],
      ICIS_DICT_FORMULA_GROUP_All: [],
      ICIS_DICT_MEDICAL_CALC: [],
      ICIS_DICT_MEDICAL_CALC_All: [],
      searchKey: '',
      searchKeyPlus: '',
      loading: false,
      selectWardCode: '', // 病区编码
      selectWardName: '', // 病区名称
      tableDataMonitype: [], // 公式分组表数据
      tableDataMonitypeAll: [], // 公式分组表数据
      tableDataItem: [], // 公式数据
      tableDataItemAll: [],
      tableDataItemBigAll: [],
      curModuleRow: {}, // 公式分组当前行数据
      curMonitypeRow: [], // 公式分组当前行数据
      curMoniitemRow: [], // 公式当前行数据
      moduleNameInput: '', // 功能模块输入值
      curMonitypeModuleRow: null, // 当前选中功能模块
      userWardList: [] // 病区集合
    }
  },
  computed: {
    ...mapGetters(['currentUserWard']),
    itemAddDisabled() {
      return !this.curType || !this.curType.formulaGroupDictCode || this.tableDataItem.filter(v => v.isCreate || v.isEdit || v.isAdd).length > 0
    },
    newTypeDisabled() {
      return this.tableDataMonitype.filter(v => v.isCreate || v.isEdit || v.isAdd).length > 0
    }
  },
  created: async function() {
    this.selectWardCode = this.currentUserWard.wardCode
    const { ICIS_DICT_FORMULA_GROUP, ICIS_DICT_MEDICAL_CALC } = await this.$batchGetDictItemList(['ICIS_DICT_FORMULA_GROUP', 'ICIS_DICT_MEDICAL_CALC'])
    this.ICIS_DICT_FORMULA_GROUP = this.ICIS_DICT_FORMULA_GROUP_All = ICIS_DICT_FORMULA_GROUP
    // 自定义公式列表请求
    const medicalDefine = await this.medicalDefineFindList()
    this.ICIS_DICT_MEDICAL_CALC = this.ICIS_DICT_MEDICAL_CALC_All = ICIS_DICT_MEDICAL_CALC
    this.ICIS_DICT_MEDICAL_CALC = this.ICIS_DICT_MEDICAL_CALC.concat(medicalDefine) // 合并自定义列表
    this.ICIS_DICT_MEDICAL_CALC = this.eliminateArray(this.ICIS_DICT_MEDICAL_CALC, 'dictCode', 'dictName') // 合并自定义列表 去重
    // 病区列表
  },
  mounted() {},
  methods: {
    visibleChange(row) {
      const sure = this.ICIS_DICT_MEDICAL_CALC.filter(v => v.dictCode == row.medicalCalcDictCode)
      if (sure.length >= 1) {
        this.tableDataItem = this.tableDataItem.map(v => {
          if (v.medicalCalcDictCode == row.medicalCalcDictCode) {
            v.medicalCalcDictCode = sure[0].dictCode
            v.medicalCalcAbbr = sure[0].dictAbbr || sure[0]?.medicalDefineAbbr
            v.medicalCalcNote = sure[0]?.medicalDefineNote
          }
          return v
        })
        this.tableDataItem = JSON.parse(JSON.stringify(this.tableDataItem))
      }
    },
    tableDataMonitypeFilter(item) {
      return this.tableDataMonitype.filter(v => v.formulaGroupDictCode == item.dictCode).length > 0
    },
    tableDataMoniItemFilter(item) {
      return this.tableDataItemBigAll.filter(v => v.medicalCalcDictCode == item.dictCode).length > 0
    },
    filterMethod(val) {
      this.ICIS_DICT_FORMULA_GROUP = frontFilter(val, this.ICIS_DICT_FORMULA_GROUP_All)
    },
    async filterMethodPlus(val) {
      this.ICIS_DICT_MEDICAL_CALC = frontFilter(val, this.ICIS_DICT_MEDICAL_CALC_All)
      // 自定义公式列表请求
      const medicalDefine = await this.medicalDefineFindList(val)
      if (medicalDefine && medicalDefine.length > 0) {
        this.ICIS_DICT_MEDICAL_CALC = this.ICIS_DICT_MEDICAL_CALC.concat(medicalDefine) // 合并自定义列表
        this.ICIS_DICT_MEDICAL_CALC = this.eliminateArray(this.ICIS_DICT_MEDICAL_CALC, 'dictCode', 'dictName') // 合并自定义列表 去重
      }
    },
    debounceSearch() {
      this.debounceSearchSymbol = this.debounceSearchSymbol
        ? this.debounceSearchSymbol
        : debounce(function() {
            this.tableDataMonitype = frontFilter(this.searchKey, this.tableDataMonitypeAll)
            if (this.tableDataMonitype.length > 0) {
              this.$refs.tableDataMonitype.setCurrentRow(this.tableDataMonitype[0])
              this.curType = this.tableDataMonitype[0]
              this.getMoniitemList()
            }
          }, 200)
      this.debounceSearchSymbol()
    },
    debounceSearchPlus() {
      this.debounceSearchSymbolPlus = this.debounceSearchSymbolPlus
        ? this.debounceSearchSymbolPlus
        : debounce(function() {
            this.tableDataItem = frontFilter(this.searchKeyPlus, this.tableDataItemAll)
          }, 200)
      this.debounceSearchSymbolPlus()
    },
    // 病区选择
    selectWard: async function(wardCode, ICIS_DICT_FORMULA_GROUP = this.ICIS_DICT_FORMULA_GROUP) {
      this.loading = true
      if (wardCode) {
        this.tableDataMonitype = []
        this.tableDataItem = []
        this.getMonitypeList()
      } else {
        this.tableDataMonitype = []
        this.tableDataItem = []
      }
      this.loading = false
    },
    // 点击公式分组
    getMoniitemListByMonitypeId(row) {
      this.curType = row
      this.getMoniitemList()
    },
    // 新增公式分组
    addMonitypeRow() {
      this.tableDataMonitype.map(item => {
        item.isCreate = item.isEdit = item.isAdd = false
        return item
      })
      const row = {
        isCreate: true,
        isEdit: true,
        isAdd: true,
        statusDict: '1',
        sortNo: Math.max(...this.tableDataMonitype.map(v => v.sortNo), 0) + 1
      }
      this.tableDataMonitype.unshift(row)
    },
    // 新增公式
    addMoniitemRow() {
      this.tableDataItem.map(item => {
        item.isCreate = item.isEdit = item.isAdd = false
        return item
      })
      const row = {
        isCreate: true,
        isEdit: true,
        isAdd: true,
        sortNo: Math.max(...this.tableDataItem.map(v => v.sortNo), 0) + 1
      }
      this.tableDataItem.unshift(row)
    },
    // 修改公式
    updateMoniitemRow(row, index) {
      this.curMoniitemRow[index] = { ...row }
      row.isEdit = true
      this.tableDataItem = cloneDeep(this.tableDataItem)
      this.$refs.tableDataItem.doLayout()
    },
    // 修改公式分组
    updateMonitypeRow(row, index) {
      this.curMonitypeRow[index] = { ...row }
      row.isEdit = true
      this.tableDataMonitype = cloneDeep(this.tableDataMonitype)
      // this.$refs.tableDataMonitype.doLayout()
    },
    // 取消当前编辑公式
    cancelMoniitemRow(row, index) {
      if (row.isCreate) {
        this.tableDataItem.shift()
      } else {
        row.isEdit = false
        this.tableDataItem = JSON.parse(JSON.stringify(this.tableDataItem))
        this.$refs.tableDataItem.doLayout()
        this.tableDataItem[index] = this.curMoniitemRow[index]
      }
    },
    // 取消公式分组
    cancelMonitypeRow(row, index) {
      if (row.isCreate) {
        this.tableDataMonitype.shift()
      } else {
        row.isEdit = false
        this.tableDataMonitype = cloneDeep(this.tableDataMonitype)
        this.tableDataMonitype[index] = this.curMonitypeRow[index]
        this.$refs.tableDataMonitype.doLayout()
      }
    },
    // 保存公式分组
    saveMonitypeRow(row, index) {
      if (!row.sortNo && row.sortNo !== 0) {
        this.$message.error('请填写排序')
        return
      } else if (this.tableDataMonitype.filter(v => v.sortNo == row.sortNo).length > 1) {
        this.$message.error('排序码重复，请重新输入！')
        return
      }
      if (!row.formulaGroupDictCode) {
        this.$message.error('请选择公式分组')
        return
      }
      row.wardCode = this.selectWardCode
      row.formulaGroupDictName = showDictNameFilter(row.formulaGroupDictCode, this.ICIS_DICT_FORMULA_GROUP, 'dictCode_to_dictName')
      if (row.configMedFormulaGroupId) {
        // 编辑
        medFormulaGroup_edit(row).then(res => {
          if (res.code == 0) {
            row.isEdit = false
            row.isCreate = false
            this.$message.success('保存成功')
            this.$refs.tableDataMonitype.setCurrentRow(row)
            this.curType = row
            this.getMoniitemList(row)
          }
        })
      } else {
        // 新增\
        medFormulaGroup_insert(row).then(res => {
          if (res.code == 0) {
            row.isEdit = false
            row.isCreate = false
            this.$message.success('保存成功')
            this.getMonitypeList(row)
          }
        })
      }
    },
    // 保存公式
    saveMoniitemRow(row, index) {
      if (!row.sortNo && row.sortNo !== 0) {
        this.$message.error('请填写排序')
        return
      } else if (this.tableDataItem.filter(v => v.sortNo == row.sortNo).length > 1) {
        this.$message.error('排序码重复，请重新输入！')
        return
      }
      if (!row.medicalCalcDictCode) {
        this.$message.error('请选择公式')
        return
      }
      row.wardCode = this.selectWardCode
      row.formulaGroupDictCode = this.curType.formulaGroupDictCode
      row.medicalCalcDictName = showDictNameFilter(row.medicalCalcDictCode, this.ICIS_DICT_MEDICAL_CALC_All, 'dictCode_to_dictName') || showDictNameFilter(row.medicalCalcDictCode, this.ICIS_DICT_MEDICAL_CALC, 'dictCode_to_dictName')
      if (row.icisConfigMedCalcId) {
        medCalc_edit(row).then(res => {
          if (res.code === 0) {
            row.isEdit = false
            this.tableDataItem = JSON.parse(JSON.stringify(this.tableDataItem))
            this.$refs.tableDataItem.doLayout()
            this.$message.success('保存成功')
          }
        })
      } else {
        // 新增
        medCalc_insert(row).then(res => {
          if (res.code === 0) {
            row.isEdit = false
            row.isCreate = false
            this.$message.success('保存成功')
            this.getMoniitemList()
          }
        })
      }
    },
    // 启用禁用-公式分组
    leftEnableOrDisable(row) {
      this.$confirm('您确定要删除吗？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const query = row.icisConfigMedCalcId
        medCalc_deleteById(query).then(res => {
          if (res.code == 0) {
            this.getMonitypeList(this.curType)
            this.getMoniitemList()
          }
        })
      })
    },
    // 获取公式数据
    getMoniitemList() {
      const query = {
        wardCode: this.selectWardCode,
        wardName: this.selectWardName,
        // formulaGroupDictCode: this.curType.formulaGroupDictCode,
        pageNum: 1,
        pageSize: 1000
      }
      if (!this.curType || !this.curType.formulaGroupDictCode) {
        this.tableDataItem = this.tableDataItemAll = []
        return
      }
      medCalc_findWithPage(query).then(res => {
        this.tableDataItemBigAll = res.data.result
        this.tableDataItem = this.tableDataItemAll = this.tableDataItemBigAll.filter(v => v.formulaGroupDictCode == this.curType.formulaGroupDictCode)
        this.tableDataItem = frontFilter(this.searchKeyPlus, this.tableDataItemAll)
        // 重复dolayout
        this.$refs.tableDataItem.doLayout()
      })
    },
    // 获取公式分组数据
    getMonitypeList(row) {
      if (this.selectWardCode) {
        const query = {
          wardCode: this.selectWardCode,
          pageNum: 1,
          pageSize: 1000,
          statusDict: this.statusDict
        }
        medFormulaGroup_findWithPage(query).then(res => {
          res.data.result.map(item => {
            item.isEdit = false
          })
          this.tableDataMonitype = this.tableDataMonitypeAll = res.data.result
          this.tableDataMonitype = frontFilter(this.searchKey, this.tableDataMonitypeAll)
          if (this.tableDataMonitype.length > 0) {
            this.curType = row || this.tableDataMonitype[0]
            const curRow = this.tableDataMonitype.filter(v => v.formulaGroupDictCode == this.curType.formulaGroupDictCode)
            this.$refs.tableDataMonitype.setCurrentRow(curRow[0])
          }
          this.getMoniitemList()
        })
      } else {
        this.tableDataMonitype = []
      }
    },
    /**
     * userWardList
     */
    icuWardFindWithPage(data) {
      this.userWardList = data
    },
    defaultRegionChange(defaultRegion) {
      if (defaultRegion) {
        this.moduleNameInput = ''
        this.selectWardCode = defaultRegion
        this.selectWardName = this.userWardList.filter(item => item.wardCode === this.selectWardCode)[0].wardName
        this.selectWard(this.selectWardCode)
      } else {
        this.moduleNameInput = ''
        this.selectWardCode = ''
        this.selectWardName = ''
        this.selectWard('')
      }
    },
    /**
     * 自定义公式 列表
     */
    medicalDefineFindList(key) {
      return new Promise((resolve, reject) => {
        medicalDefine_findList({
          pageNum: 1,
          pageSize: 50,
          searchKey: key || ''
        })
          .then(res => {
            if (res.code === 0) {
              const data = []
              res.data.result.map(i => {
                data.push({
                  dictCode: i.medicalDefineCode,
                  dictName: i.medicalDefineName,
                  medicalDefineAbbr: i.medicalDefineAbbr,
                  medicalDefineNote: i.medicalDefineNote,
                  flag: true
                })
              })

              resolve(data)
            } else {
              reject([])
            }
          })
          .catch(() => {
            reject([])
          })
      })
    },
     /**
     * 清除相同数组
     */
    eliminateArray(arr, code, name) {
      const map = new Map()
      return arr.filter(res => {
        return !map.has(res[code]) && map.set(res[code], 1) || !map.has(res[name]) && map.set(res[name], 1)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法
.formulaGrouping {
  display: flex;
  height: 100%;
  background: #fff;
  padding-bottom: 15px;
  .ICUWard {
    width: 20%;
    padding: 10px 10px 0 10px;
    border-right: 2px solid rgba(203, 215, 238, 0.3);
    margin-right: 10px;
  }
  .monitoringClassification {
    width: calc(40% - 10px);
    padding-top: 10px;
    border-right: 2px solid rgba(203, 215, 238, 0.3);
    padding-right: 10px;
    margin-right: 10px;
  }
  .guardianshipItems {
    width: calc(40% - 10px);
    padding-top: 10px;
    padding-right: 10px;
  }
  .itemsContainer {
    height: 100%;
    .itemsTable {
      height: calc(100% - 32px);
    }
  }
}
</style>
