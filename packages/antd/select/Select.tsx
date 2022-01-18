import { defineComponent } from "vue";

export default defineComponent({
  name: 'YSelect',
  props: {
    options: {
      type: Array,
      default: () => {
        return [];
      }
    },
    labelKey: {
      type: String
    },
    valueKey: {
      type: String
    },
  },
  setup(props) {
    console.log(props)
    return () => {
      return (
        <a-select>
          
        </a-select>
      )
    }
  }
})