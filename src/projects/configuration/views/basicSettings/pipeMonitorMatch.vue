<!-- 导管监护项设置 -->
<template>
  <div id="pipeMonitorMatch">
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
            <icu-region style="height:calc(100% - 42px)" :defaultPermi="['configuration:basicSettings:catheterMoniitemConfig']" :defaultRegion="defaultRegion"
                        :module="'catheterMoniitem'" @defaultRegionChange="defaultRegionChange"></icu-region>
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
                <span>导管分类</span>
              </div>
            </el-header>
            <el-container style="height:calc(100% - 42px)">
              <el-main style="height:100%">
                <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" ref="table"  :data="ICIS_DICT_CATHETER_TYPE" @row-click="selectRow" style="width: 100%" height="100%" highlight-current-row border>
                  <v-table-column label="分类编号" align="center" prop="dictCode">
                    <template slot-scope="scope">
                      <span>{{scope.row.dictCode}}</span>
                    </template>
                  </v-table-column>
                  <v-table-column label="导管分类" align="center" prop="dictName">
                    <template slot-scope="scope">
                      <span>{{scope.row.dictName}}</span>
                    </template>
                  </v-table-column>
                </el-table>
              </el-main>
            </el-container>
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
                    <span>监护项</span>
                  </div>
                </el-header>
                <el-container style="height:calc(100% - 42px)">
                  <el-header class="elHeader3">
                    <div class="headerRight">
                      <el-button v-hasPermi="['configuration:basicSettings:catheterMoniitemConfig']" class="queryButton" type="primary"
                                 :disabled="isInsertStatus" @click.native.prevent="addDictItem">新增</el-button>
                    </div>
                  </el-header>
                  <el-main style="height:calc(100% - 42px)">
                    <el-table :row-class-name="({row}) => row.statusDict == 0 ? 'disabled' : ''" @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" height="100%" ref="tableData" :data="tableData" highlight-current-row fit border>
                      <v-table-column :prop="'moniitemCode'" :label="'监护项编码'" align="left">
                        <template slot-scope="scope">
                          <span>{{scope.row.moniitemCode}}</span>
                        </template>
                      </v-table-column>
                      <v-table-column :prop="'moniitemCode'" :label="'监护项名称'" align="left">
                        <template slot-scope="scope">
                          <v-select-mon filterable v-if="scope.row.isCreate" clearable @visible-change="seleceChangeFn($event,'moniitemCode',scope.row,scope.$index)"
                                          v-model="scope.row.moniitemCode" :options="moniitem_List">
                            </v-select-mon>
                          <span v-else>{{scope.row.moniitemName}}</span>
                        </template>
                      </v-table-column>
                      <v-table-column :prop="'moniitemCode'" :label="'监护项说明'" align="left">
                        <template slot-scope="scope">
                          <span>{{scope.row.moniitemDesc}}</span>
                        </template>
                      </v-table-column>
                      <v-table-column :prop="'sortNo'" :label="'排序'" align="center">
                        <template slot-scope="scope">
                          <el-input type="number" v-if="scope.row.isEdit" v-model="scope.row.sortNo" placeholder="请输入"></el-input>
                          <span v-else>{{scope.row.sortNo}}</span>
                        </template>
                      </v-table-column>
                      <v-table-column :prop="'needFlag'" :label="'必做类型'" align="center">
                        <template slot-scope="scope">
                          <el-select v-if="scope.row.isEdit" v-model="scope.row.needFlag">
                            <el-option v-for="dict in ICIS_DICT_CATHMONI_NEED_TYPE" :key="dict.dictCode" :label="dict.dictName" :value="dict.dictCode" :disabled="dict.statusDict=='0'"></el-option>
                          </el-select>
                          <span v-else>{{filterArrValue(scope.row.needFlag,ICIS_DICT_CATHMONI_NEED_TYPE,'dictCode','dictName','')}}</span>
                        </template>
                      </v-table-column>
                      <v-table-column prop="statusDict" label="状态" align="center" min-width="150">
                        <template slot-scope="scope">
                          <el-switch v-if="scope.row.isEdit" v-model="scope.row.statusDict" active-value="1" inactive-value="0" active-text="已启用"
                                    inactive-text="已禁用"></el-switch>
                          <span v-else>{{+scope.row.statusDict ? '已启用' : '已禁用' }}</span>
                        </template>
                      </v-table-column>
                      <v-table-column label="操作" align="center" width="200px">
                        <template slot-scope="scope">
                          <el-button v-hasPermi="['configuration:basicSettings:catheterMoniitemConfig']" v-if="!scope.row.isEdit" type="text"
                                     @click="updateItemRow(scope.row, scope.$index)">修改</el-button>
                          <el-button v-hasPermi="['configuration:basicSettings:catheterMoniitemConfig']" type="text" v-if="scope.row.isEdit===true"
                                     @click="cancelItemRow(scope.$index,scope.row)">取消</el-button>
                          <el-button v-hasPermi="['configuration:basicSettings:catheterMoniitemConfig']" type="text" v-if="scope.row.isEdit===true"
                                     @click="saveItemRow(scope.$index,scope.row)">保存</el-button>
                          <el-button v-if="!scope.row.isCreate" v-hasPermi="['configuration:basicSettings:catheterMoniitemConfig']"  type="text" @click="enableOrDisable(scope.row)"  style="color:red">删除</el-button>
                          <!-- <el-button v-if="!scope.row.isCreate" v-hasPermi="['configuration:basicSettings:catheterMoniitemConfig']"  type="text" @click="enableOrDisable(scope.row)"  :style="+scope.row.statusDict ? 'color:#E6A23C':'color:#67C23A'">{{+scope.row.statusDict ? '禁用' : '启用' }}</el-button> -->
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
  moniitem_multipleListPage,
  catheterMoniitem_deleteById, // 曲线
  catheterMoniitem_edit,
  catheterMoniitem_findAllWithPage,
  catheterMoniitem_insert,
  catheterMoniitem_getMaxSort
} from '@/api/configuration'
import icuRegion from '../basicSettings/components/icuRegion.vue'
import { mapGetters } from 'vuex'
import { filterArrValue } from '@/utils/utils'
export default {
  name: 'PipeMonitorMatch',
  components: {
    icuRegion
  },
  data: function () {
    return {
      row: {},
      moniitem_List: [],
      moniitem_ListAll: [],
      ICIS_DICT_CATHETER_TYPE: [],
      searchKey: '',
      defaultRegion: '',
      // 左侧列表
      tableDataRegion: [],
      // 页面显示的项目 styleType 输入类型 生命体征信息
      showItems: [
        { label: '监护项编码', key: 'moniitemCode', width: '100', onlyShow: true, styleType: 'select', options: [] },
        { label: '监护项名称', key: 'moniitemName', width: '100', styleType: 'select', options: [] },
        { label: '监护项说明', key: 'moniitemDesc', width: '100', onlyShow: true, styleType: 'select', options: [] },
        { label: '排序', key: 'sortNo', width: '100' },
        // { label: '每日几次', key: 'iconType', width: '100' },
        // { label: '间隔时间', key: 'color', width: '100' },
        // { label: '开始时间点', key: 'start', width: '100' },
        { label: '是否必做', key: 'needFlag', width: '100', styleType: 'switch' }

      ],
      // 生命体征曲线
      tableData: [], // 数据
      // 物理降温 showtime
      // 线性特性
      lineOptions: [
        { codeValue: 'point', codeName: '点' },
        { codeValue: 'line', codeName: '折线' },
        { codeValue: 'vLine', codeName: '纵连线' }
      ],
      // 图标类型options
      iconOptions: [
        // 星形、矩形、加号、交叉线、圆圈、圆点
        { codeValue: 'star', codeName: '星型' },
        { codeValue: 'rect', codeName: '矩形' },
        { codeValue: 'plus', codeName: '加号' },
        { codeValue: 'cha', codeName: '交叉线' },
        { codeValue: 'circle', codeName: '圆圈' },
        { codeValue: 'point', codeName: '圆点' }
      ],
      currItem: [],
      isEditStatus: false,
      ICIS_DICT_CATHMONI_NEED_TYPE: [] // 必做类型
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
    const moniitem_List = await moniitem_multipleListPage({ statusDict: '1' })
    this.moniitem_List = moniitem_List.data.result
    this.moniitem_ListAll = moniitem_List.data.result
    const result = await this.$batchGetDictItemList(['ICIS_DICT_CATHMONI_NEED_TYPE', 'ICIS_DICT_CATHETER_TYPE'])
    this.ICIS_DICT_CATHETER_TYPE = result['ICIS_DICT_CATHETER_TYPE']
    this.ICIS_DICT_CATHMONI_NEED_TYPE = result['ICIS_DICT_CATHMONI_NEED_TYPE']
  },
  mounted() { },
  methods: {
    filterArrValue,
    async seleceChangeFn(e, key, row, index) {
      if (key == 'moniitemCode' || key == 'moniitemName' || key == 'moniitemDesc') {
        const sure = this.moniitem_List.filter(v => v[key] == row[key])
        if (sure.length == 1) {
          this.tableData[index].moniitemCode = sure[0].moniitemCode
          this.tableData[index].moniitemName = sure[0].moniitemName
          this.tableData[index].moniitemDesc = sure[0].moniitemDesc
          this.tableData[index].valueDictCode = sure[0].valueDictCode
        }
      }
    },
    clearSelect(e, key, row, index) {
      this.tableData[index].moniitemCode = ''
      this.tableData[index].moniitemName = ''
      this.tableData[index].moniitemDesc = ''
      this.tableData[index].valueDictCode = ''
    },
    selectRow(row) {
      this.row = row || {}
      this.selectRegion(this.defaultRegion)
      this.isEditStatus = false
    },
    defaultRegionChange(defaultRegion) {
      this.defaultRegion = defaultRegion
      this.selectRegion(this.defaultRegion)
    },
    /**
     * 启用禁用
     */
    enableOrDisable(row) {
      this.$confirm('您确定要删除吗？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        catheterMoniitem_deleteById({
            'moniitemCode': row.moniitemCode,
            'catheterTypeDictCode': this.row.dictCode,
            'wardCode': this.defaultRegion,
            statusDict: row.statusDict == '1' ? '0' : '1'
        }).then(res => {
          if (res.code == 0) {
            this.$message.success('删除成功！')
            this.selectRegion(this.defaultRegion)
          }
        })
      })
    },
    selectRegion(wardCode) {
      this.loading = true
      // 清空
      if (!this.row.dictCode || !this.row.dictName) {
        return
      }
      const params = {
        'catheterTypeDictCode': this.row.dictCode,
        'catheterTypeDictName': this.row.dictName,
        'moniitemCode': '',
        'moniitemDesc': '',
        'moniitemName': '',
        'needFlag': '',
        'pageNum': 1,
        'pageSize': 1000,
        'wardCode': wardCode,
        'searchKey': ''
      }
      catheterMoniitem_findAllWithPage(params).then(res => {
        if (res.code == 0) {
          this.tableData = res.data.result.map(v => {
            v.hasValueDisable = true
            return v
          })
        }
        this.loading = false
      })
    },
    // 添加配置项
    async addDictItem() {
      if (this.tableData.length > 0) {
        const first = this.tableData[0]
        if (first.isCreate) {
          return
        }
      }
      if (!this.row.dictCode || !this.row.dictName) {
        this.$message.info('请选择导管类型')
        return
      }
      if (this.isEditStatus) {
        this.$message.warning('请完成当前编辑行')
        return
      }
      const maxSortNo = await this.getMaxSort()
      const row = {
        'isCreate': true,
        'isEdit': true,
        'catheterTypeDictCode': this.row.dictCode,
        'catheterTypeDictName': this.row.dictName,
        'moniitemCode': '',
        'moniitemDesc': '',
        'moniitemName': '',
        'statusDict': '1',
        'needFlag': '',
        'sortNo': maxSortNo || 0,
        'wardCode': this.defaultRegion,
        'wardName': this.currentUserWard.wardName
      }
      this.isEditStatus = true
      this.tableData.unshift(row)
    },
    getMaxSort() {
      return new Promise((resolve, reject) => {
        const query = {
          'catheterTypeDictCode': this.row.dictCode,
          'wardCode': this.defaultRegion
        }
        catheterMoniitem_getMaxSort(query).then(res => {
          resolve(res.data)
        })
      })
    },
    // 编辑当前行
    updateItemRow(row, index) {
      if (this.isEditStatus) {
        this.$message.warning('请完成当前编辑行')
        return
      }
      this.currItem[index] = { ...row }
      row.isEdit = true
      this.isEditStatus = true
      this.tableData = JSON.parse(JSON.stringify(this.tableData))
    },
    // 取消当前编辑
    cancelItemRow(index, row) {
      if (row.isCreate) {
        this.tableData.splice(index, 1)
      } else {
        row.isEdit = false
        this.isEditStatus = false
        this.tableData = JSON.parse(JSON.stringify(this.tableData))
        this.tableData[index] = this.currItem[index]
      }
    },
    // 保存数据
    saveItemRow(index, row, module) {
      const promise = row.isCreate ? catheterMoniitem_insert(row) : catheterMoniitem_edit(row)
      promise.then(res => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        row.isEdit = false
        this.isEditStatus = false
        if (row.isCreate) {
          delete row.isCreate
          this.selectRegion(this.defaultRegion)
          return
        }
        this.selectRegion(this.defaultRegion)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法

#pipeMonitorMatch {
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
