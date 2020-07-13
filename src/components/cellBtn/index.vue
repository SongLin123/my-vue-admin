<template>
  <div>
    <el-button type="text" :icon="icon" @click="handelCellClick({ index: scope.$index, row: scope.row })">{{text}}</el-button>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number],
      require: true
    },
    text: {
      type: String,
      require: ''
    },
    icon: {
      type: String,
      require: ''
    },
    // 本行的所有数据，此字段不需要额外配置
    scope: {
      default: null
    },
    handelCellClick: Function
  },
  computed: {},
  created() {},
  methods: {}
}
</script>
