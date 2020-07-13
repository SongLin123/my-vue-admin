/*
 * @Date: 2020-05-13 14:30:24
 * @LastEditors: songlin
 * @LastEditTime: 2020-07-13 17:13:04
 * @FilePath: \senseIDC-fe\src\components\index.js
 */
import Vue from 'vue'

import d2Container from './d2-container'
import d2ContainerFrame from './d2-container-frame'
import d2LinkBtn from './d2-link-btn'

// 注意 有些组件使用异步加载会有影响
Vue.component('d2-container', d2Container)
Vue.component('d2-container-frame', d2ContainerFrame)
Vue.component('d2-link-btn', d2LinkBtn)
Vue.component('d2-count-up', () => import('./d2-count-up'))
Vue.component('d2-highlight', () => import('./d2-highlight'))
Vue.component('d2-icon', () => import('./d2-icon'))
Vue.component('d2-icon-svg', () => import('./d2-icon-svg/index.vue'))

Vue.component('d2-mde', () => import('./d2-mde'))
Vue.component('d2-module-index-banner', () => import('./d2-module-index-banner'))
Vue.component('d2-module-index-menu', () => import('./d2-module-index-menu'))
// 上传图片
Vue.component('imagecard', () => import('./imagecard'))
// 表格内图片
Vue.component('imagecell', () => import('./imagecell'))

// 表格内tag组
Vue.component('tagGroup', () => import('./tagGroup'))
// 根据值在options里选取lable
Vue.component('optionsTag', () => import('./optionsTag'))
// 修改密码
Vue.component('changepwd', () => import('./changepwd'))
// 树组件
Vue.component('treeNode', () => import('./treeNode'))
// 表格内可点击字段
Vue.component('cellBtn', () => import('./cellBtn'))
// 表格内switch
Vue.component('cellSwitch', () => import('./cellSwitch'))
