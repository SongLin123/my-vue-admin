<!--
 * @Date: 2020-06-18 22:59:56
 * @LastEditors: songlin
 * @LastEditTime: 2020-07-13 13:47:30
 * @FilePath: \senseIDC-fe\src\layout\header-aside\components\header-color\index.vue
-->
<template>
  <el-color-picker
    class="btn-text can-hover"
    :value="value"
    :predefine="predefine"
    size="mini"
    @change="set"/>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'd2-header-color',
  data () {
    return {
      predefine: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585'
      ]
    }
  },
  computed: {
    ...mapState('myadmin/color', [
      'value'
    ])
  },
  watch: {
    value (value) {
      this.set(value)
    }
  },
  methods: {
    ...mapActions('myadmin/color', [
      'set'
    ])
  }
}
</script>
