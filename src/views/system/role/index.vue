<!--
 * @Date: 2020-05-13 14:30:24
 * @LastEditors: songlin
 * @LastEditTime: 2020-07-10 17:38:38
 * @FilePath: \senseIDC-fe\src\views\system\role\index.vue
-->
<template>
  <d2-container>
    <d2-crud
      ref="d2Crud"
      :columns="columns"
      :data="data"
      :rowHandle="rowHandle"
      :loading="loading"
      :pagination="pagination"

      @pagination-size-change="pageSizeChange"
      @pagination-current-change="currentPageChange"
      @editHande="editHande"
       @lookHande="lookHande"
        @removeHande="removeHande"
    >
      <template #header>

        <div
          class="d2-mb"
          flex="main:justify cross:center"
        >
          <el-input
            placeholder="请输入角色名称"
            v-model.trim="form.roleName"
            @change="fetchData"
            class="input-with-select"

          >
            <el-button
              :loading="loading"
              slot="append"
              icon="el-icon-search"
              @click="fetchData"
            ></el-button>
          </el-input>

          <el-button
            :loading="loading"
            @click="addUser"
            class="svgButton"
            type="primary"
          >
            <d2-icon-svg
              name="zu14750"
              width="14px"
              height="14px"
            />新增角色</el-button>
        </div>
      </template>
    </d2-crud>

    <temdialog
    :mode.sync="dialogmode"
     @handleEdit="handleEdit"
    @handleRemove="handleRemove"
    ></temdialog>
  </d2-container>
</template>

<script>
  import page from '@/mixins/pages.js'
  import temdialog from './components/temdialog'

  import { mapActions } from 'vuex'
  export default {
    components: { temdialog },
    mixins: [page],
    data() {
      return {
        loading: false,
        dialogmode: '',
        columns: [
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
            title: '备注',
            key: 'remarks'
          }
        ],
        data: [],
        rowHandle: {
          align: 'center',
          minWidth: '180px',
          custom: [
            {
              icon: 'el-icon-edit',
              text: '编辑',
              sort: 2,
              type: 'text',
              emit: 'editHande'
            },
            {
              icon: 'el-icon-view',
              text: '查看',
              sort: 1,
              type: 'text',
              emit: 'lookHande',
              confirm: true
            },
            {
              icon: 'el-icon-remove',
              text: '删除',
              sort: 3,
              type: 'text',
              emit: 'removeHande',
              confirm: true
            }
          ]
        },
        formOptions: {
          labelWidth: '80px',
          labelPosition: 'left',
          saveLoading: false,
          gutter: 20
        },
        form: {
          roleName: ''
        }

      }
    },
    watch: {
      dialogmode(val) {
        if (!val) {
          this.fetchData()
        }
      }
    },
    created() {
      this.fetchData()
      this.load()
    },
    methods: {
      ...mapActions('myadmin/sys.role', ['load', 'setData']),
      async editHande({ index, row }) {
        // 获取角色的权限
         const res = await this.$api.SYS_ROLE_QUERYROLEDETAIL(row.uuid)
         this.dialogmode = 'edit'
         this.setData(res.data)
      },
      async lookHande({ index, row }) {
        const res = await this.$api.SYS_ROLE_QUERYROLEDETAIL(row.uuid)
         this.dialogmode = 'look'
         this.setData(res.data)
      },
      async removeHande({ index, row }) {
        this.dialogmode = 'remove'
         this.setData(row)
      },
      addUser() {
        this.dialogmode = 'add'
      },

      // 查询角色列表
      fetchData() {
        this.loading = true

        this.$api
          .SYS_ROLE_QUERYROLELIST({ ...this.form })
          .then(res => {
            this.data = res.data
            this.pagination.total = res.total
          })
          .finally(() => {
            this.loading = false
          })
      },

      async handleEdit(data, done) {
        this.formOptions.saveLoading = true
        try {
          await this.$api.SYS_ROLE_UPDATEROLE(data)
          this.$message({
            message: '编辑成功',
            type: 'success'
          })
          done()
        } finally {
          this.fetchData()

          this.formOptions.saveLoading = false
        }
      },

      async handleRemove({ uuid }) {
        this.formOptions.saveLoading = true
        try {
          await this.$api.SYS_ROLE_DELETEROLE(uuid)
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        } finally {
          this.fetchData()
          this.formOptions.saveLoading = false
        }
      }

    }
  }
</script>
