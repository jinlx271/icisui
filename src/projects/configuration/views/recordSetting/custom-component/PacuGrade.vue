<template>
  <div class="pacu-grade border-bottom">
    <div class="quota-name border-bottom" style="padding: 4px 5px">
      {{ attr.label }}：0【{{ attr.label }}大于{{attr.minGrade}}分才能出复苏室】
    </div>
    <div class="flex">
      <div class="">
        <div class=" foot-left foot-left-name border-bottom">苏醒指标</div>
        <div class=" foot-left foot-left-name">出室评分</div>
      </div>
      <div
        class="border-left flex-1"
        v-for="item in attr.quota"
        :key="item.value"
      >
        <div class="text-center border-bottom quota-name">{{ item.name }}</div>
        <div class="" style="padding:5px">
          <el-radio-group
            class="flex flex-ver grade-container"
            v-model="item.value"
          >
            <el-radio
              v-for="gradeItem in item.options"
              :value="gradeItem.grade"
              :label="gradeItem.grade"
              :key="gradeItem.grade"
              >{{ gradeItem.label }}</el-radio
            >
          </el-radio-group>
        </div>
      </div>
    </div>
    <!-- <div class="flex w100 foot-table border-bottom">
      <div class="foot-left text-center">苏醒指标</div>
      <div class="flex-1 border-left text-center">肢体活动度</div>
      <div class="flex-1 border-left text-center">呼吸道通畅度</div>
      <div class="flex-1 border-left text-center">清醒程度</div>
    </div>
    <div class="flex w100 foot-table border-bottom">
      <div class="foot-left text-center">出室评分</div>
      <div class="flex-1 border-left flex flex-ver text-center">
        <el-radio-group
          class="flex flex-ver grade-container"
          :disabled="readonly"
          v-model="anaesPacuRec.awakeGrade"
        >
          <el-radio :value="2" :label="2">肢体能做有意识的活动2分</el-radio>
          <el-radio :value="1" :label="1">肢体无意识的活动1分</el-radio>
          <el-radio :value="0" :label="0">肢体无活动0分</el-radio>
        </el-radio-group>
      </div>
      <div class="flex-1 border-left text-center">
        <el-radio-group
          class="flex flex-ver grade-container"
          :disabled="readonly"
          v-model="anaesPacuRec.airwayPatencyGrade"
        >
          <el-radio :value="2" :label="2">可按医师吩咐咳嗽2分</el-radio>
          <el-radio :value="1" :label="1"
            >不用支持可以维持呼吸道通畅1分</el-radio
          >
          <el-radio :value="0" :label="0">呼吸道需要予以支持0分</el-radio>
        </el-radio-group>
      </div>
      <div class="flex-1 border-left text-center">
        <el-radio-group
          class="flex flex-ver grade-container"
          :disabled="readonly"
          v-model="anaesPacuRec.physicalActivityGrade"
        >
          <el-radio :value="2" :label="2">完全清醒2分</el-radio>
          <el-radio :value="1" :label="1">对刺激有反应1分</el-radio>
          <el-radio :value="0" :label="0">对刺激无反应0分</el-radio>
        </el-radio-group>
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    attr: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style lang="scss" scoped>
  .pacu-grade{
    *{
      font-size: 12px;
    }
    .foot-left{
      padding: 0 5px;
    }
    .foot-left-name,.quota-name{
      color:var(--label-color);
    }
    ::v-deep .el-radio__label{
       color:var(--value-color);
    }
     ::v-deep .el-radio__inner {
      display: inline-block;
      position: relative;
      border: 1px solid #dcdfe6;
      border-radius: 2px;
      box-sizing: border-box;
      width: 14px;
      height: 14px;
      background-color: #fff;
      z-index: 1;
      transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46);
    }
    ::v-deep .el-radio__input.is-checked .el-radio__inner {
      background-color: #409eff;
      border-color: #409eff;
  }
    ::v-deep .el-radio__input.is-checked .el-radio__inner:after {
      transform: rotate(45deg) scaleY(1);
    }
    ::v-deep .el-radio__inner:after {
        box-sizing: content-box;
        content: "";
        border: 1px solid #fff;
        border-left: 0;
        border-top: 0;
        border-radius: 0;
        height: 7px;
        left: 4px;
        position: absolute;
        top: 1px;
        transform: rotate(45deg) scaleY(0);
        width: 3px;
        transition: transform .15s ease-in .05s;
        transform-origin: center;
        background-color: #409eff;
    }
  }
</style>
