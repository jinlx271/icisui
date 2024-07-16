<template>
<div  style="overflow: auto;height:100%">
  <div class="panel">
    <el-row>
      <el-button type="primary"
                 style="margin:0px 10px 10px 0px;"
                 size="small"
                 @click="addPageTable">新增</el-button>
      <el-collapse v-model="activeName">
        <el-collapse-item v-for="i in tableList"
                          class="tableLine_header"
                          :key="i.id"
                          :title="i.formName+'表格设置'"
                          :name="i.id">
          <div>
            <dl class="tableLine opline">
              <dd>标题</dd>
              <dd>字段英文名称</dd>
              <dd>字段中文名称</dd>
              <dd title="该字段是否是折行数据">折行数据</dd>
              <dd title="返回折行后的数据或者未折行的数据">返回折行数据</dd>
              <dd title="折行时每行的字数">折行字数</dd>
              <dd>患者评估单</dd>
              <dd>患者评ID</dd>
              <dd>备注</dd>
              <dd>操作</dd>
            </dl>
            <vuedraggable v-model="i.pagetablecolumnDtoList">
              <transition-group>
                <dl class="tableLine"
                    v-for="c in i.pagetablecolumnDtoList"
                    :key="c.id">
                  <dt><input class="noborder"
                           v-model="c.title"
                           placeholder="请输入" /></dt>
                  <dd><input class="noborder"
                           v-model="c.fieldEnName"
                           placeholder="请输入" /></dd>

                  <dd><input class="noborder"
                           v-model="c.fieldCnName"
                           placeholder="请输入" />
                  </dd>
                  <dd>
                    <el-switch
                    active-value="1"
                    inactive-value="0"
                    v-model="c.fieldWrap"
                    ></el-switch>
                  </dd>
                  <dd>
                    <el-switch
                    active-value="1"
                    inactive-value="0"
                    v-model="c.fieldWrapOpen"
                    ></el-switch>
                  </dd>
                  <dd><input class="noborder"
                           v-model="c.lineCharNum"
                           placeholder="请输入" /></dd>
                  <dd>
                    <el-switch
                    active-value="1"
                    inactive-value="0"
                    v-model="c.assess"
                    ></el-switch>
                  </dd>
                  <dd><input class="noborder"
                           v-model="c.formId"
                           placeholder="请输入" /></dd>
                  <dd><input class="noborder"
                           v-model="c.remark"
                           placeholder="请输入" /></dd>
                  <dd class="deleteLine"
                      @click="remove(i,c.id)"><i class="el-icon-delete"></i></dd>
                </dl>
              </transition-group>
            </vuedraggable>
            <dl class="tableLine opline addLine"
                @click="add(i)">
              <i class="el-icon-circle-plus-outline"></i>
            </dl>
          </div>
          <div>
            <el-input size="mini"
                      :autosize="true"
                      type="textarea"
                      :rows="6"
                      placeholder="请输入查询SQL语句"
                      v-model="i.execSql"></el-input>
          </div>
          <div style="text-align:center;margin-top:10px">
            <el-button v-if='i.page!="default"'
                       size="small"
                       @click="deletePageTable(i)"
                       type="danger">删除</el-button>
            <el-button v-if='i.page!="default"'
                       size="small"
                       @click="editPageTable(i)">修改</el-button>
            <el-button size="small"
                       @click="savePageTable(i)"
                       type="primary">保存</el-button>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-row>
    <page-table-dialog ref="pageTableDialog"
                    :on-callback="dialogCallback"
                    :tableList="tableList"></page-table-dialog>
  </div>
</div>
</template>

<script>
import pageTableDialog from './components/pageTableDialog'
import vuedraggable from 'vuedraggable'
import { findFormNameDetailsList, saveFormNameDetails, delFormNameDetails } from '@/api/formName.js'
export default {
  components: {
    vuedraggable,
    pageTableDialog
  },
  computed: {
  },
  data() {
    return {
      pageTableDialogVisible: false,
      activeName: '',
      tableList: [],
      currentLine: undefined
    }
  },
  created() {
     this.initTable()
  },
  methods: {
    initTable() {
      findFormNameDetailsList({
        pageNum: 1,
        pageSize: 10000
      }).then(res => {
        this.tableList = res.data
        this.activeName = res.data[0].id
      })
    },
    add(table) {
      table.pagetablecolumnDtoList.push({ id: ((1 + Math.random()) * 100000000) | 0 })
    },
    remove(table, id) {
      this.$confirm('您确定要删除吗？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
         table.pagetablecolumnDtoList = table.pagetablecolumnDtoList.filter(item => item.id !== id)
       })
    },
    dictDialogOpen(c) {
      this.currentLine = c
      this.dictDialogVisible = true
    },
    dictDialogClose(dictType) {
      if (dictType && dictType.typeCode && dictType.typeName) {
        this.currentLine.dictformat = dictType.typeCode + '|' + dictType.typeName
      }
      this.dictDialogVisible = false
    },
    cancelDict(c) {
      c.dictformat = ''
    },
    savePageTable(c) {
      saveFormNameDetails(c).then(res => {
        this.initTable()
        this.$message.success('保存成功')
      })
    },
    addPageTable() {
      this.$refs.pageTableDialog.show('create', {})
    },
    editPageTable(i) {
      this.$refs.pageTableDialog.show('update', i)
    },
    dialogCallback() {
          this.initTable()
          this.$message.success('保存成功')
    },
    deletePageTable(i) {
      this.$confirm('您确定要删除吗？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delFormNameDetails(i).then(res => {
          this.initTable()
          this.$message.success('保存成功')
        })
      })
    }
  }
}
</script>
<style scoped>
.panel {
  border: 1px solid #ebeef5;
  padding-top: 0px;
  border-radius: 5px;
}
.tableLine {
  margin-top: 0;
  border: 1px solid #dcdfe6;
  text-align: center;
  float: left;
  border-right: 0;
  width: 180px;
}
.tableLine dt {
  font-weight: 600;
}
.tableLine dd,
dt {
  height: 30px;
  line-height: 30px;
}
.tableLine dd {
  margin-left: 0;
  border-top: 1px solid #dcdfe6;
}
.addLine {
  border: 1px solid #dcdfe6;
  line-height: 180px;
  color: #409eff;
  cursor: pointer;
  width: 80px!important;
  height: 302px;
}
.deleteLine {
  font-size: 16px;
  color: #f56c6c;
  cursor: pointer;
}
.noborder {
  border: 0;
  width: 99%;
  text-align: center;
  color: #303133;
  font-size: 12px;
  height: 60%;
}
input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
  color: #dcdfe6;
}
.tableLine_header
  ::v-deep .el-collapse-item__header {
        font-weight: 600;
        padding-left: 20px;
  }
dt .noborder {
  font-weight: 600;
}
.addLine i {
  font-size: 18px;
}
.opline {
  /* width: 150px; */
  font-weight: 600;
}
.hasDict,
.noDict {
  font-size: 12px;
  cursor: pointer;
  overflow: hidden;
}
.noDict {
  color: #dcdfe6;
}
.hasDict {
  color: #409eff;
}
.hasDict i {
  color: #f56c6c;
}
</style>
