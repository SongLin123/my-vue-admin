<!--
 * @Date: 2020-05-22 15:11:07
 * @LastEditors: songlin
 * @LastEditTime: 2020-06-18 18:40:53
 * @FilePath: \senseIDC-fe\src\views\system\user\components\selectRole.vue
-->
<template>
  <el-select class="select" v-model="proxyval"
   @change="change" placeholder="请选择">
    <el-option v-for="item in options" :key="item.uuid" :label="item.roleName" :value="item.uuid">
    </el-option>
  </el-select>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number],
      require: true
    },
    scope: {
      default: null
    }
  },
  data() {
    return {
      options: [],
      proxyval: this.value
    }
  },
  methods: {
    change(val) {
      this.$emit('input', this.proxyval)
    }
  },
  mounted() {
    this.$api.SYS_ROLE_QUERYROLELIST({
      pageNum: 1,
      pageSize: 100,
      roleName: ''
    }).then(res => {
      this.options = res.data
    })
  }
}
</script>
