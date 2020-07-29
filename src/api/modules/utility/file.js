/*
 * @Date: 2020-05-29 15:08:09
 * @LastEditors: songlin
 * @LastEditTime: 2020-07-27 20:58:48
 * @FilePath: \myadmin\src\api\modules\utility\file.js
 */
const pre = '/file'
export default ({ request, requestForMock, mock, tools, moduleName }) => ({
  /**
  * @description 图片上传  POST /file/uploadPic
  @param {Boolean} data 文件
  */
  // 函数名大写+下划线
  UTILITY_FILE_UPLOADPIC({ body, params }) {
    // 接口请求
    return request({
      url: `${moduleName + pre}/uploadImg`,
      params,
      method: 'POST',
      headers: {
        'Content-Type': '"application/x-www-form-urlencoded;charset=utf-8"'
      },
      body
    })
  },
  /**
* @description 切片上传  POST /file/uploadPic
@param {
  type:'default'
}
@body {
  fileName:md5_chunkIndex
  chunk:fileChunk
}
*/
  // 函数名大写+下划线
  UTILITY_FILE_UPLOADCHUNK({ body, params }) {
    // 接口请求
    return request({
      url: `${moduleName + pre}/chunk`,
      params,
      method: 'POST',
      data: body
    })
  },
  /**
* @description 合并  POST /file/uploadPic
@param {Boolean} {
 fileName: md5.suffix,
}
*/
  // 函数名大写+下划线
  UTILITY_FILE_UPLOADMERGE({ body, params }) {
    // 接口请求
    return request({
      url: `${moduleName + pre}/merge`,
      params,
      method: 'get'
    })
  }
})
