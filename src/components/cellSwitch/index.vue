
<template>
  <div>
    <el-switch class="switch" v-model="proxyval" :active-value="1" :active-text="proxyval === 2?'关闭':'开启'" :inactive-value="2" @change="change">
    </el-switch>

    <!-- <el-dialog
      width="400px"
      title="停用"
      :visible.sync="dialogVisible"
    >
    <div style="text-align: center;">
      <span>确定停用吗，停用后该用户将无法登录系统</span>

    </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="cancel">取 消</el-button>
        <el-button
          type="primary"
          @click="submit"
        >确 定</el-button>
      </span>
    </el-dialog> -->
  </div>

</template>

<script>
export default {
  data() {
    return {
      proxyval: this.value,
      dialogVisible: false
    }
  },
  props: {
    value: {
      type: [Number, String],
      require: true
    },
    scope: {
      default: null
    },
    with: {
      type: String
    },
    handelSwitch: Function
  },
  methods: {
    cancel() {
      this.proxyval = 0
      // this.dialogVisible = false
    },
    //   async submit() {
    //     await this.$api.SYS_USER_UPDATEUSERSTATUS({
    //       status: this.proxyval,
    //       uuid: this.scope.row.uuid
    //     })
    //     this.$emit('input', this.proxyval)
    //     this.dialogVisible = false
    //   },
    change(val) {
      this.$emit('input', this.proxyval)
      this.handelSwitch({ row: this.scope.row, switchVal: this.proxyval })
      // if (this.with !== 'form') {
      //   val && (this.dialogVisible = true)
      // } else {
      //   this.$emit('input', this.proxyval)
      // }
    }
  }
}
</script>
