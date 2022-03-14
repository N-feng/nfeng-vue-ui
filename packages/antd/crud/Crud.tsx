import {computed, defineComponent, reactive, toRefs} from 'vue'
import { TableColumn, Key } from "./types";
import { vaildData } from "../../../src/utils/util"

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
  setup(props, { attrs, slots }) {

    const columnOption = computed(() => {
      let list = props.option.columns || []
      list.forEach((ele, index) => {
        ele.title = ele.label
        ele.dataIndex = ele.prop
        ele.key = ele.prop
      })
      return list
    });

    const propOption = computed(() => {
      let result: any = [];
      function findProp(list = []) {
        if (!Array.isArray(list)) return;
        list.forEach((ele: any) => {
          result.push(ele);
          if (ele.children) findProp(ele.children);
        });
      }
      findProp(columnOption.value);
      return result;
    })

    const getSlotList = (list: any = [], slot, propList) => {
      propList = propList.map(ele => ele.prop)
      return Object.keys(slot).filter(ele => {
        let result = false;
        if (!propList.includes(ele)) {
          list.forEach(name => {
            if (ele.includes(name)) result = true;
          })
        }
        return result;
      })
    }

    const mainSlot = computed(() => {
      let result: any = [];
      propOption.value.forEach(item => {
        if (slots[item.prop]) result.push(item.prop)
      })
      return getSlotList(['Header', 'Form'], slots, propOption.value).concat(result)
    })

    console.log(mainSlot.value)
    console.log(Object.keys(slots))

    const rowKey = props.option.rowKey || 'id'
    const handleGetRowKeys = (row) => {
      return row[rowKey]
    }

    const initColumns = computed(() => {
      const columns = (props.option.columns as TableColumn[]) || []
      const newColumns: TableColumn[] = columns.map((col) =>
          reactive({
            ...col,
            title: col.label,
            dataIndex: col.prop,
            key: col.prop
          }))

      if (vaildData(props.option.menu, true)) {
        const index = columns.findIndex(
            (col) =>
                col.dataIndex === 'operation'
        )
        const newIndex = newColumns.findIndex(
            (col) =>
                col.dataIndex === 'operation'
        )
        const operationCol = reactive<TableColumn>({
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          fixed: 'right',
          align: 'center',
          width: 250
        })
        if (index > -1) {
          newColumns[newIndex] = Object.assign(operationCol, columns[index])
        } else {
          newColumns.push(operationCol)
        }
      }

      return newColumns
    })

    const rowSelection = computed(() => {
      if (props.option.selection) {
        return reactive<{
          selectedRowKeys: Key[];
          loading: boolean;
        }>({
          selectedRowKeys: [],
          loading: false,
        })
      }
      return null
    })

    // 行单击
    const rowClick = (row) => {
      if (props.option.selection) {
        const id = handleGetRowKeys(row)
        const selectedRowKeys = rowSelection.value?.selectedRowKeys || []
        const index = selectedRowKeys.findIndex(
            (item) =>
                item === id
        )
        if (index > -1) {
          selectedRowKeys.splice(index, 1);
        } else {
          selectedRowKeys.push(id);
        }
      }
    }

    return () => {
      return (
        <>
          <a-table
              sticky={true}
              rowKey="id"
              rowSelection={rowSelection.value}
              dataSource={props.data}
              columns={initColumns.value}
              customRow={(record) => {
                return {
                  onClick: (event) => {
                    rowClick(record)
                    console.log(event)
                  }
                }
              }}
              v-slots={{
                bodyCell: (prop) => {
                  const { column } = prop
                  if (column.formatter) {
                    return column.formatter(prop)
                  }
                  if (column.render) {
                    return (
                        <div v-html={column.render(prop)}></div>
                    )
                  }
                  if (column.dataIndex === 'operation') {
                    return (
                        <div
                            className="ant-space ant-space-align-center"
                            style={{gap: '16px'}}>
                          <a>编辑</a>
                          <a>查看</a>
                          {slots.menu?.()}
                        </div>
                    )
                  }
                  if (slots[column.prop]) {
                    return slots[column.prop]?.(prop)
                  }
                }
              }}>
            <template>
              <span>action</span>
            </template>
          </a-table>
        </>
      )
    }
  } 
})