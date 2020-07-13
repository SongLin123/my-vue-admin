/*
 * @Date: 2020-06-23 19:10:46
 * @LastEditors: songlin
 * @LastEditTime: 2020-06-24 13:37:46
 * @FilePath: \senseIDC-fe\src\store\modules\myadmin\modules\sys.role.js
 */
import api from '@/api'
export default {
  namespaced: true,
  state: {
    route: [],
    data: [],
    activeData: {}
  },
  actions: {
    setData({ state }, data) {
      state.activeData = data
    },
   async load({ state }) {
      const r = await api.SYS_MENU_QUERYALLMENULIST()
      state.route = r.data[0].childList
      const d = await api.SYS_AUTHORITY_QUERYDATAAUTHORITYLIST()
      state.data = d.data
    }
  }
}
