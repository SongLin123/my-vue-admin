<!--
 * @Date: 2020-05-13 14:30:24
 * @LastEditors: songlin
 * @LastEditTime: 2020-07-10 17:38:17
 * @FilePath: \senseIDC-fe\src\views\system\user\index.vue
-->
<template>
  <d2-container>
    <d2-crud
      ref="d2Crud"
      add-width="400px"
      edit-width="400px"
      :columns="columns"
      :data="data"
      add-title="新增账号"
      edit-title="编辑账号"
      :add-template="addTemplate"
      :rowHandle="rowHandle"
      :loading="loading"
      :pagination="pagination"
      :edit-template="editTemplate"
      :form-options="formOptions"
      @row-edit="handleEdit"
      @row-add="handleAdd"
      @row-remove="handleRemove"
      @dialog-cancel="handleDialogCancel"
      @changepwd="changepwd"
      :add-rules="addRules"
      :edit-rules="addRules"
      @pagination-size-change="pageSizeChange"
      @pagination-current-change="currentPageChange"
    >

      <template #header>
        <div
          class="d2-mb"
          flex="main:justify cross:center"
        >
          <el-input
            placeholder="请输入姓名、用户名"
            v-model="form.searchValue"
            clearable
            class="input-with-select"
            @change="fetchData"
          >
            <el-button
              :loading="loading"
              slot="append"
              icon="el-icon-search"
              @click="fetchData"
            ></el-button>
          </el-input>

          <el-button
            class="svgButton"
            type="primary"
            :loading="loading"
            @click="addUser"
          >

            <d2-icon-svg
              name="zu14750"
              width="14px"
              height="14px"
            />
            新增账号

          </el-button>
        </div>

      </template>
    </d2-crud>
    <changepwd :uuid.sync="changepwdUuid"></changepwd>
  </d2-container>
</template>

