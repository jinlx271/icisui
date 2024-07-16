<!-- 基础参数 -->
<template>
  <div class="PasswordStrengthConfig">
    <div class="flex flex-between">
      <el-form-item label="参数值" prop="formData">
      </el-form-item>
    </div>
    <div class="form">
      <el-form ref="form" :model="formData" label-width="240px" >
        <el-form-item label="修改初始密码"  prop="defaultPwd">
          <el-switch v-model="formData.defaultPwd" active-value="1" inactive-value="0" @change="changeValidate"></el-switch>
        </el-form-item>
        <el-form-item label="定期修改密码" prop="changePwd">
          <el-switch v-model="formData.changePwd" active-value="1" inactive-value="0" @change="changeValidate"></el-switch>
        </el-form-item>
        <el-form-item label="过期提示天数"  prop="expireDays" v-if="formData.changePwd=='1'">
          <el-input-number v-model="formData.expireDays" placeholder="请输入" :maxlength="200" :min="1" :max="365"></el-input-number>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PasswordStrengthConfig',
  data: function () {
    return {
     // 无纸化办公
      formData: {
        defaultPwd: '', // 修改初始面膜
        changePwd: '', // 是否定期修改
        expireDays: '' // 过期天数
      }

    }
  },
  props: {
    paramValue: {}
  },
  watch: {
    string: {
      handler: function (n) {
        try {
          const paramValueCopy = JSON.parse(JSON.parse(n))
          this.formData = paramValueCopy
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
    change() {
      return new Promise((resolve, reject) => {
        this.$emit('update:paramValue', JSON.stringify(this.formData))
        resolve()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.PasswordStrengthConfig {
  height: fit-content;
  margin-bottom:20px;

}
.form{
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
}
</style>
