<!-- 药品剂量管理 -->
<template>
  <el-container class="orderExcuteFreq">
    <!-- 头部 -->
    <el-header>
      <div class="headerLeft">
        <el-input size="small" placeholder="输入频次名称/编码/描述" clearable suffix-icon="el-icon-search" v-model="queryData.searchKey" @input="debounceSearch"
                  @keyup.enter.native="getDrugConvertList(1)"></el-input>
        <el-checkbox v-model="queryData.statusDict" true-label="" false-label="1"  @change="debounceSearch">
              显示禁用
        </el-checkbox>
      </div>
      <div class="headerRight">
        <el-button v-hasPermi="['configuration:basicSettings:orderExcuteFreq']" class="queryButton" type="primary"
                   @click.native.prevent="addDictItem">添加执行频次</el-button>
      </div>
    </el-header>
    <!-- 中间 -->
    <el-main style="height:calc(100% - 102px)">
      <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" ref="table"
                height="100%" :row-class-name="({row}) => row.statusDict == 0 ? 'disabled' : ''" :data="tableDataItem" style="width: 100%" highlight-current-row border :key='tableKey'>
        <v-table-column prop="frequencyCode" label="频次编码">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isCreate" v-model="scope.row.frequencyCode" placeholder="请输入" filterable type="text">
            </el-input>
            <span v-else>{{scope.row.frequencyCode}}</span>
          </template>
        </v-table-column>
        <v-table-column prop="frequencyName" label="频次名称">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit" v-model="scope.row.frequencyName" placeholder="请输入" filterable type="text">
            </el-input>
            <span v-else>{{scope.row.frequencyName}}</span>
          </template>
        </v-table-column>
        <v-table-column prop="frequencyDesc" label="频次说明">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit" v-model="scope.row.frequencyDesc" placeholder="请输入" filterable type="text">
            </el-input>
            <span v-else>{{scope.row.frequencyDesc}}</span>
          </template>
        </v-table-column>
        <v-table-column prop="actionNumber" label="执行次数" width="160px">
          <template slot-scope="scope">
            <el-input-number v-if="scope.row.isEdit" v-model="scope.row.actionNumber" placeholder="请输入" clearable filterable>
            </el-input-number>
            <span v-else>{{scope.row.actionNumber}}</span>
          </template>
        </v-table-column>
        <v-table-column prop="actionCycle" label="执行周期" width="160px">
          <template slot-scope="scope">
            <el-input-number v-if="scope.row.isEdit" v-model="scope.row.actionCycle" placeholder="请输入" clearable filterable>
            </el-input-number>
            <span v-else>{{scope.row.actionCycle}}</span>
          </template>
        </v-table-column>
        <v-table-column prop="executeCycleUnit" :label="'执行周期\n时间单位'">
          <template slot-scope="scope">
            <el-select v-if="scope.row.isEdit" v-model="scope.row.executeCycleUnit" placeholder="请选择">
              <el-option v-for="ii in frontList" :key="ii.dictCode" :label="ii.dictName" :value="ii.dictCode">
              </el-option>
            </el-select>
            <span v-else>{{scope.row.executeCycleUnit|showDictNameFilter(frontList,'dictCode_to_dictName')}}</span>
          </template>
        </v-table-column>
        <v-table-column prop="weekSign" label="周标志">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit" v-model="scope.row.weekSign" placeholder="请输入" filterable type="text">
            </el-input>
            <span v-else>{{scope.row.weekSign}}</span>
          </template>
        </v-table-column>
        <v-table-column prop="executeTime" label="执行时间">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit" v-model="scope.row.executeTime" placeholder="请输入" filterable type="text">
            </el-input>
            <span v-else>{{scope.row.executeTime}}</span>
          </template>
        </v-table-column>
        <v-table-column prop="statusDict" label="状态字典" width="160px">
          <template slot-scope="scope">
            <el-switch v-if="scope.row.isEdit" v-model="scope.row.statusDict" active-value="1" inactive-value="0" active-text="已启用"
                       inactive-text="已禁用"></el-switch>
            <span v-else>{{+scope.row.statusDict ? '已启用' : '已禁用' }}</span>
          </template>
        </v-table-column>
        <v-table-column prop="remark" label="备注">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit" v-model="scope.row.remark" placeholder="请输入" filterable type="text">
            </el-input>
            <span v-else>{{scope.row.remark}}</span>
          </template>
        </v-table-column>
        <v-table-column label="操作" align="center" width="200px" fixed="right">
          <template slot-scope="scope">
            <el-button v-hasPermi="['configuration:basicSettings:orderExcuteFreq']" type="text" @click="modifyInfo(scope.row, scope.$index)"
                       v-if="!scope.row.isEdit">修改</el-button>
            <el-button v-hasPermi="['configuration:basicSettings:orderExcuteFreq']" type="text" v-if="scope.row.isEdit===true"
                       @click="cancelItemRow(scope.$index,scope.row)">取消</el-button>
            <el-button v-hasPermi="['configuration:basicSettings:orderExcuteFreq']" type="text" v-if="scope.row.isEdit===true"
                       @click="saveItemRow(scope.row)">保存</el-button>
          </template>
        </v-table-column>
      </el-table>
    </el-main>
    <el-footer v-if="totolCount>0">
      <el-pagination @size-change="changePagination" @current-change="changePagination" :current-page="queryTable.pageNum" :hide-on-single-page="true"
                     :page-size="queryTable.pageSize" background layout="total, prev, pager, next" :total="totolCount"></el-pagination>
    </el-footer>
  </el-container>
