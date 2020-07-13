/*
 * @Date: 2020-05-20 17:28:20
 * @LastEditors: songlin
 * @LastEditTime: 2020-06-18 14:46:21
 * @FilePath: \senseIDC-fe\src\api\modules\sys\index.js
 */

const files = require.context('./', false, /\.js$/)

const moduleName = '/idc-system'

const apis = files.keys().filter((key) => !key.includes('index.js')).map(key => files(key).default)

export default ({
  request,
  mock,
  requestForMock,
  tools
}) => apis.map(api => api({
  request,
  tools,
  mock,
  requestForMock,
  moduleName
}))
