<template>
  <div class="date-picker">
    <!-- 日期选择 -->
    <el-date-picker
      v-if="range === false"
      v-model="text"
      :style="`width:${width || '100%'}`"
      :value-format="format"
      :format="format"
      :disabled="disabled"
      :size="size"
      :type="type"
      :placeholder="placeholder||`选择日期`"
      :picker-options="datePickerOptions"
      @change="handleChange"
    />
    <!-- 范围日期选择 -->
    <el-date-picker
      v-else-if="range === true"
      v-model="text"
      :style="`width:${width || '100%'}`"
      :value-format="format"
      :format="format"
      :picker-options="pickerOptions || defaultPickerOptions"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      @blur="handleBlur"
      @change="handleChange"
    ></el-date-picker>
  </div>
</template>

<script>
import moment from "moment";
let curDate = null;
export default {
  name: "YgpDatePicker",
  props: {
    format: {
      type: String,
      default: "yyyy-MM-dd",
    },
    range: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String
    },
    value: {},
    width: {},
    disabled: {
      type: Boolean,
      default: false
    },
    type: {
      type: String
    },
    placeholder: {
      type: String
    },
    pickerOptions: {
      type: Object
    },
    datePickerOptions: {
      type: Object,
      default: ()=>{}
    }
  },
  data() {
    return {
      text: undefined,
      defaultPickerOptions: {
        onPick({ maxDate, minDate }) {
          if (maxDate === null) {
            curDate = minDate;
          }
        },
        disabledDate(time) {
          return time > moment(curDate).add(6, "months") || time < moment(curDate).subtract(6, "months");
        }
      },
    };
  },
  watch: {
    value: {
      handler(val) {
        this.text = val;
      },
    }
  },
  created() {
    this.text = this.value;
  },
  methods: {
    initVal() {
      this.text = this.value;
    },
    handleBlur() {
      curDate = null;
    },
    handleChange(value) {
      this.$emit("input", value);
      this.$emit("change", value);
    }
  }
};
</script>
<style  lang="scss" scoped>
// .date-picker{
//   line-height:33.4px;
// }
</style>