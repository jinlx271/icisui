export const inputObj = {
  class: 'basicComponent', // 基础类名
  type: 'wn-input', // 组件内行
  name: '输入框', // 左边组件名称
  visible: true, // 是否显示
  title: '输入框：', // 输入名称
  itemKey: '', // 需要绑定的key值.
  itemName: '请绑定', // 需要绑定的key值Name.
  val: null, // 选项内数据
  rule: {
    calculation: {}
  }, // 规则集合
  ruleLook: false, // 规则开关
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
  placeholder: '请输入', // 控件备注
  maxlength: 10, // 最大输入长度
  allBorder: true, // 半框 全框
  labelBr: true, // 标题是否换行
  labelBottom: 8, // 标题下边高度
  labelWidth: 70, // 组件标题宽度
  labelFontSize: 14, // 标题字体大小
  labelColor: '#606266', // 标题字体颜色
  multiline: false, // 多行切换
  rows: 1, // 文本框可见行数
  isItemKey: true, // 用户是否可以修改
  moveInput: false, // 移动input
  levelMove: 0, // 上下移
  verticalMove: 0, // 左右移,
  valueTypeDictCode: '2', // 默认文本
  isTotalScore: false, // 是否为评估表最终结果
  scoreType: 'text', // 总分类型
  resultRule: '', // 结果规则
  linkageMetaData: [] // 关联元数据
}
