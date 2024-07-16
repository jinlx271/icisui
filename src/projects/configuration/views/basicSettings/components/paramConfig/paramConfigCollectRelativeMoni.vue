<!-- 基础参数 -->
<template>
  <div class="paramConfigCollectRelativeMoni">
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
        <v-table-column prop="collect" label="数据采集项编码">
          <template slot-scope="scope">
            <el-input v-model="scope.row.collect" placeholder="请输入" clearable></el-input>
          </template>
        </v-table-column>
        <v-table-column prop="moni" label="监护项">
          <template slot-scope="scope">
            <el-select filterable clearable v-model="scope.row.moni" placeholder="请选择"
              @focus="() => selectFocusFc(scope.row.moni.moniitemCode)" @visible-change="selectVisibleFc"
              :filter-method="(val) => filterMethod(scope.row.moni.moniitemCode, val)" :value-key="'moniitemCode'"
              style="width:100%">
              <el-option v-for="item in moniitemDictList" :key="item.moniitemCode" :label="item.moniitemName"
                :value="item"
                :disabled="item.statusDict == '0'">{{ item.moniitemName + '(' + item.moniitemCode + ')' }}</el-option>
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
  moniitem_multipleListPage // 监护数据
} from '@/api/configuration'
export default {
  name: 'ParamConfigCollectRelativeMoni',
  components: {},
  data: function () {
    return {
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
    string: {
      handler: function (n) {
        const paramValueCopy = JSON.parse(JSON.parse(n))
        this.paramValueCopy = []
        for (const key in paramValueCopy) {
          if (Object.hasOwnProperty.call(paramValueCopy, key)) {
            const element = paramValueCopy[key]
            this.paramValueCopy.push({ collect: key, moni: element })
          }
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
  created() {
    // 整个表格存在的监护数据编码
    this.moniitemCodeListFc()
  },
  mounted() { },
  methods: {
    /**
     * 整个表格存在的监护数据编码
     */
    async moniitemCodeListFc() {
      for (const key in this.paramValueCopy) {
        const item = this.paramValueCopy[key]
        this.moniitemCodeList.push(item.moni.moniitemCode)
      }
      const res = await moniitem_multipleListPage({
        moniitemCodes: this.moniitemCodeList, // 本条数据放第一条查询出来
        limit: 50, // 查询前多少条
        statusDict: '1' // 查询启用的
      })
      // 获取监护项字典数据
      this.moniitemDictList = res.data.result
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
      this.moniitemDictList = res.data.result
    },
    /**
     * 新增按钮
     */
    addLine() {
      this.paramValueCopy.unshift({ collect: '', moni: {} })
    },
    /**
     * 删除按钮
     */
    deleteFn(index) {
      this.paramValueCopy.splice(index, 1)
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
     * 主页面保存
     */
    change() {
      return new Promise((resolve, reject) => {
        const paramValueCopy = {}
        if (
          this.paramValueCopy.filter(v => {
            return JSON.stringify(v.moni) == '{}' || !v.collect
          }).length > 0
        ) {
          this.$message.error('请填写采集编码和选择监护项!')
          reject()
          return
        }
        for (let index = 0; index < this.paramValueCopy.length; index++) {
          const element = this.paramValueCopy[index]
          paramValueCopy[element.collect] = element.moni
        }
        this.$emit('update:paramValue', JSON.stringify(paramValueCopy))
        resolve()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.paramConfigCollectRelativeMoni {
  height: 300px;
}

::v-deep .el-form-item__label {
  padding: 0;
  width: 118px !important;
  margin-right: 12px;
}
</style>