<script>
  import switchButton from './components/switchButton.vue'
  import selectRole from './components/selectRole.vue'
  import page from '@/mixins/pages.js'
  export default {
    mixins: [page],
    components: {},
    data() {
      const validatePass = (rule, value, callback) => {
        const pat = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、0-9a-zA-Z]/g
        if (value === '') {
          callback()
        } else if (value.length < 6 || value.length > 20) {
          callback(new Error('请输入6-20位的密码'))
        } else if (!pat.test(value)) {
          callback(new Error('仅可输入数字，大小写字母和特殊字符'))
        } else {
          callback()
        }
      }
      const validatePass2 = (rule, value, callback) => {
        if (value !== this.$refs.d2Crud.$data.formData.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        addRules: {
          name: [
            {
              required: true,
              pattern: /^.{0,20}$/,
              message: '请输入姓名',
              trigger: 'blur'
            }
          ],
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            {
              pattern: /^.{0,20}$/,
              validator: validatePass,
              trigger: 'blur'
            }
          ],
          confirmPassword: [{ validator: validatePass2, trigger: 'blur' }],
          roleUuid: [{ required: true, message: '请选择角色', trigger: 'blur' }],
          email: [{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }],
          phone: [
            {
              type: 'string',
              len: 11,
              message: '手机号格式不正确',
              trigger: 'blur'
            }
          ]
        },

        loading: false,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0,
          background: true,
          layout: 'prev, pager, next, sizes,jumper'
        },

        columns: [
          {
            title: '用户名',
            key: 'username'
          },
          {
            title: '姓名',
            key: 'name'
          },
          {
            title: '角色名',
            key: 'roleName'
          },
          {
            title: '创建时间',
            key: 'createdTime'
          },
          {
            title: '修改时间',
            key: 'lastUpdatedTime'
          },
          {
            title: '冻结/启用',
            key: 'status',
            component: {
              name: switchButton
            }
          }
        ],
        data: [],
        rowHandle: {
          minWidth: '180px',
          align: 'center',

          custom: [
            {
              icon: 'el-icon-remove',
              type: 'text',
              text: '修改密码',
              emit: 'changepwd',
              sort: 1
            }
          ],
          edit: {
            icon: 'el-icon-edit',
            text: '编辑',
            type: 'text',
            sort: 2
          },
          remove: {
            icon: 'el-icon-delete',
            text: '删除',
            type: 'text',
            confirm: true,
            sort: 3
          }
        },
        addTemplate: {
          name: {
            title: '姓名',
            value: '',
            component: {
              maxlength: 20,
              trim: true,
              placeholder: '请输入姓名'
            }
          },
          username: {
            title: '用户名',
            value: '',
            component: {
              maxlength: 20,
              trim: true,
              placeholder: ' 仅可输入英文大小写、数字'
            }
          },
          password: {
            title: '密码',
            value: '',
            component: {
              showPassword: true,
              trim: true,

              placeholder: '默认初始密码123456'
            }
          },
          confirmPassword: {
            title: '确认密码',
            value: '',
            component: {
              trim: true,
              placeholder: '确认密码',
              showPassword: true
            }
          },
          roleUuid: {
            title: '所属角色',
            value: '',
            component: {
              name: selectRole
            }
          },
          status: {
            title: '用户状态',
            value: 0,
            component: {
              name: switchButton,
              props: {
                with: 'form'
              }
            }
          }
        },
        editTemplate: {
          name: {
            title: '姓名',
            value: '',
            component: {
              maxlength: 20,
              trim: true,

              disabled: true
            }
          },
          username: {
            title: '用户名',
            value: '',
            component: {
              maxlength: 20,
              disabled: true,
              trim: true,

              placeholder: ' 仅可输入英文大小写、数字'
            }
          },
          roleUuid: {
            title: '用户角色',
            value: '',
            component: {
              name: selectRole
            }
          },
          status: {
            title: '用户状态',
            value: 1,
            component: {
              name: switchButton,
              props: {
                with: 'form'
              }
            }
          }
        },
        formOptions: {
          saveButtonType: 'primary',
          saveButtonText: '保存',
          labelWidth: '80px',
          labelPosition: 'right',
          saveLoading: false,
          gutter: 20
        },
        changepwdUuid: '',
        form: {
          searchValue: ''
        }
      }
    },

    methods: {
      changepwd({ index, row }, done) {
        this.changepwdUuid = row.uuid
      },
      addUser() {
        this.$refs.d2Crud.showDialog({
          mode: 'add'
        })
        console.log(this.$refs.d2Crud.$data.formData)
      },

      fetchData() {
        this.loading = true
        const par = Object.assign({}, this.form, {
          pageNum: this.pagination.currentPage,
          pageSize: this.pagination.pageSize
        })

        return this.$api
          .SYS_USER_QUERYUSERLIST(par)
          .then(res => {
            this.data = res.data
            this.pagination.total = res.total
          })
          .finally(() => {
            this.loading = false
          })
      },
      handleTableChange(data, done) {
        this.fetchData().then(() => {
          done && done(false)
        })
      },
      async handleAdd(row, done) {
        this.formOptions.saveLoading = true
        try {
          const par = { ...row }
          // 默认密码
          par.password || (par.password = '123456')
          par.confirmPassword || (par.confirmPassword = '123456')

          await this.$api.SYS_USER_ADDUSER(par)
          await this.handleTableChange(par, done)
          this.$message({
            message: '新增成功',
            type: 'success'
          })
        } finally {
          this.formOptions.saveLoading = false
        }
      },
      async handleEdit({ index, row }, done) {
        this.formOptions.saveLoading = true
        try {
          const par = { ...row }
          await this.$api.SYS_USER_UPDATEUSER(par)
          await this.handleTableChange(par, done)
          this.$message({
            message: '编辑成功',
            type: 'success'
          })
        } finally {
          this.formOptions.saveLoading = false
        }
      },
      async handleRemove({ row }, done) {
        this.formOptions.saveLoading = true
        try {
          await this.$api.SYS_USER_DELETEUSER(row.uuid)
          done()
          await this.handleTableChange(row)
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        } finally {
          this.formOptions.saveLoading = false
        }
      },
      handleDialogCancel(done) {
        done()
      }
    }
  }
</script>
