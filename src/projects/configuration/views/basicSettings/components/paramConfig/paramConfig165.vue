<!-- 基础参数 -->
<template>
  <div class="paramConfig141">
    <div class="flex flex-between">
      <el-form-item label="参数值" prop="paramValueCopy"></el-form-item>
      <div>
        <el-button type="primary" @click="addLine">新增</el-button>
      </div>
    </div>
    <div style="height:calc(100% - 60px)">
      <el-table
        @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
        ref="table" border :data="paramValueCopy" row-key="id" height="100%">
        <v-table-column prop="moni" label="病区" width="200px" align="center">
          <template slot-scope="scope">
            <el-select filterable clearable v-model="scope.row.wardCode" placeholder="请选择" style="width:100%"
              @change="selectOrderType($event, scope.row)">
              <el-option v-for="item in userWardList" :key="item.dictCode" :forceHide="item.statusDict != 1"
                :label="item.wardName" :value="item.wardCode">{{ item.wardName + '(' +
                  item.wardCode + ')' }}</el-option>
            </el-select>
          </template>
        </v-table-column>
        <v-table-column prop="moni" label="范围" width="100px" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.shiftCode" placeholder="请选择" style="width:100%"
              @change="handleChangeShift(scope.row)" @visible-change="handleVisibleShift($event, scope.row)">
              <el-option v-for="item in scope.row.shiftList" :key="item.shiftCode" :disabled="item.isSelect"
                :label="item.shiftAbbr || item.shiftName" :value="item.shiftCode"></el-option>
            </el-select>
          </template>
        </v-table-column>
        <v-table-column prop="moni" label="参数值" align="center">
          <template slot-scope="scope">
            <div class="flex">
              <el-select v-model="scope.row.rangeLeftCode" placeholder="请选择" style="max-width:80px"
                @change="handleChangeRangLeft(scope.row)">
                <el-option v-for="item in rangeLeftList" :key="item.dictCode" :label="item.dictName"
                  :value="item.dictCode"></el-option>
              </el-select>
              <el-time-picker placeholder="请选择开始时间" v-model="scope.row.startTimePickerValue" value-format="HH:mm:ss"
                format="HH:mm:ss"></el-time-picker>
              <span style="min-width: 20px;">-</span>
              <el-time-picker placeholder="请选择结束时间" v-model="scope.row.endTimePickerValue" value-format="HH:mm:ss"
                format="HH:mm:ss"></el-time-picker>
              <el-select v-model="scope.row.rangeRightCode" placeholder="请选择" style="max-width:80px"
                @change="handleChangeRangRight(scope.row)">
                <el-option v-for="item in rangeRightList" :key="item.dictCode" :label="item.dictName"
                  :value="item.dictCode"></el-option>
              </el-select>
            </div>
          </template>
        </v-table-column>
        <v-table-column label="操作" align="center" width="80px">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="deleteFn(scope.$index)">删除</el-button>
          </template>
        </v-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { map } from 'lodash'
