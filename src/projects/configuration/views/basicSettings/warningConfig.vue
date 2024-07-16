<!-- 病床管理 -->
<template>
  <div id="warningConfig" class="warningConfig">
    <!-- 功能模块 -->
    <el-row style="width: 100%; height: 100% ">
      <el-col :span="pagePartsList[0].width" style="height:100%">
        <div class="left">
          <el-container style="height:100%">
            <el-header class="elHeader3">
              <div>
                <i class="iconBlue"></i>
                <span>{{pagePartsList[0].name}}</span>
              </div>
            </el-header>
            <el-container style="height:calc(100% - 32px)">
              <icu-region :defaultPermi="['configuration:basicSettings:warningConfig']" :defaultRegion="defaultRegion" :module="'moniitemWarning'"
                          @defaultRegionChange="defaultRegionChange"></icu-region>
            </el-container>
          </el-container>
        </div>
      </el-col>
      <el-col :span="pagePartsList[1].width" style="height:100%">
        <div class="center">
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
                <div class="headerLeft ">
                  <el-input size="small" placeholder="监护项编码" clearable suffix-icon="el-icon-search" @input="debounceSearch" v-model="searchKey"
                            ></el-input>
                  <el-checkbox v-model="statusDict" true-label="" false-label="1"  @change="debounceSearch">
                        显示禁用
                  </el-checkbox>
                </div>
                <div class="headerRight">
                  <el-button class="queryButton" type="primary" @click.native.prevent="selectRegion(defaultRegion)" size="small">查询</el-button>
                  <el-button v-hasPermi="['configuration:basicSettings:warningConfig']" class="queryButton" type="primary"
                             @click.native.prevent="addDictItem" size="small">新增</el-button>
                </div>
              </el-header>
              <el-main style="height:calc(100% - 42px)">
                <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" ref="tableData" :row-class-name="({row}) => row.statusDict == 0 ? 'disabled' : ''" :data="tableData" height="100%" row-key="moniitemCode" highlight-current-row fit border
                          @row-click="selectRow"  :key="tableKey">
                  <v-table-column label="监护项编码" key="moniitemCode" align="center" width="150px">
                    <template slot-scope="scope">
                      <span>{{scope.row.moniitemCode}}</span>
                    </template>
                  </v-table-column>
                  <v-table-column label="监护项名称" key="moniitemName" align="center" width="150px">
                    <template slot-scope="scope">
                      <v-select-mon filterable v-if="scope.row.isCreate && moniitem_List.length > 0"
                        clearable v-model="scope.row.moniitemCode" :options="moniitem_List" @change="seleceChangeFn(false,scope.row,scope.$index)">
                      </v-select-mon>
                      <span v-else>{{scope.row.moniitemName}}</span>
                    </template>
                  </v-table-column>
                  <v-table-column label="监护项说明" key="moniitemDesc" align="center" >
                    <template slot-scope="scope">
                      <span>{{scope.row.moniitemDesc}}</span>
                    </template>
                  </v-table-column>
                  <v-table-column label="选项类参考选项" key="referValues" align="center" >
                    <template slot-scope="scope">
                      <el-select v-if="scope.row.contentTypeDict=='3'||scope.row.contentTypeDict=='4'" :multiple="'multiple'" :value-key="'dictCode'"
                                 v-model="scope.row.referValues" placeholder="请选择" clearable filterable :disabled="!scope.row.isEdit">
                        <el-option v-for="(option) in scope.row.valueDictCodeOption" :key="option.dictId" :label="option.dictName"
                                   :value="option.dictCode"  :disabled="option.statusDict==0"></el-option>
                      </el-select>
                    </template>
                  </v-table-column>
                  <v-table-column label="数值范围最小值" key="minValue" align="center" >
                    <template slot-scope="scope">
                      <template v-if="scope.row.contentTypeDict=='1'">
                        <el-input type="number" v-if="scope.row.isEdit" v-model="scope.row.minValue" placeholder="请输入">
                        </el-input>
                        <span v-else>{{scope.row.minValue}}</span>
                      </template>
                    </template>
                  </v-table-column>
                  <v-table-column label="数值范围最大值" key="maxValue" align="center" >
                    <template slot-scope="scope">
                      <template v-if="scope.row.contentTypeDict=='1'">
                        <el-input type="number" v-if="scope.row.isEdit" v-model="scope.row.maxValue" placeholder="请输入">
                        </el-input>
                        <span v-else>{{scope.row.maxValue}}</span>
                      </template>
                    </template>
                  </v-table-column>
                  <v-table-column label="操作" align="center" fixed="right">
                    <template slot-scope="scope">
                      <el-button v-hasPermi="['configuration:basicSettings:warningConfig']" v-if="!scope.row.isEdit" type="text"
                                 @click="updateItemRow(scope.row, scope.$index)">修改</el-button>
                      <el-button v-hasPermi="['configuration:basicSettings:warningConfig']" type="text" v-if="scope.row.isEdit===true"
                                 @click="cancelItemRow(scope.$index,scope.row)">取消</el-button>
                      <el-button v-hasPermi="['configuration:basicSettings:warningConfig']" type="text" v-if="scope.row.isEdit===true"
                                 @click="saveItemRow(scope.row)">保存</el-button>
                      <el-button v-if="!scope.row.isCreate" v-hasPermi="['configuration:basicSettings:warningConfig']" type="text"
                                 @click="enableOrDisable(scope.row)" :style="{ color: scope.row.statusDict == 1 ? '#EC0000': '#00AB44' }">
                        {{+scope.row.statusDict ? '禁用' : '启用' }}</el-button>
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
      <el-col :span="pagePartsList[2].width" style="height:100%">
        <div class="right">
          <el-container style="height:100%" class="flex flex-ver">
            <el-container>
              <el-header>
                <div>
                  <i class="iconBlue"></i>
                  <span>{{pagePartsList[2].name}}</span>
                </div>
              </el-header>
            </el-container>
            <el-container style="height:calc(100% - 42px)" class="flex-ver">
              <el-header class="elHeader3">
                <div class="headerLeft ">
                </div>
                <div class="headerRight">
                  <el-button v-hasPermi="['configuration:basicSettings:warningConfig']" class="queryButton fr" type="primary"
                        @click.native.prevent="addWarningClass" size="small" v-if="['1','3','4'].includes(tableDataModule.contentTypeDict)">新增</el-button>
                </div>
              </el-header>
              <el-main style="height:calc(100% - 42px)">
                <AbnormalLevel :moniitemInfo.sync="tableDataModule" :wardCode.sync="defaultRegion" :moniitemCode.sync="tableDataModule.moniitemCode" ref="abnormalLevel" ></AbnormalLevel>
              </el-main>
            </el-container>
          </el-container>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapGetters } from 'vuex' // 存储方式
