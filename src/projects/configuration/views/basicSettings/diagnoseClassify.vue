<!-- 抢救记录项配置 -->
<template>
  <div id="diagnoseClassify" class="diagnoseClassify">
    <div class="diagnoseClassifyBaseInfo">
      <el-tabs v-model="activeName" height="100%" @tab-click="searchKey='',diagnoseSearchKey='',statusDict=''">
        <el-tab-pane name="unAnesPatient" height="100%" label="非手术患者">
          <el-row height="100%">
            <el-col :span="15" style="border-right:1px solid silver;padding-right: 10px;margin-right:10px">
              <div class="blueLeftBorder m-b10">
                <strong>
                  病种
                </strong>
              </div>
              <el-header class="elHeader3">
                <div class="headerLeft">
                  <el-input size="small" placeholder="名称/编码" clearable suffix-icon="el-icon-search" v-model="searchKey"></el-input>
                  <el-checkbox v-model="statusDict" true-label="" false-label="1"  >
                        显示禁用
                  </el-checkbox>
                </div>
                <div class="headerRight">
                  <el-button v-hasPermi="['configuration:basicSettings:rescueRecordConfig']" class="queryButton" type="primary"
                             @click.native.prevent="addDisease">添加病种</el-button>
                </div>
              </el-header>
              <el-main style="height:calc(100% - 70px)">
                <Disease v-if="activeName=='unAnesPatient'" style="height:100%" @rowClick="rowClick" :surgicalPatients="surgicalPatients"
                         ref="Disease" :searchKey="searchKey"  :statusDict.sync="statusDict">
                </Disease>
              </el-main>
            </el-col>
            <el-col :span="9" style="width:calc(37.5% - 20px)">
              <div class="blueLeftBorder">
                <strong>
                  诊断
                </strong>
              </div>
              <el-header class="elHeader3">
                <div class="headerLeft">
                  <el-input size="small" placeholder="名称/编码" clearable suffix-icon="el-icon-search" v-model="diagnoseSearchKey"></el-input>
                </div>
                <div class="headerRight">
                  <el-button v-hasPermi="['configuration:basicSettings:rescueRecordConfig']" class="queryButton" type="primary"
                             :disabled="!classifyId" @click.native.prevent="addDiagnose">新增诊断</el-button>
                </div>
              </el-header>
              <el-main style="height:calc(100% - 70px)">
                <Diagnose v-if="activeName=='unAnesPatient'" style="height:100%" @rowClick="rowClick" :classifyId="classifyId"
                          :surgicalPatients="surgicalPatients" ref="Diagnose" :searchKey="diagnoseSearchKey" >
                </Diagnose>
              </el-main>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane name="anesPatient" height="100%" label="手术患者">
          <el-row height="100%">
            <el-col :span="15" style="border-right:1px solid silver;padding-right: 10px;margin-right:10px">
              <div class="blueLeftBorder">
                <strong>
                  病种
                </strong>
              </div>
              <el-header class="elHeader3">
                <div class="headerLeft">
                  <el-input size="small" placeholder="名称/编码" clearable suffix-icon="el-icon-search" v-model="searchKey"></el-input>
                  <el-checkbox v-model="statusDict" true-label="" false-label="1"  >
                        显示禁用
                  </el-checkbox>
                </div>
                <div class="headerRight">
                  <el-button v-hasPermi="['configuration:basicSettings:rescueRecordConfig']" class="queryButton" type="primary"
                             @click.native.prevent="addDisease">添加病种</el-button>
                </div>
              </el-header>
              <el-main style="height:calc(100% - 70px)">
                <Disease v-if="activeName=='anesPatient'" style="height:100%" @rowClick="rowClick" :surgicalPatients="surgicalPatients" ref="Disease"
                         :searchKey="searchKey" :statusDict.sync="statusDict">
                </Disease>
              </el-main>
            </el-col>
            <el-col :span="9" style="width:calc(37.5% - 20px)">
              <div class="blueLeftBorder">
                <strong>
                  诊断
                </strong>
              </div>
              <el-header class="elHeader3">
                <div class="headerLeft">
                  <el-input size="small" placeholder="名称/编码" clearable suffix-icon="el-icon-search" v-model="diagnoseSearchKey"></el-input>
                </div>
                <div class="headerRight">
                  <el-button v-hasPermi="['configuration:basicSettings:rescueRecordConfig']" class="queryButton" type="primary"
                             :disabled="!classifyId" @click.native.prevent="addDiagnose">新增诊断</el-button>
                </div>
              </el-header>
              <el-main style="height:calc(100% - 70px)">
                <Diagnose v-if="activeName=='anesPatient'" style="height:100%" @rowClick="rowClick" :classifyId="classifyId"
                          :surgicalPatients="surgicalPatients" ref="Diagnose" :searchKey="diagnoseSearchKey">
                </Diagnose>
              </el-main>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Diagnose from './components/diagnose.vue'
import Disease from './components/disease.vue'
export default {
  name: 'SalvageItem',
  components: { Diagnose, Disease },
  data: function () {
    return {
      loading: false,
      activeName: 'unAnesPatient', // 切换  rescure_rescureBaseMoniitem   nursing  drug
      searchKey: '',
      statusDict: '',
      diagnoseSearchKey: '',
      classifyId: ''
    }
  },
  props: {},
  watch: {},
  computed: {
    ...mapGetters(['currentUserWard']),
    surgicalPatients() {
      return this.activeName == 'unAnesPatient' ? 0 : 1
    }
  },
  async created() {
  },
  mounted() { },
  methods: {
    rowClick(id) {
      this.classifyId = id
    },
    // 添加病种
    addDisease() {
      this.$refs.Disease?.add()
    },
    // 添加诊断
    addDiagnose() {
      this.$refs.Diagnose?.add()
    }

  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法

.diagnoseClassify {
  background: #fff;
  display: flex;
  height: 100%;
  width: 100%;
  .el-tabs--card {
    height: calc(100vh - 110px);
  }
  .el-tab-pane {
    height: calc(100vh - 155px);
    overflow-y: auto;
    .el-row {
      height: 100%;
    }
  }
  .diagnoseClassifyBaseInfo {
    padding: 1%;
    flex: 1;
    padding-right: 10px;
    overflow-x: auto;
    .el-header {
      height: 34px !important;
      padding: 0;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      .el-input {
        width: 300px;
      }
    }
  }
}
</style>
