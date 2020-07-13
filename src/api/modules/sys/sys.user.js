/*
 * @Date: 2020-05-13 14:30:24
 * @LastEditors: songlin
 * @LastEditTime: 2020-05-27 11:31:13
 * @FilePath: \d2-admin\src\api\modules\sys\sys.user.js
 */

// 系统用户管理
const pre = '/user'

export default ({ request, mock, requestForMock, tools, moduleName }) => ({
  /**
   * @description 新增用户 POST /security-system/user/addUser
   * @param {Object} data {
  "email": "string",
  "name": "string",
  "password": "string",
  "phone": "string",
  "roleUuid": "string",
  "status": 0,
  "username": "string"
}
   */
  SYS_USER_ADDUSER (data = {
}) {
    // 接口请求
    return request({
      url: `${moduleName + pre}/addUser`,
      method: 'post',
      data
    })
  },
  /**
   * @description 删除用户信息 DELETE /security-system/user/deleteUser/{uuid}
   * @param {Object} uuid
   */
  SYS_USER_DELETEUSER (uuid) {
    // 接口请求
    return request({
      url: `${moduleName + pre}/deleteUser/${uuid}`,
      method: 'DELETE'
    })
  },
  /**
   * @description 通过用户名获取用户信息 GET /security-system/user/queryUserByName
   * @param {Object} username
   */
  SYS_USER_QUERYUSERBYNAME (username) {
    // 接口请求
    return request({
      url: `${moduleName + pre}/getTokenUser`,
      method: 'get',
      params: { username }
    })
  },
  /**
   * @description 查询用户详情 GET /security-system/user/queryUserDetail/{uuid}
   * @param {Object} uuid
   */
  SYS_USER_QUERYUSERDETAIL (uuid) {
    // 接口请求
    return request({
      url: `${moduleName + pre}/queryUserDetail/${uuid}`,
      method: 'get'
    })
  },
  /**
   * @description 查询用户列表 POST /security-system/user/queryUserList
   * @param {Object} {
      "beginTime": "string",
      "endTime": "string",
      "pageNum": 0,
      "pageSize": 0,
      "searchValue": "string",
      "status": 0
    }
   */
  SYS_USER_QUERYUSERLIST (data) {
    // 接口请求
    return request({
      url: `${moduleName + pre}/queryUserList`,
      method: 'POST',
      data
    })
  },
  /**
   * @description 修改用户信息 PUT /security-system/user/updateUser
   * @param {Object} {
  "email": "string",
  "name": "string",
  "password": "string",
  "phone": "string",
  "roleUuid": "string",
  "status": 0,
  "uuid": "string"
}
   */
  SYS_USER_UPDATEUSER (data) {
    // 接口请求
    return request({
      url: `${moduleName + pre}/updateUser`,
      method: 'PUT',
      data
    })
  },
  /**
   * @description 修改用户密码 PUT /security-system/user/updateUserPwd
   * @param {Object} {
  "originalPassword": "string",
  "password": "string",
  "uuid": "string"
}
   */
  SYS_USER_UPDATEUSERPWD (data) {
    // 接口请求
    return request({
      url: `${moduleName + pre}/updateUserPwd`,
      method: 'PUT',
      data
    })
  },
  /**
   * @description 修改用户状态 停用/启用 PUT /security-system/user/updateUserStatus
   * @param {Object} {
  "status": 0,
  "uuid": "string"
}
   */
  SYS_USER_UPDATEUSERSTATUS (data) {
    // 接口请求
    return request({
      url: `${moduleName + pre}/updateUserStatus`,
      method: 'PUT',
      data
    })
  }

})
