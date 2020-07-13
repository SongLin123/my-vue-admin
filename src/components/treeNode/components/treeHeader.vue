<template>
  <div>
    <el-select
      class="tree_select"
      v-if="isSelectShow"
      v-model="selectValue"
      clearable
      :placeholder="selectPlaceholder"
      @visible-change="((val)=>{visibleChange(val)})"
    >
      <el-option
        v-for="item in selectOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  props: {
    // 下拉框是否显示
    isSelectShow: {
      type: Boolean,
      default: false
    },
    // 下拉框placeholder文字
    selectPlaceholder: {
      type: String,
      default: '请选择'
    },
    // 下拉框源数据
    selectOptions: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      selectValue: ''
    }
  },
  methods: {
    // 下拉框选择返回值
    visibleChange(val) {
      if (!val) {
        this.$emit('selectChange', this.selectValue)
      }
    }
  }
}
</script>
