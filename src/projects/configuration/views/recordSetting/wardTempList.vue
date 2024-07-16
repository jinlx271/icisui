<!-- 评估表配置 -->
<template>
  <div id="evaluationFormConfig" class="evaluationFormConfig" element-loading-text="加载中" v-loading="loading">
    <!-- 左侧内容 -->
    <el-container class="evaluationFormConfig_left">
      <el-header>
        <i class="iconBlue"></i>
        <span>ICU病区</span>
      </el-header>
      <el-main>
        <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" :show-header="false" :data="workSapces" ref="workSapces" @row-click="changeTableLeft" fit highlight-current-row>
          <v-table-column prop="wardName" :show-overflow-tooltip="true"></v-table-column>
        </el-table>
      </el-main>
    </el-container>
    <!-- 中间内容 -->
    <el-container class="evaluationFormConfig_center">
      <el-header>
        <i class="iconBlue"></i>
        <span>文书模板列表</span>
      </el-header>
      <el-main style="height: calc(100% - 60px)">
        <div class="queryDiv flex-between">
          <div  class="flex align-items-center ">
            <el-input v-model="centerQueryData.searchKey" size="small" clearable placeholder="模板名称" suffix-icon="el-icon-search" style="margin-right:20px;"></el-input>
            <el-checkbox v-model="centerQueryData.statusDict" true-label="" false-label="1"  >
                    显示禁用
            </el-checkbox>
          </div>
          <el-button @click.native.prevent="addTable" type="primary" size="mini">新增</el-button>
        </div>
        <el-container style="height: calc(100% - 42px)">
          <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" ref="centerTableData" :row-class-name="({row}) => row.statusDict == 0 ? 'disabled' : ''" :data="filterDatas" height="100%" border highlight-current-row width="100%" >
            <!-- <v-table-column label="模板编码" prop="formCode"></v-table-column> -->
            <v-table-column label="文书排序" prop="sortNo">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.sortNo" placeholder="请输入" v-if="scope.row.isEdit" :min="1"></el-input-number>
                <span v-else>{{scope.row.sortNo}}</span>
              </template>
            </v-table-column>
            <v-table-column label="模板名称" prop="tempName"></v-table-column>
            <!-- <v-table-column label="模板说明" prop="remark"></v-table-column> -->
            <!-- <v-table-column label="页数" prop="tempPageNum" width="80"></v-table-column> -->
            <v-table-column label="操作" width="120">
              <template slot-scope="scope">
                <el-button @click.native.prevent="enableOrDisable(scope.row,scope.$index)"
                          :style="{ color: scope.row.statusDict == 1 ? '#EC0000': '#00AB44' }" type="text" size="mini">
                  {{+scope.row.statusDict ? '禁用' : '启用' }}</el-button>
                <el-button v-if="!scope.row.isEdit" type="text"  @click="updateItemRow(scope.row, scope.$index)">修改</el-button>
                <el-button  type="text" v-if="scope.row.isEdit===true" @click="cancelRowEdit(scope.row)">取消</el-button>
                <el-button type="text" v-if="scope.row.isEdit===true" @click="saveItemRow(scope.row, scope.$index)">保存</el-button>

              </template>
            </v-table-column>
          </el-table>
      </el-container>
      </el-main>

    </el-container>

    <!-- 左侧新增的弹框 -->
    <el-dialog :close-on-click-modal="false" title="新增文书模板" :visible.sync="dialogVisible" width="750px" :before-close="hideDialog">
      <div v-if="dialogShow" class="add">
        <el-input  v-model="dialogQueryData.searchKey" size="small" clearable
                  placeholder="模板名称" suffix-icon="el-icon-search"></el-input>
        <el-table @select-all="handleCheckedDialogData" @select="handleCheckedDialogData" @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" :data="filterDialogData" border ref="dialogTable" @selection-change="handleSelectionChange">
          <v-table-column type="selection" width="50" :selectable='checkboxT'></v-table-column>
          <v-table-column label="模板名称" prop="tempName"></v-table-column>
          <v-table-column label="页数" prop="tempPageNum"></v-table-column>
        </el-table>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="hideDialog">取消</el-button>
        <el-button type="primary" @click="confirmData">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  icuWard_findWithPage, // 病区获取
  dictItem_findWithPage
} from '@/api/configuration'
import {
  getTmpDocConfigList,
  insertTmpDocWard,
  getAllDocWardListByWardCode,
  deleteTmpDocWardById,
  updateTmpDocWardById
} from '@/api/anas'
import _ from 'lodash'
import { mapGetters } from 'vuex'
export default {
  name: 'EvaluationFormConfig',
  components: {},
  data: function () {
    return {
      loading: false, // 表格的loding
      wardCode: '', // 选择的病区
      wardName: '',
      workSapces: [], // 病区集合

      centerQueryData: {
        statusDict: '',
        pageNum: 1,
        pageSize: 15,
        searchKey: '', // input输入类容
        wardCode: '' // 病区编码
      },
      totolCount: 0, // 分页总量
      centerTableData: [], // 中间表格数据
      sortNoList: [
        { label: 1, value: 1 },
        { label: 2, value: 2 },
        { label: 3, value: 3 },
        { label: 4, value: 4 },
        { label: 5, value: 5 },
        { label: 6, value: 6 },
        { label: 7, value: 7 },
        { label: 8, value: 8 }
      ],

      dialogVisible: false, // 新增表单框显示隐藏
      dialogShow: true, // 新增列表 |配置风险评估
      dialogQueryData: {
        wardCode: '', // 病区编码
        searchKey: '' // input输入类容
      }, // 新增弹框的对象
      dialogData: [], // 新增表单弹框集合
      configureList: [], // 配置风险评估集合
      riskList: [], // 风险等级字典
      rightTableData: [], // 右边表格数据
      selectTempList: [],
      isEditStatus: false,
      curRow: null,
      filterDialogData: []
    }
  },
  props: {},
  watch: {
    'dialogQueryData.searchKey': {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.filterDialogData = this.dialogData.filter(item => item.tempName.indexOf(newVal) !== -1)
        } else {
          this.filterDialogData = this.dialogData
        }
        this.filterDialogData.map(item => {
          this.$nextTick(() => {
            this.$refs.dialogTable.toggleRowSelection(item, item.isChecked || false)
          })
          return item
        })
      }
    }
  },
  computed: {
    ...mapGetters(['currentUserWard', 'userInfo']),
    filterDatas() {
      return this.centerTableData.filter(item => {
          let statusFlag = true
          let flag = true
          if (this.centerQueryData.statusDict != '') {
            statusFlag = item.statusDict == this.centerQueryData.statusDict
          }
          if (this.centerQueryData.searchKey != '') {
            flag = item.tempName.indexOf(this.centerQueryData.searchKey) > -1
          }
          return statusFlag && flag
        })
    }
  },
  async created() {
    // 截流
    this.debounceFC = _.debounce(() => {
      this.centerQueryData.pageNum = 1 // 输入的时候需要改为第一页
      this.init() // 输入框截流
    }, 800)
    // 截流
    this.debounceFC2 = _.debounce(() => {
      this.queryDialogFc() // 输入框截流
    }, 800)

    this.init()
  },
  mounted() { },
  methods: {
    // 初始化//////////////////////////
    /**
     * 初始化
     */
    init() {
      // 获取病区
      icuWard_findWithPage({
        pageNum: 1,
        pageSize: 1000,
        searchKey: '',
        userName: this.userInfo.userName == 'admin' ? '' : this.userInfo.userName
      }).then(res => {
        this.workSapces = res.data.result
        // 默认选第一个
        this.$nextTick(req => {
          if (this.workSapces && this.workSapces.length > 0) {
            this.workSapces.map(item => {
              if (item.wardCode == this.currentUserWard.wardCode) {
                this.$refs.workSapces.setCurrentRow(item) // 默认点击第一个 样式
                this.changeTableLeft(item) // 默认点击第一个 数据交互
              }
            })
          }
        })
      })
    },
    /**
     * 获取对应字典项
     */
    getDictItems(dictGroupCode) {
      return new Promise((resolve, reject) => {
        dictItem_findWithPage({
          dictGroupCode: dictGroupCode,
          pageSize: 100,
          pageNum: 1
         }).then(res => {
          if (res.code == 0 && res.data.result.length > 0) {
            resolve(res.data.result)
          } else {
            reject([])
          }
        })
      })
    },
    /**
     * 风险字典匹配
     */
    riskFc(val) {
      return this.riskList.filter(res => {
        return res.dictCode == val
      })[0].dictName
    },
    // 左边//////////////////////////
    /**
     * 左表格-病区选择
     */
    changeTableLeft(e) {
      this.wardCode = e.wardCode
      this.wardName = e.wardName
      this.centerQueryData.wardCode = e.wardCode
      this.queryCenterTable() // 获取中间表数据
    },
    /**
     * 获取中间表数据
     */
    queryCenterTable() {
      // 中间列表
      const query = {
        wardCode: this.wardCode
      }
      getAllDocWardListByWardCode(query).then(res => {
        this.centerTableData = res.data// 中间表格数据集合
      })
    },

    getTempList() {
      getTmpDocConfigList({
        tempType: 1
      }).then(res => {
        this.dialogData = res.data.map(item => {
          item.isSelect = false
          item.isChecked = false
          return item
        })
        this.$nextTick(() => {
          this.showCurrWardInfo()
        })
      })
    },
    // 中间//////////////////////////
    /**
     * 中表格-新增
     */
    addTable() {
      this.dialogVisible = true
      if (this.dialogData.length == 0) {
        this.getTempList()
      } else {
        this.showCurrWardInfo()
      }
    },
    /**
     * 启用禁用
     */
    enableOrDisable(row, index) {
      if (!row.id) {
        this.$message({
          type: 'error',
          message: '请先保存'
        })
        return
      }
      deleteTmpDocWardById({
        id: row.id,
        statusDict: row.statusDict == '1' ? '0' : '1'
      }).then(res => {
        this.$message({
          type: 'success',
          message: +row.statusDict ? '已禁用' : '已启用'
        })
        this.queryCenterTable()
      })
    },
    /**
     * 回显当前病区的模板列表
     */
    showCurrWardInfo() {
      this.filterDialogData = this.dialogData.map(item => {
        const result = this.centerTableData.filter(row => row.tempId == item.id)

        if (result.length > 0) {
          item.isSelect = true
          item.isChecked = true
          item.sortNo = result[0].sortNo
          item.statusDict = result[0].statusDict
        } else {
          item.isSelect = false
          item.isChecked = false
          delete item.sortNo
        }
        return item
      })
      this.filterDialogData.map(item => {
        this.$nextTick(() => {
          this.$refs.dialogTable.toggleRowSelection(item, item.isChecked || false)
        })
        return item
      })
    },
    /**
     * 是否禁用
     */
    checkboxT(row) {
      return !row.isSelect
    },
    /**
     * 中间表格-修改
     */
    updateRow(item, index) {
      item.updateOrSave = false
    },
    /**
     * 中间表格-保存
     */
    saveRow(item, index) {

    },

    /**
     * 弹框-新增表单的-隐藏
     */
    hideDialog() {
      this.dialogVisible = false
      this.dialogQueryData.searchKey = ''
      this.$refs.dialogTable?.clearSelection()
    },
    /**
     * 确定保存对应病区的数据
     */
    confirmData() {
      const query = this.dialogData.filter(item => item.isSelect || item.isChecked).map(item => {
        return {
          wardCode: this.wardCode,
          wardName: this.wardName,
          tempId: item.id,
          tempName: item.tempName,
          statusDict: item.statusDict,
          sortNo: item.sortNo
        }
      })
      insertTmpDocWard(query).then(res => {
        this.$message({
          type: 'success',
          message: '新增成功'
        })
        this.queryCenterTable() // 去拿取中间表单数据
        this.hideDialog()
      })
    },
    handleSelectionChange(e) {
      this.selectTempList = e
    },
    /**
     * 修改行数据
     */
    updateItemRow(row, index) {
      if (this.isEditStatus) {
        this.$message({
          type: 'info',
          message: '请完成当前编辑'
        })
        return
      }
      this.isEditStatus = true
      this.curRow = { ...row }
      row.isEdit = true
      this.centerTableData = [...this.centerTableData]
    },
    /**
     * 保存当前行
     */
    saveItemRow(row, index) {
      const query = {
        id: row.id,
        sortNo: row.sortNo
      }
      updateTmpDocWardById(query).then(res => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.isEditStatus = false
        row.isEdit = false
        this.queryCenterTable() // 获取中间表数据
      })
    },
    /**
     * 取消编辑
     */
    cancelRowEdit(row) {
      row.isEdit = false
      let listIndex
      this.centerTableData.forEach((item, index) => {
        if (item.id == row.id) listIndex = index
      })

      this.isEditStatus = false
      this.centerTableData[listIndex] = { ...this.curRow }
      this.centerTableData = [...this.centerTableData]
    },
    handleCheckedDialogData(selection, row) {
      const checkedIdArr = selection.map(item => item.id)
      const filterIdArr = this.filterDialogData.map(item => item.id)
      this.filterDialogData.map(item => {
        this.$nextTick(() => {
          this.$refs.dialogTable.toggleRowSelection(item, checkedIdArr.includes(item.id))
        })
        item.isChecked = checkedIdArr.includes(item.id) || item.isChecked
        return item
      })
      this.dialogData.map(item => {
        if (row && item.id == row.id) {
          item.isChecked = checkedIdArr.includes(item.id)
        } else if (row == undefined && !item.isSelect && filterIdArr.includes(item.id)) {
          item.isChecked = checkedIdArr.includes(item.id)
        }
        return item
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.evaluationFormConfig {
  background: #ffffff;
  height: 100%;
  display: flex;
  padding: 1%;
  ::v-deep.el-header {
    display: flex;
    align-items: center;
    margin: 0;
    padding: 0;
    .iconBlue {
      display: inline-block;
      width: 3px;
      height: 16px;
      background: var(--maincolor);
    }
    span {
      flex: 1;
      margin-left: 8px;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #000000;
    }
  }
  &_left {
    flex: 1;
    padding-right: 10px;
    border-right: 2px solid #eee;
    margin-right: 10px;
    ::v-deep.el-main {
      margin: 0;
      padding: 0;
      .el-table td {
        border: 0;
        border-radius: 5px;
        padding-left: 5px;
      }
      .el-table::before {
        height: 0;
      }
    }
  }
  &_center {
    height: 100%;
    flex: 5;
    margin-right: 10px;
    .queryDiv {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      ::v-deep.el-button {
        margin-left: 10px;
      }
      ::v-deep .el-input > .el-input__inner {
        border: none;
        background: #f3f5f9;
        border-radius: 2px;
      }
    }
    ::v-deep.el-main {
      margin: 0;
      padding: 0;
    }
    ::v-deep.el-footer {
      margin: 0;
      padding: 0;
      .el-pagination {
        float: right;
        margin-top: 15px;
      }
    }
  }

  &_right {
    flex: 4;
    ::v-deep.el-main {
      margin: 0;
      padding: 0;
      .el-card__header {
        padding: 10px;
        background: #eef2fd;
        font-size: 15px;
        font-weight: 600;
      }
      .el-card__body {
        padding: 10px;
      }
      .el-table th {
        background: #fff;
      }
      .box-card {
        margin-bottom: 10px;
      }
    }
  }
  ::v-deep.el-dialog {
    padding-bottom: 10px;
    .add {
      .el-input {
        margin: 5px 0;
      }
      .el-table {
        height: 500px;
        overflow: auto;
        border-bottom: 1px solid #e4e7ed;
      }
      .el-table::before {
        height: 0;
      }
    }
    .configure {
      max-height: 500px;
      overflow: auto;
      padding-right: 10px;
      .el-card__header {
        padding: 10px;
        background: #eef2fd;
        font-size: 15px;
        font-weight: 600;
      }
      .el-card__body {
        padding: 10px;
      }
      .el-table th {
        background: #fff;
      }
      .box-card {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
