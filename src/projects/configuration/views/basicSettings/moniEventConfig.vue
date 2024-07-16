<!-- 监护事件设置 -->
<template>
  <div class="moniEventConfigPage">
    <el-container class="moniEventConfig" element-loading-text="加载中" v-loading="loading">
      <el-container class="moniEventConfig_main">
        <el-header class="moniEventConfig_main_head">
          <div>
            <el-input class="elInput" size="small" placeholder="请输入编码/名称/缩写/备注" suffix-icon="el-icon-search" v-model="qeuryTableData.searchKey"
                      @keyup.enter.native="debounceSearch" @input="debounceSearch"></el-input>
            <el-select class="elInput" v-model="qeuryTableData.eventType" clearable filterable placeholder="请选择" @change="debounceSearch">
              <el-option v-for="item in eventTypeList" :key="item.dictCode" :label="item.dictName" :value="item.dictCode"
                         :disabled="item.statusDict == '0'"></el-option>
            </el-select>
            <el-checkbox v-model="qeuryTableData.statusDict" true-label="" false-label="1"  @change="debounceSearch">
              显示禁用
        </el-checkbox>
          </div>
          <div>
            <el-button v-hasPermi="['configuration:basicSettings:moniEventConfig']" class="queryButton" size="small" type="primary"
                       @click="showAddmoniEventItem">添加监护事件</el-button>
          </div>
        </el-header>
        <el-main class="moniEventConfig_main_body">
          <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" ref="table" height="100%" :row-class-name="({row}) => row.statusDict == 0 ? 'disabled' : ''" :data="tableData" fit border highlight-current-row style="width: 100%;overflow: auto;">
            <v-table-column label="监护事件编码" min-width="220px" align="center">
              <template slot-scope="scope">
                <el-input v-if="scope.row.isEdit" v-model="scope.row.eventCode" placeholder="请输入" clearable :disabled="!scope.row.isCreate"> </el-input>
                <span v-else>{{scope.row.eventCode}}</span>
              </template>
            </v-table-column>
            <v-table-column label="监护事件名称">
              <template slot-scope="scope">
                <el-input v-if="scope.row.isEdit" v-model="scope.row.eventName" placeholder="请输入" clearable :disabled="!scope.row.isEdit"> </el-input>
                <span v-else>{{scope.row.eventName}}</span>
              </template>
            </v-table-column>
            <v-table-column label="缩写">
              <template slot-scope="scope">
                <el-input v-if="scope.row.isEdit" v-model="scope.row.eventAbbr" placeholder="请输入" clearable :disabled="!scope.row.isEdit"> </el-input>
                <span v-else>{{scope.row.eventAbbr}}</span>
              </template>
            </v-table-column>
            <v-table-column label="监护事件类型" min-width="140px" align="center">
              <template slot-scope="scope">
                <el-select v-if="(scope.row.isCreate && scope.row.isEdit) || (!scope.row.isCreate && scope.row.isEdit && scope.row.selfConfig == '1')"
                           v-model="scope.row.eventType" clearable filterable placeholder="请选择">
                  <el-option v-for="item in eventTypeList" :key="item.dictCode" :label="item.dictName" :value="item.dictCode"
                             :disabled="item.statusDict == '0'"></el-option>
                </el-select>
                <span v-else>{{ scope.row.eventType | dictCodeToName(eventTypeList) }}</span>
              </template>
            </v-table-column>
            <v-table-column label="事件适用分类" min-width="140px" align="center">
              <template slot-scope="scope">
                <el-select v-if="(scope.row.isCreate || scope.row.isEdit) "
                           v-model="scope.row.eventClassification" clearable filterable placeholder="请选择" multiple>
                  <el-option v-for="item in eventClassList" :key="item.dictCode" :label="item.dictName" :value="item.dictCode"
                             :disabled="item.statusDict == '0'"></el-option>
                </el-select>
                <span v-else>{{ filterArrValue(scope.row.eventClassification,eventClassList,'dictCode','dictName')  }}</span>
              </template>
            </v-table-column>

            <v-table-column label="备注">
              <template slot-scope="scope">
                <el-input v-if="scope.row.isEdit" v-model="scope.row.remark" placeholder="请输入" clearable :disabled="!scope.row.isEdit"> </el-input>
                <span v-else>{{scope.row.remark}}</span>
              </template>
            </v-table-column>
            <v-table-column prop="selfConfig" label="是否自定义" min-width="80px" align="center">
              <template slot-scope="scope">
                <span>{{+scope.row.selfConfig ? '是' : '否' }}</span>
              </template>
            </v-table-column>
            <v-table-column prop="automaticDaqData" label="获取体征数据" min-width="80px" align="center">
              <template slot-scope="scope">
                <el-select v-if="(scope.row.isCreate && scope.row.isEdit) || (!scope.row.isCreate && scope.row.isEdit )"
                           v-model="scope.row.automaticDaqData" clearable filterable placeholder="请选择">
                  <el-option label="不需要获取" value="1"></el-option>
                  <el-option label="需获取、默认不勾选" value="2"></el-option>
                  <el-option label="需获取，默认勾选" value="3"></el-option>
                </el-select>
                <span v-else>{{ scope.row.automaticDaqData | dictCodeToName(automaticDaqDataList)  }}</span>
              </template>
            </v-table-column>

            <v-table-column prop="statusDict" label="状态" width="160px" align="center">
              <template slot-scope="scope">
                <el-switch v-if="scope.row.isEdit" v-model="scope.row.statusDict" active-value="1" inactive-value="0" active-text="已启用"
                           inactive-text="已禁用"></el-switch>
                <span v-else>{{+scope.row.statusDict ? '已启用' : '已禁用' }}</span>
              </template>
            </v-table-column>
            <v-table-column label="操作" width="140px" align="center" fixed="right">
              <template slot-scope="scope">
                <el-button v-if="!scope.row.isEdit" v-hasPermi="['configuration:basicSettings:moniEventConfig']"
                           @click.native.prevent="modifyRow(scope.$index, scope.row)" type="text" size="small">修改</el-button>
                <el-button v-if="scope.row.isEdit" v-hasPermi="['configuration:basicSettings:moniEventConfig']" type="text"
                           @click="cancelItemRow(scope.$index,scope.row)">取消</el-button>
                <el-button v-if="scope.row.isEdit" v-hasPermi="['configuration:basicSettings:moniEventConfig']" type="text"
                           @click="saveItemRow(scope.$index,scope.row)">保存</el-button>
              </template>
            </v-table-column>
          </el-table>
        </el-main>
        <el-footer class="moniEventConfig_main_footer">
          <el-pagination @size-change="changePagination" @current-change="changePagination" :current-page="qeuryTableData.pageNum"
                         :hide-on-single-page="false" :page-size="qeuryTableData.pageSize" background layout="total, prev, pager, next"
                         style="float:right;margin-top:15px;margin-right:-10px" :total="dictItemTotolCount"></el-pagination>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>
