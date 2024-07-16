<template>
  <div class="content flex-ver flex">
    <el-tabs v-model="activeName" @tab-click="handleClick" style="width:244px;" v-if="tabInfo.length > 1">
      <el-tab-pane v-for="item in tabInfo" :key="item.name" :label="item.label" :name="item.name">
      </el-tab-pane>
    </el-tabs>
    <!-- <el-divider content-position="left">已选择监护项列表</el-divider> -->
    <div>
      <div style="margin-bottom:10px;">
        <span class="m-r20" v-show="activeName == 'metaData'">元数据数据名称<el-checkbox v-model="showTitleTemp"
            @change="contentFormat"></el-checkbox></span>
        <span class="m-r20" v-show="activeName == 'metaData'">数据名称换行 <el-checkbox v-model="labelLineTemp"
            @change="contentFormat"></el-checkbox></span>
        <template v-if="activeName == 'metaData'">
          <span class="m-r20">选项换行<el-checkbox v-model="optionLineTemp" @change="contentFormat"></el-checkbox></span>
        </template>
        <template v-else>
          <span class="m-r20">选项换行(半高) <el-radio v-model="optionLineTemp" @change="contentFormat"
              @click.native.prevent="cancelOptionBr('0.5')" label="0.5">&nbsp;</el-radio></span>
          <span class="m-r20">选项换行(整高) <el-radio v-model="optionLineTemp" @change="contentFormat"
              @click.native.prevent="cancelOptionBr('1')" label="1">&nbsp;</el-radio></span>
        </template>
        <span class="m-r20" v-show="activeName == 'metaData'">评估项多选框 <el-checkbox v-model="isShowCheckboxTemp"
            @change="contentFormat"></el-checkbox></span>
        <span class="m-r20">显示$符 <el-checkbox v-model="isShowPlaceHolder" @change="contentFormat"></el-checkbox></span>
        <span class="m-r20" v-show="activeName == 'moni'|| activeName=='placeHolder'">快捷编辑 <el-checkbox v-model="quickEditFlag"
            @change="contentFormat"></el-checkbox></span>
      </div>
      <div style="margin-bottom:10px;">
        <span class="m-r20" v-show="activeName == 'metaData'">自定义编码 <el-input v-model="selectedMeta.metaCode"
            @change="contentFormat" style="width:200px;" size="small" /></span>
      </div>
      <div style="max-height:200px;overflow-y:auto;">
        <div v-for="(item, index) in selectKeyList" :key="index" class="proCss flex"
          :class="selectedIndex == index ? 'focus' : ''" @click="clickSelectOption(index)">
          <div class="flex flex-1">
            <el-input placeholder="名称" v-model="item.label" size="mini" style="width:120px;"></el-input>
            <el-input placeholder="值" v-model="item.code" size="mini" style="width:240px;flex:1"></el-input>
            <el-select v-model="item.alignValue" placeholder="请选择" size="mini" v-if="activeName != 'metaData'"
              style="width:78px;">
              <el-option label="左对齐" value="left"></el-option>
              <el-option label="居中" value="center"></el-option>
              <el-option label="右对齐" value="right"></el-option>
            </el-select>
          </div>
          <div style="width:116px;" class="flex">
            <el-button @click.stop="addSelectOption" size="mini">添加</el-button>
            <el-button @click.stop="deleteSelectOption(index)" size="mini" v-if="selectKeyList.length>1">删除</el-button>
          </div>

        </div>
      </div>
    </div>
    <el-divider content-position="left">待选区</el-divider>
    <template v-if="selectList">
      <el-tabs v-model="selectActive" @tab-click="changeSelectTab" style="width:244px;">
        <el-tab-pane v-for="item in selectList" :key="item.name" :label="item.label" :name="item.name">
        </el-tab-pane>
      </el-tabs>
    </template>
    <div class="flex align-items-center m-b10">
      <el-input v-model="tableInfo.searchKey" size="small" @input="searchData()" style="width: 360px; margin-right: 10px"
        suffix-icon="el-icon-search"></el-input>
      <template v-if="activeName=='placeHolder'">
        <span class="m-r10">业务模块</span>
        <el-select v-model="tableInfo.moduleCode" placeholder="请选择" filterable clearable style="width:160px;" class="m-r10" @change="searchData">
          <el-option :label="item.moduleName" :value="item.module" v-for="item in moduleOption" :key="item.moduleName"></el-option>
        </el-select>
      </template>
    </div>
    <!-- 选项组下增加字典项列表 -->
    <div class="flex-1">
      <el-table
        @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
        height="320px" element-loading-text="加载中" ref="tableData" :data="tableInfo.tableData" highlight-current-row fit :indent="20"
        border @row-click="changeRow" row-key="idKey" lazy :load="getSubPlaceHolderList" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <template v-if="selectList.length > 0">
          <v-table-column :prop="item.key" :label="item.name" align="left"
            v-for="(item, index) in tableInfo.colList[activeName][selectActive]" :key="index">
                      </v-table-column>
        </template>
        <template v-else>
          <v-table-column :prop="item.key" :label="item.name" align="left"
            v-for="(item, index) in tableInfo.colList[activeName]" :key="index">
            <template slot-scope="scope">
              <template v-if="item.key == 'placeHolderType'">
                {{scope.row.placeHolderType=='1'?'非固定':'固定'}}
              </template>
              <template v-else >
                <el-input  placeholder="请输入"   @click.native.stop  @keydown.enter.native="searchSubInfo($event,scope.row)"  v-if="scope.row.placeHolderType=='1'&&item.key=='placeHolderCode'" v-model="scope.row.searchKey" style="width:180px;" class="m-r10" ></el-input>
                <span>{{scope.row[item.key]}}</span>
              </template>
            </template>
          </v-table-column>
        </template>

      </el-table>
    </div>
    <el-footer v-if="activeName!='placeHolder'">
      <el-pagination @current-change="handleCurrentChange" :current-page="tableInfo.pageNum" :total="tableInfo.totolCount"
        :page-size="tableInfo.pageSize" :hide-on-single-page="false" layout="total,  prev, pager, next" class="pagination"
        background>
      </el-pagination>
    </el-footer>
    <div slot="footer" class="flex flex-end m-b10" v-if="isShowFootBtn">
      <el-button @click="handleHide">取消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </div>
  </div>
