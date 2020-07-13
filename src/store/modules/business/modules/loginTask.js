/*
 * @Date: 2020-05-27 11:58:06
 * @LastEditors: songlin
 * @LastEditTime: 2020-07-13 17:09:56
 * @FilePath: \senseIDC-fe\src\store\modules\business\modules\loginTask.js
 */
import dict from '@/api/dictEnum'

export default {
  namespaced: true,
  state: {

  },
  getters: {},
  actions: {
    async load({ dispatch }) {
      // 统一加载字典

      const arr = []
      for (const key in dict) {
        // if (dict.hasOwnproperty(key)) {
          arr.push(dict[key].call())
        // }
      }

     await Promise.all(arr)

      // 订阅websocket
      // await dispatch('business/pushNotification/subscription', null, { root: true })

      // 查询今日告警记录,10s一次
      // await dispatch('business/todayEventCount/load', null, { root: true })
    },
    async unload({ dispatch }) {
      // 订阅websocket
      // await dispatch('business/pushNotification/unload', null, { root: true })

      // 查询今日告警记录,10s一次
      // await dispatch('business/todayEventCount/unload', null, { root: true })
    }
  }

}
