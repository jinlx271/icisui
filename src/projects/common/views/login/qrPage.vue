<template>
  <div style="height:550px;margin-top: 20px">
    <iframe :id="'frameId'" :name="'frameId'" :src="oauthWindowURL" scrolling="no" frameborder="0" width="100%" height="100%" @load="loaded"></iframe>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  ca_getOauthStatus,
  ca_getAccesstoken,
  ca_oauth
} from '@/api/login'
export default {
  components: {
  },
  name: 'Login',
  computed: {
    ...mapGetters(['indexUrl', 'userWardList', 'systemInfo'])
  },
  visible: {
    type: Boolean,
    default: false
  },
  data() {
    return {
      timeer: '',
      oauthWindowURL: '',
      transactionId: ''
    }
  },
  mounted() {
    this.$store.dispatch('LogOut')
  },
  created: async function () {
    // 初始化
    const token = await ca_getAccesstoken()
    const src = await ca_oauth({ accessToken: token?.data?.accessToken, oauthMethod: '3' })
    const { oauthWindowURL, transactionId } = src.data// oauthMPCode,
    this.oauthWindowURL = oauthWindowURL
    if (process.env.NODE_ENV == 'development') {
      this.oauthWindowURL = this.oauthWindowURL.replace('http://172.17.1.154:8091', 'https://yxq-bqe.linksign.cn')
    }
    this.transactionId = transactionId
    window.addEventListener('message', this.messageCallBack)
  },
  methods: {
    messageCallBack(event, a) {
    },
    loaded() {
      const _this = this
      function checkStatus(params) {
        if (_this.timeer) {
          clearTimeout(_this.timeer)
        }
        _this.timeer = setTimeout(async function (params) {
          const token = await ca_getAccesstoken()
          const result = await ca_getOauthStatus({ accessToken: token?.data?.accessToken, transactionId: _this.transactionId })
          if (result?.data?.oauthStatus == 1) {
            _this.$emit('update:visible', false)
          } else {
            checkStatus()
          }
        }, 3000)
      }
      checkStatus()
    }
  },
  beforeDestroy() {
    this.$emit('transactionId', this.transactionId)
    clearTimeout(this.timeer)
    window.removeEventListener('message', this.messageCallBack)
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