<script>
// 监护事件设置接口
import {
  config_monitoringEvent_listPage,
  config_monitoringEvent_add,
  config_monitoringEvent_update
} from '@/api/configuration'
import { debounce } from 'lodash'
import {
  filterArrValue
} from '@/utils/utils'
export default {
  name: 'MoniEventConfigPage',
  components: {},
  filters: {
    dictCodeToName(dictCode, dictList, item = 'dictName') {
      const dictObj = dictList.find(item => item.dictCode == dictCode)
      return dictObj ? dictObj[item] : ''
    }
  },
  data: function () {
    return {
      loading: false, // 表格的loding
      oneRow: {}, // 左边点击的数据
      tableData: [], // 右边表格数据
      totolCount: 0, // 分页总量
      qeuryTableData: {
        pageNum: 1,
        pageSize: 10,
        statusDict: '',
        searchKey: '' // 编码或名称
      },
      // 监护事件总数
      dictItemTotolCount: 0,
      addOrModifymoniEventItem: 'add',
      // 当前行
      curRow: [],
      // 监护事件类型列表
      eventTypeList: [],
      // 是否自定义
      selfConfigList: [
        {
          dictCode: '0',
          dictName: '非自定义'
        },
        {
          dictCode: '1',
          dictName: '自定义'
        }
      ],
      automaticDaqDataList: [
        {
          dictCode: '1',
          dictName: '不需要获取'
        }, {
          dictCode: '2',
          dictName: '需获取、默认不勾选'
        },
        {
          dictCode: '3',
          dictName: '需获取，默认勾选'
        }
      ]
    }
  },
  props: {},
  watch: {},
  computed: {},
  created() {
    this.init()
  },
  mounted() {

  },
  methods: {
    filterArrValue,
    /**
     * 初始化
     */
    async init() {
      // 获取监护事件类型
      this.eventTypeList = await this.$getDictItemList('ICIS_DICT_MONITORING_EVENT_TYPE')
      this.eventClassList = await this.$getDictItemList('ICIS_DICT_EVENT_CLASSIFICATION')
      // 获取监护事件
      this.getmoniEventData(1)
    },
    // 获取监护事件
    getmoniEventData(page) {
      if (page) {
        this.qeuryTableData.pageNum = page
      }
      this.loading = true
      config_monitoringEvent_listPage(this.qeuryTableData).then(req => {
        this.loading = false
        if (!(req.data && req.data.result)) {
          this.tableData = []
          this.dictItemTotolCount = 0
          return
        }
        this.tableData = req.data.result // 列表数据
        this.dictItemTotolCount = req.data.totolCount // 总条数
      }).catch(() => {
        this.tableData = []
        this.dictItemTotolCount = 0
      })
    },
    /**
     * 分页数据请求
     */
    changePagination(val) {
      this.getmoniEventData(val)
    },
    /**
     * 查询事件
     */
    debounceSearch() {
      this.debounceSearchSymbol = this.debounceSearchSymbol ? this.debounceSearchSymbol : debounce(function () {
        this.getmoniEventData(1)
      }, 200)
      this.debounceSearchSymbol()
    },
    // 显示新增监护事件
    showAddmoniEventItem() {
      if (this.tableData.length > 0 && this.tableData[0].isCreate == true) return
      this.tableData.map(item => { item.isEdit = false })
      const itemInfo = {
        'isCreate': true,
        'isEdit': true,
        'eventCode': '',
        'automaticDaqData': '1',
        'eventName': '',
        'eventType': '',
        'selfConfig': '1',
        'eventClassification': ['1'],
        'remark': '',
        'statusDict': '1'
      }
      this.addOrModifymoniEventItem = 'add'
      this.tableData.unshift(itemInfo)
    },
    // 保存监护事件
    saveItemRow(index, row) {
      if (!row.eventCode) {
        this.$message.error('请输入监护事件编码')
        return
      } else if (!row.eventName) {
        this.$message.error('请输入监护事件名称')
        return
      } else if (row.eventName.length > 30) {
        this.$message.error('请输入少于30字的监护事件名称')
        return
      } else if (row.remark && row.remark.length > 50) {
        this.$message.error('请输入少于50字的监护事件备注')
        return
      }
      const query = { ...row }
      query.eventClassification = query.eventClassification.toString()
      if (query.isCreate) {
        config_monitoringEvent_add(query).then(res => {
          row.isEdit = false
          delete row.isCreate
          this.$message({
            type: 'success',
            message: '新增成功'
          })
          this.getmoniEventData()
        }).catch()
      } else {
        config_monitoringEvent_update(query).then(res => {
          row.isEdit = false
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          row.isEdit = false
          this.tableData = JSON.parse(JSON.stringify(this.tableData))
        })
      }
    },
    // 修改监护事件
    modifyRow(index, row) {
      this.curRow[index] = { ...row }
      if (!Array.isArray(row.eventClassification)) {
        if (row.eventClassification != '' && row.eventClassification.indexOf(',') == -1) {
          const arr = []
          arr.push(row.eventClassification)
          row.eventClassification = arr
        } else {
          row.eventClassification = row.eventClassification?.split(',') || []
        }
      }
      row.isEdit = true
      this.tableData = JSON.parse(JSON.stringify(this.tableData))

      this.addOrModifymoniEventItem = 'modify'
    },
    // 取消当前行编辑
    cancelItemRow(index, row) {
      row.isEdit = false
      if (row.isCreate) {
        this.tableData.splice(index, 1)
      } else {
        this.tableData[index] = this.curRow[index]
        this.tableData = JSON.parse(JSON.stringify(this.tableData))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/config-common.scss';

.moniEventConfigPage {
  background: #ffffff;
  height: 100%;
  display: block;
  padding: 1%;
  .tabs {
    height: 60px;
  }
  ::v-deep .el-tabs__nav-wrap::after {
    display: none;
  }
}
.moniEventConfig {
  height: 100%;
  &_main {
    height: 100%;
    &_head {
      .elInput {
        margin-left: 10px;
        &:nth-of-type(1) {
          margin-left: 0px;
        }
      }
    }
    &_body{
      height: calc(100% - 42px);
    }
  }
}
</style>
