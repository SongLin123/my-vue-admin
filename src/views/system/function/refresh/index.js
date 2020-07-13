/*
 * @Date: 2020-05-13 14:30:24
 * @LastEditors: songlin
 * @LastEditTime: 2020-05-18 16:48:50
 * @FilePath: \d2-admin\src\views\system\function\refresh\index.js
 */
export default {
  beforeRouteEnter (to, from, next) {
    next(instance => instance.$router.replace(from.fullPath))
  },
  render: h => h()
}
