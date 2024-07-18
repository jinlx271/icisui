<template>
  <div style="overflow:hidden;height:100%;">
    <div class="body" v-show="centerData">
      <div class="body_header">
        <el-form :inline="true" :model="centerForm" class="demo-form-inline">
          <el-form-item label="评估结果">
            <el-input disabled="disabled" v-model="centerForm.score" placeholder="评估结果"></el-input>
          </el-form-item>
          <el-form-item label="评估时间">
            <wn-date-picker :disabled="timeFlag" value-format="yyyy-MM-dd HH:mm:ss" v-model="centerForm.time"
              type="datetime" placeholder="请选择日期时间"></wn-date-picker>
          </el-form-item>
          <el-form-item label="评估人">
            <el-select @clear="() =>
              filterMethod('')" :filter-method="(val) => filterMethod(val)" v-model="centerForm.people" clearable
              filterable placeholder="请选择">
              <el-option v-for="(item) in centerNurseList" :key="item.userName"
                :label="item.name + '(' + item.userName + ')'" :value="item.userName"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <!-- <div class="body_main" v-if="centerData.sourceType=='0'">
        <components ref="components" :centerData="centerData" :saveOrUpdate="true" @scoreFc="scoreFc" />
      </div> -->
    </div>
    <div slot="footer" class="body_footer" v-if="isEdit&&centerData.sourceType=='0'">
      <el-button type="primary" @click="eliminateFc">清 空</el-button>
      <el-button type="primary" @click="importLastScore">导入上次评分</el-button>
      <el-button type="primary" @click="cancel">取 消</el-button>
      <el-button type="primary" @click="save">保 存</el-button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'
