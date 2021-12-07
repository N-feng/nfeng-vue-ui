<template>
  <div class="crud-component">
    <!-- 搜索表单 -->
    <header-search
      ref="headerSearch"
      :search="search"
      :searchForm.sync="searchForm"
      @onSubmit="searchSubmit"
      @reset="searchReset"
    >
      <template slot="searchMenu" slot-scope="scope">
        <slot name="searchMenu" v-bind="scope"></slot>
      </template>
    </header-search>
    <!--  表单表格之间插槽  -->
    <slot name="middleDiv" />
    <!-- 表格 -->
    <div class="table-component" :class="[{ 'table--fullscreen': fullscreen }]">
      <!-- 表格功能列 -->
      <header-menu v-if="vaildData(tableOption.header, true)" ref="headerMenu">
        <template slot="menuLeft" slot-scope="scope">
          <slot name="menuLeft" v-bind="scope"></slot>
        </template>
        <template slot="menuRight" slot-scope="scope">
          <slot name="menuRight" v-bind="scope"></slot>
        </template>
      </header-menu>
      <!-- 表格提示标语 -->
      <el-tag class="crud__tip" v-if="tableOption.selection || tableOption.rowSelection">
        <span class="crud__tip-name">
          当前表格已选择
          <span class="crud__tip-count">{{ selectLen }}</span>
          项
        </span>
        <el-button
          type="text"
          size="small"
          @click="selectClear"
          v-permission="getPermission('selectClearBtn')"
          v-if="vaildData(tableOption.selectClearBtn, true) && tableOption.selection || tableOption.rowSelection">清 空</el-button>
      </el-tag>
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
          :row-key="handleGetRowKeys"
          :size="controlSize"
          :expand-row-keys="tableOption.expandRowKeys"
          :default-expand-all="tableOption.defaultExpandAll"
          :show-summary="tableOption.showSummary"
          :summary-method="tableOption.summaryMethod"
          :row-class-name="tableRowClassName"
          :height="tableOption.height"
          :stripe="tableOption.stripe"
          :border="tableOption.border"
          @current-change="currentRowChange"
          @selection-change="selectionChange"
          @row-click="rowClick"
          @sort-change="sortChange"
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
          <column :columnOption="columnOption">
            <column-default ref="columnDefault"
                            slot="header">
              <template slot-scope="{row,index}"
                        slot="expand">
                <slot :row="row"
                      :index="index"
                      name="expand"></slot>
              </template>
              <column-select ref="columnSelect"
                             slot="select"
                             :hasSelected.sync="hasSelected"></column-select>
            </column-default>
            <column-menu slot="footer">
              <template slot="menu" slot-scope="scope">
                <slot name="menu" v-bind="scope"></slot>
              </template>
              <template slot="menuBtn"
                        slot-scope="scope">
                <slot name="menuBtn"
                      v-bind="scope"></slot>
              </template>
            </column-menu>
          </column>
        </el-table>
      </el-form>
      <div class="footer">
        <div class="footer-left">
          <slot name="footer"></slot>
        </div>
        <!-- 分页 -->
        <table-page ref="tablePage"
                    :page="page"
                    :pageData.sync="pageData"></table-page>
      </div>
    </div>
    <!-- 动态列 -->
    <dialog-column ref="dialogColumn"></dialog-column>
    <!-- 表单 -->
    <dialog-form ref="dialogForm"></dialog-form>
  </div>
</template>

<script>
  import create from "../../common/create";
