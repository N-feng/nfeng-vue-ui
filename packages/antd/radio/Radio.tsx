import { defineComponent, computed } from "vue";

export default defineComponent({
  name: 'YRadio',
  props: {
    modelValue: {
      type: [Boolean, String, Number],
    },
  },
  emits: ['update:modelValue'],
  setup(props, { attrs, emit }) {

    const checked = computed(() => {
      if ('value' in attrs) {
        return attrs['value'] === props.modelValue
      } else {
        return props.modelValue
      }
    })

    function onUpdateChecked(val) {
      let res
      if ('value' in attrs) {
        if (val) {
          res = attrs['value']
        } else {
          res = void 0
        }
      } else {
        res = val
      }
      emit('update:modelValue', res)
    }

    return () => {
      return (
        <a-radio 
          class="y-radio"
          checked={checked.value}
          onUpdate:checked={onUpdateChecked}></a-radio>
      )
    }
  }
})