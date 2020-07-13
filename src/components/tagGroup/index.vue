<!--
 * @Date: 2020-05-27 16:32:32
 * @LastEditors: songlin
 * @LastEditTime: 2020-07-03 17:45:28
 * @FilePath: \senseIDC-fe\src\components\tagGroup\index.vue
-->
<template>
  <div>
    <el-tag
    class="d2-mr"
    @click="clickcb(item,scope.row)"
    style="cursor: pointer;" v-for="item in list" :key="item" type="success">{{options? find(item):item }}</el-tag>
  </div>
</template>

<script>
  export default {

    props: {
      value: {
        type: Array,
        require: true
      },
      options: {
        type: Array
      },
      scope: {
        default: null
      },
      clickcb: {
        type: Function,
        default: () => {}
      },
      formatter: {
        type: Function
      }

    },
    computed: {
      list() {
        return this.formatter ? this.formatter(this.value) : this.value
      }
    },
    methods: {
      find(value) {
        const finder = this.options.find(item => item.value === value) || { label: value }
        return finder.label
      }
    }

  }
</script>
