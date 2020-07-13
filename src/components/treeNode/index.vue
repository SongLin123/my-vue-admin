<!--
 * @Date: 2020-06-17 19:16:43
 * @LastEditors: songlin
 * @LastEditTime: 2020-07-02 14:34:19
 * @FilePath: \senseIDC-fe\src\components\treeNode\index.vue
-->
<template>
  <div class="tree_node_content" :style="{width:treeWidth}">
    <tree-header v-bind="$attrs" v-on="$listeners"></tree-header>
    <slot name="fixed"></slot>
    <my-tree v-bind="$attrs" v-on="$listeners" ref="my_tree">
      <slot></slot>
    </my-tree>
  </div>
</template>
<script>
import treeHeader from './components/treeHeader'
import myTree from './components/myTree'
export default {
  components: { treeHeader, myTree },
  props: {
    // content 宽度
    treeWidth: {
      type: String,
      default: '20rem'
    }
  },
  data() {
    return {}
  },
  methods: {
    count(data) {
      return (
        data.count ||
        data.children.reduce((acc, cur) => (acc += cur.deviceCount), 0)
      )
    }
  }
}
</script>
<style lang="scss">
@import '~@/components/treeNode/css/treeNode.scss';
</style>
