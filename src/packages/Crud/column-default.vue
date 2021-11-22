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
          @change="(val) => allCheck(val, scope)"
        ></el-checkbox>
      </template>
      <template slot-scope="{ row }">
        <el-checkbox :value="getCheck(row)" @change="(val) => rowCheck(val, row)"></el-checkbox>
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
  data() {
    return {
      hasSelected: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    init () {
      this.hasSelected = this.crud.selectedRowKeys.map(item => item);
    },
    rowCheck(val, row) {
      const rowKey = this.crud.getRowKey(row);
      console.log('111')
      if (val) {
        this.hasSelected.push(rowKey);
      } else {
        const index = this.hasSelected.findIndex((item) => item === rowKey);
        this.hasSelected.splice(index, 1);
      }
      this.crud.$emit('onSelectChange', this.hasSelected);
      this.crud.$emit("update:selectedRowKeys", this.hasSelected);
    },
    getCheck(row) {
      const rowKey = this.crud.getRowKey(row);
      return this.hasSelected.includes(rowKey);
    }
  }
};
</script>
