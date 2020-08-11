/*
 * @Date: 2020-05-13 14:30:24
 * @LastEditors: songlin
 * @LastEditTime: 2020-08-05 15:05:45
 * @FilePath: \myadmin\.postcssrc.js
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
    //   viewportWidth: 1920,
    //   unitPrecision: 6,
    //   propList: ['*'],
    //   viewportUnit: 'vw',
    //   fontViewportUnit: 'vw',
    //   selectorBlackList: [/\.el-switch/g, 'el-checkbox__input', 'el-checkbox__inner'],
    //   minPixelValue: 0,
    //   mediaQuery: false,
    //   replace: true,
    //   exclude: [],
    //   include: [],
    //   landscape: false,
    //   landscapeUnit: 'vw',
    //   landscapeWidth: 568
    // }
  }
}
