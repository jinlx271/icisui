<!-- 病床管理 -->
<template>
  <div class="outzoneRule">
    <!-- 功能模块 -->
    <el-row style="width: 100%; height: 100% ">
      <el-col :span="pagePartsList[0].width" style="height:100%">
        <div class="left">
          <el-container style="height:100%">
            <el-header class="elHeader1">
              <div>
                <i class="iconBlue"></i>
                <span>{{pagePartsList[0].name}}</span>
              </div>
            </el-header>
            <el-container style="height:calc(100% - 32px)">
              <icu-region :defaultPermi="['configuration:basicSettings:outzoneRuleConfig']" :defaultRegion="defaultRegion" :module="'outzoneRuleConfig'"
                          @defaultRegionChange="defaultRegionChange"></icu-region>
            </el-container>
          </el-container>
        </div>
      </el-col>
      <el-col :span="pagePartsList[1].width" style="height:100%">
        <!-- ICU病区 -->
        <div class="right">
          <el-container style="height:100%">
            <el-container>
              <el-header>
                <div>
                  <i class="iconBlue"></i>
                  <span>{{pagePartsList[1].name}}</span>
                </div>
              </el-header>
            </el-container>
            <el-container style="height:calc(100% - 102px)">
              <el-header class="elHeader3">
                <div class="headerLeft">
                  <el-input size="small" placeholder="监护项名称/编码" clearable suffix-icon="el-icon-search" @input="debounceSearch" v-model="searchKey"
                            ></el-input>
                  <el-checkbox v-model="statusDict" true-label="" false-label="1"  @change="debounceSearch">
                            显示禁用
                        </el-checkbox>
                </div>
                <div class="headerRight">
                  <!-- <el-button class="queryButton" type="primary" @click.native.prevent="selectRegion(defaultRegion)" size="small">查询</el-button> -->
                  <el-button v-hasPermi="['configuration:basicSettings:outzoneRuleConfig']" class="queryButton" type="primary"
                             @click.native.prevent="addDictItem" size="small">新增</el-button>
                </div>
              </el-header>
              <el-main style="height:calc(100% - 42px)">
                <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" ref="tableData" :data="tableData" height="100%" row-key="moniitemCode" highlight-current-row fit border
                          @row-click="selectRow" :key="tableKey">
                  <v-table-column label="监护项编码" key="moniitemCode" align="center" width="150px">
                    <template slot-scope="scope">
                      <span>{{scope.row.moniitemCode}}</span>
                    </template>
                  </v-table-column>
                  <v-table-column label="监护项名称" key="moniitemName" align="center" width="150px">
                    <template slot-scope="scope">
                      <el-select v-if="scope.row.isCreate" @change="seleceChangeFn(false,scope.row,scope.$index)"
                                 v-model="scope.row.moniitemCode" placeholder="请选择" clearable filterable :disabled="!scope.row.isEdit"
                                 remote :remote-method="searchMoniitem" @visible-change="resetMonitem" @clear="searchMoniitem()">
                        <el-option v-for="(option) in moniitem_List" :key="option.moniitemCode" :label="option.moniitemName+'('+option.moniitemCode+')'"
                                   :value="option.moniitemCode" :disabled="option.statusDict==0">
                                   <span style="float: left">{{ option.moniitemName }}</span>
                                  <span style="float: right; color: #8492a6; font-size: 13px">{{ option.moniitemCode }}</span>
                                   </el-option>
                      </el-select>
                      <span v-else>{{scope.row.moniitemName}}</span>
                    </template>
                  </v-table-column>
                  <v-table-column label="监护项说明" key="moniitemDesc" align="center" >
                    <template slot-scope="scope">
                      <span>{{scope.row.moniitemDesc}}</span>
                    </template>
                  </v-table-column>
                  <v-table-column label="达标时间类型" key="moniitemRuleDict" align="center" width="150px">
                    <template slot-scope="scope">
                     <el-select  v-model="scope.row.moniitemRuleDict" placeholder="请选择" clearable filterable :disabled="!scope.row.isEdit">
                        <el-option v-for="(option) in ICIS_DICT_OUTWARD_RULE" :key="option.dictId" :label="option.dictName"
                                   :value="option.dictCode"  :disabled="option.statusDict==0"></el-option>
                      </el-select>
                    </template>
                  </v-table-column>
                  <v-table-column label="选项类参考选项" key="refValues" align="center" width="200">
                    <template slot-scope="scope">
                      <el-select v-if="scope.row.moniitemValueTypeDict==2&&scope.row.dataSourceDict == '2'&&!!scope.row.valueDictCode" :multiple="'multiple'" :value-key="'dictCode'"
                                 v-model="scope.row.refValues" placeholder="请选择" clearable filterable :disabled="!scope.row.isEdit">
                        <el-option v-for="(option) in scope.row.valueDictCodeOption" :key="option.dictId" :label="option.dictName"
                                   :value="option.dictCode"  :disabled="option.statusDict==0"></el-option>
                      </el-select>
                    </template>
                  </v-table-column>
                  <v-table-column label="数值范围最小值" key="minValue" align="center" width="150">
                    <template slot-scope="scope">
                      <template v-if="scope.row.moniitemValueTypeDict==1">
                        <el-input type="number" v-if="scope.row.isEdit" v-model="scope.row.minValue" placeholder="请输入">
                        </el-input>
                        <span v-else>{{scope.row.minValue}}</span>
                      </template>
                    </template>
                  </v-table-column>
                  <v-table-column label="数值范围最大值" key="maxValue" align="center" width="150">
                    <template slot-scope="scope">
                      <template v-if="scope.row.moniitemValueTypeDict==1">
                        <el-input type="number" v-if="scope.row.isEdit" v-model="scope.row.maxValue" placeholder="请输入">
                        </el-input>
                        <span v-else>{{scope.row.maxValue}}</span>
                      </template>
                    </template>
                  </v-table-column>
                  <v-table-column label="状态" key="statusDict" align="center" width="210">
                    <template slot-scope="scope">
                      <template>
                        <el-switch  v-if="scope.row.isEdit" v-model="scope.row.statusDict"  active-value="1" inactive-value="0" active-text="已启用"
                             inactive-text="已禁用">
                        </el-switch>
                        <span v-else>{{scope.row.statusDict=='1'?'已启用':'已禁用'}}</span>
                      </template>
                    </template>
                  </v-table-column>
                  <v-table-column label="操作" align="center" fixed="right">
                    <template slot-scope="scope">
                      <el-button v-hasPermi="['configuration:basicSettings:outzoneRuleConfig']" v-if="!scope.row.isEdit" type="text"
                                 @click="updateItemRow(scope.row, scope.$index)">修改</el-button>
                      <el-button v-hasPermi="['configuration:basicSettings:outzoneRuleConfig']" type="text" v-if="scope.row.isEdit===true"
                                 @click="cancelItemRow(scope.$index,scope.row)">取消</el-button>
                      <el-button v-hasPermi="['configuration:basicSettings:outzoneRuleConfig']" type="text" v-if="scope.row.isEdit===true"
                                 @click="saveItemRow(scope.row)">保存</el-button>
                      <!-- <el-button v-if="!scope.row.isCreate" v-hasPermi="['configuration:basicSettings:outzoneRuleConfig']" type="text"
                                 @click="enableOrDisable(scope.row)" :style="+scope.row.statusDict ? 'color:#E6A23C':'color:#67C23A'">
                        {{+scope.row.statusDict ? '禁用' : '启用' }}</el-button> -->
                    </template>
                  </v-table-column>
                </el-table>
              </el-main>
            </el-container>
            <el-footer>
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" background :current-page="pageNum" :page-size="pageSize" layout="total , prev, pager, next"
                             style="margin-left:-10px;float:right" :total="totolCount">
              </el-pagination>
            </el-footer>
          </el-container>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { filterArrValue } from '@/utils/utils'
