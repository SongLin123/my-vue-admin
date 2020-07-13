<!--
 * @Date: 2020-05-13 14:30:24
 * @LastEditors: songlin
 * @LastEditTime: 2020-07-08 14:44:53
 * @FilePath: \senseIDC-fe\src\views\system\backendLog\index.vue
-->
<template>
  <d2-container>
    <d2-crud
      class="container"
      ref="table"
      :columns="columns"
      :data="data"
      :loading="loading"
      :pagination="pagination"
      :form-options="formOptions"
      selection-row
      @pagination-size-change="pageSizeChange"
      @pagination-current-change="currentPageChange"
    >
      <template #header>
        <div
          class="tbhead"
          flex="main:justify"
        >
          <div>
            <el-input
              placeholder="请输入关键字"
              v-model="form.searchValue "
              class="d2-mr"
            >
            </el-input>
            <el-date-picker
              v-model="dateRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              class="d2-mr"
            ></el-date-picker>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="fetchData"
              :loading="loading"
            >查询</el-button>
            <el-button
              type="primary"
              icon="el-icon-refresh-left"
              @click="resetForm"
              :loading="loading"
            >重置</el-button>
          </div>

          <el-button
            type="primary"
            icon="el-icon-upload"
            @click="exportEXl"
            style="width:120px"
            :loading="loading"
          >导出</el-button>

        </div>
      </template>
    </d2-crud>
  </d2-container>
</template>

<script>
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
  import page from '@/mixins/pages.js'
  export default {
    mixins: [page],
    data() {
      return {
        data: [],
        form: {
          beginTime: '',
          endTime: '',
          searchValue: ''
        },
        formOptions: {
          labelWidth: '60px',
          labelPosition: 'left',
          saveLoading: false,
          gutter: 5
        }
      }
    },
    computed: {
      columns() {
        return [
          {
            title: '账号',
            key: 'createdBy'
          },
          {
            title: '创建时间',
            key: 'createdTime '
          },
          {
            title: '操作描述',
            key: 'operDesc'
          },

          {
            title: '请求IP',
            key: 'operIp'
          },
          {
            title: '操作方法 ',
            key: 'operMethod '
          },
          {
            title: ' 操作模块',
            key: ' operModul'
          },
          {
            title: '请求参数',
            key: 'operRequParam'
          },
          {
            title: '返回参数 ',
            key: 'operRespParam  '
          },
          {
            title: ' 操作类型  ',
            key: ' operType  '
          }
        ]
      },
      dateRange: {
        get() {
          return [this.form.beginTime, this.form.endTime]
        },
        set(val) {
          [this.form.beginTime, this.form.endTime] = (val || ['', '']).map(item =>
            item.toISOString()
          )
        }
      }
    },
    methods: {
      exportEXl() {
        const wb = XLSX.utils.table_to_book(this.$refs.table.$refs.elTable.$el)

        const wbout = XLSX.write(wb, {
          bookType: 'xlsx',
          bookSST: true,
          type: 'array'
        })

        try {
          FileSaver.saveAs(
            new Blob([wbout], { type: 'application/octet-stream' }),
            '日志.xlsx'
          )
        } catch (e) {
          console.log(e, wbout)
        }
      },
      resetForm() {
        this.form = {
          beginTime: '',
          endTime: '',
          searchValue: ''
        }
        this.pagination.currentPage = 1
        this.fetchData()
      },
      // 查询列表
      async fetchData() {
        this.loading = true
        const par = Object.assign({}, this.form, {
          pageNum: this.pagination.currentPage,
          pageSize: this.pagination.pageSize
        })
        return this.$api
          .SYS_LOG_QUERYLIST(par)
          .then(res => {
            this.data = res.data
            this.pagination.total = res.total
            this.loading = false
          })
          .finally(() => {
            this.loading = false
          })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .container {
    width: 100%;
    height: 100%;
  }

  .tbhead {
    margin-bottom: 15px;
    .el-input,
    .el-date-editor {
      width: 264px;
    }
  }
</style>
