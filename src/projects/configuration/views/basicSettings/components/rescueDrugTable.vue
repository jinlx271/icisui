<template>
  <div>
    <div style="height:calc(100% - 60px)">
        <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" height="100%" ref="tableDataItem" :row-class-name="({row}) => row.statusDict == 0 ? 'disabled' : ''" :data="tableDataItem" highlight-current-row fit border row-key="id">
          <v-table-column prop="drugName" label="药品名称" align="left">
            <template slot-scope="scope">
              <el-select clearable filterable remote v-model="scope.row.drugCode" placeholder="请选择" :remote-method="remoteMethod" @change="changeDrug($event,'drugCode',scope.row)"
                        popper-class="fixed-width"
                        @visible-change="clearDrugSearchKey"
                        @clear="remoteMethod()"
                        v-if="scope.row.isEdit&&scope.row.isCreate">
                <el-option v-for="option in drugBasicData" :key="option.drugCode" :label="`${option.drugName} ${option.drugSpec || ''} ${option.factoryName || ''}`" :title="`${option.drugName} ${option.drugSpec || ''} ${option.factoryName || ''}`" :value="option.drugCode" :disabled="option.statusDict==0"></el-option>
              </el-select>
              <span v-else>{{scope.row.drugName}}</span>
            </template>
          </v-table-column>
          <v-table-column :prop="item.key" :label="item.label" align="left" v-for="item in rescureBasicDrug" :key="item.label">
            <template slot-scope="scope">
              <el-select v-if="item.styleType === 'select'&&scope.row.isEdit"
                        :allow-create="item.canCreate"
                        clearable
                        filterable
                        v-model="scope.row[item.key]"
                        placeholder="请选择" :disabled="!((scope.row.isCreate&&!item.canEdit) || (item.canEdit&&scope.row.isEdit))"
                        @change="changeDrug($event,item.key,scope.row)">
                <el-option v-for="(option) in item.options" :key="option[item.optionsValue || 'value']" :label="option[item.optionsLabel || 'label']"
                          :value="option[item.optionsValue || 'value']" :disabled="option.statusDict==0"></el-option>
              </el-select>
              <el-input v-else-if="scope.row.isEdit" v-model="scope.row[item.key]" placeholder="请输入"></el-input>
              <span v-else>{{scope.row[item.labelkey]||scope.row[item.key]}}</span>
            </template>
          </v-table-column>

            <v-table-column label="操作" align="center" width="200px">
              <template slot-scope="scope">
                <el-button v-hasPermi="['configuration:basicSettings:rescueRecordConfig']" type="text" @click="doEdit(scope.$index,scope.row)"
                          v-if="!scope.row.isEdit">修改</el-button>
                <el-button v-hasPermi="['configuration:basicSettings:rescueRecordConfig']" type="text" @click="doSave(scope.$index,scope.row)"
                          v-if="scope.row.isEdit">保存</el-button>
                <el-button v-hasPermi="['configuration:basicSettings:rescueRecordConfig']" type="text" @click="doCancel(scope.$index,scope.row)"
                          v-if="scope.row.isEdit">取消</el-button>
                <el-button v-if="!scope.row.isCreate"  v-hasPermi="['configuration:basicSettings:rescueRecordConfig']" type="text" @click="enableOrDisable(scope.$index,scope.row)" :style="{ color: scope.row.statusDict == 1 ? '#EC0000': '#00AB44' }">{{+scope.row.statusDict ? '禁用' : '启用' }}</el-button>
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
  rescure_rescureDrug_findAllWithPage,
  rescure_rescureDrug_deleteById,
  rescure_rescureDrug_insert,
  rescure_rescureDrug_edit
} from '@/api/rescure'
import {
  drugUsage_findWithPage
} from '@/api/configuration'
import { mapGetters } from 'vuex'
import { getDrugBasicData } from '@/utils/utils'
export default {
  name: 'RescueDrugTable',
  components: {},
  data: function () {
    return {

      // loading: false,
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
    searchKey: {
      type: String,
      default: ''
    },
    statusDict: {
      type: String,
      default: ''
    }
  },
  watch: {
    wardCode: function () {
      this.getData()
    },
    searchKey: async function () {
      this.tableDataItem = await this.getDrugData(1)
    },
    statusDict: async function() {
      this.tableDataItem = await this.getDrugData(1)
    }
  },

  computed: {
    ...mapGetters(['currentUserWard']),
    rescureBasicDrug() {
      return [
        // { label: '药品名称', key: 'drugName', width: '80', placeholder: '请选择药品', styleType: 'select', options: this.drugBasicData, optionsLabel: 'drugName', optionsValue: 'drugCode', canEdit: false },
        { label: '规格', key: 'drugSpec', width: '80', canEdit: false },
        { label: '抢救时单位', key: 'drugUnit', width: '80', styleType: 'select', options: this.unitList, optionsLabel: 'dictName', optionsValue: 'dictName', canEdit: true, canCreate: true },
        { label: '用法', key: 'drugUsageCode', labelkey: 'drugUsageName', width: '80', styleType: 'select', options: this.drugUsageListFn(), optionsLabel: 'usageName', optionsValue: 'usageCode', canEdit: true, canCreate: false }
      ]
    }
  },
  inject: ['drugUsageListFn'],
  async created() {
    this.unitList = await this.$getDictItemList('ICIS_DICT_UNIT')
    drugUsage_findWithPage({
      pageNum: 1,
      pageSize: 500,
      statusDict: '1',
      wardCode: this.wardCode
    }).then(res => {
      this.drugUsageList = res.data.result
    })
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
    },
    // 获取药品信息
    getDrugData(pageNum) {
      this.pageNum = pageNum || 1
      return new Promise((resolve, reject) => {
        const query = {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          wardCode: this.wardCode,
          searchKey: this.searchKey

        }
        if (this.statusDict != '') {
          query.statusDict = this.statusDict
        }
        rescure_rescureDrug_findAllWithPage(query).then(res => {
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
      rescure_rescureDrug_deleteById({
        id: row.id,
        statusDict: row.statusDict == '1' ? '0' : '1'
      }).then(res => {
        this.getData()
        this.$message({
          type: 'success',
          message: +row.statusDict ? '已禁用' : '已启用'
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
    doEdit(index, row) {
      this.currRow = { ...row }
      row.isEdit = true
      this.tableDataItem = JSON.parse(JSON.stringify(this.tableDataItem))
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
      this.drugBasicData = await getDrugBasicData()
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
        console.log('changeDrug ', row)
      } else row[key] = ''
      this.tableDataItem = [...this.tableDataItem]
    },
    doSave(index, row) {
      if (row.isCreate) {
        row.wardCode = this.wardCode
        row['drugUsageName'] = row.drugUsageCode ? this.drugUsageListFn().find(item => item.usageCode == row.drugUsageCode)?.usageName : ''
        rescure_rescureDrug_insert(row).then(res => {
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
        row['drugUsageName'] = row.drugUsageCode ? this.drugUsageListFn().find(item => item.usageCode == row.drugUsageCode)?.usageName : ''
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

