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
  data () {
    return {
      dropRowClass: '.el-table__body-wrapper > table > tbody'
    }
  },
  methods: {
    setSort () {
      this.rowDrop()
      // this.columnDrop()
    },
    rowDrop () {
      const el = this.crud.$refs.table.$el.querySelectorAll(this.dropRowClass)[0]
      this.crud.tableDrop(el, evt => {
        console.log(evt)
        const oldIndex = evt.oldIndex;
        const newIndex = evt.newIndex;
        const targetRow = this.crud.tableData.splice(oldIndex, 1)[0]
        this.crud.tableData.splice(newIndex, 0, targetRow)
        this.crud.$emit('sortable-change', oldIndex, newIndex, targetRow, this.crud.tableData)
      })
    },
  }
};
</script>
