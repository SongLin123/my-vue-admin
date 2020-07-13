import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router/index'
import { get, isNull, isUndefined } from 'lodash'
import util from '@/libs/util'
import store from '@/store'
import Adapter from 'axios-mock-adapter'

// 创建一个错误
function errorCreate (msg) {
  const error = new Error(msg)
  errorLog(error)
  throw error
}

// 记录和显示错误
function errorLog (error) {
  // 显示提示
  Message({
    message: error.message,
    type: 'error',
    duration: 5 * 1000
  })
}

/**
 * @description 创建请求实例
 */
function createService () {
// 创建一个 axios 实例
const service = axios.create()

// 请求拦截器
service.interceptors.request.use(
  async config => {
    /**
     * @description: 接口使用时添加校验，在前端接口定义时加入需要校验的权限
     * @param {type} {url,permission:[]}
     */
    if (!(await store.dispatch('myadmin/permission/access', config))) {
      // eslint-disable-next-line no-throw-literal
      throw {
        type: '403',
        config: config
      }
    }
    // 在请求发送之前加入headers字段，除了登陆验证码和直接使用全链接的
    if (!(/^https:\/\/|http:\/\//.test(config.url)) && !config.url.includes('/token')) {
      const token = util.cookies.get('token')
      if (token && token !== 'undefined') {
        // 让每个请求携带token
        config.headers.token = token
      }
    }
    return config
  },
  error => {
    // 发送失败
    console.log(error)
    Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // dataAxios 是 axios 返回数据中的 data
    const dataAxios = response.data
    // 这个状态码是和后端约定的
    const { code } = dataAxios
    // 根据 code 进行判断
    if (code === undefined) {
      return dataAxios
    } else {
      // 有 code 代表这是一个后端接口 可以进行进一步的判断
      switch (code) {
        case '0000':
          //  代表没有错误
          // 显示提示
          response.config.showMsg &&
            Message({
              message: '操作成功',
              type: 'success',
              duration: 3 * 1000
            })
          if (isNull(dataAxios.data) || isUndefined(dataAxios.data)) dataAxios.data = {}
          return dataAxios
        case '9999':
          // 不是正确的 code
          errorCreate(`${response.config.url} : ${dataAxios.msg}`)
          break
        case 'xxx':
          // 不是正确的 code
          errorCreate('xxx')
          break
        default:
          // 不是正确的 code
          errorCreate(`${dataAxios.msg}`)
          break
      }
    }
  },
  error => {
    if (error && error.response) {
      switch (error.response.status) {
        case 400: error.message = '请求错误'; break
        case 401:
          error.message = '未授权，请登录'

          util.cookies.remove('token')
          if (error.config.url.indexOf('logout') === -1) {
            error.message = '登陆信息已过期,请重新登陆'
          }
          setTimeout(() => {
            router.push({
              name: 'login'
            })
          }, 1000)

          break
        case 403: error.message = '请求被拒绝'; break
        case 404: error.message = `请求地址出错: ${error.response.config.url}`; break
        case 408: error.message = '请求超时'; break
        case 500: error.message = '服务器内部错误'; break
        case 501: error.message = '服务未实现'; break
        case 502: error.message = '网关错误'; break
        case 503: error.message = '服务不可用'; break
        case 504: error.message = '网关超时'; break
        case 505: error.message = 'HTTP版本不受支持'; break
        default: break
      }
    }
    errorLog(error)
    return Promise.reject(error)
  }
)
return service
}

function createRequestFunction (service) {
   return function (config, opt = { showMsg: false }) {
  const configDefault = {
    headers: {
      'Content-Type': get(config, 'headers.Content-Type', 'application/json')
    },
    timeout: 30 * 1000,
    baseURL: process.env.VUE_APP_API,
    data: {},
    showMsg: opt.showMsg
  }
  return service(Object.assign(configDefault, config))
}
}

// 用于真实网络请求的实例和请求方法
const service = createService()
export const request = createRequestFunction(service)

// 用于模拟网络请求的实例和请求方法
const serviceForMock = createService()
export const requestForMock = createRequestFunction(serviceForMock)

// 网络请求数据模拟工具
export const mock = new Adapter(serviceForMock)
