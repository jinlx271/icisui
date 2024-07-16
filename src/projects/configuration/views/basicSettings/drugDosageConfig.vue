<!-- 药品剂量管理 -->
<template>
  <el-container class="drugDosageConfig">
    <!-- 头部 -->
    <el-header>
      <div class="headerLeft">
            <!-- input输入 -->
        <el-input size="small" placeholder="药品ID/药品名称" clearable suffix-icon="el-icon-search" v-model="queryData.searchKey" @input="debounceSearch" @keyup.enter.native="getDrugConvertList(1)"></el-input>
        <el-checkbox v-model="queryTable.statusDict" true-label="" false-label="1"  @change="debounceSearch">
              显示禁用
        </el-checkbox>
      </div>
      <div class="headerRight">

        <el-button class="queryButton" type="primary" @click.native.prevent="getDrugConvertList(1)">查询</el-button>
        <el-button type="primary" @click.native.prevent="synchronizeDrugs()">同步换算药品</el-button>
        <el-button v-hasPermi="['configuration:basicSettings:drugDoseConfig']" class="queryButton" type="primary" @click.native.prevent="addDictItem" :disabled="tableDataItem.length>0&&tableDataItem[0].isCreate">添加换算药品</el-button>
      </div>
    </el-header>
    <!-- 中间 -->
    <el-main style="height:calc(100% - 102px)">
      <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" ref="table" height="100%" :row-class-name="({row}) => row.statusDict == 0 ? 'disabled' : ''" :data="tableDataItem" style="width: 100%"  highlight-current-row border :key='tableKey'>
        <v-table-column prop="drugCode" label="药品代码">
          <template slot-scope="scope">
              <el-select v-if="scope.row.isCreate"  v-model="scope.row.drugCode"  clearable filterable :disabled="!scope.row.isEdit"
                placeholder="请选择"
                @change="selectDrug($event,scope.row)"
                remote :remote-method="getDrugList"
                @visible-change="clearDrugSearchKey"
                @clear="getDrugList"

              >
                <el-option v-for="option in drugList" :key="option.drugCode" :label="option.drugCode" :value="option.drugCode" :disabled="option.statusDict==0"></el-option>
              </el-select>
              <span v-else>{{scope.row.drugCode}}</span>
          </template>
        </v-table-column>
        <v-table-column prop="drugName" label="药品名称">
          <template slot-scope="scope">
              <el-select v-if="scope.row.isCreate"  v-model="scope.row.drugName"  clearable filterable :disabled="!scope.row.isEdit"
                :loading="loading"
                popper-class="fixed-width"
                remote :remote-method="getDrugList"
                placeholder="请选择"
                @visible-change="clearDrugSearchKey"
                @clear="getDrugList"
                @change="selectDrugName($event,scope.row)"
              >
                <el-option v-for="(option,index) in drugList" :key="`${option.drugCode}-${index}`" :label="`${option.drugName} ${option.drugSpec || ''} ${option.factoryName || ''}`" :title="`${option.drugName} ${option.drugSpec || ''} ${option.factoryName || ''}`" :value="option.drugName" :disabled="option.statusDict==0"></el-option>
              </el-select>
              <span v-else>{{scope.row.drugName}}</span>
          </template>
        </v-table-column>

        <v-table-column prop="drugSpec" label="规格描述"></v-table-column>
        <v-table-column prop="dosageUnit" label="剂量单位"></v-table-column>
        <v-table-column prop="dosage" label="药品剂量">
          <template slot-scope="scope">
              <el-input v-if="scope.row.isEdit"  v-model="scope.row.dosage" placeholder="请输入" clearable filterable :disabled="!scope.row.isEdit" type="number"> </el-input>
              <span v-else>{{scope.row.dosage}}</span>
          </template>
        </v-table-column>
        <v-table-column prop="convertFactor" label="毫升换算比例">
          <template slot-scope="scope">
              <el-input v-if="scope.row.isEdit"  v-model="scope.row.convertFactor" placeholder="请输入" clearable filterable :disabled="!scope.row.isEdit" type="number"> </el-input>
              <span v-else>{{scope.row.convertFactor}}</span>
          </template>
        </v-table-column>
        <v-table-column label="操作" align="center" width="200px">
        <template slot-scope="scope">
            <el-button v-hasPermi="['configuration:basicSettings:drugDoseConfig']" type="text" @click="modifyInfo(scope.row, scope.$index)" v-if="!scope.row.isEdit" >修改</el-button>
            <el-button v-hasPermi="['configuration:basicSettings:drugDoseConfig']" type="text" v-if="scope.row.isEdit===true" @click="cancelItemRow(scope.$index,scope.row)">取消</el-button>
            <el-button v-hasPermi="['configuration:basicSettings:drugDoseConfig']" type="text" v-if="scope.row.isEdit===true" @click="saveItemRow(scope.row)">保存</el-button>
            <el-button v-if="!scope.row.isCreate" v-hasPermi="['configuration:basicSettings:drugDoseConfig']" type="text" @click="enableOrDisable(scope.$index,scope.row)" :style="{ color: scope.row.statusDict == 1 ? '#EC0000': '#00AB44' }">{{+scope.row.statusDict ? '禁用' : '启用' }}</el-button>
        </template>
      </v-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-pagination
        @size-change="changePagination"
        @current-change="changePagination"
        :current-page="queryTable.pageNum"
        :hide-on-single-page="false"
        :page-size="queryTable.pageSize"
        background
        layout="total, prev, pager, next"
        :total="totalCount"
      ></el-pagination>
    </el-footer>
  </el-container>
