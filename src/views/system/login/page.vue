<template>
  <div class="page-login d2-flex--justify-center d2-flex--align-center d2-flex--row">
    <div class="page-login--layer">
      <div class="page-login--contract">

        <img class="logo" :src="srcImg(normalLogo)" alt="">

        <div class="copy">
          <div>
            <a>关于我们</a> | 推荐使用Chrome70+ 浏览器 | <a>联系我们</a>
          </div>
          <div>
            Copyright © 2020XX出品
          </div>
        </div>
      </div>
      <div class="page-login--content">

        <div class="page-login--form">
          <div class="page-login--form--title">
            欢迎光临 &nbsp;<span class="name">
              {{companyName}}</span>
          </div>

          <el-card shadow="never">
            <el-form ref="loginForm" label-position="top" :rules="rules" :model="formLogin" size="default">
              <el-form-item prop="username">
                <div class="d2-flex--justify-between d2-flex--align-center">
                  <d2-icon-svg class="input_icon" name="user" />
                  <el-input type="text" v-model="formLogin.username" placeholder="用户名">

                  </el-input>
                </div>

              </el-form-item>
              <el-form-item prop="password">
                <div class="d2-flex--justify-between d2-flex--align-center">

                  <d2-icon-svg class="input_icon" name="password" />
                  <el-input type="password" v-model="formLogin.password" placeholder="密码">

                  </el-input>
                </div>

              </el-form-item>
              <el-form-item prop="verificationCode">
                <div class="d2-flex--justify-between d2-flex--align-center">
                  <d2-icon-svg class="input_icon" name="yzm" />
                  <el-input class="yzm_icon" type="text" v-model="formLogin.verificationCode" placeholder="验证码">
                    <template slot="append">
                      <img class="login-code" @click="refreshCode" :src="codeSrc" />
                    </template>
                  </el-input>
                </div>

              </el-form-item>
              <el-form-item prop="setPsd">
                <div class="d2-flex--justify-between">
                  <el-checkbox v-model="setPsd" style="padding-left:3px">记住密码</el-checkbox>
                  <el-button size="default" @click="forget" type="text">忘记密码？
                  </el-button>
                </div>

              </el-form-item>
              <div class="d2-flex--justify-center" style="margin-top: 80px;">
                <el-button :loading="loading" size="default" @click="submit" type="primary" class="button-login">登录
                </el-button>
              </div>

            </el-form>
          </el-card>
        </div>
      </div>
    </div>

    <el-dialog title="忘记密码" :close-on-click-modal="false" :show-close="true" :visible.sync="forgetVisible" width="400Px"
      :destroy-on-close="true">

      <p class="forget-title">请联系系统管理员：</p>
      <div class="d2-flex--row forget-field">
        <div>管理员姓名：</div>
        <div>{{adminName}}</div>
      </div>
      <div class="d2-flex--row forget-field">
        <div>管理员联系方式：</div>
        <div>{{adminPhone}}</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="forgetVisible=false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import setting from '@/setting.js'
  import { mapActions, mapState } from 'vuex'
  export default {
    computed: {
      ...mapState('myadmin/company', [
        'miniLogo',
        'normalLogo',
        'companyName',
        'adminName',
        'adminPhone'
      ])
    },
    data() {
      return {
        forgetVisible: false,
        loading: false,
        // 验证码
        codeSrc: '',
        setPsd: true,
        // 表单
        formLogin: {
          username: '',
          password: '',
          verificationCode: ''
        },
        // 表单校验
        rules: {
          username: [
            {
              required: true,
              message: '请输入用户名',
              trigger: 'blur'
            }
          ],
          password: [
            {
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            }
          ],
          verificationCode: [
            {
              required: true,
              message: '请输入验证码',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    mounted() {
      this.refreshCode()
    },
    async created() {
      const _this = this
      this.formLogin.username = await this.dbGet({ path: 'setUse' })
      if (await this.dbGet({ path: 'setPsd' })) {
        this.formLogin.password = await this.dbGet({ path: 'setUse' })
        this.setPsd = true
      }
      console.log(this.formLogin)
      document.onkeydown = function (e) {
        var key = window.event.keyCode
        if (key === 13) {
          _this.submit()
        }
      }
    },
    beforeDestroy() {
      document.onkeydown = null
    },
    methods: {
      ...mapActions('myadmin/account', ['login']),
      ...mapActions('myadmin/db', { dbGet: 'get', dbSet: 'set' }),
      refreshCode() {
        this.codeSrc = `${this.$api.SYS_OAUTH_QUERYVERIFICATIONCODE()}?${Date.now()}`
      },

      forget() {
        this.forgetVisible = true
      },
      /**
       * @description 提交表单
       */
      // 提交登录信息
      submit() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            // 登录
            this.login(this.formLogin)
              .then(() => {
                this.dbSet({ path: 'setUse', value: this.formLogin.username })
                // 重定向对象不存在则跳转默认
                this.$router.replace(this.$route.query.redirect || setting.page.opened[0].fullPath)
              })
              .then(() => {
                if (this.setPsd) {
                  this.dbSet({
                    path: 'setPsd',
                    value: this.formLogin.password
                  })
                }
              })
              .catch(() => {
                this.refreshCode()
              })
              .finally(() => {
                this.loading = false
              })
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .page-login {
    height: 100%;
    position: relative;
    background-image: url("../../../assets/loginBg.png");
    background-size: 100% 100%;

    .forget-title {
      text-align: center;
      font-size: 16px;
      font-weight: bold;
      line-height: 16px;
    }

    .forget-field {
      div {
        font-size: 14px;
        line-height: 1.5;
        flex: 1;

        &:first-child {
          text-align: right;
          font-weight: 500;
        }

        &:last-child {
          text-align: left;
          font-weight: 400;
        }
      }
    }

    // 层
    .page-login--layer {
      width: 1363px;
      height: 80vh;
      // background: rgba(255, 255, 255, 1);
      // box-shadow: 0px 8px 24px rgba(32, 21, 118, 0.4);
      overflow: hidden;
      // border-radius: 4px;
      display: flex;
    }

    /* // 登陆页面控件的容器 */
    .page-login--content {
      height: 100%;
      min-height: 500px;
      overflow: hidden;
      flex: 1;
      background: #fff;
      border-radius: 4px;
    }

    .page-login--contract {
      position: relative;
      flex: 0 0 808px;
      // background: url('~@/assets/banner.png') center/100% 100%;
      border-radius: 4px;

      .logo {
        position: absolute;
        left: 48px;
        top: 51px;
        width: 188px;
        height: 58px;
        object-fit: scale-down;
      }

      .copy {
        position: absolute;
        left: 48px;
        bottom: 51px;
        color: #fff;
        font-size: 14px;
        font-weight: 400;
        line-height: 24px;
      }
    }

    /* // main */
    .page-login--content-main {
      height: 85px;
      width: 340px;
      color: #163577;
      margin: 156px auto 0;

      .page-login--cname {
        font-size: 40px;
        letter-spacing: 1px;
      }

      .page-login--ename {
        font-size: 22px;
        letter-spacing: 1.5px;
      }
    }

    /* // 登录表单 */
    .page-login--form {
      &--title {
        margin: 148px 0 64px;
        color: #6778a7;
        font-size: 28px;
        text-align: center;

        .name {
          color: #5662ff;
          font-weight: bold;
        }
      }

      /* // 卡片 */
      .el-card {
        /* padding: 50px 62px; */
        /* box-shadow: 0px 12px 30px rgba(84, 97, 124, 0.2); */
        width: 100%;
        border: 0;

        .el-card__body {
          padding: 0 75px;

          .el-input {
            width: 352px;
          }
        }
      }

      /* // 登录按钮 */
      .button-login {
        width: 232px;
        height: 48px;
        background: linear-gradient(359deg,
            rgba(79, 57, 247, 1) 0%,
            rgba(114, 125, 253, 1) 100%);
        border-radius: 12px;
      }

      /* // 输入框左边的图表区域缩窄 */
      .el-input-group__prepend {
        padding: 0px 14px;
      }

      .el-checkbox__inner {
        border-radius: 50%;
        overflow: hidden;
      }

      .login-code {
        height: 38px;
        display: block;
        margin: 0px -20px;
        border-top-right-radius: 2px;
        border-bottom-right-radius: 2px;
      }

      // 登陆选项
      .page-login--options {
        margin: 0px;
        padding: 0px;
        font-size: 14px;
        color: $color-primary;
        margin-bottom: 15px;
        font-weight: bold;
      }

      .page-login--quick {
        width: 100%;
      }
    }

    // footer
    .page-login--content-footer {
      padding: 1em 0;

      .page-login--content-footer-locales {
        padding: 0px;
        margin: 0px;
        margin-bottom: 15px;
        font-size: 12px;
        line-height: 12px;
        text-align: center;
        color: $color-text-normal;

        a {
          color: $color-text-normal;
          margin: 0 0.5rem;

          &:hover {
            color: $color-text-main;
          }
        }
      }

      .page-login--content-footer-copyright {
        padding: 0px;
        margin: 0px;
        margin-bottom: 10px;
        font-size: 12px;
        line-height: 12px;
        text-align: center;
        color: $color-text-normal;

        a {
          color: $color-text-normal;
        }
      }

      .page-login--content-footer-options {
        padding: 0px;
        margin: 0px;
        font-size: 12px;
        line-height: 12px;
        text-align: center;

        a {
          color: $color-text-normal;
          margin: 0 1em;
        }
      }
    }

    /* // 背景 */
    .circles {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      margin: 0px;
      padding: 0px;

      li {
        position: absolute;
        display: block;
        list-style: none;
        width: 20px;
        height: 20px;
        background: #fff;
        animation: animate 25s linear infinite;
        bottom: -200px;

        @keyframes animate {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
            border-radius: 0;
          }

          100% {
            transform: translateY(-1000px) rotate(720deg);
            opacity: 0;
            border-radius: 50%;
          }
        }

        &:nth-child(1) {
          left: 15%;
          width: 80px;
          height: 80px;
          animation-delay: 0s;
        }

        &:nth-child(2) {
          left: 5%;
          width: 20px;
          height: 20px;
          animation-delay: 2s;
          animation-duration: 12s;
        }

        &:nth-child(3) {
          left: 70%;
          width: 20px;
          height: 20px;
          animation-delay: 4s;
        }

        &:nth-child(4) {
          left: 40%;
          width: 60px;
          height: 60px;
          animation-delay: 0s;
          animation-duration: 18s;
        }

        &:nth-child(5) {
          left: 65%;
          width: 20px;
          height: 20px;
          animation-delay: 0s;
        }

        &:nth-child(6) {
          left: 75%;
          width: 150px;
          height: 150px;
          animation-delay: 3s;
        }

        &:nth-child(7) {
          left: 35%;
          width: 200px;
          height: 200px;
          animation-delay: 7s;
        }

        &:nth-child(8) {
          left: 50%;
          width: 25px;
          height: 25px;
          animation-delay: 15s;
          animation-duration: 45s;
        }

        &:nth-child(9) {
          left: 20%;
          width: 15px;
          height: 15px;
          animation-delay: 2s;
          animation-duration: 35s;
        }

        &:nth-child(10) {
          left: 85%;
          width: 150px;
          height: 150px;
          animation-delay: 0s;
          animation-duration: 11s;
        }
      }
    }
  }

  .i_svg {
    width: 18px;
    height: 18px;
  }

  .wjmm {
    text-align: right;
    font-size: 16px;
    font-weight: 400;
    line-height: 22px;
    color: rgba(130, 139, 149, 1);
    opacity: 1;
  }

  .input_icon {
    width: 32px;
    height: 32px;
    color: #5662ff;
    fill: #5662ff;
  }
</style>
