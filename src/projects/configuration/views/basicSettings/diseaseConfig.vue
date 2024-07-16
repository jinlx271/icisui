<!-- 病种设置 -->
<template>
  <div class="diseaseConfigPage">
    <el-container class="diseaseConfig" element-loading-text="加载中" v-loading="loading">
      <!-- 右侧内容 -->
      <el-container class="diseaseConfig_right">
        <el-header class="diseaseConfig_right_head">
          <div>
          <el-input class="elInput" clearable size="small" placeholder="病种编码/病种名称" suffix-icon="el-icon-search" v-model="qeuryTableData.searchKey"
                    @keyup.enter.native="debounceSearch" @input="debounceSearch"></el-input>
          <el-checkbox v-model="qeuryTableData.statusDict" true-label="" false-label="1"  @change="debounceSearch">
                        显示禁用
                  </el-checkbox>
          </div>
          <el-button v-hasPermi="['configuration:basicSettings:newDiseaseConfig']" class="queryButton" size="small" type="primary"
                       @click="showAddDrugUsageItem">添加病种</el-button>

        </el-header>
        <el-main class="diseaseConfig_right_body">
          <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" ref="table" height="100%" :row-class-name="({row}) => row.statusDict == 0 ? 'disabled' : ''" :data="tableData" fit border highlight-current-row style="width: 100%;overflow: auto;">
            <v-table-column label="病种编码">
              <template slot-scope="scope">
                <el-input v-if="scope.row.isEdit" v-model="scope.row.diseasesCode" placeholder="请输入" clearable
                          :disabled="!scope.row.isEdit||addOrModifyDrugUsageItem =='modify'"> </el-input>
                <span v-else>{{scope.row.diseasesCode}}</span>
              </template>
            </v-table-column>
            <v-table-column label="病种名称">
              <template slot-scope="scope">
                <el-input v-if="scope.row.isEdit" v-model="scope.row.diseasesName" placeholder="请输入" clearable :disabled="!scope.row.isEdit"> </el-input>
                <span v-else>{{scope.row.diseasesName}}</span>
              </template>
            </v-table-column>
            <v-table-column label="病种分组" align="center">
              <template slot-scope="scope">
                <!-- <el-select v-if="scope.row.isEdit" v-model="scope.row.classfyName" clearable filterable placeholder="请选择医嘱分类">
                  <el-option v-for="item in orderUsageTypeList" :key="item.dictCode" :label="item.dictName" :value="item.dictCode"
                             :disabled="item.statusDict == '0'"></el-option>
                </el-select>
                <span v-else>{{ scope.row.classfyName}}</span> -->

                <el-select v-if="scope.row.isEdit" v-model="scope.row.classfyDictCode" multiple="" filterable placeholder="请选择" style="width:100%">
                  <el-option v-for="item in ICIS_DICT_DISEASES_CLASSIFY" :key="item.dictCode" :label="item.dictName" :value="item.dictCode">
                  </el-option>
                </el-select>
                <span v-else>{{scope.row.classfyDictCode|dictCodeToName(ICIS_DICT_DISEASES_CLASSIFY)}}</span>
              </template>
            </v-table-column>
            <v-table-column label="标识">
              <template slot-scope="scope">
                <el-select v-if="scope.row.isEdit" v-model="scope.row.belongClassify" multiple="" filterable placeholder="请选择" style="width:100%">
                  <el-option v-for="item in option" :key="item.dictCode" :label="item.dictName" :value="item.dictCode"></el-option>
                </el-select>
                <span v-else>{{scope.row.belongClassify|dictCodeToName(option)}}</span>
              </template>
            </v-table-column>
            <v-table-column prop="statusDict" label="状态" min-width="180px" align="center">
              <template slot-scope="scope">
                <el-switch v-if="scope.row.isEdit" v-model="scope.row.statusDict" active-value="1" inactive-value="0" active-text="已启用"
                           inactive-text="已禁用"></el-switch>
                <span v-else>{{+scope.row.statusDict ? '已启用' : '已禁用' }}</span>
              </template>
            </v-table-column>
            <v-table-column label="操作" width="220px" align="center" fixed="right">
              <template slot-scope="scope">
                <el-button v-if="!scope.row.isEdit" v-hasPermi="['configuration:basicSettings:newDiseaseConfig']"
                           @click.native.prevent="modifyRow(scope.$index, scope.row)" type="text" size="small">修改</el-button>
                <el-button v-if="scope.row.isEdit" v-hasPermi="['configuration:basicSettings:newDiseaseConfig']" type="text"
                           @click="cancelItemRow(scope.$index,scope.row)">取消</el-button>
                <el-button v-if="scope.row.isEdit" v-hasPermi="['configuration:basicSettings:newDiseaseConfig']" type="text"
                           @click="saveItemRow(scope.$index,scope.row)">保存</el-button>
              </template>
            </v-table-column>
          </el-table>
        </el-main>
        <el-footer class="diseaseConfig_right_footer">
          <el-pagination @size-change="changePagination" @current-change="changePagination" :current-page="qeuryTableData.pageNum"
                         :hide-on-single-page="false" :page-size="qeuryTableData.pageSize" background layout="total, prev, pager, next"
                         style="float:right;margin-top:15px;margin-right:-10px" :total="dictItemTotolCount"></el-pagination>
        </el-footer>
      </el-container>

    </el-container>
  </div>

