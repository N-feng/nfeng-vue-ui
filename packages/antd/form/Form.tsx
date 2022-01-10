import { computed, defineComponent, resolveComponent } from "vue";
import useBem from "../../core/useBem";
import { getComponent } from "../../core/dataformat";
import type { FormItem } from "./types";

export interface formProps {
  items: object | object[]
}

export default defineComponent({
  name: 'form',
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

    return () => {
      return (
        <>
          <div className={b()}>
            <a-row>
              {columnOption.value.map((column: FormItem,index) => {
                const name = column.prop;
                return (
                  <a-col span={getSpan(column)}>{column}
                    <a-form-item
                        label={column.label}
                        labelCol={{ span: labelCol }}
                        wrapperCol={{ span: wrapperCol }}
                    >
                      {/*{resolveComponent(getComponent(column.type,column.component))}*/}
                    </a-form-item>
                  </a-col>
                )
              })}
            </a-row>
            <div className={b('group')}>{ JSON.stringify(props.option.items) }222</div>
          </div>
        </>
      )
    }
  }
})