import { validatenull } from "./validate";

export function setAsVal(obj, bind = "", value = "") {
  eval("obj." + bind + "=`" + value + "`");
  return obj;
}

/**
 * 字符串数据类型转化
 */
export const detailDataType = (value, type) => {
  if (validatenull(value)) return value;
  if (type === "number") {
    return Number(value);
  } else if (type === "string") {
    return value + "";
  } else {
    return value;
  }
};

/**
 * 根据值查找对应的序号
 */
export const findArray = (dic, value, valueKey = "value") => {
  for (let i = 0; i < dic.length; i++) {
    if (dic[i][valueKey] === value) {
      return dic[i];
    }
  }
  return -1;
};

export function findObject(list, value, key = "prop") {
  let result = -1;
  let type = (() => {
    let result;
    list.forEach((ele) => {
      if (ele.column) {
        result = "group";
      }
    });
    return result;
  })();
  if (type === "group") {
    list.forEach((ele) => {
      const val = findArray(ele.column, value, key);
      if (val !== -1) result = val;
    });
  } else {
    result = findArray(list, value, key);
  }
  return result;
}

export const getObjType = (obj) => {
  var toString = Object.prototype.toString;
  var map = {
    "[object Boolean]": "boolean",
    "[object Number]": "number",
    "[object String]": "string",
    "[object Function]": "function",
    "[object Array]": "array",
    "[object Date]": "date",
    "[object RegExp]": "regExp",
    "[object Undefined]": "undefined",
    "[object Null]": "null",
    "[object Object]": "object",
  };
  if (obj instanceof Element) {
    return "element";
  }
  return map[toString.call(obj)];
};
/**
 * 对象深拷贝
 */
export const deepClone = (data) => {
  var type = getObjType(data);
  var obj;
  if (type === "array") obj = [];
  else if (type === "object") obj = {};
  else return data;
  if (type === "array") {
    for (var i = 0, len = data.length; i < len; i++) {
      data[i] = (() => {
        if (data[i] === 0) {
          return data[i];
        }
        return data[i];
      })();
      if (data[i]) {
        delete data[i].$parent;
      }
      obj.push(deepClone(data[i]));
    }
  } else if (type === "object") {
    for (var key in data) {
      if (data) {
        delete data.$parent;
      }
      obj[key] = deepClone(data[key]);
    }
  }
  return obj;
};
export const arraySort = (list = [], prop, callback) => {
  return list.filter(ele => !validatenull(ele[prop])).sort((a, b) => callback(a, b)).concat(list.filter(ele => validatenull(ele[prop])));
}
export const clearVal = (obj, list = []) => {
  if (!obj) return {};
  Object.keys(obj).forEach((ele) => {
    if (list.includes(ele)) return;
    else if (!validatenull(obj[ele])) {
      let type = getObjType(obj[ele]);
      if (type === "array") obj[ele] = [];
      else if (type === "object") obj[ele] = {};
      else if (["number", "boolean"].includes(type)) obj[ele] = undefined;
      else obj[ele] = "";
    }
  });
  return obj;
};

/**
 * 验证是否存在true/false
 */
export const vaildData = (val, dafult) => {
  if (typeof val === "boolean") {
    return val;
  }
  return !validatenull(val) ? val : dafult;
};

// 节流
export function throttle(fn, delay) {
  let timer = null;
  return function () {
    if (!timer) {
      fn();
      timer = setTimeout(() => {
        timer = null;
        clearTimeout(timer);
      }, delay);
    }
  };
}
