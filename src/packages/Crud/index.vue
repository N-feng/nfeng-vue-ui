<template>
  <div class="crud-component">
    <!-- 搜索表单 -->
    <div v-if="items.length" class="search-form">
      <!-- 搜索表单 -->
      <ygp-form
        ref="searchForm"
        v-model="searchForm"
        :option="{ items }"
        :enable-enter-search="tableOption.enableEnterSearch"
        :label-width="tableOption.labelWidth"
        :dic="dic"
        :size="size"
        :count="count"
        @submit="searchSubmit"
        @reset="searchReset"
        @change="crudFormChange"
        @remote="(callback, query, prop) => $emit('remote', callback, query, prop)"
      >
        <!-- 搜索按钮 -->
        <el-col
          slot="menu"
          :span="tableOption.searchSpan || 8"
          :offset="type === 'dialog' ? 0 : offset"
          style="text-align: right;"
        >
          <el-form-item class="dialog-search-btns">
            <slot name="preSearchMenu" :searchForm="searchForm" :size="size"></slot>
            <el-button
              type="primary"
              :size="size"
              @click="$refs.searchForm.submitForm();$emit('submitBtn')"
            >查询</el-button>
            <el-button :size="size" :plain="true" @click="$refs.searchForm.resetForm()">重置</el-button>
            <el-button
              v-if="getItemShow(option.exportBtn !== undefined ? option.exportBtn : false)"
              :size="size"
              :plain="true"
              @click="exportForm"
            >导出</el-button>
            <slot name="searchMenu" :searchForm="searchForm" :size="size"></slot>
            <el-button
              v-if="showSearchFormColumnLength > 5"
              :size="size"
              type="text"
              @click="expand = !expand"
            >
              {{ expand ? "收起" : "展开" }}
              <i
                :class="expand ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
              ></i>
            </el-button>
          </el-form-item>
        </el-col>
      </ygp-form>
    </div>
    <!--  表单表格之间插槽  -->
    <slot name="middleDiv" />
    <!-- 表格 -->
    <div class="table-component">
      <!-- 表格操作/标题 -->
      <div v-if="tableOption.operate || tableOption.tableTitle" class="space-center crud-header">
        <div v-if="tableOption.tableTitleRequire" class="red-star">*</div>
        <h3
          class="crud-title"
          :class="{ 'crud-title-large': tableOption.titleSize === 'large' }"
        >{{ tableOption.tableTitle }}</h3>
        <div>
          <template v-for="(item, index) in tableOption.operate">
            <el-button
              v-if="getItemShow(item.show ? item.show : true)"
              :key="index"
              :size="item.size ? item.size : size"
              :type="item.type"
              @click="$emit(item.operate, searchForm)"
            >{{ item.title }}</el-button>
          </template>
        </div>
      </div>
      <!-- 表格提示标语 -->
      <slot name="tip" />
      <!-- 表格主体 -->
      <el-form v-if="tableOption" ref="cellForm" :model="cellForm" class="cell-form">
        <el-table
          ref="table"
          :data="cellForm.list"
          v-bind="tableOption"
          :row-key="tableOption.rowKey"
          :default-expand-all="tableOption.defaultExpandAll"
          :expand-row-keys="tableOption.expandRowKeys"
          :row-class-name="tableRowClassName"
          :height="tableOption.height"
          @current-change="(currentRow, oldCurrentRow) => emitEventHandler('current-change', currentRow, oldCurrentRow)"
          @selection-change="selectionChange"
          @row-click="rowClick"
          @sort-change="({ column, prop, order }) => emitEventHandler('sort-change', { column, prop, order })"
        >
          <!-- 折叠面板  -->
          <el-table-column v-if="tableOption.expand" type="expand">
            <template slot-scope="{ row, $index }">
              <slot :row="row" :index="$index" name="expand"></slot>
            </template>
          </el-table-column>
          <!-- 选择框 -->
          <el-table-column
            v-if="tableOption.selection"
            :reserve-selection="tableOption.reserveSelection"
            type="selection"
            width="50"
            align="center"
            fixed="left"
            :selectable="tableOption.checkSelectable"
          ></el-table-column>
          <el-table-column
            v-if="tableOption.rowSelection"
            type="check"
            width="50"
            align="center"
            fixed="left"
          >
            <template slot="header" slot-scope="scope">
              <el-checkbox
                v-if="tableOption.checkAll !== false"
                v-model="checkAll"
                :indeterminate="isIndeterminate"
                @change="(val) => allCheck(val, scope)"
              ></el-checkbox>
            </template>
            <template slot-scope="{ row }">
              <el-checkbox :value="getCheck(row)" @change="(val) => rowCheck(val, row)"></el-checkbox>
            </template>
          </el-table-column>
          <!-- 序号 -->
          <el-table-column
            v-if="tableOption.index"
            type="index"
            width="50"
            align="center"
            label="序号"
          ></el-table-column>
          <!-- 动态列 -->
          <template v-for="(column, index) in showColumn">
            <el-table-column
              :key="index"
              v-bind="{...column, align: tableOption.align || column.align || 'center', headerAlign: column.headerAlign || column.align}"
            >
              <!-- 自定义表头 -->
              <template slot="header" slot-scope="scope">
                <slot
                  v-if="column.headerSlot"
                  :name="column.prop + 'Header'"
                  v-bind="Object.assign(scope, { column })"
                ></slot>
                <span
                  v-else
                  :class="{ required: column.rules && column.rules.length }"
                >{{ column.label }}</span>
              </template>
              <!-- 自定义列模板 -->
              <template slot-scope="scope" :scope="newSlotScope ? 'scope' : false">
                <span
                  v-if="column.filter"
                >{{ Vue.filter(column["filter"])(scope.row[column.prop]) }}</span>
                <span v-else-if="column.slotName">
                  <slot
                    :name="column.slotName"
                    :row="scope.row"
                    :$index="scope.$index"
                    :prop="`list.${scope.$index}.${column.prop}`"
                    :rules="column.rules"
                    :placeholder="getPlaceholder(column)"
                  />
                </span>
                <span
                  v-else-if="column.formatter"
                >{{ column.formatter( scope.row, scope.column, scope.row[column.prop], scope.$index ) }}</span>
                <div
                  v-else-if="column.isEllipsis"
                  :title="scope.row[column.prop]"
                  :style="{ width: scope.column.width ? scope.column.width : '150px' }"
                  class="text-overflow"
                >{{scope.row[column.prop]}}</div>
                <!-- 表单控件 -->
                <el-form-item
                  v-else-if="getItemShow(column.edit, scope.row)"
                  :prop="`list.${scope.$index}.${column.prop}`"
                  :rules="getRules(column.rules, scope.row, cellForm.list)"
                >
                  <!-- 动态组件 -->
                  <component
                    :is="getComponent(column.type)"
                    v-model="scope.row[column.prop]"
                    v-bind="column"
                    :width="undefined"
                    :size="column.size ? column.size : size"
                    :placeholder="getPlaceholder(column)"
                    :class="getClassName(column.class, scope.row)"
                    :disabled="getItemShow(column.disabled, scope.row)"
                    :options="getOptions(column,scope.row)"
                    @focus="(value, option) => $emit('focus', scope.row, scope.$index, column.prop, value, option)"
                    @change="(value, option) => $emit('change', scope.row, scope.$index, column.prop, value, option)"
                  ></component>
                </el-form-item>
                <span
                  v-else-if="column.render"
                  :class="getClassName(column.class, scope.row)"
                >{{ column.render(scope.row) }}</span>
                <span 
                  v-else-if="column.emptyLine"
                  :class="getClassName(column.class, scope.row)"
                >
                  {{ scope.row[column.propName || column.prop] || '-' }}
                </span>
                <span
                  v-else
                  :class="getClassName(column.class, scope.row)"
                >{{ scope.row[column.propName || column.prop] }}</span>
              </template>
            </el-table-column>
          </template>
          <!-- 操作栏 -->
          <el-table-column
            v-if="tableOption.menu"
            :width="tableOption.menuWidth || 200"
            fixed="right"
            label="操作"
            align="center"
          >
            <template slot-scope="{ row, $index }">
              <el-button
                v-if="getMenuShow(tableOption.viewBtn, row, $index)"
                type="text"
                :size="size"
                icon="el-icon-view"
                @click="$emit('row-view', row, $index)"
              >查看</el-button>
              <el-button
                v-if="getMenuShow(tableOption.editBtn, row, $index)"
                type="text"
                :size="size"
                icon="el-icon-edit"
                @click="$emit('row-edit', row, $index)"
              >编辑</el-button>
              <el-popconfirm
                v-if="getMenuShow(tableOption.delBtn, row, $index)"
                class="btn-del"
                confirm-button-text="好的"
                cancel-button-text="不用了"
                icon="el-icon-info"
                icon-color="red"
                :title="tableOption.delTitle || '确定删除吗？'"
                @confirm="$emit('row-del', row, $index)"
              >
                <el-button slot="reference" type="text" :size="size" icon="el-icon-delete">删除</el-button>
              </el-popconfirm>
              <template v-if="tableOption.customMenu">
                <template v-for="(menu, i) in tableOption.customMenu">
                  <el-button
                    v-if="getMenuShow(menu.show ? menu.show : true, row, $index)"
                    :key="i"
                    type="text"
                    :size="size"
                    @click="handleCustomMenu(row, $index, menu)"
                  >{{ menu.text }}</el-button>
                </template>
              </template>
              <slot name="menu" :row="row" :index="$index" :size="size"></slot>
            </template>
          </el-table-column>
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
  </div>