import { mapGetters } from 'vuex'
import {
  findShiftWithPage
} from '@/api/configuration'
export default {
  name: 'ParamConfig141',
  components: {},
  data: function () {
    return {
      paramValueCopy: [],
      rangeLeftList: [
        {
          dictCode: '0',
          dictName: '【'
        },
        {
          dictCode: '1',
          dictName: '（'
        }
      ],
      rangeRightList: [
        {
          dictCode: '0',
          dictName: '】'
        },
        {
          dictCode: '1',
          dictName: '）'
        }
      ]
    }
  },
  props: {
    paramValue: {}
  },
  watch: {
    stringAddList: {
      handler: function (n) {
        try {
          const { string } = n
          const paramValueCopy = JSON.parse(JSON.parse(string))
          this.paramValueCopy = paramValueCopy.map(v => {
            return v
          })
        } catch (error) {
          //
        }
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    ...mapGetters(['userWardList']),
    string() {
      return JSON.stringify(this.paramValue)
    },
    stringAddList() {
      const { string } = this
      return { string }
    }
  },
  created: async function () { },
  mounted() { },
  methods: {
    change() {
      return new Promise((resolve, reject) => {
        if (this.paramValueCopy.filter(v => !v.wardCode).length > 0) {
          this.$message.error('请选择病区!')
          reject()
          return
        }
        if (this.paramValueCopy.filter(v => !v.shiftCode).length > 0) {
          this.$message.error('请选择班次范围!')
          reject()
          return
        }
        if (this.paramValueCopy.filter(v => !v.startTimePickerValue || !v.endTimePickerValue).length > 0) {
          this.$message.error('请输入参数值!')
          reject()
          return
        }
        this.paramValueCopy.map(item => {
          const curDate = this.$dayjs().format('YYYY-MM-DD')
          item.startTime = item.startTimePickerValue
          item.endTime = item.endTimePickerValue
          if (item.rangeLeftCode == 1) {
            item.startTime = this.$dayjs(`${curDate} ${item.startTimePickerValue}`).add(1, 'second').format('HH:mm:ss')
          }
          if (item.rangeRightCode == 1) {
            item.endTime = this.$dayjs(`${curDate} ${item.endTimePickerValue}`).subtract(1, 'second').format('HH:mm:ss')
          }
          return item
        })
        this.paramValueCopy.sort((a, b) => a.sortNo - b.sortNo)
        this.$emit('update:paramValue', JSON.stringify(this.paramValueCopy))
        resolve()
      })
    },
    deleteFn(index) {
      this.paramValueCopy.splice(index, 1)
    },
    addLine() {
      this.paramValueCopy.unshift({ wardCode: '', shiftCode: '', shiftName: '', sortNo: '', startTimePickerValue: '', endTimePickerValue: '', startTime: '', endTime: '', rangeLeftCode: '0', rangeLeftName: '【', rangeRightCode: '1', rangeRightName: '）', shiftList: [] })
    },
    /**
     * 选择医嘱分类
     * @param {} e
     * @param {*} row
     */
    async selectOrderType(e, row) {
      row.shiftCode = ''
      row.startTimePickerValue = ''
      row.endTimePickerValue = ''
      row.startTime = ''
      row.endTime = ''
      row.shiftList = []
      row.shiftList = await this.getShiftList(row.wardCode)
    },
    handleChangeShift(row) {
      const shift = row.shiftList.find(item => item.shiftCode == row.shiftCode)
      if (shift) {
        row.sortNo = +`${row.wardCode}${shift.sortNo}`
        row.shiftName = shift.shiftAbbr || shift.shiftName
        row.startTimePickerValue = shift.startTime
        row.endTimePickerValue = shift.endTime
      } else {
        row.sortNo = ''
        row.shiftName = ''
        row.startTimePickerValue = ''
        row.endTimePickerValue = ''
      }
    },
    // 获取班次
    getShiftList(wardCode) {
      return new Promise((resolve, reject) => {
        const query = {
          wardCode,
          pageNum: 1,
          pageSize: 10000
        }
        findShiftWithPage(query).then(res => {
          if (res.code === 0 && res.data.result.length > 0) {
            const shiftList = res.data.result
            shiftList.unshift({
              shiftName: '全班次',
              sortNo: 0,
              startTime: shiftList[0].startTime,
              endTime: shiftList[shiftList.length - 1].endTime,
              shiftCode: 'D'
            })
            resolve(shiftList)
          } else {
            reject([])
          }
        })
      })
    },
    handleVisibleShift(e, row) {
      row.shiftList = row.shiftList.map(item => {
        const curWardConfig = this.paramValueCopy.filter(item => item.wardCode == row.wardCode && item.shiftCode)
        const selectedShiftArr = map(curWardConfig, 'shiftCode')
        this.$set(item, 'isSelect', selectedShiftArr.includes(item.shiftCode))
        return item
      })
    },
    handleChangeRangLeft(row) {
      const rangeLeft = this.rangeLeftList.find(item => item.dictCode == row.rangeLeftCode)
      row.rangeLeftName = rangeLeft.dictName
    },
    handleChangeRangRight(row) {
      const rangeRight = this.rangeRightList.find(item => item.dictCode == row.rangeRightCode)
      row.rangeRightName = rangeRight.dictName
    }
  }
}
</script>
<style lang="scss">
.el-dialog.param-config-dialog {
  .el-dialog__body .el-date-editor .el-input__inner {
    padding-left: 20px;
  }

  .el-input__prefix {
    left: 0;
    right: inherit;
  }
}
</style>
<style lang="scss" scoped>
.paramConfig141 {
  height: 300px;
}

::v-deep .el-form-item__label {
  padding: 0;
  width: 118px !important;
  margin-right: 12px;
}
</style>
