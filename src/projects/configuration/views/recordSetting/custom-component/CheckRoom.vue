<template>
  <el-popover
    placement="bottom"
    title="切换手术间"
    width="250"
    v-model="visible"
    trigger="click"
  >
    <el-form label-width="80px" :model="updateRoomForm">
      <el-form-item label="手术室:">
        <el-select
          v-model="updateRoomForm.operatingRoomId"
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="item in surgeryDepts"
            :key="item.operatingRoomId"
            :label="item.operatingRoomName"
            :value="item.operatingRoomId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="手术间" prop="operRoomId">
        <el-select v-model="updateRoomForm.operRoomId" filterable placeholder="请选择">
          <el-option
            v-for="item in allSurgeryRooms"
            :key="item.operRoomId"
            :label="item.name"
            :value="item.operRoomId"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="flex" style="justify-content: space-between">
      <el-button class="but-con" @click="visible = false">取消</el-button>
      <el-button
class="but-con"
@click="updateRoom"
type="primary"
        >确定</el-button
      >
    </div>
    <span slot="reference" style="color: #3f6df1; cursor: pointer;font-size:12px">切换</span>
  </el-popover>
</template>
<script>
export default {
  data() {
    return {
      visible: false,
      surgeryDepts: [],
      allSurgeryRooms: [],
      updateRoomForm: {
        operRoomId: '',
        operatingRoomId: ''
      }
    }
  },
  methods: {
    updateRoom() {

    }
  }
}
</script>
<style scoped>
</style>
