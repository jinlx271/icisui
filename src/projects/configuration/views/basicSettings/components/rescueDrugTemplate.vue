<template>
  <div class="rescueDrugTemplate">
    <el-dialog title="配置用药模板" :visible.sync="dialogShowFlag"  :before-close="closeDialog" >
      <div class="rescueDrugTemplate_main" v-if="dialogShowFlag">
        <div class="rescueDrugTemplate_main_left" v-loading="loading">
          <div class="rescueDrugTemplate_main_title">模板列表</div>
          <el-header class="flex">
            <el-checkbox v-model="statusDict" true-label="" false-label="1"  @change="getTemplateList(1)">
                  显示禁用
            </el-checkbox>
            <el-button class="flex1 pl-5"  type="primary"  @click="addTemplate" >新增模板</el-button>
          </el-header>

              <!-- 模板列表 -->
          <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" :row-class-name="({row}) => row.statusDict == 0 ? 'disabled' : ''" :data="list"  :show-header="false"  @row-click="changeTemp" highlight-current-row mini ref="templateTable" @current-change="currentRowChange">
            <v-table-column prop="templateName">
              <template  slot-scope="scope">
                <el-input v-if="scope.row.isEdit" v-model="scope.row.templateName" placeholder="请输入"></el-input>
                <span v-else >{{scope.row.templateName}}</span>
              </template>
            </v-table-column>
            <v-table-column prop="templateName" align="right">
              <template  slot-scope="scope">
                <el-button v-if="scope.row.isEdit" type="text" @click="doSaveTemplate(scope.$index,scope.row)">保存</el-button>
                <el-button v-if="scope.row.isEdit" type="text" @click="doCancelTemplate(scope.$index,scope.row)">取消</el-button>
                <el-button v-if="!scope.row.isCreate" type="text" @click="leftEnableOrDisable(scope.$index,scope.row)" :style="+scope.row.statusDict ? 'color:#EC0000' : 'color:#00AB44'">{{+scope.row.statusDict ? '禁用' : '启用' }}</el-button>
              </template>
            </v-table-column>
          </el-table>
          <el-footer>
            <el-pagination background :current-page="templatePageNum" :page-size="templatePageSize" layout="total , prev, pager, next"
                style="margin-left:-10px;float:right" :total="templateTotal" @current-change="getTemplateList">
            </el-pagination>
          </el-footer>
        </div>
        <div class='rescueDrugTemplate_main_right'>
          <div class="rescueDrugTemplate_main_title flex-1">用药记录</div>
          <el-header class="flex">
            <el-checkbox v-model="drugStatusDict" true-label="" false-label="1"  @change="getDrugList(1)">
                  显示禁用
            </el-checkbox>
              <el-button type="primary" @click="addDrug" size="small" :disabled=" currTemplate==null">添加药品</el-button>
          </el-header>
          <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" ref="tableDataItem" :row-class-name="({row}) => row.statusDict == 0 ? 'disabled' : ''" :data="tableDataItem"  highlight-current-row fit border   row-key="id"  >
            <v-table-column prop="drugName" label="药品名称" align="left"  >
              <template slot-scope="scope">
                  <el-select clearable filterable remote
                    v-model="scope.row.drugCode"
                    popper-class="fixed-width"
                    :remote-method="remoteMethod"
                    placeholder="请选择"
                    @change="changeDrug($event,'drugCode',scope.row)"
                    @visible-change="clearDrugSearchKey"
                    @clear="remoteMethod()"
                    v-if="scope.row.isEdit&&scope.row.isCreate">
                    <el-option v-for="option in drugBasicData" :key="option.drugCode" :label="`${option.drugName} ${option.drugSpec || ''} ${option.factoryName || ''}`"
                              :title="`${option.drugName} ${option.drugSpec || ''} ${option.factoryName || ''}`" :value="option.drugCode" :disabled="option.statusDict==0"></el-option>
                  </el-select>
                  <span v-else>{{scope.row.drugName}}</span>
              </template>
            </v-table-column>
            <v-table-column :prop="item.key" :label="item.label" align="left" v-for="(item,index) in rescureBasicDrug" :key="item.key+index">
              <template slot-scope="scope">
                  <el-select v-if="item.styleType === 'select'&&scope.row.isEdit" value-key="code"
                  :allow-create="item.canCreate"
                  v-model="scope.row[item.key]"
                  placeholder="请选择"
                  :remote="item.remote"
                  :remote-method="remoteMethod"
                  :clearable="item.key=='drugUsageCode'?true:false" filterable
                  @change="changeDrug($event,item.key,scope.row)"
                  :disabled="!((scope.row.isCreate&&!item.canEdit) || (item.canEdit&&scope.row.isEdit))"
                  >
                    <el-option v-for="(option) in item.options" :key="option[item.optionsValue || 'value']" :label="option[item.optionsLabel || 'label']"
                              :value="option[item.optionsValue || 'value']" :disabled="option.statusDict==0"></el-option>
                  </el-select>
                  <el-input v-else-if="scope.row.isEdit&&item.canEdit" v-model="scope.row[item.key]" placeholder="请输入"></el-input>
                  <span v-else>{{scope.row[item.labelkey]||scope.row[item.key]}}</span>
              </template>
            </v-table-column>

            <v-table-column label="操作" align="center" width="200px">
            <template slot-scope="scope">
                <el-button type="text" @click="doEdit(scope.$index,scope.row)" v-if="!scope.row.isEdit">修改</el-button>
                <el-button type="text" @click="doSave(scope.$index,scope.row)" v-if="scope.row.isEdit">保存</el-button>
                <el-button type="text" @click="doCancel(scope.$index,scope.row)"  v-if="scope.row.isEdit">取消</el-button>
                <el-button v-if="!scope.row.isCreate" type="text" @click="rightEnableOrDisable(scope.$index,scope.row)" :style="{ color: scope.row.statusDict == 1 ? '#EC0000': '#00AB44' }">{{+scope.row.statusDict ? '禁用' : '启用' }}</el-button>
            </template>
            </v-table-column>
          </el-table>
          <el-footer>
            <el-pagination background :current-page="drugPageNum" :page-size="drugPageSize" layout="total , prev, pager, next"
                style="margin-left:-10px;float:right" :total="drugTotolCount" @current-change="getDrugList">
            </el-pagination>
          </el-footer>
        </div>
      </div>
      <!-- <div slot="footer">
        <el-button @click="closeDialog()">关 闭</el-button>
        <el-button type="primary" @click="submitData">确 定</el-button>
      </div> -->
    </el-dialog>
  </div>

