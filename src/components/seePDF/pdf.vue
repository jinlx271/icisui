<template>
  <div id="pdf" class="pdf">
    <el-drawer title="帮助" :visible.sync="drawer" :direction="direction" :before-close="handleClose" size="50%">
      <!-- <iframe :src="`/static/PDF/web/viewer.html?file=${url}`"></iframe> -->
      <iframe :src="docHref"></iframe>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'Pdf',
  components: {},
  data: function() {
    return {
      drawer: true,
      direction: 'rtl',
      docHref: `${(process.env.NODE_ENV === 'production' ? globalConfig.PRO_BASE_API || './' : globalConfig.BASE_API)}重症系统操作手册标准版.pdf`
    }
  },
  props: {
    url: {
      type: String,
      default() {
        return ''
      }
    }
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {},
  methods: {
    handleClose(done) {
      done()
      this.$emit('showSeepdfFC')
    }
  }
}
</script>
<style lang="scss" scoped>
.pdf {
  iframe {
    width: 100%;
    height: 100%;
  }
}
</style>
