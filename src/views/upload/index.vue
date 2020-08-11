<!--
 * @Date: 2020-05-13 14:30:24
 * @LastEditors: songlin
 * @LastEditTime: 2020-08-05 15:14:52
 * @FilePath: \myadmin\src\views\upload\index.vue
 -->
<template>
  <d2-container>
    <div class="upload">
      <upcom :value="value" :imageType="imageType"></upcom>

    </div>

  </d2-container>
</template>

<script>
  import upcom from '@/components/upload/index.vue'
  export default {

    components: { upcom },
    data() {
      return {
        value: 'sdsad',
        imageType: 'sdsad'
      }
    }
  }
</script>
<style lang="scss" scoped>
  .upload {
    width: 300px;
    height: 200px;
  }
</style>
