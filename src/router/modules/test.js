/*
 * @Date: 2020-06-18 22:59:56
 * @LastEditors: songlin
 * @LastEditTime: 2020-07-13 13:56:57
 * @FilePath: \senseIDC-fe\src\router\modules\staff.js
 */
// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
// const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

// const base = 'staff'
export default [
  // {
  //       path: `/${base}/allPeople`,
  //       name: 'allPeople',
  //       meta: {
  //         title: '全员库'
  //       },
  //       component: _import(`${base}/allPeople`)
  //     }
]
