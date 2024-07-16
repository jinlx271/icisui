<!-- 导管皮肤匹配 -->
<template>
  <div id="catheterMatch">
    <div class="icuArea">
      <el-header>
        <i class="iconBlue"></i>
        <span>ICU病区</span>
      </el-header>
      <div style="margin-top:15px;height:calc(100% - 42px)">
        <icu-region :defaultPermi="['configuration:basicSettings:catheterPositionConfig']" :defaultRegion="defaultRegion"
          :module="'cathPosi'" @defaultRegionChange="defaultRegionChange" ref="icuRegion"
          @regionChange="(wardInfo) => { currentWardInfo = wardInfo }"></icu-region>
      </div>
    </div>
    <!-- 3D人体图 -->
    <div class="bodyImageDivWrap">
      <el-header>
        <i class="iconBlue"></i>
        <span>3D人体图{{ currentWardInfo.wardIdentification }}</span>
      </el-header>
      <div ref="bodyImageDiv" class="bodyImageDiv flex r_c_center">
        <BodyImage ref="bodyImage" class="bodyImage"
          :isBabyBody="currentWardInfo.wardIdentification && currentWardInfo.wardIdentification == '2'" :showLabel="false"
          :clickHideSlice="true" :selectOneSlice="pipePositionEdiable"
          :style="`transform: scale(${scale}) translateX(-50%); left: 50%;transform-origin:0;`"
          @selectSliceChange="handleselectSliceChange">
        </BodyImage>
      </div>
    </div>
    <!-- 导管部位 -->
    <div class="pipePosition">
      <el-header>
        <i class="iconBlue"></i>
        <span>部位列表</span>
      </el-header>
      <el-header class="inputDiv">
        <el-input size="small" v-model="pipePosiSerarchKey" placeholder="部位编码/名称" clearable suffix-icon="el-icon-search"
          style="max-width: 150px" @input="searchCatherPosi">
        </el-input>
        <el-button v-hasPermi="['configuration:basicSettings:catheterPositionConfig']"
          @click.native.prevent="handleAddPipePosotion" size="small" type="primary">新增
        </el-button>
      </el-header>
      <div style="flex: 1; margin-bottom: 5px; overflow: auto;height:calc(100% - 84px)" v-loading="posLoading">
        <el-table
          @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
          :data="pipePositionDataList" highlight-current-row border height="100%" ref="pipePositionTable"
          @current-change="handlePipePositionSelectionChange" size="mini">
          <v-table-column prop="cathPosiDictCode" label="部位编码" align="center"></v-table-column>
          <v-table-column prop="cathPosiDictName" label="部位名称" align="center"></v-table-column>
          <v-table-column label="操作" width="60" align="center">
            <template slot-scope="scope">
              <el-button v-hasPermi="['configuration:basicSettings:catheterPositionConfig']"
                @click.prevent="handleDelPipePos(scope.$index, scope.row)" type="text" size="small"
                class="redCss">删除</el-button>
            </template>
          </v-table-column>
        </el-table>
      </div>
    </div>
    <div class="pipe">
      <el-header>
        <i class="iconBlue"></i>
        <span>
          {{
            selectedPipePosition ? '[' + selectedPipePosition.cathPosiDictName + ']' : ''
          }}导管部位映射导管
        </span>
      </el-header>
      <el-header class="">
        <el-input v-model="pipeSerarchKey" style="min-width:50px" size="small" placeholder="导管编码/名称" clearable
          suffix-icon="el-icon-search" class="flex-1" @input="getCatheterMapList">
        </el-input>
        <div class="flex-2 flex">
          <div style="justify-content: center;line-height: 32px;width: 89px;">导管分类</div>
          <el-select style="width:calc(100% - 89px)" v-model="pipeType" clearable filterable placeholder="请选择">
            <el-option v-for="item in typeInfo.list" :key="item.dictCode" :label="item.dictName" :value="item.dictCode"
              :disabled="item.statusDict == '0'"></el-option>
          </el-select>
        </div>
        <el-button v-hasPermi="['configuration:basicSettings:catheterPositionConfig']"
          @click.native.prevent="handleAddPipe" :disabled="selectedPipePosition === null" size="small"
          type="primary">新增</el-button>
      </el-header>
      <div style="flex: 1; margin-bottom: 5px; width:100%;height:calc(100% - 84px)" v-loading="mapLoading">
        <el-table
          @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
          :data="pipeType ? pipeDataList.filter(item => item.catheterTypeDict == pipeType) : pipeDataList"
          highlight-current-row border height="100%" size="mini" ref='pipeDataList'>
          <v-table-column prop="catheterCode" label="导管编码" align="center"></v-table-column>
          <v-table-column prop="catheterName" label="导管名称" align="center"></v-table-column>
          <v-table-column prop="catheterAbbr" label="导管简称" align="center"></v-table-column>
          <v-table-column prop="catheterTypeDict" label="导管分类" align="center">
            <template slot-scope="scope">
              <span>{{ typeInfo.list.filter(item => item.dictCode == scope.row.catheterTypeDict)[0].dictName }}</span>
            </template>
          </v-table-column>
          <v-table-column label="操作" width="60" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button v-hasPermi="['configuration:basicSettings:catheterPositionConfig']"
                @click.native.prevent="handleDelPipe(scope.$index, scope.row)" type="text" size="small"
                class="redCss">删除</el-button>
            </template>
          </v-table-column>
        </el-table>
      </div>
    </div>
    <!-- 新增导管映射弹框 -->
    <PipeDialog ref="pipeDialog" :title="`导管部位[${selectedPipePosition != null ? selectedPipePosition.cathPosiDictName : ''
      }]新增导管映射`" :onCallback="handleSavePipeList" :selectedCatherList="pipeDataList"></PipeDialog>
    <!-- 新增导管部位弹框 -->
    <PipePosotionDialog :wardCode="defaultRegion" ref="pipePosotionDialog" title="新增导管部位映射"
      :onCallback="handleSavePipePosotionList">
    </PipePosotionDialog>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import { mapGetters } from 'vuex' // 存储方式
import {
  cathPosi_batchInsert,
  cathPosi_findWithPage,
  cathPosi_deleteById,
  cathPosiMp_batchInsert,
  cathPosiMp_findWithPage,
  cathPosiMp_deleteById,
  dictItem_findAllWithPage
} from '@/api/configuration'

import BodyImage from '@/views/patient/components/pipelineCare/bodyImage'
import PipeDialog from '@/views/configuration/basicSettings/cathereter/pipeDialog'
import PipePosotionDialog from '@/views/configuration/basicSettings/cathereter/pipePosotionDialog'
import icuRegion from '@/views/configuration/basicSettings/components/icuRegion.vue'

export default {
  name: 'CatheterMatch',
  components: {
    BodyImage,
    PipeDialog,
    PipePosotionDialog,
    icuRegion
  },
  data: function () {
    return {
      marginTop: '0px',
      marginLeft: '10px',
      scale: 1,
      wardLoading: false, // 病区加载图
      posLoading: false, // 部位加载图
      mapLoading: false, // 映射部分加载图
      pipeDialogKey: '',
      // ICU病区查询数据
      ICUserarchKey: '',
      // ICU病区集合
      icuAreaDataList: [],
      // 选中ICU病区
      selectedICUItem: null,

      // 人体切片是否可编辑
      pipePositionEdiable: true,
      // 选中的人体切片
      selectedHumanSlice: null,

      // 导管部位过滤
      pipePosiSerarchKey: '',
      // 人体部位
      humanId: '',
      // 切片对应导管部位数据
      pipePositionDataList: [],
      // 已经匹配过的所有的导管部位数据
      positionDataList: [],
      // 选中导管部位
      selectedPipePosition: null,

      // 导管过滤
      pipeSerarchKey: '',
      // 导管过滤分类
      pipeType: '',
      // 导管部位对应倒管数据
      pipeDataList: [],
      // 导管分类
      typeInfo: {
        code: 'ICIS_DICT_CATHETER_TYPE',
        list: []
      },
      dialogVisible: false, // 复制配置弹框
      sourceWard: null, // 源病区
      targetWard: null, // 目标病区
      defaultRegion: '',
      currentWardInfo: {
        wardCode: '',
        wardIdentification: ''
      }
    }
  },
  props: {},
  watch: {
    pipeSerarchKey: function () {
      this.$nextTick(() => {
        this.$refs.pipeDataList.doLayout()
      })
    },
    currentWardInfo: function () {
    }
  },
  computed: {
    ...mapGetters(['currentUserWard'])
  },
  created: function () {
    this.defaultRegion = this.currentUserWard.wardCode
    this.getTypeList()
  },
  mounted() {
    this.resetBodyImage()
    window.onresize = debounce(() => {
      this.resetBodyImage()
    }, 100)
  },
  methods: {
    /**
     * 重新设置人体图
     */
    resetBodyImage() {
      if (this.$refs.bodyImageDiv) {
        const offsetWidth = this.$refs.bodyImageDiv.offsetWidth
        const offsetHeight = this.$refs.bodyImageDiv.offsetHeight
        const hScale = offsetHeight / 780
        const wScale = offsetWidth / 460
        this.scale = hScale < wScale ? hScale : wScale
      }
    },
    /**
     * 搜索导管部位
     */
    searchCatherPosi() {
      this.posLoading = true
      const query = {
        pageNum: 1,
        pageSize: 1000,
        searchKey: this.pipePosiSerarchKey

      }
      query.wardCode = this.defaultRegion
      if (this.selectedHumanSlice) {
        query.humanId = this.selectedHumanSlice.key
      }
      cathPosi_findWithPage(query).then(res => {
        this.posLoading = false
        // if (res.code == 0) {
        //   this.positionDataList = res.data.result
        //   if (this.selectedHumanSlice) {
        //     this.pipePositionDataList = this.positionDataList.filter(posObj => (
        //       posObj.humanId == this.selectedHumanSlice.key
        //     ))
        //     this.getCatheterMapList()
        //   }
        // }
        this.pipePositionDataList = res.data.result
        this.getCatheterMapList()
      })
    },
    // 获取分类
    getTypeList() {
      const query = {
        pageSize: 100,
        pageNum: 1,
        dictGroupCode: this.typeInfo.code
      }
      dictItem_findAllWithPage(query).then(res => {
        if (res.code == 0) {
          this.typeInfo.list = res.data.result
        }
      })
    },
    defaultRegionChange(defaultRegion) {
      // 清空搜索条件
      this.pipePosiSerarchKey = ''
      this.pipeSerarchKey = ''
      this.$refs.bodyImage?.reset()
      this.selectedHumanSlice = null
      this.pipePositionDataList = []
      this.humanId = ''
      this.pipeDataList = []
      this.defaultRegion = defaultRegion
      if (this.defaultRegion != '') {
        this.getPositionList({
          wardCode: this.defaultRegion
        })
      }
    },
    // 选中人体切片
    handleselectSliceChange(selectedItems, currentItem, currentItemSelected) {
      this.pipePositionDataList = []
      this.pipeDataList = []
      this.selectedPipePosition = null
      if (this.defaultRegion == '') {
        return
      }
      if (currentItemSelected) {
        this.selectedHumanSlice = currentItem
        this.humanId = this.selectedHumanSlice.key

        // if (this.positionDataList.length > 0) {
        //   this.pipePositionDataList = this.positionDataList.filter(posObj => (
        //     posObj.humanId == this.humanId
        //   ))
        //   this.posLoading = false
        //   this.getCatheterMapList()
        // } else {
        //   this.getPositionList(param)
        // }
      } else {
        this.selectedHumanSlice = null

        this.humanId = ''
      }
      this.searchCatherPosi()
    },
    // 获取对应的部位
    getPositionList(param) {
      this.posLoading = true
      const query = {
        pageNum: 1,
        pageSize: 1000
      }
      query.wardCode = this.defaultRegion

      cathPosi_findWithPage(query).then(res => {
        this.posLoading = false
        if (res.code == 0) {
          this.positionDataList = res.data.result
          if (this.selectedHumanSlice) {
            this.pipePositionDataList = this.positionDataList.filter(posObj => (
              posObj.humanId == this.selectedHumanSlice.key
            ))
          } else {
            this.pipePositionDataList = this.positionDataList
          }
          this.getCatheterMapList()
        }
      })
    },
    // 新增导管部位
    handleAddPipePosotion() {
      this.$refs.pipePosotionDialog.handleShow()
    },
    // 删除导管部位
    handleDelPipePos(index, item) {
      this.$confirm('您确定要删除吗？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          cathPosiDictCode: item.cathPosiDictCode,
          wardCode: item.wardCode
        }
        cathPosi_deleteById(param).then((res) => {
          if (res.code == 0) {
            this.$message.success('删除成功！')
            this.getPositionList()
          }
        })
      })
    },
    // 保存切片映射导管部位
    handleSavePipePosotionList(dataList, hideshow) {
      // /选择多个部位 需要多次调用接口
      const wardCode = this.defaultRegion
      const filterResult = this.$refs.icuRegion.tableDataRegion.filter(obj => obj.wardCode == this.defaultRegion)
      const wardName = filterResult[0].wardName
      if (dataList.length === 0) {
        hideshow()
        return
      }
      const filterList = dataList.map((element) => {
        const obj = {}
        this.selectedHumanSlice && (obj.humanId = this.selectedHumanSlice.key)
        obj.wardName = wardName
        obj.wardCode = wardCode
        obj.cathPosiDictCode = element.dictCode
        obj.cathPosiDictName = element.dictName
        return obj
      })
      cathPosi_batchInsert(filterList).then((response) => {
        hideshow()
        this.$message({
          type: 'success',
          message: '新增导管部位成功'
        })
        this.getPositionList({
          wardCode: wardCode,
          humanId: this.selectedHumanSlice ? this.selectedHumanSlice.key : ''
        })
      })
    },
    // 选中导管部位
    handlePipePositionSelectionChange(val) {
      this.selectedPipePosition = val
      if (val) {
        this.getCatheterMapList()
      } else {
        this.pipeDataList = []
      }
    },
    /**
     * 获取导管部位映射列表
     *  */
    getCatheterMapList() {
      this.mapLoading = true
      const param = {
        pageNum: 1,
        pageSize: 10000,
        cathPosiDictCode: this.selectedPipePosition ? this.selectedPipePosition.cathPosiDictCode : '',
        wardCode: this.defaultRegion,
        humanId: this.humanId,
        searchKey: this.pipeSerarchKey
      }
      cathPosiMp_findWithPage(param).then((response) => {
        this.mapLoading = false
        this.pipeDataList = response.data.result
        this.$refs.pipeDataList.doLayout()
      })
    },
    // 部位新增导管映射
    handleAddPipe() {
      this.$refs.pipeDialog.handleShow()
    },
    // 保存新增导管部位映射导管信息
    handleSavePipeList(dataList, hideshow) {
      if (this.selectedPipePosition == null) {
        this.$mssage('当前选中导管为空!,不能保存')
        hideshow()
        return
      }
      const filterResult = this.$refs.icuRegion.tableDataRegion.filter(obj => obj.wardCode == this.defaultRegion)
      const wardName = filterResult[0].wardName
      const filterList = dataList.map((element) => {
        const obj = {}
        obj.humanId = this.selectedHumanSlice?.key || this.selectedPipePosition?.humanId // 如果没有选择人体切片，根据选中部位保存humanid
        obj.wardName = wardName
        obj.wardCode = this.defaultRegion
        obj.cathPosiDictCode = this.selectedPipePosition.cathPosiDictCode
        obj.cathPosiDictName = this.selectedPipePosition.cathPosiDictName
        obj.catheterAbbr = element.catheterAbbr
        obj.catheterCode = element.catheterCode
        obj.catheterName = element.catheterName
        obj.catheterTypeDict = element.catheterTypeDict
        return obj
      })
      cathPosiMp_batchInsert(filterList).then(res => {
        hideshow()
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: '新增导管映射成功'
          })
          this.getCatheterMapList()
        }
      })
    },
    // 删除导管部位映射导管
    handleDelPipe(index, item) {
      this.$confirm('您确定要删除吗？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          cathPosiDictCode: item.cathPosiDictCode,
          catheterCode: item.catheterCode,
          wardCode: item.wardCode
        }
        cathPosiMp_deleteById(param).then((res) => {
          if (res.code == 0) {
            this.$message.success('删除成功！')
            this.getCatheterMapList()
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法

$border-right: 2px solid rgba(203, 215, 238, 0.3);

#catheterMatch {
  height: 100%;
  display: flex;
  flex-direction: row;
  background: #fff;
  overflow-x: auto;
  width: 100%;

  .icuArea {
    width: 250px;
    height: 100%;
    border-right: $border-right;
    padding: 10px;
    display: block;
  }

  .bodyImageDivWrap {
    flex: 1;
    min-width: 300px !important;
    max-width: 450px !important;
    height: 100%;
    overflow: hidden;
    border-right: $border-right;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 10px;

    .bodyImageDiv {
      width: 100%;
      height: 100%;
      overflow: hidden;
      position: relative;

      .bodyImage {
        position: absolute;
      }
    }
  }

  .pipePosition {
    width: 300px !important;
    height: 100%;
    border-right: $border-right;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 10px;
    display: flex;
    flex-direction: column;
  }

  .pipe {
    flex: 1;
    height: 100%;
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
