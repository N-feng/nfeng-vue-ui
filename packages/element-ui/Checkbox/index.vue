<template>
  <div :style="style">
    <!-- 多选框 -->
    <el-checkbox
      v-if="isSingle"
      v-model="text"
      :disabled="disabled"
      :true-label="trueLabel"
      :false-label="falseLabel"
      @change="handleChange"
    ></el-checkbox>

    <el-checkbox-group
      v-else-if="isButtonCheckbox"
      v-model="text"
      :size="size"
      @input="handleChange"
    >
      <el-checkbox
        v-for="(option, index) in options"
        :key="index + '_local'"
        class="button-checkbox"
        :label="option[valueKey]"
        border
        >{{ option[labelKey] }}</el-checkbox
      >
    </el-checkbox-group>
    <el-checkbox-group v-else v-model="text" :size="size" @input="handleChange">
      <el-checkbox
        v-for="(option, index) in options"
        :key="index + '_local'"
        :label="option[valueKey]"
        >{{ option[labelKey] }}</el-checkbox
      >
    </el-checkbox-group>
  </div>
</template>

<script>
import create from "../../common/create.ts";
import props from "../../common/props.js";
import event from "../../common/event.js";

export default create({
  name: "checkbox",
  mixins: [props(), event()],
  props: {
    size: {
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
  computed: {
    style() {
      let style = {}
      style.lineHeight = "28px"
      return style
    }
  }
});
</script>

<style lang="scss">
.button-checkbox {
  margin-right: 0 !important;
  overflow: hidden;
  position: relative;
  .el-checkbox__input {
    display: none;
  }
  .el-checkbox__label {
    padding-left: 5px;
  }
  &:after {
    content: "";
    display: none;
    position: absolute;
    right: -13px;
    bottom: -13px;
    height: 20px;
    width: 20px;
    background-color: #fe5f23;
    transform: rotate(45deg);
  }
  &.is-checked::after {
    display: block;
  }
}
</style>
