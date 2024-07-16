<!-- HIS基础数据-检验指标 -->
<template>
  <div class="inspection">
    <el-container class='inspection' element-loading-text="加载中" v-loading="loading">
      <el-container class="lisItem_right">
        <el-header class="lisItem_right_head">
          <div>
            <el-input class="elInput" size="small" placeholder="编码/名称" suffix-icon="el-icon-search" clearable
              v-model="qeuryTableData.searchKey" @keyup.enter.native="rightInputFC" @input="debounceSearch"></el-input>
            <el-checkbox v-model="qeuryTableData.statusDict" true-label="" false-label="1" @change="debounceSearch">
              显示禁用
            </el-checkbox>
          </div>
          <div>
            <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']" class="queryButton" size="small"
              type="primary" @click="showAddInspectionItem">新增检验</el-button>
          </div>
        </el-header>
        <el-main class="lisItem_right_body" style="height:calc(100% - 102px)">
          <el-table :row-class-name="({ row }) => row.statusDict == 0 ? 'disabled' : ''"
            @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
            ref="table" height="100%" :data="tableDataTwo" fit border highlight-current-row style="width: 100%">
            <v-table-column prop="itemCode" label="检验编码"></v-table-column>
            <v-table-column prop="itemName" label="检验名称"></v-table-column>
            <v-table-column prop="statusDict" label="状态" align="center">
              <template slot-scope="scope">
                <el-switch v-if="scope.row.isEdit" v-model="scope.row.statusDict" active-value="1" inactive-value="0"
                  active-text="已启用" inactive-text="已禁用"></el-switch>
                <span v-else>{{+scope.row.statusDict ? '已启用' : '已禁用' }}</span>
              </template>
            </v-table-column>
            <v-table-column label="操作" width="220px" align="center">
              <template slot-scope="scope">
                <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']"
                  @click.native.prevent="modifyRow(scope.$index, scope.row)" type="text" size="small">修改</el-button>
                <!-- <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']" @click.native.prevent="deleteRow(scope.$index, scope.row)"
                           type="text" size="small">删除</el-button> -->
              </template>
            </v-table-column>
          </el-table>
        </el-main>
        <el-footer class="lisItem_right_footer">
          <el-pagination @size-change="changePagination" @current-change="changePagination"
            :current-page="qeuryTableData.pageNum" :hide-on-single-page="false" :page-size="qeuryTableData.pageSize"
            background layout="total, prev, pager, next" style="float:right;margin-top:15px;margin-right:-30px"
            :total="totolCount"></el-pagination>
        </el-footer>
      </el-container>
      <!-- 添加/编辑检验指标 -->
      <el-dialog :title="inspectionItemDialogTitle" :visible.sync="addInspectionItemShow"
        :before-close="addInspectionItemClose" width="420px" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form ref="form" :model="inspectionItemForm" label-width="80px" :rules="rules">
          <el-form-item label="名称" prop="itemName">
            <el-input v-model="inspectionItemForm.itemName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="编码" prop="itemCode">
            <el-input v-model="inspectionItemForm.itemCode" placeholder="请输入"
              :disabled="addOrModifyInspectionItem == 'modify'"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="inspectionItemForm.statusDict">
              <el-radio label="1">启用</el-radio>
              <el-radio label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addInspectionItemClose">取消</el-button>
          <el-button type="primary" @click="confirmAddInspectionItem">保存</el-button>
        </span>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
