<!-- 待办事项 -->
<template>
  <el-container v-visibility-change="change" id="toDoList" class="toDoList">
    <!-- 顶部内容 -->
    <el-header class="toDoList_headDiv">
      <div>
        <i class="iconBlue"></i>
        <span>{{ item.moduleName }}</span>
      </div>
    </el-header>
    <div v-if="noticeListAll && noticeListAll.length > 0" class="tabs-wrap" @mouseleave="startTimeOut" @mouseenter="clearTimeoutFn">
      <el-tabs v-model="activeName" class="min-tabs" type="card">
        <el-tab-pane label="全部" name="all"></el-tab-pane>
        <el-tab-pane :label="item" v-for="item in uniquesnoticeList" :key="item" :name="item"></el-tab-pane>
      </el-tabs>
    </div>
    <!-- 中间内容部分 -->
    <div class="toDoList_body" @mouseleave="startTimeOut" @mouseenter="clearTimeoutFn" ref="toDoList_body" v-loading="loading" element-loading-text="加载中">
      <template v-if="noticeList && noticeList.length > 0">
        <div class="lineDiv myhover" v-for="(item, index) in noticeList" :key="new Date().getTime() + index" @click="clickLine(item)">
          <!-- <el-button :type="buttonList[item.title]" plain>{{item.title}}</el-button> -->
          <p>{{ item.summary }}</p>
        </div>
      </template>
      <el-empty v-else :image-size="100" description="暂无数据"></el-empty>
    </div>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { concern_queryConcernMatters } from '@/api/news'
