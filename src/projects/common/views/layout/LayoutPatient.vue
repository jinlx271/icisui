<!-- 患者管理独有的头部 -->
<template>
    <div class="HCContiner">
        <div class="Header" v-if="limitFeat != 1">
            <menuHead @refresh="refresh"></menuHead>
        </div>
        <div class="Header" v-if="noPatientInfo != 1">
            <operateHead></operateHead>
        </div>
        <div class="LMContiner">
            <i class="collapsebBtn"  v-if="limitFeat != 1" :class="collapse?'el-icon-d-arrow-left leftBtn':'el-icon-d-arrow-right rightBtn'" @click="collapse = !collapse" ></i>
            <div class="Left" v-if="limitFeat != 1" v-show="collapse">
                <sidebar></sidebar>
            </div>
            <div class="Main" id="patientMain">
                <app-main></app-main>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import menuHead from './menuHead/index' // 公共头部
import operateHead from '@/views/patient/components/head/index' // 公共头部
import { Sidebar, AppMain } from './components'
import limitFeatMixin from '@/views/layout/mixin/limitFeatMixin'
export default {
    name: 'Layout',
    components: {
        menuHead,
        // Navbar,
        Sidebar,
        AppMain,
        operateHead
    },
    data() {
        return {
            timestamp: 0,
            timeout: -1,
            collapse: true
        }
    },
    mixins: [limitFeatMixin],
    computed: {
        ...mapGetters(['currentUserWard', 'patientInfo'])
    },
    watch: {
        currentUserWard: {
            handler: function (newValue, oldValue) {
                if (newValue.wardCode != oldValue.wardCode && newValue && oldValue) {
                    this.$store.commit('set_patientList', [])
                    this.$router.replace({ path: '/patientHome/homePage', query: this.$route.query })
                }
            },
            deep: true
        },
        'patientInfo.icuRecordId': { // 患者快捷切换页面刷新
            handler: function (newValue, oldValue) {
                if (oldValue != newValue) {
                    clearTimeout(this.timeout)
                    this.timeout = setTimeout(() => { // 切换患者时 患者详情组件进行更新 页面接口刷新 请求
                        this.$store.commit('set_timestamp')
                    }, 500)
                }
            },
            deep: true
        },
        'patientInfo.icuInfoEntity.icuAreaTime': { // 患者入区时间的更改 导致查询条件变化
            handler: function (newValue, oldValue) {
                if (oldValue != newValue) {
                    clearTimeout(this.timeout)
                    this.timeout = setTimeout(() => { // 切换患者时 患者详情组件进行更新 页面接口刷新 请求
                        this.$store.commit('set_timestamp')
                    }, 500)
                }
            },
            deep: true
        }
    },
    mounted() {
    },
    methods: {
        refresh() {
            this.timestamp = new Date().getTime()
        }
    },
    beforeDestroy() {
        clearTimeout(this.timeout)
    }
}
</script>

<style lang="scss" scoped>
.HCContiner {
    padding: 0px;
    margin: 0px;
    height: 100%;
    display: flex;
    flex-direction: column;

    .Header {
        height: 50px;
        flex-shrink: 0;
    }

    .LMContiner {
        flex: 1;
        display: flex;
        overflow: hidden;
        background: #ebeff7;
        .collapsebBtn{

            z-index:10;
        }
        .leftBtn{
            position:absolute;
            top:115px;
            left:98px;

        }
        .rightBtn{
            position:relative;
            top:15px;
            left:10px;
        }

        .Left {
            width: 120px;
            background: #fff;
            margin: 12px 0px 12px 0px;
            flex-shrink: 0;
            overflow-y:auto;
        }

        .Main {
            flex: 1;
            overflow: hidden;
            margin: 12px 12px 12px;
        }
    }
}
</style>
