<!-- 导管监护项设置 -->
<template>
  <div id="dialysisDrug">
    <el-row style="width: 100%; height: 100% ">
      <!-- 左1 -->
      <el-col style="height:100%" :span="6">
        <div class="left" style="height:100%">
          <el-container style="height:100%">
            <el-header class="elHeader1">
              <div>
                <i class="iconBlue"></i>
                <span>ICU病区</span>
              </div>
            </el-header>
            <icu-region style="height:calc(100% - 42px)" :defaultPermi="['configuration:basicSettings:dialysisDrugConfig']" :defaultRegion="defaultRegion"
                        :module="'dialysisDrugConfig'" @defaultRegionChange="defaultRegionChange"></icu-region>
          </el-container>
        </div>
      </el-col>
      <!-- 左2 -->
      <el-col style="height:100%" :span="6">
        <div class="left" style="height:100%">
          <el-container style="height:100%">
            <el-header class="elHeader1">
              <div>
                <i class="iconBlue"></i>
                <span>透析液配药分类</span>
              </div>
            </el-header>
              <el-main style="height:calc(100% - 42px)">
                <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" ref="table"  :data="ICIS_DICT_DIALYSIS_DISPENSING_CLASS" @row-click="selectRow" style="width: 100%" height="100%" highlight-current-row border>
                  <v-table-column label="分类编号" align="center" prop="dictCode">
                    <template slot-scope="scope">
                      <span>{{scope.row.dictCode}}</span>
                    </template>
                  </v-table-column>
                  <v-table-column label="药品分类" align="center" prop="dictName">
                    <template slot-scope="scope">
                      <span>{{scope.row.dictName}}</span>
                    </template>
                  </v-table-column>
                </el-table>
              </el-main>
          </el-container>
        </div>
      </el-col>
      <!-- 左3 -->
      <el-col style="height:100%" :span="12">
        <el-row style="width: 100%;height:100%; ">
          <el-col :span="24">
            <div class="right" style="height:100%;">
              <el-container style="height:100%;">
                <el-header class="elHeader1">
                  <div>
                    <i class="iconBlue"></i>
                    <span>医嘱药品</span>
                  </div>
                </el-header>
                <el-container style="height:calc(100% - 42px)">
                  <el-header class="elHeader3">
                    <div class="headerRight">
                      <el-button v-hasPermi="['configuration:basicSettings:dialysisDrugConfig']" class="queryButton" type="primary"
                                 :disabled="isInsertStatus" @click.native.prevent="addDictItem">新增</el-button>
                    </div>
                  </el-header>
                  <el-main style="height:calc(100% - 42px)">
                    <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" height="100%" ref="tableData" :data="tableData" highlight-current-row fit border>
                      <v-table-column prop="drugCode" label="值">
                        <template slot-scope="scope">
                            <el-select v-if="scope.row.isCreate"  v-model="scope.row.drugCode"  clearable filterable :disabled="!scope.row.isEdit"
                              placeholder="请选择"
                              @change="selectDrug($event,scope.row)"
                              remote :remote-method="searchDrugCode"
                              @visible-change="clearDrugSearchKey"
                              @clear="getDrugList"
                            >
                              <el-option v-for="option in drugList" :key="option.drugCode" :label="option.drugCode" :value="option.drugCode" :disabled="option.statusDict==0"></el-option>
                            </el-select>
                            <span v-else>{{scope.row.drugCode}}</span>
                        </template>
                      </v-table-column>
                      <v-table-column prop="drugName" label="药品名称">
                        <template slot-scope="scope">
                            <el-select v-if="scope.row.isCreate"  v-model="scope.row.drugName"  clearable filterable :disabled="!scope.row.isEdit"
                              popper-class="fixed-width"
                              remote :remote-method="searchDrug"
                              placeholder="请选择"
                              @visible-change="clearDrugSearchKey"
                              @clear="getDrugList"
                              @change="selectDrugName($event,scope.row)"
                            >
                              <el-option v-for="(option,index) in drugList" :key="`${option.drugCode}-${index}`" :label="`${option.drugName} ${option.drugSpec || ''} ${option.factoryName || ''}`" :title="`${option.drugName} ${option.drugSpec || ''} ${option.factoryName || ''}`" :value="option.drugName" :disabled="option.statusDict==0" ></el-option>
                            </el-select>
                            <span v-else>{{scope.row.drugName}}</span>
                        </template>
                      </v-table-column>
                      <v-table-column prop="simpleName" label="药品缩写"></v-table-column>
                      <v-table-column prop="drugSpec" label="药品规格"></v-table-column>
                      <v-table-column prop="drugAttributes" label="药品属性">
                        <template slot-scope="scope">
                          <span>{{drugAttributesFilter(scope.row.drugAttributes,drugAttributesList)}}</span>
                        </template>
                      </v-table-column>
                      <v-table-column prop="dosageUnit" label="单位"></v-table-column>
                      <v-table-column prop="factoryName" label="厂家"></v-table-column>
                      <!-- <v-table-column prop="statusDict" label="状态" align="center">
                        <template slot-scope="scope">
                          <span>{{ scope.row.statusDict=='1' ? '已启用' : '已禁用' }}</span>
                        </template>
                      </v-table-column> -->
                      <v-table-column label="操作" align="center" width="200px">
                        <template slot-scope="scope">

                          <!-- <el-button v-hasPermi="['configuration:basicSettings:dialysisDrugConfig']" type="text"
                                     @click="deleteItemRow(scope.$index,scope.row)">删除</el-button>
                          <el-button v-hasPermi="['configuration:basicSettings:dialysisDrugConfig']" v-if="!scope.row.isEdit" type="text"
                                     @click="updateItemRow(scope.row, scope.$index)">修改</el-button>-->
                          <el-button v-hasPermi="['configuration:basicSettings:dialysisDrugConfig']" type="text" v-if="scope.row.isEdit===true"
                                     @click="cancelItemRow(scope.$index,scope.row)">取消</el-button>
                          <el-button v-hasPermi="['configuration:basicSettings:dialysisDrugConfig']" type="text" v-if="scope.row.isEdit===true"
                                     @click="saveItemRow(scope.$index,scope.row)">保存</el-button>
                          <!-- <el-button v-if="!scope.row.isCreate" v-hasPermi="['configuration:basicSettings:dialysisDrugConfig']"  type="text" @click="enableOrDisable(scope.row)"  :style="scope.row.statusDict=='1' ? 'color:#E6A23C':'color:#67C23A'">{{scope.row.statusDict=='1' ? '禁用'  : '启用' }}</el-button> -->
                          <el-button v-hasPermi="['configuration:basicSettings:dialysisDrugConfig']" type="text" v-if="!scope.row.isCreate"
                                     @click="deleteItemRow(scope.$index,scope.row)" style="color:red">删除</el-button>
                        </template>
                      </v-table-column>
                    </el-table>
                  </el-main>
                </el-container>
              </el-container>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 导管监护项匹配
