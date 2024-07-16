<!-- 基础字典 -->
<template>
  <div class="hisDept">
    <el-container class='hisDept' element-loading-text="加载中" v-loading="loading">
      <el-container class="hisDept_right">
        <el-main class="hisDept_right_body" style="height:100%">
          <el-table :row-class-name="({row}) => row.statusDict == 0 ? 'disabled' : ''" @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" ref="table"  height="100%" :data="tableDataTwo" fit border highlight-current-row style="width: 100%;overflow: auto">
            <v-table-column prop="code" label="机构代码">
              <!-- <template slot-scope="scope">
                <el-input v-if="scope.row.isEdit" v-model="scope.row.code" ></el-input>
                <span v-else>{{scope.row.code }}</span>
              </template> -->
            </v-table-column>
            <v-table-column prop="name" label="机构名称">
              <template slot-scope="scope">
                <el-input v-if="scope.row.isEdit" v-model="scope.row.name" placeholder="请输入"></el-input>
                <span v-else>{{scope.row.name }}</span>
              </template>
            </v-table-column>
            <v-table-column prop="gbCode" label="国标码" v-if="XTCS0027 == '1'"></v-table-column>
            <v-table-column prop="statusDict" label="状态" align="center">
              <template slot-scope="scope">
                <span >{{+scope.row.enable ? '已启用' : '已禁用' }}</span>
              </template>
            </v-table-column>
            <v-table-column label="操作" width="220px" align="center">
              <template slot-scope="scope">
                <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']" @click.native.prevent="modifyInfo(scope.$index, scope.row)" v-if="!scope.row.isEdit"
                           type="text" size="small">修改</el-button>
                <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']" @click.native.prevent="save(scope.$index, scope.row)" v-if="scope.row.isEdit"
                           type="text" size="small">保存</el-button>
                <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']" @click.native.prevent="cancel(scope.$index, scope.row)" v-if="scope.row.isEdit"
                           type="text" size="small">取消</el-button>
                <!-- <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']" @click.native.prevent="deleteInfo(scope.$index, scope.row)"
                           type="text" size="small" class="redCss">删除</el-button> -->

              </template>
            </v-table-column>
          </el-table>
        </el-main>
      </el-container>
    </el-container>
  </div>

</template>

<script>
import {
  sys_editSysEnty,
  sys_getSysEnty
} from '@/api/login'
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
      deptDialog: '新增机构',
      dialogFlag: false, // 弹框标志
      deptInfo: {
        deptCode: '',
        deptName: '',
        statusDict: '0'
      },
      // 校验规则
      rules: {
        deptCode: [
          { required: true, message: '请输入机构编码', trigger: 'blur' }
        ],
        deptName: [
          { required: true, message: '请输入机构名称', trigger: 'blur' }
        ]
      },
      // 弹框是修改还是新增
      addOrModify: 'add',
      XTCS0027: ''
    }
  },
  props: {},
  watch: {},
  computed: {},
  created() {
    this.init()
    this.getSysEnty()
  },
  mounted() {
  },
  methods: {
    async init() {
      const params = await this.$queryParam({ paramGroupCode: 'XTCS', paramCode: 'XTCS0027' })
      this.XTCS0027 = params[0]?.paramValue || '0'
    },
    // 获取机构列表
    getSysEnty(pageNum) {
      this.loading = true
      const query = {
        pageNum: pageNum || this.pageNum,
        pageSize: this.pageSize,
        statusDict: this.statusDict
      }
      sys_getSysEnty(query).then(res => {
        this.loading = false
        this.tableDataTwo = res.data
      })
    },
    rightInputFC() {
      this.getSysEnty(1)
    },

    // 修改当前机构信息
    modifyInfo(index, row) {
      this.currEditRow = { ...row }
      row.isEdit = true
      this.tableDataTwo = [...this.tableDataTwo]
    },
    // 提交机构数据 新增 修改都是该方法
    save(index, row) {
      const query = row
      sys_editSysEnty(query).then(res => {
        if (res.code == 0) {
          row.isEdit = false
          this.getSysEnty()
        }
      })
    },
    cancel(index, row) {
      row.isEdit = false
      this.tableDataTwo[index] = this.currEditRow
      this.tableDataTwo = [...this.tableDataTwo]
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
