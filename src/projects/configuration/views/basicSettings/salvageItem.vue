<!-- 抢救记录项配置 -->
<template>
  <div id="salvageItem" class="salvageItem">
    <!-- ICU病区 -->
    <div class="left">
      <el-container style="height:100%">
        <el-header>
          <div>
            <i class="iconBlue"></i>
            <span>ICU病区</span>
          </div>
        </el-header>
        <icu-region style="height:calc(100% - 42px)" :defaultPermi="['configuration:basicSettings:rescueRecordConfig']"
          :defaultRegion="defaultRegion" :module="activeName" @defaultRegionChange="defaultRegionChange"
          ref="icuRegion"></icu-region>
      </el-container>
    </div>
    <!-- 基础病情、护理、用药记录 -->
    <div class="salvageItemBaseInfo">
      <el-container style="height:100%;">
        <el-main style="height:100%;">
          <el-tabs v-model="activeName" @tab-click="handlerChange">
            <el-tab-pane name="rescureBaseMoniitem" label="监护项配置">
              <el-container>
                <el-header class="elHeader3">
                  <!-- input输入 -->
                  <div class="headerLeft">
                    <el-input size="small" placeholder="监护项" clearable suffix-icon="el-icon-search" v-model="searchKey"
                      @input="debounceBaseDataSearch(1)">
                    </el-input>
                    <el-checkbox v-model="statusDict" true-label="" false-label="1" @change="debounceBaseDataSearch(1)">
                      显示禁用
                    </el-checkbox>
                  </div>
                  <div class="headerRight">
                    <el-button v-hasPermi="['configuration:basicSettings:rescueRecordConfig']" class="queryButton"
                      type="primary" @click.native.prevent="dialogShowFlag = true">添加项目</el-button>
                  </div>
                </el-header>
              </el-container>
            </el-tab-pane>
            <!-- <el-tab-pane name="nursing" label="护理">
              <el-container>
                <el-header class="elHeader3">

                  <div class="headerLeft">
                      <el-input size="small" placeholder="监护项" clearable suffix-icon="el-icon-search" ></el-input>
                  </div>
                  <div class="headerRight">
                    <el-button v-hasPermi="['configuration:basicSettings:rescueRecordConfig']" class="queryButton" type="primary" @click.native.prevent="dialogShowFlag=true">添加项目</el-button>
                  </div>
                </el-header>

              </el-container>
            </el-tab-pane> -->
            <el-tab-pane name="rescureDrug" label="输液/用药">
              <el-container>
                <el-header class="elHeader3">
                  <!-- input输入 -->
                  <div class="headerLeft">
                    <el-input size="small" placeholder="名称/编码" clearable suffix-icon="el-icon-search"
                      v-model="drugSearchKey"></el-input>
                    <el-checkbox v-model="statusDict" true-label="" false-label="1">
                      显示禁用
                    </el-checkbox>
                  </div>
                  <div class="headerRight">
                    <el-button v-hasPermi="['configuration:basicSettings:rescueRecordConfig']" class="queryButton"
                      type="primary" @click.native.prevent="addDrug">添加药品</el-button>
                    <el-button v-hasPermi="['configuration:basicSettings:rescueRecordConfig']" class="queryButton"
                      type="primary" @click.native.prevent="setDrugTemplate">配置用药模板</el-button>
                  </div>
                </el-header>

              </el-container>
            </el-tab-pane>
            <el-tab-pane name="other" label="其他事件">
            </el-tab-pane>
          </el-tabs>
          <el-main style="height:calc(100% - 104px)" v-show="activeName != 'other' && activeName != 'rescureDrug'">
            <div style="height:calc(100% - 60px)">
              <el-table
                @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
                height="100%" ref="tableDataItem" :row-class-name="({ row }) => row.statusDict == 0 ? 'disabled' : ''"
                :data="tableDataItem" highlight-current-row fit border row-key="id">
                <v-table-column :prop="item.key" :label="item.label" align="left"
                  v-for="item in tableHeaderList[activeName]" :key="`${item.key}-${activeName}`">
                  <template slot-scope="scope">
                    <el-input v-if="scope.row.isEdit" v-model="scope.row[item.key]" placeholder="请输入"></el-input>
                    <span v-else>{{ scope.row[item.key] }}</span>
                  </template>
                </v-table-column>
                <v-table-column label="操作" align="center" width="200px">
                  <template slot-scope="scope">
                    <el-button v-hasPermi="['configuration:basicSettings:rescueRecordConfig']" type="text"
                      @click="enableOrDisable(scope.$index, scope.row)"
                      :style="{ color: scope.row.statusDict == 1 ? '#EC0000' : '#00AB44' }">{{+scope.row.statusDict ? '禁用'
                        : '启用' }}</el-button>
                  </template>
                </v-table-column>
              </el-table>
            </div>
            <el-footer>
              <el-pagination background :current-page="pageNum" :page-size="pageSize" layout="total , prev, pager, next"
                style="margin-left:-10px;float:right" :total="totolCount" @current-change="getBaseData">
              </el-pagination>
            </el-footer>
          </el-main>
          <el-main style="height:calc(100% - 104px)" v-show="activeName == 'rescureDrug'">
            <RescueDrugTable style="height:100%" v-if="activeName == 'rescureDrug'" :wardCode.sync="defaultRegion"
              ref="drugTable" :searchKey="drugSearchKey" :statusDict.sync="statusDict"></RescueDrugTable>
          </el-main>
          <el-main style="height:calc(100% - 104px)" v-show="activeName == 'other'">
            <RescueOther v-if="activeName == 'other'" :wardCode.sync="defaultRegion" ref="rescueOther"></RescueOther>
          </el-main>
        </el-main>
      </el-container>
    </div>
    <!-- 基础病情 护理 配置弹框 -->
    <RescueDialog :dialogShowFlag="dialogShowFlag" :type="activeName" @closeFn="closeBaseMoniitem"
      :tableHeaderList="tableHeaderList[activeName]" :personMonitorData="tabData[activeName]"
      :wardCode.sync="defaultRegion"></RescueDialog>
    <!-- 用药摸板弹框 -->
    <RescueDrugTemplate :dialogShowFlag="drugTemplateFlag" :wardCode.sync="defaultRegion"
      @closeFn="drugTemplateFlag = false"></RescueDrugTemplate>

  </div>
