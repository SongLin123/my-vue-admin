/*
 * @Date: 2020-05-13 14:30:24
 * @LastEditors: songlin
 * @LastEditTime: 2020-08-17 10:49:38
 * @FilePath: \myadmin\src\libs\util.js
 */
import { cloneDeep } from 'lodash'
import * as downloadFile from 'js-file-download'

export { default as cookies } from './util.cookies'
export { default as db } from './util.db'
export { default as log } from './util.log'
export { default as WS } from './util.ws'
export { downloadFile }
/**
 * @description 更新标题
 * @param {String} title 标题
 */
export const title = function (titleText) {
  const processTitle = process.env.VUE_APP_TITLE
  window.document.title = `${processTitle}${titleText ? ` | ${titleText}` : ''}`
}

/**
 * @description 打开新页面
 * @param {String} url 地址
 */
export const open = function (url) {
  var a = document.createElement('a')
  a.setAttribute('href', url)
  a.setAttribute('target', '_blank')
  a.setAttribute('id', 'myadmin-link-temp')
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(document.getElementById('myadmin-link-temp'))
}

/**
 * @description 拍平api返回的菜单
 * @param {String}
 */
export const flatMenu = (routeArr) => {
  let arr = []
  for (const item of routeArr) {
    arr.push(item)
    if (item.childList.length > 0) {
      arr = arr.concat(flatMenu(item.childList))
    }
  }
  return arr
}

/**
 * @description: 一维数组构建树结构
 */
export const makeTree = function makeTree(arr, groupName = undefined) {
  // fix root
  // arr.push({
  //   uuid: '-1',
  //   groupName: '全部',
  //   parentId: '',
  //   children: null
  // })
  const carr = cloneDeep(arr)
  const map = new Map()
  carr.forEach(function (item) {
    map.set(item.uuid, Object.assign(item, { level: null }))
  })
  const v = []
  for (const item of carr) {
    const parent = map.get(item.parentUuid)

    if (parent) {
      (parent.children || (parent.children = [])).push(item)
    } else {
      v.push(item)
    }
  }

  function recursive(a, p = { level: 0 }) {
    return a.map(root => {
      root.level = p.level + 1
      // 将 非groupName 的树名字段替换成 groupName
      if (groupName) {
        root.groupName = root[groupName]
      }
      if (root.children && root.children.length > 0) {
        root.children = recursive(root.children, root)
      }
      return root
    })
  }

  return recursive(v)
}

export const decorator = function (obj) {
  const tar = { ...obj }

  return new Proxy(tar, {
    get(target, p) {
      if (p === 'reset') {
        return () => {
          for (const key in obj) {
            // eslint-disable-next-line no-prototype-builtins
            if (obj.hasOwnProperty(key)) {
              target[key] = obj[key]
            }
          }
        }
      } else {
        return target[p]
      }
    }
  })
  // return Object.defineProperty(tar, 'reset', {
  //   enumerable: false,
  //   configurable: false,
  //   value: () => {
  //     for (const key in obj) {
  //       // eslint-disable-next-line no-prototype-builtins
  //       if (obj.hasOwnProperty(key)) {
  //         tar[key] = obj[key]
  //       }
  //     }
  //   }
  // })
}
