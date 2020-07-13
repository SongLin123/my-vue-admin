<template>
  <el-dialog :title="(handelMode === 'add' && addDialogTitle) ||(handelMode === 'edit' && editDialogTitle) || (handelMode === 'remove' && removeDialogTitle)" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :width="dialogWidth" @close="dialogClose" @open="dialogOpen" class="group_dialog">
    <slot name="treeDialogContent"></slot>
    <el-form :model="form" :rules="rules" class="groupForm" ref="groupForm" v-if="hideDialogForm">
      <el-form-item :label="dialogFormlabel" :label-width="dialogFormlabelWidth+'px'" prop="name" v-if="handelMode !== 'remove'">
        <el-input v-model="form.name" autocomplete="off"></el-input>
        <span class="device_tip">{{deviceTip}}</span>
      </el-form-item>
      <el-form-item label="备注" :label-width="dialogFormlabelWidth+'px'" prop="remark" v-if="handelMode !== 'remove' && dialogFormMode === 'user'">
        <el-input v-model="form.remark" autocomplete="off" type="textarea" maxlength="20" show-word-limit class="form_remark"></el-input>
      </el-form-item>
      <p class="remove_tip1" v-if="handelMode === 'remove'">您确定删除该组嘛？</p>
      <p class="remove_tip2" v-if="handelMode === 'remove'">*删除后不可恢复</p>
      <!-- <p class="remove_tip1" v-if="handelMode === 'remove'&& dialogFormMode === 'device'">您确定删除此设备吗？</p>
      <p class="remove_tip2" v-if="handelMode === 'remove' && dialogFormMode === 'device'">
        *删除后不可恢复
        <br />同时该设备相关轨迹将不复存在
      </p>-->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false" v-if="handelMode === 'remove'">取 消</el-button>
      <el-button type="primary" @click="submitForm('groupForm')" :loading="btnLoading">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    // 隐藏表单
    hideDialogForm: {
      type: Boolean,
      default: true
    },
    // 弹窗title
    addDialogTitle: {
      type: String,
      default: '新建分组'
    },
    editDialogTitle: {
      type: String,
      default: '编辑分组'
    },
    removeDialogTitle: {
      type: String,
      default: '删除分组'
    },
    // 表单输入框label
    dialogFormlabel: {
      type: String,
      default: '分组名称'
    },
    // 表单输入框label宽度
    dialogFormlabelWidth: {
      type: Number,
      default: 80
    },
    // 表单模式
    dialogFormMode: {
      type: String,
      default: ''
    },
    // 输入框下tip
    deviceTip: {
      type: String,
      default: '更改设备组名称后，系统将同步更改'
    }
    // dialogFormData: {
    //   type: Array,
    //   default: () => {
    //     return [];
    //   }
    // }
  },
  data() {
    return {
      handelMode: 'add',
      dialogFormVisible: false,
      btnLoading: false,
      groupData: '',
      dialogWidth: '312px',
      form: {
        name: '',
        remark: ''
      },
      rules: {
        name: [{ required: true, message: '必填项', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 新建分组
    append(data) {
      this.handelMode = 'add'
      this.dialogWidth = '400px'
      this.dialogFormVisible = true
      this.groupData = data
    },
    // 编辑分组
    edit(data) {
      this.handelMode = 'edit'
      this.dialogWidth = '400px'
      this.dialogFormVisible = true
      this.groupData = data
      this.form.name = data.groupName
      this.form.remark = data.remark
    },
    // 删除分组
    remove(node, data) {
      this.handelMode = 'remove'
      // this.dialogWidth = "400px";
      this.groupData = data
      // this.dialogFormVisible = true;
      this.$emit('removeGroup', { data: this.groupData })
    },
    // 表单提交
    submitForm(formName) {
      this.btnLoading = true
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.handelMode === 'add') {
            this.$emit('addGroup', {
              form: this.form,
              data: this.groupData,
              done: this.done
            })
          } else if (this.handelMode === 'edit') {
            this.$emit('editGroup', {
              form: this.form,
              data: this.groupData,
              done: this.done
            })
          }
        } else {
          this.btnLoading = false
        }
      })
    },
    // dialogClose
    dialogClose() {
      this.btnLoading = false
      this.$refs.groupForm.resetFields()
      this.form.name = ''
      this.form.remark = ''
    },
    // dialogOpen
    dialogOpen() {
      this.$emit('dialogOpen', this.handelMode)
    },
    // 请求完成操作
    done(b = true) {
      if (b) {
        this.dialogFormVisible = false
      } else {
        this.btnLoading = false
      }
    }
  }
}
</script>
<style lang="scss">
.device_tip {
  font-size: 12px;
  font-weight: 400;
  line-height: 22px;
  color: rgba(157, 172, 202, 1);
  opacity: 1;
}
.remove_tip1,
.remove_tip2 {
  font-weight: 600;
  text-align: center;
  margin: 0;
}
.remove_tip2 {
  font-weight: 400;
  color: red;
}
.group_dialog {
  .el-dialog__footer {
    padding-top: 0 !important;
  }
}
</style>
