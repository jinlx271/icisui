<!-- 基础字典 -->
<template>
  <div class="hisDiagnose">
    <el-container class='hisDiagnose' element-loading-text="加载中" v-loading="loading">
      <el-container class="hisDiagnose_right">
        <el-header class="hisDiagnose_right_head">
          <div>
          <el-input class="elInput" size="small" :placeholder="XTCS0027=='1'?'编码/名称/国标码':'编码/名称'" suffix-icon="el-icon-search" clearable v-model="searchKey"
                    @keyup.enter.native="rightInputFC" @input="debounceSearch"></el-input>
          <el-checkbox v-model="statusDict" true-label="" false-label="1" @change="debounceSearch" >
                显示禁用
          </el-checkbox>
          </div>
          <div>
            <!-- <el-button class="queryButton" size="small" type="primary" @click="">同步HIS数据</el-button> -->
            <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']" class="queryButton" size="small" type="primary"
                       @click="showAddDiag">新增诊断</el-button>
          </div>
        </el-header>
        <el-main class="hisDiagnose_right_body" style="height:calc(100% - 102px)">
          <el-table :row-class-name="({row}) => row.statusDict == 0 ? 'disabled' : ''" @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)"  ref="table"  height="100%" :data="tableDataTwo" fit border highlight-current-row style="width: 100%;">
            <v-table-column prop="diagnoseCode" label="诊断编码"></v-table-column>
            <v-table-column prop="diagnoseName" label="诊断名称"></v-table-column>
            <v-table-column prop="gbCode" label="国标码"  v-if="XTCS0027=='1'"></v-table-column>
            <v-table-column prop="statusDict" label="状态" align="center">
              <template slot-scope="scope">
                <el-switch v-if="scope.row.isEdit" v-model="scope.row.statusDict" active-value="1" inactive-value="0" active-text="已启用"
                           inactive-text="已禁用" ></el-switch>
                <span v-else>{{+scope.row.statusDict ? '已启用' : '已禁用' }}</span>
              </template>
            </v-table-column>
            <v-table-column label="操作" width="220px" align="center">
              <template slot-scope="scope">
                <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']" @click.native.prevent="modifyInfo(scope.$index, scope.row)"
                           type="text" size="small">修改</el-button>
                <!-- <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']" @click.native.prevent="deleteInfo(scope.$index, scope.row)"
                           type="text" size="small" class="redCss">删除</el-button> -->
              </template>
            </v-table-column>
          </el-table>
        </el-main>
        <el-footer class="hisDiagnose_right_footer">
          <el-pagination @size-change="changePagination" @current-change="changePagination" :current-page="pageNum" :hide-on-single-page="false"
                         :page-size="pageSize" background layout="total, prev, pager, next" style="float:right;margin-top:15px;margin-right:-30px"
                         :total="totolCount"></el-pagination>
        </el-footer>
      </el-container>
      <!-- 新增字典分组 -->
      <el-dialog :title="diagnoseDialog" :visible.sync="dialogFlag" :before-close="closeDialog" width="420px" :close-on-click-modal="false"
                 :close-on-press-escape="false">
        <el-form ref="form" :model="diagnoseInfo" label-width="80px" :rules="rules">
          <el-form-item label="名称" prop="diagnoseName">
            <el-input v-model="diagnoseInfo.diagnoseName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="编码" prop="diagnoseCode">
            <el-input v-model="diagnoseInfo.diagnoseCode" placeholder="请输入" :disabled="addOrModify=='modify'"></el-input>
          </el-form-item>
          <el-form-item v-if="addOrModify=='add'&&XTCS0027=='1'" label="国标码" prop="gbCode">
            <el-input v-model="diagnoseInfo.gbCode" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="diagnoseInfo.statusDict" @change="validateStatus">
              <el-radio label="1">启用</el-radio>
              <el-radio label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="submitData">保存</el-button>
        </span>
      </el-dialog>

    </el-container>
  </div>

</template>

