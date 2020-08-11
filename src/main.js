/*
 * @Date: 2020-05-13 14:30:24
 * @LastEditors: songlin
 * @LastEditTime: 2020-08-05 14:45:28
 * @FilePath: \myadmin\src\main.js
 */
import './rem' // 需要使用px-to-rem 时开启

// Vue
import Vue from 'vue'
import App from './App'
// 核心插件
// 其他插件的加载在/plugin/myadmin 中
import allPlugin from '@/plugin/index'
// store
import store from '@/store/index'

import router from './router'
import global from '@/mixins/global'
import util from '@/libs/util'

// 核心插件,为permission插件传入store
Vue.use(allPlugin, { store })
Vue.mixin(global)

new Vue({
  router,
  store,
  render: h => h(App),
  created () {

  },
  mounted() {
    const token = util.cookies.get('token')
    if (token && token !== 'undefined') {
      // 所有的登陆后启动任务
      this.$store.dispatch('business/loginTask/load', null, { root: true })
    }
      // 从数据库加载一系列的设置

    this.$store.dispatch('myadmin/account/load')

    // 加载公司信息
    this.$store.dispatch('myadmin/company/load')
    // 获取并记录用户 UA
    this.$store.commit('myadmin/ua/get')
    // 初始化全屏监听
    this.$store.dispatch('myadmin/fullscreen/listen')
  }
}).$mount('#app')
