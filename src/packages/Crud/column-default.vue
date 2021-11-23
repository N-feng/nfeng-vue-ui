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

    <!-- ant-design 选择框 -->
    <el-table-column
      v-if="crud.tableOption.rowSelection"
      type="check"
      width="50"
      align="center"
      fixed="left"
    >
      <template slot="header" slot-scope="scope">
        <el-checkbox
          v-if="crud.tableOption.checkAll !== false"
          v-model="crud.checkAll"
          :indeterminate="crud.isIndeterminate"
          @change="(val) => crud.allCheck(val, scope)"
        ></el-checkbox>
      </template>
      <template slot-scope="{ row }">
        <el-checkbox
          :value="crud.getCheck(row)"
          @change="(val) => crud.rowCheck(val, row)"
        ></el-checkbox>
      </template>
    </el-table-column>

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
