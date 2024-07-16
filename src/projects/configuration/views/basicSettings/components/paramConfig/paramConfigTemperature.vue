<!-- 基础参数 -->
<template>
  <div class="paramConfigTemperature">
    <div class="flex flex-between">
      <el-form-item label="参数值" prop="paramValueCopy">
        <el-select
          filterable
          clearable
          v-model="paramValueCopy"
          placeholder="请选择"
          @focus="()=>selectFocusFc(paramValueCopy)"
          :filter-method="(val)=>filterMethod(paramValueCopy,val)"
          :value-key="'moniitemCode'"
          style="width:100%"
        >
          <el-option v-for="item in moniitemDictList" :key="item.moniitemCode" :label="item.moniitemName" :value="item">{{item.moniitemName+'('+item.moniitemCode+')'}}</el-option>
        </el-select>
      </el-form-item>
    </div>
  </div>
</template>
<script>
import {
  moniitem_multipleListPage // 监护数据
} from '@/api/configuration'
export default {
  name: 'ParamConfigTemperature',
  components: {},
  data: function() {
    return {
      paramValueCopy: '',
      moniitemDictList: []
    }
  },
  props: {
    paramValue: {}
  },
  watch: {
    string: {
      handler: function(n) {
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
  created() {
    this.multipleListPageFc([this.paramValueCopy.moniitemCode])
  },
  mounted() {},
  methods: {
    change() {
      return new Promise((resolve, reject) => {
        this.$emit('update:paramValue', JSON.stringify({ moniitemCode: this.paramValueCopy.moniitemCode, moniitemName: this.paramValueCopy.moniitemName }))
        resolve()
      })
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
     * 下拉框选择的时候
     */
    selectFocusFc(list) {
      const code = list.moniitemCode
      // 获取监护数据
      this.multipleListPageFc(code ? [code] : [])
    },
    /**
     * 下拉框搜索方法
     */
    filterMethod(list, val) {
      const code = list.moniitemCode
      // 获取监护数据
      this.multipleListPageFc(code ? [code] : [], val)
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-form-item__label {
  padding: 0;
  width: 118px !important;
  margin-right: 12px;
}
</style>
