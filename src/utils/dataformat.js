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
    console.log(ele.type)
    if (["checkbox"].includes(ele.type)) {
      formData[ele.prop] = []
    } else if (
      ["rate", "slider", "number"].includes(ele.type) ||
      ele.dataType === "number"
    ) {
      formData[ele.prop] = undefined
    } else {
      formData[ele.prop] = ""
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
