<!--导管匹配-->
<template>
  <el-dialog
    v-el-drag-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    class="customdialog"
    :before-close="handleHide"
    width="800px"
  >
    <div style="margin: -10px 0px 10px 0px">
      <span>分类</span>
      <el-select
        v-model="selectedPipeType"
        placeholder="请选择"
        @change="getCatheterList"
        clearable
        size="mini"
        filterable
        style="width: 120px; margin-right: 10px"
      >
        <el-option
          v-for="item in typeInfo.list"
          :key="item.dictCode"
          :label="item.dictName"
          :value="item.dictCode"
          :disabled="item.statusDict == '0'"
        ></el-option>
      </el-select>
      <span>危险级别</span>
      <el-select
        v-model="selectedPipeRisk"
        placeholder="请选择"
        @change="getCatheterList"
        clearable
        size="mini"
        style="width: 160px; margin-right: 10px"
      >
        <el-option
          v-for="item in levelInfo.list"
          :key="item.dictCode"
          :label="item.dictName"
          :value="item.dictCode"
          :disabled="item.statusDict == '0'"
        ></el-option>
      </el-select>
      <span>导管名称</span>
      <el-input v-model="searchKey" placeholder="请输入" @input="getCatheterList" style="width: 160px; margin-right: 10px"></el-input>
      <!-- <el-button
        @click.prevent="getCatheterList"
        size="mini"
        >刷新</el-button
      > -->
      <el-button size="mini" type="primary" style="font-size:18px;height:34px;margin-right:5px;" :icon="loading?'el-icon-loading':'el-icon-refresh'"
                   @click="getCatheterList"></el-button>
    </div>
    <div v-loading="loading">
      <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)"
        :data="pipeDataList"
        highlight-current-row
        fit
        border
        height="400px"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        size="mini"
      >
        <v-table-column width="50" align="center" type="selection"
           :selectable="checkSelectable"
        >
        </v-table-column>
        <v-table-column
          prop="catheterCode"
          label="导管编码"
          align="center"
        ></v-table-column>
        <v-table-column
          prop="catheterName"
          label="导管名称"
          align="center"
        ></v-table-column>
        <v-table-column
          prop="catheterAbbr"
          label="导管简称"
          align="center"
        ></v-table-column>
        <v-table-column
          prop="catheterTypeDict"
          label="导管分类"
          align="center"
        >
        <template slot-scope="scope">
            <span>{{ typeInfo.list.filter(item=>item.dictCode==scope.row.catheterTypeDict)[0].dictName}}</span>
          </template>
        </v-table-column>
        <v-table-column
          prop="risk"
          label="危险分级"
          align="center"
        >

        <template slot-scope="scope">
            <span>{{ levelInfo.list.filter(item=>item.dictCode==scope.row.catheterRiskLevelDict)[0].dictName}}</span>
          </template>
        </v-table-column>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleHide">{{ cancelText }}</el-button>
      <el-button type="primary" @click="handleSave">{{ saveText }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  catheter_findWithPage,
  dictItem_findAllWithPage

} from '@/api/configuration'

import { mapGetters } from 'vuex'

