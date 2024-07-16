const execSync = require('child_process').execSync // 同步子进程
const date = new Date(execSync('git show -s --format=%cd').toString()) // 日期
const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim() // 当前提交的版本号
const argv = process.argv
const branchArr = argv[argv.length - 1].split('=')
const versionMessage = (branchArr[0] == 'branch' ? branchArr[1] : '') + '#' + (build_on_branch || branch) + `日期:${date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes()}`
const config = {
  configuration: {
    pages: {
      index: {
        entry: "src/projects/configuration/main.js",
        template: "public/index.html",
        filename: "index.html",
        title: '重症管理系统',
        versionMessage: versionMessage,
        chunks: ['chunk-vendors', 'chunk-common', 'index']
      }
    },
    devServer: {
      port: 8081,
      hot: true,
      compress: true,
      open: true,
      overlay: { warnings: false, errors: true },
      publicPath: '/',
      proxy: {
        // 跨域
        '': {
          target: 'http://172.23.2.104:8200/',
          changeOrigin: true,
          pathRewrite: {
            '^': ''
          }
        }
      }
    }
  },
  common: {
    pages: {
      index: {
        entry: "src/projects/common/main.js",
        template: "public/index.html",
        filename: "index.html",
        title: '重症管理系统',
        versionMessage: versionMessage,
        chunks: ['chunk-vendors', 'chunk-common', 'index']
      }
    },
    devServer: {
      port: 8080, // 端口地址
      open: false, // 是否自动打开浏览器页面
      host: "0.0.0.0", // 指定使用一个 host，默认是 localhost
      https: false, // 使用https提供服务
      disableHostCheck: true,
      // 设置代理
      proxy: {
        // 跨域
        '': {
          target: 'http://172.23.2.104:8200/',
          changeOrigin: true,
          pathRewrite: {
            '^': ''
          }
        }
      }
    }
  },
  wardOverview: {
    pages: {
      index: {
        entry: "src/projects/wardOverview/main.js",
        template: "public/index.html",
        filename: "index.html",
        title: '重症管理系统',
        versionMessage: versionMessage,
        chunks: ['chunk-vendors', 'chunk-common', 'index']
      }
    },
    devServer: {
      port: 8082,
      hot: true,
      compress: true,
      open: true,
      overlay: { warnings: false, errors: true },
      publicPath: '/',
      proxy: {
        // 跨域
        '': {
          target: 'http://172.23.2.104:8200/',
          changeOrigin: true,
          pathRewrite: {
            '^': ''
          }
        }
      }
    }
  },
};
module.exports = config;
