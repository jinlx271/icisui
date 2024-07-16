// 获取当前时间
import dayjs from 'dayjs'
export function formatTime() {
  const weeks = ['日', '一', '二', '三', '四', '五', '六']
  const timestamp = dayjs(new Date())
  const time = timestamp.format('YYYY年MM月DD日')
  const week = weeks[timestamp.day()]
  const moment = dayjs(timestamp).format('HH:mm')
  return [time, week, moment]
}
