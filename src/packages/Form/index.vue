<template>
  <div :class="[b(), {'ygp--view': !isView, 'ygp--detail': isDetail}]">
    <el-form
      ref="ruleForm"
      :model="formData"
      :size="controlSize"
      :label-width="parentOption.labelWidth || '140px'"
    >
        <ygp-group
            v-for="(item, index) in columnOption"
            :key="item.label"
            :is-tabs="isTabs"
            :display="vaildDisplay(item)"
            :index="index"
            :active.sync="activeName"
            :label="item.label"
            :column-option="columnOption"
        >
          <el-row :span="24" v-show="isGroupShow(item, index+'')" :class="['group-content', item.class]">
            <template v-for="(column, cindex) in item.items">
              <el-col v-if="vaildDisplay(column)"
                      :key="column.prop"
                      :span="getSpan(column)"
                      :md="getSpan(column)"
                      :sm="column.smSpan || item.smSpan || 12"
                      :xs="column.xsSpan || item.xmSpan ||  24"
                      :offset="column.offset || item.offset ||  0">
                <el-form-item :prop="column.prop"
                              :label="getLabel(column)"
                              :rules="getItemProp(column, 'rules')"
                              :class="['ygp-form__item', {'full-width': ['radio', 'textarea', 'upload', 'dynamic'].includes(column.type)}]"
                              :label-width="column.labelWidth || item.labelWidth || parentOption.labelWidth">
                  <slot
                      v-if="column.formSlot"
                      :value="formData[column.prop]"
                      :name="column.prop"
                      :column="column"
                      :size="column.size || controlSize"
                      :placeholder="getPlaceholder(column)"
                      :disabled="getItemProp(column, 'disabled')"
                  />
                  <!-- html -->
                  <!-- <template
                    v-else-if="(column.type === 'html' || column.detail || formOption.detail) && column.type !== 'upload'"
                  >
                    <div
                      v-if="column.render"
                      :class="!column.notEllipsis?'form-item-text':''"
                      :title="column.render(formData)"
                      v-html="column.render(formData)"
                    ></div>
                    <div
                      v-else
                      :class="!column.notEllipsis?'form-item-text':''"
                      :title="formData[column.propName || column.prop]"
                      v-html="formData[column.propName || column.prop]"
                    ></div>
                  </template>-->

                  <!-- 级联选择器 -->
                  <el-cascader
                      v-else-if="column.type === 'cascader'"
                      v-model="formData[column.prop]"
                      :filterable="column.filterable"
                      :options="column.options"
                      :props="column.props"
                      :clearable="column.clearable"
                      :placeholder="getPlaceholder(column)"
                      :disabled="getItemProp(column, 'disabled')"
                      @change="handleCascaderChange(value,column.prop)"
                  ></el-cascader>

                  <!-- 动态组件 -->
                  <component
                      :is="getComponent(column.type)"
                      v-else
                      :ref="column.prop"
                      v-bind="column"
                      v-model="formData[column.prop]"
                      :column="column"
                      :dic="dic"
                      :size="parentOption.size"
                      :maxlength="column.maxlength"
                      :placeholder="getPlaceholder(column)"
                      :disabled="getItemProp(column, 'disabled') || formOption.detail"
                      :close="getItemProp(column, 'close')"
                      :options="getOptions(column)"
                      :detail="column.detail || formOption.detail"
                      :default-time="column.defaultTime"
                      :range="column.range"
                      :column-slot="columnSlot"
                      @keyup.enter.native="handleEnter"
                      @change="(value, option, crudColumn, crudScope) => $emit('onChange', value, option, crudColumn ? crudColumn : column, crudScope)"
                      @focus="$emit('focus', column.prop)"
                      @remote="(callback, query) => $emit('remote', callback, query, column.prop)"
                      @validateField="$refs.ruleForm.validateField(column.prop)"
                  >
                    <template slot="menuDynamic" slot-scope="scope">
                      <slot name="menuDynamic" v-bind="scope"></slot>
                    </template>
                    <template v-for="el in columnSlot" :slot="el" slot-scope="scope">
                      <slot v-bind="scope" :name="el"></slot>
                    </template>
                  </component>
                </el-form-item>
              </el-col>
              <div :class="b('line')"
                   v-if="vaildDisplay(column)&&column.row && column.span!==24 && column.count"
                   :key="`line${column.prop}`"
                   :style="{width:(column.count/24*100)+'%'}"></div>
            </template>
            <form-menu>
              <template slot="menuForm" slot-scope="scope">
                <slot name="menuForm" v-bind="scope"></slot>
              </template>
            </form-menu>
          </el-row>
        </ygp-group>
