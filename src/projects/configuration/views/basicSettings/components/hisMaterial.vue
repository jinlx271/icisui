<!-- HIS基础数据-耗材 -->
<template>
  <div class="material">
    <el-container  class ='material' element-loading-text="加载中" v-loading="loading">
      <el-container class="material_right">
        <el-header>
          <div>
          <el-input class="elInput" size="small" :placeholder="XTCS0027=='1'?'编码/名称/国标码':'编码/名称'" suffix-icon="el-icon-search" clearable v-model="qeuryTableData.searchKey"
                    @keyup.enter.native="rightInputFC" @input="debounceSearch"></el-input>
          <el-checkbox v-model="qeuryTableData.statusDict" true-label="" false-label="1" @change="debounceSearch" >
                显示禁用
          </el-checkbox>
          </div>

          <div>
            <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']" class="queryButton" size="small" type="primary" @click="showAddMaterialItem">添加耗材</el-button>
          </div>
        </el-header>
        <el-main class="material_right_body" style="height:calc(100% - 102px)">
          <el-table :row-class-name="({row}) => row.statusDict == 0 ? 'disabled' : ''" @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" ref="table"  height="100%" :data="tableDataTwo" fit border highlight-current-row style="width: 100%;">
            <v-table-column prop="materialCode" label="耗材编码"></v-table-column>
            <v-table-column prop="materialName" label="耗材名称"></v-table-column>
            <v-table-column prop="gbCode" label="国标码" v-if="XTCS0027=='1'"></v-table-column>
            <v-table-column prop="statusDict" label="状态" align="center">
              <template slot-scope="scope">
                <el-switch v-if="scope.row.isEdit" v-model="scope.row.statusDict" active-value="1" inactive-value="0" active-text="已启用"
                           inactive-text="已禁用"></el-switch>
                <span v-else>{{+scope.row.statusDict ? '已启用' : '已禁用' }}</span>
              </template>
            </v-table-column>
            <v-table-column label="操作" width="220px" align="center">
              <template slot-scope="scope">
                <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']" @click.native.prevent="modifyRow(scope.$index, scope.row)" type="text" size="small">修改</el-button>
                <!-- <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']" @click.native.prevent="deleteRow(scope.$index, scope.row)" type="text" size="small">删除</el-button> -->
              </template>
            </v-table-column>
          </el-table>
        </el-main>
        <el-footer class="material_right_footer">
          <el-pagination
            @size-change="changePagination"
            @current-change="changePagination"
            :current-page="qeuryTableData.pageNum"
            :hide-on-single-page="false"
            :page-size="qeuryTableData.pageSize"
            background
            layout="total, prev, pager, next"
            style="float:right;margin-top:15px;margin-right:-30px"
            :total="totolCount"
          ></el-pagination>
        </el-footer>
      </el-container>
      <!-- 添加/编辑耗材 -->
      <el-dialog :title="materialItemDialogTitle" :visible.sync="addMaterialItemShow" :before-close="addMaterialItemClose" width="420px"
        :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form ref="form" :model="materialItemForm" label-width="80px" :rules="rules">
            <el-form-item label="名称" prop="materialName">
              <el-input v-model="materialItemForm.materialName" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="编码" prop="materialCode">
              <el-input v-model="materialItemForm.materialCode" placeholder="请输入" :disabled="addOrModifyMaterialItem =='modify'"></el-input>
            </el-form-item>
            <el-form-item v-if="addOrModifyMaterialItem =='add'&&XTCS0027=='1'" label="国标码" prop="gbCode">
              <el-input v-model="materialItemForm.gbCode" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-radio-group v-model="materialItemForm.statusDict">
                <el-radio label="1" >启用</el-radio>
                <el-radio label="0" >禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addMaterialItemClose">取消</el-button>
            <el-button type="primary" @click="confirmAddMaterialItem">保存</el-button>
          </span>
      </el-dialog>
    </el-container>
  </div>

</template>