import { mapGetters } from 'vuex' // 存储方式
import {
  moniitem_findAllWithPage,
  // outwardRuleWard_deleteById,
  outwardRuleWard_edit,
  outwardRuleWard_findWithPage,
  outwardRuleWard_insert

} from '@/api/configuration'

import _ from 'lodash'
import icuRegion from '@/views/configuration/basicSettings/components/icuRegion.vue'
export default {
  name: 'OutzoneRule',
  components: {

    icuRegion
  },
  data: function () {
    return {
      statusDict: '',
      // 页面布局左右布局 包括左中右多列布局
      // width 按照栅格布局每个部分占比el-col  name 头部标题
      moniitem_List: [],
      moniitemBindList: [], // 出区规则中绑定的数据
      searchKey: '',
      pagePartsList: [
        {
          width: 5,
          name: 'ICU病区'
        },
        {
          width: 19,
          name: '出区标准项规则设置'
        }
      ],
      loading: false,
      defaultRegion: '',
      queryData1: {
        code: '', // 搜索床位编码
        ICUtype: ''
      },
      // 页面表格列表数据
      tableData: [

      ],
      tableDataModule: [], //
      currItem: [], // 当前编辑数据
      totolCount: 0,
      pageSize: 10,
      pageNum: 1,
      tableKey: '',
      ICIS_DICT_OUTWARD_RULE: ''
    }
  },
  props: {},
  watch: {},
  computed: {
    ...mapGetters(['currentUserWard']),
    moniitenList: function() {
      return _.uniqWith(this.moniitem_List, _.isEqual)
    }
  },
  created() {
    this.defaultRegion = this.currentUserWard.wardCode
    this.init()
  },
  mounted() { },
  methods: {
    filterArrValue,
    seleceChangeFn: async function (e, row, index) {
      if (e === false) { // 收起 关闭时
        const filterRe = this.moniitem_List.filter(moni => moni.moniitemCode == row.moniitemCode)
        if (filterRe.length > 0) {
          this.tableData[index].moniitemDesc = filterRe[0].moniitemDesc || '' // 带出对应的监护项描述
          this.tableData[index].moniitemValueTypeDict = filterRe[0].moniitemValueTypeDict
          this.tableData[index].dataSourceDict = filterRe[0].dataSourceDict
          this.tableData[index].valueDictCode = filterRe[0].valueDictCode
          if (filterRe[0].moniitemValueTypeDict == '2' && filterRe[0].dataSourceDict == '2' && !!filterRe[0].valueDictCode) { // 数值类型为文本  数据来源为字典项 且字典项不为空
              this.tableData[index].valueDictCodeOption = await this.$getDictItemList(filterRe[0].valueDictCode)
          }
          this.tableKey = new Date().getTime()
        }
      } else { // 展开时

      }
    },
    async init() {
      const batchObj = await this.$batchGetDictItemList(['ICIS_DICT_OUTWARD_RULE'])
      this.ICIS_DICT_OUTWARD_RULE = batchObj['ICIS_DICT_OUTWARD_RULE']
      this.searchMoniitem()
      this.selectRegion(this.defaultRegion)
    },
    /**
     * 监护项编辑状态下 远程搜索监护项
     */
    async searchMoniitem(e) {
      const res = await moniitem_findAllWithPage({ 'searchKey': e, 'contentTypeDict': '', 'dataSourceDict': '', 'pageNum': 1, 'pageSize': 100 })
      this.moniitem_List = res.data.result
    },
    /**
     * 监护项编码编辑状态 blur事件  判断监护列表为空时 列表重新加载数据
     */
    resetMonitem() {
      if (this.moniitem_List.length == 0) { this.searchMoniitem() }
    },
    // 保存数据
    async saveItemRow(row, module) {
      if (row.minValue && row.maxValue && +row.maxValue < +row.minValue) {
        this.$message({
          type: 'error',
          message: '最大值不能小于最小值'
        })
        return
      }
      if (!row.moniitemCode || !row.moniitemRuleDict) {
        this.$message({
          type: 'error',
          message: '监护项编码，达标类型为必填项'
        })
        return
      }
      const result = await this.searchMonitemCode(row.moniitemCode)
      if (result > 0 && row.isCreate) {
        this.$message({
          type: 'error',
          message: '已添加该监护项'
        })
        return
      }
      row.refValues = row.refValues ? JSON.stringify(row.refValues) : null

      const query = JSON.parse(JSON.stringify(row))
      delete query.isCreate
      delete query.isEdit
      const promise = row.isCreate ? outwardRuleWard_insert(row) : outwardRuleWard_edit(row)
      promise.then(res => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: row.isCreate ? '新增成功' : '保存成功'
          })
          this.selectRegion(this.defaultRegion)
        }
        this.searchMoniitem()
      })
      promise.catch(res => {
        this.selectRegion(this.defaultRegion)
      })
    },
    /**
     * 查询是否存在
     */
    searchMonitemCode(code) {
      return new Promise((resolve, reject) => {
         const query = {
          wardCode: this.defaultRegion,
          pageNum: this.pageNum,
          pageSize: 10,
          searchKey: code
        }
        outwardRuleWard_findWithPage(query).then(res => {
           resolve(res.data.totolCount)
        })
      })
    },
    debounceSearch() {
      this.debounceSearchSymbol = this.debounceSearchSymbol ? this.debounceSearchSymbol : _.debounce(function () {
        this.pageNum = 1
        this.selectRegion(this.defaultRegion)
      }, 200)
      this.debounceSearchSymbol()
    },
    selectRegion(wardCode) {
      this.getRuleList(wardCode)
    },
    /**
     * 获取当前病区 出区规则列表
     */
    getRuleList(wardCode) {
      this.loading = true
      const query = {
        wardCode: wardCode,
        pageNum: this.pageNum,
        pageSize: 10,
        searchKey: this.searchKey,
        statusDict: this.statusDict
      }
      outwardRuleWard_findWithPage(query).then(async res => {
        const list = res.data.result.map(async item => {
          if (item.refValues && item.refValues.indexOf('[') > -1) {
            item.refValues = JSON.parse(item.refValues)
          }
          if (item.moniitemValueTypeDict == '2' && item.dataSourceDict == '2' && item.valueDictCode != '') { // 数值类型为文本  数据来源为字典项 且字典项不为空
              item.valueDictCodeOption = await this.$getDictItemList(item.valueDictCode)
          }
          return item
        })

        Promise.all(list).then((re) => {
          this.tableData = re
          this.tableKey = new Date().getTime()
        })

        this.totolCount = res.data.totolCount
      })
    },
    defaultRegionChange(defaultRegion) {
      this.defaultRegion = defaultRegion
      if (defaultRegion === '') {
        this.tableData = []
      } else {
        if (this.timer) {
          clearInterval(this.timer)
        }
        if (this.moniitem_List.length > 0) {
          this.selectRegion(this.defaultRegion)
        } else {
          this.timer = setInterval(() => {
            this.defaultRegionChange(defaultRegion)
          }, 200)
        }
      }
    },
    // 新增一行
    addDictItem: async function () {
      if (this.tableData.length > 0) {
        const first = this.tableData[0]
        if (first.isCreate) {
          return
        }
      }
      this.searchMoniitem()
      const row = {
        'isCreate': true,
        'isEdit': true,
        'maxValue': '',
        'minValue': '',
        'moniitemCode': '',
        'moniitemDesc': '',
        'moniitemName': '',
        'moniitemRuleDict': '',
        'refValues': null,
        'statusDict': '1',
        'wardCode': this.defaultRegion,
        'wardName': this.currentUserWard.wardName
      }
      this.tableData.unshift(row)
    },
    // 修改监护项
    updateItemRow(row, index) {
      this.currItem[index] = { ...row }
      row.isEdit = true
      this.tableData = JSON.parse(JSON.stringify(this.tableData))
    },
    // 取消行的编辑状态
    cancelItemRow(index, row) {
      row.isEdit = false
      if (row.isCreate) {
        this.tableData.splice(index, 1)
      } else {
        this.tableData = JSON.parse(JSON.stringify(this.tableData))
        this.tableData[index] = this.currItem[index]
      }
    },
    //  选择对应的行
    selectRow(row) {

    },
    /**
     * 启用禁用
     */
    enableOrDisable(row) {
      const params = {
        'moniitemCode': row.moniitemCode,
        'wardCode': this.defaultRegion,
        statusDict: row.statusDict == '1' ? '0' : '1'
      }
      outwardRuleWard_edit(params).then(res => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: +row.statusDict ? '已禁用' : '已启用'
          })
          this.selectRegion(this.defaultRegion)
        }
      })
    },
    /**
     * 翻页 一页总条数
     */
    handleSizeChange(num) {
      this.pageNum = 1
      this.pageSize = num
      this.selectRegion(this.defaultRegion)
    },
    /**
     * 翻页
     */
    handleCurrentChange(num) {
      this.pageNum = num
      this.selectRegion(this.defaultRegion)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法

.outzoneRule {
  display: flex;
  flex: 0%;
  background: #fff;
  height: 100%;
  // 宽度为70的div 用于页面分布
  .left {
    height: 100%;
    position: relative;
    margin-right: 10px;
    padding: 15px;
    border-right: 2px solid rgba(203, 215, 238, 0.3);
  }
  .right {
    height: 100%;
    position: relative;
    padding: 15px 15px 0 15px;
  }
  .elHeader3 {
    width: 100%;

  }
}
</style>