import {
  lisItem_deleteById,
  lisItem_edit,
  lisItem_findWithPage,
  lisItem_insert
} from '@/api/configuration'
import { debounce } from 'lodash'
export default {
  name: 'Inspection',
  components: {},
  data: function () {
    return {
      // 表格的loding
      loading: false,
      // 表格查询
      qeuryTableData: {
        statusDict: '',
        searchKey: '',
        pageNum: 1,
        pageSize: 15

      },
      // 分页总量
      totolCount: 0,
      // 表格数据
      tableDataTwo: [],
      // 弹窗标题
      inspectionItemDialogTitle: '',
      // 是否显示弹窗
      addInspectionItemShow: false,
      // 检验指标属性
      inspectionItemForm: {
        itemName: '',
        itemCode: '',
        statusDict: '1'
      },
      // 弹窗标记
      addOrModifyInspectionItem: 'add',
      // 检验指标校验规则
      rules: {
        itemName: [
          { required: true, message: '请输入检验名称', trigger: 'blur' }
        ],
        itemCode: [
          { required: true, message: '请输入检验编码', trigger: 'blur' }
        ]
      }
    }
  },
  props: {},
  watch: {},
  computed: {},
  async created() {
    this.init()
  },
  mounted() {
    this.rightInputFC()
  },
  methods: {
    init() {

    },
    // 显示添加检验指标弹窗
    showAddInspectionItem() {
      this.inspectionItemDialogTitle = '添加检验'
      this.addInspectionItemShow = true
      this.addOrModifyInspectionItem = 'add'
    },
    // 关闭添加检验指标弹窗
    addInspectionItemClose() {
      this.addInspectionItemShow = false
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.inspectionItemForm = {
        itemName: '',
        itemCode: '',
        statusDict: '1'
      }
    },
    // 添加/修改检验指标
    confirmAddInspectionItem() {
      const query = this.inspectionItemForm
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.addOrModifyInspectionItem == 'modify') {
            // 编辑
            lisItem_edit(query).then(res => {
              this.addInspectionItemClose()
              if (res.code === 0) {
                this.getInspectionData()
                this.addInspectionItemClose()
              }
            })
          } else {
            // 添加
            lisItem_insert(query).then(res => {
              this.addInspectionItemClose()
              if (res.code === 0) {
                this.getInspectionData(1)
                this.addInspectionItemClose()
              }
            })
          }
        }
      })
    },
    // 修改检验指标
    modifyRow(index, row) {
      this.inspectionItemDialogTitle = '修改检验'
      this.addInspectionItemShow = true
      this.addOrModifyInspectionItem = 'modify'
      this.inspectionItemForm = { ...row }
    },
    // 设置启用
    setStatusInspection(index, row) {
      this.inspectionItemForm = row
      this.inspectionItemForm.statusDict = this.inspectionItemForm.statusDict ^ 1
      this.confirmAddInspectionItem()
    },
    // 删除检验指标
    deleteRow(index, row) {
      this.$confirm('您确定要删除吗？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const query = row.itemCode
        lisItem_deleteById(query).then(res => {
          this.getInspectionData(1)
        })
      })
    },
    changePagination(pageNum) {
      this.getInspectionData(pageNum)
    },
    /**
     * 右边按钮事件
     */
    rightInputFC() {
      this.getInspectionData(1)
    },
    debounceSearch() {
      this.debounceSearchSymbol = this.debounceSearchSymbol ? this.debounceSearchSymbol : debounce(function () {
        this.getInspectionData(1)
      }, 200)
      this.debounceSearchSymbol()
    },
    getInspectionData(page) {
      if (page) {
        this.qeuryTableData.pageNum = page
      }
      this.loading = true
      lisItem_findWithPage(this.qeuryTableData).then(res => {
        this.loading = false
        if (!(res.data && res.data.result)) {
          return
        }
        this.tableDataTwo = res.data.result // 列表数据
        this.totolCount = res.data.totolCount // 总条数
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/config-common.scss';

.lisItem_right {
  height: 100%;
}
</style>
<style lang="scss" scoped>
.inspection {
  background: #ffffff;
  height: 100%;
  display: block;
}

.inspection {
  // height: calc(100% - 60px);
  height: 100%;

  &_left {
    &_div {
      height: 100%;
    }

    &_main {
      .groupName {
        display: flex;
        align-items: center;

        .name {
          flex: 1;
        }

        .handler {
          width: 68px;
          display: flex;
        }
      }

      padding: 0;
      background: #f0f4ff;

      &_table {
        border: none;
        background: none;
        padding-top: 8px;

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
              font-size: 14px;
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
  }
}
</style>
