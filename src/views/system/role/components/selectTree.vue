<!--
 * @Date: 2020-06-22 11:53:44
 * @LastEditors: songlin
 * @LastEditTime: 2020-07-08 15:08:02
 * @FilePath: \senseIDC-fe\src\views\system\role\components\selectTree.vue
-->
<template>
  <div>
    <div class="row">
      <el-checkbox
        :disabled="mode==='look'"
        v-model="checkAll"
        :indeterminate="allcheck"
        @change="handleCheckAllChange('all',checkAll)"
      >全选</el-checkbox>
      <el-checkbox
        v-model="checkDiff"
        :disabled="mode==='look'"
        @change="handleCheckAllChange('rev',checkDiff)"
      >反选</el-checkbox>
    </div>

    <div
      class="row"
      v-for="item in list"
      :key="item.uuid"
    >
      <el-checkbox
        :disabled="mode==='look'"
        class="parent"
        @change="
        changeNodeCheckbox(item)"
        v-model="item.check"
        :indeterminate="item.childList.every(item=>!!item.check===false)?false:!item.childList.every(item=>item.check===true)"
        :label="item.uuid"
      >{{item.authName || item.menuName}}</el-checkbox>

      <template v-if="item.childList.length>0">
        <el-checkbox
          :disabled="mode==='look'"
          v-for="it in item.childList"
          v-model="it.check"
          @change="changeCheckbox(item)"
          :label="it.uuid"
          :key="it.uuid"
        >{{it.authName || it.menuName}}</el-checkbox>
      </template>

    </div>

  </div>
</template>
<script>
  export default {
    props: {
      mode: {
        type: String
      },
      tree: {
        type: Array
      },
      activeData: {
        type: Array
      }
    },
    data() {
      return {
        list: [],
        allcheck: false,
        checkAll: false,
        checkDiff: false
      }
    },
    watch: {
      activeData(val) {
        this.checkAll = false
        this.checkDiff = false
        this.showData(val)
      }
    },
    created() {
      this.list = this.tree

      this.showData(this.activeData)
    },
    methods: {
      showData(val = []) {
        function change(list) {
          list.forEach(item => {
            val.find(i => i === item.uuid)
              ? (item.check = true)
              : (item.check = false)

            if (item.childList.length > 0) {
              change(item.childList)
            }
          })
        }
        change(this.list)
      },
      GetCheckList() {
        const tar = []

        function getrole(arr) {
          arr.forEach(item => {
            if (item.check) tar.push(item.uuid)

            if (item.childList.length > 0) {
              getrole(item.childList)
            }
          })
        }
        getrole(this.list)

        return tar
      },

      changeNodeCheckbox(item) {
        item.childList.forEach(item => (item.check = !item.check))
        this.$forceUpdate()
      },
      changeCheckbox(item) {
        if (item.childList.every(item => item.check === true)) {
          item.check = true
        } else if (item.childList.every(item => item.check === false)) {
          item.check = false
        }
        this.$forceUpdate()
      },
      handleCheckAllChange(val, tem) {
        function change(arr, tar) {
          arr.forEach(item => {
            item.check = tar === undefined ? !item.check : tar
            if (item.childList.length > 0) {
              change(item.childList, tar)
            }
          })
        }
        function inspect(arr) {
          if (arr.every(item => item.check)) {
            return arr.forEach(item => {
              if (item.childList.length > 0) {
                return inspect(item.childList)
              }
            })
          } else {
            return false
          }
        }
        if (val === 'all') {
          change(this.list, tem)
          this.checkDiff = false
        } else {
          change(this.list)

          this.checkAll = inspect(this.list)
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .row {
    margin-bottom: 17px;
    .parent {
      color: #303133;
      font-weight: 600;
    }
  }
</style>
