<template>
  <div>
    <el-table-column width="1px"></el-table-column>
    <!-- 折叠面板  -->
    <el-table-column v-if="crud.tableOption.expand" type="expand">
      <template slot-scope="{ row, $index }">
        <slot :row="row" :index="$index" name="expand"></slot>
      </template>
    </el-table-column>

    <!-- 选择框 -->
    <el-table-column
      v-if="crud.tableOption.selection"
      :reserve-selection="crud.tableOption.reserveSelection"
      type="selection"
      width="50"
      align="center"
      fixed="left"
      :selectable="crud.tableOption.checkSelectable"
    ></el-table-column>

    <slot name="select"></slot>

    <!-- 序号 -->
    <el-table-column
      v-if="crud.tableOption.index"
      fixed="left"
      type="index"
      width="50"
      align="center"
      label="序号"
    ></el-table-column>
  </div>
</template>

<script>
export default {
  inject: ["crud"],
};
</script>
