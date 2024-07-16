<template>
  <div class="flex">
    <span class="my-label">{{attr.label}}</span>
    <span>上:</span>
    <div class="value flex-1">
      <el-select clearable @change="anaesPlane=''" v-model="anaesPlaneUp" placeholder="请选择">
        <el-option label="上" value="1"></el-option>
      </el-select>
    </div>
    <span>下:</span>
    <div class="value flex-1">
      <el-select clearable  @change="anaesPlane=''" v-model="anaesPlaneDown" placeholder="请选择">
        <el-option label="下" :value="1"></el-option>
      </el-select>
    </div>
    <el-checkbox v-model="anaesPlane" @change="anaesPlaneDown='';anaesPlaneUp=''" true-label="1" false-label="''">无</el-checkbox>
  </div>
</template>
<script>
export default {
  data() {
    return {
      anaesPlane: '',
      anaesPlaneDown: '',
      anaesPlaneUp: ''
    }
  },
  props: {
    attr: {
      type: Object,
      default: () => ({})
    },
    propStyle: {}
  }
}
</script>
<style lang="sass" scoped>

</style>
