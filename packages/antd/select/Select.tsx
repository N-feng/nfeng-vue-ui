import { defineComponent } from "vue";
import useDic from "../../core/useDic";

export default defineComponent({
  name: 'YSelect',
  props: {
    options: {
      type: Array,
      default: () => {
        return [];
      }
    },
    labelKey: {
      type: String,
      default: 'name',
    },
    valueKey: {
      type: String,
      default: 'code',
    },
  },
  setup(props) {
    const { getOptions } = useDic();
    const propMap = {
      label: props.labelKey,
      value: props.valueKey,
    };
    const options = getOptions(propMap, props.options);
    return () => {
      return (
        <a-select options={options} />
      )
    }
  }
})