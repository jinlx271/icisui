<!-- 重点患者情况 -->
<template>
  <el-container id="keyPatients" class="keyPatients">
    <!-- 顶部内容 -->
    <el-header>
      <div>
        <i class="iconBlue"></i>
        <span>{{item.moduleName}}</span>
      </div>
    </el-header>
    <!-- 中间内容部分 -->
    <el-main>
      <template v-show="listData.length>0">
        <!-- 一条内容 -->
        <div class="lineDiv" v-for="(item) in listData" :key="item.itemCode">
          <!-- 上面部分 -->
          <div class="topDiv">
            <div class="topDiv_left">{{item.itemName}}</div>
            <div class="topDiv_center">
              <div class="greyBackground" ref="greyWidht"></div>
              <div class="blueBackground" :style="'width:'+ item.percentage * 100 + '%'"></div>
            </div>
            <div class="topDiv_right">{{item.divider || 0}}/{{item.dividend || 0}}</div>
          </div>
          <!-- 下面部分 -->
          <p class="bottomP" v-if="item.patBedList && item.patBedList.length">
            <span v-for="beditem in item.bedList" :key="beditem">{{beditem}}床</span>
          </p>
        </div>
      </template>
      <el-empty v-show="listData.length<1" :image-size="100" description="暂无数据"></el-empty>
    </el-main>
  </el-container>
</template>

<script>
import { statistics_collectFocalPatientData } from '@/api/wardOverview'
import { mapGetters } from 'vuex'
export default {
  name: 'KeyPatients',
  components: {},
  data: function() {
    return {
      totalNumber: 9, // 显示调的总计
      listData: [
        {
          name: '特级护理：',
          number: '1',
          des: '（9床、10床、12床、22床）'
        },
        {
          name: '一级护理：',
          number: '2',
          des: '（9床、10床、12床、22床）'
        },
        {
          name: '二级护理：',
          number: '3',
          des: '（9床、10床、12床、22床）'
        },
        {
          name: '三级护理：',
          number: '4',
          des: '（9床、10床、12床、22床）'
        },
        {
          name: '告病危患者：',
          number: '5',
          des: '（9床、10床）'
        },
        {
          name: '压疮高风险患者：',
          number: '6',
          des: '（9床、10床、12床、22床）'
        },
        {
          name: '非计划入ICU：',
          number: '7',
          des: '（9床、10床、12床、22床）'
        },
        {
          name: '非计划拔管：',
          number: '8',
          des: '（9床、10床）'
        },
        {
          name: '导管感染：',
          number: '9',
          des: '（9床、10床、12床、22床）'
        },
        {
          name: '24小时新入：',
          number: '9',
          des: '（9床、10床、12床、22床）'
        }
      ]
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
  filters: {},
  watch: {},
  computed: {
    ...mapGetters(['currentUserWard'])
  },
  created() {
    this.getCollectFocalPatientData()
  },
  mounted() {},
  methods: {
    getCollectFocalPatientData() {
      statistics_collectFocalPatientData({
        icuAreaCode: this.currentUserWard.wardCode // 病区code
      }).then(res => {
        this.listData = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.keyPatients {
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
    .iconBlue {
      margin-left: vw(16);
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
      margin-left: vw(8);
      flex: 1;
      height: 22px;
      line-height: 22px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: bold;
      font-size: 18px;
      color: var(--maincolor);
    }
  }
  ::v-deep .el-main {
    padding: 0;
    overflow-x: hidden;
    overflow-y: auto;
    .lineDiv {
      padding: 5px;
      .topDiv {
        width: 100%;
        display: flex;
        align-items: center;
        &_left {
          padding: 0 vw(10) 0 vw(6);
          white-space: nowrap;
          min-width: 110px;
          width: vw(130);
          font-size: 13px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(0, 6, 34, 0.8);
          text-align: right;
        }
        &_center {
          width: vw(262);
          position: relative;
          height: 18px;
          padding-left: vw(6);
          .greyBackground {
            width: 100%;
            z-index: 1;
            top: 0;
            left: 0;
            position: absolute;
            height: 100%;
            background: #f4f4f6;
          }
          .blueBackground {
            z-index: 2;
            top: 0;
            left: 0;
            position: absolute;
            height: 100%;
            background: linear-gradient(270deg, #4da9ff 0%, #0a94ff 100%);
          }
        }
        &_right {
          padding: 0 vw(12) 0 vw(12);
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(0, 6, 34, 0.8);
        }
      }
      .bottomP {
        margin: 4px 0 0 vw(120);
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 6, 34, 0.5);
        line-height: 18px;
        &::before {
          content: '(';
        }
        &::after {
          content: ')';
        }
        span {
          &::after {
            content: '、';
          }
          &:nth-last-of-type(1) {
            &::after {
              content: '';
            }
          }
        }
      }
    }
  }
}
</style>
