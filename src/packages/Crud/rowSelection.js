export default {
  data() {
    return {
      hasSelected: [],
      checkAll: false,
      isIndeterminate: false,
    };
  },
  watch: {
    selectedRowKeys: {
      handler() {
        this.hasSelected = this.selectedRowKeys.map((item) => item);
      },
      immediate: true,
    },
    hasSelected: {
      handler(val) {
        if (this.tableOption.rowSelection) {
          this.checkAll =
            this.tableData.length > 0 &&
            this.tableData.every((row) => this.getCheck(row));
          this.isIndeterminate =
            val.length > 0 &&
            this.tableData.some((row) => this.getCheck(row)) &&
            !this.tableData.every((row) => this.getCheck(row));
        }
      },
    },
  },
  methods: {
    getCheck(row) {
      if (!this.tableOption.rowSelection) {
        return;
      }
      return this.hasSelected.includes(this.getRowKey(row));
    },
    rowCheck(val, row) {
      const rowKey = this.getRowKey(row);
      if (val) {
        this.hasSelected.push(rowKey);
      } else {
        const index = this.hasSelected.findIndex((item) => item === rowKey);
        this.hasSelected.splice(index, 1);
      }
      this.$emit("onSelectChange", this.hasSelected);
      this.$emit("update:selectedRowKeys", this.hasSelected);
    },
    allCheck(val) {
      if (val) {
        let selected = this.tableData.filter((row) => !this.getCheck(row));
        this.hasSelected = this.hasSelected.concat(
          selected.map((row) => this.getRowKey(row))
        );
      } else {
        let selected = this.tableData.filter((row) => this.getCheck(row));
        this.hasSelected = this.hasSelected.filter(
          (item) => !selected.map((row) => this.getRowKey(row)).includes(item)
        );
      }
      this.$emit("onSelectChange", this.hasSelected);
      this.$emit("update:selectedRowKeys", this.hasSelected);
    },
  },
};
