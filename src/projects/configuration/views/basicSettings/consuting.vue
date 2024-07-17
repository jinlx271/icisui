<!-- 导管皮肤匹配 -->
<template>
  <div id="consutingSet">
        <div class="icuArea">
          <el-header>
            <i class="iconBlue"></i>
            <span>ICU病区</span>
          </el-header>
          <div style="margin-top:15px;height:calc(100% - 42px)">
            <icu-region :defaultPermi="['configuration:basicSettings:consuting']" :defaultRegion="defaultRegion" :module="'consuit'"
                        @defaultRegionChange="defaultRegionChange" ref="icuRegion" @regionChange="(wardInfo)=>{currentWardInfo=wardInfo}"></icu-region>
          </div>
        </div>
      <!-- 病情分析 -->
      <div class="classDiv">
        <el-header class="inputDiv">
          <i class="iconBlue"></i>
          <span>病情分析类别</span>
          <el-button v-hasPermi="['configuration:basicSettings:consuting']" @click.native.prevent="addConsuitType" size="mini" type="primary" >新增
          </el-button>
        </el-header>
        <div style=" margin-bottom: 5px;  height: calc(100% - 60px);">
          <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)"  :data="classDataList" highlight-current-row border height="100%" ref="groupInfoDivTable" size="mini" @row-click="selectConsuitType">

            <v-table-column prop="consuitTypeDictCode" label="病情分析类别编码" align="center" width="120">
            </v-table-column>
            <v-table-column  label="病情分析类别名称" align="center" width="120">
              <template slot-scope="scope">
                <el-select  v-model="scope.row.consuitTypeDictCode"  v-if="scope.row.isEdit" placeholder="请选择" filterable clearable >
                  <el-option :forceHide="item.statusDict!=1" v-for="(item) in ICIS_DICT_CONSUIT_TYPE" :key="item.dictName+item.dictCode" :label="item.dictName" :value="item.dictCode" :disabled="item.statusDict == '0'"></el-option>
                </el-select>
                <span v-else>{{filterArrValue(scope.row.consuitTypeDictCode,ICIS_DICT_CONSUIT_TYPE,'dictCode','dictName')}}</span>
              </template>
            </v-table-column>
            <v-table-column prop="sortNo" label="序号" align="center" width="120">
              <template slot-scope="scope">
                <el-input-number v-if="scope.row.isEdit" v-model="scope.row.sortNo" placeholder="请输入" controls-position="right" style="width:80px" :min="1"></el-input-number>
                <span v-else>{{scope.row.sortNo}}</span>
              </template>
            </v-table-column>
            <v-table-column label="操作" width="120" align="center" >
              <template slot-scope="scope">
                <el-button v-hasPermi="['configuration:basicSettings:consuting']" @click.prevent="cancelTypeEdit(scope.row,scope.$index)" type="text" size="small" v-if="scope.row.isEdit">取消</el-button>
                <el-button v-hasPermi="['configuration:basicSettings:consuting']" @click.prevent="saveTypeEdit(scope.row,scope.$index)" type="text" size="small"  v-if="scope.row.isEdit">保存</el-button>
                <el-button v-hasPermi="['configuration:basicSettings:consuting']" @click.prevent="modifyTypeEdit(scope.row,scope.$index)" type="text" size="small" v-else>修改</el-button>
                <el-button v-hasPermi="['configuration:basicSettings:consuting']" @click.prevent="deleteTypeEdit(scope.row,scope.$index)" type="text" size="small" class="redCss">删除</el-button>
              </template>
            </v-table-column>
          </el-table>
        </div>
      </div>

      <!-- 分组 -->
      <div class="groupInfoDiv">
        <el-header>
          <i class="iconBlue"></i>
          <span>项目分组</span>
          <el-button v-hasPermi="['configuration:basicSettings:consuting']" @click.native.prevent="addProgram" size="mini" type="primary" :disabled="!currConsuitCode">新增</el-button>
        </el-header>
        <div style=" margin-bottom: 5px;  height: calc(100% - 60px);" >
          <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)"  :data="programDataList" highlight-current-row border height="100%" ref="programDivTable" size="mini"  @row-click="selectGroupType">
            <v-table-column prop="consuitTypeGroupCode" label="分组编码" align="center" width="120">
              <template slot-scope="scope">
                <el-input v-if="scope.row.isCreate" v-model="scope.row.consuitTypeGroupCode" placeholder="请输入"></el-input>
                <span v-else>{{scope.row.consuitTypeGroupCode}}</span>
              </template>
            </v-table-column>
            <v-table-column prop="consuitTypeGroupName" label="分组名称" align="center" width="120">
              <template slot-scope="scope">
                <el-input v-if="scope.row.isEdit" v-model="scope.row.consuitTypeGroupName" placeholder="请输入"></el-input>
                <span v-else>{{scope.row.consuitTypeGroupName}}</span>
              </template>
            </v-table-column>
            <v-table-column prop="sortNo" label="序号" align="center" width="120">
              <template slot-scope="scope">
                <el-input-number v-if="scope.row.isEdit" v-model="scope.row.sortNo" placeholder="请输入" controls-position="right" style="width:80px" :min="1"></el-input-number>
                <span v-else>{{scope.row.sortNo}}</span>
              </template>
            </v-table-column>
            <v-table-column prop="displayType" label="展示方式" align="center" width="100">
              <template slot-scope="scope">
                <!-- ||(scope.row.isEdit&&moniitemList.length==0) -->
                <el-select  v-model="scope.row.dataDisplayTypeDictCode"  v-if="scope.row.isCreate||scope.row.isEdit" placeholder="请选择" filterable clearable >
                  <el-option :forceHide="item.statusDict!=1" v-for="(item) in ICIS_DICT_DATA_DISPLAY_TYPE" :key="item.dictName+item.dictCode" :label="item.dictName" :value="item.dictCode" :disabled="item.statusDict == '0'"></el-option>
                </el-select>
                <span v-else>{{filterArrValue(scope.row.dataDisplayTypeDictCode,ICIS_DICT_DATA_DISPLAY_TYPE,'dictCode','dictName')}}</span>
              </template>
            </v-table-column>
            <v-table-column label="操作" width="180" align="center" >
              <template slot-scope="scope">
                <el-button v-hasPermi="['configuration:basicSettings:consuting']" @click.prevent="cancelGroupEdit(scope.row,scope.$index)" type="text" size="small" v-if="scope.row.isEdit">取消</el-button>
                <el-button v-hasPermi="['configuration:basicSettings:consuting']" @click.prevent="saveGroupEdit(scope.row,scope.$index)" type="text" size="small"  v-if="scope.row.isEdit">保存</el-button>
                <el-button v-hasPermi="['configuration:basicSettings:consuting']" @click.prevent="modifyGroupEdit(scope.row,scope.$index)" type="text" size="small" v-else>修改</el-button>
                <el-button v-hasPermi="['configuration:basicSettings:consuting']" @click.prevent="deleteGroupEdit(scope.row,scope.$index)" type="text" size="small" class="redCss">删除</el-button>
              </template>
            </v-table-column>
          </el-table>
        </div>
      </div>

      <!-- 监护项 -->
      <div class="moniitemDiv">
        <el-header>
          <i class="iconBlue"></i>
          <span>
            监测项目
          </span>
          <el-button v-hasPermi="['configuration:basicSettings:consuting']" @click.native.prevent="addMoniitem" size="mini" type="primary" :disabled="!currGroupCode||currGroupDisplay=='4'">新增 </el-button>
        </el-header>
        <div style=" margin-bottom: 5px; height: calc(100% - 60px); " >
          <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)"  :data="moniitemList" highlight-current-row border height="100%" ref="moniDivTable" size="mini">
            <el-table-column prop="programType" label="项目类型" align="center"  width="120px" key="programType" v-if="currGroupDisplay=='3'|| currGroupDisplay=='8'">
              <template slot-scope="scope" >
                <el-select filterable v-model="scope.row.programType" placeholder="请选择"  v-if="scope.row.isCreate&&moniitemList.length==1">
                  <el-option value="1" label="医嘱分类"></el-option>
                  <el-option value="2" label="药品类型"></el-option>
                </el-select>
                <span v-else>{{scope.row.programType=='2'?'药品类型':'医嘱分类' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="moniitemCode" label="项目编码" align="center" key="moniitemCode">
              <template slot-scope="scope">
                <span>{{scope.row.moniitemCode}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="moniitemName" label="项目名称" align="center" width="240" key="moniitemName">
              <template slot-scope="scope">
                <template v-if="scope.row.isCreate" >
                  <!-- 医嘱分类 -->
                  <template v-if="currGroupDisplay=='3'||currGroupDisplay=='8'">
                      <el-select filterable clearable  v-if="scope.row.programType!='2'" v-model="scope.row.moniitemCode" placeholder="请选择" value-key="dictCode">
                        <el-option v-for="dict in ICIS_DICT_ORDER_USAGE_TYPE" :key="dict.dictCode" :label="dict.dictName" :value="dict.dictCode"  :forceHide="dict.statusDict!=1" :disabled="moniitemCodesList.includes(dict.dictCode)"></el-option>
                      </el-select>
                      <!-- 药品类型 -->
                      <el-select filterable clearable  v-else v-model="scope.row.moniitemCode" placeholder="请选择" value-key="dictCode" >
                          <el-option v-for="dict in HIS_DICT_DRUG_TYPE" :key="dict.dictCode" :label="dict.dictName" :value="dict.dictCode"  :forceHide="dict.statusDict!=1" :disabled="moniitemCodesList.includes(dict.dictCode)"></el-option>
                    </el-select>
                  </template>
                   <el-select filterable clearable  v-else-if="currGroupDisplay=='5'||currGroupDisplay=='7'" v-model="scope.row.moniitemCode" value-key="dictCode"  style="width: 100%"
                   placeholder="请选择"  :loading="loading" @change="selectMoniitem($event,scope.row)" >
                      <el-option v-for="dict in moniitem_List" :key="dict.moniitemCode" :label="dict.moniitemName" :value="dict.moniitemCode" class="flex" :disabled="moniitemCodesList.includes(dict.moniitemCode)">
                          <span class="flex-1">{{ dict.moniitemName }}</span>&nbsp;&nbsp;&nbsp;
                          <span class="flex-1 text-right" style=" color: #8492a6; font-size: 13px">{{ dict.moniitemCode }}</span>
                      </el-option>
                   </el-select>
                   <el-select filterable clearable  v-else-if="currGroupDisplay=='6'" v-model="scope.row.moniitemCode" value-key="dictCode" remote reserve-keyword  style="width: 100%"
                   placeholder="请选择" :remote-method="getCatherList" :loading="loading" @change="selectMoniitem($event,scope.row)" @clear="getCatherList()" @focus="getCatherList()">
                      <el-option v-for="dict in moniitem_List" :key="dict.moniitemCode" :label="dict.moniitemName" :value="dict.moniitemCode" class="flex" :disabled="moniitemCodesList.includes(dict.moniitemCode)">

                          <span class="flex-1">{{ dict.moniitemName }}</span>&nbsp;&nbsp;&nbsp;
                          <span class="flex-1 text-right" style=" color: #8492a6; font-size: 13px">{{ dict.moniitemCode }}</span>
                      </el-option>
                   </el-select>
                   <el-select filterable clearable  v-else v-model="scope.row.moniitemCode" value-key="dictCode" remote reserve-keyword  style="width: 100%"
                   placeholder="请选择" :remote-method="getMoniitemList" :loading="loading" @change="selectMoniitem($event,scope.row)" @clear="getMoniitemList()" @focus="getMoniitemList()">
                      <el-option v-for="dict in moniitem_List" :key="dict.moniitemCode" :label="dict.moniitemName" :value="dict.moniitemCode" class="flex" :disabled="moniitemCodesList.includes(dict.moniitemCode)">

                          <span class="flex-1">{{ dict.moniitemName }}</span>&nbsp;&nbsp;&nbsp;
                          <span class="flex-1 text-right" style=" color: #8492a6; font-size: 13px">{{ dict.moniitemCode }}</span>

                      </el-option>
                   </el-select>
                </template>
                <span v-else>{{scope.row.moniitemName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="sortNo" label="序号" align="center" width="120" key="sortNo">
              <template slot-scope="scope">
                <el-input-number v-if="scope.row.isEdit" v-model="scope.row.sortNo" placeholder="请输入" controls-position="right" style="width:80px" :min="1"></el-input-number>
                <span v-else>{{scope.row.sortNo}}</span>
              </template>
            </el-table-column>
            <el-table-column label="颜色" align="center" prop="colorDict"  key="colorDict" width="80" v-if="currGroupDisplay=='2'||currGroupDisplay=='3'">
              <template slot-scope="scope">
                <el-color-picker :disabled="!scope.row.isEdit" v-model="scope.row.colorDict"></el-color-picker>
              </template>
            </el-table-column>
            <el-table-column label="图标" align="center" prop="name" key="name" style="background:#000;" width="80" v-if="currGroupDisplay=='2'||currGroupDisplay=='3'">
              <template slot-scope="scope">
                <el-select v-if="scope.row.isEdit" value-key="dictId" style="width: 100%" v-model="scope.row.symbolDict" placeholder="请选择"
                            clearable filterable :disabled="!scope.row.isEdit">
                  <el-option v-for="(item) in ICIS_DICT_MONI_SVG" :key="item.dictId" :value="item.dictAbbr">
                    <svg width="20" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="图层_1"
                          x="0px" y="0px" viewBox="0 0 20 20" style="enable-background:new 0 0 20 20;" xml:space="preserve">
                      <path :d="item.dictAbbr" />
                    </svg>
                  </el-option>
                </el-select>
                <template v-else-if="!scope.row.isEdit&&scope.row.symbolDict">
                  <svg width="20" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="图层_1" x="0px"
                        y="0px" viewBox="0 0 20 20" style="enable-background:new 0 0 20 20;" xml:space="preserve">
                    <path :d="scope.row.symbolDict" :fill="scope.row.colorDict"/>
                  </svg>
                </template>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" align="center" >
              <template slot-scope="scope">
                <el-button v-hasPermi="['configuration:basicSettings:consuting']" @click.prevent="cancelMoniitemEdit(scope.row,scope.$index)" type="text" size="small" v-if="scope.row.isEdit">取消</el-button>
                <el-button v-hasPermi="['configuration:basicSettings:consuting']" @click.prevent="saveMoniitemEdit(scope.row,scope.$index)" type="text" size="small"  v-if="scope.row.isEdit">保存</el-button>
                <el-button v-hasPermi="['configuration:basicSettings:consuting']" @click.prevent="modifyMoniitemEdit(scope.row,scope.$index)" type="text" size="small" v-else>修改</el-button>
                <el-button v-hasPermi="['configuration:basicSettings:consuting']" @click.prevent="deleteMoniitemEdit(scope.row,scope.$index)" type="text" size="small" class="redCss">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

  </div>
</template>

<script>
import {
  consuitType_deleteById,
  consuitType_edit,
  consuitType_findWithPage,
  consuitType_insert,
  consuitType_getMaxSort,
  consuitTypeGroup_findWithPage,
  consuitTypeGroup_deleteById,
  consuitTypeGroup_edit,
  consuitTypeGroup_insert,
  consuitTypeGroup_getMaxSort,
  consuitTypeGroupMoniitem_findWithPage,
  consuitTypeGroupMoniitem_insert,
  consuitTypeGroupMoniitem_edit,
  consuitTypeGroupMoniitem_getMaxSort,
  consuitTypeGroupMoniitem_findConfigItemWithPage,
  consuitTypeGroupMoniitem_deleteById
} from '@/api/consuit.js'
import { mapGetters } from 'vuex' // 存储方式
import {
  cathPosiMp_findWithPage,
  config_listPage,
  wardModuleMonGroup_findAllWithPage
} from '@/api/configuration'
import icuRegion from '../basicSettings/components/icuRegion.vue'
import { filterArrValue } from '@/utils/utils'
export default {
  name: 'ConsutingSet',
  components: {
    icuRegion
  },
  data: function () {
    return {
      classDivHideShow: false,
      rightDivHideShow: false,
      dialogVisible: false, // 复制配置弹框
      sourceWard: null, // 源病区
      targetWard: null, // 目标病区
      defaultRegion: '',
      currentWardInfo: {
        wardCode: '',
        wardIdentification: ''
      },
      classDataList: [],
      programDataList: [],
      moniitemList: [],
      moniitem_List: [],
      ICIS_DICT_CONSUIT_TYPE: [],
      ICIS_DICT_DATA_DISPLAY_TYPE: [],
      ICIS_DICT_MONI_SVG: [],
      ICIS_DICT_ORDER_USAGE_TYPE: [],
      editFlag: false, // 编辑状态
      currEditType: null, // 记录当前编辑信息
      currConsuitCode: '', // 当前编辑分类code
      currConsuitId: '',
      currGroupCode: '',
      currGroupDisplay: '',
      currGroupId: '',
      moniPageNum: 1,
      loading: false,
      editProgramFlag: false,
      editConsuitFlag: false, // 编辑病情分析类别
      moniitemCodesList: [],
      HIS_DICT_DRUG_TYPE: []

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
      const dictCodeList = [
        'ICIS_DICT_CONSUIT_TYPE', 'ICIS_DICT_DATA_DISPLAY_TYPE', 'ICIS_DICT_MONI_SVG', 'ICIS_DICT_ORDER_USAGE_TYPE', 'HIS_DICT_DRUG_TYPE'
      ]
      // this.getMoniitemList()
      const batchObj = await this.$batchGetDictItemList(dictCodeList)
      this.ICIS_DICT_CONSUIT_TYPE = batchObj['ICIS_DICT_CONSUIT_TYPE']
      this.ICIS_DICT_DATA_DISPLAY_TYPE = batchObj['ICIS_DICT_DATA_DISPLAY_TYPE']
      this.ICIS_DICT_MONI_SVG = batchObj['ICIS_DICT_MONI_SVG']
      this.ICIS_DICT_ORDER_USAGE_TYPE = batchObj['ICIS_DICT_ORDER_USAGE_TYPE']
      this.HIS_DICT_DRUG_TYPE = batchObj['HIS_DICT_DRUG_TYPE']
    },
    defaultRegionChange(wardCode) {
      this.defaultRegion = wardCode
      this.getConsuitData()
    },
    /**
     * 获取病区对应的病情分类数据
     */
    getConsuitData() {
      this.classDataList = []
      this.programDataList = []
      this.moniitemList = []
      this.currConsuitCode = '' // 当前编辑分类code
      this.currConsuitId = ''
      this.currGroupCode = ''
      this.currGroupDisplay = ''
      this.currGroupId = ''
      this.editConsuitFlag = false
      if (this.defaultRegion == '') return
      consuitType_findWithPage({
        wardCode: this.defaultRegion,
        pageSize: 100,
        pageNum: 1
      }).then(res => {
        this.classDataList = res.data.result
      })
    },
    /**
     * 获取病情分析最大号
     */
    consuitGetMaxSort() {
      return new Promise((resolve, reject) => {
        consuitType_getMaxSort(this.defaultRegion).then(res => {
          resolve(res.data)
        })
      })
    },
    /**
     * 新增病情分析
     */
    async addConsuitType() {
      if (this.editConsuitFlag) {
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
        consuitTypeDictCode: '',
        wardCode: this.defaultRegion,
        sortNo: sortNo
      }
      this.editConsuitFlag = true
      this.classDataList.unshift(row)
    },
    /**
     * 取消病情分析编辑
     */
    cancelTypeEdit(row, index) {
      if (row.isCreate) {
        row.isEdit = false
        this.editConsuitFlag = false
        this.classDataList.splice(index, 1)
      } else {
        row.isEdit = false
        this.editConsuitFlag = false
        this.classDataList[index] = this.currEditType
      }
      this.classDataList = [...this.classDataList]
    },
    /**
     * 保存当前分析编辑
     */
    saveTypeEdit(row, index) {
      if (row.consuitTypeDictCode == '' || !row.sortNo) {
        this.$message({
          type: 'warning',
          message: '病情分析类别编码，序号 为必填项'
        })
        return
      }
      const query = {
        consuitTypeDictCode: row.consuitTypeDictCode,
        wardCode: row.wardCode,
        sortNo: row.sortNo,
        consuitTypeDictName: this.filterArrValue(row.consuitTypeDictCode, this.ICIS_DICT_CONSUIT_TYPE, 'dictCode', 'dictName')
      }
      if (row.isCreate) {
        consuitType_insert(query).then(res => {
          row.isEdit = false
          row.isCreate = false
          this.editConsuitFlag = false
          this.$message({
            type: 'success',
            message: '新增成功'
          })
          this.getConsuitData()
        })
      } else {
        query.consuitTypeId = row.consuitTypeId
        consuitType_edit(query).then(res => {
          row.isEdit = false
          this.editConsuitFlag = false
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.getConsuitData()
        })
      }
    },
    /**
     * 修改当前行编辑
     */
    modifyTypeEdit(row, index) {
      if (this.editConsuitFlag) {
        this.$message({
          type: 'warning',
          message: '完成当前编辑'
        })
        return
      }
      this.currEditType = JSON.parse(JSON.stringify(row))
      row.isEdit = true
      this.editConsuitFlag = true
      this.classDataList = [...this.classDataList]
    },
    /**
     * 删除当前行编辑
     */
    deleteTypeEdit(row, index) {
      if (row.isCreate) {
        this.cancelTypeEdit(row, index)
        return
      }
      this.$confirm('您确定要删除吗？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        consuitType_deleteById(row.consuitTypeId).then(res => {
          this.$message({
            type: 'success',
            message: res.msg || '删除功能'
          })
          if (row.isEdit) {
            this.editConsuitFlag = false
          }
          this.getConsuitData()
        })
      })
    },
    /**
     * 选中当前行
     */
    selectConsuitType(e) {
      if (e.isCreate) {
        this.programDataList = []
        this.moniitemList = []
        return
      }

      this.currConsuitCode = e.consuitTypeDictCode
      this.currConsuitId = e.consuitTypeId

      this.currGroupCode = ''
      this.currGroupDisplay = ''

      this.moniitemList = []
      // this.editFlag = false
      this.getProgramList()
    },
    /**
     * 获取项目分组列表
     */
    getProgramList() {
      consuitTypeGroup_findWithPage({
        consuitTypeDictCode: this.currConsuitCode,
        pageSize: 100,
        pageNum: 1,
        wardCode: this.defaultRegion
      }).then(res => {
        this.editProgramFlag = false
        this.programDataList = res.data.result
      })
    },
    /**
     * 返回最大项目排序号
     */
    getProgramSort() {
      return new Promise((resolve, reject) => {
        consuitTypeGroup_getMaxSort({
          wardCode: this.defaultRegion,
          consuitTypeDictCode: this.currConsuitCode,
          consuitTypeId: this.currConsuitId
        }).then(res => {
          resolve(res.data)
        })
      })
    },
    /**
     * 添加分类
     */
    async addProgram() {
      if (this.editProgramFlag) {
        this.$message({
          type: 'warning',
          message: '完成当前编辑'
        })
        return
      }
      this.editProgramFlag = true
      const sortNo = await this.getProgramSort()
      const newProgram = {
        isEdit: true,
        isCreate: true,
        wardCode: this.defaultRegion,
        consuitTypeDictCode: this.currConsuitCode,
        consuitTypeId: this.currConsuitId,
        consuitTypeGroupCode: '',
        consuitTypeGroupName: '',
        dataDisplayTypeDictCode: '', // 展示方式
        sortNo: sortNo,
        statusDict: '1'
      }
      this.programDataList.unshift(newProgram)
    },
    /**
     * 取消分组编辑
     */
    cancelGroupEdit(row, index) {
      this.editProgramFlag = false
      if (row.isCreate) {
        row.isEdit = false
        row.isCreate = false
        this.programDataList.splice(index, 1)
      } else {
        row.isEdit = false
        this.programDataList[index] = this.currEditType
      }
      this.programDataList = [...this.programDataList]
    },
    /**
     * 保存分组编辑
     */
    saveGroupEdit(row, index) {
      if (row.consuitTypeGroupCode == '' || row.consuitTypeGroupName == '' || row.dataDisplayTypeDictCode == '' || !row.sortNo) {
        this.$message({
          type: 'warning',
          message: '分组编码，分组名称，序号 ，展示方式为必填项'
        })
        return
      }
      const query = JSON.parse(JSON.stringify(row))
      if (row.isCreate) {
        delete query.isCreate
        delete query.isEdit
        consuitTypeGroup_insert(query).then(res => {
          row.isEdit = false
          row.isCreate = false
          this.editProgramFlag = false
          this.$message({
            type: 'success',
            message: '新增成功'
          })
          this.getProgramList()
        })
      } else {
        delete query.isCreate
        delete query.isEdit
        consuitTypeGroup_edit(query).then(res => {
          row.isEdit = false
          row.isCreate = false
          this.editProgramFlag = false
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.getProgramList()
        })
      }
    },
    /**
     * 修改分组当前行编辑
     */
    modifyGroupEdit(row, index) {
      if (this.editProgramFlag) {
        this.$message({
          type: 'warning',
          message: '完成当前编辑'
        })
        return
      }
      this.currEditType = JSON.parse(JSON.stringify(row))
      row.isEdit = true
      this.editProgramFlag = true
      this.programDataList = [...this.programDataList]
    },
    /**
     * 删除分组当前行编辑
     */
    deleteGroupEdit(row, index) {
      if (row.isCreate) {
        this.cancelGroupEdit(row, index)
        return
      }
      this.$confirm('您确定要删除吗？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        consuitTypeGroup_deleteById(row.consuitTypeGroupId).then(res => {
          this.$message({
            type: 'success',
            message: res.msg || '删除功能'
          })
          if (row.isEdit) {
            this.editProgramFlag = false
          }
          this.moniitemList = []
          this.getProgramList()
        })
      })
    },
    /**
     * 选中当前行
     */
    selectGroupType(e) {
      if (e.isCreate) {
        this.moniitemList = []
        return
      }

      this.currGroupCode = e.consuitTypeGroupCode
      this.currGroupId = e.consuitTypeGroupId
      this.currGroupDisplay = e.dataDisplayTypeDictCode
      // this.editFlag = false
      this.getConsuitMoniList()
      if (this.currGroupDisplay == '1' || this.currGroupDisplay == '2') {
        this.getMoniitemList()
      } else if (this.currGroupDisplay == '5') {
        this.getAssessList()
      } else if (this.currGroupDisplay == '6') {
        this.getCatherList()
      } else if (this.currGroupDisplay == '7') {
        this.getModuleMonGroup()
      }
      this.$nextTick(() => {
        this.$refs.moniDivTable.doLayout()
      })
    },
    /**
     * 获取监护列表
     */
    getConsuitMoniList() {
      consuitTypeGroupMoniitem_findWithPage({
        wardCode: this.defaultRegion,
        consuitTypeDictCode: this.currConsuitCode,
        consuitTypeId: this.currConsuitId,
        consuitTypeGroupCode: this.currGroupCode,
        pageSize: 100,
        pageNum: 1
      }).then(res => {
        this.editFlag = false
        this.moniitemList = res.data.result
        this.moniitemCodesList = this.moniitemList.map(item => item.moniitemCode)
      })
    },
    /**
     * 添加监测项目
     */
    async addMoniitem() {
      if (this.editFlag) {
        this.$message({
          type: 'warning',
          message: '完成当前编辑'
        })
        return
      }
      this.editFlag = true
      if (this.currGroupDisplay == '1' || this.currGroupDisplay == '2') {
        this.getMoniitemList()
      } else if (this.currGroupDisplay == '5') {
        this.getAssessList()
      } else if (this.currGroupDisplay == '6') {
        this.getCatherList()
      } else if (this.currGroupDisplay == '7') {
        this.getModuleMonGroup()
      }
      const sortNo = await this.getMoniitemSortNo()
      const newMoniitem = {
        isEdit: true,
        isCreate: true,
        consuitTypeDictCode: this.currConsuitCode,
        consuitTypeGroupCode: this.currGroupCode,
        wardCode: this.defaultRegion,
        consuitTypeId: this.currConsuitId,
        consuitTypeGroupId: this.currGroupId,
        moniitemCode: '',
        moniitemName: '',
        colorDict: '#000',
        configTypeDict: '',
        symbolDict: '',
        sortNo: sortNo
      }

      if ((this.currGroupDisplay == '3' || this.currGroupDisplay == '8')) {
        if (this.moniitemList.length == 0) {
          newMoniitem.programType = '1'
        } else {
          newMoniitem.programType = this.moniitemList[0].programType
        }
      }
      this.moniitemList.unshift(newMoniitem)
    },
    getMoniitemSortNo() {
      return new Promise((resolve, reject) => {
        consuitTypeGroupMoniitem_getMaxSort({
          consuitTypeDictCode: this.currConsuitCode,
          consuitTypeGroupCode: this.currGroupCode,
          wardCode: this.defaultRegion,
          consuitTypeId: this.currConsuitId,
          consuitTypeGroupId: this.currGroupId
        }).then(res => {
          resolve(res.data)
        })
      })
    },
    /**
     * 取消监测编辑
     */
    cancelMoniitemEdit(row, index) {
      if (row.isCreate) {
        row.isEdit = false
        row.isCreate = false
        this.editFlag = false
        this.moniitemList.splice(index, 1)
      } else {
        row.isEdit = false
        this.editFlag = false
        this.moniitemList[index] = this.currEditType
      }
      this.moniitemList = [...this.moniitemList]
    },
    /**
     * 保存监测编辑
     */
    saveMoniitemEdit(row, index) {
      if ((this.currGroupDisplay == '2' || this.currGroupDisplay == '3') && (row.symbolDict == '' || row.moniitemCode == '' || row.colorDict == '' || !row.sortNo)) { // 给药图 表格
        this.$message({
          type: 'warning',
          message: '项目编码，序号，图标，颜色为必填项'
        })
        return
      }
      if ((this.currGroupDisplay == '3' || this.currGroupDisplay == '8') && !row.programType) {
        this.$message({
          type: 'warning',
          message: '请选择项目分类'
        })
        return
      }
      if ((this.currGroupDisplay == '1') && (row.moniitemCode == '' || !row.sortNo)) {
        this.$message({
          type: 'warning',
          message: '项目编码，序号为必填项'
        })
        return
      }
      const query = JSON.parse(JSON.stringify(row))
      if (this.currGroupDisplay == '3' || this.currGroupDisplay == '8') { //   给药图
        query.configTypeDict = 'ordertype'
        if (query.programType == '2') {
          query.moniitemName = this.filterArrValue(query.moniitemCode, this.HIS_DICT_DRUG_TYPE, 'dictCode', 'dictName')
        } else {
          query.moniitemName = this.filterArrValue(query.moniitemCode, this.ICIS_DICT_ORDER_USAGE_TYPE, 'dictCode', 'dictName')
        }
      }

      if (row.isCreate) {
        delete query.isCreate
        delete query.isEdit
        consuitTypeGroupMoniitem_insert(query).then(res => {
          row.isEdit = false
          row.isCreate = false
          this.editFlag = false
          this.$message({
            type: 'success',
            message: '新增成功'
          })
          this.getConsuitMoniList()
        })
      } else {
        delete query.isEdit
        consuitTypeGroupMoniitem_edit(query).then(res => {
          row.isEdit = false
          row.isCreate = false
          this.editFlag = false
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.getConsuitMoniList()
        })
      }
    },
    /**
     * 修改分组当前行编辑
     */
    modifyMoniitemEdit(row, index) {
      if (this.editFlag) {
        this.$message({
          type: 'warning',
          message: '完成当前编辑'
        })
        return
      }
      this.currEditType = JSON.parse(JSON.stringify(row))
      row.isEdit = true
      this.editFlag = true
      this.moniitemList = [...this.moniitemList]
    },
    /**
     * 删除分组当前行编辑
     */
    deleteMoniitemEdit(row, index) {
      if (row.isCreate) {
        this.cancelMoniitemEdit(row, index)
        return
      }
      this.$confirm('您确定要删除吗？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        consuitTypeGroupMoniitem_deleteById(row.consuitTypeGroupMoniitemId).then(res => {
          this.$message({
            type: 'success',
            message: res.msg || '删除功能'
          })
          if (row.isEdit) {
            this.editFlag = false
          }
          this.getConsuitMoniList()
        })
      })
    },
    /**
     * 获取评分类，监护项类型数据
     */
    getMoniitemList(e) {
      this.loading = true
      const query = {
        pageNum: 1,
        pageSize: 100,
        searchKey: e || '',
        statusDict: '1',
        dataDisylayType: this.currGroupDisplay
      }
      consuitTypeGroupMoniitem_findConfigItemWithPage(query).then(res => {
        this.loading = false
        this.moniitem_List = res.data.result
      })
    },
    /**
     * 获取导管列表
     */
    getCatherList(e) {
      const query = {
        pageNum: 1,
        pageSize: 200,
        searchKey: e || '',
        statusDict: '1',
        wardCode: this.defaultRegion
      }
      this.loading = true
      cathPosiMp_findWithPage(query).then(res => {
        this.loading = false
        const result = res.data.result.map(item => {
          return {
            moniitemCode: item.catheterCode,
            moniitemName: item.catheterName
          }
        })
        this.moniitem_List = [...new Map(result.map(item => [item.moniitemCode, item])).values()]
      })
    },
    /**
     * 获取评估单列表
     */
    getAssessList(e) {
      const query = {
        pageNum: 1,
        pageSize: 200,
        searchKey: e || '',
        statusDict: '1',
        wardCode: this.defaultRegion
      }
      this.loading = true
      config_listPage(query).then(res => {
        this.loading = false
        const result = res.data.result.map(item => {
          return {
            moniitemCode: item.formId,
            moniitemName: item.formName
          }
        })
        this.moniitem_List = [...new Set(result)]
      })
    },
    /**
     * 特殊治疗 数据
     */
    getModuleMonGroup() {
      const query = {
        pageNum: 1,
        pageSize: 100,
        statusDict: '1',
        wardCode: this.defaultRegion,
        busiTypeDictCode: '5',
        busiTypeDictName: '特殊治疗'
      }
      this.loading = true
      wardModuleMonGroup_findAllWithPage(query).then(res => {
        this.loading = false
        this.moniitem_List = res.data.result.map(item => {
          return {
            moniitemCode: item.monitypeCode,
            moniitemName: item.monitypeName
          }
        })
      })
    },
    /**
     * 选择监护项code 翻译名称  由于列表是远程搜索的  所有每次都翻译出来
     */
    selectMoniitem(e, row) {
      row.moniitemName = this.filterArrValue(e, this.moniitem_List, 'moniitemCode', 'moniitemName')
      if (this.currGroupDisplay == '1' || this.currGroupDisplay == '2') {
        row.configTypeDict = this.filterArrValue(e, this.moniitem_List, 'moniitemCode', 'moniitemType')
      } else {
        row.configTypeDict = '1'
      }
    }

  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法

$border-right: 2px solid rgba(203, 215, 238, 0.3);
#consutingSet {
  height: 100%;
  display: flex;
  flex-direction: row;
  background: #fff;
  overflow-x: hidden;
  width: fit-content;
  ::v-deep .el-table .el-table__row .el-input__inner{
    padding-right:30px;
  }
  .icuArea {
    width: 250px;
    border-right: $border-right;
    padding: 10px;
    display: block;
    height:100%;
  }
  .classDiv {
    width:fit-content;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 10px;
    border-right: $border-right;
    overflow: hidden;
    position: relative;
  }
  .groupInfoDiv {
    width:fit-content;
    border-right: $border-right;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 10px;
    display: flex;
    flex-direction: column;
  }
  .moniitemDiv {
    width:fit-content;
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
