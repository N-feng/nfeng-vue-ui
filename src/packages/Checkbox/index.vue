<template>
  <div>
    <!-- 多选框 -->
    <el-checkbox
      v-if="isSingle"
      v-model="text"
      :disabled="disabled"
      :true-label="trueLabel"
      :false-label="falseLabel"
      @change="handleChange"
    ></el-checkbox>
    
    <el-checkbox-group v-else-if="isButtonCheckbox" v-model="text" :size="size" @input="handleChange">
      <el-checkbox
        v-for="(option, index) in options" 
        :key="index + '_local'"
        class="button-checkbox"
        :label="getValue(option, valueKey)"
        border
        >{{ getLabel(option, labelKey) }}</el-checkbox
      >
    </el-checkbox-group>
    <el-checkbox-group v-else v-model="text" :size="size" @input="handleChange">
      <el-checkbox v-for="(option, index) in options" :key="index + '_local'" :label="getValue(option, valueKey)">{{
        getLabel(option, labelKey)
      }}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
export default {
  name: "YgpCheckbox",
  props: {
    value: {},
    size: {
      type: String,
    },
    options: {
      type: Array,
    },
    valueKey: {
      type: String,
    },
    labelKey: {
      type: String,
    },
    isSingle: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
    },
    trueLabel: {
      type: Number,
    },
    falseLabel: {
      type: Number,
    },
    isButtonCheckbox: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      text: undefined,
    }
  },
  watch: {
    value: {
      handler(val) {
        this.text = val
      },
      immediate: true,
    },
  },
  created() {
    this.text = this.value || this.value === 0 ? this.value : []
  },
  methods: {
    getLabel(option, labelKey) {
      return typeof option === "object" ? option[labelKey || "name"] : option
    },
    getValue(option, valueKey) {
      return typeof option === "object" ? option[valueKey || "code"] : option
    },
    handleChange(value) {
      this.$emit("input", value)
      this.$emit("change", value)
    },
  },
}
</script>

<style lang="scss">
.button-checkbox {
  margin-right: 0 !important;
  overflow: hidden;
  position: relative;
  .el-checkbox__input{
    display: none;
  }
  .el-checkbox__label{
    padding-left: 5px;
  }
  &:after {
    content:'';
    display: none;
    position: absolute;
    right: -13px;
    bottom: -13px;
    height: 20px;
    width: 20px;
    background-color: #FE5F23;
    transform: rotate(45deg);
  }
  &.is-checked::after{
    display: block;
  }
}
</style>
