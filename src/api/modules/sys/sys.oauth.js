/*
 * @Date: 2020-05-13 14:30:24
 * @LastEditors: songlin
 * @LastEditTime: 2020-07-13 18:07:41
 * @FilePath: \senseIDC-fe\src\api\modules\sys\sys.oauth.js
 */

// 登陆Oauth
const pre = '/oauth'

export default ({ request, mock, requestForMock, tools, moduleName }) => ({
  /**
   * @description 登录POST /oauth/userLogin
   * @param {Object} data 登录携带的信息
   */
  SYS_OAUTH_USERLOGIN (data = {
    password: '',
    username: '',
    verificationCode: ''
  }) {
    // 模拟数据
    mock
      .onAny(/\/userLogin/)
      .reply(config => {
        return tools.responseSuccess({
          token: 'b92a8084862f4d62a34d734dcdb5344d'
        })
      })
    return requestForMock({
      url: `${moduleName + pre}/userLogin`,
      method: 'post',
      data
    })
    // 接口请求
    // return request({
    //   url: `${moduleName + pre}/userLogin`,
    //   method: 'post',
    //   data
    // })
  },
  /**
   * @description 登出
   * @param {Object} token 登录返回的token
   */
  SYS_OAUTH_EXITLOGIN () {
    // 接口请求
    return request({
      url: `${moduleName + pre}/exitLogin`,
      method: 'get'
    })
  },
  /**
   * @description 获取token用户信息
   * @param {Object}
   */
  SYS_OAUTH_GETTOKENUSER() {
    mock
      .onAny(/\/getTokenUser/)
      .reply(config => {
        return tools.responseSuccess({
          userName: 'mock'
        })
      })
    return requestForMock({
      url: `${moduleName + pre}/getTokenUser`,
      method: 'get'
    })
    // 接口请求
    // return request({
    //   url: `${moduleName + pre}/getTokenUser`,
    //   method: 'get'
    // })
  },
  /**
   * @description 验证码
   * @param {Object}
   */
  SYS_OAUTH_QUERYVERIFICATIONCODE () {
    // 接口请求
    return `${process.env.VUE_APP_API + moduleName + pre}/queryVerificationCode`
  }

})