export default {
  name: 'PipeDialog',
  filters: {},
  props: {
    cancelText: {
      type: String,
      default: '取消'
    },
    saveText: {
      type: String,
      default: '保存'
    },
    title: {
      type: String,
      default: ''
    },
    onCallback: {
      type: Function,
      default: undefined
    },
    selectedCatherList: { // 已经选择的导管
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      pipeDataAllList: [], // 所有导管映射
      pipeDataList: [],
      pipeTypeList: [],
      selectedPipeName: '',
      pitpRiskLevelList: [],
      searchKey: '',
      selectedPipeType: null,
      selectedPipeRisk: null,
      multipleSelection: [],
      dialogVisible: false,
      statusDict: {
        code: 'ICIS_DICT_STATUS',
        list: []
      },
      levelInfo: {
        code: 'ICIS_DICT_CATHETER_RISK_LEVEL',
        list: []
      },
      typeInfo: {
        code: 'ICIS_DICT_CATHETER_TYPE',
        list: []
      }
    }
  },
  created() {

  },
  watch: {
    selectedCatherList: function() {
      this.showSelectCather()
    }
  },
  computed: {
    ...mapGetters([])
  },
  methods: {

    // 获取状态码
    getStatusList() {
      const query = {
        pageSize: 100,
        pageNum: 1,
        dictGroupCode: this.statusDict.code
      }
      dictItem_findAllWithPage(query).then(res => {
        if (res.code == 0) {
          this.statusDict.list = res.data.result
          this.getTypeList()
        }
      })
    },
    // 获取分类
    getTypeList() {
      const query = {
        pageSize: 100,
        pageNum: 1,
        dictGroupCode: this.typeInfo.code
      }
      dictItem_findAllWithPage(query).then(res => {
        if (res.code == 0) {
          this.typeInfo.list = res.data.result
          this.getLevelList()
        }
      })
    },
    // 获取风险等级
    getLevelList() {
      const query = {
        pageSize: 100,
        pageNum: 1,
        dictGroupCode: this.levelInfo.code
      }
      dictItem_findAllWithPage(query).then(res => {
        if (res.code == 0) {
          this.levelInfo.list = res.data.result
          this.getCatheterList()
        }
      })
    },
    // 获取导管信息列表
    getCatheterList() {
      const query = {
        pageSize: 10000,
        pageNum: 1,
        searchKey: this.searchKey || '',
        catheterTypeDict: this.selectedPipeType || '',
        catheterRiskLevelDict: this.selectedPipeRisk || ''
      }
      this.loading = true
      catheter_findWithPage(query).then(res => {
        this.loading = false
        if (res.code == 0) {
          this.pipeDataAllList = res.data.result.filter(item => item.statusDict == '1')
          this.pipeDataList = this.pipeDataAllList
          // 显示已经添加的数据
          this.showSelectCather()
        }
      })
    },
    // 显示导管列表
    showSelectCather() {
      // 第1种方案 把数据回显  但是后天点击保存没有 覆盖数据
      // this.$nextTick(() => {
      //   const catherCodeList = this.selectedCatherList.map(item => {
      //       return item.catheterCode
      //     })
      //     this.pipeDataList.map(item => {
      //       if (catherCodeList.includes(item.catheterCode)) {
      //         this.$refs.multipleTable?.toggleRowSelection(item, true)
      //       }
      //     })
      // })
      // 第2种方案 把数据过滤掉

        const catherCodeList = this.selectedCatherList.map(item => {
            return item.catheterCode
        })
        this.pipeDataList = this.pipeDataList.filter(item => !catherCodeList.includes(item.catheterCode))
    },
    handleHide() {
      this.searchKey = ''
      this.selectedPipeType = null
      this.selectedPipeRisk = null
      this.dialogVisible = false
      this.$refs.multipleTable.clearSelection()
    },
    handleShow() {
      this.loading = true
      if (this.statusDict.list.length > 0) {
        this.getCatheterList()
      } else {
        this.getStatusList()
      }

      this.dialogVisible = true
    },
    handleSave() {
      if (this.multipleSelection.length === 0) {
        this.$message('请选中导管!')
        return
      }
      if (this.onCallback) {
        this.onCallback(this.multipleSelection, this.handleHide)
      } else {
        this.handleHide()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    /** 查看导管是否被禁用  以及对应的分类以及级别被禁止 */
    checkSelectable(row) {
      const disableType = this.typeInfo.list.filter(item => item.statusDict == 0).map(item => item.dictCode)
      const disableLevel = this.levelInfo.list.filter(item => item.statusDict == 0).map(item => item.dictCode)

      let disabledFlag = true
      if (disableType.includes(row.catheterTypeDict)) {
        disabledFlag = false
      }
      if (disableLevel.includes(row.catheterRiskLevelDict)) {
        disabledFlag = false
      }
      return disabledFlag
    }
  }
}
</script>

<style lang="scss" scoped>
.customdialog {
  border: 1px solid springgreen;
  ::v-deep .el-dialog__body {
    padding: 10px 30px 40px 20px;
    margin: 0px 0px 0px 0px;
  }
  .dialog-footer {
    text-align: right !important;
  }
}
</style>
