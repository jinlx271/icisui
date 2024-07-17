<!-- 病床管理 -->
<template>
  <div class="patient-monitor-config-container">
    <!-- 功能模块 -->
    <el-row style="width: 100%; height: 100% ">
      <el-col :span="pagePartsList[0].width" style="height:100%">
        <div class="left">
          <el-container style="height:100%">
            <el-header class="elHeader1">
              <div>
                <i class="iconBlue"></i>
                <span>{{ pagePartsList[0].name }}</span>
              </div>
            </el-header>
            <el-container style="height:calc(100% - 32px)">
              <icu-region :defaultPermi="['configuration:basicSettings:patientMonitorConfig']"
                :defaultRegion="defaultRegion" :module="'patientMonitorConfig'"
                @defaultRegionChange="defaultRegionChange"></icu-region>
            </el-container>
          </el-container>
        </div>
      </el-col>
      <el-col :span="pagePartsList[1].width" style="height:100%">
        <!-- ICU病区 -->
        <div class="right">
          <el-container style="height:calc(100% - 15px)">
            <el-header>
              <div>
                <i class="iconBlue"></i>
                <span>{{ pagePartsList[1].name }}</span>
              </div>
            </el-header>
            <el-container style="height:calc(100% - 42px)">
              <el-header class="elHeader3">
                <div></div>
                <div class="headerRight">
                  <!-- <el-button class="queryButton" type="primary" @click.native.prevent="selectRegion(defaultRegion)" size="small">查询</el-button> -->
                  <el-button v-hasPermi="['configuration:basicSettings:patientMonitorConfig']" class="queryButton"
                    type="primary" :disabled="moniitem_List.length == ICIS_DICT_PATIENT_MONITORING.length" @click.native.prevent="addDictItem" size="small">添加配置项</el-button>
                </div>
              </el-header>
              <el-table
                @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
                ref="tableData" :data="tableData" height="calc(100% - 42px)" row-key="moniitemCode" highlight-current-row
                fit border :key="tableKey">
                <v-table-column label="监护项编码" key="moniitemCode" align="center" width="150px">
                  <template slot-scope="scope">
                    <span>{{ scope.row.moniitemCode }}</span>
                  </template>
                </v-table-column>
                <v-table-column label="监护项名称" key="moniitemName" align="center" width="150px">
                  <template slot-scope="scope">
                    <el-select v-if="scope.row.isCreate" @change="seleceChangeFn(false, scope.row, scope.$index)"
                      v-model="scope.row.moniitemCode" placeholder="请选择" clearable filterable
                      :disabled="!scope.row.isEdit">
                      <el-option v-for="(option) in ICIS_DICT_PATIENT_MONITORING" :key="option.dictCode"
                        :label="option.dictName + '(' + option.dictCode + ')'" :value="option.dictCode"
                        :forceHide="option.statusDict != 1 || moniitem_List.includes(option.dictCode)">
                        <span style="float: left">{{ option.dictName }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ option.dictCode }}</span>
                      </el-option>
                    </el-select>
                    <span v-else>{{ scope.row.moniitemName }}</span>
                  </template>
                </v-table-column>
                <v-table-column label="监护项简称" align="center">
                  <template slot-scope="scope">
                    <el-input v-if="scope.row.isEdit" v-model="scope.row.moniitemAbbr"></el-input>
                    <span v-else>{{ scope.row.moniitemAbbr }}</span>
                  </template>
                </v-table-column>
                <v-table-column label="监护项说明" key="moniitemDesc" align="center">
                  <template slot-scope="scope">
                    <el-input v-if="scope.row.isEdit" v-model="scope.row.moniitemDesc"></el-input>
                    <span v-else>{{ scope.row.moniitemDesc }}</span>
                  </template>
                </v-table-column>
                <v-table-column label="颜色" key="colorDict" align="center" width="150px">
                  <template slot-scope="scope">
                    <el-color-picker :disabled="!scope.row.isEdit" v-model="scope.row.colorDict"></el-color-picker>
                  </template>
                </v-table-column>
                <v-table-column label="排序" key="sortNo" align="center">
                  <template slot-scope="scope">
                    <el-input type="number" v-if="scope.row.isEdit || scope.row.isCreate" v-model="scope.row.sortNo"
                      placeholder="请输入" :min="0" :step="1" max="9999"></el-input>
                    <span v-else>{{ scope.row.sortNo }}</span>
                  </template>
                </v-table-column>
                <v-table-column label="操作" align="center" fixed="right">
                  <template slot-scope="scope">
                    <el-button v-hasPermi="['configuration:basicSettings:patientMonitorConfig']" v-if="!scope.row.isEdit"
                      type="text" @click.native.prevent="updateItemRow(scope.row, scope.$index)">修改</el-button>
                    <el-button v-hasPermi="['configuration:basicSettings:patientMonitorConfig']" type="text"
                      v-if="scope.row.isEdit === true"
                      @click.native.prevent="cancelItemRow(scope.$index, scope.row)">取消</el-button>
                    <el-button v-hasPermi="['configuration:basicSettings:patientMonitorConfig']" type="text"
                      v-if="scope.row.isEdit === true" @click.native.prevent="saveItemRow(scope.row)">保存</el-button>
                    <el-button v-hasPermi="['configuration:basicSettings:patientMonitorConfig']" type="text"
                      v-if="!scope.row.isCreate" style="color:red"
                      @click.native.prevent="deleteItemRow(scope.row)">删除</el-button>
                  </template>
                </v-table-column>
              </el-table>
            </el-container>
          </el-container>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { filterArrValue } from '@/utils/utils'
