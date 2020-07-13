<template>
  <div>
    <tree-dialog v-bind="$attrs" v-on="$listeners" ref="treeDialog">
      <template #treeDialogContent>
        <slot></slot>
      </template>
    </tree-dialog>
    <div>
      <el-input class="tree_input" v-if="isInputShow" :placeholder="inputPlaceholder" v-model="filterText">
        <i slot="suffix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <div :class="['all_text',activeAllTitle ? 'active':'']" @click.stop="handelAllText" v-if="!clearTreeOps">
        <span>
          {{allText}}
          <span class="num_style">{{!allNum ? "": allNum}}</span>
        </span>
        <el-popover placement="bottom" trigger="manual" v-model="visible">
          <div class="handle_btn">
            <el-button type="text" icon="el-icon-circle-plus-outline" @click="()=>{append(false)}">添加</el-button>
          </div>
          <i class="el-icon-circle-plus-outline handle_icon" slot="reference" @click.stop="visibleHandel" v-if="allTextBtnShow"></i>
        </el-popover>
      </div>
    </div>
    <div class="tree_content">
      <el-tree :highlight-current="!activeAllTitle" v-if="limitTree" :data="treeData" :default-expanded-keys="defaultExpanded" :default-checked-keys="defaultChecked" :accordion="isAccordion" :filter-node-method="filterNode" :show-checkbox="isTreeCheckbox" @node-click="handelNodeClick" :expand-on-click-node="false" @check="handelCheck" node-key="uuid" ref="tree">
        <template slot-scope="{ node, data }">
          <span :class="['custom-tree-node']" :draggable="idDraggable" :data-id="data.uuid" @dragstart="handleDragStart(node,data)" @dragend="handleDragEnd(node,data)" :disabled="true">
            <el-tooltip
            popper-class="customTooltip"
             effect="light" :content="'备注：'+data.remark" :disabled="!data.remark" placement="bottom-start">
              <span>
                <i v-if="showIconLevel === data.level">
                  <i :class="['tree_icon iconfont iconcamera2 left_icon',data.bound ? 'icon_gray':'icon_green']" v-if="data.deviceType === '111'"></i>
                  <i :class="['tree_icon iconfont iconSenseID2 left_icon',data.bound ? 'icon_gray':'icon_green']" v-if="data.deviceType === '112'"></i>
                  <i :class="['tree_icon iconfont iconSensePass2 left_icon',data.bound ? 'icon_gray':'icon_green']" v-if="data.deviceType === '113'"></i>
                  <i :class="['tree_icon iconfont iconNebula2 left_icon',data.bound ? 'icon_gray':'icon_green']" v-if="data.deviceType === '114'"></i>
                </i>
                <span class="tree_field_name">{{ data[fieldName] }}</span></span>
            </el-tooltip>

            <span v-if="!clearTreeOps">
              <span class="part_num" v-if="data.outLineDeviceCount">{{data.outLineDeviceCount}}/</span>
              <span class="all_num" v-if="data.allDeviceCount" style="margin-right: 15px;">{{data.allDeviceCount}}</span>
              <el-popover placement="bottom" trigger="manual" :value="showPopoverId == node.id">
                <div class="handle_btn">
                  <el-button v-if="data[fieldName] && data.level!==limitTree&& data.securityLevel !=='system'" type="text" icon="el-icon-circle-plus-outline" @click="() => append(data)">添加</el-button>
                  <el-button v-if="data[fieldName]" type="text" icon="el-icon-edit" @click="() => edit(data)">编辑</el-button>
                  <el-button v-if="!data.children && data.securityLevel !=='system'" type="text" icon="el-icon-delete" @click="() => remove(node, data)">删除</el-button>
                </div>
                <i v-if="data[fieldName] && !clearTreeOps && showHandel" class="iconfont iconlujing25291 handle_icon" slot="reference" :data-id="node.id" @click.stop="($event)=>{showPopover($event,node,data)}"></i>
              </el-popover>
            </span>
          </span>
        </template>
      </el-tree>
      <el-tree :highlight-current="!activeAllTitle" v-if="infiniteTree && !limitTree" :data="treeData" :accordion="isAccordion" :default-expanded-keys="defaultExpanded" :default-checked-keys="defaultChecked" :filter-node-method="filterNode" node-key="uuid" :expand-on-click-node="false" @node-click="handelNodeClick" @check="handelCheck" :show-checkbox="isTreeCheckbox" ref="tree">
        <template slot-scope="{ node, data }">
          <span :class="['custom-tree-node']" :draggable="idDraggable" :data-id="data.uuid" @dragstart="handleDragStart(node,data)" @dragend="handleDragEnd(node,data)">
            <el-tooltip
            popper-class="customTooltip"
            effect="light" :content="'备注：'+data.remark" :disabled="!data.remark" placement="bottom-start">
              <span class="tree_field_name">{{ data[fieldName] }}</span>
            </el-tooltip>
            <span v-if="!clearTreeOps">
              <span class="part_num" v-if="data.partNum" style="margin-right: 15px;">{{data.partNum}}/</span>
            </span>
            <el-popover placement="bottom" trigger="manual" :value="showPopoverId == node.id">
              <div class="handle_btn">
                <el-button v-if="data[fieldName]&& data.securityLevel !=='system'" type="text" icon="el-icon-circle-plus-outline" @click="() => append(data)">添加</el-button>
                <el-button v-if="data[fieldName]" type="text" icon="el-icon-edit" @click="() => edit(data)">编辑</el-button>
                <el-button v-if="!data.children && data.securityLevel !=='system'" type="text" icon="el-icon-delete" @click="() => remove(node, data)">删除</el-button>
              </div>
              <i v-if="data[fieldName] && !clearTreeOps && showHandel" class="iconfont iconlujing25291 handle_icon" slot="reference" :data-id="node.id" @click.stop="($event)=>{showPopover($event,node,data)}"></i>
            </el-popover>
          </span>
        </template>
      </el-tree>
    </div>
  </div>
