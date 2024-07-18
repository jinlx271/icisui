<template>
    <van-pull-refresh @refresh="onRefresh" :animation-duration="10" v-model="vanPull" :disabled="vanDiabled">
        <div class='patientOverview' @scroll.prevent="lazyLoadModel" id="patientOverview">
            <div style="height:fit-content;" id="overViewContent">
                <div class='card sign w100'>
                    <div class='title'>
                        <span>生命体征</span>
                        <i class="el-icon-refresh" @click="refreshVitalSignData"></i>
                    </div>
                    <div class="charts1 flex">
                        <div class="yAxis flex">
                            <axis :min="item.minValue" :max="item.maxValue" :name="item.moniitemName" :axisNum="10"
                                :color="item.colorDict" v-for="(item, index) in signAxis" :key="index"></axis>
                        </div>
                        <chart :option='options' class='flex-1' id="signCode" ref="signCode" lineClickFlag>
                        </chart>
                    </div>

                </div>
                <div class='card sign w100'>
                    <div class='title'>
                        <span>液体平衡</span>
                        <i class="el-icon-refresh" @click="getLuquidDataList"></i>
                    </div>

                    <chart :option='luquidOpt1' class='charts' id="chartData" ref="chartData" v-loading="liquidLoading">
                    </chart>
                </div>
                <div class="bodyImage">
                    <div class='card  cathter'>
                        <div class='title'>
                            <span>导管情况</span>
                            <i class="el-icon-refresh" @click="getPatientCatheterList"></i>
                        </div>
                        <div class="image" id="catheterContent" v-loading="loadingCatheter">
                            <BabyBodyImage type="catheter" ref="catheterBody" :showLabel="true" :scale="scale"
                                :fontSize="14 / scale"
                                v-if="currentUserWard.wardIdentification && currentUserWard.wardIdentification == '2'"
                                :style="`margin-top:${marginTop};margin-left:${marginLeft};transform: scale(${scale});transform-origin:10px;`" />
                            <BodyImage type="catheter" :showLabel="true" ref="catheterBody" :scale="scale"
                                :fontSize="14 / scale"
                                :style="`margin-top:${marginTop};margin-left:${marginLeft};transform: scale(${scale};transform-origin:10px;`"
                                v-else />
                        </div>
                    </div>
                    <div class='card  cathter'>
                        <div class='title'>
                            <span>皮肤情况</span>
                            <i class="el-icon-refresh" @click="getSkinRecordList"></i>
                        </div>
                        <div class="image" id="skinContent" v-loading="loadingSkin">
                            <BabyBodyImage class="backImag" type="skin" :showLabel="true" ref="skinBody" :scale="scale"
                                :fontSize="14 / scale"
                                v-if="currentUserWard.wardIdentification && currentUserWard.wardIdentification == '2'"
                                :style="`margin-top:${marginTop};margin-left:${marginLeft};transform: scale(${scale};transform-origin:10px;`" />
                            <BodyImage class="backImag" type="skin" :showLabel="true" ref="skinBody" :scale="scale"
                                :fontSize="14 / scale"
                                :style="`margin-top:${marginTop};margin-left:${marginLeft};transform: scale(${scale};transform-origin:10px;`"
                                v-else />
                        </div>
                    </div>
                </div>
                <div class="card w100">
                    <div class='title'>
                        <span>医嘱执行</span>
                        <i class="el-icon-refresh" @click="getOrderPlanList"></i>
                    </div>
                    <div class="flex">
                        <el-radio-group v-model="orderExecuteType" size="small" @change="getOrderPlanList">
                            <el-radio-button :label="item.dictCode" v-for="item in orderExecuteTypeOptionsList"
                                :key="item.dictCode">
                                {{ item.dictName }}
                            </el-radio-button>
                        </el-radio-group>
                    </div>
                    <div class="orderPlan" id="orderPlanList" v-loading="loadingOrderExecute">
                        <orderGroup :orderExecuteList.sync="orderExecuteList" ref="orderGroup" :windowKfList="windowKfList"
                            :orderPlanStatusList="orderPlanStatusList" :windowZsList="windowZsList"></orderGroup>
                    </div>
                </div>
            </div>
        </div>
    </van-pull-refresh>
