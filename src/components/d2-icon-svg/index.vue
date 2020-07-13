<!--
 * @Date: 2020-06-15 15:00:48
 * @LastEditors: songlin
 * @LastEditTime: 2020-06-18 17:58:53
 * @FilePath: \senseIDC-fe\src\components\d2-icon-svg\index.vue
-->
<template>
  <svg aria-hidden="true" class="icon">
    <use :xlink:href="icon"></use>
  </svg>
</template>

<script>
export default {
  name: 'd2-icon-svg',
  props: {
    name: {
      type: String,
      required: true
    }
  },
  computed: {
    icon () {
      return `#d2-${this.name}`
    }
  }
}
</script>
<style lang="scss" scoped>
.icon{
  // width: 20px;
  // height: 20px;
}
</style>
