<template>
  <div class="form-component">
    <!-- 表单操作/标题 -->
    <div v-if="formOption.operate || formOption.title" class="space-center form-header">
      <h3 class="form-title form-title-large">
        <!-- <i class="el-icon-back" style="cursor: pointer;" @click="formOption.backFun?formOption.backFun():$router.go(-1)"></i> -->
        {{ formOption.title }}
        <span
          v-if="formOption.subtitle"
          class="form-subtitle"
        >{{formOption.subtitle}}</span>
      </h3>
      <div>
        <el-button
          v-if="getItemStatus(formOption.cancel)"
          :size="size"
          @click="$emit('handleCancel')"
        >返回</el-button>
        <el-button
          v-if="getItemStatus(formOption.submit)"
          :size="size"
          type="primary"
          :loading="submitLoading"
          @click="handleSubmit"
        >提交</el-button>
        <template v-for="(item, index) in formOption.operate">
          <el-popconfirm
            v-if="item.btnType === 'confirm' && getItemStatus(item.show ? item.show : true)"
            :key="index"
            class="btn-del"
            confirm-button-text="好的"
            cancel-button-text="不用了"
            icon="el-icon-info"
            icon-color="red"
            :title="getItemBtnTitle(item.btnTitle)"
            @confirm="$emit(item.operate)"
          >
            <el-button
              slot="reference"
              :size="item.size ? item.size : size"
              :type="item.type"
              :icon="item.icon"
            >{{item.btnText}}</el-button>
          </el-popconfirm>
          <el-button
            v-else-if="getItemStatus(item.show ? item.show : true)"
            :key="index"
            :size="item.size ? item.size : size"
            :type="item.type"
            @click="$emit(item.operate)"
          >{{ item.title }}</el-button>
        </template>
        <el-popconfirm
          v-if="getItemStatus(formOption.withdrawBtn)"
          class="btn-del"
          confirm-button-text="好的"
          cancel-button-text="不用了"
          icon="el-icon-info"
          icon-color="red"
          title="确定撤回吗？"
          @confirm="$emit('withdraw')"
        >
          <el-button slot="reference" type="primary" :size="size">撤回</el-button>
        </el-popconfirm>
        <el-popconfirm
          v-if="getItemStatus(formOption.delBtn)"
          class="btn-del"
          confirm-button-text="好的"
          cancel-button-text="不用了"
          icon="el-icon-info"
          icon-color="red"
          title="确定删除吗？"
          @confirm="$emit('handleDel')"
        >
          <el-button slot="reference" :size="size" icon="el-icon-delete">删除</el-button>
        </el-popconfirm>
      </div>
    </div>
    <!-- 表单主体 -->
    <!-- @submit.native.prevent: 当Form组件中只有一个Input组件时，鼠标聚焦输入框后，点击回车键，页面就会刷新 -->
    <el-form
      ref="ruleForm"
      class="rule-form"
      :model="formData"
      :size="size"
      :disabled="disabled"
      :label-width="labelWidth"
      :rules="formOption.rules"
      @submit.native.prevent
    >
      <template v-for="(item, index) in columnOption">
        <div v-if="getItemStatus(item.show ? item.show : true)" :key="index" class="group">
          <div
            v-if="item.label"
            class="group-header"
            :class="{ required: item.required }"
          >{{ item.label }}</div>
          <el-row :gutter="10">
            <template v-for="(column, cindex) in item.items">
              <el-col
                v-if="getItemStatus(column.show ? column.show : true)"
                :key="cindex"
                :style="{ display: cindex < count ? 'block' : 'none' }"
                :span="column.span || 8"
              >
                <el-form-item
                  v-if="!getHide(column)"
                  class="form-item"
                  :prop="column.prop"
                  :label="getLabel(column.label)"
                  :label-width="formOption.labelWidth || column.labelWidth || labelWidth"
                  :rules="getRules(column.rules)"
                >
                  <slot
                    v-if="column.formSlot"
                    :value="formData[column.prop]"
                    :name="column.prop"
                    :column="column"
                    :size="size"
                    :placeholder="getPlaceholder(column)"
                    :disabled="getItemStatus(column.disabled)"
                  />
                  <!-- html -->
                  <template
                    v-else-if="
                      (column.type === 'html' ||
                        column.detail ||
                        formOption.detail) &&
                        column.type !== 'upload'
                    "
                  >
                    <div
                      v-if="column.render"
                      :class="!column.notEllipsis?'form-item-text':''"
                      :title="column.render(formData)"
                      v-html="column.render(formData)"
                    ></div>
                    <div
                     v-else-if="column.emptyLine"
                      :class="!column.notEllipsis?'form-item-text':''"
                      :title="formData[column.propName || column.prop] || '-'"
                      v-html="formData[column.propName || column.prop] || '-'"
                    ></div>
                    <div
                      v-else
                      :class="!column.notEllipsis?'form-item-text':''"
                      :title="formData[column.propName || column.prop]"
                      v-html="formData[column.propName || column.prop]"
                    ></div>
                  </template>

                  <!-- 级联选择器 -->
                  <!-- TypeError: Cannot read property 'level' of null加了key重新渲染 -->
                  <el-cascader
                    v-else-if="column.type === 'cascader'"
                    ref="cascader"
                    :key="column.key"
                    v-model="formData[column.prop]"
                    :filterable="column.filterable"
                    :options="column.options"
                    :props="column.props"
                    :clearable="column.clearable"
                    :placeholder="getPlaceholder(column)"
                    :disabled="getItemStatus(column.disabled)"
                    @change="handleCascaderChange(value,column.prop)"
                    @focus="$emit('focus', column.prop)"
                  ></el-cascader>
                  <el-switch
                    v-else-if="column.type === 'switch'"
                    v-model="formData[column.prop]"
                    active-color="#13ce66"
                    @change="handleChange"
                  ></el-switch>
                  <!-- 动态组件 -->
                  <component
                    :is="getComponent(column.type)"
                    v-else
                    v-model="formData[column.prop]"
                    v-bind="column"
                    :size="column.size ? column.size : size"
                    :maxlength="column.maxlength"
                    :placeholder="getPlaceholder(column)"
                    :disabled="getItemStatus(column.disabled)"
                    :close="getItemStatus(column.close)"
                    :options="getOptions(column)"
                    :detail="column.detail || formOption.detail"
                    :default-time="column.defaultTime"
                    @keyup.enter.native="handleEnter"
                    @change="(value, option) => $emit('change', value, column.prop, option)"
                    @focus="$emit('focus', column.prop)"
                    @remote="(callback, query) => $emit('remote', callback, query, column.prop)"
                    @validateField="$refs.ruleForm.validateField(column.prop)"
                  ></component>
                </el-form-item>
              </el-col>
            </template>
            <slot name="menu"></slot>
          </el-row>
        </div>
      </template>
    </el-form>
  </div>
