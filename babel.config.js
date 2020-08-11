module.exports = {
  presets: [
    ['@vue/cli-plugin-babel/preset', {
      targets: {
        browsers: '> 5% in CN' // https://github.com/browserslist/browserslist
      }

    }]
  ],
  // 允许两种编码引入方式共存,也就是 common 规范与 es6 规范的共存处理
  sourceType: 'unambiguous'

}
