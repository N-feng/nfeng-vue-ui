import {computed, defineComponent, h, PropType, ref, resolveComponent} from "vue";
import type { Dayjs } from 'dayjs';

type DateType = 'date-picker' | 'range-picker'

export default defineComponent({
  name: 'YDate',
  props: {
    modelValue: {
      // type: [String, Object, Array] as PropType<string | Dayjs | string[] | Dayjs[]>,
      type: [String, Object, Array] as any,
    },
    type: {
      type: String as PropType<DateType>,
      default: 'date-picker',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { attrs, emit }) {
    // const value = ref<Dayjs>()
    // const isRange = computed(() => {
    //   return /^(.*?)range(.*?)$/.test(props.type)
    // })

    function getComponent(t: DateType) {
      if (/^(.*?)range(.*?)$/.test(props.type)) {
        return 'range-picker'
      }
      return t
    }

    return () => {
      const Component = resolveComponent(`a-${getComponent(props.type)}`) as string
      return h(
          Component,
          {
            valueFormat: attrs['format'] as string || 'YYYY-MM-DD',
            value:props.modelValue,
            'onUpdate:value': (val) => {
              emit('update:modelValue', val)
            }
          }
      )
    }
  }
})