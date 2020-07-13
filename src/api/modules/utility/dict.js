/*
 * @Date: 2020-05-27 15:41:26
 * @LastEditors: songlin
 * @LastEditTime: 2020-06-29 15:13:38
 * @FilePath: \senseIDC-fe\src\api\modules\sys\sys.dict.js
 */
const pre = '/dict'
export default ({ request, requestForMock, mock, tools, moduleName }) => ({

    // 获取字典  带uuid   GET /dict/queryListByType/{type}
    async SYS_DICT_GETDICTUUID(code) {
        const res = await request({
            url: `${moduleName + pre}/queryListByType/${code}`,
            method: 'GET'
        })
        return res.data.map(item => ({
            uuid: item.uuid,
            label: item.lableDesc,
            value: item.lableValue
        }))
    }
})
