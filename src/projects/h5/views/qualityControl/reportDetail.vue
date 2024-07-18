<template>
  <div class="HCContiner">
    <van-nav-bar left-text="返回" left-arrow @click-left="onClickLeft">
        <van-tabs v-model="activeName"  scrollspy swipeable  sticky @change="changeTab"  :ellipsis="false" slot="title">
          <van-tab :name="index" height="100%" :title="item.label" v-for="(item,index) in tabsList" :key="item.label+index">
          </van-tab>
        </van-tabs>
    </van-nav-bar>
    <van-tabs v-model="activeName"  swipeable  @change="changeTab"  :ellipsis="false" class="main">
      <van-tab :name="index" height="100%" :title="item.label" v-for="(item,index) in tabsList" :key="item.label+index">
        <div style="height:100%;">
          <div class="flex tableHeader">
            <div v-for="(headerItem,index) in tableHeader" :key="index" :style="{width:headerItem.width?headerItem.width+'px':(headerItem.label.length*30)+'px'}" :class="!headerItem.width?'flex-1':''">
              <span>{{headerItem.label}} </span>
            </div>
          </div>
          <div class="list" >
            <van-list
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="getData"
              :key="listKey"
            >
              <div
                v-for="(item,index) in list"
                :key="index"
                class="flex tableItem"
              >
                <div v-for="(headerItem,index) in tableHeader" :key="index" :style="{width:headerItem.width?headerItem.width+'px':(headerItem.label.length*30)+'px'}" :class="!headerItem.width?'flex-1':''">
                    <div>{{ item[headerItem.code]}}</div>
                </div>
              </div>
            </van-list>
          </div>

        </div>
      </van-tab>
    </van-tabs>

  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import 'echarts-liquidfill'
import {
  dataStatistics_leftData
} from '@/utils/generator/dataStatistics'
export default {
  name: 'Layout',
  data() {
    return {
      title: '',
      valueKey: '',
      startTime: '',
      endTime: '',
      activeName: 'label_one',
      leftData: {},
      doubleTable: {},
      tableHeader: [],
      list: [],
      loading: false,
      finished: false,
      pageNum: 1,
      listKey: '',
      tableHeight: '100%',
      tabsList: []
    }
  },
  computed: {
    ...mapGetters(['currentUserWard', 'userWardList', 'mainMenu', 'systemInfo']),
    datePickerChange() {
      const obj = {
        forMonth: '',
        forYear: '',
        dataType: 3,
        year: '',
        season: '',
        startTime: '',
        endTime: '',
        customValue: [],
        timeType: ''
      }
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          obj[key] = this[key]
        }
      }
      return obj
    }
  },
  mounted() {
    this.title = this.$route.query.title
    this.timeType = this.$route.query.timeType
    this.valueKey = this.$route.query.valueKey
    this.startTime = this.$route.query.startTime
    this.endTime = this.$route.query.endTime
    this.leftData = dataStatistics_leftData.find(item => item.valueKey == this.valueKey)
    this.doubleTable = this.leftData.doubleTable || this.leftData.multipleTable
    if (Array.isArray(this.doubleTable)) {
      this.tabsList = this.doubleTable
    } else {
      this.tabsList = []
      this.tabsList.push({
        label: this.doubleTable.label_one,
        queryType: '0',
        showItems: this.doubleTable.label_one_showItems || this.leftData.showItems
      })
      if (this.doubleTable.label_two) {
        this.tabsList.push({
          queryType: '1',
          label: this.doubleTable.label_two,
          showItems: this.doubleTable.label_two_showItems
        })
      }
    }
    this.activeName = '0'
    this.tableHeader = this.tabsList[this.activeName].showItems
    this.tableHeight = document.body.offsetHeight - 92
  },
  watch: {

  },
  created() {

  },
  methods: {
    onClickLeft() {
      sessionStorage.setItem('reportDetailBack', '1')
      this.$router.back()
    },
    changeTab(e) {
      if (e) {
        this.activeName = e
      }
      this.tableHeader = this.tabsList[this.activeName].showItems
      this.list = []
      this.loading = false
      this.finished = false
      this.pageNum = 1
      this.listKey = this.$dayjs().valueOf()
    },
    /**
     * 获取数据
     */
    getData(e) {
      const param = {
        'curDateTime': this.$dayjs().format('YYYY-MM-DD HH:mm:ss'),
        'startDate': this.startTime,
        'endDate': this.endTime,
        'pageNum': this.pageNum,
        'bundleFlag': this.tabsList[this.activeName] && this.tabsList[this.activeName].label == '感染性休克6h集束化治疗（bundle）完成率',
        'icuAreaCode': this.currentUserWard.wardCode,
        'pageSize': 10,
        'timeType': this.timeType,
        'queryType': this.tabsList[this.activeName].queryType // 0:一个表格查询 1:两个表格查询
      }
      if (this.valueKey == 'dvtDrugRate') {
        param.dvtType = '1' // ICU深静脉血栓（DVT药品）预防率
      } else if (this.valueKey == 'dvtPhysicalRate') {
        param.dvtType = '2' // ICU深静脉血栓（DVT物理）预防率
      }
      if (this.valueKey == '感染性休克1h集束化治疗（bundle）完成率') {
        param.bundleFlag = '1'
      }
      if (this.valueKey == 'unplanIntubaRate') {
        param.catherGroupCode = 'VAP'
      }
      let api = ''
      if (Array.isArray(this.doubleTable)) {
        api = this.leftData.proApi
      } else {
        api = this.activeName == '0' ? this.leftData.proApi : this.leftData.proApi2
      }

      api(param).then(res => {
        this.loading = false
        res.data.result.forEach(item => {
            this.list.push(item)
        })
        if (this.list.length >= res.data.totolCount) {
          this.finished = true
        } else {
          this.pageNum++
        }
      })
    }
  },
  beforeDestroy() {

  }
}
</script>

