<!-- 导管字典 -->
<template>
  <el-container class="catheterItem">
    <!-- 头部 -->
    <el-header class="heightAuto w100 flex align-items-center flex-between">
        <div>
          <el-form ref="addRoleFrom" :inline="true" :model="queryData" label-width="80px" status-icon class="flex align-items-center">
            <el-form-item >
              <!-- input输入 -->
              <el-input v-hasPermi="['configuration:basicSettings:basedateConfig']" size="small" placeholder="导管名称/导管编码" clearable suffix-icon="el-icon-search" v-model="queryData.searchKey" @input="debounceSearch" @keyup.enter.native="getCatheterList(1)"></el-input>
            </el-form-item>
            <el-form-item class="flex-1 my_white-space_nowrap" label="导管分类">
              <!-- 监护数据显示分组selete选择 -->
              <el-select v-model="queryData.catheterTypeDict" placeholder="请选择" clearable @change="debounceSearch"
                filterable
                >
                <el-option v-for="item in typeInfo.list" :key="item.dictCode" :label="item.dictName" :value="item.dictCode" :disabled="item.statusDict=='0'"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="flex-1 my_white-space_nowrap" label="导管分组" >
              <!-- 监护数据显示分组selete选择 -->
              <el-select v-model="queryData.catheterGroupDict" placeholder="请选择" filterable clearable @change="debounceSearch" filter>
                <el-option v-for="item in catheterGroupList" :key="item.dictCode" :label="item.dictName" :value="item.dictCode" :disabled="item.statusDict=='0'"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="flex-1 my_white-space_nowrap" label="风险程度" prop="roleType">
              <!-- 功能模块selete选择 -->
              <el-select v-model="queryData.catheterRiskLevelDict" filterable placeholder="请选择" clearable @change="debounceSearch" filter>
                <el-option v-for="item in levelInfo.list" :key="item.dictCode" :label="item.dictName" :value="item.dictCode" :disabled="item.statusDict=='0'"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label-width="1px" >
              <el-checkbox v-model="queryData.statusDict" true-label="" false-label="1" @change="debounceSearch" >
                显示禁用
              </el-checkbox>
            </el-form-item>
          </el-form>
        </div>
        <div style="align-items: flex-start">
          <el-button type="primary" @click.native.prevent="getCatheterList(1)">查询</el-button>
          <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']"  type="primary" @click.native.prevent="addDictItem">新增</el-button>
        </div>

    </el-header>
    <!-- 中间 -->
    <el-main v-loading="loading" class="right_body" style="height:calc(100% - 120px)">
      <el-table :row-class-name="({row}) => row.statusDict == 0 ? 'disabled' : ''" @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)"  height="100%" :data="tableData" border fit highlight-current-row style="width: 100%;" ref="cathertable">
        <v-table-column prop="catheterCode" label="导管编码">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit"  v-model="scope.row.catheterCode" placeholder="请输入" clearable filterable :disabled="!scope.row.isEdit||addOrModify=='modify'"> </el-input>
            <span v-else>{{scope.row.catheterCode}}</span>
          </template>
        </v-table-column>
        <v-table-column prop="catheterName" label="导管名称">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit"  v-model="scope.row.catheterName" placeholder="请输入" clearable filterable :disabled="!scope.row.isEdit" :maxlength="50"> </el-input>
            <span v-else>{{scope.row.catheterName}}</span>
          </template>
        </v-table-column>
        <v-table-column prop="catheterAbbr" label="导管简称">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit"  v-model="scope.row.catheterAbbr" placeholder="请输入" clearable filterable :disabled="!scope.row.isEdit" :maxlength="20"> </el-input>
            <span v-else>{{scope.row.catheterAbbr}}</span>
          </template>
        </v-table-column>
        <v-table-column prop="catheterDesc" label="说明">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit"  v-model="scope.row.catheterDesc" placeholder="请输入" clearable filterable :disabled="!scope.row.isEdit" :maxlength="200"> </el-input>
            <span v-else>{{scope.row.catheterDesc}}</span>
          </template>
        </v-table-column>
        <v-table-column prop="catheterTypeDict" label="导管分类">
          <template slot-scope="scope">
            <el-select v-if="scope.row.isEdit"  v-model="scope.row.catheterTypeDict" placeholder="请选择" filterable :disabled="!scope.row.isEdit" >
              <el-option v-for="(option) in typeInfo.list" :key="option.catheterTypeDict" :label="option.dictName" :value="option.dictCode" :disabled="option.statusDict=='0'"></el-option>
            </el-select>
            <span v-else>{{ filterArrValue (scope.row.catheterTypeDict,typeInfo.list,'dictCode','dictName')}}</span>
          </template>
        </v-table-column>
        <v-table-column prop="catheterGroupDict" label="导管分组">
          <template slot-scope="scope">
            <el-select v-if="scope.row.isEdit"  v-model="scope.row.catheterGroupDict" placeholder="请选择" filterable :disabled="!scope.row.isEdit" >
              <el-option v-for="(option) in catheterGroupList" :key="option.catheterGroupDict" :label="option.dictName" :value="option.dictCode" :disabled="option.statusDict=='0'"></el-option>
            </el-select>
            <span v-else>{{ filterArrValue(scope.row.catheterGroupDict,catheterGroupList,'dictCode','dictName')}}</span>
          </template>
        </v-table-column>
        <v-table-column prop="catheterRiskLevelDict" label="导管风险程度">
          <template slot-scope="scope">
            <el-select v-if="scope.row.isEdit"  v-model="scope.row.catheterRiskLevelDict" placeholder="请选择" filterable :disabled="!scope.row.isEdit" >
              <el-option v-for="(option) in levelInfo.list" :key="option.catheterRiskLevelDict" :label="option.dictName" :value="option.dictCode" :disabled="option.statusDict=='0'"></el-option>
            </el-select>
            <span v-else>{{ filterArrValue(scope.row.catheterRiskLevelDict,levelInfo.list,'dictCode','dictName')}}</span>
          </template>
        </v-table-column>
        <v-table-column prop="catheterDeadLine" label="置管期限（天）">
          <template slot-scope="scope">
            <el-input-number v-if="scope.row.isEdit"  v-hasPermi="['configuration:basicSettings:basedateConfig']" size="small" placeholder="置管期限" clearable suffix-icon="el-icon-search" v-model="scope.row.catheterDeadLine"  :min="1" :precision="0" :step="1"></el-input-number>
            <span v-else>{{ scope.row.catheterDeadLine}}</span>
          </template>
        </v-table-column>

        <v-table-column prop="statusDict" label="状态" min-width="180px" align="center">
           <template slot-scope="scope">
             <el-switch v-if="scope.row.isEdit" v-model="scope.row.statusDict" active-value="1" inactive-value="0" active-text="已启用"
                       inactive-text="已禁用" @change="validateStatus"></el-switch>
            <span v-else>{{+scope.row.statusDict ? '已启用' : '已禁用' }}</span>
          </template>
        </v-table-column>
        <v-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']" type="text" @click="modifyRow(scope.row, scope.$index)" v-if="!scope.row.isEdit" >修改</el-button>
            <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']" type="text" v-if="scope.row.isEdit===true" @click="cancelItemRow(scope.$index,scope.row)">取消</el-button>
            <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']" type="text" v-if="scope.row.isEdit===true" @click="saveItemRow(scope.$index,scope.row)">保存</el-button>
            <!-- <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']" @click.native.prevent="deleteRow(scope.$index, scope.row)" type="text" size="small">删除</el-button> -->
          </template>
        </v-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-pagination
        @size-change="changePagination"
        @current-change="changePagination"
        :current-page="queryTable.pageNum"
        :page-size="queryTable.pageSize"
        background
        layout="total, prev, pager, next"
        style="float:right;margin-top:15px;margin-right:-30px"
        :total="totolCount"
      ></el-pagination>
    </el-footer>
  </el-container>
