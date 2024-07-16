<!-- 基础参数 -->
<template>
  <div class="paramConfigPipeRelativeFluid">
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
        ref="table" border :data="paramValueCopy" row-key="id" height="100%">
        <v-table-column prop="wardCode" label="病区">
          <template slot-scope="scope">
            <el-select style="width:100%" v-model="scope.row.wardCode" placeholder="请选择" @change="reset(scope.row)">
              <el-option v-for="(item) in wardList" :key="item.wardCode" :label="item.wardName"
                :value="item.wardCode"></el-option>
            </el-select>
          </template>
        </v-table-column>
        <v-table-column prop="moni" label="导管分类">
          <template slot-scope="scope">
            <el-select filterable v-model="scope.row.catheterCode" placeholder="请选择" @change="reset(scope.row)"
              @focus="() => filterMethodPipeType()" :filter-method="filterMethodPipeType" style="width:100%">
              <el-option v-for="item in pipeTypeList" :key="item.dictCode" :label="item.dictName" :value="item.dictCode">
                {{ item.dictName + '(' + item.dictCode + ')' }}
              </el-option>
            </el-select>
          </template>
        </v-table-column>
        <v-table-column prop="moni" label="导管对应监护项">
          <template slot-scope="scope">
            <el-select filterable clearable multiple v-model="scope.row.codes" placeholder="请选择"
              :disabled="!scope.row.catheterCode || !scope.row.wardCode" @focus="() => selectFocusFcMultiple(scope.row.codes)"
              :filter-method="(val) => filterMethodMultiple(scope.row.codes, val)" @visible-change="selectVisibleFc"
              :value-key="'moniitemCode'" style="width:100%">
              <el-option v-for="item in moniitemDictListAll" :key="item.moniitemCode" :label="item.moniitemName"
                :value="item.moniitemCode">{{ item.moniitemName + '(' + item.moniitemCode + ')' }}</el-option>
            </el-select>
            <!-- <v-select-mon  filterable  clearable v-model="scope.row.codes"
                          :disabled="!scope.row.catheterCode||!scope.row.wardCode"
                          :options="moniitemDictListAll"  multiple style="width:100%">
            </v-select-mon> -->
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
            <!-- <v-select-mon filterable v-if="moniitemDictList.length>0" clearable v-model="scope.row.liquidCode"
                           :options="moniitemDictListAll"  style="width:100%">
            </v-select-mon> -->
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
// import { cloneDeep } from 'lodash'
import {
  catheterMoniitem_findAllWithPage,
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
      pipeTypeList: [],
      pipeTypeListAll: [],
      paramValueCopy: [],
      moniitemDictListAll: [],
      catheterMoniitemAll: [],
      moniitemCodeList: [] // 已经存在的编码
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
      return JSON.stringify(this.paramValue)
    }
  },
  created: async function () {
    this.moniitemCodeListFc()
    const wardList = await icuWard_findWithPage({
      pageSize: 10000,
      pageNum: 1,
      userName: ''
    })
    this.wardList = this.wardListAll = wardList.data.result
    const { ICIS_DICT_CATHETER_TYPE } = await this.$batchGetDictItemList(['ICIS_DICT_CATHETER_TYPE'])
    this.pipeTypeList = this.pipeTypeListAll = ICIS_DICT_CATHETER_TYPE
    const catheterMoniitemAll = await catheterMoniitem_findAllWithPage({
      'catheterTypeDictCode': '',
      'catheterTypeDictName': '',
      'moniitemCode': '',
      'moniitemDesc': '',
      'moniitemName': '',
      'needFlag': '',
      'pageNum': 1,
      'pageSize': 10000,
      'wardCode': '',
      'searchKey': ''
    })
    this.catheterMoniitemAll = catheterMoniitemAll.data.result
    this.paramValueCopy = this.paramValueCopy.map(v => {
      if (v.catheterCode) {
        v.option = v.optionAll = this.catheterMoniitemAll.filter(vv => {
          return vv.wardCode == v.wardCode && v.catheterCode == vv.catheterTypeDictCode
        })
      } else {
        v.option = v.optionAll = []
      }
      return v
    })
  },
  mounted() { },
  methods: {
    reset(row) {
      row.codes = []
      this.paramValueCopy = this.paramValueCopy.map(v => {
        if (v.catheterCode) {
          v.option = v.optionAll = this.catheterMoniitemAll.filter(vv => {
            return vv.wardCode == v.wardCode && v.catheterCode == vv.catheterTypeDictCode
          })
        } else {
          v.option = v.optionAll = []
        }
        return v
      })
    },
    deleteFn(index) {
      this.paramValueCopy.splice(index, 1)
    },
    filterMethodPipeReMoni(val, scope) {
      // scope.row.option = frontFilter(val, scope.row.optionAll)
      this.paramValueCopy = this.paramValueCopy.map(v => {
        if (JSON.stringify(v) == JSON.stringify(scope.row)) {
          v.option = frontFilter(val, v.optionAll)
        }
        return v
      })
    },
    filterMethodPipeType(val) {
      this.pipeTypeList = frontFilter(val, this.pipeTypeListAll)
    },
    change() {
      return new Promise((resolve, reject) => {
        if (this.paramValueCopy.filter(v => {
          return !v.catheterCode || !v.liquidCode || !v.wardCode
        }).length > 0) {
          this.$message.error('请填写病区编码、导管分类、液体平衡监护项!')
          reject()
          return
        }
        this.$emit('update:paramValue', JSON.stringify(this.paramValueCopy.map(v => {
          delete v.option
          delete v.optionAll
          return v
        })))
        resolve()
      })
    },
    addLine() {
      this.paramValueCopy.unshift({ wardCode: '', catheterCode: '', liquidCode: '', option: [], optionAll: [], codes: [] })
    },
    /**
     * 整个表格存在的监护数据编码
     */
    moniitemCodeListFc() {
      for (const key in this.paramValueCopy) {
        const item = this.paramValueCopy[key]
        this.moniitemCodeList.push(item.liquidCode)
        this.moniitemCodeList = this.moniitemCodeList.concat(item.codes)
      }
      this.multipleListPageFc(this.moniitemCodeList)
    },
    /**
     * 下拉框搜索方法
     */
    filterMethodMultiple(list, val) {
      // 获取监护数据
      this.multipleListPageFc(list.length > 0 ? list : [], val)
    },
    /**
     * 下拉框选择的时候
     */
    selectFocusFcMultiple(list) {
      // 获取监护数据
      this.multipleListPageFc(list.length > 0 ? list : [])
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
    }
  }
}
</script>
<style lang="scss" scoped>
.paramConfigPipeRelativeFluid {
  height: 300px;
}

::v-deep .el-form-item__label {
  padding: 0;
  width: 118px !important;
  margin-right: 12px;
}
</style>
