import { defineComponent } from "vue";

export default defineComponent({
  name: 'YSwitch',
  props: {
    modelValue: {
      type: [Boolean, String, Number],
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, {emit}) {
    return () => {
      return (
        <a-switch 
          class="y-switch"
          checked={props.modelValue}
          onUpdate:checked={($event) => emit('update:modelValue', $event)}></a-switch>
      )
    }
  }
})