import { getCookie } from '@/utils/cookie' // 存储方式
import { frontFilter } from '@/utils/index' // 模糊查询方法
import { formconfig_getById } from '@/api/configuration'
// import components from '@/views/patient//components/patientAssessment/index.vue' // 组件菜单
import {
  formapply_getById, // 查询 单条数据查询 已经保存过的数据
  formapply_getPreScoreData, // 导入上次数据
  formapply_add, // 保存
  formapply_update, // 修改
  getWardUserList // 获取所有 工作人员列表
} from '@/api/patient'
import { caHandle, caBJHandle, isRunCASignEx } from '@/utils/ca'
export default {
  name: '',
  components: { },
  props: {
    obj: {
      type: Object,
      default: () => {
        return {}
      }
    }, // 当前元素的所有数据
    time: {
      type: String,
      default: ''
    }, // 传过来的时间
    value: {
      type: String,
      default: ''
    },
    sourceKey: {
      type: String,
      default: ''
    }, // 字段代表 id
    icuRecordId: {
      type: String,
      default: ''
    }, // 患者id
    visible: {
      type: Boolean,
      default: false
    }, // 显示隐藏
    timeFlag: {
      type: Boolean,
      default: true
    }, // 时间组件是否能修改
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      editSelect: false, // 修改还是新增
      title: '', // 评估单名称
      areaObj: {}, // ca 签名的数据
      userInfo: getCookie('userInfo'),
      currentUserWard: getCookie('currentUserWard') || {
        wardCode: '', // 病区code
        wardName: '' // 病区姓名
      }, // cookie 里面的病区id
      centerData: {},
      centerForm: {
        score: '', // 评估分数
        time: '', // 评估时间
        people: '' // 评估人id
      },
      scoreObj: {},
      centerNurseList: [], // 护士所有人员选择
      centerNurseListAll: [] // 护士所有人员选择
    }
  },
  watch: {},
  computed: {
    ...mapGetters(['patientInfo', 'systemInfo'])
  },
  beforeCreated() { },
  created() {
    // 初始化
    this.$queryParam({ paramGroupCode: 'XTCS', paramCode: '1014' }).then(res => {
      this.areaObj = res[0]?.paramValue ? JSON.parse(res[0]?.paramValue) : {}
    })
    // 没有id 就代表是新增 否则是 修改
    this.editSelect = this.sourceKey == ''
    this.init()
  },
  beforeMount() { },
  mounted() { },
  beforeUpdate() { },
  update() { },
  beforeDestroy() { },
  destroyed() { },
  methods: {
    /**
     * 初始化
     */
    init() {
      if (this.sourceKey) {
        formapply_getById({
          id: this.sourceKey,
          cascade: false
        }).then(async res => {
          this.centerForm = {
            score: '', // 评估分数
            time: '', // 评估时间
            people: '' // 评估人id
          }
          this.centerData = res.data // 中间内容
          this.title = this.centerData.formName
          this.centerForm.time = this.centerData.scoreTime // 修改的时间
          let userType = 'NURSE'
          switch (this.centerData.applicableType) {
            case '0':
              userType = 'DOCTOR,NURSE' // 医生、护士
              break
            case '1':
              userType = 'DOCTOR' // 医生
              break
            case '2':
              userType = 'NURSE' // 护士
              break
          }
          await this.getWardUserListFc({
            userType: userType,
            wardCode: this.currentUserWard.wardCode,
            searchKey: ''
          })
        })
      } else {
        // 新增内容
        formconfig_getById({
          id: this.obj.formId
        }).then(async res => {
          this.centerData = res.data
          this.centerData.sourceType = '0'
          this.title = this.centerData.formName
          this.centerForm.time = dayjs(new Date(this.time)).format(
            'YYYY-MM-DD HH:mm:00'
          ) // 默认当前时间
          let userType = 'NURSE'
          switch (this.centerData.applicableType) {
            case '0':
              userType = 'DOCTOR,NURSE' // 医生、护士
              break
            case '1':
              userType = 'DOCTOR' // 医生
              break
            case '2':
              userType = 'NURSE' // 护士
              break
          }
          await this.getWardUserListFc({
            userType: userType,
            wardCode: this.currentUserWard.wardCode,
            searchKey: ''
          })
        })
      }
    },
    /**
     * 护士列表 和选择当前登录人
     */
    getWardUserListFc(data) {
      return new Promise((resolve, reject) => {
        getWardUserList(data).then(res => {
          // 护士所有列表
          this.centerNurseList = this.centerNurseListAll = res.data // 护士所有列表
          const centerNurseListAll = this.centerNurseListAll.filter(res => {
            return res.userName == this.userInfo.userName
          })
          if (centerNurseListAll && centerNurseListAll.length > 0) {
            this.centerForm.people = this.userInfo.userName // 默认登录人员
          }
          if (this.centerData.assessorId && this.centerData.assessorName) {
            const List = this.centerNurseListAll.filter(res => {
              return res.userName == this.centerData.assessorId
            })
            if (List.length < 1) {
              this.centerNurseList.push({ userName: this.centerData.assessorId, name: this.centerData.assessorName })
            }
            this.centerForm.people = this.centerData.assessorId
          }
          resolve()
        })
      })
    },
    /**
     * 过滤护士
     */
    filterMethod(val, key) {
      switch (key) {
        default:
          this.centerNurseList = frontFilter(val, this.centerNurseListAll)
          break
      }
    },
    /**
     * 中间内容 分数返回
     */
    scoreFc(obj) {
      this.scoreObj = obj
      if (this.centerData.finalResult == '0') {
        this.centerForm.score = obj.score
      } else if (this.centerData.finalResult == '1') {
        this.centerForm.score = obj.textScore
      } else if (this.centerData.finalResult == '2') {
        const result = []
        if (obj.score && obj.score != '') {
          result.push(obj.score)
        }
        if (obj.textScore && obj.textScore != '') {
          result.push(obj.textScore)
        }
        this.centerForm.score = result.join(';')
      } else {
        this.centerForm.score = obj.score
      }
    },
    /**
     * 中间内容 清空
     */
    eliminateFc() {
      this.$confirm('您确定清除所有数据吗?', '确认信息')
        .then(res => {
          this.$refs.components.rightData.map(res => {
            res.obj.val = ''
            res.obj.score = 0
          })
          this.$refs.components.ruleShowList.map((item, index) => {
            this.$refs.components.rightData.map((item2, index2) => {
              // 被隐藏哪个
              if (item.child == item2.obj.itemKey) {
                item2.obj.visible = false // 备选的隐藏
              }
            })
          })
          this.$message({
            message: '清除成功!',
            type: 'success'
          })
        })
        .catch(() => { })
    },
    /**
     * 中间内容 导入上次评分
     */
    importLastScore(item, index) {
      formapply_getPreScoreData({
        formId: this.obj.formId, // 评估单id
        icuRecordId: this.icuRecordId != '' ? this.icuRecordId : this.patientInfo.icuRecordId, // 病人ICU_ID
        scoreTime: this.centerForm.time, // 评分时间
        cascade: false // 级联查询数据
      }).then(res => {
        this.centerData = res.data
        this.$message({
          message: '导入成功!',
          type: 'success'
        })
      })
    },
    /**
     * 取消
     */
    cancel() {
      this.$emit('cancelFc')
    },
    /**
     * 中间内容 保 存
     */
    save() {
      if (this.$parent.$options.name == 'TntePointBody') {
        this.$parent.save({ closeDialog: false }).then(() => {
          this.saveEntity()
        })
      } else {
        this.saveEntity()
      }
    },
    saveEntity() {
      const centerNurseListAll = this.centerNurseListAll.filter(res => {
        return res.userName == this.centerForm.people
      })
      if (!(centerNurseListAll && centerNurseListAll.length > 0)) {
        this.$message({
          message: '评估人不存在请确认后,再保存！',
          type: 'error'
        })
        return
      }
      const queryData = {
        formId: this.obj.formId, // 评估单id
        configureId: this.obj.configureId, // 评估单id
        icuRecordId: this.icuRecordId != '' ? this.icuRecordId : this.patientInfo.icuRecordId, // 病人ICU_ID
        scoreTime: this.centerForm.time, // 默认当前时间, // 评估时间
        // totalScore: this.centerForm.score, // 评估分数
        assessorId: this.centerForm.people, // 评估人
        assessorName: centerNurseListAll[0].name, // 评估人
        jsonData: JSON.stringify({
          rightData: this.$refs.components.rightData,
          ruleShowList: this.$refs.components.ruleShowList,
          calculationList: this.$refs.components.calculationList
        }),
        moniItemFlag: '1',
        moniItemRecord: {
          moniitemCode: this.obj.moniitemCode, // 必传，监护项编码
          moniitemName: this.obj.moniitemName, // 必传，监护项名称
          moniitemSourceDict: this.obj.dataSourceDict, // 必传，监护项数据来源分类
          moniitemValueTypeDict: this.obj.moniitemValueTypeDict, // 必传，内容样式分类
          monitypeCode: this.obj.monitypeCode, // 监护项显示分组编码
          monitypeName: this.obj.monitypeName // 监护项显示分组编码
        }
      }
      queryData.finalResult = this.centerData.finalResult || 0
      if (this.centerData.finalResult == 0 || !this.centerData.finalResult) {
        queryData.totalScore = this.scoreObj.score
      } else {
        queryData.totalScore = this.scoreObj.score || ''
        queryData.textScore = this.scoreObj.textScore || ''
      }
      let queryurl = formapply_add
      // 修改需要id .保存不需要
      if (!this.editSelect) {
        queryData.id = this.sourceKey
        queryurl = formapply_update
      }
      queryData.wardCode = this.currentUserWard.wardCode
      queryurl(queryData).then(async resAction => {
        // 拿时间列表
        this.centerData = {}
        this.$message({
          message: !this.editSelect ? '修改成功' : '保存成功!',
          type: 'success'
        })
        // 患者评估
        if (await caBJHandle('assess')) {
          return
        }
        // 新增写入
        if (this.editSelect) {
          // 北京ca数据签入-患者评估新增
          isRunCASignEx('3', 'pgd', {
            id: this.centerData.id, // 表id
            formCode: this.centerData.formCode, // 表编码
            formName: this.centerData.formName, // 表名称
            scoreTime: queryData.scoreTime, // 评估时间
            type: '3'
          })
        }
        // 医信CA
        caHandle(this, '患者评估', 'assess', !this.editSelect ? queryData.id : resAction.data, () => {
          this.cancel()
          this.$emit('patientAssessmentCallback', queryData, resAction)
        })
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.body {
  height: calc(100% - 60px);
  overflow-y: auto;
  padding: 0 vw(20);
  display: flex;
  flex-direction: column;

  &_header {
    height: 50px;
    display: flex;
    align-items: center;

    // border-bottom: 1px solid #dfe7f5;
    ::v-deep .el-form {
      height: 64px;
      display: flex;
      align-items: center;

      .el-form-item--small.el-form-item {
        margin-bottom: 0;
      }

      .el-form-item__label {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
      }
    }

    ::v-deep .el-input {
      width: 120px;
    }

    ::v-deep .el-date-editor {
      width: 200px;
    }

    ::v-deep .el-input>.el-input__inner {
      border: none;
      background: #f3f5f9;
      border-radius: 4px;
    }
  }

  &_main {
    height: calc(100% - 40px);
    flex: 1;
    overflow: auto;
    position: relative;
  }

  &_footer {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    // border-top: 1px solid #dfe7f5;
    ::v-deep .el-button {
      margin-left: vw(18);
    }
  }
}
</style>
