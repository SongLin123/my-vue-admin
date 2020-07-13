<template>
  <div
    class="d2-layout-header-aside-group"
    :style="styleLayoutMainGroup"
    :class="{grayMode: grayActive}"
  >
    <!-- 半透明遮罩 -->
    <div class="d2-layout-header-aside-mask"></div>
    <!-- 主体内容 -->
    <div
      class="d2-layout-header-aside-content"
      flex="dir:left"
    >
      <!-- 主体 侧边栏 -->
      <div
        flex="dir:top"
        flex-box="0"
        ref="aside"
        :class="{'d2-theme-aside': true, 'd2-theme-container-transition': asideTransition}"
        :style="{
            width: asideCollapse ? asideWidthCollapse : asideWidth,
            opacity: this.searchActive ? 0.5 : 1
          }"
      >
        <!-- 主题包含的logo -->
        <a
          :class="{'logo-group': true, 'logo-transition': asideTransition}"
          :style="{width: asideCollapse ? asideWidthCollapse : asideWidth}"
          flex-box="0"
        >
          <img
            v-if="asideCollapse"
            class="collapse"
            :src="srcImg(miniLogo)"
          >
          <img
            v-else
            :src="srcImg(normalLogo)"
          >
        </a>
        <div
          class="toggle-aside-btn"
          :class="{'collapsed':asideCollapse}"
          @click="handleToggleAside"
        >
          <d2-icon-svg name="suo" />
        </div>
        <div
          flex-box="1"
          class="menu"
        >
          <d2-menu-side />

        </div>

      </div>

      <!-- 下面 主体 -->
      <div
        class="d2-theme-container"
        flex-box="1"
        flex="dir:top"
      >
        <!-- 顶栏 -->
        <div
          class="d2-theme-header"
          :style="{ opacity: this.searchActive ? 0.5 : 1 }"
          flex-box="0"
          flex="main:justify"
        >

          <!-- 顶栏左侧 -->
          <div
            class="d2-header-left"
            flex-box="0"
          >
            <header-alarm name='person'/>
            <header-alarm name='device' />
          </div>

          <d2-menu-header flex-box="1" />
          <!-- 顶栏右侧 -->
          <div
            class="d2-header-right"
            flex-box="0"
          >
            <!-- 如果你只想在开发环境显示这个按钮请添加 v-if="$env.NODE_ENV === 'development'" -->
            <d2-header-search
              @click="handleSearchClick"
              v-if="$env.NODE_ENV === 'development'"
            />
            <d2-header-fullscreen v-if="$env.NODE_ENV === 'development'" />
            <d2-header-theme v-if="$env.NODE_ENV === 'development'" />
            <d2-header-size v-if="$env.NODE_ENV === 'development'" />
            <d2-header-color v-if="$env.NODE_ENV === 'development'" />
            <d2-header-user />
          </div>
        </div>
        <!-- 主体 -->
        <div
          class="d2-theme-container-main"
          flex-box="1"
          flex
        >
          <!-- 搜索 -->
          <transition name="fade-scale">
            <div
              v-if="searchActive"
              class="d2-theme-container-main-layer"
              flex
            >
              <d2-panel-search
                ref="panelSearch"
                @close="searchPanelClose"
              />
            </div>
          </transition>
          <!-- 内容 -->
          <transition name="fade-scale">
            <div
              v-if="!searchActive"
              class="d2-theme-container-main-layer"
              flex="dir:top"
            >
              <!-- tab -->
              <div
                v-if="hastab"
                class="d2-theme-container-main-header"
                flex-box="0"
              >
                <d2-tabs />
              </div>
              <!-- 页面 -->
              <div
                class="d2-theme-container-main-body"
                flex-box="1"
              >
                <transition :name="transitionActive ? 'fade-transverse' : ''">
                  <keep-alive :include="keepAlive">
                    <router-view />
                  </keep-alive>
                </transition>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import d2MenuSide from './components/menu-side'
  import d2MenuHeader from './components/menu-header'
  import d2Tabs from './components/tabs'
  import d2HeaderFullscreen from './components/header-fullscreen'
  import d2HeaderSearch from './components/header-search'
  import HeaderAlarm from './components/header-alarm'
  import d2HeaderSize from './components/header-size'
  import d2HeaderTheme from './components/header-theme'
  import d2HeaderUser from './components/header-user'
  import d2HeaderColor from './components/header-color'
  import { mapState, mapGetters, mapActions } from 'vuex'
  import mixinSearch from './mixins/search'

  import setting from '@/setting.js'

  import * as moment from 'moment'

  export default {
    name: 'd2-layout-header-aside',
    mixins: [mixinSearch],
    components: {
      d2MenuSide,
      d2MenuHeader,
      d2Tabs,
      d2HeaderFullscreen,
      d2HeaderSearch,
      d2HeaderSize,
      d2HeaderTheme,
      d2HeaderUser,
      d2HeaderColor,
      HeaderAlarm
    },
    data() {
      return {
        // [侧边栏宽度] 正常状态
        asideWidth: '14.5rem',
        // [侧边栏宽度] 折叠状态
        asideWidthCollapse: '4.1rem',
        hastab: setting.tab // 显示tab
      }
    },
    computed: {
      ...mapState('myadmin', {
        keepAlive: state => state.page.keepAlive,
        grayActive: state => state.gray.active,
        transitionActive: state => state.transition.active,
        asideCollapse: state => state.menu.asideCollapse,
        asideTransition: state => state.menu.asideTransition
      }),
      ...mapState('myadmin/company', [
        'miniLogo',
        'normalLogo',
        'companyName',
        'adminName',
        'adminPhone'
      ]),
      ...mapGetters('myadmin', {
        themeActiveSetting: 'theme/activeSetting'
      }),
      /**
       * @description 最外层容器的背景图片样式
       */
      styleLayoutMainGroup() {
        return this.themeActiveSetting.backgroundImage
          ? {
              backgroundImage: `url('${this.$baseUrl}${this.themeActiveSetting.backgroundImage}')`
            }
          : {}
      }
    },
    methods: {
      ...mapActions('myadmin/menu', ['asideCollapseToggle']),
      ...mapActions('myadmin/company', {
        loadConfig: 'load'
      }),

      /**
       * 接收点击切换侧边栏的按钮
       */
      handleToggleAside() {
        this.asideCollapseToggle()
      }
    }
  }
</script>

<style lang="scss">
  // 注册主题
  @import "~@/assets/style/theme/register.scss";
  .menu {
    > div {
      height: 65vh;
      overflow-y: hidden;
    }
  }
  .notification {
    z-index: $z-side !important;
  }
  .time {
    color: teal;
    position: absolute;
    top: 16px;
    right: 15%;
  }
</style>
