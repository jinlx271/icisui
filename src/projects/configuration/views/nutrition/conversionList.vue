<!-- 抢救记录项配置 -->
<template>
  <div id="salvageItem" class="salvageItem" element-loading-text="加载中" v-loading="loading">
    <!-- ICU病区 -->
    <div class="left">
      <el-container style="height:100%">
        <el-header>
          <div>
            <i class="iconBlue"></i>
            <span>ICU病区</span>
          </div>
        </el-header>
        <icu-region style="height:calc(100% - 42px)" :defaultPermi="['configuration:nutrition:conversionList']"
          :defaultRegion="defaultRegion" :module="activeName" @defaultRegionChange="defaultRegionChange"
          ref="icuRegion"></icu-region>
      </el-container>
    </div>
    <!-- 基础病情、护理、用药记录 -->
    <div class="salvageItemBaseInfo">
      <el-container style="height:100%;">
        <el-container>
          <el-header class="elHeader3">
            <!-- input输入 -->
            <div class="headerLeft">
              <el-input size="small" placeholder="名称/编码" clearable suffix-icon="el-icon-search" v-model="searchKey"
                @input="getData(1)"></el-input>
              <el-checkbox v-model="status" true-label="" false-label="1" @change="getData(1)">
                显示禁用
              </el-checkbox>
            </div>
            <div class="headerRight">
              <el-button class="queryButton" type="primary" @click.native.prevent="getData(1)" size="small">查询</el-button>
              <el-button v-hasPermi="['configuration:nutrition:conversionList']" class="queryButton" type="primary"
                @click.native.prevent="addDrug">添加单条药品</el-button>
              <el-button v-hasPermi="['configuration:nutrition:conversionList']" class="queryButton" type="primary"
                @click.native.prevent="batchAddDrug">批量添加药品</el-button>
              <el-button v-hasPermi="['configuration:nutrition:conversionList']" class="queryButton" type="primary"
                @click.native.prevent="syncAllNutritionConvert">同步所有膳食</el-button>
              <el-button size="mini" type="primary" style="font-size:18px;width: 32px;"
                :icon="loading ? 'el-icon-loading' : 'el-icon-refresh'" @click="getData(1)">
              </el-button>
            </div>
          </el-header>

        </el-container>
        <div style="height:calc(100% - 100px)">
          <el-table
            @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
            height="100%" ref="tableData" :row-class-name="({ row }) => row.status == 0 ? 'disabled' : ''"
            :data="tableData" highlight-current-row fit border row-key="id">
            <v-table-column prop="convertType" label="类型" align="center" width="80px">
              <template slot-scope="scope">
                <span>{{ scope.row.convertType | showDictNameFilter(convertTypeList, 'dictCode_to_dictName') }}</span>
              </template>
            </v-table-column>
            <v-table-column label="名称" align="left">
              <template slot-scope="scope">
                <el-select clearable filterable remote v-model="scope.row.nutritionCode" placeholder="请选择"
                  :remote-method="remoteMethod" @change="changeDrug($event, scope.row)" popper-class="fixed-width"
                  @visible-change="clearDrugSearchKey" @clear="remoteMethod()"
                  v-if="scope.row.isEdit && scope.row.isCreate">
                  <el-option v-for="option in drugBasicData" :key="option.drugCode"
                    :label="`${option.drugName} ${option.drugSpec || ''} ${option.factoryName || ''}`"
                    :title="`${option.drugName} ${option.drugSpec || ''} ${option.factoryName || ''}`"
                    :value="option.drugCode" :disabled="option.status == 0"></el-option>
                </el-select>
                <span v-else>{{ scope.row.nutritionName }}</span>
              </template>
            </v-table-column>
            <v-table-column prop="spec" label="规格" align="left"></v-table-column>
            <v-table-column prop="unit" label="单位" align="center" width="100px"></v-table-column>
            <v-table-column prop="dose" label="用量" align="center">
              <template slot-scope="scope">
                <el-input v-if="scope.row.isEdit" v-model="scope.row.dose" placeholder="请输入" v-only-num :digit="1"
                  maxlength="9"></el-input>
                <span v-else>{{ scope.row.dose }}</span>
              </template>
            </v-table-column>
            <v-table-column prop="protein" label="蛋白质(g)" align="center" width="120px">
              <template slot-scope="scope">
                <el-input-number v-if="scope.row.isEdit" v-model="scope.row.protein" placeholder="请输入"
                  style="width: 100%;" :controls="false" :min="0" :max="999999999" :precision="1"
                  @input="handdleChangeEnergy(scope.row)"></el-input-number>
                <span v-else>{{ scope.row.protein }}</span>
              </template>
            </v-table-column>
            <v-table-column prop="fat" label="脂肪(kcal)" align="center" width="120px">
              <template slot-scope="scope">
                <el-input-number v-if="scope.row.isEdit" v-model="scope.row.fat" placeholder="请输入" style="width: 100%;"
                  :controls="false" :min="0" :max="999999999" :precision="1"
                  @input="handdleChangeEnergy(scope.row)"></el-input-number>
                <span v-else>{{ scope.row.fat }}</span>
              </template>
            </v-table-column>
            <v-table-column prop="carbohydrate" label="碳水化合物(kcal)" align="center" width="120px">
              <template slot-scope="scope">
                <el-input-number v-if="scope.row.isEdit" v-model="scope.row.carbohydrate" placeholder="请输入"
                  style="width: 100%;" :controls="false" :min="0" :max="999999999" :precision="1"
                  @input="handdleChangeEnergy(scope.row)"></el-input-number>
                <span v-else>{{ scope.row.carbohydrate }}</span>
              </template>
            </v-table-column>
            <v-table-column prop="energy" label="总热量(kcal)" align="center" width="120px">
              <template slot-scope="scope">
                <el-input-number v-if="scope.row.isEdit" v-model="scope.row.energy" placeholder="请输入" style="width: 100%;"
                  :controls="false" :min="0" :max="999999999" :precision="1"
                  @input="handdleChangeEnergy(scope.row)"></el-input-number>
                <span v-else>{{ scope.row.energy }}</span>
              </template>
            </v-table-column>
            <v-table-column label="操作" align="center" width="120px" fixed="right">
              <template slot-scope="scope">
                <el-button v-hasPermi="['configuration:nutrition:conversionList']" type="text"
                  @click="handleEdit(scope.$index, scope.row)" v-if="!scope.row.isEdit">修改</el-button>
                <el-button v-hasPermi="['configuration:nutrition:conversionList']" type="text"
                  @click="handleSave(scope.$index, scope.row)" v-if="scope.row.isEdit">保存</el-button>
                <el-button v-hasPermi="['configuration:nutrition:conversionList']" type="text"
                  @click="handleCancel(scope.$index, scope.row)" v-if="scope.row.isEdit">取消</el-button>
                <el-button v-if="!scope.row.isCreate" v-hasPermi="['configuration:nutrition:conversionList']" type="text"
                  @click="enableOrDisable(scope.$index, scope.row)"
                  :style="{ color: scope.row.status == 1 ? '#EC0000' : '#00AB44' }">{{+scope.row.status ? '禁用' :
                    '启用' }}</el-button>
              </template>
            </v-table-column>
          </el-table>
        </div>
        <el-footer>
          <el-pagination background :current-page="pageNum" :page-size="pageSize" layout="total , prev, pager, next"
            style="margin-left:-10px;float:right" :total="totolCount" @current-change="changePage">
          </el-pagination>
        </el-footer>
      </el-container>
    </div>
    <!-- 批量添加药品 -->
    <el-dialog title="批量添加营养药品" :visible.sync="isShowBatchAddDrug" width="600px" class="batch-add-drug-dialog">
      <el-form ref="form" label-width="6em">
        <el-form-item label="关键字匹配">
          <div v-show="drugNameList.length" class="drug-list">
            <el-tag v-for="drugItem in drugNameList" :key="drugItem" closable @close="handleSelectDrug(drugItem)">
              {{ drugItem }}
            </el-tag>
          </div>
          <el-input v-model="drugName" placeholder="请输入文字后按回车"
            @keydown.native.enter="handleSelectDrug(drugName)"></el-input>
        </el-form-item>
      </el-form>
      <div class="shortcut">
        <el-button type="text" v-for="item in batchDrugSearchkeyFilterList" :key="item" @click="handleSelectDrug(item)">{{
          item
        }}</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowBatchAddDrug = false">取 消</el-button>
        <el-button type="primary" @click="handleSaveBatchAddDrug">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import icuRegion from '@/views/configuration/basicSettings/components/icuRegion.vue'
