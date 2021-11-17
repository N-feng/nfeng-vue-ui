import { initVal } from './dataformat';

export default function () {
  return {
    methods: {
      initVal () {
        this.text = initVal(this.value, this.column);
      },
      handleChange (value) {
        let result = value;
        this.$emit('input', result);
        this.$emit('change', result);
      }
    }
  }
}