</template>
<script>
import BodyImage from '@/components/bodyImage/bodyImage'
import BabyBodyImage from '@/components/bodyImage/babyBodyImage'
import Chart from '@/components/Charts/anas'
import axis from './components/axis'
import orderGroup from './components/orderGroup'
import { mapGetters } from 'vuex'
import vitalSignData from './mixins/vitalSignData'
import liquidData from './mixins/liquidData'
import bodyImage from './mixins/bodyImage'
import {
    order_orderExecute_getOrderPlanList
} from '@/api/orderExecute'
import _ from 'lodash'
import {
    param_queryParam
} from '@/api/configuration'
export default {
    name: 'PatientOverview',
    components: { Chart, axis, BodyImage, BabyBodyImage, orderGroup },
    mixins: [vitalSignData, liquidData, bodyImage],
    inject: ['shiftListFn'],
    data() {
        return {
            marginTop: 10,
            marginLeft: 100,
            scale: 1,
            paddingTop: 0,
            pickerIndex: 0,
            timestamp: '',
            timestamp1: '',
            timestamp2: '',
            pickerFlag: false,
            startTime: '',
            endTime: '',
            loadingOrderExecute: false,
            orderExecuteList: [],
            // 医嘱长临类型列表
            orderExecuteType: '',
            orderValidityList: [],
            orderExecuteTypeOptionsList: [],
            // 医嘱分类
            orderUsageType: '',
            orderUsageTypeList: [],
            // 医嘱执行状态
            orderPlanStatusList: [],
            orderPlanActionList: [],
            // 医嘱非入量
            windowKfList: [],
            // 医嘱持续性入量（如：输液）
            windowSyList: [],
            windowZsList: [],
            loadOrderData: false,
            vanPull: false,
            vanDiabled: false
        }
    },
    watch: {
    },
    computed: {
        ...mapGetters(['currentUserWard', 'patientInfo'])
    },
    async created() {
        const {
            HIS_DICT_ORDER_VALIDITY_TYPE,
            ICIS_DICT_ORDER_USAGE_TYPE,
            ICIS_DICT_ORDER_PLAN_STATUS,
            ICIS_DICT_ORDER_PLAN_ACTION,
            ICIS_DICT_DRUG_ATTRIBUTES
        } = await this.$batchGetDictItemList([
            'HIS_DICT_ORDER_VALIDITY_TYPE',
            'ICIS_DICT_ORDER_USAGE_TYPE',
            'ICIS_DICT_ORDER_PLAN_STATUS',
            'ICIS_DICT_ORDER_PLAN_ACTION',
            'ICIS_DICT_DRUG_ATTRIBUTES'
        ])
        this.windowKfList = await this.param_queryParamFc('XTCS0009')
        this.windowSyList = await this.param_queryParamFc('XTCS0007')
        this.windowZsList = await this.param_queryParamFc('XTCS0008')
        this.orderValidityList = HIS_DICT_ORDER_VALIDITY_TYPE
        this.orderExecuteTypeOptionsList = [
            {
                dictCode: '',
                dictName: '全部'
            },
            ...this.orderValidityList
        ]
        this.orderUsageTypeList = ICIS_DICT_ORDER_USAGE_TYPE
        this.orderPlanStatusList = ICIS_DICT_ORDER_PLAN_STATUS
        this.orderPlanActionList = ICIS_DICT_ORDER_PLAN_ACTION
        this.drugAttributesList = ICIS_DICT_DRUG_ATTRIBUTES
    },
    mounted() {
        this.resetBodyImage()
        const self = this
        this.$bus.$on('updateSearchData', function (date) {
            if (date) {
                // self.loadData = false
                self.loadOrderData = false
                self.loadMoniitemData = false
                console.log('overView updateSearchData')
                self.refreshData(date)
            }
        })
        window.onresize = function () {
            self.timestamp = self.$dayjs().valueOf()
            self.timestamp1 = self.$dayjs().valueOf()
            self.resetBodyImage()
        }
    },
    methods: {
        onRefresh() {
            this.vanPull = true
            this.loadOrderData = false
            this.loadMoniitemData = false
            this.loadingCatheter = false
            this.lazyLoadModel()
        },
        /**
         * 改为拿系统参数
         */
        param_queryParamFc(paramCode) {
            return new Promise(resolve => {
                param_queryParam({
                    paramGroupCode: 'XTCS',
                    paramCode: paramCode
                }).then(res => {
                    resolve(res.data?.paramValue.split(','))
                })
            })
        },
        /**
         * 刷新页面数据
         * @param  date
         */
        refreshData(date) {
            if (this.shiftListFn().length == 0) {
                setTimeout(() => {
                    this.refreshData(date)
                }, 100)
            } else {
                this.startTime = date + ' ' + this.shiftListFn()[0].startTime
                this.endTime = date + ' ' + this.shiftListFn()[this.shiftListFn().length - 1].endTime
                if (this.$dayjs(this.startTime).valueOf() <= this.$dayjs(this.endTime).valueOf()) {
                    this.endTime = this.$dayjs(this.$dayjs(this.endTime).valueOf() + 24 * 3600 * 1000).format('YYYY-MM-DD HH:mm:ss')
                }
                this.lazyLoadModel()
            }
        },
        /**
         * 计算人体图值
         */
        resetBodyImage() {
            if (!this.$refs.catheterBody) {
                return
            }
            const height = this.$refs.catheterBody.$el.offsetHeight
            const offsetWidth = document.querySelector('#catheterContent').offsetWidth
            const offsetHeight = document.querySelector('#catheterContent').offsetHeight
            const hScale = offsetHeight / 790
            const wScale = offsetWidth / 460
            this.scale = hScale < wScale ? hScale : wScale
            // if (this.currentUserWard.wardIdentification != '2') {
            const marginTopValue = 0 - (height * (1 - this.scale)) / 2
            const marginLeftValue = ((offsetWidth - 356 * this.scale)) / 2
            this.marginTop = marginTopValue + 'px'
            this.marginLeft = marginLeftValue + 'px'
            // } else {
            // this.scale = this.scale * 1.5
            // const marginTopValue = 0 - (height * (1 - this.scale)) / 2
            // const marginLeftValue = ((offsetWidth - 356 * this.scale)) / 2
            // this.marginTop = (marginTopValue - 80) + 'px'
            // this.marginLeft = marginLeftValue + 'px'
            // }
        },
        /**
         * 医嘱执行
         */
        getOrderPlanList() {
            const query = {
                wardCode: this.currentUserWard.wardCode,
                endDateTime: this.endTime,
                startDateTime: this.startTime,
                orderType: this.orderExecuteType,
                // orderTypeName: '全部',
                icuRecordId: this.patientInfo.icuRecordId,
                shiftCode: 'D'
            }
            this.loadingOrderExecute = true
            // 获取查询执行计划列表数据
            order_orderExecute_getOrderPlanList(query).then(res => {
                this.timestamp1 = this.$dayjs().valueOf()
                this.loadingOrderExecute = false
                if (!res.data) {
                    return
                }
                const result = [...res.data]
                this.loadOrderData = true
                this.orderExecuteList = []
                this.orderUsageTypeList = _.sortBy(this.orderUsageTypeList, 'sortNo')
                this.orderUsageTypeList.forEach(item => {
                    const re = result.find(order => order.orderUsageDict == item.dictCode)
                    if (re) {
                        const planList = [] // 显示的计划列表
                        re.orderPlanGroup.map(item => {
                            item.orderUsageDict = re.orderUsageDict
                            if (!item.orderValidityTypeDict) {
                                item.orderValidityTypeDict = item.orderGroupItemList[0].orderValidityTypeDict
                            }
                            item.orderValidityTypeName = this.orderValidityList.find(dict => dict.dictCode == item.orderValidityTypeDict).dictName
                            item.orderPlanList.forEach(plan => {
                                if (plan.orderPlanStatusDict == '2' || plan.orderPlanStatusDict == '3') {
                                    const orderGroupItemList = item.orderGroupItemList
                                    const obj = item
                                    delete obj.orderPlanList
                                    planList.push({
                                        showInfoFlag: false,
                                        orderUsageDict: re.orderUsageDict,
                                        orderValidityTypeDict: item.orderGroupItemList[0].orderValidityTypeDict,
                                        orderValidityTypeName: this.orderValidityList.find(dict => dict.dictCode == item.orderValidityTypeDict).dictName,
                                        orderGroupItemList: orderGroupItemList,
                                        ...plan
                                    })
                                }
                            })
                            return item
                        })
                        if (planList.length > 0) {
                            this.orderExecuteList = this.orderExecuteList.concat(planList)
                        }
                    }
                })
            })
        },
        /**
         * @param {懒加载} $event
         */
        lazyLoadModel() {
            const patientOverContainer = document.querySelector('#patientOverview')
            const contentDom = document.querySelector('#overViewContent')
            const contentHeight = contentDom.offsetHeight
            this.vanDiabled = patientOverContainer.scrollTop > 0
            if (patientOverContainer.scrollTop > patientOverContainer.scrollHeight - contentHeight && !this.loadOrderData && !this.loadingOrderExecute) {
                this.getOrderPlanList()
            } else if (patientOverContainer.scrollTop > 300 && !this.loadData && !this.loadingCatheter) {
                this.getPatientCatheterList()
                this.getSkinRecordList()
            } else if (patientOverContainer.scrollTop < 300 && !this.loadMoniitemData && !this.loadMoniitemFlag) {
                this.getLuquidDataList()
                this.refreshVitalSignData()
            }
            this.vanPull = false
        }
    },
    beforeDestroy() {
        this.$bus.$off('updateSearchData')
    }
}
</script>
<style lang='scss' scoped>
.patientOverview {
    width: 100vw;
    height: 100%;
    overflow-y: auto;

    .yAxis {
        width: 10%;
        max-width: rem(80);
        overflow-x: auto;
        overflow-y: hidden;
        height: 100%;
        padding-bottom: rem(10);
    }

    .bodyImage {
        display: grid;
        // grid-template-columns: repeat(auto-fill, minmax(50%, 1fr));
        grid-template-columns: 1fr 1fr;
        grid-gap: rem(10);

    }

    .image {
        width: 100%;
        height: rem(500) !important;
        position: relative;
        flex: 1;
        display: flex;
    }

    .orderPlan {
        width: 100%;
        max-height: rem(500);
        position: relative;
        flex: 1;
        display: flex;
    }

    .card {
        background: #fff;
        padding: rem(0) rem(15);
        margin-bottom: rem(10);

        ::v-deep .el-radio-button__orig-radio:checked+.el-radio-button__inner {
            border-color: var(--maincolor);
        }

        .title {
            padding: rem(8) 0;
            display: flex;
            justify-content: space-between;
            align-items: center;

            span {
                position: relative;
                padding-left: rem(5);
            }

            span::before {
                content: ' ';
                position: absolute;
                top: rem(2);
                left: rem(-5);
                width: rem(4);
                border-radius: rem(2);
                height: rem(14);
                margin-right: rem(8);
                background-color: var(--maincolor);
            }

            i {
                font-size: rem(18);
            }

        }
    }

    .sign {
        height: rem(400);

        .charts {
            height: calc(100% - 4rem);
        }

        .charts1 {
            height: calc(100% - 4rem);
        }

        &_select {
            width: rem(100);
            // border:1px solid  #f5f5f5;
            padding: rem(5);
        }
    }

    .cathter {
        min-width: 350px;
        height: rem(530) !important;
    }

    .fixedPicker {
        position: fixed;
        bottom: 0px;
        width: 100%;
        background: #fff;
        height: rem(10);
    }
}
</style>
