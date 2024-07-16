<!-- 病床管理 -->
<template>
  <div id="concernsConfig" class="concernsConfig">
    <!-- 诊断-左边部分 -->
    <div class="leftDiv">
      <el-container style="height:100%">
        <!-- 左边头部 -->
        <el-header>
          <i class="iconBlue"></i>
          <span class="iconTitle">诊断</span>
        </el-header>
        <el-main>
          <!-- 左边输入栏 -->
          <el-header>
            <el-input size="small" @input="debounceSearch" placeholder="诊断编码/诊断名称" clearable suffix-icon="el-icon-search"
                      v-model="leftQueryData.searchKey" @keyup.enter.native.prevent.stop="getConcernDiagnoisData()"></el-input>
            <el-checkbox v-model="leftQueryData.statusDict" true-label="" false-label="1"  @change="debounceSearch">
                        显示禁用
                  </el-checkbox>
            <el-button v-hasPermi="['configuration:basicSettings:diagConcernConfig']" type="primary" size="small"
                       @click.native.prevent="addDiagnosis">
              添加诊断</el-button>
          </el-header>
          <!-- 左边表格 -->
          <div style="height:calc(100% - 102px)">
            <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" ref="table" height="100%" :row-class-name="({row}) => row.statusDict == 0 ? 'disabled' : ''" :data="leftTableData" highlight-current-row fit border @row-click="changeSelectLeftTableData" row-key="id">
              <v-table-column width="35">
                <template slot-scope="scope">
                  <el-radio :label="scope.row.diagnoseCode" v-model="selectLeftTableDataCode"
                            @change.native.stop="changeSelectLeftTableData(scope.$index,scope.row)"></el-radio>
                </template>
              </v-table-column>
              <v-table-column prop="diagnoseCode" label="诊断编码"></v-table-column>
              <v-table-column prop="diagnoseName" label="诊断名称"></v-table-column>
              <v-table-column label="操作" width="40">
                <template slot-scope="scope">
                  <el-button v-hasPermi="['configuration:basicSettings:diagConcernConfig']" @click.native.prevent="leftEnableOrDisable(scope.row)"
                             type="text" size="small" :style="{ color: scope.row.statusDict == 1 ? '#EC0000': '#00AB44' }">
                    {{+scope.row.statusDict ? '禁用' : '启用' }}</el-button>
                </template>
              </v-table-column>
            </el-table>

            <el-footer>
          <el-pagination  @current-change="changeDiagData" :current-page="leftQueryData.pageNum"
                         :total="leftDataTotal" :page-size="leftQueryData.pageSize" :hide-on-single-page="false" layout="total, prev, pager, next"
                         class="pagination" background></el-pagination>
        </el-footer>
          </div>
        </el-main>
      </el-container>
    </div>
    <!-- ICU病区-右边部分 -->
    <div class="rightDiv" ref="rightDiv">
      <el-container style="height:100%">
        <!-- 右边头部 -->
        <el-header>
          <i class="iconBlue"></i>
          <span>关注项</span>
        </el-header>
        <el-main>
          <!-- 右边输入栏 -->
          <el-header>
            <div>
              <el-input size="small" @input="debounceSearchRight" @keyup.enter.native.prevent.stop="debounceSearchRight()" placeholder="监护项编码/监护项名称"
                        clearable suffix-icon="el-icon-search" v-model="rightQueryData.searchKey"></el-input>
            </div>
            <div>
              <el-button class="queryButton" type="primary" @click.native.prevent="()=>changePagination()" :disabled="selectLeftTableData===null">查询
              </el-button>
              <el-button class="queryButton" type="primary" @click.native.prevent="addMoniItem" :disabled="selectLeftTableData===null">添加关注项
              </el-button>
            </div>
          </el-header>
          <!-- 右边表格 -->
          <div style="height:calc(100% - 42px);">
            <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" ref="table1" height="100%" :data="rightTableData" highlight-current-row fit border row-key="id" @row-click="rightSelectRow">
              <v-table-column label="监护项编码" key="moniitemCode" align="center" width="150px">
                <template slot-scope="scope">
                  <span>{{scope.row.moniitemCode}}</span>
                </template>
              </v-table-column>
              <v-table-column label="监护项名称" key="moniitemName" align="center" width="150px">
                <template slot-scope="scope">
                  <v-select-mon filterable v-if="scope.row.isCreate" clearable @visible-change="seleceChangeFn($event,scope.row)"
                                v-model="scope.row.moniitemCode" :options="moniitem_List">
                  </v-select-mon>
                  <span v-else>{{scope.row.moniitemName}}</span>
                </template>
              </v-table-column>
              <v-table-column label="监护项说明" key="moniitemDesc" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.moniitemDesc}}</span>
                </template>
              </v-table-column>
              <v-table-column label="分组编码" key="groupCode" align="center">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.isEdit||scope.row.isCreate" v-model="scope.row.groupCode" placeholder="请输入" clearable filterable
                            :disabled="!(scope.row.isEdit||scope.row.isCreate)" type="text">
                  </el-input>
                  <span v-else>{{scope.row.groupCode}}</span>
                </template>
              </v-table-column>
              <v-table-column label="分组名称" key="groupName" align="center">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.isEdit||scope.row.isCreate" v-model="scope.row.groupName" placeholder="请输入" clearable filterable
                            :disabled="!(scope.row.isEdit||scope.row.isCreate)" type="text">
                  </el-input>
                  <span v-else>{{scope.row.groupName}}</span>
                </template>
              </v-table-column>
              <v-table-column label="排序" key="sortNo" align="center">
                <template slot-scope="scope">
                  <el-input type="number" v-if="scope.row.isEdit||scope.row.isCreate" v-model="scope.row.sortNo" placeholder="请输入"></el-input>
                  <span v-else>{{scope.row.sortNo}}</span>
                </template>
              </v-table-column>
              <v-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button v-hasPermi="['configuration:basicSettings:diagConcernConfig']" v-if="!scope.row.isEdit" type="text"
                             @click="updateItemRow(scope.row, scope.$index)">修改</el-button>
                  <el-button v-hasPermi="['configuration:basicSettings:diagConcernConfig']" type="text" v-if="scope.row.isEdit===true"
                             @click="cancelItemRow(scope.row)">取消</el-button>
                  <el-button v-hasPermi="['configuration:basicSettings:diagConcernConfig']" type="text" v-if="scope.row.isEdit===true"
                             @click="saveItemRow(scope.row)">保存</el-button>
                  <el-button v-if="!scope.row.isCreate" v-hasPermi="['configuration:basicSettings:diagConcernConfig']" type="text"
                             @click="rightEnableOrDisable(scope.row)" style="color:red">
                        删除
                  </el-button>
                  <!-- <el-button v-if="!scope.row.isCreate" v-hasPermi="['configuration:basicSettings:diagConcernConfig']" type="text"
                             @click="rightEnableOrDisable(scope.row)" :style="+scope.row.statusDict ? 'color:#E6A23C':'color:#67C23A'">
                    {{+scope.row.statusDict ? '禁用' : '启用' }}
                  </el-button> -->
                </template>
              </v-table-column>
            </el-table>
          </div>
        </el-main>
        <!-- 右边底部翻页 -->
        <el-footer>
          <el-pagination @size-change="changePagination" @current-change="changePagination" :current-page="rightQueryData.pageNum"
                         :total="rightTotolCount" :page-size="rightQueryData.pageSize" :hide-on-single-page="false" layout="total, prev, pager, next"
                         class="pagination" background></el-pagination>
        </el-footer>
      </el-container>
    </div>
    <!-- 添加诊断弹框 -->
    <el-dialog title="添加诊断" :visible.sync="diagnosisDialog" :before-close="diagnosisClose" width="480px">
      <el-header class="elHeader3">
        <div class="headerLeft">
          <el-input size="mini" v-model="addForm.searchKey" placeholder="诊断编码/诊断名称" clearable suffix-icon="el-icon-search" style="width:240px;"
                    @input="debounceSearchAdd">
          </el-input>
        </div>
      </el-header>
      <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" ref="hisDiagnosisData" :data="hisDiagnosisData" highlight-current-row fit border row-key="id" size="mini"
                @selection-change="handleSelectionChange" height="50vh">
        <v-table-column type="selection" width="55"></v-table-column>
        <v-table-column prop="diagnoseCode" width="90" label="诊断编码"></v-table-column>
        <v-table-column prop="diagnoseName" label="诊断名称"></v-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="diagnosisClose">取消</el-button>
        <el-button type="primary" @click="handleBatchSaveConcernDiag">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  dictItem_findWithPage, // 查询字典集合
  moniitem_multipleListPage, // 监护项查询
  diag_findWithPage, // his诊断信息
  concernDiag_findAllWithPage, // 关注诊断配置 - 批量新增诊断
  concernDiag_deleteById, // 关注诊断配置 - 删除诊断
  concernDiag_batchInsert, // 关注诊断配置 - 分页获取诊断
  diagMoniitem_edit, // 修改诊断关注项
  diagMoniitem_deleteById, //  诊断关注项 - 删除关注项
  diagMoniitem_batchInsert, // 诊断关注项 - 批量新增关注项
  diagMoniitem_findAllWithPage, // 诊断关注项 - 分页获取关注项
  diagMoniitem_getMaxSort
} from '@/api/configuration'
import { debounce } from 'lodash'
export default {
  name: 'ConcernsConfig',
  components: {},
  data: function () {
    return {
      loading: false, // 加载
      // 诊断查询
      leftQueryData: {
        statusDict: '',
        searchKey: '',
        pageNum: 1, // 页码
        pageSize: 10// 一页多少条
      },
      leftDataTotal: 0,
      // 右边 表头
      rightQueryData: {
        searchKey: '',
        pageNum: 1, // 页码
        pageSize: 10// 一页多少条
      }, // 右边请求对象
      rightTotolCount: 0, // 右边总条数翻页
      rightTableData: [], // 页面表格列表数据
      moniitem_List: [], // 监护数据字典集合
      dictMonitypeList: [], // 监护数据显示分组字典
      leftTableData: [], // 左边表格数据,
      selectLeftTableDataCode: '', // 选中表格的编码
      selectLeftTableData: null, // 左边表格选中的数据
      diagnosisDialog: false, // his诊断对话框
      hisDiagnosisData: [], // His的诊断数据
      hisDiagnosisSelection: [], // 选中的HIS诊断数据
      currRow: [], // 当前行
      // 添加诊断
      addForm: {
        searchKey: ''
      }
    }
  },
  props: {},
  watch: {},
  computed: {
  },
  async created() {
    this.getConcernDiagnoisData()
    this.getHisDiagnosisData()
    this.dictMonitypeList = await this.getDictItemList('ICIS_DICT_MONI_TYPE')
    const moniitem_List = await moniitem_multipleListPage({ statusDict: '1' })
    this.moniitem_List = moniitem_List.data.result
  },
  mounted() {
  },
  methods: {
    debounceSearch() {
      this.debounceSearchSymbol = this.debounceSearchSymbol ? this.debounceSearchSymbol : debounce(function () {
        this.getConcernDiagnoisData()
      }, 200)
      this.debounceSearchSymbol()
    },
    debounceSearchRight() {
      this.debounceSearchRightSymbol = this.debounceSearchRightSymbol ? this.debounceSearchRightSymbol : debounce(function () {
        this.changePagination()
      }, 200)
      this.debounceSearchRightSymbol()
    },
    debounceSearchAdd() {
      this.debounceSearchAddSymbol = this.debounceSearchAddSymbol ? this.debounceSearchAddSymbol : debounce(function () {
        this.getHisDiagnosisData()
      }, 200)
      this.debounceSearchAddSymbol()
    },
    /**
     * 分页获取所有诊断
     */
    getHisDiagnosisData() {
      const query = {
        searchKey: this.addForm.searchKey
      }
      diag_findWithPage(query).then(res => {
        this.hisDiagnosisData = res.data.result
      })
    },

    /**
     * 获取关注诊断
     */
    getConcernDiagnoisData(num) {
      this.leftQueryData.pageNum = num || 1
      const param = Object.assign({}, this.leftQueryData)
      concernDiag_findAllWithPage(param).then(res => {
        this.leftTableData = res.data.result
        this.leftDataTotal = res.data.totolCount
        if (this.leftTableData.length > 0) {
          this.selectLeftTableData = this.leftTableData[0]
          this.selectLeftTableDataCode = this.leftTableData[0].diagnoseCode
          this.changePagination(1)
        }
      })
    },
    /**
     * 翻页
     */
    changeDiagData(num) {
      this.getConcernDiagnoisData(num)
    },
    /**
     * 左边区域-- 添加诊断
     */
    addDiagnosis() {
      this.diagnosisDialog = true
    },
    /**
     * 左边区域-- 多选诊断
    */
    handleSelectionChange(val) {
      this.hisDiagnosisSelection = val
    },
    // 批量保存关注诊断
    handleBatchSaveConcernDiag() {
      if (this.hisDiagnosisSelection.length === 0) {
        return
      }
      const param = this.hisDiagnosisSelection
      concernDiag_batchInsert(param).then(res => {
        this.getConcernDiagnoisData()
        this.diagnosisClose()
      })
    },
    /**
     * 启用禁用-关注诊断
     */
    leftEnableOrDisable(record) {
      concernDiag_deleteById({
        diagnoseCode: record.diagnoseCode,
        statusDict: record.statusDict == '1' ? '0' : '1'
      }).then(res => {
        this.getConcernDiagnoisData() // 请求
        this.$message({
          type: 'success',
          message: +record.statusDict ? '已禁用' : '已启用'
        })
      })
    },
    /**
     * 左边区域-- 单选
     */
    changeSelectLeftTableData(row) {
      this.selectLeftTableData = row
      this.selectLeftTableDataCode = row.diagnoseCode
      this.changePagination(1)
    },
    /**
     * 右边区域-- 选择行
     */
    rightSelectRow(row) { },
    /**
     * 右边区域-- 翻页
     */
    changePagination(num) {
      if (num) {
        this.rightQueryData.pageNum = num
      }

      this.finddiagMoniitem()
    },

    /**
     * 弹框 --添加诊断弹框
     */
    diagnosisClose() {
      this.diagnosisDialog = false
    },
    /**
     * 弹框 --添加关注项
     */
    concernsClose() {
      this.concernsDialog = false
    },
    // 获取字典列表
    getDictItemList(dictGroupCode) {
      return new Promise((resolve, reject) => {
        const query = {
          dictGroupCode: dictGroupCode,
          pageSize: 100,
          pageNum: 1
        }
        dictItem_findWithPage(query).then(res => {
          if (!(res.data && res.data.result)) {
            reject([])
          }
          resolve(res.data.result)
        })
      })
    },
    seleceChangeFn(e, row) {
      if (e === false) {
        const sure = this.moniitem_List.filter(v => v.moniitemCode == row.moniitemCode)
        if (sure.length >= 1) {
          row.moniitemCode = sure[0].moniitemCode
          row.moniitemName = sure[0].moniitemName
          row.moniitemDesc = sure[0].moniitemDesc
          this.rightTableData = JSON.parse(JSON.stringify(this.rightTableData))
        }
      }
    },

    // 查询诊断关注项集合
    finddiagMoniitem() {
      const param = {
        ...this.rightQueryData,
        'diagnoseCode': this.selectLeftTableData.diagnoseCode
      }
      diagMoniitem_findAllWithPage(param).then(res => {
        this.rightTableData = res.data.result
        this.rightTotolCount = res.data.totolCount
      })
    },

    // 新增一行
    async addMoniItem() {
      if (this.rightTableData.length > 0) {
        const first = this.rightTableData[0]
        if (first.isCreate) {
          return
        }
      }
      const sortNo = await this.getMaxSort()
      const row = {
        'isCreate': true,
        'isEdit': true,
        'diagnoseCode': this.selectLeftTableData.diagnoseCode,
        'diagnoseName': this.selectLeftTableData.diagnoseName,
        'moniitemCode': '',
        'moniitemName': '',
        'moniitemDesc': '',
        'groupCode': '',
        'groupName': '',
        'sortNo': sortNo
      }
      this.rightTableData.unshift(row)
    },
    getMaxSort() {
      return new Promise((resolve, reject) => {
        diagMoniitem_getMaxSort(this.selectLeftTableData.diagnoseCode).then(res => {
          resolve(res.data)
        })
      })
    },
    // 修改监护项
    updateItemRow(row, index) {
      this.currRow[index] = { ...row }
      row.isEdit = true
      this.rightTableData = JSON.parse(JSON.stringify(this.rightTableData))
    },
    // 取消行的编辑状态
    cancelItemRow(row, index) {
      if (row.isCreate) {
        this.rightTableData = this.rightTableData.filter(item => {
          return item != row
        })
      } else {
        row.isEdit = false
        this.rightTableData = JSON.parse(JSON.stringify(this.rightTableData))
        this.rightTableData[index] = this.currRow[index]
      }
    },
    // 保存数据
    saveItemRow(row) {
      const promise = row.isCreate ? diagMoniitem_batchInsert([row]) : diagMoniitem_edit(row)
      promise.then(res => {
        if (res.code == 0) {
          if (row.isCreate) {
            this.changePagination()
          } else {
            row.isEdit = false
            this.changePagination()
          }
        }
      })
    },
    // 启用禁用-选中的行
    rightEnableOrDisable(row) {
      this.$confirm('您确定要删除吗？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        diagMoniitem_deleteById({
          diagnoseCode: row.diagnoseCode || '',
          moniitemCode: row.moniitemCode || '',
          statusDict: row.statusDict == '1' ? '0' : '1'
        }).then(res => {
          this.$message.success('删除成功！')
          this.changePagination()
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法

.concernsConfig {
  display: flex;
  padding: 1%;
  height: 100%;
  background: #fff;

  .leftDiv {
    width: 350px;
    padding-right: 15px;
    border-right: 1.5px solid #eee;
    margin-right: 15px;
  }
  .rightDiv {
    width: calc(100% - 366px);
    ::v-deep.el-container {
      height: 100%;
    }
  }
}
</style>
