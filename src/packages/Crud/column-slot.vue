<template>
  <el-table-column
    v-if="getColumnProp(column,'hide')"
    :key="column.prop"
    :prop="column.prop"
    :label="column.label"
    filter-placement="bottom-end"
    :filters="getColumnProp(column,'filters')"
    :filter-method="getColumnProp(column,'filterMethod')?handleFiltersMethod:undefined"
    :sortable="getColumnProp(column,'sortable')"
    :align="column.align || crud.tableOption.align"
    :header-align="column.headerAlign || crud.tableOption.headerAlign"
    :width="getColumnProp(column,'width')"
    :fixed="getColumnProp(column,'fixed')"
  >
    <!-- 自定义表头 -->
    <template slot="header" slot-scope="{$index}">
      <slot
        v-if="getSlotName(column,'H',crud.$scopedSlots)"
        :name="getSlotName(column,'H')"
        v-bind="{column,$index}"
      ></slot>
      <slot
        v-if="getSlotName(column,'HF',crud.$scopedSlots)"
        :name="getSlotName(column,'HF')"
        v-bind="{column,$index}"
      ></slot>
      <el-popover
        v-else
        placement="bottom"
        :disabled="(crud.objectOption[column.prop] || {}).screen!==true"
        trigger="hover"
      >
        <el-input
          v-model="(crud.objectOption[column.prop] || {}).screenValue"
          type="text"
          :placeholder="`请输入 ${column.label} 筛选关键字`"
          size="mini"
        ></el-input>
        <span slot="reference">{{column.label}}</span>
      </el-popover>
    </template>
    <!-- 自定义列模板 -->
    <template slot-scope="scope">
      <!-- <span v-if="column.filter">{{ Vue.filter(column["filter"])(scope.row[column.prop]) }}</span> -->
      <span v-if="column.slotName">
        <slot
          :name="column.slotName"
          :row="scope.row"
          :$index="scope.$index"
          :prop="`list.${scope.$index}.${column.prop}`"
          :rules="column.rules"
          :placeholder="crud.getPlaceholder(column)"
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
        v-else-if="crud.getItemShow(column.edit) || crud.editableKeys.includes(crud.handleGetRowKeys(scope.row))"
        :prop="`list.${scope.$index}.${column.prop}`"
        :rules="crud.getRules(column.rules, scope.row)"
      >
        <el-tooltip
          :content="(crud.listError[`list.${scope.$index}.${column.prop}`] || {}).msg"
          :disabled="!(crud.listError[`list.${scope.$index}.${column.prop}`] || {}).valid"
          placement="top"
        >
          <!-- 动态组件 -->
          <component
            :is="getComponent(column.type)"
            v-model="scope.row[column.prop]"
            v-bind="column"
            :width="undefined"
            :size="crud.size || 'small'"
            :placeholder="crud.getPlaceholder(column)"
            :class="crud.getClassName(column.class, scope.row)"
            :disabled="crud.getItemShow(column.disabled, scope.row)"
            :options="crud.getOptions(column,scope.row)"
            @focus="(value, option) => crud.$emit('focus', scope.row, scope.$index, column.prop, value, option)"
            @change="(value, option) => crud.$emit('change', value, option, column, scope)"
          ></component>
        </el-tooltip>
      </el-form-item>
      <span v-else-if="column.render" :class="column.class">{{ column.render(scope.row) }}</span>
      <span v-else :class="column.class">{{ scope.row[column.propName || column.prop] }}</span>
    </template>
  </el-table-column>
</template>

<script>
import { validatenull } from "../../utils/validate";

export default {
  inject: ["crud"],
  props: {
    column: Object,
    columnOption: Array,
  },
  methods: {
    getSlotName(item = {}, type = "D", slot) {
      let result = {
        HF: "HeaderForm",
        F: "Form",
        H: "Header",
        E: "Error",
        L: "Label",
        S: "Search",
        T: "Type",
        D: "",
      };
      let name = item.prop + result[type];
      if (slot) return slot[name];
      return name;
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
    //表格筛选字典
    handleFilters(column, flag) {
      if (flag !== true) return undefined;
      let DIC = this.crud.dic[column.prop] || [];
      let list = [];
      if (!validatenull(DIC)) {
        DIC.forEach((ele) => {
          const props = column.props || this.crud.tableOption.props || {};
          list.push({
            text: ele[props.label || "label"],
            value: ele[props.value || "value"],
          });
        });
      } else {
        this.crud.cellForm.list.forEach((ele) => {
          if (
            !list
              .map((item) => item.text)
              .includes(ele[column.propName || column.prop])
          ) {
            list.push({
              text: ele[column.propName || column.prop],
              value: ele[column.prop],
            });
          }
        });
      }
      return list;
    },
    //表格筛选逻辑
    handleFiltersMethod(value, row, column) {
      const columnNew = this.columnOption.filter(
        (ele) => ele.prop === column.property
      )[0];
      if (typeof columnNew.filtersMethod === "function") {
        return columnNew.filtersMethod(value, row, columnNew);
      } else {
        return row[columnNew.prop] === value;
      }
    },
    getColumnProp(column, type) {
      let obj = this.crud.objectOption[column.prop] || {};
      if (type === "filterMethod") return obj?.filters;
      if (this.crud.isMobile && ["fixed"].includes(type)) return false;
      let result = obj?.[type];
      if (type == "width" && result == 0) return undefined;
      if (type == "filters") return this.handleFilters(column, result);
      if (type == "hide") return column.hide !== true;
      else return result;
    },
  },
};
</script>
