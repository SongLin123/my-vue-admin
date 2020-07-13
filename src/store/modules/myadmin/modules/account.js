/*
 * @Date: 2020-05-13 14:30:24
 * @LastEditors: songlin
 * @LastEditTime: 2020-07-13 18:14:01
 * @FilePath: \senseIDC-fe\src\store\modules\myadmin\modules\account.js
 */
import { MessageBox } from 'element-ui'
import util from '@/libs/util.js'
// import router from '@/router'
import api from '@/api'

export default {
  namespaced: true,
  actions: {
    /**
     * @description 登录
     * @param {Object} context
     * @param {Object} payload username {String} 用户账号
     * @param {Object} payload password {String} 密码
     * @param {Object} payload route {Object} 登录成功后定向的路由对象 任何 vue-router 支持的格式
     */
    async login({ dispatch }, data = {
      password: '',
      username: '',
      verificationCode: ''
    }) {
      const res = await api.SYS_OAUTH_USERLOGIN(data)
      util.cookies.set('token', res.data.token)

      const ui = await api.SYS_OAUTH_GETTOKENUSER()

      // 设置 cookie 一定要存 uuid 和 token 两个 cookie
      // 整个系统依赖这两个数据进行校验和存储
      // user 是用户身份唯一标识 用户注册的时候确定 并且不可改变 不可重复
      // token 代表用户当前登录状态 建议在网络请求中携带 token
      // 如有必要 token 需要定时更新，默认保存一天
      util.cookies.set('user', ui.data.userName)
      // 设置 vuex 用户信息

      await dispatch('myadmin/user/set', { name: ui.data.userName }, { root: true })
      // 用户登录后从持久化数据加载一系列的设置
      await dispatch('load')
      // 所有的登陆后启动任务
      await dispatch('business/loginTask/load', null, { root: true })
    },
    /**
     * @description 注销用户并返回登录页面
     * @param {Object} context
     * @param {Object} payload confirm {Boolean} 是否需要确认
     */
    logout({ commit, dispatch }, { confirm = false } = {}) {
      /**
       * @description 注销
       */
      async function logout() {
        api.SYS_OAUTH_EXITLOGIN().finally(async () => {
          // 删除cookie
          util.cookies.remove('token')
          util.cookies.remove('user')
          // 清空 vuex 用户信息
          await dispatch('myadmin/user/set', {}, { root: true })

          // 停止所有的登陆后启动任务
          await dispatch('business/loginTask/unload', null, { root: true })
          // 跳转路由
          // router.push({ name: 'login' })
          // fix:修改为刷新页面，解决动态路由可能导致的问题
          window.location.reload(true)
        })
      }
      // 判断是否需要确认
      if (confirm) {
        commit('myadmin/gray/set', true, { root: true })
        MessageBox({
          title: '退出登陆',
          dangerouslyUseHTMLString: true,
          message: '<strong style="font-size:1rem">确定退出系统吗？</strong>',
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              done()

              setTimeout(() => {
                  instance.confirmButtonLoading = false
              }, 5000)
            } else {
              done()
            }
          }
        })
          .then(() => {
            logout()
          })
          .finally(() => {
            commit('myadmin/gray/set', false, { root: true })
          })
      } else {
        logout()
      }
    },
    /**
     * @description 用户登录后从持久化数据加载一系列的设置
     * 可以认为是自启动任务列表
     * @param {Object} context
     */
    async load({ dispatch }) {
      // 加载用户名
      await dispatch('myadmin/user/load', null, { root: true })
      // 加载主题
      await dispatch('myadmin/theme/load', null, { root: true })
      // 加载页面过渡效果设置
      await dispatch('myadmin/transition/load', null, { root: true })
      // 持久化数据加载上次退出时的多页列表
      await dispatch('myadmin/page/openedLoad', null, { root: true })
      // 持久化数据加载侧边栏配置
      await dispatch('myadmin/menu/asideLoad', null, { root: true })
      // 持久化数据加载全局尺寸
      await dispatch('myadmin/size/load', null, { root: true })
      // 持久化数据加载颜色设置
      await dispatch('myadmin/color/load', null, { root: true })
    }
  }
}
