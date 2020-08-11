/*
 * @Date: 2020-06-30 10:18:32
 * @LastEditors: songlin
 * @LastEditTime: 2020-08-05 15:06:00
 * @FilePath: \myadmin\src\rem.js
 */
const baseSize = 16
// 设置 rem 函数
function setRem() {
  // 当前页面宽度相对于 1920 宽的缩放比例，可根据自己需要修改。
  const scale = document.documentElement.clientWidth / 1920
  // 设置页面根节点字体大小
  document.documentElement.style.fontSize = (baseSize * Math.min(scale, 2)) + 'px'
}
// 初始化
setRem()
// 改变窗口大小时重新设置 rem
window.onresize = function () {
  setRem()
}
