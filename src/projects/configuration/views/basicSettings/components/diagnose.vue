<template>
  <div>
    <div style="height:calc(100% - 80px)">
      <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" height="100%" ref="tableDataItem" :data="tableDataItem" highlight-current-row fit border row-key="id">
        <v-table-column prop="diagnoseCode" label="诊断编码" align="left">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit" v-model="scope.row.diagnoseCode" placeholder="请输入"></el-input>
            <span v-else>{{scope.row.diagnoseCode}}</span>
          </template>
        </v-table-column>
        <v-table-column prop="diagnoseName" label="诊断名称" align="left">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit" v-model="scope.row.diagnoseName" placeholder="请输入"></el-input>
            <span v-else>{{scope.row.diagnoseName}}</span>
          </template>
        </v-table-column>
        <v-table-column label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <el-button type="text" @click="doCancel(scope.$index,scope.row)">删除</el-button>
          </template>
        </v-table-column>
      </el-table>
    </div>
    <el-footer>
      <el-pagination background :current-page="pageNum" :page-size="pageSize" layout="total , prev, pager, next" style="margin-left:-10px;float:right"
                     :total="totolCount" @current-change="changePage">
      </el-pagination>
    </el-footer>
    <el-dialog v-el-drag-dialog :title="'新增诊断'" :visible.sync="dialogVisible" :close-on-click-modal="false" class="customdialog" width="250px">
      <el-select clearable filterable remote :remote-method="remoteMethod" value-key="code" v-model="addValue" placeholder="请选择">
        <el-option v-for="(option) in options" :key="option.diagnoseCode" :label="option.diagnoseName" :value="option.diagnoseCode"></el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false,addValue=''">取消</el-button>
        <el-button type="primary" @click="doSave" :disabled="!addValue">保存</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
import {
  diagnosis_adscription_listPage,
  diagnosis_adscription_withoutConfig,
  diagnosis_adscription_add,
  diagnosis_adscription_delete
} from '@/api/configuration'
import { mapGetters } from 'vuex'
export default {
  name: 'Disease',
  components: {},
  data: function () {
    return {
      tableDataItem: [],
      drugBasicData: [], // 药品基础数据
      currRow: [],
      pageNum: 1,
      pageSize: 10,
      totolCount: 0,
      dialogVisible: false,
      addValue: '',
      options: []

    }
  },
  props: {
    surgicalPatients: {
      default: ''
    },
    classifyId: {
      default: ''
    },
    searchKey: {
      type: String,
      default: ''
    }
  },
  watch: {
    classifyId: function () {
      this.getData()
    },
    searchKey: async function () {
      this.tableDataItem = await this.getDrugData(1)
    }
  },
  computed: {
    ...mapGetters(['currentUserWard'])
  },
  async created() {
  },
  mounted() { },
  methods: {
    async remoteMethod(e) {
      const res = await diagnosis_adscription_withoutConfig({
        'classifyId': this.classifyId,
        'searchKey': e
      })
      this.options = res.data
    },
    async getData() {
      this.tableDataItem = await this.getDrugData()
    },
    // 获取药品信息
    getDrugData(pageNum) {
      this.pageNum = pageNum || 1
      return new Promise((resolve, reject) => {
        const query = {
          classifyId: this.classifyId,
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          searchKey: this.searchKey
        }
        if (!this.classifyId) {
          resolve([])
          return
        }
        diagnosis_adscription_listPage(query).then(res => {
          this.totolCount = res.data.totolCount
          resolve(res.data.result)
        })
      })
    },
    /**
     * 清除关键字
     */
    async changePage(pageNum) {
      this.tableDataItem = await this.getDrugData(pageNum)
    },
    // 取消功能
    async doCancel(index, row) {
      this.$confirm('您确定要删除吗？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        diagnosis_adscription_delete({ id: row.id }).then(() => {
          this.getData()
        })
      })
    },
    doEdit(index, row) {
      this.currRow[index] = { ...row }
      row.isEdit = true
      this.tableDataItem = JSON.parse(JSON.stringify(this.tableDataItem))
    },
    // 添加药品按钮
    async add() {
      diagnosis_adscription_withoutConfig({
        'classifyId': this.classifyId,
        'pageNum': 1,
        'pageSize': 100
      }).then(res => {
        this.options = res.data
        this.dialogVisible = true
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
      diagnosis_adscription_add({ classifyId: this.classifyId, diagnoseCode: this.addValue }).then(res => {
        this.getData()
        this.dialogVisible = false
        this.addValue = ''
      })
    }

  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法
</style>

