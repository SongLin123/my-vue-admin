<!--
 * @Date: 2020-05-27 17:53:35
 * @LastEditors: songlin
 * @LastEditTime: 2020-07-09 11:14:11
 * @FilePath: \senseIDC-fe\src\components\imagecell\index.vue
-->
<template>
  <el-image :src="srcImg(value)" :style="{width: width, height: height}" :fit="fit" :preview-src-list="[srcImg(value)]"></el-image>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      require: true
    },
    width: {
      type: String,
      default: '100px'
    },
    height: {
      type: String,
      default: '100px'
    },
    fit: {
      type: String,
      default: 'contain'
    }
  },
  computed: {
    // src() {
    //   return process.env.VUE_APP_IMAGE + this.value
    // }
  }
}
</script>
