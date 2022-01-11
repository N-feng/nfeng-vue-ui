import { defineComponent, h, PropType, resolveComponent } from 'vue';

type InputType = 'text' | 'input' | 'number' | 'password' | 'search' | 'textarea'

export default defineComponent({
  name: 'YInput',
  props: {
    type: {
      type: String as PropType<InputType>,
      default: ''
    }
  },
  setup(props) {

    function getComponent(t: InputType) {
      let type
      if (t) {
        type = t
      } else {
        type = 'input'
      }
      if (['text', 'input'].includes(type)) {
        return 'input'
      } else if (['number', 'password', 'search'].includes(type)) {
        return `input-${type}`
      } else {
        return type
      }
    }

    return () => {
      const Component = resolveComponent(`a-${getComponent(props.type)}`) as string
      return h(
        Component,
        {
          class: 'y-input'
        }
      )
    }
  }
})