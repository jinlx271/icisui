<!-- 基础参数 -->
<template>
  <div class="cacheSelect">
    <el-select
      v-model="row.paramValue"
      :filter-method="(val)=>filterData(val, row)"
      @clear="(val)=>filterData(val, row)"
      @focus="(val)=>filterData(val, row)"
      clearable
      filterable
      multiple
      ref="elSelect"
      placeholder="请选择"
      style="width:100%"
    >
      <el-option v-for="(item,index) in row.selectDict" :key="item.dictId || item.formId || index" :forceHide="item.statusDict != 1" :label="item.dictName" :value="item.dictCode">
        <span class="flex-1" style="height:100%;padding:0 auto">{{ item.dictName }}</span>&nbsp;&nbsp;&nbsp;
        <span class="flex-1 text-right" style=" color: #8492a6; font-size: 13px ; height:100%; padding:0 auto">{{ item.dictCode }}</span>
      </el-option>
    </el-select>
  </div>
</template>
<script>
import {
  moniitem_multipleListPage,
  formconfig_listPage,
  config_monitoringEvent_listPage,
  diag_findAllWithPage
} from '@/api/configuration'
export default {
  name: 'CacheSelect',
  components: {},
  data: function() {
    return {
    }
  },
  props: {
    row: {}
  },
  watch: {
  },
  computed: {
  },
  created() {},
  mounted() {},
  methods: {
    /**
     * 多选过滤
     */
    async filterData(key, row) {
      if (typeof key != 'string') {
        key = ''
      }
      if (row.selectType == '1') {
        // 字典值
        this.row.selectDict = this.row.allSelectDict.filter(res => {
          return (
            res.dictCode.indexOf(key) !== -1 || res.dictName.indexOf(key) !== -1
          )
        })
      } else if (row.selectType == '2' || row.selectType == '105' || row.selectType == '106') {
        // 监护表
        this.row.selectDict = await this.getMoniitem(key)
      } else if (row.selectType == '3') {
        // 自定义
        this.row.selectDict = this.row.allSelectDict.filter(res => {
          return (
            res.dictCode.indexOf(key) !== -1 || res.dictName.indexOf(key) !== -1
          )
        })
      } else if (row.selectType == '1012') {
          // 评估单列表
        row.selectDict = await this.getAssementList(
        )
        row.allSelectDict = JSON.parse(
          JSON.stringify(row.selectDict)
        )
      } else if (row.selectType == '4') {
        this.row.selectDict = await this.getEventList(key)
      } else if (row.selectType == 'DIAGNOSIS') {
        row.selectDict = await this.getDiagList(key)
        row.allSelectDict = JSON.parse(
          JSON.stringify(row.selectDict)
        )
      }
    },
    getDiagList(key) {
      return new Promise(resolve => {
        const query = {
          pageSize: 200,
          pageNum: 1,
          statusDict: '1', // 查询启用的
          searchKey: key // 搜索条件
        }
        diag_findAllWithPage(query).then(res => {
          const data = []
          if (res?.data?.result) {
            res.data.result.map(item => {
              data.push({
                dictCode: item.diagnoseName,
                statusDict: item.statusDict,
                dictName: item.diagnoseName
              })
            })
          }
          resolve(data)
        })
      })
    },
    /**
     * 获取监护项字典
     */
    getMoniitem(key, type, moniitemCode) {
      return new Promise(resolve => {
        const moniitemCode = []
        this?.row?.paramValue.map(i => {
          moniitemCode.push(i)
        })
        const query = {
          moniitemCodes: moniitemCode, // 本条数据放第一条查询出来
          limit: 50, // 查询前多少条
          statusDict: '1', // 查询启用的
          searchKey: key // 搜索条件
        }
        if (this?.row?.selectType == '105') {
          query.balanceType = 'in'
        } else if (this?.row?.selectType == '106') {
          query.balanceType = 'out'
        }
        moniitem_multipleListPage(query).then(res => {
          const data = []
          if (res?.data?.result) {
            res.data.result.map(item => {
              data.push({
                dictCode: item.moniitemCode,
                statusDict: item.statusDict,
                dictName: item.moniitemName
              })
            })
          }
          resolve(data)
        })
      })
    },
    getEventList(key, type) {
      return new Promise(resolve => {
        config_monitoringEvent_listPage({
          'pageNum': 1,
          'pageSize': 100,
          'statusDict': '1',
          'searchKey': key
        }).then(res => {
          const data = []
          if (res?.data?.result) {
            res.data.result.map(item => {
              data.push({
                dictCode: item.eventCode,
                dictName: item.eventName,
                statusDict: item.statusDict
              })
            })
          }
          resolve(data)
        })
      })
    },
        /**
     * 获取评估单数据
     */
    getAssementList(key) {
      return new Promise((resolve, reject) => {
        formconfig_listPage({
          pageSize: 20,
          pageNum: 1,
          searchKey: key
        }).then(res => {
          const result = res.data.result.map(item => {
            return {
              dictCode: item.formCode,
              statusDict: item.statusDict,
              dictName: item.formName
            }
          })
          resolve(result)
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
