export const checkBoxObj = {
  class: 'basicComponent', // 基础类名
  type: 'wn-checkBox', // 对应数据库内类型
  name: '多选框', // 左边组件名称
  visible: true, // 是否显示

  title: '多选框：', // 按钮名称
  itemKey: '', // 需要绑定的key值.
  itemScore: true, // 元数据是否显示分值
  score: 0, // 分数
  itemName: '请绑定', // 需要绑定的key值Name.
  val: [], // 绑定的值
  rule: {
    showList: []
  }, // 规则集合
  ruleLook: false, // 规则开关
  options: [
    { dictCode: '1', dictName: '选项1' },
    { dictCode: '2', dictName: '选项2' }
  ], // 选项内数据

  width: 100, // 组件宽度
  marginTop: 5, // 外边框顶部
  marginBottom: 0, // 外边框底下
  marginLeft: 0, // 外边框左
  marginRight: 0, // 外边框右边
  paddingTop: 5, // 内边框顶部
  paddingBottom: 5, // 内边框底下
  paddingLeft: 5, // 内边框左
  paddingRight: 5, // 内边框右
  fontSize: 12, // 标题字体大小
  color: '#606266', // 字体颜色

  iWidth: 3, // i标签的宽度
  iHeight: 16, // i标签的高度
  iColor: '#0f49ed', // i标签颜色
  iShow: true, // 标注显示隐藏

  labelWidth: 90, // 组件标题宽度
  labelFontSize: 14, // 标题字体大小
  labelColor: '#606266', // 标题字体颜色
  labelBr: true, // 标题是否换行
  labelBottom: 0, // 标题下边高度

  selectLineFeed: false, // 选项换行
  selectFull: false, // 选项是否满屏
  selectBorder: false, // 选项外包围
  isTotalScore: false, // 是否为评估表最终结果
  scoreType: 'text', // 总分类型
  resultRule: '' // 结果规则
}
