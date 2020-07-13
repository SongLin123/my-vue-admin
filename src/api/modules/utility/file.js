/*
 * @Date: 2020-05-29 15:08:09
 * @LastEditors: songlin
 * @LastEditTime: 2020-06-23 17:00:45
 * @FilePath: \senseIDC-fe\src\api\modules\utility\file.js
 */
const pre = '/file'
export default ({ request, requestForMock, mock, tools, moduleName }) => ({
  /**
  * @description 图片上传  POST /file/uploadPic
  @param {Boolean} data 文件
  */
  // 函数名大写+下划线
  UTILITY_FILE_UPLOADPIC(data, type) {
    // 接口请求
    return request({
      url: `${moduleName + pre}/uploadImg?type=${type || 'default'}`,
      method: 'POST',
      headers: {
        'Content-Type': '"application/x-www-form-urlencoded;charset=utf-8"'
      },
      data
    })
  }
})
