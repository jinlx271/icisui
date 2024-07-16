<!-- 集中录入监护配置 -->
<template>
  <div id="concentrateEntryConfig" class="concentrateEntryConfig">
    <!-- ICU病区 -->
    <div class="ICUWard">
      <el-container style="height:100%">
        <el-header class="elHeader1">
          <div>
            <i class="iconBlue"></i>
            <span>ICU病区列表</span>
          </div>
        </el-header>
        <el-container style="height:calc(100% - 42px)">
          <icu-region :defaultPermi="['configuration:basicSettings:entryConfig']" :defaultRegion="selectWardCode" :module="'concentrateEntry'"
                      @defaultRegionChange="defaultRegionChange"  @regionChange="(wardInfo)=>{currentWardInfo=wardInfo}"></icu-region>
        </el-container>
      </el-container>
    </div>
    <!-- 集中录入显示模块 -->
    <div class="monitoringClassification">
      <el-container class="itemsContainer">
        <el-header class="elHeader1">
          <div>
            <i class="iconBlue"></i>
            <span>集中录入显示模块</span>
          </div>

        </el-header>
        <el-main class="itemsTable">
          <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" height="100%"
                    ref="moduleData" :data="moduleData" :row-key="'monitypeCode'" @row-click="changeModuleIndex" :row-class-name="({row}) => row.status == '0' ? 'disabled' : ''"
                    highlight-current-row fit border>
            <v-table-column prop="sort" label="排序"></v-table-column>
            <v-table-column prop="moduleName" label="显示模块"></v-table-column>
            <v-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button v-hasPermi="['configuration:basicSettings:entryConfig']" type="text"
                           @click.stop="leftEnableOrDisable(scope.row)" :style="+scope.row.status ? 'color:#E6A23C':'color:#67C23A'">
                  {{+scope.row.status ? '禁用' : '启用' }}</el-button>
              </template>
            </v-table-column>
          </el-table>
        </el-main>
      </el-container>
    </div>
    <!-- 监护项 -->
    <div class="concentrateEntryItems">
      <el-container class="itemsContainer">
        <el-header class="elHeader1 block">
          <div>
            <i class="iconBlue"></i>
            <span>集中录入显示列</span>
          </div>
        </el-header>
        <el-main style="height:calc(100% - 42px)">
          <el-header>
            <el-input size="small" :placeholder="searchPlaceholder"  clearable suffix-icon="el-icon-search" v-model="searchKey"></el-input>
          </el-header>
          <div class="itemTable">
            <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" ref="tableDataItem"
                      :data="filterDataItem" highlight-current-row fit border width="100%" height="100%" :row-class-name="({row}) => row.status == '0' ? 'disabled' : ''">
              <v-table-column :prop="header.prop" :label="header.label" v-for="header in tableHeaderList" :key="header.prop" ></v-table-column>
              <v-table-column prop="columnShowname" label="列名称" width="100px">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.isEdit" v-model="scope.row.columnShowname" maxlength="100" ></el-input>
                  <span v-else>{{scope.row.columnShowname}}</span>
                </template>
              </v-table-column>
              <v-table-column label="操作" fixed="right" align="center" min-width="100" v-hasPermi="['configuration:basicSettings:entryConfig']">
                <template slot-scope="scope">
                  <div style="text-align:left;width:100px;margin: 0 auto;">
                  <el-button v-hasPermi="['configuration:basicSettings:entryConfig']" v-if="!scope.row.isEdit" type="text"
                            @click="updateMoniitemRow(scope.row, scope.$index)">修改</el-button>
                  <el-button v-hasPermi="['configuration:basicSettings:entryConfig']" type="text" v-if="scope.row.isEdit"
                            @click="cancelMoniitemRow(scope.row, scope.$index)">取消</el-button>
                  <el-button v-hasPermi="['configuration:basicSettings:entryConfig']" type="text" v-if="scope.row.isEdit"
                            @click="saveMoniitemRow(scope.row, scope.$index)">保存</el-button>
                  <el-button v-if="moduleData[moduleIndex].moduleCode != 'MONOITEM'&&!disableItems.includes(scope.row.columnCode) "
                      v-hasPermi="['configuration:basicSettings:entryConfig']" type="text"
                            @click="rightEnableOrDisable(scope.row)" :style="+scope.row.status ? 'color:#E6A23C':'color:#67C23A'">
                    {{+scope.row.status? '禁用' : '启用' }}</el-button>
                  </div>
                </template>
              </v-table-column>
            </el-table>
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex' // 存储方式
import {
  jzlrModule_column_disable,
  jzlrModule_column_enable,
  jzlrModule_disable,
  jzlrModule_enable,
  jzlrModule_column_edit,
  jzlrModule_list
} from '@/api/configuration'
import icuRegion from '@/views/configuration/basicSettings/components/icuRegion.vue'
export default {
  name: 'ConcentrateEntryConfig',
  components: { icuRegion },
  data: function () {
    return {
      defaultRegion: '',
      currentWardInfo: {},
      statusDict: '',
      loading: false,
      selectWardCode: '', // 病区编码
      moduleData: [], // 功能模块数据
      tableDataItem: [], // 右侧功能模块数据
      filterDataItem: [],
      moduleIndex: 0,
      userWardList: [], // 病区集合
      currEditRow: {},
      isEdit: false,
      searchKey: '',
      searchTimeout: -1,
      disableItems: ['rlxmmc', 'rlz', 'clxmmc', 'clz', 'hljlnr']
    }
  },
  props: {},
  watch: {
    // 功能模块搜索
    moduleNameInput(newVal) {
      this.tableDataModule = this.moduleList.filter(item => item.dictName.indexOf(newVal) !== -1)
    },
    searchKey: function(newValue) {
      clearTimeout(this.searchTimeout)
      if (newValue != '') {
        this.filterDataItem = this.tableDataItem.filter(item => {
          if (this.moduleData[this.moduleIndex].moduleCode != 'MONOITEM') {
            return item.columnName?.indexOf(newValue) > -1 || item.columnShowname?.indexOf(newValue) > -1
          } else {
            return item.columnCode?.indexOf(newValue) > -1 || item.columnName?.indexOf(newValue) > -1 || item.columnShowname?.indexOf(newValue) > -1
          }
        })
      } else {
        this.filterDataItem = this.tableDataItem
      }
    }
  },
  computed: {
    ...mapGetters(['currentUserWard']),
    tableHeaderList: function() {
      if (this.moduleData.length == 0) {
        return []
      } else if (this.moduleData[this.moduleIndex].moduleCode == 'MONOITEM') {
        return [
          { label: '监护项编码', prop: 'columnCode' },
          { label: '监护项名称', prop: 'columnName' }
        ]
      } else {
        return [
          { label: '显示列表', prop: 'columnName' }
        ]
      }
    },
    searchPlaceholder: function() {
      if (this.moduleData.length == 0) {
        return ''
      } else if (this.moduleData[this.moduleIndex].moduleCode == 'MONOITEM') {
        return '监护项编码/监护项名称/列名称'
      } else {
        return '显示列表/列名'
      }
    }
  },
  created() {
    // 病区列表
    this.selectWardCode = this.currentUserWard.wardCode
    this.defaultRegion = this.currentUserWard.wardCode
    this.init()
  },
  mounted() { },
  methods: {

    // 初始化
    init: async function () {
      const result = await this.getList()
      this.moduleData = result || []
      if (this.moduleData.length > 0) {
        this.moduleIndex = 0
        this.tableDataItem = this.moduleData[this.moduleIndex].detailList
      } else {
        this.tableDataItem = []
      }
      this.searchKey = ''
      this.filterDataItem = this.tableDataItem
      this.$refs.moduleData.setCurrentRow(this.filterDataItem[0])
    },
    /**
     * 获取数据
     */
    getList() {
      return new Promise((resolve, reject) => {
        jzlrModule_list({ wardCode: this.defaultRegion }).then(res => {
          resolve(res.data.map((item, index) => {
            item.index = index
            return item
          }))
        })
      })
    },
    // 病区选择
    selectWard(wardCode, moduleList = this.moduleList) {

    },
    // 点击监护数据显示分组
    changeModuleIndex(row, column, event) {
      this.moduleIndex = row.index
      this.tableDataItem = row.detailList
      this.filterDataItem = this.tableDataItem
    },
    // 修改监护项
    updateMoniitemRow(row, index) {
      if (this.isEdit) {
        this.$message.warning('完成当前编辑')
        return
      } else {
        this.currEditRow = JSON.parse(JSON.stringify(row))
        row.isEdit = true
        this.isEdit = true
        this.filterDataItem = [...this.filterDataItem]
      }
    },
    // 取消当前编辑监护项
    cancelMoniitemRow(row, index) {
      row.isEdit = false
      this.isEdit = false
      this.filterDataItem[index] = this.currEditRow
      this.filterDataItem = [...this.filterDataItem]
    },
    // 保存监护项
    saveMoniitemRow(row, index) {
      const query = {
        'columnShowname': row.columnShowname,
        'id': row.id,
        'moduleCode': this.moduleData[this.moduleIndex].moduleCode
      }
      jzlrModule_column_edit(query).then(res => {
        row.isEdit = false
        this.isEdit = false
        this.filterDataItem = [...this.filterDataItem]
      })
    },
    /**
     * 刷新列表
     */
    async refreshList() {
      const result = await this.getList()
      this.moduleData = result || []
      this.tableDataItem = this.moduleData[this.moduleIndex].detailList
    },
    // 启用禁用-监护项
    rightEnableOrDisable(row) {
      if (row.status == '1') {
        jzlrModule_column_disable(row).then(res => {
          this.$message('禁用成功')
          row.status = '0'
        })
      } else {
        jzlrModule_column_enable(row).then(res => {
          this.$message('启用成功')
          row.status = '1'
        })
      }
    },
    // 启用禁用-监护数据显示分组
    leftEnableOrDisable(row) {
      if (row.status == '1') {
        jzlrModule_disable(row).then(res => {
          this.$message('禁用成功')
          row.status = '0'
        })
      } else {
        jzlrModule_enable(row).then(res => {
          this.$message('启用成功')
          row.status = '1'
        })
      }
    },
    defaultRegionChange(defaultRegion) {
      // 清空搜索条件
      this.tableDataModule = []
      this.tableDataItem = []
      this.filterDataItem = []
      this.defaultRegion = defaultRegion
      this.currEditRow = {}
      this.isEdit = false
      if (this.defaultRegion != '') {
        this.init()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法

.concentrateEntryConfig {
  display: flex;
  flex: 0%;
  background: #fff;
  height: 100%;
  padding-bottom: 15px;
  .ICUWard {
    width: 26%;
    padding: 10px 10px 0 10px;
    border-right: 2px solid rgba(203, 215, 238, 0.3);
    margin-right: 10px;
  }

  .monitoringClassification {
    width: 25%;
    padding-top: 10px;
    border-right: 2px solid rgba(203, 215, 238, 0.3);
    padding-right: 10px;
    margin-right: 10px;
  }
  .concentrateEntryItems {
    width: calc(49% - 6px);
    padding-top: 10px;
    padding-right: 10px;
    .time-select {
      width: 100%;
    }
    ::v-deep .el-header .el-input {
      max-width: 230px;
    }
  }
  .itemsContainer {
    height: 100%;
    .itemsTable {
      height: calc(100% - 42px);
      ::v-deep.el-table {
        width: 100%;
      }
    }
    .itemTable{
      height: calc(100% - 42px);
    }
  }
}
</style>
