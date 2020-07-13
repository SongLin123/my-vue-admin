<!--
 * @Date: 2020-05-25 12:04:06
 * @LastEditors: songlin
 * @LastEditTime: 2020-05-29 19:02:01
 * @FilePath: \d2-admin\src\views\system\role\components\roleCheck.vue
-->
<template>
  <div>

    <el-cascader v-if="hack" :value='checkedCities' :options="roleListData" :props="props" :show-all-levels="false"
      @change="handleCheckedChange"></el-cascader>

  </div>
</template>
<script>
  import util from '@/libs/util'
  import { find } from 'lodash'
  export default {
    props: {
      value: {
        type: [Object, Array]
      }
    },
    data() {
      return {
        hack: false, // 解决级联不初始化显示的问题
        props: { multiple: true, value: 'uuid', label: 'menuName', checkStrictly: false },
        checkedCities: [],
        roleListData: [],
        roleFlat: []
      }
    },
    created() {
      // 为每个节点添加children属性
      function format(tree) {
        return tree.map(node => {
          if (node.childList.length > 0) {
            node.children = format(node.childList)
          }
          return node
        })
      }

      // 查找父级的菜单，return是反序的
      function findFa(cur, nodes, acc) {
        const arr = cur.split('-')
        const newarr = arr.slice(0, arr.length - 1)
        const parentId = newarr.join('-')
        const parent = find(nodes, { uuid: parentId })
        parentId && acc.push(parentId)
        if (parent) {
          return findFa(parentId, newarr, acc)
        }
        return acc
      }

      // 去除子节点重复的
      function eq(arr) {
        const res = []

        arr.sort((a, b) => a.length - b.length)
        for (let index = 0; index < arr.length; index++) {
          if ((!(arr[index] && arr[index].includes(arr[index - 1])) || !(arr[index + 1] && arr[index + 1].includes(arr[index]))) && arr[index].length > 1) {
            res.push(arr[index])
          }
        }
        return res
      }

      this.$api.SYS_MENU_QUERYALLMENULIST().then(res => {
        this.roleListData = format(res.data)
        this.roleFlat = util.flatMenu(res.data)
        this.checkedCities = eq(this.value.value).map(item => findFa(item, this.roleFlat, [item]).reverse()
        )

        this.hack = true
      })
    },
    methods: {

      handleCheckedChange(value) {
        // 数组去重
        const arr = value.flat(3).sort()
        const newarr = []
        for (let index = 0; index < arr.length; index++) {
          if (arr[index] !== arr[index - 1]) {
            newarr.push(arr[index])
          }
        }

        this.$emit('input', newarr)
      }
    }
  }
</script>