</template>

<script>
import {
  // catheter_deleteById,
  catheter_edit,
  catheter_findWithPage,
  catheter_insert
} from '@/api/configuration'
import { filterArrValue } from '@/utils/utils'
// import { frontFilter } from '@/utils/index'
import { debounce } from 'lodash'
export default {
  name: 'CatheterItem',
  components: {},
  data: function() {
    return {
      currItem: null,
      loading: false,
      isFooter: true, // 导航栏
      totolCount: 0, // 翻页总条数
      queryTable: {
        pageNum: 1,
        pageSize: 10
      },
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
      },
      queryData: {
        statusDict: '',
        searchKey: '', // input输入
        catheterTypeDict: '', //
        catheterRiskLevelDict: '' // 功能模块
      }, // 请求入参
      tableData: [

      ],
      // 弹框新增药品
      formInfo: {
        catheterAbbr: '',
        catheterCode: '',
        catheterDesc: '',
        catheterName: '',
        catheterRiskLevelDict: '',
        catheterTypeDict: '',
        statusDict: '1',
        catheterDeadLine: undefined
      },
      // 弹框标题
      dialogTitle: '',
      // 新增还是修改
      addOrModify: '',
      // 弹框显示标志
      dialogShow: false,
      // 校验规则
      rules: {
        catheterName: [
          { required: true, message: '请输入导管名称', trigger: 'blur' }
        ],
        catheterCode: [
          { required: true, message: '请输入导管编码', trigger: 'blur' }
        ],
        catheterRiskLevelDict: [
          { required: true, message: '请选择风险程度', trigger: 'blur' }
        ],
        catheterTypeDict: [
          { required: true, message: '请选择导管分类', trigger: 'blur' }
        ]
      },
      catheterGroupList: []
    }
  },
  props: {},
  watch: {},
  computed: {},
  created() {

  },
  mounted() {
    this.init()
  },
  methods: {

    filterArrValue,
    /* 页面初始化 */
    async init() {
      this.catheterGroupList = await this.$getDictItemList('ICIS_DICT_CATHETER_GROUP')
      this.statusDict.list = await this.$getDictItemList(this.statusDict.code)
      this.levelInfo.list = await this.$getDictItemList(this.levelInfo.code)
      this.typeInfo.list = await this.$getDictItemList(this.typeInfo.code)
      this.getCatheterList(1)
    },
    // filterMethod(val) {
    //   this.typeInfo.list = frontFilter(val, this.allDeptList)
    // },
    debounceSearch() {
      this.debounceSearchSymbol = this.debounceSearchSymbol ? this.debounceSearchSymbol : debounce(function () {
        this.getCatheterList(1)
      }, 200)
      this.debounceSearchSymbol()
    },
    // 获取导管信息列表
    getCatheterList(pageNum) {
      this.loading = true
      if (pageNum) {
        this.queryTable.pageNum = pageNum
      }
      const query = {
        pageSize: this.queryTable.pageSize,
        pageNum: this.queryTable.pageNum,
        searchKey: this.queryData.searchKey || '',
        statusDict: this.queryData.statusDict,
        catheterTypeDict: this.queryData.catheterTypeDict || '',
        catheterGroupDict: this.queryData.catheterGroupDict || '',
        catheterRiskLevelDict: this.queryData.catheterRiskLevelDict || ''
      }

      catheter_findWithPage(query).then(res => {
        this.loading = false
        if (res.code == 0) {
          this.tableData = res.data.result.map(item => {
            item.isEdit = false
            return item
          })
          this.totolCount = res.data.totolCount
          this.$refs.cathertable.doLayout()
        }
      })
    },
    /** 禁用状态提醒 */
    validateStatus(e) {
      if (e == 0 || e == '0') {
        this.$message({
          type: 'error',
          message: '相关配置及个人相关数据也将被禁用！'
        })
      } else {
        this.$message.closeAll()
      }
    },
     // 保存编辑行数据
    saveItemRow(index, row) {
      if (row.catheterCode == '' || row.catheterName == '') {
        this.$message({
          type: 'info',
          message: '导管编码，导管名称为必填项'
        })
        return
      }
      if (this.addOrModify == 'modify') { // 修改
        catheter_edit(row).then(res => {
          if (res.code == 0) {
            row.isEdit = false
            this.tableData = [...this.tableData]
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.addOrModify = ''

            this.$refs.cathertable.doLayout()
          }
        })
      } else {
        catheter_insert(row).then(res => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: '新增成功'
            })
            delete row.isCreate
            row.isEdit = false
            this.addOrModify = ''
            this.totolCount = this.totolCount + 1
            this.$refs.cathertable.doLayout()
          }
        })
      }
    },
    // 修改设备
    modifyRow(row, index) {
      if (this.addOrModify == '') {
        if (!row.catheterDeadLine) {
          row.catheterDeadLine = undefined
        }
        this.currItem = { ...row }
        row.isEdit = true
        this.addOrModify = 'modify'
        this.tableData = [...this.tableData]
        this.$refs.cathertable.doLayout()
      } else {
        this.$message({
          type: 'info',
          message: '请完成当前编辑'
        })
      }
    },

    // 翻页
    changePagination(pageNum) {
       this.getCatheterList(pageNum)
    },
    // 新增监护字典
    addDictItem() {
      if (this.addOrModify == '') {
        if (this.tableData.length > 0) {
          const first = this.tableData[0]
          if (first.isCreate) {
            return
          }
        }
        let row = {
          isCreate: true,
          isEdit: true,
          statusDict: '1'
        }
        row = Object.assign(row, this.formInfo)
        this.addOrModify = 'add'
        this.tableData.unshift(row)
        this.$refs.cathertable.doLayout()
      } else {
        this.$message({
          type: 'info',
          message: '请完成当前编辑'
        })
      }
    },
    cancelItemRow(index, row) {
      row.isEdit = false
      if (this.addOrModify == 'add') {
        this.tableData.splice(index, 1)
      } else {
        this.tableData = [...this.tableData]
        this.tableData[index] = this.currItem
      }
      this.addOrModify = ''
      this.$refs.cathertable.doLayout()
      // this.getCatheterList()
    }
  }
}
</script>
<style lang="scss" scoped>
.el-table thead > tr > th > .cell {
  padding-left: 6px;
  padding-right: 6px;
}
.el-table tbody > tr > td > .cell {
  padding-left: 6px;
  padding-right: 6px;
}
.el-table {
  height: 100%;
}
.el-dialog .el-dialog__footer {
  text-align: right;
  line-height: 40px;
  padding: 0;
  .el-pagination {
    margin-top: 0.5%;
    text-align: right;
  }
  .el-button--small {
    padding: 9px 30px;
  }
}
</style>
<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法

.catheterItem {
  background: #fff;
  height: 100%;

}
.right_body{
  overflow: hidden;
}

</style>
