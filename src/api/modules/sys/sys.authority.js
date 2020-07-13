/*
 * @Date: 2020-06-22 11:43:28
 * @LastEditors: songlin
 * @LastEditTime: 2020-06-22 11:50:56
 * @FilePath: \senseIDC-fe\src\api\modules\sys\sys.authority.js
 */
const pre = '/authority'
export default ({ request, requestForMock, mock, tools, moduleName }) => ({
  /**
  * @description GET /authority/queryDataAuthorityList 查询所有的数据权限
  @param {Boolean} data 参数示例
  */
  // 函数名大写+下划线
  SYS_AUTHORITY_QUERYDATAAUTHORITYLIST() {
    // 接口请求
    return request({
      url: `${moduleName + pre}/queryDataAuthorityList`,
      method: 'get'
    })
  }
})