</template>

<script>
// import { deepClone, getObjType } from "@/utils/util.js";
// import { calcCascader } from "@/utils/dataformat";
import { throttle } from "@/utils/util.js"

export default {
  name: "YgpForm",
  props: {
    option: {
      type: Object,
      required: true,
      default: () => {
        return {};
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    labelWidth: {
      type: String,
      default: "140px",
    },
    size: {
      type: String,
      default: "small",
      validator: (value) => {
        const types = ["large", "medium", "small", "mini"];
        const valid = types.indexOf(value.toLowerCase()) !== -1 || value === "";
        if (!valid) {
          throw new Error(
            `Size must be one of ['large', 'medium', 'small', 'mini']`
          );
        }
        return valid;
      },
    },
    // submitLoading: {
    //   type: Boolean,
    //   default: false,
    // },
    value: {
      type: Object,
      // required: true,
      default: () => {
        return {};
      },
    },
    dic: {
      type: Object,
      validator: (value) => {
        return value || {};
      },
    },
    count: {
      type: Number,
      default: 99,
    },
    enableEnterSearch: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      formData: {},
      formOption: {},
      submitLoading: false,
    };
  },
  computed: {
    // 组装group
    parentOption() {
      // let option = deepClone(this.formOption);
      let option = Object.assign(this.formOption);
      let group = option.group;
      if (!group) {
        option = Object.assign(option, {
          // group: [deepClone(option)]
          group: [Object.assign(option)],
        });
      }
      return option;
    },
    // 练级处理后的
    columnOption() {
      let list = [...this.parentOption.group] || [];
      // list.forEach(ele => {
      //处理级联属性
      // ele.items = calcCascader(ele.items);
      // });
      return list;
    },
  },
  watch: {
    option: {
      handler(val) {
        this.formOption = val;
      },
      deep: true,
    },
    value: {
      handler(val) {
        this.formData = val;
      },
      // deep: true
    },
  },
  created() {
    this.formOption = this.option;
    this.formData = this.value;
    this.handleEnter = throttle(this.enterSearch, 300)
  },
  methods: {
    remote(callback, query) {
      this.$emit("remote", callback, query);
    },
    getLabel(str) {
      if (str && str.length) {
        str = str.replace("：", "").replace(":", "") + "：";
      }
      return str;
    },
    /**
     * 动态获取组件
     */
    getComponent(type) {
      let result;
      if ([undefined, "", "number", "textarea"].includes(type)) {
        result = "input";
      } else if (["date", "month"].includes(type)) {
        result = "date-picker";
      } else {
        result = type;
      }
      return `ygp-${result}`;
    },
    // 获取属性 hide
    getHide(column) {
      if (Array.isArray(column.hide)) {
        return column.hide.includes(this.$route.query.type);
      } else if (typeof column.hide === "function") {
        return column.hide(this.$route.query);
      } else {
        return column.hide;
      }
    },
    getPlaceholder(column) {
      if (typeof column.placeholder === "string") {
        return column.placeholder;
      } else if (typeof column.placeholder === "function") {
        return column.placeholder({ queryData: this.$route.query, formData: this.formData });
      } else if (column.type === "select" || column.type === "input-date") {
        return `请选择${column.label || ""}`;
      } else {
        return `请输入${column.label || ""}`;
      }
    },
    // 获取枚举数据
    getOptions(column) {
      if (column.dicName) {
        return this.dic[column.dicName] || [];
      } else {
        return column.options;
      }
    },
    // 页面逻辑决定是否展示
    getItemStatus(show) {
      if (typeof show === "string") {
        if (show === "onlyHideTableCol") {
          //只隐藏表格不隐藏表单
          return true;
        }
        return show === this.$route.query.type;
      } else if (Array.isArray(show)) {
        return show.includes(this.$route.query.type);
      } else if (typeof show === "function") {
        return show({ queryData: this.$route.query, formData: this.formData });
      } else {
        return show;
      }
    },
    getItemBtnTitle(btnTitle) {
      if (typeof btnTitle === "function") {
        return btnTitle({queryData: this.$route.query, formData: this.formData});
      } else {
        return btnTitle
      }
    },
    // 获取检验规则
    getRules(rules) {
      if (typeof rules === "function") {
        return rules({
          formData: this.formData,
        });
      } else {
        return rules;
      }
    },
    emitEventHandler(event) {
      this.$emit(event, ...Array.from(arguments).slice(1));
    },
    handleChange(value) {
      this.$emit("change", value);
    },
    handleCascaderChange(value, prop) {
      this.$emit("change", value, prop);
    },
    handleSubmit() {
      this.submitLoading = true;
      setTimeout(() => {
        this.submitLoading = false;
      }, 5000);
      this.$emit("handleSubmit");
    },
    enterSearch() {
      if(this.enableEnterSearch){
        this.submitForm()
      }
    },
    submitForm() {
      return new Promise((resolve) => {
        this.$refs["ruleForm"].validate((valid, msg) => {
          resolve({ formData: this.formData, errorData: msg, valid });
          if (valid) {
            this.$emit("submit", this.formData);
          }
        });
      });
    },
    exportForm() {
      this.$emit("export", this.formData);
    },
    resetForm() {
      this.$refs["ruleForm"].resetFields();
      this.$emit("reset");
    },
  },
};
</script>