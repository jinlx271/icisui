import { scoreObj } from './components/specialComponents/score' // 标题

const basic = {
  'wn-score': scoreObj // 评分
} // 左边对象数据
const specialList = []
for (const i in basic) {
  specialList.push({
    ele: i, // key值名称
    obj: basic[i] // 返回组件的对象
  })
}
export default specialList // 导出所有
