/**
 *
*/
export default {
  data() {
    return {
      backFlag: false
    }
  },
  mounted() {
    this.backFlag = false
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL)
      window.addEventListener('popstate', this.leaveConfirmBack, false)
    }
  },
  destroyed() {
    window.removeEventListener('popstate', this.leaveConfirmBack, false)
  },
  methods: {
    leaveConfirmBack(e) {
      this.backFlag = true
      this.$router.go(-1)
      // this.$confirm('检测到未保存的内容，是否在离开页面前保存修改？', '确认信息', {
      //   distinguishCancelAndClose: true,
      //   confirmButtonText: '保存',
      //   cancelButtonText: '放弃修改'
      // })
      //   .then(() => {
      //     this.$router.push('/about')
      //   })
      //   .catch(action => {
      //     this.$message({
      //       type: 'info',
      //       message: action === 'cancel' ? '放弃保存并离开页面' : '停留在当前页面'
      //     })
      //   })
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.backFlag) {
      next()
      return
    }
    this.$confirm('此操作将直接离开设计界面，请确认新修改内容已保存。是否继续离开？', '确认信息', {
      confirmButtonText: '确定',
      distinguishCancelAndClose: true,
      customClass: 'width434',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        next()
      })
      .catch((e) => {

      })
  }
}
