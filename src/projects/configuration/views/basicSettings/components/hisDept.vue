<!-- 基础字典 -->
<template>
  <div class="hisDept">
    <el-container class='hisDept' element-loading-text="加载中" v-loading="loading">
      <el-container class="hisDept_right">
        <el-header class="hisDept_right_head">
          <div>
            <el-input class="elInput" size="small" :placeholder="XTCS0027=='1'?'编码/名称/国标码':'编码/名称'" suffix-icon="el-icon-search" clearable v-model="searchKey"
                      @keyup.enter.native="rightInputFC" @input="debounceSearch"></el-input>
            <el-checkbox v-model="statusDict" true-label="" false-label="1" @change="debounceSearch" >
                  显示禁用
            </el-checkbox>
          </div>
            <!-- <el-button class="queryButton" size="small" type="primary" @click="">同步HIS数据</el-button> -->
            <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']" class="queryButton" size="small" type="primary"
                       @click="showAddDiag">新增科室</el-button>

        </el-header>
        <el-main class="hisDept_right_body" style="height:calc(100% - 102px)">
          <el-table :row-class-name="({row}) => row.statusDict == 0 ? 'disabled' : ''" @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" ref="table"  height="100%" :data="tableDataTwo" fit border highlight-current-row style="width: 100%;overflow: auto">
            <v-table-column prop="deptCode" label="科室编码"></v-table-column>
            <v-table-column prop="deptName" label="科室名称"></v-table-column>
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
                <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']" @click.native.prevent="modifyInfo(scope.$index, scope.row)"
                           type="text" size="small">修改</el-button>
                <!-- <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']" @click.native.prevent="deleteInfo(scope.$index, scope.row)"
                           type="text" size="small" class="redCss">删除</el-button> -->

              </template>
            </v-table-column>
          </el-table>
        </el-main>
        <el-footer class="hisDept_right_footer">
          <el-pagination @size-change="changePagination" @current-change="changePagination" :current-page="pageNum" :hide-on-single-page="false"
                         :page-size="pageSize" background layout="total, prev, pager, next" style="float:right;margin-top:15px;margin-right:-30px"
                         :total="totolCount"></el-pagination>
        </el-footer>
      </el-container>
      <!-- 新增字典分组 -->
      <el-dialog :title="deptDialog" :visible.sync="dialogFlag" :before-close="closeDialog" width="420px" :close-on-click-modal="false"
                 :close-on-press-escape="false">
        <el-form ref="form" :model="deptInfo" label-width="80px" :rules="rules">
          <el-form-item label="名称" prop="deptName">
            <el-input v-model="deptInfo.deptName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="编码" prop="deptCode">
            <el-input v-model="deptInfo.deptCode" placeholder="请输入" :disabled="addOrModify=='modify'"></el-input>
          </el-form-item>
          <el-form-item v-if="addOrModify=='add'&&XTCS0027=='1'" label="国标码" prop="gbCode">
            <el-input v-model="deptInfo.gbCode" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="deptInfo.statusDict">
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
  dept_deleteById,
  dept_edit,
  dept_findWithPage,
  dept_insert

} from '@/api/configuration'
import { debounce } from 'lodash'
export default {
  name: 'HisDept',
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
      deptDialog: '新增科室',
      dialogFlag: false, // 弹框标志
      deptInfo: {
        deptCode: '',
        deptName: '',
        gbCode: '',
        statusDict: '0'
      },
      // 校验规则
      rules: {
        deptCode: [
          { required: true, message: '请输入科室编码', trigger: 'blur' }
        ],
        deptName: [
          { required: true, message: '请输入科室名称', trigger: 'blur' }
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
    this.getDeptList()
  },
  mounted() {
  },
  methods: {
    // 获取科室列表
    getDeptList(pageNum) {
      this.loading = true
      const query = {
        pageNum: pageNum || this.pageNum,
        pageSize: this.pageSize,
        statusDict: this.statusDict
      }
      if (pageNum) this.pageNum = pageNum
      if (this.searchkey != '') {
        query.searchKey = this.searchKey
      }
      dept_findWithPage(query).then(res => {
        this.loading = false
        this.tableDataTwo = res.data.result
        this.totolCount = res.data.totolCount
      })
    },
    rightInputFC() {
      this.getDeptList(1)
    },
    debounceSearch() {
      this.debounceSearchSymbol = this.debounceSearchSymbol ? this.debounceSearchSymbol : debounce(function () {
        this.getDeptList(1)
      }, 200)
      this.debounceSearchSymbol()
    },
    // 增加科室 显示弹框
    showAddDiag() {
      this.deptDialog = '新增科室'
      this.addOrModify = 'add'
      this.dialogFlag = true
    },
    // 修改当前科室信息
    modifyInfo(index, row) {
      this.deptDialog = '修改科室'
      this.dialogFlag = true
      this.addOrModify = 'modify'
      this.deptInfo = { ...row }
    },
    // 关闭弹框
    closeDialog() {
      this.dialogFlag = false
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.deptInfo = {
        deptCode: '',
        deptName: '',
        gbCode: '',
        statusDict: '0'
      }
    },
    // 数据翻页
    changePagination(pageNum) {
      this.pageNum = pageNum
      this.getDeptList()
    },
    setStatusDict(index, row) {
      this.deptInfo = row
      this.deptInfo.statusDict = this.deptInfo.statusDict ^ 1
      this.addOrModify = 'modify'
      this.submitData()
    },
    // 提交科室数据 新增 修改都是该方法
    submitData() {
      const query = this.deptInfo
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.addOrModify == 'modify') { // 修改
            dept_edit(query).then(res => {
              this.closeDialog()
              if (res.code == 0) {
                this.getDeptList()
                this.closeDialog()
              }
            })
          } else {
            dept_insert(query).then(res => {
              this.closeDialog()
              if (res.code == 0) {
                this.getDeptList(1)
                this.closeDialog()
              }
            })
          }
        }
      })
    },
    // 删除当前科室信息
    deleteInfo(index, row) {
      this.$confirm('您确定要删除吗？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const query = row.deptCode
        dept_deleteById(query).then(res => {
          this.getDeptList(1)
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/config-common.scss';

.hisDept_right {
  height: 100%;
  .el-header {
    // hisDept_right_head 右侧搜索栏的input
    .el-input {
      width: 300px;
    }
  }
}
</style>
<style lang="scss" scoped>
.hisDept {
  background: #ffffff;
  height: 100%;
  display: block;
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
