<!-- 重点患者情况设置 -->
<template>
  <div id="qcConfig">
    <div class="left">
      <el-container style="height:calc(100% - 2px)">
        <el-header>
          <div>
            <i class="iconBlue"></i>
            <span>{{ pagePartsList[0].name }}</span>
          </div>
        </el-header>
        <icu-region :defaultPermi="['configuration:basicSettings:qcConfig']" :defaultRegion="defaultRegion"
          :module="'qcReport'" @defaultRegionChange="defaultRegionChange" ref="icuRegion"></icu-region>
      </el-container>
    </div>
    <div class="right">
      <el-container style="height:100%;">
        <el-header>
          <div>
            <i class="iconBlue"></i>
            <span>{{ pagePartsList[1].name }}</span>
          </div>

        </el-header>
        <el-container style="height:100%">
          <el-main style="height:100%">
            <el-table
              @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
              ref="table" :row-class-name="({ row }) => row.statusDict == 0 ? 'disabled' : ''" :data="tableData"
              style="width: 100%" highlight-current-row border height="100%">
              <v-table-column label="面板编号" prop="panelName" align="center" width="120px">
              </v-table-column>
              <v-table-column label="展示报表" prop="reportDictCode" align="left">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.reportDictCode" v-if="scope.row.isEdit" filterable clearable @change="changeReport
                    ($event, scope.row)" class="w100">
                    <el-option v-for="item in scope.row.reportList" :label="item.dictName" :value="item.dictCode"
                      :forceHide="item.statusDict == '0'" :key="item.dictCode"></el-option>
                  </el-select>
                  <span v-else>{{ scope.row.reportDictName }}</span>
                </template>
              </v-table-column>
              <v-table-column label="自定标题" prop="reportShowName" align="center" width="240px">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.isEdit" v-model="scope.row.reportShowName" placeholder="请输入" maxlength="100"
                    clearable :disabled="!scope.row.isEdit">
                  </el-input>
                  <span v-else>{{ scope.row.reportShowName }}</span>
                </template>
              </v-table-column>
              <v-table-column label="样式选择" prop="reportStyleName" align="center" width="120px">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.reportStyleCode" v-if="scope.row.isEdit" filterable>
                    <el-option v-for="item in scope.row.styleList" :label="item.dictName" :value="item.dictCode"
                      :forceHide="item.statusDict == '0'" :key="item.dictCode"></el-option>
                  </el-select>
                  <span v-else>{{ scope.row.reportStyleName }}</span>
                </template>
              </v-table-column>
              <v-table-column label="操作" align="center" fixed="right" width="90px">
                <template slot-scope="scope">
                  <el-button v-if="!scope.row.isEdit" type="text"
                    @click="updateItemRow(scope.row, scope.$index)">修改</el-button>
                  <el-button type="text" v-if="scope.row.isEdit === true"
                    @click="cancelItemRow(scope.$index, scope.row)">取消</el-button>
                  <el-button type="text" v-if="scope.row.isEdit === true"
                    @click="saveItemRow(scope.$index, scope.row)">保存</el-button>
                </template>
              </v-table-column>
            </el-table>

          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex' // 存储方式
