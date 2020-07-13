<!--
 * @Date: 2020-05-28 10:51:23
 * @LastEditors: songlin
 * @LastEditTime: 2020-07-10 17:33:10
 * @FilePath: \senseIDC-fe\src\components\changepwd\index.vue
-->
<template>

  <el-dialog
    title="修改密码"
    :close-on-click-modal="false"
    :show-close="true"
    :visible.sync="visible"
    width="400Px"
    :destroy-on-close="true"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="ruleForm"
    >
      <el-form-item
        label="原密码"
        :label-width="formLabelWidth"
        prop="originalPassword"
      >
        <el-input
          v-model.trim="form.originalPassword"
          placeholder="请输入原密码"
          type="password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="新密码"
        :label-width="formLabelWidth"
        prop="password"
      >
        <el-input
          v-model.trim="form.password"
          type="password"
          placeholder="请输入新密码"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="确认新密码"
        :label-width="formLabelWidth"
        prop="repeat"
      >
        <el-input
          v-model.trim="form.repeat"
          placeholder="请确认新密码"
          type="password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="beforeClose">取 消</el-button>
      <el-button
        type="primary"
        @click="up"
      >确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import { isBoolean } from 'lodash'
  export default {
    props: {
      uuid: {
        require: true
      }
    },
    data() {
      const validatePass = (rule, value, callback) => {
        const pat = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、0-9a-zA-Z]/g
        if (value === '') {
          callback(new Error('请输入密码'))
        } else if (value.length < 6 || value.length > 20) {
          callback(new Error('请输入6-20位的密码'))
        } else if (!pat.test(value)) {
          callback(new Error('仅可输入数字，大小写字母和特殊字符'))
        } else {
          if (this.form.originalPassword !== '') {
            this.$refs.ruleForm.validateField('repeat')
          }
          callback()
        }
      }
      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        formLabelWidth: '28%',
        rules: {
          originalPassword: [
            { message: '请输入原密码', trigger: 'blur', required: true }
          ],
          password: [
            { validator: validatePass, trigger: 'blur', required: true }
          ],
          repeat: [{ validator: validatePass2, trigger: 'blur', required: true }]
        },
        form: {
          repeat: '',
          originalPassword: '',
          password: ''
        }
      }
    },
    computed: {
      visible: {
        get() {
          return !!this.uuid
        },
        set() {
          this.beforeClose()
        }
      }
    },
    methods: {
      beforeClose() {
        this.form = {
          repeat: '',
          originalPassword: '',
          password: ''
        }
        this.$emit('update:uuid', '')
      },
      async up() {
        await this.$refs.ruleForm.validate()
        const form = {
          originalPassword: this.form.originalPassword,
          password: this.form.password
        }
        !isBoolean(this.uuid) && (form.uuid = this.uuid)
        await this.$api.SYS_USER_UPDATEUSERPWD(form)
        this.beforeClose()
        this.$emit('confirm')
      }
    }
  }
</script>
