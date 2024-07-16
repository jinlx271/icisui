<!-- 重点患者情况设置 -->
<template>
  <div id="keyPatientsConfig">
    <div class="left">
      <el-container style="height:calc(100% - 2px)">
        <el-header>
          <div>
            <i class="iconBlue"></i>
            <span>{{pagePartsList[0].name}}</span>
          </div>
        </el-header>
        <icu-region :defaultPermi="['configuration:basicSettings:keyPatientsConfig']" :defaultRegion="defaultRegion" :module="'focalPatient'"
                    @defaultRegionChange="defaultRegionChange" ref="icuRegion"></icu-region>
      </el-container>
    </div>
    <div class="right">
      <el-container style="height:100%;">
        <el-header>
          <div>
            <i class="iconBlue"></i>
            <span>{{pagePartsList[1].name}}</span>
          </div>

        </el-header>
        <div class="flex flex-between align-items-center m-b10">
          <el-checkbox v-model="statusDict" true-label="" false-label="1"  @change="getKeyPatientsConfigList(1)">
                显示禁用
          </el-checkbox>
          <el-button size="mini" type="primary" style="font-size:18px" :icon="refreshLoading?'el-icon-loading':'el-icon-refresh'" @click="refresh()">
          </el-button>
        </div>
        <el-container style="height:calc(100% - 42px)">
          <el-main style="height:calc(100% - 60px)">
            <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" ref="table"
                      :row-class-name="({row}) => row.statusDict == 0 ? 'disabled' : ''" :data="tableData" style="width: 100%" highlight-current-row border height="100%">
              <v-table-column label="序号" prop="sortNo" align="center" width="150px">
                <template slot-scope="scope">
                  <el-input-number :min="0" v-if="scope.row.isEdit" v-model="scope.row.sortNo" placeholder="请输入" clearable :disabled="!scope.row.isEdit">
                  </el-input-number>
                  <span v-else>{{scope.row.sortNo}}</span>
                </template>
              </v-table-column>
              <v-table-column label="项目编码" prop="itemCode" align="center" width="120px">
                <template slot-scope="scope">
                  <span>{{scope.row.itemCode}}</span>
                </template>
              </v-table-column>
              <v-table-column label="项目名称" prop="itemName" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.itemName}}</span>
                </template>
              </v-table-column>
              <v-table-column label="项目说明" prop="itemDesc" align="center">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.isEdit" v-model="scope.row.itemDesc" placeholder="请输入" maxlength="100" clearable :disabled="!scope.row.isEdit">
                  </el-input>
                  <span v-else>{{scope.row.itemDesc}}</span>
                </template>
              </v-table-column>
              <v-table-column label="操作" align="center" fixed="right">
                <template slot-scope="scope">
                  <el-button v-hasPermi="['configuration:basicSettings:keyPatientsConfig']" v-if="!scope.row.isEdit" type="text"
                             @click="updateItemRow(scope.row, scope.$index)">修改</el-button>
                  <el-button v-hasPermi="['configuration:basicSettings:keyPatientsConfig']" type="text" v-if="scope.row.isEdit===true"
                             @click="cancelItemRow(scope.$index,scope.row)">取消</el-button>
                  <el-button v-hasPermi="['configuration:basicSettings:keyPatientsConfig']" type="text" v-if="scope.row.isEdit===true"
                             @click="saveItemRow(scope.$index,scope.row)">保存</el-button>
                  <el-button v-if="!scope.row.isCreate" v-hasPermi="['configuration:basicSettings:keyPatientsConfig']" type="text"
                             @click="enableOrDisable(scope.row)" :style="{ color: scope.row.statusDict == 1 ? '#EC0000': '#00AB44' }">
                    {{+scope.row.statusDict ? '禁用' : '启用' }}</el-button>
                </template>
              </v-table-column>
            </el-table>

          </el-main>
          <el-footer>
            <el-pagination @size-change="getKeyPatientsConfigList" @current-change="getKeyPatientsConfigList" :current-page="pageNum"
                           :page-size="pageSize" background layout="total, prev, pager, next" :total="totalCount">
            </el-pagination>
          </el-footer>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex' // 存储方式
