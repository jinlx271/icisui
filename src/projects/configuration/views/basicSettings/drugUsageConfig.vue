<!-- 药品用法设置 -->
<template>
  <div class="drugUsageConfigPage">
    <el-container class="drugUsageConfig-left">
      <el-header class="elHeader1">
        <div>
          <i class="iconBlue"></i>
          <span>病区列表</span>
        </div>
      </el-header>
      <el-container style="height:calc(100% - 42px)">
        <icu-region :defaultPermi="['configuration:basicSettings:moniitemConfig']" :defaultRegion="selectWardCode"
          :module="'drugUsage'" @defaultRegionChange="defaultRegionChange"
          @icuWardFindWithPage="icuWardFindWithPage"></icu-region>
      </el-container>
    </el-container>
    <el-container class="drugUsageConfig-right" element-loading-text="加载中" v-loading="loading">
      <!-- 右侧内容 -->
      <el-container class="drugUsageConfig_right">
        <el-header class="drugUsageConfig_right_head">
          <div>
            <el-input class="elInput" size="small" placeholder="药品用法编码/药品用法名称" suffix-icon="el-icon-search"
              v-model="qeuryTableData.searchKey" @keyup.enter.native="debounceSearch" @input="debounceSearch"></el-input>
            <!-- <el-checkbox v-model="qeuryTableData.statusDict" true-label="" false-label="1" @change="debounceSearch">
              显示禁用
            </el-checkbox> -->
          </div>
          <div>
            <el-button v-hasPermi="['configuration:basicSettings:drugUsageConfig']" class="queryButton" size="small"
              type="primary" @click="showAddDrugUsageItem">添加药品用法</el-button>
          </div>
        </el-header>
        <el-main class="drugUsageConfig_right_body" style="height:calc(100% - 102px)">
          <el-table
            @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
            ref="table" height="100%" :row-class-name="({ row }) => row.statusDict == 0 ? 'disabled' : ''"
            :data="tableData" fit border highlight-current-row style="width: 100%;overflow: auto;">
            <!-- <v-table-column prop="dictGroupCode" label="分组编码" :min-width="200"></v-table-column>
                  <v-table-column prop="dictGroupName" label="分组名称" :min-width="150"></v-table-column> -->
            <v-table-column label="编码">
              <template slot-scope="scope">
                <el-input v-if="scope.row.isEdit" v-model="scope.row.usageCode" placeholder="请输入" clearable
                  :disabled="!scope.row.isEdit || addOrModifyDrugUsageItem == 'modify'"> </el-input>
                <span v-else>{{ scope.row.usageCode }}</span>
              </template>
            </v-table-column>
            <v-table-column label="名称">
              <template slot-scope="scope">
                <el-input v-if="scope.row.isEdit" v-model="scope.row.usageName" placeholder="请输入" clearable
                  :disabled="!scope.row.isEdit"> </el-input>
                <span v-else>{{ scope.row.usageName }}</span>
              </template>
            </v-table-column>
            <v-table-column label="医嘱分类" align="center">
              <template slot-scope="scope">
                <el-select v-if="scope.row.isEdit" v-model="scope.row.usageTypeDictCode" clearable filterable
                  placeholder="请选择">
                  <el-option v-for="item in orderUsageTypeList" :key="item.dictCode" :label="item.dictName"
                    :value="item.dictCode" :disabled="item.statusDict == '0'"></el-option>
                </el-select>
                <span v-else>{{ scope.row.usageTypeDictCode | dictCodeToName(orderUsageTypeList) }}</span>
              </template>
            </v-table-column>
            <v-table-column label="备注">
              <template slot-scope="scope">
                <el-input v-if="scope.row.isEdit" v-model="scope.row.remark" placeholder="请输入" clearable
                  :disabled="!scope.row.isEdit"> </el-input>
                <span v-else>{{ scope.row.remark }}</span>
              </template>
            </v-table-column>
            <v-table-column prop="statusDict" label="状态" min-width="180px" align="center">
              <template slot-scope="scope">
                <el-switch v-if="scope.row.isEdit" v-model="scope.row.statusDict" active-value="1" inactive-value="0"
                  active-text="已启用" inactive-text="已禁用"></el-switch>
                <span v-else>{{+scope.row.statusDict ? '已启用' : '已禁用' }}</span>
              </template>
            </v-table-column>
            <v-table-column label="操作" width="220px" align="center" fixed="right">
              <template slot-scope="scope">
                <el-button v-if="!scope.row.isEdit" v-hasPermi="['configuration:basicSettings:drugUsageConfig']"
                  @click.native.prevent="modifyRow(scope.$index, scope.row)" type="text" size="small">修改</el-button>
                <!-- <el-button v-if="!scope.row.isEdit" v-hasPermi="['configuration:basicSettings:drugUsageConfig']"
                                 @click.native.prevent="deleteRow(scope.$index, scope.row)" type="text" size="small">删除</el-button> -->
                <el-button v-if="scope.row.isEdit" v-hasPermi="['configuration:basicSettings:drugUsageConfig']"
                  type="text" @click="cancelItemRow(scope.$index, scope.row)">取消</el-button>
                <el-button v-if="scope.row.isEdit" v-hasPermi="['configuration:basicSettings:drugUsageConfig']"
                  type="text" @click="saveItemRow(scope.$index, scope.row)">保存</el-button>

              </template>
            </v-table-column>
          </el-table>
        </el-main>
        <el-footer class="drugUsageConfig_right_footer">
          <el-pagination @size-change="changePagination" @current-change="changePagination"
            :current-page="qeuryTableData.pageNum" :hide-on-single-page="false" :page-size="qeuryTableData.pageSize"
            background layout="total, prev, pager, next" style="float:right;margin-top:15px;margin-right:-10px"
            :total="dictItemTotolCount"></el-pagination>
        </el-footer>
      </el-container>

    </el-container>
  </div>
