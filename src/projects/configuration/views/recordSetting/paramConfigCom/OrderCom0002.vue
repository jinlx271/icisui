<!-- 基础参数 0112 标准流式表 -->
<template>
  <div class="config flex">
    <div class="flex flex-between ">
      <el-form-item label="参数值" prop="paramInfo">
      </el-form-item>
    </div>
    <div class="configContent">
      <el-form ref="form" :model="paramInfo" label-width="8em"  label-position="left">
        <el-form-item label="医嘱明细前缀"  class="line30" prop="prefix" >
          <!-- <el-input placeholder="请输入" v-model="paramFormat.prefix" ></el-input> -->
          <Editor  id="prefix"  :init="init" ref="tinymceEdit" :value="paramFormat.prefix"   class="editor" disabled></Editor>
          <div class="flex padding-content">
            <el-button type="primary" plain @click="replceInfo('prefix','prefix_1')">计划时间</el-button>
            <el-button type="primary" plain @click="replceInfo('prefix','prefix_2')">执行时间</el-button>
          </div>
        </el-form-item>
        <el-form-item label="医嘱明细内容" class="line30" prop="dtlText" >
          <!-- <el-input placeholder="请输入" v-model="paramFormat.dtlText" ></el-input> -->
          <Editor  id="dtlText"  :init="init" ref="tinymceEdit" :value="paramFormat.dtlText"   class="editor"></Editor>
          <div class="flex padding-content" style="gap: 5px;flex-wrap: wrap;">
            <el-button type="primary" plain @click="addInfo('dtlText','dtlText_1')">药品名称</el-button>
            <el-button type="primary" plain @click="addInfo('dtlText','dtlText_2')">药品缩写</el-button>
            <el-button type="primary" plain @click="addInfo('dtlText','dtlText_3')">药品规格</el-button>
            <el-button type="primary" plain @click="addInfo('dtlText','dtlText_4')">剂量</el-button>
            <el-button type="primary" plain @click="addInfo('dtlText','dtlText_5')">剂量单位</el-button>
            <el-button type="primary" plain @click="addInfo('dtlText','dtlText_6')">嘱托</el-button>
          </div>
        </el-form-item>
        <el-form-item label="医嘱明细接拼符"  class="line30" prop="dtlConcat">
          <el-input placeholder="请输入" v-model="paramInfo.dtlConcat"  type="textarea" autosize></el-input>
        </el-form-item>
        <el-form-item label="医嘱明细后缀" class="line30" prop="suffix">
          <!-- <el-input placeholder="请输入" v-model="paramFormat.suffix" ></el-input> -->
          <Editor  id="suffix"  :init="init" ref="tinymceEdit" :value="paramFormat.suffix"  class="editor" ></Editor>
          <div class="flex padding-content" style="gap: 5px;flex-wrap: wrap;">
            <el-button type="primary" plain @click="addInfo('suffix','suffix_1')">医嘱用法</el-button>
            <el-button type="primary" plain @click="addInfo('suffix','suffix_2')">医嘱频次</el-button>
            <el-button type="primary" plain @click="addInfo('suffix','suffix_3')">拼接嘱托</el-button>
            <el-button type="primary" plain @click="addInfo('suffix','suffix_4')">总待入量+单位 </el-button>
            <el-button type="primary" plain @click="addInfo('suffix','suffix_5')">实际入量+单位</el-button>
            <el-button type="primary" plain @click="addInfo('suffix','suffix_6')">录入流速+单位</el-button>
            <el-button type="primary" plain @click="addInfo('suffix','suffix_7')">实际流速</el-button>
            <el-button type="primary" plain @click="addInfo('suffix','suffix_8')">管路名称</el-button>
            <el-button type="primary" plain @click="addInfo('suffix','suffix_9')">配药数量</el-button>
            <el-button type="primary" plain @click="addInfo('suffix','suffix_10')">完成时间</el-button>
            <el-button type="primary" plain @click="addInfo('suffix','suffix_11')">执行操作人</el-button>
            <el-button type="primary" plain @click="addInfo('suffix','suffix_12')">审核人</el-button>
            <el-button type="primary" plain @click="addInfo('suffix','suffix_13')">医嘱缩写</el-button>
          </div>
        </el-form-item>
        <el-form-item label="时间格式"  class="line30" prop="format">
          <!-- <el-input v-model="paramFormat.format" placeholder="请输入"  class="m-r10" :clearable="false" ></el-input> -->
          <Editor  id="format"  :init="init" ref="tinymceEdit" :value="paramFormat.format"   class="editor" disabled></Editor>
          <div class="flex padding-content" style="gap: 5px;flex-wrap: wrap;">
            <el-button type="primary" plain @click="replceInfo('format','format_1')">YYYY-MM-DD HH:mm:ss</el-button>
            <el-button type="primary" plain @click="replceInfo('format','format_2')">YYYY-MM-DD HH:mm</el-button>
            <el-button type="primary" plain @click="replceInfo('format','format_3')">MM-DD HH:mm:ss</el-button>
            <el-button type="primary" plain @click="replceInfo('format','format_4')">MM-DD HH:mm</el-button>
            <el-button type="primary" plain @click="replceInfo('format','format_5')">HH:mm:ss</el-button>
            <el-button type="primary" plain @click="replceInfo('format','format_6')">HH:mm</el-button>
          </div>
        </el-form-item>
        <el-form-item v-show="false" label="sql" >
          <el-input type="textarea" v-model="paramInfo.trendSql"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import tinymce from 'tinymce/tinymce' // tinymce默认hidden，不引入不显示
