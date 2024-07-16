<!-- 皮肤部位匹配 -->
<template>
  <div id="dermaMatch">
    <div class="icuArea">
      <el-header>
        <div>
          <i class="iconBlue"></i>
          <span>ICU病区</span>
        </div>
      </el-header>

      <div style="height:calc(100% - 42px)">
        <icu-region :defaultPermi="['configuration:basicSettings:skinPositionConfig']" :defaultRegion="defaultRegion"
          :module="'skinPosi'" @defaultRegionChange="defaultRegionChange"
          @regionChange="(wardInfo) => { currentWardInfo = wardInfo }"></icu-region>
      </div>
    </div>
    <div class="bodyImageDivWrap">
      <el-header>
        <div>
          <i class="iconBlue"></i>
          <span>3D人体图</span>
        </div>
      </el-header>
      <div ref="bodyImageDiv" class="bodyImageDiv flex r_c_center">
        <BodyImage ref="bodyImage" class="bodyImage"
          :isBabyBody="currentWardInfo.wardIdentification && currentWardInfo.wardIdentification == '2'" :showLabel="false"
          :clickHideSlice="true" :selectOneSlice="true"
          :style="`transform: scale(${scale}) translateX(-50%); left: 50%;transform-origin:0;`"
          @selectSliceChange="handleselectSliceChange" @loadSuccess="resetBodyImage()"></BodyImage>
      </div>
    </div>
    <div class="dermaPosition">
      <el-header>
        <div>
          <i class="iconBlue"></i>
          <span>切片映射皮肤部位</span>
        </div>
      </el-header>
      <el-header>

        <el-input size="small" v-model="skipPosiSerarchKey" placeholder="皮肤部位编码/名称" clearable suffix-icon="el-icon-search"
          style="width: 200px" @input="searchDermaList">
        </el-input>
        <el-button v-hasPermi="['configuration:basicSettings:skinPositionConfig']"
          @click.native.prevent="handleAddSkipPosotion" size="small" type="primary"
          :disabled="selectedHumanSlice === null">新增
        </el-button>
      </el-header>
      <div class="flex-1" style="height:calc(100% - 94px);position:relative;">
        <div style="position:absolute; width:100%;height:100%">
          <div style="margin-bottom: 5px;position:relative;height:100%">
            <el-table
              @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
              ref="table" :data="skipPositionDataList" highlight-current-row fit border height="100%" size="mini"
              width="100%">
              <v-table-column prop="skinPosiDictCode" label="编码" align="center"></v-table-column>
              <v-table-column prop="skinPosiDictName" label="名称" align="center"></v-table-column>
              <v-table-column label="操作" width="60" align="center">
                <template slot-scope="scope">
                  <el-button v-hasPermi="['configuration:basicSettings:skinPositionConfig']"
                    @click.prevent="handleDelSkipPos(scope.$index, scope.row)" type="text" size="small"
                    class="redCss">删除</el-button>
                </template>
              </v-table-column>
            </el-table>
          </div>
        </div>
      </div>

    </div>
    <SkipPosotionDialog :data.sync="skipPositionFilterDatas" ref="skipPosotionDialog" title="新增皮肤部位映射"
      :tableData.sync="tableData" :onCallback="handleSaveSkipPosotionList"></SkipPosotionDialog>
  </div>
</template>

<script>
import icuRegion from '@/views/configuration/basicSettings/components/icuRegion.vue'
import { debounce } from 'lodash'
import {
  skinPosi_batchInsert,
  skinPosi_deleteById,
  //   skinPosi_edit,
  skinPosi_findWithPage
} from '@/api/configuration'
import BodyImage from '@/views/patient/components/pipelineCare/bodyImage'
import SkipPosotionDialog from '@/views/configuration/basicSettings/cathereter/skipPosotionDialog'

