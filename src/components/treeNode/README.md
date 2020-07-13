## 自定义tree组件

## 使用方式 通常配置
    <treenode
          :isSelectShow="true"
          :treeData="data"
          :selectOptions="options"
          :idDraggable="true"
          :allText="'全部人员'"
          @selectChange="selectChange"
          @addGroup="addGroup"
          @editGroup="editGroup"
          @removeGroup="removeGroup"
          @dragEnd="dragEnd"
          @handelAllTitle="handelAllTitle"
        >
            <template>dddddd</template>
        </treenode>

## 参数说明
# :isSelectShow="Boolean"           是否显示顶部下拉选择框 默认false
# :isInputShow="Boolean"            是否显示树组件过滤框 默认false
# :selectPlaceholder="String"       下拉选择框Placeholder
# :selectOptions="Array"            下拉框源数据
# :inputPlaceholder="String"        input Placeholder
# :allText="String"                 树组件上方全部系列文字  如全部设备等
# :allNum="String, Number"          树组件上方全部系列后总数数字
# :infiniteTree="Boolean"           树组件层级限制 默认无限层级
# :limitTree="Number"               树组件限制层级，传入数字
# :fieldName="String"               树组件指定字段名
# :treeData="Array"                 树组件源数据
# :isAccordion="Boolean"            树组件是否一次只打开一层 默认true
# :idDraggable="Boolean"            树组件是否可拖拽 默认false
# :hideDialogForm="Boolean"         dialog表单是否显示 默认true
# :clearTreeOps="Boolean"           清空树组件文字、数字、操作按钮等配置,只保留单纯的树 默认false
# :isTreeCheckbox="Boolean"         是否展示树的多选框 默认false
# :addDialogTitle="String"         dialog 增加Title  默认新建分组
# :editDialogTitle="String"        dialog 修改Title  默认编辑分组
             


## 事件说明
# @selectChange         下拉框选择数据 返回参数 String
# @handelAllTitle       点击全部系列触发回调 暂无返回值
# @dragStart            拖拽事件开始 返回参数 { node, data }
# @dragEnd              拖拽事件结束 返回参数 { node, data }
# @addGroup             添加分组事件 返回参数 { form: this.form, data: this.groupData, done: this.done }  分别为：表单数据，组数据，请求完成回调关闭弹窗方法 done参数默认为true  
# @editGroup            修改分组事件 返回参数 同上
# @removeGroup          删除分组事件 返回参数 { data: this.groupData, done: this.done }
# @treeClick            点击树节点事件 返回参数 { node, data }
# @treeCheck            点击树多选框事件 返回参数 { node, data }


## template
# 自定义dialog内容插槽