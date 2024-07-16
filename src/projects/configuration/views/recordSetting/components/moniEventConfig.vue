<!-- 生命体征记录设置 -->
<template>
  <div id="moniEventConfig">
    <el-row style="width: 100%; ">
      <!-- 左2 上 -->
      <el-col :span="24">
        <div class="right">
          <el-container>
            <el-header class="flex">
              <div class="flex-1">
                <i class="iconBlue"></i>
                <span>监护事件设置</span>
              </div>
            </el-header>
            <el-container>
              <el-main>
                <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" ref="table"
                          :data="tableData" style="width: 100%;margin-bottom:15px" height="400px" highlight-current-row border>
                  <v-table-column label="监护事件" align="center" prop="eventName">
                    <template slot-scope="scope">
                      {{scope.row.eventName}}
                    </template>
                  </v-table-column>
                  <v-table-column label="书写位置" align="center" prop="position" style="background:#000;">
                    <template slot-scope="scope">
                      <el-select v-if="scope.row.isEdit" value-key="codeValue" v-model="scope.row.position" placeholder="请选择" clearable filterable
                                 :disabled="!scope.row.isEdit">
                        <el-option v-for="(option) in positionList" :key="option.codeValue" :label="option.codeName" :value="option.codeValue">
                        </el-option>
                      </el-select>
                      <span v-else>
                        {{scope.row.position|showDictNameFilter(positionList)}}
                      </span>
                    </template>
                  </v-table-column>
                  <v-table-column prop="showTimeStyle" label="显示时间" align="center" width="150px">
                    <template slot-scope="scope">
                      <el-switch v-if="scope.row.isEdit" v-model="scope.row.showTimeStyle" :active-value="'1'" :inactive-value="'0'"
                                 active-text="中文时分" inactive-text="无"></el-switch>
                      <span v-else>{{+scope.row.showTimeStyle=='1' ? '中文时分' : '无' }}</span>
                    </template>
                  </v-table-column>
                  <v-table-column label="字体颜色" align="center" prop="color">
                    <template slot-scope="scope">
                      <el-color-picker :disabled="!scope.row.isEdit" v-model="scope.row.color"></el-color-picker>
                    </template>
                  </v-table-column>
                  <v-table-column label="字体大小" align="center" prop="size">
                    <template slot-scope="scope">
                      <el-input-number style="width:100px" :controls="false" v-if="scope.row.isEdit" v-model="scope.row.size" placeholder="请输入">
                      </el-input-number>
                      <span v-else>{{scope.row.size}}</span>
                    </template>
                  </v-table-column>
                  <v-table-column label="操作" align="center">
                    <template slot-scope="scope">
                      <el-button v-hasPermi="['configuration:basicSettings:vitlSignConfig']" v-if="!scope.row.isEdit" type="text"
                                 @click="updateItemRow(scope.row,'vitalSigns', 'tableData', scope.$index)">修改</el-button>
                      <el-button v-hasPermi="['configuration:basicSettings:vitlSignConfig']" type="text" v-if="scope.row.isEdit===true"
                                 @click="cancelItemRow(scope.row,'vitalSigns', 'tableData', scope.$index)">取消</el-button>
                      <el-button v-hasPermi="['configuration:basicSettings:vitlSignConfig']" type="text" v-if="scope.row.isEdit===true"
                                 @click="saveItemRow(scope.row,'vitalSigns', 'tableData')">保存</el-button>
                    </template>
                  </v-table-column>
                </el-table>
              </el-main>
            </el-container>
          </el-container>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex' // 存储方式
import {
  config_monitoringEvent_listPage
} from '@/api/configuration'
export default {
  name: 'VitalSignsItemConfig',
  components: {
  },
  data: function () {
    return {
      ICIS_DICT_MONI_SVG: [],
      searchKey: '',
      // 生命体征曲线
      tableData: [], // 数据
      // 线性特性
      positionList: [
        { codeValue: 'up', codeName: '上标' },
        { codeValue: 'down', codeName: '下标' },
        { codeValue: 'none', codeName: '无' }
      ],
      coolingData: {},
      currItem: [] // 当前行
    }
  },
  props: {
    curComponent: {
      type: Object
    }
  },
  watch: {},
  computed: {
    ...mapGetters(['currentUserWard'])
  },
  async created() {
    const tableData = await config_monitoringEvent_listPage({ 'searchKey': '', 'pageNum': 1, 'pageSize': 1000 })
    const newTableData = tableData.data.result.map(v => {
      v.position = 'none'
      v.size = 9
      return v
    })
    if (this.curComponent.attr.moniEventConfig && this.curComponent.attr.moniEventConfig.length > 0 && Array.isArray(this.curComponent.attr.moniEventConfig)) {
      const add = newTableData.filter(v => {
        return this.curComponent.attr.moniEventConfig.filter(vv => vv.id == v.id).length === 0
      })
      this.tableData = [...add, ...this.curComponent.attr.moniEventConfig]
    } else {
      this.tableData = newTableData
    }
  },
  methods: {
    // 编辑当前行
    updateItemRow(row, module, data, index) {
      this.currItem[index] = { ...row }
      row.isEdit = true
      this[data] = JSON.parse(JSON.stringify(this[data]))
    },
    // 取消当前编辑
    cancelItemRow(row, module, data, index) {
      row.isEdit = false
      if (row.isCreate) {
        this[data].splice(index, 1)
      } else {
        this[data] = JSON.parse(JSON.stringify(this[data]))
        this[data][index] = this.currItem[index]
      }
    },
    deleting(i) {
      this.tableData.splice(i, 1)
    },
    // 保存数据
    saveItemRow(row, module, data) {
      this.$message.success('保存成功')
      row.isEdit = false
      this[data] = JSON.parse(JSON.stringify(this[data]))
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法

#moniEventConfig {
  margin-top: 15px;
  width: 100%;
  .elHeader3 {
    .headerLeft {
      flex: 1;
    }
    //头部栏中的右侧 新增 查询 按钮样式
    .headerRight {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      .el-button {
        width: 90px;
      }
    }
  }
}
</style>
