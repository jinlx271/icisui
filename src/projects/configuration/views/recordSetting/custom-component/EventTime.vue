<template>
  <div class="event-time" :style="{'flex-direction':attr.direction}">
    <div class="event-time__item" v-for="item in operaTimes" :key="item.label"
    :style="{'width':attr.direction==='column'?'20%':'100%','flex-direction':attr.direction}">
      {{item.label}}:
      <span v-if="!attr.canEdit" style="padding-left:15px"></span>
      <wn-time-picker
        v-else
        v-model="item.time"
        placeholder="请选择时间"
        prefix-icon
        format="MM-dd HH:mm"
        class="time-select "
        :clearable="false"
        :readonly="!attr.canEdit"
        :class="{'flex-1':attr.direction==='column'}"
      ></wn-time-picker>
    </div>
    <template v-if="docType==1">
      <div class="event-time__item" :style="{'width':attr.direction==='column'?'20%':'100%'}">
        手术时长:
        <span :style="{'padding-left':attr.direction==='row'?'15px':'0'}" :class="{'total-time':attr.direction==='row'}">{{totalOperTime}}</span>
      </div>
      <div class="event-time__item" :style="{'width':attr.direction==='column'?'20%':'100%'}">
        麻醉时长:
        <span :style="{'padding-left':attr.direction==='row'?'15px':'0'}"  :class="{'total-time':attr.direction==='row'}">{{totalAnaesTime}}</span>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  data() {
    return {
      totalOperTime: '',
      totalAnaesTime: '',
      operaTimes: [{
        label: '入手术间',
        time: ''
      }, {
        label: '出手术间',
        time: ''
      }, {
        label: '麻醉开始',
        time: ''
      }, {
        label: '麻醉结束',
        time: ''
      }, {
        label: '插管',
        time: ''
      }, {
        label: '拔管',
        time: ''
      }, {
        label: '手术开始',
        time: ''
      }, {
        label: '手术结束',
        time: ''
      }
      ]
    }
  },
  props: {
    attr: {
      type: Object,
      default: () => ({})
    },
    propStyle: {
      type: Object,
      default: () => ({})
    },
    docType: {
      default: 1
    }
  },
  watch: {
    docType: {
      handler() {
        if (this.docType == 2) {
          this.operaTimes = [{
            label: '入复苏室',
            time: ''
          }, {
            label: '出复苏室',
            time: ''
          }]
        }
      },
      immediate: true
    },
    'attr.direction': {
      handler() {
        if (this.attr.direction === 'row' && this.docType == 1) {
          this.operaTimes = [{
            label: '入手术间',
            time: ''
          }, {
            label: '麻醉开始',
            time: ''
          }, {
            label: '插管',
            time: ''
          }, {
            label: '手术开始',
            time: ''
          }, {
            label: '手术结束',
            time: ''
          }, {
            label: '拔管',
            time: ''
          }, {
            label: '麻醉结束',
            time: ''
          }, {
            label: '出手术间',
            time: ''
          }
          ]
        }
      },
      immediate: true
    }
  }
}
</script>
<style lang="scss" scoped>
  .event-time{
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    flex-direction: column;
    padding: 3px 10px;
    .event-time__item{
      display:flex;
      flex-wrap: wrap;
      font-size: 12px;
    }
  }
  .time-select {
    width: 100%;
    max-width: 120px;
    margin: 0;
    border-bottom: 1px solid var(--label-color);

    ::v-deep .el-input__inner {
      border: none;
      padding: 0;
      height: 13px;
      line-height: 13px;
    }

    ::v-deep .el-input__prefix {
      display: none;
    }
  }
  .total-time{
    display: block;
    width:100%;
    height:13px;
    line-height: 13px;
    border-bottom:1px solid var(--label-color);
  }

</style>
