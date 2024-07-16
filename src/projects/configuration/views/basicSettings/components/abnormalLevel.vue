<template>
  <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" ref="tableData" :row-class-name="({row}) => row.statusDict == 0 ? 'disabled' : ''" :data="levelData" height="100%" row-key="exceptionLevel" highlight-current-row fit border @row-dblclick="dbClickRow">
    <v-table-column label="异常级别" key="exceptionLevel" align="center" width="120px">
      <template slot-scope="scope">
        <el-select :value-key="'dictCode'" v-if="scope.row.isEdit&mode==''" v-model="scope.row.exceptionLevel" placeholder="请选择" clearable
        filterable >
          <el-option v-for="(option) in levelList" :key="option.dictId" :label="option.dictName"
                      :value="option.dictCode"  :disabled="option.statusDict==0" ></el-option>
        </el-select>
        <span v-else>{{ filterArrValue(scope.row.exceptionLevel,ICIS_DICT_EXCEPTION_LEVEL,'dictCode','dictName') }}</span>
      </template>
    </v-table-column>
    <v-table-column label="颜色提醒" key="moniitemName" align="center" width="120px">
      <template slot-scope="scope">
        <el-color-picker :disabled="!(scope.row.isEdit&&mode=='')" v-model="scope.row.colorDict"></el-color-picker>
      </template>
    </v-table-column>
    <v-table-column label="声音提醒" key="moniitemDesc" align="center" width="120px">
      <template slot-scope="scope">
        <el-switch :disabled="!scope.row.isEdit" v-model="scope.row.soundEnable" active-value="1" inactive-value="0"></el-switch>
      </template>
    </v-table-column>
    <v-table-column label="选项类异常选项" key="referValues" align="center" >
      <template slot-scope="scope">
        <el-select v-if="tableDataModule.contentTypeDict=='3'||tableDataModule.contentTypeDict=='4'" :multiple="'multiple'" :value-key="'dictCode'"
                    v-model="scope.row.referValues" placeholder="请选择" clearable filterable :disabled="!scope.row.isEdit" @change="changeReferValues">
          <el-option v-for="(option) in tableDataModule.abnormalDict" :key="option.dictId" :label="option.dictName"
                      :value="option.dictCode"  :disabled="option.statusDict==0" :forceHide="option.normalDictFlag=='1'"></el-option>
        </el-select>
      </template>
    </v-table-column>
    <v-table-column label="异常范围最小值" key="minValue" align="center" >
      <template slot-scope="scope">
        <template v-if="tableDataModule.contentTypeDict=='1'">
          <el-input type="number" v-if="scope.row.isEdit" v-model="scope.row.minValue" placeholder="请输入">
          </el-input>
          <span v-else>{{scope.row.minValue}}</span>
        </template>
      </template>
    </v-table-column>
    <v-table-column label="异常范围最大值" key="maxValue" align="center" >
      <template slot-scope="scope">
        <template v-if="tableDataModule.contentTypeDict=='1'">
          <el-input type="number" v-if="scope.row.isEdit" v-model="scope.row.maxValue" placeholder="请输入">
          </el-input>
          <span v-else>{{scope.row.maxValue}}</span>
        </template>
      </template>
    </v-table-column>
    <v-table-column label="操作" align="center" fixed="right" v-if="mode==''">
      <template slot-scope="scope">
        <el-button v-hasPermi="['configuration:basicSettings:warningConfig']" v-if="!scope.row.isEdit" type="text"
                    @click="updateLevelRow(scope.row, scope.$index)">修改</el-button>
        <el-button v-hasPermi="['configuration:basicSettings:warningConfig']" type="text" v-if="scope.row.isEdit===true"
                    @click="cancelLevelRow(scope.$index,scope.row)">取消</el-button>
        <el-button v-hasPermi="['configuration:basicSettings:warningConfig']" type="text" v-if="scope.row.isEdit===true"
                    @click="saveLevelRow(scope.row,scope.$index)">保存</el-button>
        <el-button v-if="!scope.row.isCreate" v-hasPermi="['configuration:basicSettings:warningConfig']" type="text"
                    @click="enableOrDisableLevel(scope.row)" :style="{ color: scope.row.statusDict == 1 ? '#EC0000': '#00AB44' }">
          {{+scope.row.statusDict ? '禁用' : '启用' }}</el-button>
      </template>
    </v-table-column>
  </el-table>
