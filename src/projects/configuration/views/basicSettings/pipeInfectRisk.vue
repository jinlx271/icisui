<!-- 生命体征记录设置 -->
<template>
  <div id="pipeRisk">
    <div class="left">
      <el-container style="height:calc(100% - 2px)">
        <el-header>
          <div>
            <i class="iconBlue"></i>
            <span>{{pagePartsList[0].name}}</span>
          </div>
        </el-header>
        <icu-region :defaultPermi="['configuration:basicSettings:catheterInfectionConfig']" :defaultRegion="defaultRegion" :module="'catheterRule'"
                    @defaultRegionChange="defaultRegionChange" ref="icuRegion"></icu-region>
      </el-container>
    </div>
    <div class="right">
      <el-container style="height:100%;">
        <el-header>
          <div>
            <i class="iconBlue"></i>
            <span>{{pagePartsList[1].name}}</span>
          </div>
        </el-header>
        <el-container style="height:calc(100% - 42px)">
          <el-header>
            <div>
              <el-form v-model="searchForm" :inline="true" label-width="100px" status-icon class="flex align-items-center">
                <el-form-item prop="searchKey">
                  <el-input size="small" v-model="searchForm.searchKey" @input="debounceSearch" placeholder="规则编码/导管名称" clearable
                            >
                  </el-input>
                </el-form-item>
                <el-form-item label="导管分类" prop="selectedPipeType">
                  <el-select v-model="searchForm.selectedPipeType" placeholder="请选择" clearable size="mini"  filterable style="width: 140px; margin-right: 10px"
                             @change='getRuleList(1)'>
                    <el-option v-for="item in typeInfo.list" :key="item.dictCode" :label="item.dictName" :value="item.dictCode"
                               :disabled="item.statusDict == '0'"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-checkbox v-model="searchForm.statusDict" true-label="" false-label="1"  @change="debounceSearch">
                        显示禁用
                  </el-checkbox>
                </el-form-item>
              </el-form>
            </div>
            <div>
              <el-button v-hasPermi="['configuration:basicSettings:catheterInfectionConfig']" class="queryButton" type="primary"
                         :disabled="tableDataMonitor.length>0&&tableDataMonitor[0].isCreate" @click.native.prevent="addDictItem">添加配置项</el-button>
            </div>
          </el-header>
          <el-main style="height:calc(100% - 102px)">
            <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" ref="table"
                      :row-class-name="({row}) => row.statusDict == 0 ? 'disabled' : ''" :data="tableDataMonitor" style="width: 100%" highlight-current-row border height="100%">
              <v-table-column label="规则编码" prop="ruleCode" align="center" width="120px">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.isEdit" v-model="scope.row.ruleCode" placeholder="请输入" clearable :disabled="!scope.row.isEdit||addOrModify=='modify'">
                  </el-input>
                  <span v-else>{{scope.row.ruleCode}}</span>
                </template>
              </v-table-column>
              <v-table-column label="导管名称" prop="catheterCode" align="center">
                <template slot-scope="scope">
                  <el-select v-if="scope.row.isEdit" v-model="scope.row.catheterCode" placeholder="请选择" clearable filterable :disabled="!scope.row.isEdit"
                             @change="selectCatheter($event,scope.row)">
                    <el-option v-for="(option) in catheterList" :key="option.catheterCode" :label="option.catheterName" :value="option.catheterCode">
                    </el-option>
                  </el-select>
                  <span v-else>{{ scope.row.catheterName}}</span>
                </template>
              </v-table-column>
              <v-table-column label="导管分类" prop="catheterTypeDictName" align="center">
              </v-table-column>
              <v-table-column label="患者性别" prop="sexDict" align="center">
                <template slot-scope="scope">
                  <el-select v-if="scope.row.isEdit" v-model="scope.row.sexDict" placeholder="请选择" filterable :disabled="!scope.row.isEdit">
                    <el-option v-for="(option) in sexInfo.list" :key="option.sexDict" :label="option.dictName" :value="option.dictCode"></el-option>
                  </el-select>
                  <span v-else>{{ scope.row.sexDict?sexInfo.list.filter(item=>item.dictCode==scope.row.sexDict)[0].dictName:''}}</span>
                </template>
              </v-table-column>
              <!-- <v-table-column label="患者年龄段age（如：age>3;18<=age<=60）" align="center" width="280px">
                  <template slot-scope="scope">
                    <el-input v-if="scope.row.isEdit"  v-model="scope.row.ageRange"  clearable :disabled="!scope.row.isEdit"> </el-input>
                    <span v-else>{{scope.row.ageRange}}</span>
                  </template>
                </v-table-column> -->
              <v-table-column label="最小年龄" align="center" width="280px">
                <template slot-scope="scope">
                  <el-input-number v-if="scope.row.isEdit" v-model="scope.row.minAge" placeholder="请输入" clearable :disabled="!scope.row.isEdit" type="number" :max="150"
                                   :min="0"> </el-input-number>
                  <span v-else>{{scope.row.minAge}}</span>
                </template>
              </v-table-column>
              <v-table-column label="最大年龄" align="center" width="280px">
                <template slot-scope="scope">
                  <el-input-number v-if="scope.row.isEdit" v-model="scope.row.maxAge" placeholder="请输入" clearable :disabled="!scope.row.isEdit" type="number" :max="150"
                                   :min="0"> </el-input-number>
                  <span v-else>{{scope.row.maxAge}}</span>
                </template>
              </v-table-column>
              <v-table-column label="置管时长(小时)" prop="maxDuration" align="center">
                <template slot-scope="scope">
                  <!-- 置管时长不做限制 -->
                  <el-input-number v-if="scope.row.isEdit" v-model="scope.row.maxDuration" placeholder="请输入" clearable :disabled="!scope.row.isEdit"  :min="0">
                  </el-input-number>
                  <span v-else>{{scope.row.maxDuration}}</span>
                </template>
              </v-table-column>
              <v-table-column label="操作" align="center" fixed="right">
                <template slot-scope="scope">
                  <el-button v-hasPermi="['configuration:basicSettings:catheterInfectionConfig']" v-if="!scope.row.isEdit" type="text"
                             @click="updateItemRow(scope.row, scope.$index)">修改</el-button>
                  <el-button v-hasPermi="['configuration:basicSettings:catheterInfectionConfig']" type="text" v-if="scope.row.isEdit===true"
                             @click="cancelItemRow(scope.$index,scope.row)">取消</el-button>
                  <el-button v-hasPermi="['configuration:basicSettings:catheterInfectionConfig']" type="text" v-if="scope.row.isEdit===true"
                             @click="saveItemRow(scope.$index,scope.row)">保存</el-button>
                  <el-button v-if="!scope.row.isCreate" v-hasPermi="['configuration:basicSettings:catheterInfectionConfig']" type="text"
                             @click="enableOrDisable(scope.row)" :style="{ color: scope.row.statusDict == 1 ? '#EC0000': '#00AB44' }">
                    {{+scope.row.statusDict ? '禁用' : '启用' }}</el-button>
                </template>
              </v-table-column>
            </el-table>

          </el-main>
          <el-footer>
            <el-pagination @size-change="getRuleList" @current-change="getRuleList" :current-page="pageNum" :hide-on-single-page="true"
                           :page-size="pageSize" background layout="total, prev, pager, next" :total="totalCount"></el-pagination>
          </el-footer>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex' // 存储方式