import { patientInfo_getPaientInfo } from '@/api/patient'
import { patientInfoFormat } from '@/utils/utils'
import { cloneDeep } from 'lodash'
export default {
  name: 'ToDoList',
  components: {},
  data: function () {
    return {
      clearObj: {},
      activeName: 'all',
      loading: false,
      noticeListAll: [], // 列表集合
      buttonList: {
        医嘱执行: 'danger', // 红色
        护嘱执行: 'warning', // 黄色
        计划拔管: 'primary', // 蓝色
        交班换班: 'success', // 绿色
        患者换床: 'info', // 紫色
        评估计划: '' // 紫色
      },
      sexDictData: [], // 性别字典
      patientRationData: [], // 家庭关系字典
      params: {}
    }
  },
  props: {
    item: {
      type: Object,
      default: () => {
        return {} // 按最小的来算
      }
    } // 配置那边跳过了的高度宽度设置
  },
  watch: {},
  computed: {
    ...mapGetters(['currentUserWard']),
    uniquesnoticeList() {
      const set = new Set(this.noticeListAll.map((v) => v.title)) // 去掉重复数据，返回结果是'set'
      const newArr = Array.from(set) // 将set转化为数组
      return newArr
    },
    noticeList() {
      const list = this.noticeListAll.filter((v) => {
        return this.activeName == 'all' ? true : v.title == this.activeName
      })
      return cloneDeep(list) || []
    }
  },
  async created() {
    this.loading = true
    const xtcs0093 = await this.$queryParam({
      paramGroupCode: 'XTCS',
      paramCode: 'XTCS0093'
    })
    this.params = {
      XTCS0093: xtcs0093[0]?.paramValue || '0'
    }
    const batchDictObj = await this.$batchGetDictItemList(['HIS_DICT_SEX', 'HIS_DICT_RELATION_TYPE'])
    this.sexDictData = batchDictObj['HIS_DICT_SEX']
    this.patientRationData = batchDictObj['HIS_DICT_RELATION_TYPE']
    this.concern_queryConcernMattersFc()
  },
  mounted() {},
  destroyed() {
    this.clearObj?.clear && this.clearObj?.clear()
  },
  methods: {
    change(e, flag) {
      if (flag) {
        this.clearTimeoutFn()
      } else {
        this.startTimeOut()
      }
    },
    rInterval(callback, delay) {
      const dateNow = Date.now
      const requestAnimation = window.requestAnimationFrame
      let start = dateNow()
      let stop
      const intervalFunc = function (curtime) {
        dateNow() - start < delay || ((start += delay), callback())
        stop || requestAnimation(intervalFunc)
      }
      requestAnimation(intervalFunc)
      return {
        clear: function () {
          stop = 1
        }
      }
    },
    scrollToBottom() {
      const domWrapper = this.$refs.toDoList_body // 外层容器 出现滚动条的dom
      if (this.noticeList.length == 0) return
      // (function smoothscroll() {
      let currentScroll = domWrapper?.scrollTop // 已经被卷掉的高度
      const clientHeight = domWrapper?.offsetHeight // 容器高度
      const scrollHeight = domWrapper?.scrollHeight // 内容总高度
      if (!clientHeight) return
      if (scrollHeight > currentScroll + clientHeight) {
        currentScroll += 5
        // window.requestAnimationFrame(smoothscroll)
        // domWrapper.scrollTo(0, currentScroll + (scrollHeight - currentScroll - clientHeight) / 2)
        domWrapper.scrollTo(0, currentScroll)
      } else {
        this.clearObj?.clear && this.clearObj?.clear()
        if (this.clearTimeout) {
          clearTimeout(this.clearTimeout)
        }
        this.clearTimeout = setTimeout(() => {
          if (this.uniquesnoticeList.length === 0) {
            this.activeName = 'all'
          } else {
            const index = this.uniquesnoticeList.indexOf(this.activeName)
            this.activeName = index == -1 ? this.uniquesnoticeList[0] : index == this.uniquesnoticeList.length - 1 ? 'all' : this.uniquesnoticeList[index + 1]
            domWrapper.scrollTo(0, 0)
          }
          this.clearObj = this.rInterval(this.scrollToBottom, 100)
        }, 1500)
      }
      // }.bind(this))(this)
    },
    startTimeOut() {
      this.clearObj?.clear && this.clearObj?.clear()
      this.clearObj = this.rInterval(this.scrollToBottom, 100)
    },
    clearTimeoutFn() {
      this.clearObj?.clear && this.clearObj?.clear()
    },
    /**
     * 代办事项.或者是消息
     */
    concern_queryConcernMattersFc(item) {
      concern_queryConcernMatters({
        messageType: 1, // 1-待办失效、消息中心  2-消息弹窗   0091系统参数
        icuRecordId: '', // 个人信息查询
        wardCode: this.currentUserWard.wardCode // 有值查所有病区
      })
        .then((res) => {
          this.loading = false
          this.noticeListAll = res.data.allList
          this.$nextTick(() => {
            this.clearObj = this.rInterval(this.scrollToBottom, 100)
          })
        })
        .catch(() => {
          this.loading = false
          this.noticeListAll = []
        })
    },
    /**
     * 单击点击 代表事项
     */
    clickLine(item) {
      let mrn = ''
      if (item.type !== '患者入区') {
        // 存个人信息
        patientInfo_getPaientInfo(item.icuRecordId).then((res) => {
          if (item.type !== '患者出区') {
            this.$store.commit('set_patientInfo', patientInfoFormat(res.data, this.params, this.sexDictData, this.patientRationData))
          }
          mrn = res?.data?.inpatientEntity?.mrn
          this.toHtml(mrn, item)
          return
        })
      } else {
        this.toHtml(mrn, item)
      }
    },
    toHtml(mrn, item) {
      switch (item.type) {
        case '患者入区': // 还没做 (第三方接口协议) 跳转 床卡页面 #/patientHome/homePage
          this.$store.commit('SET_msgInIcu', item.icuRecordId)
          this.$router.push({ path: '/patient', query: this.$route.query })
          return
        case '患者出区': // 还没做 (第三方接口协议) 跳转 床卡页面 #/patientHome/homePage
          this.$store.commit('SET_msgOutIcu', item.icuRecordId)
          this.$router.push({ path: '/patient', query: this.$route.query })
          return
        case '患者换床': // 还没做  跳转 床卡页面 #/patientHome/homePage
          this.$router.push({ path: '/patientHome/homePage', query: this.$route.query })
          return

        case '医嘱提取': // 还没做 (第三方接口协议)跳转 医嘱执行 #/patient/orderExecute
            this.$store.commit('set_msgExtract', item.icuRecordId)
            this.$router.push({ path: '/patient/orderExecute', query: this.$route.query })
            return
        case '医嘱DC': // 还没做 (第三方接口协议)跳转 医嘱执行 #/patient/orderExecute
            this.$router.push({ path: '/patient/orderExecute', query: this.$route.query })
            return
        case '医嘱执行': // 跳转 医嘱执行 #/patient/orderExecute
            this.$router.push({ path: '/patient/orderExecute', query: this.$route.query })
            return
        case '用药情况': // 跳转 医嘱执行 #/patient/orderExecute
            this.$router.push({ path: '/patient/orderExecute', query: this.$route.query })
            return
        case '护嘱执行': // 跳转 监护数据 #/patient/monitoringData
            this.$router.push({ path: '/patient/monitoringData', query: this.$route.query })
            return
        case '监护数据': // 跳转 监护数据 #/patient/monitoringData
            this.$router.push({ path: '/patient/monitoringData', query: this.$route.query })
            return
        case '监护计划': // 跳转 监护数据 #/patient/monitoringData
            this.$router.push({ path: '/patient/monitoringData', query: this.$route.query })
            return
        case '液体平衡': // 跳转 液体平衡 #/patient/fluidBalance
          this.$router.push({ path: '/patient/fluidBalance', query: this.$route.query })
          return
        case '管路护理': // 跳转 管路护理 #/patient/pipelineCare
          this.$router.push({ path: '/patient/pipelineCare', query: this.$route.query })
          return
        case '患者评估': // 跳转 患者评估 #/patient/patientAssessment
          this.$router.push({ path: '/patient/patientAssessment', query: { ...this.$route.query, formId: item.formId } })
          return
        case '床旁交班': // 交班换班 跳转 床旁交班 #/patient/shiftExchange
          this.$router.push({ path: '/patient/shiftExchange', query: this.$route.query })
          return
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.toDoList {
  .tabs-wrap {
    display: inline;
    position: relative;
  }
  box-shadow: 0px 3px 5px 0px rgba(203, 215, 238, 0.5);
  p {
    margin: 0;
  }
  background: #ffffff;
  ::v-deep .el-header {
    height: 46px !important;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    padding: 0;
    box-shadow: 0px 3px 10px -3px #eee;
    .iconBlue {
      margin-left: 15px;
      display: inline-block;
      width: 3px;
      height: 16px;
      background: var(--maincolor);
    }
    div {
      display: inline-flex;
      align-items: center;
    }
    span {
      flex: 1;
      margin-left: 8px;
      height: 22px;
      font-family: PingFangSC-Medium, PingFang SC;
      line-height: 22px;
      font-weight: bold;
      font-size: 18px;
      color: var(--maincolor);
    }
  }
  ::v-deep .toDoList_body {
    padding: 0;
    overflow-x: none;
    overflow-y: auto;
    padding-left: vw(15);
    .lineDiv {
      display: flex;
      align-items: center;
      padding: 2px 0;
      min-height: 40px;
      cursor: pointer;
      p {
        margin: 0 vw(7) !important;
        flex: 1;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #000622;
      }
    }
  }
  ::v-deep .el-button--danger.is-plain {
    color: #f52c2c;
    background: #ffeff0;
    border-color: #ffc9cc;
  }
  ::v-deep .el-button--warning.is-plain {
    color: #e4860a;
    background: #fff3de;
    border-color: #ffda93;
  }
  ::v-deep .el-button--primary.is-plain {
    color: var(--maincolor);
    background: #ebf0ff;
    border-color: #b5c9ff;
  }
  ::v-deep .el-button--success.is-plain {
    color: #5db730;
    background: #e9fade;
    border-color: #c1e7a9;
  }
  ::v-deep .el-button--info.is-plain {
    color: #9250db;
    background: #f3e8ff;
    border-color: #d6bcf1;
  }
}
</style>
