<!-- 监护配置 -->
<template>
  <div id="guardianshipConfig" class="guardianshipConfig">
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
          <icu-region :defaultPermi="['configuration:basicSettings:moniitemConfig']" :defaultRegion="selectWardCode"
            :module="'wardModule'" @defaultRegionChange="defaultRegionChange"
            @icuWardFindWithPage="icuWardFindWithPage"></icu-region>
        </el-container>
      </el-container>
    </div>
    <!-- 功能模块 -->
    <div class="functionalModule">
      <el-container class="itemsContainer">
        <el-header class="elHeader1">
          <div>
            <i class="iconBlue"></i>
            <span>功能模块</span>
          </div>
        </el-header>
        <el-container style="height:calc(100% - 42px)">
          <el-header class="elHeader2">
            <el-input size="small" v-model="moduleNameInput" placeholder="功能模块" clearable
              suffix-icon="el-icon-search"></el-input>
          </el-header>
          <el-main class="itemsTable" style="height:calc(100% - 42px)">
            <el-table
              @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
              height="100%" ref="tableDataModule" v-loading="loading" :data="tableDataModule" :row-key="'dictName'"
              @row-click="getMonitypeByModuleId" highlight-current-row fit border>
              <v-table-column v-for="item in moduleLables" :key="item.label" :label="item.label" :min-width="item.width"
                align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row[item.key] }}</span>
                </template>
              </v-table-column>
            </el-table>
          </el-main>
        </el-container>
      </el-container>
    </div>
    <!-- 监护数据显示分组 -->
    <div class="monitoringClassification">
      <el-container class="itemsContainer">
        <el-header class="elHeader1">
          <div>
            <i class="iconBlue"></i>
            <span>显示分组</span>
          </div>

        </el-header>
        <div class="flex flex-between align-items-center m-b10">
          <el-checkbox v-model="typeStatusDict" true-label="" false-label="1"
            @change="getMonitypeList(curMonitypeModuleRow)">
            显示禁用
          </el-checkbox>
          <el-button v-hasPermi="['configuration:basicSettings:moniitemConfig']" class="queryButton" type="primary"
            size="small" @click.native.prevent="addMonitypeRow">新增</el-button>
        </div>
        <el-main class="itemsTable">
          <el-table
            @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
            height="100%" ref="tableDataMonitype" :row-class-name="({ row }) => row.statusDict == 0 ? 'disabled' : ''"
            :data="tableDataMonitype" :row-key="'monitypeCode'" @row-click="getMoniitemListByMonitypeId"
            highlight-current-row fit border>
            <v-table-column v-for="(item, index) in monitypeLables" :key="item.dictCode" :label="item.label"
              :min-width="item.width" align="center">
              <template slot-scope="scope">
                <template v-if="index === 1">
                  <el-select v-if="scope.row.isAdd" value-key="codeName" width="80%" v-model="scope.row[item.key]"
                    placeholder="请选择" clearable filterable :disabled="!scope.row.isEdit">
                    <el-option v-for="(item) in dictMonitypeList" :key="item.dictCode" :label="item.dictName"
                      :value="item.dictCode" :disabled="item.statusDict == '0'"></el-option>
                  </el-select>
                  <template v-else>
                    {{ scope.row[item.key] | showDictNameFilter(dictMonitypeList, 'dictCode_to_dictName') }}
                  </template>
                </template>
                <el-input v-else-if="scope.row.isEdit" v-model="scope.row[item.key]" placeholder="请输入"></el-input>
                <span v-else>{{ scope.row[item.key] }}</span>
              </template>
            </v-table-column>
            <v-table-column label="操作" align="center" style="width:200px">
              <template slot-scope="scope">
                <el-button v-hasPermi="['configuration:basicSettings:moniitemConfig']" v-if="!scope.row.isEdit"
                  type="text" @click="updateMonitypeRow(scope.row, scope.$index)">修改</el-button>
                <el-button v-hasPermi="['configuration:basicSettings:moniitemConfig']" type="text" v-if="scope.row.isEdit"
                  @click="cancelMonitypeRow(scope.row, scope.$index)">取消</el-button>
                <el-button v-hasPermi="['configuration:basicSettings:moniitemConfig']" type="text" v-if="scope.row.isEdit"
                  @click="saveMonitypeRow(scope.row, scope.$index)">保存</el-button>
                <el-button v-if="!scope.row.isCreate" v-hasPermi="['configuration:basicSettings:moniitemConfig']"
                  type="text" @click.stop="leftEnableOrDisable(scope.row)"
                  :style="{ color: scope.row.statusDict == 1 ? '#EC0000' : '#00AB44' }">
                  {{+scope.row.statusDict ? '禁用' : '启用' }}</el-button>
              </template>
            </v-table-column>
          </el-table>
        </el-main>
      </el-container>
    </div>
    <!-- 监护项 -->
    <div class="guardianshipItems">
      <el-container class="itemsContainer">
        <el-header class="elHeader1">
          <div>
            <i class="iconBlue"></i>
            <span>监护项</span>
          </div>

        </el-header>
        <div class="flex flex-between align-items-center m-b10">
          <el-checkbox v-model="statusDict" true-label="" false-label="1" @change="getMoniitemList()">
            显示禁用
          </el-checkbox>
          <el-button v-hasPermi="['configuration:basicSettings:moniitemConfig']" class="queryButton" type="primary"
            size="small" @click.native.prevent="addMoniitemRow">新增</el-button>
        </div>
        <el-main class="itemsTable">
          <el-table
            @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
            ref="tableDataItem" :row-class-name="({ row }) => row.statusDict == 0 ? 'disabled' : ''" :data="tableDataItem"
            highlight-current-row fit border width="100%" height="100%">
            <v-table-column v-for="(item, index) in moniitemLables" :key="`${item.key}-${index}`" :label="item.label"
              :min-width="item.width" align="center">
              <template slot-scope="scope">
                <template v-if="index === 1">
                  <!-- <el-select v-if="scope.row.isEdit||scope.row.isCreate" value-key="moniitemCode" v-model="scope.row[item.key]" placeholder="选择监护项"
                             clearable filterable @input="handleChangeMoniitem(scope.row, scope.row[item.key], 'moniitemDictList')">
                    <el-option v-for="(item) in moniitemDictList" :key="item.moniitemCode" :label="item.moniitemName" :value="item.moniitemCode">
                      <span style="float: left">{{ item.moniitemName }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.moniitemCode }}</span>
                    </el-option>
                  </el-select> -->
                  <v-select-mon filterable v-if="(scope.row.isEdit || scope.row.isCreate) && moniitemDictList.length > 0"
                    clearable v-model="scope.row[item.key]" :options="moniitemDictList">
                  </v-select-mon>
                  <template v-else>
                    {{ scope.row.moniitemName }}
                  </template>
                </template>
                <wn-time-picker v-else-if="scope.row.isEdit && item.type == 'timePicker'" v-model="scope.row[item.key]"
                  placeholder="请选择时间" class="flex-1 time-select" format="HH:mm" value-format="HH:mm"
                  :default-value="new Date()"></wn-time-picker>

                <template v-else-if="item.type == 'showDict'">
                  <el-switch v-if="scope.row.isEdit" v-model="scope.row.showDict" active-value="1" inactive-value="0"
                    active-text="展示" inactive-text="不展示"></el-switch>
                  <span v-else>{{+scope.row.showDict ? '展示' : '不展示' }}</span>
                </template>
                <span
                  v-else-if="(scope.row.isEdit || scope.row.isCreate) && (item.label == '监护项编码' || item.label == '监护项说明')">{{
                    scope.row[item.key] }}</span>
                <el-input v-else-if="scope.row.isEdit" v-model="scope.row[item.key]" placeholder="请输入"></el-input>
                <span v-else>{{ scope.row[item.key] }}</span>
              </template>
            </v-table-column>
            <v-table-column label="操作" fixed="right" align="center" min-width="100"
              v-hasPermi="['configuration:basicSettings:moniitemConfig']">
              <template slot-scope="scope">
                <el-button v-hasPermi="['configuration:basicSettings:moniitemConfig']" v-if="!scope.row.isEdit"
                  type="text" @click="updateMoniitemRow(scope.row, scope.$index)">修改</el-button>
                <el-button v-hasPermi="['configuration:basicSettings:moniitemConfig']" type="text" v-if="scope.row.isEdit"
                  @click="cancelMoniitemRow(scope.row, scope.$index)">取消</el-button>
                <el-button v-hasPermi="['configuration:basicSettings:moniitemConfig']" type="text" v-if="scope.row.isEdit"
                  @click="saveMoniitemRow(scope.row, scope.$index)">保存</el-button>
                <el-button v-if="!scope.row.isCreate" v-hasPermi="['configuration:basicSettings:moniitemConfig']"
                  type="text" @click="rightEnableOrDisable(scope.row)"
                  :style="{ color: scope.row.statusDict == 1 ? '#EC0000' : '#00AB44' }">
                  {{+scope.row.statusDict ? '禁用' : '启用' }}</el-button>
              </template>
            </v-table-column>
          </el-table>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex' // 存储方式
