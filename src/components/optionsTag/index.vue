<!--
 * @Date: 2020-06-24 17:54:15
 * @LastEditors: songlin
 * @LastEditTime: 2020-07-08 16:56:40
 * @FilePath: \senseIDC-fe\src\components\optionsTag\index.vue
-->
<template>
  <div>
    <span :style="style">{{ text }}</span>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number],
      require: true
    },
    options: {
      type: Array
    }
  },
  computed: {
    text() {
      return (
        // eslint-disable-next-line
        (this.options.find(item => item.value == this.value) || { label: '—' })
          .label
      )
    },
    style() {
      return (
        /* eslint-disable */
        (
          this.options.find(item => item.value == this.value) || {
            color: 'currentcolor'
          }
        ).style
      );
      /* eslint-enable */
    }
    // color() {}
  },
  created() {}
}
</script>
