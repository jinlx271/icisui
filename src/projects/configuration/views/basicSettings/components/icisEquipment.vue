<!-- 设备管理 -->
<template>
  <el-container class="guardianshipItem">
    <!-- 头部 -->
    <el-header class="heightAuto">
      <div class="headerLeft">
        <el-form ref="addRoleFrom" :inline="true" :model="queryData" label-width="100px" status-icon class="flex align-items-center">
          <el-form-item>
            <!-- input输入 -->
            <el-input size="small" placeholder="设备编码/名称" clearable suffix-icon="el-icon-search" v-model="queryData.searchKey" @input="debounceSearch"
                      @keyup.enter.native="getDeviceList(1)"></el-input>
          </el-form-item>
          <el-form-item label="设备类型">
            <!-- 监护数据显示分组selete选择 -->
            <el-select v-model="queryData.deviceTypeDict" placeholder="请选择" clearable @change="debounceSearch">
              <el-option v-for="item in typeInfo.list" :key="item.dictCode" :label="item.dictName" :value="item.dictCode"
                         :disabled="item.statusDict == '0'"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="病区">
            <!-- 监护数据显示分组selete选择 -->
            <el-select v-model="queryData.wardCode" placeholder="请选择" clearable @change="debounceSearch">
              <el-option v-for="item in wardList" :key="item.wardCode" :label="item.wardName" :value="item.wardCode"
                         :disabled="item.statusDict == '0'"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="1px">
            <el-checkbox v-model="queryData.statusDict" true-label="" false-label="1" @change="debounceSearch" >
              显示禁用
            </el-checkbox>
          </el-form-item>
        </el-form>
      </div>
      <div style="align-items: flex-start">
        <el-button class="queryButton" type="primary" @click.native.prevent="getDeviceList(1)">查询</el-button>
        <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']" class="queryButton" type="primary" @click.native.prevent="addDictItem">
          新增</el-button>
      </div>
    </el-header>
    <!-- 中间 -->
    <el-main style="height:calc(100% - 42px)" v-loading="loading">
      <el-table :row-class-name="({row}) => row.statusDict == 0 ? 'disabled' : ''" @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" height="100%"
                :data="tableData" style="width: 100%;" highlight-current-row border :key="tableKey" ref="table">
        <v-table-column prop="deviceCode" label="设备编码">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isCreate" v-model="scope.row.deviceCode" placeholder="请输入" clearable filterable> </el-input>
            <span v-else>{{scope.row.deviceCode}}</span>
          </template>
        </v-table-column>
        <v-table-column prop="deviceModel" label="型号">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit" v-model="scope.row.deviceModel" placeholder="请输入" clearable filterable> </el-input>
            <span v-else>{{scope.row.deviceModel}}</span>
          </template>
        </v-table-column>
        <v-table-column prop="deviceName" label="设备名称">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit" v-model="scope.row.deviceName" placeholder="请输入" clearable filterable :disabled="!scope.row.isEdit"> </el-input>
            <span v-else>{{scope.row.deviceName}}</span>
          </template>
        </v-table-column>
        <v-table-column prop="deviceTypeDict" label="设备分类">
          <template slot-scope="scope">
            <el-select v-if="scope.row.isEdit" v-model="scope.row.deviceTypeDict" placeholder="请选择" filterable :disabled="!scope.row.isEdit">
              <el-option v-for="(option) in typeInfo.list" :key="option.dictCode" :label="option.dictName" :value="option.dictCode"
                         :disabled="option.statusDict == '0'"></el-option>
            </el-select>
            <span v-else>{{typeInfo.list.filter(item=>item.dictCode==scope.row.deviceTypeDict)[0].dictName}}</span>
          </template>
        </v-table-column>
        <v-table-column prop="deviceLinkMode" label="连接模式">
          <template slot-scope="scope">
            <el-select v-if="scope.row.isEdit" v-model="scope.row.deviceLinkMode" placeholder="请选择" filterable :disabled="!scope.row.isEdit">
              <el-option v-for="(option) in modeInfo.list" :key="option.dictCode" :label="option.dictName" :value="option.dictCode"
                         :disabled="option.statusDict == '0'"></el-option>
            </el-select>
            <span
                  v-else>{{scope.row.deviceLinkMode === null ? '' : modeInfo.list.filter(item=>item.dictCode==scope.row.deviceLinkMode)[0].dictName}}</span>
          </template>
        </v-table-column>
        <v-table-column label="所在病区" prop="wardCode">
          <template slot-scope="scope">
            <el-select v-if="scope.row.isEdit" v-model="scope.row.wardCode" filterable placeholder="请选择" :disabled="!scope.row.isEdit"
                       @change='selectWard($event,scope.row)'>
              <el-option v-for="(option) in wardList" :key="option.wardCode" :label="option.wardName" :value="option.wardCode"></el-option>
            </el-select>
            <span v-else>{{scope.row.wardName}}</span>
          </template>
        </v-table-column>
        <v-table-column prop="manufacturer" label="厂商/品牌">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit" v-model="scope.row.manufacturer" placeholder="请输入" clearable :disabled="!scope.row.isEdit"> </el-input>
            <span v-else>{{scope.row.manufacturer}}</span>
          </template>
        </v-table-column>
        <v-table-column prop="manufacturer" label="规定使用时数（天）">
          <template slot-scope="scope">
            <el-input type="number" v-if="scope.row.isEdit" v-model="scope.row.userHours" placeholder="请输入" clearable :disabled="!scope.row.isEdit"> </el-input>
            <span v-else>{{scope.row.userHours}}</span>
          </template>
        </v-table-column>
        <v-table-column prop="manufacturer" label="规定使用次数（天）">
          <template slot-scope="scope">
            <el-input type="number" v-if="scope.row.isEdit" v-model="scope.row.userCount" placeholder="请输入" clearable :disabled="!scope.row.isEdit"> </el-input>
            <span v-else>{{scope.row.userCount}}</span>
          </template>
        </v-table-column>
        <v-table-column prop="manufacturer" label="闲置状态">
          <template slot-scope="scope">
            <el-switch v-if="scope.row.isEdit" v-model="scope.row.emptyStatus" active-value="1" inactive-value="0" active-text="是"
                       inactive-text="否"></el-switch>
            <span v-else>{{+scope.row.emptyStatus ? '是' : '否' }}</span>
          </template>
        </v-table-column>
        <v-table-column prop="manufacturer" label="借出状态">
          <template slot-scope="scope">
            <el-switch v-if="scope.row.isEdit" v-model="scope.row.lendStatus" active-value="1" inactive-value="0" active-text="是"
                       inactive-text="否"></el-switch>
            <span v-else>{{+scope.row.lendStatus ?  '是' : '否'  }}</span>
          </template>
        </v-table-column>
        <v-table-column prop="statusDict" label="状态" min-width="180px" align="center">
          <template slot-scope="scope">
            <el-switch v-if="scope.row.isEdit" v-model="scope.row.statusDict" active-value="1" inactive-value="0" active-text="已启用"
                       inactive-text="已禁用"></el-switch>
            <span v-else>{{+scope.row.statusDict ? '已启用' : '已禁用' }}</span>
          </template>
        </v-table-column>
        <v-table-column label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']" type="text" @click="modifyRow(scope.row, scope.$index)"
                       v-if="!scope.row.isEdit">
              修改</el-button>
            <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']" type="text" v-if="scope.row.isEdit===true"
                       @click="cancelItemRow(scope.$index,scope.row)">取消</el-button>
            <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']" type="text" v-if="scope.row.isEdit===true" :loading="saveLoading"
                       @click="saveItemRow(scope.$index,scope.row)">保存</el-button>
            <!-- <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']" @click.native.prevent="deleteRow(scope.$index, scope.row)"
                       type="text" size="small">删除</el-button> -->
          </template>
        </v-table-column>
      </el-table>

    </el-main>
    <el-footer>
      <el-pagination @size-change="changePagination" @current-change="changePagination" :current-page="queryTable.pageNum"
                     :page-size="queryTable.pageSize" background layout="total, prev, pager, next"
                     style="float:right;margin-top:15px;margin-right:-30px" :total="totolCount"></el-pagination>
    </el-footer>
  </el-container>