import {
  dialysisDispensing_getDialysisDispensingDrugList, // 获取可选择药品列表
  dialysisDispensing_insertDialysisDispensing, // 新增接口
  dialysisDispensing_editDialysisDispensing, // 编辑
  dialysisDispensing_deleteById,
  dialysisDispensing_findDialysisDispensingWithPage // 获取分页
} from '@/api/configuration'
import icuRegion from '@/views/configuration/basicSettings/components/icuRegion.vue'
import { mapGetters } from 'vuex'
// import { frontFilter } from '@/utils'
export default {
  name: 'DialysisDrug',
  components: {
    icuRegion
  },
  data: function () {
    return {
      row: {},
      defaultRegion: '',
      ICIS_DICT_DIALYSIS_DISPENSING_CLASS: [],
      drugAttributesList: [],
      totalCount: 0,
      tableData: [

      ], // 数据
      // 药品列表
      drugList: [

      ],
      drugCodeList: [],
      drugNameList: [],
      addOrModify: '',
      drugDialog: '新增药品',
      dialogFlag: false, // 弹框标志
      drugInfo: {
        drugCode: '',
        drugName: '',
        simpleName: '',
        statusDict: '1',
        drugAttributes: '',
        drugSpec: '',
        dosageUnit: '',
        factoryName: ''
      },
      currItem: [],
      pageNum: 1
    }
  },
  props: {},
  watch: {},
  computed: {
    ...mapGetters(['currentUserWard']),
    isInsertStatus() {
      const bool = this.tableData.filter(v => v.isCreate).length > 0
      return bool
    }
  },
  async created() {
    this.defaultRegion = this.currentUserWard.wardCode

    const batchDictObj = await this.$batchGetDictItemList(['ICIS_DICT_DRUG_ATTRIBUTES', 'ICIS_DICT_DIALYSIS_DISPENSING_CLASS'])
    this.drugAttributesList = batchDictObj['ICIS_DICT_DRUG_ATTRIBUTES']
    this.ICIS_DICT_DIALYSIS_DISPENSING_CLASS = batchDictObj['ICIS_DICT_DIALYSIS_DISPENSING_CLASS']
  },
  mounted() { },
  methods: {
    /**
     * 选中药品分类对应的行
     */
    selectRow(row) {
      // if (row.statusDict == 0) {
      //   this.$message({
      //     type: 'warning',
      //     message: '该透析液分类已经禁用'
      //   })
      //   this.tableData = []
      // } else {
        this.row = row || {}
        this.selectRegion(this.defaultRegion)
      // }
    },
    /**
     * 病区切换
     */
    defaultRegionChange(defaultRegion) {
      this.defaultRegion = defaultRegion
      this.selectRegion(this.defaultRegion)
    },
    /**
     * 切换病区 后获取当前病区的 对应的 透析药品数据
     */
    selectRegion(wardCode) {
      // 清空
      if (!this.row.dictCode || !this.row.dictName) {
        return
      }
      this.getDialysisList()
    },
    /**
     * 获取当前病区已经绑定数据
     */
    getDialysisList() {
      const query = {
        wardCode: this.defaultRegion,
        dialysisDispensingClassDict: this.row.dictCode

      }
      dialysisDispensing_findDialysisDispensingWithPage(query).then(res => {
        this.tableData = [...res.data]
      })
    },
    searchDrugList() {

    },
    /**
     * 获取his 药品列表
     */
    getDrugList() {
      const query = {
        pageNum: 1,
        pageSize: 50,
        wardCode: this.defaultRegion,
        dialysisDispensingClassDict: this.row.dictCode
      }

      dialysisDispensing_getDialysisDispensingDrugList(query).then(res => {
        if (res.code == 0) {
          this.baiscDrugList = [...res.data]
          this.drugList = res.data
        }
      })
    },
    /**
     * 搜索药品名称
     */
    searchDrug(e) {
      this.loading = true
      const query = {
        pageNum: 1,
        pageSize: 50,
        drugName: e,
        wardCode: this.defaultRegion,
        dialysisDispensingClassDict: this.row.dictCode
      }
      dialysisDispensing_getDialysisDispensingDrugList(query).then(res => {
        this.loading = false
        if (res.code == 0) {
          this.drugList = res.data
        }
      })
    },
    /**
     * 清除数据
     */
    clearDrugSearchKey() {
      if (this.drugList.length == 0) {
        this.getDrugList()
      }
    },
    /**
     * 搜索药品名称
     */
    searchDrugCode(e) {
      const query = {
        pageNum: 1,
        pageSize: 50,
        drugCode: e,
        wardCode: this.defaultRegion,
        dialysisDispensingClassDict: this.row.dictCode
      }
      dialysisDispensing_getDialysisDispensingDrugList(query).then(res => {
        this.loading = false
        if (res.code == 0) {
          this.drugList = res.data
        }
      })
    },
    /**
     * 根据药品code 选择对应的药品
     */
    selectDrug(e, obj) {
      if (e) {
        const result = this.drugList.filter(item => item.drugCode == e)[0]
        obj = Object.assign(obj, result)
      } else {
        obj = {}
      }
    },
    /**
     * 根据药品名称 选择对应的药品
     */
    selectDrugName(e, obj) {
      if (e) {
        const result = this.drugList.filter(item => item.drugName == e)[0]
        obj = Object.assign(obj, result)
      } else {
        obj = {}
      }
    },

    /**
     * 新增药品列表
     */
    addDictItem() {
      if (this.tableData.length > 0) {
        const first = this.tableData[0]
        if (first.isCreate) {
          return
        }
      }

      if (!this.row.dictCode || !this.row.dictName) {
        this.$message.info('请选择药品分类')
        return
      }
      const row = {
        isCreate: true,
        isEdit: true,
        statusDict: '1'
      }
      if (this.drugList.length < 10) this.getDrugList()
      this.addOrModify = 'add'
      this.tableData.unshift(row)
    },
    /**
     * 取消当前编辑
     */
    cancelItemRow(index, row) {
      row.isEdit = false
      if (this.addOrModify == 'add') {
        this.tableData.splice(index, 1)
      } else {
        this.tableData = JSON.parse(JSON.stringify(this.tableData))
        this.tableData[index] = this.currItem[index]
      }
    },
    // 属性名称
    drugAttributesFilter(val, list) {
      if (!val) return
      const data = list.filter((item) => { return val == item.dictCode })
      return data[0].dictName
    },
    /**
     * 保存按钮
     */
    saveItemRow(index, row) {
      if (row.drugCode == '' || !row.drugCode || row.drugName == '' || !row.drugName) {
        this.$message({
          type: 'warning',
          message: '请选择药品'
        })
        return
      }
      if (row.isCreate) { // 新增
        const query = {
          wardCode: this.defaultRegion,
          dialysisDispensingClassDict: this.row.dictCode,
          drugCode: row.drugCode
        }
        dialysisDispensing_insertDialysisDispensing(query).then(res => {
          row.isEdit = false
          delete row.isCreate
          this.$message('新增成功')
          this.getDialysisList(this.pageNum)
        })
      }
    },
    /*
    *启用禁用功能
    */
    enableOrDisable(row) {
      if (row.isCreate) return
      const query = {
        id: row.id,
        statusDict: row.statusDict == '1' ? '0' : '1'
      }
      dialysisDispensing_editDialysisDispensing(query).then(res => {
        this.$message('设置成功')
        this.getDialysisList(this.pageNum)
      })
    },
    deleteItemRow(index, row) {
      if (row.isCreate) {
        this.cancelItemRow(index, row)
        return
      }
      this.$confirm('您确定要删除吗？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        dialysisDispensing_deleteById({
            id: row.id,
            dialysisDispensingClassDict: this.row.dictCode,
            drugCode: row.drugCode,
            wardCode: this.defaultRegion
        }).then(res => {
          if (res.code == 0) {
            this.$message.success('删除成功！')
            this.getDialysisList(this.pageNum)
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法

#dialysisDrug {
  background: #fff;
  padding-bottom: 15px;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 15px;
  // 宽度为70的div 用于页面分布
  .left {
    position: relative;
    margin-right: 10px;
    padding-right: 10px;
    border-right: 2px solid rgba(203, 215, 238, 0.3);
  }
  .right {
    position: relative;
    margin-right: 10px;
  }
  .elHeader3 {
    width: 100%;
    //头部栏中的右侧 新增 查询 按钮样式
    .headerRight {
      display: flex;
      justify-content: flex-end;
      width: 100%;
    }
  }
}
</style>
