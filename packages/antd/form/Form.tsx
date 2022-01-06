import { defineComponent } from 'vue'
import useBem from '../../core/useBem'

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
  setup(props, context) {
    console.log(props.option)
    const { b } = useBem()
    return () => {
      console.log(this)
      console.log(props)
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