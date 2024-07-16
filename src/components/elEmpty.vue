
<script>
import ElEmpty from 'element-ui/lib/empty'
export default {
  extends: ElEmpty,
  name: 'ElEmpty',
  props: {
    image: {
      type: String,
      default: require('../assets/empty.png')
    }
  }
}
</script>
<style scoped lang="scss">
.el-empty{
  height: 100%;
}
</style>