import { mapGetters } from 'vuex'
import {
  nutritionConvert_findWithPage,
  nutritionConvert_insert,
  nutritionConvert_edit,
  nutritionConvert_syncConvertFromDrug,
  nutritionConvert_syncAllNutritionConvert
} from '@/api/configuration'
import { getDrugBasicData } from '@/utils/utils'
export default {
  name: 'SalvageItem',
  components: { icuRegion },
  data: function () {
    return {
      loading: false,
      defaultRegion: '',
      activeName: 'nutritionConversionConfig', // 切换  rescure_rescureBaseMoniitem   nursing  drug
      tableHeaderList: {
        rescureBaseMoniitem: [
          { label: '监护项编码', key: 'moniitemCode', width: '80' },
          { label: '监护项名称', key: 'moniitemName', width: '80' },
          { label: '监护项说明', key: 'moniitemDesc', width: '80' }
          // { label: '监护项分类', key: 'monitypeName', width: '80' },
          // { label: '排序', key: 'sortNo', width: '80' }
        ],
        nursing: [
          { label: '监护项编码', key: 'moniitemCode', width: '80' },
          { label: '监护项名称', key: 'moniitemName', width: '80' },
          { label: '监护项说明', key: 'moniitemDesc', width: '80' },
          // { label: '监护项分类', key: 'monitypeName', width: '80' },
          { label: '排序', key: 'sortNo', width: '80' }
        ]

      },
      pageNum: 1,
      pageSize: 10,
      totolCount: 0,
      tableData: [],
      searchKey: '',
      status: '',
      tabData: {
        rescureBaseMoniitem: [],
        nursing: [],
        rescureDrug: [],
        other: []
      },

      dialogShowFlag: false,
      drugTemplateFlag: false,
      drugBasicData: [], // 药品基础数据
      unitList: [],
      currRow: null,
      isShowBatchAddDrug: false, // 是否显示批量添加药品弹窗
      drugName: '',
      drugNameList: [],
      batchDrugSearchkeyList: ['葡萄糖', '脂肪乳', '氨基酸', '白蛋白', '营养'],
      // 类型,1-膳食，2-药品
      convertTypeList: [
        {
          dictCode: '1',
          dictName: '膳食'
        },
        {
          dictCode: '2',
          dictName: '药品'
        }
      ]
    }
  },
  props: {},
  watch: {},
  computed: {
    ...mapGetters(['currentUserWard']),
    batchDrugSearchkeyFilterList() {
      return this.batchDrugSearchkeyList.filter(item => !this.drugNameList.includes(item))
    }
  },
  async created() {
    this.defaultRegion = this.currentUserWard.wardCode
    // this.getData()
    this.unitList = await this.$getDictItemList('ICIS_DICT_UNIT')
    this.drugBasicData = await getDrugBasicData()
    this.tableData = await this.getDrugData()
  },
  mounted() { },
  methods: {
    async getData(pageNum) {
      this.tableData = await this.getDrugData(pageNum || this.pageNum)
    },
    async remoteMethod(e) {
      this.drugBasicData = await getDrugBasicData(e)
    },
    // 获取药品信息
    getDrugData(pageNum) {
      this.loading = true
      this.pageNum = pageNum || 1
      return new Promise((resolve, reject) => {
        const query = {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          wardCode: this.defaultRegion,
          searchKey: this.searchKey,
          status: this.status
        }
        nutritionConvert_findWithPage(query).then(res => {
          this.loading = false
          if (res.code == 0) {
            this.totolCount = res.data.totolCount
            resolve(res.data.result)
          }
        }).catch(() => {
          this.loading = false
        })
      })
    },
    /**
     * 清除关键字
     */
    async clearDrugSearchKey() {
      if (this.drugBasicData.length == 0) this.drugBasicData = await getDrugBasicData()
    },
    async changePage(pageNum) {
      this.tableData = await this.getDrugData(pageNum)
    },
    // 启用禁用-用药信息
    enableOrDisable(index, row) {
      nutritionConvert_edit({
        ...row,
        status: row.status == '1' ? '0' : '1'
      }).then(res => {
        this.getData()
        this.$message({
          type: 'success',
          message: +row.status ? '已禁用' : '已启用'
        })
      })
    },
    // 取消功能
    async handleCancel(index, row) {
      if (row.isCreate) {
        this.tableData.splice(index, 1)
      } else {
        this.tableData[index] = this.currRow
      }
      this.tableData = JSON.parse(JSON.stringify(this.tableData))
      row.isEdit = false
      this.currRow = null
      this.drugBasicData = await getDrugBasicData()
    },
    handleEdit(index, row) {
      const isEdit = this.tableData.find(item => item.isEdit)
      if (isEdit) {
        this.$message.warning('请先保存或取消当前编辑内容')
        return
      }
      this.currRow = { ...row }
      row.isEdit = true
      this.tableData = JSON.parse(JSON.stringify(this.tableData))
    },
    // 复制配置功能
    defaultRegionChange(e) {
      this.defaultRegion = e
      if (this.defaultRegion != '') {
        this.tabData = {
          rescureBaseMoniitem: [],
          nursing: [],
          rescureDrug: [],
          other: []
        }
        this.tableData = []
        this.getData()
      }
    },
    // 添加药品按钮
    async addDrug() {
      if (this.tableData.length > 0) {
        const first = this.tableData[0]
        if (first.isCreate) {
          return
        }
      }
      const isEdit = this.tableData.find(item => item.isEdit)
      if (isEdit) {
        this.$message.warning('请先保存或取消当前编辑内容')
        return
      }
      this.drugBasicData = await getDrugBasicData()
      const drug = {
        isEdit: true,
        isCreate: true,
        convertType: '2',
        nutritionCode: '',
        nutritionName: '',
        spec: '',
        unit: '',
        dose: '',
        protein: undefined,
        fat: undefined,
        carbohydrate: undefined,
        energy: undefined,
        status: '1'
      }
      this.tableData.unshift(drug)
      this.tableData = JSON.parse(JSON.stringify(this.tableData))
    },
    // 批量添加药品
    batchAddDrug() {
      this.isShowBatchAddDrug = true
      this.drugNameList = []
    },
    /**
     * 表格中编辑状态切换药品引起的数据变化
     * e 当前选中值
     * key 当前操作列表 对应的属性值
     * row 当前操作行数据
     */
    changeDrug(e, row) {
      if (e != '') {
        const selectDrug = this.drugBasicData.filter(drug => drug.drugCode == e)[0]
        row.nutritionCode = selectDrug.drugCode
        row.nutritionName = selectDrug.drugName
        row.unit = selectDrug.dosageUnit
        row.spec = selectDrug.drugSpec
      } else {
        row.nutritionCode = ''
        row.nutritionName = ''
        row.unit = ''
        row.spec = ''
      }
      this.tableData = [...this.tableData]
    },
    handleSave(index, row) {
      if (!row.nutritionCode) {
        this.$message.error('请选择药品')
        return
      }
      if (row.dose === '' || row.dose === null) {
        this.$message.error('请输入用量')
        return
      }
      if (row.dose <= 0) {
        this.$message.error('请输入大于0的用量')
        return
      }
      if (row.isCreate) {
        const query = {
          wardCode: this.defaultRegion,
          ...row
        }
        delete query.isCreate
        delete query.isEdit
        nutritionConvert_insert(query).then(res => {
          if (res.code == 0) {
            row.isEdit = false
            this.currRow = null
            delete row.isCreate
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.getData(1)
            // this.tableData = JSON.parse(JSON.stringify(this.tableData))
          }
        })
      } else {
        const query = { ...row }
        delete query.isEdit
        nutritionConvert_edit(query).then(res => {
          if (res.code == 0) {
            row.isEdit = false
            this.currRow = null
            this.tableData = JSON.parse(JSON.stringify(this.tableData))
            this.$message({
              type: 'success',
              message: '保存成功'
            })
          }
        })
      }
    },
    // tab切换
    handlerChange() {
      this.tableData = []
      this.status = ''
      if (this.tabData[this.activeName].length == 0) {
        this.getData()
      } else {
        this.tableData = [...this.tabData[this.activeName]]
      }
    },
    setDrugTemplate() {
      this.drugTemplateFlag = true
    },
    handleSaveBatchAddDrug() {
      const query = {
        wardCode: this.defaultRegion,
        drugNameList: this.drugNameList
      }
      nutritionConvert_syncConvertFromDrug(query).then(res => {
        this.$message.success('同步请求已发送！')
        this.getData(1)
        this.isShowBatchAddDrug = false
      })
    },
    handdleChangeEnergy(row) {
      // 总热量=蛋白质*4+脂肪+碳水化合物
      const { protein, fat, carbohydrate } = row
      const P = protein ? Number(protein.toString().replaceAll(/[^\d.]/g, '')) : 0
      const F = fat ? Number(fat.toString().replaceAll(/[^\d.]/g, '')) : 0
      const C = carbohydrate ? Number(carbohydrate.toString().replaceAll(/[^\d.]/g, '')) : 0
      if (protein === '' && fat === '' && carbohydrate === '') {
        row.energy = ''
      } else if (protein === undefined && fat === undefined && carbohydrate === undefined) {
        row.energy = undefined
      } else {
        row.energy = ((P * 4) + F + C).toFixed(1)
      }
    },
    // 同步所有膳食
    syncAllNutritionConvert() {
      nutritionConvert_syncAllNutritionConvert(this.defaultRegion).then(res => {
        this.$message.success('同步请求已发送！')
        this.getData(1)
      })
    },
    handleSelectDrug(drugName) {
      if (drugName) {
        if (this.drugNameList.indexOf(drugName) > -1) {
          this.drugNameList.splice(this.drugNameList.indexOf(drugName), 1)
        } else {
          this.drugNameList.push(drugName)
        }
      }
      this.drugName = ''
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法

.salvageItem {
  background: #fff;
  display: flex;
  height: 100%;
  width: 100%;

  ::v-deep .batch-add-drug-dialog {
    .shortcut {
      display: flex;
      margin-bottom: 10px;
    }

    .el-dialog {

      .el-dialog__body {
        min-height: 200px;
        max-height: 50vh;
        overflow: auto;

        .drug-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 10px;
        }
      }
    }
  }

  .left {
    height: 100%;
    margin-right: 10px;
    padding: 12px;
    border-right: 2px solid rgba(203, 215, 238, 0.3);
    width: 385px;
  }

  .salvageItemBaseInfo {
    height: 100%;
    flex: 1;
    padding: 15px 15px 0 0;
    overflow-x: auto;

    .el-header {
      height: 34px !important;
      padding: 0;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;

      .el-input {
        width: 300px;
      }

    }
  }

}
</style>
