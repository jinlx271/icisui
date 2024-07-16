<template>
  <div id="setupModule" class="setupModule">
    <el-container style="height: 100%">
      <el-header>
        <div class="setupModule_headDiv">
          <div>
            <i class="iconBlue"></i>
            <span>模块配置</span>
          </div>
          <i @click="iconClose" class="el-icon-close iconClose"></i>
        </div>
      </el-header>
      <el-main>
        <div style="height: 100%">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="病区概况" name="inpatient">
              <!-- 中间内容 -->
              <div class="setupModule_bodyDiv">
                <el-table @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)" ref="table" height="100%" :data="tableData" border style="width: 100%">
                  <v-table-column prop="isShow" label="是否显示" width="80">
                    <template slot-scope="scope">
                      <el-checkbox @change="save(scope.row)" :true-label="'1'" :false-label="'0'" v-model="scope.row.statusDict"></el-checkbox>
                    </template>
                  </v-table-column>
                  <v-table-column prop="moduleId" label="模块编码"></v-table-column>
                  <v-table-column prop="moduleName" label="模块名称"></v-table-column>
                  <v-table-column prop="startLine" label="起始位置-行" width="130">
                    <template slot-scope="scope">
                      <el-input v-if="scope.row.isEdit" class="elInput" v-model="scope.row.xaxis" placeholder="请输入"></el-input>
                      <span v-else>{{ scope.row.xaxis }}</span>
                    </template>
                  </v-table-column>
                  <v-table-column prop="startColumn" label="起始位置-列" width="130">
                    <template slot-scope="scope">
                      <el-input v-if="scope.row.isEdit" border class="elInput" v-model="scope.row.yaxis" placeholder="请输入"></el-input>
                      <span v-else>{{ scope.row.yaxis }}</span>
                    </template>
                  </v-table-column>
                  <v-table-column prop="occupiedColumn" label="占用区域-行" width="130">
                    <template slot-scope="scope">
                      <el-input v-if="scope.row.isEdit" class="elInput" v-model="scope.row.yspan" placeholder="请输入"></el-input>
                      <span v-else>{{ scope.row.yspan }}</span>
                    </template>
                  </v-table-column>
                  <v-table-column prop="occupiedLine" label="占用区域-列" width="130">
                    <template slot-scope="scope">
                      <el-input v-if="scope.row.isEdit" class="elInput" v-model="scope.row.xspan" placeholder="请输入"></el-input>
                      <span v-else>{{ scope.row.xspan }}</span>
                    </template>
                  </v-table-column>
                  <v-table-column label="操作" width="90" align="center" fixed="right">
                    <template slot-scope="scope">
                      <el-button v-if="scope.row.isEdit" @click.prevent.stop="save(scope.row)" type="text" size="small">保存</el-button>
                      <el-button v-else @click.prevent.stop="modify(scope.row)" type="text" size="small">修改</el-button>
                    </template>
                  </v-table-column>
                </el-table>
              </div>
            </el-tab-pane>
            <el-tab-pane label="患者概览" name="patient">
              <!-- 中间内容 -->
              <div class="setupModule_bodyDiv">
                <el-table @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)" ref="tableTwo" height="100%" :data="tableDataTwo" border style="width: 100%">
                  <v-table-column prop="isShow" label="是否显示" width="80">
                    <template slot-scope="scope">
                      <el-checkbox @change="saveTwo(scope.row)" :true-label="'1'" :false-label="'0'" v-model="scope.row.statusDict"></el-checkbox>
                    </template>
                  </v-table-column>
                  <v-table-column prop="moduleId" label="模块编码"></v-table-column>
                  <v-table-column prop="moduleName" label="模块名称"></v-table-column>
                  <v-table-column prop="startLine" label="起始位置-行" width="130">
                    <template slot-scope="scope">
                      <el-input v-if="scope.row.isEdit" class="elInput" v-model="scope.row.xaxis" placeholder="请输入"></el-input>
                      <span v-else>{{ scope.row.xaxis }}</span>
                    </template>
                  </v-table-column>
                  <v-table-column prop="startColumn_2" label="起始位置-列" width="130">
                    <template slot-scope="scope">
                      <el-input v-if="scope.row.isEdit" border class="elInput" v-model="scope.row.yaxis" placeholder="请输入"></el-input>
                      <span v-else>{{ scope.row.yaxis }}</span>
                    </template>
                  </v-table-column>
                  <v-table-column prop="occupiedColumn_2" label="占用区域-行" width="130">
                    <template slot-scope="scope">
                      <el-input v-if="scope.row.isEdit" class="elInput" v-model="scope.row.yspan" placeholder="请输入"></el-input>
                      <span v-else>{{ scope.row.yspan }}</span>
                    </template>
                  </v-table-column>
                  <v-table-column prop="occupiedLine_2" label="占用区域-列" width="130">
                    <template slot-scope="scope">
                      <el-input v-if="scope.row.isEdit" class="elInput" v-model="scope.row.xspan" placeholder="请输入"></el-input>
                      <span v-else>{{ scope.row.xspan }}</span>
                    </template>
                  </v-table-column>
                  <v-table-column label="操作" width="90" align="center" fixed="right">
                    <template slot-scope="scope">
                      <el-button v-if="scope.row.isEdit" @click.prevent.stop="saveTwo(scope.row)" type="text" size="small">保存</el-button>
                      <el-button v-else @click.prevent.stop="modifyTwo(scope.row)" type="text" size="small">修改</el-button>
                    </template>
                  </v-table-column>
                </el-table>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  // overview_insertOverview,
  overview_editOverview, // 修改
  overview_findOverviewWithPage // 查询
} from '@/api/configuration'
import {
  patientOverviewConfig_edit, // 修改患者概览配置
  patientOverviewConfig_getUserConfig // 获取系统用户配置
} from '@/api/patient'
export default {
  name: 'SetupModule',
  components: {},
  data: function () {
    return {
      tableData: [],
      tableDataTwo: [],
      activeName: 'inpatient'
    }
  },
  props: {},
  watch: {
    currentUserWard: {
      handler: function (val) {
        this.init()
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters(['currentUserWard', 'userInfo'])
  },
  created() {
    this.init()
  },
  mounted() {},
  methods: {
    /**
     * 初始化
     */
    init() {
      // 获取列表
      this.queryTableDataFC()
    },
    /**
     * 获取列表数据
     */
    queryTableDataFC() {
      if (this.activeName == 'inpatient') {
        overview_findOverviewWithPage({ wardCode: this.currentUserWard.wardCode }).then((res) => {
          res.data.result.map((req) => {
            req.isEdit = false
          })
          this.tableData = res.data.result
        })
      } else if (this.activeName == 'patient') {
        patientOverviewConfig_getUserConfig({ wardCode: this.currentUserWard.wardCode, userCode: this.userInfo.userName }).then((res) => {
          res.data.map((req) => {
            req.isEdit = false
          })
          this.tableDataTwo = res.data
        })
      }
    },
    /**
     * 保存的按钮
     */
    save(row) {
      overview_editOverview(Object.assign({ wardCode: this.currentUserWard.wardCode }, row)).then((res) => {
        row.isEdit = false
        this.$message({
          message: '修改成功',
          type: 'success'
        })
      })
    },
    /**
     * 修改的按钮
     */
    modify(row) {
      row.isEdit = true
    },
    /**
     * 关闭方法
     */
    iconClose() {
      this.$router.push({ path: '/wardOverview/homePage', query: this.$route.query })
    },
    /**
     * tab 切换
     */
    handleClick(tab, event) {
      this.init()
    },
    /**
     * 保存的按钮
     */
    saveTwo(row) {
      patientOverviewConfig_edit(Object.assign({ wardCode: this.currentUserWard.wardCode }, row)).then((res) => {
        row.isEdit = false
        this.$message({
          message: '修改成功',
          type: 'success'
        })
      })
    },
    /**
     * 修改的按钮
     */
    modifyTwo(row) {
      row.isEdit = true
    }
  }
}
</script>

<style lang="scss" scoped>
.setupModule {
  margin: 15px;
  height: calc(100% - 30px);
  background: #ffffff;
  box-shadow: 0px 3px 5px 0px rgba(203, 215, 238, 0.5);
  &_headDiv {
    height: 58px;
    margin-bottom: 13px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .iconBlue {
      display: inline-block;
      width: 3px;
      height: 16px;
      background: var(--maincolor);
    }
    .iconClose {
      margin-right: 12px;
      width: 15px;
      height: 15px;
      padding: 25px;
    }
    div {
      display: inline-flex;
      align-items: center;
    }
    span {
      margin-left: 9px;
      width: 64px;
      height: 22px;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #000622;
      line-height: 22px;
    }
  }
  &_bodyDiv {
    height: 100%;
    .elInput {
      width: 120px;
      height: 32px;
      background: #ffffff;
      border-radius: 2px;
    }
  }
}
::v-deep.el-input__inner {
  border: none;
}
::v-deep .el-tabs__nav-wrap::after {
  display: none;
}
::v-deep .el-tabs {
  height: 100%;
}
::v-deep .el-tabs__content {
  height: calc(100% - 55px);
}
::v-deep .el-tab-pane {
  height: 100%;
}
::v-deep.el-main {
  padding: 0 20px 20px 20px;
  height: calc(100% - 45px);
}
</style>
