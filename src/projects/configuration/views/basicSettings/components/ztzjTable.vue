<template>
  <div style="height:calc(100% - 45px);width:calc(100% - 10px)">
    <div style="height:calc(100% - 60px)">
      <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" height="100%"
                ref="tableDataItem" :data="tableDataItem" highlight-current-row fit border row-key="id">
        <v-table-column prop="drugCode" label="值" align="left">
          <template slot-scope="scope">
            <span>{{scope.row.drugCode}}</span>
          </template>
        </v-table-column>
        <v-table-column prop="drugName" label="药品名称" align="left">
          <template slot-scope="scope">
            <el-select popper-class="fixed-width" clearable filterable remote v-model="scope.row.drugId" placeholder="请选择" @focus="()=>remoteMethod()" :remote-method="remoteMethod"
                       @change="changeDrug($event,'drugCode',scope.row)" @blur="clearDrugSearchKey" v-if="scope.row.isEdit&&scope.row.isCreate">
              <el-option v-for="option in drugBasicData" :key="option.drugId+'__'+option.drugCode" :label="`${option.drugName} ${option.drugSpec || ''} ${option.factoryName || ''}`" :title="`${option.drugName} ${option.drugSpec || ''} ${option.factoryName || ''}`" :value="option.drugCode"
                         :disabled="option.statusDict==0||option.isexist"></el-option>
            </el-select>
            <span v-else>{{scope.row.drugName}}</span>
          </template>
        </v-table-column>
        <v-table-column prop="simpleName" label="药品缩写" align="left">
          <template slot-scope="scope">
            <span>{{scope.row.simpleName}}</span>
          </template>
        </v-table-column>
        <v-table-column prop="drugSpec" label="药品规格" align="left">
          <template slot-scope="scope">
            <span>{{scope.row.drugSpec}}</span>
          </template>
        </v-table-column>
        <v-table-column prop="drugAttributes" label="药品属性" align="left">
          <template slot-scope="scope">
            <span>{{scope.row.drugAttributes|showDictNameFilter(ICIS_DICT_DRUG_ATTRIBUTES,'dictCode_to_dictName')}}</span>
          </template>
        </v-table-column>
        <v-table-column prop="drugUnit" label="单位" align="left">
          <template slot-scope="scope">
            <span>{{scope.row.drugUnit}}</span>
          </template>
        </v-table-column>
        <v-table-column prop="factoryName" label="厂家" align="left">
          <template slot-scope="scope">
            <span>{{scope.row.factoryName}}</span>
          </template>
        </v-table-column>
        <v-table-column label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <el-button v-hasPermi="['configuration:basicSettings:rescueRecordConfig']" type="text" @click="doSave(scope.$index,scope.row)"
                       v-if="scope.row.isEdit">保存</el-button>
            <el-button v-hasPermi="['configuration:basicSettings:rescueRecordConfig']" type="text" @click="doCancel(scope.$index,scope.row)"
                       v-if="scope.row.isEdit">取消</el-button>
            <el-button v-if="!scope.row.isCreate" v-hasPermi="['configuration:basicSettings:rescueRecordConfig']" type="text"
                       @click="enableOrDisable(scope.$index,scope.row)" >
              删除</el-button>
          </template>
        </v-table-column>
      </el-table>
    </div>
    <el-footer>
      <el-pagination background :current-page="pageNum" :page-size="pageSize" layout="total , prev, pager, next" style="margin-left:-10px;float:right"
                     :total="totolCount" @current-change="changePage">
      </el-pagination>
    </el-footer>
  </div>

