/*
 * @Date: 2020-05-13 14:30:24
 * @LastEditors: songlin
 * @LastEditTime: 2020-07-13 15:07:06
 * @FilePath: \senseIDC-fe\src\plugin\index\index.js
 */
// Element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// flex 布局库
import 'flex.css'
// 组件
import '@/components'
// svg 图标
import '@/assets/svg-icons'

// 功能插件
import pluginOpen from '@/plugin/open'
// 权限插件
import pluginPermission from '@/plugin/permission'

// api
import api from '@/api'

import myCrud from 'my-element-crud'

// 日志收集sentry平台
import sentry from '@/plugin/sentry'

export default {
  async install (Vue, options) {
    // 设置为 false 以阻止 vue 在启动时生成生产提示
    // https://cn.vuejs.org/v2/api/#productionTip
    Vue.config.productionTip = false
    // 当前环境
    Vue.prototype.$env = process.env
    // 当前的 baseUrl
    Vue.prototype.$baseUrl = process.env.VUE_APP_PUBLIC_PATH
    // 构建时间
    sessionStorage.setItem('buildTime', process.env.VUE_APP_BUILD_TIME)

    // 绑定api
    Vue.prototype.$api = api
    // Element
    Vue.use(ElementUI)
    // 插件
    Vue.use(pluginOpen)
    // 权限插件
    Vue.use(pluginPermission, options)

    // curd
    Vue.use(myCrud)
    Vue.use(sentry)
  }
}