</template>

<script>
import {
  rescure_rescureBaseMoniitem_findAllWithPage,
  rescure_rescureBaseMoniitem_deleteById,
  rescure_rescureNurseMoniitem_findWithPage,
  rescure_rescureNurseMoniitem_deleteById
} from '@/api/rescure'
import {
  drugUsage_findWithPage
} from '@/api/configuration'
import icuRegion from '../basicSettings/components/icuRegion.vue'
import { mapGetters } from 'vuex'
import RescueDialog from './components/rescueDialog'
import RescueDrugTable from './components/rescueDrugTable'
import RescueDrugTemplate from './components/rescueDrugTemplate'
import RescueOther from './components/rescueOther'
import { debounce } from 'lodash'
export default {
  name: 'SalvageItem',
  components: { icuRegion, RescueDialog, RescueDrugTable, RescueDrugTemplate, RescueOther },
  data: function () {
    return {
      loading: false,
      defaultRegion: '',
      activeName: 'rescureBaseMoniitem', // 切换  rescure_rescureBaseMoniitem   nursing  drug
      tableHeaderList: {
        rescureBaseMoniitem: [
          { label: '监护项编码', key: 'moniitemCode', width: '80' },
          { label: '监护项名称', key: 'moniitemName', width: '80' },
          { label: '监护项说明', key: 'moniitemDesc', width: '80' }
          // { label: '监护项分类', key: 'monitypeName', width: '80' },
          // { label: '排序', key: 'sortNo', width: '80' }
        ],
        nursing: [
          { label: '监护项编码', key: 'moniitemCode', width: '80' },
          { label: '监护项名称', key: 'moniitemName', width: '80' },
          { label: '监护项说明', key: 'moniitemDesc', width: '80' },
          // { label: '监护项分类', key: 'monitypeName', width: '80' },
          { label: '排序', key: 'sortNo', width: '80' }
        ]

      },
      pageNum: 1,
      pageSize: 10,
      totolCount: 0,
      tableDataItem: [],
      searchKey: '',
      drugSearchKey: '',
      statusDict: '',
      tabData: {
        rescureBaseMoniitem: [],
        nursing: [],
        rescureDrug: [],
        other: []
      },

      dialogShowFlag: false,
      drugTemplateFlag: false,
      drugUsageList: []
    }
  },
  props: {},
  watch: {},
  computed: {
    ...mapGetters(['currentUserWard'])
  },
  provide() {
    return {
      drugUsageListFn: () => { return this.drugUsageList }
    }
  },
  async created() {
    this.defaultRegion = this.currentUserWard.wardCode
    drugUsage_findWithPage({
      pageNum: 1,
      pageSize: 500,
      statusDict: '1',
      wardCode: this.currentUserWard.wardCode
    }).then(res => {
      this.drugUsageList = res.data.result
    })
    // this.getData()
  },
  mounted() { },
  methods: {
    getData() {
      if (this.activeName == 'rescureBaseMoniitem' || this.activeName == 'nursing') {
        this.getBaseData(1)
      }
    },
    // tab切换
    handlerChange() {
      this.tableDataItem = []
      this.statusDict = ''
      if (this.tabData[this.activeName].length == 0) {
        this.getData()
      } else {
        this.tableDataItem = [...this.tabData[this.activeName]]
      }
    },
    debounceBaseDataSearch() {
      this.debounceBaseDataSearchSymbol = this.debounceBaseDataSearchSymbol ? this.debounceBaseDataSearchSymbol : debounce(function () {
        this.getBaseData(1)
      }, 200)
      this.debounceBaseDataSearchSymbol()
    },
    // 获取基础病情数据
    getBaseData(pageNum) {
      if (pageNum) {
        this.pageNum = pageNum
      }

      const query = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        wardCode: this.defaultRegion,
        searchKey: this.searchKey,
        statusDict: this.statusDict
      }
      const api = {
        rescureBaseMoniitem: rescure_rescureBaseMoniitem_findAllWithPage,
        nursing: rescure_rescureNurseMoniitem_findWithPage

      }
      api[this.activeName](query).then(res => {
        if (res.code == 0) {
          this.totolCount = res.data.totolCount
          this.tabData[this.activeName] = res.data.result
          this.tableDataItem = [...this.tabData[this.activeName]]
        }
      })
    },

    // 启用禁用-基础病情数据
    enableOrDisable(index, row) {
      const api = {
        rescureBaseMoniitem: rescure_rescureBaseMoniitem_deleteById,
        nursing: rescure_rescureNurseMoniitem_deleteById
      }
      api[this.activeName]({
        id: row.id,
        statusDict: row.statusDict == '1' ? '0' : '1'
      }).then(res => {
        this.$message({
          type: 'success',
          message: +row.statusDict ? '已禁用' : '已启用'
        })
        this.getBaseData()
      })
    },

    // 复制配置功能
    defaultRegionChange(e) {
      this.defaultRegion = e
      if (this.defaultRegion !== '') {
        this.tabData = {
          rescureBaseMoniitem: [],
          nursing: [],
          rescureDrug: [],
          other: []
        }
        this.tableDataItem = []
      } else {
        this.tableDataItem = []
      }
      if (this.activeName == 'rescureBaseMoniitem') {
        this.getData()
      }

      // this.$refs.drugTable?.getData()
      // this.$refs.rescueOther?.getTemplate()
    },
    // 关闭基础数据配置
    closeBaseMoniitem(data) {
      this.dialogShowFlag = false
      if (data.length > 0) {
        this.getBaseData()
        // this.tabData[this.activeName] = data
        // this.tableDataItem = [...this.tabData[this.activeName]]
      }
    },
    // 添加药品按钮
    addDrug() {
      this.$refs.drugTable?.addDrug()
    },
    setDrugTemplate() {
      this.drugTemplateFlag = true
    }

  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法

.salvageItem {
  background: #fff;
  display: flex;
  height: 100%;
  width: 100%;

  .left {
    height: 100%;
    margin-right: 10px;
    padding: 12px;
    border-right: 2px solid rgba(203, 215, 238, 0.3);
    width: 385px;
  }

  .salvageItemBaseInfo {
    height: 100%;
    flex: 1;
    padding-right: 10px;
    overflow-x: auto;

    .el-header {
      height: 34px !important;
      padding: 0;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;

      .el-input {
        width: 300px;
      }
    }
  }
}</style>
