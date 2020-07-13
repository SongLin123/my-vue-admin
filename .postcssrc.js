/*
 * @Date: 2020-05-13 14:30:24
 * @LastEditors: songlin
 * @LastEditTime: 2020-07-03 14:54:36
 * @FilePath: \senseIDC-fe\.postcssrc.js
 */
module.exports = {
  plugins: {
    autoprefixer: {},
    "postcss-pxtorem": {
      rootValue: 16,
      unitPrecision: 5,
      propList: ['*'],
      selectorBlackList: [/\.el-switch/g, 'el-checkbox__input','el-checkbox__inner'],
      replace: true,
      mediaQuery: false,
      minPixelValue: 0,
      exclude: ''
    },
    // 'postcss-px-to-viewport': {
    //   unitToConvert: 'px',
    //   viewportWidth: 1080,
    //   unitPrecision: 4,
    //   propList: ['*'],
    //   viewportUnit: 'vh',
    //   fontViewportUnit: 'vh',
    //   selectorBlackList: ['el'],
    //   minPixelValue: 1,
    //   mediaQuery: false,
    //   replace: true,
    //   exclude: [/\/node_modules\//, /\/src\/layout\//, /\/src\/components\//, /\/src\/App.vue/],
    //   include: [/\/src\//],
    //   landscape: false,
    //   landscapeUnit: 'vh',
    //   landscapeWidth: 568
    // }
  }
}
