export default function () {
  return {
    data () {
      return {
        text: undefined,
      }
    },
    props: {
      value: {},
      column: {
        type: Object,
        default: () => {
          return {}
        }
      },
      options: {
        type: Array,
        default: () => {
          return [];
        }
      },
      valueKey: {
        type: String,
        default: 'code'
      },
      labelKey: {
        type: String,
        default: 'name'
      },
    },
    watch: {
      text: {
        handler (n) {
          this.handleChange(n)
        }
      },
      value: {
        handler () {
          this.initVal();
        }
      }
    },
    created () {
      this.initVal();
    }
  }
}