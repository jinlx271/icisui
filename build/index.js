const { run } = require('runjs')
const chalk = require('chalk')
const config = require('../vue.config.js')
const rawArgv = process.argv.slice(2)
const args = rawArgv.join(' ')

if (process.env.npm_config_preview || rawArgv.includes('--preview')) {

  var startTime=new Date().getTime()/1000
  run(`vue-cli-service build ${args}`)

  var endTime=new Date().getTime()/1000
  compareTime=parseInt((endTime-startTime)/60)+'分'+(endTime-startTime)%60+'秒'
  console.log(chalk.green(`> 打包时间：${compareTime}  http://localhost:`))
} else {
  run(`vue-cli-service build ${args}`)
}
