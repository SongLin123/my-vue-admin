/*
 * @Date: 2020-06-23 15:39:08
 * @LastEditors: songlin
 * @LastEditTime: 2020-07-13 14:33:14
 * @FilePath: \senseIDC-fe\src\api\modules\sys\sys.config.js
 */
const pre = '/config'
export default ({ request, requestForMock, mock, tools, moduleName }) => ({
  /**
  * @description PUT /config/editConfig
  修改企业配置
  @param {
    Boolean
  } EditConfigReq {
    enterpriseLogoUrl (string, optional): 企业logo,
    enterpriseName (string, optional): 企业名称,
    enterpriseSmallLogoUrl (string, optional): 企业logo小图,
    manageName (string, optional): 管理员姓名,
    managePhone (string, optional): 管理员电话
  }
  */
  // 函数名大写+下划线
  SYS_CONFIG_EDITCONFIG(data) {
    // 接口请求
    return request({
      url: `${moduleName + pre}/editConfig`,
      method: 'PUT',
      data
    })
  },
  /**
* @description GET /config/queryConfig
查询企业配置
*/
  // 函数名大写+下划线
  SYS_CONFIG_QUERYCONFIG() {
    mock
      .onAny(/\/queryConfig/)
      .reply(config => {
        return tools.responseSuccess({
          enterpriseLogoUrl: '',
          enterpriseName: '',
          enterpriseSmallLogoUrl: '企业logo小图',
          manageName: '管理员姓名',
          managePhone: '管理员电话'
        })
      })
    return requestForMock({
      url: `${moduleName + pre}/queryConfig`,
      method: 'get'
    })
    // 接口请求
    // return request({
    //   url: `${moduleName + pre}/queryConfig`,
    //   method: 'get'

    // })
  }
})
