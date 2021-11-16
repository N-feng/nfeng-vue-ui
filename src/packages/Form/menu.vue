<template>
  <div class="form-menu">
    <el-button
      v-if="formSafe.isMock"
      type="primary"
      :size="formSafe.controlSize"
      icon="el-icon-edit-outline"
      @click="formSafe.handleMock"
    >模拟</el-button>
    <template v-if="formSafe.parentOption.cellBtn">
      <el-button
        v-if="formSafe.isDetail"
        v-permission="formSafe.getPermission('editBtn')"
        :size="formSafe.controlSize"
        @click="handleCell(false)"
      >编辑</el-button>
      <el-button
        v-if="!formSafe.isDetail"
        v-permission="formSafe.getPermission('saveBtn')"
        :size="formSafe.controlSize"
        type="primary"
        @click="handleCell(true)"
      >保存</el-button>
    </template>
    <el-button
      v-if="vaildData(formSafe.parentOption.submitBtn, true)"
      v-permission="formSafe.getPermission('submitBtn')"
      :size="formSafe.controlSize"
      type="primary"
      :loading="submitLoading"
      @click="onSubmit"
    >提交</el-button>
    <el-button :size="formSafe.controlSize" @click="onCancel">返回</el-button>
    <slot name="menuForm" :size="formSafe.controlSize"></slot>
  </div>
</template>

<script>
import permission from "../../utils/permission";
import { vaildData } from "../../utils/util.js";

export default {
  inject: ["formSafe"],
  directives: {
    permission,
  },
  data: () => {
    return {
      submitLoading: false,
    };
  },
  methods: {
    vaildData,
    onSubmit() {
      this.submitLoading = true;
      setTimeout(() => {
        this.submitLoading = false;
      }, 5000);
      this.formSafe.onSubmit();
    },
    onCancel() {
      this.formSafe.$emit('onCancel');
    },
    handleCell(val) {
      this.formSafe.option.detail = val;
      this.formSafe.$emit("handleCell", val);
    },
  },
};
</script>