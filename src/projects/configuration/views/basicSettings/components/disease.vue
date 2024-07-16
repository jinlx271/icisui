<template>
  <div>
    <div style="height:calc(100% - 80px)">
      <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" height="100%"
                ref="tableDataItem" @row-click="rowClick" :row-class-name="({row}) => row.statusDict == 0 ? 'disabled' : ''" :data="tableDataItem" highlight-current-row fit border row-key="id">
        <v-table-column prop="sortNo" label="排序" align="left">
          <template slot-scope="scope">
            <el-input type="number" v-if="scope.row.isEdit" v-model="scope.row.sortNo" placeholder="请输入"></el-input>
            <span v-else>{{scope.row.sortNo}}</span>
          </template>
        </v-table-column>
        <v-table-column prop="diseasesCode" label="病种编码" align="left">
          <template slot-scope="scope">
            <span>{{scope.row.diseasesCode}}</span>
          </template>
        </v-table-column>
        <v-table-column prop="diseasesName" label="病种名称" align="left">
          <template slot-scope="scope">
            <el-select v-if="scope.row.isEdit" v-model="scope.row.diseasesCode" remote @focus="()=>{remoteMethod('',scope.row)}"
                       :remote-method="e=>{remoteMethod(e,scope.row)}" filterable placeholder="请选择" style="width:100%">
              <el-option v-for="item in option" :key="item.id" :label="item.diseasesName" :value="item.diseasesCode"></el-option>
            </el-select>
            <span v-else>{{scope.row.diseasesName}}</span>
          </template>
        </v-table-column>
        <v-table-column prop="score" label="分值" align="left">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit" v-model="scope.row.score" placeholder="请输入"></el-input>
            <span v-else>{{scope.row.score}}</span>
          </template>
        </v-table-column>
        <v-table-column label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <el-button type="text" @click.stop="doEdit(scope.$index,scope.row)" v-if="!scope.row.isEdit">修改</el-button>
            <el-button type="text" @click.stop="doSave(scope.$index,scope.row)" v-if="scope.row.isEdit">保存</el-button>
            <el-button type="text" @click.stop="doCancel(scope.$index,scope.row)" v-if="scope.row.isEdit">取消</el-button>
            <el-button v-if="!scope.row.isCreate" type="text" @click.stop="enableOrDisable(scope.$index,scope.row)"
                       :style="{ color: scope.row.statusDict == 1 ? '#EC0000': '#00AB44' }">
              {{+scope.row.statusDict ? '禁用' : '启用' }}</el-button>
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
  diagnosis_classify_listPage,
  diagnosis_classify_add,
  diagnosis_classify_update,
  diagnosis_classify_enable,
  diagnosis_classify_disable,
  base_diseases_listPage,
  diagnosis_adscription_getMaxSort
  // diagnosis_adscription_listPage,
  // diagnosis_adscription_withoutConfig,
  // diagnosis_adscription_add,
  // diagnosis_adscription_delete
} from '@/api/configuration'
import { mapGetters } from 'vuex'
export default {
  name: 'Disease',
  components: {},
  data: function () {
    return {
      option: [],
      defaultRegion: '',
      tableDataItem: [],
      drugBasicData: [], // 药品基础数据
      unitList: [],
      currRow: [],
      pageNum: 1,
      pageSize: 10,
      totolCount: 0

    }
  },
  props: {
    surgicalPatients: {
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
    searchKey: async function () {
      this.tableDataItem = await this.getDrugData(1)
      this.$nextTick(() => {
        if (this.tableDataItem && this.tableDataItem.length > 0) {
          this.$refs.tableDataItem.setCurrentRow(this.tableDataItem[0])
          this.rowClick(this.tableDataItem[0])
        }
      })
    },
    statusDict: async function () {
      this.tableDataItem = await this.getDrugData(1)
      this.$nextTick(() => {
        if (this.tableDataItem && this.tableDataItem.length > 0) {
          this.$refs.tableDataItem.setCurrentRow(this.tableDataItem[0])
          this.rowClick(this.tableDataItem[0])
        }
      })
    }
  },
  computed: {
    ...mapGetters(['currentUserWard'])
  },
  created: async function () {
    this.tableDataItem = await this.getDrugData()
    if (this.tableDataItem && this.tableDataItem.length > 0) { this.rowClick(this.tableDataItem[0]) }
    this.remoteMethod()
  },
  mounted() { },
  methods: {
    remoteMethod: async function (e, row) {
      const res = await base_diseases_listPage({ searchKey: e, statusDict: '1', belongClassify: this.surgicalPatients, pageNum: 1, pageSize: 100 })
      this.option = res.data.result || []
    },
    rowClick(row) {
      this.$emit('rowClick', row.id)
    },
    async getData(cb) {
      this.tableDataItem = await this.getDrugData()
      if (cb) {
        cb()
      }
    },
    // 获取药品信息
    getDrugData(pageNum) {
      this.pageNum = pageNum || 1
      return new Promise((resolve, reject) => {
        const query = {
          surgicalPatients: this.surgicalPatients,
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          statusDict: this.statusDict,
          searchKey: this.searchKey
        }
        diagnosis_classify_listPage(query).then(res => {
          this.totolCount = res.data.totolCount
          resolve(res.data.result || [])
        })
      })
    },
    /**
     * 清除关键字
     */
    async changePage(pageNum) {
      this.tableDataItem = await this.getDrugData(pageNum)
    },
    // 启用禁用-用药信息
    enableOrDisable(index, row) {
      const res = +row.statusDict ? diagnosis_classify_disable({
        id: row.id
      }) : diagnosis_classify_enable({
        id: row.id
      })
      res.then(res => {
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
        this.tableDataItem[index] = this.currRow[index]
      }
      this.tableDataItem = JSON.parse(JSON.stringify(this.tableDataItem))
      row.isEdit = false
    },
    doEdit(index, row) {
      this.currRow[index] = { ...row }
      row.isEdit = true
      this.tableDataItem = JSON.parse(JSON.stringify(this.tableDataItem))
    },
    // 添加药品按钮
    async add() {
      if (this.tableDataItem.length > 0) {
        const first = this.tableDataItem[0]
        if (first.isCreate) {
          return
        }
      }
      const sortNo = await this.getMaxSortNo()
      const drug = {
        isEdit: true,
        isCreate: true,
        sortNo: sortNo
      }
      this.tableDataItem.unshift(drug)
      this.tableDataItem = JSON.parse(JSON.stringify(this.tableDataItem))
    },
    /**
     * 获取最大排序号
     */
    getMaxSortNo() {
      return new Promise((resolve, reject) => {
        const type = '' + this.surgicalPatients
        diagnosis_adscription_getMaxSort(type).then(res => {
          resolve(res.data)
        })
      })
    },
    // selection 切换数据
    changeDrug(e, row) {
      if (e != '') {
        const selectDrug = this.drugBasicData.filter(drug => drug.drugCode == e)[0]
        row.drugCode = selectDrug.drugCode
        row.drugName = selectDrug.drugName
        row.drugUnit = selectDrug.dosageUnit
        row.drugSpec = selectDrug.drugSpec
      }
    },
    doSave(index, row) {
      row.surgicalPatients = this.surgicalPatients
      if (row.isCreate) {
        diagnosis_classify_add(row).then(res => {
          row.isEdit = false
          delete row.isCreate
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.$emit('rowClick', '')
          this.getData(() => this.rowClick({ id: row.id }))
        })
      } else {
        diagnosis_classify_update(row).then(res => {
          this.$emit('rowClick', '')
          this.getData(() => this.rowClick({ id: row.id }))
        })
      }
    }

  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法
</style>

