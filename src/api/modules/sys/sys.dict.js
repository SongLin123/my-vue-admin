/*
 * @Date: 2020-05-27 15:41:26
 * @LastEditors: songlin
 * @LastEditTime: 2020-06-29 15:13:38
 * @FilePath: \senseIDC-fe\src\api\modules\sys\sys.dict.js
 */
const pre = '/dict'
export default ({ request, requestForMock, mock, tools, moduleName }) => ({
  /**
  * @description GET /dict/getDict/{code}
  查询字典
  特例，直接返回[{label,value}]
  */
  async SYS_DICT_GETDICT(code) {
    const res = await request({
      url: `${moduleName + pre}/getDict/${code}`,
      method: 'GET'
    })
    return res.data.map(item => ({
      label: item.lableDesc,
      value: item.lableValue
    }))
  }
})
