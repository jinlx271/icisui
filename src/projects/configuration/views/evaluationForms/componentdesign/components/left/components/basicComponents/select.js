export const selectObj = {
  class: 'basicComponent', // 基础类名
  type: 'wn-select', // 对应数据库内类型
  name: '下拉选择框', // 左边组件名称
  visible: true, // 是否显示

  title: '下拉选择框：',
  itemKey: '', // 需要绑定的key值.
  itemName: '请绑定', // 需要绑定的key值Name.
  itemScore: true, // 元数据是否显示分值
  score: 0, // 分数
  val: '', // 绑定的值
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
  paddingTop: 8, // 内边框顶部
  paddingBottom: 5, // 内边框底下
  paddingLeft: 5, // 内边框左
  paddingRight: 5, // 内边框右
  color: '#606266', // 字体颜色
  fontSize: 13, // 字体大小
  labelBr: true, // 标题是否换行
  labelBottom: 8, // 标题下边高度
  labelWidth: 100, // 组件标题宽度
  labelFontSize: 14, // 标题字体大小
  labelColor: '#606266', // 标题字体颜色
  isTotalScore: false, // 是否为评估表最终结果
  scoreType: 'text' // 总分类型
}