// 导管监护项匹配
import {
  report_findList,
  report_edit
} from '@/api/configuration'
import { debounce } from 'lodash'
import icuRegion from '@/views/configuration/basicSettings/components/icuRegion.vue'
export default {
  name: 'QcConfig',
  components: {
    icuRegion
  },
  data: function () {
    return {
      statusDict: '',
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
          name: '质控查询布局配置'
        }
      ],
      // 重点患者情况设置列表
      tableData: [], // 数据
      pageSize: 10,
      pageNum: 1,
      totalCount: 0,
      isInsertStatus: false, // 插入新数据状态
      addOrModify: '', // 用来区分新增还是修改
      catheterList: [], // 导管列表
      loading: false,
      refreshLoading: false,
      currItem: [],
      ICIS_DICT_REPORT: [],
      ICIS_DICT_REPORT_STYLE: [],
      isEdit: false
    }
  },
  props: {},
  watch: {},
  computed: {
    ...mapGetters(['currentUserWard'])
  },
  async created() {
    const { ICIS_DICT_REPORT_STYLE, ICIS_DICT_REPORT } = await this.$batchGetDictItemList(['ICIS_DICT_REPORT_STYLE', 'ICIS_DICT_REPORT'])
    this.ICIS_DICT_REPORT_STYLE = ICIS_DICT_REPORT_STYLE
    this.ICIS_DICT_REPORT = ICIS_DICT_REPORT
    this.defaultRegion = this.currentUserWard.wardCode
  },
  methods: {
    refresh: async function () {
      try {
        this.refreshLoading = true
        this.getQcConfig(1)
        this.refreshLoading = false
      } catch (error) {
        this.refreshLoading = false
      }
    },
    debounceSearch() {
      this.debounceSearchSymbol = this.debounceSearchSymbol ? this.debounceSearchSymbol : debounce(function () {
        this.getQcConfig(1)
      }, 200)
      this.debounceSearchSymbol()
    },
    // 获取重点患者情况设置列表
    getQcConfig(pageNum) {
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
        wardCode: this.defaultRegion
      }
      if (this.statusDict != '') {
        query.statusDict = this.statusDict
      }
      this.tableData = []
      report_findList(query).then(res => {
        this.isInsertStatus = false
        this.isEdit = false
        if (res.code == 0) {
          this.tableData = res.data.result.map(v => {
            if (v.panelCode == 1) { // 中部主区
              v.reportList = this.ICIS_DICT_REPORT
            } else {
              v.reportList = this.ICIS_DICT_REPORT.filter(dict => dict.dictCode.indexOf('_1') == -1)
            }
            if (v.reportType == '1') {
              v.styleList = this.ICIS_DICT_REPORT_STYLE.filter(dict => dict.dictCode == '1')
            } else {
              v.styleList = this.ICIS_DICT_REPORT_STYLE.filter(dict => dict.dictCode != '1')
            }
            return v
          })
        }
      })
    },
    defaultRegionChange(defaultRegion) {
      this.defaultRegion = defaultRegion
      if (this.defaultRegion != '') {
        this.getQcConfig(1)
      }
    },
    // 保存按钮
    saveItemRow(index, row) {
      if (this.defaultRegion == '') {
        this.$message({
          type: 'error',
          message: '请选择病区'
        })
        return
      }
      if (row.reportDictCode == '') {
        this.$message({
          type: 'error',
          message: '请选择展示报表'
        })
        return
      }
      if (row.reportStyleCode == '') {
        this.$message({
          type: 'error',
          message: '请选择样式'
        })
        return
      }

      const query = row
      query.reportDictName = this.ICIS_DICT_REPORT.find(item => item.dictCode == query.reportDictCode).dictName
      query.reportStyleName = this.ICIS_DICT_REPORT_STYLE.find(item => item.dictCode == query.reportStyleCode).dictName
      query.reportType = query.reportDictCode.indexOf('_1') > -1 ? '1' : '2'
      query.wardCode = this.defaultRegion
      delete query.isEdit
      delete query.reportList
      delete query.styleList
      report_edit(query).then(res => {
        this.isEdit = false
        if (res.code == 0) {
          row.isEdit = false
          this.tableData = JSON.parse(JSON.stringify(this.tableData))
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.tableData = JSON.parse(JSON.stringify(this.tableData))
          this.getQcConfig()
        }
      })
    },
    // 行内编辑时 取消按钮
    cancelItemRow(index, row) {
      this.isInsertStatus = false
      row.isEdit = false
      this.isEdit = false
      this.tableData = JSON.parse(JSON.stringify(this.tableData))
      this.tableData[index] = this.currItem[index]
    },
    // 编辑当前行
    updateItemRow(row, index) {
      if (this.isEdit) {
        this.$message('请先完成当前行编辑')
        return
      }
      this.currItem[index] = { ...row }
      row.isEdit = true
      this.isEdit = true
      this.addOrModify = 'modify'
      this.tableData = JSON.parse(JSON.stringify(this.tableData))
    },
    /**
     * 切换展示报表
     * @param {*} e
     * @param {*} row
     */
    changeReport(e, row) {
      row.reportStyleCode = ''
      if (e) {
        row.styleList = e.indexOf('_1') > -1 ? this.ICIS_DICT_REPORT_STYLE.filter(dict => dict.dictCode == 1) : this.ICIS_DICT_REPORT_STYLE.filter(dict => dict.dictCode != 1)
      } else {
        row.styleList = this.ICIS_DICT_REPORT_STYLE
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法

#qcConfig {
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
