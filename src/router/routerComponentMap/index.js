/*
 * @Date: 2020-05-20 14:10:09
 * @LastEditors: songlin
 * @LastEditTime: 2020-07-13 12:26:13
 * @FilePath: \senseIDC-fe\src\router\routerComponentMap\index.js
 */

import util from '@/libs/util'
import { isEmpty, pickBy } from 'lodash'
const files = require.context('./', false, /\.js$/)

// 动态组装，异步加载
const componentMaps = {
  sys_user: () => import('@/views/system/user'),
  sys_role: () => import('@/views/system/role'),
  sys_log: () => import('@/views/system/backendLog'),
  sys_company: () => import('@/views/system/company')

}
files.keys().forEach((key) => {
  if (!key.includes('index.js')) {
    Object.assign(componentMaps, files(key).default)
  }
})
function Assemb(nodes) {
  return nodes.map(it => {
    it.basePath = ''

    const parent = nodes.find(i => i.uuid === it.parentId)
    if (parent) {
      if (!parent.children) parent.children = []
      parent.children.push(it)
      // 菜单需要组装父节点的path
      if (it.routeType === 1) {
        it.basePath = parent.basePath + (parent.path || '')

        it.path = it.basePath + it.path
      }
      return {}
    }
    return it
  }).filter(it => !isEmpty(it))
}
// 处理动态添加的路由
/**
     * menuType 菜单类型 1：目录 2：功能 ,
     * routeType 菜单类型 1：route 2：link
     * 为链接的跳过,为目录的进入下一级
     *  */
export function formatRoutes(menus = []) {
  const routes = util.flatMenu(menus)
  // 去掉link，没有url的，映射表没有配置的
    .filter((item) => item.routeUrl && (item.routeType === 1) && componentMaps[item.menuCode])
    .sort((a, b) => +a.parentId - +b.parentId)
    .map(route => ({
      parentId: route.parentId,
      uuid: route.uuid,
      component: componentMaps[route.menuCode],
      meta: {
        title: route.menuName
      },
      path: route.routeUrl,
      name: route.routeUrl
    }))

  return Assemb(routes)
}

// 处理菜单

export function formatMenus(menus = []) {
// 过滤根节点
  const nodes = util.flatMenu(menus)
    .filter(({ parentId }) => parentId !== '-1')
    .map(node => pickBy({
      parentId: node.parentId,
      uuid: node.uuid,
      title: node.menuName,
      iconSvg: node.menuIcon,
      path: node.routeUrl,
      routeType: node.routeType
    }, val => !!val)
    )
  return Assemb(nodes)
}
