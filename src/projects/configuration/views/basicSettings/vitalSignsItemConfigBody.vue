<!-- 生命体征记录设置 -->
<template>
  <div id="vitalSignsItemConfigBody">
    <el-row style="width: 100%; height: 50%;">
      <!-- 左2 上 -->
      <el-col :span="24" style="height: 100%;">
        <div class="right" style="height: 100%;">
          <el-container style="height: 100%;">
            <el-header class="elHeader1">
              <div>
                <i class="iconBlue"></i>
                <span>生命体征曲线设置</span>
              </div>
            </el-header>
            <el-container style="height: calc(100% - 42px)">
              <el-header class="elHeader3">
                <div class="headerRight">
                  <el-checkbox v-model="statusDict" true-label="" false-label="1" @change="selectRegion(defaultRegion)">
                        显示禁用
                  </el-checkbox>
                  <el-button v-hasPermi="['configuration:basicSettings:vitlSignConfig']" class="queryButton" type="primary" :disabled="isInsertStatus"
                             @click.native.prevent="addDictItem">添加配置项</el-button>
                </div>
              </el-header>
              <el-main style="height: calc(100% - 42px)">
                <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)"  ref="table" :row-class-name="({row}) => row.statusDict == 0 ? 'disabled' : ''" :data="tableData" style="width: 100%" height="100%" highlight-current-row border>

                  <v-table-column label="监护项编码" align="center" prop="moniitemCode">
                    <template slot-scope="scope">
                      {{scope.row.moniitemCode}}
                    </template>
                  </v-table-column>
                  <v-table-column label="监护项名称" align="center" prop="moniitemName">
                    <template slot-scope="scope">
                      <span v-if="scope.row.hasValueDisable ||!scope.row.isEdit">{{scope.row.moniitemName}}</span>
                        <v-select-mon  v-else filterable  clearable
                                      v-model="scope.row.moniitemCode" :options="moniitem_List">
                        </v-select-mon>

                    </template>
                  </v-table-column>
                  <v-table-column label="监护项说明" align="center" prop="moniitemDesc">
                    <template slot-scope="scope">
                      {{scope.row.moniitemDesc}}
                    </template>
                  </v-table-column>
                  <v-table-column label="曲线类型" align="center" prop="lineTypeDict" style="background:#000;">
                    <template slot-scope="scope">

                      <el-select v-if="scope.row.isEdit" value-key="codeValue" v-model="scope.row.lineTypeDict" placeholder="请选择" clearable filterable
                                 :disabled="!scope.row.isEdit">
                        <el-option v-for="(option) in lineOptions" :key="option.codeValue" :label="option.codeName" :value="option.codeValue">
                        </el-option>
                      </el-select>
                      <span v-else>
                        {{scope.row.lineTypeDict|showDictNameFilter(lineOptions)}}
                      </span>
                    </template>
                  </v-table-column>
                  <v-table-column label="符号类型" align="center" prop="name" style="background:#000;">
                    <template slot-scope="scope">
                      <el-select v-if="scope.row.isEdit" value-key="dictId" style="width: 100%" v-model="scope.row.symbolDict" placeholder="请选择"
                                 clearable filterable :disabled="!scope.row.isEdit">
                        <el-option v-for="(item) in ICIS_DICT_MONI_SVG" :key="item.dictId" :value="item.dictAbbr">
                          <svg width="20" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="图层_1"
                               x="0px" y="0px" viewBox="0 0 20 20" style="enable-background:new 0 0 20 20;" xml:space="preserve">
                            <path :d="item.dictAbbr" />
                          </svg>
                        </el-option>
                      </el-select>
                      <template v-else-if="!scope.row.isEdit&&scope.row.symbolDict">
                        <svg width="20" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="图层_1" x="0px"
                             y="0px" viewBox="0 0 20 20" style="enable-background:new 0 0 20 20;" xml:space="preserve">
                          <path :d="scope.row.symbolDict" />
                        </svg>
                      </template>
                    </template>
                  </v-table-column>
                  <v-table-column label="符号颜色" align="center" prop="colorDict">
                    <template slot-scope="scope">
                      <el-color-picker :disabled="!scope.row.isEdit" v-model="scope.row.colorDict"></el-color-picker>
                    </template>
                  </v-table-column>
                  <v-table-column label="开始值" align="center" prop="minValue">
                    <template slot-scope="scope">
                      <el-input-number style="width:100px" :controls="false" v-if="scope.row.isEdit" v-model="scope.row.minValue" placeholder="请输入">
                      </el-input-number>
                      <span v-else>{{scope.row.minValue}}</span>
                    </template>
                  </v-table-column>
                  <v-table-column label="结束值" align="center" prop="maxValue">
                    <template slot-scope="scope">
                      <el-input-number style="width:100px" :controls="false" v-if="scope.row.isEdit" v-model="scope.row.maxValue" placeholder="请输入">
                      </el-input-number>
                      <span v-else>{{scope.row.maxValue}}</span>
                    </template>
                  </v-table-column>
                  <v-table-column label="操作" align="center" width="200px">
                    <template slot-scope="scope">
                      <el-button v-hasPermi="['configuration:basicSettings:vitlSignConfig']" v-if="!scope.row.isEdit" type="text"
                                 @click="updateItemRow(scope.row,'vitalSigns', 'tableData', scope.$index)">修改</el-button>
                      <el-button v-hasPermi="['configuration:basicSettings:vitlSignConfig']" type="text" v-if="scope.row.isEdit===true"
                                 @click="cancelItemRow(scope.row,'vitalSigns', 'tableData', scope.$index)">取消</el-button>
                      <el-button v-hasPermi="['configuration:basicSettings:vitlSignConfig']" type="text" v-if="scope.row.isEdit===true"
                                 @click="saveItemRow(scope.row,'vitalSigns', 'tableData')">保存</el-button>
                      <el-button v-if="!scope.row.isCreate" v-hasPermi="['configuration:basicSettings:vitlSignConfig']" type="text"
                                 @click="enableOrDisable(scope.row)" :style="{ color: scope.row.statusDict == 1 ? '#EC0000': '#00AB44' }">
                        {{+scope.row.statusDict ? '禁用' : '启用' }}
                      </el-button>
                    </template>
                  </v-table-column>
                </el-table>
              </el-main>
            </el-container>
          </el-container>
        </div>
      </el-col>
    </el-row>
    <el-row style="width: 100%; height: 50%;">
      <!-- 左2 下 -->
      <el-col :span="24" style="height: 100%;">
        <div class="right" style="height: 100%;">
          <el-container style="height: 100%;">
            <el-header class="elHeader1">
              <div>
                <i class="iconBlue"></i>
                <span>物理降温图标配置</span>
              </div>
            </el-header>
            <el-container style="height: calc(100% - 42px)">
              <el-main style="height: 100%;">
                <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)"  ref="table1"  :data="tableDataItemPhysics" style="width: 100%" height="100%" highlight-current-row border>
                  <v-table-column label="监护项编码" align="center" prop="code">
                    <template slot-scope="scope">
                      <span>{{scope.row.successCode_failCode}}</span>
                    </template>
                  </v-table-column>
                  <v-table-column label="监护项名称" align="center" prop="name">
                    <template slot-scope="scope">
                      <span>{{scope.row.successName_failName}}</span>
                    </template>
                  </v-table-column>
                  <v-table-column label="监护项简称" align="center" prop="name">
                    <template slot-scope="scope">
                      <span>{{scope.row.successAbbr_failAbbr}}</span>
                    </template>
                  </v-table-column>
                  <v-table-column label="符号类型" align="center" prop="name" style="background:#000;">
                    <template slot-scope="scope">
                      <el-select v-if="scope.row.isEdit" value-key="dictId" style="width: 100%" v-model="scope.row.successSymbolDict_failSymbolDict"
                                 placeholder="请选择" clearable filterable :disabled="!scope.row.isEdit">
                        <el-option v-for="(item) in ICIS_DICT_MONI_SVG" :key="item.dictId" :value="item.dictAbbr">
                          <svg width="20" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="图层_1"
                               x="0px" y="0px" viewBox="0 0 20 20" style="enable-background:new 0 0 20 20;" xml:space="preserve">
                            <path :d="item.dictAbbr" />
                          </svg>
                        </el-option>
                      </el-select>
                      <template v-else-if="!scope.row.isEdit&&scope.row.successSymbolDict_failSymbolDict">
                        <svg width="20" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="图层_1" x="0px"
                             y="0px" viewBox="0 0 20 20" style="enable-background:new 0 0 20 20;" xml:space="preserve">
                          <path :d="scope.row.successSymbolDict_failSymbolDict" />
                        </svg>
                      </template>
                    </template>
                  </v-table-column>
                  <v-table-column label="符号颜色" align="center" prop="name">
                    <template slot-scope="scope">
                      <el-color-picker :disabled="!scope.row.isEdit" v-model="scope.row.successColorDict_failColorDict"></el-color-picker>
                    </template>
                  </v-table-column>
                  <v-table-column label="操作" align="center" width="200px">
                    <template slot-scope="scope">
                      <el-button v-hasPermi="['configuration:basicSettings:vitlSignConfig']" v-if="!scope.row.isEdit" type="text"
                                 @click="updateItemRow(scope.row,'cooling', 'tableDataItemPhysics', scope.$index)">修改</el-button>
                      <el-button v-hasPermi="['configuration:basicSettings:vitlSignConfig']" type="text" v-if="scope.row.isEdit===true"
                                 @click="cancelItemRow(scope.row,'cooling', 'tableDataItemPhysics', scope.$index)">取消</el-button>
                      <el-button v-hasPermi="['configuration:basicSettings:vitlSignConfig']" type="text" v-if="scope.row.isEdit===true"
                                 @click="saveItemRow(scope.row,'cooling', 'tableDataItemPhysics')">保存</el-button>
                    </template>
                  </v-table-column>
                </el-table>
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
  moniitem_multipleListPage, // 监护项
  cooling_edit, // 物理降温
  cooling_getById, // 物理降温
  vitalSigns_deleteById, // 曲线
  vitalSigns_edit,
  vitalSigns_findAllWithPage,
  vitalSigns_insert
} from '@/api/configuration'
export default {
  name: 'VitalSignsItemConfig',
  components: {
  },
  data: function () {
    return {
      statusDict: '',
      ICIS_DICT_MONI_SVG: [],
      moniitem_List: [],
      searchKey: '',
      // 生命体征曲线
      tableData: [], // 数据
      // 线性特性
      lineOptions: [
        { codeValue: 'point', codeName: '点' },
        { codeValue: 'line', codeName: '折线' },
        { codeValue: 'vLine', codeName: '纵连线' }
      ],
      // 颜色分类
      colorOptions:
        // 紫色#E7086E、绿色#177706、蓝色#1A00ED、黄色#F59A23、红色#D9001B
        [{ codeValue: '#E7086E', codeName: '紫色' },
        { codeValue: '#177706', codeName: '绿色' },
        { codeValue: '#1A00ED', codeName: '蓝色' },
        { codeValue: '#F59A23', codeName: '黄色' },
        { codeValue: '#D9001B', codeName: '红色' }],
      // 表单数据
      tableDataItemPhysics: [
        {
          code: '1',
          name: '体温',
          remark: '患者体温是否正常',
          lineType: 'point',
          iconType: '',
          color: '#E7086E',
          isEdit: false
        }
      ], // 数据
      coolingData: {},
      currItem: [] // 当前行
    }
  },
  props: {
    defaultRegion: {
      type: String

    }
  },
  watch: {},
  computed: {
    ...mapGetters(['currentUserWard']),
    isInsertStatus() {
      const bool = this.tableData.filter(v => v.isCreate).length > 0
      return bool
    }
  },
  async created() {
    const ICIS_DICT_MONI_SVG = await this.$getDictItemList('ICIS_DICT_MONI_SVG')
    this.ICIS_DICT_MONI_SVG = ICIS_DICT_MONI_SVG.map(v => {
      v.dictAbbr = decodeURI(v.dictAbbr)
      return v
    }).filter(v => v.statusDict == 1)
    this.getList()
 },

  methods: {
    async getList() {
      const res = await moniitem_multipleListPage({
          moniitemValueTypeDict: '1',
          statusDict: '1'
      })
      // 获取监护项字典数据
      this.moniitem_List = res.data.result
    },
    /**
     * 启用禁用
     */
    enableOrDisable(row) {
      vitalSigns_deleteById({
        'moniitemCode': row.moniitemCode,
        'wardCode': this.defaultRegion,
        statusDict: row.statusDict == '1' ? '0' : '1'
      }).then(res => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: +row.statusDict ? '已禁用' : '已启用'
          })
          this.selectRegion(this.defaultRegion)
        }
      })
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.tableDataModule.toggleRowSelection(row)
        })
      } else {
        this.$refs.tableDataModule.clearSelection()
      }
    },
    selectRegion(wardCode) {
      this.loading = true
      // 清空
      const params = {
        'pageNum': 1,
        'pageSize': 1000,
        'wardCode': wardCode,
        'statusDict': this.statusDict,
        'searchKey': ''
      }
      vitalSigns_findAllWithPage(params).then(res => {
        if (res.code == 0) {
          this.tableData = res.data.result.map(v => {
            v.hasValueDisable = true
            v.isEdit = false
            return v
          })
        }
        this.loading = false
      })
      const params_p = {
        'wardCode': wardCode
      }
      cooling_getById(params_p).then(res => {
        if (res.code == 0) {
          this.coolingData = res.data
          this.tableDataItemPhysics = [{
            isEdit: false,
            successCode_failCode: res.data.successCode,
            successName_failName: res.data.successName,
            successAbbr_failAbbr: res.data.successAbbr,
            successSymbolDict_failSymbolDict: res.data.successSymbolDict,
            successColorDict_failColorDict: res.data.successColorDict
          }, {
            isEdit: false,
            successCode_failCode: res.data.failCode,
            successName_failName: res.data.failName,
            successAbbr_failAbbr: res.data.failAbbr,
            successSymbolDict_failSymbolDict: res.data.failSymbolDict,
            successColorDict_failColorDict: res.data.failColorDict
          }]
        }
        this.loading = false
      })
    },
    // 添加配置项
    addDictItem() {
      if (this.tableData.length > 0) {
        const first = this.tableData[0]
        if (first.isCreate) {
          return
        }
      }
      const row = {
        'isCreate': true,
        'isEdit': true,
        'colorDict': '#E7086E',
        'lineTypeDict': 'line',
        'maxValue': '',
        'minValue': '',
        'moniitemCode': '',
        'moniitemDesc': '',
        'moniitemName': '',
        'statusDict': '',
        'symbolDict': '',
        'wardCode': this.defaultRegion,
        'wardName': this.currentUserWard.wardName,
        'yaxis': '1'
      }
      this.tableData.unshift(row)
    },
    // 编辑当前行
    updateItemRow(row, module, data, index) {
      this.currItem[index] = { ...row }
      row.isEdit = true
      this[data] = JSON.parse(JSON.stringify(this[data]))
    },
    // 取消当前编辑
    cancelItemRow(row, module, data, index) {
      row.isEdit = false
      if (row.isCreate) {
        this[data].splice(index, 1)
      } else {
        this[data] = JSON.parse(JSON.stringify(this[data]))
        this[data][index] = this.currItem[index]
      }
    },
    // 保存数据
    saveItemRow(row, module, data) {
      let promise
      switch (module) {
        case 'vitalSigns':
          if (!row.moniitemCode) {
            this.$message.error('请选择监护项！！！')
            return
          }
          if (!row.lineTypeDict || !row.symbolDict || row.minValue === undefined || row.maxValue === undefined) {
            const list = [!row.lineTypeDict ? '曲线类型' : '', !row.symbolDict ? '符号类型' : '', row.minValue === undefined ? '开始值' : '', row.maxValue === undefined ? '结束值' : ''].filter(v => v)
            const text = list.join(',')
            this.$message.error(`请选择 ${text}`)
            return
          }
          if (!isNaN(row.minValue) && !isNaN(row.maxValue) && row.minValue > row.maxValue) {
            this.$message.error('开始值不能大于结束值！！！')
            return
          }
          promise = row.isCreate ? vitalSigns_insert(row) : vitalSigns_edit(row)
          break
        case 'cooling': {
          const row_p = {}
          for (const key in row) {
            if (Object.hasOwnProperty.call(row, key)) {
              if (key.indexOf('_') < 0) continue
              const keylist = key.split('_')
              row_p[row.successName_failName == '物理降温(成功)' ? keylist[0] : keylist[1]] = row[key]
            }
          }
          promise = cooling_edit(Object.assign({}, this.coolingData, row_p))
          break
        }
        default:
          break
      }
      promise.then(res => {
        if (res.code == 0) {
          this.$message.success('保存成功')
          if (row.isCreate) {
            this.selectRegion(this.defaultRegion)
          } else {
            this[data] = JSON.parse(JSON.stringify(this[data]))
          }
        }
        this.loading = false
      })
      row.isEdit = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法

#vitalSignsItemConfigBody {
  width: 100%;
  height: 100%;
  .elHeader3 {
    .headerLeft {
      flex: 1;
    }
    //头部栏中的右侧 新增 查询 按钮样式
    .headerRight {
      width: 100%;
      // display: flex;
      // justify-content: flex-end;
      .el-button {
        width: 90px;
      }
    }
  }
}
</style>
