/**
 *画布编辑页面 及他的工具栏组件 以及护理文书界面
*/
export default {
    data() {
        return {
            canvasRange: [
                { width: 932, height: 1363, name: 'A4-纵向' },
                { width: 1363, height: 932, name: 'A4-横向' },
                { width: 1041, height: 1510, name: 'A3-纵向' },
                { width: 1510, height: 1041, name: 'A3-横向' }
            ]
        }
    },
    methods: {
        print(ids = 'editor', endCallback) { //
            const { width, height } = this.canvasStyleData || { width: '1540', height: 'auto' }
            let dir = ''
            if (width > height) { // 横向
                if (width < 1510) {
                    dir = 'A4 landscape'
                } else {
                    dir = 'A3 landscape'
                }
            } else { // 纵向
                if (width < 1041) {
                    dir = 'A4 portrait'
                } else {
                    dir = 'A3 portrait'
                }
            }
            this.$print({
                ids,
                endCallback: endCallback,
                extraCss: '../../../static/tinymce/css/common.css',
                extraHead:
                    // 谷歌浏览器实际并没有严格按照A4值 横向 纵向比例来限制打印内容的打印。 浏览器纵向纸张 按照实际纸张的高度显示的话  超出高度 显示多余的空白页 所以高度减少
                    `<style>body{ width:${width}px!important;height:${height > width ? height - 50 : height}px!important; min-width:auto!important; background:#fff!important; padding:0px 0px; }  @page{size:${dir};margin:0 auto; } .print-page{padding:auto;} </style>`
            })
        }
    }
}
