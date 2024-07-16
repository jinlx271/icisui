<!-- 评估表配置 -->
<template>
  <div id="evaluationFormConfig" class="evaluationFormConfig" element-loading-text="加载中" v-loading="loading">
    <!-- 左侧内容 -->
    <el-container class="evaluationFormConfig_left">
      <el-header>
        <i class="iconBlue"></i>
        <span>ICU病区</span>
      </el-header>
      <el-main>
        <el-table
          @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
          :show-header="false" :data="workSapces" ref="workSapces" @row-click="changeTableLeft" fit highlight-current-row>
          <v-table-column prop="wardName" :show-overflow-tooltip="true"></v-table-column>
        </el-table>
      </el-main>
    </el-container>
    <!-- 中间内容 -->
    <el-container class="evaluationFormConfig_center" style="height:100%">
      <el-header>
        <i class="iconBlue"></i>
        <span>评估表列表</span>
      </el-header>
      <el-main style="height:calc(100% - 120px)">
        <div class="queryDiv">
          <el-input @keyup.enter.native="queryCenterTable" @input="debounceFC" v-model="centerQueryData.searchKey"
            class="input" size="small" clearable placeholder="评估表编码/说明" suffix-icon="el-icon-search"></el-input>
          <el-checkbox v-model="centerQueryData.statusDict" true-label="" false-label="1" @input="debounceFC"
            class="pl-5 ">
            显示禁用
          </el-checkbox>
          <el-button @click.native.prevent="addTable" type="primary" size="mini">新 增</el-button>
        </div>
        <div style="height:calc(100% - 42px)">
          <el-table
            @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
            height="100%" ref="centerTableData" :row-class-name="({ row }) => row.statusDict == 0 ? 'disabled' : ''"
            :data="centerTableData" border @row-click="changeTableCenter" highlight-current-row>
            <v-table-column label="表单排序" prop="formNo">
              <template slot-scope="scope">
                <el-input-number v-if="!scope.row.updateOrSave" v-model="scope.row.formSort" style="width:100%" :min="1"
                  :max="999" placeholder="请输入" />
                <span v-else>{{ scope.row.formSort }}</span>
              </template>
            </v-table-column>
            <v-table-column label="评估表编码" prop="formCode"></v-table-column>
            <v-table-column label="评估表名称" prop="formName"></v-table-column>
            <v-table-column label="评估表说明" prop="remark"></v-table-column>
            <v-table-column label="优先级" prop="sortNo">
              <template slot-scope="scope">
                <el-select v-if="!scope.row.updateOrSave" v-model="scope.row.sortNo" placeholder="请选择">
                  <el-option v-for="item in sortNoList" :key="item.value" :label="item.label"
                    :value="item.value"></el-option>
                </el-select>
                <span v-else>{{ scope.row.sortNo }}</span>
              </template>
            </v-table-column>

            <v-table-column label="操作" width="80">
              <template slot-scope="scope">
                <el-button v-if="scope.row.updateOrSave" @click.native.prevent="enableDisable(scope.row, scope.$index)"
                  :style="{ color: scope.row.statusDict == 1 ? '#EC0000' : '#00AB44' }" type="text" size="small"
                  class="redCss">{{+scope.row.statusDict ? '禁用' : '启用' }}</el-button>
                <el-button v-if="scope.row.updateOrSave" @click.native.prevent="updateRow(scope.row, scope.$index)"
                  style="color:#E6A23C" type="text" size="small">修改</el-button>
                <el-button v-if="!scope.row.updateOrSave" @click.native.prevent="cancelTable(scope.row, scope.$index)"
                  style="color:#909399" type="text" size="mini">取消</el-button>
                <el-button v-if="!scope.row.updateOrSave" @click.native.prevent="saveRow(scope.row, scope.$index)"
                  type="text" size="small">保存</el-button>
              </template>
            </v-table-column>
          </el-table>
        </div>
      </el-main>
      <el-footer>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="centerQueryData.pageNum" :page-size="centerQueryData.pageSize" :hide-on-single-page="false"
          background :page-sizes="[10, 15, 20, 25, 30]" layout="total, sizes, prev, pager, next"
          :total="totolCount"></el-pagination>
      </el-footer>
    </el-container>
    <!-- 右侧内容 -->
    <el-container class="evaluationFormConfig_right">
      <div class="half">
        <el-header>
          <i class="iconBlue"></i>
          <span>评估表风险及评估频次设置</span>
        </el-header>
        <el-main class="evaluationFormConfig_right_body">
          <el-card class="box-card" v-for="(item, index) in tableDataRisk" :key="item.configureName">
            <div slot="header" class="clearfix">
              <span>{{ item.configureName }}</span>
              <el-checkbox style="float: right" :label="true" v-model="item.radio"
                @change.native="rightRadioClick(item, index)">&nbsp;</el-checkbox>
            </div>
            <el-table
              @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
              ref="table" border :data="item.details">
              <v-table-column label="风险级别" prop="riskCode">
                <template slot-scope="scope">{{ riskFc(scope.row.riskCode) }}</template>
              </v-table-column>
              <v-table-column label="评估分数范围（X）" prop="expression"></v-table-column>
              <v-table-column label="下次评估间隔" prop="nextInterval">
                <template slot-scope="scope">
                  {{ scope.row.nextInterval }}
                  {{ scope.row.riskIntervalUnitName }}
                </template>
              </v-table-column>
              <v-table-column label="风险颜色" align="center" prop="color">
                <template slot-scope="scope">
                  <el-color-picker :disabled="true" v-model="scope.row.color"></el-color-picker>
                </template>
              </v-table-column>
            </el-table>
          </el-card>
        </el-main>
      </div>
      <div class="half">
        <el-header>
          <i class="iconBlue"></i>
          <span>评估表首次提醒配置</span>
        </el-header>
        <el-main v-if="tableDataFirst.length > 0" class="evaluationFormConfig_right_body">
          <el-card class="box-card" v-for="(item, index) in tableDataFirst" :key="item.reminderName">
            <div slot="header" class="clearfix">
              <span>{{ item.reminderName }}</span>
              <el-checkbox style="float: right" :label="true" v-model="item.radio"
                @change.native="rightRadioFirstClick(item, index)">&nbsp;</el-checkbox>
            </div>
            <el-table
              @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
              ref="table1" border :data="[item]">
              <v-table-column label="锚定类型" prop="anchorTimeType">
                <template slot-scope="scope">{{ firstTimeTypeFc(scope.row.anchorTimeType) }}</template>
              </v-table-column>
              <v-table-column label="首次评估时限" prop="anchorTimeInterval"></v-table-column>
              <v-table-column label="锚点时间单位" prop="anchorTimeUnit">
                <template slot-scope="scope">{{ firstTimeUnitFc(scope.row.anchorTimeUnit) }}</template>
              </v-table-column>
            </el-table>
          </el-card>
        </el-main>
        <el-main v-else class="evaluationFormConfig_right_body">
          <el-empty style="padding:0" description="暂无数据" :image-size="100"></el-empty>
        </el-main>
      </div>
      <div class="half">
        <el-header>
          <i class="iconBlue"></i>
          <span>评估表分数描述及治疗设置</span>
        </el-header>
        <el-main v-if="tableDataTreatment.length > 0" class="evaluationFormConfig_right_body">
          <el-card class="box-card" v-for="(item, index) in tableDataTreatment" :key="item.treatmentName">
            <div slot="header" class="clearfix">
              <span>{{ item.treatmentName }}</span>
              <el-checkbox style="float: right" :label="true" v-model="item.radio"
                @change.native="rightRadioTreatmentClick(item, index)">&nbsp;</el-checkbox>
            </div>
            <el-table
              @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
              ref="table1" border :data="item.details">
              <v-table-column label="评估分数描述" prop="scoreDesc"></v-table-column>
              <v-table-column label="评估分数范围（X）" prop="expression"></v-table-column>
              <v-table-column label="需治疗" prop="needTreatment">
                <template slot-scope="scope">
                  <i v-if="scope.row.needTreatment == '1'" class="el-icon-check"></i>
                </template>
              </v-table-column>
            </el-table>
          </el-card>
        </el-main>
        <el-main v-else class="evaluationFormConfig_right_body">
          <el-empty style="padding:0" description="暂无数据" :image-size="100"></el-empty>
        </el-main>
      </div>
    </el-container>

    <!-- 左侧新增的弹框 -->
    <el-dialog :close-on-click-modal="false" :title="dialogName" :visible.sync="dialogVisible" width="750px"
      :before-close="hideDialog">
      <!-- 新增列表 -->
      <div v-if="dialogShow == '1'" class="add">
        <el-input @keyup.enter.native="queryDialogFc" @input="debounceFC2" v-model="dialogQueryData.searchKey"
          size="small" clearable placeholder="评估表编码/说明" suffix-icon="el-icon-search"></el-input>
        <div style="height:calc(100% - 47px)">
          <el-table style="margin-bottom:5px;" height="100%"
            @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
            ref="table2" :data="dialogData" border>
            <v-table-column label="评估表编码" prop="formCode"></v-table-column>
            <v-table-column label="评估表名称" prop="formName"></v-table-column>
            <v-table-column label="评估表说明" prop="remark"></v-table-column>
            <v-table-column label="操作" width="80">
              <template slot-scope="scope">
                <el-button @click.native.prevent="configureDialog(scope.row, scope.$index)" type="text" size="small">配
                  置</el-button>
              </template>
            </v-table-column>
          </el-table>
        </div>
      </div>
      <!-- 评估表风险及评估频次设置 -->
      <div v-if="dialogShow == '2'" class="configure">
        <el-card class="box-card" v-for="(item, index) in configureList" :key="item.configureName">
          <div slot="header" class="clearfix">
            <span>{{ item.configureName }}</span>
            <el-checkbox style="float: right" :label="true" v-model="item.radio"
              @change.native="radioClick(item, index)">&nbsp;</el-checkbox>
          </div>
          <el-table
            @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
            ref="table3" border :data="item.details">
            <v-table-column label="风险级别" prop="riskCode">
              <template slot-scope="scope">{{ riskFc(scope.row.riskCode) }}</template>
            </v-table-column>
            <v-table-column label="评估分数范围（X）" prop="expression"></v-table-column>
            <v-table-column label="下次评估间隔" prop="nextInterval">
              <template slot-scope="scope">
                {{ scope.row.nextInterval }}
                {{ scope.row.riskIntervalUnitName }}
              </template>
            </v-table-column>
            <v-table-column label="风险颜色" prop="color">
              <template slot-scope="scope">
                <el-color-picker :disabled="true" v-model="scope.row.color"></el-color-picker>
              </template>
            </v-table-column>
          </el-table>
        </el-card>
      </div>
      <!-- 评估表首次提醒配置 -->
      <div v-if="dialogShow == '3'" class="configure">
        <el-card class="box-card" v-for="(item, index) in firstTimeList" :key="item.reminderName">
          <div slot="header" class="clearfix">
            <span>{{ item.reminderName }}</span>
            <el-checkbox style="float: right" :label="true" v-model="item.radio"
              @change.native="firstTimeClick(item, index)">&nbsp;</el-checkbox>
          </div>
          <el-table
            @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
            ref="table4" border :data="[item]">
            <v-table-column label="锚定类型" prop="anchorTimeType">
              <template slot-scope="scope">{{ firstTimeTypeFc(scope.row.anchorTimeType) }}</template>
            </v-table-column>
            <v-table-column label="首次评估时限" prop="anchorTimeInterval"></v-table-column>
            <v-table-column label="锚点时间单位" prop="anchorTimeUnit">
              <template slot-scope="scope">{{ firstTimeUnitFc(scope.row.anchorTimeUnit) }}</template>
            </v-table-column>
          </el-table>
        </el-card>
      </div>
      <!-- 评估表分数描述及治疗设置 -->
      <div v-if="dialogShow == '4'" class="configure">
        <el-card class="box-card" v-for="(item, index) in treatmentList" :key="item.treatmentName">
          <div slot="header" class="clearfix">
            <span>{{ item.treatmentName }}</span>
            <el-checkbox style="float: right" :label="true" v-model="item.radio"
              @change.native="treatmentClick(item, index)">&nbsp;</el-checkbox>
          </div>
          <el-table
            @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
            ref="table5" border :data="item.details">
            <v-table-column label="评估分数描述" prop="scoreDesc"></v-table-column>
            <v-table-column label="评估分数范围（X）" prop="expression"></v-table-column>
            <v-table-column label="需治疗" prop="needTreatment">
              <template slot-scope="scope">
                <i v-if="scope.row.needTreatment == '1'" readonly class="el-icon-check"></i>
              </template>
            </v-table-column>
          </el-table>
        </el-card>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="hideDialog">取消</el-button>
        <el-button type="primary" v-if="netFcFlag" @click="netFc">下一步</el-button>
        <el-button type="primary" v-else @click="addDialog">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  icuWard_findWithPage, // 病区获取
  config_listFormWithout, // 根据病区获取未配置已启用的评估表列表
  config_listPage, // 根据病区获取配置的分页评估表列表
  config_add, // 保存单个病区评估表关系
  config_updateRiskFrequency, // 更新病区评估表配置选定的风险频次
  config_updateReminder, // 更新病区评估表配置选定首次提醒配置
  riskfrequency_list, // 风险频次列表数据
  firstReminder_list, // 首次提醒配置列表
  treatmentconfig_list, // 评估表分数描述及治疗设置-列表数据
  dictItem_findWithPage, // 风险等级字典
  config_updateSortNo, // 修改病区配置评估表数据-自定义排序
  config_enable, // 启用
  config_disable, // 禁用
  config_updateTreatment // 评估表分数描述及治疗设置-使用那个配置
} from '@/api/configuration'
import _ from 'lodash'
export default {
  name: 'EvaluationFormConfig',
  components: {},
  data: function () {
    return {
      loading: false, // 表格的loding
      wardCode: '', // 选择的病区
      workSapces: [], // 病区集合

      centerQueryData: {
        statusDict: '',
        pageNum: 1,
        pageSize: 15,
        searchKey: '', // input输入类容
        wardCode: '' // 病区编码
      },
      oldTableDataOne: {}, // 取消用到
      totolCount: 0, // 分页总量
      centerTableData: [], // 中间表格数据
      sortNoList: [
        { label: 1, value: 1 },
        { label: 2, value: 2 },
        { label: 3, value: 3 },
        { label: 4, value: 4 },
        { label: 5, value: 5 },
        { label: 6, value: 6 },
        { label: 7, value: 7 },
        { label: 8, value: 8 }
      ],

      dialogVisible: false, // 新增表单框显示隐藏
      dialogShow: '1', // 1新增列表 |2配置风险评估 | 3首次评估选择|4 配置分数描述及治疗
      dialogName: '新增列表',
      netFcFlag: false,
      dialogQueryData: {
        wardCode: '', // 病区编码
        searchKey: '' // input输入类容
      }, // 新增弹框的对象
      dialogData: [], // 新增表单弹框集合
      configureList: [], // 配置风险评估集合
      firstTimeList: [], // 配置首次评估
      treatmentList: [], // 配置评估表分数描述及治疗设置
      riskList: [], // 风险等级字典
      tableDataRisk: [], // 右边表格数据
      tableDataFirst: [], // 首次提醒数据
      tableDataTreatment: [] // 评估表分数描述及治疗设置
    }
  },
  props: {},
  watch: {},
  computed: {
    ...mapGetters(['currentUserWard'])
  },
  async created() {
    // 截流
    this.debounceFC = _.debounce(() => {
      this.centerQueryData.pageNum = 1 // 输入的时候需要改为第一页
      this.queryCenterTable() // 输入框截流
    }, 800)
    // 截流
    this.debounceFC2 = _.debounce(() => {
      this.queryDialogFc() // 输入框截流
    }, 800)
    // 风险等级字典
    this.riskList = await this.getDictItems('ICIS_DICT_ASSESS_RISK_LEVEL')
    this.init()
  },
  mounted() { },
  methods: {
    // 初始化//////////////////////////
    /**
     * 初始化
     */
    init() {
      // 获取病区
      icuWard_findWithPage({
        pageNum: 1,
        pageSize: 1000,
        userName: '',
        searchKey: ''
      }).then(res => {
        this.workSapces = res.data.result
        // 默认选第一个
        this.$nextTick(req => {
          if (this.workSapces && this.workSapces.length > 0) {
            this.workSapces.map(item => {
              if (item.wardCode == this.currentUserWard.wardCode) {
                this.$refs.workSapces.setCurrentRow(item) // 默认点击第一个 样式
                this.changeTableLeft(item) // 默认点击第一个 数据交互
              }
            })
          }
        })
      })
    },
    /**
     * 获取对应字典项
     */
    getDictItems(dictGroupCode) {
      return new Promise((resolve, reject) => {
        dictItem_findWithPage({
          dictGroupCode: dictGroupCode,
          pageSize: 100,
          pageNum: 1
         }).then(res => {
          if (res.code == 0 && res.data.result.length > 0) {
            resolve(res.data.result)
          } else {
            reject([])
          }
        })
      })
    },
    /**
     * 风险字典匹配
     */
    riskFc(val) {
      return this.riskList.filter(res => {
        return res.dictCode == val
      })[0].dictName
    },
    // 左边//////////////////////////
    /**
     * 左表格-病区选择
     */
    changeTableLeft(e) {
      this.wardCode = e.wardCode
      this.centerQueryData.wardCode = e.wardCode
      this.queryCenterTable() // 获取中间表数据
    },
    /**
     * 获取中间表数据
     */
    queryCenterTable() {
      // 中间列表
      config_listPage(this.centerQueryData).then(res => {
        res.data.result.map(item => {
          item.updateOrSave = true
        })
        this.centerTableData = res.data.result // 中间表格数据集合
        this.$nextTick(req => {
          if (this.centerTableData && this.centerTableData.length > 0) {
            this.$refs.centerTableData?.setCurrentRow(this.centerTableData[0])
            this.changeTableCenter(this.centerTableData[0])
          } else {
            this.tableDataRisk = []
            this.tableDataFirst = []
            this.tableDataTreatment = []
          }
        })
        this.totolCount = res.data.totolCount // 中间表格总条数
      })
    },
    // 中间//////////////////////////
    /**
     * 中表格-新增
     */
    addTable() {
      if (!this.testing()) {
        // 检测是否可以修改
        return
      }
      this.dialogQueryData.searchKey = ''
      this.dialogQueryData.wardCode = this.wardCode
      this.queryDialogFc() // 获取弹框数据
      this.dialogVisible = true
    },
    /**
     * 中表格-启用禁用
     */
    enableDisable(item, index) {
      if (!this.testing()) {
        // 检测是否可以修改
        return
      }
      let queryFc = config_enable // 默认启用
      if (item.statusDict == '1') {
        // 如果是已经是启用.禁用方法
        queryFc = config_disable
      }
      queryFc({ id: item.id }).then(res => {
        // this.queryCenterTable() // 获取中间表数据
        item.statusDict = item.statusDict == '1' ? '0' : '1'
        this.$message({
          message: item.statusDict == '0' ? '禁用成功!' : '启用成功',
          type: 'success'
        })
      })
    },
    /**
     * 中间表格-修改
     */
    updateRow(item, index) {
      if (!this.testing()) {
        // 检测是否可以修改
        return
      }
      item.updateOrSave = false
      this.oldTableDataOne = JSON.parse(JSON.stringify(item))
    },
    /**
     * 中间表格-取消
     */
    cancelTable(item, index) {
      this.$set(this.centerTableData, index, {
        ...JSON.parse(JSON.stringify(this.oldTableDataOne)),
        updateOrSave: true
      })
    },
    /**
     * 中间表格-保存
     */
    saveRow(item, index) {
      config_updateSortNo({
        id: item.id,
        sortNo: item.sortNo,
        formSort: item.formSort
      }).then(res => {
        this.$message({
          message: '修改成功!',
          type: 'success'
        })
        this.queryCenterTable() // 获取中间表数据
      })
    },
    /**
     * 中间表格-翻页 一页总条数
     */
    handleSizeChange(num) {
      this.centerQueryData.pageNum = 1
      this.centerQueryData.pageSize = num
      this.queryCenterTable()
    },
    /**
     * 中间表格-翻页
     */
    handleCurrentChange(num) {
      this.centerQueryData.pageNum = num
      this.queryCenterTable()
    },
    /**
     * 中表格-单条选择
     */
    changeTableCenter(e) {
      riskfrequency_list({
        statusDict: 1,
        formId: e.formId
      }).then(res => {
        res.data.map(item => {
          item.radio = item.id === e.configureId
          item.details.map(item2 => {
            item2.color = item2.color || '#E7086E'
          })
        })
        this.tableDataRisk = res.data
      })
      firstReminder_list({
        statusDict: 1,
        formId: e.formId
      }).then(res => {
        res.data.map(item => {
          item.radio = item.id === e.reminderId
        })
        this.tableDataFirst = res.data
      })
      treatmentconfig_list({
        statusDict: 1,
        formId: e.formId
      }).then(res => {
        res.data.map(item => {
          item.radio = item.id === e.treatmentId
        })
        this.tableDataTreatment = res.data
      })
    },
    // 右边部分//////////////////////////
    /**
     * 右边表格-点击radio事件
     */
    rightRadioClick(item, index) {
      // 取消不要管
      if (!item.radio) {
        this.$message({
          message: '无法取消配置!',
          type: 'warning'
        })
        item.radio = true
        return
      }
      // 清除前面的选择
      this.tableDataRisk.map(item => {
        item.radio = false
      })
      // 当前选择上
      item.radio = true
      // 获取中间表的id
      const centerTableData = this.centerTableData.filter(res => {
        return res.formId == item.formId
      })[0]
      config_updateRiskFrequency({
        id: centerTableData.id,
        configureId: item.id
      }).then(res => {
        centerTableData.configureId = item.id
        this.$message({
          message: '配置成功!',
          type: 'success'
        })
      })
    },
    // 弹框部分//////////////////////////
    /**
     * 弹框获取数据
     */
    queryDialogFc() {
      config_listFormWithout(this.dialogQueryData).then(res => {
        this.dialogData = res.data
      })
    },
    /**
     * 弹框-新增表单的-隐藏
     */
    hideDialog() {
      if (this.dialogShow == '1') {
        this.queryCenterTable() // 去拿取中间表单数据
        this.dialogVisible = false
      } else {
        this.configureList = [] // 清除之前配置的风险评估
        this.firstTimeList = [] // 清除之前配置的首次评估
        this.treatmentList = [] // 清除之前配置的分数描述及治疗
        this.dialogShow = '1'
        this.dialogName = '新增列表'
        this.netFcFlag = false
      }
    },
    /**
     * 弹框-配置风险评估
     */
    configureDialog(item, index) {
      // 风险频次是必填
      riskfrequency_list({
        statusDict: 1,
        formId: item.id
      }).then(res => {
        // 配置失败
        if (res.data.length < 1) {
          this.$confirm(
            '配置失败(评估表没有设置评估风险和频次)，是否前往评估表配置?',
            '确认信息',
            {
              confirmButtonText: '前 往',
              cancelButtonText: '取 消'
            }
          )
            .then(res => {
              this.$router.push({
                path: '/configuration/evaluationForms/areaEvaluationForm',
                query: this.$route.query
              })
            })
            .catch(() => {
              return
            })
          return
        }
        this.dialogShow = '2' // 显示风险及评估频次
        this.dialogName = '选择评估表风险及评估频次'
        // 配置 风险及评估频次
        res.data.map((item, index) => {
          item.radio = !index
          item.index = index
          item.details.map(item2 => {
            item2.color = item2.color || '#E7086E'
          })
          this.configureList.push(item)
        })
        // 首次
        firstReminder_list({
          statusDict: 1,
          formId: item.id
        }).then(res => {
          if (res.data.length > 0) {
            this.netFcFlag = true
          }
          res.data.map((item, index) => {
            item.radio = !index
            item.index = index
            this.firstTimeList.push(item)
          })
        })
        // 分数描述及治疗
        treatmentconfig_list({
          statusDict: 1,
          formId: item.id
        }).then(res => {
          if (res.data.length > 0) {
            this.netFcFlag = true
          }
          res.data.map((item, index) => {
            item.radio = !index
            item.index = index
            this.treatmentList.push(item)
          })
        })
      })
    },
    /**
     * 弹框-风险评估单选按钮
     */
    radioClick(item, index) {
      // 取消不要管
      if (!item.radio) {
        return
      }
      // 清除前面的选择
      this.configureList.map(item => {
        item.radio = false
      })
      // 当前选择上
      item.radio = true
    },
    /**
     * 弹框-风险评估单 保存
     */
    addDialog() {
      // 获取选择的配置
      const item = this.configureList.filter(res => {
        return res.radio
      })
      // 首次提醒id
      let firstTimeId = []
      if (this.firstTimeList.length > 0) {
        // 获取选择的配置
        firstTimeId = this.firstTimeList.filter(res => {
          return res.radio
        })
        if (firstTimeId && firstTimeId[0] && firstTimeId[0].id) {
          firstTimeId = firstTimeId[0].id
        } else {
          firstTimeId = ''
        }
      } else {
        firstTimeId = ''
      }
      // 描述和治疗
      let treatmentId = []
      if (this.treatmentList.length > 0) {
        // 获取选择的配置
        treatmentId = this.treatmentList.filter(res => {
          return res.radio
        })
        if (treatmentId && treatmentId[0] && treatmentId[0].id) {
          treatmentId = treatmentId[0].id
        } else {
          treatmentId = ''
        }
      } else {
        treatmentId = ''
      }
      // 丢给新增表格
      if (item && item[0] && item[0].radio) {
        this.dialogData[item[0].index].formId = item[0].formId // id
        this.dialogData[item[0].index].configureName = item[0].configureName // 名称
        this.dialogData[item[0].index].reminderId = firstTimeId // 首次提醒id
        this.dialogData[item[0].index].treatmentId = treatmentId // 描述和治疗id
        this.saveDialog(
          this.dialogData[item[0].index],
          item[0].id,
          item[0].index
        )
        return
      }
      this.$message({
        message: '请选择配置!',
        type: 'warning'
      })
    },
    /**
     * 弹框-新增表单的-提交
     */
    saveDialog(item, id, index) {
      config_add({
        wardCode: this.wardCode, // 病区
        formId: item.formId, // 需要新增的表单id
        configureId: id, // 评估表风险及评估频次设置
        reminderId: item.reminderId, // 首次评分
        treatmentId: item.treatmentId // 描述和治疗
      }).then(res => {
        this.$message({
          message: '新增成功!',
          type: 'success'
        })
        this.dialogData.splice(index, 1) // 不请求数据了.直接删除就行
        this.dialogShow = '1'
        this.dialogName = '新增表单'
        this.netFcFlag = false
        this.configureList = [] // 清除之前配置的风险评估
        this.firstTimeList = [] // 清楚之前配置的首次提醒
        this.hideDialog()
      })
    },
    /**
     * 检测
     */
    testing() {
      for (let i = 0; this.centerTableData.length > i; i++) {
        if (!this.centerTableData[i].updateOrSave) {
          this.$message.error(
            `请先保存＂${this.centerTableData[i].formName}＂这条数据！`
          )
          return false
        }
      }
      return true
    },
    /**
     * 弹框-配置风险评估
     */
    netFc(item, index) {
      switch (this.dialogShow) {
        case '2':
          if (this.firstTimeList.length > 0) {
            this.dialogShow = '3' // 显示评估列表
            this.dialogName = '配置评估表首次提醒' // 显示评估列表
            this.netFcFlag = this.treatmentList.length > 0
            return
          }
          if (this.treatmentList.length > 0) {
            this.dialogShow = '4' // 显示评估列表
            this.dialogName = '配置分数描述及治疗' // 显示评估列表
            this.netFcFlag = false
            return
          }
          break
        case '3':
          if (this.treatmentList.length > 0) {
            this.dialogShow = '4' // 显示评估列表
            this.dialogName = '配置分数描述及治疗' // 显示评估列表
            this.netFcFlag = false
          }
          break
      }
    },
    /**
     * 类型名字
     */
    firstTimeTypeFc(val) {
      switch (val) {
        case '1':
          return '入区时间'
      }
    },
    /**
     * 单位名字
     */
    firstTimeUnitFc(val) {
      switch (val) {
        case '1':
          return '天'
        case '2':
          return '时'
      }
    },
    /**
     * 弹框-风险评估单选按钮
     */
    firstTimeClick(item, index) {
      // 取消不要管
      if (!item.radio) {
        return
      }
      // 清除前面的选择
      this.firstTimeList.map(item => {
        item.radio = false
      })
      // 当前选择上
      item.radio = true
    },
    /**
     * 弹框-分数描述及治疗
     */
    treatmentClick(item, index) {
      // 取消不要管
      if (!item.radio) {
        return
      }
      // 清除前面的选择
      this.treatmentList.map(item => {
        item.radio = false
      })
      // 当前选择上
      item.radio = true
    },
    /**
     * 右边表格-点击radio事件-首次提醒
     */
    rightRadioFirstClick(item, index) {
      // 获取中间表的id
      const centerTableData = this.centerTableData.filter(res => {
        return res.formId == item.formId
      })[0]
      let reminderId = '' // 传空 后台就会清空配置
      if (item.radio) {
        // 清除前面的选择
        this.tableDataFirst.map(item => {
          item.radio = false
        })
        // 当前选择上
        item.radio = true
        reminderId = item.id
      }
      config_updateReminder({
        id: centerTableData.id,
        reminderId: reminderId
      }).then(res => {
        centerTableData.reminderId = reminderId
        this.$message({
          message: '配置成功!',
          type: 'success'
        })
      })
    },
    /**
     * 右边表格-点击radio事件-评估表分数描述及治疗设置
     */
    rightRadioTreatmentClick(item, index) {
      // 获取中间表的id
      const centerTableData = this.centerTableData.filter(res => {
        return res.formId == item.formId
      })[0]
      let treatmentId = ''
      if (item.radio) {
        // 清除前面的选择
        this.tableDataTreatment.map(item => {
          item.radio = false
        })
        if (item.details?.length < 1) {
          this.$message({
            message: '评估表分数描述及治疗设置详情项未配置！',
            type: 'warning'
          })
          return
        }
        // 当前选择上
        item.radio = true
        treatmentId = item.id
      }
      config_updateTreatment({
        id: centerTableData.id,
        treatmentId: treatmentId
      }).then(res => {
        centerTableData.treatmentId = treatmentId == '' ? '' : item.id
        this.$message({
          message: '配置成功!',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.evaluationFormConfig {
  background: #ffffff;
  height: 100%;
  display: flex;
  padding: 0.5% 1%;

  ::v-deep.el-header {
    display: flex;
    align-items: center;
    margin: 0;
    padding: 0;

    .iconBlue {
      display: inline-block;
      width: 3px;
      height: 16px;
      background: var(--maincolor);
    }

    span {
      flex: 1;
      margin-left: 8px;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #000000;
    }
  }

  &_left {
    flex: 1;
    padding-right: 10px;
    border-right: 2px solid #eee;
    margin-right: 10px;

    ::v-deep.el-main {
      margin: 0;
      padding: 0;

      .el-table td {
        border: 0;
        border-radius: 5px;
        padding-left: 5px;
      }

      .el-table::before {
        height: 0;
      }
    }
  }

  &_center {
    flex: 5;
    padding-right: 10px;
    border-right: 2px solid #eee;
    margin-right: 10px;

    .queryDiv {
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      ::v-deep.el-button {
        margin-left: 10px;
      }

      ::v-deep .el-input>.el-input__inner {
        border: none;
        background: #f3f5f9;
        border-radius: 2px;
      }

      .input {
        max-width: 200px;
        margin-right: 10px;
      }
    }

    ::v-deep.el-main {
      margin: 0;
      padding: 0;
    }

    ::v-deep.el-footer {
      margin: 0;
      padding: 0;

      .el-pagination {
        float: right;
        margin-top: 15px;
      }
    }
  }

  &_right {
    flex: 4;
    display: flex;
    flex-direction: column;

    .half {
      height: 33.3%;
    }

    ::v-deep.el-main {
      margin: 0;
      padding: 0;

      .el-card__header {
        padding: 10px;
        background: #eef2fd;
        font-size: 15px;
        font-weight: 600;
      }

      .el-card__body {
        padding: 10px;
      }

      .el-table th {
        background: #fff;
      }

      .box-card {
        margin-bottom: 10px;
      }
    }

    &_body {
      height: calc(100% - 66px);
      overflow: auto;
    }
  }

  ::v-deep.el-dialog {
    .el-dialog__header {
      margin-bottom: 5px;
    }

    .add {
      height: 500px;

      .el-input {
        margin: 5px 0;
      }

      .el-table {
        overflow: auto;
        border-bottom: 1px solid #e4e7ed;
      }

      .el-table::before {
        height: 0;
      }
    }

    .configure {
      max-height: 500px;
      overflow: auto;
      padding-right: 10px;

      .el-card__header {
        padding: 10px;
        background: #eef2fd;
        font-size: 15px;
        font-weight: 600;
      }

      .el-card__body {
        padding: 10px;
      }

      .el-table th {
        background: #fff;
      }

      .box-card {
        margin-bottom: 10px;
      }
    }
  }
}</style>
