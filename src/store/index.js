/*
 * @Date: 2020-05-13 14:30:24
 * @LastEditors: songlin
 * @LastEditTime: 2020-07-13 13:58:10
 * @FilePath: \senseIDC-fe\src\store\index.js
 */
import Vue from 'vue'
import Vuex from 'vuex'

import myadmin from './modules/myadmin' // 框架使用的store
import business from './modules/business' // 业务使用的store

Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    myadmin,
    business
  }
})
