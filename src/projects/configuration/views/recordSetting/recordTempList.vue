<!-- 特护单配置 -->
<template>
  <el-container id="recordList" class="recordList" element-loading-text="加载中" v-loading="loading">
    <!-- 左侧菜单 -->
    <div class="recordList_left">
      <el-container class="recordList_left_div">
        <el-header class="elHeader1">
          <div>
            <i class="iconBlue"></i>
            <span>文书模板列表</span>
          </div>
        </el-header>
        <!-- 输入部分 -->
        <div class="recordList_left_header">
          <el-input @keyup.enter.native="init" class="input" v-model="searchForm.searchKey" size="small" clearable
            placeholder="文书模板名称" suffix-icon="el-icon-search" @input="init"></el-input>
          <el-checkbox v-model="searchForm.statusDict" true-label="" false-label="1">
            显示禁用
          </el-checkbox>
          <el-radio-group v-model="tempTypeName" @change="init">
            <el-radio-button label="护理文书模板"></el-radio-button>
            <el-radio-button label="内置单据打印模板"></el-radio-button>
            <el-radio-button label="患者评估打印模板"></el-radio-button>
          </el-radio-group>
          <el-button @click.native.prevent="addRow()" type="primary" size="small">新增模板</el-button>
        </div>
        <!-- 表格 -->
        <el-main class="recordList_left_main" >
          <el-table
            @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
            ref="table" height="100%" :row-class-name="({ row }) => row.statusDict == 0 ? 'disabled' : ''"
            :data="filterDatas" border>
            <v-table-column label="序号" prop="sortNo">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.sortNo" placeholder="请输入" :min="1"
                  v-if="scope.row.isEdit"></el-input-number>
                <span v-else>{{ scope.row.sortNo }}</span>
              </template>
            </v-table-column>
            <v-table-column label="模板名称" prop="tempName">
              <template slot-scope="scope">
                <el-input v-model="scope.row.tempName" placeholder="请输入" :maxlength="30"
                  v-if="scope.row.isEdit"></el-input>
                <span v-else>{{ scope.row.tempName }}</span>
              </template>
            </v-table-column>
            <v-table-column label="页数" prop="tempPageNum" width="80px">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.tempPageNum" placeholder="请输入" :min="1"
                  v-if="scope.row.isEdit"></el-input-number>
                <span v-else>{{ scope.row.tempPageNum }}</span>
              </template>
            </v-table-column>
            <v-table-column label="多页模式" prop="multiPageMode" width="80px">
              <template slot-scope="scope">
                <el-select v-model="scope.row.multiPageMode" placeholder="请选择" clearable v-if="scope.row.isEdit">
                  <el-option label="正反面" value="0"></el-option>
                  <el-option label="非正反面" value="1"></el-option>
                </el-select>
                <span v-else>{{ filterArrValue(scope.row.multiPageMode, multiPageOptions, 'dictCode', 'dictName', '')
                }}</span>
              </template>
            </v-table-column>
            <v-table-column label="适用查询模式" prop="suitPatternTemp" v-if="tempType == '1'">
              <template slot-scope="scope">
                <el-cascader :options="printModeList" :props="{ multiple: true }" clearable
                  v-model="scope.row.suitPatternTemp" @change="selectModeList($event, scope.row, true)"
                  v-if="scope.row.isEdit"></el-cascader>
                <span v-else>{{ cascaderDataToString(scope.row.suitPatternTemp, 'multiple') }}</span>
              </template>
            </v-table-column>
            <v-table-column label="默认查询模式" prop="defaultPatternTemp" v-if="tempType == '1'">
              <template slot-scope="scope">
                <!-- @change="selectDefaultMode" -->
                <el-cascader :options="scope.row.selectedModeListTemp" v-model="scope.row.defaultPatternTemp" clearable
                  v-if="scope.row.isEdit"></el-cascader>
                <span v-else>{{ cascaderDataToString(scope.row.defaultPatternTemp) }}</span>
              </template>
            </v-table-column>

            <v-table-column label="归档模式" prop="archiveMode" v-if="tempType == '1'">
              <template slot-scope="scope">
                <el-select v-model="scope.row.archiveMode" placeholder="请选择" clearable v-if="scope.row.isEdit">
                  <el-option v-for="item in scope.row.archiveModeList" :key="item.dictCode" :label="item.dictName"
                    :value="item.dictCode" :disabled="item.statusDict == '0' || !item.canSelect"></el-option>
                </el-select>
                <span v-else>{{ filterArrValue(scope.row.archiveMode, ICIS_DICT_ARCHIVE_MODE, 'dictCode', 'dictName')
                }}</span>
              </template>
            </v-table-column>
            <v-table-column label="归档数据可控制范围" prop="archiveScope" v-if="tempType == '1'">
              <template slot-scope="scope">
                <el-select v-model="scope.row.archiveScope" placeholder="请选择" clearable v-if="scope.row.isEdit" multiple>
                  <el-option v-for="item in ICIS_DICT_ARCHIVE_SCOPE" :key="item.dictCode" :label="item.dictName"
                    :value="item.dictCode" :disabled="item.statusDict == '0'"></el-option>
                </el-select>
                <span v-else>{{ filterArrValue(scope.row.archiveScope, ICIS_DICT_ARCHIVE_SCOPE, 'dictCode', 'dictName')
                }}</span>
              </template>
            </v-table-column>
            <v-table-column label="入区当天数据规则" prop="inAreaTimeRule">
              <template slot-scope="scope">
                <el-select v-model="scope.row.inAreaTimeRule" placeholder="请选择" clearable v-if="scope.row.isEdit">
                  <el-option v-for="item in inAreaTimeRule" :key="item.dictCode" :label="item.dictName"
                    :value="item.dictCode" :disabled="item.statusDict == '0'"></el-option>
                </el-select>
                <span v-else>{{ filterArrValue(scope.row.inAreaTimeRule, inAreaTimeRule, 'dictCode', 'dictName') }}</span>
              </template>
            </v-table-column>
            <v-table-column label="出区当天数据规则" prop="leaveTimeRule">
              <template slot-scope="scope">
                <el-select v-model="scope.row.leaveTimeRule" placeholder="请选择" clearable v-if="scope.row.isEdit">
                  <el-option v-for="item in leaveTimeRule" :key="item.dictCode" :label="item.dictName"
                    :value="item.dictCode" :disabled="item.statusDict == '0'"></el-option>
                </el-select>
                <span v-else>{{ filterArrValue(scope.row.leaveTimeRule, leaveTimeRule, 'dictCode', 'dictName') }}</span>
              </template>
            </v-table-column>

            <v-table-column label="签名方式" prop="signatureWayTemp" v-if="tempType == '1'">
              <template slot-scope="scope">
                <el-select v-model="scope.row.signatureWayTemp" placeholder="请选择" clearable v-if="scope.row.isEdit"
                  multiple>
                  <el-option v-for="item in scope.row.signatureList" :key="item.dictCode" :label="item.dictName"
                    :value="item.dictCode" :disabled="item.statusDict == '0' || !item.canSelect"></el-option>
                </el-select>
                <span v-else>{{
                  filterArrValue(scope.row.signatureWay, ICIS_DICT_SIGNATURE_WAY, 'dictCode', 'dictName') }}</span>
              </template>
            </v-table-column>
            <v-table-column label="页面加载模式" prop="pageLoadMode">
              <template slot-scope="scope">
                <el-select v-model="scope.row.pageLoadMode" placeholder="请选择" clearable v-if="scope.row.isEdit">
                  <el-option :label="item.dictName" :value="item.dictCode" v-for="item in ICIS_DICT_LOAD_MODE"
                    :key="item.dictCode"></el-option>
                </el-select>
                <span v-else>{{ filterArrValue(scope.row.pageLoadMode, ICIS_DICT_LOAD_MODE, 'dictCode', 'dictName')
                }}</span>
              </template>
            </v-table-column>
            <v-table-column label="是否需要患者签名" prop="patientSign">
              <template slot-scope="scope">
                <el-switch  v-if="scope.row.isEdit" v-model="scope.row.patientSign" active-value="1" inactive-value="0"
                  active-text="是" inactive-text="否"></el-switch>
                <span v-else>{{+scope.row.patientSign=='1' ? '是' : '否' }}</span>
              </template>
            </v-table-column>
            <v-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click.native.prevent="operation(scope.row)" type="text" size="small"
                  :disabled="scope.row.isCreate">设计</el-button>
                <el-button @click.native.prevent="updateRow(scope.row)" type="text" size="small"
                  :disabled="scope.row.tempType == 2" v-if="!scope.row.isEdit">修改</el-button>
                <el-button @click.native.prevent="saveRow(scope.row)" type="text" size="small"
                  v-if="scope.row.isEdit">保存</el-button>
                <el-button @click.native.prevent="copyRow(scope.row)" type="text" size="small"
                  :disabled="scope.row.tempType == 2">复制</el-button>
                <el-button @click.native.prevent="cancelRow(scope.row, scope.$index)" type="text" size="small"
                  v-if="scope.row.isEdit">取消</el-button>
                <el-button @click.native.prevent="enableOrDisable(scope.row, scope.$index)"
                  :style="{ color: scope.row.statusDict == 1 ? scope.row.tempType == 2 ? '#C0C4CC' : '#EC0000' : '#00AB44' }"
                  type="text" size="mini"
                  :disabled="scope.row.tempType == 2 || scope.row.isCreate">{{+scope.row.statusDict ?
                    '禁用' : '启用' }}</el-button>
              </template>
            </v-table-column>
          </el-table>
        </el-main>
      </el-container>

    </div>
    <el-dialog title="另存为模板" :visible.sync="dialogShow" :before-close="dialogClose" width="480px">
      <SaveasTemp :tempData.sync="form" v-if="dialogShow" @dialogClose="dialogClose" @saveasTemp="init"
        :tempList="tempList" ref="saveasTemp"></SaveasTemp>
      <div slot="footer" class="dialog-footer flex flex-end">
        <el-button @click="dialogClose">取消</el-button>
        <el-button type="primary" @click="saveasFrom">保存</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import SaveasTemp from './components/savasaTemp.vue'
