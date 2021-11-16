import { validatenull } from "./validate"
import { findObject } from "./util"
import moment from "moment"

/**
 * 计算级联属性
 */
export const calcCascader = (list = []) => {
  list.forEach((ele, index) => {
    if (!validatenull(ele.cascaderItem)) {
      let cascader = [...ele.cascaderItem]
      let parentProp = ele.prop
      list[index].cascader = [...cascader]
      cascader.forEach((citem, cindex) => {
        let items = findObject(list, citem)
        if (items === -1) return
        items.parentProp = parentProp
        items.cascader = [...cascader].splice(cindex + 1)
        parentProp = items.prop
      })
    }
  })
  return list
}

/**
 * 表单初始化值
 */

export const formInitVal = (list = []) => {
  let formData = {}
  list.forEach((ele) => {
    // if (
    //   ARRAY_VALUE_LIST.includes(ele.type) ||
    //   (MULTIPLE_LIST.includes(ele.type) && ele.multiple) ||
    //   ele.range ||
    //   ele.dataType === "array"
    // ) {
    //   tableForm[ele.prop] = [];
    // } else
    if (["checkbox"].includes(ele.type)) {
      formData[ele.prop] = []
    } else if (
      ['rate', 'slider', 'number'].includes(ele.type) ||
      ele.dataType === 'number'
    ) {
      formData[ele.prop] = undefined;
    } else {
      formData[ele.prop] = ''
    }
    // if (ele.bind) {
    //   tableForm = createObj(tableForm, ele.bind);
    // }
    // 表单默认值设置
    if (!validatenull(ele.value)) {
      formData[ele.prop] = ele.value
    }
  })
  return formData
}

/**
 * 根据月份获取月头和月尾
 */
export const getStartAndEndByMonth = (key) => (date) => {
  if (!date) return {}
  let upperKey = key.charAt(0).toUpperCase() + key.substr(1)
  let startDate = `${moment(date).startOf("month").format("YYYY-MM-DD")}`
  let endDate = `${moment(date).endOf("month").format("YYYY-MM-DD")}`
  return {
    [`start${upperKey}`]: startDate,
    [`end${upperKey}`]: endDate,
  }
}

/**
 * 动态获取组件
 */
export const getComponent = (type, component) => {
  let result = type || 'input';
  const DATE_LIST = ["date", "month"];
  const KEY_COMPONENT_NAME = 'ygp-';
  if (!validatenull(component)) {
    return component
  } else if ([undefined, "", "number", "textarea"].includes(type)) {
    result = "input";
  } else if (DATE_LIST.includes(type)) {
    result = "date-picker";
  }
  return KEY_COMPONENT_NAME + result;
}

export const getPlaceholder = (column) => {
  const SELECT_LIST = ["select", "input-date", "date"]
  if (SELECT_LIST.includes(column.type)) {
    return `请选择${column.label || ""}`
  } else {
    return `请输入${column.label || ""}`
  }
}

export const getLabel = (column) => {
  const label = column.label;
  if (label && label.length) {
    return label.replace("：", "").replace(":", "") + "：";
  }
  return label;
}
