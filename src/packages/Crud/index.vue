<template>
  <div class="crud-component">
    <!-- 搜索表单 -->
    <header-search
      ref="headerSearch"
      :search="searchForm"
      @submit="searchSubmit"
      @reset="searchReset"
    >
      <template slot="searchMenu" slot-scope="scope">
        <slot name="searchMenu" v-bind="scope"></slot>
      </template>
    </header-search>
    <!--  表单表格之间插槽  -->
    <slot name="middleDiv" />
    <!-- 表格 -->
    <div class="table-component" :class="[{'table--fullscreen':fullscreen}]">
      <!-- 表格功能列 -->
      <header-menu v-if="vaildData(tableOption.header,true)" ref="headerMenu">
        <template slot="menuLeft" slot-scope="scope">
          <slot name="menuLeft" v-bind="scope"></slot>
        </template>
        <template slot="menuRight" slot-scope="scope">
          <slot name="menuRight" v-bind="scope"></slot>
        </template>
      </header-menu>
      <!-- 表格提示标语 -->
      <slot name="tip" />
      <!-- 表格主体 -->
      <el-form
        v-if="tableOption"
        ref="cellForm"
        :model="cellForm"
        class="cell-form"
        :show-message="false"
        @validate="handleValidate"
      >
        <el-table
          v-if="reload"
          ref="table"
          :data="cellForm.list"
          :row-key="tableOption.rowKey"
          :size="controlSize"
          :expand-row-keys="tableOption.expandRowKeys"
          :default-expand-all="tableOption.defaultExpandAll"
          :show-summary="tableOption.showSummary"
          :summary-method="tableOption.summaryMethod"
          :row-class-name="tableRowClassName"
          :height="tableOption.height"
          @current-change="(currentRow, oldCurrentRow) => emitEventHandler('current-change', currentRow, oldCurrentRow)"
          @selection-change="selectionChange"
          @row-click="rowClick"
          @sort-change="({ column, prop, order }) => emitEventHandler('sort-change', { column, prop, order })"
        >
          <!-- 暂无数据提醒 -->
          <template slot="empty">
            <div class="ygp-crud__empty">
              <ygp-empty
                image="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAxKSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxlbGxpcHNlIGZpbGw9IiNGNUY1RjUiIGN4PSIzMiIgY3k9IjMzIiByeD0iMzIiIHJ5PSI3Ii8+CiAgICA8ZyBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0iI0Q5RDlEOSI+CiAgICAgIDxwYXRoIGQ9Ik01NSAxMi43Nkw0NC44NTQgMS4yNThDNDQuMzY3LjQ3NCA0My42NTYgMCA0Mi45MDcgMEgyMS4wOTNjLS43NDkgMC0xLjQ2LjQ3NC0xLjk0NyAxLjI1N0w5IDEyLjc2MVYyMmg0NnYtOS4yNHoiLz4KICAgICAgPHBhdGggZD0iTTQxLjYxMyAxNS45MzFjMC0xLjYwNS45OTQtMi45MyAyLjIyNy0yLjkzMUg1NXYxOC4xMzdDNTUgMzMuMjYgNTMuNjggMzUgNTIuMDUgMzVoLTQwLjFDMTAuMzIgMzUgOSAzMy4yNTkgOSAzMS4xMzdWMTNoMTEuMTZjMS4yMzMgMCAyLjIyNyAxLjMyMyAyLjIyNyAyLjkyOHYuMDIyYzAgMS42MDUgMS4wMDUgMi45MDEgMi4yMzcgMi45MDFoMTQuNzUyYzEuMjMyIDAgMi4yMzctMS4zMDggMi4yMzctMi45MTN2LS4wMDd6IiBmaWxsPSIjRkFGQUZBIi8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K"
                :desc="tableOption.emptyText"
              ></ygp-empty>
            </div>
          </template>
          <div>
            <column-default ref="columnDefault">
              <template slot="expand" slot-scope="{row,index}">
                <slot :row="row" :index="index" name="expand"></slot>
              </template>
            </column-default>
            <!-- 动态列 -->
            <template v-for="column in list">
              <column-slot :key="column.label" :column="column">
                <template v-for="item in mainSlot" :slot="item" slot-scope="scope">
                  <slot v-bind="scope" :name="item"></slot>
                </template>
              </column-slot>
            </template>
            <column-menu>
              <template slot="menu" slot-scope="scope">
                <slot name="menu" v-bind="scope"></slot>
              </template>
            </column-menu>
          </div>
        </el-table>
      </el-form>
      <div class="footer">
        <div class="footer-left">
          <slot name="footer"></slot>
        </div>
        <!-- 分页 -->
        <el-pagination
          v-if="pageData.total"
          class="pagination"
          background
          :current-page.sync="pageData.currentPage"
          :page-size="pageData.pageSize"
          :page-sizes="pageData.pageSizes"
          :layout="pageData.layout"
          :total="pageData.total"
          @size-change="sizeChange"
          @current-change="pageChange"
        ></el-pagination>
      </div>
    </div>
    <!-- 动态列 -->
    <dialog-column ref="dialogColumn"></dialog-column>
    <!-- 表单 -->
    <dialog-form ref="dialogForm"></dialog-form>
  </div>
