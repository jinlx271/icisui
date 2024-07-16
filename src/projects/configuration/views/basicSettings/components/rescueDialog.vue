<template>
  <div class="configDialog">
    <el-dialog :title="title" :visible.sync="dialogShowFlag" :modal-append-to-body="false" :before-close="beforeCloseDialog">
      <div class="configDialog_main">
        <div class="configDialog_main_left" v-show="isShowClass">
          <div class="configDialog_main_title">
            监护分类
          </div>

            <el-tree :data="classList"  default-expand-all :highlight-current="true" style="height:calc(100% - 20px); overflow-y:auto" @node-click="handleNodeClick">
              <div slot-scope="{ node,data }"  >
                <span>{{ data.label}}</span>
                <!-- <span v-if="data.busiTypeDictName" style="color:#999;">({{data.busiTypeDictName}})</span> -->
              </div>
            </el-tree>

        </div>
        <div class="configDialog_main_right">
          <div class="configDialog_main_title" v-show="isShowClass">
            监护项
          </div>
          <div class="configDialog_main_search">
            <el-input class="elInput" size="small" placeholder="监护项名称" suffix-icon="el-icon-search" v-model="searchKey" clearable @input="searchList()">
            </el-input>
          </div>
          <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" ref="tableData" :data="filterData" fit border height="320px" width="100%"
          @selection-change="handleSelectionChange"
          @row-dblclick="activeEdit"
          >
              <v-table-column type="selection" width="50" :selectable="checkSelectable">
              </v-table-column>
              <v-table-column v-for="item in tableHeaderList"
              :label="item.label"
              :prop="item.key"
              :key="item.label">
                <template slot-scope="scope">
                  <el-input v-model="scope.row[item.key]" placeholder="请输入" v-if="item.canEdit&&scope.row.isEdit"></el-input>
                  <span v-else-if="item.canEdit">{{showPersonData(scope.row,item.key)}}</span>
                  <span v-else>{{scope.row[item.key]}}</span>
                </template>
              </v-table-column>
          </el-table>

        </div>
      </div>

      <div slot="footer">
        <el-button @click="closeDialog()">关 闭</el-button>
        <el-button type="primary" @click="submitData">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