import headerSearch from "./header-search.vue";
import headerMenu from "./header-menu.vue";
import column from "./column.vue";
import columnDefault from "./column-default.vue";
import columnSelect from "./column-select.vue";
import columnMenu from "./column-menu.vue";
import dialogColumn from "./dialog-column.vue";
import dialogForm from "./dialog-form.vue";
import tablePage from "./table-page";
import { validatenull } from "../../utils/validate";
import { defaultColumn } from "./config.js";
import permission from "../../utils/permission";
import { deepClone } from "../../utils/util";
import { formInitVal } from "../../common/dataformat";
import init from "./init";
export default create({
  name: "crud",
  mixins: [init()],
  directives: {
    permission,
  },
  provide() {
    return {
      crud: this,
    };
  },
  components: {
    headerSearch, //搜索
    headerMenu, //菜单头部
    column, //列
    columnDefault, //默认列
    columnSelect, //选择列
    columnMenu, //操作栏
    dialogColumn, //显隐列
    dialogForm, //表单
    tablePage, //分页
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
    search: {
      type: Object,
      default () {
        return {};
      }
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
      },
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
      type: Boolean,
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
      pageData: {},
      searchForm: {},
      expand: false,
      objectOption: {},
      defaultColumn,
      defaultBind: {},
      fullscreen: false,
      editableKeys: [],
      // formIndexList: [],
      formCascaderList: {},
      btnDisabledList: {},
      btnDisabled: false,
      hasSelected: [],
    };
  },
  computed: {
    isSortable () {
      return this.tableOption.sortable;
    },
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
        list
      };
    },
    mainSlot() {
      let result = [];
      this.propOption.forEach((item) => {
        if (this.$scopedSlots[item.prop]) result.push(item.prop)
      });
      return this.getSlotList(["Header", "Form"], this.$scopedSlots, this.propOption).concat(result)
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
      return this.tableOption.size || "small";
    },
    selectLen() {
      if (this.tableOption.rowSelection) {
        return this.hasSelected.length;
      }
      return this.tableSelect ? this.tableSelect.length : 0;
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
      handler() {
        this.dataInit();
      },
      deep: true,
    },
    // value: {
    //   handler(val) {
    //     this.searchForm = val;
    //   },
    // },
    selectedRowKeys: {
      handler(val) {
        this.hasSelected = val;
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    // 初始化数据
    this.dataInit(this.data);
    // this.formDataInit();
    // this.pageDataInit();
    // this.onLoad();
    // console.log('created')
  },
  mounted() {
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
        return this.permission(key, row, index);
      } else if (!this.validatenull(this.permission[key])) {
        return this.permission[key];
      } else {
        return true;
      }
    },
    handleGetRowKeys (row) {
      const rowKey = row[this.rowKey];
      return rowKey;
    },
    // 表格行样式
    tableRowClassName({ row }) {
      let rowKey = this.handleGetRowKeys(row);
      let selected = this.tableSelect.find((r) => this.handleGetRowKeys(r) === rowKey);
      if (this.tableOption.rowSelection) {
        selected = this.hasSelected.includes(rowKey);
      }
      let className = [{"selected": selected}];
      if (typeof this.tableOption.rowClassName === "function") {
        className.concat(this.tableOption.rowClassName(row));
      }
      return className;
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
        let rowKey = this.handleGetRowKeys(row);
        let selected = !this.hasSelected.includes(rowKey);
        if (selected) {
          this.hasSelected.push(rowKey);
        } else {
          let index = this.hasSelected.findIndex((item) => item === rowKey);
          this.hasSelected.splice(index, 1);
        }
        // this.$emit("update:selectedRowKeys", this.hasSelected);
        this.$emit("onSelectChange", this.hasSelected);
      }
    },
    dataInit() {
      this.tableData = this.data;
      //初始化序列的参数
      this.tableData.forEach((ele, index) => {
        if (ele.$cellEdit && !this.formCascaderList[index]) {
          this.formCascaderList[index] = deepClone(ele);
        }
        ele.$index = index;
      });
    },
    // 搜索表单数据初始化
    // formDataInit() {
    //   let searchForm = {};
    //   if (!this.tableOption.columns) return;
    //   this.tableOption.columns.forEach((column) => {
    //     if (column.value !== undefined && column.value !== "") {
    //       searchForm[column.prop] = column.value;
    //     }
    //   });
    //   this.searchForm = Object.assign(searchForm, this.value);
    //   return Object.assign(searchForm, this.value);
    // },
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
      // this.updateValue();
      this.onLoad();
      // 请求数据清空已选择行
      this.clearSelection();
    },
    // 对部分表单字段进行校验
    validateCellForm() {
      return new Promise((resolve) => {
        this.$refs.cellForm.validate((valid, msg) => {
          resolve(msg);
        });
      });
    },
    validateCellField (index) {
      let result = true
      for (const item of this.$refs.cellForm.fields) {
        if (item.prop.split('.')[1] == index) {
          this.$refs.cellForm.validateField(item.prop, (error) => {
            if (error) {
              result = false
            }
          })
        }
        if (!result) break
      }
      return result
    },
    // 表格操作回调
    emitEventHandler(event) {
      this.$emit(event, ...Array.from(arguments).slice(1));
    },
    selectClear() {
      this.$refs.table.clearSelection();
      this.hasSelected = [];
      this.$emit("update:selectedRowKeys", []);
    },
    //设置单选
    currentRowChange(currentRow, oldCurrentRow) {
      this.$emit("current-row-change", currentRow, oldCurrentRow);
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
      this.$emit("onSelectionChange", this.tableSelect);
    },
    // 排序回调
    sortChange(val) {
      this.$emit("sort-change", val);
    },
    //行编辑点击
    rowCell(row, index) {
      if (row.$cellEdit) {
        this.rowCellUpdate(row, index);
      } else {
        this.rowCellEdit(row, index);
      }
    },
    //单元格新增
    rowCellAdd (row = {}) {
      let len = this.tableData.length
      // let id = `add-${len}`
      let formDefault = formInitVal(this.propOption).tableForm;
      row = deepClone(
        Object.assign(
          {
            $cellEdit: true,
            $index: len,
            // [this.rowKey]: id
            // id
          },
          formDefault,
          // row
        ))
      this.tableData.push(row);
      // this.formIndexList.push(len);
      // this.editableKeys.push(id);
      // setTimeout(() => this.$refs.columnDefault.setSort())
    },
    //行取消
    rowCancel (row, index) {
      if (validatenull(row[this.rowKey])) {
        this.tableData.splice(index, 1);
        return;
      }
      this.formCascaderList[index].$cellEdit = false;
      //设置行数据
      this.$set(this.tableData, index, this.formCascaderList[index]);
      delete this.formCascaderList[index]
      // const rowKey = row[this.rowKey];
      // if (rowKey.indexOf('add') !== -1) {
      //   this.tableData.splice(index);
      //   return;
      // }
      // this.editableKeys = this.editableKeys.filter(item => item !== rowKey);
    },
    // 单元格编辑
    rowCellEdit (row, index) {
      row.$cellEdit = true;
      this.$set(this.tableData, index, row);
      //缓冲行数据
      this.formCascaderList[index] = deepClone(row);
      // const rowKey = this.handleGetRowKeys(row);
      // this.editableKeys.push(rowKey);
    },
    rowCellUpdate (row, index) {
      var result = this.validateCellField(index)
      const done = (form = {}) => {
        console.log(form)
        this.btnDisabledList[index] = false;
        this.btnDisabled = false;
        row.$cellEdit = false;

        form = deepClone(Object.assign(form, row))
        this.$set(this.tableData, index, form);

        // this.$set(this.tableData, index, row);
        // const rowKey = row[this.rowKey];
        // this.editableKeys = this.editableKeys.filter(item => item !== rowKey);
      }
      const loading = () => {
        this.btnDisabledList[index] = false;
        this.btnDisabled = false;
      }
      if (result) {
        this.btnDisabledList[index] = true;
        this.btnDisabled = true;

        const form = deepClone(row);
        delete form.$cellEdit
        delete form.$index
        if (validatenull(row[this.rowKey])) {
          this.$emit("row-save", form, done, loading);
        } else {
          this.$emit("row-update", form, index, done, loading);
        }
      }
    },
    rowAdd() {
      this.$refs.dialogForm.show("add");
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
    // 删除
    rowDel(row, index) {
      this.$emit("onRowDel", row, index);
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
    onLoad() {
      this.$emit("onLoad", {
        pageData: this.pageData,
        searchForm: this.searchForm,
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
    tableDrop (el, callback) {
      if (this.isSortable) {
        if (!window.Sortable) {
          console.log("Sortable")
          return
        }
        window.Sortable.create(el, {
          ghostClass: 'avue-crud__ghost',
          chosenClass: 'avue-crud__ghost',
          animation: 500,
          delay: 0,
          onEnd: evt => callback(evt)
        })
      }
    }
  },
});
</script>

<style lang="scss">
@import "./_index.scss";
</style>
