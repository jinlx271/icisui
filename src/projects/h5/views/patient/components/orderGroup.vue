<template>
  <div class='orderGroup w100'>
    <template v-if="orderExecuteList.length > 0">
      <div v-for="orderInfo in orderExecuteList" :key="orderInfo.groupNo" class="orderGroupItem w100 "
        @click="displayOrderInfo(orderInfo)">
        <div class="orderContent  flex align-item-center w100 ">
          <div class="flex">
            <div class="orderValidityType flex align-item-center"
              :style="{ color: orderInfo.orderValidityTypeDict == '0' ? '#FF8D1A' : '#2A82E4' }">{{
                orderInfo.orderValidityTypeName[0]
              }}</div>

            <div class="orderPlantTime flex align-item-center">{{ orderInfo.planBeginTime | dateformat('HH:mm') }}</div>
            <div class="flex orderContent ">
              <div v-for="orderItem in orderInfo.orderGroupItemList" :key="orderItem.orderId"
                :class="orderInfo.orderGroupItemList.length > 1 ? 'orderContentItem flex align-item-center' : ' flex align-item-center'">
                <span>{{ orderItem.orderContent }}</span>
              </div>
            </div>
            <!-- 是否续药 -->
            <!-- <div class="itemTag">
          <i class="el-icon-set-up" style="color: #409eff"
            v-if="orderInfo.continuation == 1 && ![...windowKfList, ...windowZsList].includes(orderInfo.orderUsageDict)"></i>
        </div> -->
            <!-- 特殊用药 -->
            <!-- <div class="itemTag">
          <div class="offsetDownjiangpai" v-if="orderInfo.specialDrug">
            <svg-icon icon-class="奖牌" style="color: orange"></svg-icon>
            <div class="svgtext" style="color: orange; transform: matrix(0.7, 0, 0, 0.7, 13, 2)">
              {{ orderInfo.specialDrug }}
            </div>
          </div>
        </div> -->
            <!-- 是否补录医嘱 -->
            <!-- <div class="itemTag">
          <div v-if="orderInfo.dataSource === '1'" class="additionalIcon">补</div>
        </div> -->
            <!-- 频次 -->
            <div class="itemTag">
              <div>{{ orderInfo.drugFrequency }}</div>
            </div>
            <!-- 入量 -->
            <!-- <div class="itemTag">
          <div v-for="orderItem in orderInfo.orderGroupItemList" :key="orderItem.orderId"
            :class="orderInfo.orderGroupItemList.length > 1 ? 'realInput flex align-item-center' : ' flex align-item-center'">
            {{ orderItem.realInput !== null ? `${orderItem.realInput}ml` : `${orderItem.dose || ''}${orderItem.doseUnit ||
              '&nbsp;'}` }}
          </div>
        </div> -->
            <!-- 流速 -->
            <div class="itemTag">
              {{ orderInfo.executeList[orderInfo.executeList.length - 1].otherFlowRate ?
                orderInfo.executeList[orderInfo.executeList.length - 1].otherFlowRate +
                orderInfo.executeList[orderInfo.executeList.length - 1].otherFlowRateUnit :
                (orderInfo.executeList[orderInfo.executeList.length - 1].flowRate || '') + 'ml/h' }}
            </div>
          </div>
          <remainQuantity :orderInfo.sync="orderInfo" :orderPlanStatusList="orderPlanStatusList"
            :key="orderInfo.orderPlanId">
          </remainQuantity>
        </div>
        <div class="info w100" v-show="orderInfo.showInfoFlag">
          <div>
            <span>开立时间：{{ orderInfo.orderGroupItemList[0].createTime }} </span> <!--<span>开立医生：{{ }} </span>-->
          </div>
          <div>
            <span>开始时间：{{ orderInfo.executeBeginTime }} </span>
            <span>
              执行护士：{{ orderInfo.executeList[orderInfo.executeList.length - 1].recordOperatorName }}
            </span>
          </div>
        </div>
      </div>
    </template>
    <w-empty v-else>
    </w-empty>
  </div>
</template>

<script>
import WEmpty from '@/components/elEmpty'
import remainQuantity from './remainQuantity'
export default {
  name: 'Axis',
  components: { remainQuantity, WEmpty },
  props: {
    // 医嘱分类
    usageDict: {
      type: [Number, String],
      default: ''
    },
    orderExecuteList: {
      type: Array,
      default: () => []
    },
    // 医嘱非持续性入量（如：注射）
    windowZsList: {
      type: Array,
      default: () => []
    },
    // 非入量
    windowKfList: {
      type: Array,
      default: () => []
    },
    orderPlanStatusList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
    }
  },
  watch: {

  },
  mounted() {
  },
  methods: {
    displayOrderInfo(orderInfo) {
      orderInfo.showInfoFlag = 1 ^ orderInfo.showInfoFlag
    }
  }
}
</script>
<style lang='scss' scoped>
.orderGroup {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;

  .orderGroupItem {
    border-bottom: 1px dotted #ddd;
    padding: rem(8);

    .orderContent {
      justify-content: space-between;

      .orderValidityType {
        width: rem(14);
        margin-right: rem(8);
        font-size: rem(12);
      }

      .orderPlantTime {
        font-size: rem(12);
        margin-right: rem(8);
      }

      .orderContent {
        flex-direction: column;
        max-width: 55vw;
        margin-left: rem(10);
        font-size: rem(14);
        margin-right: rem(20);
        font-weight: 600;

        .orderContentItem {
          height: rem(27);
          position: relative;

          span {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-box-orient: vertical;
          }

        }

        .orderContentItem:first-child::before {
          content: "";
          display: block;
          position: absolute;
          top: 50%;
          left: rem(-10);
          width: rem(10);
          height: 50%;
          border-top: 1px solid #999;
          border-left: 1px solid #999;
        }

        .orderContentItem::before {
          content: "";
          display: block;
          position: absolute;
          top: 0;
          left: rem(-10);
          width: rem(10);
          height: 100%;
          border-left: 1px solid #999;
        }

        .orderContentItem:last-child::before {
          content: "";
          display: block;
          position: absolute;
          top: 0;
          left: rem(-10);
          width: rem(10);
          height: 50%;
          border-left: 1px solid #999;
          border-bottom: 1px solid #999;
        }

      }

      .itemTag {
        font-size: rem(12);
        min-width: rem(14);
        margin-right: rem(10);
        align-items: center;
        display: flex;

        // 补录医嘱
        .additionalIcon {
          border-radius: 50%;
          border: 1.5px solid var(--maincolor);
          color: var(--maincolor);
          width: rem(16);
          height: rem(16);
          font-size: rem(10);
          font-weight: 600;
          align-items: center;
          justify-content: center;
          display: flex;
          background-color: var(--maincolor4);
        }

        // 特殊用药
        .offsetDownjiangpai {
          position: relative;

          svg,
          .svgtext {
            position: absolute;
          }
        }

        .realInput {
          height: rem(27);
        }
      }

    }

    .info {
      font-size: rem(12);
      display: flex;
      flex-direction: column;
      margin-top: rem(4);
      color: #666;

      div {
        display: flex;

        span {
          margin-right: rem(15);
          margin-bottom: rem(2);
        }
      }
    }
  }

}
</style>
