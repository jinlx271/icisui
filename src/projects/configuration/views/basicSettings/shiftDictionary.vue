<!-- 班次字典 -->
<template>
  <el-row id="shiftDictionary" style="width: 100%; height: 100% ">
    <el-col :span="6">
      <div class="left">
        <el-container style="height:100%">
          <el-header class="elHeader1">
            <div>
              <i class="iconBlue"></i>
              <span>ICU病区</span>
            </div>
          </el-header>
          <el-container style="height:calc(100% - 42px)">
            <icu-region :defaultRegion="defaultRegion" :module="'shift'" :defaultPermi="['configuration:basicSettings:shiftConfig']"
                        @defaultRegionChange="defaultRegionChange"></icu-region>
          </el-container>
        </el-container>
      </div>
    </el-col>
    <el-col :span="18">
      <el-container class="shiftDictionary" >
        <el-header>
          <div>
            <i class="iconBlue"></i>
            <span>班次列表</span>
          </div>
          <el-button v-hasPermi="['configuration:basicSettings:shiftConfig']" class="shiftDictionary_addButtonFC" size="small" type="primary"
                     @click="addButtonFC">新增班次</el-button>
        </el-header>
        <el-main style="height:calc(100% - 42px)">
          <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" height="100%" border class="shiftDictionary_table" :data="tableDataOne" fit ref="tableDataOne" style="width: 100%;"
                    element-loading-text="加载中" v-loading="loading">
            <v-table-column prop="sortNo" label="序号"></v-table-column>
            <v-table-column prop="shiftCode" label="班次编码"></v-table-column>
            <v-table-column prop="shiftName" label="班次"></v-table-column>
            <v-table-column label="班次时间段">
              <template slot-scope="scope">
                {{scope.row.startTime}}-{{scope.row.endTime}}
              </template>
            </v-table-column>
            <v-table-column prop="shiftAbbr" label="班次缩写"></v-table-column>
            <v-table-column label="操作">
              <template slot-scope="scope">
                <el-button v-hasPermi="['configuration:basicSettings:shiftConfig']" @click.native.prevent="editRow(scope.$index, scope.row)"
                           type="text" size="small">修改</el-button>
                <el-button v-hasPermi="['configuration:basicSettings:shiftConfig']" style="color:red" @click.native.prevent="deleteRow(scope.$index, scope.row)"
                           type="text" size="small">删除</el-button>
              </template>
            </v-table-column>
          </el-table>
          <el-dialog v-el-drag-dialog :title="dialogTitle" :visible.sync="dialogVisible" :before-close="handleClose" :close-on-click-modal="false"
                     :close-on-press-escape="false">
            <el-form ref="form" :model="form" label-width="80px">
              <el-form-item label="序号" prop="sortNo" :rules="{
      required: true, message: '序号不能为空', trigger: 'blur'
    }">
                <el-input-number v-model="form.sortNo" placeholder="请输入" :min="1" :max="100"></el-input-number>
              </el-form-item>
              <el-form-item label="班次编码" prop="shiftCode" :rules="{
      required: true, message: '班次编码不能为空', trigger: 'blur'
    }">
                <span v-if="insertOrModify == 'modify'">{{form.shiftCode}}</span>
                <el-input v-else v-model="form.shiftCode" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="班次名称" prop="shiftName" :rules="{
      required: true, message: '班次名称不能为空', trigger: 'blur'
    }">
                <el-input v-model="form.shiftName" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="班次简称">
                <el-input v-model="form.shiftAbbr" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="开始时间" prop="startTime" :rules="{
      required: true, message: '开始时间不能为空', trigger: 'blur'
    }">
                <wn-time-picker value-format="HH:mm:ss" v-model="form.startTime" :picker-options="{
      selectableRange: '00:00:00 - 23:59:59'
    }" placeholder="请选择时间"></wn-time-picker>
              </el-form-item>
              <el-form-item label="结束时间" prop="endTime" :rules="{
      required: true, message: '结束时间不能为空', trigger: 'blur'
    }">
                <wn-time-picker value-format="HH:mm:ss" v-model="form.endTime" :picker-options="{
      selectableRange: '00:00:00 - 23:59:59'
    }" placeholder="请选择时间"></wn-time-picker>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="handleClose">取消</el-button>
              <el-button type="primary" @click="confirmHandlerShift">保存</el-button>
            </span>
          </el-dialog>
        </el-main>
      </el-container>
    </el-col>
  </el-row>

</template>
<script>
import {
  insertShift,
  editShift,
  deleteShift,
  findShiftWithPage
} from '@/api/configuration'