</template>
<script>
import {
  dictGroup_getDictGroupWithPage,
  moniitem_findAllWithPage,
  metadata_listPage, // 列表
  dict_getItems,
  formconfig_listPage, // 评估单
  docDataParams_getParamsModuleList
} from '@/api/configuration'
import {
  fixedPlaceHolder_dataList,
  fixedPlaceHolder_nonFixed
} from '@/api/criticalRecord'
export default {
  data() {
    return {
      tableInfo: { // 评估单元数据
        moduleCode: '',
        searchKey: '',
        pageNum: 1,
        pageSize: 10,
        totolCount: 0,
        tableData: [],
        currRow: null,
        colList: {
          metaData: {
            1: [
              {
                name: '数据编码',
                key: 'metaCode'
              },
              {
                name: '数据名称',
                key: 'metaName'
              },
              {
                name: '字典编码',
                key: 'dictGroupCode'
              }, {
                name: '字典名称',
                key: 'dictGroupName'
              }
            ],
            2: [
              {
                name: '字典编码',
                key: 'groupCode'
              }, {
                name: '字典名称',
                key: 'groupName'
              }
            ]
          },
          moni: [
            {
              name: '监护编码',
              key: 'moniitemCode'
            }, {
              name: '监护名称',
              key: 'moniitemName'
            }
          ],
          assess: [
            {
              name: '评估单',
              key: 'formName'
            }, {
              name: '编码',
              key: 'formCode'
            }, {
              name: '评估单id',
              key: 'id'
            }
          ],
          placeHolder: [
            {
              name: '占位符编码',
              key: 'placeHolderCode'
            }, {
              name: '占位符名称',
              key: 'placeHolderName'
            }, {
              name: '占位符类型',
              key: 'placeHolderType'
            }, {
              name: '前置条件',
              key: 'condition'
            }
          ]
        }
      },
      tabInfo: [

        {
          label: '监护项',
          name: 'moni'
        }, {
          label: '评估单',
          name: 'assess'
        }, {
          label: '选项组',
          name: 'metaData',
          children: [{
            label: '元数据',
            name: '1'
          }, {
            label: '基础字典',
            name: '2'
          }]
        }, {
          label: '占位符设置',
          name: 'placeHolder'
        }
      ],
      showTitleTemp: false,
      labelLineTemp: false,
      optionLineTemp: false,
      isShowCheckboxTemp: false,
      isShowPlaceHolder: true,
      quickEditFlag: false, // 快捷编辑 功能 文书中编辑护理记录等
      selectedIndex: 0,
      selectKeyList: [
        {
          label: '',
          code: '',
          alignValue: 'left',
          score: 0
        }
      ], // 存放选中数据项
      selectedMeta: { // 选中的元数据编码
        metaName: '',
        metaCode: ''
      },
      tdContent: '',
      optionList: [],
      activeName: 'metaData',
      selectActive: '1',
      moduleOption: [
      ]
    }
  },
  props: {
    docId: { // 数据源id
      type: String,
      default: ''
    },
    isShowFootBtn: {
      type: Boolean,
      default: true
    },
    showTitle: { // 显示标题
      type: Boolean,
      default: false
    },
    labelLine: { // 文本换行
      type: Boolean,
      default: false
    },
    optionLine: { // 选项是否换行
      type: Boolean,
      default: false
    },
    tabNames: { // tab栏显示项目
      default: 'moni,metaData,assess'
    },
    currCell: {
      default: () => { }
    },
    formId: { // 数据源id 根据数据源获取对应的占位符列表

    }

  },
  mounted() {
    if (this.tabNames != '') {
      const tempList = []
      this.tabInfo.map((item, index) => {
        if (this.tabNames.indexOf(item.name) > -1) {
          tempList.push(item)
        }
      })
      this.tabInfo = [...tempList]
      this.activeName = this.tabInfo[0].name
    }

    if (this.currCell) { // 请求里面的 data-source-value
      const domEle = this.currCell?.dom || this.currCell
      const list = domEle.querySelectorAll('[data-source-value]')
      this.quickEditFlag = !!domEle.getAttribute('data-moniitemCodes')

      if (list.length > 0) {
        const activeName = list[0].getAttribute('data-source-type')
        if (activeName == 'placeHolder' && this.tabNames == 'placeHolder') { this.activeName = activeName }
        this.optionLineTemp = list[0].getAttribute('data-option-line') || '0.5'
        if (this.activeName == 'metaData') {
          const inputName = list[0].getAttribute('name')
          this.selectedMeta = {
            metaCode: inputName.split('|')[0],
            metaName: inputName.split('|')[1]
          }
        }
        this.selectKeyList = []
        list.forEach(dom => {
          const value = dom.getAttribute('data-source-value')
          this.isShowCheckboxTemp = !!dom.getAttribute('data-show-checkbox')
          this.showTitleTemp = domEle.querySelectorAll('[data-show-title]').length > 0
          this.labelLineTemp = domEle.querySelectorAll('[data-label-line]').length > 0
          this.selectKeyList.push({
            label: value?.split('|')[0],
            code: value?.split('|')[1],
            alignValue: value?.split('|')[2] || 'left',
            score: value?.split('|')[2] || '0'
          })
        })
      }
    }
    this.searchData()
  },
  computed: {
    selectList() {
      return this.tabInfo.filter(item => item.name == this.activeName)[0]?.children || []
    }
  },
  watch: {
    showTitle: function (newValue) {
      this.showTitleTemp = newValue
    },
    labelLine: function (newValue) {
      this.labelLineTemp = newValue
    },
    optionLine: function (newValue) {
      this.optionLineTemp = newValue
    }

  },
  methods: {
    /**
     * 获取参数模块列表
     */
    getParamsModuleList() {
      docDataParams_getParamsModuleList(this.docId).then(res => {
          if (res.code == 0) {
            this.moduleOption = res.data
          }
        })
    },
    /**
     * 获取占位符列表
     */
    getPlaceHolderList() {
      return new Promise((resolve, reject) => {
        fixedPlaceHolder_dataList({
          'docId': this.docId, // --必传，文书ID
          'execSql': '', // --执行SQL
          'module': this.tableInfo.moduleCode, // --非必传，模块编码
          'serachKey': this.tableInfo.searchKey // --非必传，模糊搜索关键字
        }).then(res => {
          res.data.forEach(item => {
            item.idKey = item.id + this.$dayjs().valueOf()
            item.seachKey = ''
            item.hasChildren = item.placeHolderType == '1'
          })
          resolve(res)
        })
      })
    },
    /**
     * tab标签页面切换方法
     */
    handleClick() {
      this.selectKeyList = [
        {
          label: '',
          code: '',
          alignValue: 'left'
        }
      ]
      if (this.activeName != 'moni') {
        this.quickEditFlag = false
      }
      this.searchData()
    },

    /**
     * 获取监护数据
     */
    getMoniData() {
      return new Promise((resolve, reject) => {
        const query = {
          pageNum: this.tableInfo.pageNum,
          pageSize: this.tableInfo.pageSize,
          searchKey: this.tableInfo.searchKey
        }
        moniitem_findAllWithPage(query).then(res => {
          resolve(res)
        })
      })
    },
    /** 获取评估单数据 */
    getAssForm() {
      return new Promise((resolve, reject) => {
        const query = {
          pageNum: this.tableInfo.pageNum,
          pageSize: this.tableInfo.pageSize,
          searchKey: this.tableInfo.searchKey

        }
        formconfig_listPage(query).then(res => {
          res.data.result = res.data.result.map(item => {
            const obj = {
              moniitemCode: item.id,
              moniitemName: item.formName
            }
            return Object.assign(obj, item)
          })
          resolve(res)
        })
      })
    },
    /** 搜索元数据 */
    async searchData(pageNum) {
      this.tableInfo.pageNum = pageNum || 1
      let res = null
      console.log('this.activeName', this.activeName)
      if (this.activeName == 'metaData') { // 元数据
        if (this.selectActive == 1) {
          res = await this.getMetaList()
        } else {
          res = await this.getBasicList()
        }
      } else if (this.activeName == 'moni') { // 监护项
        res = await this.getMoniData()
      } else if (this.activeName == 'assess') {
        res = await this.getAssForm()
      } else if (this.activeName == 'placeHolder') {
        this.getParamsModuleList()
        res = await this.getPlaceHolderList()
      }

      this.tableInfo.totolCount = res.data?.totolCount // 总条数
      this.tableInfo.tableData = res.data.result || res.data // 数据
    },
    /** 获取元数据 */
    getMetaList() {
      return new Promise((resolve, reject) => {
        const query = {
          pageNum: this.tableInfo.pageNum,
          pageSize: this.tableInfo.pageSize,
          searchKey: this.tableInfo.searchKey
        }
        metadata_listPage(query).then(res => {
          resolve(res)
        })
      })
    },
    /**
     * 获取基础字典
     */
    getBasicList() {
      return new Promise((resolve, reject) => {
        const query = {
          pageNum: this.tableInfo.pageNum,
          pageSize: this.tableInfo.pageSize,
          searchKey: this.tableInfo.searchKey
        }
        dictGroup_getDictGroupWithPage(query).then(res => {
          resolve(res)
        })
      })
    },
    /** 元数据翻页功能 */
    async handleCurrentChange(e) {
      this.searchData(e)
    },
    /** 弹框隐藏 */
    handleHide() {
      this.$emit('close')
    },
    /** 行切换 */
    changeRow(row, column, event) {
      const e = row
      if (this.activeName == 'metaData') {
        if (this.selectActive == '1') {
          this.selectedMeta = {
            metaCode: e.metaCode,
            metaName: e.metaName
          }
          if (e.dictGroupCode && e.dictGroupCode != '') {
            dict_getItems({
              dictGroupCode: e.dictGroupCode
            }).then(res => {
              this.selectKeyList = res.data.map(item => {
                return {
                  label: item.dictName,
                  code: item.dictCode,
                  alignValue: 'right',
                  score: item.itemScore
                }
              })
            })
          }
        } else {
          this.selectedMeta = {
            metaCode: e.groupCode,
            metaName: e.groupName
          }
          if (e.groupCode && e.groupCode != '') {
            dict_getItems({
              dictGroupCode: e.groupCode
            }).then(res => {
              this.selectKeyList = res.data.map(item => {
                return {
                  label: item.dictName,
                  code: item.dictCode,
                  alignValue: 'right'
                }
              })
            })
          }
        }
      } else if (this.activeName == 'placeHolder') {
        // debugger
        if (e.placeHolderType == '1') {
          this.getOpenDetail(row, column, event)
          return
        }
        this.selectedMeta = {
          metaCode: e.placeHolderCode,
          metaName: e.placeHolderName
        }

        this.selectKeyList[this.selectedIndex].label = e.placeHolderName
        this.selectKeyList[this.selectedIndex].code = e.placeHolderCode

        this.selectKeyList = [...this.selectKeyList]
      } else { // 监护数据
        this.selectedMeta = {
          metaCode: e.moniitemCode,
          metaName: e.moniitemName
        }
        this.selectKeyList[this.selectedIndex].label = e.moniitemName
        this.selectKeyList[this.selectedIndex].code = e.moniitemCode
        this.selectKeyList = [...this.selectKeyList]
      }
    },
    /**
     * 内容格式化
     */
    contentFormat() {
      let tdContentTemp = ''
      console.log('this.optionLineTemp', this.optionLineTemp)
      if (this.selectKeyList.length == 1 && this.activeName != 'metaData') {
        this.selectedMeta = {
          metaCode: this.selectKeyList[0].code,
          metaName: this.selectKeyList[0].label
        }
      }

      if (this.showTitleTemp && this.selectedMeta.metaName != '') {
        if (this.labelLineTemp) {
          tdContentTemp = '<p data-winning data-show-title="1" data-label-line="1">' + this.selectedMeta.metaName + '</p>'
        } else {
          tdContentTemp = '<span data-winning style="margin-right:10px;" data-show-title>' + this.selectedMeta.metaName + '</span>'
        }
      }
      if (this.activeName == 'metaData') { // 元数据
        this.selectKeyList.forEach(item => {
          tdContentTemp +=
            '<span data-winning style="margin-right: 30px;"><input data-winning data-source-type="' + this.activeName + '" data-source-value="' + item.label + '|' + item.code + '|' + (item.score) + '"' + 'name="' + this.selectedMeta.metaCode + '|' + this.selectedMeta.metaName + '" type="checkbox" value="' + item.code + ' " disabled  ' + (this.isShowCheckboxTemp ? 'data-show-checkbox="1" ' : '') + ' data-expression="${' + this.selectedMeta.metaCode + '}==' + item.code + '"  >' + '<span data-winning>' + item.label + '<\/span>' +
            ((item.score && item.score != undefined && item.score != 'undefined') ? ('<span data-winning>(' + item.score + '分)<\/span></span>') : '') + (this.optionLineTemp ? '<br>' : '')
        })
      } else { // 监护项目
        if (this.selectKeyList.length > 1) tdContentTemp = ''

        if (this.optionLineTemp) { // 需要换行
          tdContentTemp += '<span data-winning style="display:flex;magin:0;padding:0;flex-direction: column;" >'
          this.selectKeyList.forEach((item, index) => {
            const alignValue = {
              left: 'flex-start',
              right: 'flex-end',
              center: 'center'
            }
            tdContentTemp +=
              '<span  style="display:flex;width:100%;magin:0;padding:0;line-height:' + this.optionLineTemp + ';justify-content:' + alignValue[item.alignValue] + ';"' + // 左右布局
              'data-source-type="' + this.activeName + '" data-source-value="' + item.label + '|' + item.code + '|' + item.alignValue + '"' + // 现场需要将名称显示出来
              ' data-option-line="' + this.optionLineTemp + '">' + (this.isShowPlaceHolder ? '${' + item.code + '}' : item.code) + '</span>'
          })
          tdContentTemp += '</span>'
        } else { // 不需要换行
          tdContentTemp += '<span data-winning style="display:flex;magin:0;padding:0;flex-direction: row;">'
          this.selectKeyList.forEach((item, index) => {
            const alignValue = {
              left: 'flex-start',
              right: 'flex-end',
              center: 'center'
            }
            tdContentTemp +=
              '<span  style="display:flex;width:100%;magin:0;padding:0;line-height:' + (this.selectKeyList.length > 1 ? '0.5' : '1') + ';justify-content:' + alignValue[item.alignValue] + ';"' + // 左右布局
              'data-source-type="' + this.activeName + '" data-source-value="' + item.label + '|' + item.code + '|' + item.alignValue + '"' + // 现场需要将名称显示出来
              ' data-option-line="' + this.optionLineTemp + '">' + (this.isShowPlaceHolder ? '${' + item.code + '}' : item.code) + '</span>'
          })
          tdContentTemp += '</span><span></span>'
        }
      }

      this.tdContent = tdContentTemp
      this.$emit('changeMeta', { tdContent: tdContentTemp, metaName: this.selectedMeta.metaName, metaCode: this.selectedMeta.metaCode, quickEditFlag: this.quickEditFlag })
    },

    /**
     * 获取元数据相关子项
     */
    handleSave() {
      this.contentFormat()

      this.$emit('confirm', { tdContent: this.tdContent, metaName: this.selectedMeta.metaName, metaCode: this.selectedMeta.metaCode, quickEditFlag: this.quickEditFlag })
      this.$emit('close')
    },
    /**
     * 添加监护项
     *
     */
    addSelectOption(e) {
      this.selectKeyList.push({
        label: '',
        code: '',
        alignValue: 'right'
      })
      this.selectedIndex = this.selectKeyList.length - 1
      // this.changeRow(e)
    },
    /**
     * 删除对应选项
     */
    deleteSelectOption(index) {
      this.selectKeyList.splice(index, 1)
      if (this.selectedIndex == index) this.selectedIndex = this.selectKeyList.length - 1
    },
    clickSelectOption(index) {
      this.selectedIndex = index
    },
    /**
     * 切换选项组tab
     */
    async changeSelectTab() {
      let res
      if (this.selectActive == 1) {
        res = await this.getMetaList()
      } else {
        res = await this.getBasicList()
      }

      this.tableInfo.totolCount = res.data.totolCount // 总条数
      this.tableInfo.tableData = res.data.result // 数据
    },
    cancelOptionBr(value) {
      if (this.optionLineTemp != value) {
        this.optionLineTemp = value
      } else this.optionLineTemp = false
    },
    searchSubInfo(e, row) {
      row.idKey = row.id + this.$dayjs().valueOf()
      this.$nextTick(() => {
        this.getOpenDetail(row, {}, e.currentTarget.parentElement, 'enter')
      })
    },
    /**
     * 获取子节点
     */
    getSubPlaceHolderList(row, treeNode, resolve) {
      fixedPlaceHolder_nonFixed({
        'id': row.id, // --必传，上面接口返回的ID
        'docId': row.docId, // --必传，上面接口返回数据源ID
        'execSql': row.execSql, // --必传，文书数据源执行SQL
        'module': row.module, // --必传，模块编码
        'serachKey': this.tableInfo.searchKey || row.searchKey // --非必传，模糊搜索关键字
      }).then(res => {
        res.data.forEach(item => {
          item.hasChildren = item.placeHolderType == '1'
          item.idKey = item.id + this.$dayjs().valueOf()
        })

        resolve(res.data)
        // this.$nextTick(() => {
        //   row.idKey = row.id + this.$dayjs().valueOf()
        // })

        // row.children = res.data
      })
    },
    isHaveChildren(row) {
      return row?.placeHolderType == '1'
    },
    // 点击当前行展开节点
    getOpenDetail(row, column, e, type) {
      let node = e.currentTarget
      if (type == 'enter') {
        node = e
        node.firstElementChild.click()
      } else {
        if (node.firstElementChild.firstElementChild.firstElementChild.tagName == 'DIV') {
          node.firstElementChild.firstElementChild.firstElementChild.click()
        } else {
          node.firstElementChild.firstElementChild.firstElementChild.nextElementSibling.click()
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  height: auto;
  width: 100%;

  ::v-deep .el-tabs__nav-wrap::after {
    display: none
  }

  .m-r20 {
    margin-right: 30px;
  }

  .el-divider--horizontal {
    margin-top: 12px;
    margin-bottom: 12px;
  }

  .proCss {
    display: flex;
    margin-bottom: 10px;
    padding: 5px;
    align-items: center;

    span {
      margin-right: 10px;
    }

    .el-input--mini {
      width: 180px;
      margin-right: 10px;
    }

    .el-select--mini {
      width: 90px;
      margin-right: 10px;
    }

  }

  .focus {
    background: #d9e6ff;
  }
}

::v-deep .el-footer {
  padding: 10px 0px;
  height: auto;
}
</style>
