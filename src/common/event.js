import { initVal } from './dataformat';
function bindEvent (safe, name, event) {
  typeof safe[name] === 'function' && safe[name]({ value: safe.value, column: safe.column })
  safe.$emit(name, safe.value, event)
}
export default function () {
  return {
    methods: {
      initVal () {
        this.text = initVal(this.value, this.column);
      },
      handleBlur (event) {
        bindEvent(this, 'blur', event)
      },
      handleChange (value) {
        let result = value;
        this.$emit('input', result);
        this.$emit('change', result);
      }
    }
  }
}