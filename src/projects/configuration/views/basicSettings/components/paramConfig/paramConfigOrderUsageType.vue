<!-- 基础参数 -->
<template>
  <div class="paramConfigOrderRelativeFluid">
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
        <v-table-column prop="wardCode" label="病区">
          <template slot-scope="scope">
            <el-select style="width:100%" v-model="scope.row.wardCode" placeholder="请选择">
              <el-option v-for="(item) in wardList" :key="item.wardCode" :label="item.wardName" :value="item.wardCode"
                :disabled="disabled(item.wardCode)"></el-option>
            </el-select>
          </template>
        </v-table-column>
        <v-table-column prop="moni" label="医嘱分类">
          <template slot-scope="scope">
            <el-select filterable clearable v-model="scope.row.orderCodes" multiple placeholder="请选择" style="width:100%">
              <el-option v-for="item in orderUsageTypeList" :key="item.dictCode" :forceHide="item.statusDict != 1"
                :label="item.dictName" :value="item.dictCode">{{ item.dictName + '(' + item.dictCode + ')' }}</el-option>
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
import {
  icuWard_findWithPage
} from '@/api/configuration'
export default {
  name: 'ParamConfigOrderRelativeFluid',
  components: {},
  data: function () {
    return {
      wardList: [],
      wardListAll: [],
      orderUsageTypeList: [],
      orderUsageTypeListAll: [],
      paramValueCopy: []
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
    string() {
      return JSON.stringify(this.paramValue)
    },
    stringAddList() {
      const { string } = this
      return { string }
    }
  },
  created: async function () {
    const wardList = await icuWard_findWithPage({
      pageSize: 1000,
      pageNum: 1,
      userName: ''
    })
    this.wardList = this.wardListAll = wardList.data.result
    const { ICIS_DICT_ORDER_USAGE_TYPE } = await this.$batchGetDictItemList(['ICIS_DICT_ORDER_USAGE_TYPE'])
    this.orderUsageTypeList = this.orderUsageTypeListAll = ICIS_DICT_ORDER_USAGE_TYPE
  },
  mounted() { },
  methods: {
    disabled(code) {
      return this.paramValueCopy.filter(v => {
        return v.wardCode == code
      }).length > 0
    },
    change() {
      return new Promise((resolve, reject) => {
        if (
          this.paramValueCopy.filter(v => {
            return !v.orderCodes || !v.wardCode
          }).length > 0
        ) {
          this.$message.error('请填写病区编码、医嘱分类!')
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
      this.paramValueCopy.unshift({ orderCodes: '', wardCode: '' })
    }
  }
}
</script>
<style lang="scss" scoped>
.paramConfigOrderRelativeFluid {
  height: 300px;
}

::v-deep .el-form-item__label {
  padding: 0;
  width: 118px !important;
  margin-right: 12px;
}
</style>
