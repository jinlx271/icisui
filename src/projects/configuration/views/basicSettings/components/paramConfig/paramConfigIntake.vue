<!-- 基础参数 -->
<template>
  <div class="paramConfigIntake">
    <div class="flex flex-between">
      <el-form-item label="参数值" prop="paramValueCopy">
      </el-form-item>
      <div>
        <el-button type="primary" @click="addLine">新增</el-button>
      </div>
    </div>
    <div style="height:calc(100% - 60px)">
      <el-table
        @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
        ref="table" border :data="paramValueCopy" height="100%">
        <v-table-column prop="orderUsageTypeDict" label="医嘱分类">
          <template slot-scope="scope">
            <el-select filterable clearable v-model="scope.row.orderUsageTypeDict" placeholder="请选择"
              @focus="() => filterMethod()" :filter-method="filterMethod" style="width:100%">
              <el-option v-for="item in orderUsageTypeList" :key="item.dictCode" :forceHide="item.statusDict != 1"
                :label="item.dictName" :value="item.dictCode" :disabled="disabled(item.dictCode)">
                {{ item.dictName + '(' + item.dictCode + ')' }}
              </el-option>
            </el-select>
          </template>
        </v-table-column>
        <v-table-column prop="moni" label="入量计算方式">
          <template slot-scope="scope">
            <el-select filterable clearable v-model="scope.row.inputType" placeholder="请选择"
              @focus="() => filterMethodPlus()" :filter-method="filterMethodPlus" :value-key="'value'" style="width:100%">
              <el-option v-for="item in option" :key="item.value" :label="item.label" :value="item.value">
                {{ item.label + '(' + item.value + ')' }}
              </el-option>
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
import { frontFilter } from '@/utils/index' // 模糊查询方法
export default {
  name: 'ParamConfigIntake',
  components: {},
  data: function () {
    return {
      option: [
        { value: '1', label: '巡视计入' },
        { value: '2', label: '计总入量至开始执行时间点' },
        { value: '3', label: '计总入量至结束时间点' },
        { value: '4', label: '拆分至整点入量' },
        { value: '5', label: '拆分至整点（前1秒）计入量' }
      ],
      optionAll: [],
      orderUsageTypeList: [],
      orderUsageTypeListAll: [],
      paramValueCopy: []
    }
  },
  props: {
    paramValue: {}
  },
  watch: {
    string: {
      handler: function (n) {
        this.paramValueCopy = JSON.parse(JSON.parse(n))
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    string() {
      return JSON.stringify(this.paramValue)
    }
  },
  created: async function () {
    this.optionAll = this.option
    const { ICIS_DICT_ORDER_USAGE_TYPE } = await this.$batchGetDictItemList(['ICIS_DICT_ORDER_USAGE_TYPE'])
    this.orderUsageTypeList = this.orderUsageTypeListAll = ICIS_DICT_ORDER_USAGE_TYPE
  },
  mounted() { },
  methods: {
    disabled(code) {
      return this.paramValueCopy.filter(v => {
        return v.orderUsageTypeDict == code
      }).length > 0
    },
    deleteFn(index) {
      this.paramValueCopy.splice(index, 1)
    },
    filterMethod(val) {
      this.orderUsageTypeList = frontFilter(val, this.orderUsageTypeListAll)
    },
    filterMethodPlus(val) {
      this.option = frontFilter(val, this.optionAll)
    },
    change() {
      return new Promise((resolve, reject) => {
        let text
        if (this.paramValueCopy.filter(v => !v.orderUsageTypeDict && !v.inputType).length > 0) {
          text = '请选择医嘱分类及入量计算方式！'
        } else if (this.paramValueCopy.filter(v => !v.orderUsageTypeDict).length > 0) {
          text = '请选择医嘱分类！'
        } else if (this.paramValueCopy.filter(v => !v.inputType).length > 0) {
          text = '请选择入量计算方式！'
        }
        if (text) {
          this.$message.error(text)
          return
        }
        this.$emit('update:paramValue', JSON.stringify(this.paramValueCopy))
        resolve()
      })
    },
    addLine() {
      this.paramValueCopy.unshift({ orderUsageTypeDict: '', inputType: '' })
    }
  }
}
</script>
<style lang="scss" scoped>
.paramConfigIntake {
  height: 300px;
}

::v-deep .el-form-item__label {
  padding: 0;
  width: 118px !important;
  margin-right: 12px;
}</style>
