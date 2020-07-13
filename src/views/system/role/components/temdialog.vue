<!--
 * @Date: 2020-06-19 16:00:36
 * @LastEditors: songlin
 * @LastEditTime: 2020-07-10 17:03:16
 * @FilePath: \senseIDC-fe\src\views\system\role\components\temdialog.vue
-->
<template>
  <div>
    <el-dialog
      v-if="mode!=='remove'"
      :title="mode |fromMode "
      :width="'880px'"
      :visible="!!mode"
      :before-close="close"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item
          label="角色名称"
          prop="roleName"
        >
          <el-input
            v-model.trim="form.roleName"
            :disabled="mode==='look'||mode==='edit'"
          ></el-input>
        </el-form-item>

      </el-form>

      <el-tabs
        v-model="activeTab"
        type="card"
      >
        <el-tab-pane name="first">
          <span
            slot="label"
            class="tab"
          >页面权限<span>(多选)</span></span>
          <selectTree
            :tree="route"
            ref="route"
            :activeData="activeData.menuList"
            :mode="mode"
          ></selectTree>
        </el-tab-pane>
        <el-tab-pane name="second">
          <span
            slot="label"
            class="tab"
          >数据权限<span>(多选)</span></span>
          <selectTree
            :tree="data"
            :activeData="activeData.dataList"
            ref="data"
            :mode="mode"
          ></selectTree>
        </el-tab-pane>
      </el-tabs>

      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          v-if="mode!=='look'"
          @click="close"
        >取 消</el-button>
        <el-button
          v-if="mode!=='look'"
          type="primary"
          @click="getRole"
          :loading="loading"
        >确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-else
      :title="mode |fromMode "
      :width="'400px'"
      :visible="!!mode"
      :before-close="close"
    >
      <div class="danger">
        您确定删除此角色吗？
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="close">取 消</el-button>
        <el-button
          :loading="loading"
          type="primary"
          @click="remove"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>
<script>
  import selectTree from './selectTree'
  import util from '@/libs/util'
  import { mapState, mapActions } from 'vuex'
  import { isEmpty } from 'lodash'
  export default {
    components: { selectTree },
    filters: {
      fromMode(val) {
        const mode = {
          look: '查看角色',
          add: '新增角色',
          edit: '修改角色',
          remove: '删除角色'
        }
        return mode[val]
      }
    },
    props: {
      mode: {
        type: String
      }
    },
    watch: {
      activeData: {
        deep: true,
        handler(val) {
          this.form.roleName = val.roleName
        }
      }
    },
    computed: {
      ...mapState('myadmin/sys.role', ['route', 'data', 'activeData'])
    },
    data() {
      return {
        loading: false,
        dataTree: [],
        menuTree: [],
        activeTab: 'first',
        form: util.decorator({
          roleName: ''
        }),
        rules: {
          roleName: [
            { required: true, message: '请输入角色名', trigger: 'blur' }
          ],
          role: [{ required: true, message: '请选择权限', trigger: 'blur' }]
        }
      }
    },

    methods: {
      ...mapActions('myadmin/sys.role', ['setData']),
      async getRole() {
        try {
          await this.$refs.form.validate()
        } catch {
          return
        }

        const dataList = this.$refs.data.GetCheckList()
        const menuList = this.$refs.route.GetCheckList()

        if (isEmpty(dataList) && isEmpty(menuList)) {
          this.$message.warning('需要选择权限！')
          return
        }
        this.loading = true
        if (this.mode === 'add') {
          await this.$api
            .SYS_ROLE_ADDROLE({
              roleName: this.form.roleName,
              dataList,
              menuList
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          await this.$api
            .SYS_ROLE_UPDATEROLE({
              roleName: this.form.roleName,
              uuid: this.activeData.uuid,
              dataList,
              menuList
            })
            .finally(() => {
              this.loading = false
            })
        }
        this.$message({
          message: '编辑成功',
          type: 'success'
        })
        this.close()
      },
      async close() {
        this.form.reset()
        await this.$nextTick()
        this.setData({
          dataList: [],
          menuList: []
        })
        this.$refs.form.clearValidate()
        this.loading = false
        this.activeTab = 'first'
        this.$emit('update:mode', '')
      },
      remove() {
        this.$emit('handleRemove', { uuid: this.activeData.uuid })
        this.close()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .is-active .tab {
    color: #000;
  }
  .tab {
    font-size: 14px;
    line-height: 16px;
    color: #9dacca;
    > span {
      font-weight: 300;
    }
  }
</style>
