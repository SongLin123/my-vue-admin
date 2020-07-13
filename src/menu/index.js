/*
 * @Date: 2020-05-13 14:30:24
 * @LastEditors: songlin
 * @LastEditTime: 2020-07-13 17:23:40
 * @FilePath: \senseIDC-fe\src\menu\index.js
 */
import { uniqueId } from 'lodash'
const files = require.context('./modules', false, /\.js$/)
// 插件

/**
 * @description 给菜单数据补充上 path 字段
 * @description https://github.com/d2-projects/d2-admin/issues/209
 * @param {Array} menu 原始的菜单数据
 */
function supplementPath (menu) {
  return menu.map(e => ({
    ...e,
    path: e.path || uniqueId('d2-menu-empty-'),
    ...e.children ? {
      children: supplementPath(e.children)
    } : {}
  }))
}

// 菜单 侧边栏
export const menuAside = supplementPath([
  {
    path: '/index',
    title: '首页',
    iconSvg: 'index'
  }
  // {
  //   path: `${location.origin + process.env.VUE_APP_PUBLIC_PATH}/subPage.html`,
  //   title: '大屏',
  //   icon: 'dashcube'
  // }
].concat(...files.keys().map(key => files(key).default)))

// 菜单 顶栏
export const menuHeader = supplementPath([

])
