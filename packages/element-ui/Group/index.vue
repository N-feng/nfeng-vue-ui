<template>
  <div class="form-group">
    <slot name="tabs"></slot>
    <template v-if="isTabs">
      <el-tabs
        v-if="isTabs&&index === 0"
        slot="tabs"
        v-model="activeName"
        @tab-click="handleTabClick"
      >
        <template v-for="(tabs, i) in columnOption">
          <el-tab-pane v-if="display" :key="i" :name="i+''">
            <span slot="label">{{tabs.label}}</span>
          </el-tab-pane>
        </template>
      </el-tabs>
      <slot></slot>
    </template>
    <template v-else>
      <div v-if="label" class="group-header">
        <div class="group__left">
          <span class="group-title">{{ label }}</span>
        </div>
        <div class="group__right">
          <slot name="menuGroup"></slot>
        </div>
      </div>
      <slot></slot>
    </template>
  </div>
</template>

<script>
import create from "../../common/create";

export default create({
  name: "group",
  props: {
    isTabs: {
      type: Boolean,
    },
    index: {
      type: Number,
    },
    columnOption: {
      type: Array,
    },
    display: {
      type: Boolean,
      default: true,
    },
    label: {
      type: String,
    },
  },
  data() {
    return {
      activeName: "",
    };
  },
  watch: {
    activeName: {
      handler(val) {
        this.$emit("update:active", val)
      }
    }
  },
  methods: {
    handleChange(activeNames) {
      this.$emit("change", activeNames);
    },
    handleTabClick(tab, event) {
      this.$emit("tab-click", tab, event);
    },
  },
});
</script>

<style lang="scss">
@import "index";
</style>