import icuRegion from '../basicSettings/components/icuRegion.vue'
import { mapGetters } from 'vuex'
import { timeToTimestamp } from '@/utils/utils'
export default {
  name: 'ShiftDictionary',
  components: { icuRegion },
  props: {},
  data() {
    return {
      defaultRegion: '',
      userWardList: [],
      loading: false, // 表格loading
      dialogVisible: false, // 弹框的显示隐藏
      tableDataOne: [

      ],
      dialogTitle: '',
      form: {
        shiftName: '',
        shiftCode: '',
        shiftAbbr: '',
        startTime: '',
        endTime: '',
        sortNo: 1
      },
      dataForm: {
        pageSize: 1000,
        pageNum: 1
      },
      insertOrModify: ''
    }
  },
  watch: {},
  computed: { ...mapGetters(['currentUserWard']) },
  beforeCreated() { },
  created() {
    this.defaultRegion = this.currentUserWard.wardCode
  },
  beforeMount() { },
  mounted() {

  },
  beforeUpdate() { },
  update() { },
  beforeDestroy() { },
  destroyed() { },
  methods: {
    selectRegion(wardCode) {
      const query = this.dataForm
      query.wardCode = wardCode
      findShiftWithPage(query).then(res => {
        if (res.code == 0) {
          this.tableDataOne = res.data.result
          this.dialogVisible = false
        }
      })
    },
    defaultRegionChange(defaultRegion, userWardList) {
      this.defaultRegion = defaultRegion
      this.userWardList = userWardList || this.userWardList
      this.selectRegion(this.defaultRegion)
    },
    /**
     * 新增班次
     */
    addButtonFC() {
      this.form = {
        sortNo: Math.max(...this.tableDataOne.map(v => v.sortNo)) + 1
      }
      this.dialogVisible = true
      this.dialogTitle = '新增班次'
      this.insertOrModify = 'insert'

      //   this.$nextTick(() => {
      //     this.$refs.form.resetFields()
      //   })
    },
    /**
     * 修改
     */
    editRow(index, row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
      this.dialogTitle = '修改班次'
      this.insertOrModify = 'modify'
    },
    /**
     * 删除
     */
    deleteRow(index, row) {
      this.$confirm('您确定要删除吗？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const query = { shiftCode: row.shiftCode, wardCode: this.defaultRegion }
        deleteShift(query).then(res => {
          this.selectRegion(this.defaultRegion)
        })
      })
    },
    /**
     * 关闭弹框
     */
    handleClose() {
      this.dialogVisible = false
    },
    translateTime(starttime, endtime) {
      const compareTime = timeToTimestamp(endtime) - timeToTimestamp(starttime)
      let StartTime // eslint-disable-line no-unused-vars
      let EndTime // eslint-disable-line no-unused-vars
      let StartTimeP // eslint-disable-line no-unused-vars
      let EndTimeP // eslint-disable-line no-unused-vars
      const curDay = new Date(this.$dayjs(new Date()).format('YYYY-MM-DD')).getTime()
      //   const addOneDay = curDay + 3600000 * 24
      if (compareTime > 0) {
        StartTime = curDay + timeToTimestamp(starttime) * 1000
        EndTime = curDay + timeToTimestamp(endtime) * 1000
      } else {
        StartTime = curDay + timeToTimestamp(starttime) * 1000
        EndTime = curDay + timeToTimestamp('23:59:59') * 1000
        StartTimeP = curDay + timeToTimestamp('00:00:00') * 1000
        EndTimeP = curDay + timeToTimestamp(endtime) * 1000
      }
      return { StartTime, EndTime, StartTimeP, EndTimeP }
    },
    // 确定操作班次
    confirmHandlerShift() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const query = this.form
          if (query.shiftCode == 'D' || query.shiftCode == 'd') {
            this.$message.warning(`班次编码无法设置'D'！`)
            return
          }
          query.wardCode = this.defaultRegion
          const compareItem = this.userWardList.filter(item => item.wardCode === this.defaultRegion)
          if (compareItem.length != 1) this.$message.warning(`病区设置错误！`)
          query.wardName = compareItem[0].wardName
          // 判断交集
          const { StartTime: curS, EndTime: curE, StartTimeP: curSP, EndTimeP: curEP } = this.translateTime(this.form.startTime, this.form.endTime)
          const tableDataOne = this.tableDataOne.filter(v => v.shiftCode != this.form.shiftCode)
          let intersect = false
          for (let index = 0; index < tableDataOne.length; index++) {
            const element = tableDataOne[index]
            const { StartTime: itemS, EndTime: itemE, StartTimeP, EndTimeP } = this.translateTime(element.startTime, element.endTime)
            if (itemS < curE && itemE > curS || !isNaN(curSP) && !isNaN(curEP) && itemS < curEP && itemE > curSP) {
              intersect = true
              break
            }
            if (!isNaN(StartTimeP) && !isNaN(EndTimeP) && (itemS < curE && itemE > curS || !isNaN(curSP) && !isNaN(curEP) && itemS < curEP && itemE > curSP)) {
              intersect = true
              break
            }
          }
          if (intersect) {
            this.$message.warning(`时间有重叠！`)
            return
          }
          if (this.insertOrModify == 'insert') {
            insertShift(query).then(res => {
              this.selectRegion(this.defaultRegion)
            })
          } else {
            editShift(query).then(res => {
              this.selectRegion(this.defaultRegion)
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
@import '@/styles/config-common.scss'; // 公共css方法

#shiftDictionary {
  display: flex;
  flex: 0%;
  background: #fff;
  height: 100%;
  padding: 15px;
  .left {
    height: 100%;
    position: relative;
    margin-right: 10px;
    padding-right: 10px;
    border-right: 2px solid rgba(203, 215, 238, 0.3);
  }
  .shiftDictionary {
    background: #ffffff;
    height: 100%;
    overflow: auto;
  }
}
</style>