<script>
import {
  material_deleteById,
  material_edit,
  material_findWithPage,
  material_insert
} from '@/api/configuration'
import { debounce } from 'lodash'
export default {
  name: 'Material',
  components: {},
  data: function() {
    return {
      // 表格的loding
      loading: false,
      // 表格查询
      qeuryTableData: {
        statusDict: '',
        searchKey: '',
        pageNum: 1,
        pageSize: 10

      },
      // 分页总量
      totolCount: 0,
      // 表格数据
      tableDataTwo: [],
      // 弹窗标题
      materialItemDialogTitle: '',
      // 是否显示弹窗
      addMaterialItemShow: false,
      // 耗材属性
      materialItemForm: {
        materialName: '',
        materialCode: '',
        gbCode: '',
        statusDict: '0'
      },
      // 弹窗标记
      addOrModifyMaterialItem: 'add',
      // 耗材校验规则
      rules: {
        materialName: [
          { required: true, message: '请输入耗材名称', trigger: 'blur' }
        ],
        materialCode: [
          { required: true, message: '请输入耗材编码', trigger: 'blur' }
        ]
      },
      XTCS0027: '0'
    }
  },
  props: {},
  watch: {},
  computed: {},
  async created() {
    const params = await this.$queryParam({ paramGroupCode: 'XTCS', paramCode: 'XTCS0027' })
    this.XTCS0027 = params[0]?.paramValue || '0'
    this.init()
  },
  mounted() {
    this.rightInputFC()
  },
  methods: {
    init() {

    },
    // 显示添加耗材弹窗
    showAddMaterialItem() {
      this.materialItemDialogTitle = '添加耗材'
      this.addMaterialItemShow = true
      this.addOrModifyMaterialItem = 'add'
    },
    // 关闭添加耗材弹窗
    addMaterialItemClose() {
      this.addMaterialItemShow = false
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.materialItemForm = {
        materialName: '',
        materialCode: '',
        gbCode: '',
        statusDict: '0'
      }
    },
    // 添加/修改耗材
    confirmAddMaterialItem() {
      const query = this.materialItemForm
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (query.materialId) {
            // 编辑
            material_edit(query).then(res => {
              this.addMaterialItemClose()
              if (res.code === 0) {
                this.getMaterialData()
                this.addMaterialItemClose()
              }
            })
          } else {
            // 添加
            material_insert(query).then(res => {
              this.addMaterialItemClose()
              if (res.code === 0) {
                this.getMaterialData(1)
                this.addMaterialItemClose()
              }
            })
          }
        }
      })
    },
    // 修改耗材
    modifyRow(index, row) {
      this.materialItemDialogTitle = '修改耗材'
      this.addMaterialItemShow = true
      this.addOrModifyMaterialItem = 'modify'
      this.materialItemForm = { ...row }
    },
    // 设置启用
    setStatusMaterial(index, row) {
      this.materialItemForm = row
      this.materialItemForm.statusDict = this.materialItemForm.statusDict ^ 1
      this.confirmAddMaterialItem()
    },
    // 删除耗材
    deleteRow(index, row) {
      this.$confirm('您确定要删除吗？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const query = row.materialId
        material_deleteById(query).then(res => {
          this.getMaterialData(1)
        })
      })
    },
    changePagination(pageNum) {
      this.getMaterialData(pageNum)
    },
    /**
     * 右边按钮事件
     */
    rightInputFC() {
      this.getMaterialData(1)
    },
    debounceSearch() {
      this.debounceSearchSymbol = this.debounceSearchSymbol ? this.debounceSearchSymbol : debounce(function () {
        this.getMaterialData(1)
      }, 200)
      this.debounceSearchSymbol()
    },
    getMaterialData(page) {
      if (page) {
        this.qeuryTableData.pageNum = page
      }
      this.loading = true
      material_findWithPage(this.qeuryTableData).then(res => {
        this.loading = false
        if (!(res.data && res.data.result)) {
          return
        }
        this.tableDataTwo = res.data.result // 列表数据
        this.totolCount = res.data.totolCount // 总条数
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/config-common.scss';

.material_right {
  height:100%;
  .el-header {
    margin-bottom:16px;
    // material_right_head 右侧搜索栏的input
    .el-input {
      width: 300px;
    }
  }
}
</style>
<style lang="scss" scoped>
.material{
  background: #ffffff;
  height: 100%;
  display: block;

}
.material {
  height: 100%;
  &_left {
    &_div {
      height: 100%;
    }
    &_main {
      .groupName{
        display:flex;
        align-items: center;
        .name{
          flex:1
        }
        .handler{
          width:68px;
          display:flex
        }
      }
      padding: 0;
      background: #f0f4ff;
      &_table {
        border: none;
        background: none;
        padding-top: 8px;
        &::before {
          background: transparent;
        }
        &::after {
          background: transparent;
        }
        ::v-deep tr {
          background: none;
          &.current-row {
            color: var(--maincolor);
            td {
              font-size: 14px;
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: var(--maincolor);
              background: none;
              .cell {
                background: #d9e3ff;
                border-radius: 3px;
              }
            }
          }
          &:hover {
            color: var(--maincolor);
            td {
              background: none;
            }
          }
        }
        ::v-deep td {
          border: none;
          padding: 0px 8px;
          color: #000622;
          font-size: 13px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          .cell {
            padding: 8px;
          }
        }
      }
    }
  }
}
</style>
