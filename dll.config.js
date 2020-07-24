/*
 * @Date: 2020-07-24 14:37:31
 * @LastEditors: songlin
 * @LastEditTime: 2020-07-24 15:11:24
 * @FilePath: \myadmin\dll.config.js
 */
const path = require('path')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const { DllPlugin } = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { dllDir } = require('./package.json')
const DIR = path.resolve(__dirname, dllDir)
module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    vue: ['vue'],
    vuex: ['vuex'],
    ELEMENT: ['element-ui'],
    vueRouter: ['vue-router'],
    axios: ['axios'],
    myCrud: ['my-element-crud'],
    XLSX: ['xlsx']
  },
  output: {
    path: DIR,
    filename: '[name].dll.js',
    // 库全局变量的名字，如何暴露模块
    library: '[name]'
  },
  optimization: {
    minimizer: [
      // 删除类库文件中的log
      new TerserWebpackPlugin({
        sourceMap: true,
        terserOptions: {
          warnings: false,
          compress: {
            drop_debugger: true,
            drop_console: true
          }
        }
      })
    ]
  },

  plugins: [
    new CleanWebpackPlugin(),
    new DllPlugin({
      // 必须和全局变量即library名字相同，否则DllPlugin插件找不到第三方库
      name: '[name]',
      path: path.join(DIR, '[name].manifest.json')
    })
  ]
}
