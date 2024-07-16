<!-- 导管皮肤匹配 -->
<template>
  <div id="consutingSet">
    <div class="icuArea">
      <el-header>
        <i class="iconBlue"></i>
        <span>ICU病区</span>
      </el-header>
      <div style="margin-top:15px;height:calc(100% - 42px)">
        <icu-region :defaultPermi="['configuration:basicSettings:nursePlanConfig']" :defaultRegion="defaultRegion"
          :module="'nursePlanConfig'" @defaultRegionChange="defaultRegionChange" ref="icuRegion"
          @regionChange="(wardInfo) => { currentWardInfo = wardInfo }"></icu-region>
      </div>
    </div>
    <!-- 护理计划模板配置 -->
    <div class="classDiv">
      <el-header class="inputDiv">
        <i class="iconBlue"></i>
        <span>护理诊断</span>
        <el-button v-hasPermi="['configuration:basicSettings:nursePlanConfig']" @click.native.prevent="addConsuitType"
          size="mini" type="primary">新增
        </el-button>
      </el-header>
      <div style=" margin-bottom: 5px;  height: calc(100% - 60px);">
        <el-table
          @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
          :data="nurseDiagList" highlight-current-row border height="100%" ref="groupInfoDivTable" size="mini"
          @row-click="selectConsuitType">
          <v-table-column label="护理诊断" align="center" min-width="130">
            <template slot-scope="scope">
              <el-select v-model="scope.row.dictCode" v-if="scope.row.isCreate" placeholder="请选择" filterable clearable>
                <el-option :forceHide="item.statusDict != 1" v-for="(item) in ICIS_DICT_NURSE_DIAG"
                  :key="item.dictName + item.dictCode" :label="item.dictName" :value="item.dictCode"
                  :disabled="item.statusDict == '0'"></el-option>
              </el-select>
              <span v-else>{{ filterArrValue(scope.row.dictCode, ICIS_DICT_NURSE_DIAG, 'dictCode', 'dictName') }}</span>
            </template>
          </v-table-column>
          <v-table-column prop="sortNo" label="排序" align="center" min-width="80">
            <template slot-scope="scope">
              <el-input-number v-if="scope.row.isEdit" v-model="scope.row.sortNo" placeholder="请输入"
                controls-position="right" style="width:80px" :min="1"></el-input-number>
              <span v-else>{{ scope.row.sortNo }}</span>
            </template>
          </v-table-column>
          <v-table-column label="操作" width="120" align="center">
            <template slot-scope="scope">
              <el-button v-hasPermi="['configuration:basicSettings:nursePlanConfig']"
                @click.prevent="cancelNurseDiagRow(scope.row, scope.$index)" type="text" size="small"
                v-if="scope.row.isEdit">取消</el-button>
              <el-button v-hasPermi="['configuration:basicSettings:nursePlanConfig']"
                @click.prevent="saveNurseDiagRow(scope.row, scope.$index)" type="text" size="small"
                v-if="scope.row.isEdit">保存</el-button>
              <el-button v-hasPermi="['configuration:basicSettings:nursePlanConfig']"
                @click.prevent="modifyNurseDiagRow(scope.row, scope.$index)" type="text" size="small"
                v-else>修改</el-button>
              <el-button v-if="!scope.row.isCreate" v-hasPermi="['configuration:basicSettings:nursePlanConfig']"
                @click.native.prevent="deleteNurseDiagRow(scope.row, scope.$index)"
                :style="{ color: scope.row.statusDict == 1 ? '#EC0000' : '#00AB44' }" type="text"
                size="mini">{{+scope.row.statusDict ? '禁用' : '启用' }}</el-button>
            </template>
          </v-table-column>
        </el-table>
      </div>
    </div>

    <!-- 致因及护理措施目标配置 -->
    <div class="groupInfoDiv">
      <el-header>
        <i class="iconBlue"></i>
        <span>致因及护理措施目标配置</span>
        <el-button v-hasPermi="['configuration:basicSettings:nursePlanConfig']" @click.native.prevent="addProgram"
          size="mini" type="primary" :disabled="!currNurseDiagId">新增</el-button>
      </el-header>
      <div style=" margin-bottom: 5px;  height: calc(100% - 60px);">
        <el-table
          @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
          :data="nurseDiagDetailList" highlight-current-row border height="100%" ref="programDivTable" size="mini">
          <v-table-column label="护理致因" align="center" min-width="120">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isEdit" v-model="scope.row.nurseReason" type="textarea" placeholder="请输入"
                show-word-limit maxlength="1000"></el-input>
              <span v-else>{{ scope.row.nurseReason }}</span>
            </template>
          </v-table-column>
          <v-table-column label="护理措施" align="center" min-width="120">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isEdit" v-model="scope.row.nurseMeasure" type="textarea" placeholder="请输入"
                show-word-limit maxlength="1000"></el-input>
              <span v-else>{{ scope.row.nurseMeasure }}</span>
            </template>
          </v-table-column>
          <v-table-column label="护理目标" align="center" min-width="120">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isEdit" v-model="scope.row.nurseTarget" type="textarea" placeholder="请输入"
                show-word-limit maxlength="500"></el-input>
              <span v-else>{{ scope.row.nurseTarget }}</span>
            </template>
          </v-table-column>
          <v-table-column prop="sortNo" label="排序" align="center" min-width="120">
            <template slot-scope="scope">
              <el-input-number v-if="scope.row.isEdit" v-model="scope.row.sortNo" placeholder="请输入"
                controls-position="right" style="width:80px" :min="1"></el-input-number>
              <span v-else>{{ scope.row.sortNo }}</span>
            </template>
          </v-table-column>
          <v-table-column label="操作" width="120" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button v-hasPermi="['configuration:basicSettings:nursePlanConfig']"
                @click.prevent="cancelNurseDiagDetailRow(scope.row, scope.$index)" type="text" size="small"
                v-if="scope.row.isEdit">取消</el-button>
              <el-button v-hasPermi="['configuration:basicSettings:nursePlanConfig']"
                @click.prevent="saveNurseDiagDetailRow(scope.row, scope.$index)" type="text" size="small"
                v-if="scope.row.isEdit">保存</el-button>
              <el-button v-hasPermi="['configuration:basicSettings:nursePlanConfig']"
                @click.prevent="modifyNurseDiagDetailRow(scope.row, scope.$index)" type="text" size="small"
                v-else>修改</el-button>
              <el-button v-hasPermi="['configuration:basicSettings:nursePlanConfig']"
                @click.prevent="deleteNurseDiagDetailRow(scope.row, scope.$index)" type="text" size="small"
                class="redCss">删除</el-button>
            </template>
          </v-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex' // 存储方式
