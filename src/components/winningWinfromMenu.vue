<template>
  <div class="winning-winfrom-menu" v-if="isShow">
    <i class="icon-wining-min" @click="minClick"></i>
    <i class="icon-wining-max" @click="maxClick"></i>
    <i class="icon-wining-close" @click="closeClick"></i>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: "winning-winfrom-menu",
  data() {
    return {
      dialogVisible: false,
      isShow: true,
    };
  },
  props: {
    wnClose: {
      // 关闭事件
      type: Function,
      default: function (fun) {
        if (fun) {
          fun();
        }
      },
    },
    wnMin: {
      // 最小化
      type: Function,
      default: function (fun) {
        if (fun) {
          fun();
        }
      },
    },
    wnMax: {
      // 最大化
      type: Function,
      default: function (fun) {
        if (fun) {
          fun();
        }
      },
    },
    wnNoMax: {
      // 取消最大化
      type: Function,
      default: function (fun) {
        if (fun) {
          fun();
        }
      },
    },
    notCloseMsg: {
      //不需要关闭弹窗
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    //监听键盘按键事件
    let self = this;
    this.isShow = true;
    this.$nextTick(function () {
      document.addEventListener("keyup", function (e) {
        // 按 ESC 或者 F11 退出全屏
        if (e.keyCode == 27 || e.keyCode == 122) {
          self.closeScreenFull();
        }
      });
    });
  },
  methods: {
    close() {
    },
    min() {
    },
    max() {
      this.$message({
        type: 'info',
        dangerouslyUseHTMLString: true,
        showClose: false,
        duration: 5000,
        customClass: 'win-from-menu-message-info',
        center: true,
        offset: 4,
        message: '<div style="color: #fff;font-size: 16px;">点击键盘 <span style="margin: 0 10px;padding: 4px;border: 1px solid #FFFFFF;border-radius: 2px;">Esc</span> 或者 <span style="margin: 0 10px;padding: 4px;border: 1px solid #FFFFFF;border-radius: 2px;">F11</span> 即可退出全屏模式</div>'
      })
      this.isShow = false;
    },
    async minClick() {
      await this.wnMin();
      this.min();
    },
    async closeClick() {
      let that = this;
      if (this.notCloseMsg) {
        that.closeOKClick();
        return;
      }
      this.$confirm('您确定要退出系统吗？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          that.closeOKClick();
        })
        .catch(() => {});
    },
    async closeOKClick() {
      this.dialogVisible = false;
      await this.wnClose();
      this.close();
    },
    async maxClick() {
      await this.wnMax();
      this.max();
    },
    async closeScreenFull() {
      if (this.isShow) {
        return;
      }
      await this.wnNoMax();
      this.isShow = true;
    },
  },
};
</script>
<style lang="scss" >
.win-from-message {
  width: 400px;
  padding: 16px;
  .el-message-box__btns {
    padding-right: 0px;
    padding-top: 50px;
    button {
      width: 88px;
      height: 32px;
    }
  }
  .el-message-box__content {
    padding-right: 0px;
  }
  .el-message-box__header {
    display: none;
  }
  .el-message-box__status {
    top: 10px;
  }
  .el-icon-warning {
    color: #ecbe0f;
  }
}
.win-from-menu-message-info{
  min-width: 388px;
  width: 388px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  padding: 6px 16px;
  border-radius: 4px;
  box-sizing: border-box;
  .el-message__icon, .el-message__closeBtn{
    display: none;
  }
  .el-message__content{
    width: 100%;
    height: 28px;
    line-height: 28px;
    text-align: center;
    margin: 0;
    padding-right: 0;
  }
}
</style>
<style scoped lang="scss">
.winning-winfrom-menu {
  position: fixed;
  z-index: 998;
  padding-right: 10px;
  right: 0;
  top: 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  width: auto;
  height: 20px;
  line-height: 20px;
  i {
    display: inline-block;
    font-size: 16px;
    width: 20px;
    &:hover {
      cursor: pointer;
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
  .icon-wining-min {
    background: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTNweCIgaGVpZ2h0PSIzcHgiIHZpZXdCb3g9IjAgMCAxMyAzIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA2MCAoODgxMDMpIC0gaHR0cHM6Ly9za2V0Y2guY29tIC0tPgogICAgPHRpdGxlPuacgOWwjzwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJwcm90YWwtMDkxOSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICAgICAgICA8bGluZSB4MT0iMS41IiB5MT0iMS41IiB4Mj0iMTEuNzUiIHkyPSIxLjUiIGlkPSLmnIDlsI8iIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIxLjEiPjwvbGluZT4KICAgIDwvZz4KPC9zdmc+")
      no-repeat center center;
  }
  .icon-wining-close {
    background: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTBweCIgaGVpZ2h0PSIxMHB4IiB2aWV3Qm94PSIwIDAgMTAgMTAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDYwICg4ODEwMykgLSBodHRwczovL3NrZXRjaC5jb20gLS0+CiAgICA8dGl0bGU+5YWz6ZetPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGcgaWQ9InByb3RhbC0wOTE5IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPgogICAgICAgIDxwYXRoIGQ9Ik00Ljg2MDI4MTM3LDUgTDQuODYwMjgxMzcsLTEgTDQuODYwMjgxMzcsNSBMLTEuMTM5NzE4NjMsNSBMNC44NjAyODEzNyw1IFogTTQuODYwMjgxMzcsNSBMNC44NjAyODEzNywxMSBMNC44NjAyODEzNyw1IEwxMC44NjAyODE0LDUgTDQuODYwMjgxMzcsNSBaIiBpZD0i5YWz6ZetIiBzdHJva2U9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMS4xIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0Ljg2MDI4MSwgNS4wMDAwMDApIHJvdGF0ZSgtMzE1LjAwMDAwMCkgdHJhbnNsYXRlKC00Ljg2MDI4MSwgLTUuMDAwMDAwKSAiPjwvcGF0aD4KICAgIDwvZz4KPC9zdmc+")
      no-repeat center center;
  }
  .icon-wining-max {
    background: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTJweCIgaGVpZ2h0PSIxMnB4IiB2aWV3Qm94PSIwIDAgMTIgMTIiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDYyICg5MTM5MCkgLSBodHRwczovL3NrZXRjaC5jb20gLS0+CiAgICA8dGl0bGU+5pyA5aSn5YyWPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGcgaWQ9Iumhtemdoi0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iQS0wMi0wMDIt6Zeo6K+K5qGG5p62LeWFqOWxjy3lkKvns7vnu5/mk43kvZzlm77moIctLS3op4bop4nmoYbmnrYiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yNTEzLjAwMDAwMCwgLTQuMDAwMDAwKSIgc3Ryb2tlPSIjRkZGRkZGIj4KICAgICAgICAgICAgPGcgaWQ9Iue8lue7hC0yNyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjQ5Mi4wMDAwMDAsIDEuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0i5pyA5aSn5YyWIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMi4zNzUwMDAsIDQuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPHJlY3QgaWQ9IuefqeW9oiIgeD0iMCIgeT0iMi4wODMzMzMzMyIgd2lkdGg9IjcuNSIgaGVpZ2h0PSI3LjUiIHJ4PSIwLjYwNjA2MDYwNiI+PC9yZWN0PgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik03LjkxNjY2NjY3LDAgTDkuMzkzOTM5MzksMCBDOS43Mjg2NTc0MiwwIDEwLDAuMjcxMzQyNTc2IDEwLDAuNjA2MDYwNjA2IEwxMCw2Ljg5MzkzOTM5IEMxMCw3LjIyODY1NzQyIDkuNzI4NjU3NDIsNy41IDkuMzkzOTM5MzksNy41IEwzLjEwNjA2MDYxLDcuNSBDMi43NzEzNDI1OCw3LjUgMi41LDcuMjI4NjU3NDIgMi41LDYuODkzOTM5MzkgTDIuNSw0Ljk5ODQzNzUiIGlkPSLnn6nlvaLlpIfku70iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDYuMjUwMDAwLCAzLjc1MDAwMCkgcm90YXRlKC05MC4wMDAwMDApIHRyYW5zbGF0ZSgtNi4yNTAwMDAsIC0zLjc1MDAwMCkgIj48L3BhdGg+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==")
      no-repeat center center;
  }
}
</style>
