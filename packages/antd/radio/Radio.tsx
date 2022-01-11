import { defineComponent } from "vue";

export default defineComponent({
  name: 'YRadio',
  setup() {
    return () => {
      return (
        <a-radio class="y-radio"></a-radio>
      )
    }
  }
})