</template>

<script>
import {
  drugConvert_deleteById,
  drugConvert_edit,
  drugConvert_insert,
  drug_findAllWithPage,
  drugConvert_findAllWithPage,
  drugConvert_synConvert
} from '@/api/configuration'
import { debounce } from 'lodash'
export default {
  name: 'DrugDosageConfig',
  components: {},
  data: () => {
    return {
      tableKey: '',
      loading: false,
      statusDict: '',
      queryTable: {
        pageNum: 1,
        statusDict: '',
        pageSize: 10
      },
      rules: {
        drugCode: [
          { required: true, message: '请输入药品编码', trigger: 'blur' }
        ],
        drugName: [
          { required: true, message: '请输入药品名称', trigger: 'blur' }
        ]
      },
      queryData: {
        searchKey: '', // input输入
        value1: '', // 监护数据显示分组
        value2: '' // 功能模块
      }, // 请求入参
      // 监护基础
      // 页面显示的项目 styleType 输入类型
      showItems: [
        { label: '药品ID', key: 'drugCode', width: '', styleType: 'select', options: [] },
        { label: '药品名称', key: 'drugName', width: '' },
        { label: '规格描述', key: 'drugSpec', width: '' },
        { label: '剂量单位', key: 'dosageUnit', width: '80' },
        { label: '药品剂量', key: 'dosage', width: '80' },
        { label: '毫升换算比例', key: 'convertFactor', width: '100' }
      ],
      totalCount: 0,
      tableDataItem: [

      ], // 数据
      // 药品列表
      drugList: [

      ],
      drugCodeList: [],
      drugNameList: [],
      addOrModify: '',
      drugDialog: '新增药品',
      dialogFlag: false, // 弹框标志
      drugInfo: {
        drugCode: '',
        drugName: '',
        drugSpec: '',
        dosageUnit: '',
        dosage: '',
        convertFactor: ''
      },
      currItem: []
    }
  },
  props: {},
  watch: {},
  computed: {},
  created() {},
  mounted() {
    this.init()
  },
  methods: {
    // 药品初始化数据
    init() {
      this.getDrugConvertList(1)
      this.getDrugList()
    },
    getDrugList(key) {
      this.loading = true
      const query = {
        pageNum: 1,
          pageSize: 10,
          searchKey: key
        }
        drug_findAllWithPage(query).then(res => {
          this.loading = false
          if (res.code == 0) {
            this.drugList = res.data.result
          }
      })
    },
    /**
     * 清除数据
     */
    clearDrugSearchKey() {
      if (this.drugList.length == 0) {
        this.getDrugList()
      }
    },
    /**
     * 搜索药品名称
     */
    searchDrug(e) {
      const query = {
        pageNum: 1,
        pageSize: 50,
        searchKey: e
      }
      drug_findAllWithPage(query).then(res => {
        this.loading = false
        if (res.code == 0) {
          this.drugList = res.data.result
        }
      })
    },
    /**
     * 搜索药品名称
     */
    searchDrugCode(e) {
      const query = {
        pageNum: 1,
        pageSize: 50,
        searchKey: e
      }
      drug_findAllWithPage(query).then(res => {
        this.loading = false
        if (res.code == 0) {
          this.drugCodeList = res.data.result
        }
      })
    },
    // 根据drugcode 选择药品
    selectDrug(e, obj) {
      if (e) {
        const result = this.drugList.filter(item => item.drugCode == e)[0]
        obj.drugCode = result.drugCode
        obj.drugName = result.drugName
        obj.drugSpec = result.drugSpec
        obj.dosageUnit = result.dosageUnit
        obj.drugId = result.drugId
      } else {
        obj.drugCode = ''
        obj.drugName = ''
        obj.drugSpec = ''
        obj.dosageUnit = ''
        obj.drugId = ''
      }
    },
    // 根据drugcode 选择药品
    selectDrugName(e, obj) {
      if (e) {
        const result = this.drugList.filter(item => item.drugName == e)[0]
        obj.drugCode = result.drugCode
        obj.drugName = result.drugName
        obj.drugSpec = result.drugSpec
        obj.dosageUnit = result.dosageUnit
        obj.drugId = result.drugId
      } else {
        obj.drugCode = ''
        obj.drugName = ''
        obj.drugSpec = ''
        obj.dosageUnit = ''
        obj.drugId = ''
      }
    },
    debounceSearch() {
      this.debounceSearchSymbol = this.debounceSearchSymbol ? this.debounceSearchSymbol : debounce(function () {
        this.getDrugConvertList(1)
      }, 200)
      this.debounceSearchSymbol()
    },
    // 获取换算列表
    getDrugConvertList(pageNum) {
      this.queryTable.pageNum = pageNum
      const query = {
        pageNum: this.queryTable.pageNum,
        pageSize: this.queryTable.pageSize,
        statusDict: this.queryTable.statusDict,
        searchKey: this.queryData.searchKey
      }
      drugConvert_findAllWithPage(query).then(res => {
        this.loading = false
        if (res.code == 0) {
          this.tableDataItem = res.data.result
          this.totalCount = res.data.totolCount
        }
      })
    },

    // 修改当前药品信息
    modifyInfo(row, index) {
      this.currItem[index] = { ...row }
      row.isEdit = true
      this.addOrModify = 'modify'
      this.tableDataItem = JSON.parse(JSON.stringify(this.tableDataItem))
    },

    // 数据翻页
    changePagination(pageNum) {
      this.getDrugConvertList(pageNum)
    },
    // 保存编辑行数据
    saveItemRow(row) {
      if (!row.drugCode || !row.drugName) {
        this.$message({
          type: 'info',
          message: '请选择药品'
        })
        return
      }
      if (!row.dosage || !row.convertFactor) {
        this.$message({
          type: 'info',
          message: '请输入剂量，换算比例'
        })
        return
      }
      if (this.addOrModify == 'modify') { // 修改
        drugConvert_edit(row).then(res => {
          if (res.code == 0) {
            row.isEdit = false
            this.tableDataItem = JSON.parse(JSON.stringify(this.tableDataItem))
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.getDrugConvertList(this.queryTable.pageNum)
          }
        })
      } else {
        drugConvert_insert(row).then(res => {
          if (res.code == 0) {
            row.isEdit = false
            delete row.isCreate
            this.$message({
              type: 'success',
              message: '新增成功'
            })
            this.getDrugConvertList(this.queryTable.pageNum)
          }
        })
      }
    },

    // 启用禁用-当前药品信息
    enableOrDisable(index, row) {
      drugConvert_deleteById({
        drugId: row.drugId,
        statusDict: row.statusDict == '1' ? '0' : '1'
      }).then(res => {
        this.$message({
          type: 'success',
          message: +row.statusDict ? '已禁用' : '已启用'
        })
        this.getDrugConvertList(this.queryTable.pageNum)
      })
    },
    // 新增监护字典
    addDictItem() {
      if (this.tableDataItem.length > 0) {
        const first = this.tableDataItem[0]
        if (first.isCreate) {
          return
        }
      }
      const row = {
        isCreate: true,
        isEdit: true,
        statusDict: '1'
      }
      this.getDrugList()
      this.addOrModify = 'add'
      this.tableDataItem.unshift(row)
    },
    cancelItemRow(index, row) {
      row.isEdit = false
      if (this.addOrModify == 'add') {
        this.tableDataItem.splice(index, 1)
      } else {
        this.tableDataItem = JSON.parse(JSON.stringify(this.tableDataItem))
        this.tableDataItem[index] = this.currItem[index]
      }
    },
    /**
     * 同步换算药品
     */
    synchronizeDrugs() {
      drugConvert_synConvert({}).then(res => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: '同步成功'
          })
          this.debounceSearch()
        }
      })
    }

  }
  // 获取表格集合
}
</script>
<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法

.drugDosageConfig {
  background: #fff;
  height: 100%;
  padding: 15px;
}
::v-deep .el-table thead > tr > th > .cell {
  padding-left: 6px;
  padding-right: 6px;
}
::v-deep .el-table tbody > tr > td > .cell {
  padding-left: 6px;
  padding-right: 6px;
}
::v-deep .el-table {
  height: 100%;
}
</style>