// 导管监护项匹配
import {
  catheterRule_deleteById,
  catheterRule_edit,
  catheterRule_findAllWithPage,
  catheterRule_insert,

  catheter_findWithPage
} from '@/api/configuration'
import { debounce } from 'lodash'
import icuRegion from '@/views/configuration/basicSettings/components/icuRegion.vue'
export default {
  name: 'PipeInfectRisk',
  components: {
    icuRegion
  },
  data: function () {
    return {
      searchForm: {
        searchKey: '',
        statusDict: '',
        selectedPipeType: '' // 导管分类
      },
      typeInfo: {
        code: 'ICIS_DICT_CATHETER_TYPE',
        list: []
      },
      sexInfo: {
        code: 'HIS_DICT_SEX',
        list: []
      },
      defaultRegion: '', // 当前用户所属病区
      // 页面布局
      pagePartsList: [
        {
          width: 6,
          name: 'ICU病区'
        },
        {
          width: 18,
          height: '100%',
          name: '置管时长风险规则设置'
        }
      ],
      // 规则列表
      tableDataMonitor: [], // 数据
      pageSize: 10,
      pageNum: 1,
      totalCount: 0,
      isInsertStatus: false, // 插入新数据状态
      addOrModify: '', // 用来区分新增还是修改
      catheterList: [], // 导管列表
      loading: false,
      currItem: []
    }
  },
  props: {},
  watch: {},
  computed: {
    ...mapGetters(['currentUserWard'])
  },
  created() {
    this.defaultRegion = this.currentUserWard.wardCode
  },
  mounted: async function () {
    const batchObj = await this.$batchGetDictItemList([this.typeInfo.code, this.sexInfo.code])
    this.typeInfo.list = batchObj[this.typeInfo.code]
    this.sexInfo.list = batchObj[this.sexInfo.code]
    this.getCatheterList()
  },
  methods: {
    debounceSearch() {
      this.debounceSearchSymbol = this.debounceSearchSymbol ? this.debounceSearchSymbol : debounce(function () {
        this.getRuleList(1)
      }, 200)
      this.debounceSearchSymbol()
    },
    // 获取规则列表
    getRuleList(pageNum) {
      if (this.defaultRegion == '') {
        this.$message({
          type: 'info',
          message: '请选择病区'
        })
        return
      }
      if (pageNum) {
        this.pageNum = pageNum
      }
      const query = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        wardCode: this.defaultRegion,
        searchKey: this.searchForm.searchKey,
        statusDict: this.searchForm.statusDict,
        catheterTypeDictCode: this.searchForm.selectedPipeType || ''
      }
      this.tableDataMonitor = []
      catheterRule_findAllWithPage(query).then(res => {
        this.isInsertStatus = false
        if (res.code == 0) {
          this.tableDataMonitor = res.data.result
          this.totalCount = res.data.totolCount
        }
      })
    },
    // 获取导管列表
    getCatheterList(key) {
      this.loading = true
      const query = {
        pageSize: 10000,
        pageNum: 1,
        searchKey: key
      }
      catheter_findWithPage(query).then(res => {
        this.loading = false
        if (res.code == 0) {
          this.loading = false
          this.catheterList = res.data.result
        }
      })
    },
    // 选择导管
    selectCatheter(key, obj) {
      const result = this.catheterList.filter(item => item.catheterCode == key)[0]
      if (result) {
        obj.catheterCode = result.catheterCode
        obj.catheterName = result.catheterName
        obj.catheterTypeDictCode = result.catheterTypeDict
        const typeResult = this.typeInfo.list.filter(item => item.dictCode == obj.catheterTypeDictCode)[0]
        obj.catheterTypeDictName = typeResult.dictName
      }
    },
    // 选择导管分类
    selectCatheterType(key, obj) {
      const result = this.typeInfo.list.filter(item => item.dictCode == key)[0]
      if (result) {
        obj.catheterTypeDictName = result.dictName
      }
    },
    defaultRegionChange(defaultRegion) {
      this.defaultRegion = defaultRegion
      if (this.defaultRegion != '') {
        this.getRuleList(1)
      }
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.tableDataModule.toggleRowSelection(row)
        })
      } else {
        this.$refs.tableDataModule.clearSelection()
      }
    },
    // 添加配置项
    addDictItem() {
      this.isInsertStatus = true
      if (this.tableDataMonitor.length > 0) {
        const first = this.tableDataMonitor[0]
        if (first.isCreate) {
          return
        }
      }
      const row = {
        isCreate: true,
        isEdit: true
      }
      this.addOrModify = 'add'
      this.tableDataMonitor.unshift(row)
    },
    // 保存按钮
    saveItemRow(index, row) {
      if (this.defaultRegion == '') {
        this.$message({
          type: 'info',
          message: '请选择病区'
        })
        return
      }
      if (row.minAge !== 0 && !row.minAge || row.maxAge !== 0 && !row.maxAge || row.maxDuration !== 0 && !row.maxDuration || !row.sexDict) {
        this.$message({
          type: 'info',
          message: `请输入${!row.sexDict ? '性别 ' : ''}${!row.minAge ? '最小年龄 ' : ''}${!row.maxAge ? '最大年龄 ' : ''}${!row.maxDuration ? '时长 ' : ''}`
        })
        return
      }
      if (+row.minAge > +row.maxAge) {
        this.$message({
          type: 'info',
          message: '最大年龄需要大于最小年龄'
        })
        return
      }
      if (!row.ruleCode) {
        this.$message({
          type: 'info',
          message: '规则编码不能为空'
        })
        return
      }
      const query = row
      if (query.maxDuration != '') {
        query.maxDuration = Number(query.maxDuration)
      }
      query.wardCode = this.defaultRegion
      const filterResult = this.$refs.icuRegion.tableDataRegion.filter(obj => obj.wardCode == this.defaultRegion)
      query.wardName = filterResult[0]?.wardName
      if (this.addOrModify == 'add') {
        catheterRule_insert(query).then(res => {
          this.isInsertStatus = false
          if (res.code == 0) {
            delete row.isCreate
            row.isEdit = false
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            // this.tableDataMonitor = JSON.parse(JSON.stringify(this.tableDataMonitor))
            this.getRuleList()
          }
        }).catch(
          // this.tableDataMonitor.splice(index, 1)
        )
      } else {
        catheterRule_edit(query).then(res => {
          if (res.code == 0) {
            row.isEdit = false
            this.tableDataMonitor = JSON.parse(JSON.stringify(this.tableDataMonitor))
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.tableDataMonitor = JSON.parse(JSON.stringify(this.tableDataMonitor))
            // this.getRuleList()
          }
        })
      }
    },
    // 行内编辑时 取消按钮
    cancelItemRow(index, row) {
      this.isInsertStatus = false
      row.isEdit = false
      if (this.addOrModify == 'add') {
        this.tableDataMonitor.splice(index, 1)
      } else {
        this.tableDataMonitor = JSON.parse(JSON.stringify(this.tableDataMonitor))
        this.tableDataMonitor[index] = this.currItem[index]
      }
    },
    // 编辑当前行
    updateItemRow(row, index) {
      this.currItem[index] = { ...row }
      row.isEdit = true
      this.addOrModify = 'modify'
      this.tableDataMonitor = JSON.parse(JSON.stringify(this.tableDataMonitor))
    },
    // 启用禁用-当前行数据
    enableOrDisable(row) {
      catheterRule_deleteById({
        wardCode: row.wardCode,
        ruleCode: row.ruleCode,
        statusDict: row.statusDict == '1' ? '0' : '1'
      }).then(res => {
        this.$message({
          type: 'success',
          message: +row.statusDict ? '已禁用' : '已启用'
        })
        this.getRuleList(1)
      })
    },
    checkLength(e, key, length) {
      if (e.length > length) key = e.slice(0, length)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法

#pipeRisk {
  background: #fff;
  padding-bottom: 15px;
  display: flex;
  height: 100%;
  width: 100%;
  // 宽度为70的div 用于页面分布
  .left {
    height: 100%;
    margin-right: 10px;
    padding: 12px;
    border-right: 2px solid rgba(203, 215, 238, 0.3);
    width: 385px;
  }
  .right {
    flex: 1;
    padding-right: 10px;
    overflow-x: auto;
    padding-top: 10px;
  }
}
</style>
