import { defineComponent } from 'vue'

export default defineComponent({
  name: "YCrud",
  props: {
    // 表格配置
    option: {
      type: Object,
      required: true,
      default: () => {
        return {};
      },
    },
    // 枚举库
    dic: {
      type: Object,
    },
    // 分页数据
    page: {
      type: Object,
      default: () => {
        return {};
      },
    },
    modelValue: {
      type: Object,
      // required: true,
      default: () => {
        return {};
      }
    },
    // 表格数据
    data: {
      type: Array,
      required: true,
      default: () => {
        return [];
      }
    },
    rowSelection: {
      type: Boolean,
    },
    selectedRowKeys: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['rowSave', 'rowUpdate', 'rowDel', 'selectionChange', 'selectChange', 'submit', 'load'],
  setup() {
    return () => {
      return (
        <>
          <div>crud</div>
        </>
      )
    }
  } 
})