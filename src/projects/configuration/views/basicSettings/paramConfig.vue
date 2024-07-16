<!-- 基础参数 -->
<template>
  <div class="basicParamConfigPage">
    <el-container class="basicParamConfig">
      <!-- 左侧菜单 -->
      <el-aside class="basicParamConfig_left">
        <el-container class="basicParamConfig_left_div">
          <el-header class="basicParamConfig_left_header">
            <el-input clearable class="elInput" size="small" placeholder="输入参数名称/编码/值/值含义" suffix-icon="el-icon-search"
              v-model="queryRightData.searchKey" @input="inputFC" @keyup.enter.native="inputFC"></el-input>
          </el-header>
          <el-main>
            <el-menu v-if="menuReload" :default-openeds="defaultOpeneds" :default-active="defaultActive" is-opened
              class="el-menu-vertical-demo" :collapse-transition="true" :unique-opened="true" @select="handleSelect"
              @open="handleOpen" @close="handleOpen">
              <submenu v-for="item in menuList" :key="item.menuCode" :item="item"></submenu>
            </el-menu>
          </el-main>
        </el-container>
      </el-aside>
      <!-- 右侧内容 -->
      <el-main>
        <el-container style="height:100%">
          <!-- 表格 -->
          <el-main style="height: calc(100% - 60px)" v-loading="loading">
            <el-table
              @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
              ref="tableDataTwo" :data="tableDataTwo" fit border highlight-current-row height="100%"
              style="width: 100%;height:100%">
              <v-table-column align="center" prop="paramCode" label="参数分组及编码" min-width="60px">
                <template slot-scope="scope">
                  <!-- <el-input v-if="scope.row.isEdit" v-model="scope.row.paramCode" clearable :disabled="scope.row.isEdit&&!scope.row.isCreate"></el-input> -->
                  <span>{{ scope.row.paramGroupCode }}|{{ scope.row.paramCode }}</span>
                </template>
              </v-table-column>
              <v-table-column align="center" prop="paramName" label="参数名称" min-width="130px">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.isEdit" v-model="scope.row.paramName" clearable
                    :disabled="!scope.row.isEdit"></el-input>
                  <span v-else>{{ scope.row.paramName }}</span>
                </template>
              </v-table-column>
              <!-- <v-table-column align="center" prop="paramValue" label="参数值" min-width="200px">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.isEdit" v-model="scope.row.paramValue" type="textarea" autosize clearable :disabled="!scope.row.isEdit"></el-input>
                  <div v-else-if="scope.row.paramGroupCode === 'XTCS' && scope.row.paramCode === '1003'" class="paramValueCss">****</div>
                  <div v-else class="paramValueCss">{{scope.row.paramValue}}</div>
                </template>
                </v-table-column>-->
              <v-table-column align="center" prop="paramDesc" label="参数描述" min-width="130px">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.isEdit" v-model="scope.row.paramDesc" placeholder="请输入" type="textarea"
                    autosize clearable :disabled="!scope.row.isEdit"></el-input>
                  <div class="text-wrapper" v-else v-html="scope.row.paramDesc"></div>
                </template>
              </v-table-column>
              <v-table-column align="center" prop="paramScopeDict" label="参数应用范围" min-width="80px">
                <template slot-scope="scope">
                  <el-select v-if="scope.row.isEdit || scope.row.paramScopeDict" style="width: 80%"
                    v-model="scope.row.paramScopeDict" placeholder="请选择" clearable filterable
                    :disabled="!scope.row.isEdit">
                    <el-option v-for="(item) in dictParamScopeList" :key="item.dictCode" :label="item.dictName"
                      :value="item.dictCode" :disabled="item.statusDict == '0'"></el-option>
                  </el-select>
                  <span v-else></span>
                </template>
              </v-table-column>
              <v-table-column align="center" label="操作" width="120px" fixed="right">
                <template slot-scope="scope">
                  <el-button v-hasPermi="['configuration:basicSettings:paramConfig']" v-if="!scope.row.isEdit"
                    @click.native.prevent="modifyRow(scope.$index, scope.row)" type="text" size="small">修改</el-button>
                  <el-button v-hasPermi="['configuration:basicSettings:paramConfig']" type="text" v-if="scope.row.isEdit"
                    @click="cancelItemRow(scope.$index, scope.row)">取消</el-button>
                  <el-button v-hasPermi="['configuration:basicSettings:paramConfig']" type="text" v-if="scope.row.isEdit"
                    @click="confirmAddParamItem(scope.row)">保存</el-button>
                </template>
              </v-table-column>
            </el-table>
          </el-main>
          <!-- 翻页部分 -->
          <el-footer class="basicParamConfig_right_footer">
            <el-pagination @size-change="changePagination" @current-change="changePagination"
              :current-page="queryRightData.pageNum" :page-size="queryRightData.pageSize" :total="totolCount"
              :hide-on-single-page="false" background layout="total, prev, pager, next"
              style="float:right;margin-top:15px;margin-right:-10px"></el-pagination>
          </el-footer>
        </el-container>
      </el-main>

      <el-dialog v-el-drag-dialog :title="modifyTitle" :visible.sync="modifyVisible" :before-close="closeDialog"
        :width="modifyWidth" custom-class="param-config-dialog">
        <el-form :rules="rules" ref="row" :model="row" label-width="130px">
          <el-form-item label="参数分组及编码" prop="paramCode">{{ row.paramGroupCode ? row.paramGroupCode : '' }}|{{
            row.paramCode ? row.paramCode : '' }}</el-form-item>
          <el-form-item label="参数名称" prop="paramName">
            <el-input v-model="row.paramName" placeholder="请输入"></el-input>
          </el-form-item>
          <!-- 曲线连线控制参数 -->
          <paramConfigMoniLineControlModel ref="ref" :paramValue.sync="row.paramValue"
            v-if="modifyVisible && row.paramId == '202207051434400004'"></paramConfigMoniLineControlModel>
          <!-- 入量计算方式 -->
          <paramConfigIntake ref="ref" :paramValue.sync="row.paramValue"
            v-else-if="modifyVisible && row.paramId == '202203101100000001'"></paramConfigIntake>
          <!-- 关注项提醒时间 -->
          <paramConfigOberserveTime ref="ref" :paramValue.sync="row.paramValue"
            v-else-if="modifyVisible && row.paramId == '202111011038530001'"></paramConfigOberserveTime>
          <!-- 出区监护项配置 -->
          <paramConfigOutDeptMoni ref="ref" :paramValue.sync="row.paramValue"
            v-else-if="modifyVisible && row.paramId == '202110151346500044'"></paramConfigOutDeptMoni>
          <!-- 数据采集项与系统监护项映射 -->
          <paramConfigCollectRelativeMoni ref="ref" :paramValue.sync="row.paramValue"
            v-else-if="modifyVisible && row.paramId == '202111151051090060'"></paramConfigCollectRelativeMoni>
          <!-- 医嘱分类对应液体平衡监护项 -->
          <paramConfigOrderRelativeFluid ref="ref" :paramValue.sync="row.paramValue"
            v-else-if="modifyVisible && row.paramId == '202108201416090526'"></paramConfigOrderRelativeFluid>
          <!-- 导管分类对应液体平衡监护项 -->
          <paramConfigPipeRelativeFluid ref="ref" :paramValue.sync="row.paramValue"
            v-else-if="modifyVisible && row.paramId == '202108201416320527'"></paramConfigPipeRelativeFluid>
          <!-- 按病区配置医嘱分类 -->
          <paramConfigOrderUsageType ref="ref" :paramValue.sync="row.paramValue"
            v-else-if="modifyVisible && row.paramId == '202310271101500016'"></paramConfigOrderUsageType>
          <!-- 有降温的监护项目 -->
          <paramConfigTemperature ref="ref" :paramValue.sync="row.paramValue"
            v-else-if="modifyVisible && row.paramId == '202111041607260001'"></paramConfigTemperature>
          <!-- 无纸化参数 -->
          <paramConfigPaperless ref="ref" :paramValue.sync="row.paramValue"
            v-else-if="modifyVisible && row.paramId == '202205271643000001'"></paramConfigPaperless>
          <!-- 医嘱流速 -->
          <paramOrderFlowRate ref="ref" :paramValue.sync="row.paramValue"
            v-else-if="modifyVisible && row.paramId == '202205231541313266'"></paramOrderFlowRate>
          <!-- 采集平台数据同步定时任务表示式 -->
          <Crontab ref="ref" @fill="(v) => { row.paramValue = v }" :expression="row.paramValue"
            v-else-if="modifyVisible && row.paramId == '202111151057260067'"></Crontab>
          <!-- ca签名 -->
          <paramConfigCaAutograph ref="ref" :paramValue.sync="row.paramValue"
            v-else-if="modifyVisible && row.paramId == '202201181727037181'"></paramConfigCaAutograph>
          <!-- 水印设置 -->
          <paramConfigWatermarkSettings ref="ref" :paramValue.sync="row.paramValue"
            v-else-if="modifyVisible && row.paramId == '202204121453244971'"></paramConfigWatermarkSettings>
          <!-- DVT预防药品 -->
          <paramConfigSelect ref="ref" :type="'1'" :paramValue.sync="row.paramValue"
            v-else-if="modifyVisible && row.paramId == '202110191002190108'"></paramConfigSelect>
          <!-- 续药频次设置 -->
          <paramConfigSelect ref="ref" :type="'2'" :paramValue.sync="row.paramValue"
            v-else-if="modifyVisible && row.paramId == '202203011100000001'"></paramConfigSelect>
          <!-- 临嘱执行计划的预开始时间为医嘱开始时间的频次 -->
          <paramConfigSelect ref="ref" :type="'3'" :paramValue.sync="row.paramValue"
            v-else-if="modifyVisible && row.paramId == '202306161100000011'"></paramConfigSelect>
          <!-- PDF上传到FTP地址配置 0024 202208260956000001-->
          <paramConfig360View ref="ref" :paramValue.sync="row.paramValue"
            v-else-if="modifyVisible && row.paramId == '202208260956000001'"></paramConfig360View>
          <!-- NIS5.X体征回写接口上传频率 -->
          <Crontab ref="ref" @fill="(v) => { row.paramValue = v }" :expression="row.paramValue"
            v-else-if="modifyVisible && row.paramId == '202205101600000003'"></Crontab>
          <!-- HDW是否启用及执行时间 -->
          <HDWTime ref="ref" :paramValue.sync="row.paramValue"
            v-else-if="modifyVisible && row.paramId == '202207051443000099'"></HDWTime>
          <!-- 自动归档 -->
          <paramAutoFile ref="ref" :paramValue.sync="row.paramValue"
            v-else-if="modifyVisible && row.paramId == '202209261026550001'"></paramAutoFile>
          <!-- 电子病历调阅 -->
          <paramConfigSelectElectronicMedicalRecord ref="ref" :paramValue.sync="row.paramValue"
            v-else-if="modifyVisible && row.paramId == '202210131434400005'"></paramConfigSelectElectronicMedicalRecord>
          <!-- 密码同步修改 -->
          <paramConfigSyncPassModify ref="ref" :paramValue.sync="row.paramValue"
            v-else-if="modifyVisible && row.paramId == '202212121105150000'"></paramConfigSyncPassModify>
          <!--隐私信息加密 202211230940260000-->
          <ParamConfigEncryption ref="ref" :paramValue.sync="row.paramValue"
            v-else-if="modifyVisible && row.paramId == '202211230940260000'"></ParamConfigEncryption>
          <!-- 集团5X移动PDA接口对接 || 获取NIS评估结果接口 -->
          <paramConfigSyncSelectPDA ref="ref" :paramValue.sync="row.paramValue" :select-dict.sync="row.selectDict"
            v-else-if="modifyVisible && (row.paramId == '202302171325500000' || row.paramId == '202310191609500001')">
          </paramConfigSyncSelectPDA>
          <!-- 护理监护数据自动写入护理记录的监护项编码 -->
          <paramConfigAutoNursingRecord ref="ref" :paramValue.sync="row.paramValue"
            v-else-if="modifyVisible && row.paramId == '202304191715080000'"></paramConfigAutoNursingRecord>
          <!-- 密保强度 -->
          <paramPasswordStrength ref="ref" :paramValue.sync="row.paramValue"
            v-else-if="modifyVisible && row.paramId == '202306021101500006'"></paramPasswordStrength>
          <paramConfigAssement ref="ref" :paramValue.sync="row.paramValue"
            v-else-if="modifyVisible && row.paramId == '202307271019470009'"></paramConfigAssement>
          <!-- 血糖回传 -->
          <paramBloodGlucose ref="ref" :paramValue.sync="row.paramValue"
            v-else-if="modifyVisible && row.paramId == '202311130951220000'"></paramBloodGlucose>
          <!-- 5XNIS体征回写接口（POST版） -->
          <paramConfig5XNISSign ref="ref" :paramValue.sync="row.paramValue"
            v-else-if="modifyVisible && row.paramId == '202311171437100010'"></paramConfig5XNISSign>
          <!-- 是否启用CA签名 -->
          <cASignature ref="ref" :paramValue.sync="row.paramValue" :select-dict.sync="row.selectDict"
            v-else-if="modifyVisible && row.paramId == '202201131055456941'"></cASignature>
          <!-- WINGPT配置 -->
          <paramConfigWINGPT ref="ref" :paramValue.sync="row.paramValue"
            v-else-if="modifyVisible && row.paramId == '202311131101500016'"></paramConfigWINGPT>
          <!-- 大屏配置 -->
          <paramConfigShiftHandoverScreen ref="ref" :paramValue.sync="row.paramValue"
            v-else-if="modifyVisible && row.paramId == '202311241424570001'"></paramConfigShiftHandoverScreen>
          <paramConfig129 ref="ref" :paramValue.sync="row.paramValue" :paramCode.sync="row.paramCode "
            v-else-if="modifyVisible && row.paramId == '2023112271533700001'"></paramConfig129>
          <paramConfig129 ref="ref" :paramValue.sync="row.paramValue" :paramCode.sync="row.paramCode "
            v-else-if="modifyVisible && row.paramCode == 'XTCS0150'"></paramConfig129>
          <paramConfig137 ref="ref" :paramValue.sync="row.paramValue"
            v-else-if="modifyVisible && row.paramId == '202401251308510000'"></paramConfig137>
          <!-- 膳食处方 -->
          <paramConfigNutritionPrescription ref="ref" :paramValue.sync="row.paramValue"
            v-else-if="modifyVisible && row.paramId == '202401161101500016'"></paramConfigNutritionPrescription>
          <paramConfig141 v-else-if="modifyVisible && row.paramId == '202402281327520133'" ref="ref"
            :paramValue.sync="row.paramValue" :selectDict="row.selectDict">
          </paramConfig141>
          <paramConfig142 v-else-if="modifyVisible && row.paramCode == 'XTCS0142'" ref="ref"
            :paramValue.sync="row.paramValue" fromBusiTypeDictCode="5" busiTypeDictCode="3" title="液体平衡监护项" businessTitle="CRRT监测项">
          </paramConfig142>
          <paramConfig142 v-else-if="modifyVisible && row.paramCode == 'XTCS0189'" ref="ref"
            :paramValue.sync="row.paramValue" fromBusiTypeDictCode="2" busiTypeDictCode="3" title="液体平衡监护项" businessTitle="监护数据监测项">
          </paramConfig142>
          <paramConfig134 v-else-if="modifyVisible && row.paramCode == 'XTCS0134'" ref="ref"
            :paramValue.sync="row.paramValue" busiTypeDictCode="2" multiple title="自动生成护理项"></paramConfig134>
          <paramConfig134 v-else-if="modifyVisible && row.paramCode == 'XTCS0133'" ref="ref"
            :paramValue.sync="row.paramValue" busiTypeDictCode="3" title="液体平衡监护项" dataSourceDict="6"></paramConfig134>
          <paramConfig148 ref="ref" :paramValue.sync="row.paramValue"
            v-else-if="modifyVisible && row.paramId == '202403281424570001'"></paramConfig148>
          <paramConfig149 ref="ref" :paramValue.sync="row.paramValue"
            v-else-if="modifyVisible && row.paramId == '202404091655290000'"></paramConfig149>
          <paramConfig165 v-else-if="modifyVisible && row.paramId == '202404191043180000'" ref="ref"
            :paramValue.sync="row.paramValue">
          </paramConfig165>
          <paramConfig169 v-else-if="modifyVisible && row.paramId == '202404231043180000'" ref="ref"
            :paramValue.sync="row.paramValue">
          </paramConfig169>
          <paramConfig177 v-else-if="modifyVisible && (row.paramId == '202405221334060101' || ['XTCS0188'].includes(row.paramCode))" ref="ref"
            :paramValue.sync="row.paramValue">
          </paramConfig177>
          <paramConfig179 v-else-if="modifyVisible && row.paramId == '202405241334060111'" ref="ref"
            :paramValue.sync="row.paramValue">
          </paramConfig179>
          <paramConfig186 v-else-if="modifyVisible && row.paramCode == 'XTCS0186'" ref="ref"
            :paramValue.sync="row.paramValue">
          </paramConfig186>
          <!-- paramType == 7 是上面自定义不走公共 -->
          <el-form-item label="参数值" v-else-if="row.paramType && row.paramType != '7'" prop="paramValue">
            <!-- 布尔值 1-->
            <template v-if="row.paramType == '1'">
              <el-switch v-model="row.paramValue" :active-value="'1'" :inactive-value="'0'" active-text="是"
                inactive-text="否"></el-switch>
            </template>
            <!-- 数字 2-->
            <template v-if="row.paramType == '2'">
              <el-input type="number" @input="handleEndInput" v-model="row.paramValue" placeholder="请输入"></el-input>
            </template>
            <!-- 文本 3-->
            <!-- 连接 4-->
            <template v-if="row.paramType == '3' || row.paramType == '4' || row.paramType == '7'">
              <el-input type="textarea" v-model="row.paramValue" placeholder="请输入"></el-input>
            </template>
            <!-- 下拉单选 5 下拉多选 6-->
            <template v-if="row.paramType == '5'">
              <el-select v-model="row.paramValue" :remote-method="(val) => filterData(val, row)"
                @focus="(val) => filterData(val, row)" @clear="(val) => filterData(val, row)" clearable filterable remote
                placeholder="请选择" style="width:100%">
                <el-option v-for="(item) in row.selectDict" :key="item.dictId || item.formId || item.dictCode"
                  :label="item.dictName" :value="item.dictCode"></el-option>
              </el-select>
            </template>
            <template v-if="row.paramType == '6'">
              <!-- row.selectDict 一样，单选多选，下拉的时候会冲突，所以建设这个小组件 -->
              <cacheSelect :row="row"></cacheSelect>
            </template>
          </el-form-item>
          <el-form-item label="参数值" v-else prop="paramValue">
            <template>
              <el-input type="textarea" v-model="row.paramValue" placeholder="请输入"></el-input>
            </template>
          </el-form-item>
          <el-form-item label="参数描述" prop="paramDesc">
            <el-input type="textarea" class="textarea" :rows="3" autosize resize="none" v-model="row.paramDesc"
              placeholder="请输入" maxlength="1000"></el-input>
          </el-form-item>
          <el-form-item label="参数应用范围" prop="paramName">
            <el-select style="width: 80%" v-model="row.paramScopeDict" placeholder="请选择" clearable filterable>
              <el-option v-for="(item) in dictParamScopeList" :key="item.dictCode" :label="item.dictName"
                :value="item.dictCode" :disabled="item.statusDict == '0'"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="modifySave">保存</el-button>
        </span>
      </el-dialog>
    </el-container>
  </div>
