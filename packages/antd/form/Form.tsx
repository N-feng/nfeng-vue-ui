import { computed, defineComponent, reactive, h, resolveComponent } from "vue";
import useBem from "../../core/useBem";
import { getComponent, getPlaceholder } from "../../core/dataformat";
// import type { FormItem } from "./types";

export interface formProps {
  items: object | object[]
}

export default defineComponent({
  name: 'YForm',
  props: {
    option: {
      type: Object,
      required: true,
      default: () => {
        return {};
      },
    },
  },
  setup(props) {
    const { b } = useBem();
    const columnOption = computed(() => props.option.items || []);

    const itemSpanDefault = 8;
    function getSpan(column) {
      return column.span || itemSpanDefault;
    }

    const labelCol = props.option.labelWidth || 5;
    const wrapperCol = 24 - labelCol;

    const formSafe = reactive({});

    return () => {
      return (
        <>
          <div className={b()}>
            <a-form model={formSafe}>
              <a-row>
                {columnOption.value.map((column, index) => {
                  return (
                    <a-col span={getSpan(column)}>
                      <a-form-item
                        label={column.label}
                        labelCol={{ span: labelCol }}
                        wrapperCol={{ span: wrapperCol }}
                        name={column.prop}
                        v-slots={{
                          default: () => {
                            let children
                            const componentProps = {
                              placeholder: getPlaceholder(column)
                            }
                            const Component = resolveComponent(
                              getComponent(column.type, column.component)
                            ) as string
                            children = h(Component, {
                              ...componentProps
                            })
                            return children
                          }
                        }}
                      />
                    </a-col>
                  )
                })}
              </a-row>
            </a-form>
          </div>
        </>
      )
    }
  }
})