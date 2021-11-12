<template>
  <div>
    <el-input-number
      v-if="type === 'number'"
      v-model="text"
      :size="size"
      :readonly="readonly"
      :disabled="disabled"
      :min="min"
      :max="max"
      :step="step"
      :precision="precision"
      :placeholder="placeholder"
      controls-position="right"
      @change="handleChange"
      @focus="$emit('focus')"
    />
    <!-- 单行文本 -->
    <el-input
      v-else
      v-model.trim="text"
      clearable
      :rows="row"
      :show-word-limit="showWordLimit"
      :type="modelType || type"
      :size="size"
      :readonly="readonly"
      :disabled="disabled"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :show-password="showPassword"
      :style="{'width': type === 'textarea' ? '100%' : ''}"
      @input="handleChange"
      @focus="$emit('focus')"
      @blur="handleBlur"
    >
      <template v-if="append" slot="append">{{ append }}</template>
    </el-input>
  </div>
</template>

<script>
export default {
  name: "YgpInput",
  props: {
    type: {
      type: String
    },
    modelType: {
      type: String
    },
    showWordLimit: {
      type: Boolean
    },
    size: {
      type: String
    },
    readonly: {
      type: Boolean
    },
    disabled: {
      type: Boolean
    },
    placeholder: {
      type: String
    },
    append: {
      type: String
    },
    maxlength: {
      type: Number,
      default: 50 //备注字段限制
    },
    row: {
      type: Number,
      default: 2
    },
    min: {
      type: Number
    },
    max: {
      type: Number
    },
    step: {
      type: Number
    },
    precision: {
      type: Number
    },
    showPassword:{
      type: Boolean,
      default: false
    },
    value: {}
  },
  data() {
    return {
      text: undefined
    };
  },
  watch: {
    value: {
      handler(val) {
        this.text = val;
      }
    },
    text: {
      handler(val) {
        if (val === null) {
          this.text = undefined;
        }
      },
      deep: true
    }
  },
  created() {
    this.text = this.value;
  },
  methods: {
    handleChange(value) {
      this.$emit("input", value);
      this.$emit("change", value);
    },
    handleBlur() {
      if (this.text) {
        this.text = this.text.trim();
      } else {
        this.text = this.text
      }
    }
  }
};
</script>