// 导管监护项匹配
import {
  focalPatient_disable,
  focalPatient_edit,
  focalPatient_findWithPage,
  catheterRule_insert,
  focalPatient_refresh
} from '@/api/configuration'
import { debounce } from 'lodash'
import icuRegion from '@/views/configuration/basicSettings/components/icuRegion.vue'
export default {
  name: 'PipeInfectRisk',
  components: {
    icuRegion
  },
  data: function () {
    return {
      statusDict: '',
      typeInfo: {
        code: 'ICIS_DICT_CATHETER_TYPE',
        list: []
      },
      sexInfo: {
        code: 'HIS_DICT_SEX',
        list: []
      },
      defaultRegion: '', // 当前用户所属病区
      // 页面布局
      pagePartsList: [
        {
          width: 6,
          name: 'ICU病区'
        },
        {
          width: 18,
          height: '100%',
          name: '重点患者情况设置'
        }
      ],
      // 重点患者情况设置列表
      tableData: [], // 数据
      pageSize: 10,
      pageNum: 1,
      totalCount: 0,
      isInsertStatus: false, // 插入新数据状态
      addOrModify: '', // 用来区分新增还是修改
      catheterList: [], // 导管列表
      loading: false,
      refreshLoading: false,
      currItem: []
    }
  },
  props: {},
  watch: {},
  computed: {
    ...mapGetters(['currentUserWard'])
  },
  created() {
    this.defaultRegion = this.currentUserWard.wardCode
  },
  methods: {
    refresh: async function () {
      try {
        this.refreshLoading = true
        await focalPatient_refresh({ wardCode: this.defaultRegion, focalPatientList: this.tableData })
        this.getKeyPatientsConfigList(1)
        this.refreshLoading = false
      } catch (error) {
        this.refreshLoading = false
      }
    },
    debounceSearch() {
      this.debounceSearchSymbol = this.debounceSearchSymbol ? this.debounceSearchSymbol : debounce(function () {
        this.getKeyPatientsConfigList(1)
      }, 200)
      this.debounceSearchSymbol()
    },
    // 获取重点患者情况设置列表
    getKeyPatientsConfigList(pageNum) {
      if (this.defaultRegion == '') {
        this.$message({
          type: 'info',
          message: '请选择病区'
        })
        return
      }
      if (pageNum) {
        this.pageNum = pageNum
      }
      const query = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        wardCode: this.defaultRegion

      }
      if (this.statusDict != '') {
        query.statusDict = this.statusDict
      }
      this.tableData = []
      focalPatient_findWithPage(query).then(res => {
        this.isInsertStatus = false
        if (res.code == 0) {
          this.tableData = res.data.result.map(v => {
            v.sortNo = +v.sortNo
            return v
          })
          this.totalCount = res.data.totolCount
        }
      })
    },
    defaultRegionChange(defaultRegion) {
      this.defaultRegion = defaultRegion
      if (this.defaultRegion != '') {
        this.getKeyPatientsConfigList(1)
      }
    },
    // 保存按钮
    saveItemRow(index, row) {
      if (this.defaultRegion == '') {
        this.$message({
          type: 'info',
          message: '请选择病区'
        })
        return
      }
      if (row.sortNo != 0 && !row.sortNo) {
        this.$message({
          type: 'info',
          message: '序号不能为空'
        })
        return
      }
      if (!row.itemCode) {
        this.$message({
          type: 'info',
          message: '项目编码不能为空'
        })
        return
      }
      if (!row.itemName) {
        this.$message({
          type: 'info',
          message: '项目名称不能为空'
        })
        return
      }
      const query = row
      query.wardCode = this.defaultRegion
      const filterResult = this.$refs.icuRegion.tableDataRegion.filter(obj => obj.wardCode == this.defaultRegion)
      query.wardName = filterResult[0]?.wardName
      if (this.addOrModify == 'add') {
        catheterRule_insert(query).then(res => {
          this.isInsertStatus = false
          if (res.code == 0) {
            delete row.isCreate
            row.isEdit = false
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.getKeyPatientsConfigList()
          }
        }).catch()
      } else {
        focalPatient_edit(query).then(res => {
          if (res.code == 0) {
            row.isEdit = false
            this.tableData = JSON.parse(JSON.stringify(this.tableData))
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.tableData = JSON.parse(JSON.stringify(this.tableData))
            this.getKeyPatientsConfigList()
          }
        })
      }
    },
    // 行内编辑时 取消按钮
    cancelItemRow(index, row) {
      this.isInsertStatus = false
      row.isEdit = false
      if (this.addOrModify == 'add') {
        this.tableData.splice(index, 1)
      } else {
        this.tableData = JSON.parse(JSON.stringify(this.tableData))
        this.tableData[index] = this.currItem[index]
      }
    },
    // 编辑当前行
    updateItemRow(row, index) {
      this.currItem[index] = { ...row }
      row.isEdit = true
      this.addOrModify = 'modify'
      this.tableData = JSON.parse(JSON.stringify(this.tableData))
    },
    // 启用禁用-当前行数据
    enableOrDisable(row) {
      focalPatient_disable({
        wardCode: row.wardCode,
        itemCode: row.itemCode,
        statusDict: row.statusDict == '1' ? '0' : '1'
      }).then(res => {
        this.$message({
          type: 'success',
          message: +row.statusDict ? '已禁用' : '已启用'
        })
        this.getKeyPatientsConfigList(1)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法

#keyPatientsConfig {
  background: #fff;
  padding-bottom: 15px;
  display: flex;
  height: 100%;
  width: 100%;
  // 宽度为70的div 用于页面分布
  .left {
    height: 100%;
    margin-right: 10px;
    padding: 12px;
    border-right: 2px solid rgba(203, 215, 238, 0.3);
    width: 385px;
  }
  .right {
    flex: 1;
    height: 100%;
    padding-right: 10px;
    overflow-x: auto;
    padding-top: 10px;
  }
}
</style>