</template>
<script>
import {
  exceptionLevel_findAllLevels,
  exceptionLevel_insert,
  exceptionLevel_edit
} from '@/api/configuration'
import {
  personMoniitem_findPersonExceptionLevels,
  personMoniitem_savePersonExceptionLevels
} from '@/api/patient'
import { intersection } from 'lodash'
import { filterArrValue } from '@/utils/utils' // 存储方式
export default {
  props: {
    moniitemCode: {
      type: String,
      default: ''
    },
    wardCode: {
      type: String,
      default: ''
    },
    wardName: {
      type: String,
      default: ''
    },
    moniitemInfo: {
      type: Object,
      default: () => {}
    },
    mode: {
      type: String,
      default: ''
    },
    icuRecordId: {
      type: String,
      default: ''
    }
  },
  data: function() {
    return {
      levelData: [],
      tableDataModule: {},
      currLevelItem: [],
      ICIS_DICT_EXCEPTION_LEVEL: [],
      levelList: []
    }
  },
  watch: {
    moniitemInfo: function(newValue) {
      this.tableDataModule = { ...newValue }
    },
    moniitemCode: function(newValue) {
      this.getDataList()
    },
    wardCode: function() {
      this.getDataList()
    }
  },
  async created() {
    this.ICIS_DICT_EXCEPTION_LEVEL = await this.$getDictItemList('ICIS_DICT_EXCEPTION_LEVEL')
    this.levelList = [...this.ICIS_DICT_EXCEPTION_LEVEL]
    this.tableDataModule = { ...this.moniitemInfo }
    this.getDataList()
  },
  methods: {
    filterArrValue,
    getDataList() {
      this.currLevelItem = []
      if (this.mode == '') { // 预警设计
        exceptionLevel_findAllLevels({
          wardCode: this.wardCode,
          moniitemCode: this.moniitemCode
        }).then(res => {
          res.data.forEach(item => {
            if (this.tableDataModule.contentTypeDict == '3' || this.tableDataModule.contentTypeDict == '4') {
              item.referValues = item.referValues.length > 0 ? JSON.parse(item.referValues) : []
            }
          })
          const existLevel = res.data.map(item => item.exceptionLevel)
          this.levelList = this.ICIS_DICT_EXCEPTION_LEVEL.filter(item => !existLevel.includes(item.dictCode))

          this.levelData = res.data
        })
      } else { // 个人配置
          const moniitemCodes = []
          moniitemCodes.push(this.moniitemCode)
          personMoniitem_findPersonExceptionLevels({
            wardCode: this.wardCode,
            moniitemCodes: moniitemCodes,
            icuRecordId: this.icuRecordId
          }).then(res => {
            res.data.forEach((item, index) => {
              item.rowIndex = index
              if (this.tableDataModule.contentTypeDict == '3' || this.tableDataModule.contentTypeDict == '4') {
                item.referValues = item.referValues.length > 0 ? JSON.parse(item.referValues) : []
              }
            })
            const existLevel = res.data.map(item => item.exceptionLevel)
            this.levelList = this.ICIS_DICT_EXCEPTION_LEVEL.filter(item => !existLevel.includes(item.dictCode))
            this.levelData = res.data
          })
      }
    },
    /**
     * 添加异常级别数据
     */
    addWarningClass() {
      if (this.levelData.length >= this.ICIS_DICT_EXCEPTION_LEVEL.length) {
        this.$message.info('没有可以添加的异常级别了')
        return
      }
      if (this.levelData.length > 0) {
        const first = this.levelData[0]
        if (first.isCreate) {
          return
        }
      }
      if (!this.tableDataModule.moniitemCode) {
        this.$message.info('请选择监护项')
        return
      }
      const row = {
        'isCreate': true,
        'isEdit': true,
        'statusDict': '1',
        'maxValue': '', // 最大值
        'minValue': '', // 最小值
        'moniitemCode': this.tableDataModule.moniitemCode, // 监护项code
        'exceptionLevel': '', // 异常级别
        'soundEnable': '0', // 是否开启声音提醒
        'colorDict': '', // 颜色提醒
        'referValues': [], // 选项类参考
        'wardCode': this.wardCode, // 对应病区
        'wardName': this.wardName
      }
      this.levelData.unshift(row)
    },
    // 修改监护项
    updateLevelRow(row, index) {
      this.currLevelItem[index] = { ...row }
      row.isEdit = true
      this.levelData = JSON.parse(JSON.stringify(this.levelData))
    },
    // 取消行的编辑状态
    cancelLevelRow(index, row) {
      row.isEdit = false
      if (row.isCreate) {
        this.levelData.splice(index, 1)
      } else {
        this.levelData = JSON.parse(JSON.stringify(this.levelData))
        this.levelData[index] = this.currLevelItem[index]
      }
    },
     // 保存数据
    saveLevelRow(row, index) {
      if (!this.validate(row, index)) {
        return
      }
      // 异常选项不能与参考选项有相同！
      if (this.tableDataModule.contentTypeDict == '1') {
        row.referValues = ''
      } else if (['3', '4'].includes(this.tableDataModule.contentTypeDict)) {
        if (Array.isArray(row.referValues)) {
          row.referValues = JSON.stringify(row.referValues)
        }
      }
      const promise = row.isCreate ? exceptionLevel_insert(row) : exceptionLevel_edit(row)
      promise.then(res => {
        if (res.code == 0) {
          row.isEdit = false
          row.isCreate = false
          this.getDataList()
        }
      })
      promise.catch(res => {
        this.getDataList()
      })
    },
    resetData() {
      this.levelData.forEach(item => {
        item.minValue = ''
        item.maxValue = ''
        item.referValues = '[]'
      })
    },
    /**
     * 需要校验的数据
     * 行号
     * 类型  不传为级别内部的校验 传值为中间范围的校验
     */
    validate(row, index) {
      let flag = true
      // row.referValues = JSON.stringify(row.referValues)
      // row.referValues = row.referValues == '[]' ? '' : row.referValues
      if (row.minValue && row.maxValue && +row.maxValue < +row.minValue) {
        this.$message({
          type: 'error',
          message: '最大值不能小于最小值'
        })
        return false
      }
      if (this.tableDataModule.contentTypeDict == '1' && !row.minValue && !row.maxValue && this.mode == '') {
        this.$message({
          type: 'error',
          message: '请输入最大值，最小值'
        })
        return false
      }

      if ((this.moniitemInfo.contentTypeDict == '4' || this.moniitemInfo.contentTypeDict == '3')) {
        if (index != -1) {
          const reArr = intersection(row.referValues, Array.isArray(this.moniitemInfo.referValues) ? this.moniitemInfo.referValues : JSON.parse(this.moniitemInfo.referValues))
          if (reArr.length > 0) {
            flag = false
          }
        }
        this.levelData.forEach((item, dindex) => {
          if (index != dindex && item.referValues) {
            const reArr = intersection(row.referValues, Array.isArray(item.referValues) ? item.referValues : JSON.parse(item.referValues))
            if (reArr.length > 0) {
              flag = false
            }
          }
        })
        if (!flag) {
          this.$message.error('异常选项不能与参考选项有相同！')
          return flag
        } else {
          return true
        }
      }
      const check = function(arr1, arr2) {
        const min = [Math.min(...arr1), Math.min(...arr2)]
        const max = [Math.max(...arr1), Math.max(...arr2)]
        return Math.max(...min) <= Math.min(...max)
      }
      if (this.moniitemInfo.contentTypeDict == '1') {
        const moniitemValueRange = [this.moniitemInfo.minValue || -Infinity, this.moniitemInfo.maxValue || Infinity]
        if (index != -1 && !(!row.minValue && !row.maxValue) && !(!this.moniitemInfo.minValue && !this.moniitemInfo.maxValue) && check(moniitemValueRange, [row.minValue || -Infinity, row.maxValue || Infinity])) {
            this.$message.error('异常范围不能与数值范围重叠！')
            return false
        }
        this.levelData.forEach((item, dindex) => {
          if (index != dindex && !(!row.minValue && !row.maxValue) && !(!item.minValue && !item.maxValue)) {
            if (check([item.minValue || -Infinity, item.maxValue || Infinity], [row.minValue || -Infinity, row.maxValue || Infinity])) {
                flag = false
            }
          }
        })
        if (!flag) {
          this.$message.error('不同的异常范围内数值有重叠！')
          return false
        } else return true
      }
    },

    enableOrDisableLevel(row) {
      const params = { ...row }
      params.statusDict = row.statusDict == '1' ? '0' : '1'
      params.referValues = JSON.stringify(params.referValues)
      params.referValues = params.referValues == '[]' ? '' : params.referValues
      exceptionLevel_edit(params).then(res => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: +row.statusDict ? '已禁用' : '已启用'
          })
          row.statusDict = row.statusDict == '1' ? '0' : '1'
        }
      })
    },
    /**
     * 双击激活
     */
    dbClickRow(row) {
      if (this.mode == 'personConfig') {
        if (!row.isEdit) {
          row['isEdit'] = true
        } else {
          if (!this.validate(row, row.rowIndex)) {
            return
          } else {
            row.isEdit = false
            row.referValues = JSON.stringify(row.referValues)
          }
          if (this.moniitemInfo.contentTypeDict == '3' || this.moniitemInfo.contentTypeDict == '4') {
            row.referValues = JSON.parse(row.referValues)
          }
        }
        this.levelData = [...this.levelData]
      }
    },
    /**
     * 保存个人配置项目
     */

    savePersonConfig() {
      const list = [...this.levelData]
      let flag = true
      list.forEach((row, index) => {
        row.icuRecordId = this.icuRecordId
        if (!this.validate(row, row.rowIndex)) {
          flag = false
        }
        if (Array.isArray(row.referValues) && (this.moniitemInfo.contentTypeDict == '3' || this.moniitemInfo.contentTypeDict == '4')) {
          row.referValues = JSON.stringify(row.referValues)
        } else if (this.moniitemInfo.contentTypeDict == '1') {
          row.referValues = ''
        }
      })
      if (!flag) return
      personMoniitem_savePersonExceptionLevels(list).then(res => {
        if (res.code == 0) {
          this.$emit('success')
        }
      })
    }
  }

}
</script>