</template>

<script>
// import { getObjType } from "@/utils/util.js";

export default {
  name: "YgpCrud",
  // provide() {
  //   return {
  //     crud: this
  //   };
  // },
  props: {
    size: {
      type: String,
      default: "small",
      validator: (value) => {
        const types = ["large", "medium", "small", "mini"];
        const valid = types.indexOf(value.toLowerCase()) !== -1 || value === "";
        if (!valid) {
          throw new Error(
            `Size must be one of ['large', 'medium', 'small', 'mini']`
          );
        }
        return valid;
      },
    },
    // 表格配置
    option: {
      type: Object,
      required: true,
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
    // 分页数据
    page: {
      type: Object,
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
    type: {
      type: String,
    },
    value: {
      type: Object,
    },
    rowSelection: {
      type: Object,
    },
    selectedRowKeys: {
      type: Array,
      default: () => [],
    },
    defaultShowColumns: {
      type: Number,
      default: 5,
    },
  },
  data() {
    return {
      tableData: [],
      tableOption: {},
      tableSelect: [],
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
    };
  },
  computed: {
    // 搜索表单配置
    items() {
      let items = [];
      if (this.tableOption.columns) {
        items = this.tableOption.columns
          .filter((item) => item.search)
          .map((item) => {
            return {
              ...item,
              width: undefined,
            };
          });
      }
      return items;
    },
    // 表格数据
    cellForm() {
      return {
        list: this.tableData,
      };
    },
    count() {
      if (
        (!this.expand &&
          this.showSearchFormColumnLength < this.defaultShowColumns) ||
        this.expand
      ) {
        return this.showSearchFormColumnLength;
      }
      return this.defaultShowColumns;
    },
    showSearchFormColumnLength() {
      if (this.tableOption.columns) {
        return (
          this.tableOption.columns
            // .filter((column) =>
            //   this.getItemShow(column.show !== undefined ? column.show : true)
            // )
            .filter((column) => column.search).length
        );
      }
      return 0;
    },
    showColumn() {
      // tableOption.columns
      // getItemShow(column.show !== undefined ? column.show : true)
      if (this.tableOption.columns) {
        return this.tableOption.columns.filter((column) =>
          this.getItemShow(column.show !== undefined ? column.show : true)
        );
      }
      return [];
    },
    offset() {
      return 24 - ((this.count * 8) % 24) - 8;
    },
  },
  watch: {
    option: {
      handler(val) {
        this.tableOption = val;
      },
      deep: true,
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
    this.tableOption = this.option;
    this.expand = this.tableOption.expandDefault; //查询条件默认展开
    this.tableDataInit(this.data);
    this.formDataInit();
    this.pageDataInit();
    this.onLoad();
  },
  activated() {
    this.onLoad();
  },
  methods: {
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
    searchReset() {
      // this.searchForm = {};
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
        this.$refs["cellForm"].validate((valid, msg) => {
          resolve({ formData: this.cellForm, errorData: msg, valid });
          if (valid) {
            this.$emit("submit", this.cellForm);
          }
        });
      });
    },
    // 表格操作回调
    emitEventHandler(event) {
      this.$emit(event, ...Array.from(arguments).slice(1));
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
    getRowKey(row) {
      if (typeof this.tableOption.rowKey === "function") {
        return this.tableOption.rowKey(row);
      }
      return row.key;
    },
    getCheck(row) {
      return this.selectedRowKeys.includes(this.getRowKey(row));
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
    // 操作按钮的权限控制
    getMenuShow(option, row, $index) {
      if (typeof option === "function") {
        return option({
          rowData: { row, $index },
          formData: this.searchForm,
          queryData: this.$route.query,
        });
      } else if (Array.isArray(option)) {
        return option.includes(this.$route.query.type);
      } else {
        return option;
      }
    },
    // 自定义操作的显示
    getCustomMenuShow(show, row) {
      if (typeof show === "function") {
        return show({
          row,
        });
      } else {
        return true;
      }
    },
    // 自定义操作
    handleCustomMenu(row, index, menu) {
      this.$emit(menu.function, row, index);
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
  },
};
</script>
