/*
 * @Date: 2020-07-06 14:32:22
 * @LastEditors: songlin
 * @desc:字典方法封装
 * @LastEditTime: 2020-07-24 15:16:24
 * @FilePath: \myadmin\src\api\dictEnum.js
 */
// import api from '@/api'
// // 首次使用是从后端获取数据,通过闭包保存数据
// function c(name) {
//   let v = []
//   return async () => {
//     if (v.length > 0) {
//       return v
//     } else {
//       v = await api.SYS_DICT_GETDICT(name)
//       return v
//     }
//   }
// }
export default {
  PERSON_SEX: () => Promise.resolve([
    { label: '男', value: '1' },
    { label: '女', value: '2' }
  ])
  // PERSON_TYPE: c('person_type'), // 字典类型
}
