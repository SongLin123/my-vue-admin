<!--
 * @Date: 2020-06-15 15:00:52
 * @LastEditors: songlin
 * @LastEditTime: 2020-07-10 16:51:57
 * @FilePath: \senseIDC-fe\src\views\system\error\404\index.vue
-->
<template>
  <div class="page">
    <p  class="page_title">404</p>
    <p class="page_title">访问地址出错 或 您没有此页面的访问权限</p>
    <el-button class="d2-mt" @click="$store.dispatch('myadmin/account/logout',{confirm:false})">
      重新登陆
    </el-button>
  </div>
</template>

<style lang="scss" scoped>
.page {
  background: #303133;
  background-blend-mode: multiply,multiply;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .page_title {
    font-size: 20px;
    color: #FFF;
  }
}
</style>
