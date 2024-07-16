<!-- 病床管理 -->
<template>
  <div id="orderMatchBusinessConfig" class="orderMatchBusinessConfig">
    <!-- ICU病区 -->
    <div class="orderMatchBusinessConfig-left">
      <el-container class="orderMatchBusinessConfig_container">
        <el-header class="elHeader1">
          <div>
            <i class="iconBlue"></i>
            <span>自动触发业务场景配置</span>
          </div>
        </el-header>
        <el-container style="height:calc(100% - 42px)">
          <el-header class="heightAuto">
            <!-- input输入 -->
            <div class="headerLeft"></div>
            <div class="headerRight m-b10">
              <el-button size="mini" type="primary" style="font-size:18px;height:34px;margin-right:5px;width:60px;"
                :icon="loading ? 'el-icon-loading' : 'el-icon-refresh'" @click="getDataList(1)"></el-button>
              <el-button v-hasPermi="['configuration:basicSettings:orderMatchBusiness']" class="queryButton"
                type="primary" @click.native.prevent="addTriggerSceneRow">新增</el-button>
            </div>
          </el-header>
          <el-main ref="leftDivCss" style="height: calc(100% - 112px)">
            <el-table
              @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
              ref="tableDataItem" :row-class-name="({ row }) => row.statusDict == 0 ? 'disabled' : ''"
              :data="tableDataItem" height="100%" highlight-current-row fit border element-loading-text="加载中"
              v-loading="loading" row-key="id" @row-click="selectTriggerSceneRow">
              <v-table-column label="医嘱操作节点" align="center" min-width="100">
                <template slot-scope="scope">
                  <el-select v-if="scope.row.isEdit" v-model="scope.row.operateCode" placeholder="请选择" clearable
                    filterable>
                    <el-option v-for="(option) in ICIS_DICT_ORDER_OPERATE" :key="option.dictCode" :label="option.dictName"
                      :value="option.dictCode" :disabled="option.statusDict == 0"></el-option>
                  </el-select>
                  <span v-else>{{ scope.row.operateCode | showDictNameFilter(ICIS_DICT_ORDER_OPERATE,
                    'dictCode_to_dictName') }}</span>
                </template>
              </v-table-column>
              <v-table-column label="触发业务" align="center" min-width="100">
                <template slot-scope="scope">
                  <el-select v-if="scope.row.isEdit" v-model="scope.row.busiTriggerCode" placeholder="请选择" clearable
                    filterable @change="handleChangeBusiTrigger(scope.row)">
                    <el-option v-for="(option) in ICIS_DICT_BUSI_TRIGGER" :key="option.dictCode" :label="option.dictName"
                      :value="option.dictCode" :disabled="option.statusDict == 0"></el-option>
                  </el-select>
                  <span v-else>{{ scope.row.busiTriggerCode | showDictNameFilter(ICIS_DICT_BUSI_TRIGGER,
                    'dictCode_to_dictName') }}</span>
                </template>
              </v-table-column>
              <v-table-column label="业务项目" align="center" min-width="100">
                <template slot-scope="scope">
                  <!-- 患者基本标识 -->
                  <template v-if="scope.row.busiTriggerCode == 1">
                    <el-select v-if="scope.row.isEdit" v-model="scope.row.subjectCode" placeholder="请选择" clearable
                      filterable>
                      <el-option v-for="(option) in businessItemList" :key="option.dictCode" :label="option.dictName"
                        :value="option.dictCode" :disabled="option.statusDict == 0"></el-option>
                    </el-select>
                    <span v-else>{{ scope.row.subjectCode | showDictNameFilter(businessItemList, 'dictCode_to_dictName')
                    }}</span>
                  </template>
                  <!-- 插管、拔管 -->
                  <template v-else-if="['2', '3'].includes(scope.row.busiTriggerCode)">
                    <el-select v-if="scope.row.isEdit" v-model="scope.row.subjectCode" placeholder="请选择" style="flex:1;"
                      filterable clearable>
                      <el-option :forceHide="item.statusDict != 1" v-for="item in catherBaseList"
                        :key="item.catheterCode + item.catheterName" :label="item.catheterName"
                        :disabled="item.statusDict == '0'" :value="item.catheterCode"></el-option>
                    </el-select>
                    <span v-else>{{ scope.row.subjectCode | showDictNameFilter(catherBaseList, 'code_to_name', '',
                      'catheterCode', 'catheterName') }}</span>
                  </template>
                  <template v-else-if="scope.row.busiTriggerCode == 4">
                    <el-select v-if="scope.row.isEdit" v-model="scope.row.subjectCode" placeholder="请选择" clearable
                      filterable>
                      <el-option v-for="(option) in qcConfigList" :key="option.qcCode" :label="option.qcName"
                        :value="option.qcCode" :disabled="option.statusDict == 0"></el-option>
                    </el-select>
                    <span v-else>{{ scope.row.subjectCode | showDictNameFilter(qcConfigList, 'code_to_name', '',
                      'qcCode', 'qcName') }}</span>
                  </template>
                  <v-select-mon filterable v-else-if="scope.row.isEdit && scope.row.busiTriggerCode == 5" clearable
                    v-model="scope.row.subjectCode" :options="moniitem_List">
                  </v-select-mon>
                  <span v-else>{{ scope.row.subjectCode | showDictNameFilter(moniitem_List, 'code_to_name', '',
                    'moniitemCode', 'moniitemName') }}</span>
                </template>
              </v-table-column>
              <v-table-column label="业务项目值" align="center" min-width="100">
                <template slot-scope="scope">
                  <el-select v-if="scope.row.isEdit && scope.row.busiTriggerCode == 1 && scope.row.subjectCode == 1"
                    v-model="scope.row.subjectDictCode" placeholder="请选择" clearable filterable
                    @change="$event => handleChangeSubject($event, scope.row, ICIS_DICT_QUARANTINE)">
                    <el-option v-for="(option) in ICIS_DICT_QUARANTINE" :key="option.dictCode" :label="option.dictName"
                      :value="option.dictCode" :disabled="option.statusDict == 0"></el-option>
                  </el-select>
                  <el-select v-else-if="scope.row.isEdit && scope.row.busiTriggerCode == 1 && scope.row.subjectCode == 2"
                    v-model="scope.row.subjectDictCode" placeholder="请选择" clearable filterable
                    @change="$event => handleChangeSubject($event, scope.row, ICIS_DICT_EAT)">
                    <el-option v-for="(option) in ICIS_DICT_EAT" :key="option.dictCode" :label="option.dictName"
                      :value="option.dictCode" :disabled="option.statusDict == 0"></el-option>
                  </el-select>
                  <el-select v-else-if="scope.row.isEdit && scope.row.busiTriggerCode == 1 && scope.row.subjectCode == 3"
                    v-model="scope.row.subjectDictCode" placeholder="请选择" clearable filterable
                    @change="$event => handleChangeSubject($event, scope.row, ICIS_DICT_SYNDROME_DIFFERENTIATION)">
                    <el-option v-for="(option) in ICIS_DICT_SYNDROME_DIFFERENTIATION" :key="option.dictCode"
                      :label="option.dictName" :value="option.dictCode" :disabled="option.statusDict == 0"></el-option>
                  </el-select>
                  <el-select v-else-if="scope.row.isEdit && scope.row.busiTriggerCode == 4"
                    v-model="scope.row.subjectDictCode" placeholder="请选择" clearable filterable
                    @change="$event => handleChangeSubject($event, scope.row, statusList)">
                    <el-option v-for="(option) in statusList" :key="`${option.dictCode}-busi`" :label="option.dictName"
                      :value="option.dictCode" :disabled="option.statusDict == 0"></el-option>
                  </el-select>
                  <span v-else>{{ scope.row.subjectValue }}</span>
                </template>
              </v-table-column>
              <v-table-column label="操作" align="center" width="130px" fixed="right">
                <template slot-scope="scope">
                  <el-button v-hasPermi="['configuration:basicSettings:orderMatchBusiness']" v-if="!scope.row.isEdit"
                    type="text" @click="updateTriggerSceneRow(scope.row, scope.$index)">修改</el-button>
                  <el-button v-hasPermi="['configuration:basicSettings:orderMatchBusiness']" type="text"
                    v-if="scope.row.isEdit" @click="cancelTriggerSceneRow(scope.row, scope.$index)">取消</el-button>
                  <el-button v-hasPermi="['configuration:basicSettings:orderMatchBusiness']" type="text"
                    v-if="scope.row.isEdit" @click="saveTriggerSceneRow(scope.row, scope.$index)">保存</el-button>
                  <el-button v-hasPermi="['configuration:basicSettings:orderMatchBusiness']" type="text"
                    v-if="!scope.row.isCreate" @click="deleteTriggerSceneRow(scope.row.id)"
                    style="color:red">删除</el-button>
                </template>
              </v-table-column>
            </el-table>
          </el-main>
          <el-footer>
            <el-pagination @size-change="changePagination" @current-change="changePagination"
              :current-page="queryData.pageNum" :hide-on-single-page="false" :page-size="queryData.pageSize" background
              layout="total, prev, pager, next" style="float:right;margin-top:15px;margin-right:-10px"
              :total="totolCount"></el-pagination>
          </el-footer>
        </el-container>
      </el-container>
    </div>
    <!-- 功能模块 -->
    <div class="orderMatchBusinessConfig-right rule-model">
      <el-container class="rule-model-container">
        <el-header class="elHeader1">
          <div>
            <i class="iconBlue"></i>
            <span>医嘱匹配规则配置</span>
          </div>
          <div>
            <el-button v-hasPermi="['configuration:basicSettings:orderMatchBusiness']" class="queryButton" type="primary"
              :disabled="isAddTriggerSceneRuleRow" @click.native.prevent="addTriggerSceneRuleRow">新增</el-button>
          </div>
        </el-header>
        <el-container style="height:calc(100% - 42px)">
          <el-main ref="rightDivCss" class="rule-model-table" style="height:100%">
            <el-table
              @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
              height="100%" ref="tableDataModule" :data="tableDataModule" highlight-current-row fit border row-key="id">
              <v-table-column width="150" label="医嘱项目类型" align="center">
                <template slot-scope="scope">
                  <el-select v-if="scope.row.isEdit" v-model="scope.row.dictCode" placeholder="请选择" clearable filterable
                    @change="handleChangeDictCode(scope.row)">
                    <el-option v-for="(option) in ICIS_DICT_ORDER_EXTRACT_ITEM_TYPE" :key="`${option.dictCode}-busi`"
                      :label="option.dictName" :value="option.dictCode" :disabled="option.statusDict == 0"></el-option>
                  </el-select>
                  <span v-else>{{ scope.row.dictCode | showDictNameFilter(ICIS_DICT_ORDER_EXTRACT_ITEM_TYPE,
                    'dictCode_to_dictName')
                  }}</span>
                </template>
              </v-table-column>
              <v-table-column label="医嘱项目编码" align="left">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.isEdit && ['1', '2'].includes(scope.row.dictCode)"
                    v-model="scope.row.itemCode" :maxlength="50"></el-input>
                  <span v-else>{{ scope.row.itemCode }}</span>
                </template>
              </v-table-column>
              <v-table-column label="医嘱项目名称" align="left">
                <template slot-scope="scope">
                  <el-select v-if="scope.row.isEdit && ['0'].includes(scope.row.dictCode)" v-model="scope.row.itemValue"
                    popper-class="fixed-width" clearable filterable :loading="loading" remote :remote-method="getDrugList"
                    @visible-change="clearDrugSearchKey" @clear="getDrugList()"
                    @change="selectDrugName($event, scope.row)">
                    <el-option v-for="(option, index) in drugList" :key="`${option.drugCode}-${index}`"
                      :label="`${option.drugName} ${option.drugSpec || ''} ${option.factoryName || ''}`"
                      :title="`${option.drugName} ${option.drugSpec || ''} ${option.factoryName || ''}`"
                      :value="option.drugName" :disabled="option.statusDict == 0"></el-option>
                  </el-select>
                  <el-input v-else-if="scope.row.isEdit && ['1', '2'].includes(scope.row.dictCode)"
                    v-model="scope.row.itemValue" :maxlength="50"></el-input>
                  <span v-else>{{ scope.row.itemValue }}</span>
                </template>
              </v-table-column>
              <v-table-column label="操作" fixed="right" align="center" width="130px">
                <template slot-scope="scope">
                  <el-button v-hasPermi="['configuration:basicSettings:orderMatchBusiness']" v-if="!scope.row.isEdit"
                    type="text" @click="updateTriggerSceneRuleRow(scope.row, scope.$index)">修改</el-button>
                  <el-button v-hasPermi="['configuration:basicSettings:orderMatchBusiness']" type="text"
                    v-if="scope.row.isEdit" @click="cancelTriggerSceneRuleRow(scope.row, scope.$index)">取消</el-button>
                  <el-button v-hasPermi="['configuration:basicSettings:orderMatchBusiness']" type="text"
                    v-if="scope.row.isEdit" @click="saveTriggerSceneRuleRow(scope.row, scope.$index)">保存</el-button>
                  <el-button v-hasPermi="['configuration:basicSettings:orderMatchBusiness']" type="text"
                    v-if="!scope.row.isCreate" @click="deleteTriggerSceneRuleRow(scope.row.id)"
                    style="color:red">删除</el-button>
                </template>
              </v-table-column>
            </el-table>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>
