import { defineComponent } from 'vue'
import useBem from '../../core/useBem'

export default defineComponent({
  name: 'form',
  setup(props, context) {
    const { b } = useBem()
    return () => {
      return (
        <>
          <div className={b()}>
            <div className={b('group')}>222</div>
          </div>
        </>
      )
    }
  }
})