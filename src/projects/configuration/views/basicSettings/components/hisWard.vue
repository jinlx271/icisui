<!-- HIS基础数据-病区 -->
<template>
  <div class="ward">
    <el-container class='ward' element-loading-text="加载中" v-loading="loading">
      <el-container class="ward_right">
        <el-header class="ward_right_head">
          <div class="flex align-items-center">
            <el-input class="elInput" size="small" placeholder="值/值含义" suffix-icon="el-icon-search" clearable v-model="qeuryTableData.searchKey"
                      @keyup.enter.native="rightInputFC" @input="debounceSearch"></el-input>

            <el-checkbox v-model="qeuryTableData.statusDict" true-label="" false-label="1" @change="debounceSearch" >
                显示禁用
            </el-checkbox>
          </div>

          <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']" class="queryButton" size="small" type="primary"
                       @click="showAddWardItem">添加病区</el-button>

        </el-header>
        <el-main style="height:calc(100% - 102px)" class="ward_right_body">
          <el-table :row-class-name="({row}) => row.statusDict == 0 ? 'disabled' : ''" @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)"  ref="table"  height="100%" :data="tableDataTwo" fit border highlight-current-row  style="width: 100%;">
            <v-table-column prop="wardCode" label="病区编码"></v-table-column>
            <v-table-column prop="wardName" label="病区名称"></v-table-column>
            <v-table-column prop="pinyin" label="拼音"></v-table-column>
            <v-table-column prop="wubi" label="五笔"></v-table-column>
            <v-table-column prop="statusDict" label="状态" align="center">
              <template slot-scope="scope">
                <el-switch v-if="scope.row.isEdit" v-model="scope.row.statusDict" active-value="1" inactive-value="0" active-text="已启用"
                           inactive-text="已禁用"></el-switch>
                <span v-else>{{+scope.row.statusDict ? '已启用' : '已禁用' }}</span>
              </template>
            </v-table-column>
            <v-table-column label="操作" width="220px" align="center">
              <template slot-scope="scope">
                <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']" @click.native.prevent="modifyRow(scope.$index, scope.row)"
                           type="text" size="small">修改</el-button>
                <!-- <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']" @click.native.prevent="deleteRow(scope.$index, scope.row)"
                           type="text" size="small">删除</el-button> -->
              </template>
            </v-table-column>
          </el-table>
        </el-main>
        <el-footer class="ward_right_footer">
          <el-pagination @size-change="changePagination" @current-change="changePagination" :current-page="qeuryTableData.pageNum"
                         :page-size="qeuryTableData.pageSize" background layout="total, prev, pager, next"
                         style="float:right;margin-top:15px;margin-right:-30px" :total="totolCount"></el-pagination>
        </el-footer>
      </el-container>
      <!-- 添加/编辑病区 -->
      <el-dialog :title="wardItemDialogTitle" :visible.sync="addWardItemShow" :before-close="addWardItemClose" width="420px"
                 :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form ref="form" :model="wardItemForm" label-width="80px" :rules="rules">
          <el-form-item label="名称" prop="wardName">
            <el-input v-model="wardItemForm.wardName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="编码" prop="wardCode">
            <el-input v-model="wardItemForm.wardCode" placeholder="请输入" :disabled="addOrModifyWardItem =='modify'"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="wardItemForm.statusDict">
              <el-radio label="1">启用</el-radio>
              <el-radio label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addWardItemClose">取消</el-button>
          <el-button type="primary" @click="confirmAddWardItem">保存</el-button>
        </span>
      </el-dialog>
    </el-container>
  </div>

</template>

<script>
import {
  ward_deleteById,
  ward_edit,
  ward_findWithPage,
  ward_insert
} from '@/api/configuration'
import { debounce } from 'lodash'
export default {
  name: 'Ward',
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
        pageSize: 10

      },
      // 分页总量
      totolCount: 0,
      // 表格数据
      tableDataTwo: [],
      // 弹窗标题
      wardItemDialogTitle: '',
      // 是否显示弹窗
      addWardItemShow: false,
      // 病区属性
      wardItemForm: {
        wardName: '',
        wardCode: '',
        statusDict: '0'
      },
      // 弹窗标记
      addOrModifyWardItem: 'add',
      // 病区校验规则
      rules: {
        wardName: [
          { required: true, message: '请输入病区名称', trigger: 'blur' }
        ],
        wardCode: [
          { required: true, message: '请输入病区编码', trigger: 'blur' }
        ]
      }
    }
  },
  props: {},
  watch: {},
  computed: {},
  created() {
    this.init()
  },
  mounted() {
    this.rightInputFC()
  },
  methods: {
    init() {

    },
    // 显示添加病区弹窗
    showAddWardItem() {
      this.wardItemDialogTitle = '添加病区'
      this.addWardItemShow = true
      this.addOrModifyWardItem = 'add'
    },
    // 关闭添加病区弹窗
    addWardItemClose() {
      this.addWardItemShow = false
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.wardItemForm = {
        wardName: '',
        wardCode: '',
        statusDict: '0'
      }
    },
    // 添加/修改病区
    confirmAddWardItem() {
      const query = this.wardItemForm
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.addOrModifyWardItem == 'modify') {
            // 编辑
            ward_edit(query).then(res => {
              this.addWardItemClose()
              if (res.code === 0) {
                this.getWardData()
                this.addWardItemClose()
              }
            })
          } else {
            // 添加
            ward_insert(query).then(res => {
              this.addWardItemClose()
              if (res.code === 0) {
                this.getWardData(1)
                this.addWardItemClose()
              }
            })
          }
        }
      })
    },
    // 修改病区
    modifyRow(index, row) {
      this.wardItemDialogTitle = '修改病区'
      this.addWardItemShow = true
      this.addOrModifyWardItem = 'modify'
      this.wardItemForm = { ...row }
    },
    // 设置启用
    setStatusWard(index, row) {
      this.wardItemForm = row
      this.wardItemForm.statusDict = this.wardItemForm.statusDict ^ 1
      this.confirmAddWardItem()
    },
    // 删除病区
    deleteRow(index, row) {
      this.$confirm('您确定要删除吗？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const query = row.wardCode
        ward_deleteById(query).then(res => {
          this.getWardData(1)
        })
      })
    },
    changePagination(pageNum) {
      this.getWardData(pageNum)
    },
    /**
     * 右边按钮事件
     */
    rightInputFC() {
      this.getWardData(1)
    },
    debounceSearch() {
      this.debounceSearchSymbol = this.debounceSearchSymbol ? this.debounceSearchSymbol : debounce(function () {
        this.getWardData(1)
      }, 200)
      this.debounceSearchSymbol()
    },
    getWardData(page) {
      if (page) {
        this.qeuryTableData.pageNum = page
      }
      this.loading = true
      ward_findWithPage(this.qeuryTableData).then(res => {
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

.ward_right {
  height: 100%;
  .el-header {
    // ward_right_head 右侧搜索栏的input
    .el-input {
      width: 300px;
    }
  }
}
</style>
<style lang="scss" scoped>
.ward {
  background: #ffffff;
  height: 100%;
  display: block;
}
.ward {
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