</template>

<script>
import headerSearch from "./header-search.vue";
import headerMenu from "./header-menu.vue";
import columnDefault from "./column-default.vue";
import columnSlot from "./column-slot.vue";
import columnMenu from "./column-menu.vue";
import dialogColumn from "./dialog-column.vue";
import dialogForm from "./dialog-form.vue";
import { validatenull } from "@/utils/validate";
import { defaultColumn } from "./config.js";
import { arraySort } from "@/utils/util";
import permission from '@/utils/permission';

export default {
  name: "YgpCrud",
  directives: {
    permission
  },
  provide() {
    return {
      crud: this,
    };
  },
  components: {
    headerSearch, // 搜索
    headerMenu, // 菜单头部
    columnDefault, // 默认列
    columnSlot, // 动态列
    columnMenu, // 操作栏
    dialogColumn, // 显隐列
    dialogForm, // 表单
  },
  props: {
    // 表格配置
    option: {
      type: Object,
      required: true,
      default: () => {
        return {};
      },
    },
    // 枚举库
    dic: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // 分页数据
    page: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // 权限控制
    permission: {
      type: [Function, Object],
      default: () => {
        return {};
      }
    },
    value: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // 表格数据
    data: {
      type: Array,
      required: true,
      default: () => {
        return [];
      },
    },
    rowSelection: {
      type: Object,
    },
    selectedRowKeys: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      reload: true,
      listError: {},
      tableData: [],
      tableOption: {},
      tableSelect: [],
      tableForm: {},
      tableIndex: -1,
      pageData: {
        total: 0, // 总页数
        pagerCount: 7, //超过多少条隐藏
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
        pageSizes: [10, 20, 30, 40, 50, 100],
        layout: "total, sizes, prev, pager, next, jumper",
        background: true, // 背景颜色
      },
      searchForm: {},
      expand: false,
      checkAll: false,
      isIndeterminate: false,
      objectOption: {},
      defaultColumn,
      defaultBind: {},
      fullscreen: false,
      editableKeys: [],
    };
  },
  computed: {
    cellForm() {
      let list = this.tableData;
      list = list.filter((ele) => {
        let result = [];
        for (var o in this.objectOption) {
          if (!validatenull(this.objectOption[o].screenValue)) {
            let column = this.objectOption[o];
            let prop = column.propName || column.prop;
            let value = ele[prop] + "";
            // let value = (ele['$' + o] ? ele['$' + o] : ele[o]) + ''
            result.push(value.indexOf(this.objectOption[o].screenValue) !== -1);
          }
        }
        if (validatenull(result)) {
          return true;
        }
        return eval(result.join("&&"));
      });
      return {
        list,
      };
    },
    list() {
      let result = [...this.columnOption];
      result = arraySort(
        result,
        "index",
        (a, b) =>
          this.objectOption[a.prop]?.index - this.objectOption[b.prop]?.index
      );
      return result;
    },
    mainSlot() {
      let result = [];
      this.propOption.forEach((item) => {
        if (this.$scopedSlots[item.prop]) result.push(item.prop);
      });
      return this.getSlotList(
        ["Header", "Form"],
        this.$scopedSlots,
        this.propOption
      ).concat(result);
    },
    propOption() {
      let result = [];
      function findProp(list = []) {
        if (!Array.isArray(list)) return;
        list.forEach((ele) => {
          result.push(ele);
          if (ele.children) findProp(ele.children);
        });
      }
      findProp(this.columnOption);
      return result;
    },
    columnOption() {
      return this.tableOption.columns || [];
    },
    isMediumSize() {
      return this.controlSize;
    },
    controlSize() {
      return this.tableOption.size;
    },
  },
  watch: {
    propOption: {
      handler(val) {
        this.objectOption = {};
        val.forEach((ele) => (this.objectOption[ele.prop] = ele));
        this.columnInit && this.columnInit();
      },
      deep: true,
    },
    option: {
      handler(val) {
        this.tableOption = val;
        this.expand = val.expandDefault; // 查询条件默认展开
      },
      deep: true,
      immediate: true,
    },
    data: {
      handler(val) {
        this.tableDataInit(val);
      },
      deep: true,
    },
    value: {
      handler(val) {
        this.searchForm = val;
      },
    },
    selectedRowKeys: {
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
      // immediate: true,
    },
  },
  created() {
    this.tableDataInit(this.data);
    this.formDataInit();
    this.pageDataInit();
    this.onLoad();
  },
  activated() {
    this.onLoad();
  },
  methods: {
    handleValidate(prop, valid, msg) {
      if (!this.listError[prop]) {
        this.$set(this.listError, prop, { valid: false, msg: "" });
      }
      this.listError[prop].valid = !valid;
      this.listError[prop].msg = msg;
    },
    getPermission(key, row, index) {
      if (typeof this.permission === "function") {
        return this.permission(key, row, index)
      } else if (!this.validatenull(this.permission[key])) {
        return this.permission[key]
      } else {
        return true;
      }
    },
    // 表格行样式
    tableRowClassName({ row }) {
      let key = this.tableOption.rowKey;
      if (key) {
        //有rowKey-支持跨页
        let selected =
          this.tableSelect.find((f) => f[key] === row[key]) ||
          this.getCheck(row);
        return `${selected ? "selected" : ""} ${
          (this.tableOption.rowClassName &&
            this.tableOption.rowClassName({ row })) ||
          ""
        }`;
      } else {
        //没有rowKey-不支持跨页
        let selected2 =
          this.tableSelect.find(
            (f) => JSON.stringify(f) === JSON.stringify(row)
          ) || this.getCheck(row);
        return `${selected2 ? "selected" : ""} ${
          (this.tableOption.rowClassName &&
            this.tableOption.rowClassName({ row })) ||
          ""
        }`;
      }
    },
    //可选表格-当前行点击处理
    rowClick(row, column) {
      //暂时去掉，1.0.5上
      //如果配置了表格多选且点击位置不为操作栏
      if (this.tableOption.selection && column.label !== "操作") {
        if (this.tableOption.checkSelectable) {
          //如果配置了禁用勾选条件
          this.tableOption.checkSelectable(row) &&
            this.$refs.table.toggleRowSelection(row);
        } else {
          //没设置禁用勾选条件
          this.$refs.table.toggleRowSelection(row);
        }
      }
      if (
        this.tableOption.rowSelection &&
        column.label !== "操作" &&
        column.type !== "check"
      ) {
        this.rowCheck(!this.getCheck(row), row);
      }
    },
    // 表格组件-搜索表单回调
    crudFormChange(value, option, formData) {
      this.$emit("crudFormChange", value, option, formData);
    },
    // 表格数据初始化
    tableDataInit(data) {
      this.tableData = data;
      if (this.tableOption.rowSelection) {
        this.checkAll =
          this.tableData.length > 0 &&
          this.tableData.every((row) => this.getCheck(row));
        this.isIndeterminate =
          this.selectedRowKeys.length > 0 &&
          this.tableData.some((row) => this.getCheck(row)) &&
          !this.tableData.every((row) => this.getCheck(row));
      }
    },
    // 搜索表单数据初始化
    formDataInit() {
      let searchForm = {};
      if (!this.tableOption.columns) return;
      this.tableOption.columns.forEach((column) => {
        if (column.value !== undefined && column.value !== "") {
          searchForm[column.prop] = column.value;
        }
      });
      this.searchForm = Object.assign(searchForm, this.value);
      return Object.assign(searchForm, this.value);
    },
    // 初始化分页数据
    pageDataInit() {
      this.pageData = Object.assign(this.pageData, this.page);
      this.updateValue();
    },
    // 导出按钮
    exportForm() {
      this.$emit("export-form", this.searchForm);
    },
    // 查询按钮回调
    searchSubmit(formData) {
      this.searchForm = Object.assign(this.searchForm, formData);
      this.pageData.currentPage = 1;
      // this.updateValue();
      this.onLoad();
      // 请求数据清空已选择行
      this.clearSelection();

      this.$emit("search-change", { formData: this.searchForm });
    },
    clearSelection() {
      this.$refs.table.clearSelection();
      this.$emit("selection-change", []);
    },
    // 重置按钮回调
    searchReset(formData) {
      this.searchForm = formData;
      // this.formDataInit(); // vue2 缺陷 日期数组不通知值改变
      this.pageData.currentPage = 1;
      this.$emit("reset");
      this.updateValue();
      this.onLoad();
      // 请求数据清空已选择行
      this.clearSelection();
    },
    // 表格提交回调
    submitForm() {
      return new Promise((resolve) => {
        this.$refs.cellForm.validate((valid, msg) => {
          resolve({ formData: this.cellForm, errorData: msg, valid });
          if (valid) {
            this.$emit("submit", this.cellForm);
          }
        });
      });
    },
    // 对部分表单字段进行校验
    validateCellForm() {
      return new Promise((resolve) => {
        this.$refs.cellForm.validate((valid, msg) => {
          resolve(msg);
        });
      });
    },
    // 表格操作回调
    emitEventHandler(event) {
      this.$emit(event, ...Array.from(arguments).slice(1));
    },
    //刷新事件
    refreshChange() {
      this.$emit("refresh-change");
    },
    // 选中实例
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.table.toggleRowSelection(row);
        });
      } else {
        this.$refs.table.clearSelection();
      }
    },
    // 选择回调
    selectionChange(val) {
      this.tableSelect = val;
      this.$emit("selection-change", this.tableSelect);
    },
    allCheck(val) {
      if (val) {
        // 新增选择的数据
        let selected = this.tableData.filter((row) => {
          if (
            this.selectedRowKeys.some((item) => item === this.getRowKey(row))
          ) {
            return false;
          }
          return true;
        });
        let selectedRowKeys = this.selectedRowKeys.concat(
          selected.map((row) => this.getRowKey(row))
        );

        this.$emit("update:selectedRowKeys", selectedRowKeys);
        this.$emit("all-check", val, JSON.parse(JSON.stringify(selected)));
      } else {
        // 已经选择的数据
        let selected = this.tableData.filter((item) => {
          if (this.tableData.some((row) => this.getRowKey(row) === item)) {
            return false;
          }
          return true;
        });
        let selectedRowKeys = this.selectedRowKeys.filter((item) => {
          return !selected.map((row) => this.getRowKey(row)).includes(item);
        });

        this.$emit("update:selectedRowKeys", selectedRowKeys);
        this.$emit("all-check", val, selected);
      }
    },
    rowCheck(val, row) {
      const rowKey = this.getRowKey(row);
      if (val) {
        const selectedRowKeys = this.selectedRowKeys.concat([rowKey]);
        this.$emit("update:selectedRowKeys", selectedRowKeys);
      } else {
        const selectedRowKeys = this.selectedRowKeys.map((item) => item);
        const index = this.selectedRowKeys.findIndex((item) => item === rowKey);
        if (index !== -1) {
          selectedRowKeys.splice(index, 1);
        }
        this.$emit("update:selectedRowKeys", selectedRowKeys);
      }
      this.$nextTick(() => {
        this.$emit("row-check", val, JSON.parse(JSON.stringify(row)));
      });
    },
    //行编辑点击
    rowCell(val, row) {
      const rowKey = this.getRowKey(row);
      if (val) {
        this.editableKeys.push(rowKey);
      } else {
        const index = this.editableKeys.findIndex((item) => item === rowKey);
        if (index !== -1) {
          this.editableKeys.splice(index, 1);
        }
      }
      this.$emit("row-edit", val, JSON.parse(JSON.stringify(row)));
    },
    //对象克隆
    rowClone(row) {
      let rowData = {};
      Object.keys(row).forEach((ele) => {
        if (!["_parent", "children"].includes(ele)) {
          rowData[ele] = row[ele];
        }
      });
      return rowData;
    },
    // 编辑
    rowEdit(row, index) {
      this.tableForm = this.rowClone(row);
      this.tableIndex = index;
      this.$emit("input", this.tableForm);
      this.$refs.dialogForm.show("edit");
    },
    //查看
    rowView(row, index) {
      this.tableForm = this.rowClone(row);
      this.tableIndex = index;
      this.$emit("input", this.tableForm);
      this.$refs.dialogForm.show("view");
    },
    getRowKey(row) {
      if (typeof this.tableOption.rowKey === "function") {
        return this.tableOption.rowKey(row);
      }
      if (typeof this.tableOption.rowKey === "string") {
        return row[this.tableOption.rowKey];
      }
      return row.key;
    },
    getCheck(row) {
      return this.selectedRowKeys.includes(this.getRowKey(row));
    },
    getSlotList(list = [], slot, propList) {
      propList = propList.map((ele) => ele.prop);
      return Object.keys(slot).filter((ele) => {
        let result = false;
        if (!propList.includes(ele)) {
          list.forEach((name) => {
            if (ele.includes(name)) result = true;
          });
        }
        return result;
      });
    },
    /**
     * 动态获取组件
     */
    getComponent(type) {
      let result;
      if ([undefined, "", "number", "textarea"].includes(type)) {
        result = "input";
      } else if (["date", "month"].includes(type)) {
        result = "date-picker";
      } else {
        result = type;
      }
      return `ygp-${result}`;
    },
    // 获取预留字
    getPlaceholder(column) {
      if (!column.disabled) {
        if (column.placeholder) {
          return column.placeholder;
        } else if (column.type === "select" || column.type === "input-date") {
          return `请选择${column.label}`;
        } else {
          return `请输入${column.label}`;
        }
      }
    },
    // 获取枚举数据
    getOptions(column, row) {
      if (column.dicName) {
        return this.dic[column.dicName];
      } else {
        if (typeof column.options === "function") {
          return column.options({ row });
        }
        return column.options;
      }
    },
    // 获取检验规则
    getRules(rules, row) {
      if (typeof rules === "function") {
        return rules({
          row,
          tableData: this.tableData,
          formData: this.searchForm,
        });
      } else {
        return rules;
      }
    },
    // 字段 class
    getClassName(className, row) {
      if (typeof className === "function") {
        return className({
          row,
        });
      } else {
        return className;
      }
    },
    // 页面逻辑决定是否展示
    getItemShow(show, row) {
      if (Array.isArray(show)) {
        return show.includes(this.$route.query.type);
      } else if (typeof show === "function") {
        return show({
          queryData: this.$route.query,
          formData: this.searchForm,
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
    // 更新分页数据
    updateValue() {
      this.$emit("update:page", this.pageData);
    },
    // 页大小回调
    sizeChange(val) {
      this.pageData.currentPage = 1;
      this.pageData.pageSize = val;
      this.updateValue();
      this.onLoad();
      this.$emit("size-change", val);
    },
    // 页码回调
    pageChange(val) {
      this.updateValue();
      this.onLoad();
      this.$emit("page-change", val);
    },
    onLoad() {
      this.$emit("on-load", {
        pageData: this.pageData,
        formData: this.searchForm,
      });
    },
    columnInit() {
      this.propOption.forEach((column) => {
        if (this.defaultBind[column.prop] === true) return;
        this.defaultColumn.forEach((ele) => {
          if (!this.objectOption[column.prop][ele.prop] && ele.prop == "index")
            this.$set(this.objectOption[column.prop], ele.prop, "");
          if (["hide", "filters", "index", "sortable"].includes(ele.prop)) {
            this.$watch(`objectOption.${column.prop}.${ele.prop}`, () =>
              this.refreshTable()
            );
          }
        });
        this.defaultBind[column.prop] = true;
      });
    },
    refreshTable(callback) {
      this.reload = false;
      this.$nextTick(() => {
        this.reload = true;
        //是否开启表格排序
        // setTimeout(() => this.$refs.columnDefault.setSort());
        callback && callback();
      });
    },
  },
};
</script>

<style lang="scss">
@import "./_index.scss";
</style>
