<!-- HIS基础数据-手术 -->
<template>
  <div class="surgery">
    <el-container class='surgery' element-loading-text="加载中" v-loading="loading">
      <el-container class="surgery_right">
        <el-header class="surgery_right_head">
          <div>
          <el-input class="elInput" size="small" :placeholder="XTCS0027=='1'?'编码/名称/国标码':'编码/名称'" suffix-icon="el-icon-search" clearable v-model="qeuryTableData.searchKey"
                    @keyup.enter.native="rightInputFC" @input="debounceSearch"></el-input>
          <el-checkbox v-model="qeuryTableData.statusDict" true-label="" false-label="1" @change="debounceSearch" >
                显示禁用
          </el-checkbox>
          </div>
          <div>
            <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']" class="queryButton" size="small" type="primary"
                       @click="showAddSurgeryItem">添加手术</el-button>
          </div>
        </el-header>
        <el-main class="surgery_right_body" style="height:calc(100% - 102px)">
          <el-table :row-class-name="({row}) => row.statusDict == 0 ? 'disabled' : ''" @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)"  ref="table"  height="100%" :data="tableDataTwo" fit border highlight-current-row style="width: 100%">
            <v-table-column prop="surgeryCode" label="手术编码"></v-table-column>
            <v-table-column prop="surgeryName" label="手术名称"></v-table-column>
            <v-table-column prop="gbCode" label="国标码" v-if="XTCS0027=='1'"></v-table-column>
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
        <el-footer class="surgery_right_footer">
          <el-pagination @size-change="changePagination" @current-change="changePagination" :current-page="qeuryTableData.pageNum"
                         :hide-on-single-page="false" :page-size="qeuryTableData.pageSize" background layout="total, prev, pager, next"
                         style="float:right;margin-top:15px;margin-right:-30px" :total="totolCount"></el-pagination>
        </el-footer>
      </el-container>
      <!-- 添加/编辑手术 -->
      <el-dialog :title="surgeryItemDialogTitle" :visible.sync="addSurgeryItemShow" :before-close="addSurgeryItemClose" width="420px"
                 :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form ref="form" :model="surgeryItemForm" label-width="80px" :rules="rules">
          <el-form-item label="名称" prop="surgeryName">
            <el-input v-model="surgeryItemForm.surgeryName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="编码" prop="surgeryCode">
            <el-input v-model="surgeryItemForm.surgeryCode" placeholder="请输入" :disabled="addOrModifySurgeryItem =='modify'"></el-input>
          </el-form-item>
          <el-form-item v-if="addOrModifySurgeryItem =='add'&&XTCS0027=='1'" label="国标码" prop="gbCode">
            <el-input v-model="surgeryItemForm.gbCode" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="surgeryItemForm.statusDict">
              <el-radio label="1">启用</el-radio>
              <el-radio label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addSurgeryItemClose">取消</el-button>
          <el-button type="primary" @click="confirmAddSurgeryItem">保存</el-button>
        </span>
      </el-dialog>
    </el-container>
  </div>

</template>

<script>
import {
  surgery_deleteById,
  surgery_edit,
  surgery_findWithPage,
  surgery_insert
} from '@/api/configuration'
import { debounce } from 'lodash'
export default {
  name: 'Surgery',
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
      surgeryItemDialogTitle: '',
      // 是否显示弹窗
      addSurgeryItemShow: false,
      // 手术属性
      surgeryItemForm: {
        surgeryName: '',
        surgeryCode: '',
        gbCode: '',
        statusDict: '0'
      },
      // 弹窗标记
      addOrModifySurgeryItem: 'add',
      // 手术校验规则
      rules: {
        surgeryName: [
          { required: true, message: '请输入手术名称', trigger: 'blur' }
        ],
        surgeryCode: [
          { required: true, message: '请输入手术编码', trigger: 'blur' }
        ]
      },
      XTCS0027: '0'
    }
  },
  props: {},
  watch: {},
  computed: {},
  async created() {
    const params = await this.$queryParam({ paramGroupCode: 'XTCS', paramCode: 'XTCS0027' })
    this.XTCS0027 = params[0]?.paramValue || '0'
    this.init()
  },
  mounted() {
    this.rightInputFC()
  },
  methods: {
    init() {

    },
    // 显示添加手术弹窗
    showAddSurgeryItem() {
      this.surgeryItemDialogTitle = '添加手术'
      this.addSurgeryItemShow = true
      this.addOrModifySurgeryItem = 'add'
    },
    // 关闭添加手术弹窗
    addSurgeryItemClose() {
      this.addSurgeryItemShow = false
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.surgeryItemForm = {
        surgeryName: '',
        surgeryCode: '',
        gbCode: '',
        statusDict: '0'
      }
    },
    // 添加/修改手术
    confirmAddSurgeryItem() {
      const query = this.surgeryItemForm
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.addOrModifySurgeryItem == 'modify') {
              // 编辑
            surgery_edit(query).then(res => {
              this.addSurgeryItemClose()
              if (res.code === 0) {
                this.getSurgeryData()
                this.addSurgeryItemClose()
              }
            })
          } else {
            // 添加
            surgery_insert(query).then(res => {
              this.addSurgeryItemClose()
              if (res.code === 0) {
                this.getSurgeryData(1)
                this.addSurgeryItemClose()
              }
            })
          }
        }
      })
    },
    // 修改手术
    modifyRow(index, row) {
      this.surgeryItemDialogTitle = '修改手术'
      this.addSurgeryItemShow = true
      this.addOrModifySurgeryItem = 'modify'
      this.surgeryItemForm = { ...row }
    },
    // 设置启用
    setStatusSurgery(index, row) {
      this.surgeryItemForm = row
      this.surgeryItemForm.statusDict = this.surgeryItemForm.statusDict ^ 1
      this.confirmAddSurgeryItem()
    },
    // 删除手术
    deleteRow(index, row) {
      this.$confirm('您确定要删除吗？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const query = row.surgeryCode
        surgery_deleteById(query).then(res => {
          this.getSurgeryData(1)
        })
      })
    },
    changePagination(pageNum) {
      this.getSurgeryData(pageNum)
    },
    /**
     * 右边按钮事件
     */
    rightInputFC() {
      this.getSurgeryData(1)
    },
    debounceSearch() {
      this.debounceSearchSymbol = this.debounceSearchSymbol ? this.debounceSearchSymbol : debounce(function () {
        this.getSurgeryData(1)
      }, 200)
      this.debounceSearchSymbol()
    },
    getSurgeryData(page) {
      if (page) {
        this.qeuryTableData.pageNum = page
      }
      this.loading = true
      surgery_findWithPage(this.qeuryTableData).then(res => {
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

.surgery_right {
  height: 100%;
}
</style>
<style lang="scss" scoped>
.surgery {
  background: #ffffff;
  height: 100%;
  display: block;
}
.surgery {
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
