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
              <el-option v-for="(item) in wardList" :key="item.wardCode" :label="item.wardName"
                :value="item.wardCode"></el-option>
            </el-select>
          </template>
        </v-table-column>
        <v-table-column prop="moni" label="医嘱分类">
          <template slot-scope="scope">
            <el-select filterable clearable v-model="scope.row.orderCode" placeholder="请选择" style="width:100%">
              <el-option v-for="item in orderUsageTypeList" :key="item.dictCode" :forceHide="item.statusDict != 1"
                :label="item.dictName" :value="item.dictCode">{{ item.dictName + '(' + item.dictCode + ')' }}</el-option>
            </el-select>
          </template>
        </v-table-column>
        <v-table-column prop="moni" label="液体平衡监护项">
          <template slot-scope="scope">
            <el-select filterable clearable v-model="scope.row.liquidCode"
              @focus="() => selectFocusFc(scope.row.liquidCode)"
              :filter-method="(val) => filterMethod(scope.row.liquidCode, val)" @visible-change="selectVisibleFc"
              :value-key="'moniitemCode'" style="width:100%">
              <el-option v-for="item in moniitemDictListAll" :key="item.moniitemCode" :label="item.moniitemName"
                :value="item.moniitemCode">{{ item.moniitemName + '(' + item.moniitemCode + ')' }}</el-option>
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
  icuWard_findWithPage,
  moniitem_multipleListPage // 监护数据
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
      paramValueCopy: [],
      moniitemDictList: [],
      moniitemDictListAll: [],
      moniitemCodeList: [] // 已经存在的编码
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
    this.moniitemCodeListFc()
  },
  mounted() { },
  methods: {
    change() {
      return new Promise((resolve, reject) => {
        if (
          this.paramValueCopy.filter(v => {
            return !v.orderCode || !v.liquidCode || !v.wardCode
          }).length > 0
        ) {
          this.$message.error('请填写病区编码、医嘱分类、液体平衡监护项!')
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
    /**
     * 整个表格存在的监护数据编码
     */
    moniitemCodeListFc() {
      for (const key in this.paramValueCopy) {
        const item = this.paramValueCopy[key]
        this.moniitemCodeList.push(item.liquidCode)
      }
      this.multipleListPageFc(this.moniitemCodeList)
    },
    /**
     * 下拉框搜索方法
     */
    filterMethod(code, val) {
      // 获取监护数据
      this.multipleListPageFc(code ? [code] : [], val)
    },
    /**
     * 下拉框选择的时候
     */
    selectFocusFc(code) {
      // 获取监护数据
      this.multipleListPageFc(code ? [code] : [])
    },
    /**
     * 下拉框出去的的时候
     */
    selectVisibleFc(val) {
      if (!val) {
        // 整个表格存在的监护数据编码
        this.moniitemCodeListFc()
      }
    },
    /**
     * 获取监护数据
     */
    async multipleListPageFc(code, val) {
      const res = await moniitem_multipleListPage({
        moniitemCodes: code, // 本条数据放第一条查询出来
        limit: 50, // 查询前多少条
        statusDict: '1', // 查询启用的
        searchKey: val || '' // 搜索条件
      })
      // 获取监护项字典数据
      this.moniitemDictListAll = res.data.result
    },

    addLine() {
      this.paramValueCopy.unshift({ orderCode: '', liquidCode: '', wardCode: '' })
    },
    /**
     * 选择医嘱分类
     * @param {} e
     * @param {*} row
     */
    selectOrderType(e, row) {
      const length = this.paramValueCopy.filter(item => item.wardCode == row.wardCode && item.orderCode == row.orderCode).length
      if (length > 1) {
        this.$message.warning('相同病区下已存在该医嘱类型')
        row.orderCode = ''
      }
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