import { mapGetters } from 'vuex'
export default {
  name: 'DermaMatch',
  components: {
    icuRegion,
    BodyImage,
    SkipPosotionDialog
  },
  data: function () {
    return {
      defaultRegion: '',
      humanId: '',
      // ICU病区查询数据
      ICUserarchKey: '',
      // 选中ICU病区
      selectedICUItem: null,
      // 选中的人体切片
      selectedHumanSlice: null,
      selectedItems: '',
      // 皮肤部位过滤
      skipPosiSerarchKey: '',
      // 切片对应皮肤部位数据
      skipPositionDataList: [],
      marginTop: '0px',
      marginLeft: 'auto',
      tableData: [],
      scale: 1,
      currentWardInfo: {
        wardCode: '',
        wardIdentification: ''
      }
    }
  },
  props: {},
  watch: {},
  computed: {
    ...mapGetters(['userWardList', 'currentUserWard']),
    skipPositionFilterDatas() {
      return this.skipPositionDataList.filter((data) => {
        return (
          !this.skipPosiSerarchKey ||
          data.skinPosiDictCode.indexOf(this.skipPosiSerarchKey) > -1 ||
          data.skinPosiDictName.indexOf(this.skipPosiSerarchKey) > -1
        )
      })
    }
  },
  created() {
    this.defaultRegion = this.currentUserWard.wardCode
  },
  mounted() {
    window.onresize = debounce(() => {
      this.resetBodyImage()
    }, 100)
  },
  methods: {
    resetBodyImage() {
      if (this.$refs.bodyImageDiv) {
        const offsetWidth = this.$refs.bodyImageDiv.offsetWidth
        const offsetHeight = this.$refs.bodyImageDiv.offsetHeight
        const hScale = offsetHeight / 790
        const wScale = offsetWidth / 460
        this.scale = hScale < wScale ? hScale : wScale
      }
    },
    selectRegion: function (wardCode, retain) {
      this.loading = true
      // 清空
      this.getPosiData(wardCode, retain)
    },
    /**
     * 获取病区内可以配置数据
     */
    async getPosiData(wardCode, retain) {
      const params = {
        'pageNum': 1,
        'pageSize': 1000,
        'wardCode': wardCode,
        'searchKey': this.searchKey
      }
      const res = await skinPosi_findWithPage(params)
      if (res.code == 0) {
        this.tableData = res.data.result.map(v => {
          v.referValues = v.referValues?.split(',')
          return v
        })
        if (!retain) this.handleselectSliceChange()
        if (!retain) this.$refs.bodyImage?.reset()
        this.loading = false
      }
    },
    defaultRegionChange(defaultRegion) {
      this.defaultRegion = defaultRegion
      this.selectRegion(this.defaultRegion)
      this.$nextTick(() => {
        this.$refs.bodyImage?.reset()
      })
    },
    // 选中人体切片
    handleselectSliceChange(selectedItems, currentItem, currentItemSelected) {
      this.humanId = currentItem?.key
      const param = {
        humanId: this.humanId,
        'pageNum': 1,
        'pageSize': 10000,
        'searchKey': this.skipPosiSerarchKey,
        'skinPosiDictCode': '',
        'skinPosiDictName': '',
        'wardCode': this.defaultRegion
      }
      // 编辑模式
      this.skipPositionDataList = []
      if (currentItemSelected) {
        this.selectedHumanSlice = currentItem
        this.selectedItems = selectedItems
      } else {
        this.selectedHumanSlice = null
        this.selectedItems = ''
      }
      if (currentItemSelected) {
        // 选中加载
        skinPosi_findWithPage(param).then((response) => {
          const dataList = response.data.result
          this.skipPositionDataList = this.skipPositionDataList.concat(dataList)
        })
      } else {
        // 非选中去除
        this.skipPositionDataList = []
      }
    },
    /**
     * 搜索过滤数据
     */
    searchDermaList() {
      const param = {
        humanId: this.humanId,
        'pageNum': 1,
        'pageSize': 10000,
        'searchKey': this.skipPosiSerarchKey,
        'skinPosiDictCode': '',
        'skinPosiDictName': '',
        'wardCode': this.defaultRegion
      }
      skinPosi_findWithPage(param).then((response) => {
        const dataList = response.data.result
        this.skipPositionDataList = dataList
      })
    },
    // 新增皮肤部位
    handleAddSkipPosotion() {
      this.$refs.skipPosotionDialog.handleShow()
    },
    // 删除皮肤部位
    handleDelSkipPos(index, item) {
      this.$confirm('您确定要删除吗？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          skinPosiDictCode: item.skinPosiDictCode,
          wardCode: this.defaultRegion
        }
        skinPosi_deleteById(param).then((response) => {
          this.skipPositionDataList.splice(index, 1)
          this.selectRegion(this.defaultRegion, 'retain')
          // this.$refs.skipPosotionDialog.getPositionList()
        })
      })
    },
    // 保存切片映射皮肤部位
    handleSaveSkipPosotionList(dataList, hideshow) {
      const humanId = this.selectedHumanSlice.key
      const filterList = dataList.filter((item) => {
        const code = item.dictCode
        const index = this.skipPositionDataList.findIndex((item) => {
          return item.skinPosiDictCode === code
        })
        return index < 0
      })
      if (filterList.length === 0) {
        hideshow()
        return
      }
      filterList.forEach((element) => {
        element.humanId = humanId
        element.wardCode = this.defaultRegion
        element.wardName = this.userWardList.filter(item => item.wardCode === this.defaultRegion)[0].wardName
        element.skinPosiDictCode = element.dictCode
        element.skinPosiDictName = element.dictName
      })
      skinPosi_batchInsert(filterList).then((response) => {
        hideshow()
        this.selectRegion(this.defaultRegion, 'retain')
        this.handleselectSliceChange(this.selectedItems, this.selectedHumanSlice, true)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法
$border-right: 2px solid rgba(203, 215, 238, 0.3);

#dermaMatch {
  display: flex;
  width: 100%;
  flex-direction: column;
  height: 100%;
  display: flex;
  flex-direction: row;
  background: #fff;

  .icuArea {
    width: 400px;
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

  .dermaPosition {
    flex: 1;
    height: 100%;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 10px;
    // display: flex;
    // flex-direction: column;
  }
}
</style>
