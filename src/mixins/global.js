/*
 * @Date: 2020-06-04 17:43:17
 * @LastEditors: songlin
 * @LastEditTime: 2020-07-09 11:12:20
 * @FilePath: \senseIDC-fe\src\mixins\global.js
 */
// 字典枚举
import dict from '@/api/dictEnum'
export default {
  data() {
    return {
      dict,
      d2Options: {
        stripe: true,
        tooltipEffect: 'light'
      },
      d2IndexRow: {
        title: '序号',
        // fixed: true,
        align: 'center'
      }
    }
  },
  methods: {
    srcImg(uri) {
      return process.env.VUE_APP_IMAGE + uri
    }
  }

}