<!--        <form-menu v-if="!isSearch" :is-search="isSearch">-->
<!--          <template slot="menuForm" slot-scope="scope">-->
<!--            <slot name="menuForm" v-bind="scope"></slot>-->
<!--          </template>-->
<!--        </form-menu>-->
    </el-form>
  </div>
</template>

<script>
import create from "../../common/create";
import { validatenull } from '../../utils/validate.js';
import { throttle, deepClone, vaildData, clearVal, arraySort } from "../../utils/util.js";
import mock from "../../utils/mock.js";
import { getLabel, getComponent, getPlaceholder, formInitVal, calcCount } from "../../common/dataformat.js";
import permission from '../../utils/permission';
import formMenu from "./menu.vue";

export default create({
  name: "form",
  components: { formMenu },
  directives: {
    permission
  },
  props: {
    option: {
      type: Object,
      required: true,
      default: () => {
        return {};
      },
    },
    dic: {
      type: Object,
    },
    enableEnterSearch: {
      type: Boolean,
      default: false,
    },
    // 权限控制
    permission: {
      type: [Function, Object],
      default: () => {
        return {};
      }
    },
    reset: {
      type: Boolean,
      default: true
    },
    value: {
      type: Object,
      required: true,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      activeName: '',
      allDisabled: false,
      bindList: {},
      formData: {},
      formOption: {},
      itemSpanDefault: 8,
      formCreate: false,
      formDefault: {},
      formVal: {},
      queryData: {},
    };
  },
  provide() {
    return {
      formSafe: this,
    };
  },
  computed: {
    columnSlot() {
      return Object.keys(this.$scopedSlots).filter(
        (item) => !this.propOption.map((ele) => ele.prop).includes(item)
      );
    },
    controlSize() {
      return this.option.size || "small";
    },
    isDetail() {
      return this.option.detail;
    },
    // isSearch() {
    //   return this.option.search;
    // },
    isTabs() {
      return this.parentOption.tabs;
    },
    isView () {
      return this.boxType === "view"
    },
    dynamicOption() {
      let list = [];
      this.propOption.forEach((ele) => {
        if (ele.type == "dynamic" && this.vaildDisplay(ele)) {
          list.push(ele);
        }
      });
      return list;
    },
    propOption() {
      let list = [];
      this.columnOption.forEach((option) => {
        option.items.forEach((column) => list.push(column));
      });
      return list;
    },
    parentOption() {
      let option = deepClone(this.formOption);
      let group = option.group;
      if (!group) {
        option = Object.assign(option, {
          group: [deepClone(option)],
        });
      }
      return option;
    },
    columnOption() {
      let list = [...this.parentOption.group] || [];
      list.forEach((ele) => {
        ele.items = ele.items || [];
        // 循环列的全部属性
        ele.items.forEach((column, cindex) => {
          //动态计算列的位置
          if (column.display !== false) {
            column = calcCount(column, this.itemSpanDefault, cindex === 0);
          }
        });
        //处理级联属性
        // ele.items = calcCascader(ele.items);
        //根据order排序
        ele.items = arraySort(ele.items, "order", (a, b) => a.order - b.order);
      });
      return list;
    },
    tabsActive() {
      return vaildData(this.formOption.tabsActive + '', '1');
    },
    isMock () {
      return vaildData(this.parentOption.mockBtn, false);
    }
  },
  watch: {
    tabsActive: {
      handler() {
        this.activeName = this.tabsActive;
      },
      immediate: true,
    },
    option: {
      handler() {
        this.init(false);
      },
      deep: true,
    },
    value: {
      handler(val) {
        if (this.formCreate) {
          this.setForm(val);
        } else {
          this.formVal = Object.assign(this.formVal, val || {});
          // this.formData = val;
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.init();
    this.handleEnter = throttle(this.enterSearch, 300);
    this.queryData = (this.$route && this.$route.query) || {};
    this.$nextTick(() => {
      this.dataFormat();
      this.formCreate = true;
    });
  },
  methods: {
    getLabel,
    getComponent,
    getPlaceholder,
    vaildData,
    init() {
      this.formOption = this.option;
    },
    getSpan (column) {
      return column.span || this.parentOption.span || this.itemSpanDefault
    },
    // 初始化表单
    dataFormat() {
      // let { tableForm } = deepClone(formInitVal(this.propOption));
      // this.setForm(Object.assign(tableForm, this.formData))

      this.formDefault = formInitVal(this.propOption);
      let value = deepClone(this.formDefault.tableForm);
      this.setForm(deepClone(Object.assign(value, this.formVal)));
    },
    remote(callback, query) {
      this.$emit("remote", callback, query);
    },
    getPermission(key) {
      if (typeof this.permission === "function") {
        return this.permission(key, this.formData)
      } else if (!validatenull(this.permission[key])) {
        return this.permission[key]
      } else {
        return true;
      }
    },
    getItemProp(item, type, defaultValue) {
      let result = item?.[type];
      if (typeof result === "function") {
        return result({
          queryData: this.queryData,
          formData: this.formData,
        });
      }
      return result || defaultValue;
    },
    // 获取枚举数据
    getOptions(column) {
      if (column.dicName) {
        return this.dic[column.dicName] || [];
      } else {
        return column.options;
      }
    },
    emitEventHandler(event) {
      this.$emit(event, ...Array.from(arguments).slice(1));
    },
    //表单赋值
    setForm(value) {
      Object.keys(value).forEach((ele) => {
        let result = value[ele];
        let column = this.propOption.find((column) => column.prop == ele);
        this.$set(this.formData, ele, result);
        if (!column) return;
        // let prop = column.prop;
        // let bind = column.bind;
        // if (bind && !this.bindList[prop]) {
        //   this.$watch("form." + prop, (n, o) => {
        //     if (n != o) setAsVal(this.form, bind, n);
        //   });
        //   this.$watch("form." + bind, (n, o) => {
        //     if (n != o) this.$set(this.form, prop, n);
        //   });
        //   this.$set(this.form, prop, eval("value." + bind));
        //   this.bindList[prop] = true;
        // }
      });
      // this.forEachLabel();
    },
    handleChange(value) {
      this.$emit("change", value);
    },
    handleCascaderChange(value, prop) {
      this.$emit("change", value, prop);
    },
    handleMock() {
      this.columnOption.forEach((column) => {
        const formMock = mock(column.items, this.dic, this.formData, true);
        if (!validatenull(formMock)) {
          Object.keys(formMock).forEach((ele) => {
            this.formData[ele] = formMock[ele];
          });
        }

        // 处理动态表单mock数据
        column.items.forEach((item) => {
          if (item.children) {
            const type = item.children?.type || "crud";
            const isCrud = type === "crud";
            if (isCrud) {
              this.formData[item.prop] = this.formData[item.prop].map(
                (el, i) => {
                  const crudMock = mock(
                    item.children.columns,
                    this.dic,
                    this.formData[item.prop][i],
                    true
                  );
                  return Object.assign(el, crudMock);
                }
              );
            }
          }
        });

      });
      this.clearValidate();
      this.$emit("mock-change", this.formData);
    },
    enterSearch() {
      if (this.enableEnterSearch) {
        this.submit();
      }
    },
    isGroupShow(item, index) {
      if (this.isTabs) {
        return index === this.activeName || index === 0;
      } else {
        return this.vaildDisplay(item);
      }
    },
    // 验证表单是否显隐
    vaildDisplay(column) {
      if (!validatenull(column.display)) {
        return vaildData(column.display, true);
      } else {
        return true;
      }
    },
    clearValidate(list) {
      this.$refs.ruleForm?.clearValidate(list);
    },
    validate(callback) {
      this.$refs.ruleForm.validate((valid, msg) => {
        let dynamicList = [];
        let dynamicName = [];
        let dynamicError = {};
        this.dynamicOption.forEach((ele) => {
          let isForm = ele.children.type === "form";
          dynamicName.push(ele.prop);
          if (isForm) {
            if (!validatenull(this.$refs[ele.prop][0].$refs.main)) {
              this.$refs[ele.prop][0].$refs.main.forEach((ele) => {
                dynamicList.push(ele.validateCellForm());
              });
            }
          } else {
            dynamicList.push(this.$refs[ele.prop][0].$refs.main.validateCellForm());
          }
        });
        Promise.all(dynamicList).then((res) => {
          res.forEach((error, index) => {
            if (!validatenull(error)) {
              dynamicError[dynamicName[index]] = error;
            }
          });
          let result = Object.assign(dynamicError, msg);
          if (validatenull(result)) {
            callback(true);
          } else {
            callback(false);
          }
        });
      });
    },
    resetForm() {
      if (this.reset) {
        this.clearVal();
        this.$nextTick(() => this.clearValidate())
      }
      this.$emit("reset-change");
    },
    clearVal () {
      // this.formData = clearVal(this.formData, []);
      this.formData = deepClone(this.formDefault.tableForm);
      this.$emit("input", this.formData);
      this.$emit("change", this.formData);
    },
    show () {
      this.allDisabled = true;
    },
    hide () {
      this.allDisabled = false;
    },
    submit() {
      this.validate((valid, msg) => {
        if (valid) {
          this.show();
          setTimeout(() => {
            this.hide();
          }, 5000);
          this.$emit("onSubmit", this.formData);
        } else {
          this.$emit("onError", msg);
        }
      });
    },
  },
});
</script>

<style lang="scss" scpoed>
@import "./_index.scss";
</style>