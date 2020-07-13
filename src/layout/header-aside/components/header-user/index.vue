<!--
 * @Date: 2020-06-15 15:00:49
 * @LastEditors: songlin
 * @LastEditTime: 2020-07-10 16:36:09
 * @FilePath: \senseIDC-fe\src\layout\header-aside\components\header-user\index.vue
-->
<template>
  <el-dropdown
    size="small"
    class="d2-mr"
  >
    <span class="d2-flex--align-center">
      <el-avatar
        class="tagAvatar"
        v-if="info.name"
      > {{info.name.charAt()}} </el-avatar>
      <span class="btn-text">{{info.name ? `${info.name}` : '未登录'}}</span>
    </span>

    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item @click.native="changepwdUuid=true">
        <d2-icon
          name="user"
          class="d2-mr-5"
        />
        修改密码
      </el-dropdown-item>
      <el-dropdown-item @click.native="logOff">
        <d2-icon
          name="power-off"
          class="d2-mr-5"
        />
        注销
      </el-dropdown-item>
    </el-dropdown-menu>
    <changepwd
      :uuid.sync="changepwdUuid"
      @confirm="confirm"
    ></changepwd>

  </el-dropdown>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  export default {
    data() {
      return {
        changepwdUuid: ''
      }
    },
    computed: {
      ...mapState('myadmin/user', ['info'])
    },
    methods: {
      ...mapActions('myadmin/account', ['logout']),
      confirm() {
        setTimeout(() => {
          this.logout({
            confirm: false
          })
        }, 3000)
        this.$message({
          message: '您已成功修改密码，请重新登录!',
          type: 'warning',
          center: true,
          offset: 300,
          duration: 3000
        })
      },
      /**
       * @description 登出
       */
      logOff() {
        this.logout({
          confirm: true
        })
      }
    }
  }
</script>
