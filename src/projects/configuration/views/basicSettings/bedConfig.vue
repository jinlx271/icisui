<!-- 病床管理 -->
<template>
  <div id="bedConfig" class="bedConfig">
    <!-- ICU病区 -->
    <div class="bedConfig-left">
      <el-container class="bedConfig_container">
        <el-header class="elHeader1">
          <div>
            <i class="iconBlue"></i>
            <span>床位列表</span>
          </div>
        </el-header>
        <el-container style="height:calc(100% - 42px)">
          <el-header class="heightAuto">
            <!-- input输入 -->
            <div class="headerLeft">
              <el-form ref="addRoleFrom" :inline="true" :model="queryData" label-width="100px" status-icon class="flex align-items-center">
                <el-form-item class="mediaWidth" prop="bedNo">
                  <el-input  v-model="queryData.searchKey" clearable placeholder="请输入床号" @input="debounceSearch"></el-input>
                </el-form-item>
                <el-form-item class="mediaWidth" prop="bedTypeDict">
                  <!-- selete选择 -->
                  <el-select v-model="queryData.bedTypeDict" clearable filterable placeholder="请选择" @change="debounceSearch">
                    <el-option v-for="item in bedTypeList" :key="item.dictCode" :label="item.dictName" :value="item.dictCode" :disabled="item.statusDict=='0'"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item class="mediaWidth" prop="wardCode">
                  <!-- selete选择 -->
                  <el-select v-model="queryData.wardCode" clearable filterable placeholder="请选择" @change="debounceSearch">
                    <el-option v-for="item in icuData" :key="item.wardCode" :label="item.wardName" :value="item.wardCode"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item  >
                  <el-checkbox v-model="queryData.statusDict" true-label="" false-label="1" @change="debounceSearch" >
                    显示禁用
                  </el-checkbox>
                </el-form-item>
              </el-form>
            </div>
            <div class="headerRight">
              <el-button size="mini" type="primary" style="font-size:18px;height:34px;margin-right:5px;width:60px;"
                         :icon="loading?'el-icon-loading':'el-icon-refresh'" @click="getBedList(1)"></el-button>
              <el-button v-hasPermi="['configuration:basicSettings:bedConfig']" class="queryButton" type="primary"
                         @click.native.prevent="addBedItemRow">新增</el-button>
            </div>
          </el-header>
          <el-main ref="leftDivCss" style="height: calc(100% - 102px)">
            <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" ref="tableDataItem" :row-class-name="({row}) => row.statusDict == 0 ? 'disabled' : ''" :data="tableDataItem" height="100%" highlight-current-row fit border element-loading-text="加载中"
                      v-loading="loading" row-key="id" @row-click="selectBedItemRow">
              <v-table-column prop="bedId" label="床位ID" min-width="100"></v-table-column>
              <v-table-column prop="bedNo" label="床号" min-width="100">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.isEdit" v-model="scope.row.bedNo" placeholder="请输入"></el-input>
                  <span v-else>{{scope.row.bedNo }}</span>
                </template>
              </v-table-column>
              <v-table-column prop="wardCode" label="病区" align="center" min-width="100">
                <template slot-scope="scope">
                  <el-select v-if="scope.row.isEdit" v-model="scope.row.wardCode" placeholder="请选择" clearable filterable @change="selectWardCode($event,scope.row)">
                    <el-option v-for="(option) in icuData" :key="option.wardCode" :label="option.wardName" :value="option.wardCode"></el-option>
                  </el-select>
                  <span v-else>{{scope.row.wardName}}</span>
                </template>
              </v-table-column>
              <v-table-column prop="bedTypeDict" label="床位类型" align="center" min-width="100">
                <template slot-scope="scope">
                  <el-select v-if="scope.row.isEdit" v-model="scope.row.bedTypeDict" placeholder="请选择" clearable filterable>
                    <el-option v-for="(option) in bedTypeList" :key="option.dictCode" :label="option.dictName" :value="option.dictCode" :disabled="option.statusDict==0"></el-option>
                  </el-select>
                  <span v-else>{{scope.row.bedTypeDict | dictCodeToName(bedTypeList) }}</span>
                </template>
              </v-table-column>
              <v-table-column prop="bedTagDict" label="床位标识" align="center" min-width="100">
                <template slot-scope="scope">
                  <el-select v-if="scope.row.isEdit" v-model="scope.row.bedTagDict" placeholder="请选择" clearable filterable>
                    <el-option v-for="(option) in bedTagList" :key="option.dictCode" :label="option.dictName" :value="option.dictCode" :disabled="option.statusDict==0"></el-option>
                  </el-select>
                  <span v-else>{{scope.row.bedTagDict | dictCodeToName(bedTagList) }}</span>
                </template>
              </v-table-column>
              <v-table-column prop="sortNo" label="排序" align="center" min-width="50">
                <template slot-scope="scope">
                  <el-input type="number" v-if="scope.row.isEdit" v-model="scope.row.sortNo" placeholder="请输入"></el-input>
                  <span v-else>{{scope.row.sortNo }}</span>
                </template>
              </v-table-column>
              <v-table-column prop="statusDict" label="状态" align="center" min-width="150">
                <template slot-scope="scope">
                  <el-switch v-if="scope.row.isEdit" v-model="scope.row.statusDict" active-value="1" inactive-value="0" active-text="已启用"
                             inactive-text="已禁用"></el-switch>
                  <span v-else>{{+scope.row.statusDict ? '已启用' : '已禁用' }}</span>
                </template>
              </v-table-column>
              <v-table-column label="操作" align="center" width="130px" fixed="right">
                <template slot-scope="scope">
                  <el-button v-hasPermi="['configuration:basicSettings:bedConfig']" v-if="!scope.row.isEdit" type="text"
                             @click="updateBedItemRow(scope.row, scope.$index)">修改</el-button>
                  <el-button v-hasPermi="['configuration:basicSettings:bedConfig']" type="text" v-if="scope.row.isEdit"
                             @click="cancelBedItemRow(scope.row, scope.$index)">取消</el-button>
                  <el-button v-hasPermi="['configuration:basicSettings:bedConfig']" type="text" v-if="scope.row.isEdit"
                             @click="saveBedItemRow(scope.row, scope.$index)">保存</el-button>
                  <!-- <el-button v-hasPermi="['configuration:basicSettings:bedConfig']" type="text" v-if="!scope.row.isCreate"
                             @click="deleteBedItemRow(scope.row.bedId)" style="color:red">删除</el-button> -->
                </template>
              </v-table-column>
            </el-table>
          </el-main>
          <el-footer>
            <el-pagination @size-change="changePagination" @current-change="changePagination" :current-page="queryData.pageNum"
                           :hide-on-single-page="false" :page-size="queryData.pageSize" background layout="total, prev, pager, next"
                           style="float:right;margin-top:15px;margin-right:-10px" :total="totolCount"></el-pagination>
          </el-footer>
        </el-container>
      </el-container>
    </div>
    <!-- 功能模块 -->
    <div class="bedConfig-right device-model">
      <el-container class="device-model-container">
        <el-header class="elHeader1">
          <div>
            <i class="iconBlue"></i>
            <span>仪器连机情况</span>
          </div>
          <div>
            <el-button v-hasPermi="['configuration:basicSettings:bedConfig']" class="queryButton" type="primary"
                       @click.native.prevent="addBedDeviceRow">新增</el-button>
          </div>
        </el-header>
        <el-container style="height:calc(100% - 42px)">
          <el-main ref="rightDivCss" class="device-model-table" style="height:100%">
            <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" height="100%" ref="tableDataModule" :data="tableDataModule" highlight-current-row fit border row-key="id">
              <v-table-column type="index" label="序号" align="center"></v-table-column>
              <v-table-column width="150" prop="deviceCode" label="设备编号" align="left"></v-table-column>
              <v-table-column width="150" prop="deviceModel" label="型号" align="left"></v-table-column>
              <v-table-column width="150" prop="deviceName" label="设备名称" align="left">
                <template slot-scope="scope">
                  <el-select v-if="scope.row.isEdit" v-model="scope.row.deviceId" placeholder="请选择" clearable filterable
                             @change="handleChangeBedDevice(scope.row)">
                    <el-option v-for="(option) in scope.row.deviceList" :key="option.deviceId" :label="option.deviceName" :value="option.deviceId"
                               :disabled="option.statusDict == '0'"></el-option>
                  </el-select>
                  <span v-else>{{ scope.row.deviceName }}</span>
                </template>
              </v-table-column>
              <v-table-column width="150" prop="manufacturer" label="厂商/品牌" align="left">
                <template slot-scope="scope">{{ scope.row.manufacturer }}</template>
              </v-table-column>
              <!-- <v-table-column prop="statusDict" label="状态" align="center" min-width="150">

                <template slot-scope="scope">
                  <el-switch v-if="scope.row.isEdit" v-model="scope.row.statusDict" active-value="1" inactive-value="0" active-text="已启用"
                             inactive-text="已禁用"></el-switch>
                  <span v-else>{{+scope.row.statusDict ? '已启用' : '已禁用' }}</span>
                </template>
              </v-table-column> -->
              <v-table-column label="操作" fixed="right" align="center" width="130px">
                <template slot-scope="scope">
                  <el-button v-hasPermi="['configuration:basicSettings:bedConfig']" v-if="!scope.row.isEdit" type="text"
                             @click="updateBedDeviceRow(scope.row, scope.$index)">修改</el-button>
                  <el-button v-hasPermi="['configuration:basicSettings:bedConfig']" type="text" v-if="scope.row.isEdit"
                             @click="cancelBedDeviceRow(scope.row, scope.$index)">取消</el-button>
                  <el-button v-hasPermi="['configuration:basicSettings:bedConfig']" type="text" v-if="scope.row.isEdit"
                             @click="saveBedDeviceRow(scope.row, scope.$index)">保存</el-button>
                  <el-button v-hasPermi="['configuration:basicSettings:bedConfig']" type="text" v-if="!scope.row.isCreate"
                             @click="deleteBedDeviceRow(scope.row.deviceId)" style="color:red">删除</el-button>
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
import {
  icuWard_findWithPage,
  bed_deleteById,
  bed_edit,
  bed_findWithPage,
  bed_insert,
  bedDevice_findWithPage,
  bedDevice_findBedDeviceByWard,
  bedDevice_save,
  bedDevice_deleteById,
  device_findWithPage,
  bed_getMaxSort
} from '@/api/configuration'
import { debounce } from 'lodash'
import {
  mapGetters
} from 'vuex'
export default {
  name: 'BedConfig',
  components: {},
  filters: {
    dictCodeToName(dictCode, dictList, item = 'dictName') {
      const dictObj = dictList.find(item => item.dictCode == dictCode)
      return dictObj ? dictObj[item] : ''
    }
  },
  data: function () {
    return {
      // ICU病区列表
      icuData: [],
      // 加载
      loading: false,
      // 查询
      queryData: {
        statusDict: '',
        searchKey: '',
        bedTypeDict: '', // 搜索床位类型
        wardCode: '',
        pageNum: 1,
        pageSize: 10
      },
      tableDataItem: [], // 数据
      // 分页总量
      totolCount: 0,
      tableDataModule: [], // 联机情况
      usedTableDataModule: [], // 所有设备
      bedTypeList: [], // 床位类型
      deviceTypeList: [], // 设备类型
      curRow: [], // 当前行数据
      deviceList: [], // 设备列表
      curBed: null, // 当前选中床位
      curBedDeviceRow: [], // 当前行数据
      bedTagList: []
    }
  },
  props: {},
  watch: {
    tableDataModule() {
      this.$refs.tableDataModule.doLayout()
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'currentUserWard']),
    // 页面显示项目
    showItems() {
      return [
        { label: '床位号', key: 'bedId', width: '100', readOnly: true },
        { label: '床位编码', key: 'bedNo', width: '100', isModefy: false },
        { label: '病区', key: 'wardCode', width: '100', align: 'center', styleType: 'select', options: this.icuData, optionsLabel: 'wardName', optionsValue: 'wardCode' },
        { label: '床位类型', key: 'bedTypeDict', width: '100', align: 'center', styleType: 'select', options: this.bedTypeList, optionsLabel: 'dictName', optionsValue: 'dictCode' },
        { label: '排序', key: 'sortNo', width: '50', align: 'center', placeholder: '请输入排序' },
        { label: '状态', key: 'statusDict', width: '100', align: 'center', styleType: 'switch', active: { value: '1', text: '已启用' }, inactive: { value: '0', text: '已禁用' } }
      ]
    },
    deviceList_computed() {
      return this.deviceList.filter(v => !this.usedTableDataModule.map(vv => vv.deviceId).includes(v.deviceId))
    }
  },
  created() {
    this.init()
  },
  mounted() {
  },
  methods: {
    async init() {
      this.getIcuAreaList()
      const { ICIS_DICT_BED_TYPE, ICIS_DICT_DEVICE_TYPE, ICIS_DICT_BED_TAG } = await this.$batchGetDictItemList(['ICIS_DICT_BED_TYPE', 'ICIS_DICT_DEVICE_TYPE', 'ICIS_DICT_BED_TAG'])
      this.bedTypeList = ICIS_DICT_BED_TYPE
      this.deviceTypeList = ICIS_DICT_DEVICE_TYPE
      this.bedTagList = ICIS_DICT_BED_TAG
      this.queryData.wardCode = this.currentUserWard.wardCode
      this.getBedList(1)
    },
    getDeviceList(wardCode) {
      return new Promise((resolve, reject) => {
        const query = {
          wardCode,
          pageNum: 1,
          pageSize: 1000
        }
        device_findWithPage(query).then(res => {
          resolve(res.data.result)
        }).catch(() => {
          reject([])
        })
      })
    },
    getIcuAreaList() {
      const query = {
        pageNum: 1,
        pageSize: 1000,
        searchKey: '',
        userName: this.userInfo.userName == 'admin' ? '' : this.userInfo.userName
      }
      icuWard_findWithPage(query).then(res => {
        this.loading = false
        if (res.code == 0) {
          this.icuData = res.data.result
        }
      })
    },
    // 获取床位仪器连机列表
    async getBedDeviceList(row) {
      if (row.bedId) {
        const query = {
          bedId: row.bedId,
          pageNum: 1,
          pageSize: 1000
        }
        this.deviceList = await this.getDeviceList(row.wardCode)
        const res = await bedDevice_findWithPage(query)
        this.tableDataModule = res.data.result
        const q = {
          wardCode: row.wardCode
        }
        const bedDeviceAll = await bedDevice_findBedDeviceByWard(q)
        this.usedTableDataModule = bedDeviceAll.data.filter(v => v.wardCode == row.wardCode)
        this.tableDataModule.map(item => {
          item.deviceList = this.deviceList.filter(v => !this.usedTableDataModule.map(vv => vv.deviceId).includes(v.deviceId) || v.deviceId === item.deviceId)
        })
      } else {
        this.tableDataModule = []
      }
    },
    debounceSearch() {
      this.debounceSearchSymbol = this.debounceSearchSymbol ? this.debounceSearchSymbol : debounce(function () {
        this.getBedList(1)
      }, 200)
      this.debounceSearchSymbol()
    },
    // 获取床位列表
    getBedList(page) {
      if (page) {
        this.queryData.pageNum = page
      }
      this.loading = true
      this.addRoleVisible = true
      const query = this.queryData
      bed_findWithPage(query).then(res => {
        this.loading = false
        if (!(res.data && res.data.result)) {
          return
        }
        this.tableDataItem = res.data.result
        this.totolCount = res.data.totolCount
        if (this.tableDataItem.length) {
          this.getBedDeviceList(this.tableDataItem[0])
          this.curBed = this.tableDataItem[0]
          this.$refs.tableDataItem.setCurrentRow(this.tableDataItem[0])
        }
      })
    },
    // 新增床位
    addBedItemRow() {
      if (this.tableDataItem.length > 0) {
        const first = this.tableDataItem[0]
        if (first.isCreate) {
          return
        }
      }
      this.tableDataItem.map(item => { item.isEdit = false })
      const row = {
        isCreate: true,
        isEdit: true,
        bedNo: '',
        wardCode: '',
        bedTypeDict: '',
        sortNo: '1',
        statusDict: '1'
      }
      this.tableDataItem.unshift(row)
    },
    /**
     * 选择病区
     */
    selectWardCode(e, row) {
      if (e) {
        bed_getMaxSort(e).then(res => {
          row.sortNo = res.data
          this.tableDataItem = [...this.tableDataItem]
        })
      }
    },
    // 修改床位
    updateBedItemRow(row, index) {
      this.curRow[index] = { ...row }
      row.isEdit = true
      row.isCreate = false
      this.tableDataItem = JSON.parse(JSON.stringify(this.tableDataItem))
    },
    // 取消行的编辑状态
    cancelBedItemRow(row, index) {
      row.isEdit = false
      if (row.isCreate) {
        this.tableDataItem.splice(index, 1)
      } else {
        this.tableDataItem[index] = this.curRow[index]
        this.tableDataItem = JSON.parse(JSON.stringify(this.tableDataItem))
      }
    },
    // 保存
    saveBedItemRow(row, index) {
      if (row.bedNo === '') {
        this.$message.error('床位编码不能为空')
        return
      } else if (row.bedNo.length > 50) {
        this.$message.error('床位编码不能超过50字')
        return
      } else if (row.wardCode === '') {
        this.$message.error('请选择病区')
        return
      } else if (row.bedTypeDict === '') {
        this.$message.error('请选择床位类型')
        return
      } else if (row.sortNo === '') {
        this.$message.error('请输入排序')
        return
      }
      if (row.wardCode) {
        const curIcuData = this.icuData.find(item => row.wardCode === item.wardCode)
        if (curIcuData) {
          row.wardName = curIcuData.wardName
        } else {
          this.$message.error('所选病区已禁用或不存在，请重新选择')
          return
        }
      }
      if (!row.isCreate) {
        // 修改
        bed_edit(row).then(res => {
          if (res.code === 0) {
            // this.getBedList()
            row.isEdit = false
            this.tableDataItem = JSON.parse(JSON.stringify(this.tableDataItem))
            this.$message.success('修改床位成功')
          }
        }).catch()
      } else {
        // 新增
        bed_insert(row).then(res => {
          if (res.code === 0) {
            this.getBedList()
          }
        }).catch()
      }
    },
    // 删除床位
    deleteBedItemRow(bedId) {
      bed_deleteById(bedId).then(res => {
        if (res.code === 0) {
          this.getBedList()
        }
      }).catch()
    },
    //  选择对应的行
    selectBedItemRow(row) {
      this.curBed = row
      this.getBedDeviceList(row)
    },
    // 分页变化
    changePagination(pageNum) {
      this.getBedList(pageNum)
    },
    // 新增床位设备
    addBedDeviceRow() {
      if (this.tableDataModule.length > 0) {
        const first = this.tableDataModule[0]
        if (first.isCreate) {
          return
        }
      }
      this.tableDataModule.map(item => { item.isEdit = false })
      const row = {
        isCreate: true,
        isEdit: true,
        bedId: '',
        deviceId: '',
        deviceName: '',
        deviceModel: '',
        wardCode: '',
        statusDict: '1',
        deviceList: this.deviceList_computed
      }
      this.tableDataModule.unshift(row)
    },
    /**
     * 获取最大的序号
     */
    getBedSortNo() {

    },
    // 修改床位设备
    updateBedDeviceRow(row, index) {
      this.curBedDeviceRow[index] = { ...row }
      row.isEdit = true
      row.isCreate = false
      this.tableDataModule = JSON.parse(JSON.stringify(this.tableDataModule))
    },
    // 取消行的编辑状态
    cancelBedDeviceRow(row, index) {
      row.isEdit = false
      if (row.isCreate) {
        this.tableDataModule.splice(index, 1)
      } else {
        this.tableDataModule[index] = this.curBedDeviceRow[index]
        this.tableDataModule = JSON.parse(JSON.stringify(this.tableDataModule))
      }
    },
    // 保存床位设备
    saveBedDeviceRow(row, index) {
      if (row.deviceId === '') {
        this.$message.error('设备不能为空')
        return
      }
      row.wardName = this.curBed.wardName
      row.wardCode = this.curBed.wardCode
      row.bedId = this.curBed.bedId
      if (!row.isCreate) {
        row.oldDeviceId = this.curBedDeviceRow[index].deviceId
      }
      bedDevice_save(row).then(async res => {
        if (res.code === 0) {
          if (row.isCreate) {
            this.getBedDeviceList(this.curBed)
          }
          row.isEdit = false
          row.isCreate = false
          this.tableDataModule = JSON.parse(JSON.stringify(this.tableDataModule))
          const q = {
            wardCode: row.wardCode
          }
          const bedDeviceAll = await bedDevice_findBedDeviceByWard(q)
          this.usedTableDataModule = bedDeviceAll.data.filter(v => v.wardCode == row.wardCode)
          this.tableDataModule.map(item => {
            item.deviceList = this.deviceList.filter(v => !this.usedTableDataModule.map(vv => vv.deviceId).includes(v.deviceId) || v.deviceId === item.deviceId)
          })
          this.$message.success('保存成功')
        }
      })
    },
    // 删除床位设备
    deleteBedDeviceRow(deviceId) {
      this.$confirm('您确定要删除吗？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const query = {
          bedId: this.curBed.bedId,
          deviceId
        }
        bedDevice_deleteById(query).then(res => {
          if (res.code === 0) {
            this.getBedDeviceList(this.curBed)
            this.$message.success('删除床位关联设备成功')
          }
        })
      })
    },
    // 选择床位设备
    handleChangeBedDevice(row) {
      if (row.deviceId) {
        const curDevice = this.deviceList.find(item => item.deviceId == row.deviceId)
        row.deviceId = curDevice.deviceId
        row.deviceCode = curDevice.deviceCode
        row.deviceName = curDevice.deviceName
        row.deviceModel = curDevice.deviceModel
        row.manufacturer = curDevice.manufacturer
        row.deviceTypeDict = curDevice.deviceTypeDict
        row.statusDict = curDevice.statusDict
        row.deviceStatusDict = curDevice.statusDict
      } else {
        row.deviceId = ''
        row.deviceCode = ''
        row.deviceName = ''
        row.deviceModel = ''
        row.manufacturer = ''
        row.deviceTypeDict = ''
        row.statusDict = ''
        row.deviceStatusDict = ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法

@media only screen and (max-width: 1600px) {
  .mediaWidth {
    width: 140px;
  }
}
.bedConfig {
  display: flex;
  flex: 0%;
  background: #fff;
  height: 100%;
  // 宽度为70的div 用于页面分布
  .bedConfig-left {
    height: 100%;
    width: 60%;
    position: relative;
    padding: 10px;
    border-right: 2px solid rgba(203, 215, 238, 0.3);
  }
  // 宽度为30的div
  .bedConfig-right {
    height: 100%;
    padding: 10px;
    width: 40%;
    position: relative;
    &.device-model {
      .device-model-container {
        height: 100%;
        .device-model-table {
          height: 100%;
        }
      }
    }
  }

  .headerLeft {
    flex-grow: 1;
  }
  .bedConfig_container {
    height: 100%;
  }
}
</style>