import Editor from '@tinymce/tinymce-vue'// 编辑器引入
export default {
  name: 'Order0002',
  components: {
    Editor
  },
  data: function () {
    return {
      init: {
        auto_fouse: true,
        language_url: '../../../static/tinymce/langs/zh_CN.js', // 汉化路径是自定义的，一般放在public或static里面
        language: 'zh_CN',
        skin_url: '../../../static/tinymce/skins/ui/oxide',
        content_css: ['../../../static/tinymce/css/common.css', '../../../static/tinymce/skins/content/default/content.css'],
        // plugins: this.plugins, // 插件
        // 工具栏
        menubar: false, // 隐藏菜单栏
        plugins: ' ',
        toolbar: ' ',
        placeholder: '在这里输入文字',
        branding: false, // 隐藏右下角技术支持
        save_enablewhendirty: false,
        height: 50,
        resize: false,
        setup: function (editor) {
          // editor.on('keydown', function (e) {
          //   // 禁止输入小于号和大于号
          //   if (e.keyCode == 229) {
          //     e.preventDefault()
          //   }
          // })
        }
      },
     // 隐私信息加密
      paramInfo: {
        prefix: '',
        dtlText: [],
        dtlConcat: '',
        suffix: [],
        format: '',
        trendSql: ''
      },
      paramFormat: {
        prefix: '',
        dtlText: '',
        dtlConcat: '',
        suffix: '',
        format: '',
        trendSql: ''
      },
      obj: {
        prefix_1: '[计划时间]',
        prefix_2: '[执行时间]',
        dtlText_1: '[药品名称]',
        dtlText_2: '[药品缩写]',
        dtlText_3: '[药品规格]',
        dtlText_4: '[剂量]',
        dtlText_5: '[剂量单位]',
        dtlText_6: '[嘱托]',
        suffix_1: '[医嘱用法]',
        suffix_2: '[医嘱频次]',
        suffix_3: '[拼接嘱托]',
        suffix_4: '[总待入量+单位]',
        suffix_5: '[实际入量+单位]',
        suffix_6: '[录入流速+单位]',
        suffix_7: '[实际流速]',
        suffix_8: '[管路名称]',
        suffix_9: '[配药数量]',
        suffix_10: '[完成时间]',
        suffix_11: '[执行操作人]',
        suffix_12: '[审核人]',
        suffix_13: '[医嘱缩写]',
        format_1: 'YYYY-MM-DD HH:mm:ss',
        format_2: 'YYYY-MM-DD HH:mm',
        format_3: 'MM-DD HH:mm:ss',
        format_4: 'MM-DD HH:mm',
        format_5: 'HH:mm:ss',
        format_6: 'HH:mm'

      },
      timeList: [{ time: '' }]

    }
  },
  props: {
    paramValue: {}
  },
  watch: {
    string: {
      handler: function (n) {
        try {
          const paramInfo = n
          if (n != '' && n) {
            for (const key in paramInfo) {
              const keyList = Object.keys(this.obj)
              if (key == 'dtlText' || key == 'suffix') {
                if (paramInfo[key].length > 0) {
                  const nameArr = []
                  paramInfo[key].forEach(item => {
                    if (keyList.includes(item)) {
                      nameArr.push('<span contenteditable=false data-wn-type="label" data-wn-value="' + item + '">' + this.obj[item] + '</span>')
                    } else {
                      nameArr.push(item)
                    }
                  })
                  this.paramFormat[key] = nameArr.join('')
                }
              } else {
                this.paramFormat[key] = '<span contenteditable=false data-wn-type="label" data-wn-value="' + paramInfo[key] + '">' + this.obj[paramInfo[key]] + '</span>'
              }
            }
            this.paramInfo = paramInfo
          }
        } catch (error) {
          // this.timeList = [{ time: '08' }]
          console.log('error', error)
        }
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    string() {
      return JSON.parse(this.paramValue)
    }
  },
  created: function () {
    console.log('this.paramValue', this.paramValue)
  },
  destroyed() {
  },
  mounted() { },
  methods: {
    replceInfo(key, value) {
      this.paramInfo[key] = value
      this.paramFormat[key] = '<span contenteditable=false data-wn-type="label" data-wn-value="' + value + '">' + this.obj[value] + '</span>'
    },
    addInfo(key, value) {
      let placeholderHtml = ''
      placeholderHtml = '<span contenteditable=false data-wn-type="label" data-wn-value="' + value + '">' + this.obj[value] + '</span>'
      tinymce.editors[key].insertContent(placeholderHtml)
    },
    /**
     * 数据变更 保存数据
     */
    change() {
      return new Promise((resolve, reject) => {
        // const str = ''
        // 将数据转为列表
        this.paramInfo.dtlText = this.domToArr(tinymce.editors['dtlText'].getBody().childNodes)
        this.paramInfo.suffix = this.domToArr(tinymce.editors['suffix'].getBody().childNodes)
        this.$emit('update:paramValue', JSON.stringify(this.paramInfo))
        resolve()
      })
    },
    domToArr(domList) {
      let arr = []
      domList.forEach(item => {
        if (item.childNodes.length > 0 && item.nodeName != 'SPAN' && !item.getAttribute('data-wn-type') && item.nodeName != '#text') {
          arr = arr.concat(this.domToArr(item.childNodes))
        } else {
          if (item.nodeName == 'SPAN' && item.getAttribute('data-wn-type')) {
            arr.push(item.getAttribute('data-wn-value'))
          } else if (item.nodeName == '#text') {
            arr.push(item?.nodeValue.replaceAll(String.fromCharCode(160), ' ') || '')
          }
        }
      })
      console.log('arr', arr)
      return arr
    }
  }
}
</script>
<style lang="scss" scoped>
.config {
  height: fit-content;
  margin-bottom:20px;

}
.configContent{

  ::v-deep .tox .tox-statusbar {
    display: none;
  }

  width: 100%;
  padding:5px 10px;
  max-height: 400px;
  // background:var(--maincolor4);
  background:#f3f5f9;
  height:fit-content;
  overflow-y: auto;
  .longSpan{
    width:200px;
  }
  .longLine{

  }
  .line30{
    .el-form-item--small .el-form-item__content {
      line-height: 30px;;
    }
  }
  .shortInput{
    .el-button{
      width: 130px;
    }
    .linkStatus{
      width: 130px;
    }
    .m-l10{
      margin-left: 10px;
    }
    ::v-deep .el-input{
      flex:1;
    }
  }
}
.popup-result {
  box-sizing: border-box;
  line-height: 24px;
  margin: 25px auto;
  padding: 15px 10px 10px;
  border: 1px solid #ccc;
  position: relative;
}
.popup-result .title {
  position: absolute;
  top: -28px;
  left: 50%;
  width: 140px;
  font-size: 14px;
  margin-left: -70px;
  text-align: center;
  line-height: 30px;
  background: #f3f5f9;
}
.popup-result table {
  text-align: center;
  width: 100%;
  margin: 0 auto;
}
.popup-result table span {
  display: block;
  width: 100%;
  font-family: arial;
  line-height: 30px;
  height: 30px;
  white-space: nowrap;
  overflow: hidden;
  border: 1px solid #e8e8e8;
}
.popup-result-scroll {
  font-size: 12px;
  line-height: 24px;
  height: 10em;
  overflow-y: auto;
}
</style>