</template>

<script>
import {
  drugUsage_findWithPage,
  drugUsage_insert,
  drugUsage_edit
} from '@/api/configuration'
import { debounce } from 'lodash'
import { mapGetters } from 'vuex' // 存储方式
import icuRegion from '../basicSettings/components/icuRegion.vue'
export default {
  name: 'BrugUsageConfig',
  components: { icuRegion },
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
        statusDict: '',
        pageSize: 10,
        searchKey: '' // 编码或名称
      },
      // 药品用法总数
      dictItemTotolCount: 0,
      addOrModifyDrugUsageItem: 'add',
      // 当前行
      curRow: [],
      // 医嘱分类列表
      orderUsageTypeList: [],
      selectWardCode: '', // 病区编码
      selectWardName: '', // 病区名称
      userWardList: [] // 病区集合
    }
  },
  props: {},
  watch: {},
  computed: {
    ...mapGetters(['currentUserWard'])
  },
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
      // 病区列表
      this.selectWardCode = this.currentUserWard.wardCode
      this.selectWardName = this.currentUserWard.wardName
      console.log('this.currentUserWard', this.currentUserWard)
      // 获取医嘱分类
      this.orderUsageTypeList = await this.$getDictItemList('ICIS_DICT_ORDER_USAGE_TYPE')
      // 左边字典查询
      this.getDrugUsageData(1)
    },
    // 获取药品用法目
    getDrugUsageData(page) {
      if (page) {
        this.qeuryTableData.pageNum = page
      }
      this.loading = true
      const query = {
        wardCode: this.selectWardCode,
        ...this.qeuryTableData
      }
      drugUsage_findWithPage(query).then(req => {
        this.loading = false
        if (!(req.data && req.data.result)) {
          return
        }
        this.tableData = req.data.result // 列表数据
        this.dictItemTotolCount = req.data.totolCount // 总条数
      })
    },
    /**
     * 分页数据请求
     */
    changePagination(val) {
      this.getDrugUsageData(val)
    },
    /**
     * 查询事件
     */
    debounceSearch() {
      this.debounceSearchSymbol = this.debounceSearchSymbol ? this.debounceSearchSymbol : debounce(function () {
        this.getDrugUsageData(1)
      }, 200)
      this.debounceSearchSymbol()
    },
    // 显示新增药品用法
    showAddDrugUsageItem() {
      if (this.tableData.length > 0 && this.tableData[0].isCreate == true) return
      this.tableData.map(item => { item.isEdit = false })
      const itemInfo = {
        'isCreate': true,
        'isEdit': true,
        'usageCode': '',
        'usageName': '',
        'usageTypeDictCode': '',
        'usageTypeDictName': '',
        'remark': '',
        'statusDict': '1'
      }
      this.addOrModifyDrugUsageItem = 'add'
      this.tableData.unshift(itemInfo)
    },
    // 保存药品用法目
    saveItemRow(index, row) {
      if (!row.usageCode) {
        this.$message.error('请输入药品用法编码')
        return
      } else if (!row.usageName) {
        this.$message.error('请输入药品用法名称')
        return
      } else if (row.usageName.length > 30) {
        this.$message.error('请输入少于30字的药品用法名称')
        return
      } else if (row.remark && row.remark.length > 50) {
        this.$message.error('请输入少于50字的药品用法备注')
        return
      }
      if (row.usageTypeDictCode) {
        const usagetype = this.orderUsageTypeList.find(item => item.dictCode === row.usageTypeDictCode)
        if (usagetype) {
          row.usageTypeDictName = usagetype.dictName
        }
      }
      const query = {
        ...row,
        wardCode: this.selectWardCode
      }
      if (row.isCreate) {
        drugUsage_insert(query).then(res => {
          if (res.code == 0) {
            row.isEdit = false
            delete row.isCreate
            this.$message({
              type: 'success',
              message: '新增成功'
            })
            this.getDrugUsageData()
          }
        }).catch(

        )
      } else {
        drugUsage_edit(query).then(res => {
          if (res.code == 0) {
            row.isEdit = false
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            row.isEdit = false
            this.tableData = JSON.parse(JSON.stringify(this.tableData))
          }
        })
      }
    },
    // 修改药品用法目
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
    },
    // 病区选择
    selectWard(wardCode) {
      if (wardCode) {
        this.getDrugUsageData(1)
      } else {
        this.tableData = []
      }
    },
    icuWardFindWithPage(data) {
      this.userWardList = data
    },
    defaultRegionChange(defaultRegion) {
      if (defaultRegion) {
        this.moduleNameInput = ''
        this.selectWardCode = defaultRegion
        this.selectWardName = this.userWardList.filter(item => item.wardCode === this.selectWardCode)[0].wardName
        this.selectWard(this.selectWardCode)
      } else {
        this.moduleNameInput = ''
        this.selectWardCode = ''
        this.selectWardName = ''
        this.selectWard('')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/config-common.scss';

.drugUsageConfigPage {
  background: #ffffff;
  height: 100%;
  display: flex;

  .tabs {
    height: 60px;
  }

  ::v-deep .el-tabs__nav-wrap::after {
    display: none;
  }

  .drugUsageConfig-left {
    width: 385px;
    height: 100%;
    margin-right: 10px;
    padding: 12px;
    border-right: 2px solid rgba(203, 215, 238, 0.3);
  }

  .drugUsageConfig-right {
    max-width: calc(100% - 385px);
    height: 100%;
    flex-grow: 1;
    padding: 12px 12px 12px 0;

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
  }
}
</style>
