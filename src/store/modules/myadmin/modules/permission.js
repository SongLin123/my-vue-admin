/*
 * @Date: 2020-05-19 16:04:10
 * @LastEditors: songlin
 * @LastEditTime: 2020-07-13 16:48:02
 * @FilePath: \senseIDC-fe\src\store\modules\myadmin\modules\permission.js
 */

import api from '@/api'

/**
 * @description 处理接口,预留权限限制到接口时可用
 * @param {Array} interfaces 接口
 */
const formatInterfaces = function (interfaces) {
  const i = {}
  i.GET = interfaces.filter(s => s.method.toUpperCase() === 'GET')
  i.POST = interfaces.filter(s => s.method.toUpperCase() === 'POST')
  i.PUT = interfaces.filter(s => s.method.toUpperCase() === 'PUT')
  i.DELETE = interfaces.filter(s => s.method.toUpperCase() === 'DELETE')
  return i
}

export default {
  namespaced: true,

  // 如果只做路由级的权限，下面字段都用不到
  state: {

    menus: null,
    // 功能编码
    functions: [],
    // 角色编码
    roles: [],
    // 接口
    interfaces: {
      GET: [],
      POST: [],
      PUT: [],
      DELETE: []
    },
    // 是否管理员
    isAdmin: false
  },
  mutations: {
    set(state, data) {
      state.functions = data.functions
      state.roles = data.roles
      state.isAdmin = data.isAdmin
      state.interfaces = data.interfaces
    }
  },
  actions: {
    bindPermission({ commit }, data) {
      const userPermissionInfo = Object.assign({
        functions: [],
        roles: [],
        interfaces: [],
        isAdmin: 0
      }, data)
      // 设置权限信息
      commit('set', {
        functions: userPermissionInfo.userPermissions,
        roles: userPermissionInfo.userRoles,
        interfaces: formatInterfaces(userPermissionInfo.accessInterfaces),
        isAdmin: userPermissionInfo.isAdmin === 1
      })
    },

    async userPermissionInfo({ state, dispatch }) {
      if (!state.menus) {
        // 查询登陆用户的权限相关
        const res = await api.SYS_MENU_QUERYMENULISTBYUSER()
        state.menus = res.data
      }

      return {
        menus: state.menus
      }
    },

    /**
     * @description: 接口校验
     * @params {config} {permission:[],interfaceCheck:true}
     */
    access({ state }, config) {
      let functionAccess = true
      let interfaceAccess = true
      const isAdmin = state.isAdmin

      if (config.permission && config.permission.length > 0) {
        const needPermissions = config.permission
        const permissions = state.functions.concat(state.roles)
        const hasPermission = permissions.some(s => needPermissions.includes(s))
        if (!hasPermission && !isAdmin) {
          functionAccess = false
        }
      }

      if (config.interfaceCheck) {
        const path = config.url.replace(config.baseURL, '')
        const method = config.method.toUpperCase()
        const interfaces = state.interfaces[method]
        const matched = interfaces.filters(it => it.includes(path.split('?')[0]))

        if (matched.length === 0 && !isAdmin) {
          interfaceAccess = false
        }
      }
      return functionAccess && interfaceAccess
    }
  }
}
