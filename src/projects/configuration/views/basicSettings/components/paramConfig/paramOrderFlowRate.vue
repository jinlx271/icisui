<!-- 基础参数 -->
<template>
  <div class="paramOrderFlowRate">
    <div class="flex flex-between">
      <el-form-item label="参数值" prop="paramValueCopy">
      </el-form-item>
      <!-- <div>
        <el-button type="primary" @click="addLine">新增</el-button>
      </div> -->
    </div>
    <div style="height:calc(100% - 60px)">
      <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" ref="table" border
                :data="paramValueCopy" row-key="id" height="100%">
        <v-table-column prop="wardCode" label="医嘱分类">
          <template slot-scope="scope">
            <!-- <el-select style="width:100%" v-model="scope.row.orderUsageType" >
              <el-option v-for="(item) in orderTypeList" :key="item.dictCode" :label="item.dictName" :value="item.dictCode"></el-option>
            </el-select> -->
            <span >{{filterArrValue(scope.row.orderUsageType,orderTypeList,'dictCode','dictName')||''}}</span>
          </template>
        </v-table-column>
        <v-table-column prop="moni" label="默认流速方式">
          <template slot-scope="scope">
             <el-select style="width:100%" v-model="scope.row.rateMethodDict" placeholder="请选择" @change="reset($event,scope.row)" v-if="scope.row.isEdit">
              <el-option v-for="(item) in rateMethod" :key="item.dictCode" :label="item.dictName" :value="item.dictCode"></el-option>
            </el-select>
            <span v-else>{{filterArrValue(scope.row.rateMethodDict,rateMethod,'dictCode','dictName')||''}}</span>
          </template>
        </v-table-column>
        <v-table-column prop="moni" label="固定流速（ml/h）">
          <template slot-scope="scope">
            <el-input v-model="scope.row.fixedRate" placeholder="请输入" :disabled="scope.row.rateMethodDict!='1'"  v-if="scope.row.isEdit" v-only-num :maxlength="10"></el-input>
            <span v-else> {{scope.row.fixedRate}}</span>
          </template>
        </v-table-column>
        <v-table-column prop="moni" label="固定时间（小时）">
          <template slot-scope="scope">
             <el-input v-model="scope.row.fixedHours" placeholder="请输入" :disabled="scope.row.rateMethodDict!='2'" v-if="scope.row.isEdit"  v-only-num  :maxlength="10"></el-input>
             <span v-else> {{scope.row.fixedHours}}</span>
          </template>
        </v-table-column>
        <v-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button v-if="!scope.row.isEdit" type="text" @click="updateItemRow(scope.row,scope.$index)">修改</el-button>
            <el-button type="text" v-if="scope.row.isEdit" @click="cancelItemRow(scope.row, scope.$index)">取消</el-button>
            <el-button type="text" v-if="scope.row.isEdit" @click="saveItemRow(scope.row)">保存</el-button>
          </template>
        </v-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { filterArrValue } from '@/utils/utils'
export default {
  name: 'ParamConfigOrderRelativeFluid',
  components: {},
  data: function () {
    return {
     rateMethod: [
       { dictCode: '0', dictName: '无' },
       { dictCode: '1', dictName: '固定流速' },
       { dictCode: '2', dictName: '固定时间' }

     ],
     curRow: {},
     orderTypeList: [],
     paramValueOri: [],
     paramValueCopy: []
    }
  },
  props: {
    paramValue: {}
  },
  watch: {
    string: {
      handler: function (n) {
        try {
          const paramValueCopy = JSON.parse(JSON.parse(n))
          this.paramValueCopy = paramValueCopy
        } catch (error) {
          //
        }
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    string() {
      return JSON.stringify(this.paramValue) || '[]'
    }
  },
  created: async function () {
    const { ICIS_DICT_ORDER_USAGE_TYPE } = await this.$batchGetDictItemList(['ICIS_DICT_ORDER_USAGE_TYPE'])
    this.orderTypeList = ICIS_DICT_ORDER_USAGE_TYPE
    this.paramValueOri = this.orderTypeList.map(item => {
      return {
        isEdit: false,
        orderUsageType: item.dictCode,
        rateMethodDict: '0',
        fixedRate: null,
        fixedHours: null
      }
    })

    this.paramValueCopy = this.paramValueOri.map(v => {
      const filterRe = this.paramValueCopy.filter(item => item.orderUsageType == v.orderUsageType)
      if (filterRe.length > 0) {
        v = filterRe[0]
      }
      return v
    })
  },
  mounted() { },
  methods: {
    filterArrValue,
    // 修改
    updateItemRow(row, index) {
      this.curRow[index] = { ...row }
      row.isEdit = true
      row.isCreate = false
      this.paramValueCopy = JSON.parse(JSON.stringify(this.paramValueCopy))
    },
    // 取消行的编辑状态
    cancelItemRow(row, index) {
        row.isEdit = false
        this.paramValueCopy = JSON.parse(JSON.stringify(this.paramValueCopy))
        this.paramValueCopy[index] = this.curRow[index]
    },
    // 保存
    saveItemRow(row) {
      row.isEdit = false
    },
    reset(value, row) {
      if (value == '0') {
        row.fixedRate = ''
        row.fixedHours = ''
      } else if (value == '1') {
        row.fixedHours = ''
      } else if (value == '2') {
        row.fixedRate = ''
      }
    },
    change() {
      return new Promise((resolve, reject) => {
        this.$emit('update:paramValue', JSON.stringify(this.paramValueCopy.map(v => {
          delete v.isEdit
          delete v.isCreate
          return v
        })))
        resolve()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.paramOrderFlowRate {
  height: 300px;
}
::v-deep .el-form-item__label {
  padding: 0;
  width: 118px !important;
  margin-right: 12px;
}
</style>