</template>
<script>
import {

  rescure_rescureDrugTemplate_insert, // 增加模板
  rescure_rescureDrugTemplate_findAllWithPage, // 查询模板列表
  rescure_rescureDrugTemplate_deleteById, // 删除模板

  rescure_rescureTemplateDrug_findAllWithPage, // 药品列表
  rescure_rescureTemplateDrug_insert, // 模板中增加对应的药品
  rescure_rescureTemplateDrug_edit,
  rescure_rescureTemplateDrug_deleteById
} from '@/api/rescure'
import { getDrugBasicData } from '@/utils/utils'
export default {
  name: 'RescueDrugTemplate',
  components: {},
  data: function() {
    return {
      statusDict: '',
      drugStatusDict: '',
      loading: false,
      tableDataItem: [],
      drugBasicData: [],
      list: [], // 模板列表
      leftIndex: 0,
      currTemplate: null, // 当前模板
      templateTotal: 0, // 模板总数
      templatePageNum: 1,
      templatePageSize: 8,
      drugPageSize: 10,
      drugPageNum: 1,
      drugTotolCount: 0,
      currEditDrug: {},
      unitList: []
      // drugUsageList: []
    }
  },
  props: {
    dialogShowFlag: {
      type: Boolean,
      default: false
    },

    wardCode: {
      type: String,
      default: ''
    }

  },
  inject: ['drugUsageListFn'],
  watch: {
    currTemplate: function() {
      if (this.currTemplate == null) {
        this.tableDataItem = []
      }
    },
    wardCode: function() {
     this.initData()
    },
    dialogShowFlag: function() {
      if (this.dialogShowFlag) {
        this.$nextTick(() => {
          this.$refs.templateTable?.setCurrentRow(this.list[0], true)
          this.currTemplate = this.list[0]
          this.getDrugList()
        })
      }
    }

  },
  computed: {
    rescureBasicDrug() {
      return [

          { label: '规格', key: 'drugSpec', width: '80', canEdit: false },
          { label: '用量', key: 'dosage', width: '80', canEdit: true },
          { label: '抢救时单位', key: 'drugUnit', width: '80', styleType: 'select', options: this.unitList, optionsLabel: 'dictName', optionsValue: 'dictName', canEdit: true, canCreate: true },
          { label: '用法', key: 'drugUsageCode', labelkey: 'drugUsageName', width: '80', styleType: 'select', options: this.drugUsageListFn(), optionsLabel: 'usageName', optionsValue: 'usageCode', canEdit: true, canCreate: false }
        ]
    }
  },
  async created() {
    this.getTemplateList()
    this.unitList = await this.$getDictItemList('ICIS_DICT_UNIT')
    this.drugBasicData = await getDrugBasicData()
  },
  mounted() {},
  methods: {
    async initData() {
      this.getTemplateList()
    },
    /** *******模板相关的逻辑 start *********/
    // 获取模板列表
    getTemplateList(pageNum) {
      this.templatePageNum = pageNum || 1
      const query = {
        pageSize: this.templatePageSize,
        pageNum: this.templatePageNum,
        wardCode: this.wardCode,
        statusDict: this.statusDict
      }
      rescure_rescureDrugTemplate_findAllWithPage(query).then(res => {
        if (res.code == 0) {
          this.list = res.data.result
          this.templateTotal = res.data.totolCount
          if (this.list.length > 0) {
            this.$refs.templateTable?.setCurrentRow(this.list[0], true)
            this.currTemplate = this.list[0]
          } else {
            this.currTemplate = null
          }
        }
      })
    },
    /**
     * 清除搜索关键字
     */
    async clearDrugSearchKey() {
      if (this.drugBasicData.length == 0) this.drugBasicData = await getDrugBasicData()
    },
    changeTemp(e) {
      this.currTemplate = e
      this.tableDataItem = []
      this.drugTotolCount = 0
      if (e.id) {
        this.getDrugList()
      }
    },
    // 添加模板
    async addTemplate() {
      if (this.list.length > 0 && this.list[0].isCreate) return
      const item = {
        isEdit: true,
        isCreate: true
      }
      this.list.unshift(item)
      this.list = [...this.list]
    },
    closeDialog() {
      if (this.list[0].isCreate) {
        this.list.splice(0, 1)
      }
      this.$emit('closeFn')
    },
    // 保存用药模板
    doSaveTemplate(index, row) {
      if (row.isCreate) { // 保存模板
        if (row.templateName == undefined || row.templateName.trim() == '') {
          this.$message({
            type: 'error',
            message: '请输入模板名称'
          })
          return
        }
        const query = {
          wardCode: this.wardCode,
          templateName: row.templateName
        }

        rescure_rescureDrugTemplate_insert(query).then(res => {
          if (res.code == 0) {
            row.isEdit = false
            row.isCreate = false

            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.getTemplateList(1)
          }
        })
      }
    },
    // 保存用药模板
    doCancelTemplate(index, row) {
      if (row.isCreate) {
        row.isEdit = false
        this.list.splice(index, 1)
      }
    },
    // 启用禁用-用药模板
    leftEnableOrDisable(index, row) {
      rescure_rescureDrugTemplate_deleteById({
        id: row.id,
        statusDict: row.statusDict == '1' ? '0' : '1'
      }).then(res => {
        if (res.code == 0) {
          // this.list.splice(index, 1)
          this.$message({
            type: 'success',
            message: +row.statusDict ? '已禁用' : '已启用'
          })
          this.getTemplateList(1)
        }
      })
    },
    /** *******模板相关的逻辑 end *********/
    /** *******药品相关的逻辑 end *********/
    getDrugList(pageNum) {
      this.drugPageNum = pageNum || 1

      const query = {
        pageSize: this.drugPageSize,
        pageNum: this.drugPageNum,
        statusDict: this.drugStatusDict,
        templateId: this.currTemplate.id
      }
      rescure_rescureTemplateDrug_findAllWithPage(query).then(res => {
        if (res.code == 0) {
          this.tableDataItem = res.data.result.map(item => {
            item.isEdit = false
            return item
          })
          this.drugTotolCount = res.data.totolCount
        }
      })
    },
    // 添加药品按钮 逻辑处理
    async addDrug() {
      if (this.currTemplate == null) return
      if (this.tableDataItem.length > 0 && this.tableDataItem[0].isEdit) return

      const item = {
        isEdit: true,
        isCreate: true
      }
      this.drugBasicData = await getDrugBasicData()
      this.tableDataItem.unshift(item)
      this.tableDataItem = [...this.tableDataItem]
    },
    async remoteMethod(e) {
      this.drugBasicData = await getDrugBasicData(e)
    },
    // selection 切换数据
    changeDrug(e, key, row) {
      if (e != '') {
        if (key == 'drugCode') {
          const selectDrug = this.drugBasicData.filter(drug => drug.drugCode == e)[0]
          row.drugCode = selectDrug.drugCode
          row.drugName = selectDrug.drugName
          // row.dosage = selectDrug.dosage
          row.drugUnit = selectDrug.dosageUnit
          row.drugSpec = selectDrug.drugSpec
        } else {
          row[key] = e
        }
        this.tableDataItem = [...this.tableDataItem]
      }
    },
    // 编辑按钮逻辑
    doEdit(index, row) {
      this.currEditDrug = { ...row }
      row.isEdit = true
      this.tableDataItem = [...this.tableDataItem]
    },
    // 保存按钮逻辑
    doSave(index, row) {
      if (!row.drugCode || !row.dosage || !row.drugUnit) {
        this.$message({
          type: 'error',
          message: '请输入药品名称,用量,抢救时单位'
        })
        return
      }
      if (row.isCreate) {
        row.templateId = this.currTemplate.id

        const checkIsHaveData = this.tableDataItem.filter(item => item.drugCode == row.drugCode)// 查看是否有重复数据
        if (checkIsHaveData.length > 1) {
          this.$message({
            type: 'error',
            message: '存在该药品'
          })
          return
        }
        row['drugUsageName'] = row.drugUsageCode ? this.drugUsageListFn().find(item => item.usageCode == row.drugUsageCode)?.usageName : ''
        rescure_rescureTemplateDrug_insert(row).then(res => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            row.isCreate = false
            row.isEdit = false
            // this.tableDataItem = [...this.tableDataItem]
            this.getDrugList()
          }
        })
      } else {
        row['drugUsageName'] = row.drugUsageCode ? this.drugUsageListFn().find(item => item.usageCode == row.drugUsageCode)?.usageName : ''
        rescure_rescureTemplateDrug_edit(row).then(res => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: '保存成功'
            })

            row.isEdit = false
            this.tableDataItem = [...this.tableDataItem]
          }
        })
      }
    },
    // 取消按钮逻辑
    doCancel(index, row) {
      row.isEdit = false
      if (row.isCreate) {
        this.tableDataItem.splice(index, 1)
      } else {
        this.tableDataItem[index] = { ...this.currEditDrug }
      }
      this.tableDataItem = [...this.tableDataItem]
    },
    /**
     * 启用禁用
     */
    rightEnableOrDisable(index, row) {
      rescure_rescureTemplateDrug_deleteById({
        id: row.id,
        statusDict: row.statusDict == '1' ? '0' : '1'
      }).then(res => {
      if (res.code == 0) {
        // this.tableDataItem.splice(index, 1)
        this.getDrugList()
        this.$message({
          type: 'success',
          message: +row.statusDict ? '已禁用' : '已启用'
        })
      }
    })
    },
    currentRowChange(e, oldE) {
      if (e && e.id) {
        this.currTemplate = e
        this.getDrugList()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
// @import '@/styles/config-common.scss'; // 公共css方法
.rescueDrugTemplate{
  .btn{
    margin-right:10px;
  }
  ::v-deep .el-dialog{
    width:1040px;
    height:720px;
    &__body{
      padding-top:0px;
      .rescueDrugTemplate_main{
        display: flex;
        width:100%;
        height:calc(100% - 51px);
        &_left{
          width:280px;
          border-right:1px solid #DFE7F5;
          padding-right:10px;
          height:100%;
          overflow-y:hidden ;
          ::v-deep .el-table{
            &__body{
              th,td{
                padding:3px 0;
              }
            }

          }
        }
        &_right{
          flex:1;
          overflow: hidden;
          padding-left:10px;
        }
        &_title{
          display: flex;
          align-items: center;
          height:30px;
          line-height: 30px;
          position: relative;
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

