<template>
  <div>
    <el-input-number
      v-if="typeParam === 'number'"
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
      :rows="rows"
      :show-word-limit="showWordLimit"
      :type="modelType || type"
      :size="size"
      :readonly="readonly"
      :disabled="disabled"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :show-password="typeParam === 'password' ? showPassword : false"
      :style="{'width': typeParam === 'textarea' ? '100%' : ''}"
      @input="handleChange"
      @focus="$emit('focus')"
      @blur="handleBlur"
    >
      <template v-if="append" slot="append">{{ append }}</template>
    </el-input>
  </div>
</template>

<script>
import create from '../../common/create';
import props from "../../common/props.js";
import event from "../../common/event.js";

export default create({
  name: "input",
  mixins: [props(), event()],
  props: {
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
    rows: {
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
      default: true
    },
  },
  computed: {
    typeParam () {
      if (this.type === "textarea") {
        return "textarea";
      } else if (this.type === "password") {
        return "password";
      } else {
        return "text";
      }
    }
  },
  methods: {
    handleBlur() {
      if (this.text) {
        this.text = this.text.trim();
      }
    }
  }
});
</script>
