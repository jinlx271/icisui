<!-- 数据设置 -->
<template>
  <div class="dataSourceConfig" id="dataSourceConfig" ref="dataSourceConfig">
    <el-container style="height:100%">
      <!-- 头部 -->
      <el-header height="50" class="inputclass">
        <div class="flex flex-between align-items-center">
          <el-input @keyup.enter.native="init" @input="debounceFC" v-model="queryData.searchKey" size="small" placeholder="数据编码/名称" clearable suffix-icon="el-icon-search" class="pr-5 "></el-input>
          <el-checkbox v-model="queryData.statusDict" true-label="" false-label="1" @input="debounceFC" class="pl-5 ">
                  显示禁用
          </el-checkbox>
        </div>
        <el-button size="mini" @click.native.prevent="addTableRow" type="primary">新 增</el-button>
      </el-header>
      <!-- 表格 -->
      <el-main style="height:calc(100% - 112px)">
        <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)"
          element-loading-text="加载中"
          v-loading="loading"
          ref="tableData"
          :row-class-name="({row}) => row.statusDict == 0 ? 'disabled' : ''"
          :data="tableData"
          highlight-current-row
          fit
          border
          height="100%"
          style="width:100%;overflow: auto;"
          row-key="id"
        >
          <v-table-column prop="sourceCode" label="数据源编码" align="left" width="100px">
            <template slot-scope="scope">
              <el-input v-if="scope.row.editOrSave" type="type" v-model="scope.row.sourceCode" placeholder="请输入"></el-input>
              <span v-else>{{scope.row.sourceCode}}</span>
            </template>
          </v-table-column>
          <v-table-column prop="sourceName" label="数据源名称" align="left" width="100px">
            <template slot-scope="scope">
              <el-input v-if="scope.row.editOrSave" type="type" v-model="scope.row.sourceName" placeholder="请输入"></el-input>
              <span v-else>{{scope.row.sourceName}}</span>
            </template>
          </v-table-column>
          <v-table-column prop="parentCode" label="父层元数据编码" align="left" width="100px">
            <template slot-scope="scope">
              <el-input v-if="scope.row.editOrSave" type="type" v-model="scope.row.parentCode" placeholder="请输入"></el-input>
              <span v-else>{{scope.row.parentCode}}</span>
            </template>
          </v-table-column>
          <v-table-column prop="execSql" label="执行sql" align="left">
            <template slot-scope="scope">
              <el-input v-if="scope.row.editOrSave" type="type" v-model="scope.row.execSql" placeholder="请输入"></el-input>
              <span v-else>{{scope.row.execSql}}</span>
            </template>
          </v-table-column>
          <v-table-column prop="params" label="执行参数" align="left">
            <template slot-scope="scope">
              <el-input v-if="scope.row.editOrSave" type="type" v-model="scope.row.params" placeholder="请输入"></el-input>
              <span v-else>{{scope.row.params}}</span>
            </template>
          </v-table-column>
          <v-table-column prop="executable" label="是否可执行" align="center" width="80px">
            <template slot-scope="scope">
              <el-switch
                :disabled="!scope.row.editOrSave"
                v-model="scope.row.executable"
                active-color="#409EFF"
                inactive-color="#EEE"
                active-value="1"
                inactive-value="0"
                active-text="是"
                inactive-text="否"
              ></el-switch>
            </template>
          </v-table-column>
          <v-table-column prop="visible" label="是否可见" align="center" width="80px">
            <template slot-scope="scope">
              <el-switch
                :disabled="!scope.row.editOrSave"
                v-model="scope.row.visible"
                active-color="#409EFF"
                inactive-color="#EEE"
                active-value="1"
                inactive-value="0"
                active-text="是"
                inactive-text="否"
              ></el-switch>
            </template>
          </v-table-column>
          <v-table-column prop="dictLink" label="操作" align="center" width="80px">
            <template slot-scope="scope">
              <el-button v-if="!scope.row.editOrSave" @click.native.prevent="enableOrDisable(scope.row,scope.$index)" :style="{ color: scope.row.statusDict == 1 ? '#EC0000': '#00AB44' }" type="text" size="mini">{{+scope.row.statusDict ? '禁用' : '启用' }}</el-button>
              <el-button v-if="scope.row.editOrSave" @click.native.prevent="cancelTable(scope.row,scope.$index)" style="color:#909399" type="text" size="mini">取消</el-button>
              <el-button v-if="scope.row.editOrSave" @click.native.prevent="saveTable(scope.row,scope.$index)" type="text" size="mini">保存</el-button>
              <el-button v-if="!scope.row.editOrSave" @click.native.prevent="editTable(scope.row,scope.$index)" style="color:#E6A23C" type="text" size="mini">修改</el-button>
              <el-button v-if="scope.row.visible==1" @click.native.prevent="rehearsalTable(scope.row,scope.$index)" style="color:#67C23A" type="text" size="mini">预演</el-button>
            </template>
          </v-table-column>
        </el-table>
      </el-main>
      <!-- 分页 -->
      <el-footer>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryData.pageNum"
          :total="totolCount"
          :page-sizes="[10, 15, 20, 25, 30]"
          :page-size="queryData.pageSize"
          :hide-on-single-page="false"
          layout="total, sizes, prev, pager, next"
          class="pagination"
          background
        ></el-pagination>
      </el-footer>
    </el-container>

    <el-dialog title="预演" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <div class="elDialogCss" v-for="item in rehearsalData" :key="item.name">
        <p class="lineP">
          <span class="name">{{item.name}}</span>：
          <span class="value">
            <el-input type="text" v-model="item.value" placeholder="请输入"></el-input>
          </span>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  datasources_listPage, // 分页查询数据源列表
  datasources_saveOrUpdate, // 新增或修改数据源
  datasources_delete, // 删除数据源，如果作为父层级被引用，需要先清除引用关系再删除
  datasources_dryRun, // 数据源预演
  datasources_getByCode, // 根据编码获取数单个数据源
  datasources_enable, // 启用
  datasources_disable // 禁用
} from '@/api/configuration'
import _ from 'lodash'
export default {
  name: 'DataSourceConfig',
  components: {},
  props: {},
  data() {
    return {
      loading: false, // 表格的loding
      dialogVisible: false, // 预演弹框
      queryData: {
        statusDict: '',
        pageNum: 1, // 页码必传
        pageSize: 15, // 一页数量，必传
        searchKey: '' // 搜索关键字，非必传
      },
      totolCount: 0, // 分页总量
      tableData: [], // 表格数据
      oldTableData: [], // 存储数据表格数据
      rehearsalData: [] // 预演数据
    }
  },
  watch: {},
  computed: {},
  beforeCreated() {},
  created() {
    // 截流
    this.debounceFC = _.debounce(() => {
      this.queryData.pageNum = 1 // 输入的时候需要改为第一页
      this.init() // 输入框截流
    }, 800)
    this.init() // 初始化
  },
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  update() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    /**
     * 初始化
     */
    init() {
      this.queryData.pageNum = 1
      this.queryTableFc()
    },
    /**
     * 列表请求
     */
    queryTableFc() {
      this.tableData = []
      datasources_listPage(this.queryData).then(res => {
        this.totolCount = res.data.totolCount
        res.data.result.map(item => {
          item.editOrSave = false
        })
        this.tableData = res.data.result
        this.oldTableData = JSON.parse(JSON.stringify(res.data.result))
      })
    },
    /**
     * 翻页 一页总条数
     */
    handleSizeChange(num) {
      this.queryData.pageNum = 1
      this.queryData.pageSize = num
      this.queryTableFc()
    },
    /**
     * 翻页
     */
    handleCurrentChange(num) {
      this.queryData.pageNum = num
      this.queryTableFc()
    },
    /**
     * 新增
     */
    addTableRow() {
      if (!this.testing()) {
        // 检测是否可以修改
        return
      }
      if (
        this.tableData[0] &&
        this.tableData[0].sourceCode == '' &&
        this.tableData[0].sourceName == '' &&
        this.tableData[0].execSql == ''
      ) {
        this.$message.warning('请先保存！')
        return
      }

      this.tableData.unshift({
        addFlag: true, // 代表是新增
        sourceCode: '', // 数据源编码
        sourceName: '', // 数据源名称
        params: null, // 参数JSON串，可为空
        parentCode: '', // 父层元数据编码
        execSql: '', // 可执行时是独立SQL加参数占位符，不可执行时是查询字段；
        executable: '0', // 0：不可执行；1：可执行
        visible: '0', // 0：不可见（父层编码的）；1：可见（一般是能直接查询或者优化层级后的带父层编码的）
        data: null,
        paramsMap: null,
        editOrSave: true // 保存|修改
      })
    },
    /**
     * 删除
     */
    deleteTable(row, rowIndex) {
      if (!this.testing()) {
        // 检测是否可以修改
        return
      }
      if (row.sourceName == '') {
        this.tableData.splice(rowIndex, 1)
        return
      }
      this.$confirm('您确定要删除吗？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(res => {
          datasources_delete({ sourceCode: row.sourceCode }).then(res => {
            this.tableData.splice(rowIndex, 1)
            this.$message.success(`删除＂${row.sourceName}＂成功！`)
          })
        })
        .catch(res => {
          this.$message.success('已取消！')
        })
    },
    /**
     * 取消
     */
    cancelTable(row, rowIndex) {
      if (row.addFlag) {
        // 新增
        this.tableData.splice(0, 1)
        this.$message.success('已删除！')
        return
      } else {
        // 修改
        row.editOrSave = false
        this.$set(
          this.tableData,
          rowIndex,
          JSON.parse(JSON.stringify(this.oldTableData[rowIndex]))
        )
        this.$message.success('已取消！')
      }
    },
    /**
     * 保存
     */
    saveTable(row, rowIndex) {
      if (row.sourceCode == '') {
        this.$message.error('请填写＂数据源编码＂！')
        return
      }
      if (row.sourceName == '') {
        this.$message.error('请填写＂数据源名称＂！')
        return
      }
      if (row.execSql == '') {
        this.$message.error('请填写＂执行SQL＂！')
        return
      }
      // 执行参数校验
      if (row.params != '') {
        try {
          const paramsArray = JSON.parse(row.params)
          for (const i in paramsArray) {
            if (row.execSql.indexOf(`#{${i}}`) === -1) {
              this.$message.error('＂执行参数＂填写错误！')
              return
            }
          }
        } catch {
          this.$message.error('＂执行参数＂填写错误！')
          return
        }
      } else {
        row.params = null
      }
      if (row.parentCode == '') {
        row.parentCode = null
      }
      datasources_saveOrUpdate(row).then(res => {
        this.$message.success(row.addFlag ? '保存成功！' : '修改成功！')
        row.editOrSave = false
        this.init()
      })
    },
    /**
     * 修改
     */
    editTable(row, rowIndex) {
      if (!this.testing()) {
        // 检测是否可以修改
        return
      }
      row.editOrSave = true
    },
    /**
     * 预演
     */
    async rehearsalTable(row, rowIndex) {
      if (!this.testing()) {
        // 检测是否可以修改
        return
      }
      this.sourceCode = row.sourceCode
      if (row.editOrSave) {
        // 修改或者新增的时候跳出程序
        this.$message.warning('请先保存！')
        return
      }
      // 父元素本来就有执行参数.或者自己能执行
      let paramsArray = row.params !== null ? JSON.parse(row.params) : ''
      this.rehearsalData = []
      // 子元素. 需要找父元素的执行参数,才能预演
      if (row.executable == '0' && row.visible == '1') {
        await datasources_getByCode({ sourceCode: this.sourceCode }).then(
          res => {
            paramsArray =
              res.data.params !== '' ? JSON.parse(res.data.params) : ''
          }
        )
      }
      // 判断是否有执行参数.如果没有直接请求后台验证
      if (paramsArray != '') {
        for (const i in paramsArray) {
          this.rehearsalData.push({ name: i, value: paramsArray[i] })
        }
        this.dialogVisible = true
        return
      }
      this.datasources_dryRunFc(this.sourceCode, {}) // 预演接口
    },
    /**
     * 预演关闭
     */
    handleClose(done) {
      // done()
      this.dialogVisible = false
    },
    /**
     * 预演保存
     */
    handleSave() {
      // list 转为 对象
      const paramsMap = {}
      this.rehearsalData.map((item, index) => {
        paramsMap[item.name] = item.value
      })
      // 校验是否为空,和转换值
      for (let i = 0; i < this.rehearsalData.length; i++) {
        const data = this.rehearsalData[i]
        if (data.value == '' || data.value == null) {
          this.$message.error(`请先填写${data.name}！`)
          return
        }
        paramsMap[data.name] = data.value
      }
      this.datasources_dryRunFc(this.sourceCode, paramsMap)
    },
    /**
     * 预演请求方法
     */
    datasources_dryRunFc(sourceCode, paramsMap) {
      const data = {
        sourceCode: sourceCode
      }
      if (JSON.stringify(paramsMap) != '{}') {
        data.paramsMap = paramsMap
      }
      // 预演值的请求接口
      datasources_dryRun(data).then(res => {
        this.handleClose()
        this.$message.success(res.message)
      })
    },
    /**
     * 检测
     */
    testing() {
      for (let i = 0; this.tableData.length > i; i++) {
        if (this.tableData[i].editOrSave) {
          if (this.tableData[i].sourceName == '') {
            this.$message.error(`请先保存第一条！`)
            return false
          }
          this.$message.error(
            `请先保存＂${this.tableData[i].sourceName}＂这条数据！`
          )
          return false
        }
      }
      return true
    },
    /**
     * 启用禁用
     */
    enableOrDisable(row) {
      const queryUrl = row.statusDict == '1' ? datasources_disable : datasources_enable // 启用禁用的请求切换
      queryUrl({
        sourceCode: row.sourceCode
      }).then(res => {
        this.$message({
          type: 'success',
          message: +row.statusDict ? '已禁用' : '已启用'
        })
        this.init()
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.dataSourceConfig {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-top: 20px;
  background: #fff;
  ::v-deep.el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .inputclass {
    ::v-deep .el-input > .el-input__inner {
      border: none;
      background: #f3f5f9;
      border-radius: 2px;
    }
    ::v-deep .el-button {
      margin-left: 10px;
    }
  }
  ::v-deep.el-switch {
    .el-switch__core {
      width: 45px !important;
    }
    .el-switch__label {
      position: absolute;
      span {
        font-size: 13px !important;
      }
    }
    .el-switch__label.is-active {
      z-index: 2;
    }
    .el-switch__label--left {
      margin-right: 0;
      left: 27px;
      color: #303133 !important;
    }
    .el-switch__label--right {
      margin-left: 0;
      left: 5px;
      color: #fff !important;
    }
  }

  .redCss {
    color: #f52c2c;
  }
  .pagination {
    float: right;
    margin-top: 15px;
    margin-right: -15px;
  }
  .elDialogCss {
    .lineP {
      display: flex;
      align-items: center;
      .name {
        flex: 3;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .value {
        flex: 6.5;
      }
    }
  }
}
</style>
