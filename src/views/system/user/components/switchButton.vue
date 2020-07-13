<!--
 * @Date: 2020-05-22 11:28:18
 * @LastEditors: songlin
 * @LastEditTime: 2020-07-08 13:55:01
 * @FilePath: \senseIDC-fe\src\views\system\user\components\switchButton.vue
-->
<template>
  <div>
    <el-switch
      class="switch"
      v-model="proxyval"
      :active-value="0"
      :active-text="proxyval?'关闭':'开启'"
      :inactive-value="1"
    >
    </el-switch>

    <el-dialog
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
          @click="submit(1)"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        dialogVisible: false
      }
    },
    computed: {
      proxyval: {
        get() {
          return this.value
        },
        set(val) {
            this.$emit('input', val)

          if (this.with !== 'form') {
            val ? (this.dialogVisible = true) : this.submit(val)
          }
        }
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
      }
    },
    methods: {
      cancel() {
        this.proxyval = 0
        this.dialogVisible = false
      },
      async submit(val) {
        console.log(this.proxyval)
        await this.$api.SYS_USER_UPDATEUSERSTATUS({
          status: val,
          uuid: this.scope.row.uuid
        })
        // this.$emit('input', this.proxyval)
        this.dialogVisible = false
      }
    }
  }
</script>