</template>

<script>
import {
  // device_deleteById,
  device_edit,
  device_findAllWithPage,
  device_insert,
  icuWard_findWithPage
} from '@/api/configuration'
import { debounce } from 'lodash'
import {
  mapGetters
} from 'vuex'
export default {
  name: 'GuardianshipItem',
  components: {},
  data: () => {
    return {
      loading: false,
      tableKey: '',
      queryTable: {
        pageNum: 1,
        pageSize: 10
      },
      totolCount: 0,
      statusDict: {
        code: 'ICIS_DICT_STATUS',
        list: []
      },
      // 分类数据
      typeInfo: {
        code: 'ICIS_DICT_DEVICE_TYPE',
        list: []
      },
      modeInfo: {
        code: 'ICIS_DICT_DEVICE_LINK_MODE',
        list: []
      },
      // 病区数据
      wardList: [],
      queryData: {
        statusDict: '',
        searchKey: '', // input输入
        wardCode: '',
        deviceTypeDict: '' //
      }, // 请求入参
      tableData: [

      ],
      // 弹框新增药品
      formInfo: {
        deviceModel: '',
        wardCode: '',
        wardName: '',
        manufacturer: '',
        deviceName: '',
        deviceTypeDict: '',
        statusDict: '',
        emptyStatus: '0',
        lendStatus: '0'
      },
      // 弹框标题
      dialogTitle: '',
      // 新增还是修改
      addOrModify: '',
      // 弹框显示标志
      dialogShow: false,
      // 校验规则
      rules: {

        deviceName: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        deviceModel: [
          { required: true, message: '请输入设备编码/型号', trigger: 'blur' }
        ],
        deviceTypeDict: [
          { required: true, message: '请选择设备分类', trigger: 'blur' }
        ]
      },
      currItem: null,
      saveLoading: false
    }
  },
  props: {},
  watch: {},
  computed: {
    ...mapGetters(['userInfo', 'currentUserWard'])
  },
  created() { },
  mounted() {
    this.init()
  },
  methods: {
    /* 页面初始化 */
    async init() {
      this.loading = true
      this.statusDict.list = await this.$getDictItemList(this.statusDict.code)
      this.typeInfo.list = await this.$getDictItemList(this.typeInfo.code)
      this.modeInfo.list = await this.$getDictItemList(this.modeInfo.code)
      this.queryData.wardCode = this.currentUserWard.wardCode
      this.getWardData()
    },
    // 获取病区数据
    getWardData() {
      const query = {
        pageSize: 1000,
        pageNum: 1,
        userName: this.userInfo.userName == 'admin' ? '' : this.userInfo.userName
      }
      icuWard_findWithPage(query).then(res => {
        if (res.code == 0) {
          this.wardList = res.data.result
          this.getDeviceList(1)
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
    selectWard(e, row) {
      if (e) {
        row.wardName = this.wardList.filter(item => item.wardCode == e)[0].wardName
      }
    },
    debounceSearch() {
      this.debounceSearchSymbol = this.debounceSearchSymbol ? this.debounceSearchSymbol : debounce(function () {
        this.getDeviceList(1)
      }, 200)
      this.debounceSearchSymbol()
    },
    // 获取设备信息列表
    getDeviceList(pageNum) {
      this.loading = true
      if (pageNum) {
        this.queryTable.pageNum = pageNum
      }
      const query = {
        statusDict: this.queryData.statusDict,
        pageSize: this.queryTable.pageSize,
        pageNum: this.queryTable.pageNum,
        searchKey: this.queryData.searchKey || '',
        deviceTypeDict: this.queryData.deviceTypeDict || '',
        wardCode: this.queryData.wardCode || ''
      }
      device_findAllWithPage(query).then(res => {
        this.loading = false
        this.addOrModify = ''
        if (res.code == 0) {
          this.tableData = res.data.result.map(item => {
            item.isEdit = false
            return item
          })
          this.totolCount = res.data.totolCount
          this.$refs.table.doLayout()
        }
      })
    },

    // 保存编辑行数据
    saveItemRow(index, row) {
      if (row.deviceCode === '') {
        this.$message({
          type: 'error',
          message: '设备编码不能为空'
        })
        return
      } else if (row.deviceCode.length > 64) {
        this.$message({
          type: 'error',
          message: '请输入少于64个字的设备编码'
        })
        return
      } else if (row.deviceModel === '') {
        this.$message({
          type: 'error',
          message: '设备型号不能为空'
        })
        return
      } else if (row.deviceModel.length > 64) {
        this.$message({
          type: 'error',
          message: '请输入少于64个字的设备型号'
        })
        return
      } else if (row.deviceName === '') {
        this.$message({
          type: 'error',
          message: '设备名称不能为空'
        })
        return
      } else if (row.deviceName.length > 64) {
        this.$message({
          type: 'error',
          message: '请输入少于64个字的设备名称'
        })
        return
      } else if (row.manufacturer.length > 64) {
        this.$message({
          type: 'error',
          message: '请输入少于64个字的厂商/品牌'
        })
        return
      }
      this.saveLoading = true
      if (this.addOrModify == 'modify') { // 修改
        device_edit(row).then(res => {
          this.saveLoading = false
          if (res.code == 0) {
            row.isEdit = false
            this.tableData = [...this.tableData]
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.addOrModify = ''
            this.$refs.table.doLayout()
          }
        })
      } else {
        device_insert(row).then(res => {
          this.saveLoading = false
          if (res.code == 0) {
            row.isEdit = false
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.addOrModify = ''
            // 为了获取到最新的设备编号（后台生成 ）需要刷新列表
            this.getDeviceList(1)
          }
        })
      }
    },
    // 修改设备
    modifyRow(row, index) {
      if (this.addOrModify == '') {
        this.currItem = { ...row }
        row.isEdit = true
        this.addOrModify = 'modify'
        this.tableData = [...this.tableData]
        this.$refs.table.doLayout()
      } else {
        this.$message({
          type: 'info',
          message: '请完成当前编辑'
        })
      }
    },

    // 翻页
    changePagination(pageNum) {
      this.getDeviceList(pageNum)
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
        const row = {
          isCreate: true,
          isEdit: true,
          statusDict: '1',
          deviceCode: '',
          deviceModel: '',
          deviceName: '',
          manufacturer: '',
          emptyStatus: '0',
          lendStatus: '0',
          userHours: '', // 规定使用时数（天）
          userCount: '' // 规定使用次数（天）
        }
        this.addOrModify = 'add'
        this.tableData.unshift(row)
        this.$refs.table.doLayout()
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
      this.$refs.table.doLayout()
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法

.guardianshipItem {
  background: #fff;
  height: 100%;
  ::v-deep .el-main {
    overflow: hidden;
  }
}
::v-deep .el-table thead > tr > th > .cell {
  padding-left: 6px;
  padding-right: 6px;
}
::v-deep .el-table tbody > tr > td > .cell {
  padding-left: 6px;
  padding-right: 6px;
}
::v-deep .el-table {
  height: 100%;
}
</style>