import {
  moniitem_getMoniitemList

} from '@/api/configuration'
import {
  rescure_rescureBaseMoniitem_batchInsert
} from '@/api/rescure'
import { mapGetters } from 'vuex'
export default {
  name: 'RescueDialog',
  components: {},
  data: function() {
    return {
      currentClassObj: {},
      currentClass: '',
      classList: [],
      tableData: [],
      configData: [], // 已配置数据
      multipleSelection: [],
      searchKey: '',
      configDialogFn: [],
      currRow: null // 可编辑行
    }
  },
  props: {
    dialogShowFlag: {
      type: Boolean,
      default: false
    },
    tableHeaderList: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: ''
    },
    isShowClass: {
      type: Boolean,
      default: true
    },
    wardCode: {
      type: String,
      default: ''
    },
    configType: { // 配置类型  是否和个人相关   person 是个人相关  config是基础配置页面
      type: String,
      default: ''
    },
    busiTypeDictCode: { // 配置类型   监控数据还是 液体平衡
      type: String,
      default: ''
    },
    personMonitorData: {
      type: Array,
      default: () => []
    },
    filterKey: { // 过滤的关键字 字段
      type: String,
      default: 'moniitemCode'
    },
    title: { // 弹框题目
      type: String,
      default: '添加项目'
    }
  },
  watch: {
    wardCode: function() {
      this.classList = []
     this.initData()
    },
    dialogShowFlag: function() {
      if (this.dialogShowFlag) {
        const data = this.personMonitorData.map(obj => {
          const children = this.tableData.filter(row => row[this.filterKey] == obj[this.filterKey])
          let child
          if (children.length > 0) {
            child = children[0]
          }
          child.checkSelectable = 'cantSelect'
          return child
        })
        this.configData = [...data]

        this.tableData = [...this.tableData] // 重新渲染
        this.$nextTick(() => {
         this.toggleSelection(this.configData)
       })
      }
    },
    filterData: function() {
      this.$nextTick(() => {
         this.toggleSelection(this.configData)
      })
    }
  },
  computed: {
    ...mapGetters(['currentUserWard']),
    filterData() {
      return this.tableData.filter(obj => {
        if (this.currentClass == '') return true
        else if (obj.monitypeName == this.currentClass) {
          return true
        }
      })
    }
  },
  created() {
    this.initData()
  },
  mounted() {},
  methods: {
    async initData() {
      const tableDataTemp = await this.getBasicData()
      this.tableData = tableDataTemp.map(item => {
        item.checkSelectable = 'canSelect'
        return item
      })
      if (this.isShowClass) {
        if (this.classList.length > 0) return
        const classListTemp = this.tableData.map(item => {
          return item.monitypeName
        })

        const data = Array.from(new Set(classListTemp)).map(item => {
          return {
            label: item,
            type: item
          }
        })

        this.classList.push({
          label: '全部',
          type: '',
          children: data
        })
      }
    },
    // 获取基础配置数据
   getBasicData() {
      return new Promise((resolve, reject) => {
        const query = {
          searchKey: this.searchKey
        }
        moniitem_getMoniitemList(query).then(res => {
          if (res.code == 0) {
            resolve(res.data)
          }
        })
      })
   },
    /**
    * 搜索数据
    */
    async searchList() {
      let tableDataTemp = await this.getBasicData()
      tableDataTemp = tableDataTemp.map(item => {
        item.checkSelectable = 'canSelect'
        return item
      })
      if (this.personMonitorData.length > 0) {
        const data = this.personMonitorData.map(obj => {
          const children = tableDataTemp.filter(row => row[this.filterKey] == obj[this.filterKey])
          let child
          if (children.length > 0) {
            child = children[0]
            child.checkSelectable = 'cantSelect'
          }

          return child
        })
        this.configData = [...data]
      }
      this.tableData = [...tableDataTemp]
    },

    // /  树的选择
    handleNodeClick(e) {
      this.currentClassObj = e
      this.currentClass = e.type
    },
    beforeCloseDialog() {
      this.closeDialog()
    },
    // 关闭当前弹框
    closeDialog(data) {
      this.currentClass = ''
      if (data) {
        this.$emit('closeFn', data)
      } else {
        this.$emit('closeFn', [])
      }
    },
    // 回显已选中项目
    toggleSelection(rows) {
      if (rows.length > 0) {
        rows.forEach(row => {
          if (row && row != undefined) { this.$refs.tableData?.toggleRowSelection(this.tableData.find(item => item.moniitemCode == row.moniitemCode), true) }
        })
      }
    },
    checkSelectable(row) {
      if (row.checkSelectable == 'cantSelect') {
        return false
      } else return true
    },
    // 选择对应的行
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 保存数据
    async submitData() {
      this.cancelEditStatus()
      this.multipleSelection = this.multipleSelection.filter(item => item != null)
      let data = [...new Set(this.multipleSelection)]// 数据去重
      data = data.map(item => {
        item.wardCode = this.wardCode
        return item
      })
      let result
      if (this.type == 'rescureBaseMoniitem') {
        result = await this.batchInsetBaseMoni(data)
      } else if (this.type == 'rescureDrug') {
        result = await this.batchInsetDrug(data)
      }
      if (result == 'suc') {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.closeDialog(data)
      } else {
        this.closeDialog([])
      }
    },

    // 批量增加监护项
    batchInsetBaseMoni(data) {
      return new Promise((resolve, reject) => {
        rescure_rescureBaseMoniitem_batchInsert(data).then(res => {
          if (res.code == '0') {
           resolve('suc')
          }
        })
      })
    },

    // 激活编辑状态
    activeEdit(row, column, event) {
      this.cancelEditStatus()
      // 只能有一行为编辑状态
      row.isEdit = true
      this.currRow = { ...row }
      this.tableData = [...this.tableData]
    },
    // 取消编辑状态
    cancelEditStatus() {
      if (this.currRow != null) {
        this.tableData = this.tableData.map(obj => {
          obj.isEdit = false
          return obj
        })
      }
    },
    // 显示个人 相关配置项目
    showPersonData(row, key) {
      let value = row[key]

      if (this.personMonitorData.length > 0) {
        const result = this.personMonitorData.filter(obj => obj.moniitemCode == row.moniitemCode && row.monitypeCode == obj.monitypeCode)
        if (result.length > 0) {
            value = result[0][key] != null ? result[0][key] : row[key]
        }
      }
      return value
    }

  }
}
</script>
<style lang="scss" scoped>
.configDialog{
  .btn{
      margin-right:10px;
    }
  ::v-deep .el-dialog{
    width:1140px;

    &__body{

      width:100%;
      .configDialog_main{
      display: flex;
      width:100%;
      &_left{
        width:210px;
        height:320px;
        overflow: hidden;
        border-right:1px solid #DFE7F5;
      }
      &_right{
        flex:1;
        overflow: hidden;
        padding-left:20px;
      }
      &_title{
        display: flex;
        align-items: center;
        height:30px;
        line-height: 30px;
        position: relative;
      }
      &_search{
        margin-bottom:10px;
        width:240px;
      }
      &_title::before{
          content:'';
          width: 3px;
          height: 14px;
          background: var(--maincolor);
          margin-right:8px;
      }
    }
    }
    &__footer{
      //border-top:1px solid #ddd;
      padding: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }

}

</style>

