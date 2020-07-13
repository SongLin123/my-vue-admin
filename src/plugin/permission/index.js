/*
 * @Date: 2020-05-20 15:48:06
 * @LastEditors: songlin
 * @LastEditTime: 2020-07-13 14:25:34
 * @FilePath: \senseIDC-fe\src\plugin\permission\index.js
 */

export default {
  install(Vue, options) {
    const store = options.store
    Vue.directive('permission', {
      inserted: function (el, binding, vnode) {
        const isAdmin = store.state.myadmin.permission.isAdmin
        if (isAdmin) {
          return
        }
        let checkCodes = []
        if (binding.arg === 'function') {
          checkCodes = store.state.myadmin.permission.functions
        } else if (binding.arg === 'role') {
          checkCodes = store.state.myadmin.permission.roles
        } else {
          checkCodes = store.state.myadmin.permission.functions.concat(store.state.myadmin.permission.roles)
        }
        let access = true
        if (binding.modifiers.all) {
          for (const need of binding.value) {
            if (checkCodes.some(s => s !== need)) {
              access = false
              break
            }
          }
        } else {
          access = false
          for (const need of binding.value) {
            if (checkCodes.some(s => s === need)) {
              access = true
              break
            }
          }
        }
        if (!access) {
          el.parentNode.removeChild(el)
        }
      }
    })
    Vue.prototype.hasPermissions = (permissions) => {
      const isAdmin = store.state.myadmin.permission.isAdmin
      if (isAdmin) {
        return true
      }
      let has = false
      const checkCodes = store.state.myadmin.permission.functions.concat(store.state.myadmin.permission.roles)
      for (const need of permissions) {
        if (checkCodes.some(s => s === need)) {
          has = true
          break
        }
      }
      return has
    }
    Vue.prototype.hasFunctions = (functions) => {
      const isAdmin = store.state.myadmin.permission.isAdmin
      if (isAdmin) {
        return true
      }
      let has = false
      const checkCodes = store.state.myadmin.permission.functions
      for (const need of functions) {
        if (checkCodes.some(s => s === need)) {
          has = true
          break
        }
      }
      return has
    }
    Vue.prototype.hasRoles = (roles) => {
      const isAdmin = store.state.myadmin.permission.isAdmin
      if (isAdmin) {
        return true
      }
      let has = false
      const checkCodes = store.state.myadmin.permission.roles
      for (const need of roles) {
        if (checkCodes.some(s => s === need)) {
          has = true
          break
        }
      }
      return has
    }
  }
}
