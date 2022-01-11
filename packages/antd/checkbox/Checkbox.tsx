import { defineComponent } from "vue";

export default defineComponent({
  name: 'YCheckbox',
  setup() {
    return () => {
      return (
        <a-checkbox class="y-checkbox"></a-checkbox>
      )
    }
  }
})