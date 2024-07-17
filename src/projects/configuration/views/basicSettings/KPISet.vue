<!-- 重点患者情况设置 -->
<template>
  <div id="ICUQualityControl">
    <div class="left">
      <el-container style="height:calc(100% - 2px)">
        <el-header>
          <div>
            <i class="iconBlue"></i>
            <span>{{ pagePartsList[0].name }}</span>
          </div>
        </el-header>
        <icu-region :defaultPermi="['configuration:basicSettings:ICUQualityConfig']" :defaultRegion="defaultRegion"
          :module="'performanceConfig'" @defaultRegionChange="defaultRegionChange" ref="icuRegion"></icu-region>
      </el-container>
    </div>
    <div class="right">
      <el-tabs v-model="activeName" @tab-click="refresh">
        <el-tab-pane name="classDuration" label="班种时长配置">
        </el-tab-pane>
        <el-tab-pane name="scoreSet" label="绩效加分项配置">
        </el-tab-pane>
      </el-tabs>
      <el-container style="height:100%;display: block;" v-if="activeName=='classDuration'">
        <div class="flex flex-end align-items-center m-b10">
          <el-button size="mini" type="primary"  @click="addClassData()" class="fr">添加班种</el-button>
        </div>
        <el-main style="height:100%">
          <el-table
            @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
            ref="classTable" :data="classData" style="width: 100%" highlight-current-row border height="100%">
            <v-table-column label="班种编码" prop="classCode" align="center" width="120px">
            </v-table-column>
            <v-table-column label="班种名称" prop="className" align="center">
              <template slot-scope="scope">
                <el-select v-model="scope.row.className" v-if="scope.row.isEdit" filterable @change="changeClassCode($event,scope.row)">
                    <el-option v-for="item in ICIS_DICT_CLASS_TYPE" :label="item.dictName" :value="item.dictCode"
                      :forceHide="checkIsHave(item.dictCode)" :key="item.dictCode"></el-option>
                  </el-select>
                <span v-else>{{ scope.row.className }}</span>
              </template>
            </v-table-column>
            <v-table-column label="班种缩写" prop="classAbbr" align="center">
              <template slot-scope="scope">
                <el-input v-if="scope.row.isEdit" v-model="scope.row.classAbbr" placeholder="请输入" maxlength="20"
                  clearable :disabled="!scope.row.isEdit">
                </el-input>
                <span v-else>{{ scope.row.classAbbr }}</span>
              </template>
            </v-table-column>
            <v-table-column label="标准时长（小时）" prop="standardDuration" align="center">
              <template slot-scope="scope">
                <el-input-number v-if="scope.row.isEdit" v-model="scope.row.standardDuration" placeholder="请输入" maxlength="5"
                  clearable :disabled="!scope.row.isEdit" :min="0.01" :precision="2">
                </el-input-number>
                <span v-else>{{ scope.row.standardDuration }}</span>
              </template>
            </v-table-column>
            <v-table-column label="序号" prop="sortNo" align="center" width="150px">
              <template slot-scope="scope">
                <el-input-number :min="0" v-if="scope.row.isEdit" v-model="scope.row.sortNo" placeholder="请输入" clearable
                  :disabled="!scope.row.isEdit">
                </el-input-number>
                <span v-else>{{ scope.row.sortNo }}</span>
              </template>
            </v-table-column>
            <v-table-column label="操作" align="center" fixed="right">
              <template slot-scope="scope">
                <el-button  v-if="!scope.row.isEdit" type="text" @click="updateClassRow(scope.row, scope.$index)">修改</el-button>
                <el-button  type="text" v-if="scope.row.isEdit === true" @click="cancelClassRow(scope.$index, scope.row)">取消</el-button>
                <el-button type="text"
                  v-if="scope.row.isEdit === true" @click="saveClassRow(scope.$index, scope.row)">保存</el-button>
                <el-button type="text" @click="deleteClassRow(scope.$index, scope.row)" class="redCss">删除</el-button>

              </template>
            </v-table-column>
          </el-table>

        </el-main>
      </el-container>
      <el-container style="height:100%;display: block;" v-if="activeName=='scoreSet'">
        <div class="flex flex-end align-items-center m-b10">
          <el-button size="mini" type="primary"  @click="addItemData()" class="fr">添加加分项</el-button>
        </div>
        <el-main style="height:calc(100% - 92px)">
          <el-table
            @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
            ref="table" :row-class-name="({ row }) => row.statusDict == 0 ? 'disabled' : ''" :data="tableData"
            style="width: 100%" highlight-current-row border height="100%">
            <v-table-column label="加分项编码" prop="itemCode" align="center" width="120px">
              <template slot-scope="scope">
                 <el-input v-if="scope.row.isCreate" v-model="scope.row.itemCode" placeholder="请输入" maxlength="100"
                  clearable :disabled="!scope.row.isEdit">
                </el-input>
                <span v-else>{{ scope.row.itemCode }}</span>
              </template>
            </v-table-column>
            <v-table-column label="加分项名称" prop="itemName" align="center">
              <template slot-scope="scope">
                <el-input v-if="scope.row.isEdit" v-model="scope.row.itemName" placeholder="请输入" maxlength="200"
                  clearable :disabled="!scope.row.isEdit">
                </el-input>
                <span v-else>{{ scope.row.itemName }}</span>
              </template>
            </v-table-column>
            <v-table-column label="分值" prop="score" align="center">
              <template slot-scope="scope">
                <el-input-number v-if="scope.row.isEdit" v-model="scope.row.score" placeholder="请输入" maxlength="100"
                  clearable :disabled="!scope.row.isEdit||scope.row.computeRuleCode=='3'" :min="0" :precision="2">
                </el-input-number>
                <span v-else>{{ scope.row.score }}</span>
              </template>
            </v-table-column>
            <v-table-column label="计算规则" prop="computeRuleCode" align="center">
              <template slot-scope="scope">
                  <el-select v-model="scope.row.computeRuleCode" v-if="scope.row.isEdit" filterable @change="changeRule($event,scope.row)">
                    <el-option v-for="item in computeRuleList" :label="item.dictName" :value="item.dictCode"
                      :forceHide="item.statusDict == '0'" :key="item.dictCode"></el-option>
                  </el-select>
                  <span v-else>{{ scope.row.computeRuleName }}</span>
                </template>
            </v-table-column>
            <v-table-column label="备注" prop="remark" align="center">
              <template slot-scope="scope">
                <el-input v-if="scope.row.isEdit" v-model="scope.row.remark" placeholder="请输入" maxlength="500"
                  clearable :disabled="!scope.row.isEdit" >
                </el-input>
                <span v-else>{{ scope.row.remark }}</span>
              </template>
            </v-table-column>
            <v-table-column label="排序" prop="sortNo" align="center" width="150px">
              <template slot-scope="scope">
                <el-input-number :min="0" v-if="scope.row.isEdit" v-model="scope.row.sortNo" placeholder="请输入" clearable
                  :disabled="!scope.row.isEdit">
                </el-input-number>
                <span v-else>{{ scope.row.sortNo }}</span>
              </template>
            </v-table-column>
            <v-table-column label="操作" align="center" fixed="right">
              <template slot-scope="scope">
                <el-button  v-if="!scope.row.isEdit" type="text" @click="updateItemRow(scope.row, scope.$index)">修改</el-button>
                <el-button  type="text" v-if="scope.row.isEdit === true" @click="cancelItemRow(scope.$index, scope.row)">取消</el-button>
                <el-button type="text"
                  v-if="scope.row.isEdit === true" @click="saveItemRow(scope.$index, scope.row)">保存</el-button>
                <el-button v-if="!scope.row.isCreate" type="text" :disabled="scope.row.isEdit"   @click="enableOrDisable(scope.row)" :style="{ color: scope.row.statusDict == 1 ? '#EC0000' : '#00AB44' }">
                  {{+scope.row.statusDict ? '禁用' : '启用' }}</el-button>
              </template>
            </v-table-column>
          </el-table>

        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex' // 存储方式
