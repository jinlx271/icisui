<!-- 用户角色管理 -->
<template>
  <el-container id="roleManagement" class="roleManagement" element-loading-text="加载中" v-loading="loading">
    <!-- 左边表格 -->
    <el-aside class="roleManagement_left">
      <el-container class="roleManagement_left_div">
        <!-- 顶部内容 -->
        <el-header class="roleManagement_left_headDiv">
          <div>
            <i class="iconBlue"></i>
            <span>角色列表</span>
          </div>
        </el-header>
        <el-main style="height:calc(100% - 50px)" class="roleManagement_left_table">
          <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" height="100%" ref="tableDataOne" @row-click="changeTableTwo" highlight-current-row fit :data="tableDataOne" border style="width: 100%;overflow: auto;">
            <v-table-column prop="id" label="角色编码"></v-table-column>
            <v-table-column prop="name" label="角色名称"></v-table-column>
          </el-table>
        </el-main>
      </el-container>
    </el-aside>
    <!-- 右边表格 -->
    <el-container class="roleManagement_right">
      <!-- 顶部内容 -->
      <el-header class="roleManagement_right_headDiv">
        <div>
          <i class="iconBlue"></i>
          <span v-if="tableDataOneRow && tableDataOneRow.name">用户列表-{{tableDataOneRow.name}}</span>
          <span v-else>用户列表</span>
        </div>
        <div>
          <el-button v-hasPermi="['configuration:authorization:roleRelUser']" class="queryButton" size="small" type="primary" @click="dialogTableAdd">新增</el-button>
        </div>
      </el-header>
      <el-main style="height:calc(100% - 50px)" class="roleManagement_right_table">
        <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" ref="table" height="100%" :data="tableDataTwo" fit border highlight-current-row style="width: 100%;overflow: auto;">
          <v-table-column type="index" label="序号"></v-table-column>
          <v-table-column prop="userName" label="工号"></v-table-column>
          <v-table-column prop="name" label="姓名"></v-table-column>
          <v-table-column prop="sex" label="性别"></v-table-column>
          <v-table-column prop="deptName" label="科室"></v-table-column>
          <v-table-column prop="icuName" label="病区">
            <template slot-scope="scope">
              <span>{{scope.row.userWardList|userWardListFc}}</span>
            </template>
          </v-table-column>
          <v-table-column prop="professionalTitle" label="职称"></v-table-column>
          <v-table-column label="操作">
            <template slot-scope="scope">
              <el-button v-hasPermi="['configuration:authorization:roleRelUser']" @click.native.prevent="deleteRow(scope.$index, scope.row)" type="text" size="small">删除</el-button>
            </template>
          </v-table-column>
        </el-table>
      </el-main>
      <!-- <el-footer ref="rightCssFooter" class="roleManagement_right_footer">
        <el-pagination
          @size-change="changePagination"
          @current-change="changePagination"
          :current-page="4"
          :hide-on-single-page="true"
          :page-size="queryTableTwo.pageSize"
          background
          layout="total, prev, pager, next"
          :total="totolCount"
        ></el-pagination>
      </el-footer>-->
    </el-container>
    <!-- 新增角色弹框 -->
    <el-dialog :title="'新增用户-'+tableDataOneRow.name" :visible.sync="dialogTableVisible">
      <div class="userName">
        <el-input
          size="small"
          placeholder="工号/姓名"
          clearable
          suffix-icon="el-icon-search"
          v-model="queryDialogTable.searchKey"
          @keyup.enter.native="dialogInputFC"
          @input="debounceFC"
        ></el-input>
      </div>
      <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" height="450px" border v-el-table-infinite-scroll="dialogTableLoad" :data="dialogTable" ref="dialogTable" @select="selectionFC" @select-all="selectionFC">
        <v-table-column type="selection"></v-table-column>
        <v-table-column property="userName" label="工号"></v-table-column>
        <v-table-column property="name" label="姓名"></v-table-column>
        <v-table-column property="sex" label="性别"></v-table-column>
        <v-table-column property="deptName" label="科室"></v-table-column>
        <v-table-column property="icuName" label="病区"></v-table-column>
        <v-table-column property="professionalTitle" label="职称"></v-table-column>
      </el-table>
      <el-alert v-if="isflag" title="正在努力加载中..." type="success" center :closable="false" show-icon></el-alert>
      <el-alert v-if="isMore" title="没有更多啦！" type="warning" center show-icon></el-alert>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogTableCancel">取消</el-button>
        <el-button size="small" type="primary" @click="dialogTableFC">保存</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import elTableInfiniteScroll from 'el-table-infinite-scroll' // 无限滑动的组件
