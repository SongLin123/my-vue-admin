/*
 * @Date: 2020-06-30 12:16:23
 * @LastEditors: songlin
 * @LastEditTime: 2020-06-30 14:43:33
 * @FilePath: \senseIDC-fe\htmlpx-to-rem.js
 */
const loaderUtils = require('loader-utils')
// 默认参数
const defaultsProp = {

  rootValue: 16, // root font-size
  unitPrecision: 5, // numbers after `.`
  minPixelValue: 0
}
const template = /<template>([\s\S]+)<\/template>/gi
const ZPXRegExp = /(\d+)px/
module.exports = function (source) {
  const opts = loaderUtils.getOptions(this)
  const defaults = Object.assign({}, defaultsProp, opts)
  let _source = ''
  if (template.test(source)) {
    _source = source.match(template)[0]
  }
  const pxGlobalRegExp = new RegExp(ZPXRegExp.source, 'ig')
  if (pxGlobalRegExp.test(_source)) {
    const $source = _source.replace(pxGlobalRegExp, createPxReplace(defaults.rootValue, defaults.unitPrecision, defaults.minPixelValue))
    return source.replace(template, $source)
  } else {
    return source
  }
}

function createPxReplace(rootValue, unitPrecision, minPixelValue) {
  return function (m, $1) {
    // ignoring `PX` `Px`
    if (m.indexOf('px') === -1) {
      return m
    }
    if (!$1) {
      return m
    }
    var pixels = parseFloat($1)
    if (pixels < minPixelValue) {
      return m
    }
    return toFixed((pixels / rootValue), unitPrecision) + 'rem'
  }
}

function toFixed(number, precision) {
  var multiplier = Math.pow(10, precision + 1)
    var wholeNumber = Math.floor(number * multiplier)
  return Math.round(wholeNumber / 10) * 10 / multiplier
}
