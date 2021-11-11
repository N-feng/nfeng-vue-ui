<!--
 * @Date: 2021-02-23 10:06:59
 * @LastEditors: zangbianxuegu
 * @LastEditTime: 2021-03-26 13:08:53
 * @FilePath: /ygp-bciscm-static/src/packages/Select/index.vue
-->
<template>
  <div>
    <!-- 下拉选框 -->
    <el-select
      v-model="text"
      :style="`width:${width || '100%'}`"
      :size="size"
      :loading="loading"
      :disabled="disabled"
      :placeholder="placeholder || `请选择${label || ''}`"
      :filterable="filterable"
      :remote="remote"
      :remote-method="handleRemoteMethod"
      :multiple="multiple"
      :clearable="clearable"
      @focus="handleFocus"
      @change="handleChange"
    >
      <el-option
        v-for="(option, index) in netDic"
        :key="index + '_local'"
        :value="getValue(option, valueKey)"
        :label="getLabel(option, labelKey)"
        :title="getLabel(option, labelKey)"
        :disabled="option.disabled"
      />
    </el-select>
  </div>
</template>

<script>
export default {
  name: "YgpSelect",
  props: {
    value: {},
    width: {},
    size: {
      type: String
    },
    disabled: {
      type: Boolean
    },
    label: {
      type: String
    },
    placeholder: {
      type: String
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
    remote: {
      type: Boolean
    },
    filterable: {
      type: Boolean
    },
    onLoad: {
      type: Function,
      default: () => {}
    },
    multiple: {
      type: Boolean
    },
    clearable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      text: undefined,
      netDic: [],
      loading: false
    };
  },
  watch: {
    value: {
      handler(val) {
        this.text = val;
      }
    },
    options: {
      handler(val) {
        this.netDic = val;
      }
    }
  },
  created() {
    this.text = this.value;
    this.netDic = this.options;
  },
  methods: {
    getLabel(option, labelKey) {
      return typeof option === "object" ? option[labelKey || "name"] : option;
    },
    getValue(option, valueKey) {
      return typeof option === "object" ? option[valueKey || "code"] : option;
    },
    handleChange(value) {
      const option = this.netDic.find(item => this.getValue(item, this.valueKey) === value);
      this.$emit("input", value);
      this.$emit("change", value, option);
    },
    handleFocus(value) {
      this.$emit("focus", value);
    },
    handleRemoteMethod(query) {
      this.loading = true;
      this.$emit(
        "remote",
        list => {
          this.loading = false;
          this.netDic = list;
        },
        query
      );
    },
  }
};
</script>
f
