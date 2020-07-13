/*
 * @Date: 2020-06-23 15:37:48
 * @LastEditors: songlin
 * @LastEditTime: 2020-06-23 15:38:52
 * @FilePath: \senseIDC-fe\src\api\modules\sys\sys.log.js
 */
const pre = '/log'
export default ({ request, requestForMock, mock, tools, moduleName }) => ({
/**
* @description POST /log/queryList 查询操作日志信息
@param {
  Boolean
} QueryLogListReq {
  beginTime (string, optional): 开始时间,
  endTime (string, optional): 结束时间,
  pageNum (integer, optional): 页号, 默认为1,
  pageSize (integer, optional): 页码, 默认为10,
  searchValue (string, optional): 检索内容
}
*/
// 函数名大写+下划线
  SYS_LOG_QUERYLIST (data) {
// 接口请求
return request({
  url: `${moduleName + pre}/queryList`,
method: 'POST',
data
})
}
})
