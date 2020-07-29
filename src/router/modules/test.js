/*
 * @Date: 2020-06-18 22:59:56
 * @LastEditors: songlin
 * @LastEditTime: 2020-07-26 21:08:00
 * @FilePath: \myadmin\src\router\modules\test.js
 */
// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

// const base = 'staff'
export default [
  {
    path: 'upload',
    name: 'upload',
    meta: {
      title: '上传'
    },
    component: _import('upload')
  }
]
