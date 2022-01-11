import { defineComponent } from "vue";

export default defineComponent({
  name: 'YSwitch',
  setup() {
    return () => {
      return (
        <a-switch class="y-switch"></a-switch>
      )
    }
  }
})