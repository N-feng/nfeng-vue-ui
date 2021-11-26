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
      size: {
        type: String,
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: ''
      },
      placeholder: {
        type: String,
        default: ''
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