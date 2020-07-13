/*
 * @Date: 2020-05-13 14:30:24
 * @LastEditors: songlin
 * @LastEditTime: 2020-06-19 16:13:20
 * @FilePath: \senseIDC-fe\src\api\modules\sys\sys.role.js
 */

// 系统用户管理
const pre = '/role'

export default ({ request, mock, requestForMock, tools, moduleName }) => ({
  /**
   * @description 新增角色信息 POST /security-system/role/addRole
   * @param {Object} data {
      "remarks": "string",
      "roleName": "string"
    }
   */
  SYS_ROLE_ADDROLE (data = {
  }) {
    // 接口请求
    return request({
      url: `${moduleName + pre}/addRole`,
      method: 'POST',
      data
    })
  },
  /**
   * @description 角色授权 POST /security-system/role/authority
   * @param {Object} {
  "menuList": [
    "string"
  ],
  "uuid": "string"
}
   */
  SYS_ROLE_AUTHORITY (data) {
    // 接口请求
    return request({
      url: `${moduleName + pre}/authority`,
      method: 'POST',
      data
    })
  },
  /**
   * @description 删除角色信息 DELETE /security-system/role/deleteRole/{uuid
   * @param {Object} uuid
   */
  SYS_ROLE_DELETEROLE (uuid) {
    // 接口请求
    return request({
      url: `${moduleName + pre}/deleteRole/${uuid}`,
      method: 'DELETE'
    })
  },
  /**
   * @description 查询角色详情 GET /security-system/role/queryRoleDetail/{uuid}
   * @param {Object} uuid
   */
  SYS_ROLE_QUERYROLEDETAIL (uuid) {
    // 接口请求
    return request({
      url: `${moduleName + pre}/queryRoleDetail/${uuid}`,
      method: 'GET'
    })
  },
  /**
   * @description 查询角色列表 POST /security-system/role/queryRoleList
   * @param {Object} {
      "pageNum": 0,
      "pageSize": 0,
      "roleName": "string"
    }
   */
  SYS_ROLE_QUERYROLELIST (data) {
    // 接口请求
    return request({
      url: `${moduleName + pre}/queryRoleList`,
      method: 'POST',
      data
    })
  },
  /**
   * @description 修改角色信息 PUT /security-system/role/updateRole
   * UpdateRoleReq {
dataList (Array[string], optional): 数据权限 ,
menuList (Array[string], optional): 功能菜单权限 ,
remarks (string, optional): 角色描述 ,
roleName (string, optional): 角色名称 ,
uuid (string, optional): 主键ID
}
   */
  SYS_ROLE_UPDATEROLE (data) {
    // 接口请求
    return request({
      url: `${moduleName + pre}/updateRole`,
      method: 'PUT',
      data
    })
  }

})
