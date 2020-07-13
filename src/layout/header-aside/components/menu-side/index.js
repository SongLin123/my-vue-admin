/*
 * @Date: 2020-05-13 14:30:24
 * @LastEditors: songlin
 * @LastEditTime: 2020-07-13 17:16:45
 * @FilePath: \senseIDC-fe\src\layout\header-aside\components\menu-side\index.js
 */
import { mapState } from 'vuex'
import menuMixin from '../mixin/menu'
import { elMenuItem, elSubmenu } from '../libs/util.menu'
import BScroll from 'better-scroll'

export default {
  name: 'd2-layout-header-aside-menu-side',
  mixins: [
    menuMixin
  ],
  render (h) {
    return h('div', { attrs: { class: 'd2-layout-header-aside-menu-side' } }, [
      h('el-menu', {
        props: {
          collapse: this.asideCollapse,
          collapseTransition: this.asideTransition,
          uniqueOpened: true,
          defaultActive: this.$route.fullPath
        },
        ref: 'menu',
        on: { select: this.handleMenuSelect }
      }, this.aside.map(menu => (menu.children === undefined ? elMenuItem : elSubmenu).call(this, h, menu))),
      []
    ])
  },
  data () {
    return {
      BS: null
    }
  },
  computed: {
    ...mapState('myadmin/menu', [
      'aside',
      'asideCollapse',
      'asideTransition'
    ])
  },
  watch: {
    // 折叠和展开菜单的时候销毁 better scroll
    asideCollapse (val) {
      this.scrollDestroy()
      setTimeout(() => {
        this.scrollInit()
      }, 500)
    }
  },
  mounted () {
    this.scrollInit()
  },
  beforeDestroy () {
    this.scrollDestroy()
  },
  methods: {
    scrollInit () {
      this.BS = new BScroll(this.$el, {
        mouseWheel: true,
        click: true,
        // 如果你愿意可以打开显示滚动条
        scrollbar: {
          fade: true,
          interactive: true
        }
      })
    },
    scrollDestroy () {
      // https://github.com/d2-projects/d2-admin/issues/75
      try {
        this.BS.destroy()
      } catch (e) {
        delete this.BS
        this.BS = null
      }
    }
  }
}
