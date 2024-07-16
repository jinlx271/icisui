<!-- 基础参数 -->
<template>
  <div class="paramConfigPreventiveDrugs">
    <el-form-item label="参数值" prop="paramValueCopyDrugs">
      <el-select v-model="paramValueCopy" :filter-method="(val)=>filterData(val)" @focus="filterData" @clear="filterData" clearable filterable
                 multiple placeholder="请选择" style="width:100%">
        <template v-if="type=='1'">
          <el-option v-for="item in drugList" :key="item.drugName + item.drugCode" :label="item.drugName+'('+item.drugCode+')'"
                     :value="item.drugCode"></el-option>
        </template>
        <template v-else-if="type=='2'">
          <el-option v-for="(item) in drugList" :key="item.frequencyName + item.frequencyCode"
                     :label="item.frequencyName+'('+item.frequencyCode+')'" :value="item.frequencyCode"></el-option>
        </template>
        <template v-else-if="type=='3'">
          <el-option v-for="(item) in drugList" :key="item.frequencyName + item.frequencyCode"
                     :label="item.frequencyName+'('+item.frequencyCode+')'" :value="item.frequencyCode"></el-option>
        </template>
      </el-select>
    </el-form-item>
  </div>
</template>
<script>
import {
  drug_findWithPage, // 药品
  drugFrequency_findDrugAllWithPage // 医嘱执行频次设置
} from '@/api/configuration'
export default {
  name: 'ParamConfigPreventiveDrugs',
  components: {},
  data: function () {
    return {
      drugList: [], // 药品列表
      paramValueCopy: [] // 选择的值
    }
  },
  props: {
    paramValue: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: '1'
    }
  },
  watch: {
    paramValue: {
      handler: function (val) {
        this.paramValueCopy = val.split(',')
      },
      immediate: true,
      deep: true
    }
  },
  computed: {},
  created: function () {
    this.queryFc()
  },
  mounted() { },
  methods: {
    /**
     * 主页面回调
     */
    change() {
      return new Promise((resolve, reject) => {
        this.$emit('update:paramValue', this.paramValueCopy.join())
        resolve()
      })
    },
    /**
     * 药品请求
     */
    queryFc(key) {
      let query
      const data = {
        pageNum: 1,
        searchKey: key
      }
      switch (this.type) {
        case '1':
          query = drug_findWithPage
          data.pageSize = 50
          data.containList = this.paramValueCopy
          break
        case '2':
          data.pageSize = 50 // 后面有新增的再加，目前37条。（王泽虎）
          query = drugFrequency_findDrugAllWithPage
          break
        case '3':
          data.pageSize = 50
          query = drugFrequency_findDrugAllWithPage
          break
      }
      query(data).then(res => {
        this.drugList = res.data.result
      })
    },
    /**
     * 单选过滤
     */
    filterData(key) {
      if (typeof key != 'string') {
        key = ''
      }
      this.queryFc(key)
    }

  }
}
</script>
<style lang="scss" scoped>
.paramConfigPreventiveDrugs {
  min-height: 50px;
}
::v-deep .el-form-item__label {
  padding: 0;
  width: 118px !important;
  margin-right: 12px;
}
</style>
