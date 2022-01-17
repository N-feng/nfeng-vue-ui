import {computed, defineComponent, h, PropType, ref, resolveComponent} from "vue";
import { DatePicker, RangePicker } from 'ant-design-vue';
import type { Dayjs } from 'dayjs';

type DateType = 'date-picker' | 'range-picker'

export default defineComponent({
  name: 'YDate',
  props: {
    type: {
      type: String as PropType<DateType>,
      default: 'date-picker',
    },
  },
  setup(props) {
    const value = ref<Dayjs>()
    const isRange = computed(() => {
      return /^(.*?)range(.*?)$/.test(props.type)
    })

    function getComponent(t: DateType) {
      if (/^(.*?)range(.*?)$/.test(props.type)) {
        return 'range-picker'
      }
      return t
    }

    return () => {
      const [Comp, cls] = isRange.value ? [RangePicker, 'y-date-range'] : [DatePicker, 'y-date']
      const Component = resolveComponent(`a-${getComponent(props.type)}`) as string
      console.log('Component: ', Component);
      return h(
          Component,
          {}
        // <>
        //   {/* <Comp class={cls} v-model:value={value} />
        //   <div>a-date</div> */}
        //   <a-date-picker></a-date-picker>
        // </>
      )
    }
  }
})