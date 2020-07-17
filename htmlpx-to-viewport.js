/*
 * @Date: 2020-06-30 12:16:23
 * @LastEditors: songlin
 * @LastEditTime: 2020-07-17 15:32:21
 * @FilePath: \myadmin\htmlpx-to-viewport.js
 */
const loaderUtils = require('loader-utils')
// 默认参数
const defaultsProp = {
  unitToConvert: 'px',
  viewportWidth: 1920,
  unitPrecision: 6,
  // propList: ['*'],// TODO
  viewportUnit: 'vw',
  minPixelValue: 0
  // landscapeUnit: 'vw', // TODO
  // landscapeWidth: 568 // TODO
}
const template = /<template>([\s\S]+)<\/template>/gi

function ZPXRegExp(unit) {
  return new RegExp('"[^"]+"|\'[^\']+\'|url\\([^\\)]+\\)|(\\d*\\.?\\d+)' + unit, 'g')
}
module.exports = function (source) {
  const opts = loaderUtils.getOptions(this)
  const defaults = Object.assign({}, defaultsProp, opts)
  let _source = ''
  if (template.test(source)) {
    _source = source.match(template)[0]
  }
  const pxGlobalRegExp = ZPXRegExp(defaults.unitToConvert)
  if (pxGlobalRegExp.test(_source)) {
    const $source = _source.replace(pxGlobalRegExp, createPxReplace(defaults, defaults.unitToConvert, defaults.viewportWidth))
    return source.replace(template, $source)
  } else {
    return source
  }
}

function createPxReplace(opts, viewportUnit, viewportSize) {
  return function (m, $1) {
    // ignoring `PX` `Px`
    if (m.indexOf('px') === -1) {
      return m
    }
    if (!$1) return m
    var pixels = parseFloat($1)
    if (pixels <= opts.minPixelValue) return m
    var parsedVal = toFixed((pixels / viewportSize * 100), opts.unitPrecision)
    return parsedVal === 0 ? '0' : parsedVal + viewportUnit
  }
}

function toFixed(number, precision) {
  var multiplier = Math.pow(10, precision + 1)
  var wholeNumber = Math.floor(number * multiplier)
  return Math.round(wholeNumber / 10) * 10 / multiplier
}
