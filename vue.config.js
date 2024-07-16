// vue.config.js
const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const config = require('./config/projectsConfig.js')
const projectName = process.env.PROJECT_NAME
module.exports = {
  ...config[projectName],
  publicPath: '/',
   // 输出文件目录
  outputDir: 'dist/' + projectName + '/',
  css: {
    loaderOptions: {
      sass: {
        implementation: require('sass'),
        additionalData: (content, loaderContext) => {
          const { resourcePath } = loaderContext
          if (resourcePath.endsWith('variables.scss')) return content
          return `@import "@/styles/variables.scss"; ${content}`
        }
      }
    }
  },
  productionSourceMap: false,
  lintOnSave: 'warning',
  configureWebpack: (config) => {
    Object.assign(config, {
      resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
          '@': path.join(__dirname, './src'),
          styles: path.join(__dirname, './src/styles'),
          views: path.join(__dirname, './src/views')
        }
      }
    })
    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, './src/app'),
            to: path.resolve(__dirname, './dist/app')
          }
        ]
      })
    )
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.warnings = false
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
      config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true
      config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = ['console.log']
      config.plugins.push(
        new CompressionPlugin({
          algorithm: 'gzip',
          // 匹配文件
          test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'), // 匹配文件扩展名
          // 压缩超过此大小的文件,以字节为单位
          threshold: 14336,
          minRatio: 0.8,
          // 删除原始文件只保留压缩后的文件
          cache: true,
          deleteOriginalAssets: false // true删除源文件(不建议);false不删除源文件
        })
      )
    }
    config.module.rules
      .filter((rule) => {
        return rule.test.toString().indexOf('scss') !== -1
      })
      .forEach((rule) => {
        rule.oneOf.forEach((oneOfRule) => {
          oneOfRule.use.splice(oneOfRule.use.indexOf(require.resolve('sass-loader')), 0, { loader: require.resolve('css-unicode-loader') })
        })
      })
  },
  chainWebpack: (config) => {
    config.module.rule('thejs').test(/\.js$/).include.add(path.resolve('src')).add(path.resolve('node_modules/element-ui/packages')).end().use('babel-loader').loader('babel-loader').end()
    config.module.rule('images')
          .use('url-loader')
            .loader('url-loader')
            .tap(options => Object.assign(options, { limit: 60240 })) // 将图片压缩门槛调整到10K，小于10K的非根目录图片素材都会被压缩成base64直接写在打包后的js文件中
    // 移除 prefetch 插件
    config.plugins.delete('prefetch-index')
    // 移除 preload 插件
    config.plugins.delete('preload-index')
    // 移除 prefetch 插件
    config.plugins.delete('prefetch-h5')
    // 移除 preload 插件
    config.plugins.delete('preload-h5')
    config.externals({ './cptable': 'var cptable' }) **
      config.module
        .rule('svg')
        .test(/\.(svg)(\?.*)?$/)
        .exclude.add(path.resolve(__dirname, './src/icons'))
    config.module
      .rule('svg-sprite')
      .test(/\.svg$/)
      .include.add(path.resolve(__dirname, './src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap((options) => {
        options.compilerOptions.whitespace = false
        options.compilerOptions.preserveWhitespace = true
        return options
      })
  }
}
