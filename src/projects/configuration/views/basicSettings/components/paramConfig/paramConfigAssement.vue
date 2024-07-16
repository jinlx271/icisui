<!-- 基础参数 -->
<template>
  <div >
    <el-form-item label="参数值" prop="paramValueCopyDrugs">
      <el-select v-model="paramValueCopy" clearable filterable multiple placeholder="请选择" style="width:100%"   :filter-method="(val)=>filterData(val)">
          <el-option v-for="(item) in showData" :key="item.formCode"  :value="item.id" :label="item.formName">
            <div class="flex flex-between">
              <span>{{item.formName}}</span><span class="fr note" >{{item.formCode}}</span>
            </div>
          </el-option>
        </el-select>
    </el-form-item>
  </div>
</template>
<script>
import {
  formconfig_listPage
} from '@/api/configuration'
export default {
  name: 'ParamConfigAssement',
  components: {},
  data: function () {
    return {
      showData: [],
      dataList: [], // 药品列表
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
  computed: {

  },
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
      const data = {
        pageNum: 1,
        pageSize: 100
      }

      formconfig_listPage(data).then(res => {
        this.dataList = res.data.result.filter(item => item.statusDict != '0')
        this.filterData()
      })
    },
    /**
     * 单选过滤
     */
     filterData(key) {
      this.showData = key ? this.dataList.filter(item =>
        item.formName.indexOf(key) > -1 || item.formCode.indexOf(key) > -1 || item.id.indexOf(key) > -1
      ) : this.dataList
      console.log('key', key, this.showData)
    }
  }
}
</script>
<style lang="scss" scoped>
.note{
  color:#999;
}
</style>
