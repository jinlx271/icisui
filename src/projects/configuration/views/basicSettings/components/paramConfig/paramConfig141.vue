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
        <v-table-column prop="moni" label="医嘱分类">
          <template slot-scope="scope">
            <el-select filterable clearable v-model="scope.row.orderCode" placeholder="请选择" style="width:100%"
              @change="selectOrderType($event, scope.row)">
              <el-option v-for="item in orderUsageTypeFilterList" :key="item.dictCode" :disabled="item.isSelect"
                :forceHide="item.statusDict != 1" :label="item.dictName" :value="item.dictCode">{{ item.dictName + '(' +
                  item.dictCode + ')' }}</el-option>
            </el-select>
          </template>
        </v-table-column>
        <v-table-column prop="moni" label="医嘱执行操作">
          <template slot-scope="scope">
            <el-select filterable clearable multiple v-model="scope.row.action" placeholder="请选择" style="width:100%">
              <el-option v-for="item in orderPlanActionList" :key="item.dictCode" :label="item.dictName"
                :value="item.dictCode"></el-option>
            </el-select>
          </template>
        </v-table-column>
        <v-table-column label="操作" align="center">
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
export default {
  name: 'ParamConfig141',
  components: {},
  data: function () {
    return {
      orderUsageTypeList: [],
      orderPlanActionList: [],
      paramValueCopy: []
    }
  },
  props: {
    paramValue: {},
    selectDict: {}
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
    string() {
      return JSON.stringify(this.paramValue)
    },
    stringAddList() {
      const { string } = this
      return { string }
    },
    orderUsageTypeFilterList() {
      const selectedOrderArr = map(this.paramValueCopy, 'orderCode')
      return this.orderUsageTypeList.map(item => {
        this.$set(item, 'isSelect', selectedOrderArr.includes(item.dictCode))
        return item
      })
    }
  },
  created: async function () {
    const { ICIS_DICT_ORDER_USAGE_TYPE } = await this.$batchGetDictItemList(['ICIS_DICT_ORDER_USAGE_TYPE'])
    this.orderUsageTypeList = ICIS_DICT_ORDER_USAGE_TYPE
    this.orderPlanActionList = []
    const selectDict = this.selectDict ? JSON.parse(this.selectDict) : {}
    Object.keys(selectDict).forEach(key => {
      this.orderPlanActionList.push({
        dictCode: key,
        dictName: selectDict[key]
      })
    })
  },
  mounted() { },
  methods: {
    change() {
      return new Promise((resolve, reject) => {
        if (this.paramValueCopy.filter(v => !v.orderCode).length > 0) {
          this.$message.error('请输入医嘱分类!')
          reject()
          return
        }
        if (this.paramValueCopy.filter(v => !v.action.length).length > 0) {
          this.$message.error('请选择医嘱执行操作!')
          reject()
          return
        }
        this.$emit('update:paramValue', JSON.stringify(this.paramValueCopy))
        resolve()
      })
    },
    deleteFn(index) {
      this.paramValueCopy.splice(index, 1)
    },
    addLine() {
      this.paramValueCopy.unshift({ orderCode: '', action: [] })
    },
    /**
     * 选择医嘱分类
     * @param {} e
     * @param {*} row
     */
    selectOrderType(e, row) {
      const length = this.paramValueCopy.filter(item => item.orderCode == row.orderCode).length
      if (length > 1) {
        this.$message.warning('该医嘱类型已配置!')
        row.orderCode = ''
      }
    }
  }
}
</script>
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