// 导管监护项匹配
import {
  performanceConfig_insert,
  performanceConfig_edit,
  performanceConfig_findWithPage,
  classDurationConfig_findWithPage,
  classDurationConfig_deleteById,
  classDurationConfig_edit,
  classDurationConfig_insert
} from '@/api/configuration'
import { debounce } from 'lodash'
import icuRegion from '../basicSettings/components/icuRegion.vue'
import { filterArrValue } from '@/utils/utils'
export default {
  name: 'KPISet',
  components: {
    icuRegion
  },
  data: function () {
    return {
      statusDict: '',
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
          name: '绩效加分项配置'
        }
      ],
      // 重点患者情况设置列表
      tableData: [], // 数据
      pageSize: 100,
      pageNum: 1,
      totalCount: 0,
      isInsertStatus: false, // 插入新数据状态
      addOrModify: '', // 用来区分新增还是修改
      catheterList: [], // 导管列表
      loading: false,
      refreshLoading: false,
      currItem: [],
      ruleList: [],
      computeRuleList: [],
      isEdit: false,
      activeName: 'classDuration',
      classData: [],
      ICIS_DICT_CLASS_TYPE: []
    }
  },
  props: {},
  watch: {},
  computed: {
    ...mapGetters(['currentUserWard'])
  },
  async created() {
    this.computeRuleList = await this.$getDictItemList('ICIS_DICT_CAL_RULE')
    this.ICIS_DICT_CLASS_TYPE = await this.$getDictItemList('ICIS_DICT_CLASS_TYPE')
    this.defaultRegion = this.currentUserWard.wardCode
    this.refresh()
  },
  methods: {
    refresh: async function () {
      this.isEdit = false
      this.currItem = []
      try {
        this.refreshLoading = true
        if (this.activeName == 'scoreSet') {
          this.getData(1)
        } else {
          this.getClassDurationData()
        }
        this.refreshLoading = false
      } catch (error) {
        this.refreshLoading = false
      }
    },
    debounceSearch() {
      this.debounceSearchSymbol = this.debounceSearchSymbol ? this.debounceSearchSymbol : debounce(function () {
        this.getData(1)
      }, 200)
      this.debounceSearchSymbol()
    },
    // 获取重点患者情况设置列表
    getData(pageNum) {
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
        wardCode: this.defaultRegion
      }
      if (this.statusDict != '') {
        query.statusDict = this.statusDict
      }
      this.tableData = []
      performanceConfig_findWithPage(query).then(res => {
        this.isInsertStatus = false
        this.isEdit = false
        if (res.code == 0) {
          this.tableData = res.data.result.map(v => {
            v.sortNo = +v.sortNo
            return v
          })
          this.totalCount = res.data.totolCount
        }
      })
    },
    defaultRegionChange(defaultRegion) {
      this.defaultRegion = defaultRegion
      if (this.defaultRegion != '') {
        this.refresh()
      }
    },
    /**
     * 添加加分项
     */
    addItemData() {
      if (this.isEdit) {
        this.$message.info('请完成当前行编辑')
        return
      }
      const maxSortNo = Math.max(...this.tableData.map(item => item.sortNo))
      const item = {
        isCreate: true,
        isEdit: true,
        sortNo: maxSortNo + 1, // 排名
        itemCode: '', // 加分项编码
        itemName: '', // 加分项名称
        score: '', // 分值
        computeRuleCode: '2', // 计算规则编码
        computeRuleName: '', // 计算规则名称
        remark: '', // 备注
        statusDict: '1' // 状态
      }
      this.isEdit = true
      this.addOrModify = 'add'
      this.tableData.unshift(item)
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
      if (row.sortNo != 0 && !row.sortNo) {
        this.$message({
          type: 'info',
          message: '序号不能为空'
        })
        return
      }
      if (!row.itemCode) {
        this.$message({
          type: 'info',
          message: '加分项编码不能为空'
        })
        return
      }
      if (!row.itemName) {
        this.$message({
          type: 'info',
          message: '加分项名称不能为空'
        })
        return
      }
      const query = row
      query.wardCode = this.defaultRegion
      const filterResult = this.$refs.icuRegion.tableDataRegion.filter(obj => obj.wardCode == this.defaultRegion)
      query.wardName = filterResult[0]?.wardName
      query.computeRuleName = filterArrValue(query.computeRuleCode, this.computeRuleList, 'dictCode', 'dictName')
      if (row.isCreate) {
        performanceConfig_insert(query).then(res => {
          if (res.code == 0) {
            row.isEdit = false
            this.isEdit = false
            this.tableData = JSON.parse(JSON.stringify(this.tableData))
            this.$message({
              type: 'success',
              message: '新增成功'
            })
            this.tableData = JSON.parse(JSON.stringify(this.tableData))
            this.getData()
          }
        })
      } else {
        performanceConfig_edit(query).then(res => {
          if (res.code == 0) {
              row.isEdit = false
              this.isEdit = false
              this.tableData = JSON.parse(JSON.stringify(this.tableData))
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.tableData = JSON.parse(JSON.stringify(this.tableData))
              this.getData()
            }
          })
        }
    },
    // 行内编辑时 取消按钮
    cancelItemRow(index, row) {
      this.isInsertStatus = false
      row.isEdit = false
      this.isEdit = false
      if (this.addOrModify == 'add') {
        this.tableData.splice(index, 1)
      } else {
        this.tableData = JSON.parse(JSON.stringify(this.tableData))
        this.tableData[index] = this.currItem[index]
      }
    },
    /**
     * 切换计算分值规则
     */
    changeRule(e, row) {
      debugger
      console.log('e', e)
      if (e == '3') {
        row.score = 1
      }
    },
    // 编辑当前行
    updateItemRow(row, index) {
      if (this.isEdit) {
        this.$message.info('请完成当前行编辑')
        return
      }
      this.currItem[index] = { ...row }
      row.isEdit = true
      this.isEdit = true
      this.addOrModify = 'modify'
      this.tableData = JSON.parse(JSON.stringify(this.tableData))
    },
    // 启用禁用-当前行数据
    enableOrDisable(row) {
      performanceConfig_edit({
        id: row.id,
        wardCode: row.wardCode,
        itemCode: row.itemCode,
        statusDict: row.statusDict == '1' ? '0' : '1'
      }).then(res => {
        this.$message({
          type: 'success',
          message: +row.statusDict ? '已禁用' : '已启用'
        })
        row.statusDict = row.statusDict == '1' ? '0' : '1'
      })
    },
    /**
     * 获取班种信息表
     */
    getClassDurationData() {
      classDurationConfig_findWithPage({
        pageSize: this.ICIS_DICT_CLASS_TYPE.length,
        pageNum: 1,
        wardCode: this.defaultRegion
      }).then(res => {
        this.classData = res.data.result
      })
    },
    addClassData() {
      if (this.isEdit) {
        this.$message.info('请完成当前行编辑')
        return
      }
      const maxSortNo = Math.max(...this.classData.map(item => item.sortNo))
      const item = {
        className: '',
        classCode: '',
        isCreate: true,
        isEdit: true,
        standardDuration: 0.01,
        classAbbr: '',
        sortNo: maxSortNo + 1 // 排名
      }
      this.isEdit = true
      this.addOrModify = 'add'
      this.classData.unshift(item)
    },
    // 保存按钮
    saveClassRow(index, row) {
      if (this.defaultRegion == '') {
        this.$message({
          type: 'info',
          message: '请选择病区'
        })
        return
      }
      if (row.sortNo != 0 && !row.sortNo) {
        this.$message({
          type: 'info',
          message: '序号不能为空'
        })
        return
      }
      if (!row.classCode) {
        this.$message({
          type: 'info',
          message: '编码不能为空'
        })
        return
      }
      if (!row.className) {
        this.$message({
          type: 'info',
          message: '班种名称不能为空'
        })
        return
      }
      if (!row.standardDuration) {
        this.$message({
          type: 'info',
          message: '班种时长不能为空'
        })
        return
      }
      const query = row
      query.wardCode = this.defaultRegion
      const filterResult = this.$refs.icuRegion.tableDataRegion.filter(obj => obj.wardCode == this.defaultRegion)
      query.wardName = filterResult[0]?.wardName
      if (row.isCreate) {
        classDurationConfig_insert(query).then(res => {
          if (res.code == 0) {
            row.isEdit = false
            this.isEdit = false
            this.classData = JSON.parse(JSON.stringify(this.classData))
            this.$message({
              type: 'success',
              message: '新增成功'
            })
            this.classData = JSON.parse(JSON.stringify(this.classData))
            this.getClassDurationData()
          }
        })
      } else {
        classDurationConfig_edit(query).then(res => {
          if (res.code == 0) {
              row.isEdit = false
              this.isEdit = false
              this.classData = JSON.parse(JSON.stringify(this.classData))
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.classData = JSON.parse(JSON.stringify(this.classData))
              this.getClassDurationData()
            }
          })
        }
    },
    // 行内编辑时 取消按钮
    cancelClassRow(index, row) {
      this.isInsertStatus = false
      row.isEdit = false
      this.isEdit = false
      if (this.addOrModify == 'add') {
        this.classData.splice(index, 1)
      } else {
        this.classData = JSON.parse(JSON.stringify(this.classData))
        this.classData[index] = this.currItem[index]
      }
    },
    deleteClassRow(index, row) {
      if (row.id) {
        this.$confirm('您确定要删除吗？', '确认信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          classDurationConfig_deleteById(row.id).then(res => {
            if (res.code == 0) {
              this.isEdit = false
              this.$message({
                type: 'success',
                message: res.msg || '删除功能'
              })
              this.getClassDurationData()
            }
          })
        })
      } else {
        this.cancelClassRow(index, row)
      }
    },
    // 编辑当前行
    updateClassRow(row, index) {
      if (this.isEdit) {
        this.$message.info('请完成当前行编辑')
        return
      }
      this.currItem[index] = { ...row }
      row.isEdit = true
      this.isEdit = true
      this.addOrModify = 'modify'
      this.classData = JSON.parse(JSON.stringify(this.classData))
    },
    changeClassCode(e, row) {
      if (this.classData.filter(item => item.classCode == e).length > 0) {
        row.classCode = ''
        row.className = ''
        this.$message.warning('该班种已经配置标准时长')
        return
      }
      row.classCode = e
      row.className = this.ICIS_DICT_CLASS_TYPE.find(item => item.dictCode == e).dictName
    },
    /**
     * 查看是否已经存在标准时长
     */
    checkIsHave(e) {
      return this.classData.filter(item => item.classCode == e).length > 0 || this.ICIS_DICT_CLASS_TYPE.find(item => item.dictCode == e).statusDict != '1'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法

#ICUQualityControl {
  background: #fff;
  padding-bottom: 15px;
  display: flex;
  height: 100%;
  width: 100%;

  // 宽度为70的div 用于页面分布
  .left {
    height: 100%;
    margin-right: 10px;
    padding: 12px 12px 0 12px;
    border-right: 2px solid rgba(203, 215, 238, 0.3);
    width: 385px;
  }

  .right {
    flex: 1;
    height: 100%;
    padding-right: 10px;
    overflow: hidden;
    padding-top: 10px;

  }
}</style>
