<template>
  <div class="w100 m-b10 h100">
    <div class="m-b10">
      <el-input v-model="paramSearchKey" placeholder="参数名称/参数编码/配置说明 Enter搜索" @keydown.enter.native.stop="getParamList" clearable class="m-r10" style="width:280px;" @clear="getParamList"></el-input>
      <span class="m-r10">业务模块</span>
      <el-select v-model="moduleCode" placeholder="请选择" filterable clearable style="width:160px;" class="m-r10" @change="getParamList" @clear="getParamList">
        <el-option :label="item.moduleName" :value="item.module" v-for="item in moduleOption" :key="item.moduleName"></el-option>
      </el-select>
    </div>
    <div style="height: calc(100% - 50px)">
      <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" ref="paramTable" :row-class-name="({row}) => row.statusDict == 0 ? 'disabled' : ''" :data="standardParamTable" border height="100%" >
        <v-table-column label="业务模块" prop="moduleName" width="90px">
        </v-table-column>
        <v-table-column label="参数编码" prop="paramCode" width="90px">
        </v-table-column>
        <v-table-column label="参数名称" prop="paramName" width="180px">
        </v-table-column>
        <v-table-column label="*参数值" prop="paramValue">
          <template slot-scope="scope">
            <template v-if="scope.row.paramType == '1'&&scope.row.isEdit">
              <el-switch v-model="scope.row.paramValue" :active-value="'1'" :inactive-value="'0'" active-text="是"
                inactive-text="否"></el-switch>
            </template>
            <!-- 数字 2-->
            <template v-if="scope.row.paramType == '2'&&scope.row.isEdit">
              <el-input type="number" @input="handleEndInput" v-model="scope.row.paramValue" placeholder="请输入"></el-input>
            </template>
            <!-- 文本 3-->
            <!-- 连接 4-->
            <template v-if="(scope.row.paramType == '3' || scope.row.paramType == '4' || scope.row.paramType == '7') && scope.row.isEdit">
              <el-input type="textarea" v-model="scope.row.paramValue" placeholder="请输入" autosize></el-input>
            </template>
            <!-- 下拉单选 5 下拉多选 6-->
            <template v-if="scope.row.paramType == '5' && scope.row.isEdit">
              <el-select v-model="scope.row.paramValue" :remote-method="(val) => filterData(val, scope.row)"
                @focus="(val) => filterData(val, scope.row)" @clear="(val) => filterData(val, scope.row)" clearable filterable remote
                placeholder="请选择" style="width:100%">
                <el-option v-for="(item) in scope.row.selectDict" :key="item.dictId || item.formId || item.dictCode"
                  :label="item.dictCode+':'+item.dictName" :value="item.dictCode">
                  <span>{{item.dictCode}}:{{item.dictName}}</span>
                </el-option>
              </el-select>
            </template>
            <template v-if="scope.row.paramType == '6' && scope.row.isEdit">
              <!-- row.selectDict 一样，单选多选，下拉的时候会冲突，所以建设这个小组件 -->
              <cacheSelect :row="scope.row" ref="cacheSelect"></cacheSelect>
            </template>
            <template v-if="scope.row.paramType == '7' && scope.row.isEdit">
              <!-- 自定义参数配置 -->
              <!-- <Flow0107 :paramValue="scope.row.paramValue" v-if="scope.row.paramCode == 'Flow_0107'"></Flow0107> -->
            </template>
            <template v-else-if="!scope.row.isEdit">
              {{ scope.row.paramDisplay || scope.row.paramValue }}
            </template>
          </template>
        </v-table-column>
        <v-table-column label="配置说明" prop="paramDesc">
          <template slot-scope="scope">
            <!-- 这里先给产品研发 放开编辑功能 实际上线版本不开 该功能 -->
            <el-input type="textarea" v-if="scope.row.isEdit" v-model="scope.row.paramDesc" placeholder="请输入"  autosize></el-input>
            <template v-else>{{scope.row.paramDesc}}</template>
          </template>
        </v-table-column>
        <v-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <el-button @click.native.prevent="editStandardParam(scope.row, scope.$index)" v-if="!scope.row.isEdit&&scope.row.id" type="text" size="small">编辑</el-button>
            <el-button @click.native.prevent="saveStandardParam(scope.row, scope.$index)" type="text" size="small" v-if="scope.row.isEdit">保存</el-button>
            <el-button v-if="scope.row.isEdit" @click.native.prevent="cancelStandardEdit(scope.row,scope.$index)"   type="text" size="small">取消</el-button>
          </template>
        </v-table-column>
      </el-table>
    </div>

    <el-dialog v-el-drag-dialog :title="customParamTitle" :visible.sync="customParamDialog" :before-close="closePramaDialog" custom-class="param-config-dialog" :width="customDialogWidth" append-to-body>
      <ParamEdit :paramInfo="customParamObj" ref="paramEdit" v-if="customParamObj&&customParamDialog" @paramSaveSuccess="saveSuccess" ></ParamEdit>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closePramaDialog">取消</el-button>
        <el-button type="primary" @click="modifySave">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { filterArrValue } from '@/utils/utils'
