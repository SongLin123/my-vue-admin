<!--
 * @Date: 2020-06-19 11:03:07
 * @LastEditors: songlin
 * @LastEditTime: 2020-07-10 17:30:14
 * @FilePath: \senseIDC-fe\src\views\system\company\index.vue
-->
<template>
  <d2-container>
    <div flex="main:center" style="margin-top:60px">
      <el-form
        ref="form"
        :model="form"
        class="form"
        label-width="150px"
        :rules="rules"
      >

        <el-form-item label="企业logo">
          <el-col :span="24">
            <imagecard
            :imageType="'person'"
              class="nlogo d2-mb"
              @input="setnormalLogo"
              :value="nlogo"
            ></imagecard>
          </el-col>
          <el-col
            class="hint d2-mb"
            :span="24"
          >
            <div>用于完整版标题栏显示。大小比例 160 px * 40 px，</div>
            <div>支持PNG、JPG格式</div>

          </el-col>
          <el-col :span="24">
            <imagecard
              :value="mlogo"
              :imageType="'person'"
              class="mlogo d2-mb"
              @input="setminiLogo"
            ></imagecard>
          </el-col>
          <el-col
            class="hint d2-mb"
            :span="24"
          >
            <div>用于缩略版标题栏显示。大小比例 48 px * 48 px，</div>
            <div>支持PNG、JPG格式</div>

          </el-col>
        </el-form-item>
        <el-form-item label="企业名称：">
          <el-input
            v-model.trim="form.companyName"
            placeholder="请填写企业名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="管理员姓名：" prop="adminName">
          <el-input
          :maxlength="12"
            v-model.trim="form.adminName"
            placeholder="请填写管理员姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="管理员联系方式：" prop="adminPhone">
          <el-input
            v-model="form.adminPhone"
            placeholder="请填写管理员联系方式"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmit"
            :loading="loading"
          >确定</el-button>
        </el-form-item>
      </el-form>
    </div>

  </d2-container>
</template>
<script>
  import { mapState, mapActions } from 'vuex'
  export default {
    computed: {
      ...mapState('myadmin/company', ['miniLogo',
    'normalLogo',
    'companyName',
    'adminName',
    'adminPhone'])
    },
    data() {
      const validatePass = (rule, value, callback) => {
        const pat = /^[0-9]+$/
        if (value === '') {
          callback(new Error('请输入联系方式'))
        } else if (!pat.test(value)) {
          callback(new Error('仅可输入数字'))
        } else {
          callback()
        }
      }
      return {
        loading: false,
        form: {
          companyName: '',
          adminName: '',
          adminPhone: ''
        },
        nlogo: '',
        mlogo: '',
        rules: {

          adminName: [
            { message: '请输入管理员姓名', trigger: 'blur', required: true }
          ],
          adminPhone: [{ validator: validatePass, trigger: 'blur', required: true }]
        }
      }
    },
    mounted() {
      this.nlogo = this.normalLogo
      this.mlogo = this.miniLogo
      this.form.companyName = this.companyName
      this.form.adminName = this.adminName
      this.form.adminPhone = this.adminPhone
    },
    methods: {
      ...mapActions('myadmin/company', { load: 'load' }),
      setnormalLogo(data) {
        this.nlogo = data
      },
      setminiLogo(data) {
        this.mlogo = data
      },
      async onSubmit() {
        this.loading = true
        const par = {
          enterpriseLogoUrl: this.nlogo,
          enterpriseSmallLogoUrl: this.mlogo,
          enterpriseName: this.form.companyName,
          manageName: this.form.adminName,
          managePhone: this.form.adminPhone
        }
        try {
          await this.$refs.form.validate()
          await this.$api.SYS_CONFIG_EDITCONFIG(par)
          this.$message({
            message: '信息修改成功',
            type: 'success'
          })
          this.load()
        } finally {
          this.loading = false
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .form {
    flex: 0 0 525px;
    .hint {
      color: #9dacca;
      font-size: 12px;
      line-height: 22px;
    }
    .nlogo {
      width: 384px;
      height: 96px;
    }
    .mlogo {
      width: 96px;
      height: 96px;
    }
    .el-input {
      width: 224px;
    }
  }
</style>
