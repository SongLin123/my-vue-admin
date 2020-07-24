/*
 * @Date: 2020-05-13 14:30:24
 * @LastEditors: songlin
 * @LastEditTime: 2020-07-24 16:09:06
 * @FilePath: \myadmin\dependencies-cdn.js
 */
module.exports = [
  // 在开发时也只能使用cdn加载的包
  { dnsPrefetch: 'https://cdn.jsdelivr.net/', skipBuild: true },
  // { name: 'AMap.js', library: 'AMap', js: 'https://webapi.amap.com/maps?v=1.4.15', css: '', skipBuild: true },

  { name: 'ua-parser-js', library: 'UAParser', js: 'https://cdn.jsdelivr.net/npm/ua-parser-js@0.7.20/dist/ua-parser.min.js', css: '' },
  { name: 'js-cookie', library: 'Cookies', js: 'https://cdn.jsdelivr.net/npm/js-cookie@2.2.1/src/js.cookie.min.js', css: '' },
  { name: 'nprogress', library: 'NProgress', js: 'https://cdn.jsdelivr.net/npm/nprogress@0.2.0/nprogress.min.js', css: 'https://cdn.jsdelivr.net/npm/nprogress@0.2.0/nprogress.css' },
  { name: 'dayjs', library: 'dayjs', js: 'https://cdn.jsdelivr.net/npm/dayjs@1.8.17/dayjs.min.js', css: '' },
  { name: 'fuse.js', library: 'Fuse', js: 'https://cdn.jsdelivr.net/npm/fuse.js@5.2.3/dist/fuse.min.js', css: '' },
  { name: 'hotkeys-js', library: 'hotkeys', js: 'https://cdn.jsdelivr.net/npm/hotkeys-js@3.7.3/dist/hotkeys.min.js', css: '' },
  { name: 'lowdb', library: 'low', js: 'https://cdn.jsdelivr.net/npm/lowdb@1.0.0/dist/low.min.js', css: '' },
  { name: 'lowdb/adapters/LocalStorage', library: 'LocalStorage', js: 'https://cdn.jsdelivr.net/npm/lowdb@1.0.0/dist/LocalStorage.min.js', css: '' },
  { name: 'screenfull', library: 'screenfull', js: 'https://cdn.jsdelivr.net/npm/screenfull@5.0.2/dist/screenfull.min.js', css: '' },
  { name: 'sortablejs', library: 'Sortable', js: 'https://cdn.jsdelivr.net/npm/sortablejs@1.10.1/Sortable.min.js', css: '' },
  { name: 'echarts', library: 'echarts', js: 'https://cdn.jsdelivr.net/npm/echarts@4.5.0/dist/echarts.min.js' },
  { name: 'v-charts', library: 'VeIndex', js: 'https://cdn.jsdelivr.net/npm/v-charts@1.19.0/lib/index.min.js', css: 'https://cdn.jsdelivr.net/npm/v-charts@1.19.0/lib/style.min.css' },

  { name: 'quill', library: 'Quill', js: 'https://cdn.jsdelivr.net/npm/quill@1.3.7/dist/quill.min.js', css: '' },
  { name: 'simplemde', library: 'SimpleMDE', js: 'https://cdn.jsdelivr.net/npm/simplemde@1.11.2/dist/simplemde.min.js', css: 'https://cdn.jsdelivr.net/npm/simplemde@1.11.2/dist/simplemde.min.css' },
  { name: 'vue-json-tree-view', library: 'TreeView', js: 'https://cdn.jsdelivr.net/npm/vue-json-tree-view@2.1.4/dist/vue-json-tree-view.min.js', css: '' }
]
