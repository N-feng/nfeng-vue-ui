import {computed, defineComponent, PropType} from 'vue'
import useBem from '../../core/useBem'

export interface formProps {
  items: object | object[]
}

export default defineComponent({
  name: 'form',
  props: {
    option: {
      type: Object as PropType<formProps>,
      required: true,
      default: () => {
        return {};
      },
    },
  },
  setup(props, context) {
    console.log(props.option)
    const { b } = useBem()
    const tableOption: formProps = props.option
    console.log(tableOption)
    const parentOption = computed(() => tableOption)
    console.log(parentOption.value)
    const columnOption = computed(() => props.option.items || [])
    return () => {
      return (
        <>
          <div className={b()}>
            <div className={b('group')}>{ JSON.stringify(props.option.items) }222</div>
          </div>
        </>
      )
    }
  }
})