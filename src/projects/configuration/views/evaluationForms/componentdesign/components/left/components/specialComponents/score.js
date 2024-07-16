export const scoreObj = {
  class: 'specialComponents', // 特殊组件
  type: 'wn-score', // 对应数据库内类型
  name: '评分', // 左边组件名称
  visible: true, // 是否显示

  title: '评分：', // 按钮名称
  itemKey: '', // 需要绑定的key值.
  itemName: '请绑定', // 需要绑定的key值Name.
  score: '', // 分数
  linkageMetaData: [], // 关联元数据
  rule: {
    calculation: {}
  }, // 规则集合
  ruleLook: false, // 规则开关

  width: 100, // 组件宽度
  marginTop: 5, // 外边框顶部
  marginBottom: 0, // 外边框底下
  marginLeft: 0, // 外边框左
  marginRight: 0, // 外边框右边
  paddingTop: 10, // 内边框顶部
  paddingBottom: 10, // 内边框底下
  paddingLeft: 5, // 内边框左
  paddingRight: 5, // 内边框右
  fontSize: 12, // 标题字体大小
  color: '#606266', // 字体颜色
  textalign: 'left', // 文本对齐方式

  labelWidth: 170, // 组件标题宽度
  labelFontSize: 14, // 标题字体大小
  labelColor: '#606266', // 标题字体颜色
  isTotalScore: false, // 是否为评估表最终结果
  scoreType: 'number', // 总分类型
  resultRule: '' // 结果规则
}