import { mapGetters } from 'vuex' // 存储方式
import {
  moniitem_findAllWithPage,
  patientMonitoring_delete,
  patientMonitoring_edit,
  patientMonitoring_findWithPage,
  patientMonitoring_insert

} from '@/api/configuration'

import _ from 'lodash'
import icuRegion from '../basicSettings/components/icuRegion.vue'
export default {
  name: 'OutzoneRule',
  components: {

    icuRegion
  },
  data: function () {
    return {
      statusDict: '',
      // 页面布局左右布局 包括左中右多列布局
      // width 按照栅格布局每个部分占比el-col  name 头部标题
      moniitemBindList: [], // 出区规则中绑定的数据
      searchKey: '',
      pagePartsList: [
        {
          width: 5,
          name: 'ICU病区'
        },
        {
          width: 19,
          name: '患者监控配置'
        }
      ],
      loading: false,
      defaultRegion: '',
      // 页面表格列表数据
      tableData: [

      ],
      tableDataModule: [], //
      currItem: [], // 当前编辑数据
      totolCount: 0,
      pageSize: 10,
      pageNum: 1,
      tableKey: '',
      ICIS_DICT_PATIENT_MONITORING: []
    }
  },
  props: {},
  watch: {},
  computed: {
    ...mapGetters(['currentUserWard']),
    moniitem_List() {
      const selectedMoniitemCodeList = _.map(this.tableData, 'moniitemCode')
      const filterMoniitemList = this.ICIS_DICT_PATIENT_MONITORING.filter(item => selectedMoniitemCodeList.includes(item.dictCode))
      return _.map(filterMoniitemList, 'dictCode')
    }
  },
  created() {
    this.defaultRegion = this.currentUserWard.wardCode
    this.init()
  },
  mounted() { },
  methods: {
    filterArrValue,
    seleceChangeFn: async function (e, row, index) {
      if (e === false) { // 收起 关闭时
        const res = await moniitem_findAllWithPage({ 'searchKey': row.moniitemCode, 'contentTypeDict': '', 'dataSourceDict': '', 'pageNum': 1, 'pageSize': 100 })
        const filterRe = res.data.result
        if (filterRe.length > 0) {
          this.tableData[index].moniitemAbbr = filterRe[0].moniitemAbbr || '' // 带出对应的监护项简称
          this.tableData[index].moniitemCode = filterRe[0].moniitemCode || '' // 带出对应的监护项编码
          this.tableData[index].moniitemDesc = filterRe[0].moniitemDesc || '' // 带出对应的监护项说明
          this.tableKey = new Date().getTime()
        }
      } else { // 展开时

      }
    },
    async searchMoniitem(e) {
      const res = await moniitem_findAllWithPage({ 'searchKey': e, 'contentTypeDict': '', 'dataSourceDict': '', 'pageNum': 1, 'pageSize': 100 })
      this.moniitem_List = res.data.result
    },
    async init() {
      const batchObj = await this.$batchGetDictItemList(['ICIS_DICT_PATIENT_MONITORING'])
      this.ICIS_DICT_PATIENT_MONITORING = batchObj['ICIS_DICT_PATIENT_MONITORING']
      this.selectRegion(this.defaultRegion)
    },
    // 保存数据
    async saveItemRow(row, module) {
      if (!row.moniitemCode) {
        this.$message({
          type: 'error',
          message: '监护项编码，达标类型为必填项'
        })
        return
      }

      const query = JSON.parse(JSON.stringify(row))
      delete query.isCreate
      delete query.isEdit
      const moniitem = this.ICIS_DICT_PATIENT_MONITORING.find(item => item.dictCode == row.moniitemCode)
      if (moniitem) query.moniitemName = moniitem.dictName
      const promise = row.isCreate ? patientMonitoring_insert(query) : patientMonitoring_edit(query)
      promise.then(res => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: row.isCreate ? '添加成功' : '保存成功'
          })
          this.selectRegion(this.defaultRegion)
        }
      })
      promise.catch(res => {
        this.selectRegion(this.defaultRegion)
      })
    },
    // 删除数据
    deleteItemRow(row) {
      this.$confirm('您确定要删除吗？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        patientMonitoring_delete(row).then(res => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.selectRegion(this.defaultRegion)
          }
        })
      })
    },
    debounceSearch() {
      this.debounceSearchSymbol = this.debounceSearchSymbol ? this.debounceSearchSymbol : _.debounce(function () {
        this.pageNum = 1
        this.selectRegion(this.defaultRegion)
      }, 200)
      this.debounceSearchSymbol()
    },
    selectRegion(wardCode) {
      this.getDataList(wardCode)
    },
    /**
     * 获取当前病区 出区规则列表
     */
    getDataList(wardCode) {
      this.loading = true
      const query = {
        wardCode: wardCode,
        pageNum: this.pageNum,
        pageSize: 10,
        searchKey: this.searchKey
      }
      patientMonitoring_findWithPage(query).then(async res => {
        const list = res.data.result
        Promise.all(list).then((re) => {
          this.tableData = re
          this.tableKey = new Date().getTime()
        })

        this.totolCount = res.data.totolCount
      })
    },
    defaultRegionChange(defaultRegion) {
      this.defaultRegion = defaultRegion
      if (defaultRegion === '') {
        this.tableData = []
      } else {
        if (this.timer) {
          clearInterval(this.timer)
        }
        if (this.ICIS_DICT_PATIENT_MONITORING.length > 0) {
          this.selectRegion(this.defaultRegion)
        } else {
          this.timer = setInterval(() => {
            this.defaultRegionChange(defaultRegion)
          }, 200)
        }
      }
    },
    // 添加配置项
    addDictItem: async function () {
      if (this.tableData.length > 0) {
        const first = this.tableData[0]
        if (first.isCreate) {
          return
        }
      }
      const row = {
        'isCreate': true,
        'isEdit': true,
        'moniitemCode': '',
        'moniitemDesc': '',
        'moniitemName': '',
        'moniitemAbbr': '',
        'colorDict': '#000',
        'sortNo': '0',
        'wardCode': this.defaultRegion,
        'wardName': this.currentUserWard.wardName
      }
      this.tableData.unshift(row)
    },
    // 修改监护项
    updateItemRow(row, index) {
      this.currItem[index] = { ...row }
      row.isEdit = true
      this.tableData = JSON.parse(JSON.stringify(this.tableData))
    },
    // 取消行的编辑状态
    cancelItemRow(index, row) {
      row.isEdit = false
      if (row.isCreate) {
        this.tableData.splice(index, 1)
      } else {
        this.tableData = JSON.parse(JSON.stringify(this.tableData))
        this.tableData[index] = this.currItem[index]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法

.patient-monitor-config-container {
  display: flex;
  flex: 0%;
  background: #fff;
  height: 100%;

  // 宽度为70的div 用于页面分布
  .left {
    height: 100%;
    position: relative;
    margin-right: 15px;
    padding: 15px;
    border-right: 2px solid rgba(203, 215, 238, 0.3);
  }

  .right {
    height: 100%;
    position: relative;
    padding: 15px 15px 0 0;
  }

  .elHeader3 {
    width: 100%;

  }
}
</style>
