<!-- 组件化配置首页 -->
<template>
  <el-container style="height:100%" id="componentdesign" class="componentdesign" element-loading-text="加载中" v-loading="loading">
    <el-header>
      <div>
        <i class="iconBlue"></i>
        <span>组件块列表</span>
      </div>
    </el-header>
    <el-main style="height:calc(100% - 105px)">
      <div class="inputDiv flex flex-between">
        <div class="flex flex-between align-items-center">
          <el-input
            @keyup.enter.native="init"
            @input="debounceFC"
            class="input"
            v-model="queryData.searchKey"
            size="small"
            clearable
            placeholder="组件编码/组件名称"
            suffix-icon="el-icon-search"
          ></el-input>
          <el-checkbox v-model="queryData.statusDict" true-label="" false-label="1" @input="debounceFC" class="pl-5 ">
                    显示禁用
            </el-checkbox>
        </div>
        <el-button @click.native.prevent="add" type="primary" size="small">新增组件</el-button>
      </div>
      <div  style="height:calc(100% - 41px)">
        <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)"  ref="table" :row-class-name="({row}) => row.statusDict == 0 ? 'disabled' : ''" :data="tableData" border height="100%">
          <v-table-column prop="componentCode" label="组件块编码">
            <template slot-scope="scope">
              <el-input v-if="!scope.row.updateOrSave" :readonly="scope.row.updateOrSave" v-model="scope.row.componentCode" placeholder="请输入" />
              <span v-else>{{scope.row.componentCode}}</span>
            </template>
          </v-table-column>
          <v-table-column prop="componentName" label="组件块名称">
            <template slot-scope="scope">
              <el-input v-if="!scope.row.updateOrSave" :readonly="scope.row.updateOrSave" v-model="scope.row.componentName" placeholder="请输入" />
              <span v-else>{{scope.row.componentName}}</span>
            </template>
          </v-table-column>
          <v-table-column prop="createrName" label="创建人"></v-table-column>
          <v-table-column prop="createTime" label="创建时间"></v-table-column>
          <v-table-column prop="updaterName" label="更新人名称"></v-table-column>
          <v-table-column prop="updateTime" label="更新时间"></v-table-column>
          <v-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.updateOrSave" @click.native.prevent="modifyRow(scope.row)" style="color:#E6A23C" type="text" size="small">修改</el-button>
              <el-button v-if="!scope.row.updateOrSave" @click.native.prevent="cancelRow(scope.row,scope.$index)" style="color:#909399" type="text" size="small">取消</el-button>
              <el-button v-if="!scope.row.updateOrSave" @click.native.prevent="saveRow(scope.row)" type="text" size="small">保存</el-button>
              <el-button @click.native.prevent="configure(scope.row)" type="text" size="small">配置</el-button>
              <el-button v-if="scope.row.updateOrSave" :style="{ color: scope.row.statusDict == 1 ? '#EC0000': '#00AB44' }" @click.native.prevent="enableOrDisable(scope.row,scope.$index)" type="text" size="mini">{{+scope.row.statusDict ? '禁用' : '启用' }}</el-button>
            </template>
          </v-table-column>
        </el-table>
      </div>
    </el-main>
    <!-- 翻页 -->
    <el-footer class="areaFormConfig_left_footer">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryData.pageNum"
        :total="totolCount"
        :page-size="queryData.pageSize"
        :hide-on-single-page="false"
        :page-sizes="[10, 15, 20, 25, 30]"
        layout="total, sizes, prev, pager, next"
        class="pagination"
        background
      ></el-pagination>
    </el-footer>
    <!-- 左侧新增的弹框 -->
    <el-dialog :close-on-click-modal="false" title="新增组件" :visible.sync="dialogVisible" width="550px" :before-close="hideDialog">
      <el-form :rules="rules" ref="dataForm" :model="dataModel" label-position="right" label-width="120px">
        <el-form-item label="组件编码" prop="formName">
          <el-input v-model="dataModel.componentCode" size="medium" maxlength="32" ref="input" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="组件名称" prop="formName">
          <el-input v-model="dataModel.componentName" size="medium" maxlength="32" ref="input" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hideDialog">取消</el-button>
        <el-button type="primary" @click="addDialog">保存</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import {
  componentsection_listPage, // 组件分页查询
  componentsection_update, // 修改组件块配置数据
  componentsection_add, // 新增组件块配置
  componentsection_delete, // 删除组件块
  componentsection_enable, // 启用
  componentsection_disable // 禁用
} from '@/api/configuration'
import _ from 'lodash'
export default {
  name: 'Componentdesign',
  components: {},
  data: function() {
    return {
      loading: false, // 表格的loding
      dialogVisible: false, // 新增表单框显示隐藏
      dataModel: {
        componentCode: '', // 新增编码
        componentName: '' // 新增名称
      }, // 弹框数据
      rules: {
        componentCode: [
          { required: true, message: '组件编码不能为空！', trigger: 'blur' }
        ],
        componentName: [
          { required: true, message: '组件名称不能为空！', trigger: 'blur' }
        ]
      }, // 弹框校验
      queryData: {
        statusDict: '',
        pageNum: 1, // --页码，必传
        pageSize: 15, // --一页数量，必传
        searchKey: '' // --模糊搜索关键字，非必传
      },
      totolCount: 0, // 总条数
      tableData: [], // 返回的数据
      oldTableData: [] // 存储数据表格数据
    }
  },
  props: {},
  watch: {},
  computed: {},
  created() {
    this.init() // 初始化
    // 截流
    this.debounceFC = _.debounce(() => {
      this.queryData.pageNum = 1 // 输入的时候需要改为第一页
      this.init() // 输入框截流
    }, 800)
  },
  mounted() {},
  methods: {
    /**
     * 初始化方法
     */
    init() {
      this.loading = true
      // 获取数据
      componentsection_listPage(this.queryData).then(res => {
        this.totolCount = res.data.totolCount // 总条数
        this.tableData = []
        res.data.result.map(item => {
          this.tableData.push({ ...item, updateOrSave: true })
        }) // 数据赋值
        this.oldTableData = JSON.parse(JSON.stringify(this.tableData))
        this.loading = false
      })
    },
    /**
     * 新增页面
     */
    add() {
      this.dialogVisible = true
    },
    /**
     * 配置页面
     */
    configure(row) {
      this.addDesign(row.componentName, row.id) // 跳转新增页面
    },
    /**
     * 修改
     */
    modifyRow(item) {
      if (!this.testing()) {
        // 检测是否可以修改
        return
      }
      item.updateOrSave = false
    },
    /**
     * 取消
     */
    cancelRow(row, rowIndex) {
      // 修改
      this.$set(
        this.tableData,
        rowIndex,
       { ...JSON.parse(JSON.stringify(this.oldTableData[rowIndex])), updateOrSave: true })
      this.$message.success('已取消！')
    },
    /**
     * 保存
     */
    saveRow(item) {
      componentsection_update({
        id: item.id, // 修改才有id 新增没有
        componentCode: item.componentCode,
        componentName: item.componentName,
        basicUpdate: true // true: 修改基础信息：编码，名称  false: 组件所有数据
      }).then(res => {
        this.$message({
          message: '修改成功!',
          type: 'success'
        })
        item.updateOrSave = true
      })
    },
    /**
     * 删除组件
     */
    deleteRow(row) {
      this.$confirm('您确定删除本条记录吗?', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(res => {
          componentsection_delete({
            id: row.id // 组件id
          }).then(res => {
            this.$message({
              message: `删除组件成功`,
              type: 'success'
            })
            this.init() // 重新拉数据
          })
        })
        .catch(() => {})
    },
    /**
     * 翻页 一页总条数
     */
    handleSizeChange(num) {
      this.queryData.pageNum = 1
      this.queryData.pageSize = num
      this.init()
    },
    /**
     * 翻页
     */
    handleCurrentChange(num) {
      this.queryData.pageNum = num
      this.init()
    },
    /**
     * 新增跳转
     */
    addDesign: function(name, id) {
      this.$router.push({
        path: '/configuration/evaluationForms/componentdesign/add',
        query: {
          name: name,
          id: id,
          state: 'assembly' // 组件的标识
        }
      })
    },
    /**
     * 弹框-新增表单的隐藏
     */
    hideDialog(flag) {
      this.dataModel = {
        componentCode: '', // 新增编码
        componentName: '' // 新增名称
      } // 弹框数据
      this.dialogVisible = false
    },
    /**
     * 弹框-新增表单
     */
    addDialog() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          componentsection_add({
            ...this.dataModel,
            basicUpdate: true // true: 修改基础信息：编码，名称，简称，描述  false: 组件所有数据
          }).then(res => {
            this.$message({
              message: '新增成功!',
              type: 'success'
            })
            this.init()
            this.hideDialog()
          })
        }
      })
    },
    /**
     * 启用禁用
     */
    enableOrDisable(row) {
      if (!this.testing()) {
        // 检测是否可以修改
        return
      }
      const queryUrl = row.statusDict == '1' ? componentsection_disable : componentsection_enable // 启用禁用的请求切换
      queryUrl({
        id: row.id
      }).then(res => {
        this.$message({
          type: 'success',
          message: +row.statusDict ? '已禁用' : '已启用'
        })
        this.init()
      })
    },
    /**
     * 检测
     */
    testing() {
      for (let i = 0; this.tableData.length > i; i++) {
        if (!this.tableData[i].updateOrSave) {
          this.$message.error(
            `请先保存＂${this.tableData[i].componentName}＂这条数据！`
          )
          return false
        }
      }
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.componentdesign {
  height: 100%;
  background: #ffffff;
  ::v-deep.el-header {
    height: 45px !important;
    display: flex;
    align-items: center;
    .iconBlue {
      display: inline-block;
      width: 3px;
      height: 16px;
      background: var(--maincolor);
    }
    div {
      display: inline-flex;
      align-items: center;
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
    .addBorder {
      width: 30px;
      height: 30px;
      margin-left: 20px;
      justify-content: center;
      border: 1px solid #eee;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      border-radius: 4px;
    }
  }
  ::v-deep.el-main {
    padding: 5px 20px 10px 20px;
    .inputDiv {
      display: flex;
      align-items: center;
      height: 31px !important;
      background: #ffffff;
      border-radius: 2px;
      margin-bottom: 10px;
      .input {
        margin-right: 10px;
      }
      input {
        background: #f3f5f9;
        border: none;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #000622;
      }
    }
  }
  ::v-deep.el-footer {
    .pagination {
      float: right;
      margin-top: 15px;
      margin-right: 10px;
    }
  }
}
</style>
