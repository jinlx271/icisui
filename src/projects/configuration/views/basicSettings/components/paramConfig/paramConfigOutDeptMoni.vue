<!-- 基础参数 -->
<template>
  <div class="paramConfigOutDeptMoni">
    <div>
      <el-form-item label="参数值" prop="paramValueCopy">
        <el-select
          filterable
          clearable
          multiple
          v-model="paramValueCopy"
          placeholder="请选择"
          @focus="()=>selectFocusFc(paramValueCopy)"
          :filter-method="(val)=>filterMethod(paramValueCopy,val)"
          :value-key="'moniitemCode'"
          style="width:100%"
        >
          <el-option
            v-for="item in moniitemDictList"
            :key="item.moniitemCode"
            :label="item.moniitemName"
            :value="{moniitemCode:item.moniitemCode,moniitemName:item.moniitemName}"
            :disabled="item.statusDict == '0'"
          >{{item.moniitemName+'('+item.moniitemCode+')'}}</el-option>
        </el-select>
      </el-form-item>
    </div>
    <div></div>
  </div>
</template>
<script>
import {
  moniitem_multipleListPage // 监护数据
} from '@/api/configuration'
export default {
  name: 'ParamConfigOutDeptMoni',
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
  created() {
    const code = []
    this.paramValueCopy.map(i => {
      code.push(i.moniitemCode)
    })
    this.multipleListPageFc(code)
  },
  mounted() {},
  methods: {
    change() {
      return new Promise((resolve, reject) => {
        this.$emit('update:paramValue', JSON.stringify(this.paramValueCopy))
        resolve()
      })
    },
    /**
     * 下拉框搜索方法
     */
    filterMethod(list, val) {
      const code = []
      list.map(i => {
        code.push(i.moniitemCode)
      })
      // 获取监护数据
      this.multipleListPageFc(code.length > 0 ? code : [], val)
    },
    /**
     * 下拉框选择的时候
     */
    selectFocusFc(list) {
      const code = []
      list.map(i => {
        code.push(i.moniitemCode)
      })
      // 获取监护数据
      this.multipleListPageFc(code.length > 0 ? code : [])
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