</template>
<script>
import { cloneDeep } from 'lodash'
import {
  param_insert,
  param_edit,
  paramMenu_getParamMenuList,
  paramMenu_getParamListByMultiCondition,
  moniitem_multipleListPage,
  config_monitoringEvent_listPage,
  diag_findAllWithPage
} from '@/api/configuration'
export default {
  name: 'ParamConfig',
  components: {
    paramConfigMoniLineControlModel: () =>
      import('./components/paramConfig/paramConfigMoniLineControlModel.vue'),
    paramConfigIntake: () =>
      import('./components/paramConfig/paramConfigIntake.vue'),
    paramConfigOberserveTime: () =>
      import('./components/paramConfig/paramConfigOberserveTime.vue'),
    paramConfigOutDeptMoni: () =>
      import('./components/paramConfig/paramConfigOutDeptMoni.vue'),
    paramConfigCollectRelativeMoni: () =>
      import('./components/paramConfig/paramConfigCollectRelativeMoni.vue'),
    paramConfigOrderRelativeFluid: () =>
      import('./components/paramConfig/paramConfigOrderRelativeFluid.vue'),
    paramConfigPipeRelativeFluid: () =>
      import('./components/paramConfig/paramConfigPipeRelativeFluid.vue'),
    paramConfigTemperature: () =>
      import('./components/paramConfig/paramConfigTemperature.vue'),
    paramOrderFlowRate: () =>
      import('./components/paramConfig/paramOrderFlowRate.vue'),
    Crontab: () => import('@/components/Crontab'),
    submenu: () => import('./components/paramConfig/submenu'), // 重复调用
    cacheSelect: () => import('./components/paramConfig/cacheSelect'), // 单选多选选择的值冲突。这里做一个组件解决
    paramConfigCaAutograph: () =>
      import('./components/paramConfig/paramConfigCaAutograph'), // ca签名
    paramConfigWatermarkSettings: () =>
      import('./components/paramConfig/paramConfigWatermarkSettings'), // 水印设置
    paramConfigSelect: () =>
      import('./components/paramConfig/paramConfigSelect'), // DVT预防药品 使用公共下拉多选
    paramConfigPaperless: () =>
      import('./components/paramConfig/paramConfigPaperless'),
    ParamConfigEncryption: () => import('./components/paramConfig/paramConfigEncryption'), // 隐私信息加密开关
    HDWTime: () => import('./components/paramConfig/HDWTime'),
    paramConfig360View: () => import('./components/paramConfig/paramConfig360View'),
    paramAutoFile: () => import('./components/paramConfig/paramAutoFile'),
    paramConfigSelectElectronicMedicalRecord: () => import('./components/paramConfig/paramConfigSelectElectronicMedicalRecord'),
    paramConfigSyncPassModify: () => import('./components/paramConfig/paramConfigSyncPassModify'),
    paramConfigSyncSelectPDA: () => import('./components/paramConfig/paramConfigSyncSelectPDA'),
    paramConfigAutoNursingRecord: () => import('./components/paramConfig/paramConfigAutoNursingRecord'),
    paramPasswordStrength: () => import('./components/paramConfig/paramPasswordStrength'),
    paramConfigAssement: () => import('./components/paramConfig/paramConfigAssement'),
    paramConfigOrderUsageType: () => import('./components/paramConfig/paramConfigOrderUsageType'),
    paramBloodGlucose: () => import('./components/paramConfig/paramBloodGlucose'),
    paramConfig5XNISSign: () => import('./components/paramConfig/paramConfig5XNISSign'),
    cASignature: () => import('./components/paramConfig/cASignature'),
    paramConfigWINGPT: () => import('./components/paramConfig/paramConfigWINGPT'),
    paramConfigShiftHandoverScreen: () => import('./components/paramConfig/paramConfigShiftHandoverScreen'),
    paramConfig129: () => import('./components/paramConfig/paramConfig129'),
    paramConfig137: () => import('./components/paramConfig/paramConfig137'),
    paramConfigNutritionPrescription: () => import('./components/paramConfig/paramConfigNutritionPrescription'),
    paramConfig134: () => import('./components/paramConfig/paramConfig134'),
    paramConfig141: () => import('./components/paramConfig/paramConfig141'),
    paramConfig142: () => import('./components/paramConfig/paramConfig142'),
    paramConfig148: () => import('./components/paramConfig/paramConfig148'),
    paramConfig149: () => import('./components/paramConfig/paramConfig149'),
    paramConfig165: () => import('./components/paramConfig/paramConfig165'),
    paramConfig169: () => import('./components/paramConfig/paramConfig169'),
    paramConfig177: () => import('./components/paramConfig/paramConfig177'),
    paramConfig179: () => import('./components/paramConfig/paramConfig179'),
    paramConfig186: () => import('./components/paramConfig/paramConfig186')
  },
  data: function () {
    return {
      development: '',
      treeData: [],
      row: {},
      modifyTitle: '',
      modifyVisible: false,
      modifyWidth: '',
      activeName: 'ICIS',
      loading: false, // 表格的loding
      leftGroupName: '', // 左边表格数据查询
      groupPageSize: 15, // 左侧分组数据pageSize
      groupTotolCount: 0, // 参数分组总数量
      oneRow: {}, // 左边点击的数据
      tableDataTwo: [], // 右边表格数据
      totolCount: 0, // 分页总量
      qeuryTableData: {
        pageNum: 1,
        pageSize: 10,
        searchKey: '', // 名称或者值
        paramGroupCode: '' // 类型
      },

      // 新增参数项
      addParamItemShow: false,
      // 参数项目必填属性
      paramForm: [],
      // 参数项总数
      paramTotolCount: 0,
      paramDialogTitle: '',

      // 参数项校验规则
      rules: {
        // paramName: [
        //   { required: true, message: '请输入参数项名称', trigger: 'blur' }
        // ],
        // paramCode: [
        //   { required: true, message: '请输入参数项编码', trigger: 'blur' }
        // ],
        paramValue: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (this.row.paramType == '2' && value < '0.01') {
                callback(new Error('数值要大于等于0.01!'))
              } else {
                callback()
              }
            }
          }
        ]
      },
      dictParamScopeList: [],
      menuList: [], // 左侧分组菜单
      queryRightData: {
        menuCode: '',
        searchKey: '',
        pageNum: 1,
        pageSize: 10
      }, // 右侧入参
      defaultActive: '', // 菜单的选择
      defaultOpeneds: ['01'],
      menuReload: true // 菜单刷新用
    }
  },
  props: {},
  watch: {
    tableDataTwo() {
      this.$refs.tableDataTwo.doLayout()
    }
  },
  computed: {},
  created() {
    this.development = process.env.NODE_ENV == 'development'
    this.init()
  },
  mounted() { },
  methods: {
    /**
     * 初始化
     */
    async init() {
      // 处理左边菜单
      this.getParamMenuList()
      // 右边默认数据 01 全部
      this.handleSelect('01')
      // 参数应用范围 字典
      this.dictParamScopeList = await this.$getDictItemList(
        'ICIS_DICT_PARAM_SCOPE'
      )
    },
    /**
     * 弹框保存
     */
    modifySave() {
      if (this.row.paramType == '2' && this.row.paramValue < 0.01) {
        this.$message.error('数值要大于等于0.01!')
        return
      }
      if (this.row.paramType == '6') {
        this.row.paramValue = this.row.paramValue.join(',')
        this.row = cloneDeep(this.row)
      }
      // 这里本应该后台给出明确的paramType值，但是后台偷懒并没有去改，前端补窟窿
      // 水印应该是特性paramType等于7  然而是传的3，以前的  ！paramType  不能再判断，这里拿this.$refs.ref判断，无法拿值判断
      if (this.$refs?.ref) {
        this.$refs.ref.change().then(() => {
          this.confirmAddParamItem(this.row, () => {
            this.modifyVisible = false
            this.getParamListByMultiCondition()
          })
        })
      } else {
        this.confirmAddParamItem(this.row, () => {
          this.modifyVisible = false
          this.getParamListByMultiCondition()
        })
      }
    },
    // 修改参数项目
    async modifyRow(index, row) {
      switch (row.paramId) {
        case '202207051434400004': // 曲线连线控制参数
          this.switchCase('820px', row)
          break
        case '202203101100000001': // 入量计算方式
          this.switchCase('820px', row)
          break
        case '202111011038530001': // 关注项提醒时间
          this.switchCase('420px', row)
          break
        case '202110151346500044': // 出区监护项配置
          this.switchCase('820px', row)
          break
        case '202111151051090060': // 数据采集项与系统监护项映射
          this.switchCase('820px', row)
          break
        case '202108201416090526': // 医嘱分类对应液体平衡监护项
          this.switchCase('820px', row)
          break
        case '202108201416320527': // 导管分类对应液体平衡监护项
          this.switchCase('820px', row)
          break
        case '202310271101500016': // 按病区配置医嘱分类
          this.switchCase('820px', row)
          break
        case '202111041607260001': // 有降温的监护项目
          this.switchCase('820px', row)
          break
        case '202111151057260067': // 采集平台数据同步定时任务表示式
          this.switchCase('820px', row)
          break
        case '202205271643000001': // 无纸化归档参数设置 XTCS0010
          this.switchCase('820px', row)
          break
        case '202205231541313266': // 自定义医嘱流速
          this.switchCase('820px', row)
          break
        case '202201181727037181': // ca签名
          this.switchCase('820px', row)
          break
        case '202205101600000003': // NIS5.X体征回写接口上传频率
          this.switchCase('820px', row)
          break
        case '202204121453244971': // 水印设置
          this.switchCase('820px', row)
          break
        case '202110191002190108': // DVT预防药品
          this.switchCase('820px', row)
          break
        case '202203011100000001': // 续药频次设置
          this.switchCase('820px', row)
          break
        case '202306161100000011': // 临嘱执行计划的预开始时间为医嘱开始时间的频次
          this.switchCase('820px', row)
          break
        case '202207051443000099': // HDW是否启用及执行时间
          this.switchCase('820px', row)
          break
        case '202209261026550001': // 无纸化归档参数设置 XTCS0010
          this.switchCase('820px', row)
          break
        case '202210131434400005': // 电子病历调阅接口配置
          this.switchCase('820px', row)
          break
        case '202404191043180000': // 液体平衡班次汇总区计算规则配置
        case '202311130951220000': // 血糖回传
          this.switchCase('820px', row)
          break
        case '202311241424570001': // 大屏配置
          this.switchCase('840px', row)
          break
        case '2023112271533700001': // 大屏配置
          this.switchCase('840px', row)
          break
        case '202401240919070000': // 134 医嘱对应自定义
          this.switchCase('840px', row)
          break
        default:
          // 通用 布尔 输入 文本 连接 下拉 组件类型
          // if (row.paramType) { 因为表格要隐藏。没有paramType也要弹出框框
          this.row = cloneDeep(row)
          this.modifyTitle = '修改参数'
          // 单选 多选
          if (this.row.paramType == '5' || this.row.paramType == '6') {
            if (this.row.paramType == '6') {
              //  多选 值转换为数组
              if (
                typeof this.row.paramValue == 'string' &&
                this.row.paramValue.constructor == String
              ) {
                if (this.row.paramValue == '') {
                  this.row.paramValue = []
                } else {
                  this.row.paramValue = this.row.paramValue.split(',')
                }
              }
            }
            if (this.row.selectType == '1') {
              // 字典 去拿字典值
              this.row.selectDict = await this.$getDictItemList(
                this.row.selectDict
              )
              this.row.allSelectDict = JSON.parse(
                JSON.stringify(this.row.selectDict)
              )
            } else if (this.row.selectType == '2') {
              // 去监护表拿数据
              if (
                !(
                  this.row.selectDict &&
                  typeof this.row.selectDict == 'object' &&
                  this.row.selectDict.constructor == Array
                )
              ) {
                this.row.selectDict = await this.getMoniitem('')
              }
            } else if (this.row.selectType == '3') {
              // 自定义 拿后台给的 ’selectDict‘
              if (
                !(
                  this.row.selectDict &&
                  typeof this.row.selectDict == 'object' &&
                  this.row.selectDict.constructor == Array
                )
              ) {
                const selectDict = []
                this.row.selectDict = JSON.parse(this.row.selectDict)
                for (const i in this.row.selectDict) {
                  selectDict.push({
                    dictName: this.row.selectDict[i],
                    dictCode: i,
                    statusDict: '1'
                  })
                }
                this.row.selectDict = selectDict
                this.row.allSelectDict = JSON.parse(
                  JSON.stringify(this.row.selectDict)
                )
              }
            } else if (this.row.selectType == '4') { // 监护事件
              if (
                !(
                  this.row.selectDict &&
                  typeof this.row.selectDict == 'object' &&
                  this.row.selectDict.constructor == Array
                )
              ) {
                this.row.selectDict = await this.getEventList('')
              }
            } else if (this.row.selectType == 'DIAGNOSIS') {
              if (
                !(
                  this.row.selectDict &&
                  typeof this.row.selectDict == 'object' &&
                  this.row.selectDict.constructor == Array
                )
              ) {
                this.row.selectDict = await this.getDiagList('')
              }
            }
          }
          this.modifyVisible = true
          // } else {
          //   this.paramForm[index] = { ...row }
          //   row.isEdit = true
          //   this.tableDataTwo = JSON.parse(JSON.stringify(this.tableDataTwo))
          // }
          break
      }
    },
    getDiagList(key) {
      return new Promise(resolve => {
        const query = {
          pageSize: 200,
          pageNum: 1,
          statusDict: '1', // 查询启用的
          searchKey: key // 搜索条件
        }
        diag_findAllWithPage(query).then(res => {
          const data = []
          if (res?.data?.result) {
            res.data.result.map(item => {
              data.push({
                dictCode: item.diagnoseName,
                statusDict: item.statusDict,
                dictName: item.diagnoseName
              })
            })
          }
          resolve(data)
        })
      })
    },
    /**
     * 抽公共方法
     */
    switchCase(width, row) {
      this.modifyTitle = '修改参数'
      this.modifyWidth = width
      this.row = cloneDeep(row)
      this.modifyVisible = true
    },
    /**
     * 关闭弹框
     */
    closeDialog() {
      this.row = {}
      this.modifyVisible = false
    },
    /**
     * 单选过滤
     */
    async filterData(key, row) {
      if (typeof key != 'string') {
        key = ''
      }
      if (row.selectType == '1') {
        // 字典值
        this.row.selectDict = this.row.allSelectDict.filter(res => {
          return (
            res.dictCode.indexOf(key) !== -1 || res.dictName.indexOf(key) !== -1
          )
        })
      } else if (row.selectType == '2') {
        // 监护表
        this.row.selectDict = await this.getMoniitem(key)
      } else if (row.selectType == '3') {
        // 自定义
        this.row.selectDict = this.row.allSelectDict.filter(res => {
          return (
            res.dictCode.indexOf(key) !== -1 || res.dictName.indexOf(key) !== -1
          )
        })
      } else if (row.selectType == '4') {
        // 自定义
        this.row.selectDict = await this.getEventList(key)
      }
    },
    /**
     * 请求事件
     */
    getEventList(key, type) {
      return new Promise(resolve => {
        config_monitoringEvent_listPage({
          'pageNum': 1,
          'pageSize': 100,
          'statusDict': '1',
          'searchKey': key
        }).then(res => {
          const data = []
          if (res?.data?.result) {
            res.data.result.map(item => {
              data.push({
                dictCode: item.eventCode,
                dictName: item.eventName
              })
            })
          }
          resolve(data)
        })
      })
    },
    /**
     * 获取监护项字典
     */
    getMoniitem(key, type) {
      return new Promise(resolve => {
        const moniitemCode = []
        if (this.row.paramType == '6') { // 多选
          this?.row?.paramValue.map(i => {
            moniitemCode.push(i)
          })
        } else if (this.row.paramType == '5') {
          moniitemCode.push(this.row.paramValue)
        }
        const query = {
          moniitemCodes: moniitemCode, // 本条数据放第一条查询出来
          limit: 50, // 查询前多少条
          statusDict: '1', // 查询启用的
          searchKey: key || '' // 搜索条件
        }
        moniitem_multipleListPage(query).then(res => {
          const data = []
          if (res?.data?.result) {
            res.data.result.map(item => {
              data.push({
                dictCode: item.moniitemCode,
                dictName: item.moniitemName
              })
            })
          }
          resolve(data)
        })
      })
    },
    // 增加参数项目
    confirmAddParamItem(row, cb) {
      delete row.selectDict
      const query = row
      if (query.paramCode === '') {
        this.$message.error('参数编码不能为空')
        return false
      } else if (query.paramName === '') {
        this.$message.error('参数名称不能为空')
        return false
      }
      if (query.isCreate) {
        // 修改
        param_insert(query).then(res => {
          if (res.code == 0) {
            row.isEdit = false
            delete row.isCreate
            this.$message({
              type: 'success',
              message: '新增成功'
            })
            // 修改表格，不去拿后台数据
            this.editFc()
          }
        })
      } else {
        param_edit(query).then(res => {
          if (res.code == 0) {
            row.isEdit = false
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            if (cb) {
              cb()
            }
            // 修改表格，不去拿后台数据
            this.editFc()
          }
        })
      }
    },
    /**
     * 修改表格数据，不去拿后台数据刷新表格
     */
    editFc() {
      console.log('this.$store.state', this.$store.state)
      const storeParamObj = this.$store.state.app.paramCodeObj
      console.log('storeParamObj00 ', storeParamObj)
       if ({}.hasOwnProperty.call(storeParamObj, this.row.paramCode)) {
        delete (storeParamObj[this.row.paramCode])
        return
      }

      console.log('storeParamObj ', storeParamObj)
      this.$store.commit('set_param', storeParamObj)

      const tableArray = this.tableDataTwo.filter(res => { return res.paramId == this.row.paramId })
      if (tableArray.length > 0) {
        tableArray[0].paramName = this.row.paramName
        tableArray[0].paramDesc = this.row.paramDesc
        tableArray[0].paramScopeDict = this.row.paramScopeDict
        this.tableDataTwo = JSON.parse(JSON.stringify(this.tableDataTwo))
      }
    },
    // 取消数据编辑
    cancelItemRow(index, row) {
      row.isEdit = false
      if (row.isCreate) {
        this.tableDataTwo.splice(index, 1)
      } else {
        this.tableDataTwo[index] = this.paramForm[index]
        this.tableDataTwo = JSON.parse(JSON.stringify(this.tableDataTwo))
      }
    },

    /**
     * 左侧的菜单
     */
    getParamMenuList() {
      paramMenu_getParamMenuList({ menuName: '' }).then(res => {
        this.recursion(res.data) // 递归方法 处理菜单
        // 加入点击事件，高亮
        this.menuList.map(item => {
          item.click = true
          this.clickRecursionFc(item.child)
        })
      })
    },
    /**
     * 递归加入 点击事件
     */
    clickRecursionFc(data) {
      data.map(item => {
        item.click = false
        item.child && this.clickRecursionFc(item.child)
      })
    },
    /**
     * 菜单递归方法
     * data 所有参数 第一次不动
     * list 循环的数据
     */
    recursion(data, list = data) {
      list.map(item => {
        // 找出子数据
        const menuFilter = data.filter(
          res => item.menuCode == res.parentMenuCode
        )
        // 没有子就不给 child字段
        if (menuFilter.length > 0) {
          item.child = data.filter(res => item.menuCode == res.parentMenuCode)
        }
        // 所有数据赋值
        if (item.menuCode == '1' || item.menuName == '全部') {
          this.menuList.push(item)
        }
        // 子项目重复调用
        if (item?.child?.length > 0) {
          // this.recursion(data, item.child)
          this.recursion(item.child) // 没传data 的原因，优化的结果，递归自己下面的子类容所以其他项目不要循环找，节省速度
        }
      })
    },
    /**
     * 菜单打开的时候
     */
    handleOpen(key) {
      this.handleClose()
      this.menuList.map(item => {
        item.click = item.menuCode == key
        item.child && this.openRecursion(item.child, key)
      })
      this.menuList = JSON.parse(JSON.stringify(this.menuList))
      // 入参menuCode
      this.queryRightData.menuCode = key
      this.inputFC()
    },
    /**
     * 打开选择
     */
    openRecursion(data, key) {
      data.map(item => {
        item.click = item.menuCode == key
        item.child && this.openRecursion(item.child, key)
      })
    },
    /**
     * 菜单关闭的时候
     */
    handleClose(key) {
      this.menuList.map(item => {
        item.click = false
        item.child && this.closeRecursion(item.child)
      })
      this.menuList = JSON.parse(JSON.stringify(this.menuList))
    },
    /**
     * 关闭的递归
     */
    closeRecursion(data) {
      data.map(item => {
        item.click = false
        item.child && this.closeRecursion(item.child)
      })
    },
    /**
     * 输入框事件
     */
    inputFC() {
      // 入参页码
      this.queryRightData.pageNum = 1
      for (const i in this.menuList) {
        if (this.menuList[i].click) {
          this.queryRightData.menuCode = this.menuList[i].menuCode
        } else {
          this.inputRecursion(this.menuList[i].child)
        }
      }
      // 右侧详情数据
      this.getParamListByMultiCondition()
    },
    /**
     * 搜索下面的选中
     */
    inputRecursion(data) {
      for (const i in data) {
        if (data[i].click) {
          this.queryRightData.menuCode = data[i].menuCode
          return
        } else {
          this.inputRecursion(data[i].child)
        }
      }
    },
    /**
     * 菜单选择的时候
     */
    handleSelect(key) {
      this.handleClose()
      this.menuList.map(item => {
        item.click = item.menuCode == key
        item.child && this.openRecursion(item.child, key)
      })
      this.menuList = JSON.parse(JSON.stringify(this.menuList))
      // 入参menuCode
      this.queryRightData.menuCode = key
      // 入参条件清空一下
      this.queryRightData.searchKey = ''
      // 入参页码
      this.queryRightData.pageNum = 1
      // 右侧详情数据
      this.getParamListByMultiCondition()
    },
    /**
     * 分页数据请求
     */
    changePagination(val) {
      // 入参页码
      this.queryRightData.pageNum = val
      // 右侧详情数据
      this.getParamListByMultiCondition()
    },
    /**
     * 右侧详情数据
     */
    getParamListByMultiCondition() {
      this.loading = true
      paramMenu_getParamListByMultiCondition(this.queryRightData).then(res => {
        if (res?.data?.result) {
          this.tableDataTwo = res.data.result
          this.totolCount = res.data.totolCount
        }
        this.loading = false
      })
    },
    /**
     * 输入的校验 保留2位小数
     */
    handleEndInput(value) {
      this.row.paramValue = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法
</style>
<style lang="scss" scoped>
.basicParamConfigPage {
  background: #ffffff;
  height: 100%;
  display: block;
  padding: 1%;

  .tabs {
    height: 60px;
  }

  ::v-deep .el-tabs__nav-wrap::after {
    display: none;
  }
}

.basicParamConfig {
  font-size: 12px;
  height: 100%;

  // 左侧列表 无边框的 table
  &_left {
    padding-right: 10px;

    &_div {
      height: 100%;

      ::v-deep.el-footer {
        padding: 0 20px;
      }
    }

    &_main {
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

  ::v-deep .el-textarea__inner {
    height: auto !important;
    background: #f3f5f9;
  }
}

.paramValueCss {
  height: 100px;
  overflow-y: auto;
  // display: flex;
  align-items: center;
  justify-content: center;
}

.elInput {
  width: 100% !important;
  max-width: 300px !important;
}

::v-deep .el-menu {
  border-right: 0;
}
</style>
