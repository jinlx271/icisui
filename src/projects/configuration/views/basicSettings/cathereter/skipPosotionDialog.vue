<template>
  <el-dialog v-el-drag-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false"
    class="customdialog" width="600px">
    <el-input size="small" v-model="searchKey" @input="debounceSearch" placeholder="皮肤部位编码/名称" clearable
      suffix-icon="el-icon-search" style="width: 200px; margin-bottom:10px"
      @keyup.enter.native="getPositionList"></el-input>
    <el-table
      @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
      :data="skipPositionDataList" highlight-current-row fit border height="300px" ref="multipleTable"
      @selection-change="handleSelectionChange" size="mini">
      <v-table-column width="50" align="center" type="selection">
      </v-table-column>
      <v-table-column prop="dictCode" label="编码" align="center"></v-table-column>
      <v-table-column prop="dictName" label="名称" align="center"></v-table-column>
    </el-table>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleHide">{{ cancelText }}</el-button>
      <el-button type="primary" :disabled="disabled" @click="handleSave">{{ saveText }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { debounce } from 'lodash'
import { mapGetters } from 'vuex'
import { frontFilter } from '@/utils/index' // 模糊查询方法
import {

} from '@/api/configuration'
export default {
  name: 'SkipPosotionDialog',
  filters: {},
  props: {
    cancelText: {
      type: String,
      default: '取消'
    },
    data: {
      type: Array,
      default: function () {
        return []
      }
    },
    tableData: { // 病区的所有可以配置的皮肤
      type: Array,
      default: function () {
        return []
      }
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
    }
  },

  created() {
    this.initData()
  },
  data() {
    return {
      // 皮肤部位列表
      searchKey: '',
      disabled: false,
      skipPositionDataList: [],
      skipPositionDataListAll: [],
      multipleSelection: [],
      dialogVisible: false
    }
  },
  mounted() {

  },
  computed: {
    ...mapGetters([])
  },
  methods: {
    async initData() {
      const dictGroupCode = 'ICIS_DICT_SKIN_POSI'
      const ICIS_DICT_SKIN_POSI = await this.$getDictItemList(dictGroupCode)
      this.skipPositionDataList = this.skipPositionDataListAll = ICIS_DICT_SKIN_POSI.filter(item => item.dictCode !== '0')
      this.skipPositionDataList = this.skipPositionDataList.filter(v => v.statusDict == 1)
      this.getPositionList()
    },
    debounceSearch() {
      this.debounceSearchSymbol = this.debounceSearchSymbol ? this.debounceSearchSymbol : debounce(function () {
        this.getPositionList()
      }, 200)
      this.debounceSearchSymbol()
    },
    getPositionList: function () {
      this.skipPositionDataList = frontFilter(this.searchKey, this.skipPositionDataListAll)
      const filterList = this.tableData.map(posObj => {
        return posObj.skinPosiDictCode
      })
      this.skipPositionDataList = this.skipPositionDataList.filter(obj => !filterList.includes(obj.dictCode) && obj.statusDict == '1')
    },
    handleHide() {
      this.searchKey = ''
      this.dialogVisible = false
      this.$refs.multipleTable.clearSelection()
    },
    handleShow() {
      this.searchKey = ''
      this.getPositionList()
      this.dialogVisible = true
      this.disabled = false
    },
    handleSave() {
      if (this.multipleSelection.length === 0) {
        this.$message('请选中皮肤部位!')
        return
      }
      if (this.onCallback) {
        this.onCallback(this.multipleSelection, this.handleHide)
      } else {
        this.handleHide()
      }
      this.disabled = true
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  },
  watch: {
    tableData: {
      immediate: true,
      handler: function (params) {
        this.getPositionList()
      }
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