import {
  docDataParams_getParamsList,
  moniitem_multipleListPage,
  docDataParams_update,
  formconfig_listPage,
  docDataParams_getParamsModuleList
} from '@/api/configuration'
export default {
  name: 'ParamList',
  data() {
    return {
      moduleOption: [],
      moduleCode: '',
      paramSearchKey: '',
      standardParamTable: [],
      paramsTableScrollTop: 0,
      customParamTitle: '',
      customParamDialog: false,
      customParamObj: null,
      customDialogWidth: '760px',
      editStandardRow: null
    }
  },
  props: {
    formId: {
      type: String,
      default: ''
    }
  },
  components: {
    ParamEdit: () => import('./paramEdit.vue'),
    cacheSelect: () => import('@/views/configuration/basicSettings/components/paramConfig/cacheSelect.vue')
  },
  watch: {
    formId: function(newValue, oldValue) {
      this.moduleCode = ''
      this.paramSearchKey = ''
      this.editStandardRow = null
      this.getParamsModuleList()
      this.getParamList()
    }
  },
  created() {
    this.getParamsModuleList()
    this.getParamList()
  },
  methods: {
    /**
     * 获取参数列表
     */
    getParamList() {
      this.standardParamTable = []
      if (this.formId == '') {
        return
      }

      docDataParams_getParamsList({
        'docId': this.formId, // --必传，文书ID
        'serachKey': this.paramSearchKey, // --非必传，模糊搜索关键字
        'module': this.moduleCode // --非必传，模块编码
      }).then(res => {
        this.standardParamTable = res.data
      })
    },
    /**
     * 获取参数模块列表
     */
    getParamsModuleList() {
      docDataParams_getParamsModuleList(this.formId).then(res => {
          if (res.code == 0) {
            this.moduleOption = res.data
          }
        })
    },
    /**
     * 输入的校验 保留2位小数
     */
    handleEndInput(value) {
      this.row.paramValue = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
    },
    /**
     * 编辑 标准数据源
     */
    async editStandardParam(row, index) {
      if (this.editStandardRow) {
        this.$refs.paramTable.bodyWrapper.scrollTop = this.paramsTableScrollTop
        this.$message.warning('请先保存当前编辑行')
        return
      }
      this.editStandardRow = JSON.parse(JSON.stringify(row))
      this.paramsTableScrollTop = this.$refs.paramTable.bodyWrapper.scrollTop
      if (row.paramType == '7') {
        this.customParamObj = JSON.parse(JSON.stringify(row))
        this.customParamTitle = '【' + row.paramCode + ':' + row.paramName + '】设置'
        if (this.customParamObj.paramCode == 'FLOW_0110' || this.customParamObj.paramCode == 'FLOW_0112' || this.customParamObj.paramCode == 'ORDER_0002') {
          this.customDialogWidth = '960px'
        }
        this.customParamDialog = true
      } else {
        row.isEdit = true
        if (row.paramType == '5' || row.paramType == '6') {
          if (row.paramType == '6') {
            //  多选 值转换为数组
            if (
              typeof row.paramValue == 'string' &&
              row.paramValue.constructor == String
            ) {
              if (row.paramValue == '') {
                row.paramValue = []
              } else {
                row.paramValue = row.paramValue.split(',')
              }
            }
          }
          if (row.selectType == '1') {
            // 字典 去拿字典值
            if (!Array.isArray(row.selectDict)) {
              row.selectDict = await this.$getDictItemList(
                row.selectDict
              )
              row.allSelectDict = JSON.parse(
                JSON.stringify(row.selectDict)
              )
            }
          } else if (row.selectType == '2' || row.selectType == '105' || row.selectType == '106') {
            // 去监护表拿数据
            if (
              !(
                row.selectDict &&
                typeof row.selectDict == 'object' &&
                row.selectDict.constructor == Array
              )
            ) {
              row.selectDict = await this.getMoniitem(row)
            }
          } else if (row.selectType == '3') {
            // 自定义 拿后台给的 ’selectDict‘
            if (
              !(
                row.selectDict &&
                typeof row.selectDict == 'object' &&
                row.selectDict.constructor == Array
              )
            ) {
              const selectDict = []
              row.selectDict = JSON.parse(row.selectDict)
              for (const i in row.selectDict) {
                selectDict.push({
                  dictName: row.selectDict[i],
                  dictCode: i,
                  statusDict: '1'
                })
              }
              row.selectDict = selectDict
              row.allSelectDict = JSON.parse(
                JSON.stringify(row.selectDict)
              )
            }
          } else if (row.selectType == '1012') {
            // 评估单列表
            row.selectDict = await this.getAssementList(
            )
            row.allSelectDict = JSON.parse(
              JSON.stringify(row.selectDict)
            )
          }
        }
        console.log('row', row)
        this.standardParamTable = [...this.standardParamTable]
      }
    },

    /**
     * 获取评估单数据
     */
    getAssementList(key) {
      return new Promise((resolve, reject) => {
        formconfig_listPage({
          pageSize: 20,
          pageNum: 1,
          searchKey: key
        }).then(res => {
          const result = res.data.result.map(item => {
            return {
              dictCode: item.formCode,
              statusDict: item.statusDict,
              dictName: item.formName
            }
          })
          resolve(result)
        })
      })
    },
    /**
     * 保存标准参数数据
     */
    saveStandardParam(row, index) {
      // 多选情况保存
      let valueIsValue = false
      const query = {
        id: row.id
      }

      if (this.editStandardRow.paramValue != row.paramValue) {
        valueIsValue = true
        query.paramValue = row.paramValue
        if (row.paramType == '6') { // 多选
          query.paramValue = row.paramValue.toString()
          row.paramValue = row.paramValue.toString()
          console.log('row.selectType', row.selectType, row.selectDict)
          const paramDisplay = this.multipleFilterArr(row.paramValue, row.selectDict, 'dictCode', 'dictName')
          query.paramDisplay = paramDisplay
          row.paramDisplay = paramDisplay
        } else if (row.paramType == '5') {
          const paramDisplay = filterArrValue(query.paramValue, row.allSelectDict, 'dictCode', 'dictName')
          query.paramDisplay = query.paramValue + ':' + paramDisplay
          row.paramDisplay = query.paramValue + ':' + paramDisplay
        }
      }
      if (this.editStandardRow.paramDesc != row.paramDesc) {
          valueIsValue = true
          query.paramDesc = row.paramDesc
      }
      if (valueIsValue) { // 值有变化
        docDataParams_update(query).then(res => {
          if (res.code == 0) {
            row.isEdit = false
            this.standardParamTable = [...this.standardParamTable]
            this.editStandardRow = null
            // 存在级联关系 需要弹窗
          }
        })
      } else {
        this.cancelStandardEdit(row, index)
      }
    },
    /**
     * 自定义参数设置保存
     */
    modifySave() {
      this.$refs.paramEdit.modifySave()
    },
    /**
     * 保存成功回调方法
     */
    saveSuccess(obj) {
      const index = this.standardParamTable.findIndex(item => item.id == obj.id)
      this.standardParamTable[index].isEdit = false
      this.standardParamTable[index].paramValue = obj.paramValue
      this.standardParamTable[index].paramDesc = obj.paramDesc

      this.closePramaDialog()
    },
    /**
     * 取消编辑
     */
    cancelStandardEdit(row, index) {
      row.isEdit = false
      this.standardParamTable[index] = this.editStandardRow
      this.standardParamTable = [...this.standardParamTable]
      this.editStandardRow = null
    },

    /**
     * 单选过滤
     */
    async filterData(key, row) {
      if (typeof key != 'string') {
        key = ''
      }
      if (row.selectType == '1') {
        // 字典值
        row.selectDict = row.allSelectDict.filter(res => {
          return (
            res.dictCode.indexOf(key) !== -1 || res.dictName.indexOf(key) !== -1
          )
        })
      } else if (row.selectType == '2' || row.selectType == '105' || row.selectType == '106') {
        // 监护表
        row.selectDict = await this.getMoniitem(row, key)
      } else if (row.selectType == '3') {
        // 自定义
        row.selectDict = row.allSelectDict.filter(res => {
          return (
            res.dictCode.indexOf(key) !== -1 || res.dictName.indexOf(key) !== -1
          )
        })
      } else if (row.selectType == '1012') {
        row.selectDict = await this.getAssementList(key)
        row.allSelectDict = JSON.parse(JSON.stringify(row.selectDict))
      }
    },
    /**
     * 获取监护项字典
     */
    getMoniitem(row, key, type) {
      return new Promise(resolve => {
        let moniitemCode = []
        if (row.paramType == '6') { // 多选
          if (row?.paramValue && row?.paramValue != '' && typeof row.paramValue == 'string' &&
              row.paramValue.constructor == String) {
            moniitemCode = row?.paramValue.split(',')
          } else if (Array.isArray(row?.paramValue)) {
            moniitemCode = row?.paramValue
          }
        } else if (row.paramType == '5') {
          moniitemCode.push(row.paramValue)
        }
        const query = {
          moniitemCodes: moniitemCode, // 本条数据放第一条查询出来
          limit: 50, // 查询前多少条
          statusDict: '1', // 查询启用的
          searchKey: key || '' // 搜索条件
        }
        if (row.selectType == '105') {
          query.balanceType = 'in'
        } else if (row.selectType == '106') {
          query.balanceType = 'out'
        }
        moniitem_multipleListPage(query).then(res => {
          const data = []
          if (res?.data?.result) {
            res.data.result.map(item => {
              data.push({
                dictCode: item.moniitemCode,
                statusDict: item.statusDict,
                dictName: item.moniitemName
              })
            })
          }
          resolve(data)
        })
      })
    },
    /**
     * 校验数据是否可以编辑
     */
    validateDataStatus(row) {

    },
    multipleFilterArr(value, arr, code, name) {
      const valueList = value.split(',')
      return arr.filter(item => valueList.includes(item[code])).map(item => {
        return item[code] + ':' + item[name]
      }).toString(',')
    },
    /**
     * 关闭参数设置
     */
    closePramaDialog() {
      this.customParamDialog = false
      this.editStandardRow = null
      this.customParamObj = null
    }
  }
}
</script>
