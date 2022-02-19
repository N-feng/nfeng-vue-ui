import { defineComponent } from "vue";

export default defineComponent({
  name: 'YCheckbox',
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => {
      return (
        <a-checkbox
            class="y-checkbox"
            onUpdate:checked={(val) => emit('update:modelValue', val)}></a-checkbox>
      )
    }
  }
})