<script>
import {
  diag_deleteById,
  diag_edit,
  diag_findAllWithPage,
  diag_insert

} from '@/api/configuration'
import { debounce } from 'lodash'
export default {
  name: 'HisDiagnose',
  components: {},
  data: function () {
    return {
      loading: false,
      searchKey: '',
      statusDict: '',
      pageSize: 10,
      pageNum: 1,
      totolCount: 0,
      tableDataTwo: [],
      diagnoseDialog: '新增诊断',
      dialogFlag: false, // 弹框标志
      diagnoseInfo: {
        diagnoseCode: '',
        diagnoseName: '',
        gbCode: '',
        statusDict: '0'
      },
      // 校验规则
      rules: {
        diagnoseCode: [
          { required: true, message: '请输入诊断编码', trigger: 'blur' }
        ],
        diagnoseName: [
          { required: true, message: '请输入诊断名称', trigger: 'blur' }
        ]
      },
      // 弹框是修改还是新增
      addOrModify: 'add',
      XTCS0027: '0'
    }
  },
  props: {},
  watch: {},
  computed: {},
  async created() {
    const params = await this.$queryParam({ paramGroupCode: 'XTCS', paramCode: 'XTCS0027' })
    this.XTCS0027 = params[0]?.paramValue || '0'
    this.getDiagnoseList()
  },
  mounted() {
  },
  methods: {
    // 获取诊断列表
    getDiagnoseList(pageNum) {
      this.loading = true
      const query = {
        statusDict: this.statusDict,
        pageNum: pageNum || this.pageNum,
        pageSize: this.pageSize
      }
      if (pageNum) this.pageNum = pageNum
      if (this.searchkey != '') {
        query.searchKey = this.searchKey
      }
      diag_findAllWithPage(query).then(res => {
        this.loading = false
        this.tableDataTwo = res.data.result
        this.totolCount = res.data.totolCount
      })
    },
    rightInputFC() {
      this.getDiagnoseList(1)
    },
    debounceSearch() {
      this.debounceSearchSymbol = this.debounceSearchSymbol ? this.debounceSearchSymbol : debounce(function () {
        this.getDiagnoseList(1)
      }, 200)
      this.debounceSearchSymbol()
    },
    // 增加诊断 显示弹框
    showAddDiag() {
      this.diagnoseDialog = '新增诊断'
      this.addOrModify = 'add'
      this.dialogFlag = true
    },
    // 修改当前诊断信息
    modifyInfo(index, row) {
      this.diagnoseDialog = '修改诊断'
      this.dialogFlag = true
      this.addOrModify = 'modify'
      this.diagnoseInfo = { ...row }
    },
    // 关闭弹框
    closeDialog() {
      this.dialogFlag = false
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.diagnoseInfo = {
        diagnoseCode: '',
        diagnoseName: '',
        gbCode: '',
        statusDict: '0'
      }
    },
    // 数据翻页
    changePagination(pageNum) {
      this.pageNum = pageNum
      this.getDiagnoseList()
    },
    setStatusDict(index, row) {
      this.diagnoseInfo = row
      this.diagnoseInfo.statusDict = this.diagnoseInfo.statusDict ^ 1
      this.addOrModify = 'modify'
      this.submitData()
    },
    /** 禁用状态提醒 */
    validateStatus(e) {
      if (e == 0 || e == '0') {
        this.$message({
          type: 'error',
          message: '相关配置及个人相关数据也将被禁用！'
        })
      } else {
        this.$message.closeAll()
      }
    },
    // 提交诊断数据 新增 修改都是该方法
    submitData() {
      const query = this.diagnoseInfo
      if (this.diagnoseInfo.statusDict == 0) {
        this.$message({
          type: 'info',
          message: '相关配置及个人相关数据也将被禁用！'
        })
      }
       this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.addOrModify == 'modify') { // 修改
            diag_edit(query).then(res => {
              this.closeDialog()
              if (res.code == 0) {
                this.getDiagnoseList()
                this.closeDialog()
              }
            })
          } else {
            diag_insert(query).then(res => {
              this.closeDialog()
              if (res.code == 0) {
                this.getDiagnoseList(1)
                this.closeDialog()
              }
            })
          }
        }
       })
    },
    // 删除当前诊断信息
    deleteInfo(index, row) {
      this.$confirm('您确定要删除吗？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const query = row.diagnoseCode
        diag_deleteById(query).then(res => {
          this.getDiagnoseList(1)
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/config-common.scss';

.hisDiagnose_right {
  height: 100%;
  .el-header {
    // hisDiagnose_right_head 右侧搜索栏的input
    .el-input {
      width: 300px;
    }
  }
}
</style>
<style lang="scss" scoped>
.hisDiagnose {
  background: #ffffff;
  height: 100%;
  display: block;
}
.hisDiagnose {
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
