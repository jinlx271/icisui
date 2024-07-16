<!-- 评估表配置 -->
<template>
  <el-container id="areaFormConfig" class="areaFormConfig">
    <!-- 左侧菜单 -->
    <div class="areaFormConfig_left">
      <el-container class="areaFormConfig_left_div">
        <el-header class="elHeader1">
          <div>
            <i class="iconBlue"></i>
            <span>评估表列表</span>
          </div>
        </el-header>
        <!-- 表格 -->
        <el-main style="height:calc(100% - 60px)" class="areaFormConfig_left_main" element-loading-text="加载中"
          v-loading="loading">
          <!-- 输入部分 -->
          <div class="areaFormConfig_left_header">
            <el-input @keyup.enter.native="init" @input="debounceFC" class="input" v-model="queryData.searchKey"
              size="small" clearable placeholder="评估表编码/评估表名称" suffix-icon="el-icon-search"></el-input>
            <el-checkbox v-model="queryData.statusDict" true-label="" false-label="1" @input="debounceFC" class="pr-5 ">
              显示禁用
            </el-checkbox>
            <el-button @click.native.prevent="operation('add')" type="primary" size="small">新增表单</el-button>
          </div>
          <div style="height:calc(100% - 41px)">
            <el-table
              @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
              height="100%" ref="tableDataLeft" :data="tableDataLeft" border @row-click="changeTable"
              highlight-current-row>
              <v-table-column label="评估表编码" prop="formCode">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.isEdit || scope.row.isAdd" v-model="scope.row.formCode" placeholder="请输入" />
                  <span v-else>{{ scope.row.formCode }}</span>
                </template>
              </v-table-column>
              <v-table-column label="评估表名称" prop="formName">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.isEdit || scope.row.isAdd" v-model="scope.row.formName" placeholder="请输入" />
                  <span v-else>{{ scope.row.formName }}</span>
                </template>
              </v-table-column>
              <v-table-column label="评估表简称" prop="formAbbr">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.isEdit || scope.row.isAdd" v-model="scope.row.formAbbr" placeholder="请输入" />
                  <span v-else>{{ scope.row.formAbbr }}</span>
                </template>
              </v-table-column>
              <v-table-column label="评估表类型" prop="formAbbr">
                <template slot-scope="scope">
                  <el-select clearable v-if="scope.row.isEdit || scope.row.isAdd" v-model="scope.row.classification"
                    placeholder="请选择">
                    <el-option v-for="item in classification" :key="item.dictCode" :label="item.dictName"
                      :value="item.dictCode"></el-option>
                  </el-select>
                  <span v-else>{{ scope.row.classification | templetDictCodeFc(classification) }}</span>
                </template>
              </v-table-column>
              <v-table-column label="适用类型" prop="applicableType">
                <template slot-scope="scope">
                  <el-select clearable v-if="scope.row.isEdit || scope.row.isAdd" v-model="scope.row.applicableType"
                    placeholder="请选择">
                    <el-option v-for="item in applicableTypeList" :key="item.dictCode" :label="item.dictName"
                      :value="item.dictCode"></el-option>
                  </el-select>
                  <span v-else>{{ scope.row.applicableType | templetDictCodeFc(applicableTypeList) }}</span>
                </template>
              </v-table-column>
              <v-table-column label="评估表说明" prop="remark">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.isEdit || scope.row.isAdd" type="textarea" :rows="3" maxlength="500"
                    size="medium" placeholder="请输入" v-model="scope.row.remark"></el-input>
                  <span v-else>{{ scope.row.remark }}</span>
                </template>
              </v-table-column>
              <v-table-column label="打印模板" prop="templetId">
                <template slot-scope="scope">
                  <el-select clearable v-if="scope.row.isEdit || scope.row.isAdd" v-model="scope.row.templetId"
                    placeholder="请选择">
                    <el-option v-for="(item, index) in tempList" :key="item.id + index" :label="item.tempName"
                      :value="item.id"></el-option>
                  </el-select>
                  <span v-else>{{ scope.row.templetId | templetIdFc(tempList) }}</span>
                </template>
              </v-table-column>
              <v-table-column label="风险等级展示样式" prop="riskLevelDisplayStyle">
                <template slot-scope="scope">
                  <el-select clearable v-if="scope.row.isEdit || scope.row.isAdd"
                    v-model="scope.row.riskLevelDisplayStyle" placeholder="请选择">
                    <el-option label="文字描述" value="1"></el-option>
                    <el-option label="进度条" value="2"></el-option>
                  </el-select>
                  <span v-else>{{ scope.row.riskLevelDisplayStyle | riskLevelDisplayStyleName }}</span>
                </template>
              </v-table-column>
              <v-table-column label="结果类型" prop="finalResult">
                <template slot-scope="scope">
                  <el-select :clearable="false" v-if="scope.row.isEdit || scope.row.isAdd" v-model="scope.row.finalResult"
                    placeholder="请选择">
                    <el-option v-for="item in finalResultList" :key="item.dictCode" :label="item.dictName"
                      :value="item.dictCode"></el-option>
                  </el-select>
                  <span v-else>{{ scope.row.finalResult | templetDictCodeFc(finalResultList) }}</span>
                </template>
              </v-table-column>
              <v-table-column label="操作" width="70" align="center">
                <template slot-scope="scope">
                  <el-button v-if="!scope.row.isEdit && !scope.row.isAdd && scope.row.statusDict == '0'"
                    @click.native.prevent="operation('on', scope.row)" style="color:#00AB44;margin-left: 4px;" type="text"
                    size="small">启用</el-button>
                  <el-button v-if="!scope.row.isEdit && !scope.row.isAdd && scope.row.statusDict != '0'"
                    @click.native.prevent="operation('off', scope.row)" style="color:#EC0000;margin-left: 4px;"
                    type="text" size="small">禁用</el-button>
                  <el-button v-if="!scope.row.isEdit && !scope.row.isAdd"
                    @click.native.prevent="operation('configure', scope.row)" type="text" size="small">配置</el-button>

                  <el-button v-if="scope.row.isEdit || scope.row.isAdd"
                    @click.native.prevent="operation('cancel', scope.row, scope.$index)" style="color:#909399" type="text"
                    size="small">取消</el-button>
                  <el-button v-if="scope.row.isEdit || scope.row.isAdd"
                    @click.native.prevent="operation('save', scope.row)" type="text" size="small">保存</el-button>

                  <el-button v-if="!scope.row.isEdit && !scope.row.isAdd"
                    @click.native.prevent="operation('update', scope.row)" style="color:#E6A23C" type="text"
                    size="small">修改</el-button>
                  <el-button v-if="!scope.row.isEdit && !scope.row.isAdd"
                    @click.native.prevent="operation('export', scope.row)" type="text" size="small">导出</el-button>
                </template>
              </v-table-column>
            </el-table>
          </div>
        </el-main>
        <!-- 翻页 -->
        <el-footer class="areaFormConfig_left_footer">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="queryData.pageNum" :total="totolCount" :page-size="queryData.pageSize"
            :hide-on-single-page="false" :page-sizes="[10, 15, 20, 25, 30]" layout="total, sizes, prev, pager, next"
            class="pagination" background></el-pagination>
        </el-footer>
      </el-container>
    </div>
    <!-- 右侧内容 -->
    <el-container class="areaFormConfig_right">
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item name="1">
          <template slot="title">
            <el-header class="elHeader1">
              <div>
                <i class="iconBlue"></i>
                <span>评估表风险及评估频次设置</span>
              </div>
            </el-header>
          </template>
          <el-main class="areaFormConfig_right_body" element-loading-text="加载中" v-loading="loading2">
            <template v-if="tableDataRisk.length > 0">
              <div class="config" v-for="(item, index) in tableDataRisk" :key="item.id">
                <div class="title">
                  <label>
                    <el-input class="titleInput" v-model="item.configureName" :placeholder="'配置' + (index + 1)" />
                  </label>
                </div>
                <div class="content">
                  <el-table
                    @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
                    ref="table" border :data="item.details">
                    <v-table-column label="风险级别">
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.riskCode" style="width:100%">
                          <el-option v-for="item in riskList" :key="item.dictCode" :value="item.dictCode"
                            :disabled="item.statusDict == '0'" :label="item.dictName"></el-option>
                        </el-select>
                      </template>
                    </v-table-column>
                    <v-table-column label="评估分数范围（X）">
                      <template slot-scope="scope">
                        <el-input @click.native.prevent="expressionFc(item, scope.$index)" v-model="scope.row.expression"
                          readonly="readonly" placeholder="请输入" />
                      </template>
                    </v-table-column>
                    <v-table-column label="下次评估间隔" width="150">
                      <template slot-scope="scope">
                        <div class="flex">
                          <!-- @keypress.native="(event) => nextIntervalFc(scope.row, event)" -->
                          <el-input style="width:100%" maxlength="3" oninput="value=value.replace(/^(0+)|[^\d]+/g,'')"
                            v-model="scope.row.nextInterval" placeholder="请输入" />
                          <el-select v-model="scope.row.riskIntervalUnit" style="width:100%">
                            <el-option v-for="item in riskInterval" :key="item.dictCode" :value="item.dictCode"
                              :disabled="item.statusDict == '0'" :label="item.dictName"></el-option>
                          </el-select>
                        </div>
                      </template>
                    </v-table-column>
                    <v-table-column label="风险颜色" align="center" prop="color">
                      <template slot-scope="scope">
                        <el-color-picker v-model="scope.row.color"></el-color-picker>
                      </template>
                    </v-table-column>
                    <v-table-column label="操作" width="110" align="center">
                      <template slot-scope="scope">
                        <el-button size="mini" @click.native.prevent="addRow(item, scope.$index)"
                          icon="el-icon-plus"></el-button>
                        <el-button size="mini" @click.native.prevent="deleteItem(item, scope.$index)"
                          icon="el-icon-delete"></el-button>
                      </template>
                    </v-table-column>
                  </el-table>
                  <div class="addNotice">
                    <div @click="addRow(item, '')">
                      <svg-icon class="plus plusClass" icon-class="plus" style="color:#666;"></svg-icon>新增一行
                    </div>
                    <div>
                      <el-button :style="+item.statusDict ? 'color:#EC0000' : 'color:#00AB44'"
                        @click.native.prevent="enableOrDisable(item, index)" type="text" size="medium">{{+item.statusDict
                          ?
                          '禁用' : '启用' }}</el-button>
                      <el-button @click.native.prevent="saveTable(item, index)" type="text" size="medium">保存</el-button>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <div class="newConfig" @click="addTable">
              <svg-icon class="plus plusClass" icon-class="plus" />新增配置
            </div>
          </el-main>
        </el-collapse-item>
        <el-collapse-item name="2">
          <template slot="title">
            <el-header class="elHeader1">
              <div>
                <i class="iconBlue"></i>
                <span>评估表首次提醒配置</span>
              </div>
            </el-header>
          </template>
          <el-main class="areaFormConfig_right_body" element-loading-text="加载中" v-loading="loading2">
            <template v-if="tableDataFirst.length > 0">
              <div class="config" v-for="(item, index) in tableDataFirst" :key="item.id">
                <div class="title">
                  <label>
                    <el-input class="titleInput" v-model="item.reminderName" :placeholder="'配置' + (index + 1)" />
                  </label>
                </div>
                <div class="content">
                  <el-table
                    @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
                    ref="table1" border :data="[item]">
                    <v-table-column label="锚定类型">
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.anchorTimeType" style="width:100%">
                          <el-option v-for="item in anchoringTimeList" :key="item.dictCode" :value="item.dictCode"
                            :label="item.dictName"></el-option>
                        </el-select>
                      </template>
                    </v-table-column>
                    <v-table-column label="首次评估时限">
                      <template slot-scope="scope">
                        <el-input-number style="width:100%" :min="1" :precision="0" :max="999"
                          v-model="scope.row.anchorTimeInterval" placeholder="请输入" />
                      </template>
                    </v-table-column>
                    <v-table-column label="锚点时间单位">
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.anchorTimeUnit" style="width:100%">
                          <el-option v-for="item in anchorTimeUnitList" :key="item.dictCode" :value="item.dictCode"
                            :label="item.dictName"></el-option>
                        </el-select>
                      </template>
                    </v-table-column>
                  </el-table>
                  <div class="addNotice">
                    <div>
                    </div>
                    <div>
                      <el-button :style="+item.statusDict ? 'color:#E6A23C' : 'color:#67C23A'"
                        @click.native.prevent="enableOrDisableFirst(item, index)" type="text"
                        size="medium">{{+item.statusDict
                          ? '禁用' : '启用' }}</el-button>
                      <el-button @click.native.prevent="saveTableFirst(item, index)" type="text"
                        size="medium">保存</el-button>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <div class="newConfig" @click="addTableFirst">
              <svg-icon class="plus plusClass" icon-class="plus" />新增配置
            </div>
          </el-main>
        </el-collapse-item>
        <el-collapse-item name="3">
          <template slot="title">
            <el-header class="elHeader1">
              <div>
                <i class="iconBlue"></i>
                <span>评估表分数描述及治疗设置</span>
              </div>
            </el-header>
          </template>
          <el-main class="areaFormConfig_right_body" element-loading-text="加载中" v-loading="loading2">
            <template v-if="tableDataTreatment.length > 0">
              <div class="config" v-for="(item, index) in tableDataTreatment" :key="item.id">
                <div class="title">
                  <label>
                    <el-input class="titleInput" v-model="item.treatmentName" :placeholder="'配置' + (index + 1)" />
                  </label>
                </div>
                <div class="content">
                  <el-table
                    @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
                    ref="table2" border :data="item.details">
                    <v-table-column label="评估分数描述">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.scoreDesc" maxlength="50" placeholder="请输入" />
                      </template>
                    </v-table-column>
                    <v-table-column label="评估分数范围（X）">
                      <template slot-scope="scope">
                        <el-input @click.native.prevent="expressionTreatmentFc(item, scope.$index)"
                          v-model="scope.row.expression" readonly="readonly" placeholder="请输入" />
                      </template>
                    </v-table-column>
                    <v-table-column label="需治疗" width="150" align="center">
                      <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.needTreatment" true-label="1" false-label="0"></el-checkbox>
                      </template>
                    </v-table-column>
                    <v-table-column label="操作" width="110" align="center">
                      <template slot-scope="scope">
                        <el-button size="mini" @click.native.prevent="addTreatmentRow(item, scope.$index)"
                          icon="el-icon-plus"></el-button>
                        <el-button size="mini" @click.native.prevent="deleteTreatmentItem(item, scope.$index)"
                          icon="el-icon-delete"></el-button>
                      </template>
                    </v-table-column>
                  </el-table>
                  <div class="addNotice">
                    <div @click="addTreatmentRow(item, '')">
                      <svg-icon class="plus plusClass" icon-class="plus" style="color:#666;"></svg-icon>新增一行
                    </div>
                    <div>
                      <el-button :style="+item.statusDict ? 'color:#EC0000' : 'color:#00AB44'"
                        @click.native.prevent="enableOrDisableTreatment(item, index)" type="text"
                        size="medium">{{+item.statusDict ? '禁用' : '启用' }}</el-button>
                      <el-button @click.native.prevent="saveTableTreatment(item, index)" type="text"
                        size="medium">保存</el-button>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <div class="newConfig" @click="addTreatmentTable">
              <svg-icon class="plus plusClass" icon-class="plus" />新增配置
            </div>
          </el-main>
        </el-collapse-item>
      </el-collapse>
    </el-container>
    <!-- 右边表达式 -->
    <el-dialog :close-on-click-modal="false" title="表达式填写" :visible.sync="expressionVisible" width="800px"
      :before-close="expressionHide">
      <el-table
        @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
        ref="expressionData" :data="[expressionData]" border highlight-current-row style="margin-bottom:10px;">
        <v-table-column label="最小值" prop="minValue">
          <template slot-scope="scope">
            <el-input-number type="number" :min="-999" :max="999" v-model="scope.row.minValue" placeholder="请输入"
              style="width:100%" />
          </template>
        </v-table-column>
        <v-table-column label="表达式" prop="minLink">
          <template slot-scope="scope">
            <el-select v-model="scope.row.minLink" @change="minLinkFc(scope.row)" clearable style="width:100%">
              <el-option v-for="item in minLinkList" :key="item.id" :value="item.key" :label="item.key"></el-option>
            </el-select>
          </template>
        </v-table-column>
        <v-table-column label="中间值" align="center" width="80">X</v-table-column>
        <v-table-column label="表达式" prop="maxLink">
          <template slot-scope="scope">
            <el-select v-model="scope.row.maxLink" @change="maxLinkFc(scope.row)" clearable style="width:100%">
              <el-option v-for="item in maxLinkList" :key="item.id" :value="item.key" :label="item.key
              "></el-option>
            </el-select>
          </template>
        </v-table-column>
        <v-table-column label="最大值" prop="maxValue">
          <template slot-scope="scope">
            <el-input-number type="number" :min="-999" :max="999" v-model="scope.row.maxValue" placeholder="请输入"
              style="width:100%" />
          </template>
        </v-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="expressionHide">取消</el-button>
        <el-button type="primary" @click="expressionSave">保存</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import {
  formconfig_listPage, // 查询表单
  formconfig_enable, // 启动表单
  formconfig_disable, // 禁用表单
  formconfig_delete, // 删除表单
  formconfig_add, // 新增表单
  formconfig_update, // 修改表单配置数据
  riskfrequency_list, // 风险频次列表数据
  riskfrequency_saveOrUpdate, // 新增风险频次
  riskfrequency_delete, // 删除风险批次配置数据
  riskfrequency_deleteDetail, // 删除风险批次详情项数据
  dictItem_findWithPage, // 风险等级字典
  riskfrequency_enable, // 启用
  riskfrequency_disable, // 禁用
  firstReminder_list, // 首次提醒配置列表
  firstReminder_add, // 首次提醒配置新增
  firstReminder_update, // 首次提醒配置修改
  firstReminder_enable, // 首次提醒配置启用
  firstReminder_disable, // 首次提醒配置禁用
  treatmentconfig_list, // 评估表分数描述及治疗设置-列表数据
  treatmentconfig_saveOrUpdate, // 评估表分数描述及治疗设置-保存or修改
  treatmentconfig_enable, // 评估表分数描述及治疗设置-启用
  treatmentconfig_disable, // 评估表分数描述及治疗设置-禁用
  treatmentconfig_deleteDetail // 评估表分数描述及治疗设置-删除某一条
} from '@/api/configuration'
import { getTmpAllDocConfigList } from '@/api/anas'
import _ from 'lodash'
import { getCookie } from '@/utils/cookie' // 存储方式
export default {
  name: 'AreaEvaluationForm',
  components: {},
  data: function () {
    return {
      loading: false, // 表格的loding
      loading2: false, // 表格的loding 右边
      expressionVisible: false, // 表达式 隐藏显示
      expressionData: {}, // 表达式 对象
      queryData: {
        statusDict: '',
        pageNum: 1, // 页码，必传
        pageSize: 15, // 页数量，必传
        searchKey: '' // 模糊搜索关键字，非必传
      }, // 左边请求入参
      tableDataLeft: [], // 左边表格数据
      oldTableDataLeft: [], // 左边表格数据
      tableDataLeftRowId: '', // 左边表格数据点击的一条数据
      tableDataRisk: [], // 右边表格数据 风险
      tableDataFirst: [], // 首次评测
      tableDataTreatment: [], // 右侧-评估表分数描述及治疗设置
      expressionRow: {}, // 右边选择 表达式的时候 保存
      totolCount: 0, // 分页总量
      riskList: [], // 风险等级字典
      riskInterval: [], // 风险评估单风险频次单位
      anchoringTimeList: [
        {
          dictCode: '1',
          dictName: '入区时间'
        }
      ], // 锚定时间
      anchorTimeUnitList: [
        {
          dictCode: '1',
          dictName: '天'
        },
        {
          dictCode: '2',
          dictName: '时'
        }
      ], // 锚定时间 单位
      tempList: [], // 绑定文书模板id
      classification: [], // 评估表分类
      applicableTypeList: [], // 评估表
      finalResultList: [],
      minLinkList: [
        {
          id: '0',
          key: '<'
        },
        {
          id: '1',
          key: '<='
        },
        {
          id: '2',
          key: '='
        }
      ],
      maxLinkList: [
        {
          id: '0',
          key: '<'
        },
        {
          id: '1',
          key: '<='
        },
        {
          id: '2',
          key: '='
        }
      ],
      activeName: '1' // 风琴效果
    }
  },
  props: {},
  watch: {},
  filters: {
    /**
     * 模板找文字显示
     */
    templetIdFc(val, tempList) {
      return tempList.filter(res => {
        return res.id == val
      })[0]?.tempName
    },
    /**
     * 评估表类型
     */
    templetDictCodeFc(val, tempList) {
      return tempList.filter(res => {
        return res.dictCode == val
      })[0]?.dictName
    },
    /**
     * 评估表类型
     */
    riskLevelDisplayStyleName(val) {
      let name = ''
      if (val == '1') {
        name = '文字描述'
      } else if (val == '2') {
        name = '进度条'
      }
      return name
    }
  },
  computed: {},
  async created() {
    // 截流
    this.debounceFC = _.debounce(() => {
      this.queryData.pageNum = 1 // 输入的时候需要改为第一页
      this.init() // 输入框截流
    }, 800)
    // 风险等级字典
    this.riskList = await this.getDictItems('ICIS_DICT_ASSESS_RISK_LEVEL')
    // 评估单风险频次单位
    this.riskInterval = await this.getDictItems('ICIS_DICT_ASSESS_RISK_INTERVAL_UNIT')
    // 评估表分类
    this.classification = await this.getDictItems(
      'ICIS_DICT_ASSESS_CLASSIFICATION'
    )
    // 评估表适用类型
    this.applicableTypeList = await this.getDictItems(
      'ICIS_DICT_ASSESS_APPLICABLE_TYPE'
    )
    this.finalResultList = await this.getDictItems(
      'ICIS_DICT_ASS_FINAL_RESULT'
    )
    // 获取模板列表
    this.tempList = await this.getTmpAllDocConfigListFc()
    // 初始化
    this.init()
  },
  mounted() { },
  methods: {
    /**
     * 初始化
     */
    init() {
      this.loading = true
      formconfig_listPage(this.queryData).then(res => {
        this.totolCount = res.data.totolCount // 总条数
        this.tableDataLeft = []
        res.data.result.map(item => {
          this.tableDataLeft.push({ ...item, isEdit: false })
        }) // 数据赋值
        this.oldTableDataLeft = JSON.parse(JSON.stringify(this.tableDataLeft))
        this.loading = false
        this.$nextTick(req => {
          if (this.tableDataLeft && this.tableDataLeft.length > 0) {
            this.changeTable(this.tableDataLeft[0])
          } else {
            this.tableDataRisk = []
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
     * 获取对应字典项
     */
    getTmpAllDocConfigListFc() {
      return new Promise((resolve, reject) => {
        getTmpAllDocConfigList({
          tempType: '3',
          tempName: ''
        }).then(res => {
          resolve(res.data)
        })
      })
    },
    /**
     * 左表格-操作方法
     *  @type
     * 'modify' 修改
     * 'delete' 删除
     * 'on'     启用
     * 'off'    关闭
     * @name 表名
     * @id 表独有id
     */
    operation(type, item, index) {
      let ajaxName = '' // 事件方法变量
      let message = '请求成功' // 请求提示文案
      const baseURL = process.env.NODE_ENV === 'production' ? globalConfig.PRO_BASE_API || './' : globalConfig.BASE_API
      const ele = document.createElement('a')
      const data = {
        formCode: '', // 左侧->新增编码
        formName: '', // 左侧->新增名称
        formAbbr: '', // 简称
        remark: '', // 备注
        templetId: '', // 打印模板
        classification: '', // 评估表类型
        applicableType: '0', // 评估表适用类型
        finalResult: '0',
        riskLevelDisplayStyle: '', // 风险等级样式选择
        isEdit: false, // 修改状态
        isAdd: true // 新增状态
      }
      let query = '' // 保存请求的变量
      let queryData = {} // 请求变量
      let successName = '' // 保存请求的名称
      // 不同方法赋值
      switch (type) {
        case 'add':
          if (this.stateJudgement(this.tableDataLeft)) {
            // 检测是否可以修改
            return
          }
          this.tableDataLeft.unshift(data)
          this.changeTable(this.tableDataLeft[0])
          this.$refs.tableDataLeft.setCurrentRow(this.tableDataLeft[0])
          return
        case 'configure':
          this.$router.push({
            path: '/configuration/evaluationForms/componentdesign/add',
            query: {
              name: item.formName, // 表名称
              id: item.id, // 表id
              state: 'surface' // 表的标识
            }
          })
          return
        case 'update':
          if (this.stateJudgement(this.tableDataLeft)) {
            // 检测是否可以修改
            return
          }
          item.isEdit = true
          return
        case 'cancel':
          if (item.isEdit) {
            this.$set(this.tableDataLeft, index, {
              ...JSON.parse(JSON.stringify(this.oldTableDataLeft[index])),
              isEdit: false
            })
          } else {
            this.tableDataLeft.shift()
          }
          this.$message.success('已取消！')
          return
        case 'save':
          if (!item.formCode) {
            this.$message.error('请填写评估表编码!')
            return
          }
          if (!item.formName) {
            this.$message.error('请填写评估表名称!')
            return
          }
          if (!item.applicableType) {
            this.$message.error('请选择适用类型!')
            return
          }
          if (item.isEdit) {
            query = formconfig_update
            queryData = {
              id: item.id, // 修改才有id 新增没有
              formCode: item.formCode, // 评估表编码
              formName: item.formName, // 评估表名称
              formAbbr: item.formAbbr, // 评估表简称
              finalResult: item.finalResult,
              classification: item.classification, // 评估表类型
              remark: item.remark, // 评估表备注
              applicableType: item.applicableType, // 评估表适用类型
              templetId: item.templetId, // 文书模板id
              riskLevelDisplayStyle: item.riskLevelDisplayStyle, // 风险等级样式
              basicUpdate: true // true: 修改基础信息：编码，名称，简称，描述  false: 组件所有数据
            }
            successName = '修改成功'
          } else if (item.isAdd) {
            query = formconfig_add
            queryData = {
              id: item.id, // 修改才有id 新增没有
              formCode: item.formCode, // 评估表编码
              formName: item.formName, // 评估表名称
              finalResult: item.finalResult,
              formAbbr: item.formAbbr, // 评估表简称
              classification: item.classification, // 评估表类型
              remark: item.remark, // 评估表备注
              applicableType: item.applicableType, // 评估表适用类型
              templetId: item.templetId, // 文书模板id
              riskLevelDisplayStyle: item.riskLevelDisplayStyle, // 风险等级样式
              structure: '[]'
            }
            successName = `新增${item.formName}表单成功`
          }
          query(queryData).then(res => {
            this.$message({
              message: successName,
              type: 'success'
            })
            this.init() // 重新拉数据
          })
          return
        case 'delete':
          if (this.stateJudgement(this.tableDataLeft)) {
            // 检测是否可以修改
            return
          }
          this.$confirm('您确定要删除吗？', '确认信息', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(res => {
              formconfig_delete({ id: item.id }).then(res => {
                this.$message.success('删除成功！')
                this.init() // 重新拉数据
              })
            })
            .catch(() => { })

          return
        case 'on':
          ajaxName = formconfig_enable
          message = '启用成功'
          break
        case 'off':
          ajaxName = formconfig_disable
          message = '禁用成功'
          break
        case 'export':
          // 导出
          ele.setAttribute('href', `${baseURL}assess/formconfig/exportSql?params=${encodeURI(JSON.stringify({ id: item.id }))}&X-Token=${getCookie('token').tocken}`)
          ele.setAttribute('download', 'name')
          ele.style.display = 'none'
          document.body.appendChild(ele)
          ele.click()
          document.body.removeChild(ele)
          return
      }
      // 请求不同方法
      ajaxName({ id: item.id }).then(res => {
        this.$message({
          message: message,
          type: 'success'
        })
        this.init() // 重新拉数据
      })
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
     * 左表格-刷新右边数据
     */
    changeTable(data, index, event) {
      // 修改的时候点击行不查询
      if (data.isAdd) {
        this.tableDataRisk = [
          {
            formId: this.tableDataLeftRowId,
            configureName: '配置1',
            details: [
              {
                riskCode: '', // 风险编码
                riskName: '', // 风险名称
                // minValue: '', // 最小值
                minLink: '', // 最小值连接符号
                maxLink: '', // 最大值连接符号
                // maxValue: '', // 最大值
                expression: '', // 表单式
                valueType: '', // 值类型
                nextInterval: '1', // 下次评估时间间隔
                riskIntervalUnit: '0',
                color: '#E7086E'
              }
            ]
          }
        ]
        this.tableDataFirst = [
          {
            formId: this.tableDataLeftRowId,
            reminderName: '配置1', // --提醒配置名称
            anchorTimeType: '1', // --锚点时间类型（"1"：入区时间；后续待补充）
            // anchorTimeInterval: null, // --锚点时间间隔（整数） 不能默认1.得删除这个字段。给值就是1
            anchorTimeUnit: '2', // --锚点时间单位（1：天；2：小时）
            statusDict: '1' // --启用状态："0" : 禁用；"1" : 启用
          }
        ]
        this.tableDataTreatment = [
          {
            formId: this.tableDataLeftRowId,
            treatmentName: '配置1',
            details: [
              {
                scoreDesc: '', // 评分描述
                expression: '', // 表单式
                needTreatment: '', // 是否需要治疗：0，不需要；1，需要
                // minValue: '', // 最小值
                minLink: '', // 最小值连接符号
                maxLink: '' // 最大值连接符号
                // maxValue: '' // 最大值
              }
            ]
          }
        ]
        return
      }
      if (this.stateJudgement(this.tableDataLeft, false)) {
        // 检测是否可以修改
        return
      }
      if (index) {
        this.activeName = '1'
      }
      this.$refs?.tableDataLeft?.setCurrentRow(data)
      this.tableDataLeftRowId = data.id
      // 拿右边配置 风险评测
      riskfrequency_list({
        formId: data.id
      }).then(res => {
        if (res.data.length > 0) {
          this.tableDataRisk = res.data
          res.data.map(item => {
            item.details.map(item2 => {
              item2.color = item2.color || '#E7086E'
              if (item2.minValue == null) {
                delete item2.minValue
              }
              if (item2.maxValue == null) {
                delete item2.maxValue
              }
            })
          })
        } else {
          this.tableDataRisk = [
            {
              formId: this.tableDataLeftRowId,
              configureName: '配置1',
              details: [
                {
                  riskCode: '', // 风险编码
                  riskName: '', // 风险名称
                  // minValue: '', // 最小值
                  minLink: '', // 最小值连接符号
                  maxLink: '', // 最大值连接符号
                  // maxValue: '', // 最大值
                  expression: '', // 表单式
                  valueType: '', // 值类型
                  nextInterval: '1', // 下次评估时间间隔
                  riskIntervalUnit: '0',
                  color: '#E7086E'
                }
              ]
            }
          ]
        }
      })
      // 拿右边配置 首次提醒配
      firstReminder_list({
        formId: data.id
      }).then(res => {
        if (res.data.length > 0) {
          this.tableDataFirst = res.data
        } else {
          this.tableDataFirst = [
            {
              formId: this.tableDataLeftRowId,
              reminderName: '配置1', // --提醒配置名称
              anchorTimeType: '1', // --锚点时间类型（"1"：入区时间；后续待补充）
              // anchorTimeInterval: null, // --锚点时间间隔（整数） 不能默认1.得删除这个字段。给值就是1
              anchorTimeUnit: '2', // --锚点时间单位（1：天；2：小时）
              statusDict: '1' // --启用状态："0" : 禁用；"1" : 启用
            }
          ]
        }
      })
      // 拿右边配置 评估表分数描述及治疗设置
      treatmentconfig_list({
        formId: data.id
      }).then(res => {
        if (res.data.length > 0) {
          res.data.map(item => {
            item.details.map(item2 => {
              if (item2.minValue == null) {
                delete item2.minValue
              }
              if (item2.maxValue == null) {
                delete item2.maxValue
              }
            })
          })
          this.tableDataTreatment = res.data
        } else {
          this.tableDataTreatment = [
            {
              formId: this.tableDataLeftRowId,
              treatmentName: '配置1',
              details: [
                {
                  scoreDesc: '', // 评分描述
                  expression: '', // 表单式
                  needTreatment: '', // 是否需要治疗：0，不需要；1，需要
                  // minValue: '', // 最小值
                  minLink: '', // 最小值连接符号
                  maxLink: '' // 最大值连接符号
                  // maxValue: '' // 最大值
                }
              ]
            }
          ]
        }
      })
    },
    /**
     *  状态判断
     */
    stateJudgement(data, flag = true) {
      if (
        data.filter(res => {
          return res.isAdd
        })[0]
      ) {
        if (flag) {
          this.$message({
            type: 'warning',
            message: '已有新增数据没有保存,请先保存!'
          })
        }
        return true
      }
      if (
        data.filter(res => {
          return res.isEdit
        })[0]
      ) {
        if (flag) {
          this.$message({
            type: 'warning',
            message: '已有修改数据没有保存,请先保存!'
          })
        }
        return true
      }
      return false
    },
    // 评估表风险及评估频次设置////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * 评估表风险及评估频次设置 右表格-表格整块新增
     */
    addTable() {
      let isReturn = false
      this.tableDataRisk.map(res => {
        if (!res.id) {
          this.$message({
            message: `请先保存${res.configureName}`,
            type: 'warning'
          })
          isReturn = true
        }
      })
      if (isReturn) {
        return
      }
      this.tableDataRisk.push({
        formId: this.tableDataLeftRowId,
        configureName: '配置' + (this.tableDataRisk.length + 1),
        details: [
          {
            riskCode: '', // 风险编码
            riskName: '', // 风险名称
            // minValue: '', // 最小值
            minLink: '', // 最小值连接符号
            maxLink: '', // 最大值连接符号
            // maxValue: '', // 最大值
            expression: '', // 表单式
            valueType: '', // 值类型
            nextInterval: '1', // 下次评估时间间隔
            riskIntervalUnit: '0',
            color: '#E7086E'
          }
        ]
      })
    },
    /**
     * 评估表风险及评估频次设置 右表格-新增一行
     */
    addRow(item, index) {
      const row = this.tableDataRisk.filter(res => {
        return item.configureName == res.configureName
      })[0]
      const data = {
        riskCode: '', // 风险编码
        riskName: '', // 风险名称
        // minValue: '', // 最小值
        minLink: '', // 最小值连接符号
        maxLink: '', // 最大值连接符号
        // maxValue: '', // 最大值
        expression: '', // 表单式
        valueType: '', // 值类型
        nextInterval: '1', // 下次评估时间间隔
        riskIntervalUnit: '0',
        color: '#E7086E'
      }
      if (index !== '') {
        row.details.splice(index, 0, data) // 一条数据前面插入
      } else {
        row.details.push(data) // 后面加入
      }
    },
    /**
     * 评估表风险及评估频次设置 右表格-删除一行
     */
    deleteItem(item, index) {
      const row = this.tableDataRisk.filter(res => {
        return item.configureName == res.configureName
      })[0]
      // 判断是否有保存
      if (row.details[index].id) {
        this.$confirm('您确定要删除吗？', '确认信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(res => {
            riskfrequency_deleteDetail({ id: row.details[index].id }).then(
              req => {
                row.details.splice(index, 1) // 删除前端数据
                this.$message.success('删除成功！')
                this.repair(row) // 自动补数据
              }
            )
          })
          .catch(res => {
            this.$message.success('已取消！')
          })
      } else {
        row.details.splice(index, 1) // 删除前端数据
        this.repair(row) // 自动补数据
      }
    },
    /**
     * 评估表风险及评估频次设置 删除一条数据.自动补一条
     */
    repair(row) {
      // 没有数据的时候需要补一条
      if (!row.details.length) {
        setTimeout(res => {
          row.details.push({
            riskCode: '', // 风险编码
            riskName: '', // 风险名称
            // minValue: '', // 最小值
            minLink: '', // 最小值连接符号
            maxLink: '', // 最大值连接符号
            // maxValue: '', // 最大值
            expression: '', // 表单式
            valueType: '', // 值类型
            nextInterval: '1', // 下次评估时间间隔
            riskIntervalUnit: '0'
          })
        }, 500)
      }
    },
    /**
     *评估表风险及评估频次设置 右表格-表格删除
     */
    deleteTable(item, index) {
      const data = this.tableDataRisk[index] // 第几个表格数据
      // 判断是否有保存
      if (data.id) {
        this.$confirm('您确定要删除吗？', '确认信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(res => {
            riskfrequency_delete({ id: data.id }).then(req => {
              this.tableDataRisk.splice(index, 1) // 删除前端数据
              this.$message.success('删除成功！')
            })
          })
          .catch(res => {
            this.$message.success('已取消！')
          })
      } else {
        this.tableDataRisk.splice(index, 1) // 删除前端数据
      }
    },
    /**
     * 评估表风险及评估频次设置 右表格-表格据保存
     */
    saveTable(item, index) {
      // 检验名称
      if (this.tableDataRisk[index].configureName === '') {
        this.$message.warning('请填写配置名称')
        return
      }
      // 校验整个条数
      let messageType = 0 // 类型
      let indexType = 0 // 下标
      const riskCodeList = [] // 检验是否重复风险编码
      let riskCodeListTwo = [] // 检验是否重复风险编码
      const countList = [] // 用于判断表达式是否重叠
      for (const index2 in this.tableDataRisk[index].details) {
        const item2 = this.tableDataRisk[index].details[index2]
        // 如果已经修改类型就跳出
        if (messageType) {
          return
        }
        // 判断风险级别
        if (item2.riskCode == '') {
          messageType = 1
          indexType = index2
          return
        }
        // 判断风险等级是否重复
        riskCodeList.push(item2.riskCode)
        riskCodeListTwo = Array.from(new Set(riskCodeList))
        if (riskCodeList.length != riskCodeListTwo.length) {
          this.$message.warning(
            `第${(+index2) + 1}条风险级别重复请,重新选择!`
          )
          return
        }
        // 判断评估分数范围
        if (item2.expression == '') {
          messageType = 2
          indexType = index2
          return
        }
        // 判断逻辑符号是否正确
        if (item2.minLink != null) {
          if (item2.minLink == '>' || item2.minLink == '>=') {
            this.$message({
              message: `第${(+index2 + 1)}条表达式错误!`,
              type: 'warning'
            })
            return
          }
        }
        if (item2.maxLink != null) {
          if (item2.maxLink == '>' || item2.maxLink == '>=') {
            this.$message({
              message: `第${(+index2 + 1)}条表达式错误!`,
              type: 'warning'
            })
            return
          }
        }
        if (item2.minLink != null && item2.maxLink != null && item2.minLink == '=' && item2.maxLink == '=') {
          this.$message({
            message: `第${(+index2 + 1)}条表达式错误!`,
            type: 'warning'
          })
          return
        }
        let min = -99999999
        let max = 99999999
        if (item2.minLink && (item2.minLink ?? '') != '') {
          min = +item2.minValue
        }
        if (item2.maxLink && (item2.maxLink ?? '') != '') {
          max = +item2.maxValue
        }
        if (item2.minLink == '<') {
          min = +item2.minValue + 0.1
        } else if (item2.minLink == '=') {
          min = +item2.minValue
          max = +item2.minValue
        }
        if (item2.maxLink == '<') {
          max = +item2.maxValue - 0.1
        } else if (item2.maxLink == '=') {
          min = +item2.maxValue
          max = +item2.maxValue
        }
        countList.push({ min: min, max: max })
      }
      for (const i in countList) {
        for (const j in countList) {
          if (i != j) {
            if (countList[j].min <= countList[i].min && countList[i].min <= countList[j].max || countList[i].max >= countList[j].min && countList[i].max <= countList[j].max) {
              this.$message.warning('表达式分值范围重复!')
              return
            }
          }
        }
      }
      if (messageType) {
        this.$message.warning(
          `请填写第 ${indexType + 1} 行 ${messageType == 1 ? '风险级别' : '评估分数范围'
          }`
        )
        return
      }
      riskfrequency_saveOrUpdate(this.tableDataRisk[index]).then(res => {
        this.$message.success('操作成功！')
        this.changeTable(
          this.tableDataLeft.filter(res => {
            return res.id === this.tableDataLeftRowId
          })[0]
        )
      })
    },
    /**
     * 评估表风险及评估频次设置 右表格-表达式配置
     */
    expressionFc(item, index) {
      const row = this.tableDataRisk.filter(res => {
        return item.configureName == res.configureName
      })[0]
      this.expressionRow = {
        list: 'tableDataRisk',
        name: item.configureName,
        index: index
      }
      // 把那一条数据给弹框
      this.expressionData = _.cloneDeep(row.details[index])
      if (this.expressionData.minLink == '>' || this.expressionData.minLink == '>=') {
        this.expressionData.minLink = ''
      }
      if (this.expressionData.maxLink == '>' || this.expressionData.maxLink == '>=') {
        this.expressionData.maxLink = ''
      }
      this.expressionVisible = true // 显示
    },
    /**
     * 评估表风险及评估频次设置 右表格-只能输入正整数
     */
    nextIntervalFc(row, event) {
      const inputKey = String.fromCharCode(typeof event.charCode === 'number' ? event.charCode : event.keyCode)
      if (!(/^\d/.test(inputKey))) {
        event.preventDefault()
      }
    },
    /**
     * 右表格-表达式-取消按钮
     */
    expressionHide() {
      this.expressionData = {} // 清空
      this.minLinkList = [
        {
          id: '0',
          key: '<'
        },
        {
          id: '1',
          key: '<='
        },
        {
          id: '2',
          key: '='
        }
      ]
      this.maxLinkList = [
        {
          id: '0',
          key: '<'
        },
        {
          id: '1',
          key: '<='
        },
        {
          id: '2',
          key: '='
        }
      ]
      this.expressionVisible = false // 隐藏
    },
    /**
     * 右表格-表达式-筛选
     */
    minLinkFc(row) {
      if (row.minLink == '=') {
        row.maxLink = ''
        row.maxValue = ''
        this.maxLinkList = []
      } else {
        this.maxLinkList = [
          {
            id: '0',
            key: '<'
          },
          {
            id: '1',
            key: '<='
          },
          {
            id: '2',
            key: '='
          }
        ]
      }
    },
    /**
     * 右表格-表达式-筛选
     */
    maxLinkFc(row) {
      if (row.maxLink == '=') {
        row.minLink = ''
        row.minValue = ''
        this.minLinkList = []
      } else {
        this.minLinkList = [
          {
            id: '0',
            key: '<'
          },
          {
            id: '1',
            key: '<='
          },
          {
            id: '2',
            key: '='
          }
        ]
      }
    },
    /**
     * 右表格-表达式-确认
     */
    expressionSave() {
      const row = this[this.expressionRow.list].filter(res => {
        return (
          this.expressionRow.name == res.configureName ||
          this.expressionRow.name == res.treatmentName
        )
      })[0]
      // 丢给右边总数据
      const data = _.cloneDeep(this.expressionData)
      // 判断运算符是否存在
      if (data.minLink == '' && data.maxLink == '') {
        this.$message({
          message: '请填写正确表达式!',
          type: 'warning'
        })
        return
      }
      // 表达式整合
      data.expression = ''
      if (
        data.minLink !== '' &&
        typeof (data.minValue) == 'number' &&
        data.maxLink !== '' &&
        typeof (data.maxValue) == 'number'
      ) {
        if (((data.minLink == '<' || data.minLink == '<=' || data.minLink == '=') && (data.maxLink == '>' || data.maxLink == '>=' || data.maxLink == '=')) ||
          (data.minLink == '>' || data.minLink == '>=' || data.minLink == '=') && (data.maxLink == '<' || data.maxLink == '<=' || data.maxLink == '=')) {
          this.$message({
            message: '请填写正确表达式!',
            type: 'warning'
          })
          return
        }
        data.expression =
          data.minValue + data.minLink + 'X' + data.maxLink + data.maxValue
      } else if (data.minLink !== '' && typeof data.minValue == 'number') {
        // 判断左边的表达式是否正确 - 赋值
        data.expression = data.minValue + data.minLink + 'X'
        delete data.maxLink
        delete data.maxValue
      } else if (data.maxLink !== '' && typeof data.maxValue == 'number') {
        // 判断右边表达式 - 赋值
        data.expression = 'X' + data.maxLink + data.maxValue
        delete data.minValue
        delete data.minLink
      }
      // 没有正确的表达式
      if (data.expression == '') {
        this.$message({
          message: '请填写正确表达式!',
          type: 'warning'
        })
        return
      }
      // 右边数字比左边小
      if (data.maxValue <= data.minValue) {
        this.$message({
          message: '请填写正确表达式!',
          type: 'warning'
        })
        return
      }
      row.details[this.expressionRow.index] = _.cloneDeep(data)
      // 丢给tableRisk
      this.$set(row.details, this.expressionRow.index, data)
      // 取消的按钮方法
      this.expressionHide()
    },
    /**
     * 评估表风险及评估频次设置 启用禁用
     */
    enableOrDisable(row) {
      if (!row.id) {
        this.$message({
          message: `请先保存${row.configureName}`,
          type: 'warning'
        })
        return
      }
      const queryUrl =
        row.statusDict == '1' ? riskfrequency_disable : riskfrequency_enable // 启用禁用的请求切换
      queryUrl({
        id: row.id
      }).then(res => {
        this.$message({
          type: 'success',
          message: +row.statusDict ? '已禁用' : '已启用'
        })
        this.changeTable(
          this.tableDataLeft.filter(res => {
            return res.id === this.tableDataLeftRowId
          })[0]
        )
      })
    },
    // 评估表首次提醒配置////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * 评估表首次提醒配置 启用禁用
     */
    enableOrDisableFirst(row) {
      if (!row.id) {
        this.$message({
          message: `请先保存${row.reminderName}`,
          type: 'warning'
        })
        return
      }
      const queryUrl =
        row.statusDict == '1' ? firstReminder_disable : firstReminder_enable // 启用禁用的请求切换
      queryUrl({
        id: row.id
      }).then(res => {
        this.$message({
          type: 'success',
          message: +row.statusDict ? '已禁用' : '已启用'
        })
        this.changeTable(
          this.tableDataLeft.filter(res => {
            return res.id === this.tableDataLeftRowId
          })[0]
        )
      })
    },
    /**
     * 评估表首次提醒配置 右表格-表格据保存
     */
    saveTableFirst(item, index) {
      // 检验名称
      if (this.tableDataFirst[index].reminderName === '') {
        this.$message.warning('请填写配置名称')
        return
      }
      if (this.tableDataFirst[index].anchorTimeType === '') {
        this.$message.warning('请填写锚点类型')
        return
      }
      if (this.tableDataFirst[index].anchorTimeUnit === '') {
        this.$message.warning('请填写锚点单位')
        return
      }
      const query = !this.tableDataFirst[index].id
        ? firstReminder_add
        : firstReminder_update
      query(this.tableDataFirst[index]).then(res => {
        this.$message.success('操作成功！')
        this.changeTable(
          this.tableDataLeft.filter(res => {
            return res.id === this.tableDataLeftRowId
          })[0]
        )
      })
    },
    /**
     * 评估表首次提醒配置 右表格-表格整块新增
     */
    addTableFirst() {
      let isReturn = false
      this.tableDataFirst.map(res => {
        if (!res.id) {
          this.$message({
            message: `请先保存${res.reminderName}`,
            type: 'warning'
          })
          isReturn = true
        }
      })
      if (isReturn) {
        return
      }
      this.tableDataFirst.push({
        formId: this.tableDataLeftRowId,
        reminderName: `配置${this.tableDataFirst.length + 1}`, // --提醒配置名称
        anchorTimeType: '1', // --锚点时间类型（"1"：入区时间；后续待补充）
        // anchorTimeInterval: 1, // --锚点时间间隔（整数） 不能默认1.得删除这个字段。给值就是1
        anchorTimeUnit: '2', // --锚点时间单位（1：天；2：小时）
        statusDict: '1' // --启用状态："0" : 禁用；"1" : 启用
      })
    },
    // 评估表分数描述及治疗设置////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * 评估表分数描述及治疗设置 右表格-表格据保存
     */
    saveTableTreatment(item, index) {
      // 检验名称
      if (this.tableDataTreatment[index].treatmentName === '') {
        this.$message.warning('请填写配置名称')
        return
      }
      // 校验整个条数
      let messageType = 0 // 类型
      let indexType = 0 // 下标
      const countList = [] // 用于判断表达式是否重叠
      for (const index2 in this.tableDataTreatment[index].details) {
        const item2 = this.tableDataTreatment[index].details[index2]
        // 如果已经修改类型就跳出
        if (messageType) {
          return
        }
        // 判断风险级别
        if (item2.scoreDesc == '') {
          messageType = 1
          indexType = index2
          return
        }
        // 判断评估分数范围
        if (item2.expression == '') {
          messageType = 2
          indexType = index2
          return
        }
        // 判断逻辑符号是否正确
        if (item2.minLink != null) {
          if (item2.minLink == '>' || item2.minLink == '>=') {
            this.$message({
              message: `第${(+index2 + 1)}条表达式错误!`,
              type: 'warning'
            })
            return
          }
        }
        if (item2.maxLink != null) {
          if (item2.maxLink == '>' || item2.maxLink == '>=') {
            this.$message({
              message: `第${(+index2 + 1)}条表达式错误!`,
              type: 'warning'
            })
            return
          }
        }
        if (item2.minLink != null && item2.maxLink != null && item2.minLink == '=' && item2.maxLink == '=') {
          this.$message({
            message: `第${(+index2 + 1)}条表达式错误!`,
            type: 'warning'
          })
          return
        }
        let min = -99999999
        let max = 99999999
        if (item2.minLink != null) {
          min = +item2.minValue
        }
        if (item2.maxLink != null) {
          max = +item2.maxValue
        }
        if (item2.minLink == '<') {
          min = +item2.minValue + 0.1
        } else if (item2.minLink == '=') {
          min = +item2.minValue
          max = +item2.minValue
        }
        if (item2.maxLink == '<') {
          max = +item2.maxValue - 0.1
        } else if (item2.maxLink == '=') {
          min = +item2.maxValue
          max = +item2.maxValue
        }
        countList.push({ min: min, max: max })
      }
      for (const i in countList) {
        for (const j in countList) {
          if (i != j) {
            if (countList[j].min <= countList[i].min && countList[i].min <= countList[j].max || countList[i].max >= countList[j].min && countList[i].max <= countList[j].max) {
              this.$message.warning('表达式分值范围重复!')
              return
            }
          }
        }
      }
      if (messageType) {
        this.$message.warning(
          `请填写第 ${indexType + 1} 行 ${messageType == 1 ? '评估分数描述' : '评估分数范围'
          }`
        )
        return
      }
      // 保存修改
      treatmentconfig_saveOrUpdate(this.tableDataTreatment[index]).then(res => {
        this.$message.success('操作成功！')
        // 刷新右边数据
        this.changeTable(
          this.tableDataLeft.filter(res => {
            return res.id === this.tableDataLeftRowId
          })[0]
        )
      })
    },
    /**
     * 评估表分数描述及治疗设置 启用禁用
     */
    enableOrDisableTreatment(row) {
      if (!row.id) {
        this.$message({
          message: `请先保存${row.treatmentName}`,
          type: 'warning'
        })
        return
      }
      const queryUrl =
        row.statusDict == '1' ? treatmentconfig_disable : treatmentconfig_enable // 启用禁用的请求切换
      queryUrl({
        id: row.id
      }).then(res => {
        this.$message({
          type: 'success',
          message: +row.statusDict ? '已禁用' : '已启用'
        })
        this.changeTable(
          this.tableDataLeft.filter(res => {
            return res.id === this.tableDataLeftRowId
          })[0]
        )
      })
    },
    /**
     * 评估表分数描述及治疗设置 右表格-表达式配置
     */
    expressionTreatmentFc(item, index) {
      const row = this.tableDataTreatment.filter(res => {
        return item.treatmentName == res.treatmentName
      })[0]
      this.expressionRow = {
        list: 'tableDataTreatment',
        name: item.treatmentName,
        index: index
      }
      // 把那一条数据给弹框
      this.expressionData = _.cloneDeep(row.details[index])
      if (this.expressionData.minLink == '>' || this.expressionData.minLink == '>=') {
        this.expressionData.minLink = ''
      }
      if (this.expressionData.maxLink == '>' || this.expressionData.maxLink == '>=') {
        this.expressionData.maxLink = ''
      }
      this.expressionVisible = true // 显示
    },
    /**
     * 评估表分数描述及治疗设置 右表格-新增一行
     */
    addTreatmentRow(item, index) {
      const row = this.tableDataTreatment.filter(res => {
        return item.treatmentName == res.treatmentName
      })[0]
      const data = {
        scoreDesc: '', // 评分描述
        expression: '', // 表单式
        needTreatment: '', // 是否需要治疗：0，不需要；1，需要
        // minValue: '', // 最小值
        minLink: '', // 最小值连接符号
        maxLink: '' // 最大值连接符号
        // maxValue: '' // 最大值
      }
      if (index !== '') {
        row.details.splice(index, 0, data) // 一条数据前面插入
      } else {
        row.details.push(data) // 后面加入
      }
    },
    /**
     * 评估表分数描述及治疗设置 右表格-删除一行
     */
    deleteTreatmentItem(item, index) {
      const row = this.tableDataTreatment.filter(res => {
        return item.treatmentName == res.treatmentName
      })[0]
      // 判断是否有保存
      if (row.details[index].id) {
        this.$confirm('您确定要删除吗？', '确认信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(res => {
            treatmentconfig_deleteDetail({ id: row.details[index].id }).then(
              req => {
                row.details.splice(index, 1) // 删除前端数据
                this.$message.success('删除成功！')
                this.repairTreatment(row) // 自动补数据
              }
            )
          })
          .catch(res => {
            this.$message.success('已取消！')
          })
      } else {
        row.details.splice(index, 1) // 删除前端数据
        this.repairTreatment(row) // 自动补数据
      }
    },
    /**
     * 评估表风险及评估频次设置 删除一条数据.自动补一条
     */
    repairTreatment(row) {
      // 没有数据的时候需要补一条
      if (!row.details.length) {
        setTimeout(res => {
          row.details.push({
            scoreDesc: '', // 评分描述
            expression: '', // 表单式
            needTreatment: '', // 是否需要治疗：0，不需要；1，需要
            // minValue: '', // 最小值
            minLink: '', // 最小值连接符号
            maxLink: '' // 最大值连接符号
            // maxValue: '' // 最大值
          })
        }, 500)
      }
    },
    /**
     * 评估表分数描述及治疗设置 右表格-表格整块新增
     */
    addTreatmentTable() {
      let isReturn = false
      this.tableDataTreatment.map(res => {
        if (!res.id) {
          this.$message({
            message: `请先保存${res.treatmentName}`,
            type: 'warning'
          })
          isReturn = true
        }
      })
      if (isReturn) {
        return
      }
      this.tableDataTreatment.push({
        formId: this.tableDataLeftRowId,
        treatmentName: '配置' + (this.tableDataTreatment.length + 1),
        details: [
          {
            scoreDesc: '', // 评分描述
            expression: '', // 表单式
            needTreatment: '', // 是否需要治疗：0，不需要；1，需要
            // minValue: '', // 最小值
            minLink: '', // 最小值连接符号
            maxLink: '' // 最大值连接符号
            // maxValue: '' // 最大值
          }
        ]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.areaFormConfig {
  background: #ffffff;
  height: 100%;
  padding: 0.5% 1%;

  .elHeader1 {
    height: 34px !important;
    margin-top: 18px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    padding-left: 0px;
    justify-content: space-between;

    .iconBlue {
      display: inline-block;
      width: 3px;
      height: 16px;
      background: var(--maincolor);
    }

    div {
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
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

    .el-button {
      width: 90px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;

      span {
        margin: 0;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
      }
    }
  }

  &_left {
    width: 50%;

    &_div {
      height: 100%;
    }

    &_header {
      display: flex;
      align-items: center;
      padding: 0;
      height: 31px !important;
      background: #ffffff;
      border-radius: 2px;
      margin-bottom: 10px;

      .input {
        max-width: 200px;
        margin-right: 10px;
      }

      ::v-deep input {
        background: #f3f5f9;
        border: none;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #000622;
      }
    }

    &_main {
      padding: 0;

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
          padding: 0 8px;
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

    &_footer {
      .pagination {
        float: right;
        margin-top: 15px;
        margin-right: -30px;
      }
    }

    ::v-deep .el-dialog__body {
      padding: 20px 20px 0 20px;
    }
  }

  &_right {
    width: 50%;
    margin-left: 10px;
    padding-left: 10px;
    border-left: 2px solid #eee;
    display: flex;
    flex-direction: column;

    .el-header {
      height: 32px !important;
      padding: 0;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      // areaFormConfig_right_head 右侧搜索栏的input
      .el-input {
        width: 300px;

        .el-input__inner {
          border: none;
          background: #f3f5f9;
          border-radius: 2px;
        }
      }
    }

    .el-main {
      padding: 0;
    }

    &_body {
      height: 100%;
      overflow: auto;

      .config {
        border: 1px solid #d9e3ff;
        border-radius: 5px;
        margin-bottom: 10px;

        .title {
          height: 38px;
          line-height: 38px;
          padding: 0px 10px;
          font-size: 14px;
          background: #eef2fd;
          color: #333;
          font-weight: 600;
          display: flex;

          label {
            flex: 1;

            .titleInput {
              background: #eef2fd;
              border: 0;
              width: 250px;

              ::v-deep.el-input__inner {
                background: #eef2fd;
                border: 0;
              }
            }
          }

          div {
            width: 75px;

            span {
              width: 50px;
              padding: 0px 8px;
              font-size: 13px;
            }
          }
        }

        .content {
          height: auto;
          padding: 10px;

          ::v-deep.el-table th {
            background: #fff !important;
          }

          .addNotice {
            line-height: 32px;
            padding: 5px;
            font-size: 14px;
            height: 32px;
            color: #666;
            display: flex;
            justify-content: space-between;

            .plusClass {
              font-size: 12px;
              margin-right: 10px;
            }
          }
        }

        .right {
          width: 98px;
          display: flex;
        }
      }

      .newConfig {
        height: 38px;
        line-height: 38px;
        margin-top: 10px;
        border: 1px solid #d9e3ff;
        color: var(--maincolor);
        text-align: center;
        font-size: 14px;

        .plusClass {
          font-size: 12px;
          margin-right: 10px;
        }
      }
    }

    .el-collapse {
      height: 100%;

      .is-active {
        height: calc(100% - 96px);

        ::v-deep .el-collapse-item__wrap {
          height: calc(100% - 48px);
        }

        ::v-deep .el-collapse-item__content {
          padding-bottom: 5px;
          height: 100%;
        }
      }
    }
  }
}
</style>