import {
  nurseDiag_edit,
  nurseDiag_findWithPage,
  nurseDiag_insert,
  nurseDiagDetail_getByNurseDiagId,
  nurseDiagDetail_deleteById,
  nurseDiagDetail_edit,
  nurseDiagDetail_insert
} from '@/api/configuration'
import icuRegion from '@/views/configuration/basicSettings/components/icuRegion.vue'
import { filterArrValue } from '@/utils/utils'
import {
  map
} from 'lodash'
export default {
  name: 'ConsutingSet',
  components: {
    icuRegion
  },
  data: function () {
    return {
      defaultRegion: '',
      currentWardInfo: {
        wardCode: '',
        wardIdentification: ''
      },
      nurseDiagList: [],
      nurseDiagDetailList: [],
      ICIS_DICT_NURSE_DIAG: [],
      currNurseDiagRow: null, // 记录当前编辑信息
      currNurseDiagId: '',
      loading: false
    }
  },
  props: {},
  watch: {

  },
  computed: {
    ...mapGetters(['currentUserWard'])
  },
  created: function () {
    this.defaultRegion = this.currentUserWard.wardCode
  },
  mounted() {
    this.init()
  },
  methods: {
    filterArrValue,
    async init() {
      const dictCodeList = ['ICIS_DICT_NURSE_DIAG']
      const batchObj = await this.$batchGetDictItemList(dictCodeList)
      this.ICIS_DICT_NURSE_DIAG = batchObj['ICIS_DICT_NURSE_DIAG']
    },
    defaultRegionChange(wardCode) {
      this.defaultRegion = wardCode
      this.getNurseDiagData()
    },
    /**
     * 获取病区对应的病情分类数据
     */
    getNurseDiagData() {
      this.nurseDiagList = []
      this.nurseDiagDetailList = []
      this.currNurseDiagId = ''
      if (this.defaultRegion == '') return
      nurseDiag_findWithPage({
        wardCode: this.defaultRegion,
        pageSize: 100,
        pageNum: 1
      }).then(res => {
        this.nurseDiagList = res.data.result
        if (this.nurseDiagList.length) {
          this.selectConsuitType(this.nurseDiagList[0])
          this.$refs.groupInfoDivTable.setCurrentRow(this.nurseDiagList[0])
        }
      })
    },
    /**
     * 获取护理计划模板配置最大号
     */
    consuitGetMaxSort() {
      const maxSort = Math.max(...map(this.nurseDiagList, 'sortNo'))
      return maxSort > 0 ? maxSort + 1 : 1
    },
    /**
     * 新增护理计划模板配置
     */
    async addConsuitType() {
      if (this.nurseDiagList && this.nurseDiagList.filter(item => item.isEdit).length) {
        this.$message({
          type: 'warning',
          message: '完成当前编辑'
        })
        return
      }
      const sortNo = await this.consuitGetMaxSort()
      const row = {
        isEdit: true,
        isCreate: true,
        dictCode: '',
        wardCode: this.defaultRegion,
        sortNo: sortNo
      }
      this.nurseDiagList.unshift(row)
    },
    /**
     * 取消护理计划模板配置编辑
     */
    cancelNurseDiagRow(row, index) {
      if (row.isCreate) {
        row.isEdit = false
        this.nurseDiagList.splice(index, 1)
      } else {
        row.isEdit = false
        this.nurseDiagList[index] = this.currNurseDiagRow
      }
      this.nurseDiagList = [...this.nurseDiagList]
    },
    /**
     * 保存当前分析编辑
     */
    saveNurseDiagRow(row, index) {
      if (row.dictCode == '' || !row.sortNo) {
        this.$message({
          type: 'warning',
          message: '护理诊断编码，序号 为必填项'
        })
        return
      }
      const query = {
        dictCode: row.dictCode,
        wardCode: row.wardCode,
        sortNo: row.sortNo,
        dictName: this.filterArrValue(row.dictCode, this.ICIS_DICT_NURSE_DIAG, 'dictCode', 'dictName')
      }
      if (row.isCreate) {
        nurseDiag_insert(query).then(res => {
          row.isEdit = false
          row.isCreate = false
          this.$message({
            type: 'success',
            message: '新增成功'
          })
          this.getNurseDiagData()
        })
      } else {
        query.nurseDiagId = row.nurseDiagId
        nurseDiag_edit(query).then(res => {
          row.isEdit = false
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.getNurseDiagData()
        })
      }
    },
    /**
     * 修改当前行编辑
     */
    modifyNurseDiagRow(row, index) {
      if (this.nurseDiagList && this.nurseDiagList.filter(item => item.isEdit).length) {
        this.$message({
          type: 'warning',
          message: '完成当前编辑'
        })
        return
      }
      this.currNurseDiagRow = JSON.parse(JSON.stringify(row))
      row.isEdit = true
      this.nurseDiagList = [...this.nurseDiagList]
    },
    /**
     * 删除当前行编辑
     */
    deleteNurseDiagRow(row, index) {
      if (row.isCreate) {
        this.cancelNurseDiagRow(row, index)
        return
      }
      const query = { ...row }
      query.statusDict = row.statusDict == 1 ? '0' : '1'
      nurseDiag_edit(query).then(res => {
        this.$message({
          type: 'success',
          message: +row.statusDict ? '已禁用' : '已启用'
        })
        this.getNurseDiagData()
      })
    },
    /**
     * 选中当前行
     */
    selectConsuitType(e) {
      if (e.isCreate) {
        this.nurseDiagDetailList = []
        return
      }
      this.currNurseDiagId = e.id
      this.getProgramList()
    },
    /**
     * 获取项目致因及护理措施目标配置列表
     */
    getProgramList() {
      nurseDiagDetail_getByNurseDiagId(this.currNurseDiagId).then(res => {
        this.nurseDiagDetailList = res.data || []
      })
    },
    /**
     * 返回最大项目排序号
     */
    getProgramSort() {
      const maxSort = Math.max(...map(this.nurseDiagDetailList, 'sortNo'))
      return maxSort > 0 ? maxSort + 1 : 1
    },
    /**
     * 添加分类
     */
    async addProgram() {
      if (this.nurseDiagDetailList.length && this.nurseDiagDetailList.filter(item => item.isEdit).length) {
        this.$message({
          type: 'warning',
          message: '完成当前编辑'
        })
        return
      }
      const sortNo = await this.getProgramSort()
      const newProgram = {
        isEdit: true,
        isCreate: true,
        nurseDiagId: this.currNurseDiagId,
        nurseReason: '',
        nurseMeasure: '',
        nurseTarget: '',
        sortNo: sortNo
      }
      this.nurseDiagDetailList.unshift(newProgram)
    },
    /**
     * 取消致因及护理措施目标配置编辑
     */
    cancelNurseDiagDetailRow(row, index) {
      if (row.isCreate) {
        row.isEdit = false
        row.isCreate = false
        this.nurseDiagDetailList.splice(index, 1)
      } else {
        row.isEdit = false
        this.nurseDiagDetailList[index] = this.currNurseDiagRow
      }
      this.nurseDiagDetailList = [...this.nurseDiagDetailList]
    },
    /**
     * 保存致因及护理措施目标配置编辑
     */
    saveNurseDiagDetailRow(row, index) {
      if (row.nurseMeasure == '' || row.nurseTarget == '' || !row.sortNo) {
        this.$message({
          type: 'warning',
          message: '护理措施，护理目标，序号为必填项'
        })
        return
      }
      const query = JSON.parse(JSON.stringify(row))
      if (row.isCreate) {
        delete query.isCreate
        delete query.isEdit
        nurseDiagDetail_insert(query).then(res => {
          row.isEdit = false
          row.isCreate = false
          this.$message({
            type: 'success',
            message: '新增成功'
          })
          this.getProgramList()
        })
      } else {
        delete query.isCreate
        delete query.isEdit
        nurseDiagDetail_edit(query).then(res => {
          row.isEdit = false
          row.isCreate = false
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.getProgramList()
        })
      }
    },
    /**
     * 修改致因及护理措施目标配置当前行编辑
     */
    modifyNurseDiagDetailRow(row, index) {
      if (this.nurseDiagDetailList.length && this.nurseDiagDetailList.filter(item => item.isEdit).length) {
        this.$message({
          type: 'warning',
          message: '完成当前编辑'
        })
        return
      }
      this.currNurseDiagRow = JSON.parse(JSON.stringify(row))
      row.isEdit = true
      this.nurseDiagDetailList = [...this.nurseDiagDetailList]
    },
    /**
     * 删除致因及护理措施目标配置当前行编辑
     */
    deleteNurseDiagDetailRow(row, index) {
      if (row.isCreate) {
        this.cancelNurseDiagDetailRow(row, index)
        return
      }
      this.$confirm('您确定要删除吗？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        nurseDiagDetail_deleteById(row.id).then(res => {
          this.$message({
            type: 'success',
            message: res.msg || '删除功能'
          })
          this.getProgramList()
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法

$border-right: 2px solid rgba(203, 215, 238, 0.3);

#consutingSet {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  background: #fff;
  overflow-x: hidden;

  ::v-deep .el-table .el-table__row .el-input__inner {
    padding-right: 30px;
  }

  .icuArea {
    flex: 1;
    min-width: 300px;
    border-right: $border-right;
    padding: 10px;
    display: block;
    height: 100%;
  }

  .classDiv {
    flex: 1;
    min-width: 350px;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 10px;
    border-right: $border-right;
    overflow: hidden;
    position: relative;
  }

  .groupInfoDiv {
    flex: 2;
    width: fit-content;
    min-width: 480px;
    border-right: $border-right;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 10px;
    display: flex;
    flex-direction: column;
  }

  .moniitemDiv {
    width: fit-content;
    min-width: 350px;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 10px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .dialog-footer {
    text-align: right !important;
  }
}
</style>
