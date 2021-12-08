<template>
  <div :style="style">
    <!-- 单选框 -->
    <el-radio-group 
      v-if="!isButtonRadio"
      v-model="text" 
      :size="size" 
      :disabled="disabled" 
      @input="handleChange">
      <el-radio
        v-for="(option, index) in options"
        :key="index + '_local'"
        :label="getValue(option, valueKey)"
        >{{ getLabel(option, labelKey) }}</el-radio
      >
    </el-radio-group>
    <el-radio-group 
      v-else
      v-model="text" 
      :size="size" 
      :disabled="disabled" 
      @input="handleChange"
      >
      <el-radio-button
        v-for="(option, index) in options"
        :key="index + '_local'"
        :label="getValue(option, valueKey)"
        >{{ getLabel(option, labelKey) }}</el-radio-button
      >
    </el-radio-group>
  </div>
</template>

<script>
export default {
  name: "YgpRadio",
  props: {
    value: {},
    size: {
      type: String
    },
    disabled: {
      type: Boolean
    },
    options: {
      type: Array
    },
    valueKey: {
      type: String
    },
    labelKey: {
      type: String
    },
    isButtonRadio: {
      type: Boolean,
      default: false
    },
    lineHeight: {
      type: String,
    }
  },
  data() {
    return {
      text: undefined
    };
  },
  computed: {
    style(){
      let style = {}
      if(this.isButtonRadio) {
        style.lineHeight = "30px"
      }else {
        style.lineHeight = this.lineHeight ||  "34px"
      }
      return style
    }
  },
  watch: {
    value: {
      handler(val) {
        this.text = val;
      }
    }
  },
  created() {
    this.text = this.value;
  },
  methods: {
    getLabel(option, labelKey) {
      return typeof option === "object" ? option[labelKey || "name"] : option;
    },
    getValue(option, valueKey) {
      return typeof option === "object" ? option[valueKey || "code"] : option;
    },
    handleChange(value) {
      this.$emit("input", value);
      this.$emit("change", value);
    }
  }
};
</script>