import _ from 'lodash'
import {
  getTmpAllDocConfigList,
  saveTmpDocConfig,
  insertTmpDocConfig,
  deleteTmpDocConfig,
  getNextSortNo
} from '@/api/anas'
import {
  filterArrValue
} from '@/utils/utils'
// import { hrObj } from '../evaluationForms/componentdesign/components/left/components/basicComponents/hr'
export default {
  name: 'RecordList',
  components: {
    SaveasTemp
  },
  data: function () {
    return {
      pageSize: 10,
      totalCount: 0,
      // 列表数据
      listData: [],
      // 搜索栏
      searchForm: {
        searchKey: '',
        statusDict: ''
      },
      // 重症记录单保存数据 名称 类型
      form: {
        beid: 209,
        tempType: '1',
        tempName: '',
        tempPageNum: 1,
        suitPattern: [],
        defaultPattern: [],
        archiveMode: '',
        archiveScope: '',
        signatureWayTemp: []
      },
      selectedModeList: [],
      printModeList: [
        {
          label: '在区期间', value: '1',
          children: [
            {
              value: '1',
              label: '不分组'
            },
            {
              value: '2',
              label: '按自然日'
            },
            {
              value: '3',
              label: '按全班次'
            }, {
              value: '4',
              label: '按每个班次' // 968459 特护单根据每个班次分页显示
            }
          ]
        },
        {
          label: '按班次', value: '3',
          children: [
            {
              value: '3',
              label: '按全班次'
            }, {
              value: '4',
              label: '按每个班次' // 968459 特护单根据每个班次分页显示
            }
          ]
        },
        {
          label: '时间段', value: '4',
          children: [
            {
              value: '1',
              label: '不分组'
            },
            {
              value: '2',
              label: '按自然日'
            },
            {
              value: '3',
              label: '按全班次'
            }, {
              value: '4',
              label: '按每个班次' // 968459 特护单根据每个班次分页显示
            }
          ]
        }

      ],
      typeList: [
      ],
      // 保存弹框
      dialogShow: false,
      // 表格配置弹框
      sheetFlag: false,
      recordId: '',
      // 加载中
      loading: false,
      // 模板列表
      tempList: [],
      rules: {
        tempName: [
          { required: true, message: '模板名称', trigger: 'blur' }
        ],
        tempPageNum: [
          { required: true, message: '模板页数', trigger: 'blur' }
        ]
        // suitPattern: [
        //   { required: true, message: '适用查询模式', trigger: 'blur' }
        // ],
        // defaultPattern: [
        //   { required: true, message: '默认查询模式', trigger: 'blur' }
        // ]
      },
      ICIS_DICT_ARCHIVE_SCOPE: [],
      ICIS_DICT_ARCHIVE_MODE: [],
      ICIS_DICT_SIGNATURE_WAY: [], // 签名方式
      tempTypeName: '护理文书模板', // 护理文书模板:1|内置单据打印模板:2|患者评估打印模板:3
      tempType: 1,
      editing: false,
      currEditRow: {},
      currsuitPattern: [], // 当前查询模式
      multiPageOptions: [
        {
          dictCode: '0',
          dictName: '正反面'
        }, {
          dictCode: '1',
          dictName: '非正反面'
        }
      ],
      leaveTimeRule: [
        { dictCode: '1', dictName: '截止出区时间点' },
        { dictCode: '2', dictName: '截止至全班次结束时间点' }
      ],
      inAreaTimeRule: [
        { dictCode: '1', dictName: '入区时间点' },
        { dictCode: '2', dictName: '全班次开始时间点' }
      ],
      ICIS_DICT_LOAD_MODE: [
        { dictCode: '1', dictName: '普通' },
        { dictCode: '10', dictName: '10页/批次' },
        { dictCode: '20', dictName: '20页/批次' },
        { dictCode: '30', dictName: '30页/批次' },
        { dictCode: '40', dictName: '40页/批次' },
        { dictCode: '50', dictName: '50页/批次' },
        { dictCode: '60', dictName: '60页/批次' },
        { dictCode: '70', dictName: '70页/批次' }
      ]
    }
  },
  props: {},
  watch: {},
  computed: {
    filterDatas: function () {
      return this.searchForm.statusDict != '' ? this.tempList.filter(item => item.statusDict == this.searchForm.statusDict) : this.tempList
    }
  },
  async created() {
    const { ICIS_DICT_ARCHIVE_SCOPE, ICIS_DICT_ARCHIVE_MODE, ICIS_DICT_SIGNATURE_WAY } = await this.$batchGetDictItemList(['ICIS_DICT_ARCHIVE_SCOPE', 'ICIS_DICT_ARCHIVE_MODE', 'ICIS_DICT_SIGNATURE_WAY'])
    this.ICIS_DICT_ARCHIVE_SCOPE = ICIS_DICT_ARCHIVE_SCOPE
    this.ICIS_DICT_ARCHIVE_MODE = ICIS_DICT_ARCHIVE_MODE
    this.ICIS_DICT_SIGNATURE_WAY = ICIS_DICT_SIGNATURE_WAY
    this.init()
  },
  mounted() { },
  methods: {
    filterArrValue,
    // 初始化数据
    init() {
      this.getTmpAllDocConfigList()
    },
    /**
     * 修改护理文书页面
     */
    updateRow(obj) {
      if (this.editing) {
        this.$message({
          type: 'error',
          message: '请完成当前编辑'
        })
        return
      }
      this.currEditRow = { ...obj }
      obj.isEdit = true
      this.selectModeList(obj.suitPatternTemp, obj)
      obj.archiveScope = JSON.parse(obj.archiveScope)

      this.editing = true
      this.tempList = [...this.tempList]
    },
    /**
     * 保存当前行数据
     */
    saveRow(obj) {
      if (obj.tempPageNum == '' || !obj.tempPageNum || obj.tempName == '') {
        this.$message({
          type: 'error',
          message: '模板名称,模板页数为必填项'
        })
        return
      }
      const query = { ...obj }
      query.suitPattern = obj.suitPatternTemp ? JSON.stringify(obj.suitPatternTemp) : null
      query.defaultPattern = obj.defaultPatternTemp ? JSON.stringify(obj.defaultPatternTemp) : null
      query.archiveScope = obj.archiveScope ? JSON.stringify(obj.archiveScope) : null // 多选
      query.signatureWay = obj.signatureWayTemp ? JSON.stringify(obj.signatureWayTemp) : null
      delete query.suitPatternTemp
      delete query.defaultPatternTemp
      delete query.isEdit
      delete query.selectedModeListTemp
      delete query.archiveModeList
      delete query.signatureList
      delete query.signatureWayTemp
      const componentList = JSON.parse(obj.tempContent || '{}')
      const formProSqlIdList = []
      for (var pageNum in componentList) {
        if (componentList[pageNum].components) {
          componentList[pageNum].components.forEach(item => {
            formProSqlIdList.push(item.attr.formProSqlId)
          })
        }
      }
      if (formProSqlIdList.length > 0) {
        query.formProSqlIds = [... new Set(formProSqlIdList)]
      }
      if (query.id) {
        saveTmpDocConfig(query).then(res => {
          obj.isEdit = false
          this.editing = false
          this.$message({
            type: res.msg == '操作成功' ? 'success' : 'warning',
            message: res.msg == '操作成功' ? '修改成功' : res.msg
          })
          this.getTmpAllDocConfigList()
        })
      } else {
        insertTmpDocConfig(query).then(res => {
          obj.isEdit = false
          this.editing = false
          delete obj.isCreate
          this.$message({
            type: res.msg == '操作成功' ? 'success' : 'warning',
            message: res.msg == '操作成功' ? '新增成功' : res.msg
          })
          this.getTmpAllDocConfigList()
        })
      }
    },
    /**
     * 新增模板
     */
    async addRow() {
      if (this.editing) {
        this.$message({
          type: 'error',
          message: '请完成当前编辑'
        })
        return
      }
      // await this.getMaxSortNo()
      const obj = {
        isCreate: true,
        isEdit: true,
        tempType: this.tempType,
        tempName: '',
        tempPageNum: 1,
        suitPattern: [],
        defaultPattern: [],
        archiveMode: '',
        archiveScope: '',
        statusDict: 1,
        sortNo: await this.getMaxSortNo(),
        signatureWayTemp: [],
        pageLoadMode: '1',
        leaveTimeRule: '',
        inAreaTimeRule: '',
        tempContent: '{}'
      }
      obj.archiveModeList = _.cloneDeep(this.ICIS_DICT_ARCHIVE_MODE)
      obj.archiveModeList.map(item => {
        if (item.dictCode == '0') item.canSelect = true
        else item.canSelect = false
      })
      obj.signatureList = _.cloneDeep(this.ICIS_DICT_SIGNATURE_WAY)
      obj.signatureList.map(item => {
        item.canSelect = false
      })

      this.tempList.unshift(obj)
    },
    /**
     * 获取模板排序号
     */
    getMaxSortNo() {
      return new Promise((resolve, reject) => {
        getNextSortNo({
          'type': 'templet',
          'tempType': this.tempType
        }).then(res => {
          resolve(res.data)
        })
      })
    },
    /**
     * 取消编辑
     */
    cancelRow(row, index) {
      this.editing = false
      row.isEdit = false
      if (row.isCreate) {
        this.tempList.splice(index, 1)
      } else {
        this.tempList = [...this.tempList]
        this.tempList[index] = this.currEditRow
        this.currEditRow = null
      }
    },
    // 显示保存弹框
    showSaveDialog(obj) {
      this.dialogShow = true
      if (obj) { // 修改
        this.form = { ...obj }
        this.form.suitPattern = JSON.parse(obj.suitPattern || '[]')
        this.form.defaultPattern = JSON.parse(obj.defaultPattern || '[]')
        this.form.archiveScope = JSON.parse(obj.archiveScope || '[]')
        this.selectedModeList = this.cascaderDataToObject(this.form.suitPattern)
      } else {
        this.selectedModeList = []
      }
    },
    // 隐藏新增弹框
    dialogClose() {
      this.dialogShow = false
    },
    // 启用禁用-record
    enableOrDisable(obj) {
      deleteTmpDocConfig({
        id: obj.id,
        statusDict: obj.statusDict == '1' ? '0' : '1'
      }).then(res => {
        this.$message({
          type: 'success',
          message: +obj.statusDict ? '已禁用' : '已启用'
        })
        this.getTmpAllDocConfigList()
      })
    },
    operation(row) {
      this.tempId = row.id

      this.$router.push({
        path: '/configuration/recordSetting/index',
        query: {
          tempId: this.tempId,
          tempType: row.tempType,
          tempName: row.tempName
        }
      })
    },
    // 关闭sheet
    closeSheet() {
      this.sheetFlag = false
    },
    // 获取模板列表
    getTmpAllDocConfigList() {
      // 类型转换
      this.loading = true
      this.tempTypeTransition()
      getTmpAllDocConfigList({
        tempType: this.tempType,
        tempName: this.searchForm.searchKey
      }).then(res => {
        const tempList = res.data.map(item => {
          item.suitPatternTemp = item.suitPattern ? JSON.parse(item.suitPattern) : []
          item.defaultPatternTemp = (item.defaultPattern ?? '') != '' ? JSON.parse(item.defaultPattern) : []
          item.archiveModeList = _.cloneDeep(this.ICIS_DICT_ARCHIVE_MODE)
          item.signatureWayTemp = (item.signatureWay ?? '') != '' ? JSON.parse(item.signatureWay) : []
          item.archiveModeList.map(item => {
            if (item.dictCode == '0') item.canSelect = true
            else item.canSelect = false
          })
          // 签名方式列表
          item.signatureList = _.cloneDeep(this.ICIS_DICT_SIGNATURE_WAY)
          item.signatureList.map(item => {
            item.canSelect = false
          })
          item.selectedModeListTemp = this.cascaderDataToObject(item.suitPatternTemp)
          return item
        })
        this.tempList = [...tempList]
        this.loading = false
        this.curTemp = this.tempList[0]
        this.curTempIndex = 0
      })
    },
    /**
     * 模板类型转换
     */
    tempTypeTransition() {
      switch (this.tempTypeName) {
        case '护理文书模板':
          this.tempType = '1'
          break
        case '内置单据打印模板':
          this.tempType = '2'
          break
        case '患者评估打印模板':
          this.tempType = '3'
          break
      }
    },
    /**
    * 选择适用模式 使用模式关联项目
     */
    selectModeList(e, row, forcerefresh) {
      if (e) {
        if (forcerefresh) {
          row.selectedModeListTemp = []
          row.defaultPatternTemp = []
          row.selectedModeListTemp = this.cascaderDataToObject(e)
          row.archiveMode = ''
          row.signatureWay = ''
          row.signatureWayTemp = []
        }

        // 当”适用查询模式“选择了“在区期间|不分组” 时，"归档模式“可选“出区归档”
        // 当“适用查询模式”选择了“在区期间|按全班次”或“按班次|按全班次”或“按时间段|按全班次”时，“归档模式“可选”按全班次归档”。
        // 2022 0906 修改 在区期间/班次 可以按照 出区归档
        const patientNode = e.map(v => { return v[0] })
        const childrenNode = e.map(v => { return v[1] })

        row.archiveModeList.map(item => {
          if (item.dictCode == '1') item.canSelect = (patientNode.includes('1') && childrenNode.includes('1') || patientNode.includes('1') && childrenNode.includes('3') || patientNode.includes('1') && childrenNode.includes('4'))
          if (item.dictCode == '2') item.canSelect = childrenNode.includes('3') || childrenNode.includes('4')
          if (item.dictCode == '0') item.canSelect = true
        })

        // 可选规则：当适用查询模式包含”在区期间“时，可选 整单签名/整单复核签名，否则此两项不可选；
        //           当适用查询模式包含”按班次“时，可选 各班次签名/全班次签名/各班次复核签名/全班次复核签名，否则此四项不可选。
        row.signatureList.map(item => {
          if (item.dictCode == '0003' || item.dictCode == '1003') item.canSelect = patientNode.includes('1')
          else item.canSelect = patientNode.includes('3')
        })
      } else {
        row.selectedModeListTemp = []
        row.defaultPatternTemp = []
        row.archiveMode = ''
        row.signatureWay = ''
        row.signatureWayTemp = []
        row.archiveModeList.map(item => {
          if (item.dictCode == '0') item.canSelect = true
          else item.canSelect = false
        })
        row.signatureList.map(item => {
          item.canSelect = false
        })
      }
      this.tempList = [...this.tempList]
    },
    /**
     * 将级联数据转为数字对象 方便默认数据
     */
    cascaderDataToObject(arr) {
      const returArr = []
      const parentValues = [...new Set(arr?.map(v => {
        if (Array.isArray(v)) {
          return v[0]
        } else return []
      }))] // 父级选择项目列表

      const list = _.keyBy(parentValues?.map(item => { // 将选择项转化为Object
        return {
          value: item,
          children: arr?.filter(v => v[0] == item)?.map(v => { return v[1] })
        }
      }), 'value')

      const printModeListTemp = _.cloneDeep(this.printModeList)

      printModeListTemp?.forEach(item => {
        const children = []
        if (parentValues.includes(item.value)) {
          // 选中code children
          item.children.forEach(c => {
            if (list[item.value].children.includes(c.value)) {
              children.push(c)
            }
          })
          returArr.push({
            label: item.label,
            value: item.value,
            children: children
          })
        }
      })
      return returArr
    },
    /**
     * 将级联的数组类型转为对应的字符串
     */
    cascaderDataToString(arr, type) {
      const resultArr = []
      let resultString = ''
      let object = {}
      if (!arr) return ''
      object = this.cascaderDataToObject(arr)
      if (type && type == 'multiple') {
        object = this.cascaderDataToObject(arr)
      } else {
        const temp = []
        temp.push(arr)
        object = this.cascaderDataToObject(temp)
      }

      object?.forEach(item => {
        item.children.forEach(c => {
          resultArr.push(item.label + '/' + c.label)
        })
      })
      if (resultArr.length > 0) resultString = resultArr.toString()
      return resultString
    },
    /**
    选择默认模式
     */
    selectDefaultMode(e) {
      if (e) {
        this.form.defaultPattern = e
      }
    },
    /**
     * 复制文书模板
     */
    copyRow(row) {
      // this.currEditRow = row
      this.showSaveDialog(row)
    },
    saveasFrom() {
      this.$refs.saveasTemp.saveRecord()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-footer {
  padding-left: 0px;
}

::v-deep .el-dialog {
  &__header {
    border-bottom: 1px solid #dfe7f5;
  }

  &__body {
    padding: 18px 20px 0 0;
    margin: 0 auto;

    .el-date-editor {
      width: 100%;
    }

    .el-input>.el-input__inner {
      border: none;
      background: #f3f5f9;
      border-radius: 2px;
      width: 260px;

    }

    .el-input-number--small {
      width: 260px;
    }

    .el-input__prefix {
      right: 0;
      left: inherit;
    }

    .el-input__inner {
      padding-left: 10px;
    }
  }

  &__footer {
    border-top: 1px solid #dfe7f5;
    text-align: right;

    .el-button {
      width: 90px;
    }
  }
}

::v-deep .el-radio-group {
  word-break: keep-all;
  white-space: nowrap;
  margin: 0 10px;
}

.recordList {
  background: #ffffff;
  height: 100%;
  display: flex;
  padding: 1%;

  .redCss {
    color: #f52c2c;
  }

  .mainColor {
    color: $light-blue;
  }

  .elHeader1 {
    height: 34px !important;
    margin-top: 18px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    padding-left: 0px;
    justify-content: space-between;

    .iconBlue {
      display: inline-block;
      width: 3px;
      height: 16px;
      background: var(--maincolor);
    }

    div {
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
    }

    span {
      flex: 1;
      margin-left: 8px;
      height: 22px;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #000000;
      line-height: 22px;
    }

    .el-button {
      width: 90px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;

      span {
        margin: 0;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
      }
    }
  }

  &_left {
    width: 100%;

    &_div {
      height: 100%;
    }

    &_header {
      display: flex;
      align-items: center;
      padding: 0;
      height: 31px !important;
      background: #ffffff;
      border-radius: 2px;
      margin-bottom: 10px;

      .input {
        max-width: 200px;
        margin-right: 10px;
      }

      ::v-deep input {
        background: #f3f5f9;
        border: none;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #000622;
      }
    }

    &_main {
      height: calc(100% - 101px);
      padding: 0;

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
              font-size: 14px;
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
          padding: 0 8px;
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

    &_footer {
      .pagination {
        float: left;
        margin-top: 15px;
        margin-right: -30px;
      }
    }

    ::v-deep .el-dialog__body {
      padding: 20px 20px 0 20px;
    }
  }

  &_right {
    margin-left: 1.9%;
    padding-left: 1.7%;
    border-left: 2px solid rgba(203, 215, 238, 0.3);

    // box-shadow: 0px 2px 4px 0px rgba(203, 215, 238, 0.5);
    .el-header {
      height: 32px !important;
      padding: 0;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      // recordList_right_head 右侧搜索栏的input
      .el-input {
        width: 300px;

        .el-input__inner {
          border: none;
          background: #f3f5f9;
          border-radius: 2px;
        }
      }
    }

    .el-main {
      padding: 0;
    }

    &_body {
      .config {
        border: 1px solid #d9e3ff;

        .title {
          height: 38px;
          line-height: 38px;
          padding: 0px 10px;
          font-size: 14px;
          background: #d9e3ff;
          color: #333;
          font-weight: 600;
          display: flex;

          label {
            flex: 1;
          }

          div {
            width: 100px;

            span {
              width: 50px;
              padding: 0px 8px;
            }
          }
        }

        .content {
          height: auto;
          padding: 10px;

          .header {
            width: 100%;
            display: flex;
            height: 38px;
            align-items: center;
            font-size: 14px;
          }

          .label {
            color: #333;
            font-weight: 600;
            display: flex;
            align-items: center;
            flex: 1;
          }

          .list {
            display: block;

            .item {
              display: flex;
              align-items: center;
              padding: 5px 0px;
              height: 32px;
              margin-bottom: 5px;

              .data {
                padding-right: 10px;
                display: flex;
                flex: 1;
                align-items: center;

                ::v-deep .el-select {
                  width: 100%;
                }

                ::v-deep .el-input>.el-input__inner {
                  border: none;
                  background: #f3f5f9;
                  border-radius: 2px;
                }
              }
            }
          }

          .addNotice {
            line-height: 32px;
            padding: 5px;
            font-size: 14px;
            height: 32px;
            color: #666;

            .plusClass {
              font-size: 12px;
              margin-right: 10px;
            }
          }
        }

        .right {
          width: 98px;
          display: flex;
        }
      }

      .newConfig {
        height: 38px;
        line-height: 38px;
        margin-top: 10px;
        border: 1px solid #d9e3ff;
        color: var(--maincolor);
        text-align: center;
        font-size: 14px;

        .plusClass {
          font-size: 12px;
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
