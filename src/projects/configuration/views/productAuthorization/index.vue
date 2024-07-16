<template>
  <div class="productAuthor">
    <el-tabs v-model="activeName" class="w100">
      <el-tab-pane label="第一步：生成申请码" name="create">
        <div>
          <!-- 第一行 -->
          <div class="flex align-items-center ">
            <div class="w280 flex"><span class="title">医院名称</span><span class="flex1">{{systemInfo.name}}</span></div>
            <div class="name flex-1 flex align-items-center">
              <span class="title">病区名称</span>
              <el-select filterable v-model="selectWardList" clearable multiple placeholder="请选择" class="wardList" @change="changeWard">
                <el-option v-for="ward in wardList" :key="ward.wardCode" :label="ward.wardName" :value="ward.wardCode"></el-option>
              </el-select>
            </div>
          </div>
          <!-- 第二行  床位列表-->
          <div class="flex align-items-top h480 m-b10" :style="{maxHeight: pageHeight+'px',height:'fit-content'}">
            <div class="w80"><span class="title">选择床位</span></div>
            <div class="block flex-1 ">
              <el-checkbox size="small" clearable v-model="isAll" @change="selectAll"  :indeterminate="indeterminate" >全选</el-checkbox>
              <div class="bedContent">
                <div v-for=" wardInfo in bedList" :key="wardInfo.wardCode" class="block pl-5">
                  <el-checkbox size="small" clearable v-model="wardInfo.isAll" :indeterminate="wardInfo.indeterminate" class="pl-14" @change="changeWardCheckbox($event,wardInfo.wardCode)">{{wardInfo.wardName}}</el-checkbox>
                  <div class="pl-28">
                    <el-checkbox-group v-model="wardInfo.selectBedList" @change="changeBed($event,wardInfo.wardCode)">
                      <el-checkbox :label="bedInfo.bedNo" v-for="bedInfo in wardInfo.bedList" :key="bedInfo.bedNo" >{{bedInfo.bedNo}}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 第三行 生成-->
          <div class="flex  r_c_center w100  m-b10 ">
            <el-button type="primary" @click="createCode">生成</el-button>
          </div>
          <!-- 第四行  床位列表-->
          <div class="flex align-items-top  ">
            <div class="w80"><span class="title">申请码</span></div>
            <div class="code">
             {{ code }}
            </div>
          </div>
          <div class="tips r_c_center m-b10 w100 flex">
              提示：请在系统配置完成后，将申请码复制发送给产品授权管理员以获取授权码。
          </div>
          <div class="flex  r_c_center w100">
            <el-button class="codeButton " type="primary" @click="copyCode" id="copyCode">复制申请码</el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="第二步：提交授权码" name="submit">
        <div class="flex align-items-top  authorCode">
          <div class="w80"><span class="title">授权码</span></div>
          <el-input v-model="authorCode"  class="code" type="textarea"></el-input>
        </div>
        <div class="flex  r_c_center w100">
          <el-button class="codeButton" type="primary" @click="submit">保存</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>

