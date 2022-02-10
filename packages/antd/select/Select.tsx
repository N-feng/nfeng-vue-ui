import {defineComponent, onMounted, ref} from "vue";
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
  emits: ['update:modelValue', 'change'],
  setup(props, { expose, emit }) {
    const select = ref()

    onMounted(() => {
      // console.log('select: ', select.value);
    })

    // getExpose(['blur', 'focus'], select)
    const { getOptions } = useDic();
    const propMap = {
      label: props.labelKey,
      value: props.valueKey,
    };
    const options = getOptions(propMap, props.options);
    // console.log(options)
    const value = ref('lucy')
    const onUpdate = (val) => {
      console.log(val)
    }
    const changeHandle = (value, option) => {
      console.log(`selected ${value}`);
      console.log(option)
      emit('change', value, option)
    }
    return () => {
      return (
        <a-select
            ref={select}
            options={options}
            value={value}
            onUpdate:value={onUpdate}
            onChange={changeHandle}
        />
      )
    }
  },
})