</template>
<script>
import treeDialog from './treeDialog'
import handelClick from '../mixins/handelClick'
export default {
  components: {
    treeDialog
  },
  mixins: [handelClick],
  data() {
    return {
      filterText: ''
    }
  },
  props: {
    // 默认展开
    defaultExpanded: {
      type: Array,
      default: () => {
        return [-1]
      }
    },
    // 默认选中
    defaultChecked: {
      type: Array,
      default: () => {
        return ['-1']
      }
    },
    // 全部层级文字
    allText: {
      type: String,
      default: '全部设备'
    },
    // 全部层级数字
    allNum: {
      type: [String, Number],
      default: 0
    },
    allTextBtnShow: {
      type: Boolean,
      default: true
    },
    // 全部系列默认选中
    activeAllTitle: {
      type: Boolean,
      default: false
    },
    // input 是否显示
    isInputShow: {
      type: Boolean,
      default: false
    },
    // input placeholder文字
    inputPlaceholder: {
      type: String,
      default: '请输入'
    },
    // 清空树组件文字、数字、操作按钮等配置
    clearTreeOps: {
      type: Boolean,
      default: false
    },
    showHandel: {
      type: Boolean,
      default: true
    },
    // 是否展示树的多选框
    isTreeCheckbox: {
      type: Boolean,
      default: false
    },
    showIconLevel: {
      type: Number,
      default: 999
    },
    // 无限层级树
    infiniteTree: {
      type: Boolean,
      default: true
    },
    // 限定层级树
    limitTree: {
      type: [Number, Boolean],
      default: false
    },
    // 树组件label属性名
    fieldName: {
      type: String,
      default: 'groupName'
    },

    // 树组件源数据
    treeData: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 是否一次只打开一层
    isAccordion: {
      type: Boolean,
      default: false
    },
    // 树组件拖拽
    idDraggable: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 操作栏按钮区域展示
    visibleHandel() {
      this.visible = !this.visible
    },
    handelAllText() {
      this.$emit('update:activeAllTitle', true)
      this.showPopoverId && (this.showPopoverId = '')
      this.$emit('handelAllTitle', '点击了全部')
    },
    // 树组件拖拽
    // 拖拽开始
    handleDragStart(node, data, ev) {
      this.$emit('dragStart', { node, data })
      console.log('drag start', node)
    },
    // 拖拽结束
    handleDragEnd(node, data, ev) {
      this.$emit('dragEnd', { node, data })
    },

    // 不需要拖拽移动节点功能
    allowDrop() {
      return false
    },
    // 树过滤
    filterNode(value, data) {
      if (!value) return true
      return data[this.fieldName].indexOf(value) !== -1
    },
    // 操作栏图标是否展示
    findMode(val, mode) {
      return val.find(v => v === mode)
    },
    // popover展示
    showPopover(e, node, data) {
      console.log(data)
      if (this.showPopoverId === e.target.dataset.id) {
        this.showPopoverId = ''
        return
      }
      this.showPopoverId = e.target.dataset.id
    },

    append(data) {
      this.$refs.treeDialog.append(data)
    },
    edit(data) {
      this.$refs.treeDialog.edit(data)
    },
    remove(node, data) {
      this.$refs.treeDialog.remove(node, data)
    },
    // 树节点点击
    handelNodeClick(data, node, tree) {
      this.$emit('treeClick', { node, data })
      this.activeAllTitle && this.$emit('update:activeAllTitle', false)
      this.visible && (this.visible = false)
      this.showPopoverId && (this.showPopoverId = '')
    },
    // 点击复选框事件
    handelCheck(node, data) {
      this.$emit('treeCheck', { node, data })
    },
    setMyChecked(key, bool, childrenBool = false) {
      return this.$refs.tree.setChecked(key, bool, childrenBool)
    },
    // 返回选中的node节点 true 只返回叶子节点
    getMyCheckedNodes() {
      return this.$refs.tree.getCheckedNodes(true)
    },
    // 返回选中的节点id
    getMyCheckedKeys() {
      return this.$refs.tree.getCheckedKeys(true)
    },
    // set 选中节点
    setMyCheckedNodes(data) {
      console.log('data', data)
      this.$refs.tree.setCheckedKeys(data)
    },
    resetChecked() {
      this.$refs.tree.setCheckedKeys([])
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  }
}
</script>
