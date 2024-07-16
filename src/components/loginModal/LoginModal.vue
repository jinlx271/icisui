<template>
  <el-dialog
    v-el-drag-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="300px"
    append-to-body
    :before-close="handleClose"
    center
  >
    <el-form
      ref="form1"
      :rules="rules"
      class="dialog-body"
      size="small"
      label-position="top"
      :model="formData"
      label-width="80px"
    >
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          name="username"
          type="text"
          auto-complete="on"
          placeholder="请输入"
          maxlength="32"
          @keyup.enter.native="handleUsername"
        >
          <svg-icon slot="prefix" icon-class="user" />
          <span
            v-if="loginForm.username"
            slot="suffix"
            class="loginDelWrap"
            @click="loginForm.username = ''"
          >
            <svg-icon icon-class="loginDel" style="width:14px;height:14px" />
          </span>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          ref="password"
          :type="pwdType"
          v-model="loginForm.password"
          class="password"
          name="password"
          auto-complete="on"
          placeholder="请输入"
          maxlength="32"
          @keyup.enter.native="handleLogin"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" type="default" @click="handleClose">取消</el-button>
      <el-button size="small" type="primary" @click="cancleSurgery">保存</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { cancleSurgery } from '@/api/anas'
import { mapGetters } from 'vuex'
export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length < 5 && 1 + 1 !== 2) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: true,
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, message: '请输入工号', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码', validator: validatePass }
        ]
      },
      loading: false,
      pwdType: 'password'
    }
  },
  props: {
    title: {
      type: String,
      default: '用户验证'
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    handleClose() {
      this.dialogVisible = false
      this.$emit('closeModal')
    },
    cancleSurgery() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$store.commit('set_currOperation', '')
          cancleSurgery({
            regOptId: this.$route.query.regOptId,
            reasons: this.formData.reasons
          }).then(() => {
            this.$message.success('取消手术成功')
            this.$store.commit('set_currOperation', 'cancel')
            this.$emit('closeModal')
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-body {
  ::v-deep .el-form-item__label {
    padding-bottom: 0;
  }
  ::v-deep .el-button {
    margin-top: 28px;
  }
}
</style>