import {
  moniitem_findWithPageNotAttr,
  moniitemWarning_deleteById,
  moniitemWarning_edit,
  moniitemWarning_findAllWithPage,
  moniitemWarning_insert
} from '@/api/configuration'
import { unique, filterArrValue } from '@/utils/utils' // 存储方式
import { debounce } from 'lodash'
import icuRegion from '@/views/configuration/basicSettings/components/icuRegion.vue'
import AbnormalLevel from './components/abnormalLevel.vue'
export default {
  name: 'WarningConfig',
  components: {
    icuRegion,
    AbnormalLevel
  },
  data: function () {
    return {
      statusDict: '',
      // 页面布局左右布局 包括左中右多列布局
      // width 按照栅格布局每个部分占比el-col  name 头部标题
      moniitem_List: [],
      moniitem_ListAll: [],
      searchKey: '',
      pagePartsList: [
        {
          width: 4,
          name: 'ICU病区'
        },
        {
          width: 10,
          name: '预警配置'
        },
        {
          width: 10,
          name: '异常级别配置'
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
      tableDataModule: {}, //
      currItem: [], // 当前编辑数据
      totolCount: 0,
      pageSize: 15,
      pageNum: 1,
      tableKey: '',
      abnormalKey: ''
    }
  },
  props: {},
  watch: {},
  computed: {
    ...mapGetters(['currentUserWard'])
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
        const sure = this.moniitem_ListAll.filter(v => v.moniitemCode == row.moniitemCode)
        if (sure.length == 1) {
          this.tableData[index].moniitemCode = sure[0].moniitemCode
          this.tableData[index].moniitemName = sure[0].moniitemName
          this.tableData[index].moniitemDesc = sure[0].moniitemDesc
          this.tableData[index].valueDictCode = sure[0].valueDictCode
          this.tableData[index].moniitemValueTypeDict = this.moniitem_ListAll.filter(vv => vv.moniitemCode == sure[0].moniitemCode)[0].moniitemValueTypeDict
          this.tableData[index].contentTypeDict = this.moniitem_ListAll.filter(vv => vv.moniitemCode == sure[0].moniitemCode)[0].contentTypeDict
          this.tableData[index].referValues = this.tableData[index].referValues.length > 0 ? JSON.parse(this.tableData[index].referValues) : []
          const valueDictCode_list = unique(this.tableData.filter(v => v.valueDictCode).map(v => v.valueDictCode))
          const promiseList = valueDictCode_list.map(v => {
            return this.$getDictItemList(v)
          })
          const valueDictCode_result_list = await Promise.all(promiseList)
          const dictResultObj = {}
          for (let index = 0; index < valueDictCode_list.length; index++) {
            const key = valueDictCode_list[index]
            dictResultObj[key] = valueDictCode_result_list[index]
          }
          this.tableData = this.tableData.map(
            el => {
              if (el.valueDictCode) { // dataSourceDict == '2' 数据来源是字典
                el.valueDictCodeOption = dictResultObj[el.valueDictCode]
              }
              return el
            }
          )
          this.tableData = JSON.parse(JSON.stringify(this.tableData))
          this.tableKey = new Date().getTime()
        }
      } else { // 展开时
        this.moniitem_List = this.moniitem_ListAll.filter(v => {
          return this.tableData.filter(vv => {
            return vv.moniitemCode == v.moniitemCode
          }).length === 0
        })
      }
    },
    async init() {
      const moniitem_List = await moniitem_findWithPageNotAttr({ 'searchKey': '', 'contentTypeDict': '', 'dataSourceDict': '', 'pageNum': 1, 'pageSize': 3000 })
      this.moniitem_ListAll = this.moniitem_List = moniitem_List.data.result.filter(item => ['1', '3', '4'].includes(item.contentTypeDict))
    },

    // 保存数据
    saveItemRow(row, module) {
      // 这里反校验
      if (!this.$refs.abnormalLevel.validate(row, -1)) {
        return
      }
      if (row.contentTypeDict == '1') {
        row.referValues = ''
      } else if (['3', '4'].includes(row.contentTypeDict)) {
        if (Array.isArray(row.referValues)) {
          row.referValues = JSON.stringify(row.referValues)
        }
      }
      if (row.minValue && row.maxValue && +row.maxValue < +row.minValue) {
        this.$message({
          type: 'error',
          message: '最大值不能小于最小值'
        })
        return
      }
      const promise = row.isCreate ? moniitemWarning_insert(row) : moniitemWarning_edit(row)
      promise.then(res => {
        if (res.code == 0) {
          if (row.moniitemCode == this.tableDataModule.moniitemCode) {
            this.tableDataModule = { ...row }
            if (this.tableDataModule.contentTypeDict == '3' || this.tableDataModule.contentTypeDict == '4') {
              this.tableDataModule.abnormalDict = this.tableDataModule.valueDictCodeOption.map(item => {
                if (row.referValues.includes(item.dictCode)) {
                  item.normalDictFlag = 1
                }
                return item
              })
            }
          }
          this.selectRegion(this.defaultRegion)
          this.$refs.abnormalLevel?.getDataList()
        }
      })
      promise.catch(res => {
        this.selectRegion(this.defaultRegion)
      })
    },
    debounceSearch() {
      this.debounceSearchSymbol = this.debounceSearchSymbol ? this.debounceSearchSymbol : debounce(function () {
        this.selectRegion(this.defaultRegion)
      }, 200)
      this.debounceSearchSymbol()
    },
    async selectRegion(wardCode) {
      this.loading = true
      // 清空
      const params = {
        'pageNum': this.pageNum,
        'pageSize': this.pageSize,
        'wardCode': wardCode,
        'statusDict': this.statusDict,
        'searchKey': this.searchKey
      }
      const res = await moniitemWarning_findAllWithPage(params)
      if (res.code == 0) {
        this.totolCount = res.data.totolCount
        this.tableData = res.data.result.map((v) => {
          v.valueDictCode = this.moniitem_ListAll.filter(vv => vv.moniitemCode == v.moniitemCode)[0]?.valueDictCode
          v.moniitemValueTypeDict = this.moniitem_ListAll.filter(vv => vv.moniitemCode == v.moniitemCode)[0]?.moniitemValueTypeDict
          v.contentTypeDict = this.moniitem_ListAll.filter(vv => vv.moniitemCode == v.moniitemCode)[0]?.contentTypeDict
          v.referValues = v.referValues.length > 0 ? JSON.parse(v.referValues) : []
          v.hasValueDisable = true
          return v
        })
        const valueDictCode_list = unique(this.tableData.filter(v => v.valueDictCode).map(v => v.valueDictCode))
        const promiseList = valueDictCode_list.map(v => {
          return this.$getDictItemList(v)
        })
        const valueDictCode_result_list = await Promise.all(promiseList)
        const dictResultObj = {}
        for (let index = 0; index < valueDictCode_list.length; index++) {
          const key = valueDictCode_list[index]
          dictResultObj[key] = valueDictCode_result_list[index]
        }
        this.tableData = this.tableData.map(
          el => {
            if (el.valueDictCode) { // dataSourceDict == '2' 数据来源是字典
              el.valueDictCodeOption = dictResultObj[el.valueDictCode]
            }
            return el
          }
        )
        this.tableData = JSON.parse(JSON.stringify(this.tableData))
      }
      this.loading = false
    },
    defaultRegionChange(defaultRegion) {
      this.defaultRegion = defaultRegion
      if (defaultRegion === '') {
        this.tableData = []
      } else {
        if (this.timer) {
          clearInterval(this.timer)
        }
        if (this.moniitem_ListAll.length > 0) {
          this.selectRegion(this.defaultRegion)
        } else {
          this.timer = setInterval(() => {
            this.defaultRegionChange(defaultRegion)
          }, 200)
        }
      }
    },
    // 新增一行
    addDictItem: function () {
      if (this.tableData.length > 0) {
        const first = this.tableData[0]
        if (first.isCreate) {
          return
        }
      }
      const row = {
        'isCreate': true,
        'isEdit': true,
        'maxValue': '',
        'minValue': '',
        'moniitemCode': '',
        'moniitemDesc': '',
        'moniitemName': '',
        'referValues': [],
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
      this.tableDataModule = { ...row }
      if (this.tableDataModule.contentTypeDict == '3' || this.tableDataModule.contentTypeDict == '4') {
        this.tableDataModule.abnormalDict = this.tableDataModule.valueDictCodeOption.map(item => {
          if (row.referValues.includes(item.dictCode)) {
            item.normalDictFlag = 1
          }
          return item
        })
      }
    },
    /**
     * 启用禁用
     */
    enableOrDisable(row) {
      const params = { ...row }
      params.statusDict = row.statusDict == '1' ? '0' : '1'

      moniitemWarning_deleteById(params).then(res => {
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
    },
    addWarningClass() {
      this.$refs.abnormalLevel.addWarningClass()
    }

  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法

.warningConfig {
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
  .center{
    height: 100%;
    position: relative;
    padding: 15px 15px 0 15px;
    border-right: 2px solid rgba(203, 215, 238, 0.3);
  }
  .right{
    height: 100%;
    position: relative;
    padding: 15px 15px 0 15px;
  }
  .elHeader3 {
    width: 100%;

  }
}
</style>