import {
  getRoleList,
  getUserListByRoleId,
  delUserRole,
  batchSaveUserRole,
  getNonExistUserListByExample
} from '@/api/configuration'
import _ from 'lodash'
export default {
  directives: {
    'el-table-infinite-scroll': elTableInfiniteScroll
  },
  name: 'RoleManagement',
  components: {},
  data: function() {
    return {
      tableRightHeight: 100,
      loading: false, // 表格的loding
      tableDataOne: [], // 角色表格
      tableDataOneRow: {}, // 那一行
      tableDataTwo: [], // 用户表格
      dialogTable: [], // 弹出框的表格
      selectionAllData: [], // 弹框所有勾选的数据
      queryTableTwo: {
        roleId: '', // 角色id这里必传
        deptId: '',
        enable: '',
        locked: '',
        pageNum: 1,
        pageSize: 15,
        searchKey: '',
        workSapces: ''
      },
      dialogTableVisible: false, // 表格弹出框显示隐藏
      totolCount: 0, // 翻页总条数

      isflag: false,
      isMore: false,
      queryDialogTable: {
        roleId: '', // 角色id这里必传
        delFlag: true, // 是否查询没有角色id的值.
        deptId: '',
        enable: '',
        locked: '',
        pageNum: 1,
        pageSize: 15,
        searchKey: '',
        workSapces: ''
      }, // 弹出框的请求数据
      diaLogTotolCount: 0 // 弹框的总量
    }
  },
  props: {},
  filters: {
    userWardListFc(list) {
      let nameString = ''
      list.map((item, index) => {
        nameString = nameString + item.wardName
        if (index !== list.length - 1) {
          nameString += ','
        }
      })
      return nameString
    }
  },
  watch: {
    dialogTable(data) {}
  },
  computed: {},
  created() {
    // 截流
    this.debounceFC = _.debounce(() => {
      this.dialogInputFC()
    }, 800)
    this.init()
  },
  mounted() {},
  methods: {
    /**
     * 初始化
     */
    init() {
      // 查询角色
      this.loading = true
      getRoleList({}).then(res => {
        this.tableDataOne = res.data // 给第一个表格数据
        if (this.tableDataOne[0]) {
          this.$refs.tableDataOne.setCurrentRow(this.tableDataOne[0]) // 默认设定第一行高亮
          this.changeTableTwo(this.tableDataOne[0]) // 查询第二表格
        }
      })
    },
    /**
     * 用户表格数据
     */
    changeTableTwo(data, index, event) {
      this.loading = true
      this.tableDataOneRow = this.tableDataOne.filter(res => {
        return data.id === res.id
      })[0] // 第一表格选择后角色id这条数据
      this.queryTableTwo.roleId = data.id
      this.queryDialogTable.roleId = data.id
      getUserListByRoleId(data.id).then(res => {
        this.tableDataTwo = res.data // 显示表格的参数
        this.totolCount = res.data.totolCount || 0 // 总条数
        this.loading = false
        // this.isFooter = this.totolCount > this.queryTableTwo.pageSize
      })
    },
    /**
     * 翻页
     */
    changePagination(val) {
      this.queryTableTwo.pageNum = val
      this.changeTableTwo(
        this.tableDataOne.filter(res => {
          return this.queryTableTwo.roleId === res.id
        })[0]
      )
    },
    /**
     * 删除角色用户
     */
    deleteRow(index, row) {
      this.$confirm('您确定要删除吗？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const delInfo = {
          roleId: this.tableDataOneRow.id, // 角色id
          userId: row.userName
        }
        delUserRole(delInfo).then(res => {
          this.$message.success('删除成功！')
          this.changeTableTwo(
            this.tableDataOne.filter(res => {
              return this.queryTableTwo.roleId === res.id
            })[0]
          )
        })
      })
    },
    /**
     * 弹框的数据显示
     */
    dialogTableAdd() {
      this.loading = true
      this.dialogTable = []
      this.isMore = false
      this.queryDialogTable.pageNum = 1
      this.selectionAllData = []
      this.queryDialogTable.searchKey = ''
      this.getdialogList()
    },
    /**
     * 弹框表格数据
     */
    dialogTableLoad() {
      this.isMore =
        this.queryDialogTable.pageNum >=
        Math.ceil(this.diaLogTotolCount / this.queryDialogTable.pageSize) // 没有数据 是否显示 // 没有数据
      if (this.isMore) {
        this.isflag = false
        return
      }
      this.isflag = true // 加载中
      if (this.isflag) {
        this.queryDialogTable.pageNum++
        this.getdialogList()
      }
    },
    /**
     * 弹框获取参数
     */
    getdialogList() {
      getNonExistUserListByExample(this.queryDialogTable).then(res => {
        this.diaLogTotolCount = res.data.totolCount // 翻页的总量
        // this.dialogTable = this.dialogTable.concat( // 这个影响dom元素 无法给setCurrentRow 高亮
        res.data.result.map(v => {
          v.icuName = v.userWardList.map(vv => vv.wardName).join(',')
          this.dialogTable.push(v)
          return v
        })
        this.dialogTableVisible = true // 弹框显示隐藏
        this.isflag = false // 放开加载中
        this.loading = false // 转圈圈取消
        // 处理高亮
        this.dialogTable.map(item => {
          if (
            this.selectionAllData.filter(v => {
              return v.userName == item.userName
            }).length > 0
          ) {
            this.$refs?.dialogTable?.toggleRowSelection(item, true) // 高亮
          }
        })
      })
    },
    /**
     * 弹框复选框勾选
     */
    selectionFC(selection, row) {
      // 所有勾选的数据集合
      this.selectionAllData = selection
    },
    /**
     * input的搜索
     */
    dialogInputFC() {
      this.selectionAllData = []
      this.dialogTable = []
      this.queryDialogTable.pageNum = 1
      this.isflag = false
      this.isMore = false
      this.getdialogList()
    },
    /**
     * 弹框的表格取消
     */
    dialogTableCancel() {
      this.dialogTableVisible = false // 弹框显示隐藏
    },
    /**
     * 弹框表格确定按钮
     */
    dialogTableFC() {
      const userIdsArr = []
      this.selectionAllData.map(res => {
        userIdsArr.push(res.userName)
      })
      if (userIdsArr.length == 0) {
        this.$message('尚未选择用户!')
        return
      }
      batchSaveUserRole({
        roleId: this.tableDataOneRow.id, // 角色id
        userIds: userIdsArr || [] // 用户总量
      }).then(req => {
        this.$notify({
          title: '成功',
          message: '新增成功！',
          type: 'success',
          duration: 2000
        })
        this.dialogTableCancel() // 清除的数据集合
        // 再次请求数据刷新右边表格
        this.changeTableTwo(
          this.tableDataOne.filter(res => {
            return this.queryTableTwo.roleId === res.id
          })[0]
        )
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.roleManagement {
  background: #ffffff;
  height: 100%;
  display: flex;
  padding: 1%;
  &_left {
    height: 100%;
    margin-right: 1%;
    &_div {
      height: 100%;
    }
    &_headDiv {
      height: 46px !important;
      padding: 0;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .iconBlue {
        display: inline-block;
        width: 3px;
        height: 16px;
        background: var(--maincolor);
      }
      div {
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
      }
      span {
        flex: 1;
        margin-left: 8px;
        height: 22px;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #000000;
        line-height: 22px;
      }
    }
    &_table {
      padding: 0;
      height: calc(100% - 50px);
    }
  }
  &_right {
    flex: 1;
    width: 68%;
    &_headDiv {
      height: 46px !important;
      padding: 0;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .iconBlue {
        display: inline-block;
        width: 3px;
        height: 16px;
        background: var(--maincolor);
      }
      .queryButton {
        padding: 9px 30px;
      }

      div {
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
      }
      span {
        flex: 1;
        margin-left: 8px;
        height: 22px;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #000000;
        line-height: 22px;
      }
    }
    &_table {
      padding: 0;
      height: calc(100% - 50px);
      overflow: hidden;
    }
    &_footer {
      height: 40px !important;
      line-height: 40px;
      padding: 0;
      .el-pagination {
        margin-top: 0.5%;
        text-align: right;
      }
    }
  }
  .userName {
    width: 260px;
    margin: 17px 0 11px 0;
  }
  ::v-deep.el-dialog .el-dialog__footer {
    text-align: right;
    .el-button--small {
      padding: 9px 30px;
    }
  }
}
</style>