</template>

<script>
import {
  drugFrequency_editDrugFrequency,
  drugFrequency_insertDrugFrequency,
  drugFrequency_findDrugAllWithPage
} from '@/api/configuration'
import { debounce } from 'lodash'
export default {
  name: 'OrderExcuteFreq',
  components: {},
  data: () => {
    return {
      frontList: [{
        dictCode: -1,
        dictName: '不规则周期'
      }, {
        dictCode: 0,
        dictName: '天'
      }, {
        dictCode: 1,
        dictName: '小时'
      }, {
        dictCode: 2,
        dictName: '分钟'
      }],
      tableKey: '',
      loading: false,
      queryTable: {
        pageNum: 1,
        pageSize: 10
      },
      queryData: {
        statusDict: '',
        searchKey: '' // input输入
      }, // 请求入参
      totolCount: 0,
      tableDataItem: [

      ], // 数据
      addOrModify: '',
      currItem: []
    }
  },
  props: {},
  watch: {},
  computed: {},
  created() { },
  mounted() {
    this.init()
  },
  methods: {
    // 药品初始化数据
    init() {
      this.getDrugConvertList(1)
    },
    debounceSearch() {
      this.debounceSearchSymbol = this.debounceSearchSymbol ? this.debounceSearchSymbol : debounce(function () {
        this.getDrugConvertList(1)
      }, 200)
      this.debounceSearchSymbol()
    },
    // 获取换算列表
    getDrugConvertList(pageNum) {
      this.queryTable.pageNum = pageNum || this.queryTable.pageNum
      const query = {
        pageNum: this.queryTable.pageNum,
        pageSize: this.queryTable.pageSize,
        searchKey: this.queryData.searchKey,
        statusDict: this.queryData.statusDict
      }
      drugFrequency_findDrugAllWithPage(query).then(res => {
        this.loading = false
        if (res.code == 0) {
          this.tableDataItem = res.data.result
          this.totolCount = res.data.totolCount
        }
      })
    },
    // 修改当前药品信息
    modifyInfo(row, index) {
      this.currItem[index] = { ...row }
      row.isEdit = true
      this.addOrModify = 'modify'
      this.tableDataItem = JSON.parse(JSON.stringify(this.tableDataItem))
    },
    // 数据翻页
    changePagination(pageNum) {
      this.getDrugConvertList(pageNum)
    },
    // 保存编辑行数据
    saveItemRow(ro) {
      const row = JSON.parse(JSON.stringify(ro))
      if (!row.frequencyCode || !row.frequencyName) {
        this.$message({
          type: 'info',
          message: `请输入${!row.frequencyCode ? '频次编码' : ''}${!row.frequencyName ? '频次名称' : ''}`
        })
        return
      }
      if (this.addOrModify == 'modify') { // 修改
        drugFrequency_editDrugFrequency(row).then(res => {
          if (res.code == 0) {
            this.getDrugConvertList()
            this.$message({
              type: 'success',
              message: '修改成功'
            })
          }
        })
      } else {
        drugFrequency_insertDrugFrequency(row).then(res => {
          if (res.code == 0) {
            this.getDrugConvertList()
          }
        })
      }
    },
    // 新增监护字典
    addDictItem() {
      if (this.tableDataItem.length > 0) {
        const first = this.tableDataItem[0]
        if (first.isCreate) {
          return
        }
      }
      const row = {
        isCreate: true,
        isEdit: true,
        statusDict: '1'
      }
      this.addOrModify = 'add'
      this.tableDataItem.unshift(row)
    },
    cancelItemRow(index, row) {
      row.isEdit = false
      if (this.addOrModify == 'add') {
        this.tableDataItem.splice(index, 1)
      } else {
        this.tableDataItem = JSON.parse(JSON.stringify(this.tableDataItem))
        this.tableDataItem[index] = this.currItem[index]
      }
    }
  }
  // 获取表格集合
}
</script>
<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法
.orderExcuteFreq {
  background: #fff;
  height: 100%;
  padding: 15px;
  ::v-deep th.el-table__cell {
    .cell {
      white-space: pre-line;
    }
  }
}
::v-deep .el-table thead > tr > th > .cell {
  padding-left: 6px;
  padding-right: 6px;
}
::v-deep .el-table tbody > tr > td > .cell {
  padding-left: 6px;
  padding-right: 6px;
}
::v-deep .el-table {
  height: 100%;
}
</style>
