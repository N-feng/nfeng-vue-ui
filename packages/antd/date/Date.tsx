import { computed, defineComponent, PropType, ref } from "vue";
import { DatePicker, RangePicker } from 'ant-design-vue';
import type { Dayjs } from 'dayjs';

export default defineComponent({
  name: 'YDate',
  props: {
    type: {
      type: String as PropType<
        | 'date'
        | 'datetime'
        | 'week'
        | 'month'
        | 'year'
        | 'quarter'
        | 'daterange'
        | 'datetimerange'
        | 'weekrange'
        | 'monthrange'
        | 'yearrange'
        | 'quarterrange'
        | 'datetimerange2'
      >,
      default: 'date',
    },
  },
  setup(props) {
    const value = ref<Dayjs>()
    const isRange = computed(() => {
      return /^(.*?)range(.*?)$/.test(props.type)
    })
    return () => {
      const [Comp, cls] = isRange.value ? [RangePicker, 'y-date-range'] : [DatePicker, 'y-date']
      return (
        // <Comp class={cls} v-model:value={value} />
        <>
          <div>a-date</div>
        </>
      )
    }
  }
})