<script>
import {
  triggerScene_deleteById,
  triggerScene_edit,
  triggerScene_findWithPage,
  triggerScene_insert,
  triggerSceneRule_findWithPage,
  triggerSceneRule_insert,
  triggerSceneRule_edit,
  triggerSceneRule_deleteById,
  catheter_findWithPage,
  qcConfig_findWithPage,
  drug_findAllWithPage,
  moniitem_multipleListPage
} from '@/api/configuration'
import { debounce } from 'lodash'
export default {
  name: 'BedConfig',
  components: {},
  data: function () {
    return {
      // 加载
      loading: false,
      // 查询
      queryData: {
        pageNum: 1,
        pageSize: 10
      },
      tableDataItem: [], // 数据
      // 分页总量
      totolCount: 0,
      tableDataModule: [], // 医嘱匹配规则配置
      curRow: [], // 当前行数据
      curTriggerScene: null, // 当前选中自动触发业务场景
      curTriggerSceneRuleRow: [], // 当前行数据
      catherBaseList: [],
      ICIS_DICT_ORDER_OPERATE: [],
      ICIS_DICT_BUSI_TRIGGER: [],
      ICIS_DICT_QUARANTINE: [],
      ICIS_DICT_EAT: [],
      ICIS_DICT_SYNDROME_DIFFERENTIATION: [],
      ICIS_DICT_ORDER_EXTRACT_ITEM_TYPE: [],
      businessItemList: [
        {
          dictCode: '1',
          dictName: '隔离状态'
        },
        {
          dictCode: '2',
          dictName: '饮食'
        },
        {
          dictCode: '3',
          dictName: '辩证分型'
        }
      ],
      qcConfigList: [],
      statusList: [
        {
          dictCode: '1',
          dictName: '是'
        },
        {
          dictCode: '0',
          dictName: '否'
        }
      ],
      drugList: [],
      moniitem_List: [] // 监护数据字典集合
    }
  },
  props: {},
  computed: {
    isAddTriggerSceneRuleRow() {
      return this.curTriggerScene && !this.curTriggerScene?.id
    }
  },
  watch: {
    tableDataModule() {
      this.$refs.tableDataModule.doLayout()
    }
  },
  created() {
    this.init()
  },
  mounted() {
  },
  methods: {
    async init() {
      Promise.all([
        this.getQcConfig(),
        this.getBaseCatheterList(),
        this.$batchGetDictItemList(['ICIS_DICT_ORDER_OPERATE', 'ICIS_DICT_BUSI_TRIGGER', 'ICIS_DICT_QUARANTINE', 'ICIS_DICT_EAT', 'ICIS_DICT_SYNDROME_DIFFERENTIATION', 'ICIS_DICT_ORDER_EXTRACT_ITEM_TYPE']),
        moniitem_multipleListPage({ statusDict: '1' })
      ]).then(res => {
        this.qcConfigList = res[0]
        this.catherBaseList = res[1]
        const batchDictObj = res[2]
        for (const key in batchDictObj) {
          this[key] = batchDictObj[key]
        }
        const moniitem_List = res[3]
        this.moniitem_List = moniitem_List.data.result
        this.getDataList(1)
      })
    },
    // 获取自动触发业务场景仪器连机列表
    async getTriggerSceneRuleList(row) {
      if (row.id) {
        const query = {
          triggerSceneId: row.id,
          pageNum: 1,
          pageSize: 1000
        }
        const res = await triggerSceneRule_findWithPage(query)
        this.tableDataModule = res.data.result
      } else {
        this.tableDataModule = []
      }
    },
    debounceSearch() {
      this.debounceSearchSymbol = this.debounceSearchSymbol ? this.debounceSearchSymbol : debounce(function () {
        this.getDataList(1)
      }, 200)
      this.debounceSearchSymbol()
    },
    // 获取自动触发业务场景列表
    getDataList(page) {
      if (page) {
        this.queryData.pageNum = page
      }
      this.loading = true
      this.addRoleVisible = true
      const query = this.queryData
      triggerScene_findWithPage(query).then(res => {
        this.loading = false
        if (!(res.data && res.data.result)) {
          return
        }
        this.tableDataItem = res.data.result
        this.totolCount = res.data.totolCount
        if (this.tableDataItem.length) {
          this.getTriggerSceneRuleList(this.tableDataItem[0])
          this.curTriggerScene = this.tableDataItem[0]
          this.$refs.tableDataItem.setCurrentRow(this.tableDataItem[0])
        }
      })
    },
    // 新增自动触发业务场景
    addTriggerSceneRow() {
      if (this.tableDataItem.length > 0) {
        const first = this.tableDataItem[0]
        if (first.isCreate) {
          return
        }
      }
      this.tableDataItem.map(item => { item.isEdit = false })
      const row = {
        isCreate: true,
        isEdit: true,
        operateCode: '',
        busiTriggerCode: '',
        subjectCode: '',
        subjectDictCode: '',
        subjectValue: ''
      }
      this.tableDataItem.unshift(row)
    },
    // 修改自动触发业务场景
    updateTriggerSceneRow(row, index) {
      this.curRow[index] = { ...row }
      row.isEdit = true
      row.isCreate = false
      this.tableDataItem = JSON.parse(JSON.stringify(this.tableDataItem))
    },
    // 取消行的编辑状态
    cancelTriggerSceneRow(row, index) {
      row.isEdit = false
      if (row.isCreate) {
        this.tableDataItem.splice(index, 1)
      } else {
        this.tableDataItem[index] = this.curRow[index]
        this.tableDataItem = JSON.parse(JSON.stringify(this.tableDataItem))
      }
    },
    // 保存
    saveTriggerSceneRow(row, index) {
      if (row.operateCode === '') {
        this.$message.error('请选择医嘱操作节点')
        return
      } else if (row.busiTriggerCode === '') {
        this.$message.error('请选择触发业务')
        return
      } else if (row.subjectCode === '') {
        this.$message.error('请选择业务项目')
        return
      } else if (['1', '4'].includes(row.busiTriggerCode) && row.subjectValue == '') {
        this.$message.error('请输入业务项目值')
        return
      }
      const query = { ...row }
      delete query.isCreate
      delete query.isEdit
      if (!row.isCreate) {
        // 修改
        triggerScene_edit(query).then(res => {
          if (res.code === 0) {
            // this.getDataList()
            row.isEdit = false
            this.tableDataItem = JSON.parse(JSON.stringify(this.tableDataItem))
            this.$message.success('修改成功')
          }
        }).catch()
      } else {
        // 新增
        triggerScene_insert(row).then(res => {
          if (res.code === 0) {
            this.$message.success('新增成功')
            this.getDataList()
          }
        }).catch()
      }
    },
    // 删除自动触发业务场景
    deleteTriggerSceneRow(triggerSceneId) {
      triggerScene_deleteById(triggerSceneId).then(res => {
        if (res.code === 0) {
          this.getDataList()
        }
      }).catch()
    },
    //  选择对应的行
    selectTriggerSceneRow(row) {
      this.curTriggerScene = row
      this.getTriggerSceneRuleList(row)
    },
    // 分页变化
    changePagination(pageNum) {
      this.getDataList(pageNum)
    },
    // 新增医嘱匹配规则
    addTriggerSceneRuleRow() {
      if (this.tableDataModule.length > 0) {
        const first = this.tableDataModule[0]
        if (first.isCreate) {
          return
        }
      }
      this.tableDataModule.map(item => { item.isEdit = false })
      const row = {
        isCreate: true,
        isEdit: true,
        triggerSceneId: this.curTriggerScene.id,
        dictCode: '',
        itemCode: '',
        itemValue: '',
        statusDict: '1'
      }
      this.tableDataModule.unshift(row)
    },
    /**
     * 获取最大的序号
     */
    getBedSortNo() {

    },
    // 修改医嘱匹配规则
    updateTriggerSceneRuleRow(row, index) {
      this.curTriggerSceneRuleRow[index] = { ...row }
      row.isEdit = true
      row.isCreate = false
      this.tableDataModule = JSON.parse(JSON.stringify(this.tableDataModule))
    },
    // 取消行的编辑状态
    cancelTriggerSceneRuleRow(row, index) {
      row.isEdit = false
      if (row.isCreate) {
        this.tableDataModule.splice(index, 1)
      } else {
        this.tableDataModule[index] = this.curTriggerSceneRuleRow[index]
        this.tableDataModule = JSON.parse(JSON.stringify(this.tableDataModule))
      }
    },
    // 保存医嘱匹配规则
    saveTriggerSceneRuleRow(row, index) {
      if (row.dictCode === '') {
        this.$message.error('请选择医嘱项目类型')
        return
      }
      if (row.itemCode === '' && ['0', '2'].includes(row.dictCode)) {
        this.$message.error('请输入项目编码')
        return
      }
      if (row.itemValue === '' && ['0', '1'].includes(row.dictCode)) {
        this.$message.error('请输入项目名称')
        return
      }
      row.triggerSceneId = this.curTriggerScene.id
      let api = triggerSceneRule_edit
      if (row.isCreate) {
        api = triggerSceneRule_insert
      }
      const query = { ...row }
      delete query.isCreate
      delete query.isEdit
      api(query).then(async res => {
        if (res.code === 0) {
          this.getTriggerSceneRuleList(this.curTriggerScene)
          this.$message.success(row.isCreate ? '新增成功' : '修改成功')
        }
      })
    },
    // 删除医嘱匹配规则
    deleteTriggerSceneRuleRow(id) {
      this.$confirm('您确定要删除吗？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        triggerSceneRule_deleteById(id).then(res => {
          if (res.code === 0) {
            this.getTriggerSceneRuleList(this.curTriggerScene)
            this.$message.success('删除医嘱匹配规则成功')
          }
        })
      })
    },
    /** 获取所有导管 根据基础字典获取所有基础字典*/
    getBaseCatheterList() {
      return new Promise((resolve, reject) => {
        catheter_findWithPage({
          pageSize: 1000,
          pageNum: 1
        }).then(res => {
          if (res.code == 0) {
            resolve(res.data.result.filter(item => item.statusDict == '1'))
          } else {
            resolve([])
          }
        })
      })
    },
    getQcConfig() {
      return new Promise((resolve, reject) => {
        qcConfig_findWithPage({
          pageSize: 10000,
          pageNum: 1,
          statusDict: '1'
        }).then(res => {
          if (res.code == 0) {
            resolve(res.data.result)
          } else {
            resolve([])
          }
        })
      })
    },
    // 药品名称
    getDrugList(key) {
      this.loading = true
      const query = {
        pageNum: 1,
        pageSize: 10,
        searchKey: key
      }
      drug_findAllWithPage(query).then(res => {
        this.loading = false
        if (res.code == 0) {
          this.drugList = res.data.result
        }
      })
    },
    /**
     * 清除数据
     */
    clearDrugSearchKey() {
      if (this.drugList.length == 0) {
        this.getDrugList()
      }
    },
    // 根据drugcode 选择药品
    selectDrugName(e, obj) {
      if (e) {
        const result = this.drugList.filter(item => item.drugName == e)[0]
        obj.itemCode = result.drugCode
        obj.itemValue = result.drugName
      } else {
        obj.itemCode = ''
        obj.itemValue = ''
      }
    },
    handleChangeBusiTrigger(row) {
      row.subjectCode = ''
      row.subjectValue = ''
    },
    handleChangeDictCode(row) {
      row.itemCode = ''
      row.itemValue = ''
    },
    handleChangeSubject(e, row, dictList, type = 'dictCode_to_dictName') {
      if (e) {
        row.subjectValue = this.$options.filters['showDictNameFilter'](row.subjectDictCode, dictList, type)
      } else {
        row.subjectValue = ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法

@media only screen and (max-width: 1600px) {
  .mediaWidth {
    width: 140px;
  }
}

.orderMatchBusinessConfig {
  display: flex;
  flex: 0%;
  background: #fff;
  height: 100%;

  // 宽度为70的div 用于页面分布
  .orderMatchBusinessConfig-left {
    height: 100%;
    width: 50%;
    position: relative;
    padding: 10px;
    border-right: 2px solid rgba(203, 215, 238, 0.3);
  }

  // 宽度为30的div
  .orderMatchBusinessConfig-right {
    height: 100%;
    padding: 10px;
    width: 50%;
    position: relative;

    &.rule-model {
      .rule-model-container {
        height: 100%;

        .rule-model-table {
          height: 100%;
        }
      }
    }
  }

  .headerLeft {
    flex-grow: 1;
  }

  .orderMatchBusinessConfig_container {
    height: 100%;
  }
}
</style>
