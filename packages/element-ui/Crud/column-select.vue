<template>
    <div>
        <!-- ant-design 选择框 -->
        <el-table-column v-if="crud.tableOption.rowSelection"
                         type="check"
                         width="50"
                         align="center"
                         fixed="left">
            <template slot="header" slot-scope="{}">
                <el-checkbox v-model="checkAll"
                             :indeterminate="isIndeterminate"
                             @change="handleSelectAll"></el-checkbox>
            </template>
            <template slot-scope="{ row }">
                <el-checkbox :value="getCheck(row)"
                             @change="() => handleSelect(row)"></el-checkbox>
            </template>
        </el-table-column>
    </div>
</template>

<script>
    export default {
        name: "column-select",
        inject: ["crud"],
        props: {
            hasSelected: Array
        },
        data() {
            return {
                checkAll: false,
                isIndeterminate: false,
            };
        },
        watch: {
            hasSelected: {
                handler(val) {
                    if (this.crud.tableOption.rowSelection) {
                        this.checkAll =
                            this.crud.tableData.length > 0 &&
                            this.crud.tableData.every((row) => this.getCheck(row));
                        this.isIndeterminate =
                            val.length > 0 &&
                            this.crud.tableData.some((row) => this.getCheck(row)) &&
                            !this.crud.tableData.every((row) => this.getCheck(row));
                    }
                },
            },
        },
        methods: {
            getCheck(row) {
                if (!this.crud.tableOption.rowSelection) {
                    return;
                }
                return this.hasSelected.includes(this.crud.handleGetRowKeys(row));
            },
            handleSelect(row) {
                let rowKey = this.crud.handleGetRowKeys(row);
                let selected = !this.hasSelected.includes(rowKey);
                let hasSelected = this.hasSelected.map(item => item);
                if (selected) {
                    hasSelected.push(rowKey);
                } else {
                    let index = hasSelected.findIndex((item) => item === rowKey);
                    hasSelected.splice(index, 1);
                }
                this.$emit("update:hasSelected", hasSelected);
                this.crud.$emit("onSelectChange", hasSelected);
            },
            handleSelectAll(val) {
                let hasSelected = this.hasSelected.map(item => item);
                if (val) {
                    let selected = this.crud.tableData.filter((row) => !this.getCheck(row));
                    hasSelected = hasSelected.concat(
                        selected.map((row) => this.crud.handleGetRowKeys(row))
                    );
                } else {
                    let selected = this.crud.tableData.filter((row) => this.getCheck(row));
                    hasSelected = hasSelected.filter(
                        (item) => !selected.map((row) => this.crud.handleGetRowKeys(row)).includes(item)
                    );
                }
                this.$emit("update:hasSelected", hasSelected);
                this.crud.$emit("onSelectChange", hasSelected);
            },
        },
    }
</script>

<style scoped>

</style>