/*
 * @Date: 2020-05-13 14:30:24
 * @LastEditors: songlin
 * @LastEditTime: 2020-05-18 16:36:21
 * @FilePath: \d2-admin\src\plugin\open\index.js
 */
import util from '@/libs/util'

export default {
  install (Vue, options) {
    Vue.prototype.$open = util.open
  }
}
