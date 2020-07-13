<!--
 * @Date: 2020-06-16 17:30:03
 * @LastEditors: songlin
 * @LastEditTime: 2020-07-09 19:06:56
 * @FilePath: \senseIDC-fe\src\layout\header-aside\components\header-alarm\index.vue
-->
<template>
  <el-button
    type="text"
    class=" btn-text can-hover"
    @click="handleClick"
      :title.prop='name | text'

  >
    <el-badge
      :value="count"
      class="d2-pointer"
      :max="99"
    >

      <d2-icon-svg
        :name="name | icon"
        class="lingicon"
      />

    </el-badge>
  </el-button>
</template>

<script>
  export default {
    props: {
      name: {
        type: String
      },
      count: {
        type: Number
      }
    },
    data() {
      return {
        inter: null
      }
    },
    filters: {
      icon(name) {
        switch (name) {
          case 'person':
            return 'ling'
        case 'device':
            return 'offline'
        }
      },
      text(name) {
        switch (name) {
          case 'person':
            return '黑白名单告警'
        case 'device':
            return '设备离线告警'
        }
      }
    },
    created() {

    },
    methods: {

      handleClick() {
        switch (this.name) {
          case 'person':
            this.$router.push('security_alarm_log')
            break
        case 'device':
            this.$router.push('device_alarm_log')
            break
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .lingicon {
    width: 22px;
    height: 22px;
    font-size: 18px;
  }
</style>