</template>

<script>
import {
  base_diseases_listPage,
  base_diseases_add,
  base_diseases_update
} from '@/api/configuration'
import { debounce } from 'lodash'
export default {
  name: 'BrugUsageConfig',
  components: {},
  filters: {
    dictCodeToName(list, dictList, item = 'dictName') {
      const result = dictList.filter(v => list.indexOf(v.dictCode) >= 0)
      return result.map(v => v.dictName).join(',')
    }
  },
  data: function () {
    return {
      option: [{
        dictName: '非手术患者',
        dictCode: '0'
      }, {
        dictName: '手术患者',
        dictCode: '1'
      }],
      ICIS_DICT_DISEASES_CLASSIFY: [],
      loading: false, // 表格的loding
      oneRow: {}, // 左边点击的数据
      tableData: [], // 右边表格数据
      totolCount: 0, // 分页总量
      qeuryTableData: {
        statusDict: '',
        pageNum: 1,
        pageSize: 10,
        searchKey: '' // 编码或名称
      },
      // 病种总数
      dictItemTotolCount: 0,
      addOrModifyDrugUsageItem: 'add',
      // 当前行
      curRow: [],
      // 医嘱分类列表
      orderUsageTypeList: []
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
    /**
     * 初始化
     */
    async init() {
      // 获取医嘱分类
      this.orderUsageTypeList = await this.$getDictItemList('ICIS_DICT_ORDER_USAGE_TYPE')
      const { ICIS_DICT_DISEASES_CLASSIFY } = await this.$batchGetDictItemList(['ICIS_DICT_DISEASES_CLASSIFY'])
      this.ICIS_DICT_DISEASES_CLASSIFY = ICIS_DICT_DISEASES_CLASSIFY
      // 左边字典查询
      this.initData(1)
    },
    // 获取病种目
    initData(page) {
      if (page) {
        this.qeuryTableData.pageNum = page
      }
      this.loading = true
      base_diseases_listPage(this.qeuryTableData).then(req => {
        this.loading = false
        if (!(req.data && req.data.result)) {
          return
        }
        this.tableData = req.data.result.map(v => {
          v.belongClassify = v.belongClassify ? v.belongClassify.split(',') : []
          v.classfyDictCode = v.classfyDictCode ? v.classfyDictCode.split(',') : []
          return v
        }) // 列表数据
        this.dictItemTotolCount = req.data.totolCount // 总条数
      })
    },
    /**
     * 分页数据请求
     */
    changePagination(val) {
      this.initData(val)
    },
    /**
     * 查询事件
     */
    debounceSearch() {
      this.debounceSearchSymbol = this.debounceSearchSymbol ? this.debounceSearchSymbol : debounce(function () {
        this.initData(1)
      }, 200)
      this.debounceSearchSymbol()
    },
    // 显示新增病种
    showAddDrugUsageItem() {
      if (this.tableData.length > 0 && this.tableData[0].isCreate == true) return
      this.tableData.map(item => { item.isEdit = false })
      const itemInfo = {
        'isCreate': true,
        'isEdit': true,
        'diseasesCode': '',
        'diseasesName': '',
        'usageTypeDictCode': '',
        'usageTypeDictName': '',
        'statusDict': '1'
      }
      this.addOrModifyDrugUsageItem = 'add'
      this.tableData.unshift(itemInfo)
    },
    // 保存病种目
    saveItemRow(index, row) {
      if (!row.diseasesCode) {
        this.$message.error('请输入病种编码')
        return
      } else if (!row.diseasesName) {
        this.$message.error('请输入病种名称')
        return
      } else if (row.diseasesName.length > 30) {
        this.$message.error('请输入少于30字的病种名称')
        return
      }
      row.belongClassify = row.belongClassify ? row.belongClassify.join(',') : ''
      row.classfyDictCode = row.classfyDictCode ? row.classfyDictCode.join(',') : ''
      if (row.isCreate) {
        base_diseases_add(row).then(res => {
          row.isEdit = false
          delete row.isCreate
          this.$message({
            type: 'success',
            message: '新增成功'
          })
          this.initData()
        }).catch(
          this.initData()
        )
      } else {
        base_diseases_update(row).then(res => {
          row.isEdit = false
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          row.isEdit = false
          this.initData()
        })
      }
    },
    // 修改病种目
    modifyRow(index, row) {
      this.curRow[index] = { ...row }
      row.isEdit = true
      this.tableData = JSON.parse(JSON.stringify(this.tableData))
      this.addOrModifyDrugUsageItem = 'modify'
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

.diseaseConfigPage {
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
.diseaseConfig {
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
          span {
            color: #999;
            font-size: 12px;
          }
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
  &_right {
    height: 100%;
    &_body {
      height: calc(100% - 42px);
    }
  }
}
</style>
