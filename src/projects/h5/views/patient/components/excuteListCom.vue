<template>
<!-- 平板端执行项目列表 -->
  <div class="select-list">
    <template v-for="item in options">
      <span class="select-item" :class="valueArr.includes(item.dictCode) ? 'primary' : 'info'"
        @click="handlerSelect(item.dictCode,item.dictName)" :key="item.dictCode" v-if="item.statusDict == '1'">{{ item.dictName
        }}</span>
    </template>
  </div>
</template>

<script>
import {
  moniitemRecord_save
} from '@/api/configuration'
export default {
  name: 'Selectcom',
  props: {
    value: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      default: () => []
    },
    recordTime: {
      type: String,
      default: ''
    },
    icuRecordId: {
      type: String,
      default: ''
    },
    moniTypeCode: {
      type: String,
      default: ''
    },
    monitypeName: {
      type: String,
      default: ''
    },
    recordId: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      valueArr: []
    }
  },
  watch: {
    value: function (newValue) {
      if (this.multiple) {
        this.valueArr = newValue.indexOf('[') > -1 ? JSON.parse(newValue) : []
      } else {
        this.valueArr = []
        this.valueArr.push(newValue)
      }
    }
  },
  mounted() {

  },
  methods: {
    handlerSelect(value, name) {
      if (this.valueArr.includes(value)) {
        // 取消执行项目
        moniitemRecord_save({
          moniitemCode: value,
          moniitemName: name,
          moniitemValue: '',
          monitypeCode: this.moniTypeCode,
          moniitemContent: '',
          moniitemAbbr: '',
          monitypeName: this.monitypeName,
          icuRecordId: this.icuRecordId,
          recordTime: this.recordTime,
          moniitemRecordId: this.recordId[value]
        }).then(res => {
          this.recordId[value] = ''
          this.valueArr = this.valueArr.filter(v => v != value)
        })
      } else {
        // 添加执行项目
        moniitemRecord_save({
          moniitemCode: value,
          moniitemName: name,
          moniitemValue: 1,
          monitypeCode: this.moniTypeCode,
          moniitemContent: '√',
          moniitemAbbr: '√',
          monitypeName: this.monitypeName,
          icuRecordId: this.icuRecordId,
          recordTime: this.recordTime
        }).then(res => {
          this.recordId[value] = res.data.moniitemRecordId
          this.valueArr.push(value)
        })
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.select-list {
  display: inline-block;
  text-align: left;
  padding-top: rem(5);
  padding-left: 0;
}

.select-item {
  padding: rem(5) rem(15);
  margin: 0 rem(8) rem(5) 0;
  width: fit-content;
  height: rem(32);
  line-height: rem(22);
  display: inline-block;
  box-sizing: border-box;

}

.primary {
  background: var(--maincolor);
  border: 1px solid var(--maincolor);
  color: #fff;
}

.info {
  border: 1px solid #ededed;
  background-color: #ededed;
}
</style>

