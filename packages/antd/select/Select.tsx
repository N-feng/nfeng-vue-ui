import { defineComponent, ref } from "vue";
import useDic from "../../core/useDic";
import { getExpose } from "../../utils/common";

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
  setup(props, { expose }) {
    const select = ref()
    // console.log('select: ', select);
    // getExpose(['blur', 'focus'], select)
    const { getOptions } = useDic();
    const propMap = {
      label: props.labelKey,
      value: props.valueKey,
    };
    const options = getOptions(propMap, props.options);
    console.log(options)
    const value = ref('lucy')
    const onUpdate = (val) => {
      console.log(val)
    }
    const changeHandle = (val) => {
      console.log('changeHandle'+val)
    }
    return () => {
      return (
        <a-select ref="select" options={options} value={value} onUpdate:value={onUpdate} change={changeHandle} />
      )
    }
  }
})