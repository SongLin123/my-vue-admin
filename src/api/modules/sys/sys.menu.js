/*
 * @Date: 2020-05-20 11:51:26
 * @LastEditors: songlin
 * @LastEditTime: 2020-06-18 14:08:12
 * @FilePath: \senseIDC-fe\src\api\modules\sys\sys.menu.js
 */
// 系统菜单管理
const pre = '/menu'

export default ({ request, mock, requestForMock, tools, moduleName }) => ({
  /**
   * @description 获取所有系统菜单
   * GET /security-system/menu/queryAllMenuList
   */
  SYS_MENU_QUERYALLMENULIST () {
    // 接口请求
    return request({
      url: `${moduleName + pre}/queryAllMenuList`,
      method: 'get'
    })
  },
  /**
   * @description 查询用户系统菜单
   * GET /security-system/menu/queryMenuListByUser
   */
  SYS_MENU_QUERYMENULISTBYUSER() {
    // mock
    //   .onAny(/\/queryMenuListByUser/)
    //   .reply(config => {
    //     return tools.responseSuccess([])
    //   })
    // return requestForMock({
    //   url: `${moduleName + pre}/queryMenuListByUser`,
    //   method: 'get'
    // })
    // 接口请求
    return request({
      url: `${moduleName + pre}/queryMenuListByUser`,
      method: 'get'
    })
  }
})
