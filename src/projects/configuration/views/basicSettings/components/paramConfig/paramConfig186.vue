<!-- 基础参数 -->
<template>
  <div class="paperLessConfig">
    <div class="flex flex-between">
      <el-form-item label="参数值" prop="paramInfo">
      </el-form-item>
    </div>
    <div class="paperLessConfigContent">
      <el-form ref="form" :model="paramInfo" label-width="180px" :rules="rules">
        <el-form-item label="开启同步"   prop="enable" class="line30" >
          <el-switch v-model="paramInfo.enable" active-value="1" inactive-value="0" @change="changeValidate"></el-switch>
        </el-form-item>
        <el-form-item label="接口地址" v-if="paramInfo.enable=='1'" prop="serviceUrl">
          <el-input v-model="paramInfo.serviceUrl" placeholder="请输入" :maxlength="200" ></el-input>
        </el-form-item>
        <el-form-item label="同步时间点" prop="corn" v-if="paramInfo.enable=='1'">
          <Crontab  ref="crontab" @fill="(v)=>{paramInfo.corn=v}" :expression="paramInfo.corn" :hideComponent="['result','day','month','year','week']"></Crontab>
        </el-form-item>

        <el-form-item label="病历ID(监控类型ID)" v-if="paramInfo.enable=='1'" prop="formId">
          <el-input v-model="paramInfo.formId" placeholder="请输入" :maxlength="200" ></el-input>
        </el-form-item>
        <el-form-item label="元数据-评分结果" v-if="paramInfo.enable=='1'" prop="scoreId">
          <el-input v-model="paramInfo.scoreId" placeholder="请输入" :maxlength="200" ></el-input>
        </el-form-item>
        <el-form-item label="元数据-评分时间" v-if="paramInfo.enable=='1'" prop="scoreTimeId" >
          <div class="flex flex-between">
            <el-input v-model="paramInfo.scoreTimeId" placeholder="请输入" :maxlength="200" ></el-input>
          </div>
        </el-form-item>
        <el-form-item label="元数据-操作人" v-if="paramInfo.enable=='1'" prop="assessorInfoId">
          <el-input v-model="paramInfo.assessorInfoId" placeholder="请输入" :maxlength="100" ></el-input>
        </el-form-item>
        <el-form-item label="元数据-R值" v-if="paramInfo.enable=='1'" prop="rId">
          <el-input v-model="paramInfo.rId" placeholder="请输入" :maxlength="100" ></el-input>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>