import {
  wardModuleMoniitem_findAllWithPage, // 查询监护项详细配置
  wardModuleMoniitem_edit, // 修改监护项详细配置
  wardModuleMoniitem_deleteById, // 删除监护项详细配置
  wardModuleMoniitem_insert, // 添加监护项详细配置
  wardModuleMonGroup_getMaxSort,
  // moniitem_findWithPage, // 查询监护字典
  //   wardModule_insert, // 添加病区关联功能模块
  //   wardModule_deleteById, // 删除病区关联功能模块
  wardModuleMonGroup_findAllWithPage, // 查询病区功能模块管理监护数据显示分组
  wardModuleMonGroup_insert, // 添加病区功能模块管理监护数据显示分组
  wardModuleMonGroup_edit, // 修改病区功能模块管理监护数据显示分组
  wardModuleMonGroup_deleteById, // 删除病区功能模块管理监护数据显示分组
  moniitem_multipleListPage,
  wardModuleMoniitem_getMaxSort
} from '@/api/configuration'
import icuRegion from '../basicSettings/components/icuRegion.vue'
export default {
  name: 'GuardianshipConfig',
  components: { icuRegion },
  data: function () {
    return {
      typeStatusDict: '',
      statusDict: '',
      loading: false,
      selectWardCode: '', // 病区编码
      selectWardName: '', // 病区名称
      tableDataModule: [], // 模块表数据
      tableDataMonitype: [], // 监护数据显示分组表数据
      tableDataItem: [], // 监护项数据
      monitypeLables: [
        { label: '排序', key: 'sortNo', width: '50' },
        { label: '监护数据显示分组', key: 'monitypeCode', width: '100' }
      ],
      moniitemLables: [
        { label: '监护项编码', key: 'moniitemCode', width: '90', readOnly: true },
        { label: '监护项名称', key: 'moniitemCode', width: '90' },
        { label: '监护项说明', key: 'moniitemDesc', width: '90', readOnly: true },
        { label: '排序', key: 'sortNo', width: '50' },
        // { label: '每日几次', key: 'times', width: '100' },
        { label: '间隔小时', key: 'intervalTime', width: '100' },
        { label: '开始时间点', key: 'startTime', width: '100', type: 'timePicker' },
        { label: '是否展示', key: 'showDict', width: '150', type: 'showDict' }
      ],
      moduleLables: [
        { label: '功能模块', key: 'dictName', width: '130' }
      ],
      dictMonitypeList: [], // 监护数据显示分组字典
      moniitemDictList: [], // 监护项字典
      selectModuleCode: '', // 模块点击行
      selectModuleName: '',
      selectMonitypeCode: '', // 监护数据显示分组点击行
      selectMonitypeName: '',
      moduleList: [], // 功能模块列表
      curModuleRow: {}, // 监护数据显示分组当前行数据
      curMonitypeRow: [], // 监护数据显示分组当前行数据
      curMoniitemRow: [], // 监护项当前行数据
      moduleNameInput: '', // 功能模块输入值
      curMonitypeModuleRow: null, // 当前选中功能模块
      userWardList: [] // 病区集合
    }
  },
  props: {},
  watch: {
    // 功能模块搜索
    moduleNameInput(newVal) {
      this.tableDataModule = this.moduleList.filter(item => item.dictName.indexOf(newVal) !== -1)
    }
  },
  computed: {
    ...mapGetters(['currentUserWard'])
  },
  created() {
    this.init()
    // 病区列表
    this.selectWardCode = this.currentUserWard.wardCode
  },
  mounted() { },
  methods: {
    // 初始化
    init: async function () {
      const { ICIS_DICT_BUSI_TYPE, ICIS_DICT_MONI_TYPE } = await this.$batchGetDictItemList(['ICIS_DICT_BUSI_TYPE', 'ICIS_DICT_MONI_TYPE'])
      this.moduleList = ICIS_DICT_BUSI_TYPE
      this.dictMonitypeList = ICIS_DICT_MONI_TYPE
      const res = await moniitem_multipleListPage({
        statusDict: '1'
      })
      // 获取监护项字典数据
      this.moniitemDictList = res.data.result
    },
    // 病区选择
    selectWard(wardCode, moduleList = this.moduleList) {
      this.loading = true
      if (wardCode) {
        this.tableDataMonitype = []
        this.tableDataItem = []
        this.tableDataModule = [...moduleList]
        if (this.tableDataModule.length) {
          if (this.curMonitypeModuleRow) {
            this.$refs.tableDataModule.setCurrentRow(this.curMonitypeModuleRow)
            this.getMonitypeByModuleId(this.curMonitypeModuleRow)
          } else {
            this.$refs.tableDataModule.setCurrentRow(this.tableDataModule[0])
            this.getMonitypeByModuleId(this.tableDataModule[0])
          }
        }
      } else {
        this.tableDataModule = []
        this.tableDataMonitype = []
        this.tableDataItem = []
      }
      this.loading = false
    },
    // 权限控制 功能模块是否可选中
    mudoleSelectable(row, index) {
      return this.$btnHasPerm(['configuration:basicSettings:moniitemConfig'])
    },
    // 点击模块
    getMonitypeByModuleId(row) {
      this.curMonitypeModuleRow = row
      this.selectModuleCode = row.dictCode
      this.selectModuleName = row.dictName
      this.selectMonitypeCode = ''
      this.selectMonitypeName = ''
      this.typeStatusDict = ''
      this.getMonitypeList(row)
      this.tableDataItem = []
    },
    // 点击监护数据显示分组
    getMoniitemListByMonitypeId(row) {
      this.statusDict = ''
      this.selectMonitypeCode = row.monitypeCode
      const dictMonitype = this.dictMonitypeList.filter(item => item.dictCode == this.selectMonitypeCode)
      if (dictMonitype.length != 1) return
      this.selectMonitypeName = dictMonitype[0].dictName
      this.getMoniitemList()
    },
    // 新增监护数据显示分组
    async addMonitypeRow() {
      if (this.selectModuleCode == '') {
        this.$message.error('请先点击功能模块行')
        return
      }
      if (this.tableDataMonitype.length > 0) {
        const first = this.tableDataMonitype[0]
        if (first.isCreate) {
          return
        }
      }
      const maxSortNo = await this.getMoniTypeMaxSort()
      this.tableDataMonitype.map(item => { item.isEdit = false })
      const row = {
        isCreate: true,
        isEdit: true,
        isAdd: true,
        sortNo: maxSortNo
      }
      this.tableDataMonitype.unshift(row)
    },

    // 新增监护项
    async addMoniitemRow() {
      if (this.selectMonitypeCode == '') {
        this.$message.error('请先点击监护数据显示分组行')
        return
      }
      if (this.tableDataItem.length > 0) {
        const first = this.tableDataItem[0]
        if (first.isCreate) {
          return
        }
      }
      const maxSortNo = await this.getMoniitemMaxSort()
      this.tableDataItem.map(item => { item.isEdit = false })
      const row = {
        isCreate: true,
        isEdit: true,
        moniitemCode: '',
        moniitemName: '',
        moniitemDesc: '',
        sortNo: maxSortNo,
        intervalTime: '',
        startTime: '',
        showDict: '1'
      }
      this.tableDataItem.unshift(row)
    },
    /**
     *
     */
    getMoniTypeMaxSort() {
      return new Promise((resolve, reject) => {
        wardModuleMonGroup_getMaxSort({
          'busiTypeDictCode': this.selectModuleCode,
          'wardCode': this.selectWardCode
        }).then(res => {
          resolve(res.data)
        })
      })
    },
    /** 获取监护项列表最大排序号 */
    getMoniitemMaxSort() {
      return new Promise((resolve, reject) => {
        wardModuleMoniitem_getMaxSort({
          'busiTypeDictCode': this.selectModuleCode,
          'monitypeCode': this.selectMonitypeCode,
          'wardCode': this.selectWardCode
        }).then(res => {
          resolve(res.data)
        })
      })
    },
    // 修改监护项
    updateMoniitemRow(row, index) {
      this.curMoniitemRow[index] = { ...row }
      row.isEdit = true
      this.tableDataItem = JSON.parse(JSON.stringify(this.tableDataItem))
      this.$refs.tableDataItem.doLayout()
    },
    // 修改监护数据显示分组
    updateMonitypeRow(row, index) {
      this.curMonitypeRow[index] = { ...row }
      row.isEdit = true
      this.tableDataMonitype = JSON.parse(JSON.stringify(this.tableDataMonitype))
    },
    // 取消当前编辑监护项
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
    // 取消监护数据显示分组
    cancelMonitypeRow(row, index) {
      if (row.isCreate) {
        this.tableDataMonitype.shift()
      } else {
        row.isEdit = false
        this.tableDataMonitype = JSON.parse(JSON.stringify(this.tableDataMonitype))
        this.tableDataMonitype[index] = this.curMonitypeRow[index]
      }
    },
    // 保存监护数据显示分组
    saveMonitypeRow(row, index) {
      if (!row.sortNo && row.sortNo !== 0) {
        this.$message.error('请填写排序')
        return
      }
      if (row.monitypeCode === null || row.monitypeCode === undefined || row.monitypeCode.trim() === '') {
        this.$message.error('请选择监护数据显示分组')
        return
      }
      const query = {
        wardCode: this.selectWardCode,
        wardName: this.selectWardName,
        busiTypeDictCode: this.selectModuleCode,
        busiTypeDictName: this.selectModuleName,
        monitypeCode: row.monitypeCode,
        sortNo: row.sortNo
      }
      this.dictMonitypeList.forEach(item => {
        if (item.dictCode === row.monitypeCode) {
          query.monitypeName = item.dictName
        }
      })
      if (!row.isCreate) { // 编辑
        query.oldMonitypeCode = this.curMonitypeRow[index].monitypeCode
        wardModuleMonGroup_edit(query).then(res => {
          if (res.code == 0) {
            row.isEdit = false
            row.isCreate = false
            this.$message.success('保存成功')
          }
        })
      } else { // 新增\
        wardModuleMonGroup_insert(query).then(res => {
          if (res.code == 0) {
            row.isEdit = false
            row.isCreate = false
            this.$message.success('保存成功')
            this.getMonitypeList(row)
          }
        })
      }
    },
    // 保存监护项
    saveMoniitemRow(row, index) {
      if (!row.sortNo && row.sortNo !== 0) {
        this.$message.error('请填写排序')
        return
      }
      if (row.intervalTime !== '' && row.intervalTime !== null && row.intervalTime !== undefined) {
        if (!Number.isInteger(parseFloat(row.intervalTime))) {
          this.$message.error('间隔时间必须为整数!')
          return
        } else if (row.intervalTime < 0) {
          this.$message.error('请不要输入负数!')
          return
        }
      }
      const query = {
        wardCode: this.selectWardCode,
        wardName: this.selectWardName,
        busiTypeDictCode: this.selectModuleCode,
        busiTypeDictName: this.selectModuleName,
        monitypeCode: this.selectMonitypeCode,
        monitypeName: this.selectMonitypeName,
        ...row
      }
      if (!row.isCreate) {
        // 修改
        const editQuery = {
          oldMoniitemCode: this.curMoniitemRow[index].moniitemCode,
          moniitemCode: row.moniitemCode,
          moniitemDesc: row.moniitemDesc,
          moniitemName: row.moniitemName,
          sortNo: row.sortNo,
          intervalTime: row.intervalTime,
          startTime: row.startTime,
          showDict: +row.showDict
        }
        wardModuleMoniitem_edit({ ...this.curMoniitemRow[index], ...editQuery }).then(res => {
          if (res.code === 0) {
            row.isEdit = false
            this.tableDataItem = JSON.parse(JSON.stringify(this.tableDataItem))
            this.$refs.tableDataItem.doLayout()
            this.$message.success('保存成功')
          }
        })
      } else {
        // 新增
        wardModuleMoniitem_insert(query).then(res => {
          if (res.code === 0) {
            row.isEdit = false
            row.isCreate = false
            this.$message.success('保存成功')
            this.getMoniitemList()
          }
        })
      }
    },
    // 启用禁用-监护项
    rightEnableOrDisable(row) {
      const query = {
        busiTypeDictCode: row.busiTypeDictCode,
        moniitemCode: row.moniitemCode,
        monitypeCode: row.monitypeCode,
        wardCode: row.wardCode,
        statusDict: row.statusDict == '1' ? '0' : '1'
      }
      wardModuleMoniitem_deleteById(query).then(res => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: +row.statusDict ? '已禁用' : '已启用'
          })
          this.getMoniitemList()
        }
      })
    },
    // 启用禁用-监护数据显示分组
    leftEnableOrDisable(row) {
      this.selectMonitypeCode = row.monitypeCode
      const dictMonitype = this.dictMonitypeList.filter(item => item.dictCode == this.selectMonitypeCode)
      if (dictMonitype.length != 1) return
      this.selectMonitypeName = dictMonitype[0].dictName
      const query = {
        busiTypeDictCode: row.busiTypeDictCode,
        monitypeCode: row.monitypeCode,
        wardCode: row.wardCode,
        statusDict: row.statusDict == '1' ? '0' : '1'
      }
      wardModuleMonGroup_deleteById(query).then(res => {
        if (res.code == 0) {
          this.getMonitypeList(row)
          this.getMoniitemList()
          this.$message({
            type: 'success',
            message: +row.statusDict ? '已禁用' : '已启用'
          })
        }
      })
    },
    // 选择监护项字典
    handleChangeMoniitem(row, item, list) {
      if (item) {
        Object.assign(row, this[list].filter(listItem => listItem.moniitemCode === item)[0])
      } else {
        Object.keys(row).forEach(key => {
          if (!(key === 'isCreate' || key === 'isEdit')) {
            row[key] = ''
          }
        })
      }
    },
    // 获取监护项数据
    getMoniitemList() {
      const query = {
        wardCode: this.selectWardCode,
        wardName: this.selectWardName,
        busiTypeDictCode: this.selectModuleCode,
        busiTypeDictName: this.selectModuleName,
        monitypeCode: this.selectMonitypeCode,
        monitypeName: this.selectMonitypeName,
        pageNum: 1,
        pageSize: 1000,
        statusDict: this.statusDict
      }
      wardModuleMoniitem_findAllWithPage(query).then(res => {
        res.data.result.map(item => {
          item.isEdit = false
        })
        this.tableDataItem = res.data.result
        // 重复dolayout
        this.$refs.tableDataItem.doLayout()
      })
    },
    // 获取监护数据显示分组数据
    getMonitypeList(row) {
      if (this.selectWardCode) {
        const query = {
          wardCode: this.selectWardCode,
          wardName: this.selectWardName,
          busiTypeDictCode: this.selectModuleCode,
          busiTypeDictName: this.selectModuleName,
          pageNum: 1,
          pageSize: 1000,
          statusDict: this.typeStatusDict
        }
        wardModuleMonGroup_findAllWithPage(query).then(res => {
          res.data.result.map(item => {
            item.isEdit = false
          })
          this.tableDataMonitype = res.data.result
          this.$refs.tableDataMonitype.setCurrentRow(this.tableDataMonitype.filter(req => { return req.monitypeCode == row.monitypeCode })[0])
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
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法

.guardianshipConfig {
  display: flex;
  flex: 0%;
  background: #fff;
  height: 100%;
  padding-bottom: 15px;

  .ICUWard {
    width: 26%;
    padding: 10px 10px 0 10px;
    border-right: 2px solid rgba(203, 215, 238, 0.3);
    margin-right: 10px;
  }

  .functionalModule {
    width: 14%;
    height: 100%;
    padding-top: 10px;
    border-right: 2px solid rgba(203, 215, 238, 0.3);
    padding-right: 10px;
    margin-right: 10px;
  }

  .monitoringClassification {
    width: 25%;
    height: 100%;
    padding-top: 10px;
    border-right: 2px solid rgba(203, 215, 238, 0.3);
    padding-right: 10px;
    margin-right: 10px;
  }

  .guardianshipItems {
    width: calc(33% - 6px);
    padding-top: 10px;
    padding-right: 10px;

    .time-select {
      width: 100%;
    }

    ::v-deep.el-input__inner {
      text-align: center;
    }
  }

  .itemsContainer {
    height: 100%;

    .itemsTable {
      height: calc(100% - 84px);

      ::v-deep.el-table {
        width: 100%;
      }
    }
  }
}
</style>
