<!-- 自动提取医嘱功能 -->
<template>
  <div class="automaticOrder">
    <el-container element-loading-text="加载中" v-loading="loading" style="height:100%">
      <el-header>
        <div>
        </div>
        <div>
          <el-button v-hasPermi="['configuration:basicSettings:automaticOrder']" size="small" type="primary" @click="addRow">新增</el-button>
        </div>
      </el-header>
      <el-main style="height:calc(100% - 102px)">
        <el-table
          @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)"
          ref="table"
          height="100%"
          :data="tableData"
          fit
          border
          highlight-current-row
          style="width: 100%;overflow: auto;"
        >
          <v-table-column label="项目类型" prop="itemType" width="180px">
            <template slot-scope="scope">
              <el-select v-if="scope.row.isEdit" filterable clearable v-model="scope.row.itemType" style="width:100%" @change="handleChangeItemType(scope.row)">
                <el-option v-for="item in orderExtractItemTypeList" :key="item.dictCode" :label="item.dictName" :value="item.dictCode">{{item.dictName}}</el-option>
              </el-select>
              <span v-else>{{ scope.row.itemType | dictCodeToName(orderExtractItemTypeList) }}</span>
            </template>
          </v-table-column>
          <v-table-column label="项目编码" prop="itemCode">
            <template slot-scope="scope">
              <el-input v-if="scope.row.itemType == 1 && scope.row.isEdit" type="text" v-model="scope.row.itemCode" placeholder="请输入"></el-input>
              <span v-else>{{ scope.row.itemCode }}</span>
            </template>
          </v-table-column>
          <v-table-column label="项目名称">
            <template slot-scope="scope">
              <template v-if="scope.row.isEdit">
                <el-select
                  v-if="scope.row.itemType == 0"
                  v-model="scope.row.itemName"
                  popper-class="fixed-width"
                  clearable
                  filterable
                  :loading="loading"
                  remote
                  :remote-method="getDrugList"
                  @visible-change="clearDrugSearchKey"
                  @clear="getDrugList()"
                  @change="selectDrugName($event,scope.row)"
                >
                  <el-option
                    v-for="(option,index) in drugList"
                    :key="`${option.drugCode}-${index}`"
                    :label="`${option.drugName} ${option.drugSpec || ''} ${option.factoryName || ''}`"
                    :title="`${option.drugName} ${option.drugSpec || ''} ${option.factoryName || ''}`"
                    :value="option.drugName"
                    :disabled="option.statusDict==0"
                  ></el-option>
                </el-select>
                <el-input v-else type="text" v-model="scope.row.itemName" placeholder="请输入"></el-input>
              </template>
              <span v-else>{{scope.row.itemName}}</span>
            </template>
          </v-table-column>
          <v-table-column prop="orderTypeDict" label="医嘱分类">
            <template slot-scope="scope">
              <el-select v-if="scope.row.isEdit" filterable clearable v-model="scope.row.orderTypeDict" placeholder="请选择" style="width:100%">
                <el-option v-for="item in orderUsageTypeList" :key="item.dictCode" :label="item.dictName" :value="item.dictCode">{{item.dictName}}</el-option>
              </el-select>
              <span v-else>{{ scope.row.orderTypeDict | dictCodeToName(orderUsageTypeList) }}</span>
            </template>
          </v-table-column>
          <v-table-column label="操作" width="220px" align="center">
            <template slot-scope="scope">
              <el-button
                v-if="!scope.row.isEdit"
                v-hasPermi="['configuration:basicSettings:automaticOrder']"
                @click.native.prevent="modifyRow(scope.$index, scope.row)"
                type="text"
                size="small"
              >修改</el-button>
              <el-button v-if="!scope.row.isEdit" v-hasPermi="['configuration:basicSettings:automaticOrder']" @click.native.prevent="deleteRow(scope.$index, scope.row)" type="text" size="small">删除</el-button>
              <el-button v-if="scope.row.isEdit" v-hasPermi="['configuration:basicSettings:automaticOrder']" type="text" @click="cancelItemRow(scope.$index,scope.row)">取消</el-button>
              <el-button v-if="scope.row.isEdit" v-hasPermi="['configuration:basicSettings:automaticOrder']" type="text" @click="saveItemRow(scope.$index,scope.row)">保存</el-button>
            </template>
          </v-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <el-pagination
          @size-change="changePagination"
          @current-change="changePagination"
          :current-page="qeuryData.pageNum"
          :hide-on-single-page="false"
          :page-size="qeuryData.pageSize"
          background
          layout="total, prev, pager, next"
          style="float:right;margin-top:15px;margin-right:-10px"
          :total="totolCount"
        ></el-pagination>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import {
  orderTypeContainerConfig_findWithPage,
  orderTypeContainerConfig_insert,
  orderTypeContainerConfig_edit,
  orderTypeContainerConfig_deleteById,
  drug_findAllWithPage
} from '@/api/configuration'
export default {
  name: 'BrugUsageConfig',
  components: {},
  filters: {
    dictCodeToName(dictCode, dictList, item = 'dictName') {
      const dictObj = dictList.find(item => item.dictCode == dictCode)
      return dictObj ? dictObj[item] : ''
    }
  },
  data: function() {
    return {
      loading: false, // 表格的loding
      tableData: [], // 表格数据
      totolCount: 0, // 分页总量
      qeuryData: {
        pageNum: 1,
        pageSize: 15,
        searchKey: '' // 编码或名称
      }, // 请求参数
      addOrModify: 'add', // 修改or新增
      curRow: [], // 当前行
      orderUsageTypeList: [], // 医嘱分类列表
      // 药品列表
      drugList: [],
      // 项目类型列表
      orderExtractItemTypeList: []
    }
  },
  props: {},
  watch: {},
  computed: {},
  created() {
    this.init()
  },
  mounted() {},
  methods: {
    /**
     * 初始化
     */
    async init() {
      const { ICIS_DICT_ORDER_EXTRACT_ITEM_TYPE, ICIS_DICT_ORDER_USAGE_TYPE } = await this.$batchGetDictItemList(['ICIS_DICT_ORDER_EXTRACT_ITEM_TYPE', 'ICIS_DICT_ORDER_USAGE_TYPE'])
      // 获取医嘱自动提取项目类型
      this.orderExtractItemTypeList = ICIS_DICT_ORDER_EXTRACT_ITEM_TYPE
      // 获取医嘱分类
      this.orderUsageTypeList = ICIS_DICT_ORDER_USAGE_TYPE
      // 查询表格
      this.queryFc(1)
      // 药品名称
      this.getDrugList('')
    },
    // 获取药品用法目
    queryFc(page) {
      if (page) {
        this.qeuryData.pageNum = page
      }
      this.loading = true
      orderTypeContainerConfig_findWithPage(this.qeuryData).then(req => {
        this.loading = false
        if (!(req.data && req.data.result)) {
          return
        }
        this.tableData = req.data.result // 列表数据
        this.totolCount = req.data.totolCount // 总条数
      })
    },
    // 药品名称
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
    // 根据drugcode 选择药品
    selectDrugName(e, obj) {
      if (e) {
        const result = this.drugList.filter(item => item.drugName == e)[0]
        obj.itemCode = result.drugCode
        obj.itemName = result.drugName
      } else {
        obj.itemCode = ''
        obj.itemName = ''
      }
    },
    /**
     * 分页数据请求
     */
    changePagination(val) {
      this.queryFc(val)
    },
    // 新增
    addRow() {
      if (this.tableData.length > 0 && this.tableData[0].isCreate == true) {
        return
      }
      this.getDrugList()
      this.tableData.map(item => {
        item.isEdit = false
      })
      const data = {
        isCreate: true,
        isEdit: true,
        itemType: '0',
        itemCode: '',
        itemName: '',
        orderTypeDict: ''
      }
      this.addOrModify = 'add'
      this.tableData.unshift(data)
    },
    // 保存药品用法目
    saveItemRow(index, row) {
      if (!row.itemName && row.itemType == 0) {
        this.$message.error('请选择项目名称')
        return
      } else if (!row.itemName && row.itemType == 1) {
        this.$message.error('请输入项目名称')
        return
      } else if (!row.orderTypeDict) {
        this.$message.error('请选择医嘱分类')
        return
      }
      if (row.isCreate) {
        orderTypeContainerConfig_insert(row)
          .then(res => {
            if (res.code == 0) {
              row.isEdit = false
              delete row.isCreate
              this.$message({
                type: 'success',
                message: '新增成功'
              })
              this.queryFc()
            }
          })
          .catch()
      } else {
        orderTypeContainerConfig_edit(row).then(res => {
          if (res.code == 0) {
            row.isEdit = false
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.tableData = JSON.parse(JSON.stringify(this.tableData))
          }
        })
      }
    },
    // 修改
    modifyRow(index, row) {
      this.curRow[index] = { ...row }
      row.isEdit = true
      this.tableData = JSON.parse(JSON.stringify(this.tableData))
      this.addOrModify = 'modify'
    },
    // 删除
    deleteRow(index, row) {
      this.$confirm('您确定要删除吗？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        orderTypeContainerConfig_deleteById(row).then(res => {
          if (res.code == 0) {
            this.$message.success('删除成功！')
            row.isEdit = false
            this.tableData.splice(index, 1)
          }
        })
      })
    },
    // 取消当前行编辑
    cancelItemRow(index, row) {
      row.isEdit = false
      if (row.isCreate) {
        this.tableData.splice(index, 1)
      } else {
        this.tableData[index] = this.curRow[index]
        this.tableData = JSON.parse(JSON.stringify(this.tableData))
      }
    },
    // 选择项目类型
    handleChangeItemType(row) {
      row.itemCode = ''
      row.itemName = ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/config-common.scss';
.automaticOrder {
  background: #ffffff;
  height: 100%;
  display: block;
  padding: 1%;
  &_table {
    border: none;
    background: none;
    &::before {
      background: transparent;
    }
    &::after {
      background: transparent;
    }
    ::v-deep tr {
      background: none;
      &.current-row {
        color: var(--maincolor);
        td {
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: var(--maincolor);
          background: none;
          .cell {
            background: #d9e3ff;
            border-radius: 3px;
          }
        }
      }
      &:hover {
        color: var(--maincolor);
        td {
          background: none;
        }
      }
    }
    ::v-deep td {
      border: none;
      padding: 0px 8px;
      color: #000622;
      font-size: 13px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      .cell {
        padding: 8px;
      }
    }
  }
}
</style>
