/*
 * @Date: 2020-05-29 15:06:34
 * @LastEditors: songlin
 * @LastEditTime: 2020-05-29 15:07:19
 * @FilePath: \d2-admin\src\api\modules\utility\index.js
 */
const files = require.context('./', false, /\.js$/)
const apis = files.keys().filter((key) => !key.includes('index.js')).map(key => files(key).default)

const moduleName = '/idc-utility'

export default ({
  request,
  tools,
  requestForMock
}) => apis.map(api => api({
  request,
  tools,
  moduleName,
  requestForMock
}))