<script>
import Crontab from '@/components/Crontab'
export default {
  name: 'ParamPaperlessConfig',
  components: { Crontab },
  data: function () {
    return {
     // 无纸化办公
      paramInfo: {
        enable: '', // 无纸化开关
        serviceUrl: '', // 存储api地址
        formId: '', // 控制api地址
        scoreId: '', // 撤销地址
        scoreTimeId: '', // ftp服务地址
        assessorInfoId: '', // ftp用户名
        rId: '', // ftp密码
        corn: '* * * * * ? *'
      },
      tabTitles: ['秒', '分钟', '小时', '日', '月', '周', '年'],
      //  /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/
      rules: {

      },
      crontabValueObj: {
        second: '*',
        min: '*',
        hour: '*',
        day: '*',
        month: '*',
        week: '?',
        year: ''
      },
      year: this.$dayjs().format('YYYY')

    }
  },
  props: {
    paramValue: {}
  },
  watch: {
    string: {
      handler: function (n) {
        try {
          const paramInfo = JSON.parse(JSON.parse(n))
          this.paramInfo = paramInfo
          var valueArr = this.paramInfo.corn.split(' ')
          let index = 0
          for (const key in this.crontabValueObj) {
            this.crontabValueObj[key] = valueArr[index]
            index++
          }
          this.changeValidate(this.paramInfo.enable)
        } catch (error) {
         //
        }
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    string() {
      return JSON.stringify(this.paramValue) || '[]'
    }
  },
  created: async function () {

  },
  destroyed() {
    clearTimeout(this.loadingTimeout)
  },
  mounted() { },
  methods: {
    /**
     * 数据变更 保存数据
     */
    change() {
      return new Promise((resolve, reject) => {
        this.$refs?.crontab?.submitFill()
        this.$refs.form.validate(valid => {
            if (valid) {
                this.$emit('update:paramValue', JSON.stringify(this.paramInfo))
                resolve()
            } else reject()
        })
      })
    },
    /**
     * 切换开关 规则变化
     */
    changeValidate(e) {
      if (e == '0') {
        this.rules = {
          // corn: [
          //     {
          //       required: true, message: '请输入同步时间点如0 30 0 ? * *', trigger: 'blur'
          //     }
          //   ]
        }
      } else {
        this.rules = {
            serviceUrl: [
              {
                required: true, message: '请输入接口地址', trigger: 'blur'
              }],
            formId: [
              {
                required: true, message: '请输入病历ID(监控类型ID)', trigger: 'blur'
              }
            ],
            scoreId: [
              {
                required: true, message: '请输入元数据-评分结果', trigger: 'blur'
              }
            ],
            scoreTimeId: [
              {
                required: true, message: '请输入元数据-评分时间', trigger: 'blur'
              }
            ],
            assessorInfoId: [{
               required: true, message: '请输入元数据-操作人', trigger: 'blur'
            }],
            rId: [{
               required: true, message: '请输入元数据-R值', trigger: 'blur'
            }],
            corn: [
              {
                required: true, message: '请输入同步时间点如0 30 0 ? * *', trigger: 'blur'
              }
            ]
        }
      }
    },
    /**
     * 切换频率设置
     * e 当前值
     * key 当前切换属性
     * min 控制的最小变量
     * max 最大变量
     * str 特殊字符
     */
    changeFrequency(e, key, min, max, str) {
      const arr = str.split(' ')
      let regStr = ''
      for (var index = 0; index < arr.length; index++) {
        regStr += '\\' + arr[index]
      }
      const res = new RegExp(regStr, 'g')
      if (!res.test(e)) {
        this.$message('请输入' + min + '~' + max)
      } else {
        this.crontabValueObj[key] = e
        const valueArr = []
        for (const key in this.crontabValueObj) {
          valueArr.push(this.crontabValueObj[key])
        }
        this.paramInfo.corn = valueArr.join(' ')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.paperLessConfig {
  height: fit-content;
  margin-bottom:20px;

}
.paperLessConfigContent{
  padding:5px 10px;
  // background:var(--maincolor4);
  background:#f3f5f9;
  max-height: 300px;
  height:fit-content;
  overflow-y: auto;

  ::v-deep .el-input > .el-input__inner{

    border:1px solid #ddd;
    background:#fff;
  }
  .line30{
    .el-form-item--small .el-form-item__content {
      line-height: 30px;;
    }
  }
  .shortInput{
    .el-button{
      width: 130px;
    }
    .linkStatus{
      width: 130px;
    }
    .m-l10{
      margin-left: 10px;
    }
    ::v-deep .el-input{
      flex:1;
    }
  }
}
.popup-result {
  box-sizing: border-box;
  line-height: 24px;
  margin: 25px auto;
  padding: 15px 10px 10px;
  border: 1px solid #ccc;
  position: relative;
}
.popup-result .title {
  position: absolute;
  top: -28px;
  left: 50%;
  width: 140px;
  font-size: 14px;
  margin-left: -70px;
  text-align: center;
  line-height: 30px;
  background: #f3f5f9;
}
.popup-result table {
  text-align: center;
  width: 100%;
  margin: 0 auto;
}
.popup-result table span {
  display: block;
  width: 100%;
  font-family: arial;
  line-height: 30px;
  height: 30px;
  white-space: nowrap;
  overflow: hidden;
  border: 1px solid #e8e8e8;
}
.popup-result-scroll {
  font-size: 12px;
  line-height: 24px;
  height: 10em;
  overflow-y: auto;
}
</style>
