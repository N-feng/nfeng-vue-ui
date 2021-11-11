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
    list.forEach(ele => {
      if (ele.column) {
        result = "group";
      }
    });
    return result;
  })();
  if (type === "group") {
    list.forEach(ele => {
      const val = findArray(ele.column, value, key);
      if (val !== -1) result = val;
    });
  } else {
    result = findArray(list, value, key);
  }
  return result;
}

export const getObjType = obj => {
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
    "[object Object]": "object"
  };
  if (obj instanceof Element) {
    return "element";
  }
  return map[toString.call(obj)];
};
/**
 * 对象深拷贝
 */
export const deepClone = data => {
  var type = getObjType(data);
  var obj;
  if (type === "array") {
    obj = [];
  } else if (type === "object") {
    obj = {};
  } else {
    // 不再具有下一层次
    return data;
  }
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

// 获取指定时间前后 n 天的日期，n 为正负整数
export function getDay(n, date = new Date()) {
  var timestamp = (new Date(date)).getTime();
  var newDate = new Date(parseInt(timestamp + n * 86400000))
  var y = newDate.getFullYear()
  var m = newDate.getMonth() + 1
  m = m < 10 ? ('0' + m) : m
  var d = newDate.getDate()
  d = d < 10 ? ('0' + d) : d
  const time = y + '-' + m + '-' + d
  return time
}

export function getSeconds(n) {
  var timestamp = (new Date()).getTime();
  var date = new Date(parseInt(timestamp + n * 86400000))
  var y = date.getFullYear()
  var m = date.getMonth() + 1
  m = m < 10 ? ('0' + m) : m
  var d = date.getDate()
  d = d < 10 ? ('0' + d) : d
  var h = date.getHours()
  var M = date.getMinutes()
  var s = date.getSeconds()
  const time = y + '-' + m + '-' + d + "-" + h + ":" + M + ":" + s
  console.log("时间", time)
  return time
}

//格式化金额数字，formatMoney(10000,2) => 10000.00 -> 10,000.00
export function formatMoney(s1, n) {
  if(!s1) return '0.00';
  var flag = ""
  if (s1 < 0) {
    flag = "-"
  }
  var s2 = Math.abs(s1)
  n = n > 0 && n <= 20 ? n : 2;
  s2 = parseFloat((s2 + "").replace(/[^\d\\.-]/g, "")).toFixed(n) + "";
  var l = s2.split(".")[0].split("").reverse(), r = s2.split(".")[1];
  var t = "";
  for (var i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? "," : "");
  }
  return flag + t.split("").reverse().join("") + "." + r;
}
// 判断数组是否有相同元素 isRepeat([1,2,3,3])=> true isRepeat([1,2,3,4])=> false
export function isRepeat(ary) {
  var nary = ary.sort();
  for (var i = 0; i < nary.length - 1; i++) {
    if (nary[i] != nary[i + 1]) {
      return true
    }
  }
}

// 节流
export function throttle(fn, delay){
  let timer = null
    return function() {
       if(!timer){
        fn()
        timer = setTimeout(() => {
           timer = null
           clearTimeout(timer)
        }, delay)
       }
    }
}

// 数字保留两位小数
export function keepTwoDecimal(num) {
  let result = parseFloat(num)
  if (isNaN(result)) {
    new Error("传递参数错误，请检查！")
    return false
  }
  result = Math.round(num * 100) / 100
  return result
}