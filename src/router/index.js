/*
 * @Date: 2020-05-13 14:30:24
 * @LastEditors: songlin
 * @LastEditTime: 2020-08-11 18:21:59
 * @FilePath: \myadmin\src\router\index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import store from '@/store/index'
import * as util from '@/libs/util.js'

// 菜单和路由设置
import setting from '@/setting.js'
import { menuHeader, menuAside } from '@/menu'
import routes, { frameInRoutes } from './routes'

// 权限路由映射表处理
import { formatRoutes, formatMenus } from './routerComponentMap'
// 首页
const indexPath = setting.page.name

// fix vue-router NavigationDuplicated
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return VueRouterPush.call(this, location).catch(err => err)
}
const VueRouterReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace(location) {
  return VueRouterReplace.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

// 导出路由 在 main.js 里使用
const router = new VueRouter({
  mode: 'history',
  routes
})

// 获取权限信息
const fetchPermissionInfo = async () => {
  let hasPermission = false
  const allMenuAside = [...menuAside]
  // 暂时为空
  const allMenuHeader = menuHeader
  if (process.env.VUE_APP_PERMISSION === 'TRUE') {
    hasPermission = true
    const { menus } = await store.dispatch('myadmin/permission/userPermissionInfo')

    // 动态添加路由,添加到frameIn中
    frameInRoutes.find(it => it.path === '/')
      .children.push(...formatRoutes(menus))
    allMenuAside.push(...formatMenus(menus))

    router.addRoutes(frameInRoutes)
  }

  // 处理路由 得到每一级的路由设置
  store.commit('myadmin/page/init', frameInRoutes)
  // 设置顶栏菜单
  store.commit('myadmin/menu/headerSet', allMenuHeader)
  // 设置侧边栏菜单
  store.commit('myadmin/menu/fullAsideSet', allMenuAside)

  // 初始化菜单搜索功能
  store.commit('myadmin/search/init', [...allMenuAside, ...allMenuHeader]
  )

  // 加载上次退出时的多页列表
  store.dispatch('myadmin/page/openedLoad')

  Promise.resolve(hasPermission)
}

// 免校验token白名单
const whiteList = ['/login']

/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach(async (to, from, next) => {
  // 确认已经加载多标签页数据 https://github.com/d2-projects/d2-admin/issues/201
  await store.dispatch('myadmin/page/isLoaded')

  // 确认已经加载组件尺寸设置 https://github.com/d2-projects/d2-admin/issues/198
  await store.dispatch('myadmin/size/isLoaded')
  // 进度条
  NProgress.start()
  // 关闭搜索面板
  store.commit('myadmin/search/set', false)
  // 这里暂时将cookie里是否存有token作为验证是否登录的条件

  const token = util.cookies.get('token')
  if (whiteList.includes(to.path)) {
    next()
    return
  }
  // 这里暂时将cookie里是否存有token作为验证是否登录的条件
  // 请根据自身业务需要修改
  if (token && token !== 'undefined') {
    // 判断是否需要权限功能-动态路由-目标path是否为首页
    if (
      (await fetchPermissionInfo()) &&
      (to.path.includes(indexPath.fullPath))) {
      const { menus } = await store.dispatch('myadmin/permission/userPermissionInfo')
      // 动态权限排序
      const route = formatRoutes(menus).sort((a, b) => a.menuSort - b.menuSort)
      // 如果存在首页就跳转，不存在就跳转到动态路由第一页
      route.find(item => (item.path.includes(indexPath.fullPath))) ? next() : next(route[0].path)
    } else {
      next()
    }
  } else {
    // 没有登录的时候跳转到登录界面
    // 携带上登陆成功之后需要跳转的页面完整路径
    next({
      name: 'login',
      query: {
        redirect: to.fullPath
      }
    })
  }
})

router.afterEach(to => {
  // 进度条
  NProgress.done()
  // 多页控制 打开新的页面
  store.dispatch('myadmin/page/open', to)
  // 更改标题
  util.title(to.meta.title)
})

export default router
