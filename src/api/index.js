/*
 * @Date: 2020-05-13 14:30:24
 * @LastEditors: songlin
 * @LastEditTime: 2020-05-27 13:47:00
 * @FilePath: \d2-admin\src\api\index.js
 */
import { assign, map, concat } from 'lodash'
import { request, mock, requestForMock } from './service'
import * as tools from './tools'

const files = require.context('./modules', true, /index\.js$/)
const generators = files.keys().map(key => files(key).default)

export default assign({},
  ...concat(...map(generators, funs => funs({
    request,
    mock,
    requestForMock,
    tools
  })))
)
