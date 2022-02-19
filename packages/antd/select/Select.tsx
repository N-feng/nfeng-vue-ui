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
    modelValue: {
      type: [Array, Object, String, Number],
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { expose, emit, attrs }) {
    const select = ref()
    expose({
      ...getExpose(['blur', 'focus'], select)
    })

    onMounted(() => {
      // console.log('select: ', select.value);
    })

    const { getOptions } = useDic();
    const propMap = {
      label: props.labelKey,
      value: props.valueKey,
    };
    const options = getOptions(propMap, props.options);

    return () => {
      return (
        <a-select
          ref={select}
          placeholder={attrs['placeholder'] === void 0 ? '请选择' : attrs['placeholder']}
          options={options}
          value={props.modelValue ? props.modelValue : undefined}
          onUpdate:value={(val) => emit('update:modelValue', val)}
        />
      )
    }
  },
})