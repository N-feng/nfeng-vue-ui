<template>
  <component
    :is="dialogType"
    lock-scroll
    :class="['ygp-dialog',b('dialog')]"
    :modal-append-to-body="false"
    append-to-body
    :title="dialogTitle"
    :visible.sync="boxVisible"
    :width="width"
  >
    <ygp-form
      v-if="boxVisible"
      ref="tableForm"
      v-model="crud.tableForm"
      :option="formOption"
      :dic="crud.dic"
      :status.sync="disabled"
      @handleCancel="hide"
      @reset-change="hide"
      @onSubmit="handleSubmit"
    ></ygp-form>
    <span class="ygp-dialog__footer"
          :class="'ygp-dialog__footer--'+dialogMenuPosition"
          v-if="!isView">
      <el-button v-if="vaildData(formOption.submitBtn,true)"
                 @click="submit"
                 :disabled="disabled"
                 :size="crud.controlSize"
                 :icon="formOption.submitIcon || 'el-icon-check'"
                 type="primary">{{formOption.submitText}}</el-button>
      <el-button v-if="vaildData(formOption.emptyBtn,true)"
                 @click="reset"
                 :disabled="disabled"
                 :size="crud.controlSize || 'el-icon-delete'"
                 :icon="formOption.emptyIcon">{{formOption.emptyText}}</el-button>
      <slot name="menuForm"
            :disabled="disabled"
            :size="crud.controlSize"
            :type="boxType"></slot>
    </span>
  </component>
</template>

<script>
import {vaildData} from "../../utils/util";
import create from "../../common/create"

export default create({
  name: "crud",
  inject: ["crud"],
  data() {
    return {
      disabled: false,
      boxType: "",
      boxVisible: false,
    };
  },
  computed: {
    isView() {
      return this.boxType === 'view'
    },
    isAdd() {
      return this.boxType === 'add'
    },
    isEdit() {
      return this.boxType === 'edit'
    },
    width() {
      return "85%";
    },
    dialogType() {
      return this.isDrawer ? "elDrawer" : "elDialog";
    },
    isDrawer() {
      return this.crud.tableOption.dialogType === "drawer";
    },
    formOption() {
      let option = this.deepClone(this.crud.tableOption);
      option.items = option.columns;
      option.menuBtn = false;
      delete option.columns;
      if (this.isView) {
        option.detail = true;
        option.menuBtn = false;
        option.submitBtn = false;
      } else {
        if (this.isEdit) {
          option.submitText = '修 改';
          option.submitBtn = option.updateBtn;
          option.submitIcon = option.updateBtnIcon || 'el-icon-circle-check'
        }
        option.emptyBtn = option.cancelBtn;
        option.emptyIcon = option.cancelBtnIcon || 'el-icon-circle-close';
        option.emptyText = '取 消';
      }

      return option;
    },
    dialogTitle() {
      return "编辑";
    },
    dialogMenuPosition () {
      return this.crud.option.dialogMenuPosition || 'center'
    }
  },
  methods: {
    vaildData,
    submit () {
      this.$refs.tableForm.submit()
    },
    reset () {
      this.$refs.tableForm.resetForm()
    },
    handleSubmit() {
      if (this.isAdd) {
        this.rowSave();
      } else if (this.isEdit) {
        this.rowUpdate();
      }
    },
    // 保存
    rowSave() {
      this.crud.$emit("onRowSave", this.crud.tableForm);
    },
    // 更新
    rowUpdate() {
      this.crud.$emit("onRowUpdate", this.crud.tableForm);
    },
    // 隐藏表单
    hide() {
      this.crud.tableIndex = -1;
      this.boxVisible = false;
    },
    // 显示表单
    show(type) {
      this.boxType = type;
      this.boxVisible = true;
    },
  },
});
</script>

<style lang="scss">
@import "dialog-form";
</style>