</template>
<script>
import {
  rescure_rescureDrug_edit
} from '@/api/rescure'
import { debounce } from 'lodash'
import {
  pain_painDrug_deleteById,
  pain_painDrug_insert,
  pain_painDrug_findWithPage // 分页获取Template
} from '@/api/configuration'
import { mapGetters } from 'vuex'
import { getDrugBasicData } from '@/utils/utils'
export default {
  name: 'ZtzjTable',
  components: {},
  data: function () {
    return {
      ICIS_DICT_DRUG_ATTRIBUTES: [],
      defaultRegion: '',
      tableDataItem: [],
      drugBasicData: [], // 药品基础数据
      unitList: [],
      currRow: null,
      pageNum: 1,
      pageSize: 10,
      totolCount: 0
    }
  },
  props: {
    wardCode: {
      type: String,
      default: ''
    },
    activeName: {
      type: String,
      default: ''
    },
    searchKey: {
      type: String,
      default: ''
    }
  },
  watch: {
    searchKey: async function () {
      this.debounceSearchSymbol = this.debounceSearchSymbol ? this.debounceSearchSymbol : debounce(function () {
        this.getDrugData(1).then(function (res) {
          this.tableDataItem = res
        }.bind(this))
      }, 200)
      this.debounceSearchSymbol()
    }
  },
  computed: {
    ...mapGetters(['currentUserWard'])
  },
  async created() {
    const { ICIS_DICT_DRUG_ATTRIBUTES } = await this.$batchGetDictItemList(['ICIS_DICT_DRUG_ATTRIBUTES'])
    this.ICIS_DICT_DRUG_ATTRIBUTES = ICIS_DICT_DRUG_ATTRIBUTES
    this.searchKey = ''
    this.unitList = await this.$getDictItemList('ICIS_DICT_UNIT')
    this.drugBasicData = await getDrugBasicData()
    this.tableDataItem = await this.getDrugData()
  },
  mounted() { },
  methods: {
    async getData() {
      this.tableDataItem = await this.getDrugData()
    },
    async remoteMethod(e) {
      this.drugBasicData = await getDrugBasicData(e)
      this.drugBasicData = this.drugBasicData.map(v => {
        v.isexist = this.tableDataItem.filter(vv => vv.drugCode == v.drugCode).length > 0
        return v
      })
    },
    // 获取药品信息
    getDrugData(pageNum) {
      this.pageNum = pageNum || 1
      return new Promise((resolve, reject) => {
        const query = {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          wardCode: this.wardCode,
          searchKey: this.searchKey,
          configType: this.activeName,
          endDateTime: '',
          startDateTime: ''
        }
        pain_painDrug_findWithPage(query).then(res => {
          if (res.code == 0) {
            this.totolCount = res.data.totolCount
            resolve(res.data.result)
          }
        })
      })
    },
    /**
     * 清除关键字
     */
    async clearDrugSearchKey() {
      if (this.drugBasicData.length == 0) this.drugBasicData = await getDrugBasicData()
    },
    async changePage(pageNum) {
      this.tableDataItem = await this.getDrugData(pageNum)
    },
    // 启用禁用-用药信息
    enableOrDisable(index, row) {
      this.$confirm('您确定要删除吗？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        pain_painDrug_deleteById({
          id: row.id,
          statusDict: row.statusDict == '1' ? '0' : '1'
        }).then(res => {
          this.getData()
        })
      })
    },
    // 取消功能
    async doCancel(index, row) {
      if (row.isCreate) {
        this.tableDataItem.splice(index, 1)
      } else {
        this.tableDataItem[index] = this.currRow
      }
      this.tableDataItem = JSON.parse(JSON.stringify(this.tableDataItem))
      row.isEdit = false
      this.currRow = null
      this.drugBasicData = await getDrugBasicData()
    },
    // 复制配置功能
    defaultRegionChange(e) {
      this.defaultRegion = e
      if (this.defaultRegion != '') {
        this.tabData = {
          rescureBaseMoniitem: [],
          nursing: [],
          rescureDrug: [],
          other: []
        }
        this.tableDataItem = []
        this.getData()
      }
    },
    // 添加药品按钮
    async addDrug() {
      if (this.currRow) return
      if (this.tableDataItem.length > 0) {
        const first = this.tableDataItem[0]
        if (first.isCreate) {
          return
        }
      }
      const drug = {
        isEdit: true,
        isCreate: true,
        drugCode: '',
        drugName: '',
        drugSpec: '',
        drugUnit: ''
      }
      this.tableDataItem.unshift(drug)
      this.tableDataItem = JSON.parse(JSON.stringify(this.tableDataItem))
    },
    /**
     * 表格中编辑状态切换药品引起的数据变化
     * e 当前选中值
     * key 当前操作列表 对应的属性值
     * row 当前操作行数据
     */
    changeDrug(e, key, row) {
      if (e != '') {
        if (key == 'drugCode') {
          const selectDrug = this.drugBasicData.filter(drug => drug.drugCode == e)[0]
          row.drugCode = selectDrug.drugCode
          row.drugName = selectDrug.drugName
          row.drugUnit = selectDrug.dosageUnit
          row.drugSpec = selectDrug.drugSpec
        } else {
          row[key] = e
        }
      } else row[key] = ''
      this.tableDataItem = [...this.tableDataItem]
    },
    doSave(index, row) {
      row.drugId = row.drugCode
      if (row.isCreate) {
        row.wardCode = this.wardCode
        row.configType = this.activeName
        pain_painDrug_insert(row).then(res => {
          if (res.code == 0) {
            row.isEdit = false
            this.currRow = null
            delete row.isCreate
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.getData()
            // this.tableDataItem = JSON.parse(JSON.stringify(this.tableDataItem))
          }
        })
      } else {
        rescure_rescureDrug_edit(row).then(res => {
          if (res.code == 0) {
            row.isEdit = false
            this.currRow = null
            this.tableDataItem = JSON.parse(JSON.stringify(this.tableDataItem))
            this.$message({
              type: 'success',
              message: '保存成功'
            })
          }
        })
      }
    }

  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法
</style>

