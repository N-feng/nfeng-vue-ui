import { validatenull } from "../utils/validate";
import {
  KEY_COMPONENT_NAME,
  DIC_SPLIT,
  ARRAY_LIST,
  DATE_LIST,
  ARRAY_VALUE_LIST,
  MULTIPLE_LIST,
} from "../../packages/global/variable";
import { detailDataType, findObject } from "../utils/util";

/**
 * 计算级联属性
 */
export const calcCascader = (list = []) => {
  list.forEach((ele, index) => {
    if (!validatenull(ele.cascaderItem)) {
      let cascader = [...ele.cascaderItem];
      let parentProp = ele.prop;
      list[index].cascader = [...cascader];
      cascader.forEach((citem, cindex) => {
        let items = findObject(list, citem);
        if (items === -1) return;
        items.parentProp = parentProp;
        items.cascader = [...cascader].splice(cindex + 1);
        parentProp = items.prop;
      });
    }
  });
  return list;
};
/**
 * 计算空白列row
 */
let count = 0;
export const calcCount = (ele, spanDefault = 12, init = false) => {
  if (init) count = 0;
  const spanAll = 24;
  count = count + (ele.span || spanDefault) + (ele.offset || 0);
  if (count === spanAll) {
    count = 0;
  } else if (count > spanAll) {
    count = 0 + (ele.span || spanDefault) + (ele.offset || 0);
  } else if (ele.row && count !== spanAll) {
    ele.count = spanAll - count;
    count = 0;
  }
  return ele;
};

/**
 * 初始化数据格式
 */
export const initVal = (value, column) => {
  let {
    type,
    multiple,
    dataType,
    separator = DIC_SPLIT,
    alone,
    emitPath,
  } = column;

  let list = value;
  if (
    (MULTIPLE_LIST.includes(type) && multiple) ||
    (ARRAY_VALUE_LIST.includes(type) && emitPath !== false)
  ) {
    if (!Array.isArray(list)) {
      if (validatenull(list)) {
        list = [];
      } else {
        list = (list + "").split(separator) || [];
      }
    }
    // 数据转化
    list.forEach((ele, index) => {
      list[index] = detailDataType(ele, dataType);
    });
    if (ARRAY_LIST.includes(type) && validatenull(list) && alone) list = [''];
  } else {
    list = detailDataType(list, dataType);
  }
  return list;
};

/**
 * 表单初始化值
 */

export const formInitVal = (list = []) => {
  let tableForm = {};
  list.forEach((ele) => {
    if (
      ARRAY_VALUE_LIST.includes(ele.type) ||
      (MULTIPLE_LIST.includes(ele.type) && ele.multiple) ||
      ele.range || ele.dataType === "array"
    ) {
      tableForm[ele.prop] = [];
    } else if (
      ["rate", "slider", "number"].includes(ele.type) ||
      ele.dataType === "number"
    ) {
      tableForm[ele.prop] = undefined;
    } else {
      tableForm[ele.prop] = "";
    }
    // if (ele.bind) {
    //   tableForm = createObj(tableForm, ele.bind);
    // }
    // 表单默认值设置
    if (!validatenull(ele.value)) {
      tableForm[ele.prop] = ele.value;
    }
  });
  return {
    tableForm,
  };
};

/**
 * 搜索框获取动态组件
 */
export const getSearchType = (column) => {
  const type = column.type;
  const range = column.searchRange;
  let result = type;
  if (['radio', 'checkbox', 'switch'].includes(type)) {
    result = 'select';
  } else if (DATE_LIST.includes(type)) {
    let rangeKey = 'range';
    if (range) {
      if (!type.includes(rangeKey)) {
        result = type + rangeKey;
      } else {
        result = type;
      }
    } else result = type.replace(rangeKey, '');
  } else if (['textarea'].includes(type)) {
    result = 'input';
  }
  return result;
};

/**
 * 动态获取组件
 */
export const getComponent = (type, component) => {
  let result = type || 'input';
  if (!validatenull(component)) {
    return component;
  } else if (DATE_LIST.includes(type)) {
    result = 'date';
  } else if (['password', 'textarea', 'number'].includes(type)) {
    result = 'input';
  }
  return KEY_COMPONENT_NAME + result;
};

export const getPlaceholder = (column) => {
  const SELECT_LIST = ["select", "input-date", "date"];
  if (SELECT_LIST.includes(column.type)) {
    return `请选择${column.label || ""}`;
  } else {
    return `请输入${column.label || ""}`;
  }
};

export const getLabel = (column) => {
  const label = column.label;
  if (label && label.length) {
    return label.replace("：", "").replace(":", "") + "：";
  }
  return label;
};
