<!--
 * @Date: 2021-03-25 11:04:34
 * @LastEditors: N-feng
 * @LastEditTime: 2021-04-19 15:34:55
 * @FilePath: /ygp-bciscm-static/src/packages/DialogTable/index.vue
-->
<template>
  <el-dialog class="dialog-table" width="80%" :title="title" :visible.sync="visible" append-to-body>
    <ygp-crud
      v-if="visible"
      type="dialog"
      :data="data"
      :option="{
        ...option,
        menu: option.select
      }"
      :page.sync="page"
      :dic="dic"
      @on-load="onLoad"
    >
      <template slot="expand" slot-scope="{ row }">
        <ygp-crud
          class="table-package"
          :data="row[expandField]"
          :option="columnsExpand"
        >
        </ygp-crud>
      </template>
      <template slot="menu" slot-scope="{ row, index }">
        <el-button
          v-if="option.select"
          type="text"
          :size="size"
          @click="$emit('handleSelect', row, index), visible = false"
        >选择</el-button>
      </template>
    </ygp-crud>
  </el-dialog>
</template>

<script>
export default {
  name: "YgpDialogTable",
  props: {
    title: {
      type: String,
    },
    size: {
      type: String,
      default: "small",
    },
    option: {
      type: Object,
      required: true,
    },
    dic: {
      type: Object
    },
    // 展开读取字段
    expandField: {
      type: String
    },
    // 展开表格配置
    columnsExpand: {
      type: Object
    }
  },
  data() {
    return {
      visible: false,
      data: [],
      page: {},
      formData: {},
    };
  },
  methods: {
    onLoad({ formData, pageData }) {
      this.$emit(
        "on-load",
        { formData: { ...formData, ...this.formData }, pageData },
        (data) => {
          this.data = data.list;
          this.page.total = data.total;
        }
      );
    },
    show(formData) {
      this.formData = formData;
      this.visible = true;
    },
  },
};
</script>
