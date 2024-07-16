<!-- 导管监护项设置 -->
<template>
  <div id="dialysisDrug">
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
            <icu-region style="height:calc(100% - 42px)" :defaultPermi="['configuration:basicSettings:patientIconConfig']" :defaultRegion="defaultRegion"
                        :module="'patientIcon'" @defaultRegionChange="defaultRegionChange"></icu-region>
          </el-container>
        </div>
      </el-col>
      <!-- 左3 -->
      <el-col style="height:100%" :span="18">
        <el-row style="width: 100%;height:100%; ">
          <el-col :span="24">
            <div class="right" style="height:100%;">
              <el-container style="height:100%;">
                <el-header class="elHeader1">
                  <div>
                    <i class="iconBlue"></i>
                    <span>患者提醒标识设置</span>
                  </div>
                </el-header>
                <el-container style="height:calc(100% - 42px)">
                  <el-header >
                    <el-checkbox v-model="statusDict" true-label="" false-label="1"  @change="refreshList">
                          显示禁用
                    </el-checkbox>

                    <el-button v-hasPermi="['configuration:basicSettings:patientIconConfig']"  type="primary"
                                @click.native.prevent="refreshList" icon="el-icon-refresh" style="font-size:20px;"></el-button>

                  </el-header>
                  <el-main style="height:calc(100% - 42px)">
                    <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" height="100%" ref="tableData" :row-class-name="({row}) => row.statusDict == 0 ? 'disabled' : ''" :data="tableData" highlight-current-row fit border>
                      <v-table-column prop="sortNo" label="序号">
                        <template slot-scope="scope">
                          <el-input-number v-if="scope.row.isEdit"  v-model="scope.row.sortNo" placeholder="请输入" :disabled="!scope.row.isEdit"  >
                          </el-input-number >
                          <span v-else>{{scope.row.sortNo}}</span>
                        </template>
                      </v-table-column>
                      <v-table-column prop="dictCode" label="标识编码"></v-table-column>
                      <v-table-column prop="type" label="标识类型"></v-table-column>
                      <v-table-column prop="remark" label="标识说明">
                        <template slot-scope="scope">
                          <el-input v-if="scope.row.isEdit"  v-model="scope.row.remark" placeholder="请输入" :disabled="!scope.row.isEdit"  :maxlength="100">
                          </el-input>
                          <span v-else>{{scope.row.remark}}</span>
                        </template>
                      </v-table-column>
                      <v-table-column prop="statusDict" label="状态" align="center">
                        <template slot-scope="scope">
                          <!-- <el-switch  v-model="scope.row.statusDict" active-value="1" inactive-value="0" active-text="已启用"
                                    inactive-text="已禁用" @change="enableOrDisable(scope.row)" v-hasPermi="['configuration:basicSettings:patientIconConfig']"></el-switch> -->
                          <span>{{+scope.row.statusDict ? '已启用' : '已禁用' }}</span>
                        </template>
                      </v-table-column>
                      <v-table-column label="操作" align="center" width="200px">
                        <template slot-scope="scope">
                          <el-button v-hasPermi="['configuration:basicSettings:patientIconConfig']" v-if="!scope.row.isEdit" type="text"
                                     @click="updateItemRow(scope.row, scope.$index)">修改</el-button>
                          <el-button v-hasPermi="['configuration:basicSettings:patientIconConfig']" type="text" v-if="scope.row.isEdit===true"
                                     @click="cancelItemRow(scope.$index,scope.row)">取消</el-button>
                          <el-button v-hasPermi="['configuration:basicSettings:patientIconConfig']" type="text" v-if="scope.row.isEdit===true"
                                     @click="saveItemRow(scope.$index,scope.row)">保存</el-button>
                          <el-button v-if="!scope.row.isCreate" v-hasPermi="['configuration:basicSettings:patientIconConfig']"  type="text" @click="enableOrDisable(scope.row)"  :style="{ color: scope.row.statusDict == 1 ? '#EC0000': '#00AB44' }">{{+scope.row.statusDict ? '禁用' : '启用' }}</el-button>
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
import {
  patientIcon_list,
  patientIcon_refresh,
  patientIcon_update,
  patientIcon_enable,
  patientIcon_disable
} from '@/api/configuration'
import icuRegion from '@/views/configuration/basicSettings/components/icuRegion.vue'
import { mapGetters } from 'vuex'
// import { frontFilter } from '@/utils'
export default {
  name: 'DialysisDrug',
  components: {
    icuRegion
  },
  data: function () {
    return {
      statusDict: '',
      row: {},
      defaultRegion: '',
      currItem: {},
      totalCount: 0,
      tableData: [

      ] // 数据
    }
  },
  props: {},
  watch: {},
  computed: {
    ...mapGetters(['currentUserWard'])
  },
  async created() {
    this.defaultRegion = this.currentUserWard.wardCode
    this.getDataList()
  },
  mounted() { },
  methods: {
    /**
     * 病区切换
     */
    defaultRegionChange(defaultRegion) {
      this.tableData = []
      this.defaultRegion = defaultRegion
      this.selectRegion(this.defaultRegion)
    },
    /**
     * 切换病区 后获取当前病区的 对应的 透析药品数据
     */
    selectRegion(wardCode) {
      this.loading = true

      this.getDataList()
    },
    /**
     * 刷新数据 主要是需要从基表中将数据复制到对应的病区中
     */
    refreshList() {
      const query = {
        wardCode: this.defaultRegion

      }
      patientIcon_refresh(query).then(res => {
        this.getDataList()
      })
    },
    /**
     * 获取对应病区患者标识数据
     */
    getDataList() {
      this.tableData = []
      const query = {
        wardCode: this.defaultRegion,
         statusDict: this.statusDict
      }

      patientIcon_list(query).then(res => {
        this.tableData = res.data
      })
    },
    // 编辑当前行
    updateItemRow(row, index) {
      this.currItem[index] = { ...row }
      row.isEdit = true
      this.tableData = JSON.parse(JSON.stringify(this.tableData))
    },
    // 取消当前编辑
    cancelItemRow(index, row) {
      row.isEdit = false
      this.tableData = JSON.parse(JSON.stringify(this.tableData))
      this.tableData[index] = this.currItem[index]
    },
    // 保存数据
    saveItemRow(index, row, module) {
      const query = {
        'id': row.id,
        'remark': row.remark,
        'sortNo': row.sortNo
      }
      patientIcon_update(query).then(res => {
        row.isEdit = false
        this.$message('修改成功')
      })
    },
    /**
     * 启用 禁用功能
     */
    enableOrDisable(row) {
      const api = row.statusDict == '1' ? patientIcon_disable : patientIcon_enable
      const query = {
        id: row.id
      }
      api(query).then(res => {
        this.$message(row.statusDict == 1 ? '禁用成功' : '启用成功')
        this.getDataList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法

#dialysisDrug {
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
