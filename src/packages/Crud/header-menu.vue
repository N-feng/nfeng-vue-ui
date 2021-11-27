<template>
  <div class="crud__menu">
    <div class="crud__left">
      <el-button
        type="primary"
        @click="crud.rowAdd"
        icon="el-icon-plus"
        v-permission="crud.getPermission('addBtn')"
        :size="crud.isMediumSize"
        v-if="crud.tableOption.addBtn"
      >新 增</el-button>
      <el-button type="primary"
                 @click="crud.rowCellAdd"
                 icon="el-icon-plus"
                 v-permission="crud.getPermission('addRowBtn')"
                 :size="crud.isMediumSize"
                 v-if="vaildData(crud.tableOption.addRowBtn,true)">
        <template v-if="!crud.isIconMenu">
          新 增
        </template>
      </el-button>
      <div v-if="crud.tableOption.tableTitleRequire" class="red-star">*</div>
      <span
        class="crud-title"
        :class="{ 'crud-title-large': crud.tableOption.titleSize === 'large' }"
        >{{ crud.tableOption.tableTitle }}</span
      >
      <slot name="menuLeft" :size="crud.size"></slot>
    </div>
    <div class="crud__right">
      <slot name="menuRight" :size="crud.size"></slot>
      <template v-for="(item, index) in crud.tableOption.operate">
        <el-button
          v-if="getItemShow(item.show ? item.show : true)"
          :key="index"
          :size="item.size ? item.size : crud.size"
          :type="item.type"
          @click="crud.$emit(item.operate, crud.searchForm)"
          >{{ item.title }}</el-button
        >
      </template>
      <el-button
        v-if="crud.tableOption.fullscreenBtn"
        :icon="crud.fullscreen ? 'el-icon-news' : 'el-icon-full-screen'"
        circle
        :size="crud.isMediumSize"
        @click="handleFullScreen"
      ></el-button>
      <el-button
        v-if="crud.tableOption.refreshBtn"
        icon="el-icon-refresh"
        circle
        :size="crud.isMediumSize"
        @click="crud.refreshChange"
      ></el-button>
      <el-button
        v-if="crud.tableOption.searchShowBtn"
        icon="el-icon-search"
        circle
        :size="crud.isMediumSize"
        @click="crud.$refs.headerSearch.handleSearchShow()"
      ></el-button>
      <el-button
        v-if="crud.tableOption.columnBtn"
        icon="el-icon-s-operation"
        circle
        :size="crud.isMediumSize"
        @click="crud.$refs.dialogColumn.columnBox = true"
      ></el-button>
    </div>
  </div>
</template>

<script>
import permission from '../../utils/permission';
export default {
  inject: ["crud"],
  directives: {
    permission
  },
  methods: {
    handleFullScreen() {
      if (this.crud.fullscreen) {
        this.crud.fullscreen = false;
      } else {
        this.crud.fullscreen = true;
      }
    },
    // 页面逻辑决定是否展示
    getItemShow(show, row) {
      if (Array.isArray(show)) {
        return show.includes(this.$route.query.type);
      } else if (typeof show === "function") {
        return show({
          queryData: this.$route.query,
          formData: this.crud.searchForm,
          row,
        });
      } else {
        if (show === "onlyHideTableCol") {
          //只隐藏表格不隐藏表单
          return false;
        }
        return show;
      }
    },
  },
};
</script>
