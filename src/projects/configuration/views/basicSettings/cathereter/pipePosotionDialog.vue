<template>
  <el-dialog
    v-el-drag-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    class="customdialog"
    width="600px"
    :before-close="handleHide"
  >
     <el-input
      size="small"
      v-model="searchKey"
      placeholder="导管部位编码/名称"
      clearable
      suffix-icon="el-icon-search"
      style="width: 200px; margin-bottom:10px"
      @keyup.enter.native="getPositionList(1)"
      @input="getPositionList(1)"
    ></el-input>
    <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)"
      :data="showDictList"
      highlight-current-row
      fit
      border
      height="420px"
      ref="multipleTable"
      @selection-change="handleSelectionChange"
      size="mini"
      v-loading="loading"
    >
      <v-table-column width="50" align="center" type="selection">
      </v-table-column>
      <v-table-column
        prop="dictCode"
        label="部位编码"
        align="center"
      ></v-table-column>
      <v-table-column
        prop="dictName"
        label="部位名称"
        align="center"
      ></v-table-column>
    </el-table>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleHide">{{ cancelText }}</el-button>
      <el-button type="primary" @click="handleSave">{{ saveText }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  cathPosi_findWithPage
} from '@/api/configuration'
import { mapGetters } from 'vuex'
import {
  dictItem_findAllWithPage
} from '@/api/configuration'
export default {
  name: 'PipePosotionDialog',
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
    // 选择的病区
    wardCode: {
      type: String,
      dafault: ''
    }
  },
  created() {

  },
  data() {
    return {
      loading: false,
      searchKey: '', //
      // 导管部位列表
      pipePositionDataList: [],
      multipleSelection: [],
      dialogVisible: false,
      // 导管部位字典相关信息
      dictInfo: {
        code: 'ICIS_DICT_CATH_POSI',
        list: []
      },
      positionList: [],
      // 需要显示的列表
      showDictList: []
    }
  },
  computed: {
    ...mapGetters([])
  },
  methods: {
    getPositionList() {
      this.loading = true
      const query = {
        pageNum: 1,
        pageSize: 1000,
        wardCode: this.wardCode
      }
      cathPosi_findWithPage(query).then(res => {
        if (res.code == 0) {
          this.positionList = res.data.result

          this.getDictDataList()
        }
      })
    },
    // 获取部位列表
    getDictDataList() {
      const query = {
        pageNum: 1,
        pageSize: 1000,
        dictGroupCode: this.dictInfo.code,
        searchKey: this.searchKey
      }
      dictItem_findAllWithPage(query).then(res => {
        this.loading = false
        if (res.code == 0) {
          // 过滤掉 已经绑定的导管
          this.positionList = this.positionList.map(posObj => {
            return posObj.cathPosiDictCode
          })

          this.showDictList = res.data.result.filter(obj => !this.positionList.includes(obj.dictCode) && obj.statusDict == '1')
          if (this.showDictList.length == 0 && this.searchKey) {
            this.$message({
              type: 'warning',
              message: '未找到对应部位，或该部位已绑定人体切片'
            })
          }
        }
      })
    },
    handleHide() {
      this.dialogVisible = false
      this.searchKey = ''
      this.$refs.multipleTable.clearSelection()
    },
    handleShow() {
      this.dialogVisible = true
      this.getPositionList()
    },
    handleSave() {
      if (this.multipleSelection.length === 0) {
        this.$message('请选中导管部位!')
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
    padding:10px;
  }
}
</style>
