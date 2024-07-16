<!-- 病床管理 -->
<template>
  <div id="VerificationRules" class="VerificationRules">
    <!-- 功能模块 -->
    <el-row style="width: 100%; height: 100%;">
      <el-col :span="6" style="height: 100%;">
        <div class="left">
          <el-container style="height: 100%;">
            <el-header class="elHeader1">
              <div>
                <i class="iconBlue"></i>
                <span>ICU病区</span>
              </div>
            </el-header>
            <el-container style="height: calc(100% - 32px);">
              <icu-region :defaultPermi="['configuration:basicSettings:VerificationRules']" :defaultRegion="defaultRegion" :module="'verificationOperation'" @defaultRegionChange="defaultRegionChange"></icu-region>
            </el-container>
          </el-container>
        </div>
      </el-col>
      <el-col :span="6" style="height: 100%;">
        <!-- ICU病区 -->
        <div class="right">
          <el-container>
            <el-header>
              <div>
                <i class="iconBlue"></i>
                <span>数据控制节点配置</span>
              </div>
            </el-header>
          </el-container>
          <el-header class="flex">
            <el-button style="visibility: hidden;"></el-button>
          </el-header>
          <el-main style="height: calc(100% - 99px);">
            <el-table @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)" ref="tableData" :data="tableData" height="100%" row-key="moniitemCode" highlight-current-row fit border @row-click="selectRow" :key="tableKey">
              <v-table-column label="操作类型" key="dictControlNodeName" align="center" width="150px">
                <template slot-scope="scope">
                  <span>{{ scope.row.dictControlNodeName }}</span>
                </template>
              </v-table-column>
              <v-table-column label="控制类型" key="dictControlTypeCode" align="center">
                <template slot-scope="scope">
                  <el-select :value-key="'dictCode'" v-model="scope.row.dictControlTypeCode" placeholder="选择" clearable filterable :disabled="!scope.row.isEdit">
                    <el-option v-for="option in ICIS_DICT_CONTROL_TYPE" :key="option.dictId" :label="option.dictName" :value="option.dictCode" :disabled="option.statusDict == 0"></el-option>
                  </el-select>
                </template>
              </v-table-column>
              <v-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button v-if="!scope.row.isEdit" type="text" @click.stop="updateItemRow(scope.row, scope.$index)">修改</el-button>
                  <el-button type="text" v-if="scope.row.isEdit === true" @click.stop="cancelItemRow(scope.$index, scope.row)">取消</el-button>
                  <el-button type="text" v-if="scope.row.isEdit === true" @click.stop="saveItemRow(scope.row)">保存</el-button>
                </template>
              </v-table-column>
            </el-table>
          </el-main>
        </div>
      </el-col>
      <el-col :span="12" style="height: 100%;">
        <!-- ICU病区 -->
        <div class="right">
          <el-container>
            <el-header>
              <div>
                <i class="iconBlue"></i>
                <span>校验规则配置</span>
              </div>
            </el-header>
          </el-container>
          <el-header class="flex flex-end" style="justify-content: flex-end;">
            <el-button size="small" type="primary" :disabled="this.tableData.length == 0||isAddState" @click="addDictItem">新增</el-button>
          </el-header>
          <el-main style="height: calc(100% - 99px);">
            <el-table @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)" ref="tableDataPLus" :data="tableDataDetail" height="100%" row-key="moniitemCode" highlight-current-row fit border :key="tableKey">
              <v-table-column label="规则名称" key="dictVerificationRulesCode" align="center" width="150px">
                <template slot-scope="scope">
                  <el-select v-if="scope.row.isCreate" :value-key="'dictCode'" v-model="scope.row.dictVerificationRulesCode" placeholder="选择" clearable filterable :disabled="!scope.row.isEdit&&!scope.row.isCreate">
                    <el-option v-for="option in ICIS_DICT_VERIFICATION_RULES" :key="option.dictId" :label="option.dictName" :value="option.dictCode" :disabled="option.statusDict == 0||tableDataDetail.filter(v=>v.dictVerificationRulesCode==option.dictCode).length>0"></el-option>
                  </el-select>
                  <span v-else>{{scope.row.dictVerificationRulesCode|showDictNameFilter(ICIS_DICT_VERIFICATION_RULES,'dictCode_to_dictName')}}</span>
                </template>
              </v-table-column>
              <v-table-column label="提示信息" key="message" align="center">
                <template slot-scope="scope">
                  <el-input type="text" v-if="scope.row.isEdit || scope.row.isCreate" v-model="scope.row.message" maxlength="100" placeholder="请输入内容"> </el-input>
                  <span v-else>{{ scope.row.message }}</span>
                </template>
              </v-table-column>
              <v-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button v-if="!scope.row.isEdit&&!scope.row.isCreate" type="text" :disabled="tableDataDetail.filter(v=>v.isEdit||v.isCreate).length>0" @click="updateItemRowDetail(scope.row, scope.$index)">修改</el-button>
                  <el-button type="text" v-if="scope.row.isEdit || scope.row.isCreate" @click="cancelItemRowDetail(scope.$index, scope.row)">取消</el-button>
                  <el-button type="text" v-if="scope.row.isEdit || scope.row.isCreate" @click="saveItemRowDetail(scope.row)">保存</el-button>
                  <el-button v-if="!scope.row.isEdit" style="color: red;" @click.native.prevent="deleteRow(scope.row,scope.$index)" type="text" size="small">删除</el-button>
                </template>
              </v-table-column>
            </el-table>
          </el-main>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapGetters } from 'vuex' // 存储方式
