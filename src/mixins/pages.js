/*
 * @Date: 2020-06-04 17:43:17
 * @LastEditors: songlin
 * @LastEditTime: 2020-06-23 18:34:15
 * @FilePath: \senseIDC-fe\src\mixins\pages.js
 */
export default {
  data() {
    return {
      loading: false,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        background: true,
        layout: 'total, sizes, prev, pager, next, jumper'
      }
    }
  },
  methods: {
    currentPageChange(page) {
      this.pagination.currentPage = page
      this.fetchData()
    },
    pageSizeChange(size) {
      this.pagination.pageSize = size
      this.fetchData()
    }
  },
  mounted() {
    this.fetchData()
  }
}
