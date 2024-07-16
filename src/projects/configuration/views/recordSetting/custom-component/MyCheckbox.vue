<template>
  <div class="flex my-checkbox flex-start" :id="'mycheckbox'+element.id" :class="attr.labelLineFeed?'flex-ver':''">
    <div class="my-label" >{{ attr.label }}</div>
    <div>
    <el-checkbox-group v-if="attr.maxLength === 1" :max="+attr.maxLength" class="flex-1 my-checkbox-group" v-model="value" disabled>

      <template v-if="attr.option.list.length>0&&attr.option.list">
        <template v-for="item in attr.option.list">
          <template v-if="item.showLeftRight">
            &nbsp;{{ item.label }}(
            <el-checkbox :key="item.leftValue" :label="item.leftValue">左</el-checkbox>
            <el-checkbox :key="item.rightValue" class="cg-checkbox-right" :label="item.rightValue">右</el-checkbox>
            )&nbsp;
          </template>
          <el-checkbox v-else :key="item.value" :label="item.value" disabled>{{
            item.label
          }}</el-checkbox>
        </template>
      </template>
      <template v-else>
        <el-checkbox label="测试选项" :value="1"></el-checkbox>
      </template>
    </el-checkbox-group>

    <template v-else>
      <el-checkbox v-model="value" v-for="item in attr.option.list" :key="item.value" :label="item.value" disabled>{{ item.label }}</el-checkbox>
    </template>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      scale: 1,
      value: []
    }
  },
  computed: {
  },
  props: {
    bindValue: {},
    attr: {
      type: Object,
      default: () => ({})
    },
    propStyle: {
      type: Object
    },
    element: {
      type: Object,
      default: () => ({})
    }

  },
  watch: {
    bindValue: {
      handler() {
        this.value = this.bindValue
      },
      immediate: true
    },
    propStyle: function() {
      document.querySelector('#mycheckbox' + this.element.id).style.setProperty('--value-fontSize', this.propStyle.fontSize || '12px')
    }
  },
  mounted() {
    document.querySelector('#mycheckbox' + this.element.id).style.setProperty('--value-fontSize', this.propStyle.fontSize || '12px')
  }
}
</script>

<style lang="scss" scoped>

.my-checkbox {
  display:flex ;
  width:100%;
  font-size: var(--value-fontSize);

  .my-label{
    padding-right:10px;
  }
  .labelLineFeed{
    word-break:normal;
    width:auto;
    display:block;
    white-space:pre-wrap;
    word-wrap : break-word ;
    overflow: hidden ;
  }
  ::v-deep .my-checkbox-group {
    font-size: var(--value-fontSize);
    color: var(--value-color);
  }

}
::v-deep {
    .el-checkbox {
      //添加边框
      /* border: 1px solid rgb(207, 204, 204); */
      //选中时边框的颜色
      /* &.is-checked {
        border: 1px solid #28d4c1 !important;
      } */
      //鼠标滑过改变字体和小圆圈边框的样式
      &:hover {
        border-color: #666 !important;
        // color: #666 !important;
        //鼠标滑过时小圆点边框显示
        .el-checkbox__inner {
          border-color: #666;
        }
      }
      .el-checkbox__input {
        margin-bottom: px(5);
        //选中时的样式
        &.is-checked {
          .el-checkbox__inner {
            //选中时小圆圈的的颜色
            background:#fff;
            border-color: #666;
            &::after{
              box-sizing: content-box;
              content: "";
              border: 1px solid #000622;
              border-left: 0;
              border-top: 0;
              height: 7px;
              left: 4px;
              position: absolute;
              top: 1px;
              transform: rotate(
          45deg
          ) scaleY(1);
              width: 3px;
              transition: transform .15s ease-in .05s;
              transform-origin: center;
            }
          }
          + .el-checkbox__label {
            //选中时字体的颜色
            // color: #666 !important;
          }
        }
        &.is-disabled + .el-checkbox__label {
            //选中时字体的颜色
            color: #000;
          }
        .el-checkbox__inner {
          // 鼠标滑过小圆点时的样式
          &:hover {
            border-color: #666;
          }
        }
      }

    }
}
  ::v-deep .el-checkbox__label {
    color: var(--value-color);
    font-size: var(--value-fontSize);
    padding-left: 2px;

  }
</style>