import { verificationRules_deleteById, verificationOperation_findVerificationOperations, verificationOperation_edit, verificationRules_findVerificationRules, verificationRules_edit, verificationRules_insert } from '@/api/configuration'
import icuRegion from '@/views/configuration/basicSettings/components/icuRegion.vue'
export default {
  name: 'VerificationRules',
  components: {
    icuRegion
  },
  data: function () {
    return {
      curRow: {},
      ICIS_DICT_VERIFICATION_RULES: [],
      ICIS_DICT_CONTROL_TYPE: [],
      ICIS_DICT_CONTROL_NODE: [],
      statusDict: '',
      tableData: [],
      tableDataDetail: [],
      searchKey: '',
      loading: false,
      defaultRegion: '',
      tableDataModule: [], //
      currItem: [], // 当前编辑数据
      pageSize: 15,
      pageNum: 1,
      tableKey: ''
    }
  },
  props: {},
  watch: {},
  computed: {
    ...mapGetters(['currentUserWard']),
    isAddState() {
      return this.tableDataDetail.filter(v => v.isEdit || v.isCreate).length > 0
    }
  },
  created: async function () {
    const { ICIS_DICT_VERIFICATION_RULES, ICIS_DICT_CONTROL_TYPE, ICIS_DICT_CONTROL_NODE } = await this.$batchGetDictItemList(['ICIS_DICT_VERIFICATION_RULES', 'ICIS_DICT_CONTROL_TYPE', 'ICIS_DICT_CONTROL_NODE'])
    this.ICIS_DICT_VERIFICATION_RULES = ICIS_DICT_VERIFICATION_RULES
    this.ICIS_DICT_CONTROL_TYPE = ICIS_DICT_CONTROL_TYPE
    this.ICIS_DICT_CONTROL_NODE = ICIS_DICT_CONTROL_NODE
    this.defaultRegion = this.currentUserWard.wardCode
  },
  mounted() {},
  methods: {
    deleteRow: function (row, index) {
      if (!row.id) {
         this.tableDataDetail.splice(index, 1)
         return
      }
      this.$confirm('您确定要删除吗？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
         await verificationRules_deleteById(row.id)
        this.selectRow(this.curRow)
      })
    },
    // 保存数据
    saveItemRow(row, module) {
      const promise = verificationOperation_edit(row)
      promise.then((res) => {
        if (res.code == 0) {
          this.selectRegion(this.defaultRegion)
          this.selectRow(this.curRow)
        }
      })
    },
    saveItemRowDetail(row, module) {
      if (!row.dictVerificationRulesCode) {
        this.$message.error('规则名称不能为空')
        return
      } else if (!row.message) {
        this.$message.error('提示信息不能为空')
        return
      }
      row.verificationOperationId = this.curRow.id
      const promise = !row.id ? verificationRules_insert(row) : verificationRules_edit(row)
      promise.then((res) => {
        if (res.code == 0) {
          this.selectRow(this.curRow)
        }
      })
      promise.catch((res) => {
        this.selectRow(this.curRow)
      })
    },
    async selectRegion(wardCode, init) {
      this.loading = true
      const tableData = await verificationOperation_findVerificationOperations({ wardCode })
      this.tableData = tableData.data
      if (this.tableData.length > 0 && init) {
        this.$refs.tableData.setCurrentRow(this.tableData[0])
        this.selectRow(this.tableData[0])
      }
      this.loading = false
    },
    defaultRegionChange(defaultRegion) {
      this.defaultRegion = defaultRegion
      if (defaultRegion === '') {
        this.tableData = []
      } else {
        if (this.timer) {
          clearInterval(this.timer)
        }
        this.timer = setTimeout(() => {
          this.selectRegion(this.defaultRegion, 'init')
        }, 200)
      }
    },
    // 新增一行
    addDictItem: async function () {
      const row = {
        dictVerificationRulesCode: '',
        message: '',
        isCreate: true,
        verificationOperationId: this.curRow.id
      }
      this.tableDataDetail.unshift(row)
    },
    // 修改监护项
    updateItemRow(row, index) {
      this.currItem[index] = { ...row }
      row.isEdit = true
      this.tableData = JSON.parse(JSON.stringify(this.tableData))
    },
    updateItemRowDetail(row, index) {
      row.isEdit = true
      this.tableDataDetail = JSON.parse(JSON.stringify(this.tableDataDetail))
    },
    // 取消行的编辑状态
    cancelItemRow() {
      this.selectRegion(this.defaultRegion)
    },
    // 取消行的编辑状态
    cancelItemRowDetail() {
      this.selectRow(this.curRow)
    },
    //  选择对应的行
    selectRow: async function (row) {
      this.curRow = row
      const tableDataDetail = await verificationRules_findVerificationRules({ verificationOperationId: row.id })
      this.tableDataDetail = tableDataDetail.data
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法

.VerificationRules {
  display: flex;
  flex: 0%;
  background: #fff;
  height: 100%;
  // 宽度为70的div 用于页面分布
  .left {
    height: 100%;
    position: relative;
    margin-right: 10px;
    padding: 15px;
    border-right: 2px solid rgba(203, 215, 238, 0.3);
  }
  .right {
    height: 100%;
    position: relative;
    padding: 15px 15px 0 15px;
  }
  .elHeader3 {
    width: 100%;
  }
}
</style>
