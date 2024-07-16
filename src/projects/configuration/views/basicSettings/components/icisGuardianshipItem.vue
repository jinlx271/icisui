<!-- 监护字典 -->
<template>
  <el-container class="guardianshipItem">
    <!-- 头部 -->
    <el-header>
      <div class="headerLeft">
        <el-form ref="addRoleFrom" :inline="true" :model="queryData" label-width="100px" status-icon
          class="flex align-items-center" @keyup.enter.native="getItemList(1)">
          <el-form-item prop="name">
            <!-- input输入 -->
            <el-input size="small" placeholder="监护项名称/编码" clearable suffix-icon="el-icon-search"
              v-model="queryData.searchKey" @input="debounceSearch"></el-input>
          </el-form-item>
          <el-form-item label="监护项类型" prop="name">
            <el-select v-model="queryData.moniitemTypeDict" placeholder="请选择" clearable @change="debounceSearch">
              <el-option v-for="item in monitypeList" :key="item.dictCode" :label="item.dictName" :value="item.dictCode"
                :disabled="item.statusDict == '0'"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="1px">
            <el-checkbox v-model="queryData.statusDict" true-label="" false-label="1" @change="debounceSearch">
              显示禁用
            </el-checkbox>
          </el-form-item>
        </el-form>
      </div>
      <div style="align-items: flex-start">
        <el-button class="queryButton" type="primary" @click.native.prevent="getItemList(1)">查询</el-button>
        <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']" class="queryButton" type="primary"
          @click.native.prevent="addDictItem">
          新增</el-button>
      </div>
    </el-header>
    <!-- 中间 -->
    <el-main style="height:calc(100% - 42px)" element-loading-text="加载中" v-loading="loading || dictLoading">
      <el-table :row-class-name="({ row }) => row.statusDict == 0 ? 'disabled' : ''"
        @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
        ref="tableDataItem" :data="tableDataItem" border height="100%" style="width: 100%;height:100%"
        highlight-current-row>
        <v-table-column label="监护项基本信息" align="center">
          <v-table-column v-for="item in itemLablesBase" :key="item.label" :label="item.label" :min-width="item.width">
            <template slot-scope="scope">
              <el-select v-if="item.styleType === 'select'" value-key="code" v-model="scope.row[item.key]"
                placeholder="请选择" clearable filterable :disabled="!scope.row.isEdit">
                <el-option v-for="(option) in item.options" :key="option[item.optionsValue || 'value']"
                  :label="option[item.optionsLabel || 'label']" :value="option[item.optionsValue || 'value']"
                  :disabled="option.statusDict == '0'"></el-option>
              </el-select>
              <el-switch v-else-if="item.styleType === 'switch'" v-model="scope.row[item.key]"
                :disabled="!scope.row.isEdit" :active-value="item.active.value" :inactive-value="item.inactive.value"
                :active-text="item.active.text" :inactive-text="item.inactive.text"></el-switch>
              <el-input v-else-if="(scope.row.isEdit && !item.readOnly)" v-model="scope.row[item.key]" placeholder="请输入"
                :disabled="(!scope.row.isCreate && item.isModefy !== undefined && !item.isModefy)">
              </el-input>
              <span v-else>{{ scope.row[item.key] }}</span>
            </template>
          </v-table-column>
        </v-table-column>
        <v-table-column label="数据来源" align="center">
          <v-table-column v-for="(item, index) in dictItemLablesSource" :key="`${item.label}-${index}`" :label="item.label"
            :min-width="item.width">
            <template slot-scope="scope">
              <el-select v-if="item.styleType === 'select'" value-key="code" v-model="scope.row[item.key]"
                placeholder="请选择" clearable filterable :disabled="!scope.row.isEdit">
                <el-option v-for="(option, optionIndex) in item.options" :key="optionIndex"
                  :label="option[item.optionsLabel || 'label']" :value="option[item.optionsValue || 'value']"
                  :disabled="option.statusDict == '0'"></el-option>
              </el-select>
              <el-select v-else-if="item.styleType === 'selectFilter'" value-key="code" v-model="scope.row[item.key]"
                placeholder="请选择" clearable filterable :disabled="!scope.row.isEdit"
                :filter-method="(val) => { filterMethod2(val, scope.row[item.key]) }"
                @clear="filterMethod2('', scope.row[item.key])">
                <el-option v-for="option in formList" :key="option[item.optionsValue || 'value']"
                  :label="option[item.optionsLabel || 'label']" :value="option[item.optionsValue || 'value']"
                  :disabled="option.statusDict == '0'"></el-option>
              </el-select>
              <el-switch v-else-if="item.styleType === 'switch'" v-model="scope.row[item.key]"
                :disabled="!scope.row.isEdit" :active-value="item.active.value" :inactive-value="item.inactive.value"
                :active-text="item.active.text" :inactive-text="item.inactive.text"></el-switch>
              <el-input v-else-if="scope.row.isEdit && !item.readOnly" v-model="scope.row[item.key]" placeholder="请输入">
              </el-input>
              <span v-else>{{ scope.row[item.key] }}</span>
            </template>
          </v-table-column>
        </v-table-column>
        <v-table-column label="监护项属性" align="center" width="400">
          <v-table-column label="关联监护项" min-width="200">
            <template slot-scope="scope">
              <v-select-mon filterable multiple clearable :disabled="!scope.row.isEdit" v-model="scope.row.monItemRelList"
                :options="monItemRelListAll">
              </v-select-mon>
            </template>
          </v-table-column>
          <v-table-column label="关联字典" min-width="200">
            <template slot-scope="scope">
              <el-select value-key="code" multiple @visible-change="dictGroupListPlus = dictGroupListAllPlus"
                :filter-method="(val) => { filterMethod1(val) }" v-model="scope.row.dictGroupRelList" placeholder="请选择"
                clearable filterable :disabled="!scope.row.isEdit">
                <el-option v-for="(option, optionIndex) in dictGroupListPlus" :key="optionIndex" :label="option.groupName"
                  :value="option.groupCode" :disabled="option.statusDict == '0'"></el-option>
              </el-select>
            </template>
          </v-table-column>
        </v-table-column>
        <v-table-column label="记录频次" align="center" width="150">
          <v-table-column label="开始时间点" min-width="80">
            <template slot-scope="scope">
              <wn-time-picker v-if="scope.row.isEdit" v-model="scope.row.startTime" placeholder="请选择时间"
                class=" time-select" style="width:100%" format="HH:mm" value-format="HH:mm"
                :default-value="new Date()"></wn-time-picker>
              <span v-else>{{ scope.row.startTime }}</span>
            </template>
          </v-table-column>
          <v-table-column label="间隔小时" min-width="80">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isEdit" v-model="scope.row.intervalTime" type="number"
                placeholder="请输入"></el-input>
              <span v-else>{{ scope.row.intervalTime }}</span>
            </template>
          </v-table-column>
        </v-table-column>
        <v-table-column label="限制范围" align="center" width="240px">
          <v-table-column label="最小值" min-width="120">
            <template v-if="scope.row.moniitemValueTypeDict == 1" slot-scope="scope">
              <el-input-number style="width:100%" v-if="scope.row.isEdit" v-model="scope.row.baseMinValue"
                placeholder="请输入" :max="scope.row.baseMaxValue || 100" type="number"></el-input-number>
              <span v-else>{{ scope.row.baseMinValue }}</span>
            </template>
          </v-table-column>
          <v-table-column label="最大值" min-width="120">
            <template v-if="scope.row.moniitemValueTypeDict == 1" slot-scope="scope">
              <el-input-number style="width:100%" v-if="scope.row.isEdit" v-model="scope.row.baseMaxValue"
                :min="scope.row.baseMinValue || 0" type="number" placeholder="请输入"></el-input-number>
              <span v-else>{{ scope.row.baseMaxValue }}</span>
            </template>
          </v-table-column>
        </v-table-column>
        <v-table-column prop="statusDict" label="状态" min-width="180px" align="center">
          <template slot-scope="scope">
            <el-switch v-if="scope.row.isEdit" v-model="scope.row.statusDict" active-value="1" inactive-value="0"
              active-text="已启用" inactive-text="已禁用" @change="statusDictFc"></el-switch>
            <span v-else>{{+scope.row.statusDict ? '已启用' : '已禁用' }}</span>
          </template>

        </v-table-column>
        <v-table-column fixed="right" label="操作" align="center" width="120px">
          <template slot-scope="scope">
            <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']" v-if="!scope.row.isEdit" type="text"
              @click="updateItem(scope.row, scope.$index)">修改</el-button>
            <!-- <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']" v-if="!scope.row.isEdit" type="text"
                       @click="deleteItem(scope.row.moniitemCode)" class="redCss">删除</el-button> -->
            <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']" type="text" v-if="scope.row.isEdit"
              @click="cancelItem(scope.row, scope.$index)">取消</el-button>
            <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']" type="text" v-if="scope.row.isEdit"
              @click="saveItem(scope.row, scope.$index)">保存
            </el-button>
          </template>
        </v-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-pagination @size-change="changePagination" @current-change="changePagination" :current-page="queryData.pageNum"
        :hide-on-single-page="false" :page-size="queryData.pageSize" background layout="total, prev, pager, next"
        style="float:right;margin-top:15px;margin-right:-30px" :total="totolCount"></el-pagination>
    </el-footer>
  </el-container>
