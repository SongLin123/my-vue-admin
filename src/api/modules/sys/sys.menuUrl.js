/*
 * @Date: 2020-05-13 14:30:24
 * @LastEditors: songlin
 * @LastEditTime: 2020-05-27 11:42:33
 * @FilePath: \d2-admin\src\api\modules\sys\sys.menuUrl.js
 */

// 系统用户管理
const pre = '/menuUrl'

export default ({ request, mock, requestForMock, tools, moduleName }) => ({
  /**
   * @description 获取所有的菜单路径信息(超管用户使用) GET /security-system/menuUrl/queryMenuUrl
      */
  SYS_MENUURL_QUERYMENUURL () {
    // 接口请求
    return request({
      url: `${moduleName + pre}/queryMenuUrl`,
      method: 'GET'
    })
  },
  /**
   * @description 通过角色ID获取所有菜单路径 GET /security-system/menuUrl/queryMenuUrlByRoleId
   * @param {Object} roleUuid
   */
  SYS_MENUURL_QUERYMENUURLBYROLEID (roleUuid) {
    // 接口请求
    return request({
      url: `${moduleName + pre}/queryMenuUrlByRoleId`,
      method: 'GET',
      params: { roleUuid }
    })
  }

})
