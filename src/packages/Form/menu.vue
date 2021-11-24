<template>
  <el-form-item :style="styleName" :class="className">
    <el-button v-if="formSafe.isMock"
               type="primary"
               :size="formSafe.controlSize"
               icon="el-icon-edit-outline"
               :loading="formSafe.allDisabled"
               @click="formSafe.handleMock">模拟</el-button>
    <template v-if="formSafe.parentOption.cellBtn">
      <el-button v-if="formSafe.isDetail"
                 v-permission="formSafe.getPermission('editBtn')"
                 :size="formSafe.controlSize"
                 @click="formCell(false)">编辑</el-button>
      <el-button v-if="!formSafe.isDetail"
                 v-permission="formSafe.getPermission('saveBtn')"
                 :size="formSafe.controlSize"
                 type="primary"
                 @click="formCell(true)">保存</el-button>
    </template>
    <el-button v-if="vaildData(formSafe.parentOption.submitBtn,true)"
               v-permission="formSafe.getPermission('submitBtn')"
               :icon="formSafe.parentOption.submitIcon || 'el-icon-check'"
               :size="formSafe.controlSize"
               type="primary"
               :loading="formSafe.allDisabled"
               @click="formSafe.submit">{{vaildData(formSafe.parentOption.submitText, "提 交")}}</el-button>
    <el-button v-if="vaildData(formSafe.parentOption.emptyBtn,true)"
               :icon="formSafe.parentOption.emptyIcon || 'el-icon-delete'"
               :size="formSafe.controlSize"
               :loading="formSafe.allDisabled"
               @click="formSafe.resetForm">{{ vaildData(formSafe.parentOption.emptyText, "清 空") }}</el-button>
    <el-button v-if="formSafe.option.items.length > 5"
               :size="formSafe.controlSize"
               type="text"
               @click="formSafe.expand = !formSafe.expand">{{ formSafe.expand ? "收起" : "展开" }}<i :class="formSafe.expand ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i></el-button>
    <slot name="menuForm"
          :size="formSafe.controlSize"></slot>
  </el-form-item>
</template>

<script>
import permission from "../../utils/permission";
import { vaildData } from "../../utils/util.js";

export default {
  inject: ["formSafe"],
  directives: {
    permission,
  },
  props: {
    isSearch: {
      type: Boolean
    }
  },
  computed: {
    className () {
      return !this.isSearch && 'form-menu'
    },
    styleName () {
      if (this.isSearch) {
        return {
          marginLeft: this.formSafe.parentOption.labelWidth || '140px'
        }
      }
      return {
        display: 'block',
        margin: 0,
      }
    }
  },
  methods: {
    vaildData,
    formCell(val) {
      this.formSafe.option.detail = val;
    },
  },
};
</script>