<style lang="scss" scoped>
.HCContiner {
  padding: 0px;
  margin: 0px;
  height: 100%;
  overflow: hidden;
  width: 100%;
  display: flex;
  flex-direction: column;
  ::v-deep .van-nav-bar__title{
    height:100%;
  }

  ::v-deep .van-tabs__line{
    background-color:var(--maincolor);
    // width: 45%;
  }
  ::v-deep .van-tab{
    padding:0px rem(10);
    font-weight: 800;
    font-size: rem(14);
  }
  ::v-deep .van-tab--active{
    color:var(--maincolor);
  }
  .menuTitle{
    width: 100%;
  }
  .tableHeader{
    font-size:rem(12);
    font-weight:600;
    height:fit-content;
    padding:rem(10) rem(5);
    background-color: var(--maincolor4);
    // overflow-x: auto;
    // width: fit-content;
    >div{
      text-align: left;
    }
  }
  ::v-deep .van-nav-bar__title{
    max-width:70%;
  }
  .main{
    background-color: #fff;
    padding:rem(15);
    margin-top:rem(10);
    height:calc(100% - 46px);
    overflow-x: auto;
    overflow-y: hidden;
    ::v-deep .van-tabs__wrap{
      display: none;
    }
    ::v-deep .van-tabs__content{
      height:100%;
    }
    ::v-deep .van-tab__pane{
      height:100%;
    }
    ::v-deep .van-list{
      height:100%;
    }
  }
  .list{
    height:calc(100% - 40px);
    overflow-y: auto ;
    overflow-x: auto;
    // width: fit-content;
  }
  .tableItem{
    padding:rem(15) rem(5);
    border-bottom:1px solid #dedede;
    >div{
      text-align: left;
      max-height:rem(36);
      padding:0 rem(5);
      box-sizing: border-box;
      overflow: hidden;
      >div{
        font-size:rem(12);
        box-sizing: border-box;
        overflow: hidden;
        white-space: normal;
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
  }

}
</style>
