<template>
  <div>
    <component :is="getComponent(column.type,column.component)"
               v-model="text"
               v-on="event"
               :options="options"
               :size="column.size || size"></component>
  </div>

</template>

<script>
  import { getComponent } from "../../common/dataformat";
  import {validatenull} from "../../utils/validate";

  export default {
    name: "form-temp",
    props: {
      value: {},
      size: {
        type: String
      },
      options: {
        type: Array,
      },
      column: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    data () {
      return {
        first: false,
        text: undefined
      }
    },
    computed: {
      event () {
        return this.column.event || {}
      }
    },
    watch: {
      text: {
        handler (val) {
          if (this.first || !validatenull(val)) {
            this.first = true;
            this.$emit('input', val);
            this.$emit('change', val)
          } else {
            this.first = true;
          }
        }
      },
      value: {
        handler (val) {
          this.text = val;
        },
        immediate: true
      }
    },
    methods: {
      getComponent
    }
  }
</script>

<style scoped>

</style>