</template>
<script>
import {
  icuWard_findWithPage,
  bed_getIcuWardBedList,
  grant_getApplyCode,
  grant_confirm
} from '@/api/configuration'
import { orderBy } from 'lodash'
import { mapGetters } from 'vuex'
import Clipboard from 'clipboard'
export default {
  name: 'ProductAuthorization',
  data() {
    return {
      activeName: 'create',
      wardList: [],
      bedList: [],
      selectWardList: [], // 选中的病区code
      code: '',
      isAll: false,
      indeterminate: false,
      bedTotalCount: 0, // 选中病区的床位总数
      authorCode: '',
      pageHeight: 0
    }
  },
  async created() {
    this.wardList = await this.getWardListFc()
    this.selectWardList.push(this.currentUserWard.wardCode)
    this.changeWard()
  },
  mounted() {
    this.pageHeight = document.body.clientHeight - 410
    window.onresize = function() {
      this.pageHeight = document.body.clientHeight - 410
    }
  },
  computed: {
    ...mapGetters(['currentUserWard', 'systemInfo'])

  },
  methods: {
    /**
     * 获取病区列表
     */
    // 获取病区集合
    getWardListFc() {
      return new Promise((resolve, reject) => {
        icuWard_findWithPage({
          pageNum: 1,
          pageSize: 2000
        }).then(res => {
          // 5701 配置引导区
          resolve(res.data.result.filter(item => item.wardCode != 'W00000000'))
        })
      })
    },
    /**
     * 病区code发生改变
     */
    changeWard() {
      if (this.selectWardList.length == 0) {
        this.bedList = []
        this.isAll = false
        this.indeterminate = false
        return
      }
      bed_getIcuWardBedList(this.selectWardList).then(res => {
        this.bedTotalCount = 0
        const oribedList = JSON.parse(JSON.stringify(this.bedList))
        this.bedList = res.data.filter(ward => ward.bedList.length > 0).map(ward => {
          this.bedTotalCount += ward.bedList.length
          const oriwardInfo = oribedList.find(oriWard => oriWard.wardCode == ward.wardCode)
          if (oriwardInfo) return oriwardInfo
          else {
            ward.selectBedList = []
            ward.isAll = false
            ward.indeterminate = false
            ward.wardBedTotalCount = ward.bedList.length
            ward.bedList = orderBy(ward.bedList, 'sortNo')
            return ward
          }
        })
        this.validateIsAll()
      })
    },
    /**
     * 第床位数据进行全选
     */
    selectAll(e) {
      if (e) { // 全选
        this.indeterminate = false
        this.bedList.forEach(wardInfo => {
          wardInfo.isAll = true
          wardInfo.indeterminate = false

          wardInfo.selectBedList = wardInfo.bedList.map(item => item.bedNo)
        })
      } else {
        this.indeterminate = false
        this.bedList.forEach(wardInfo => {
          wardInfo.isAll = false
          wardInfo.indeterminate = false
          wardInfo.selectBedList = []
        })
      }
      this.validateIsAll()
    },
    /**
     * 病区全选按钮
     * @param {*} e
     * @param {*} wardCode
     */
    changeWardCheckbox(e, wardCode) {
      const currWardInfo = this.bedList.find(wardInfo => wardInfo.wardCode == wardCode)
      if (e) {
        currWardInfo.isAll = true
        currWardInfo.indeterminate = false
        currWardInfo.selectBedList = currWardInfo.bedList.map(item => item.bedNo)
      } else {
        currWardInfo.isAll = false
        currWardInfo.indeterminate = false
        currWardInfo.selectBedList = []
      }
      this.validateIsAll()
    },
    /**
     * 单个床位checkbox 操作逻辑
     * @param {*} e
     * @param {*} wardCode
     */
    changeBed(e, wardCode) {
      const currWardInfo = this.bedList.find(wardInfo => wardInfo.wardCode == wardCode)
      if (currWardInfo.selectBedList.length == currWardInfo.wardBedTotalCount) { // 全选
        currWardInfo.isAll = true
        currWardInfo.indeterminate = false
      } else if (currWardInfo.selectBedList.length == 0) { // 清空
        currWardInfo.isAll = false
        currWardInfo.indeterminate = false
      } else { // 选择部分
        currWardInfo.isAll = false
        currWardInfo.indeterminate = true
      }
      this.validateIsAll()
    },
    /**
     * 判断是否全选 全局的
     */
    validateIsAll() {
      let selctBedCount = 0
      this.bedList.forEach(item => {
        selctBedCount += item.selectBedList.length
      })
      if (selctBedCount == this.bedTotalCount) {
        this.isAll = true
        this.indeterminate = false
      } else if (selctBedCount == 0) {
        this.isAll = false
        this.indeterminate = false
      } else {
        this.isAll = false
        this.indeterminate = true
      }
    },
    /**
     * 生成申请码
     */
    createCode() {
      const selectBedList = []
      this.bedList?.forEach(wardInfo => {
        if (wardInfo.selectBedList.length > 0) {
            selectBedList.push({
            wardCode: wardInfo.wardCode,
            bedNos: wardInfo.selectBedList.join(',')
            })
        }
      })
      if (selectBedList.length == 0) {
        this.$message.warning('请选择床位')
        return
      }
      grant_getApplyCode({
        'hospitalName': this.systemInfo.name,
        'wardList': selectBedList
      }).then(res => {
        this.code = res.data
      })
    },
    /**
     * 复制申请码
     */
    copyCode() {
      const clipboard = new Clipboard('#copyCode', {
        text: () => {
          return this.code
        }
      })
      clipboard.on('success', () => {
        this.$message.success('复制成功！')
        clipboard.destroy()
      })
      clipboard.on('error', () => {
        this.$message.error('该浏览器不支持自动复制,请手动复制！')
        clipboard.destroy()
      })
    },
    /**
     * 提交授权码
     */
    submit() {
      grant_confirm(this.authorCode).then(res => {
        if (res.code == 0) {
          this.$message.success('授权成功，请刷新床位列表')
        }
      })
    }

  }
}
</script>
<style lang="scss" scoped>
.productAuthor{
  background: #ffffff;
  height: 100%;
  width:100%;
  display: flex;
  position: relative;
  padding :10px;
  font-size:14px;
  .w280{
    width:280px;
  }
  .w80{
    width:80px;
  }
  .wardList{
    width:calc(100% - 75px);
  }
  .h480{
    overflow: hidden;
    ::v-deep .el-checkbox{
      margin-bottom:5px;
    }
    .bedContent{
      height: calc(100% - 16px);
      overflow-y: auto;
      .pl-14{
        padding-left:14px;
      }
      .pl-28{
        padding-left:28px;
        ::v-deep .el-checkbox{
          width:8%;
        }
      }
    }
  }
  .title{
    width:80px;
    font-weight: 600;
  }
  .code{
    width:100%;
    height:120px;
    overflow-y: auto;
    background:var(--maincolor5);
    border:1.5px solid #ddd;
    border-radius: 5px;
    margin-bottom:20px;
    color:#999;
    word-break:break-all;
  }
  .authorCode{
    ::v-deep textarea{
      height:100%;
    }
  }

  .tips{
    color:#E6A23C;
    font-size:12px;
  }
  .codeButton{
    width:20%;

  }

}
</style>
