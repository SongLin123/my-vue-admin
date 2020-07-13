/*
 * @Date: 2020-06-11 12:21:00
 * @LastEditors: songlin
 * @LastEditTime: 2020-07-09 19:10:18
 * @FilePath: \senseIDC-fe\src\plugin\sentry\index.js
 */
import * as Sentry from '@sentry/browser'
import { Vue as VueIntegration } from '@sentry/integrations'

export default {
  async install(Vue, options) {
    process.env.NODE_ENV === 'production' && Sentry.init({
      // sentry 密钥
      dsn: '',
      integrations: [new VueIntegration({ Vue, attachProps: false, logErrors: process.env.NODE_ENV === 'production' })]

    })
  }
}