</template>

<script>
import {
  moniitem_multipleListPage,
  moniitem_findAllWithPage,
  moniitem_edit,
  moniitem_insert,
  moniitem_deleteById,
  dictGroup_getDictGroupWithPage,
  formconfig_list
} from '@/api/configuration'
import { debounce } from 'lodash'
import { frontFilter } from '@/utils'
export default {
  name: 'GuardianshipItem',
  components: {},
  data: () => {
    return {
      filterList: [],
      dictGroupListPlus: [],
      dictGroupListAllPlus: [],
      rules: [],
      loading: false,
      dictLoading: false,
      monItemRelListAll: [],
      queryData: {
        statusDict: '',
        searchKey: '', // input输入
        pageNum: 1,
        pageSize: 10
      }, // 请求入参
      // 分页总量
      totolCount: 0,
      // 记录频次
      dictItemLablFre: [
        { label: '间隔小时', key: 'intervalTime', width: '80', placeholder: '请输入间隔小时', isNumber: true },
        { label: '开始时间点', key: 'startTime', width: '80', styleType: 'dateTime', placeholder: '请输入开始时间点' }
      ],
      tableDataItem: [], // 数据
      // 单位
      unitList: [],
      // 内容样式
      styleList: [],
      // 数据来源
      sourceList: [],
      // 值类型
      valueList: [],
      // 功能模块
      moudleList: [],
      // 评估表
      assessList: [],
      curRow: [],
      //  字典来源
      dictGroupList: [],
      dictGroupListAll: [],
      monitypeList: [],
      formList: []
    }
  },
  props: {},
  watch: {
    tableDataItem(data) {
      this.$refs.tableDataItem.doLayout()
    }
  },
  computed: {
    // dictGroupListPlus() {
    //   return this.dictGroupList.filter(v => {
    //     return v.dictGroupType == 1
    //   })
    // },
    // dictGroupListAllPlus() {
    //   return this.dictGroupListAll.filter(v => {
    //     return v.dictGroupType == 1
    //   })
    // },
    // 监护基础
    itemLablesBase() {
      return [
        { label: '监护项编码', key: 'moniitemCode', width: '100', isModefy: false },
        { label: '监护项名称', key: 'moniitemName', width: '100' },
        { label: '监护项简称', key: 'moniitemAbbr', width: '100' },
        { label: '监护项说明', key: 'moniitemDesc', width: '150' },
        { label: '监护项类型', key: 'moniitemTypeDict', width: '80', styleType: 'select', options: this.monitypeList, optionsLabel: 'dictName', optionsValue: 'dictCode' },
        { label: '单位', key: 'unit', width: '100', placeholder: '请选择单位', styleType: 'select', options: this.unitList, optionsLabel: 'dictName', optionsValue: 'dictCode' }
      ]
    },
    // 数据来源
    dictItemLablesSource() {
      return [
        { label: '内容样式', key: 'contentTypeDict', width: '100', placeholder: '请选择内容样式', styleType: 'select', options: this.styleList, optionsLabel: 'dictName', optionsValue: 'dictCode' },
        { label: '数据来源', key: 'dataSourceDict', width: '100', placeholder: '请选择数据来源', styleType: 'select', options: this.sourceList, optionsLabel: 'dictName', optionsValue: 'dictCode' },
        { label: '值类型', key: 'moniitemValueTypeDict', width: '100', placeholder: '请选择值类型', styleType: 'select', options: this.valueList, optionsLabel: 'dictName', optionsValue: 'dictCode' },
        { label: '字典来源', key: 'valueDictCode', width: '200', placeholder: '请输入字典来源', styleType: 'select', options: this.dictGroupList.filter(item => item.dictGroupType == '2'), optionsLabel: 'groupName', optionsValue: 'groupCode' },
        { label: '关联评估表', key: 'formId', width: '200', placeholder: '请选择表来源', styleType: 'selectFilter', options: this.formList, optionsLabel: 'formName', optionsValue: 'id' }
      ]
    }
  },
  created() {
    this.init()
  },
  mounted: async function () {
    const res = await moniitem_multipleListPage({
      // statusDict: '1'
    })
    this.monItemRelListAll = res.data.result.filter(v => v.dataSourceDict != '5' && v.contentTypeDict != '5')// 医嘱执行不要
  },
  methods: {
    filterMethod1(val = '') {
      this.dictGroupListPlus = frontFilter(val, this.dictGroupListAllPlus).slice(0, 10)
    },
    filterMethod2(searchKey, ids) {
      formconfig_list({
        ids: searchKey ? '' : (ids || ''), // 非必传，优先查询数据返回最上面
        limit: 50, // 非必传,限制查询条数，不传的话-默认200
        searchKey: searchKey || '' // 非必传，模糊查询
      }).then(res => {
        this.formList = res.data
      })
    },
    // 点击行
    // changeTable(row) {
    //   this.rowTableData = this.tableDataItem.filter(res => {
    //     return res.isEdit
    //   })
    //   if (this.rowTableData && this.rowTableData[0]) {
    //     this.rowTableData[0].isEdit = false
    //   }
    //   row.isEdit = true
    // },
    async init() {
      const { ICIS_DICT_MONI_TYPE, ICIS_DICT_BUSI_TYPE, ICIS_DICT_DATA_SOURCE, ICIS_DICT_MONIITEM_VALUE_TYPE, ICIS_DICT_CONTENT_TYPE, ICIS_DICT_UNIT, ICIS_DICT_MONIITEM_TYPE } = await this.$batchGetDictItemList(['ICIS_DICT_MONI_TYPE', 'ICIS_DICT_BUSI_TYPE', 'ICIS_DICT_DATA_SOURCE', 'ICIS_DICT_MONIITEM_VALUE_TYPE', 'ICIS_DICT_CONTENT_TYPE', 'ICIS_DICT_UNIT', 'ICIS_DICT_MONIITEM_TYPE'])
      this.dictMonitypeList = ICIS_DICT_MONI_TYPE
      this.moudleList = ICIS_DICT_BUSI_TYPE
      this.sourceList = ICIS_DICT_DATA_SOURCE
      this.valueList = ICIS_DICT_MONIITEM_VALUE_TYPE
      this.styleList = ICIS_DICT_CONTENT_TYPE
      this.unitList = ICIS_DICT_UNIT
      this.monitypeList = ICIS_DICT_MONIITEM_TYPE
      this.dictGroupList = this.dictGroupListAll = await this.getGroupData()
      this.formList = await this.formconfig_listFc()
      this.dictGroupListPlus = this.dictGroupListAllPlus = this.dictGroupListAll.filter(v => {
        // return ['1', '4', '5', '6'].includes(v.dictGroupType)
        return v.dictGroupType == '4' // 815696 4. 【基础数据】-【监护字典】-监护项属性：“关联字典”字段的下拉选项取自【基础字典】-【标化字典】。
      })
      this.getItemList(1)
    },
    /**
     * 左边字典名称查询
     */
    getGroupData() {
      return new Promise((resolve, reject) => {
        const query = {
          pageNum: 1,
          pageSize: 10000
          // dictGroupTypeList: ['1', '4', '5', '6'] 这里要去掉 否则字典项会少
        }
        dictGroup_getDictGroupWithPage(query).then(res => {
          if (res.code === 0) {
            resolve(res.data.result)
          } else {
            reject([])
          }
        }).catch(() => {
          reject([])
        })
      })
    },
    /**
     * 表来源
     */
    formconfig_listFc(searchKey, ids) {
      return new Promise((resolve, reject) => {
        formconfig_list({
          ids: ids || '', // 非必传，优先查询数据返回最上面
          limit: 50, // 非必传,限制查询条数，不传的话-默认200
          searchKey: searchKey || '' // 非必传，模糊查询
        }).then(res => {
          resolve(res.data)
        }).catch(() => {
          reject([])
        })
      })
    },
    // 新增监护字典
    addDictItem() {
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
        statusDict: '1'
      }
      this.tableDataItem.unshift(row)
    },
    // 取消监护字典
    cancelClassifyRow(row) {

    },
    // 保存监护字典
    saveClassifyRow(row) {

    },
    // 保存
    saveItem(row, index) {
      if (row.moniitemCode === null || row.moniitemCode === undefined || row.moniitemCode.trim() == '') {
        this.$message.error('请输入监护项编码!')
        return
      }
      if (row.moniitemName === null || row.moniitemName === undefined || row.moniitemName.trim() == '') {
        this.$message.error('请输入监护项名称!')
        return
      }
      if (row.intervalTime !== '' && row.intervalTime !== null && row.intervalTime !== undefined) {
        if (!Number.isInteger(parseFloat(row.intervalTime))) {
          this.$message.error('间隔时间必须为整数!')
          return
        } else if (row.intervalTime < 0) {
          this.$message.error('请不要输入负数!')
          return
        }
      }
      if (row.moniitemTypeDict == '1012' && row.dataSourceDict == '7') {
        if (!(!!row.formId && row.formId != '')) {
          this.$message.error('请选择关联评估表!')
          return
        }
      } else {
        row.formId = null
      }
      if (!row.baseMaxValue && !row.baseMinValue) {
        row.baseMaxValue = null
        row.baseMinValue = null
      }
      if (!row.isCreate) {
        // 修改
        moniitem_edit(row).then(res => {
          if (res.code === 0) {
            row.isEdit = false
            this.tableDataItem = JSON.parse(JSON.stringify(this.tableDataItem))
            this.$message({
              type: 'success',
              message: '修改成功'
            })
          }
        })
      } else {
        // 新增
        moniitem_insert(row).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '新增成功'
            })
            this.getItemList(1)
          }
        })
      }
    },
    // 取消当前编辑
    async cancelItem(row, index) {
      if (row.isCreate) {
        this.tableDataItem.shift()
      } else {
        row.isEdit = false
        this.tableDataItem = JSON.parse(JSON.stringify(this.tableDataItem))
        this.tableDataItem[index] = this.curRow[index]
        this.formList = await this.formconfig_listFc()
      }
    },
    // 修改监护模板
    updateItem(row, index) {
      this.curRow[index] = { ...row }
      row.isEdit = true
      row.isCreate = false
      this.tableDataItem = JSON.parse(JSON.stringify(this.tableDataItem))
    },
    // 删除监护项数据
    deleteItem(id) {
      moniitem_deleteById(id).then(res => {
        if (res.code === 0) {
          this.$message.success('删除监护项成功')
          this.getItemList()
        } else {
          this.$message.error('删除监护项失败')
        }
      })
    },
    debounceSearch() {
      this.debounceSearchSymbol = this.debounceSearchSymbol ? this.debounceSearchSymbol : debounce(function () {
        this.getItemList(1)
      }, 200)
      this.debounceSearchSymbol()
    },
    // 获取监护项数据
    getItemList(page) {
      if (page) {
        this.queryData.pageNum = page
      }
      this.loading = true
      this.addRoleVisible = true
      const query = this.queryData
      moniitem_findAllWithPage(query).then(res => {
        this.loading = false
        if (!(res.data && res.data.result)) {
          return
        }
        this.tableDataItem = res.data.result.map((v) => {
          return v
        })
        this.totolCount = res.data.totolCount
      })
    },
    /**
     * 翻页
     */
    changePagination(pageNum) {
      this.getItemList(pageNum)
    },
    /**
     * 禁用 启用提示
     */
    statusDictFc(val) {
      if (val == '0') {
        this.$message({
          type: 'error',
          message: '监护配置及个人监护项相关数据也将被禁用!'
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法

.guardianshipItem {
  background: #fff;
  height: 100%;

  .native-time--picker {
    border: 1px solid #c0c4cc;
    border-radius: 4px;
  }

  .flex-1 {
    flex: 1;
  }

  .time-select {
    height: 28px;

    ::v-deep .el-input__inner {
      padding-right: 0;
      padding-left: 4px;
    }

    ::v-deep .el-input--small .el-input__inner {
      height: 28px;
      line-height: 28px;
      z-index: 123456789;
    }

    ::v-deep .el-input__prefix {
      display: none;
    }
  }

  ::v-deep.el-table thead>tr>th>.cell {
    padding-left: 6px;
    padding-right: 6px;
  }

  ::v-deep.el-table tbody>tr>td>.cell {
    padding-left: 6px;
    padding-right: 6px;
  }

  ::v-deep.el-table {
    height: 100%;
  }
}</style>
