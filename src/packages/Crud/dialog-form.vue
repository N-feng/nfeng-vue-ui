<template>
  <component
    :is="dialogType"
    lock-scroll
    :class="['ygp-dialog']"
    :modal-append-to-body="false"
    append-to-body
    :title="dialogTitle"
    :visible.sync="boxVisible"
    :width="width"
  >
    <ygp-form
      v-if="boxVisible"
      v-model="crud.tableForm"
      :option="formOption"
      :dic="crud.dic"
      @handleCancel="hide"
      @reset-change="hide"
      @onSubmit="handleSubmit"
    ></ygp-form>
  </component>
</template>

<script>
export default {
  inject: ["crud"],
  data() {
    return {
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
      delete option.columns;
      if (this.isView) {
        option.detail = true;
        option.submitBtn = false;
      } else {
        if (this.isEdit) {
          option.submitText = '修 改';
          option.submitBtn = option.updateBtn;
          option.submitIcon = option.updateBtnIcon || 'el-icon-circle-check'
        }
        option.emptyText = '取 消';
        option.emptyBtn = option.cancelBtn;
        option.emptyIcon = option.cancelBtnIcon || 'el-icon-circle-close';
      }

      return option;
    },
    dialogTitle() {
      return "编辑";
    },
  },
  methods: {
    handleSubmit() {
      if (this.isAdd) {
        this.rowSave();
      } else if (this.isEdit) {
        this.rowUpdate();
      }
    },
    // 保存
    rowSave() {
      this.crud.$emit("row-save", this.crud.tableForm);
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
};
</script>

<style lang="scss">
@import "./_dialog-form.scss";
</style>